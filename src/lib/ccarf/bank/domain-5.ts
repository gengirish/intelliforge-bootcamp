/**
 * Domain 5 — Context Management & Reliability (15% of the exam).
 *
 * IntelliForge-authored from the exam blueprint's task statements and the
 * batches, caching, and error-handling documentation.
 */

import type { Question } from "../types";

export const DOMAIN_5: Question[] = [
  {
    id: "D5-Q01",
    domain: 5,
    task: "5.3",
    scenario: 6,
    stem: "You must classify 200,000 archived documents. There is no user waiting on the results, and the job should finish within a day at the lowest cost. Which approach fits?",
    options: {
      A: "Submit the work through the Message Batches API and poll for results.",
      B: "Fan out synchronous Messages API calls across many workers to finish faster.",
      C: "Stream each request so partial results arrive sooner.",
      D: "Concatenate documents into very large prompts to reduce the number of requests.",
    },
    answer: "A",
    explanation:
      "The Batches API is built for large asynchronous workloads: you submit many requests at once, results return within the batch window, and the tokens are billed at a discount. A job with no latency requirement is the case it exists for.",
    distractors: {
      B: "Parallel synchronous calls buy latency you do not need, at full price, and push you into rate limiting.",
      C: "Streaming improves time-to-first-token for a human reader. Nothing is reading these in real time.",
      D: "Batching documents into one prompt degrades per-document accuracy and makes one failure spoil the whole group.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/message-batches",
  },
  {
    id: "D5-Q02",
    domain: 5,
    task: "5.2",
    scenario: 7,
    stem: "A long-running assistant session approaches the context window limit mid-conversation. Which strategy preserves the most useful behaviour?",
    options: {
      A: "Summarize the older turns into a compact record of decisions and open threads, and keep the recent turns verbatim.",
      B: "Drop the oldest messages one at a time until the request fits.",
      C: "Drop the system prompt, which is typically the largest stable block.",
      D: "Start a fresh session and ask the user to restate what they need.",
    },
    answer: "A",
    explanation:
      "Compaction trades fidelity for capacity where fidelity matters least. Decisions and unresolved threads are what later turns depend on; the exact wording of an early exchange usually is not. Recent turns stay verbatim because they are what the next response builds on.",
    distractors: {
      B: "Naive truncation discards whatever happens to be oldest, including commitments and constraints the conversation still relies on.",
      C: "The system prompt carries the standing instructions and tool guidance. Removing it changes the agent's behaviour entirely.",
      D: "Restarting pushes the cost of the limit onto the user and loses everything the session established.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/context-windows",
  },
  {
    id: "D5-Q03",
    domain: 5,
    task: "5.1",
    scenario: 4,
    stem: "Your service starts receiving HTTP 429 responses under load. What is the correct client behaviour?",
    options: {
      A: "Back off — honour the `retry-after` header when present, otherwise retry with exponential backoff and jitter, and cap the number of attempts.",
      B: "Retry immediately, since the request itself was valid.",
      C: "Fail the request and surface the error, since 429 is not retryable.",
      D: "Retry on a fixed one-second interval until it succeeds.",
    },
    answer: "A",
    explanation:
      "429 means slow down, and the response says for how long when it can. Respecting `retry-after`, otherwise backing off exponentially with jitter and a bounded attempt count, recovers without amplifying the overload.",
    distractors: {
      B: "Immediate retries add load to a service already telling you there is too much, and every client doing it converges on a stampede.",
      C: "429 is the canonical retryable status; treating it as fatal fails requests that would have succeeded a moment later.",
      D: "A fixed interval synchronises every client onto the same schedule, which is what jitter exists to prevent.",
    },
    docUrl: "https://platform.claude.com/docs/en/api/errors",
  },
  {
    id: "D5-Q04",
    domain: 5,
    task: "5.2",
    scenario: 7,
    stem: "Which of these consumes the context window on a request?",
    options: {
      A: "The system prompt, the tool definitions, the full message history, and the tokens generated in the response.",
      B: "The message history only; system prompts and tools are metadata.",
      C: "The current user message and the response, since earlier turns are stored server-side.",
      D: "Everything sent as input, but not the generated output.",
    },
    answer: "A",
    explanation:
      "The window covers the whole request plus what is generated into it. Tool definitions in particular are easy to forget and can be substantial when a dozen servers are connected.",
    distractors: {
      B: "Tool schemas are sent with every request and counted like any other input; a large tool list is a real budget item.",
      C: "The API is stateless — the entire conversation is resent on every call, which is why long sessions need managing.",
      D: "Generated tokens occupy the same window, which is why a long response can hit the limit even with modest input.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/context-windows",
  },
  {
    id: "D5-Q05",
    domain: 5,
    task: "5.3",
    scenario: 4,
    stem: "Before dispatching a large request you want to know whether it fits the context window, without paying for a generation. What is available?",
    options: {
      A: "The token counting endpoint, which returns the input token count for a request without running it.",
      B: "Dividing the character count by four for an estimate.",
      C: "Sending the request with `max_tokens` of 1 and reading the usage figures.",
      D: "Nothing — the count is only known after a response comes back.",
    },
    answer: "A",
    explanation:
      "There is a dedicated endpoint for counting the tokens of a prospective request. It gives an exact figure for the same payload you are about to send, with no generation.",
    distractors: {
      B: "A characters-per-token heuristic is a rough guide; near a hard limit, rough is what fails in production.",
      C: "This does run the request and bill the input, which is the cost you were trying to avoid, and it fails outright if the input already exceeds the window.",
      D: "Giving up on a question the API answers directly is the wrong conclusion.",
    },
    docUrl: "https://platform.claude.com/docs/en/api/messages-count-tokens",
  },
  {
    id: "D5-Q06",
    domain: 5,
    task: "5.3",
    scenario: 6,
    stem: "A nightly batch of 40,000 classifications currently runs as synchronous requests and keeps hitting rate limits. Cost matters; latency does not. What changes?",
    options: {
      A: "Move it to the Batches API, which is built for this shape of workload and bills the tokens at a discount.",
      B: "Add exponential backoff and let it run longer.",
      C: "Request a rate limit increase and keep the synchronous design.",
      D: "Reduce the prompt size so more requests fit under the limit.",
    },
    answer: "A",
    explanation:
      "This is the batch case exactly: a large volume, no one waiting, and cost as the constraint. Submitting it as a batch removes the rate-limit fight and halves the token cost.",
    distractors: {
      B: "Backoff stops the errors but leaves the job at full price, still fighting a limit it did not need to be near.",
      C: "A higher limit treats the symptom, keeps the synchronous premium, and depends on someone approving it.",
      D: "Trimming prompts reduces quality to work around a mismatch between the workload and the API being used for it.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/message-batches",
  },
  {
    id: "D5-Q07",
    domain: 5,
    task: "5.1",
    scenario: 7,
    stem: "A request that generates a very long response intermittently fails with a client-side timeout. What is the appropriate fix?",
    options: {
      A: "Stream the response, so tokens arrive incrementally and the connection stays active throughout the generation.",
      B: "Retry on timeout, since the failure is intermittent.",
      C: "Raise `max_tokens` so the response completes sooner.",
      D: "Split the request into several smaller ones and concatenate the results.",
    },
    answer: "A",
    explanation:
      "A long generation is exactly what streaming is for: the client receives tokens as they are produced, so there is no long silent wait for a single response to be assembled.",
    distractors: {
      B: "Retrying pays for the whole generation again and hits the same wall, only later.",
      C: "A higher output ceiling permits a longer response, which makes the wait longer rather than shorter.",
      D: "Splitting a single coherent response across requests loses continuity and adds stitching logic to solve a transport problem.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/streaming",
  },
  {
    id: "D5-Q08",
    domain: 5,
    task: "5.2",
    scenario: 3,
    stem: "A report generator must let readers check every claim against the source documents it was given. Which capability is designed for that?",
    options: {
      A: "Citations, which ground statements in the supplied documents and return the referenced passages.",
      B: "Extended thinking, so the reasoning that produced each claim is visible.",
      C: "A lower temperature, which reduces unsupported statements.",
      D: "A system prompt instruction to quote the source after every sentence.",
    },
    answer: "A",
    explanation:
      "Citations exist for exactly this: claims come back linked to the passages in the provided documents that support them, so verification is mechanical rather than a matter of trust.",
    distractors: {
      B: "Thinking shows how the model reasoned, which is not the same as showing where a fact came from.",
      C: "Temperature affects sampling, not grounding. A confident unsupported claim is still unsupported.",
      D: "Asking for quotes yields quotes the model produces, which can be paraphrased or invented — the failure mode citations remove.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/citations",
  },
  {
    id: "D5-Q09",
    domain: 5,
    task: "5.2",
    scenario: 1,
    stem: "A support deployment reuses a large cached system prompt, but traffic is bursty — sometimes twenty requests a minute, sometimes one every twenty minutes. Cache hit rates are poor during quiet periods. What is the appropriate response?",
    options: {
      A: "Consider the longer cache lifetime for the stable prefix, weighing its higher write cost against the reads it saves during quiet spells.",
      B: "Send periodic dummy requests to keep the cache warm.",
      C: "Remove the cache breakpoint, since caching does not suit bursty traffic.",
      D: "Split the system prompt into smaller pieces so each is cheaper to re-cache.",
    },
    answer: "A",
    explanation:
      "The default lifetime is short by design, and there is a longer option for exactly this pattern. It costs more to write and less to miss, so the decision is an arithmetic one against your actual traffic.",
    distractors: {
      B: "Synthetic traffic buys cache warmth with real spend on requests nobody asked for, and it has to run forever.",
      C: "Giving up abandons the hits you do get during bursts, which are the majority of the volume.",
      D: "Smaller segments do not survive any longer; they just miss in smaller pieces.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
  },
];
