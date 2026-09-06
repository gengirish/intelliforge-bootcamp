/**
 * Domain 3 — Claude Code Configuration & Workflows (20% of the exam).
 *
 * IntelliForge-authored from the exam blueprint's task statements and the
 * Claude Code documentation.
 */

import type { Question } from "../types";

export const DOMAIN_3: Question[] = [
  {
    id: "D3-Q01",
    domain: 3,
    task: "3.1",
    scenario: 2,
    stem: "Your team wants every Claude Code session in a repository to know the project's build commands and architectural conventions, without anyone pasting them in. Where does that belong?",
    options: {
      A: "A `CLAUDE.md` at the repository root, committed so every contributor's session loads it.",
      B: "A `.claude/agents/` subagent definition that contributors invoke first.",
      C: "A `PreToolUse` hook that prints the conventions before each tool call.",
      D: "The user-level `~/.claude/CLAUDE.md`, so it applies wherever the developer works.",
    },
    answer: "A",
    explanation:
      "Project memory lives in `CLAUDE.md` at the project root. It is loaded automatically at session start and, because it is checked in, it reaches every contributor and is reviewed like any other file.",
    distractors: {
      B: "A subagent has its own context and runs only when delegated to. It cannot supply baseline conventions to the main session.",
      C: "Hooks fire around tool calls, so the guidance would arrive repeatedly and only after work had begun.",
      D: "User memory is personal and uncommitted. It would apply to this developer in every repository and to no one else in this one.",
    },
    docUrl: "https://code.claude.com/docs/en/memory",
  },
  {
    id: "D3-Q02",
    domain: 3,
    task: "3.2",
    scenario: 5,
    stem: "In CI you need Claude Code to refuse any command that writes to the production deployment directory, regardless of what the model decides. Which mechanism enforces that?",
    options: {
      A: "A `PreToolUse` hook that inspects the pending call and blocks it, since it runs before the tool executes.",
      B: "A `PostToolUse` hook that reverts the write after it happens.",
      C: "A line in `CLAUDE.md` instructing Claude never to write to that directory.",
      D: "A `Stop` hook that checks what was written at the end of the session.",
    },
    answer: "A",
    explanation:
      "`PreToolUse` fires after Claude requests a tool but before it runs, and its result can deny the call. That is the only hook point that can prevent an action rather than react to one, which is what an enforceable guardrail requires.",
    distractors: {
      B: "`PostToolUse` runs after the tool has already executed. Reverting a production write is damage control, not prevention.",
      C: "Memory is guidance the model can weigh against other instructions. It is not an enforcement boundary.",
      D: "`Stop` fires when the session ends, long after the write landed.",
    },
    docUrl: "https://code.claude.com/docs/en/hooks",
  },
  {
    id: "D3-Q03",
    domain: 3,
    task: "3.3",
    scenario: 5,
    stem: "A nightly job must run Claude Code non-interactively over a repository and emit machine-readable output for a downstream script. What is the right shape for that invocation?",
    options: {
      A: "Run it in headless mode with `-p` and a structured output format such as `--output-format stream-json`.",
      B: "Start the interactive TUI under a pseudo-terminal and scrape the rendered frames.",
      C: "Run the interactive session and have the model write its findings into a file the script then reads.",
      D: "Call the Messages API directly, since Claude Code cannot run without a terminal.",
    },
    answer: "A",
    explanation:
      "Headless mode exists for exactly this: `-p` takes the prompt non-interactively, and the structured output formats give the caller parseable results instead of terminal rendering.",
    distractors: {
      B: "Scraping a TUI couples your pipeline to the rendering layer, which is presentation and free to change.",
      C: "It works, but it routes a supported output contract through an unvalidated side channel and gives the script nothing to check when the run fails.",
      D: "Claude Code runs headlessly by design; dropping to the raw API discards the agent loop, tools, and project memory you wanted.",
    },
    docUrl: "https://code.claude.com/docs/en/headless",
  },
  {
    id: "D3-Q04",
    domain: 3,
    task: "3.1",
    scenario: 2,
    stem: "A developer's personal `~/.claude/CLAUDE.md` says to prefer tabs. The repository's `CLAUDE.md` says the project uses spaces. What should you expect, and what is the right response?",
    options: {
      A: "Project memory is the more specific instruction for work in that repository, so the project convention should win — and the conflict belongs in the project file, not in a personal preference.",
      B: "User memory always wins, because it is loaded last.",
      C: "The two files are concatenated and Claude picks whichever appears first.",
      D: "A conflict between memory files is an error and Claude will ask which to use.",
    },
    answer: "A",
    explanation:
      "Memory is layered from broad to specific, and a project's committed conventions are the ones that apply inside that project. A personal preference that contradicts a repository standard is the thing to change.",
    distractors: {
      B: "Load order is not a precedence rule, and a personal file overriding a team's committed standard would be the wrong outcome anyway.",
      C: "Precedence is defined by scope, not by position in a concatenated file.",
      D: "Claude does not halt on conflicting guidance; it resolves it, which is why the layering matters.",
    },
    docUrl: "https://code.claude.com/docs/en/memory",
  },
  {
    id: "D3-Q05",
    domain: 3,
    task: "3.1",
    scenario: 2,
    stem: "Your `CLAUDE.md` has grown to several hundred lines covering four subsystems. You want to keep it maintainable without losing the guidance. What does Claude Code support?",
    options: {
      A: "Import other Markdown files from `CLAUDE.md` with `@path/to/file`, so each subsystem's conventions live in its own file.",
      B: "Splitting it into `CLAUDE.md`, `CLAUDE2.md` and so on, which are all loaded automatically.",
      C: "A `claude.config.json` listing additional memory files to load.",
      D: "Nothing — memory has to be a single file, so the content must be summarized.",
    },
    answer: "A",
    explanation:
      "`CLAUDE.md` supports `@` imports, so a large set of conventions can be split by subsystem and pulled in from one entry point. Each file stays reviewable on its own.",
    distractors: {
      B: "Numbered siblings are not a convention Claude Code recognises, so those files would simply never load.",
      C: "Memory files are not registered through a config file; the import syntax is the mechanism.",
      D: "Summarizing to fit an imaginary limit would throw away guidance that the import syntax lets you keep.",
    },
    docUrl: "https://code.claude.com/docs/en/memory",
  },
  {
    id: "D3-Q06",
    domain: 3,
    task: "3.2",
    scenario: 2,
    stem: "You want Claude to follow your team's database-migration procedure automatically whenever a session involves migrations — without anyone remembering to invoke it. Skill or slash command?",
    options: {
      A: "A skill, because Claude decides to load it based on its description matching the task at hand.",
      B: "A slash command, because it can be documented in the README for people to type.",
      C: "A slash command, because only commands can contain multi-step procedures.",
      D: "Either — skills and slash commands are two names for the same mechanism.",
    },
    answer: "A",
    explanation:
      "The distinction is who invokes it. A skill is model-invoked: Claude reads the descriptions available to it and pulls one in when the work matches. A slash command is user-invoked. *Without anyone remembering* is the skill case.",
    distractors: {
      B: "A command that must be typed reintroduces exactly the human step the requirement removes.",
      C: "Both can hold multi-step procedures; the difference is the trigger, not the content.",
      D: "They are separate mechanisms with different invocation models, and the choice between them is the point here.",
    },
    docUrl: "https://code.claude.com/docs/en/skills",
  },
  {
    id: "D3-Q07",
    domain: 3,
    task: "3.3",
    scenario: 5,
    stem: "A long refactor keeps filling the main session's context with search output, crowding out the actual work. What is the appropriate structure?",
    options: {
      A: "Delegate the exploration to a sub-agent, which runs in its own context and returns only its conclusions to the main session.",
      B: "Raise the main session's context limit.",
      C: "Run the searches in a second terminal session and paste the results in.",
      D: "Add a `PostToolUse` hook that truncates every search result to ten lines.",
    },
    answer: "A",
    explanation:
      "A sub-agent has its own context window. Sending the noisy exploration there means the main session receives a short answer instead of the transcript that produced it — which is what sub-agents are for.",
    distractors: {
      B: "The window is a model property, not a setting to raise, and a bigger one would just fill up more slowly.",
      C: "This is the same volume of output arriving by a manual route, plus the copying.",
      D: "A blanket truncation discards the middle of results the agent may have needed, without knowing what mattered.",
    },
    docUrl: "https://code.claude.com/docs/en/sub-agents",
  },
  {
    id: "D3-Q08",
    domain: 3,
    task: "3.2",
    scenario: 5,
    stem: "In a CI pipeline you want Claude Code to run without stopping to ask about tool permissions, while still being unable to touch anything outside the checkout. What is the right approach?",
    options: {
      A: "Configure explicit allow and deny rules in settings so the permitted set is decided up front, rather than disabling permission checks.",
      B: "Skip all permission prompts, since CI is a trusted environment.",
      C: "Pre-answer the prompts by piping `y` into the process.",
      D: "Run interactively under a pseudo-terminal and auto-confirm each prompt.",
    },
    answer: "A",
    explanation:
      "Non-interactive does not have to mean unrestricted. Declaring the allowed and denied tools in settings removes the prompts while keeping a boundary that a reviewer can read and a compromised prompt cannot widen.",
    distractors: {
      B: "*CI is trusted* conflates the pipeline with everything it processes — including pull requests from outside the team.",
      C: "Blanket confirmation approves whatever is asked, which is the same as having no boundary.",
      D: "Automating the click is the same permissive outcome, reached through a more fragile mechanism.",
    },
    docUrl: "https://code.claude.com/docs/en/iam",
  },
  {
    id: "D3-Q09",
    domain: 3,
    task: "3.3",
    scenario: 5,
    stem: "You want Claude to review pull requests when a team member mentions it in a PR comment. What is the supported route?",
    options: {
      A: "Install the Claude Code GitHub Actions workflow, which responds to `@claude` mentions on issues and pull requests.",
      B: "Poll the GitHub API from a cron job and run the CLI when a new comment appears.",
      C: "Add a git hook that runs Claude Code on push.",
      D: "Configure a `PostToolUse` hook that posts review comments back to GitHub.",
    },
    answer: "A",
    explanation:
      "The GitHub Actions integration exists for this: it wires mention-triggered runs into the repository's workflows, with the checkout, credentials, and comment-posting already handled.",
    distractors: {
      B: "A polling service duplicates what the action already does, and adds latency plus somewhere to host it.",
      C: "A git hook fires on push from a developer's machine, so it cannot see a comment on a pull request.",
      D: "Hooks act inside a Claude Code session; they are not a trigger for starting one from a GitHub event.",
    },
    docUrl: "https://code.claude.com/docs/en/github-actions",
  },
  {
    id: "D3-Q10",
    domain: 3,
    task: "3.1",
    scenario: 2,
    stem: "A change touches twelve files across three subsystems and the team wants to agree the approach before any code is written. Which Claude Code affordance fits?",
    options: {
      A: "Plan mode, which explores and proposes an approach for approval before making edits.",
      B: "A sub-agent, which will produce the plan in isolation.",
      C: "A `PreToolUse` hook that blocks every edit until a human approves it.",
      D: "Headless mode, which does not write files.",
    },
    answer: "A",
    explanation:
      "Plan mode is the built-in *look before you touch* workflow: research and a proposed approach first, edits only once it is approved. That is precisely the review gate the team wants.",
    distractors: {
      B: "A sub-agent isolates context. It is not a gate on whether edits happen.",
      C: "This gets an approval per file rather than one on the overall approach, which is the wrong granularity and exhausting.",
      D: "Headless mode changes how the session is driven, not whether it edits files — it certainly does.",
    },
    docUrl: "https://code.claude.com/docs/en/overview",
  },
  {
    id: "D3-Q11",
    domain: 3,
    task: "3.2",
    scenario: 2,
    stem: "Your team wants one MCP server available to everyone working in a repository, checked in alongside the code. Where does that configuration belong?",
    options: {
      A: "In the project's `.mcp.json`, committed to the repository so every contributor picks it up.",
      B: "In each developer's user-level configuration, documented in the README.",
      C: "In `CLAUDE.md`, as instructions telling Claude to connect to the server.",
      D: "In an environment variable exported by the project's setup script.",
    },
    answer: "A",
    explanation:
      "Project-scoped MCP servers live in a committed `.mcp.json`. The configuration travels with the repository, so it is reviewed like any other file and nobody has to set it up by hand.",
    distractors: {
      B: "Per-developer setup drifts immediately and silently — the usual outcome is that half the team is missing the server.",
      C: "Memory is guidance to the model. It is not where a client's server connections are configured.",
      D: "An environment variable is not how MCP servers are registered, and it would not survive a fresh shell.",
    },
    docUrl: "https://code.claude.com/docs/en/mcp",
  },
  {
    id: "D3-Q12",
    domain: 3,
    task: "3.2",
    scenario: 5,
    stem: "A `PreToolUse` hook needs to reject a tool call and tell Claude why, so it can choose a different approach. How does the hook communicate that?",
    options: {
      A: "Exit with the blocking status code and write the reason to stderr, which is fed back to Claude as the explanation.",
      B: "Exit 0 and print the reason to stdout.",
      C: "Exit 1, which Claude Code treats as a hard failure and reports to the user.",
      D: "Write the reason into `CLAUDE.md` so it is loaded on the next turn.",
    },
    answer: "A",
    explanation:
      "The hook contract distinguishes a non-blocking error from a deliberate block: the blocking exit code stops the call, and stderr carries the reason back to Claude so the next attempt can be better informed.",
    distractors: {
      B: "Exit 0 means the hook approved the call, so the tool would run regardless of what was printed.",
      C: "A generic failure exit surfaces to the user rather than steering the model, so Claude learns nothing and retries the same thing.",
      D: "Memory is loaded at session start, so a mid-session write does not communicate anything about this call.",
    },
    docUrl: "https://code.claude.com/docs/en/hooks",
  },
];
