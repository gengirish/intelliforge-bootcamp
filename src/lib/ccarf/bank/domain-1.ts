/**
 * Domain 1 — Agent Architecture & Orchestration (27% of the exam).
 *
 * IntelliForge-authored from the exam blueprint's task statements and the Claude
 * Agent SDK documentation. Not transcribed from any exam guide.
 */

import type { Question } from "../types";

export const DOMAIN_1: Question[] = [
  {
    id: "D1-Q01",
    domain: 1,
    task: "1.1",
    scenario: 1,
    stem: "You are writing the agentic loop for a support agent on the Claude API. After each response you must decide whether to execute tools or hand the final answer back to the customer. Which signal should drive that branch?",
    options: {
      A: "The `stop_reason` field on the response: keep executing tools while it is `tool_use`, and finish when it is `end_turn`.",
      B: "Whether the assistant's text contains a closing phrase such as *I hope that helps*.",
      C: "Whether the response contains fewer tokens than a threshold you tune per deployment.",
      D: "Whether the loop has run fewer than five iterations.",
    },
    answer: "A",
    explanation:
      "`stop_reason` is the API's own statement of why generation stopped. `tool_use` means Claude has emitted one or more `tool_use` blocks and is waiting on their results; you execute them, append `tool_result` blocks, and call again. `end_turn` means Claude finished on its own and the loop terminates. It is a structured field, so the branch is deterministic.",
    distractors: {
      B: "Completion phrasing is model- and prompt-dependent. Parsing prose for control flow is the classic anti-pattern this field exists to remove.",
      C: "Response length has no defined relationship to whether tools are pending. A long final answer and a short tool request would both be misread.",
      D: "An iteration cap is a safety valve against runaway loops, not a termination signal. Used as the primary check it truncates work that was still in progress.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D1-Q02",
    domain: 1,
    task: "1.1",
    scenario: 1,
    stem: "Your agent calls a `lookup_order` tool that raises a timeout against a flaky downstream service. What should the loop send back to Claude for that call?",
    options: {
      A: "A `tool_result` block for the matching `tool_use_id` with `is_error` set to true and a short description of the failure.",
      B: "Nothing for that tool — omit the result so Claude retries the call on its own.",
      C: "A `tool_result` containing an empty object, so the agent treats it as no matching orders.",
      D: "Raise the exception out of the loop and return a generic apology to the customer.",
    },
    answer: "A",
    explanation:
      "Every `tool_use` block must be answered by a `tool_result` block carrying the same `tool_use_id`. Marking it `is_error: true` with a brief description lets Claude see what went wrong and choose a recovery — retry, try another tool, or escalate — while keeping the conversation structurally valid.",
    distractors: {
      B: "A missing `tool_result` for an emitted `tool_use` is a malformed request. The API rejects it rather than prompting a retry.",
      C: "Reporting a timeout as an empty result is a silent lie to the model. The agent will confidently tell the customer they have no orders.",
      D: "Aborting the turn discards a recoverable situation. A transient timeout on one tool does not have to end the conversation.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D1-Q03",
    domain: 1,
    task: "1.3",
    scenario: 3,
    stem: "A research coordinator delegates to four subagents. Reviewers report that subagent findings often contradict the source material, and the coordinator cannot tell which claim came from where. What change addresses the cause?",
    options: {
      A: "Require each subagent to return structured output carrying the claim, a verbatim quote, the source URL, and the publication date.",
      B: "Increase the coordinator's max_tokens so it can hold more of each subagent's prose.",
      C: "Have the coordinator re-run every subagent a second time and keep the answer that appears twice.",
      D: "Move all four subagents into a single agent with a longer system prompt.",
    },
    answer: "A",
    explanation:
      "The coordinator can only synthesize as carefully as its inputs allow. Requiring structured, attributed output per finding gives it the provenance it needs to reconcile claims, flag disputes, and cite sources — and it makes an unsupported claim visibly missing its quote.",
    distractors: {
      B: "The problem is that attribution was never captured, not that it was captured and truncated. More tokens carry more unattributed prose.",
      C: "Repetition measures the model's consistency, not the source's accuracy. Two identical hallucinations agree with each other.",
      D: "Collapsing the subagents removes the parallelism and the context isolation without adding any provenance.",
    },
    docUrl: "https://platform.claude.com/docs/en/agent-sdk/subagents",
  },
  {
    id: "D1-Q04",
    domain: 1,
    task: "1.2",
    scenario: 1,
    stem: "An audit finds that in roughly one refund out of eight, the agent calls `process_refund` without having first called `verify_eligibility`. The system prompt already instructs it to always verify first. What is the most reliable fix?",
    options: {
      A: "Enforce the ordering in code — reject a `process_refund` call whose session has no successful `verify_eligibility` result, and return that as a tool error.",
      B: "Restate the instruction more forcefully in the system prompt, in capitals and at the end.",
      C: "Add few-shot examples showing verification happening before every refund.",
      D: "Lower the temperature so the agent follows instructions more consistently.",
    },
    answer: "A",
    explanation:
      "A step that must happen every time is a business rule, not a prompting preference. Enforcing the precondition in the tool layer makes the failure impossible rather than unlikely, and returning it as a tool error lets the agent recover by calling the verification tool.",
    distractors: {
      B: "Emphasis shifts the probability of compliance; it cannot pin it at 100%. A one-in-eight failure on a money-moving action needs a guarantee.",
      C: "Few-shot examples help when the model has not seen the pattern. Here it has been told the pattern and still deviates, which points at enforcement rather than demonstration.",
      D: "Temperature affects sampling diversity, not instruction adherence, and at 0 the agent can still skip a step it did not plan.",
    },
    docUrl: "https://platform.claude.com/docs/en/agent-sdk/overview",
  },
  {
    id: "D1-Q05",
    domain: 1,
    task: "1.1",
    scenario: 1,
    stem: "Traces show the agent resolving a simple request in four API round trips: it asks for `get_customer`, waits, then asks for `lookup_order`, waits, then asks for `get_policy`. The three lookups do not depend on each other. What reduces the latency?",
    options: {
      A: "Instruct the model to request every independent tool it needs in one turn, and execute the resulting `tool_use` blocks concurrently before returning all results together.",
      B: "Cache the tool results so the second identical request is faster.",
      C: "Raise `max_tokens` so the model can plan more of the work up front.",
      D: "Split the three lookups across three separate subagents.",
    },
    answer: "A",
    explanation:
      "A single assistant turn can contain several `tool_use` blocks. Prompting for that, executing them in parallel, and returning all the `tool_result` blocks in one user message collapses three round trips into one.",
    distractors: {
      B: "Caching helps a repeat of the same request. It does nothing for the first one, which is the case being measured.",
      C: "The model is not running out of output budget; it is choosing to ask for one tool at a time.",
      D: "Subagents add coordination overhead and their own round trips. Parallel tool calls in one turn are the lighter mechanism for independent lookups.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D1-Q06",
    domain: 1,
    task: "1.3",
    scenario: 3,
    stem: "A coordinator spawns four subagents. One of them times out. What should the coordinator do with the remaining three?",
    options: {
      A: "Continue with the partial results, recording which subagent failed and what is therefore missing from the synthesis.",
      B: "Discard everything and restart all four, so the report is built from a consistent run.",
      C: "Silently omit the failed subagent's topic from the report.",
      D: "Substitute the coordinator's own knowledge for the missing subagent's findings.",
    },
    answer: "A",
    explanation:
      "Partial failure is the normal case in a multi-agent system. Continuing with what succeeded, and stating the gap explicitly, preserves most of the work and keeps the output honest about its coverage.",
    distractors: {
      B: "Restarting throws away three successful, often expensive, research passes to recover one.",
      C: "An unmarked gap is the dangerous outcome: the report reads as complete when it is not.",
      D: "Filling a research gap from the model's own priors is exactly the unsourced claim the subagent architecture exists to avoid.",
    },
    docUrl: "https://platform.claude.com/docs/en/agent-sdk/subagents",
  },
  {
    id: "D1-Q07",
    domain: 1,
    task: "1.2",
    scenario: 1,
    stem: "Your agent calls three third-party MCP tools. One returns Unix timestamps, one ISO 8601 strings, and one a locale-formatted date. You do not control any of them, and the agent keeps misreading dates. What is the cleanest fix?",
    options: {
      A: "Normalize the outputs in a `PostToolUse` hook, so every tool result reaches the model in one date format.",
      B: "Describe all three formats in the system prompt and ask the model to convert them as needed.",
      C: "Fork each MCP server and change its output format.",
      D: "Add a `convert_date` tool the model can call after each lookup.",
    },
    answer: "A",
    explanation:
      "A `PostToolUse` hook sits between the tool and the model, so it can rewrite results deterministically. It works for servers you do not own and it removes the conversion from the model's job entirely.",
    distractors: {
      B: "This makes correct date handling a probabilistic step on every single call, which is what is already failing.",
      C: "Forking three third-party servers to change a format is a maintenance burden you would carry forever.",
      D: "An extra tool call per lookup doubles the round trips and still depends on the model remembering to make it.",
    },
    docUrl: "https://platform.claude.com/docs/en/agent-sdk/hooks",
  },
  {
    id: "D1-Q08",
    domain: 1,
    task: "1.2",
    scenario: 1,
    stem: "A support agent must decide when to hand a conversation to a human. Which basis for that decision is the most defensible?",
    options: {
      A: "Explicit criteria — the request falls outside stated policy, the customer asks for a human, or the agent cannot make progress — supported by examples of each.",
      B: "The model rating its own confidence from 1 to 10, escalating below 7.",
      C: "Sentiment analysis of the customer's messages, escalating on anger.",
      D: "A fixed rule that any conversation longer than eight turns escalates.",
    },
    answer: "A",
    explanation:
      "Escalation is a policy question, so it needs stated conditions a reviewer can audit and a model can apply consistently. Naming the triggers, and showing an example of each, is what makes the boundary reproducible.",
    distractors: {
      B: "Self-rated confidence is not calibrated against anything. It moves with phrasing, not with actual risk.",
      C: "An angry customer with a policy-covered problem should be resolved, not transferred; a polite one asking for an unlisted exception should be escalated. Sentiment does not track the decision.",
      D: "Turn count is a proxy for difficulty at best, and it escalates long conversations that were going perfectly well.",
    },
    docUrl: "https://platform.claude.com/docs/en/agent-sdk/overview",
  },
  {
    id: "D1-Q09",
    domain: 1,
    task: "1.1",
    scenario: 7,
    stem: "A response comes back with `stop_reason` of `max_tokens` in the middle of a long answer. What is the correct handling?",
    options: {
      A: "Treat the turn as incomplete — either raise `max_tokens` and retry, or send the truncated content back and ask Claude to continue.",
      B: "Treat it like `end_turn` and show the user what arrived.",
      C: "Retry the identical request, since the truncation is nondeterministic.",
      D: "Reduce the size of the system prompt, since `max_tokens` counts input.",
    },
    answer: "A",
    explanation:
      "`max_tokens` means generation hit the output ceiling, not that Claude finished. The content is a fragment, so you either give the turn more room or continue from where it stopped.",
    distractors: {
      B: "Presenting a truncated answer as final is the failure mode this signal exists to let you avoid — often mid-sentence, sometimes mid-JSON.",
      C: "The same request with the same ceiling will truncate again. Nothing about the limit is random.",
      D: "`max_tokens` bounds the output only. Shrinking the system prompt frees context window, not generation budget.",
    },
    docUrl: "https://platform.claude.com/docs/en/api/messages",
  },
  {
    id: "D1-Q10",
    domain: 1,
    task: "1.3",
    scenario: 3,
    stem: "Two subagents return conflicting figures for the same statistic, each with a credible source. What should the coordinator do?",
    options: {
      A: "Report both values with their sources and dates, marked as disputed, rather than choosing one.",
      B: "Take the value from the subagent whose source is more recent and drop the other.",
      C: "Average the two figures.",
      D: "Re-run both subagents and keep whichever value comes back twice.",
    },
    answer: "A",
    explanation:
      "The coordinator has no basis for adjudicating between two sourced claims. Surfacing the disagreement with attribution is more useful to the reader than a confident single number, and it separates confirmed findings from contested ones.",
    distractors: {
      B: "Recency is not authority. A newer blog post does not outrank an older primary source.",
      C: "Averaging two incompatible figures invents a third that no source supports.",
      D: "Re-running measures retrieval stability, not truth, and it costs another full research pass.",
    },
    docUrl: "https://platform.claude.com/docs/en/agent-sdk/subagents",
  },
  {
    id: "D1-Q11",
    domain: 1,
    task: "1.2",
    scenario: 1,
    stem: "Analysis shows that when a customer message contains the word *account*, the agent routes to `get_customer` 78% of the time regardless of what was actually asked. Tool descriptions are clear and distinct. Where should you look?",
    options: {
      A: "The system prompt, for keyword-based routing guidance that is steering selection independently of the request's meaning.",
      B: "The tool schemas, for an overly permissive input type.",
      C: "The model version, which may have a selection bias.",
      D: "The conversation history, which may be too long.",
    },
    answer: "A",
    explanation:
      "A strong correlation between one token and one tool is the signature of an explicit routing rule. When descriptions are already clean, the next place a keyword heuristic can live is the system prompt, where it usually arrived as a well-meant hint.",
    distractors: {
      B: "A loose input type would produce malformed arguments, not a consistent bias toward one tool.",
      C: "Blaming the model is unfalsifiable here and does not explain why the bias attaches to one specific word.",
      D: "History length affects what the model remembers, not a keyword-shaped routing pattern.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D1-Q12",
    domain: 1,
    task: "1.2",
    scenario: 1,
    stem: "A `lookup_account` tool takes a customer name. When the name matches several accounts it returns the most recently active one, and 15% of those resolutions are the wrong account. What is the right change?",
    options: {
      A: "Return all matches and have the agent ask the customer for a disambiguating detail before acting.",
      B: "Improve the tie-break so the most recently active match is chosen more accurately.",
      C: "Have the tool return only an error when the name is ambiguous.",
      D: "Ask the model to guess the intended account from conversation context.",
    },
    answer: "A",
    explanation:
      "The tool is resolving an ambiguity it has no information to resolve. Surfacing the candidates and letting the agent ask one clarifying question converts a silent 15% error rate into a brief, correct exchange.",
    distractors: {
      B: "A better heuristic is still a guess. Recency does not mean the customer on the line.",
      C: "A bare error gives the agent nothing to work with and dead-ends conversations that a single question would resolve.",
      D: "The context does not contain the missing identifier either, so this relocates the guess rather than removing it.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D1-Q13",
    domain: 1,
    task: "1.3",
    scenario: 3,
    stem: "A subagent is asked to analyse a document the coordinator retrieved three steps earlier, and it repeatedly asks for information the coordinator already has. Why?",
    options: {
      A: "Subagents do not inherit the coordinator's conversation history; the context they need must be passed explicitly in their prompt.",
      B: "The subagent's context window is too small for the coordinator's history.",
      C: "The subagent lacks the tool needed to read the coordinator's messages.",
      D: "The coordinator is compacting its history before delegating.",
    },
    answer: "A",
    explanation:
      "Context isolation is the point of a subagent: it runs with its own window and sees only what it is given. Anything it needs — the document, the constraints, the definition of done — has to be stated in the delegation.",
    distractors: {
      B: "The window size is not the issue; the history was never offered to the subagent in the first place.",
      C: "There is no tool for reaching into a parent's conversation, and adding one would defeat the isolation.",
      D: "Compaction would shorten what the coordinator remembers. It has no bearing on what a subagent receives.",
    },
    docUrl: "https://platform.claude.com/docs/en/agent-sdk/subagents",
  },
  {
    id: "D1-Q14",
    domain: 1,
    task: "1.1",
    scenario: 4,
    stem: "You want a specific turn to always produce a tool call rather than prose — the caller cannot handle a text answer. Which control does that?",
    options: {
      A: "Set `tool_choice` to `any` for that request, which requires the model to use one of the supplied tools.",
      B: "Set `tool_choice` to `auto` and describe the requirement in the system prompt.",
      C: "Remove the assistant's ability to emit text by setting `max_tokens` low.",
      D: "Retry the request until a `tool_use` block comes back.",
    },
    answer: "A",
    explanation:
      "`tool_choice` moves tool use from a suggestion to a constraint: `any` forces some tool, and naming a specific tool forces that one. It is the API-level guarantee the situation calls for.",
    distractors: {
      B: "`auto` leaves the decision with the model, so the prose case remains possible however firmly it is discouraged.",
      C: "A low output ceiling truncates the response; it does not change what kind of block the model emits.",
      D: "A retry loop converges eventually at the cost of latency and spend, and it is unnecessary when the parameter exists.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D1-Q15",
    domain: 1,
    task: "1.1",
    scenario: 1,
    stem: "You add a hard cap of 20 iterations to an agent loop. What is that cap for?",
    options: {
      A: "A safety valve against a runaway loop, alongside `stop_reason` — hitting it is an incident to investigate, not a normal ending.",
      B: "The primary termination condition, replacing `stop_reason` inspection.",
      C: "A cost control that should be tuned down until most conversations hit it.",
      D: "A way to bound latency, since each iteration takes roughly the same time.",
    },
    answer: "A",
    explanation:
      "The loop ends when `stop_reason` says so. The cap exists to stop a pathological case — a tool that always fails, a cycle of retries — from running forever, so reaching it should be logged and looked at.",
    distractors: {
      B: "Using the cap as the termination condition truncates work mid-task whenever a legitimate request needs more steps.",
      C: "Tuning a safety limit down until it fires routinely converts it into a silent truncation mechanism.",
      D: "Iterations vary enormously in duration depending on the tools involved, so the cap is a poor latency bound.",
    },
    docUrl: "https://platform.claude.com/docs/en/agent-sdk/overview",
  },
  {
    id: "D1-Q16",
    domain: 1,
    task: "1.2",
    scenario: 4,
    stem: "An agent handles single-issue requests well but does poorly when a customer raises three problems in one message, addressing the first and dropping the others. What is the most direct fix?",
    options: {
      A: "Add few-shot examples that show the request being decomposed into separate issues, each investigated and then answered together.",
      B: "Instruct the agent to ask the customer to send one issue per message.",
      C: "Run the message through a classifier that splits it before the agent sees it.",
      D: "Increase the iteration cap so the agent has room to work through all three.",
    },
    answer: "A",
    explanation:
      "The model has the capability — it handles each issue well in isolation — but it has not been shown the decomposition pattern. Demonstrating it is the standard remedy for a missing procedure.",
    distractors: {
      B: "This fixes the metric by pushing the work onto the customer, which is the opposite of what a support agent is for.",
      C: "A pre-splitting classifier is a separate system to build and maintain, and it loses the cross-issue context that sometimes matters.",
      D: "The agent is not running out of iterations; it stops because it believes it is finished.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting",
  },
];
