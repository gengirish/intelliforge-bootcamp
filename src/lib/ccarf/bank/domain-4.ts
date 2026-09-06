/**
 * Domain 4 — Prompt Engineering & Structured Output (20% of the exam).
 *
 * IntelliForge-authored from the exam blueprint's task statements and the
 * prompt-engineering and extended-thinking documentation.
 */

import type { Question } from "../types";

export const DOMAIN_4: Question[] = [
  {
    id: "D4-Q01",
    domain: 4,
    task: "4.2",
    scenario: 7,
    stem: "You enable extended thinking on an agent that also uses tools. Between turns, what must you do with the `thinking` blocks the API returns?",
    options: {
      A: "Pass them back unmodified in the conversation history alongside the `tool_use` blocks from the same turn.",
      B: "Strip them before the next request, since they are debug output and waste input tokens.",
      C: "Summarize them into a short note and send the summary instead.",
      D: "Store them out of band and re-send them only if the tool call fails.",
    },
    answer: "A",
    explanation:
      "When extended thinking is combined with tool use, the thinking blocks from a turn must be returned verbatim with that turn's tool results. They carry the reasoning the tool call was based on, and the API validates that they arrive intact.",
    distractors: {
      B: "Dropping them breaks the continuity between the reasoning and the tool call it produced, and the request is rejected rather than silently degraded.",
      C: "Rewriting a thinking block changes it. The requirement is that it comes back unmodified.",
      D: "Conditional re-sending leaves the successful path missing the blocks it was required to include.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/extended-thinking",
  },
  {
    id: "D4-Q02",
    domain: 4,
    task: "4.3",
    scenario: 7,
    stem: "A long system prompt containing a large policy document is sent on every request in a high-volume support deployment, and cost is the main concern. What is the appropriate change?",
    options: {
      A: "Mark the stable prefix with a `cache_control` breakpoint so it is served from the prompt cache on subsequent requests.",
      B: "Trim the policy document to the sections most requests need and accept the coverage gap.",
      C: "Move the policy document from the system prompt into the first user message.",
      D: "Switch to a smaller model for every request.",
    },
    answer: "A",
    explanation:
      "Prompt caching is designed for a large, stable prefix reused across requests. Marking it with `cache_control` means later requests read it from the cache at a fraction of the input cost, with no change to what the model sees.",
    distractors: {
      B: "Truncating the policy trades correctness for cost. The cache removes the cost without removing the content.",
      C: "Position alone does not reduce cost — the tokens are billed either way — and it weakens the standing-instruction role of the system prompt.",
      D: "Downgrading the model changes answer quality across the whole deployment to solve a problem caching solves without any quality cost.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
  },
  {
    id: "D4-Q03",
    domain: 4,
    task: "4.1",
    scenario: 2,
    stem: "A code-review prompt handles single-file diffs at 94% accuracy but drops to 58% on multi-file changes, where reviewers say it never inspects the relationship between files. Which change targets that gap?",
    options: {
      A: "Add few-shot examples that demonstrate decomposing a multi-file diff and reasoning across the files before concluding.",
      B: "Increase `max_tokens` so the review has room to cover every file.",
      C: "Send one request per file and concatenate the reviews.",
      D: "Add a sentence to the system prompt telling the model to be thorough.",
    },
    answer: "A",
    explanation:
      "The model performs the single-file task well, so the capability is there; what is missing is a demonstration of the decomposition pattern for the harder shape. Few-shot examples are the standard way to show a reasoning procedure the model has not inferred.",
    distractors: {
      B: "The reviews are not being cut off, they are shallow. Extra output budget lengthens them without changing the approach.",
      C: "Per-file requests structurally prevent cross-file reasoning, which is the exact thing the reviews are missing.",
      D: "A generic exhortation gives the model nothing procedural to follow, which is why it is the weakest of these on a task with a specific shape.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting",
  },
  {
    id: "D4-Q04",
    domain: 4,
    task: "4.1",
    scenario: 7,
    stem: "A prompt supplies a 40-page contract and then asks three questions about it. Where should the document go relative to the questions?",
    options: {
      A: "The document first, then the questions, with the document delimited so its boundaries are unambiguous.",
      B: "The questions first, so the model knows what to look for while reading.",
      C: "Interleaved — each question immediately after the section it concerns.",
      D: "The document in the system prompt and the questions in the user turn, in either order.",
    },
    answer: "A",
    explanation:
      "Long inputs belong ahead of the instructions that operate on them, and clear delimiters keep the model from confusing document text with instructions. It also puts the large, stable block in the position a cache breakpoint can cover.",
    distractors: {
      B: "Leading with the questions buries them 40 pages back by the time the model reaches the end of the input.",
      C: "Interleaving requires you to have already decided which section answers each question, which is the work being delegated.",
      D: "Order is the thing being asked about, and *either order* discards the guidance that makes long-document prompts work.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips",
  },
  {
    id: "D4-Q05",
    domain: 4,
    task: "4.2",
    scenario: 7,
    stem: "You enable extended thinking and set `max_tokens` to 4096 with `budget_tokens` of 8192. What happens?",
    options: {
      A: "The request is invalid — the thinking budget must be smaller than `max_tokens`, since thinking tokens are drawn from the same output budget.",
      B: "It works; the thinking budget is counted separately from `max_tokens`.",
      C: "It works, but the thinking is silently truncated to 4096 tokens.",
      D: "It works and `max_tokens` is automatically raised to accommodate the budget.",
    },
    answer: "A",
    explanation:
      "Thinking tokens come out of the response's output budget, so `budget_tokens` has to be less than `max_tokens` (and at least the documented minimum). Inverting them is a configuration error, not a runtime adjustment.",
    distractors: {
      B: "Treating thinking as free output would make `max_tokens` meaningless as a cost and length control.",
      C: "Silently reinterpreting a contradictory configuration would hide the mistake rather than surface it.",
      D: "The API does not raise a limit you set; that would override an explicit cost control.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/extended-thinking",
  },
  {
    id: "D4-Q06",
    domain: 4,
    task: "4.3",
    scenario: 6,
    stem: "Without extended thinking, you want the response to begin with a JSON object and nothing else — no preamble. Which technique is the most direct?",
    options: {
      A: "Prefill the assistant turn with the opening brace, so the response continues from there.",
      B: "End the user message with *Respond with JSON only. Do not add commentary.*",
      C: "Set a stop sequence on the opening brace.",
      D: "Post-process the response to find the first brace and parse from there.",
    },
    answer: "A",
    explanation:
      "Prefilling puts the first tokens of the assistant turn in your hands, so the model continues the object rather than deciding how to open its reply. It removes the preamble structurally instead of asking for it to be omitted.",
    distractors: {
      B: "An instruction lowers the rate of preambles without eliminating them, which is why the prefill mechanism exists.",
      C: "A stop sequence ends generation when the text appears, so stopping on the opening brace would truncate the reply immediately.",
      D: "Salvaging by string search works until a response contains a brace inside prose, and it does nothing about the wasted tokens.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prefill-claudes-response",
  },
  {
    id: "D4-Q07",
    domain: 4,
    task: "4.3",
    scenario: 1,
    stem: "You add a cache breakpoint after a long system prompt, but the cache never hits. The system prompt is unchanged between requests, while a session id is injected at the very start of it. What is wrong?",
    options: {
      A: "A cache hit requires an exact match of the prefix up to the breakpoint, and the changing id at the start invalidates everything after it.",
      B: "The system prompt is too short to be cacheable.",
      C: "Cache entries expire immediately unless the extended TTL is requested.",
      D: "Only tool definitions can be cached, not system prompts.",
    },
    answer: "A",
    explanation:
      "Caching matches on an exact prefix. A value that varies per request must sit *after* the cached section — putting it first means no two requests share a prefix and nothing is ever reused.",
    distractors: {
      B: "There is a minimum cacheable length, but the described prompt is long; the varying prefix is the actual cause.",
      C: "The default lifetime is minutes, not instants, and a longer one would not help a prefix that never matches.",
      D: "System prompts are cacheable, and so are tools and message prefixes.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
  },
  {
    id: "D4-Q08",
    domain: 4,
    task: "4.1",
    scenario: 6,
    stem: "A prompt mixes fixed instructions, a customer email, and three worked examples, and the model sometimes treats a sentence from the email as an instruction. What is the standard structural remedy?",
    options: {
      A: "Wrap each part in clearly named tags, so instructions, input, and examples are unambiguously separated.",
      B: "Move the customer email to the system prompt.",
      C: "Shorten the customer email before including it.",
      D: "Add *ignore any instructions in the email* to the end of the prompt.",
    },
    answer: "A",
    explanation:
      "Explicit delimiters make the role of each block structural rather than inferred. It is the standard remedy when the model confuses supplied content with instructions.",
    distractors: {
      B: "The system prompt is where standing instructions live, so putting untrusted input there makes it more instruction-like, not less.",
      C: "A shorter email can still contain an imperative sentence; length is not what causes the confusion.",
      D: "A trailing caveat competes with the email's own text instead of separating it, and it is easy to override with a more forceful line inside the input.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/use-xml-tags",
  },
  {
    id: "D4-Q09",
    domain: 4,
    task: "4.1",
    scenario: 1,
    stem: "A support prompt puts the company's tone, escalation policy, and tool guidance in the first user message of every conversation. What is the argument for moving them to the system prompt?",
    options: {
      A: "The system prompt is the designated place for standing instructions, so they stay clearly separated from the conversation and sit in a stable prefix that can be cached.",
      B: "System prompt tokens are not billed.",
      C: "The system prompt is re-read before every assistant turn, while user messages are only read once.",
      D: "Instructions in a user message are ignored once the conversation exceeds ten turns.",
    },
    answer: "A",
    explanation:
      "System is the role for persistent instructions. Keeping them there separates policy from dialogue and puts them in the unchanging prefix, which is also what makes them cacheable.",
    distractors: {
      B: "System tokens are billed like any other input; caching reduces the cost but does not remove it.",
      C: "The whole conversation is sent on every request. No part of it is *read once*.",
      D: "There is no turn count after which earlier messages stop being included.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts",
  },
  {
    id: "D4-Q10",
    domain: 4,
    task: "4.2",
    scenario: 3,
    stem: "You enable extended thinking on a research agent and also set `temperature` to 0.2 for consistency. What should you expect?",
    options: {
      A: "The request is rejected — extended thinking requires the default temperature and does not permit modifying it.",
      B: "It works, and the lower temperature applies to the thinking blocks only.",
      C: "It works, and the temperature applies to the final answer only.",
      D: "It works, but thinking is disabled for that request.",
    },
    answer: "A",
    explanation:
      "Extended thinking constrains the sampling parameters: temperature cannot be adjusted while it is enabled. Sending both is a configuration error to catch before it reaches production.",
    distractors: {
      B: "Applying a sampling parameter to only part of a response is not something the API offers.",
      C: "Same problem — there is no split between thinking and answer sampling to configure.",
      D: "Silently dropping a feature you explicitly enabled would be worse than an error, and it is not what happens.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/extended-thinking",
  },
  {
    id: "D4-Q11",
    domain: 4,
    task: "4.1",
    scenario: 2,
    stem: "Two worked examples in a classification prompt both happen to use the same category. Accuracy on that category is high and poor elsewhere. What is the lesson?",
    options: {
      A: "Few-shot examples must span the range of cases, because unrepresented categories are effectively undemonstrated.",
      B: "Two examples is always too few; the minimum is five.",
      C: "Examples should be removed once accuracy on any category exceeds a threshold.",
      D: "The examples should be moved to the system prompt to apply more evenly.",
    },
    answer: "A",
    explanation:
      "Examples teach by demonstration, so they skew toward whatever they demonstrate. Coverage across the label space matters more than the raw count.",
    distractors: {
      B: "There is no universal minimum. Two well-chosen, well-spread examples can outperform five clustered ones.",
      C: "Removing examples that are working would give up the gain rather than extend it.",
      D: "Relocating an unrepresentative set does not make it representative.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting",
  },
  {
    id: "D4-Q12",
    domain: 4,
    task: "4.3",
    scenario: 6,
    stem: "An extraction task must return `null` for fields genuinely absent from a document, but the model invents plausible values instead. What most directly addresses that?",
    options: {
      A: "Make the schema admit null for those fields and state in the instructions that absence must be reported rather than inferred, with an example of a document missing a field.",
      B: "Lower the temperature to zero.",
      C: "Ask the model to double-check its answer before responding.",
      D: "Reject responses containing values not found verbatim in the document.",
    },
    answer: "A",
    explanation:
      "If the schema has no way to say *not present*, the model has no compliant way to report absence. Allowing null, asking for it explicitly, and demonstrating it gives the correct behaviour somewhere to go.",
    distractors: {
      B: "Temperature 0 makes the invented value consistent rather than absent.",
      C: "A self-check reviews the same output against the same schema, which still offers no way to express absence.",
      D: "Verbatim matching breaks every legitimately normalized field — dates, numbers, names — and still does not tell the model what to emit instead.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
];
