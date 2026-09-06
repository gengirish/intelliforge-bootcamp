/**
 * Domain 2 — Tool Design & MCP Integration (18% of the exam).
 *
 * IntelliForge-authored from the exam blueprint's task statements, the tool-use
 * documentation, and the Model Context Protocol specification.
 */

import type { Question } from "../types";

export const DOMAIN_2: Question[] = [
  {
    id: "D2-Q01",
    domain: 2,
    task: "2.1",
    scenario: 1,
    stem: "Two tools, `get_customer` and `lookup_order`, are each described in a single short sentence. In production the agent frequently calls `get_customer` for order questions. What should you try first?",
    options: {
      A: "Rewrite both descriptions to state what the tool returns, what its inputs mean, and when to use it rather than the other one.",
      B: "Add a routing classifier ahead of the agent that picks the tool from the customer's message.",
      C: "Merge the two tools into one `get_account_data` tool that returns everything.",
      D: "Add ten few-shot examples of correctly routed requests to the system prompt.",
    },
    answer: "A",
    explanation:
      "A tool description is the model's entire specification for that tool. When two descriptions are thin and similar, selection is ambiguous by construction. Expanding them — inputs, outputs, boundaries, and an explicit contrast with the neighbouring tool — is the cheapest change and it addresses the actual cause.",
    distractors: {
      B: "A classifier is a second system to build, host, and keep in sync, added to compensate for a description you have not written yet.",
      C: "Merging removes the choice by removing the capability boundary. It returns data the caller did not ask for and makes permissions coarser.",
      D: "Few-shot examples can help selection, but they patch over an ambiguous specification rather than fixing it, and they cost tokens on every request.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D2-Q02",
    domain: 2,
    task: "2.2",
    scenario: 4,
    stem: "You are exposing a company knowledge base through MCP. The client application decides which documents to attach to a conversation; the model should not be able to pull arbitrary files on its own. Which MCP primitive fits?",
    options: {
      A: "A resource — resources are application-controlled, so the host decides what is exposed to the model.",
      B: "A tool — tools are the only way to surface external data to the model.",
      C: "A prompt — prompts are the primitive for attaching document context.",
      D: "A sampling request, so the server can ask the host for completions over the documents.",
    },
    answer: "A",
    explanation:
      "MCP splits primitives by who is in control. Tools are model-controlled: Claude decides when to invoke them. Resources are application-controlled: the host application selects them and passes them into context. Prompts are user-controlled templates the user invokes deliberately. A host-curated document set is exactly the resource case.",
    distractors: {
      B: "Tools would hand the selection decision to the model, which is the behaviour the requirement rules out.",
      C: "Prompts are user-invoked templates, not a channel for the host to attach data silently.",
      D: "Sampling lets a server request a model completion through the host. It is not a mechanism for exposing documents.",
    },
    docUrl: "https://modelcontextprotocol.io/docs/concepts/resources",
  },
  {
    id: "D2-Q03",
    domain: 2,
    task: "2.1",
    scenario: 6,
    stem: "An extraction pipeline must return an invoice as an object with a fixed set of fields, and downstream code parses it directly. Which approach gives the strongest guarantee that the shape is respected?",
    options: {
      A: "Define a tool whose `input_schema` is the invoice schema and let Claude call it, then read the validated tool input.",
      B: "Ask for JSON in the system prompt and wrap `json.loads` in a try/except with one retry.",
      C: "Ask for JSON and strip any Markdown code fences before parsing.",
      D: "Ask for the fields as a numbered list and parse them positionally.",
    },
    answer: "A",
    explanation:
      "Tool `input_schema` is a JSON Schema the API validates the model's arguments against. Using a tool purely as an output contract turns a formatting request into a structural one, which is why it is the standard way to get reliably parseable output.",
    distractors: {
      B: "A retry loop reduces how often malformed output reaches you; it does not constrain the model's output shape, and it doubles latency when it fires.",
      C: "Fence-stripping fixes one specific formatting habit. It does nothing about a missing field or a string where a number was expected.",
      D: "Positional parsing of prose is the most brittle option of the four — one reordered or omitted line silently corrupts every field after it.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D2-Q04",
    domain: 2,
    task: "2.1",
    scenario: 6,
    stem: "A `create_ticket` tool accepts a `priority` argument. The model supplies values like `urgent`, `P1`, `high` and `critical`, and your backend rejects most of them. What change to the tool fixes this?",
    options: {
      A: "Constrain `priority` in the `input_schema` with an `enum` of the accepted values.",
      B: "Accept any string and map unknown values to a default priority.",
      C: "Add a sentence to the tool description listing the accepted values.",
      D: "Validate the value and return an error so the model retries.",
    },
    answer: "A",
    explanation:
      "The `input_schema` is JSON Schema, and an `enum` makes the permitted set part of the contract the model is given rather than something it has to remember. It is the difference between describing a rule and encoding one.",
    distractors: {
      B: "Silently defaulting turns a caller mistake into a wrong-priority ticket that nobody notices.",
      C: "Prose in the description helps, but it leaves the constraint advisory. The schema field exists precisely to make it binding.",
      D: "An error plus a retry costs a round trip on every miss and still relies on the model reading the message correctly.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D2-Q05",
    domain: 2,
    task: "2.2",
    scenario: 2,
    stem: "Your team wants a reusable, user-invoked template — *summarize this pull request in our house format* — exposed from an MCP server. Which primitive is it?",
    options: {
      A: "A prompt, which is user-controlled and surfaced for the user to invoke deliberately.",
      B: "A tool, so Claude can decide when a summary is needed.",
      C: "A resource, so the template is attached to the conversation as context.",
      D: "A sampling request back to the host.",
    },
    answer: "A",
    explanation:
      "MCP prompts are parameterised templates the user chooses to run — typically surfaced in the client as a command. That matches a house-format summary the user asks for on purpose.",
    distractors: {
      B: "A tool would let the model decide to summarize unprompted, which is not what a user-invoked template means.",
      C: "A resource supplies data to the context. The template here is an action the user triggers, not a document.",
      D: "Sampling lets a server ask the host for a completion. It is not a mechanism for publishing a reusable template.",
    },
    docUrl: "https://modelcontextprotocol.io/docs/concepts/prompts",
  },
  {
    id: "D2-Q06",
    domain: 2,
    task: "2.2",
    scenario: 4,
    stem: "An MCP server runs as a local subprocess on the developer's own machine, launched by the client. Which transport does that describe?",
    options: {
      A: "stdio, where the client spawns the server and they exchange messages over standard input and output.",
      B: "Streamable HTTP, since local servers still speak HTTP over the loopback interface.",
      C: "WebSocket, which MCP uses for all bidirectional local transport.",
      D: "Unix domain sockets, the required transport for same-machine servers.",
    },
    answer: "A",
    explanation:
      "stdio is MCP's transport for locally launched servers: the client starts the process and talks to it over stdin/stdout. Remote or shared servers use the HTTP transport instead.",
    distractors: {
      B: "The HTTP transport exists, but it is for servers reached over a network rather than spawned as a child process.",
      C: "WebSocket is not the defined transport for a client-launched local server.",
      D: "Nothing in MCP requires Unix domain sockets, and they would not work on every supported platform.",
    },
    docUrl: "https://modelcontextprotocol.io/docs/concepts/transports",
  },
  {
    id: "D2-Q07",
    domain: 2,
    task: "2.1",
    scenario: 6,
    stem: "A `search_documents` tool can return several megabytes of matched text. Feeding that straight back blows the context window. What is the right tool design?",
    options: {
      A: "Return a bounded page of results with identifiers and short snippets, and provide a second tool that fetches one document in full.",
      B: "Return everything and let the client truncate the result before it reaches the model.",
      C: "Return only the single best match, so the size is always small.",
      D: "Summarize the matches with a model call inside the tool and return the summary.",
    },
    answer: "A",
    explanation:
      "Splitting search from retrieval keeps every tool result small and predictable, and it lets the model spend its context only on the documents it actually decides to read.",
    distractors: {
      B: "Truncating at an arbitrary byte boundary discards results with no signal about what was lost, and often cuts a document in half.",
      C: "One result makes the tool useless for any question whose answer spans several documents, and it hides how much else matched.",
      D: "A hidden model call inside a tool adds latency and cost to every search and quietly loses detail the agent may have needed.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D2-Q08",
    domain: 2,
    task: "2.1",
    scenario: 1,
    stem: "A `process_refund` tool is occasionally invoked twice for the same order when a network retry duplicates the call. What property should the tool have?",
    options: {
      A: "Idempotency — accept a caller-supplied key so a repeated call for the same refund returns the original result instead of issuing a second one.",
      B: "A confirmation argument the model must set to true on the second attempt.",
      C: "A rate limit of one refund per order per minute.",
      D: "A longer timeout, so retries are less likely to be triggered.",
    },
    answer: "A",
    explanation:
      "Retries are a fact of any networked system, so a money-moving operation has to be safe to repeat. An idempotency key makes the second call a no-op that returns the first result.",
    distractors: {
      B: "This puts the safety of a financial operation in the model's hands, and a duplicate caused by a network retry never reaches the model at all.",
      C: "A time window narrows the race without closing it, and it blocks legitimate distinct refunds on the same order.",
      D: "A longer timeout changes how often duplicates occur. It does not make one harmless when it does.",
    },
    docUrl: "https://platform.claude.com/docs/en/api/errors",
  },
  {
    id: "D2-Q09",
    domain: 2,
    task: "2.1",
    scenario: 4,
    stem: "You are deciding between one `manage_file` tool with a `mode` argument of read, write, or delete, and three separate tools. Which is the better design and why?",
    options: {
      A: "Three tools, because each gets its own description and schema, and permissions can be granted for reading without also granting deletion.",
      B: "One tool, because a smaller tool list makes selection easier for the model.",
      C: "One tool, because it guarantees consistent argument names across the operations.",
      D: "Three tools, because the API limits how many arguments a single tool may take.",
    },
    answer: "A",
    explanation:
      "Distinct capabilities want distinct tools. Each carries its own guidance and its own schema, and — the decisive point — an allowlist can include the read tool while excluding the destructive one, which a mode argument makes impossible.",
    distractors: {
      B: "Fewer tools is not automatically clearer; a single overloaded tool hides three different contracts behind one description.",
      C: "Consistent naming is achievable across separate tools and is not worth collapsing a permission boundary for.",
      D: "There is no such argument limit, so this is the right conclusion supported by a made-up reason.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
  {
    id: "D2-Q10",
    domain: 2,
    task: "2.2",
    scenario: 5,
    stem: "Two MCP servers configured in the same project each expose a tool called `search`. What is the practical consequence to design around?",
    options: {
      A: "Tools are namespaced by their server, so both remain callable — but their descriptions must make the difference clear or the model will pick between them badly.",
      B: "The second server fails to connect, since tool names must be globally unique.",
      C: "The client silently drops one of the two tools.",
      D: "Both tools are merged into one whose arguments are the union of both schemas.",
    },
    answer: "A",
    explanation:
      "Server-qualified naming keeps both tools available, which moves the problem from a collision to a selection one: two tools called `search` need descriptions that say what each one searches.",
    distractors: {
      B: "Names are scoped per server precisely so independent servers do not have to coordinate on naming.",
      C: "Dropping a configured tool without telling anyone would be a silent capability loss, not the defined behaviour.",
      D: "Merging schemas from unrelated servers would produce a tool matching neither backend.",
    },
    docUrl: "https://code.claude.com/docs/en/mcp",
  },
  {
    id: "D2-Q11",
    domain: 2,
    task: "2.1",
    scenario: 6,
    stem: "A tool's description reads, in full: *Gets data for a user.* Which rewrite most improves selection and argument quality?",
    options: {
      A: "State what it returns, what each argument accepts with an example, when to use it, and when to use a neighbouring tool instead.",
      B: "Add the tool's HTTP endpoint and authentication requirements.",
      C: "Add the average latency and the backend service that owns it.",
      D: "Rename it to `get_user_data_v2` so its purpose is clearer from the name.",
    },
    answer: "A",
    explanation:
      "The model chooses a tool and fills its arguments from the description alone. Returns, argument formats with examples, and an explicit boundary against the nearest alternative are what actually change both decisions.",
    distractors: {
      B: "Endpoints and auth are the caller's concern; the model never issues the request itself.",
      C: "Operational metadata does not help the model decide whether this tool answers the question in front of it.",
      D: "A longer name carries a fraction of the information a description can, and a version suffix says nothing about behaviour.",
    },
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/tool-use",
  },
];
