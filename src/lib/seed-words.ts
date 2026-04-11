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

  // ─── Tier 1: Verb replacements ─────────────────────────────────────

  {
    word: "assert",
    definition: "State a fact or belief confidently and forcefully",
    examples: [
      "She asserted that the design flaw was present from the start.",
      "He asserted his position clearly before the debate began.",
    ],
    synonyms: ["declare", "maintain", "contend"],
    tier: 1,
  },
  {
    word: "contend",
    definition: "Assert something as a position in an argument; struggle to deal with",
    examples: [
      "The report contends that current safety standards are insufficient.",
      "Engineers must contend with legacy constraints on every major feature.",
    ],
    synonyms: ["assert", "argue", "claim"],
    tier: 1,
  },
  {
    word: "acknowledge",
    definition: "Accept or admit the existence or truth of something",
    examples: [
      "She acknowledged the mistake without deflecting blame onto the team.",
      "The document acknowledges several unresolved risks in the approach.",
    ],
    synonyms: ["admit", "recognize", "concede"],
    tier: 1,
  },
  {
    word: "concur",
    definition: "Be of the same opinion; agree",
    examples: [
      "All three reviewers concurred that the proposal was technically sound.",
      "I concur with the assessment — the timeline is too aggressive.",
    ],
    synonyms: ["agree", "assent", "accord"],
    tier: 1,
  },
  {
    word: "acquiesce",
    definition: "Accept something reluctantly but without protest",
    examples: [
      "The team acquiesced to the deadline despite reservations about quality.",
      "He acquiesced to the policy change after voicing his concerns.",
    ],
    synonyms: ["comply", "yield", "consent"],
    tier: 1,
  },
  {
    word: "imply",
    definition: "Suggest something without stating it explicitly",
    examples: [
      "The data implies a correlation, but does not prove causation.",
      "His tone implied dissatisfaction even though he said nothing critical.",
    ],
    synonyms: ["suggest", "indicate", "insinuate"],
    tier: 1,
  },
  {
    word: "insinuate",
    definition: "Suggest or hint in an indirect and typically unpleasant way",
    examples: [
      "She insinuated that the delays were caused by poor planning.",
      "He never said it directly, but his questions insinuated doubt.",
    ],
    synonyms: ["hint", "imply", "intimate"],
    tier: 1,
  },
  {
    word: "manifest",
    definition: "Show or demonstrate something clearly; become apparent",
    examples: [
      "The underlying tension eventually manifested as open conflict.",
      "Poor architecture manifests as slow feature delivery over time.",
    ],
    synonyms: ["reveal", "display", "demonstrate"],
    tier: 1,
  },
  {
    word: "diverge",
    definition: "Develop in a different direction; differ from a standard or norm",
    examples: [
      "The two implementations diverge significantly in how they handle errors.",
      "At this point, opinions on the architecture diverge sharply.",
    ],
    synonyms: ["deviate", "differ", "separate"],
    tier: 1,
  },
  {
    word: "refute",
    definition: "Prove a statement or theory to be wrong or false",
    examples: [
      "The latest benchmark data refutes the claim that the old system is faster.",
      "She refuted each objection with clear evidence.",
    ],
    synonyms: ["disprove", "rebut", "counter"],
    tier: 1,
  },
  {
    word: "apprise",
    definition: "Inform or tell someone about a situation",
    examples: [
      "Please apprise the stakeholders of any changes to the timeline.",
      "She apprised the board of the security incident within the hour.",
    ],
    synonyms: ["inform", "notify", "brief"],
    tier: 1,
  },
  {
    word: "admonish",
    definition: "Warn or reprimand someone firmly but not harshly",
    examples: [
      "The manager admonished the team for skipping the documentation step.",
      "She admonished him gently, making clear it should not happen again.",
    ],
    synonyms: ["warn", "reprimand", "caution"],
    tier: 1,
  },
  {
    word: "bolster",
    definition: "Strengthen or support; give a boost to",
    examples: [
      "Additional test coverage would bolster confidence before the release.",
      "The new hire bolstered the team's capacity significantly.",
    ],
    synonyms: ["strengthen", "reinforce", "support"],
    tier: 1,
  },
  {
    word: "initiate",
    definition: "Cause a process or action to begin",
    examples: [
      "She initiated the review process three weeks ahead of schedule.",
      "The error initiates a rollback of the entire transaction.",
    ],
    synonyms: ["begin", "launch", "start"],
    tier: 1,
  },
  {
    word: "cease",
    definition: "Come or bring to an end; stop",
    examples: [
      "Development on the legacy branch will cease at the end of the quarter.",
      "The noise ceased the moment the presentation began.",
    ],
    synonyms: ["stop", "halt", "discontinue"],
    tier: 1,
  },
  {
    word: "foster",
    definition: "Encourage the development of something over time",
    examples: [
      "Good documentation fosters knowledge sharing across the organization.",
      "She deliberately fostered a culture of psychological safety on her team.",
    ],
    synonyms: ["nurture", "cultivate", "promote"],
    tier: 1,
  },
  {
    word: "contemplate",
    definition: "Think carefully and at length about something; consider thoroughly",
    examples: [
      "Take time to contemplate the downstream effects before committing.",
      "He contemplated a career change after the project was cancelled.",
    ],
    synonyms: ["consider", "ponder", "reflect on"],
    tier: 1,
  },
  {
    word: "ponder",
    definition: "Think carefully, especially before making a decision",
    examples: [
      "She pondered the tradeoffs for days before choosing an approach.",
      "He sat quietly, pondering the feedback he had just received.",
    ],
    synonyms: ["consider", "deliberate", "contemplate"],
    tier: 1,
  },
  {
    word: "fathom",
    definition: "Understand after much thought; comprehend something difficult",
    examples: [
      "It was hard to fathom why such a critical bug had passed review.",
      "I cannot fathom why this dependency was introduced without discussion.",
    ],
    synonyms: ["understand", "grasp", "comprehend"],
    tier: 1,
  },
  {
    word: "discern",
    definition: "Perceive or recognize something not immediately obvious; distinguish",
    examples: [
      "It takes experience to discern which technical debt is truly dangerous.",
      "She could discern the real concern beneath his surface-level objection.",
    ],
    synonyms: ["perceive", "detect", "distinguish"],
    tier: 1,
  },
  {
    word: "speculate",
    definition: "Form a theory or conjecture without firm evidence",
    examples: [
      "We can only speculate about the root cause until the logs are recovered.",
      "Analysts speculated that the company would announce layoffs by year-end.",
    ],
    synonyms: ["theorize", "conjecture", "hypothesize"],
    tier: 1,
  },
  {
    word: "ascertain",
    definition: "Find out something for certain; make sure of",
    examples: [
      "We need to ascertain whether the data was corrupted before proceeding.",
      "The audit was conducted to ascertain compliance with industry standards.",
    ],
    synonyms: ["determine", "establish", "verify"],
    tier: 1,
  },

  // ─── Tier 1: Transitional / connective ─────────────────────────────

  {
    word: "moreover",
    definition: "As a further matter; besides; in addition to what has been said",
    examples: [
      "The approach is faster; moreover, it requires less maintenance.",
      "The design is elegant. Moreover, it scales to millions of users.",
    ],
    synonyms: ["furthermore", "additionally", "besides"],
    tier: 1,
  },
  {
    word: "consequently",
    definition: "As a result or effect of a previous action or event",
    examples: [
      "The data pipeline failed; consequently, the report was not generated.",
      "She left the company, and consequently the project lost its most experienced voice.",
    ],
    synonyms: ["therefore", "as a result", "hence"],
    tier: 1,
  },
  {
    word: "nevertheless",
    definition: "In spite of that; notwithstanding; all the same",
    examples: [
      "The timeline was aggressive; nevertheless, the team delivered on time.",
      "The evidence was thin. Nevertheless, the committee voted to proceed.",
    ],
    synonyms: ["nonetheless", "however", "yet"],
    tier: 1,
  },
  {
    word: "notwithstanding",
    definition: "In spite of; without being prevented by",
    examples: [
      "Notwithstanding the budget cuts, the project met its original goals.",
      "The risks are real, notwithstanding the optimistic projections.",
    ],
    synonyms: ["despite", "regardless of", "in spite of"],
    tier: 1,
  },
  {
    word: "conversely",
    definition: "Introducing a statement that contrasts with or reverses what has just been said",
    examples: [
      "More features can attract users; conversely, they can overwhelm them.",
      "Silence signals agreement in some cultures; conversely, it signals disagreement in others.",
    ],
    synonyms: ["on the other hand", "inversely", "contrariwise"],
    tier: 1,
  },
  {
    word: "albeit",
    definition: "Though; even if — used to introduce a concession",
    examples: [
      "The fix worked, albeit with a minor performance trade-off.",
      "The results were positive, albeit less dramatic than we had hoped.",
    ],
    synonyms: ["though", "even if", "although"],
    tier: 1,
  },
  {
    word: "whereas",
    definition: "In contrast or comparison with the fact that",
    examples: [
      "The first system was synchronous, whereas the new one is fully event-driven.",
      "Senior engineers prefer clarity, whereas junior engineers often over-engineer.",
    ],
    synonyms: ["while", "in contrast", "on the other hand"],
    tier: 1,
  },
  {
    word: "hence",
    definition: "As a consequence; for this reason; therefore",
    examples: [
      "The service lacked retry logic; hence the cascade of failures.",
      "The deadline was moved up; hence the need to cut scope.",
    ],
    synonyms: ["therefore", "thus", "consequently"],
    tier: 1,
  },
  {
    word: "thus",
    definition: "As a result or consequence of this; in this way",
    examples: [
      "The dependency was removed, thus reducing the build time by half.",
      "The team aligned early, thus avoiding costly rework later.",
    ],
    synonyms: ["therefore", "hence", "accordingly"],
    tier: 1,
  },
  {
    word: "accordingly",
    definition: "In a way that is appropriate to the circumstances; consequently",
    examples: [
      "The scope changed significantly; the timeline was adjusted accordingly.",
      "We identified the bottleneck and allocated resources accordingly.",
    ],
    synonyms: ["correspondingly", "therefore", "consequently"],
    tier: 1,
  },
  {
    word: "subsequently",
    definition: "Coming after or following something in time or order",
    examples: [
      "The patch was applied and subsequently tested in staging.",
      "She joined the team as a contractor and was subsequently brought on full-time.",
    ],
    synonyms: ["afterward", "later", "following"],
    tier: 1,
  },
  {
    word: "ultimately",
    definition: "In the end; after everything has been considered",
    examples: [
      "Ultimately, the decision comes down to user trust.",
      "We tried several approaches; ultimately, the simplest one worked best.",
    ],
    synonyms: ["finally", "in the end", "at last"],
    tier: 1,
  },
  {
    word: "fundamentally",
    definition: "In a central or primary respect; at the most basic level",
    examples: [
      "The two architectures are fundamentally different in how they handle state.",
      "This is not a process problem; it is fundamentally a communication problem.",
    ],
    synonyms: ["essentially", "basically", "at its core"],
    tier: 1,
  },
  {
    word: "notably",
    definition: "In particular; especially; worthy of attention",
    examples: [
      "Several teams improved their delivery time; notably, the platform team cut theirs in half.",
      "The proposal was well-received, notably by the engineering leadership.",
    ],
    synonyms: ["particularly", "especially", "significantly"],
    tier: 1,
  },
  {
    word: "henceforth",
    definition: "From this time on; from now on",
    examples: [
      "Henceforth, all deployments must go through the new approval process.",
      "The team agreed that henceforth no feature would ship without a test plan.",
    ],
    synonyms: ["hereafter", "from now on", "going forward"],
    tier: 1,
  },

  // ─── Tier 1: Precision nouns and adjectives ─────────────────────────

  {
    word: "consensus",
    definition: "General agreement reached by a group as a whole",
    examples: [
      "We reached consensus on the architecture after three rounds of review.",
      "Without consensus, the decision kept getting relitigated at every meeting.",
    ],
    synonyms: ["agreement", "accord", "unanimity"],
    tier: 1,
  },
  {
    word: "allocation",
    definition: "The action or process of distributing resources for a purpose",
    examples: [
      "The budget allocation for infrastructure was insufficient to support the growth plan.",
      "Time allocation across projects needs to be revisited each quarter.",
    ],
    synonyms: ["distribution", "assignment", "apportionment"],
    tier: 1,
  },
  {
    word: "constraint",
    definition: "A limitation or restriction; something that limits options",
    examples: [
      "The main constraint is not budget — it's available engineering time.",
      "Design under constraint often produces more creative solutions.",
    ],
    synonyms: ["limitation", "restriction", "bound"],
    tier: 1,
  },
  {
    word: "incentive",
    definition: "A thing that motivates or encourages someone to do something",
    examples: [
      "The bonus structure creates the right incentives for long-term thinking.",
      "Without a clear incentive, adoption of the new tool will be slow.",
    ],
    synonyms: ["motivation", "inducement", "stimulus"],
    tier: 1,
  },
  {
    word: "mandate",
    definition: "An official order or commission to do something; an authorization",
    examples: [
      "The new policy mandates a security review before any external release.",
      "The team operates under a mandate to reduce infrastructure costs by 30%.",
    ],
    synonyms: ["directive", "order", "authorization"],
    tier: 1,
  },
  {
    word: "venture",
    definition: "A risky or daring undertaking; dare to do something uncertain",
    examples: [
      "The joint venture required both companies to share proprietary data.",
      "She ventured a prediction that few others were willing to make.",
    ],
    synonyms: ["enterprise", "undertaking", "endeavor"],
    tier: 1,
  },
  {
    word: "legitimate",
    definition: "Conforming to the law or rules; valid and justifiable",
    examples: [
      "There are legitimate concerns about the privacy implications.",
      "It is a legitimate question — we should address it head-on.",
    ],
    synonyms: ["valid", "justified", "lawful"],
    tier: 1,
  },
  {
    word: "pristine",
    definition: "In its original condition; unspoiled; clean and fresh",
    examples: [
      "The staging environment should be restored to a pristine state before each test run.",
      "The codebase was pristine when we inherited it; two years later, not so much.",
    ],
    synonyms: ["immaculate", "unspoiled", "flawless"],
    tier: 1,
  },
  {
    word: "deficient",
    definition: "Not having enough of a specified quality or ingredient; lacking",
    examples: [
      "The onboarding process is deficient in technical depth.",
      "The model was deficient in its handling of edge cases.",
    ],
    synonyms: ["lacking", "inadequate", "insufficient"],
    tier: 1,
  },
  {
    word: "dynamic",
    definition: "Characterized by constant change, activity, or progress; energetic",
    examples: [
      "The market is dynamic — a strategy that worked last year may fail today.",
      "She thrives in dynamic environments where priorities shift rapidly.",
    ],
    synonyms: ["changing", "active", "energetic"],
    tier: 1,
  },
  {
    word: "uniform",
    definition: "Remaining the same in all cases; consistent and unvarying",
    examples: [
      "A uniform naming convention across all services reduces onboarding friction.",
      "The experience should feel uniform regardless of which device the user is on.",
    ],
    synonyms: ["consistent", "standardized", "homogeneous"],
    tier: 1,
  },
  {
    word: "merit",
    definition: "The quality of being particularly good or worthy; deserve",
    examples: [
      "The proposal has real merit and deserves serious consideration.",
      "Decisions should be made on merit, not seniority.",
    ],
    synonyms: ["value", "worth", "quality"],
    tier: 1,
  },
  {
    word: "execution",
    definition: "The carrying out or putting into effect of a plan or order; performance",
    examples: [
      "The strategy was sound; the failure was in execution.",
      "Flawless execution separates successful projects from endless ones.",
    ],
    synonyms: ["implementation", "performance", "delivery"],
    tier: 1,
  },
  {
    word: "contentious",
    definition: "Causing or likely to cause an argument; controversial",
    examples: [
      "The decision to deprecate the old API was contentious among long-term users.",
      "Avoid contentious topics in the all-hands and address them in smaller forums.",
    ],
    synonyms: ["controversial", "disputed", "divisive"],
    tier: 1,
  },
  {
    word: "tenable",
    definition: "Able to be maintained or defended against criticism; reasonable",
    examples: [
      "That position is no longer tenable given the new evidence.",
      "A single-server architecture is tenable at this stage but will not scale.",
    ],
    synonyms: ["defensible", "maintainable", "reasonable"],
    tier: 1,
  },
  {
    word: "indeterminate",
    definition: "Not exactly known, established, or defined; unclear",
    examples: [
      "The root cause remains indeterminate pending further analysis.",
      "The timeline is indeterminate until we understand the full scope.",
    ],
    synonyms: ["uncertain", "unclear", "undefined"],
    tier: 1,
  },
  {
    word: "apparent",
    definition: "Clearly visible or understood; obvious",
    examples: [
      "It was apparent to everyone in the room that the rollout had failed.",
      "The performance gains were apparent within hours of the deployment.",
    ],
    synonyms: ["obvious", "evident", "clear"],
    tier: 1,
  },

  // ─── Tier 1: Emotion / quality adjectives ──────────────────────────

  {
    word: "magnificent",
    definition: "Impressively beautiful, elaborate, or extravagant in scale",
    examples: [
      "The cathedral-style architecture of the codebase was magnificent but impractical.",
      "She delivered a magnificent keynote that left the audience speechless.",
    ],
    synonyms: ["splendid", "grand", "spectacular"],
    tier: 1,
  },
  {
    word: "courageous",
    definition: "Not deterred by danger or pain; brave and resolute",
    examples: [
      "It was courageous to push back on leadership when everyone else stayed silent.",
      "Making a courageous decision means accepting risk for the right reasons.",
    ],
    synonyms: ["brave", "bold", "valiant"],
    tier: 1,
  },
  {
    word: "sincere",
    definition: "Free from pretense or deceit; proceeding from genuine feelings",
    examples: [
      "Her apology was sincere and immediately defused the tension.",
      "He made a sincere effort to understand the concerns before responding.",
    ],
    synonyms: ["genuine", "heartfelt", "honest"],
    tier: 1,
  },
  {
    word: "restless",
    definition: "Unable to rest or relax; constantly seeking change or activity",
    examples: [
      "He grew restless in the role once the technical challenges were solved.",
      "A restless mind can be an asset in fast-changing fields.",
    ],
    synonyms: ["unsettled", "agitated", "uneasy"],
    tier: 1,
  },
  {
    word: "unmotivated",
    definition: "Lacking enthusiasm or incentive; not driven to act",
    examples: [
      "Repetitive, low-impact work left the team feeling unmotivated.",
      "An unmotivated engineer rarely produces their best work.",
    ],
    synonyms: ["uninspired", "apathetic", "disengaged"],
    tier: 1,
  },
  {
    word: "inconsiderate",
    definition: "Thoughtlessly causing inconvenience or harm to others",
    examples: [
      "Merging without running the tests is inconsiderate to everyone downstream.",
      "Scheduling a two-hour meeting with no agenda is inconsiderate of people's time.",
    ],
    synonyms: ["thoughtless", "insensitive", "careless"],
    tier: 1,
  },
  {
    word: "drastic",
    definition: "Likely to have a strong or far-reaching effect; severe",
    examples: [
      "A full rewrite is a drastic step that should be considered carefully.",
      "The budget cuts were so drastic that three teams were eliminated overnight.",
    ],
    synonyms: ["extreme", "severe", "radical"],
    tier: 1,
  },
  {
    word: "fulfilling",
    definition: "Making someone satisfied and happy because of fully developing their abilities or character",
    examples: [
      "She found the mentorship role more fulfilling than the technical track.",
      "Work that aligns with your values tends to be more fulfilling.",
    ],
    synonyms: ["satisfying", "rewarding", "gratifying"],
    tier: 1,
  },
  {
    word: "breathtaking",
    definition: "Astonishing or awe-inspiring in quality, scale, or complexity",
    examples: [
      "The visualization of the live data pipeline was breathtaking in its complexity.",
      "Her command of the negotiation was breathtaking — she anticipated every move.",
    ],
    synonyms: ["stunning", "astonishing", "awe-inspiring"],
    tier: 1,
  },
  {
    word: "thought-provoking",
    definition: "Stimulating careful consideration or reflection",
    examples: [
      "The book raised thought-provoking questions about the ethics of AI.",
      "His talk was thought-provoking rather than prescriptive, which made it more valuable.",
    ],
    synonyms: ["stimulating", "challenging", "provocative"],
    tier: 1,
  },
  {
    word: "intriguing",
    definition: "Arousing one's curiosity or interest; fascinating",
    examples: [
      "The anomaly in the data was intriguing enough to justify a deeper investigation.",
      "She posed an intriguing hypothesis that no one had considered before.",
    ],
    synonyms: ["fascinating", "captivating", "curious"],
    tier: 1,
  },

  // ─── Tier 2: Professional / analytical ─────────────────────────────

  {
    word: "reproach",
    definition: "Express disapproval or disappointment at someone's conduct",
    examples: [
      "He accepted the reproach quietly and committed to doing better.",
      "Her tone carried a gentle reproach that was more effective than anger.",
    ],
    synonyms: ["rebuke", "censure", "criticism"],
    tier: 2,
  },
  {
    word: "repudiate",
    definition: "Refuse to accept or be associated with; reject as having no authority",
    examples: [
      "The company repudiated the vendor's interpretation of the contract.",
      "She repudiated the accusation with documented evidence.",
    ],
    synonyms: ["reject", "disavow", "deny"],
    tier: 2,
  },
  {
    word: "diatribe",
    definition: "A forceful and bitter verbal attack against someone or something",
    examples: [
      "His post-mortem turned into a diatribe against the entire review process.",
      "A ten-minute diatribe in a team meeting rarely changes anything.",
    ],
    synonyms: ["tirade", "rant", "harangue"],
    tier: 2,
  },
  {
    word: "polemic",
    definition: "A strong written or spoken attack on someone's opinions or actions",
    examples: [
      "The article read less like analysis and more like a polemic.",
      "She wrote a polemic against the industry's obsession with growth metrics.",
    ],
    synonyms: ["attack", "diatribe", "argument"],
    tier: 2,
  },
  {
    word: "denigrate",
    definition: "Criticize unfairly; disparage or belittle",
    examples: [
      "He had a habit of denigrating others' contributions in public forums.",
      "The memo denigrated the previous team's work without acknowledging its constraints.",
    ],
    synonyms: ["disparage", "belittle", "deprecate"],
    tier: 2,
  },
  {
    word: "deride",
    definition: "Express contempt for; ridicule or mock",
    examples: [
      "Critics derided the product as a feature-length bug report.",
      "The proposal was initially derided but later proved correct.",
    ],
    synonyms: ["mock", "ridicule", "scorn"],
    tier: 2,
  },
  {
    word: "invective",
    definition: "Insulting, abusive, or highly critical language",
    examples: [
      "His review was full of invective that made it impossible to extract useful feedback.",
      "Skilled debaters argue without resorting to invective.",
    ],
    synonyms: ["abuse", "vitriol", "denunciation"],
    tier: 2,
  },
  {
    word: "discord",
    definition: "Disagreement between people; lack of harmony",
    examples: [
      "The reorganization sowed discord across teams that had worked well together.",
      "Creative discord is healthy; personal conflict is not.",
    ],
    synonyms: ["conflict", "disagreement", "friction"],
    tier: 2,
  },
  {
    word: "subordinate",
    definition: "Lower in rank or position; treat as less important",
    examples: [
      "In this model, short-term metrics are subordinate to long-term health.",
      "She managed her subordinates with both firmness and respect.",
    ],
    synonyms: ["secondary", "junior", "lower-ranking"],
    tier: 2,
  },
  {
    word: "personnel",
    definition: "People employed in an organization; the department managing employees",
    examples: [
      "The project requires personnel with both legal and technical expertise.",
      "Personnel changes at the top disrupted six months of planning.",
    ],
    synonyms: ["staff", "workforce", "employees"],
    tier: 2,
  },
  {
    word: "procedure",
    definition: "An established or official way of doing something",
    examples: [
      "Following the procedure prevented a repeat of last quarter's outage.",
      "There is no procedure for this scenario — we need to write one.",
    ],
    synonyms: ["process", "protocol", "method"],
    tier: 2,
  },
  {
    word: "portfolio",
    definition: "A range of products, investments, or projects held by an organization or person",
    examples: [
      "The product portfolio needs pruning — we are supporting too many initiatives.",
      "Her portfolio of work showed a consistent eye for interaction design.",
    ],
    synonyms: ["collection", "range", "suite"],
    tier: 2,
  },
  {
    word: "enterprise",
    definition: "A project or undertaking requiring boldness and energy; a business organization",
    examples: [
      "The migration was a two-year enterprise that touched every part of the system.",
      "Enterprise customers have compliance requirements that consumer products can ignore.",
    ],
    synonyms: ["undertaking", "venture", "organization"],
    tier: 2,
  },
  {
    word: "strategic",
    definition: "Relating to the identification of long-term goals and the means to achieve them",
    examples: [
      "Hiring this person is a strategic investment in our infrastructure team.",
      "Not every decision needs to be strategic — some just need to be done.",
    ],
    synonyms: ["planned", "deliberate", "long-term"],
    tier: 2,
  },
  {
    word: "establish",
    definition: "Set up on a firm or permanent basis; initiate or bring into being",
    examples: [
      "We need to establish clear ownership before the project scales.",
      "The pilot program established that the approach was viable.",
    ],
    synonyms: ["found", "create", "institute"],
    tier: 2,
  },
  {
    word: "coordination",
    definition: "The organization of different elements to work together effectively",
    examples: [
      "Poor coordination between teams caused the two features to conflict on release day.",
      "Effective coordination is the invisible work that makes complex projects succeed.",
    ],
    synonyms: ["organization", "synchronization", "collaboration"],
    tier: 2,
  },
  {
    word: "exigency",
    definition: "An urgent need or demand; a pressing situation requiring immediate action",
    examples: [
      "The exigency of the outage required skipping the normal change process.",
      "Leaders must balance long-term planning with day-to-day exigencies.",
    ],
    synonyms: ["urgency", "necessity", "emergency"],
    tier: 2,
  },
  {
    word: "supposition",
    definition: "A belief held without proof or certainty; an assumption",
    examples: [
      "The entire plan rests on the supposition that the vendor will deliver on time.",
      "We should distinguish between verified facts and working suppositions.",
    ],
    synonyms: ["assumption", "hypothesis", "presumption"],
    tier: 2,
  },
  {
    word: "prowess",
    definition: "Skill or expertise in a particular activity; superior ability",
    examples: [
      "Her technical prowess was matched only by her ability to communicate clearly.",
      "The team's debugging prowess became legendary within the organization.",
    ],
    synonyms: ["skill", "mastery", "expertise"],
    tier: 2,
  },
  {
    word: "mastery",
    definition: "Comprehensive knowledge or skill in a subject or accomplishment",
    examples: [
      "Mastery of the domain took years of deliberate practice.",
      "He had mastery over the data layer but struggled with the UI.",
    ],
    synonyms: ["expertise", "proficiency", "command"],
    tier: 2,
  },
  {
    word: "authenticity",
    definition: "The quality of being genuine, original, and true to one's own character",
    examples: [
      "Customers respond to authenticity in brand communication.",
      "Authenticity in leadership builds more trust than polished performance.",
    ],
    synonyms: ["genuineness", "integrity", "sincerity"],
    tier: 2,
  },
  {
    word: "epiphany",
    definition: "A moment of sudden and great revelation or realization",
    examples: [
      "The epiphany came during a walk — the whole architecture suddenly made sense.",
      "Her epiphany about the user's actual goal reshaped the entire product direction.",
    ],
    synonyms: ["revelation", "insight", "realization"],
    tier: 2,
  },
  {
    word: "fulfillment",
    definition: "Satisfaction or happiness as a result of fully developing one's abilities or achieving one's goals",
    examples: [
      "Shipping work that genuinely helps people brings a sense of fulfillment no bonus can match.",
      "He found fulfillment in mentoring others after years of individual contribution.",
    ],
    synonyms: ["satisfaction", "gratification", "achievement"],
    tier: 2,
  },
  {
    word: "integrity",
    definition: "The quality of being honest and having strong moral principles; structural soundness",
    examples: [
      "She maintained her integrity even under pressure to manipulate the results.",
      "The integrity of the data must be verified before any analysis begins.",
    ],
    synonyms: ["honesty", "uprightness", "soundness"],
    tier: 2,
  },
  {
    word: "empathy",
    definition: "The ability to understand and share the feelings of another",
    examples: [
      "Empathy for the user is what separates good product decisions from technically correct ones.",
      "Leading with empathy during a crisis earns loyalty that outlasts the difficulty.",
    ],
    synonyms: ["understanding", "compassion", "sensitivity"],
    tier: 2,
  },
  {
    word: "core",
    definition: "The central or most important part of something; fundamental",
    examples: [
      "At its core, this is a trust problem, not a technical one.",
      "The core functionality must be solid before we add optional features.",
    ],
    synonyms: ["center", "essence", "foundation"],
    tier: 2,
  },
  {
    word: "consistent",
    definition: "Acting or done in the same way over time; compatible with other facts",
    examples: [
      "Consistent communication keeps remote teams aligned without constant meetings.",
      "The results are consistent with our hypothesis, though not conclusive.",
    ],
    synonyms: ["steady", "reliable", "uniform"],
    tier: 2,
  },
  {
    word: "enhance",
    definition: "Improve or increase the quality, value, or extent of something",
    examples: [
      "The new animation enhances the sense of responsiveness without adding latency.",
      "Regular retrospectives enhance the team's ability to self-correct.",
    ],
    synonyms: ["improve", "augment", "elevate"],
    tier: 2,
  },
  {
    word: "elevate",
    definition: "Raise to a higher level; improve the quality or status of",
    examples: [
      "Strong documentation elevates the entire codebase, not just the module it covers.",
      "Her feedback elevated the proposal from good to genuinely excellent.",
    ],
    synonyms: ["raise", "lift", "advance"],
    tier: 2,
  },
  {
    word: "resonate",
    definition: "Evoke a feeling of shared meaning or importance; have an effect on someone",
    examples: [
      "The message resonated with engineers who had dealt with the same pain.",
      "A vision that resonates across the organization aligns effort without constant direction.",
    ],
    synonyms: ["connect", "strike a chord", "ring true"],
    tier: 2,
  },
  {
    word: "fortify",
    definition: "Strengthen mentally or physically; reinforce against attack",
    examples: [
      "Adding rate limiting will fortify the API against abuse.",
      "She fortified her argument with additional evidence before the second review.",
    ],
    synonyms: ["strengthen", "reinforce", "harden"],
    tier: 2,
  },
  {
    word: "circumscribe",
    definition: "Restrict the range or activity of something; define the limits of",
    examples: [
      "The legal agreement circumscribed the scope of what each party could build.",
      "His authority was circumscribed by the board's oversight committee.",
    ],
    synonyms: ["restrict", "limit", "confine"],
    tier: 2,
  },
  {
    word: "promulgate",
    definition: "Promote or make widely known; formally put a law or rule into effect",
    examples: [
      "The new security policy was promulgated across the organization last quarter.",
      "She used the conference talk to promulgate the team's methodology.",
    ],
    synonyms: ["publicize", "disseminate", "enact"],
    tier: 2,
  },
  {
    word: "adjudicate",
    definition: "Make a formal judgment or decision about a problem or dispute",
    examples: [
      "A neutral party was brought in to adjudicate the disagreement between the two teams.",
      "The committee adjudicated the competing proposals in a closed session.",
    ],
    synonyms: ["judge", "arbitrate", "decide"],
    tier: 2,
  },
  {
    word: "obviate",
    definition: "Remove a need or difficulty; prevent or eliminate",
    examples: [
      "Automating the check obviates the need for a manual review step.",
      "A shared data model would obviate most of the synchronization issues.",
    ],
    synonyms: ["prevent", "eliminate", "preclude"],
    tier: 2,
  },
  {
    word: "preclude",
    definition: "Prevent from happening or make impossible in advance",
    examples: [
      "The NDA precludes us from disclosing the details to a third party.",
      "Early alignment precluded most of the conflicts that plagued the previous project.",
    ],
    synonyms: ["prevent", "prohibit", "bar"],
    tier: 2,
  },
  {
    word: "abrogate",
    definition: "Repeal or do away with a law, right, or formal agreement",
    examples: [
      "The new legislation abrogated the protections the previous regulation had provided.",
      "One party cannot unilaterally abrogate the terms of a signed contract.",
    ],
    synonyms: ["repeal", "revoke", "annul"],
    tier: 2,
  },
  {
    word: "attenuate",
    definition: "Reduce the force, effect, or value of something; weaken",
    examples: [
      "Adding a caching layer attenuates the load on the primary database.",
      "The manager's presence attenuated the tension in the room considerably.",
    ],
    synonyms: ["weaken", "reduce", "diminish"],
    tier: 2,
  },

  // ─── Tier 3: Power / intellectual words ────────────────────────────

  {
    word: "ethereal",
    definition: "Extremely delicate and light in a way that seems too perfect for this world",
    examples: [
      "The user interface had an ethereal quality — functional yet almost weightless.",
      "The project existed in an ethereal state between vision and reality for years.",
    ],
    synonyms: ["delicate", "otherworldly", "gossamer"],
    tier: 3,
  },
  {
    word: "sublime",
    definition: "Of such excellence or beauty as to inspire great admiration; elevated",
    examples: [
      "The simplicity of the final design was, after years of complexity, almost sublime.",
      "She possessed a sublime grasp of the tradeoffs that others spent careers learning.",
    ],
    synonyms: ["magnificent", "elevated", "transcendent"],
    tier: 3,
  },
  {
    word: "inefficacious",
    definition: "Not producing the desired effect; failing to achieve results",
    examples: [
      "The workaround proved inefficacious under high load conditions.",
      "Repeated inefficacious interventions eroded trust in the change management process.",
    ],
    synonyms: ["ineffective", "futile", "powerless"],
    tier: 3,
  },
  {
    word: "obstreperous",
    definition: "Noisy and difficult to control; stubbornly resistant",
    examples: [
      "The obstreperous stakeholder derailed three consecutive planning sessions.",
      "An obstreperous minority can block progress if the process allows it.",
    ],
    synonyms: ["unruly", "disruptive", "clamorous"],
    tier: 3,
  },
  {
    word: "perspicacious",
    definition: "Having a ready insight into things; shrewdly perceptive",
    examples: [
      "Her perspicacious reading of the competitive landscape gave the team months of advantage.",
      "A perspicacious reviewer catches what the author intended, not just what was written.",
    ],
    synonyms: ["insightful", "astute", "discerning"],
    tier: 3,
  },
  {
    word: "sagacious",
    definition: "Having or showing keen mental discernment and good judgment",
    examples: [
      "His sagacious advice saved the company from a strategic mistake.",
      "Sagacious leaders know when to push forward and when to wait.",
    ],
    synonyms: ["wise", "astute", "judicious"],
    tier: 3,
  },
  {
    word: "erudite",
    definition: "Having or showing great knowledge or learning",
    examples: [
      "Her erudite explanation connected distributed systems theory to everyday practice.",
      "The erudite commentary in the code comments made the library a pleasure to work with.",
    ],
    synonyms: ["learned", "scholarly", "knowledgeable"],
    tier: 3,
  },
  {
    word: "loquacious",
    definition: "Tending to talk a great deal; talkative",
    examples: [
      "His loquacious style worked well in client presentations but slowed down standups.",
      "A loquacious architect can either illuminate or bury the key point — choose your moment.",
    ],
    synonyms: ["talkative", "verbose", "garrulous"],
    tier: 3,
  },
  {
    word: "taciturn",
    definition: "Reserved or uncommunicative in speech; saying little",
    examples: [
      "The most taciturn engineer on the team was also the most perceptive.",
      "A taciturn response in a code review can be as confusing as a verbose one.",
    ],
    synonyms: ["reticent", "reserved", "quiet"],
    tier: 3,
  },
  {
    word: "sanguine",
    definition: "Optimistic or positive, especially in a difficult situation",
    examples: [
      "He remained sanguine about the deadline despite the mounting delays.",
      "A sanguine outlook helps morale but should not substitute for honest assessment.",
    ],
    synonyms: ["optimistic", "hopeful", "confident"],
    tier: 3,
  },
  {
    word: "phlegmatic",
    definition: "Having an unemotional and stolidly calm disposition; not easily excited",
    examples: [
      "Her phlegmatic response to the crisis steadied everyone around her.",
      "A phlegmatic engineer under pressure rarely makes rash decisions.",
    ],
    synonyms: ["calm", "stoic", "impassive"],
    tier: 3,
  },
  {
    word: "ebullient",
    definition: "Cheerful and full of energy; exuberant",
    examples: [
      "Her ebullient energy was infectious and lifted the team during long sprints.",
      "His ebullient personality made him a natural fit for customer-facing roles.",
    ],
    synonyms: ["exuberant", "enthusiastic", "vivacious"],
    tier: 3,
  },
  {
    word: "truculent",
    definition: "Eager or quick to argue or fight; aggressively defiant",
    examples: [
      "His truculent manner in code reviews alienated contributors who could have been allies.",
      "A truculent response to feedback rarely improves the outcome.",
    ],
    synonyms: ["aggressive", "combative", "belligerent"],
    tier: 3,
  },
  {
    word: "petulant",
    definition: "Childishly sulky or bad-tempered; irritably impatient",
    examples: [
      "His petulant reaction to the scope change undermined his credibility with leadership.",
      "Petulant behavior in a public forum signals poor emotional regulation.",
    ],
    synonyms: ["sulky", "irritable", "sullen"],
    tier: 3,
  },
  {
    word: "insouciant",
    definition: "Showing a casual lack of concern; carefree to the point of indifference",
    examples: [
      "His insouciant attitude toward deadlines became untenable as the stakes rose.",
      "She carried an insouciant air that disguised a very deliberate way of working.",
    ],
    synonyms: ["carefree", "nonchalant", "indifferent"],
    tier: 3,
  },
  {
    word: "diffident",
    definition: "Modest or shy owing to a lack of self-confidence",
    examples: [
      "She was diffident in large meetings despite having the strongest technical opinions.",
      "A diffident candidate can be overlooked even when their skills are exceptional.",
    ],
    synonyms: ["shy", "reserved", "modest"],
    tier: 3,
  },
  {
    word: "obsequious",
    definition: "Obedient or attentive to an excessive or servile degree",
    examples: [
      "His obsequious manner around executives masked a sharper agenda.",
      "Obsequious agreement in reviews might feel polite, but it fails the author.",
    ],
    synonyms: ["sycophantic", "fawning", "servile"],
    tier: 3,
  },
  {
    word: "supercilious",
    definition: "Behaving or looking as if one thinks they are superior to others; disdainful",
    examples: [
      "His supercilious dismissal of junior engineers' ideas damaged team morale.",
      "A supercilious tone in documentation signals that the author values cleverness over clarity.",
    ],
    synonyms: ["condescending", "disdainful", "arrogant"],
    tier: 3,
  },
  {
    word: "verisimilitude",
    definition: "The appearance of being true or real; believable accuracy",
    examples: [
      "The simulation achieved enough verisimilitude to be useful for training.",
      "Good technical writing requires verisimilitude — the examples must feel real.",
    ],
    synonyms: ["realism", "plausibility", "authenticity"],
    tier: 3,
  },
  {
    word: "simulacrum",
    definition: "An image or representation of something; an unsatisfactory imitation",
    examples: [
      "The prototype was a simulacrum of the final product, useful for feedback but not deployment.",
      "The process became a simulacrum of agile — the rituals without the principles.",
    ],
    synonyms: ["replica", "imitation", "representation"],
    tier: 3,
  },
  {
    word: "zeitgeist",
    definition: "The defining spirit or mood of a particular period in history",
    examples: [
      "The product caught the zeitgeist perfectly and became synonymous with the era.",
      "Understanding the zeitgeist helps you predict which technical ideas will gain traction.",
    ],
    synonyms: ["spirit of the age", "ethos", "climate"],
    tier: 3,
  },
  {
    word: "schadenfreude",
    definition: "Pleasure derived from the misfortunes or failures of others",
    examples: [
      "There was an uncomfortable hint of schadenfreude in the industry's reaction to the outage.",
      "Schadenfreude at a competitor's failure is natural; letting it guide strategy is dangerous.",
    ],
    synonyms: ["malicious pleasure", "gloating", "spite"],
    tier: 3,
  },
  {
    word: "weltanschauung",
    definition: "A comprehensive worldview or philosophy; a particular conception of the world",
    examples: [
      "His weltanschauung shaped every product decision, for better and worse.",
      "Company culture is really a collective weltanschauung — shared assumptions about how things work.",
    ],
    synonyms: ["worldview", "philosophy", "outlook"],
    tier: 3,
  },
  {
    word: "raison d'être",
    definition: "The most important reason or purpose for someone's or something's existence",
    examples: [
      "Reducing latency is the product's raison d'être — every feature decision flows from it.",
      "When a company loses its raison d'être, mission statements become hollow.",
    ],
    synonyms: ["purpose", "reason for being", "mission"],
    tier: 3,
  },
  {
    word: "incandescent",
    definition: "Emitting light or brilliance as if from great internal heat; extremely impressive",
    examples: [
      "Her incandescent presentation lit up a room full of weary executives.",
      "The incandescent clarity of the final design made all earlier iterations seem murky.",
    ],
    synonyms: ["brilliant", "radiant", "luminous"],
    tier: 3,
  },
  {
    word: "resplendent",
    definition: "Attractive and impressive through being richly colorful or sumptuous",
    examples: [
      "The redesigned dashboard was resplendent — every detail deliberate, every color purposeful.",
      "She arrived at the presentation resplendent with confidence and precision.",
    ],
    synonyms: ["magnificent", "splendid", "dazzling"],
    tier: 3,
  },
  {
    word: "mellifluous",
    definition: "Sweet or musical; pleasant to hear",
    examples: [
      "His mellifluous voice made even the most technical explanation easy to follow.",
      "The mellifluous prose of the documentation made it a pleasure to read.",
    ],
    synonyms: ["dulcet", "harmonious", "euphonious"],
    tier: 3,
  },
  {
    word: "sonorous",
    definition: "Producing a full, deep, or rich sound; imposingly grand",
    examples: [
      "The sonorous cadence of her closing argument left the room silent for a moment.",
      "A sonorous name for a product or feature can carry as much weight as the product itself.",
    ],
    synonyms: ["resonant", "rich", "full-toned"],
    tier: 3,
  },
  {
    word: "dulcet",
    definition: "Sweet and soothing, especially to the ear",
    examples: [
      "The dulcet tones of the notification sound were designed to calm rather than alarm.",
      "Her dulcet explanation of the error made a frustrating bug feel manageable.",
    ],
    synonyms: ["sweet", "melodious", "gentle"],
    tier: 3,
  },
  {
    word: "indefatigable",
    definition: "Persisting tirelessly; never showing signs of weariness",
    examples: [
      "Her indefatigable pursuit of the root cause finally paid off after three days.",
      "The indefatigable energy he brought to the final sprint kept the team moving.",
    ],
    synonyms: ["tireless", "relentless", "inexhaustible"],
    tier: 3,
  },
  {
    word: "inexorable",
    definition: "Impossible to stop or prevent; continuing without regard for human will",
    examples: [
      "The inexorable march of technical debt eventually forces a reckoning.",
      "Market consolidation felt inexorable — every small player was being absorbed.",
    ],
    synonyms: ["relentless", "unstoppable", "inevitable"],
    tier: 3,
  },
  {
    word: "implacable",
    definition: "Unable to be appeased or pacified; unwilling to be moved",
    examples: [
      "The implacable demands of the regulator left no room for creative compliance.",
      "She was implacable on the question of code quality, regardless of timeline pressure.",
    ],
    synonyms: ["unrelenting", "unyielding", "inflexible"],
    tier: 3,
  },
  {
    word: "intransigent",
    definition: "Refusing to change one's views or agree to a compromise",
    examples: [
      "The vendor was intransigent on pricing, which ultimately ended the negotiation.",
      "Intransigent stakeholders must be escalated, not endured.",
    ],
    synonyms: ["uncompromising", "inflexible", "obstinate"],
    tier: 3,
  },
  {
    word: "redoubtable",
    definition: "Deserving to be feared or respected; formidably impressive",
    examples: [
      "She built a redoubtable reputation as someone who ships without cutting corners.",
      "Facing a redoubtable competitor forced the team to raise their own standards.",
    ],
    synonyms: ["formidable", "impressive", "commanding"],
    tier: 3,
  },
];
