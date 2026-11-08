"use client";

import { Mic, Square, Trash2, Upload, Video } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AUDIO_TYPES,
  TESTIMONIAL_LIMITS,
  VIDEO_TYPES,
  mediaKindFor,
  type MediaKind,
} from "@/lib/testimonials";
import { cn } from "@/lib/utils";

/** What the form will submit: a new recording/file, the saved one, or nothing. */
export type MediaValue =
  | { type: "none" }
  | { type: "existing"; url: string; kind: MediaKind }
  | { type: "new"; blob: Blob; contentType: string; kind: MediaKind };

const RECORDER_TYPES: Record<"AUDIO" | "VIDEO", string[]> = {
  AUDIO: ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"],
  VIDEO: ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"],
};

function pickMimeType(kind: "AUDIO" | "VIDEO"): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return RECORDER_TYPES[kind].find((t) => MediaRecorder.isTypeSupported(t));
}

const baseType = (t: string) => t.split(";")[0].trim().toLowerCase();

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function Player({ src, kind }: { src: string; kind: MediaKind }) {
  return kind === "VIDEO" ? (
    <video src={src} controls playsInline className="w-full rounded-lg bg-black" aria-label="Your video" />
  ) : (
    <audio src={src} controls className="w-full" aria-label="Your audio" />
  );
}

const button =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary-light/50 hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light disabled:opacity-50";

export function MediaField({
  value,
  onChange,
  enabled,
}: {
  value: MediaValue;
  onChange: (v: MediaValue) => void;
  enabled: boolean;
}) {
  const [recording, setRecording] = useState<"AUDIO" | "VIDEO" | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const liveRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function stopStream() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  // One object URL per new recording or file, revoked when it is replaced.
  const previewUrl = useMemo(
    () => (value.type === "new" ? URL.createObjectURL(value.blob) : null),
    [value]
  );
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => () => stopStream(), []);

  // The camera preview only mounts once `recording` is set, so attach the stream after render.
  useEffect(() => {
    const el = liveRef.current;
    if (recording !== "VIDEO" || !el || !streamRef.current) return;
    el.srcObject = streamRef.current;
    void el.play().catch(() => {});
  }, [recording]);

  async function startRecording(kind: "AUDIO" | "VIDEO") {
    setError(null);
    const mimeType = pickMimeType(kind);
    if (!navigator.mediaDevices?.getUserMedia || mimeType === undefined) {
      setError("This browser can't record here. Upload a file instead.");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: kind === "VIDEO" ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      });
    } catch {
      setError(
        kind === "VIDEO"
          ? "We couldn't use your camera. Check the browser's permission and try again."
          : "We couldn't use your microphone. Check the browser's permission and try again."
      );
      return;
    }

    streamRef.current = stream;
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, { mimeType });
    recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
    recorder.onstop = () => {
      stopStream();
      setRecording(null);
      const type = baseType(recorder.mimeType || mimeType);
      const blob = new Blob(chunks, { type });
      if (blob.size > 0) onChange({ type: "new", blob, contentType: type, kind });
    };
    recorderRef.current = recorder;
    recorder.start(1000);
    setRecording(kind);
    setSeconds(0);

    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setSeconds(elapsed);
      if (elapsed >= TESTIMONIAL_LIMITS.mediaSeconds) recorder.stop();
    }, 250);
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  function onFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    const kind = mediaKindFor(file.type);
    if (!kind || kind === "NONE") {
      setError("Upload an audio or video file (MP4, WebM, MOV, MP3, M4A, WAV).");
      return;
    }
    const limit = kind === "AUDIO" ? TESTIMONIAL_LIMITS.audioBytes : TESTIMONIAL_LIMITS.videoBytes;
    if (file.size > limit) {
      setError(`That file is over ${Math.round(limit / 1024 / 1024)} MB. Try a shorter clip.`);
      return;
    }
    onChange({ type: "new", blob: file, contentType: baseType(file.type), kind });
  }

  if (!enabled) {
    return (
      <p className="text-sm text-muted">
        Audio and video uploads aren&apos;t switched on yet. Send a written testimonial now and you can add a recording later.
      </p>
    );
  }

  const max = formatTime(TESTIMONIAL_LIMITS.mediaSeconds);

  return (
    <div className="space-y-4">
      {recording === "VIDEO" && (
        <video ref={liveRef} muted playsInline className="w-full rounded-lg bg-black" aria-label="Camera preview" />
      )}

      {recording ? (
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground" role="status" aria-live="polite">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" aria-hidden />
            Recording {formatTime(seconds)} / {max}
          </span>
          <button type="button" onClick={stopRecording} className={button}>
            <Square className="h-4 w-4" aria-hidden /> Stop
          </button>
        </div>
      ) : value.type === "none" ? (
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => startRecording("VIDEO")} className={button}>
            <Video className="h-4 w-4" aria-hidden /> Record video
          </button>
          <button type="button" onClick={() => startRecording("AUDIO")} className={button}>
            <Mic className="h-4 w-4" aria-hidden /> Record audio
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className={button}>
            <Upload className="h-4 w-4" aria-hidden /> Upload a file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={[...AUDIO_TYPES, ...VIDEO_TYPES].join(",")}
            className="sr-only"
            tabIndex={-1}
            aria-label="Upload an audio or video file"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {value.type === "existing" && <Player src={value.url} kind={value.kind} />}
          {value.type === "new" && previewUrl && <Player src={previewUrl} kind={value.kind} />}
          <button type="button" onClick={() => onChange({ type: "none" })} className={cn(button, "text-muted")}>
            <Trash2 className="h-4 w-4" aria-hidden /> Remove and record again
          </button>
        </div>
      )}

      <p className="text-xs text-muted">
        Up to {max}. Recording stays in your browser until you press Submit.
      </p>
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
