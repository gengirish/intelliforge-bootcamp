"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DISCLAIMER, DOMAINS, EXAM } from "@/lib/ccarf/blueprint";
import { createSession, formatDuration, pickExamSet } from "@/lib/ccarf/scoring";
import { LETTERS, type DomainId, type Letter, type Question, type QuizSession } from "@/lib/ccarf/types";
import { QuizNavigator } from "./quiz-navigator";
import { QuizQuestion } from "./quiz-question";
import { QuizResults } from "./quiz-results";

const STORAGE_KEY = "ccarf_mock_session_v1";
const LOW_TIME_MS = 5 * 60 * 1000;

function loadSaved(byId: Readonly<Record<string, Question>>): QuizSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as QuizSession;
    if (!saved?.items?.length || saved.submitted) return null;
    if (saved.endsAt != null && saved.endsAt < Date.now()) return null;
    // A bank edit can orphan a saved attempt. Discard rather than resume a broken one.
    if (!saved.items.every((item) => byId[item.id])) return null;
    return saved;
  } catch {
    return null;
  }
}

function clearSaved() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private-mode browsers throw on write. Losing resume is acceptable; crashing is not.
  }
}

export function QuizApp() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [resumable, setResumable] = useState<QuizSession | null>(null);
  /** Time left on the saved attempt, sampled when it was loaded — render stays pure. */
  const [resumableLeft, setResumableLeft] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const byId: Readonly<Record<string, Question>> = questions
    ? Object.fromEntries(questions.map((q) => [q.id, q]))
    : {};

  useEffect(() => {
    let cancelled = false;

    fetch("/claude/quiz/questions.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Question[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setQuestions(data);
        const saved = loadSaved(Object.fromEntries(data.map((q) => [q.id, q])));
        setResumable(saved);
        setResumableLeft(saved?.endsAt != null ? saved.endsAt - Date.now() : null);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const submit = useCallback(() => {
    setSession((prev) => (prev ? { ...prev, submitted: true } : prev));
    clearSaved();
  }, []);

  // Persist unfinished exam attempts so a reload or a closed tab does not lose them.
  useEffect(() => {
    if (!session || session.mode !== "exam" || session.submitted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // See clearSaved.
    }
  }, [session]);

  // Countdown for timed attempts, with auto-submit at zero. `remaining` is seeded
  // when the attempt starts and thereafter only written from the interval callback.
  useEffect(() => {
    if (!session || session.mode !== "exam" || session.submitted || session.endsAt == null) return;

    const endsAt = session.endsAt;
    const id = window.setInterval(() => {
      const left = endsAt - Date.now();
      setRemaining(left);
      if (left <= 0) submit();
    }, 1000);

    return () => window.clearInterval(id);
  }, [session, submit]);

  const startExam = () => {
    if (!questions) return;
    const count = Math.min(EXAM.examQuestions, questions.length);
    setResumable(null);
    setResumableLeft(null);
    setRemaining(EXAM.examMinutes * 60_000);
    setSession(createSession("exam", "Mock Exam", pickExamSet(questions, count)));
  };

  const startPractice = (domain: DomainId | "all") => {
    if (!questions) return;
    const pool = domain === "all" ? questions : questions.filter((q) => q.domain === domain);
    const label =
      domain === "all"
        ? "Practice · All domains"
        : `Practice · ${DOMAINS.find((d) => d.id === domain)?.title}`;
    setResumable(null);
    setResumableLeft(null);
    setRemaining(null);
    setSession(createSession("practice", label, pool));
  };

  const backToMenu = () => {
    clearSaved();
    setSession(null);
    setResumable(null);
    setResumableLeft(null);
    setRemaining(null);
  };

  const item = session?.items[session.idx];
  const question = item ? byId[item.id] : undefined;
  const chosen = item ? session?.answers[item.id] : undefined;
  const revealed = Boolean(session?.mode === "practice" && chosen != null);

  const choose = useCallback(
    (original: Letter) => {
      setSession((prev) => {
        if (!prev) return prev;
        const current = prev.items[prev.idx];
        if (prev.mode === "practice" && prev.answers[current.id] != null) return prev;
        return { ...prev, answers: { ...prev.answers, [current.id]: original } };
      });
    },
    []
  );

  const jump = useCallback((index: number) => {
    setSession((prev) =>
      prev ? { ...prev, idx: Math.max(0, Math.min(prev.items.length - 1, index)) } : prev
    );
  }, []);

  const toggleFlag = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const id = prev.items[prev.idx].id;
      return { ...prev, flags: { ...prev.flags, [id]: !prev.flags[id] } };
    });
  }, []);

  const advance = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      if (prev.idx < prev.items.length - 1) return { ...prev, idx: prev.idx + 1 };
      return prev;
    });
    if (session && session.idx === session.items.length - 1) {
      const unanswered = session.items.filter((i) => session.answers[i.id] == null).length;
      const message = unanswered
        ? `You have ${unanswered} unanswered question(s). Submit anyway?`
        : "Submit for scoring?";
      if (session.mode === "practice" || window.confirm(message)) submit();
    }
  }, [session, submit]);

  // Keyboard shortcuts. The page has no text inputs, so no focus guard is needed.
  useEffect(() => {
    if (!session || session.submitted || !item) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toUpperCase();

      const byLetter = LETTERS.indexOf(key as Letter);
      const byNumber = "1234".indexOf(key);
      const optionIndex = byLetter >= 0 ? byLetter : byNumber;
      if (optionIndex >= 0 && !revealed) {
        event.preventDefault();
        choose(item.order[optionIndex]);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        jump(session.idx + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        jump(session.idx - 1);
      } else if (key === "F" && session.mode === "exam") {
        event.preventDefault();
        toggleFlag();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session, item, revealed, choose, jump, toggleFlag]);

  if (loadFailed) {
    return (
      <p className="rounded-xl border border-border bg-surface p-6 text-sm text-muted">
        The question bank could not be loaded. Please refresh to try again.
      </p>
    );
  }

  if (!questions) {
    return <p className="text-sm text-muted">Loading questions…</p>;
  }

  if (session?.submitted) {
    return <QuizResults session={session} byId={byId} onRestart={backToMenu} />;
  }

  if (resumable) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">Resume your mock exam?</h2>
        <p className="mt-2 text-sm text-muted">
          You have an attempt in progress
          {resumableLeft != null && ` with ${formatDuration(resumableLeft)} left`}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setSession(resumable);
              setRemaining(resumableLeft);
              setResumable(null);
              setResumableLeft(null);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={backToMenu}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  if (!session || !item || !question) {
    return <QuizMenu total={questions.length} onExam={startExam} onPractice={startPractice} />;
  }

  const isLast = session.idx === session.items.length - 1;
  const answeredCount = session.items.filter((i) => session.answers[i.id] != null).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted">
          Question {session.idx + 1} of {session.items.length}
          {session.mode === "exam" && ` · ${answeredCount} answered`}
        </span>
        {session.mode === "exam" && remaining != null ? (
          <span
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-sm",
              remaining < LOW_TIME_MS
                ? "border-cta text-cta"
                : "border-border text-foreground"
            )}
            aria-live="off"
          >
            {formatDuration(remaining)}
          </span>
        ) : (
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            {session.label}
          </span>
        )}
      </div>

      <div className="mt-4">
        <QuizQuestion
          item={item}
          question={question}
          chosen={chosen}
          revealed={revealed}
          onChoose={choose}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => jump(session.idx - 1)}
          disabled={session.idx === 0}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-foreground disabled:opacity-40"
        >
          ← Prev
        </button>

        {session.mode === "exam" && (
          <button
            type="button"
            onClick={toggleFlag}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm transition-colors",
              session.flags[item.id] ? "border-cta text-cta" : "border-border text-muted hover:text-foreground"
            )}
          >
            {session.flags[item.id] ? "★ Flagged" : "☆ Flag"}
          </button>
        )}

        <span className="flex-1" />

        <button
          type="button"
          onClick={backToMenu}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          Exit
        </button>
        <button
          type="button"
          onClick={advance}
          disabled={session.mode === "practice" && !revealed}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-40"
        >
          {isLast ? (session.mode === "exam" ? "Review & submit" : "Finish") : "Next →"}
        </button>
      </div>

      {session.mode === "exam" && <QuizNavigator session={session} onJump={jump} />}

      <p className="mt-8 text-xs leading-relaxed text-muted">{DISCLAIMER}</p>
    </div>
  );
}

function QuizMenu({
  total,
  onExam,
  onPractice,
}: {
  total: number;
  onExam: () => void;
  onPractice: (domain: DomainId | "all") => void;
}) {
  const examCount = Math.min(EXAM.examQuestions, total);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/40 bg-surface p-6">
        <h2 className="text-xl font-semibold text-foreground">Timed mock exam</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {examCount} questions in {EXAM.examMinutes} minutes, weighted across the five domains
          like the real blueprint. Questions and options are shuffled, you can flag items for
          review, and your attempt survives a reload. Scored against a ~{EXAM.passPercent}%
          analogue of the {EXAM.scaledPassMark}/1000 cut score.
        </p>
        <button
          type="button"
          onClick={onExam}
          className="mt-5 rounded-lg bg-cta px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-cta-hover"
        >
          Start the mock exam →
        </button>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold text-foreground">Untimed practice</h2>
        <p className="mt-2 text-sm text-muted">
          Every answer is explained immediately, including why each wrong option is wrong.
          Pick a domain to drill, or take the whole bank.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onPractice("all")}
            className="rounded-lg border border-primary/50 bg-primary/10 px-3.5 py-2 text-sm text-foreground transition-colors hover:bg-primary/20"
          >
            All domains
          </button>
          {DOMAINS.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => onPractice(domain.id)}
              className="rounded-lg border border-border px-3.5 py-2 text-sm text-muted transition-colors hover:border-primary-light/60 hover:text-foreground"
            >
              D{domain.id} · {domain.title}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted">{DISCLAIMER}</p>
    </div>
  );
}
