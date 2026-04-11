import type { ContextSentence } from "./types";

/**
 * Context sentences mapped by answer word.
 * Each sentence has a weak/vague word that should be replaced
 * with the precise vocabulary word.
 */
export const CONTEXT_SENTENCES: Record<string, ContextSentence[]> = {
  nuanced: [
    {
      sentence: "Her understanding of the situation was very **detailed** and showed awareness of all sides.",
      weakWord: "detailed",
      answer: "nuanced",
      distractors: ["verbose", "complex", "thorough"],
    },
    {
      sentence: "The debate requires a more **careful** approach than simply picking a side.",
      weakWord: "careful",
      answer: "nuanced",
      distractors: ["cautious", "deliberate", "measured"],
    },
  ],
  deliberate: [
    {
      sentence: "Every word in his speech felt **planned** and full of purpose.",
      weakWord: "planned",
      answer: "deliberate",
      distractors: ["prepared", "rehearsed", "calculated"],
    },
  ],
  compelling: [
    {
      sentence: "She made a really **good** case for why the project should continue.",
      weakWord: "good",
      answer: "compelling",
      distractors: ["decent", "solid", "strong"],
    },
    {
      sentence: "The evidence was **interesting** enough to change the jury's mind.",
      weakWord: "interesting",
      answer: "compelling",
      distractors: ["notable", "curious", "engaging"],
    },
  ],
  substantive: [
    {
      sentence: "The meeting finally produced some **real** results after weeks of stalling.",
      weakWord: "real",
      answer: "substantive",
      distractors: ["actual", "concrete", "tangible"],
    },
  ],
  pragmatic: [
    {
      sentence: "We need a **practical** solution, not a theoretical one.",
      weakWord: "practical",
      answer: "pragmatic",
      distractors: ["simple", "useful", "realistic"],
    },
  ],
  candid: [
    {
      sentence: "I appreciate your **honest** feedback on my presentation.",
      weakWord: "honest",
      answer: "candid",
      distractors: ["direct", "blunt", "sincere"],
    },
  ],
  concise: [
    {
      sentence: "Keep your emails **short** — no one reads long messages.",
      weakWord: "short",
      answer: "concise",
      distractors: ["brief", "quick", "simple"],
    },
  ],
  cogent: [
    {
      sentence: "He presented a very **convincing** argument at the board meeting.",
      weakWord: "convincing",
      answer: "cogent",
      distractors: ["compelling", "strong", "valid"],
    },
  ],
  salient: [
    {
      sentence: "The most **important** point in the report was buried on page twelve.",
      weakWord: "important",
      answer: "salient",
      distractors: ["key", "critical", "major"],
    },
  ],
  tenuous: [
    {
      sentence: "The connection between the two incidents is very **weak** at best.",
      weakWord: "weak",
      answer: "tenuous",
      distractors: ["fragile", "slim", "faint"],
    },
  ],
  pervasive: [
    {
      sentence: "There's a **widespread** feeling of burnout across the organization.",
      weakWord: "widespread",
      answer: "pervasive",
      distractors: ["common", "general", "broad"],
    },
  ],
  exacerbate: [
    {
      sentence: "The new policy will only **worsen** the existing supply chain problems.",
      weakWord: "worsen",
      answer: "exacerbate",
      distractors: ["increase", "deepen", "intensify"],
    },
  ],
  mitigate: [
    {
      sentence: "We need to **reduce** the risk before moving to production.",
      weakWord: "reduce",
      answer: "mitigate",
      distractors: ["minimize", "lower", "decrease"],
    },
  ],
  precipitate: [
    {
      sentence: "The CEO's resignation **caused** a wave of executive departures.",
      weakWord: "caused",
      answer: "precipitated",
      distractors: ["triggered", "started", "led to"],
    },
  ],
  delineate: [
    {
      sentence: "The contract should clearly **define** each party's responsibilities.",
      weakWord: "define",
      answer: "delineate",
      distractors: ["describe", "outline", "state"],
    },
  ],
  substantiate: [
    {
      sentence: "Can you **prove** that claim with actual data?",
      weakWord: "prove",
      answer: "substantiate",
      distractors: ["support", "back up", "confirm"],
    },
  ],
  elucidate: [
    {
      sentence: "Could you **explain** the reasoning behind this decision?",
      weakWord: "explain",
      answer: "elucidate",
      distractors: ["describe", "clarify", "discuss"],
    },
  ],
  contingent: [
    {
      sentence: "The deal is **dependent** on board approval by Friday.",
      weakWord: "dependent",
      answer: "contingent",
      distractors: ["reliant", "conditional", "based"],
    },
  ],
  efficacy: [
    {
      sentence: "The **effectiveness** of the new training program is still unproven.",
      weakWord: "effectiveness",
      answer: "efficacy",
      distractors: ["usefulness", "value", "impact"],
    },
  ],
  disparity: [
    {
      sentence: "The **difference** between the two teams' budgets was striking.",
      weakWord: "difference",
      answer: "disparity",
      distractors: ["gap", "contrast", "variation"],
    },
  ],
  catalyst: [
    {
      sentence: "The incident was the **cause** of a complete policy overhaul.",
      weakWord: "cause",
      answer: "catalyst",
      distractors: ["reason", "trigger", "source"],
    },
  ],
  cursory: [
    {
      sentence: "He gave the document only a **quick** glance before signing.",
      weakWord: "quick",
      answer: "cursory",
      distractors: ["brief", "fast", "hasty"],
    },
  ],
  amenable: [
    {
      sentence: "The client was **open** to our revised timeline.",
      weakWord: "open",
      answer: "amenable",
      distractors: ["receptive", "agreeable", "willing"],
    },
  ],
  equivocal: [
    {
      sentence: "His **unclear** response left everyone unsure of his position.",
      weakWord: "unclear",
      answer: "equivocal",
      distractors: ["vague", "ambiguous", "confusing"],
    },
  ],
  perfunctory: [
    {
      sentence: "His **halfhearted** apology did nothing to ease the tension.",
      weakWord: "halfhearted",
      answer: "perfunctory",
      distractors: ["weak", "insincere", "mechanical"],
    },
  ],
  tantamount: [
    {
      sentence: "Ignoring the warning signs is basically **equal** to negligence.",
      weakWord: "equal",
      answer: "tantamount",
      distractors: ["similar", "close", "equivalent"],
    },
  ],
  lucid: [
    {
      sentence: "Her explanation was remarkably **clear** despite the complex topic.",
      weakWord: "clear",
      answer: "lucid",
      distractors: ["simple", "plain", "straightforward"],
    },
  ],
  ostensible: [
    {
      sentence: "The **supposed** reason for the meeting was budget review, but layoffs were discussed.",
      weakWord: "supposed",
      answer: "ostensible",
      distractors: ["apparent", "alleged", "claimed"],
    },
  ],
  nebulous: [
    {
      sentence: "The project goals remain **vague** — we need concrete requirements.",
      weakWord: "vague",
      answer: "nebulous",
      distractors: ["unclear", "fuzzy", "hazy"],
    },
  ],
  ubiquitous: [
    {
      sentence: "Smartphones have become **everywhere** in the modern workplace.",
      weakWord: "everywhere",
      answer: "ubiquitous",
      distractors: ["common", "universal", "standard"],
    },
  ],
  superfluous: [
    {
      sentence: "Remove any **unnecessary** steps from the process.",
      weakWord: "unnecessary",
      answer: "superfluous",
      distractors: ["extra", "redundant", "unneeded"],
    },
  ],
  galvanize: [
    {
      sentence: "The safety incident **motivated** the team into updating all procedures.",
      weakWord: "motivated",
      answer: "galvanized",
      distractors: ["pushed", "inspired", "encouraged"],
    },
  ],
  volatile: [
    {
      sentence: "The market has been very **unstable** since the announcement.",
      weakWord: "unstable",
      answer: "volatile",
      distractors: ["unpredictable", "chaotic", "erratic"],
    },
  ],
  nascent: [
    {
      sentence: "The **new** AI team is already producing impressive results.",
      weakWord: "new",
      answer: "nascent",
      distractors: ["young", "fresh", "emerging"],
    },
  ],
  abstraction: [
    {
      sentence: "Talking about justice as just a **general idea** makes it hard to implement in policy.",
      weakWord: "general idea",
      answer: "abstraction",
      distractors: ["concept", "theory", "notion"],
    },
  ],
  acute: [
    {
      sentence: "The hospital is struggling with a very **serious** shortage of nurses.",
      weakWord: "serious",
      answer: "acute",
      distractors: ["severe", "critical", "urgent"],
    },
  ],
  adversity: [
    {
      sentence: "She built her resilience by pushing through **hard times** early in her career.",
      weakWord: "hard times",
      answer: "adversity",
      distractors: ["hardship", "struggle", "difficulty"],
    },
  ],
  alleviate: [
    {
      sentence: "The new software should **ease** some of the manual work for the team.",
      weakWord: "ease",
      answer: "alleviate",
      distractors: ["reduce", "minimize", "lessen"],
    },
  ],
  ambiguous: [
    {
      sentence: "The instructions were **unclear** and led to three different interpretations.",
      weakWord: "unclear",
      answer: "ambiguous",
      distractors: ["confusing", "vague", "muddled"],
    },
  ],
  ambivalent: [
    {
      sentence: "She felt **unsure** about accepting the promotion — excited but also nervous.",
      weakWord: "unsure",
      answer: "ambivalent",
      distractors: ["conflicted", "hesitant", "uncertain"],
    },
  ],
  ameliorate: [
    {
      sentence: "New regulations were introduced to **improve** conditions in the warehouses.",
      weakWord: "improve",
      answer: "ameliorate",
      distractors: ["fix", "enhance", "correct"],
    },
  ],
  analytical: [
    {
      sentence: "We need someone with a **logical** mind to interpret all this data.",
      weakWord: "logical",
      answer: "analytical",
      distractors: ["systematic", "methodical", "sharp"],
    },
  ],
  anomalous: [
    {
      sentence: "The sensor readings were **strange** and didn't match any expected pattern.",
      weakWord: "strange",
      answer: "anomalous",
      distractors: ["unusual", "irregular", "odd"],
    },
  ],
  antithesis: [
    {
      sentence: "Her laid-back style is the complete **opposite** of the company's intense culture.",
      weakWord: "opposite",
      answer: "antithesis",
      distractors: ["contrast", "reverse", "negation"],
    },
  ],
  apprehensive: [
    {
      sentence: "He was **nervous** about presenting to the executive team for the first time.",
      weakWord: "nervous",
      answer: "apprehensive",
      distractors: ["worried", "anxious", "uneasy"],
    },
  ],
  arbitrary: [
    {
      sentence: "The deadline felt completely **random** — no one could explain the reasoning.",
      weakWord: "random",
      answer: "arbitrary",
      distractors: ["inconsistent", "unreasonable", "capricious"],
    },
  ],
  ardent: [
    {
      sentence: "She is a very **passionate** supporter of environmental reform.",
      weakWord: "passionate",
      answer: "ardent",
      distractors: ["devoted", "fervent", "enthusiastic"],
    },
  ],
  articulate: [
    {
      sentence: "He was able to **clearly express** his concerns without offending anyone.",
      weakWord: "clearly express",
      answer: "articulate",
      distractors: ["communicate", "convey", "voice"],
    },
  ],
  aspiration: [
    {
      sentence: "Her long-term **goal** is to lead a team of researchers at a top university.",
      weakWord: "goal",
      answer: "aspiration",
      distractors: ["ambition", "aim", "dream"],
    },
  ],
  assertive: [
    {
      sentence: "In negotiations, you need to be **confident** about stating your needs.",
      weakWord: "confident",
      answer: "assertive",
      distractors: ["direct", "firm", "forceful"],
    },
  ],
  astute: [
    {
      sentence: "She made a very **smart** observation that everyone else had missed.",
      weakWord: "smart",
      answer: "astute",
      distractors: ["sharp", "shrewd", "perceptive"],
    },
  ],
  attribute: [
    {
      sentence: "Researchers **linked** the drop in performance to a lack of sleep.",
      weakWord: "linked",
      answer: "attributed",
      distractors: ["connected", "credited", "assigned"],
    },
  ],
  attrition: [
    {
      sentence: "The company lost a quarter of its staff through natural **turnover** last year.",
      weakWord: "turnover",
      answer: "attrition",
      distractors: ["departure", "loss", "reduction"],
    },
  ],
  augment: [
    {
      sentence: "We're looking for ways to **boost** the team's capacity without hiring.",
      weakWord: "boost",
      answer: "augment",
      distractors: ["expand", "increase", "supplement"],
    },
  ],
  authentic: [
    {
      sentence: "Customers respond well to brands that feel **genuine** rather than polished.",
      weakWord: "genuine",
      answer: "authentic",
      distractors: ["real", "honest", "sincere"],
    },
  ],
  benevolent: [
    {
      sentence: "The **kind** manager always made time to mentor junior employees.",
      weakWord: "kind",
      answer: "benevolent",
      distractors: ["generous", "caring", "compassionate"],
    },
  ],
  candor: [
    {
      sentence: "I appreciated her **honesty** when she told me the pitch wasn't working.",
      weakWord: "honesty",
      answer: "candor",
      distractors: ["frankness", "openness", "directness"],
    },
  ],
  captivating: [
    {
      sentence: "His opening story was so **interesting** that the room fell completely silent.",
      weakWord: "interesting",
      answer: "captivating",
      distractors: ["engaging", "gripping", "compelling"],
    },
  ],
  circumvent: [
    {
      sentence: "They found a way to **get around** the approval process entirely.",
      weakWord: "get around",
      answer: "circumvent",
      distractors: ["bypass", "sidestep", "avoid"],
    },
  ],
  coalesce: [
    {
      sentence: "Several small movements **came together** to form a unified political force.",
      weakWord: "came together",
      answer: "coalesce",
      distractors: ["merged", "united", "combined"],
    },
  ],
  codify: [
    {
      sentence: "It's time to **write down** these informal practices into official policy.",
      weakWord: "write down",
      answer: "codify",
      distractors: ["formalize", "document", "record"],
    },
  ],
  coherent: [
    {
      sentence: "Please revise the proposal so the argument is more **logical** from start to finish.",
      weakWord: "logical",
      answer: "coherent",
      distractors: ["consistent", "organized", "clear"],
    },
  ],
  complacent: [
    {
      sentence: "After years of success, the team became **too comfortable** and stopped innovating.",
      weakWord: "too comfortable",
      answer: "complacent",
      distractors: ["careless", "lazy", "satisfied"],
    },
  ],
  composure: [
    {
      sentence: "Despite the chaos, she maintained her **calm** throughout the press conference.",
      weakWord: "calm",
      answer: "composure",
      distractors: ["poise", "control", "steadiness"],
    },
  ],
  comprehensive: [
    {
      sentence: "The audit gave us a very **thorough** view of the company's finances.",
      weakWord: "thorough",
      answer: "comprehensive",
      distractors: ["complete", "extensive", "detailed"],
    },
  ],
  conducive: [
    {
      sentence: "Open offices aren't always **helpful** for deep, focused work.",
      weakWord: "helpful",
      answer: "conducive",
      distractors: ["favorable", "suitable", "supportive"],
    },
  ],
  conjecture: [
    {
      sentence: "Without hard data, we're just **guessing** about what caused the outage.",
      weakWord: "guessing",
      answer: "conjecture",
      distractors: ["speculation", "assumption", "hypothesis"],
    },
  ],
  consolidate: [
    {
      sentence: "We need to **combine** the three reports into a single document.",
      weakWord: "combine",
      answer: "consolidate",
      distractors: ["merge", "unify", "integrate"],
    },
  ],
  criterion: [
    {
      sentence: "The main **standard** for evaluation is whether the design meets user needs.",
      weakWord: "standard",
      answer: "criterion",
      distractors: ["measure", "benchmark", "requirement"],
    },
  ],
  crucial: [
    {
      sentence: "Getting user feedback at this stage is absolutely **important** to the project's success.",
      weakWord: "important",
      answer: "crucial",
      distractors: ["essential", "vital", "critical"],
    },
  ],
  cultivate: [
    {
      sentence: "Good leaders **build** a culture of trust within their teams.",
      weakWord: "build",
      answer: "cultivate",
      distractors: ["develop", "foster", "nurture"],
    },
  ],
  deduce: [
    {
      sentence: "From the evidence left behind, the detective was able to **figure out** what happened.",
      weakWord: "figure out",
      answer: "deduce",
      distractors: ["infer", "conclude", "determine"],
    },
  ],
  deference: [
    {
      sentence: "Junior staff often show **respect** to senior engineers, even when they disagree.",
      weakWord: "respect",
      answer: "deference",
      distractors: ["submission", "reverence", "regard"],
    },
  ],
  demarcate: [
    {
      sentence: "The contract should clearly **divide** the responsibilities of each team.",
      weakWord: "divide",
      answer: "demarcate",
      distractors: ["separate", "distinguish", "define"],
    },
  ],
  detrimental: [
    {
      sentence: "Excessive screen time can be **harmful** to children's development.",
      weakWord: "harmful",
      answer: "detrimental",
      distractors: ["damaging", "negative", "bad"],
    },
  ],
  devastated: [
    {
      sentence: "The team was completely **crushed** when the product launch was cancelled.",
      weakWord: "crushed",
      answer: "devastated",
      distractors: ["shattered", "heartbroken", "destroyed"],
    },
  ],
  dichotomy: [
    {
      sentence: "There's a clear **divide** between those who support remote work and those who prefer the office.",
      weakWord: "divide",
      answer: "dichotomy",
      distractors: ["contrast", "split", "conflict"],
    },
  ],
  diligent: [
    {
      sentence: "She is one of the most **hardworking** researchers in the department.",
      weakWord: "hardworking",
      answer: "diligent",
      distractors: ["dedicated", "thorough", "industrious"],
    },
  ],
  dimension: [
    {
      sentence: "We hadn't considered the ethical **aspect** of the project until last week.",
      weakWord: "aspect",
      answer: "dimension",
      distractors: ["factor", "angle", "element"],
    },
  ],
  diminish: [
    {
      sentence: "Constant interruptions **reduce** your ability to do deep work.",
      weakWord: "reduce",
      answer: "diminish",
      distractors: ["weaken", "undermine", "lower"],
    },
  ],
  disambiguate: [
    {
      sentence: "We need to **clarify** whether 'user' refers to the buyer or the end consumer.",
      weakWord: "clarify",
      answer: "disambiguate",
      distractors: ["specify", "define", "distinguish"],
    },
  ],
  discernment: [
    {
      sentence: "Hiring the right people requires good **judgment** about character, not just skills.",
      weakWord: "judgment",
      answer: "discernment",
      distractors: ["insight", "wisdom", "perception"],
    },
  ],
  discrepancy: [
    {
      sentence: "There's a **gap** between what the team reported and what the data shows.",
      weakWord: "gap",
      answer: "discrepancy",
      distractors: ["mismatch", "inconsistency", "difference"],
    },
  ],
  disenchanted: [
    {
      sentence: "After two years of broken promises, the staff grew **disillusioned** with management.",
      weakWord: "disillusioned",
      answer: "disenchanted",
      distractors: ["disappointed", "frustrated", "cynical"],
    },
  ],
  elaborate: [
    {
      sentence: "Could you **expand on** that point? I think there's more to unpack.",
      weakWord: "expand on",
      answer: "elaborate",
      distractors: ["explain", "clarify", "develop"],
    },
  ],
  elated: [
    {
      sentence: "The team was absolutely **thrilled** when they won the contract.",
      weakWord: "thrilled",
      answer: "elated",
      distractors: ["overjoyed", "ecstatic", "delighted"],
    },
  ],
  emphatic: [
    {
      sentence: "She was very **strong** in her refusal to compromise on the timeline.",
      weakWord: "strong",
      answer: "emphatic",
      distractors: ["forceful", "firm", "insistent"],
    },
  ],
  emulate: [
    {
      sentence: "Junior designers often try to **copy** the style of designers they admire.",
      weakWord: "copy",
      answer: "emulate",
      distractors: ["imitate", "mirror", "replicate"],
    },
  ],
  endeavor: [
    {
      sentence: "Starting a business is a challenging **effort** that requires real commitment.",
      weakWord: "effort",
      answer: "endeavor",
      distractors: ["undertaking", "pursuit", "venture"],
    },
  ],
  ephemeral: [
    {
      sentence: "Social media trends are **short-lived** — what's popular today is gone tomorrow.",
      weakWord: "short-lived",
      answer: "ephemeral",
      distractors: ["fleeting", "temporary", "transient"],
    },
  ],
  equanimity: [
    {
      sentence: "He handled the bad news with remarkable **calmness** and didn't miss a beat.",
      weakWord: "calmness",
      answer: "equanimity",
      distractors: ["composure", "serenity", "balance"],
    },
  ],
  erratic: [
    {
      sentence: "His **unpredictable** behavior made it hard for the team to plan around him.",
      weakWord: "unpredictable",
      answer: "erratic",
      distractors: ["inconsistent", "chaotic", "unstable"],
    },
  ],
  exasperated: [
    {
      sentence: "She let out a sigh, clearly **frustrated** by the third system failure that week.",
      weakWord: "frustrated",
      answer: "exasperated",
      distractors: ["annoyed", "irritated", "fed up"],
    },
  ],
  exceptional: [
    {
      sentence: "The team delivered an **outstanding** performance under extremely tight deadlines.",
      weakWord: "outstanding",
      answer: "exceptional",
      distractors: ["remarkable", "extraordinary", "excellent"],
    },
  ],
  expedient: [
    {
      sentence: "Cutting the testing phase might be **useful** short-term, but risky long-term.",
      weakWord: "useful",
      answer: "expedient",
      distractors: ["convenient", "practical", "efficient"],
    },
  ],
  explicit: [
    {
      sentence: "The guidelines need to be more **direct** so there's no room for misinterpretation.",
      weakWord: "direct",
      answer: "explicit",
      distractors: ["specific", "clear", "precise"],
    },
  ],
  exquisite: [
    {
      sentence: "The architect paid **perfect** attention to every detail in the building's design.",
      weakWord: "perfect",
      answer: "exquisite",
      distractors: ["flawless", "elegant", "refined"],
    },
  ],
  extrapolate: [
    {
      sentence: "Based on current growth, we can **predict** where the company will be in five years.",
      weakWord: "predict",
      answer: "extrapolate",
      distractors: ["estimate", "project", "forecast"],
    },
  ],
  facilitate: [
    {
      sentence: "The new platform will **help** cross-team collaboration and reduce email volume.",
      weakWord: "help",
      answer: "facilitate",
      distractors: ["enable", "support", "streamline"],
    },
  ],
  feasible: [
    {
      sentence: "Given the budget constraints, is a full redesign even **possible** by Q3?",
      weakWord: "possible",
      answer: "feasible",
      distractors: ["realistic", "achievable", "viable"],
    },
  ],
  formidable: [
    {
      sentence: "They're up against a **tough** competitor with decades of market experience.",
      weakWord: "tough",
      answer: "formidable",
      distractors: ["powerful", "imposing", "daunting"],
    },
  ],
  fortitude: [
    {
      sentence: "It takes real **strength** to keep going when everything is working against you.",
      weakWord: "strength",
      answer: "fortitude",
      distractors: ["courage", "resilience", "grit"],
    },
  ],
  fundamental: [
    {
      sentence: "Trust is a **basic** requirement for any productive working relationship.",
      weakWord: "basic",
      answer: "fundamental",
      distractors: ["essential", "core", "primary"],
    },
  ],
  implement: [
    {
      sentence: "The board voted to **put in place** the new expense policy starting next month.",
      weakWord: "put in place",
      answer: "implement",
      distractors: ["adopt", "introduce", "enforce"],
    },
  ],
  implicit: [
    {
      sentence: "There was an **understood** agreement that overtime wouldn't be compensated.",
      weakWord: "understood",
      answer: "implicit",
      distractors: ["implied", "assumed", "unspoken"],
    },
  ],
  inadvertent: [
    {
      sentence: "The data breach was **accidental** — no one intended to expose the files.",
      weakWord: "accidental",
      answer: "inadvertent",
      distractors: ["unintentional", "unplanned", "careless"],
    },
  ],
  indignant: [
    {
      sentence: "She was visibly **angry** when her idea was dismissed without explanation.",
      weakWord: "angry",
      answer: "indignant",
      distractors: ["offended", "outraged", "resentful"],
    },
  ],
  indispensable: [
    {
      sentence: "Her technical knowledge made her **essential** to every major product decision.",
      weakWord: "essential",
      answer: "indispensable",
      distractors: ["invaluable", "critical", "irreplaceable"],
    },
  ],
  ineffable: [
    {
      sentence: "The feeling of holding your newborn for the first time is almost **impossible to describe**.",
      weakWord: "impossible to describe",
      answer: "ineffable",
      distractors: ["indescribable", "overwhelming", "beyond words"],
    },
  ],
  inevitable: [
    {
      sentence: "Given the trend lines, consolidation in the industry seems **certain**.",
      weakWord: "certain",
      answer: "inevitable",
      distractors: ["unavoidable", "predictable", "guaranteed"],
    },
  ],
  ingenuity: [
    {
      sentence: "Solving this problem will take real **creativity** — there's no off-the-shelf fix.",
      weakWord: "creativity",
      answer: "ingenuity",
      distractors: ["cleverness", "innovation", "resourcefulness"],
    },
  ],
  inherent: [
    {
      sentence: "There is a **built-in** conflict of interest when executives set their own pay.",
      weakWord: "built-in",
      answer: "inherent",
      distractors: ["fundamental", "intrinsic", "natural"],
    },
  ],
  innovative: [
    {
      sentence: "The startup introduced a **fresh** approach to expense management that no one had tried before.",
      weakWord: "fresh",
      answer: "innovative",
      distractors: ["creative", "novel", "original"],
    },
  ],
  integrate: [
    {
      sentence: "We need to **combine** the new tool with the existing workflow smoothly.",
      weakWord: "combine",
      answer: "integrate",
      distractors: ["merge", "connect", "incorporate"],
    },
  ],
  interpolate: [
    {
      sentence: "We can **estimate** the missing data points from the values on either side.",
      weakWord: "estimate",
      answer: "interpolate",
      distractors: ["calculate", "infer", "fill in"],
    },
  ],
  intricate: [
    {
      sentence: "The supply chain is so **complex** that one delay can cascade through the whole system.",
      weakWord: "complex",
      answer: "intricate",
      distractors: ["complicated", "detailed", "elaborate"],
    },
  ],
  introspective: [
    {
      sentence: "After the setback, he became very **self-reflective** about his leadership style.",
      weakWord: "self-reflective",
      answer: "introspective",
      distractors: ["thoughtful", "contemplative", "inward-looking"],
    },
  ],
  juxtaposition: [
    {
      sentence: "The **contrast** between the luxury hotel and the poverty outside was jarring.",
      weakWord: "contrast",
      answer: "juxtaposition",
      distractors: ["comparison", "difference", "pairing"],
    },
  ],
  leverage: [
    {
      sentence: "We should **use** our existing customer relationships to open new markets.",
      weakWord: "use",
      answer: "leverage",
      distractors: ["exploit", "apply", "capitalize on"],
    },
  ],
  luminous: [
    {
      sentence: "The speaker had a **bright** presence that lit up the whole auditorium.",
      weakWord: "bright",
      answer: "luminous",
      distractors: ["radiant", "glowing", "brilliant"],
    },
  ],
  magnanimous: [
    {
      sentence: "After winning the debate, she was **generous** in acknowledging her opponent's points.",
      weakWord: "generous",
      answer: "magnanimous",
      distractors: ["gracious", "noble", "big-hearted"],
    },
  ],
  mechanism: [
    {
      sentence: "We need a clear **system** for escalating issues before they become crises.",
      weakWord: "system",
      answer: "mechanism",
      distractors: ["process", "procedure", "method"],
    },
  ],
  melancholy: [
    {
      sentence: "There was a quiet **sadness** in his voice when he talked about the old team.",
      weakWord: "sadness",
      answer: "melancholy",
      distractors: ["nostalgia", "sorrow", "wistfulness"],
    },
  ],
  metamorphosis: [
    {
      sentence: "The company underwent a complete **change** after the new CEO took over.",
      weakWord: "change",
      answer: "metamorphosis",
      distractors: ["transformation", "overhaul", "reinvention"],
    },
  ],
  methodical: [
    {
      sentence: "Her **systematic** approach to debugging saved the team hours of guesswork.",
      weakWord: "systematic",
      answer: "methodical",
      distractors: ["organized", "careful", "thorough"],
    },
  ],
  meticulous: [
    {
      sentence: "He was extremely **careful** about checking every number before submitting the report.",
      weakWord: "careful",
      answer: "meticulous",
      distractors: ["precise", "thorough", "detailed"],
    },
  ],
  nuance: [
    {
      sentence: "The translation lost a lot of the **subtlety** that made the original so powerful.",
      weakWord: "subtlety",
      answer: "nuance",
      distractors: ["detail", "depth", "complexity"],
    },
  ],
  paradigm: [
    {
      sentence: "Remote work has become the new **model** for how companies structure their teams.",
      weakWord: "model",
      answer: "paradigm",
      distractors: ["standard", "framework", "approach"],
    },
  ],
  paradox: [
    {
      sentence: "It's an interesting **contradiction** that more choices often lead to less satisfaction.",
      weakWord: "contradiction",
      answer: "paradox",
      distractors: ["irony", "puzzle", "anomaly"],
    },
  ],
  paramount: [
    {
      sentence: "User safety must remain **most important** throughout the design process.",
      weakWord: "most important",
      answer: "paramount",
      distractors: ["primary", "supreme", "essential"],
    },
  ],
  perceptive: [
    {
      sentence: "She made a very **sharp** observation about the power dynamics in the room.",
      weakWord: "sharp",
      answer: "perceptive",
      distractors: ["astute", "insightful", "observant"],
    },
  ],
  perspective: [
    {
      sentence: "Bringing in an outside consultant gave us a fresh **view** on the problem.",
      weakWord: "view",
      answer: "perspective",
      distractors: ["angle", "insight", "outlook"],
    },
  ],
  pertinent: [
    {
      sentence: "Please only include information that is **relevant** to the decision at hand.",
      weakWord: "relevant",
      answer: "pertinent",
      distractors: ["applicable", "related", "appropriate"],
    },
  ],
  pivotal: [
    {
      sentence: "This meeting is a **key** moment — the outcome will shape the next six months.",
      weakWord: "key",
      answer: "pivotal",
      distractors: ["critical", "decisive", "crucial"],
    },
  ],
  plausible: [
    {
      sentence: "That's a **believable** explanation, but we need to verify it with data.",
      weakWord: "believable",
      answer: "plausible",
      distractors: ["reasonable", "credible", "likely"],
    },
  ],
  pragmatism: [
    {
      sentence: "His **practicality** in negotiations meant he always found a workable compromise.",
      weakWord: "practicality",
      answer: "pragmatism",
      distractors: ["realism", "common sense", "rationality"],
    },
  ],
  precarious: [
    {
      sentence: "The startup is in a **risky** financial position after two quarters of losses.",
      weakWord: "risky",
      answer: "precarious",
      distractors: ["unstable", "fragile", "uncertain"],
    },
  ],
  prescient: [
    {
      sentence: "Her **forward-thinking** warnings about cybersecurity proved exactly right.",
      weakWord: "forward-thinking",
      answer: "prescient",
      distractors: ["foresighted", "visionary", "prophetic"],
    },
  ],
  prevalent: [
    {
      sentence: "Burnout has become remarkably **common** in high-pressure industries.",
      weakWord: "common",
      answer: "prevalent",
      distractors: ["widespread", "rampant", "pervasive"],
    },
  ],
  profound: [
    {
      sentence: "The experience had a **deep** impact on how she approached leadership.",
      weakWord: "deep",
      answer: "profound",
      distractors: ["significant", "lasting", "powerful"],
    },
  ],
  propensity: [
    {
      sentence: "He has a natural **tendency** to overcommit and then struggle to deliver.",
      weakWord: "tendency",
      answer: "propensity",
      distractors: ["inclination", "habit", "disposition"],
    },
  ],
  provisional: [
    {
      sentence: "The **temporary** budget was approved while the board reviewed the full proposal.",
      weakWord: "temporary",
      answer: "provisional",
      distractors: ["interim", "preliminary", "conditional"],
    },
  ],
  prudent: [
    {
      sentence: "It would be **wise** to build a cash reserve before expanding into new markets.",
      weakWord: "wise",
      answer: "prudent",
      distractors: ["sensible", "careful", "cautious"],
    },
  ],
  ramification: [
    {
      sentence: "The policy change has serious **consequences** that we haven't fully mapped out.",
      weakWord: "consequences",
      answer: "ramification",
      distractors: ["implication", "effect", "fallout"],
    },
  ],
  reconcile: [
    {
      sentence: "It's hard to **align** the team's need for speed with the client's need for perfection.",
      weakWord: "align",
      answer: "reconcile",
      distractors: ["balance", "resolve", "bridge"],
    },
  ],
  reinforce: [
    {
      sentence: "The data **supports** the hypothesis that early feedback improves outcomes.",
      weakWord: "supports",
      answer: "reinforces",
      distractors: ["confirms", "backs up", "strengthens"],
    },
  ],
  resilient: [
    {
      sentence: "A **strong** supply chain can absorb disruptions without breaking down.",
      weakWord: "strong",
      answer: "resilient",
      distractors: ["robust", "flexible", "durable"],
    },
  ],
  resolute: [
    {
      sentence: "Despite pushback from the board, she remained **firm** in her decision.",
      weakWord: "firm",
      answer: "resolute",
      distractors: ["determined", "steadfast", "unwavering"],
    },
  ],
  reverence: [
    {
      sentence: "He spoke about his mentor with deep **respect** and admiration.",
      weakWord: "respect",
      answer: "reverence",
      distractors: ["admiration", "awe", "honor"],
    },
  ],
  rigorous: [
    {
      sentence: "The study followed a very **strict** methodology to ensure reliable results.",
      weakWord: "strict",
      answer: "rigorous",
      distractors: ["thorough", "disciplined", "exacting"],
    },
  ],
  robust: [
    {
      sentence: "We need a **strong** testing framework that can handle edge cases.",
      weakWord: "strong",
      answer: "robust",
      distractors: ["solid", "resilient", "comprehensive"],
    },
  ],
  scrupulous: [
    {
      sentence: "The auditor was **careful** to verify every transaction independently.",
      weakWord: "careful",
      answer: "scrupulous",
      distractors: ["thorough", "meticulous", "conscientious"],
    },
  ],
  serendipity: [
    {
      sentence: "Their partnership began as a happy **accident** — they met at a cancelled flight gate.",
      weakWord: "accident",
      answer: "serendipity",
      distractors: ["coincidence", "chance", "fortune"],
    },
  ],
  serene: [
    {
      sentence: "The lake at dawn was completely **peaceful** — not a ripple on the surface.",
      weakWord: "peaceful",
      answer: "serene",
      distractors: ["calm", "tranquil", "still"],
    },
  ],
  significant: [
    {
      sentence: "The report showed a **big** improvement in customer satisfaction over six months.",
      weakWord: "big",
      answer: "significant",
      distractors: ["notable", "substantial", "meaningful"],
    },
  ],
  solace: [
    {
      sentence: "She found **comfort** in music during the most difficult period of her life.",
      weakWord: "comfort",
      answer: "solace",
      distractors: ["consolation", "relief", "peace"],
    },
  ],
  sporadic: [
    {
      sentence: "The Wi-Fi has been **irregular** all week — it drops out without warning.",
      weakWord: "irregular",
      answer: "sporadic",
      distractors: ["intermittent", "inconsistent", "unpredictable"],
    },
  ],
  stratify: [
    {
      sentence: "The research team decided to **divide** their sample by age group and income level.",
      weakWord: "divide",
      answer: "stratify",
      distractors: ["segment", "categorize", "sort"],
    },
  ],
  substantial: [
    {
      sentence: "The new contract represents a **large** increase in revenue for the quarter.",
      weakWord: "large",
      answer: "substantial",
      distractors: ["significant", "considerable", "major"],
    },
  ],
  succinct: [
    {
      sentence: "Her **brief** summary captured everything the board needed to know in two sentences.",
      weakWord: "brief",
      answer: "succinct",
      distractors: ["concise", "short", "tight"],
    },
  ],
  synthesize: [
    {
      sentence: "The analyst was able to **combine** insights from five different reports into one clear recommendation.",
      weakWord: "combine",
      answer: "synthesize",
      distractors: ["merge", "integrate", "compile"],
    },
  ],
  tangible: [
    {
      sentence: "We need **real** results, not just promising metrics.",
      weakWord: "real",
      answer: "tangible",
      distractors: ["concrete", "measurable", "actual"],
    },
  ],
  tenacity: [
    {
      sentence: "Her **persistence** through three rounds of investor rejections finally paid off.",
      weakWord: "persistence",
      answer: "tenacity",
      distractors: ["determination", "resilience", "grit"],
    },
  ],
  trajectory: [
    {
      sentence: "The company's growth **path** over the last three years points toward an IPO.",
      weakWord: "path",
      answer: "trajectory",
      distractors: ["trend", "direction", "arc"],
    },
  ],
  transcend: [
    {
      sentence: "Great design can **go beyond** its original purpose and become cultural.",
      weakWord: "go beyond",
      answer: "transcend",
      distractors: ["exceed", "surpass", "overcome"],
    },
  ],
  transform: [
    {
      sentence: "The new leadership completely **changed** how the company operated.",
      weakWord: "changed",
      answer: "transformed",
      distractors: ["overhauled", "restructured", "reshaped"],
    },
  ],
  undermine: [
    {
      sentence: "Constant last-minute changes can **damage** the team's confidence and momentum.",
      weakWord: "damage",
      answer: "undermine",
      distractors: ["weaken", "erode", "sabotage"],
    },
  ],
  unequivocal: [
    {
      sentence: "The CEO gave an **absolutely clear** answer: no layoffs before the end of the year.",
      weakWord: "absolutely clear",
      answer: "unequivocal",
      distractors: ["definitive", "explicit", "unambiguous"],
    },
  ],
  versatile: [
    {
      sentence: "She's a **flexible** team member who can move between design and development easily.",
      weakWord: "flexible",
      answer: "versatile",
      distractors: ["adaptable", "multifaceted", "capable"],
    },
  ],
  discernible: [
    {
      sentence: "There was no **noticeable** difference between the two versions in our testing.",
      weakWord: "noticeable",
      answer: "discernible",
      distractors: ["measurable", "obvious", "visible"],
    },
  ],
  commensurate: [
    {
      sentence: "Her salary should be **matching** with her level of experience and responsibility.",
      weakWord: "matching",
      answer: "commensurate",
      distractors: ["proportionate", "equivalent", "suitable"],
    },
  ],
  juxtapose: [
    {
      sentence: "The report **places side by side** the company's public statements with its actual emissions data.",
      weakWord: "places side by side",
      answer: "juxtapose",
      distractors: ["compares", "contrasts", "aligns"],
    },
  ],
  precedent: [
    {
      sentence: "Approving this request would set a **standard** that every other team will expect to follow.",
      weakWord: "standard",
      answer: "precedent",
      distractors: ["example", "pattern", "expectation"],
    },
  ],
  prolific: [
    {
      sentence: "She is one of the most **productive** writers on the team, shipping three features per sprint.",
      weakWord: "productive",
      answer: "prolific",
      distractors: ["efficient", "active", "busy"],
    },
  ],
  corroborate: [
    {
      sentence: "A second review was run to **confirm** the initial findings before publishing.",
      weakWord: "confirm",
      answer: "corroborate",
      distractors: ["verify", "support", "validate"],
    },
  ],
  impetus: [
    {
      sentence: "The customer complaints provided the **push** for a complete product redesign.",
      weakWord: "push",
      answer: "impetus",
      distractors: ["reason", "motivation", "trigger"],
    },
  ],
  truncate: [
    {
      sentence: "The talk was **cut short** to fit the conference schedule, leaving out the Q&A.",
      weakWord: "cut short",
      answer: "truncate",
      distractors: ["shortened", "trimmed", "condensed"],
    },
  ],
  verbose: [
    {
      sentence: "His emails are so **wordy** that the key point is always buried in the third paragraph.",
      weakWord: "wordy",
      answer: "verbose",
      distractors: ["lengthy", "rambling", "long-winded"],
    },
  ],
  disseminate: [
    {
      sentence: "The findings were **shared** across all departments by end of week.",
      weakWord: "shared",
      answer: "disseminate",
      distractors: ["circulated", "distributed", "spread"],
    },
  ],
  recalcitrant: [
    {
      sentence: "The **stubborn** vendor refused to address the defects even after three escalations.",
      weakWord: "stubborn",
      answer: "recalcitrant",
      distractors: ["difficult", "uncooperative", "resistant"],
    },
  ],
  tacit: [
    {
      sentence: "There was an **unspoken** agreement that no one would bring up the failed launch.",
      weakWord: "unspoken",
      answer: "tacit",
      distractors: ["implicit", "silent", "understood"],
    },
  ],
  untenable: [
    {
      sentence: "The current workload is completely **unsustainable** — three people are doing the work of eight.",
      weakWord: "unsustainable",
      answer: "untenable",
      distractors: ["unreasonable", "impossible", "indefensible"],
    },
  ],
  exemplary: [
    {
      sentence: "Her **outstanding** work ethic set the bar for every new hire on the team.",
      weakWord: "outstanding",
      answer: "exemplary",
      distractors: ["exceptional", "model", "ideal"],
    },
  ],
  nostalgic: [
    {
      sentence: "Revisiting the original product made him feel **sentimental** about how far the team had come.",
      weakWord: "sentimental",
      answer: "nostalgic",
      distractors: ["wistful", "emotional", "reflective"],
    },
  ],
  assert: [
    {
      sentence: "She **stated firmly** that the data breach was caused by a third-party vendor.",
      weakWord: "stated firmly",
      answer: "assert",
      distractors: ["claimed", "argued", "insisted"],
    },
  ],
  contend: [
    {
      sentence: "The report **argues** that current safety regulations are not sufficient.",
      weakWord: "argues",
      answer: "contends",
      distractors: ["claims", "suggests", "maintains"],
    },
  ],
  acknowledge: [
    {
      sentence: "He **admitted** the mistake openly and without deflecting blame onto the team.",
      weakWord: "admitted",
      answer: "acknowledged",
      distractors: ["accepted", "recognized", "conceded"],
    },
  ],
  concur: [
    {
      sentence: "All three reviewers **agreed** that the proposal was technically sound.",
      weakWord: "agreed",
      answer: "concurred",
      distractors: ["concluded", "confirmed", "decided"],
    },
  ],
  acquiesce: [
    {
      sentence: "The team **gave in** to the deadline despite having serious reservations about quality.",
      weakWord: "gave in",
      answer: "acquiesced",
      distractors: ["complied", "yielded", "accepted"],
    },
  ],
  imply: [
    {
      sentence: "The data **suggests** a link between screen time and reduced focus, but doesn't prove it.",
      weakWord: "suggests",
      answer: "implies",
      distractors: ["indicates", "hints at", "insinuates"],
    },
  ],
  insinuate: [
    {
      sentence: "He never said it directly, but his questions seemed to **hint** that the project was mismanaged.",
      weakWord: "hint",
      answer: "insinuate",
      distractors: ["suggest", "imply", "intimate"],
    },
  ],
  manifest: [
    {
      sentence: "The underlying tension in the team eventually **showed up** as open conflict in the all-hands.",
      weakWord: "showed up",
      answer: "manifested",
      distractors: ["appeared", "emerged", "surfaced"],
    },
  ],
  diverge: [
    {
      sentence: "At this point, the two implementations **split** significantly in how they handle authentication.",
      weakWord: "split",
      answer: "diverge",
      distractors: ["differ", "separate", "deviate"],
    },
  ],
  refute: [
    {
      sentence: "The new benchmark data clearly **disproves** the claim that the old system is faster.",
      weakWord: "disproves",
      answer: "refutes",
      distractors: ["counters", "challenges", "rebuts"],
    },
  ],
  apprise: [
    {
      sentence: "Please **inform** all stakeholders of the timeline change before end of day.",
      weakWord: "inform",
      answer: "apprise",
      distractors: ["notify", "brief", "update"],
    },
  ],
  admonish: [
    {
      sentence: "The manager **warned** the team firmly about skipping the documentation step.",
      weakWord: "warned",
      answer: "admonished",
      distractors: ["reprimanded", "cautioned", "reminded"],
    },
  ],
  bolster: [
    {
      sentence: "Additional test coverage would **strengthen** confidence in the release.",
      weakWord: "strengthen",
      answer: "bolster",
      distractors: ["reinforce", "support", "increase"],
    },
  ],
  initiate: [
    {
      sentence: "She **started** the review process three weeks ahead of the original schedule.",
      weakWord: "started",
      answer: "initiated",
      distractors: ["launched", "began", "triggered"],
    },
  ],
  cease: [
    {
      sentence: "Development on the old branch will **stop** at the end of the quarter.",
      weakWord: "stop",
      answer: "cease",
      distractors: ["halt", "end", "discontinue"],
    },
  ],
  foster: [
    {
      sentence: "Good documentation **encourages** knowledge sharing across the whole organization.",
      weakWord: "encourages",
      answer: "fosters",
      distractors: ["promotes", "supports", "nurtures"],
    },
  ],
  contemplate: [
    {
      sentence: "Take time to **think carefully about** the downstream effects before committing to this approach.",
      weakWord: "think carefully about",
      answer: "contemplate",
      distractors: ["consider", "evaluate", "assess"],
    },
  ],
  ponder: [
    {
      sentence: "She **thought over** the tradeoffs for days before choosing an architecture.",
      weakWord: "thought over",
      answer: "pondered",
      distractors: ["considered", "weighed", "deliberated"],
    },
  ],
  fathom: [
    {
      sentence: "It was hard to **understand** why such a critical bug had passed code review.",
      weakWord: "understand",
      answer: "fathom",
      distractors: ["grasp", "comprehend", "imagine"],
    },
  ],
  discern: [
    {
      sentence: "It takes experience to **tell** which technical debt is genuinely dangerous.",
      weakWord: "tell",
      answer: "discern",
      distractors: ["recognize", "identify", "detect"],
    },
  ],
  speculate: [
    {
      sentence: "Without the production logs, we can only **guess** about the root cause.",
      weakWord: "guess",
      answer: "speculate",
      distractors: ["theorize", "estimate", "assume"],
    },
  ],
  ascertain: [
    {
      sentence: "We need to **find out for certain** whether the data was corrupted before we proceed.",
      weakWord: "find out for certain",
      answer: "ascertain",
      distractors: ["verify", "determine", "establish"],
    },
  ],
  moreover: [
    {
      sentence: "The approach is faster; **on top of that**, it requires significantly less maintenance.",
      weakWord: "on top of that",
      answer: "moreover",
      distractors: ["furthermore", "also", "additionally"],
    },
  ],
  consequently: [
    {
      sentence: "The data pipeline failed; **as a result**, the report was not generated on time.",
      weakWord: "as a result",
      answer: "consequently",
      distractors: ["therefore", "thus", "hence"],
    },
  ],
  nevertheless: [
    {
      sentence: "The timeline was extremely aggressive; **even so**, the team delivered on schedule.",
      weakWord: "even so",
      answer: "nevertheless",
      distractors: ["regardless", "still", "yet"],
    },
  ],
  notwithstanding: [
    {
      sentence: "**In spite of** the budget cuts, the project still met its original goals.",
      weakWord: "In spite of",
      answer: "notwithstanding",
      distractors: ["Despite", "Regardless of", "Even with"],
    },
  ],
  conversely: [
    {
      sentence: "More features can attract users; **on the other hand**, they can overwhelm them.",
      weakWord: "on the other hand",
      answer: "conversely",
      distractors: ["alternatively", "in contrast", "however"],
    },
  ],
  albeit: [
    {
      sentence: "The fix worked, **though** with a minor performance trade-off.",
      weakWord: "though",
      answer: "albeit",
      distractors: ["even if", "despite", "although"],
    },
  ],
  whereas: [
    {
      sentence: "The first system was synchronous, **while** the new one is fully event-driven.",
      weakWord: "while",
      answer: "whereas",
      distractors: ["although", "but", "however"],
    },
  ],
  hence: [
    {
      sentence: "The service lacked retry logic; **for this reason** the failures cascaded.",
      weakWord: "for this reason",
      answer: "hence",
      distractors: ["therefore", "thus", "consequently"],
    },
  ],
  thus: [
    {
      sentence: "The dependency was removed, **thereby** reducing the build time by half.",
      weakWord: "thereby",
      answer: "thus",
      distractors: ["therefore", "hence", "so"],
    },
  ],
  accordingly: [
    {
      sentence: "The scope changed significantly; the timeline was adjusted **in response**.",
      weakWord: "in response",
      answer: "accordingly",
      distractors: ["therefore", "consequently", "as a result"],
    },
  ],
  subsequently: [
    {
      sentence: "The patch was applied and **later** tested thoroughly in staging.",
      weakWord: "later",
      answer: "subsequently",
      distractors: ["afterward", "then", "following"],
    },
  ],
  ultimately: [
    {
      sentence: "We tried several approaches; **in the end**, the simplest one worked best.",
      weakWord: "in the end",
      answer: "ultimately",
      distractors: ["finally", "eventually", "at last"],
    },
  ],
  fundamentally: [
    {
      sentence: "This is not a process problem; it is **at its core** a communication problem.",
      weakWord: "at its core",
      answer: "fundamentally",
      distractors: ["essentially", "basically", "inherently"],
    },
  ],
  notably: [
    {
      sentence: "Several teams improved delivery times; **in particular**, the platform team cut theirs in half.",
      weakWord: "in particular",
      answer: "notably",
      distractors: ["especially", "specifically", "particularly"],
    },
  ],
  henceforth: [
    {
      sentence: "**From now on**, all deployments must go through the new approval process.",
      weakWord: "From now on",
      answer: "henceforth",
      distractors: ["Going forward", "Hereafter", "Subsequently"],
    },
  ],
  consensus: [
    {
      sentence: "We finally reached **agreement** on the architecture after three rounds of review.",
      weakWord: "agreement",
      answer: "consensus",
      distractors: ["alignment", "approval", "conclusion"],
    },
  ],
  allocation: [
    {
      sentence: "The **distribution** of budget across teams needs to be revisited every quarter.",
      weakWord: "distribution",
      answer: "allocation",
      distractors: ["assignment", "division", "breakdown"],
    },
  ],
  constraint: [
    {
      sentence: "The main **limitation** is not budget — it's available engineering time.",
      weakWord: "limitation",
      answer: "constraint",
      distractors: ["restriction", "barrier", "obstacle"],
    },
  ],
  incentive: [
    {
      sentence: "Without a clear **motivation**, adoption of the new tool will remain slow.",
      weakWord: "motivation",
      answer: "incentive",
      distractors: ["reason", "reward", "encouragement"],
    },
  ],
  mandate: [
    {
      sentence: "The team operates under an **order** to reduce infrastructure costs by thirty percent.",
      weakWord: "order",
      answer: "mandate",
      distractors: ["directive", "requirement", "goal"],
    },
  ],
  venture: [
    {
      sentence: "The joint **undertaking** required both companies to share proprietary data.",
      weakWord: "undertaking",
      answer: "venture",
      distractors: ["project", "deal", "partnership"],
    },
  ],
  legitimate: [
    {
      sentence: "There are **valid** concerns about the privacy implications of this feature.",
      weakWord: "valid",
      answer: "legitimate",
      distractors: ["real", "genuine", "reasonable"],
    },
  ],
  pristine: [
    {
      sentence: "The staging environment should be restored to a **clean** state before each test run.",
      weakWord: "clean",
      answer: "pristine",
      distractors: ["fresh", "original", "untouched"],
    },
  ],
  deficient: [
    {
      sentence: "The onboarding process is **lacking** in technical depth for new engineers.",
      weakWord: "lacking",
      answer: "deficient",
      distractors: ["weak", "inadequate", "incomplete"],
    },
  ],
  dynamic: [
    {
      sentence: "The market is so **fast-changing** that a strategy from last year may fail today.",
      weakWord: "fast-changing",
      answer: "dynamic",
      distractors: ["volatile", "active", "shifting"],
    },
  ],
  uniform: [
    {
      sentence: "A **consistent** naming convention across all services reduces onboarding friction.",
      weakWord: "consistent",
      answer: "uniform",
      distractors: ["standardized", "common", "shared"],
    },
  ],
  merit: [
    {
      sentence: "The proposal has real **value** and deserves serious consideration from the board.",
      weakWord: "value",
      answer: "merit",
      distractors: ["worth", "quality", "potential"],
    },
  ],
  execution: [
    {
      sentence: "The strategy was sound; the failure was in **delivery**.",
      weakWord: "delivery",
      answer: "execution",
      distractors: ["implementation", "performance", "follow-through"],
    },
  ],
  contentious: [
    {
      sentence: "The decision to deprecate the old API was **controversial** among long-term users.",
      weakWord: "controversial",
      answer: "contentious",
      distractors: ["disputed", "divisive", "sensitive"],
    },
  ],
  tenable: [
    {
      sentence: "That position is no longer **defensible** given the new evidence we uncovered.",
      weakWord: "defensible",
      answer: "tenable",
      distractors: ["sustainable", "reasonable", "supportable"],
    },
  ],
  indeterminate: [
    {
      sentence: "The root cause remains **unclear** pending a deeper analysis of the logs.",
      weakWord: "unclear",
      answer: "indeterminate",
      distractors: ["unknown", "undefined", "uncertain"],
    },
  ],
  apparent: [
    {
      sentence: "It was **obvious** to everyone in the room that the rollout had failed.",
      weakWord: "obvious",
      answer: "apparent",
      distractors: ["clear", "evident", "plain"],
    },
  ],
  magnificent: [
    {
      sentence: "She delivered a truly **impressive** keynote that left the audience speechless.",
      weakWord: "impressive",
      answer: "magnificent",
      distractors: ["spectacular", "grand", "brilliant"],
    },
  ],
  courageous: [
    {
      sentence: "It was very **brave** to push back on leadership when everyone else stayed silent.",
      weakWord: "brave",
      answer: "courageous",
      distractors: ["bold", "daring", "resolute"],
    },
  ],
  sincere: [
    {
      sentence: "Her apology was **genuine** and immediately defused the tension in the room.",
      weakWord: "genuine",
      answer: "sincere",
      distractors: ["heartfelt", "honest", "authentic"],
    },
  ],
  restless: [
    {
      sentence: "He grew **unsettled** in the role once the main technical challenges were solved.",
      weakWord: "unsettled",
      answer: "restless",
      distractors: ["bored", "frustrated", "disengaged"],
    },
  ],
  unmotivated: [
    {
      sentence: "Repetitive, low-impact work left the team feeling **uninspired**.",
      weakWord: "uninspired",
      answer: "unmotivated",
      distractors: ["disengaged", "apathetic", "disinterested"],
    },
  ],
  inconsiderate: [
    {
      sentence: "Scheduling a two-hour meeting with no agenda is **thoughtless** of people's time.",
      weakWord: "thoughtless",
      answer: "inconsiderate",
      distractors: ["rude", "selfish", "careless"],
    },
  ],
  drastic: [
    {
      sentence: "A full rewrite is a very **extreme** step that should be considered carefully.",
      weakWord: "extreme",
      answer: "drastic",
      distractors: ["radical", "severe", "sweeping"],
    },
  ],
  fulfilling: [
    {
      sentence: "She found the mentorship role far more **rewarding** than the individual contributor track.",
      weakWord: "rewarding",
      answer: "fulfilling",
      distractors: ["satisfying", "meaningful", "gratifying"],
    },
  ],
  breathtaking: [
    {
      sentence: "Her command of the negotiation was **astonishing** — she anticipated every move.",
      weakWord: "astonishing",
      answer: "breathtaking",
      distractors: ["stunning", "remarkable", "impressive"],
    },
  ],
  "thought-provoking": [
    {
      sentence: "His talk raised some truly **challenging** questions about the ethics of AI.",
      weakWord: "challenging",
      answer: "thought-provoking",
      distractors: ["stimulating", "interesting", "provocative"],
    },
  ],
  intriguing: [
    {
      sentence: "The anomaly in the data was **interesting** enough to justify a full investigation.",
      weakWord: "interesting",
      answer: "intriguing",
      distractors: ["fascinating", "curious", "puzzling"],
    },
  ],
  reproach: [
    {
      sentence: "Her tone carried a gentle **criticism** that was more effective than outright anger.",
      weakWord: "criticism",
      answer: "reproach",
      distractors: ["rebuke", "censure", "disapproval"],
    },
  ],
  repudiate: [
    {
      sentence: "The company firmly **rejected** the vendor's interpretation of the contract.",
      weakWord: "rejected",
      answer: "repudiated",
      distractors: ["denied", "disputed", "refuted"],
    },
  ],
  diatribe: [
    {
      sentence: "His post-mortem turned into a **rant** against the entire review process.",
      weakWord: "rant",
      answer: "diatribe",
      distractors: ["tirade", "attack", "lecture"],
    },
  ],
  polemic: [
    {
      sentence: "The article read less like analysis and more like a **attack** on the entire industry.",
      weakWord: "attack",
      answer: "polemic",
      distractors: ["diatribe", "argument", "critique"],
    },
  ],
  denigrate: [
    {
      sentence: "He had a habit of **belittling** others' contributions in public forums.",
      weakWord: "belittling",
      answer: "denigrate",
      distractors: ["disparage", "undermine", "dismiss"],
    },
  ],
  deride: [
    {
      sentence: "Critics **mocked** the product as a feature-length bug report.",
      weakWord: "mocked",
      answer: "derided",
      distractors: ["ridiculed", "dismissed", "scorned"],
    },
  ],
  invective: [
    {
      sentence: "His review was full of **abusive language** that buried any useful feedback.",
      weakWord: "abusive language",
      answer: "invective",
      distractors: ["vitriol", "insults", "hostility"],
    },
  ],
  discord: [
    {
      sentence: "The reorganization created real **conflict** across teams that had worked well together.",
      weakWord: "conflict",
      answer: "discord",
      distractors: ["tension", "friction", "disagreement"],
    },
  ],
  subordinate: [
    {
      sentence: "In this model, short-term metrics are **secondary** to long-term organizational health.",
      weakWord: "secondary",
      answer: "subordinate",
      distractors: ["lower", "less important", "minor"],
    },
  ],
  personnel: [
    {
      sentence: "The project requires **staff** with both legal and technical expertise.",
      weakWord: "staff",
      answer: "personnel",
      distractors: ["employees", "people", "members"],
    },
  ],
  procedure: [
    {
      sentence: "Following the **process** prevented a repeat of last quarter's major outage.",
      weakWord: "process",
      answer: "procedure",
      distractors: ["protocol", "method", "routine"],
    },
  ],
  portfolio: [
    {
      sentence: "The product **range** needs pruning — we are supporting too many initiatives.",
      weakWord: "range",
      answer: "portfolio",
      distractors: ["collection", "suite", "lineup"],
    },
  ],
  enterprise: [
    {
      sentence: "The platform migration was a two-year **undertaking** that touched every part of the system.",
      weakWord: "undertaking",
      answer: "enterprise",
      distractors: ["project", "initiative", "effort"],
    },
  ],
  strategic: [
    {
      sentence: "Hiring this engineer is a **planned** investment in the long-term infrastructure team.",
      weakWord: "planned",
      answer: "strategic",
      distractors: ["deliberate", "calculated", "intentional"],
    },
  ],
  establish: [
    {
      sentence: "We need to **set up** clear ownership before the project scales any further.",
      weakWord: "set up",
      answer: "establish",
      distractors: ["create", "define", "assign"],
    },
  ],
  coordination: [
    {
      sentence: "Poor **organization** between teams caused the two features to conflict on release day.",
      weakWord: "organization",
      answer: "coordination",
      distractors: ["communication", "alignment", "collaboration"],
    },
  ],
  exigency: [
    {
      sentence: "The **urgency** of the outage required skipping the normal change approval process.",
      weakWord: "urgency",
      answer: "exigency",
      distractors: ["severity", "crisis", "pressure"],
    },
  ],
  supposition: [
    {
      sentence: "The entire plan rests on the **assumption** that the vendor will deliver on time.",
      weakWord: "assumption",
      answer: "supposition",
      distractors: ["belief", "hypothesis", "expectation"],
    },
  ],
  prowess: [
    {
      sentence: "Her technical **skill** was matched only by her ability to communicate clearly.",
      weakWord: "skill",
      answer: "prowess",
      distractors: ["mastery", "expertise", "ability"],
    },
  ],
  mastery: [
    {
      sentence: "True **expertise** in a domain takes years of deliberate, focused practice.",
      weakWord: "expertise",
      answer: "mastery",
      distractors: ["proficiency", "command", "fluency"],
    },
  ],
  authenticity: [
    {
      sentence: "Customers respond to **genuineness** in brand communication more than polished messaging.",
      weakWord: "genuineness",
      answer: "authenticity",
      distractors: ["honesty", "sincerity", "integrity"],
    },
  ],
  epiphany: [
    {
      sentence: "The **revelation** came during a walk — the whole architecture suddenly made sense.",
      weakWord: "revelation",
      answer: "epiphany",
      distractors: ["realization", "insight", "breakthrough"],
    },
  ],
  fulfillment: [
    {
      sentence: "Shipping work that genuinely helps people brings a **satisfaction** no bonus can match.",
      weakWord: "satisfaction",
      answer: "fulfillment",
      distractors: ["gratification", "reward", "joy"],
    },
  ],
  integrity: [
    {
      sentence: "She maintained her **honesty** even under pressure to manipulate the results.",
      weakWord: "honesty",
      answer: "integrity",
      distractors: ["ethics", "principles", "character"],
    },
  ],
  empathy: [
    {
      sentence: "**Understanding** the user's frustration is what separates good product decisions from technically correct ones.",
      weakWord: "Understanding",
      answer: "empathy",
      distractors: ["Awareness", "Compassion", "Knowledge"],
    },
  ],
  core: [
    {
      sentence: "At its **heart**, this is a trust problem, not a technical one.",
      weakWord: "heart",
      answer: "core",
      distractors: ["center", "root", "foundation"],
    },
  ],
  consistent: [
    {
      sentence: "**Steady** communication keeps remote teams aligned without constant check-in meetings.",
      weakWord: "Steady",
      answer: "consistent",
      distractors: ["Regular", "Reliable", "Frequent"],
    },
  ],
  enhance: [
    {
      sentence: "Regular retrospectives **improve** the team's ability to self-correct over time.",
      weakWord: "improve",
      answer: "enhance",
      distractors: ["strengthen", "support", "boost"],
    },
  ],
  elevate: [
    {
      sentence: "Her feedback **raised** the proposal from good to genuinely excellent.",
      weakWord: "raised",
      answer: "elevated",
      distractors: ["improved", "upgraded", "transformed"],
    },
  ],
  resonate: [
    {
      sentence: "A vision that **connects** with engineers aligns their effort without constant direction.",
      weakWord: "connects",
      answer: "resonates",
      distractors: ["registers", "clicks", "lands"],
    },
  ],
  fortify: [
    {
      sentence: "Adding rate limiting will **strengthen** the API against abuse and overload.",
      weakWord: "strengthen",
      answer: "fortify",
      distractors: ["protect", "reinforce", "harden"],
    },
  ],
  circumscribe: [
    {
      sentence: "The legal agreement **limited** the scope of what each party could independently build.",
      weakWord: "limited",
      answer: "circumscribed",
      distractors: ["restricted", "constrained", "defined"],
    },
  ],
  promulgate: [
    {
      sentence: "The new security policy was **announced** across the entire organization last quarter.",
      weakWord: "announced",
      answer: "promulgated",
      distractors: ["distributed", "communicated", "published"],
    },
  ],
  adjudicate: [
    {
      sentence: "A neutral party was brought in to **decide** the disagreement between the two teams.",
      weakWord: "decide",
      answer: "adjudicate",
      distractors: ["resolve", "arbitrate", "settle"],
    },
  ],
  obviate: [
    {
      sentence: "Automating the check would **remove** the need for a manual review step entirely.",
      weakWord: "remove",
      answer: "obviate",
      distractors: ["eliminate", "prevent", "bypass"],
    },
  ],
  preclude: [
    {
      sentence: "Early alignment **prevents** most of the conflicts that plagued the previous project.",
      weakWord: "prevents",
      answer: "precludes",
      distractors: ["avoids", "stops", "eliminates"],
    },
  ],
  abrogate: [
    {
      sentence: "The new legislation **repealed** the protections the previous regulation had provided.",
      weakWord: "repealed",
      answer: "abrogated",
      distractors: ["removed", "cancelled", "overturned"],
    },
  ],
  attenuate: [
    {
      sentence: "Adding a caching layer **reduces** the load on the primary database significantly.",
      weakWord: "reduces",
      answer: "attenuates",
      distractors: ["decreases", "lessens", "lowers"],
    },
  ],
  ethereal: [
    {
      sentence: "The user interface had an **delicate** quality — functional yet almost weightless.",
      weakWord: "delicate",
      answer: "ethereal",
      distractors: ["refined", "airy", "light"],
    },
  ],
  sublime: [
    {
      sentence: "The simplicity of the final design was, after years of complexity, almost **perfect**.",
      weakWord: "perfect",
      answer: "sublime",
      distractors: ["magnificent", "transcendent", "exquisite"],
    },
  ],
  inefficacious: [
    {
      sentence: "The workaround proved completely **ineffective** under high load conditions.",
      weakWord: "ineffective",
      answer: "inefficacious",
      distractors: ["useless", "futile", "powerless"],
    },
  ],
  obstreperous: [
    {
      sentence: "The **disruptive** stakeholder derailed three consecutive planning sessions.",
      weakWord: "disruptive",
      answer: "obstreperous",
      distractors: ["unruly", "difficult", "uncooperative"],
    },
  ],
  perspicacious: [
    {
      sentence: "Her **sharp** reading of the competitive landscape gave the team months of advantage.",
      weakWord: "sharp",
      answer: "perspicacious",
      distractors: ["astute", "perceptive", "insightful"],
    },
  ],
  sagacious: [
    {
      sentence: "His **wise** advice prevented the company from making a very costly strategic mistake.",
      weakWord: "wise",
      answer: "sagacious",
      distractors: ["astute", "judicious", "prescient"],
    },
  ],
  erudite: [
    {
      sentence: "Her **learned** explanation connected abstract theory to everyday engineering practice.",
      weakWord: "learned",
      answer: "erudite",
      distractors: ["scholarly", "knowledgeable", "intellectual"],
    },
  ],
  loquacious: [
    {
      sentence: "His **talkative** style worked well in client presentations but slowed down standups.",
      weakWord: "talkative",
      answer: "loquacious",
      distractors: ["verbose", "garrulous", "chatty"],
    },
  ],
  taciturn: [
    {
      sentence: "The most **quiet** engineer on the team was also consistently the most perceptive.",
      weakWord: "quiet",
      answer: "taciturn",
      distractors: ["reserved", "reticent", "withdrawn"],
    },
  ],
  sanguine: [
    {
      sentence: "He remained **optimistic** about the deadline despite the mounting delays.",
      weakWord: "optimistic",
      answer: "sanguine",
      distractors: ["hopeful", "confident", "positive"],
    },
  ],
  phlegmatic: [
    {
      sentence: "Her **calm** response to the crisis steadied everyone around her.",
      weakWord: "calm",
      answer: "phlegmatic",
      distractors: ["stoic", "impassive", "composed"],
    },
  ],
  ebullient: [
    {
      sentence: "Her **energetic** personality was infectious and lifted the team during long sprints.",
      weakWord: "energetic",
      answer: "ebullient",
      distractors: ["enthusiastic", "exuberant", "vivacious"],
    },
  ],
  truculent: [
    {
      sentence: "His **aggressive** manner in code reviews alienated contributors who could have been allies.",
      weakWord: "aggressive",
      answer: "truculent",
      distractors: ["combative", "hostile", "belligerent"],
    },
  ],
  petulant: [
    {
      sentence: "His **childish** reaction to the scope change undermined his credibility with leadership.",
      weakWord: "childish",
      answer: "petulant",
      distractors: ["sulky", "irritable", "immature"],
    },
  ],
  insouciant: [
    {
      sentence: "His **careless** attitude toward deadlines became a real problem as the stakes rose.",
      weakWord: "careless",
      answer: "insouciant",
      distractors: ["nonchalant", "indifferent", "casual"],
    },
  ],
  diffident: [
    {
      sentence: "She was **shy** in large meetings despite having the strongest technical opinions in the room.",
      weakWord: "shy",
      answer: "diffident",
      distractors: ["reserved", "hesitant", "modest"],
    },
  ],
  obsequious: [
    {
      sentence: "His **fawning** manner around executives masked a much sharper underlying agenda.",
      weakWord: "fawning",
      answer: "obsequious",
      distractors: ["sycophantic", "servile", "submissive"],
    },
  ],
  supercilious: [
    {
      sentence: "His **condescending** dismissal of junior engineers' ideas severely damaged team morale.",
      weakWord: "condescending",
      answer: "supercilious",
      distractors: ["arrogant", "disdainful", "patronizing"],
    },
  ],
  verisimilitude: [
    {
      sentence: "The simulation achieved enough **realism** to be genuinely useful for training purposes.",
      weakWord: "realism",
      answer: "verisimilitude",
      distractors: ["authenticity", "accuracy", "plausibility"],
    },
  ],
  simulacrum: [
    {
      sentence: "The process became a **imitation** of agile — the rituals without any of the principles.",
      weakWord: "imitation",
      answer: "simulacrum",
      distractors: ["parody", "replica", "shadow"],
    },
  ],
  zeitgeist: [
    {
      sentence: "The product caught the **spirit of the times** perfectly and became synonymous with the era.",
      weakWord: "spirit of the times",
      answer: "zeitgeist",
      distractors: ["mood", "ethos", "trend"],
    },
  ],
  schadenfreude: [
    {
      sentence: "There was an uncomfortable hint of **gloating** in the industry's reaction to the competitor's outage.",
      weakWord: "gloating",
      answer: "schadenfreude",
      distractors: ["satisfaction", "delight", "relief"],
    },
  ],
  weltanschauung: [
    {
      sentence: "His **worldview** shaped every product decision he made, for better and for worse.",
      weakWord: "worldview",
      answer: "weltanschauung",
      distractors: ["philosophy", "perspective", "outlook"],
    },
  ],
  "raison d'être": [
    {
      sentence: "Reducing latency is the product's core **purpose** — every feature decision flows from it.",
      weakWord: "purpose",
      answer: "raison d'être",
      distractors: ["mission", "goal", "identity"],
    },
  ],
  incandescent: [
    {
      sentence: "Her **brilliant** presentation lit up a room full of weary executives.",
      weakWord: "brilliant",
      answer: "incandescent",
      distractors: ["luminous", "radiant", "dazzling"],
    },
  ],
  resplendent: [
    {
      sentence: "The redesigned dashboard was truly **impressive** — every detail deliberate, every color purposeful.",
      weakWord: "impressive",
      answer: "resplendent",
      distractors: ["magnificent", "splendid", "stunning"],
    },
  ],
  mellifluous: [
    {
      sentence: "His **smooth** voice made even the most technical explanation easy to follow.",
      weakWord: "smooth",
      answer: "mellifluous",
      distractors: ["dulcet", "harmonious", "pleasant"],
    },
  ],
  sonorous: [
    {
      sentence: "The **deep** cadence of her closing argument left the room silent for a moment.",
      weakWord: "deep",
      answer: "sonorous",
      distractors: ["resonant", "rich", "powerful"],
    },
  ],
  dulcet: [
    {
      sentence: "The **gentle** notification sound was designed to calm rather than alarm the user.",
      weakWord: "gentle",
      answer: "dulcet",
      distractors: ["soft", "sweet", "soothing"],
    },
  ],
  indefatigable: [
    {
      sentence: "Her **tireless** pursuit of the root cause finally paid off after three days.",
      weakWord: "tireless",
      answer: "indefatigable",
      distractors: ["relentless", "persistent", "inexhaustible"],
    },
  ],
  inexorable: [
    {
      sentence: "The **unstoppable** march of technical debt eventually forces a major reckoning.",
      weakWord: "unstoppable",
      answer: "inexorable",
      distractors: ["relentless", "inevitable", "unforgiving"],
    },
  ],
  implacable: [
    {
      sentence: "She was **unyielding** on code quality, regardless of timeline pressure.",
      weakWord: "unyielding",
      answer: "implacable",
      distractors: ["inflexible", "unrelenting", "firm"],
    },
  ],
  intransigent: [
    {
      sentence: "The vendor was completely **unwilling to compromise** on pricing, which ended the negotiation.",
      weakWord: "unwilling to compromise",
      answer: "intransigent",
      distractors: ["inflexible", "uncompromising", "stubborn"],
    },
  ],
  redoubtable: [
    {
      sentence: "She built a **formidable** reputation as someone who ships without ever cutting corners.",
      weakWord: "formidable",
      answer: "redoubtable",
      distractors: ["impressive", "commanding", "fearsome"],
    },
  ],
};
