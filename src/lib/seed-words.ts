import type { SeedWord } from "./types";

/**
 * Tier 1: Core Articulation — words that replace vague defaults.
 * ~50 words for MVP. Full corpus targets 200.
 */
export const SEED_WORDS: SeedWord[] = [
  {
    word: "nuanced",
    definition: "Characterized by subtle shades of meaning or expression",
    examples: [
      "Her analysis was more nuanced than the headline suggested.",
      "The issue requires a nuanced approach, not a blanket policy.",
    ],
    synonyms: ["subtle", "refined", "sophisticated"],
    tier: 1,
  },
  {
    word: "deliberate",
    definition: "Done consciously and intentionally; careful and unhurried",
    examples: [
      "Every design choice was deliberate, not accidental.",
      "He took a deliberate pause before answering the question.",
    ],
    synonyms: ["intentional", "calculated", "purposeful"],
    tier: 1,
  },
  {
    word: "compelling",
    definition: "Evoking interest or attention in a powerfully irresistible way",
    examples: [
      "She made a compelling case for restructuring the team.",
      "The data was compelling enough to change his mind.",
    ],
    synonyms: ["convincing", "persuasive", "riveting"],
    tier: 1,
  },
  {
    word: "substantive",
    definition: "Having a firm basis in reality; meaningful and important",
    examples: [
      "We need substantive changes, not cosmetic adjustments.",
      "The meeting produced substantive results for the first time.",
    ],
    synonyms: ["meaningful", "significant", "material"],
    tier: 1,
  },
  {
    word: "pragmatic",
    definition: "Dealing with things sensibly based on practical considerations",
    examples: [
      "His pragmatic approach cut through the theoretical debate.",
      "We need a pragmatic solution, not an ideal one.",
    ],
    synonyms: ["practical", "realistic", "sensible"],
    tier: 1,
  },
  {
    word: "articulate",
    definition: "Able to express thoughts fluently and coherently",
    examples: [
      "She was the most articulate speaker at the conference.",
      "He struggled to articulate why the design felt wrong.",
    ],
    synonyms: ["eloquent", "fluent", "expressive"],
    tier: 1,
  },
  {
    word: "candid",
    definition: "Truthful and straightforward; frank",
    examples: [
      "I appreciate your candid feedback on the proposal.",
      "In a candid moment, she admitted the strategy wasn't working.",
    ],
    synonyms: ["frank", "honest", "forthright"],
    tier: 1,
  },
  {
    word: "concise",
    definition: "Giving a lot of information clearly in few words",
    examples: [
      "Keep your emails concise — no one reads walls of text.",
      "The report was concise but covered every critical issue.",
    ],
    synonyms: ["brief", "succinct", "terse"],
    tier: 1,
  },
  {
    word: "cogent",
    definition: "Clear, logical, and convincing",
    examples: [
      "He presented a cogent argument that changed the committee's vote.",
      "The most cogent objection came from the engineering team.",
    ],
    synonyms: ["convincing", "compelling", "persuasive"],
    tier: 1,
  },
  {
    word: "salient",
    definition: "Most noticeable or important; prominent",
    examples: [
      "The most salient point in the report was the cost overrun.",
      "Let me highlight the salient features of the new design.",
    ],
    synonyms: ["prominent", "notable", "striking"],
    tier: 1,
  },
  {
    word: "tenuous",
    definition: "Very weak or slight; insubstantial",
    examples: [
      "The connection between the two events is tenuous at best.",
      "His grip on the lead became increasingly tenuous.",
    ],
    synonyms: ["weak", "flimsy", "fragile"],
    tier: 1,
  },
  {
    word: "pervasive",
    definition: "Spreading widely throughout an area or group of people",
    examples: [
      "The pervasive smell of coffee filled the entire floor.",
      "There's a pervasive sense of urgency across the organization.",
    ],
    synonyms: ["widespread", "prevalent", "ubiquitous"],
    tier: 1,
  },
  {
    word: "discernible",
    definition: "Able to be perceived or recognized; distinguishable",
    examples: [
      "There was no discernible difference between the two samples.",
      "The improvement was barely discernible without measurements.",
    ],
    synonyms: ["noticeable", "detectable", "perceptible"],
    tier: 1,
  },
  {
    word: "commensurate",
    definition: "Corresponding in size, extent, or degree; proportionate",
    examples: [
      "The salary should be commensurate with experience.",
      "The punishment was not commensurate with the offense.",
    ],
    synonyms: ["proportionate", "corresponding", "equivalent"],
    tier: 1,
  },
  {
    word: "exacerbate",
    definition: "Make a problem, bad situation, or negative feeling worse",
    examples: [
      "The delay will only exacerbate the supply chain issues.",
      "His comments exacerbated the tension in the room.",
    ],
    synonyms: ["worsen", "aggravate", "intensify"],
    tier: 1,
  },
  {
    word: "mitigate",
    definition: "Make less severe, serious, or painful",
    examples: [
      "We need to mitigate the risk before proceeding.",
      "The new process mitigates the chance of human error.",
    ],
    synonyms: ["alleviate", "reduce", "lessen"],
    tier: 1,
  },
  {
    word: "precipitate",
    definition: "Cause an event or situation to happen suddenly or prematurely",
    examples: [
      "The announcement precipitated a wave of resignations.",
      "A single error precipitated the entire system failure.",
    ],
    synonyms: ["trigger", "provoke", "catalyze"],
    tier: 1,
  },
  {
    word: "delineate",
    definition: "Describe or portray something precisely; indicate exact boundaries",
    examples: [
      "The contract delineates each party's responsibilities.",
      "We need to delineate the scope before starting development.",
    ],
    synonyms: ["outline", "define", "specify"],
    tier: 1,
  },
  {
    word: "juxtapose",
    definition: "Place close together for contrasting effect",
    examples: [
      "The report juxtaposes last year's results with this quarter's.",
      "Juxtaposing the two approaches reveals their strengths and weaknesses.",
    ],
    synonyms: ["contrast", "compare", "set side by side"],
    tier: 1,
  },
  {
    word: "substantiate",
    definition: "Provide evidence to support or prove the truth of something",
    examples: [
      "Can you substantiate that claim with data?",
      "The audit substantiated the concerns raised by the team.",
    ],
    synonyms: ["verify", "confirm", "corroborate"],
    tier: 1,
  },
  {
    word: "elucidate",
    definition: "Make something clear; explain",
    examples: [
      "Could you elucidate the reasoning behind this decision?",
      "The diagram elucidates how the components interact.",
    ],
    synonyms: ["clarify", "explain", "illuminate"],
    tier: 1,
  },
  {
    word: "contingent",
    definition: "Dependent on certain circumstances; conditional",
    examples: [
      "The deal is contingent on board approval.",
      "Our timeline is contingent on the vendor delivering on schedule.",
    ],
    synonyms: ["conditional", "dependent", "subject to"],
    tier: 1,
  },
  {
    word: "efficacy",
    definition: "The ability to produce a desired or intended result",
    examples: [
      "The efficacy of the new training program is still unproven.",
      "Studies confirmed the efficacy of spaced repetition for long-term retention.",
    ],
    synonyms: ["effectiveness", "potency", "capability"],
    tier: 1,
  },
  {
    word: "precedent",
    definition: "An earlier event or action regarded as an example or guide",
    examples: [
      "This decision sets a dangerous precedent for future negotiations.",
      "There's no precedent for this kind of system failure.",
    ],
    synonyms: ["example", "model", "standard"],
    tier: 1,
  },
  {
    word: "disparity",
    definition: "A great difference; inequality",
    examples: [
      "The disparity between the two teams' budgets was striking.",
      "Pay disparity remains a significant issue across the industry.",
    ],
    synonyms: ["gap", "inequality", "imbalance"],
    tier: 1,
  },
  {
    word: "catalyst",
    definition: "A person or thing that precipitates an event or change",
    examples: [
      "The incident was the catalyst for a complete policy overhaul.",
      "She served as a catalyst for innovation within the department.",
    ],
    synonyms: ["trigger", "stimulus", "spark"],
    tier: 1,
  },
  {
    word: "attrition",
    definition: "The process of gradually reducing strength or numbers through sustained pressure",
    examples: [
      "High attrition rates are costing us more than recruitment.",
      "The team shrank through attrition rather than layoffs.",
    ],
    synonyms: ["erosion", "depletion", "wearing down"],
    tier: 1,
  },
  {
    word: "cursory",
    definition: "Hasty and therefore not thorough or detailed",
    examples: [
      "A cursory review of the code revealed several issues.",
      "He gave the document only a cursory glance before signing.",
    ],
    synonyms: ["superficial", "hasty", "perfunctory"],
    tier: 1,
  },
  {
    word: "amenable",
    definition: "Open and responsive to suggestion; easily persuaded",
    examples: [
      "The client was amenable to our revised timeline.",
      "He's amenable to feedback when it's delivered constructively.",
    ],
    synonyms: ["receptive", "agreeable", "open"],
    tier: 1,
  },
  {
    word: "equivocal",
    definition: "Open to more than one interpretation; ambiguous",
    examples: [
      "The test results were equivocal — we need to run them again.",
      "His equivocal response left everyone unsure of his position.",
    ],
    synonyms: ["ambiguous", "vague", "unclear"],
    tier: 1,
  },
  {
    word: "prolific",
    definition: "Producing much fruit, foliage, or many offspring; highly productive",
    examples: [
      "She's one of the most prolific contributors on the team.",
      "The prolific output of research papers made him a leader in the field.",
    ],
    synonyms: ["productive", "fertile", "abundant"],
    tier: 1,
  },
  {
    word: "perfunctory",
    definition: "Carried out with minimum effort or reflection; mechanical",
    examples: [
      "His perfunctory apology did nothing to ease the tension.",
      "The safety check was perfunctory at best — they barely looked.",
    ],
    synonyms: ["cursory", "mechanical", "halfhearted"],
    tier: 1,
  },
  {
    word: "tantamount",
    definition: "Equivalent in seriousness to; virtually the same as",
    examples: [
      "Ignoring the warning signs is tantamount to negligence.",
      "Silence on this issue is tantamount to approval.",
    ],
    synonyms: ["equivalent", "equal", "synonymous"],
    tier: 1,
  },
  {
    word: "lucid",
    definition: "Expressed clearly; easy to understand",
    examples: [
      "Her explanation was remarkably lucid despite the complex topic.",
      "The documentation is lucid enough for a new team member to follow.",
    ],
    synonyms: ["clear", "intelligible", "coherent"],
    tier: 1,
  },
  {
    word: "corroborate",
    definition: "Confirm or give support to a statement, theory, or finding",
    examples: [
      "The second audit corroborated the initial findings.",
      "Multiple witnesses corroborated her account of the incident.",
    ],
    synonyms: ["confirm", "verify", "substantiate"],
    tier: 1,
  },
  {
    word: "ostensible",
    definition: "Stated or appearing to be true, but not necessarily so",
    examples: [
      "The ostensible reason for the meeting was budget review, but layoffs were discussed.",
      "His ostensible calm masked deep frustration.",
    ],
    synonyms: ["apparent", "seeming", "purported"],
    tier: 1,
  },
  {
    word: "impetus",
    definition: "The force or energy with which something moves; a driving force",
    examples: [
      "The customer complaints provided the impetus for a redesign.",
      "Economic pressure was the impetus behind the merger.",
    ],
    synonyms: ["momentum", "stimulus", "motivation"],
    tier: 1,
  },
  {
    word: "nebulous",
    definition: "Unclear, vague, or ill-defined",
    examples: [
      "The project goals remain nebulous — we need concrete requirements.",
      "His vision for the company was inspiring but nebulous.",
    ],
    synonyms: ["vague", "hazy", "ambiguous"],
    tier: 1,
  },
  {
    word: "truncate",
    definition: "Shorten something by cutting off the top or end",
    examples: [
      "The report was truncated to fit the time slot.",
      "Don't truncate the error messages — they contain useful context.",
    ],
    synonyms: ["shorten", "cut", "abridge"],
    tier: 1,
  },
  {
    word: "verbose",
    definition: "Using or expressed in more words than are needed",
    examples: [
      "The verbose documentation buried the key information.",
      "His emails are verbose — the same point in half the words would be better.",
    ],
    synonyms: ["wordy", "long-winded", "prolix"],
    tier: 1,
  },
  {
    word: "disseminate",
    definition: "Spread or disperse something widely",
    examples: [
      "The findings were disseminated across all departments.",
      "Social media disseminates information faster than any other channel.",
    ],
    synonyms: ["spread", "distribute", "circulate"],
    tier: 1,
  },
  {
    word: "recalcitrant",
    definition: "Having an obstinately uncooperative attitude",
    examples: [
      "The recalcitrant vendor refused to honor the warranty.",
      "Dealing with recalcitrant stakeholders requires patience and leverage.",
    ],
    synonyms: ["uncooperative", "defiant", "obstinate"],
    tier: 1,
  },
  {
    word: "nascent",
    definition: "Just beginning to develop; emerging",
    examples: [
      "The nascent AI team is already producing results.",
      "We're seeing nascent signs of market recovery.",
    ],
    synonyms: ["emerging", "budding", "developing"],
    tier: 1,
  },
  {
    word: "volatile",
    definition: "Liable to change rapidly and unpredictably, especially for the worse",
    examples: [
      "The market has been volatile since the announcement.",
      "His volatile temperament makes collaboration difficult.",
    ],
    synonyms: ["unstable", "unpredictable", "erratic"],
    tier: 1,
  },
  {
    word: "ubiquitous",
    definition: "Present, appearing, or found everywhere",
    examples: [
      "Smartphones have become ubiquitous in the modern workplace.",
      "The ubiquitous use of jargon makes the documentation hard to read.",
    ],
    synonyms: ["omnipresent", "pervasive", "universal"],
    tier: 1,
  },
  {
    word: "superfluous",
    definition: "Unnecessary, especially through being more than enough",
    examples: [
      "Remove any superfluous steps from the process.",
      "The third review cycle felt superfluous — nothing changed.",
    ],
    synonyms: ["unnecessary", "redundant", "excessive"],
    tier: 1,
  },
  {
    word: "tacit",
    definition: "Understood or implied without being stated",
    examples: [
      "There was a tacit agreement not to discuss the reorganization.",
      "His silence was taken as tacit approval.",
    ],
    synonyms: ["implicit", "unspoken", "implied"],
    tier: 1,
  },
  {
    word: "untenable",
    definition: "Not able to be maintained or defended against criticism",
    examples: [
      "The current staffing levels are untenable given the workload.",
      "His position became untenable after the audit findings.",
    ],
    synonyms: ["indefensible", "unsustainable", "insupportable"],
    tier: 1,
  },
  {
    word: "galvanize",
    definition: "Shock or excite someone into taking action",
    examples: [
      "The safety incident galvanized the team into updating all procedures.",
      "Her speech galvanized support for the initiative.",
    ],
    synonyms: ["energize", "motivate", "spur"],
    tier: 1,
  },
  {
    word: "exemplary",
    definition: "Serving as a desirable model; representing the best of its kind",
    examples: [
      "Her exemplary work ethic set the standard for new hires.",
      "The project was exemplary in its attention to detail.",
    ],
    synonyms: ["outstanding", "model", "ideal"],
    tier: 1,
  },

  // ─── Tier 1: "Very + adjective" replacements ───────────────────────

  {
    word: "exceptional",
    definition: "Unusually good; outstanding far beyond the average",
    examples: [
      "The candidate demonstrated exceptional problem-solving skills during the interview.",
      "This quarter's results were exceptional by any standard.",
    ],
    synonyms: ["outstanding", "remarkable", "extraordinary"],
    tier: 1,
  },
  {
    word: "meticulous",
    definition: "Showing great attention to detail; extremely careful and precise",
    examples: [
      "Her meticulous documentation saved the team weeks of debugging.",
      "He was meticulous about proofreading every client-facing email.",
    ],
    synonyms: ["thorough", "painstaking", "scrupulous"],
    tier: 1,
  },
  {
    word: "crucial",
    definition: "Of great importance; decisive or critical",
    examples: [
      "Timing is crucial when launching in a competitive market.",
      "She played a crucial role in securing the partnership.",
    ],
    synonyms: ["critical", "vital", "essential"],
    tier: 1,
  },
  {
    word: "inevitable",
    definition: "Certain to happen; unavoidable",
    examples: [
      "Some degree of scope creep is inevitable on large projects.",
      "The merger felt inevitable once both boards signaled support.",
    ],
    synonyms: ["unavoidable", "inescapable", "certain"],
    tier: 1,
  },
  {
    word: "profound",
    definition: "Very great or intense; having deep meaning or impact",
    examples: [
      "The policy shift had a profound effect on employee morale.",
      "His research led to a profound rethinking of the standard model.",
    ],
    synonyms: ["deep", "far-reaching", "significant"],
    tier: 1,
  },
  {
    word: "resilient",
    definition: "Able to recover quickly from difficulties; tough and adaptable",
    examples: [
      "The team proved resilient after losing two key members mid-project.",
      "Building resilient systems means planning for failure, not just success.",
    ],
    synonyms: ["tough", "adaptable", "hardy"],
    tier: 1,
  },
  {
    word: "formidable",
    definition: "Inspiring fear or respect through being impressively powerful or capable",
    examples: [
      "She was a formidable negotiator who rarely left anything on the table.",
      "The technical debt had grown into a formidable obstacle.",
    ],
    synonyms: ["imposing", "daunting", "impressive"],
    tier: 1,
  },
  {
    word: "paramount",
    definition: "More important than anything else; supreme",
    examples: [
      "Data security is paramount when handling customer information.",
      "Speed was paramount, so we chose the simplest viable architecture.",
    ],
    synonyms: ["supreme", "foremost", "preeminent"],
    tier: 1,
  },
  {
    word: "rigorous",
    definition: "Extremely thorough, exhaustive, and accurate",
    examples: [
      "The peer review process is rigorous but ultimately improves quality.",
      "She applied a rigorous methodology to every experiment.",
    ],
    synonyms: ["thorough", "strict", "exacting"],
    tier: 1,
  },
  {
    word: "prevalent",
    definition: "Widespread in a particular area or at a particular time",
    examples: [
      "Burnout is prevalent in high-growth startups.",
      "The misconception is prevalent even among experienced developers.",
    ],
    synonyms: ["widespread", "common", "pervasive"],
    tier: 1,
  },
  {
    word: "acute",
    definition: "Present or experienced to a severe or intense degree",
    examples: [
      "There is an acute shortage of qualified engineers in the region.",
      "She felt an acute sense of responsibility after the incident.",
    ],
    synonyms: ["severe", "intense", "sharp"],
    tier: 1,
  },
  {
    word: "emphatic",
    definition: "Showing or giving emphasis; expressed with force and conviction",
    examples: [
      "Her emphatic refusal left no room for further negotiation.",
      "The results were emphatic — the new approach outperformed by every metric.",
    ],
    synonyms: ["forceful", "definite", "unequivocal"],
    tier: 1,
  },

  // ─── Tier 1: Emotion precision ─────────────────────────────────────

  {
    word: "elated",
    definition: "Ecstatically happy; thrilled beyond ordinary happiness",
    examples: [
      "The team was elated when the product shipped ahead of schedule.",
      "She was elated to learn her proposal had been accepted.",
    ],
    synonyms: ["thrilled", "overjoyed", "ecstatic"],
    tier: 1,
  },
  {
    word: "devastated",
    definition: "Severely shocked and distressed; overwhelmed with grief or disappointment",
    examples: [
      "He was devastated to learn the project had been cancelled.",
      "The community was devastated by the sudden closure of the plant.",
    ],
    synonyms: ["shattered", "crushed", "distraught"],
    tier: 1,
  },
  {
    word: "apprehensive",
    definition: "Anxious or fearful that something bad or unpleasant will happen",
    examples: [
      "She was apprehensive about presenting to the executive team.",
      "Employees grew apprehensive as the restructuring announcement approached.",
    ],
    synonyms: ["anxious", "uneasy", "worried"],
    tier: 1,
  },
  {
    word: "ambivalent",
    definition: "Having mixed or contradictory feelings about something",
    examples: [
      "He was ambivalent about the promotion — more money but less autonomy.",
      "The board remained ambivalent, unable to commit to either direction.",
    ],
    synonyms: ["conflicted", "torn", "undecided"],
    tier: 1,
  },
  {
    word: "nostalgic",
    definition: "Feeling a sentimental longing for the past",
    examples: [
      "Revisiting the old codebase made him nostalgic for simpler times.",
      "There was a nostalgic quality to the farewell party that moved everyone.",
    ],
    synonyms: ["sentimental", "wistful", "longing"],
    tier: 1,
  },
  {
    word: "indignant",
    definition: "Feeling or showing anger aroused by something perceived as unjust",
    examples: [
      "She was indignant when her contributions were attributed to someone else.",
      "The indignant response from the team forced management to reconsider.",
    ],
    synonyms: ["outraged", "offended", "resentful"],
    tier: 1,
  },
  {
    word: "exasperated",
    definition: "Intensely irritated and frustrated, often after repeated difficulty",
    examples: [
      "After the third failed deployment, the team was exasperated.",
      "His exasperated sigh told everyone the meeting had gone poorly.",
    ],
    synonyms: ["frustrated", "irritated", "infuriated"],
    tier: 1,
  },
  {
    word: "resolute",
    definition: "Admirably purposeful, determined, and unwavering",
    examples: [
      "She remained resolute in her decision despite pushback from leadership.",
      "His resolute commitment to quality inspired the entire team.",
    ],
    synonyms: ["determined", "steadfast", "unwavering"],
    tier: 1,
  },
  {
    word: "complacent",
    definition: "Showing smug satisfaction with oneself or one's achievements, ignoring potential problems",
    examples: [
      "Success made the company complacent, and competitors caught up.",
      "We can't afford to be complacent just because this quarter went well.",
    ],
    synonyms: ["self-satisfied", "smug", "unconcerned"],
    tier: 1,
  },
  {
    word: "disenchanted",
    definition: "Disappointed by someone or something previously admired; disillusioned",
    examples: [
      "Many early adopters grew disenchanted with the platform's direction.",
      "She became disenchanted with corporate life after years of broken promises.",
    ],
    synonyms: ["disillusioned", "disappointed", "let down"],
    tier: 1,
  },

  // ─── Tier 1: Professional upgrades ─────────────────────────────────

  {
    word: "comprehensive",
    definition: "Complete and including everything that is necessary; thorough",
    examples: [
      "The audit produced a comprehensive list of vulnerabilities.",
      "We need a comprehensive strategy, not a collection of quick fixes.",
    ],
    synonyms: ["thorough", "complete", "exhaustive"],
    tier: 1,
  },
  {
    word: "significant",
    definition: "Sufficiently great or important to be worthy of attention",
    examples: [
      "There was a significant improvement in response time after the refactor.",
      "The findings are significant enough to warrant further investigation.",
    ],
    synonyms: ["notable", "considerable", "meaningful"],
    tier: 1,
  },
  {
    word: "substantial",
    definition: "Of considerable importance, size, or worth",
    examples: [
      "The project required a substantial investment of both time and money.",
      "There has been substantial progress since the last review.",
    ],
    synonyms: ["considerable", "sizable", "meaningful"],
    tier: 1,
  },
  {
    word: "innovative",
    definition: "Featuring new methods or ideas; original and creative in thinking",
    examples: [
      "The team's innovative approach eliminated three steps from the workflow.",
      "She's known for finding innovative solutions to stubborn problems.",
    ],
    synonyms: ["inventive", "original", "creative"],
    tier: 1,
  },
  {
    word: "analytical",
    definition: "Relating to or using analysis or logical reasoning",
    examples: [
      "Her analytical mindset helps the team make evidence-based decisions.",
      "The role demands strong analytical skills and attention to detail.",
    ],
    synonyms: ["logical", "methodical", "systematic"],
    tier: 1,
  },
  {
    word: "assertive",
    definition: "Having or showing a confident and forceful personality without being aggressive",
    examples: [
      "Being assertive in meetings ensures your ideas get heard.",
      "She gave assertive feedback that was direct but respectful.",
    ],
    synonyms: ["confident", "decisive", "self-assured"],
    tier: 1,
  },
  {
    word: "provisional",
    definition: "Arranged or existing for the present, possibly to be changed later",
    examples: [
      "The timeline is provisional until we finalize the vendor contract.",
      "They reached a provisional agreement pending legal review.",
    ],
    synonyms: ["temporary", "interim", "tentative"],
    tier: 1,
  },
  {
    word: "expedient",
    definition: "Convenient and practical, though possibly improper or immoral",
    examples: [
      "Cutting corners was expedient but created long-term technical debt.",
      "The politically expedient choice is not always the right one.",
    ],
    synonyms: ["convenient", "advantageous", "practical"],
    tier: 1,
  },
  {
    word: "methodical",
    definition: "Done in a systematic, orderly way",
    examples: [
      "His methodical approach to debugging saved hours of random guesswork.",
      "The migration requires a methodical plan, not a weekend hack.",
    ],
    synonyms: ["systematic", "organized", "orderly"],
    tier: 1,
  },
  {
    word: "candor",
    definition: "The quality of being open, honest, and direct in expression",
    examples: [
      "Her candor during the retrospective helped the team confront real issues.",
      "I appreciate your candor — it's rare in this kind of review.",
    ],
    synonyms: ["honesty", "frankness", "openness"],
    tier: 1,
  },

  // ─── Tier 1: Action precision ──────────────────────────────────────

  {
    word: "implement",
    definition: "Put a decision, plan, or agreement into effect",
    examples: [
      "The team will implement the new authentication flow next sprint.",
      "Implementing the policy required buy-in from every department.",
    ],
    synonyms: ["execute", "carry out", "enact"],
    tier: 1,
  },
  {
    word: "transform",
    definition: "Make a thorough or dramatic change in form, appearance, or character",
    examples: [
      "Automation transformed how the warehouse operates.",
      "The rebrand completely transformed the company's public perception.",
    ],
    synonyms: ["convert", "overhaul", "revolutionize"],
    tier: 1,
  },
  {
    word: "cultivate",
    definition: "Develop or acquire a quality, skill, or relationship over time through effort",
    examples: [
      "She worked to cultivate trust within her new team.",
      "Good managers cultivate an environment where honest feedback is safe.",
    ],
    synonyms: ["foster", "develop", "nurture"],
    tier: 1,
  },
  {
    word: "alleviate",
    definition: "Make suffering, a problem, or a deficiency less severe",
    examples: [
      "The new hire should alleviate some of the workload pressure.",
      "Automating the report generation alleviated the bottleneck.",
    ],
    synonyms: ["ease", "relieve", "reduce"],
    tier: 1,
  },
  {
    word: "reinforce",
    definition: "Strengthen or support, especially with additional resources or emphasis",
    examples: [
      "The test results reinforce our confidence in the new architecture.",
      "Regular one-on-ones reinforce the relationship between manager and report.",
    ],
    synonyms: ["strengthen", "bolster", "support"],
    tier: 1,
  },
  {
    word: "facilitate",
    definition: "Make an action or process easier or more achievable",
    examples: [
      "The new tool facilitates collaboration across time zones.",
      "Her role is to facilitate discussions, not to dictate outcomes.",
    ],
    synonyms: ["enable", "ease", "assist"],
    tier: 1,
  },
  {
    word: "consolidate",
    definition: "Combine several things into a single more effective or coherent whole",
    examples: [
      "We consolidated three separate dashboards into one unified view.",
      "After the acquisition, the company worked to consolidate operations.",
    ],
    synonyms: ["combine", "merge", "unify"],
    tier: 1,
  },
  {
    word: "augment",
    definition: "Make something greater by adding to it; supplement",
    examples: [
      "AI tools can augment a developer's productivity, not replace it.",
      "We augmented the team with two contractors for the final push.",
    ],
    synonyms: ["supplement", "enhance", "boost"],
    tier: 1,
  },
  {
    word: "reconcile",
    definition: "Restore friendly relations between; make compatible or consistent",
    examples: [
      "It's hard to reconcile the optimistic forecast with the actual numbers.",
      "The teams spent a week reconciling the conflicting data sources.",
    ],
    synonyms: ["resolve", "harmonize", "settle"],
    tier: 1,
  },
  {
    word: "circumvent",
    definition: "Find a way around an obstacle or restriction",
    examples: [
      "The workaround circumvents the limitation without violating the API contract.",
      "Developers shouldn't circumvent the review process, no matter how urgent.",
    ],
    synonyms: ["bypass", "avoid", "sidestep"],
    tier: 1,
  },
  {
    word: "undermine",
    definition: "Erode the base or foundation of; weaken gradually",
    examples: [
      "Constant scope changes undermine the team's ability to deliver on time.",
      "Micromanagement undermines trust and autonomy.",
    ],
    synonyms: ["weaken", "sabotage", "erode"],
    tier: 1,
  },
  {
    word: "leverage",
    definition: "Use something to maximum advantage",
    examples: [
      "We should leverage the existing API rather than building from scratch.",
      "She leveraged her network to find the right candidate quickly.",
    ],
    synonyms: ["utilize", "exploit", "capitalize on"],
    tier: 1,
  },

  // ─── Tier 1: Replace vague nouns ───────────────────────────────────

  {
    word: "perspective",
    definition: "A particular attitude toward or way of regarding something; a point of view",
    examples: [
      "Getting an outside perspective often reveals blind spots.",
      "From a user's perspective, the feature is confusing.",
    ],
    synonyms: ["viewpoint", "standpoint", "outlook"],
    tier: 1,
  },
  {
    word: "endeavor",
    definition: "An attempt to achieve a goal; an earnest effort or enterprise",
    examples: [
      "Building the product from scratch was an ambitious endeavor.",
      "Every creative endeavor involves some degree of uncertainty.",
    ],
    synonyms: ["effort", "undertaking", "enterprise"],
    tier: 1,
  },
  {
    word: "composure",
    definition: "The state of being calm and in control of oneself",
    examples: [
      "She maintained her composure even when the demo crashed live.",
      "Losing your composure in a client meeting is never a good look.",
    ],
    synonyms: ["self-possession", "poise", "equanimity"],
    tier: 1,
  },
  {
    word: "adversity",
    definition: "Difficulties or misfortune; a state of hardship",
    examples: [
      "The team's response to adversity revealed its true character.",
      "Great leaders are forged through adversity, not comfort.",
    ],
    synonyms: ["hardship", "difficulty", "misfortune"],
    tier: 1,
  },
  {
    word: "criterion",
    definition: "A principle or standard by which something is judged or decided",
    examples: [
      "What criterion are we using to evaluate these candidates?",
      "Cost should not be the only criterion in the decision.",
    ],
    synonyms: ["standard", "benchmark", "measure"],
    tier: 1,
  },
  {
    word: "dimension",
    definition: "An aspect or feature of a situation, problem, or thing",
    examples: [
      "There's a dimension to this problem we haven't considered yet.",
      "The ethical dimension of the project deserves more attention.",
    ],
    synonyms: ["aspect", "facet", "element"],
    tier: 1,
  },
  {
    word: "trajectory",
    definition: "The path followed by a moving object; the general direction of development",
    examples: [
      "The company's growth trajectory has been impressive over the past year.",
      "If we stay on this trajectory, we'll hit the target by Q3.",
    ],
    synonyms: ["path", "course", "direction"],
    tier: 1,
  },
  {
    word: "nuance",
    definition: "A subtle difference in meaning, expression, or response",
    examples: [
      "The nuance of the policy is lost when you reduce it to a headline.",
      "Understanding cultural nuance is essential for global product design.",
    ],
    synonyms: ["subtlety", "shade", "distinction"],
    tier: 1,
  },
  {
    word: "ramification",
    definition: "A consequence of an action or event, especially an unwelcome one",
    examples: [
      "Have we fully considered the ramifications of removing this feature?",
      "The legal ramifications of the breach could be severe.",
    ],
    synonyms: ["consequence", "repercussion", "implication"],
    tier: 1,
  },
  {
    word: "dichotomy",
    definition: "A division or contrast between two things presented as opposites",
    examples: [
      "The dichotomy between speed and quality is often a false one.",
      "He rejected the dichotomy of art versus commerce.",
    ],
    synonyms: ["division", "contrast", "split"],
    tier: 1,
  },

  // ─── Tier 1: More precision words ──────────────────────────────────

  {
    word: "coherent",
    definition: "Logical and consistent; forming a unified whole",
    examples: [
      "The strategy needs to be coherent across all departments.",
      "His argument was passionate but not entirely coherent.",
    ],
    synonyms: ["logical", "consistent", "unified"],
    tier: 1,
  },
  {
    word: "plausible",
    definition: "Seeming reasonable or probable; believable",
    examples: [
      "That's a plausible explanation, but we need data to confirm it.",
      "The most plausible scenario is that the server ran out of memory.",
    ],
    synonyms: ["credible", "believable", "feasible"],
    tier: 1,
  },
  {
    word: "intricate",
    definition: "Very complicated or detailed; having many interconnected parts",
    examples: [
      "The intricate dependencies between services make refactoring risky.",
      "She designed an intricate workflow that handled every edge case.",
    ],
    synonyms: ["complex", "elaborate", "detailed"],
    tier: 1,
  },
  {
    word: "inherent",
    definition: "Existing in something as a permanent, essential, or characteristic attribute",
    examples: [
      "There are inherent risks in any system migration.",
      "Flexibility is inherent to the framework's design philosophy.",
    ],
    synonyms: ["intrinsic", "innate", "built-in"],
    tier: 1,
  },
  {
    word: "versatile",
    definition: "Able to adapt or be adapted to many different functions or activities",
    examples: [
      "She's a versatile engineer who can work across the full stack.",
      "The platform is versatile enough to serve both small and enterprise clients.",
    ],
    synonyms: ["adaptable", "flexible", "multifaceted"],
    tier: 1,
  },
  {
    word: "serene",
    definition: "Calm, peaceful, and untroubled",
    examples: [
      "Despite the chaos around the launch, she remained remarkably serene.",
      "The serene environment of the retreat helped the team recharge.",
    ],
    synonyms: ["peaceful", "calm", "tranquil"],
    tier: 1,
  },
  {
    word: "authentic",
    definition: "Of undisputed origin; genuine and true to one's own character",
    examples: [
      "Authentic leadership means being honest about what you don't know.",
      "Customers can tell the difference between authentic branding and performative messaging.",
    ],
    synonyms: ["genuine", "real", "sincere"],
    tier: 1,
  },
  {
    word: "tangible",
    definition: "Clear and definite; able to be shown, touched, or experienced",
    examples: [
      "We need tangible results, not just another roadmap slide.",
      "The training program produced tangible improvements in code quality.",
    ],
    synonyms: ["concrete", "real", "palpable"],
    tier: 1,
  },
  {
    word: "succinct",
    definition: "Briefly and clearly expressed; compact in expression",
    examples: [
      "Her presentation was succinct and hit every key point in under ten minutes.",
      "A succinct summary is more useful than a fifty-page report nobody reads.",
    ],
    synonyms: ["brief", "concise", "pithy"],
    tier: 1,
  },
  {
    word: "ambiguous",
    definition: "Open to more than one interpretation; not having a clear meaning",
    examples: [
      "The requirements were ambiguous, which led to conflicting implementations.",
      "Avoid ambiguous wording in contracts — it invites disputes.",
    ],
    synonyms: ["unclear", "vague", "equivocal"],
    tier: 1,
  },
  {
    word: "feasible",
    definition: "Possible and practical to do or achieve",
    examples: [
      "Is it feasible to deliver the full scope by the original deadline?",
      "The proposal is technically feasible but may exceed the budget.",
    ],
    synonyms: ["achievable", "viable", "practical"],
    tier: 1,
  },
  {
    word: "diminish",
    definition: "Make or become less; reduce in size, importance, or value",
    examples: [
      "Don't diminish the team's contribution by focusing only on what went wrong.",
      "The effect of the incentive program will diminish over time without renewal.",
    ],
    synonyms: ["reduce", "lessen", "decrease"],
    tier: 1,
  },
  {
    word: "unequivocal",
    definition: "Leaving no doubt; unambiguous and clear",
    examples: [
      "The board gave unequivocal approval to proceed with the acquisition.",
      "Her unequivocal stance on the issue left no room for misinterpretation.",
    ],
    synonyms: ["definitive", "absolute", "categorical"],
    tier: 1,
  },
  {
    word: "pivotal",
    definition: "Of crucial importance in relation to the development of something",
    examples: [
      "The third quarter was pivotal in determining the company's direction.",
      "Her intervention at that meeting was pivotal to the project's survival.",
    ],
    synonyms: ["crucial", "critical", "decisive"],
    tier: 1,
  },
  {
    word: "sporadic",
    definition: "Occurring at irregular intervals; not continuous or steady",
    examples: [
      "The bug appeared only in sporadic bursts, making it hard to reproduce.",
      "Communication from the client has been sporadic at best.",
    ],
    synonyms: ["intermittent", "irregular", "occasional"],
    tier: 1,
  },
  {
    word: "arbitrary",
    definition: "Based on random choice or personal whim rather than reason or system",
    examples: [
      "The deadline felt arbitrary — no one could explain why that date mattered.",
      "Arbitrary naming conventions make the codebase hard to navigate.",
    ],
    synonyms: ["random", "capricious", "unjustified"],
    tier: 1,
  },
  {
    word: "conducive",
    definition: "Making a certain situation or outcome likely or possible",
    examples: [
      "Open floor plans aren't always conducive to deep focus work.",
      "The retreat created an environment conducive to creative thinking.",
    ],
    synonyms: ["favorable", "helpful", "supportive"],
    tier: 1,
  },
  {
    word: "detrimental",
    definition: "Tending to cause harm; damaging",
    examples: [
      "Skipping code reviews is detrimental to long-term quality.",
      "The toxic culture was detrimental to both retention and morale.",
    ],
    synonyms: ["harmful", "damaging", "injurious"],
    tier: 1,
  },
  {
    word: "implicit",
    definition: "Implied though not plainly expressed; inherent in the nature of something",
    examples: [
      "There was an implicit understanding that overtime would be compensated.",
      "The risk is implicit in the architecture — we just haven't named it.",
    ],
    synonyms: ["implied", "unspoken", "understood"],
    tier: 1,
  },
  {
    word: "explicit",
    definition: "Stated clearly and in detail, leaving no room for confusion",
    examples: [
      "Make the requirements explicit so there's no ambiguity.",
      "The contract is explicit about the consequences of missed deadlines.",
    ],
    synonyms: ["clear", "definite", "unambiguous"],
    tier: 1,
  },
  {
    word: "diligent",
    definition: "Having or showing care and conscientiousness in one's work or duties",
    examples: [
      "Her diligent research uncovered a critical flaw in the vendor's claims.",
      "Diligent follow-up is what turns a good plan into real results.",
    ],
    synonyms: ["industrious", "conscientious", "assiduous"],
    tier: 1,
  },
  {
    word: "precarious",
    definition: "Not securely held or in position; dependent on chance, uncertain",
    examples: [
      "The startup's financial position was increasingly precarious.",
      "Building on a single vendor puts the project in a precarious spot.",
    ],
    synonyms: ["unstable", "insecure", "uncertain"],
    tier: 1,
  },
  {
    word: "discrepancy",
    definition: "A lack of compatibility or similarity between two or more facts",
    examples: [
      "There's a discrepancy between the reported numbers and the actual revenue.",
      "The QA team flagged a discrepancy between the spec and the implementation.",
    ],
    synonyms: ["inconsistency", "difference", "divergence"],
    tier: 1,
  },
  {
    word: "pragmatism",
    definition: "An approach that evaluates theories or actions primarily by their practical outcomes",
    examples: [
      "Her pragmatism kept the team grounded when ambitions outpaced resources.",
      "There's a healthy tension between idealism and pragmatism in good engineering.",
    ],
    synonyms: ["practicality", "realism", "utilitarianism"],
    tier: 1,
  },
  {
    word: "robust",
    definition: "Strong and healthy; able to withstand adverse conditions",
    examples: [
      "The error-handling is robust enough to handle unexpected inputs.",
      "We need a more robust testing strategy before the next release.",
    ],
    synonyms: ["strong", "sturdy", "resilient"],
    tier: 1,
  },
  {
    word: "pertinent",
    definition: "Relevant or applicable to a particular matter",
    examples: [
      "She raised a pertinent question that no one had considered.",
      "Only include pertinent details — leave out the background noise.",
    ],
    synonyms: ["relevant", "applicable", "germane"],
    tier: 1,
  },
  {
    word: "inadvertent",
    definition: "Not resulting from deliberate planning; unintentional",
    examples: [
      "The data leak was inadvertent, caused by a misconfigured permission.",
      "An inadvertent omission in the contract led to months of disputes.",
    ],
    synonyms: ["unintentional", "accidental", "unplanned"],
    tier: 1,
  },
  {
    word: "indispensable",
    definition: "Absolutely necessary; essential",
    examples: [
      "Automated testing has become indispensable to our release process.",
      "She proved indispensable during the platform migration.",
    ],
    synonyms: ["essential", "vital", "crucial"],
    tier: 1,
  },
  {
    word: "erratic",
    definition: "Not even or regular in pattern or movement; unpredictable",
    examples: [
      "The API's erratic response times made performance testing unreliable.",
      "His erratic schedule made it difficult to plan meetings.",
    ],
    synonyms: ["unpredictable", "inconsistent", "irregular"],
    tier: 1,
  },
  {
    word: "prudent",
    definition: "Acting with care and thought for the future; showing good judgment",
    examples: [
      "It would be prudent to run a pilot before the full rollout.",
      "A prudent investment now will save us significant cost later.",
    ],
    synonyms: ["wise", "sensible", "judicious"],
    tier: 1,
  },

  // ─── Tier 2: Precision Vocabulary — AWL / professional ─────────────

  {
    word: "elaborate",
    definition: "Develop or present in detail; involving many carefully arranged parts",
    examples: [
      "Could you elaborate on how the caching layer works?",
      "The proposal was elaborate, covering every possible scenario.",
    ],
    synonyms: ["expand", "detail", "develop"],
    tier: 2,
  },
  {
    word: "paradox",
    definition: "A situation or statement that seems contradictory but may reveal a deeper truth",
    examples: [
      "It's a paradox that adding more developers slowed down the project.",
      "The paradox of choice means too many options can paralyze decision-making.",
    ],
    synonyms: ["contradiction", "anomaly", "enigma"],
    tier: 2,
  },
  {
    word: "anomalous",
    definition: "Deviating from what is standard, normal, or expected",
    examples: [
      "The anomalous spike in traffic turned out to be a bot attack.",
      "Her anomalous test results prompted a deeper investigation.",
    ],
    synonyms: ["abnormal", "irregular", "atypical"],
    tier: 2,
  },
  {
    word: "emulate",
    definition: "Match or surpass by imitation; strive to equal or excel",
    examples: [
      "The new system emulates the behavior of the legacy platform.",
      "Many startups try to emulate Silicon Valley culture without understanding its context.",
    ],
    synonyms: ["imitate", "mirror", "replicate"],
    tier: 2,
  },
  {
    word: "deduce",
    definition: "Arrive at a conclusion by reasoning from evidence or known facts",
    examples: [
      "From the logs, we deduced that the failure occurred during the migration step.",
      "You can deduce the root cause by eliminating each variable systematically.",
    ],
    synonyms: ["infer", "conclude", "reason"],
    tier: 2,
  },
  {
    word: "ameliorate",
    definition: "Make a bad or unsatisfactory situation better; improve",
    examples: [
      "The patch was intended to ameliorate the worst performance issues.",
      "Flexible hours ameliorated some of the dissatisfaction around workload.",
    ],
    synonyms: ["improve", "enhance", "better"],
    tier: 2,
  },
  {
    word: "ephemeral",
    definition: "Lasting for a very short time; transient",
    examples: [
      "The containers are ephemeral — they spin up, do their job, and disappear.",
      "Social media fame is ephemeral; building a real audience takes years.",
    ],
    synonyms: ["fleeting", "transient", "short-lived"],
    tier: 2,
  },
  {
    word: "mechanism",
    definition: "A system of parts working together; a natural or established process",
    examples: [
      "What's the mechanism for escalating critical bugs after hours?",
      "Feedback loops are a powerful mechanism for continuous improvement.",
    ],
    synonyms: ["system", "process", "apparatus"],
    tier: 2,
  },
  {
    word: "abstraction",
    definition: "The process of removing details to focus on essential qualities; a general concept",
    examples: [
      "The right level of abstraction makes the code easier to reason about.",
      "His explanation relied too heavily on abstraction and not enough on concrete examples.",
    ],
    synonyms: ["generalization", "concept", "simplification"],
    tier: 2,
  },
  {
    word: "aspiration",
    definition: "A strong hope or ambition to achieve something",
    examples: [
      "Her aspiration to lead a product team drove every career decision.",
      "The company's aspirations outpaced its operational capacity.",
    ],
    synonyms: ["ambition", "goal", "desire"],
    tier: 2,
  },
  {
    word: "ingenuity",
    definition: "The quality of being clever, original, and inventive",
    examples: [
      "The team showed remarkable ingenuity in solving the constraint problem.",
      "What the project lacked in budget, it made up for in ingenuity.",
    ],
    synonyms: ["inventiveness", "creativity", "resourcefulness"],
    tier: 2,
  },
  {
    word: "discernment",
    definition: "The ability to judge well; keen perception and good judgment",
    examples: [
      "Hiring well requires discernment — resumes only tell part of the story.",
      "His discernment in choosing strategic partners paid off in the long run.",
    ],
    synonyms: ["judgment", "insight", "perception"],
    tier: 2,
  },
  {
    word: "attribute",
    definition: "Regard something as being caused by or belonging to; a quality or feature",
    examples: [
      "She attributed the project's success to clear communication from day one.",
      "Resilience is the attribute most correlated with long-term performance.",
    ],
    synonyms: ["ascribe", "assign", "credit"],
    tier: 2,
  },
  {
    word: "integrate",
    definition: "Combine one thing with another so they become a whole",
    examples: [
      "The goal is to integrate the new service without disrupting existing workflows.",
      "Teams that integrate feedback early ship better products.",
    ],
    synonyms: ["combine", "merge", "incorporate"],
    tier: 2,
  },
  {
    word: "fundamental",
    definition: "Forming a necessary base or core; of central importance",
    examples: [
      "Trust is fundamental to any high-performing team.",
      "There's a fundamental flaw in the assumptions behind this model.",
    ],
    synonyms: ["essential", "basic", "core"],
    tier: 2,
  },
  {
    word: "propensity",
    definition: "An inclination or natural tendency to behave in a particular way",
    examples: [
      "The system has a propensity to fail under heavy concurrent load.",
      "His propensity for overengineering added unnecessary complexity.",
    ],
    synonyms: ["tendency", "inclination", "predisposition"],
    tier: 2,
  },
  {
    word: "deference",
    definition: "Humble submission and respect; yielding to the judgment of another",
    examples: [
      "She showed deference to the domain experts when technical questions arose.",
      "Too much deference to seniority can stifle fresh ideas.",
    ],
    synonyms: ["respect", "regard", "compliance"],
    tier: 2,
  },
  {
    word: "conjecture",
    definition: "An opinion or conclusion formed on the basis of incomplete information",
    examples: [
      "Without access to the production logs, anything we say is conjecture.",
      "His theory was dismissed as mere conjecture until the data proved him right.",
    ],
    synonyms: ["speculation", "supposition", "hypothesis"],
    tier: 2,
  },
  {
    word: "juxtaposition",
    definition: "The fact of placing two things side by side for comparison or contrast",
    examples: [
      "The juxtaposition of the old and new interfaces highlighted how far we've come.",
      "The juxtaposition of startup speed with enterprise compliance is the core challenge.",
    ],
    synonyms: ["contrast", "comparison", "collocation"],
    tier: 2,
  },
  {
    word: "prescient",
    definition: "Having or showing knowledge of events before they take place",
    examples: [
      "Her prescient warning about supply chain risks proved accurate six months later.",
      "In hindsight, the memo reads as almost prescient.",
    ],
    synonyms: ["foresighted", "prophetic", "visionary"],
    tier: 2,
  },
  {
    word: "synthesize",
    definition: "Combine a number of things into a coherent whole",
    examples: [
      "Her ability to synthesize feedback from five teams into one plan was impressive.",
      "The report synthesizes data from multiple independent sources.",
    ],
    synonyms: ["combine", "blend", "unify"],
    tier: 2,
  },
  {
    word: "antithesis",
    definition: "A person or thing that is the direct opposite of something else",
    examples: [
      "His management style was the antithesis of micromanagement.",
      "The new design is the antithesis of the cluttered legacy interface.",
    ],
    synonyms: ["opposite", "contrary", "inverse"],
    tier: 2,
  },
  {
    word: "paradigm",
    definition: "A typical example or pattern; a fundamental model or framework of thinking",
    examples: [
      "The shift to remote work represents a paradigm change for the industry.",
      "Agile introduced a new paradigm for how teams build software.",
    ],
    synonyms: ["model", "framework", "pattern"],
    tier: 2,
  },
  {
    word: "extrapolate",
    definition: "Extend the application of known information to an unknown situation by assuming trends continue",
    examples: [
      "You can't extrapolate from one quarter of data and call it a trend.",
      "If we extrapolate current growth rates, we'll need to double infrastructure by year's end.",
    ],
    synonyms: ["project", "infer", "estimate"],
    tier: 2,
  },
  {
    word: "stratify",
    definition: "Arrange or classify into different levels, layers, or social groups",
    examples: [
      "We stratified the user base by engagement level to target our campaigns.",
      "The data becomes more useful once you stratify it by region and cohort.",
    ],
    synonyms: ["layer", "classify", "categorize"],
    tier: 2,
  },
  {
    word: "disambiguate",
    definition: "Remove uncertainty of meaning from; make unambiguous",
    examples: [
      "The naming convention helps disambiguate which service owns each endpoint.",
      "We need to disambiguate the term 'user' — it means three different things in this codebase.",
    ],
    synonyms: ["clarify", "distinguish", "resolve"],
    tier: 2,
  },
  {
    word: "interpolate",
    definition: "Insert something between fixed points; estimate values between known data points",
    examples: [
      "The chart interpolates between the quarterly data points to show a smooth trend line.",
      "She interpolated a clarifying remark into the otherwise technical presentation.",
    ],
    synonyms: ["insert", "estimate", "interject"],
    tier: 2,
  },
  {
    word: "coalesce",
    definition: "Come together and form one mass or whole; merge",
    examples: [
      "Several small complaints coalesced into a formal grievance.",
      "The ideas from the brainstorm eventually coalesced into a coherent product vision.",
    ],
    synonyms: ["merge", "unite", "converge"],
    tier: 2,
  },
  {
    word: "demarcate",
    definition: "Set the boundaries or limits of; distinguish clearly",
    examples: [
      "The architecture clearly demarcates responsibilities between the frontend and backend.",
      "It's important to demarcate personal opinion from data-driven conclusions.",
    ],
    synonyms: ["delineate", "delimit", "distinguish"],
    tier: 2,
  },
  {
    word: "codify",
    definition: "Arrange laws or rules into a systematic code; formalize",
    examples: [
      "We should codify these best practices into a style guide.",
      "The team agreed to codify the decision-making process so it's repeatable.",
    ],
    synonyms: ["formalize", "systematize", "catalog"],
    tier: 2,
  },

  // ─── Tier 3: Power Words — Sophisticated / intellectual ────────────

  {
    word: "ineffable",
    definition: "Too great or extreme to be expressed or described in words",
    examples: [
      "There was an ineffable quality to the team's chemistry that made everything click.",
      "The ineffable satisfaction of shipping a product that truly helps people kept her going.",
    ],
    synonyms: ["indescribable", "inexpressible", "unspeakable"],
    tier: 3,
  },
  {
    word: "magnanimous",
    definition: "Very generous or forgiving, especially toward a rival or less powerful person",
    examples: [
      "He was magnanimous in victory, praising the competing team's effort publicly.",
      "A magnanimous response to criticism can disarm even the harshest detractor.",
    ],
    synonyms: ["generous", "benevolent", "noble"],
    tier: 3,
  },
  {
    word: "metamorphosis",
    definition: "A complete change of form, structure, or character; a profound transformation",
    examples: [
      "The company underwent a metamorphosis from hardware vendor to cloud platform.",
      "His metamorphosis from individual contributor to effective leader took years of deliberate effort.",
    ],
    synonyms: ["transformation", "transmutation", "evolution"],
    tier: 3,
  },
  {
    word: "transcend",
    definition: "Go beyond the range or limits of; surpass",
    examples: [
      "Great design transcends trends — it remains effective decades later.",
      "Her influence transcended the engineering department and reshaped the entire culture.",
    ],
    synonyms: ["surpass", "exceed", "go beyond"],
    tier: 3,
  },
  {
    word: "equanimity",
    definition: "Mental calmness and composure, especially in a difficult situation",
    examples: [
      "She handled the crisis with remarkable equanimity, never raising her voice.",
      "Maintaining equanimity under pressure is what separates good leaders from great ones.",
    ],
    synonyms: ["composure", "serenity", "poise"],
    tier: 3,
  },
  {
    word: "serendipity",
    definition: "The occurrence of events by chance in a happy or beneficial way",
    examples: [
      "It was pure serendipity that the bug fix also resolved a separate performance issue.",
      "Some of the best hires come through serendipity rather than formal recruitment.",
    ],
    synonyms: ["fortune", "luck", "providence"],
    tier: 3,
  },
  {
    word: "luminous",
    definition: "Full of or shedding light; brilliant in quality or clarity",
    examples: [
      "Her luminous prose turned a dry topic into something genuinely engaging.",
      "The presentation was luminous in its clarity — even non-technical stakeholders followed every point.",
    ],
    synonyms: ["radiant", "brilliant", "incandescent"],
    tier: 3,
  },
  {
    word: "scrupulous",
    definition: "Diligent, thorough, and extremely attentive to details and accuracy",
    examples: [
      "He was scrupulous about data privacy, double-checking every access control.",
      "Her scrupulous attention to licensing prevented a costly compliance violation.",
    ],
    synonyms: ["meticulous", "conscientious", "painstaking"],
    tier: 3,
  },
  {
    word: "astute",
    definition: "Having an ability to accurately assess situations and turn them to one's advantage",
    examples: [
      "An astute observer would have noticed the market shift months earlier.",
      "Her astute reading of the negotiation dynamics secured better terms for the team.",
    ],
    synonyms: ["shrewd", "perceptive", "sharp"],
    tier: 3,
  },
  {
    word: "perceptive",
    definition: "Having or showing sensitive insight and understanding",
    examples: [
      "His perceptive feedback identified issues that two rounds of review had missed.",
      "She was perceptive enough to sense the team's unspoken concerns.",
    ],
    synonyms: ["insightful", "observant", "discerning"],
    tier: 3,
  },
  {
    word: "fortitude",
    definition: "Courage in pain or adversity; mental and emotional strength",
    examples: [
      "Launching a startup requires the fortitude to endure long stretches of uncertainty.",
      "The team showed remarkable fortitude during the most challenging phase of the project.",
    ],
    synonyms: ["courage", "resilience", "endurance"],
    tier: 3,
  },
  {
    word: "tenacity",
    definition: "The quality of gripping something firmly; persistent determination",
    examples: [
      "Her tenacity in pursuing the root cause saved the company from a repeat failure.",
      "What he lacked in experience, he made up for with sheer tenacity.",
    ],
    synonyms: ["persistence", "determination", "resolve"],
    tier: 3,
  },
  {
    word: "solace",
    definition: "Comfort or consolation in a time of distress or sadness",
    examples: [
      "He found solace in the fact that the team had done everything within their control.",
      "There's little solace in knowing the failure was due to external factors.",
    ],
    synonyms: ["comfort", "consolation", "relief"],
    tier: 3,
  },
  {
    word: "reverence",
    definition: "Deep respect and admiration for someone or something",
    examples: [
      "The team spoke about the original architect with a reverence that bordered on mythology.",
      "There's a reverence for craft in this organization that you don't find everywhere.",
    ],
    synonyms: ["veneration", "admiration", "awe"],
    tier: 3,
  },
  {
    word: "melancholy",
    definition: "A deep, persistent sadness or reflective gloom",
    examples: [
      "There was a sense of melancholy at the farewell dinner that no one tried to mask.",
      "The melancholy of shutting down a product you built from scratch is hard to describe.",
    ],
    synonyms: ["sadness", "sorrow", "wistfulness"],
    tier: 3,
  },
  {
    word: "introspective",
    definition: "Inclined to examine one's own thoughts and feelings",
    examples: [
      "The retrospective was more introspective than usual — the team genuinely reflected.",
      "She's an introspective leader who thinks carefully before acting.",
    ],
    synonyms: ["reflective", "contemplative", "thoughtful"],
    tier: 3,
  },
  {
    word: "ardent",
    definition: "Enthusiastic and passionate; fervent",
    examples: [
      "He was an ardent advocate for accessible design long before it was mainstream.",
      "Her ardent belief in the mission kept the team motivated through setbacks.",
    ],
    synonyms: ["passionate", "fervent", "zealous"],
    tier: 3,
  },
  {
    word: "captivating",
    definition: "Capable of attracting and holding attention; enchanting",
    examples: [
      "Her captivating keynote held the audience's attention for a full hour.",
      "The demo was captivating — even skeptics were leaning forward.",
    ],
    synonyms: ["fascinating", "enthralling", "mesmerizing"],
    tier: 3,
  },
  {
    word: "benevolent",
    definition: "Well-meaning and kindly; generous in intention and action",
    examples: [
      "His benevolent mentorship shaped the careers of dozens of junior engineers.",
      "The policy was benevolent in intent but poorly executed in practice.",
    ],
    synonyms: ["kind", "generous", "compassionate"],
    tier: 3,
  },
  {
    word: "exquisite",
    definition: "Extremely beautiful and delicate; intensely felt",
    examples: [
      "The attention to typography gave the interface an exquisite polish.",
      "There's an exquisite irony in a communication tool that nobody can figure out how to use.",
    ],
    synonyms: ["beautiful", "elegant", "refined"],
    tier: 3,
  },
];
