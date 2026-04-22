import type { SeedWord } from "./types";
import { SEED_WORDS_ADDITIONS_1 } from "./seed-words-additions-1";
import { SEED_WORDS_ADDITIONS_2 } from "./seed-words-additions-2";
import { SEED_WORDS_ADDITIONS_3 } from "./seed-words-additions-3";

/**
 * Base shipped seed bank. Expansion batches are appended below until the
 * canonical 700-word curriculum is fully authored.
 */
const BASE_SEED_WORDS: SeedWord[] = [
  {
    word: "nuanced",
    definition: "Characterized by subtle shades of meaning or expression",
    examples: [
      "Her analysis was more nuanced than the headline suggested.",
      "The issue requires a nuanced approach, not a blanket policy.",
    ],
    synonyms: ["subtle", "refined", "sophisticated"],
    tier: 2,
  },
  {
    word: "deliberate",
    definition: "Done consciously and intentionally; careful and unhurried",
    examples: [
      "Every design choice was deliberate, not accidental.",
      "He took a deliberate pause before answering the question.",
    ],
    synonyms: ["intentional", "calculated", "purposeful"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "pragmatic",
    definition: "Dealing with things sensibly based on practical considerations",
    examples: [
      "His pragmatic approach cut through the theoretical debate.",
      "We need a pragmatic solution, not an ideal one.",
    ],
    synonyms: ["practical", "realistic", "sensible"],
    tier: 2,
  },
  {
    word: "articulate",
    definition: "Able to express thoughts fluently and coherently",
    examples: [
      "She was the most articulate speaker at the conference.",
      "He struggled to articulate why the design felt wrong.",
    ],
    synonyms: ["eloquent", "fluent", "expressive"],
    tier: 2,
  },
  {
    word: "candid",
    definition: "Truthful and straightforward; frank",
    examples: [
      "I appreciate your candid feedback on the proposal.",
      "In a candid moment, she admitted the strategy wasn't working.",
    ],
    synonyms: ["frank", "honest", "forthright"],
    tier: 2,
  },
  {
    word: "concise",
    definition: "Giving a lot of information clearly in few words",
    examples: [
      "Keep your emails concise — no one reads walls of text.",
      "The report was concise but covered every critical issue.",
    ],
    synonyms: ["brief", "succinct", "terse"],
    tier: 2,
  },
  {
    word: "cogent",
    definition: "Clear, logical, and convincing",
    examples: [
      "He presented a cogent argument that changed the committee's vote.",
      "The most cogent objection came from the engineering team.",
    ],
    synonyms: ["convincing", "compelling", "persuasive"],
    tier: 3,
  },
  {
    word: "salient",
    definition: "Most noticeable or important; prominent",
    examples: [
      "The most salient point in the report was the cost overrun.",
      "Let me highlight the salient features of the new design.",
    ],
    synonyms: ["prominent", "notable", "striking"],
    tier: 3,
  },
  {
    word: "tenuous",
    definition: "Very weak or slight; insubstantial",
    examples: [
      "The connection between the two events is tenuous at best.",
      "His grip on the lead became increasingly tenuous.",
    ],
    synonyms: ["weak", "flimsy", "fragile"],
    tier: 3,
  },
  {
    word: "pervasive",
    definition: "Spreading widely throughout an area or group of people",
    examples: [
      "The pervasive smell of coffee filled the entire floor.",
      "There's a pervasive sense of urgency across the organization.",
    ],
    synonyms: ["widespread", "prevalent", "ubiquitous"],
    tier: 2,
  },
  {
    word: "discernible",
    definition: "Able to be perceived or recognized; distinguishable",
    examples: [
      "There was no discernible difference between the two samples.",
      "The improvement was barely discernible without measurements.",
    ],
    synonyms: ["noticeable", "detectable", "perceptible"],
    tier: 3,
  },
  {
    word: "commensurate",
    definition: "Corresponding in size, extent, or degree; proportionate",
    examples: [
      "The salary should be commensurate with experience.",
      "The punishment was not commensurate with the offense.",
    ],
    synonyms: ["proportionate", "corresponding", "equivalent"],
    tier: 3,
  },
  {
    word: "exacerbate",
    definition: "Make a problem, bad situation, or negative feeling worse",
    examples: [
      "The delay will only exacerbate the supply chain issues.",
      "His comments exacerbated the tension in the room.",
    ],
    synonyms: ["worsen", "aggravate", "intensify"],
    tier: 3,
  },
  {
    word: "mitigate",
    definition: "Make less severe, serious, or painful",
    examples: [
      "We need to mitigate the risk before proceeding.",
      "The new process mitigates the chance of human error.",
    ],
    synonyms: ["alleviate", "reduce", "lessen"],
    tier: 2,
  },
  {
    word: "precipitate",
    definition: "Cause an event or situation to happen suddenly or prematurely",
    examples: [
      "The announcement precipitated a wave of resignations.",
      "A single error precipitated the entire system failure.",
    ],
    synonyms: ["trigger", "provoke", "catalyze"],
    tier: 3,
  },
  {
    word: "delineate",
    definition: "Describe or portray something precisely; indicate exact boundaries",
    examples: [
      "The contract delineates each party's responsibilities.",
      "We need to delineate the scope before starting development.",
    ],
    synonyms: ["outline", "define", "specify"],
    tier: 3,
  },
  {
    word: "juxtapose",
    definition: "Place close together for contrasting effect",
    examples: [
      "The report juxtaposes last year's results with this quarter's.",
      "Juxtaposing the two approaches reveals their strengths and weaknesses.",
    ],
    synonyms: ["contrast", "compare", "set side by side"],
    tier: 4,
  },
  {
    word: "substantiate",
    definition: "Provide evidence to support or prove the truth of something",
    examples: [
      "Can you substantiate that claim with data?",
      "The audit substantiated the concerns raised by the team.",
    ],
    synonyms: ["verify", "confirm", "corroborate"],
    tier: 3,
  },
  {
    word: "elucidate",
    definition: "Make something clear; explain",
    examples: [
      "Could you elucidate the reasoning behind this decision?",
      "The diagram elucidates how the components interact.",
    ],
    synonyms: ["clarify", "explain", "illuminate"],
    tier: 3,
  },
  {
    word: "contingent",
    definition: "Dependent on certain circumstances; conditional",
    examples: [
      "The deal is contingent on board approval.",
      "Our timeline is contingent on the vendor delivering on schedule.",
    ],
    synonyms: ["conditional", "dependent", "subject to"],
    tier: 2,
  },
  {
    word: "efficacy",
    definition: "The ability to produce a desired or intended result",
    examples: [
      "The efficacy of the new training program is still unproven.",
      "Studies confirmed the efficacy of spaced repetition for long-term retention.",
    ],
    synonyms: ["effectiveness", "potency", "capability"],
    tier: 2,
  },
  {
    word: "precedent",
    definition: "An earlier event or action regarded as an example or guide",
    examples: [
      "This decision sets a dangerous precedent for future negotiations.",
      "There's no precedent for this kind of system failure.",
    ],
    synonyms: ["example", "model", "standard"],
    tier: 2,
  },
  {
    word: "disparity",
    definition: "A great difference; inequality",
    examples: [
      "The disparity between the two teams' budgets was striking.",
      "Pay disparity remains a significant issue across the industry.",
    ],
    synonyms: ["gap", "inequality", "imbalance"],
    tier: 2,
  },
  {
    word: "catalyst",
    definition: "A person or thing that precipitates an event or change",
    examples: [
      "The incident was the catalyst for a complete policy overhaul.",
      "She served as a catalyst for innovation within the department.",
    ],
    synonyms: ["trigger", "stimulus", "spark"],
    tier: 2,
  },
  {
    word: "attrition",
    definition: "The process of gradually reducing strength or numbers through sustained pressure",
    examples: [
      "High attrition rates are costing us more than recruitment.",
      "The team shrank through attrition rather than layoffs.",
    ],
    synonyms: ["erosion", "depletion", "wearing down"],
    tier: 3,
  },
  {
    word: "cursory",
    definition: "Hasty and therefore not thorough or detailed",
    examples: [
      "A cursory review of the code revealed several issues.",
      "He gave the document only a cursory glance before signing.",
    ],
    synonyms: ["superficial", "hasty", "perfunctory"],
    tier: 3,
  },
  {
    word: "amenable",
    definition: "Open and responsive to suggestion; easily persuaded",
    examples: [
      "The client was amenable to our revised timeline.",
      "He's amenable to feedback when it's delivered constructively.",
    ],
    synonyms: ["receptive", "agreeable", "open"],
    tier: 3,
  },
  {
    word: "equivocal",
    definition: "Open to more than one interpretation; ambiguous",
    examples: [
      "The test results were equivocal — we need to run them again.",
      "His equivocal response left everyone unsure of his position.",
    ],
    synonyms: ["ambiguous", "vague", "unclear"],
    tier: 4,
  },
  {
    word: "prolific",
    definition: "Producing much fruit, foliage, or many offspring; highly productive",
    examples: [
      "She's one of the most prolific contributors on the team.",
      "The prolific output of research papers made him a leader in the field.",
    ],
    synonyms: ["productive", "fertile", "abundant"],
    tier: 2,
  },
  {
    word: "perfunctory",
    definition: "Carried out with minimum effort or reflection; mechanical",
    examples: [
      "His perfunctory apology did nothing to ease the tension.",
      "The safety check was perfunctory at best — they barely looked.",
    ],
    synonyms: ["cursory", "mechanical", "halfhearted"],
    tier: 4,
  },
  {
    word: "tantamount",
    definition: "Equivalent in seriousness to; virtually the same as",
    examples: [
      "Ignoring the warning signs is tantamount to negligence.",
      "Silence on this issue is tantamount to approval.",
    ],
    synonyms: ["equivalent", "equal", "synonymous"],
    tier: 3,
  },
  {
    word: "lucid",
    definition: "Expressed clearly; easy to understand",
    examples: [
      "Her explanation was remarkably lucid despite the complex topic.",
      "The documentation is lucid enough for a new team member to follow.",
    ],
    synonyms: ["clear", "intelligible", "coherent"],
    tier: 2,
  },
  {
    word: "corroborate",
    definition: "Confirm or give support to a statement, theory, or finding",
    examples: [
      "The second audit corroborated the initial findings.",
      "Multiple witnesses corroborated her account of the incident.",
    ],
    synonyms: ["confirm", "verify", "substantiate"],
    tier: 3,
  },
  {
    word: "ostensible",
    definition: "Stated or appearing to be true, but not necessarily so",
    examples: [
      "The ostensible reason for the meeting was budget review, but layoffs were discussed.",
      "His ostensible calm masked deep frustration.",
    ],
    synonyms: ["apparent", "seeming", "purported"],
    tier: 3,
  },
  {
    word: "impetus",
    definition: "The force or energy with which something moves; a driving force",
    examples: [
      "The customer complaints provided the impetus for a redesign.",
      "Economic pressure was the impetus behind the merger.",
    ],
    synonyms: ["momentum", "stimulus", "motivation"],
    tier: 2,
  },
  {
    word: "nebulous",
    definition: "Unclear, vague, or ill-defined",
    examples: [
      "The project goals remain nebulous — we need concrete requirements.",
      "His vision for the company was inspiring but nebulous.",
    ],
    synonyms: ["vague", "hazy", "ambiguous"],
    tier: 3,
  },
  {
    word: "truncate",
    definition: "Shorten something by cutting off the top or end",
    examples: [
      "The report was truncated to fit the time slot.",
      "Don't truncate the error messages — they contain useful context.",
    ],
    synonyms: ["shorten", "cut", "abridge"],
    tier: 4,
  },
  {
    word: "verbose",
    definition: "Using or expressed in more words than are needed",
    examples: [
      "The verbose documentation buried the key information.",
      "His emails are verbose — the same point in half the words would be better.",
    ],
    synonyms: ["wordy", "long-winded", "prolix"],
    tier: 4,
  },
  {
    word: "disseminate",
    definition: "Spread or disperse something widely",
    examples: [
      "The findings were disseminated across all departments.",
      "Social media disseminates information faster than any other channel.",
    ],
    synonyms: ["spread", "distribute", "circulate"],
    tier: 3,
  },
  {
    word: "recalcitrant",
    definition: "Having an obstinately uncooperative attitude",
    examples: [
      "The recalcitrant vendor refused to honor the warranty.",
      "Dealing with recalcitrant stakeholders requires patience and leverage.",
    ],
    synonyms: ["uncooperative", "defiant", "obstinate"],
    tier: 3,
  },
  {
    word: "nascent",
    definition: "Just beginning to develop; emerging",
    examples: [
      "The nascent AI team is already producing results.",
      "We're seeing nascent signs of market recovery.",
    ],
    synonyms: ["emerging", "budding", "developing"],
    tier: 3,
  },
  {
    word: "volatile",
    definition: "Liable to change rapidly and unpredictably, especially for the worse",
    examples: [
      "The market has been volatile since the announcement.",
      "His volatile temperament makes collaboration difficult.",
    ],
    synonyms: ["unstable", "unpredictable", "erratic"],
    tier: 2,
  },
  {
    word: "ubiquitous",
    definition: "Present, appearing, or found everywhere",
    examples: [
      "Smartphones have become ubiquitous in the modern workplace.",
      "The ubiquitous use of jargon makes the documentation hard to read.",
    ],
    synonyms: ["omnipresent", "pervasive", "universal"],
    tier: 2,
  },
  {
    word: "superfluous",
    definition: "Unnecessary, especially through being more than enough",
    examples: [
      "Remove any superfluous steps from the process.",
      "The third review cycle felt superfluous — nothing changed.",
    ],
    synonyms: ["unnecessary", "redundant", "excessive"],
    tier: 3,
  },
  {
    word: "tacit",
    definition: "Understood or implied without being stated",
    examples: [
      "There was a tacit agreement not to discuss the reorganization.",
      "His silence was taken as tacit approval.",
    ],
    synonyms: ["implicit", "unspoken", "implied"],
    tier: 3,
  },
  {
    word: "untenable",
    definition: "Not able to be maintained or defended against criticism",
    examples: [
      "The current staffing levels are untenable given the workload.",
      "His position became untenable after the audit findings.",
    ],
    synonyms: ["indefensible", "unsustainable", "insupportable"],
    tier: 3,
  },
  {
    word: "galvanize",
    definition: "Shock or excite someone into taking action",
    examples: [
      "The safety incident galvanized the team into updating all procedures.",
      "Her speech galvanized support for the initiative.",
    ],
    synonyms: ["energize", "motivate", "spur"],
    tier: 4,
  },
  {
    word: "exemplary",
    definition: "Serving as a desirable model; representing the best of its kind",
    examples: [
      "Her exemplary work ethic set the standard for new hires.",
      "The project was exemplary in its attention to detail.",
    ],
    synonyms: ["outstanding", "model", "ideal"],
    tier: 2,
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
    tier: 2,
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
    tier: 2,
  },
  {
    word: "formidable",
    definition: "Inspiring fear or respect through being impressively powerful or capable",
    examples: [
      "She was a formidable negotiator who rarely left anything on the table.",
      "The technical debt had grown into a formidable obstacle.",
    ],
    synonyms: ["imposing", "daunting", "impressive"],
    tier: 2,
  },
  {
    word: "paramount",
    definition: "More important than anything else; supreme",
    examples: [
      "Data security is paramount when handling customer information.",
      "Speed was paramount, so we chose the simplest viable architecture.",
    ],
    synonyms: ["supreme", "foremost", "preeminent"],
    tier: 2,
  },
  {
    word: "rigorous",
    definition: "Extremely thorough, exhaustive, and accurate",
    examples: [
      "The peer review process is rigorous but ultimately improves quality.",
      "She applied a rigorous methodology to every experiment.",
    ],
    synonyms: ["thorough", "strict", "exacting"],
    tier: 2,
  },
  {
    word: "prevalent",
    definition: "Widespread in a particular area or at a particular time",
    examples: [
      "Burnout is prevalent in high-growth startups.",
      "The misconception is prevalent even among experienced developers.",
    ],
    synonyms: ["widespread", "common", "pervasive"],
    tier: 2,
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
    tier: 3,
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
    tier: 3,
  },
  {
    word: "devastated",
    definition: "Severely shocked and distressed; overwhelmed with grief or disappointment",
    examples: [
      "He was devastated to learn the project had been cancelled.",
      "The community was devastated by the sudden closure of the plant.",
    ],
    synonyms: ["shattered", "crushed", "distraught"],
    tier: 2,
  },
  {
    word: "apprehensive",
    definition: "Anxious or fearful that something bad or unpleasant will happen",
    examples: [
      "She was apprehensive about presenting to the executive team.",
      "Employees grew apprehensive as the restructuring announcement approached.",
    ],
    synonyms: ["anxious", "uneasy", "worried"],
    tier: 3,
  },
  {
    word: "ambivalent",
    definition: "Having mixed or contradictory feelings about something",
    examples: [
      "He was ambivalent about the promotion — more money but less autonomy.",
      "The board remained ambivalent, unable to commit to either direction.",
    ],
    synonyms: ["conflicted", "torn", "undecided"],
    tier: 3,
  },
  {
    word: "nostalgic",
    definition: "Feeling a sentimental longing for the past",
    examples: [
      "Revisiting the old codebase made him nostalgic for simpler times.",
      "There was a nostalgic quality to the farewell party that moved everyone.",
    ],
    synonyms: ["sentimental", "wistful", "longing"],
    tier: 2,
  },
  {
    word: "indignant",
    definition: "Feeling or showing anger aroused by something perceived as unjust",
    examples: [
      "She was indignant when her contributions were attributed to someone else.",
      "The indignant response from the team forced management to reconsider.",
    ],
    synonyms: ["outraged", "offended", "resentful"],
    tier: 3,
  },
  {
    word: "exasperated",
    definition: "Intensely irritated and frustrated, often after repeated difficulty",
    examples: [
      "After the third failed deployment, the team was exasperated.",
      "His exasperated sigh told everyone the meeting had gone poorly.",
    ],
    synonyms: ["frustrated", "irritated", "infuriated"],
    tier: 3,
  },
  {
    word: "resolute",
    definition: "Admirably purposeful, determined, and unwavering",
    examples: [
      "She remained resolute in her decision despite pushback from leadership.",
      "His resolute commitment to quality inspired the entire team.",
    ],
    synonyms: ["determined", "steadfast", "unwavering"],
    tier: 3,
  },
  {
    word: "complacent",
    definition: "Showing smug satisfaction with oneself or one's achievements, ignoring potential problems",
    examples: [
      "Success made the company complacent, and competitors caught up.",
      "We can't afford to be complacent just because this quarter went well.",
    ],
    synonyms: ["self-satisfied", "smug", "unconcerned"],
    tier: 3,
  },
  {
    word: "disenchanted",
    definition: "Disappointed by someone or something previously admired; disillusioned",
    examples: [
      "Many early adopters grew disenchanted with the platform's direction.",
      "She became disenchanted with corporate life after years of broken promises.",
    ],
    synonyms: ["disillusioned", "disappointed", "let down"],
    tier: 3,
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
    tier: 2,
  },
  {
    word: "assertive",
    definition: "Having or showing a confident and forceful personality without being aggressive",
    examples: [
      "Being assertive in meetings ensures your ideas get heard.",
      "She gave assertive feedback that was direct but respectful.",
    ],
    synonyms: ["confident", "decisive", "self-assured"],
    tier: 3,
  },
  {
    word: "provisional",
    definition: "Arranged or existing for the present, possibly to be changed later",
    examples: [
      "The timeline is provisional until we finalize the vendor contract.",
      "They reached a provisional agreement pending legal review.",
    ],
    synonyms: ["temporary", "interim", "tentative"],
    tier: 2,
  },
  {
    word: "expedient",
    definition: "Convenient and practical, though possibly improper or immoral",
    examples: [
      "Cutting corners was expedient but created long-term technical debt.",
      "The politically expedient choice is not always the right one.",
    ],
    synonyms: ["convenient", "advantageous", "practical"],
    tier: 3,
  },
  {
    word: "methodical",
    definition: "Done in a systematic, orderly way",
    examples: [
      "His methodical approach to debugging saved hours of random guesswork.",
      "The migration requires a methodical plan, not a weekend hack.",
    ],
    synonyms: ["systematic", "organized", "orderly"],
    tier: 3,
  },
  {
    word: "candor",
    definition: "The quality of being open, honest, and direct in expression",
    examples: [
      "Her candor during the retrospective helped the team confront real issues.",
      "I appreciate your candor — it's rare in this kind of review.",
    ],
    synonyms: ["honesty", "frankness", "openness"],
    tier: 3,
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
    tier: 2,
  },
  {
    word: "alleviate",
    definition: "Make suffering, a problem, or a deficiency less severe",
    examples: [
      "The new hire should alleviate some of the workload pressure.",
      "Automating the report generation alleviated the bottleneck.",
    ],
    synonyms: ["ease", "relieve", "reduce"],
    tier: 2,
  },
  {
    word: "reinforce",
    definition: "Strengthen or support, especially with additional resources or emphasis",
    examples: [
      "The test results reinforce our confidence in the new architecture.",
      "Regular one-on-ones reinforce the relationship between manager and report.",
    ],
    synonyms: ["strengthen", "bolster", "support"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "augment",
    definition: "Make something greater by adding to it; supplement",
    examples: [
      "AI tools can augment a developer's productivity, not replace it.",
      "We augmented the team with two contractors for the final push.",
    ],
    synonyms: ["supplement", "enhance", "boost"],
    tier: 3,
  },
  {
    word: "reconcile",
    definition: "Restore friendly relations between; make compatible or consistent",
    examples: [
      "It's hard to reconcile the optimistic forecast with the actual numbers.",
      "The teams spent a week reconciling the conflicting data sources.",
    ],
    synonyms: ["resolve", "harmonize", "settle"],
    tier: 2,
  },
  {
    word: "circumvent",
    definition: "Find a way around an obstacle or restriction",
    examples: [
      "The workaround circumvents the limitation without violating the API contract.",
      "Developers shouldn't circumvent the review process, no matter how urgent.",
    ],
    synonyms: ["bypass", "avoid", "sidestep"],
    tier: 3,
  },
  {
    word: "undermine",
    definition: "Erode the base or foundation of; weaken gradually",
    examples: [
      "Constant scope changes undermine the team's ability to deliver on time.",
      "Micromanagement undermines trust and autonomy.",
    ],
    synonyms: ["weaken", "sabotage", "erode"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "composure",
    definition: "The state of being calm and in control of oneself",
    examples: [
      "She maintained her composure even when the demo crashed live.",
      "Losing your composure in a client meeting is never a good look.",
    ],
    synonyms: ["self-possession", "poise", "equanimity"],
    tier: 3,
  },
  {
    word: "adversity",
    definition: "Difficulties or misfortune; a state of hardship",
    examples: [
      "The team's response to adversity revealed its true character.",
      "Great leaders are forged through adversity, not comfort.",
    ],
    synonyms: ["hardship", "difficulty", "misfortune"],
    tier: 2,
  },
  {
    word: "criterion",
    definition: "A principle or standard by which something is judged or decided",
    examples: [
      "What criterion are we using to evaluate these candidates?",
      "Cost should not be the only criterion in the decision.",
    ],
    synonyms: ["standard", "benchmark", "measure"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "nuance",
    definition: "A subtle difference in meaning, expression, or response",
    examples: [
      "The nuance of the policy is lost when you reduce it to a headline.",
      "Understanding cultural nuance is essential for global product design.",
    ],
    synonyms: ["subtlety", "shade", "distinction"],
    tier: 3,
  },
  {
    word: "ramification",
    definition: "A consequence of an action or event, especially an unwelcome one",
    examples: [
      "Have we fully considered the ramifications of removing this feature?",
      "The legal ramifications of the breach could be severe.",
    ],
    synonyms: ["consequence", "repercussion", "implication"],
    tier: 4,
  },
  {
    word: "dichotomy",
    definition: "A division or contrast between two things presented as opposites",
    examples: [
      "The dichotomy between speed and quality is often a false one.",
      "He rejected the dichotomy of art versus commerce.",
    ],
    synonyms: ["division", "contrast", "split"],
    tier: 3,
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
    tier: 2,
  },
  {
    word: "plausible",
    definition: "Seeming reasonable or probable; believable",
    examples: [
      "That's a plausible explanation, but we need data to confirm it.",
      "The most plausible scenario is that the server ran out of memory.",
    ],
    synonyms: ["credible", "believable", "feasible"],
    tier: 2,
  },
  {
    word: "intricate",
    definition: "Very complicated or detailed; having many interconnected parts",
    examples: [
      "The intricate dependencies between services make refactoring risky.",
      "She designed an intricate workflow that handled every edge case.",
    ],
    synonyms: ["complex", "elaborate", "detailed"],
    tier: 2,
  },
  {
    word: "inherent",
    definition: "Existing in something as a permanent, essential, or characteristic attribute",
    examples: [
      "There are inherent risks in any system migration.",
      "Flexibility is inherent to the framework's design philosophy.",
    ],
    synonyms: ["intrinsic", "innate", "built-in"],
    tier: 2,
  },
  {
    word: "versatile",
    definition: "Able to adapt or be adapted to many different functions or activities",
    examples: [
      "She's a versatile engineer who can work across the full stack.",
      "The platform is versatile enough to serve both small and enterprise clients.",
    ],
    synonyms: ["adaptable", "flexible", "multifaceted"],
    tier: 2,
  },
  {
    word: "serene",
    definition: "Calm, peaceful, and untroubled",
    examples: [
      "Despite the chaos around the launch, she remained remarkably serene.",
      "The serene environment of the retreat helped the team recharge.",
    ],
    synonyms: ["peaceful", "calm", "tranquil"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "succinct",
    definition: "Briefly and clearly expressed; compact in expression",
    examples: [
      "Her presentation was succinct and hit every key point in under ten minutes.",
      "A succinct summary is more useful than a fifty-page report nobody reads.",
    ],
    synonyms: ["brief", "concise", "pithy"],
    tier: 3,
  },
  {
    word: "ambiguous",
    definition: "Open to more than one interpretation; not having a clear meaning",
    examples: [
      "The requirements were ambiguous, which led to conflicting implementations.",
      "Avoid ambiguous wording in contracts — it invites disputes.",
    ],
    synonyms: ["unclear", "vague", "equivocal"],
    tier: 2,
  },
  {
    word: "feasible",
    definition: "Possible and practical to do or achieve",
    examples: [
      "Is it feasible to deliver the full scope by the original deadline?",
      "The proposal is technically feasible but may exceed the budget.",
    ],
    synonyms: ["achievable", "viable", "practical"],
    tier: 2,
  },
  {
    word: "diminish",
    definition: "Make or become less; reduce in size, importance, or value",
    examples: [
      "Don't diminish the team's contribution by focusing only on what went wrong.",
      "The effect of the incentive program will diminish over time without renewal.",
    ],
    synonyms: ["reduce", "lessen", "decrease"],
    tier: 2,
  },
  {
    word: "unequivocal",
    definition: "Leaving no doubt; unambiguous and clear",
    examples: [
      "The board gave unequivocal approval to proceed with the acquisition.",
      "Her unequivocal stance on the issue left no room for misinterpretation.",
    ],
    synonyms: ["definitive", "absolute", "categorical"],
    tier: 3,
  },
  {
    word: "pivotal",
    definition: "Of crucial importance in relation to the development of something",
    examples: [
      "The third quarter was pivotal in determining the company's direction.",
      "Her intervention at that meeting was pivotal to the project's survival.",
    ],
    synonyms: ["crucial", "critical", "decisive"],
    tier: 2,
  },
  {
    word: "sporadic",
    definition: "Occurring at irregular intervals; not continuous or steady",
    examples: [
      "The bug appeared only in sporadic bursts, making it hard to reproduce.",
      "Communication from the client has been sporadic at best.",
    ],
    synonyms: ["intermittent", "irregular", "occasional"],
    tier: 2,
  },
  {
    word: "arbitrary",
    definition: "Based on random choice or personal whim rather than reason or system",
    examples: [
      "The deadline felt arbitrary — no one could explain why that date mattered.",
      "Arbitrary naming conventions make the codebase hard to navigate.",
    ],
    synonyms: ["random", "capricious", "unjustified"],
    tier: 2,
  },
  {
    word: "conducive",
    definition: "Making a certain situation or outcome likely or possible",
    examples: [
      "Open floor plans aren't always conducive to deep focus work.",
      "The retreat created an environment conducive to creative thinking.",
    ],
    synonyms: ["favorable", "helpful", "supportive"],
    tier: 2,
  },
  {
    word: "detrimental",
    definition: "Tending to cause harm; damaging",
    examples: [
      "Skipping code reviews is detrimental to long-term quality.",
      "The toxic culture was detrimental to both retention and morale.",
    ],
    synonyms: ["harmful", "damaging", "injurious"],
    tier: 2,
  },
  {
    word: "implicit",
    definition: "Implied though not plainly expressed; inherent in the nature of something",
    examples: [
      "There was an implicit understanding that overtime would be compensated.",
      "The risk is implicit in the architecture — we just haven't named it.",
    ],
    synonyms: ["implied", "unspoken", "understood"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "precarious",
    definition: "Not securely held or in position; dependent on chance, uncertain",
    examples: [
      "The startup's financial position was increasingly precarious.",
      "Building on a single vendor puts the project in a precarious spot.",
    ],
    synonyms: ["unstable", "insecure", "uncertain"],
    tier: 2,
  },
  {
    word: "discrepancy",
    definition: "A lack of compatibility or similarity between two or more facts",
    examples: [
      "There's a discrepancy between the reported numbers and the actual revenue.",
      "The QA team flagged a discrepancy between the spec and the implementation.",
    ],
    synonyms: ["inconsistency", "difference", "divergence"],
    tier: 2,
  },
  {
    word: "pragmatism",
    definition: "An approach that evaluates theories or actions primarily by their practical outcomes",
    examples: [
      "Her pragmatism kept the team grounded when ambitions outpaced resources.",
      "There's a healthy tension between idealism and pragmatism in good engineering.",
    ],
    synonyms: ["practicality", "realism", "utilitarianism"],
    tier: 3,
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
    tier: 2,
  },
  {
    word: "inadvertent",
    definition: "Not resulting from deliberate planning; unintentional",
    examples: [
      "The data leak was inadvertent, caused by a misconfigured permission.",
      "An inadvertent omission in the contract led to months of disputes.",
    ],
    synonyms: ["unintentional", "accidental", "unplanned"],
    tier: 3,
  },
  {
    word: "indispensable",
    definition: "Absolutely necessary; essential",
    examples: [
      "Automated testing has become indispensable to our release process.",
      "She proved indispensable during the platform migration.",
    ],
    synonyms: ["essential", "vital", "crucial"],
    tier: 2,
  },
  {
    word: "erratic",
    definition: "Not even or regular in pattern or movement; unpredictable",
    examples: [
      "The API's erratic response times made performance testing unreliable.",
      "His erratic schedule made it difficult to plan meetings.",
    ],
    synonyms: ["unpredictable", "inconsistent", "irregular"],
    tier: 2,
  },
  {
    word: "prudent",
    definition: "Acting with care and thought for the future; showing good judgment",
    examples: [
      "It would be prudent to run a pilot before the full rollout.",
      "A prudent investment now will save us significant cost later.",
    ],
    synonyms: ["wise", "sensible", "judicious"],
    tier: 2,
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
    tier: 1,
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
    tier: 3,
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
    tier: 3,
  },
  {
    word: "ameliorate",
    definition: "Make a bad or unsatisfactory situation better; improve",
    examples: [
      "The patch was intended to ameliorate the worst performance issues.",
      "Flexible hours ameliorated some of the dissatisfaction around workload.",
    ],
    synonyms: ["improve", "enhance", "better"],
    tier: 3,
  },
  {
    word: "ephemeral",
    definition: "Lasting for a very short time; transient",
    examples: [
      "The containers are ephemeral — they spin up, do their job, and disappear.",
      "Social media fame is ephemeral; building a real audience takes years.",
    ],
    synonyms: ["fleeting", "transient", "short-lived"],
    tier: 3,
  },
  {
    word: "mechanism",
    definition: "A system of parts working together; a natural or established process",
    examples: [
      "What's the mechanism for escalating critical bugs after hours?",
      "Feedback loops are a powerful mechanism for continuous improvement.",
    ],
    synonyms: ["system", "process", "apparatus"],
    tier: 1,
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
    tier: 3,
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
    tier: 1,
  },
  {
    word: "propensity",
    definition: "An inclination or natural tendency to behave in a particular way",
    examples: [
      "The system has a propensity to fail under heavy concurrent load.",
      "His propensity for overengineering added unnecessary complexity.",
    ],
    synonyms: ["tendency", "inclination", "predisposition"],
    tier: 3,
  },
  {
    word: "deference",
    definition: "Humble submission and respect; yielding to the judgment of another",
    examples: [
      "She showed deference to the domain experts when technical questions arose.",
      "Too much deference to seniority can stifle fresh ideas.",
    ],
    synonyms: ["respect", "regard", "compliance"],
    tier: 3,
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
    tier: 3,
  },
  {
    word: "prescient",
    definition: "Having or showing knowledge of events before they take place",
    examples: [
      "Her prescient warning about supply chain risks proved accurate six months later.",
      "In hindsight, the memo reads as almost prescient.",
    ],
    synonyms: ["foresighted", "prophetic", "visionary"],
    tier: 3,
  },
  {
    word: "synthesize",
    definition: "Combine a number of things into a coherent whole",
    examples: [
      "Her ability to synthesize feedback from five teams into one plan was impressive.",
      "The report synthesizes data from multiple independent sources.",
    ],
    synonyms: ["combine", "blend", "unify"],
    tier: 3,
  },
  {
    word: "antithesis",
    definition: "A person or thing that is the direct opposite of something else",
    examples: [
      "His management style was the antithesis of micromanagement.",
      "The new design is the antithesis of the cluttered legacy interface.",
    ],
    synonyms: ["opposite", "contrary", "inverse"],
    tier: 3,
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
    tier: 3,
  },
  {
    word: "stratify",
    definition: "Arrange or classify into different levels, layers, or social groups",
    examples: [
      "We stratified the user base by engagement level to target our campaigns.",
      "The data becomes more useful once you stratify it by region and cohort.",
    ],
    synonyms: ["layer", "classify", "categorize"],
    tier: 4,
  },
  {
    word: "disambiguate",
    definition: "Remove uncertainty of meaning from; make unambiguous",
    examples: [
      "The naming convention helps disambiguate which service owns each endpoint.",
      "We need to disambiguate the term 'user' — it means three different things in this codebase.",
    ],
    synonyms: ["clarify", "distinguish", "resolve"],
    tier: 4,
  },
  {
    word: "interpolate",
    definition: "Insert something between fixed points; estimate values between known data points",
    examples: [
      "The chart interpolates between the quarterly data points to show a smooth trend line.",
      "She interpolated a clarifying remark into the otherwise technical presentation.",
    ],
    synonyms: ["insert", "estimate", "interject"],
    tier: 4,
  },
  {
    word: "coalesce",
    definition: "Come together and form one mass or whole; merge",
    examples: [
      "Several small complaints coalesced into a formal grievance.",
      "The ideas from the brainstorm eventually coalesced into a coherent product vision.",
    ],
    synonyms: ["merge", "unite", "converge"],
    tier: 3,
  },
  {
    word: "demarcate",
    definition: "Set the boundaries or limits of; distinguish clearly",
    examples: [
      "The architecture clearly demarcates responsibilities between the frontend and backend.",
      "It's important to demarcate personal opinion from data-driven conclusions.",
    ],
    synonyms: ["delineate", "delimit", "distinguish"],
    tier: 4,
  },
  {
    word: "codify",
    definition: "Arrange laws or rules into a systematic code; formalize",
    examples: [
      "We should codify these best practices into a style guide.",
      "The team agreed to codify the decision-making process so it's repeatable.",
    ],
    synonyms: ["formalize", "systematize", "catalog"],
    tier: 4,
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
    tier: 4,
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
    tier: 4,
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
    tier: 2,
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
    tier: 2,
  },
  {
    word: "reverence",
    definition: "Deep respect and admiration for someone or something",
    examples: [
      "The team spoke about the original architect with a reverence that bordered on mythology.",
      "There's a reverence for craft in this organization that you don't find everywhere.",
    ],
    synonyms: ["veneration", "admiration", "awe"],
    tier: 2,
  },
  {
    word: "melancholy",
    definition: "A deep, persistent sadness or reflective gloom",
    examples: [
      "There was a sense of melancholy at the farewell dinner that no one tried to mask.",
      "The melancholy of shutting down a product you built from scratch is hard to describe.",
    ],
    synonyms: ["sadness", "sorrow", "wistfulness"],
    tier: 2,
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
    tier: 2,
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
    tier: 2,
  },
  {
    word: "exquisite",
    definition: "Extremely beautiful and delicate; intensely felt",
    examples: [
      "The attention to typography gave the interface an exquisite polish.",
      "There's an exquisite irony in a communication tool that nobody can figure out how to use.",
    ],
    synonyms: ["beautiful", "elegant", "refined"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "contend",
    definition: "Assert something as a position in an argument; struggle to deal with",
    examples: [
      "The report contends that current safety standards are insufficient.",
      "Engineers must contend with legacy constraints on every major feature.",
    ],
    synonyms: ["assert", "argue", "claim"],
    tier: 2,
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
    tier: 3,
  },
  {
    word: "acquiesce",
    definition: "Accept something reluctantly but without protest",
    examples: [
      "The team acquiesced to the deadline despite reservations about quality.",
      "He acquiesced to the policy change after voicing his concerns.",
    ],
    synonyms: ["comply", "yield", "consent"],
    tier: 3,
  },
  {
    word: "imply",
    definition: "Suggest something without stating it explicitly",
    examples: [
      "The data implies a correlation, but does not prove causation.",
      "His tone implied dissatisfaction even though he said nothing critical.",
    ],
    synonyms: ["suggest", "indicate", "insinuate"],
    tier: 2,
  },
  {
    word: "insinuate",
    definition: "Suggest or hint in an indirect and typically unpleasant way",
    examples: [
      "She insinuated that the delays were caused by poor planning.",
      "He never said it directly, but his questions insinuated doubt.",
    ],
    synonyms: ["hint", "imply", "intimate"],
    tier: 3,
  },
  {
    word: "manifest",
    definition: "Show or demonstrate something clearly; become apparent",
    examples: [
      "The underlying tension eventually manifested as open conflict.",
      "Poor architecture manifests as slow feature delivery over time.",
    ],
    synonyms: ["reveal", "display", "demonstrate"],
    tier: 2,
  },
  {
    word: "diverge",
    definition: "Develop in a different direction; differ from a standard or norm",
    examples: [
      "The two implementations diverge significantly in how they handle errors.",
      "At this point, opinions on the architecture diverge sharply.",
    ],
    synonyms: ["deviate", "differ", "separate"],
    tier: 3,
  },
  {
    word: "refute",
    definition: "Prove a statement or theory to be wrong or false",
    examples: [
      "The latest benchmark data refutes the claim that the old system is faster.",
      "She refuted each objection with clear evidence.",
    ],
    synonyms: ["disprove", "rebut", "counter"],
    tier: 3,
  },
  {
    word: "apprise",
    definition: "Inform or tell someone about a situation",
    examples: [
      "Please apprise the stakeholders of any changes to the timeline.",
      "She apprised the board of the security incident within the hour.",
    ],
    synonyms: ["inform", "notify", "brief"],
    tier: 4,
  },
  {
    word: "admonish",
    definition: "Warn or reprimand someone firmly but not harshly",
    examples: [
      "The manager admonished the team for skipping the documentation step.",
      "She admonished him gently, making clear it should not happen again.",
    ],
    synonyms: ["warn", "reprimand", "caution"],
    tier: 4,
  },
  {
    word: "bolster",
    definition: "Strengthen or support; give a boost to",
    examples: [
      "Additional test coverage would bolster confidence before the release.",
      "The new hire bolstered the team's capacity significantly.",
    ],
    synonyms: ["strengthen", "reinforce", "support"],
    tier: 2,
  },
  {
    word: "initiate",
    definition: "Cause a process or action to begin",
    examples: [
      "She initiated the review process three weeks ahead of schedule.",
      "The error initiates a rollback of the entire transaction.",
    ],
    synonyms: ["begin", "launch", "start"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "ponder",
    definition: "Think carefully, especially before making a decision",
    examples: [
      "She pondered the tradeoffs for days before choosing an approach.",
      "He sat quietly, pondering the feedback he had just received.",
    ],
    synonyms: ["consider", "deliberate", "contemplate"],
    tier: 2,
  },
  {
    word: "fathom",
    definition: "Understand after much thought; comprehend something difficult",
    examples: [
      "It was hard to fathom why such a critical bug had passed review.",
      "I cannot fathom why this dependency was introduced without discussion.",
    ],
    synonyms: ["understand", "grasp", "comprehend"],
    tier: 2,
  },
  {
    word: "discern",
    definition: "Perceive or recognize something not immediately obvious; distinguish",
    examples: [
      "It takes experience to discern which technical debt is truly dangerous.",
      "She could discern the real concern beneath his surface-level objection.",
    ],
    synonyms: ["perceive", "detect", "distinguish"],
    tier: 2,
  },
  {
    word: "speculate",
    definition: "Form a theory or conjecture without firm evidence",
    examples: [
      "We can only speculate about the root cause until the logs are recovered.",
      "Analysts speculated that the company would announce layoffs by year-end.",
    ],
    synonyms: ["theorize", "conjecture", "hypothesize"],
    tier: 2,
  },
  {
    word: "ascertain",
    definition: "Find out something for certain; make sure of",
    examples: [
      "We need to ascertain whether the data was corrupted before proceeding.",
      "The audit was conducted to ascertain compliance with industry standards.",
    ],
    synonyms: ["determine", "establish", "verify"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "conversely",
    definition: "Introducing a statement that contrasts with or reverses what has just been said",
    examples: [
      "More features can attract users; conversely, they can overwhelm them.",
      "Silence signals agreement in some cultures; conversely, it signals disagreement in others.",
    ],
    synonyms: ["on the other hand", "inversely", "contrariwise"],
    tier: 2,
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
    tier: 2,
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
    tier: 3,
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
    tier: 2,
  },
  {
    word: "constraint",
    definition: "A limitation or restriction; something that limits options",
    examples: [
      "The main constraint is not budget — it's available engineering time.",
      "Design under constraint often produces more creative solutions.",
    ],
    synonyms: ["limitation", "restriction", "bound"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "deficient",
    definition: "Not having enough of a specified quality or ingredient; lacking",
    examples: [
      "The onboarding process is deficient in technical depth.",
      "The model was deficient in its handling of edge cases.",
    ],
    synonyms: ["lacking", "inadequate", "insufficient"],
    tier: 2,
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
    tier: 2,
  },
  {
    word: "tenable",
    definition: "Able to be maintained or defended against criticism; reasonable",
    examples: [
      "That position is no longer tenable given the new evidence.",
      "A single-server architecture is tenable at this stage but will not scale.",
    ],
    synonyms: ["defensible", "maintainable", "reasonable"],
    tier: 4,
  },
  {
    word: "indeterminate",
    definition: "Not exactly known, established, or defined; unclear",
    examples: [
      "The root cause remains indeterminate pending further analysis.",
      "The timeline is indeterminate until we understand the full scope.",
    ],
    synonyms: ["uncertain", "unclear", "undefined"],
    tier: 3,
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
    tier: 2,
  },
  {
    word: "sincere",
    definition: "Free from pretense or deceit; proceeding from genuine feelings",
    examples: [
      "Her apology was sincere and immediately defused the tension.",
      "He made a sincere effort to understand the concerns before responding.",
    ],
    synonyms: ["genuine", "heartfelt", "honest"],
    tier: 2,
  },
  {
    word: "restless",
    definition: "Unable to rest or relax; constantly seeking change or activity",
    examples: [
      "He grew restless in the role once the technical challenges were solved.",
      "A restless mind can be an asset in fast-changing fields.",
    ],
    synonyms: ["unsettled", "agitated", "uneasy"],
    tier: 2,
  },
  {
    word: "unmotivated",
    definition: "Lacking enthusiasm or incentive; not driven to act",
    examples: [
      "Repetitive, low-impact work left the team feeling unmotivated.",
      "An unmotivated engineer rarely produces their best work.",
    ],
    synonyms: ["uninspired", "apathetic", "disengaged"],
    tier: 3,
  },
  {
    word: "inconsiderate",
    definition: "Thoughtlessly causing inconvenience or harm to others",
    examples: [
      "Merging without running the tests is inconsiderate to everyone downstream.",
      "Scheduling a two-hour meeting with no agenda is inconsiderate of people's time.",
    ],
    synonyms: ["thoughtless", "insensitive", "careless"],
    tier: 3,
  },
  {
    word: "drastic",
    definition: "Likely to have a strong or far-reaching effect; severe",
    examples: [
      "A full rewrite is a drastic step that should be considered carefully.",
      "The budget cuts were so drastic that three teams were eliminated overnight.",
    ],
    synonyms: ["extreme", "severe", "radical"],
    tier: 2,
  },
  {
    word: "fulfilling",
    definition: "Making someone satisfied and happy because of fully developing their abilities or character",
    examples: [
      "She found the mentorship role more fulfilling than the technical track.",
      "Work that aligns with your values tends to be more fulfilling.",
    ],
    synonyms: ["satisfying", "rewarding", "gratifying"],
    tier: 2,
  },
  {
    word: "breathtaking",
    definition: "Astonishing or awe-inspiring in quality, scale, or complexity",
    examples: [
      "The visualization of the live data pipeline was breathtaking in its complexity.",
      "Her command of the negotiation was breathtaking — she anticipated every move.",
    ],
    synonyms: ["stunning", "astonishing", "awe-inspiring"],
    tier: 2,
  },
  {
    word: "thought-provoking",
    definition: "Stimulating careful consideration or reflection",
    examples: [
      "The book raised thought-provoking questions about the ethics of AI.",
      "His talk was thought-provoking rather than prescriptive, which made it more valuable.",
    ],
    synonyms: ["stimulating", "challenging", "provocative"],
    tier: 2,
  },
  {
    word: "intriguing",
    definition: "Arousing one's curiosity or interest; fascinating",
    examples: [
      "The anomaly in the data was intriguing enough to justify a deeper investigation.",
      "She posed an intriguing hypothesis that no one had considered before.",
    ],
    synonyms: ["fascinating", "captivating", "curious"],
    tier: 2,
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
    tier: 3,
  },
  {
    word: "repudiate",
    definition: "Refuse to accept or be associated with; reject as having no authority",
    examples: [
      "The company repudiated the vendor's interpretation of the contract.",
      "She repudiated the accusation with documented evidence.",
    ],
    synonyms: ["reject", "disavow", "deny"],
    tier: 4,
  },
  {
    word: "diatribe",
    definition: "A forceful and bitter verbal attack against someone or something",
    examples: [
      "His post-mortem turned into a diatribe against the entire review process.",
      "A ten-minute diatribe in a team meeting rarely changes anything.",
    ],
    synonyms: ["tirade", "rant", "harangue"],
    tier: 3,
  },
  {
    word: "polemic",
    definition: "A strong written or spoken attack on someone's opinions or actions",
    examples: [
      "The article read less like analysis and more like a polemic.",
      "She wrote a polemic against the industry's obsession with growth metrics.",
    ],
    synonyms: ["attack", "diatribe", "argument"],
    tier: 3,
  },
  {
    word: "denigrate",
    definition: "Criticize unfairly; disparage or belittle",
    examples: [
      "He had a habit of denigrating others' contributions in public forums.",
      "The memo denigrated the previous team's work without acknowledging its constraints.",
    ],
    synonyms: ["disparage", "belittle", "deprecate"],
    tier: 3,
  },
  {
    word: "deride",
    definition: "Express contempt for; ridicule or mock",
    examples: [
      "Critics derided the product as a feature-length bug report.",
      "The proposal was initially derided but later proved correct.",
    ],
    synonyms: ["mock", "ridicule", "scorn"],
    tier: 4,
  },
  {
    word: "invective",
    definition: "Insulting, abusive, or highly critical language",
    examples: [
      "His review was full of invective that made it impossible to extract useful feedback.",
      "Skilled debaters argue without resorting to invective.",
    ],
    synonyms: ["abuse", "vitriol", "denunciation"],
    tier: 4,
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
    tier: 1,
  },
  {
    word: "procedure",
    definition: "An established or official way of doing something",
    examples: [
      "Following the procedure prevented a repeat of last quarter's outage.",
      "There is no procedure for this scenario — we need to write one.",
    ],
    synonyms: ["process", "protocol", "method"],
    tier: 1,
  },
  {
    word: "portfolio",
    definition: "A range of products, investments, or projects held by an organization or person",
    examples: [
      "The product portfolio needs pruning — we are supporting too many initiatives.",
      "Her portfolio of work showed a consistent eye for interaction design.",
    ],
    synonyms: ["collection", "range", "suite"],
    tier: 1,
  },
  {
    word: "enterprise",
    definition: "A project or undertaking requiring boldness and energy; a business organization",
    examples: [
      "The migration was a two-year enterprise that touched every part of the system.",
      "Enterprise customers have compliance requirements that consumer products can ignore.",
    ],
    synonyms: ["undertaking", "venture", "organization"],
    tier: 1,
  },
  {
    word: "strategic",
    definition: "Relating to the identification of long-term goals and the means to achieve them",
    examples: [
      "Hiring this person is a strategic investment in our infrastructure team.",
      "Not every decision needs to be strategic — some just need to be done.",
    ],
    synonyms: ["planned", "deliberate", "long-term"],
    tier: 1,
  },
  {
    word: "establish",
    definition: "Set up on a firm or permanent basis; initiate or bring into being",
    examples: [
      "We need to establish clear ownership before the project scales.",
      "The pilot program established that the approach was viable.",
    ],
    synonyms: ["found", "create", "institute"],
    tier: 1,
  },
  {
    word: "coordination",
    definition: "The organization of different elements to work together effectively",
    examples: [
      "Poor coordination between teams caused the two features to conflict on release day.",
      "Effective coordination is the invisible work that makes complex projects succeed.",
    ],
    synonyms: ["organization", "synchronization", "collaboration"],
    tier: 1,
  },
  {
    word: "exigency",
    definition: "An urgent need or demand; a pressing situation requiring immediate action",
    examples: [
      "The exigency of the outage required skipping the normal change process.",
      "Leaders must balance long-term planning with day-to-day exigencies.",
    ],
    synonyms: ["urgency", "necessity", "emergency"],
    tier: 4,
  },
  {
    word: "supposition",
    definition: "A belief held without proof or certainty; an assumption",
    examples: [
      "The entire plan rests on the supposition that the vendor will deliver on time.",
      "We should distinguish between verified facts and working suppositions.",
    ],
    synonyms: ["assumption", "hypothesis", "presumption"],
    tier: 3,
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
    tier: 3,
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
    tier: 1,
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
    tier: 1,
  },
  {
    word: "consistent",
    definition: "Acting or done in the same way over time; compatible with other facts",
    examples: [
      "Consistent communication keeps remote teams aligned without constant meetings.",
      "The results are consistent with our hypothesis, though not conclusive.",
    ],
    synonyms: ["steady", "reliable", "uniform"],
    tier: 1,
  },
  {
    word: "enhance",
    definition: "Improve or increase the quality, value, or extent of something",
    examples: [
      "The new animation enhances the sense of responsiveness without adding latency.",
      "Regular retrospectives enhance the team's ability to self-correct.",
    ],
    synonyms: ["improve", "augment", "elevate"],
    tier: 1,
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
    tier: 3,
  },
  {
    word: "fortify",
    definition: "Strengthen mentally or physically; reinforce against attack",
    examples: [
      "Adding rate limiting will fortify the API against abuse.",
      "She fortified her argument with additional evidence before the second review.",
    ],
    synonyms: ["strengthen", "reinforce", "harden"],
    tier: 3,
  },
  {
    word: "circumscribe",
    definition: "Restrict the range or activity of something; define the limits of",
    examples: [
      "The legal agreement circumscribed the scope of what each party could build.",
      "His authority was circumscribed by the board's oversight committee.",
    ],
    synonyms: ["restrict", "limit", "confine"],
    tier: 4,
  },
  {
    word: "promulgate",
    definition: "Promote or make widely known; formally put a law or rule into effect",
    examples: [
      "The new security policy was promulgated across the organization last quarter.",
      "She used the conference talk to promulgate the team's methodology.",
    ],
    synonyms: ["publicize", "disseminate", "enact"],
    tier: 4,
  },
  {
    word: "adjudicate",
    definition: "Make a formal judgment or decision about a problem or dispute",
    examples: [
      "A neutral party was brought in to adjudicate the disagreement between the two teams.",
      "The committee adjudicated the competing proposals in a closed session.",
    ],
    synonyms: ["judge", "arbitrate", "decide"],
    tier: 3,
  },
  {
    word: "obviate",
    definition: "Remove a need or difficulty; prevent or eliminate",
    examples: [
      "Automating the check obviates the need for a manual review step.",
      "A shared data model would obviate most of the synchronization issues.",
    ],
    synonyms: ["prevent", "eliminate", "preclude"],
    tier: 4,
  },
  {
    word: "preclude",
    definition: "Prevent from happening or make impossible in advance",
    examples: [
      "The NDA precludes us from disclosing the details to a third party.",
      "Early alignment precluded most of the conflicts that plagued the previous project.",
    ],
    synonyms: ["prevent", "prohibit", "bar"],
    tier: 3,
  },
  {
    word: "abrogate",
    definition: "Repeal or do away with a law, right, or formal agreement",
    examples: [
      "The new legislation abrogated the protections the previous regulation had provided.",
      "One party cannot unilaterally abrogate the terms of a signed contract.",
    ],
    synonyms: ["repeal", "revoke", "annul"],
    tier: 4,
  },
  {
    word: "attenuate",
    definition: "Reduce the force, effect, or value of something; weaken",
    examples: [
      "Adding a caching layer attenuates the load on the primary database.",
      "The manager's presence attenuated the tension in the room considerably.",
    ],
    synonyms: ["weaken", "reduce", "diminish"],
    tier: 4,
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
    tier: 2,
  },
  {
    word: "sublime",
    definition: "Of such excellence or beauty as to inspire great admiration; elevated",
    examples: [
      "The simplicity of the final design was, after years of complexity, almost sublime.",
      "She possessed a sublime grasp of the tradeoffs that others spent careers learning.",
    ],
    synonyms: ["magnificent", "elevated", "transcendent"],
    tier: 2,
  },
  {
    word: "inefficacious",
    definition: "Not producing the desired effect; failing to achieve results",
    examples: [
      "The workaround proved inefficacious under high load conditions.",
      "Repeated inefficacious interventions eroded trust in the change management process.",
    ],
    synonyms: ["ineffective", "futile", "powerless"],
    tier: 4,
  },
  {
    word: "obstreperous",
    definition: "Noisy and difficult to control; stubbornly resistant",
    examples: [
      "The obstreperous stakeholder derailed three consecutive planning sessions.",
      "An obstreperous minority can block progress if the process allows it.",
    ],
    synonyms: ["unruly", "disruptive", "clamorous"],
    tier: 4,
  },
  {
    word: "perspicacious",
    definition: "Having a ready insight into things; shrewdly perceptive",
    examples: [
      "Her perspicacious reading of the competitive landscape gave the team months of advantage.",
      "A perspicacious reviewer catches what the author intended, not just what was written.",
    ],
    synonyms: ["insightful", "astute", "discerning"],
    tier: 4,
  },
  {
    word: "sagacious",
    definition: "Having or showing keen mental discernment and good judgment",
    examples: [
      "His sagacious advice saved the company from a strategic mistake.",
      "Sagacious leaders know when to push forward and when to wait.",
    ],
    synonyms: ["wise", "astute", "judicious"],
    tier: 4,
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
    tier: 4,
  },
  {
    word: "taciturn",
    definition: "Reserved or uncommunicative in speech; saying little",
    examples: [
      "The most taciturn engineer on the team was also the most perceptive.",
      "A taciturn response in a code review can be as confusing as a verbose one.",
    ],
    synonyms: ["reticent", "reserved", "quiet"],
    tier: 4,
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
    tier: 4,
  },
  {
    word: "ebullient",
    definition: "Cheerful and full of energy; exuberant",
    examples: [
      "Her ebullient energy was infectious and lifted the team during long sprints.",
      "His ebullient personality made him a natural fit for customer-facing roles.",
    ],
    synonyms: ["exuberant", "enthusiastic", "vivacious"],
    tier: 4,
  },
  {
    word: "truculent",
    definition: "Eager or quick to argue or fight; aggressively defiant",
    examples: [
      "His truculent manner in code reviews alienated contributors who could have been allies.",
      "A truculent response to feedback rarely improves the outcome.",
    ],
    synonyms: ["aggressive", "combative", "belligerent"],
    tier: 4,
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
    tier: 4,
  },
  {
    word: "diffident",
    definition: "Modest or shy owing to a lack of self-confidence",
    examples: [
      "She was diffident in large meetings despite having the strongest technical opinions.",
      "A diffident candidate can be overlooked even when their skills are exceptional.",
    ],
    synonyms: ["shy", "reserved", "modest"],
    tier: 4,
  },
  {
    word: "obsequious",
    definition: "Obedient or attentive to an excessive or servile degree",
    examples: [
      "His obsequious manner around executives masked a sharper agenda.",
      "Obsequious agreement in reviews might feel polite, but it fails the author.",
    ],
    synonyms: ["sycophantic", "fawning", "servile"],
    tier: 4,
  },
  {
    word: "supercilious",
    definition: "Behaving or looking as if one thinks they are superior to others; disdainful",
    examples: [
      "His supercilious dismissal of junior engineers' ideas damaged team morale.",
      "A supercilious tone in documentation signals that the author values cleverness over clarity.",
    ],
    synonyms: ["condescending", "disdainful", "arrogant"],
    tier: 4,
  },
  {
    word: "verisimilitude",
    definition: "The appearance of being true or real; believable accuracy",
    examples: [
      "The simulation achieved enough verisimilitude to be useful for training.",
      "Good technical writing requires verisimilitude — the examples must feel real.",
    ],
    synonyms: ["realism", "plausibility", "authenticity"],
    tier: 4,
  },
  {
    word: "simulacrum",
    definition: "An image or representation of something; an unsatisfactory imitation",
    examples: [
      "The prototype was a simulacrum of the final product, useful for feedback but not deployment.",
      "The process became a simulacrum of agile — the rituals without the principles.",
    ],
    synonyms: ["replica", "imitation", "representation"],
    tier: 4,
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
    tier: 4,
  },
  {
    word: "weltanschauung",
    definition: "A comprehensive worldview or philosophy; a particular conception of the world",
    examples: [
      "His weltanschauung shaped every product decision, for better and worse.",
      "Company culture is really a collective weltanschauung — shared assumptions about how things work.",
    ],
    synonyms: ["worldview", "philosophy", "outlook"],
    tier: 4,
  },
  {
    word: "raison d'être",
    definition: "The most important reason or purpose for someone's or something's existence",
    examples: [
      "Reducing latency is the product's raison d'être — every feature decision flows from it.",
      "When a company loses its raison d'être, mission statements become hollow.",
    ],
    synonyms: ["purpose", "reason for being", "mission"],
    tier: 4,
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
    tier: 4,
  },
  {
    word: "sonorous",
    definition: "Producing a full, deep, or rich sound; imposingly grand",
    examples: [
      "The sonorous cadence of her closing argument left the room silent for a moment.",
      "A sonorous name for a product or feature can carry as much weight as the product itself.",
    ],
    synonyms: ["resonant", "rich", "full-toned"],
    tier: 4,
  },
  {
    word: "dulcet",
    definition: "Sweet and soothing, especially to the ear",
    examples: [
      "The dulcet tones of the notification sound were designed to calm rather than alarm.",
      "Her dulcet explanation of the error made a frustrating bug feel manageable.",
    ],
    synonyms: ["sweet", "melodious", "gentle"],
    tier: 4,
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
    tier: 4,
  },
  {
    word: "redoubtable",
    definition: "Deserving to be feared or respected; formidably impressive",
    examples: [
      "She built a redoubtable reputation as someone who ships without cutting corners.",
      "Facing a redoubtable competitor forced the team to raise their own standards.",
    ],
    synonyms: ["formidable", "impressive", "commanding"],
    tier: 4,
  },

  // ─── Tier 1: Leadership & governance ───────────────────────────────

  {
    word: "orchestrate",
    definition: "Plan and direct the elements of a complex situation or activity",
    examples: [
      "She orchestrated the entire product launch across six teams.",
      "Orchestrating a smooth migration requires months of careful planning.",
    ],
    synonyms: ["coordinate", "organize", "direct"],
    tier: 3,
  },
  {
    word: "governance",
    definition: "The system by which an organization or activity is controlled and regulated",
    examples: [
      "Strong governance ensures that decisions are made transparently and consistently.",
      "The new governance framework defines who owns which decisions.",
    ],
    synonyms: ["management", "oversight", "administration"],
    tier: 1,
  },
  {
    word: "supervise",
    definition: "Observe and direct the execution of a task or activity",
    examples: [
      "She was brought in to supervise the transition to the new platform.",
      "It's hard to supervise effectively when you're also executing individual tasks.",
    ],
    synonyms: ["oversee", "manage", "direct"],
    tier: 2,
  },
  {
    word: "coordinate",
    definition: "Bring the different elements of a complex activity into a harmonious relationship",
    examples: [
      "His role is to coordinate between engineering, design, and product.",
      "We need someone to coordinate the dependencies before the sprint begins.",
    ],
    synonyms: ["align", "synchronize", "organize"],
    tier: 2,
  },
  {
    word: "directive",
    definition: "An official or authoritative instruction; relating to management or control",
    examples: [
      "The directive came from the CEO: reduce costs by twenty percent this quarter.",
      "Without a clear directive, teams tend to optimize for local rather than global goals.",
    ],
    synonyms: ["instruction", "order", "mandate"],
    tier: 2,
  },
  {
    word: "objective",
    definition: "A goal or aim; not influenced by personal feelings or bias",
    examples: [
      "The team aligned on a single objective before breaking into workstreams.",
      "An objective assessment of the data leads to better decisions than gut instinct.",
    ],
    synonyms: ["goal", "target", "impartial"],
    tier: 1,
  },
  {
    word: "undertake",
    definition: "Commit oneself to and begin a task or challenge",
    examples: [
      "They undertook the migration knowing it would take at least a year.",
      "Do not undertake a project of this scope without proper resourcing.",
    ],
    synonyms: ["assume", "tackle", "embark on"],
    tier: 2,
  },
  {
    word: "ascendancy",
    definition: "Occupation of a position of dominant power or influence",
    examples: [
      "The platform's ascendancy in the market happened faster than anyone predicted.",
      "Technical ascendancy alone does not guarantee business success.",
    ],
    synonyms: ["dominance", "supremacy", "authority"],
    tier: 3,
  },

  // ─── Tier 1: Critical thinking ──────────────────────────────────────

  {
    word: "axiom",
    definition: "A statement or proposition regarded as self-evidently true",
    examples: [
      "It is an axiom of good design that complexity should be hidden, not exposed.",
      "They built the strategy on the axiom that users prefer simplicity over control.",
    ],
    synonyms: ["maxim", "principle", "truism"],
    tier: 3,
  },
  {
    word: "hypothesis",
    definition: "A proposed explanation made on the basis of limited evidence as a starting point for investigation",
    examples: [
      "Our hypothesis is that reducing friction at signup will increase conversion.",
      "A hypothesis is only useful if it is testable and falsifiable.",
    ],
    synonyms: ["theory", "conjecture", "supposition"],
    tier: 1,
  },
  {
    word: "inference",
    definition: "A conclusion reached on the basis of evidence and reasoning",
    examples: [
      "The inference from the data is that users abandon the flow at step three.",
      "Drawing an inference requires both good data and sound reasoning.",
    ],
    synonyms: ["deduction", "conclusion", "reading"],
    tier: 2,
  },
  {
    word: "validity",
    definition: "The quality of being logically or factually sound; legitimacy",
    examples: [
      "We need to test the validity of the model before acting on its output.",
      "The validity of the research depends entirely on the sample selection.",
    ],
    synonyms: ["soundness", "legitimacy", "credibility"],
    tier: 2,
  },
  {
    word: "syllogism",
    definition: "A form of reasoning where a conclusion is drawn from two given premises",
    examples: [
      "The argument relies on a syllogism that falls apart once you examine the second premise.",
      "Valid syllogisms produce true conclusions only if the premises are also true.",
    ],
    synonyms: ["argument", "deduction", "logical form"],
    tier: 4,
  },
  {
    word: "fallacious",
    definition: "Based on a mistaken belief; containing a logical flaw",
    examples: [
      "The report's conclusion was fallacious — it confused correlation with causation.",
      "Fallacious reasoning in a business case can lead an entire team in the wrong direction.",
    ],
    synonyms: ["flawed", "erroneous", "misleading"],
    tier: 3,
  },
  {
    word: "correlation",
    definition: "A mutual relationship or connection between two or more things",
    examples: [
      "There is a strong correlation between team autonomy and delivery speed.",
      "Correlation does not imply causation — that distinction matters enormously in data analysis.",
    ],
    synonyms: ["connection", "relationship", "association"],
    tier: 1,
  },
  {
    word: "categorize",
    definition: "Place in a particular class or group; classify",
    examples: [
      "We categorize bugs by severity before assigning them to the backlog.",
      "It helps to categorize feedback by theme rather than responding to each point individually.",
    ],
    synonyms: ["classify", "group", "sort"],
    tier: 3,
  },
  {
    word: "cognitive",
    definition: "Relating to mental processes of thinking, knowing, and understanding",
    examples: [
      "The interface creates unnecessary cognitive load for new users.",
      "Cognitive biases affect even the most experienced decision-makers.",
    ],
    synonyms: ["mental", "intellectual", "psychological"],
    tier: 1,
  },
  {
    word: "dispassionate",
    definition: "Not influenced by strong emotion; rational and impartial",
    examples: [
      "A dispassionate review of the evidence pointed clearly to a systemic issue.",
      "She gave a dispassionate assessment of the proposal's weaknesses.",
    ],
    synonyms: ["impartial", "objective", "detached"],
    tier: 3,
  },
  {
    word: "scrutinize",
    definition: "Examine or inspect closely and thoroughly",
    examples: [
      "The committee will scrutinize every line of the proposed budget.",
      "It is worth scrutinizing the assumptions before investing in the solution.",
    ],
    synonyms: ["examine", "inspect", "analyze"],
    tier: 3,
  },

  // ─── Tier 1: Character traits ────────────────────────────────────────

  {
    word: "stoic",
    definition: "Enduring pain or difficulty without complaint; unemotionally resilient",
    examples: [
      "He remained stoic throughout the performance review, processing the feedback quietly.",
      "A stoic response to setbacks can steady a team that would otherwise panic.",
    ],
    synonyms: ["impassive", "composed", "unflappable"],
    tier: 3,
  },
  {
    word: "intrepid",
    definition: "Fearless and adventurous; willing to face difficulty without hesitation",
    examples: [
      "Only the most intrepid engineers volunteered to debug the legacy system.",
      "Her intrepid approach to negotiation opened markets no one else had attempted.",
    ],
    synonyms: ["fearless", "bold", "dauntless"],
    tier: 3,
  },
  {
    word: "tenacious",
    definition: "Holding firm to a goal despite obstacles; persistently determined",
    examples: [
      "She was tenacious in pursuing the root cause even after others gave up.",
      "Tenacious follow-through is what separates people who ship from people who plan.",
    ],
    synonyms: ["persistent", "determined", "relentless"],
    tier: 3,
  },
  {
    word: "garrulous",
    definition: "Excessively talkative, especially on trivial matters",
    examples: [
      "His garrulous updates in standup regularly pushed meetings past their timebox.",
      "A garrulous presenter often buries the key insight in unnecessary detail.",
    ],
    synonyms: ["talkative", "verbose", "loquacious"],
    tier: 4,
  },
  {
    word: "complaisant",
    definition: "Willing to please others; obligingly agreeable",
    examples: [
      "His complaisant manner made him well-liked but rarely did he challenge bad ideas.",
      "A complaisant team culture often masks deeper disagreements.",
    ],
    synonyms: ["obliging", "accommodating", "deferential"],
    tier: 4,
  },
  {
    word: "assiduous",
    definition: "Showing great care and perseverance; diligently attentive",
    examples: [
      "Her assiduous attention to edge cases caught bugs that broad testing missed.",
      "Assiduous preparation before a client presentation rarely goes unnoticed.",
    ],
    synonyms: ["diligent", "thorough", "industrious"],
    tier: 4,
  },
  {
    word: "irascible",
    definition: "Having a tendency to become easily angered; quick-tempered",
    examples: [
      "His irascible reactions in code reviews created a climate of fear.",
      "An irascible leader may get short-term results but loses long-term loyalty.",
    ],
    synonyms: ["irritable", "hot-tempered", "cantankerous"],
    tier: 4,
  },
  {
    word: "reticent",
    definition: "Not revealing one's thoughts or feelings readily; reserved",
    examples: [
      "She was reticent during the meeting but submitted a detailed written response afterward.",
      "A reticent engineer may have the best ideas in the room — but only if you ask.",
    ],
    synonyms: ["reserved", "restrained", "tight-lipped"],
    tier: 3,
  },
  {
    word: "genuine",
    definition: "Truly what something is said to be; authentic and sincere",
    examples: [
      "His enthusiasm for the project was genuine, not performative.",
      "Genuine curiosity is one of the most valuable traits in a researcher.",
    ],
    synonyms: ["authentic", "sincere", "real"],
    tier: 1,
  },
  {
    word: "indolent",
    definition: "Wanting to avoid activity or exertion; habitually lazy",
    examples: [
      "An indolent approach to documentation creates debt that everyone else pays.",
      "He was not indolent — he simply needed problems worth solving.",
    ],
    synonyms: ["lazy", "idle", "lethargic"],
    tier: 4,
  },
  {
    word: "amicable",
    definition: "Having a friendly and pleasant manner; goodwill between parties",
    examples: [
      "The two teams reached an amicable agreement on the API boundary.",
      "Even in disagreement, she kept the conversation amicable and productive.",
    ],
    synonyms: ["friendly", "cordial", "harmonious"],
    tier: 3,
  },
  {
    word: "composed",
    definition: "Having one's feelings and expression under control; calm",
    examples: [
      "She remained composed during the incident, which kept the rest of the team focused.",
      "A composed response to criticism signals emotional intelligence.",
    ],
    synonyms: ["calm", "collected", "unruffled"],
    tier: 1,
  },

  // ─── Tier 1: Academic / argumentation ──────────────────────────────

  {
    word: "verify",
    definition: "Make sure or demonstrate that something is true or accurate",
    examples: [
      "Always verify assumptions before writing a single line of code.",
      "The team verified the results independently before publishing.",
    ],
    synonyms: ["confirm", "validate", "check"],
    tier: 1,
  },
  {
    word: "contradict",
    definition: "Deny the truth of a statement by asserting the opposite",
    examples: [
      "The new findings directly contradict the earlier report.",
      "His actions contradict his stated commitment to transparency.",
    ],
    synonyms: ["deny", "refute", "counter"],
    tier: 2,
  },
  {
    word: "outline",
    definition: "Give a summary of something; draw or describe the shape or main features",
    examples: [
      "Please outline the key risks before the next stakeholder meeting.",
      "The spec should outline what the system does, not how it does it.",
    ],
    synonyms: ["summarize", "sketch", "describe"],
    tier: 1,
  },
  {
    word: "explicate",
    definition: "Analyze and develop an idea in detail; explain fully",
    examples: [
      "The paper explicates the theoretical basis for the experimental design.",
      "She took time to explicate each assumption underlying the model.",
    ],
    synonyms: ["explain", "elaborate", "expound"],
    tier: 4,
  },
  {
    word: "contention",
    definition: "A point advanced in a debate or argument; heated disagreement",
    examples: [
      "Her central contention is that the data does not support the conclusion.",
      "The contention over ownership of the shared service slowed every team.",
    ],
    synonyms: ["assertion", "argument", "dispute"],
    tier: 2,
  },
  {
    word: "discourse",
    definition: "Written or spoken communication or debate; a formal discussion",
    examples: [
      "The team's discourse around architecture improved significantly after they adopted RFCs.",
      "Public discourse on AI safety has intensified as capabilities have grown.",
    ],
    synonyms: ["discussion", "dialogue", "conversation"],
    tier: 2,
  },
  {
    word: "justify",
    definition: "Show or prove to be right or reasonable; provide adequate grounds for",
    examples: [
      "You need to justify the added complexity before it gets approved.",
      "The results justify the investment we made in the new testing infrastructure.",
    ],
    synonyms: ["defend", "support", "warrant"],
    tier: 1,
  },
  {
    word: "orientation",
    definition: "The direction of someone's interest or focus; familiarization with a new situation",
    examples: [
      "The company's orientation toward long-term value creation shapes every hiring decision.",
      "New engineers go through a two-week orientation before joining a team.",
    ],
    synonyms: ["direction", "focus", "inclination"],
    tier: 1,
  },
  {
    word: "empirical",
    definition: "Based on observation or experiment rather than theory or assumption",
    examples: [
      "The decision should be based on empirical evidence, not intuition.",
      "Empirical testing revealed that users behave very differently from what we assumed.",
    ],
    synonyms: ["evidence-based", "observational", "experimental"],
    tier: 2,
  },

  // ─── Tier 1: Change & movement ──────────────────────────────────────

  {
    word: "deteriorate",
    definition: "Become progressively worse in quality, condition, or value",
    examples: [
      "Without maintenance, code quality will deteriorate faster than anyone expects.",
      "Team morale began to deteriorate after three months of missed commitments.",
    ],
    synonyms: ["degrade", "decline", "worsen"],
    tier: 3,
  },
  {
    word: "burgeon",
    definition: "Begin to grow or increase rapidly; flourish",
    examples: [
      "Demand for the feature began to burgeon once the first cohort of users tried it.",
      "A burgeoning ecosystem of tools has emerged around the platform.",
    ],
    synonyms: ["grow", "flourish", "expand"],
    tier: 4,
  },
  {
    word: "proliferate",
    definition: "Increase rapidly in numbers; spread widely",
    examples: [
      "Microservices proliferated so fast that the team lost track of what owned what.",
      "Competing standards tend to proliferate before the market settles on one.",
    ],
    synonyms: ["multiply", "spread", "expand"],
    tier: 3,
  },
  {
    word: "accelerate",
    definition: "Increase in rate, speed, or amount; cause to happen sooner",
    examples: [
      "Automation can accelerate delivery without sacrificing quality.",
      "The economic pressures accelerated the timeline for the decision.",
    ],
    synonyms: ["speed up", "hasten", "intensify"],
    tier: 2,
  },
  {
    word: "erode",
    definition: "Gradually wear away or weaken; diminish over time",
    examples: [
      "Trust erodes quickly when commitments are repeatedly missed.",
      "Technical debt erodes the team's ability to ship new features.",
    ],
    synonyms: ["wear away", "diminish", "undermine"],
    tier: 3,
  },
  {
    word: "flourish",
    definition: "Grow or develop in a healthy or vigorous way; thrive",
    examples: [
      "Creative teams flourish when given autonomy and clear purpose.",
      "The product began to flourish once it found its core audience.",
    ],
    synonyms: ["thrive", "prosper", "bloom"],
    tier: 2,
  },
  {
    word: "subside",
    definition: "Become less intense, violent, or severe; sink to a lower level",
    examples: [
      "Once the initial panic subsided, the team got to work on the root cause.",
      "The controversy subsided after the company issued a clear public statement.",
    ],
    synonyms: ["diminish", "abate", "ease"],
    tier: 3,
  },
  {
    word: "abate",
    definition: "Become less intense or widespread; diminish in strength",
    examples: [
      "The load on the servers did not abate until the bot traffic was filtered.",
      "Concerns about the policy abated once the details were made public.",
    ],
    synonyms: ["subside", "lessen", "decrease"],
    tier: 3,
  },
  {
    word: "emerge",
    definition: "Come into being or prominence; become apparent",
    examples: [
      "A clear pattern began to emerge from the user research.",
      "New competitors tend to emerge once a market is proven viable.",
    ],
    synonyms: ["surface", "arise", "appear"],
    tier: 1,
  },
  {
    word: "transition",
    definition: "The process or period of changing from one state or condition to another",
    examples: [
      "The transition from waterfall to agile took the team nearly a year.",
      "Managing a leadership transition well requires early and honest communication.",
    ],
    synonyms: ["shift", "change", "move"],
    tier: 1,
  },
  {
    word: "shift",
    definition: "Move or cause to move from one place, position, or direction to another",
    examples: [
      "There has been a significant shift in how customers use the product.",
      "The company needs to shift its focus from acquisition to retention.",
    ],
    synonyms: ["move", "change", "transfer"],
    tier: 1,
  },

  // ─── Tier 1: Medical / scientific terms ─────────────────────────────

  {
    word: "pathological",
    definition: "Relating to or caused by a physical or mental disease; compulsive, extreme",
    examples: [
      "The team's pathological need for consensus slowed every decision.",
      "Pathological optimism about timelines is one of the most common project failure modes.",
    ],
    synonyms: ["compulsive", "morbid", "extreme"],
    tier: 2,
  },
  {
    word: "chronic",
    definition: "Persisting for a long time; constantly recurring; habitual",
    examples: [
      "The team has a chronic problem with scope creep that no process has fixed.",
      "Chronic underfunding of infrastructure eventually produces catastrophic failures.",
    ],
    synonyms: ["persistent", "ongoing", "habitual"],
    tier: 1,
  },
  {
    word: "inert",
    definition: "Lacking the ability or strength to move; chemically inactive; sluggish",
    examples: [
      "The legacy system had become inert — no one was willing to touch it.",
      "Without external pressure, the organization remained inert.",
    ],
    synonyms: ["inactive", "dormant", "sluggish"],
    tier: 3,
  },
  {
    word: "lethargic",
    definition: "Affected by lethargy; sluggish and apathetic",
    examples: [
      "The team grew lethargic after months of repetitive maintenance work.",
      "A lethargic response to a competitor's launch can cost you market share.",
    ],
    synonyms: ["sluggish", "listless", "apathetic"],
    tier: 3,
  },
  {
    word: "malleable",
    definition: "Able to be shaped or bent; adaptable and easily influenced",
    examples: [
      "Early in a project, the architecture is malleable — later, changes are expensive.",
      "She was malleable in her approach, adapting to each client's communication style.",
    ],
    synonyms: ["flexible", "adaptable", "pliable"],
    tier: 3,
  },
  {
    word: "amalgamate",
    definition: "Combine or unite to form one organization or structure; merge",
    examples: [
      "The two teams were amalgamated under a single engineering director.",
      "The project amalgamated data from six different legacy systems.",
    ],
    synonyms: ["merge", "combine", "consolidate"],
    tier: 4,
  },

  // ─── Tier 1: Legal & political ──────────────────────────────────────

  {
    word: "ratify",
    definition: "Sign or formally approve an agreement, making it officially valid",
    examples: [
      "All three parties must ratify the contract before work can begin.",
      "The policy was drafted last year but only ratified this quarter.",
    ],
    synonyms: ["approve", "endorse", "confirm"],
    tier: 3,
  },
  {
    word: "sanction",
    definition: "Official permission or approval; a penalty for disobeying a rule",
    examples: [
      "The project was sanctioned by the executive team last quarter.",
      "Repeated violations will result in formal sanctions under the code of conduct.",
    ],
    synonyms: ["authorize", "approve", "penalty"],
    tier: 2,
  },
  {
    word: "jurisdiction",
    definition: "The official power or territory over which authority extends",
    examples: [
      "The data privacy regulation applies in every jurisdiction where we operate.",
      "Disputes about which team has jurisdiction over the shared API come up every sprint.",
    ],
    synonyms: ["authority", "domain", "scope"],
    tier: 1,
  },
  {
    word: "repeal",
    definition: "Revoke or annul a law or regulation",
    examples: [
      "The outdated policy was repealed after three years of lobbying by the team.",
      "Repealing an internal rule without replacing it often creates more confusion.",
    ],
    synonyms: ["revoke", "annul", "rescind"],
    tier: 1,
  },
  {
    word: "autonomy",
    definition: "The right or condition of self-governance; independence in decision-making",
    examples: [
      "Teams with autonomy over their roadmap tend to be more innovative.",
      "Autonomy without accountability quickly leads to fragmentation.",
    ],
    synonyms: ["independence", "self-governance", "freedom"],
    tier: 1,
  },
  {
    word: "coalition",
    definition: "A group formed by the union of different parties or interests",
    examples: [
      "She built a coalition of stakeholders to champion the accessibility initiative.",
      "No single team had enough influence — the change required a coalition.",
    ],
    synonyms: ["alliance", "partnership", "consortium"],
    tier: 1,
  },
  {
    word: "protocol",
    definition: "An official procedure or system of rules governing affairs; a communication standard",
    examples: [
      "There is no protocol for this kind of incident — we need to define one.",
      "Following the communication protocol prevents conflicting signals to customers.",
    ],
    synonyms: ["procedure", "convention", "standard"],
    tier: 1,
  },
  {
    word: "allocate",
    definition: "Distribute resources or responsibilities for a specific purpose",
    examples: [
      "We need to allocate at least twenty percent of each sprint to technical debt.",
      "Budget is allocated annually but can be reallocated quarterly with approval.",
    ],
    synonyms: ["assign", "distribute", "apportion"],
    tier: 2,
  },
  {
    word: "amendment",
    definition: "A change or addition to a law, document, or agreement",
    examples: [
      "The contract amendment extended the deadline by sixty days.",
      "Proposing an amendment to the policy requires sign-off from legal and compliance.",
    ],
    synonyms: ["revision", "modification", "change"],
    tier: 1,
  },

  // ─── Tier 1: Relationships ───────────────────────────────────────────

  {
    word: "reciprocity",
    definition: "The practice of exchanging things with others for mutual benefit",
    examples: [
      "Healthy partnerships are built on reciprocity, not one-sided dependency.",
      "Reciprocity in feedback culture means everyone gives and receives openly.",
    ],
    synonyms: ["mutuality", "exchange", "give-and-take"],
    tier: 3,
  },
  {
    word: "alienation",
    definition: "The feeling of being isolated from a group or activity; estrangement",
    examples: [
      "Remote work can produce alienation if not counteracted with intentional connection.",
      "The reorganization created a sense of alienation among the original founding team.",
    ],
    synonyms: ["estrangement", "isolation", "disconnection"],
    tier: 3,
  },
  {
    word: "harmony",
    definition: "A pleasing combination or agreement of elements; peaceful coexistence",
    examples: [
      "Achieving harmony between design and engineering requires ongoing dialogue.",
      "The team worked in harmony despite coming from very different backgrounds.",
    ],
    synonyms: ["accord", "unity", "agreement"],
    tier: 1,
  },
  {
    word: "hostility",
    definition: "Unfriendly or aggressive behavior; opposition or resistance",
    examples: [
      "There was an underlying hostility between the two departments that no one addressed.",
      "Hostility in a code review signals a culture problem, not just a people problem.",
    ],
    synonyms: ["antagonism", "aggression", "opposition"],
    tier: 2,
  },
  {
    word: "affable",
    definition: "Friendly, good-natured, and easy to talk to",
    examples: [
      "His affable manner made him the natural choice for client-facing work.",
      "Affable does not always mean effective — likeability and leadership are different qualities.",
    ],
    synonyms: ["friendly", "amiable", "approachable"],
    tier: 3,
  },
  {
    word: "vulnerable",
    definition: "Exposed to the possibility of harm; open and honest in a way that risks discomfort",
    examples: [
      "Leaders who are vulnerable about uncertainty build more trust than those who perform certainty.",
      "A system that depends on a single node is vulnerable to cascading failure.",
    ],
    synonyms: ["exposed", "susceptible", "open"],
    tier: 1,
  },
  {
    word: "validation",
    definition: "Recognition or affirmation that a person or their feelings are understood; confirmation",
    examples: [
      "User validation early in the design process saves months of rework later.",
      "Seeking external validation for every decision is a sign of low team confidence.",
    ],
    synonyms: ["confirmation", "recognition", "verification"],
    tier: 2,
  },

  // ─── Tier 1: Time & duration ─────────────────────────────────────────

  {
    word: "perennial",
    definition: "Lasting or existing for a long or apparently infinite time; recurring regularly",
    examples: [
      "The tension between speed and quality is a perennial challenge in software.",
      "Documentation debt is a perennial problem that every team claims to solve next quarter.",
    ],
    synonyms: ["enduring", "persistent", "recurring"],
    tier: 2,
  },
  {
    word: "simultaneous",
    definition: "Occurring, operating, or done at the same time",
    examples: [
      "Simultaneous releases across platforms require precise coordination.",
      "The simultaneous migration of users and data is the riskiest phase.",
    ],
    synonyms: ["concurrent", "synchronous", "parallel"],
    tier: 2,
  },
  {
    word: "perpetual",
    definition: "Never ending or changing; occurring repeatedly",
    examples: [
      "The team was caught in a perpetual cycle of firefighting with no time for prevention.",
      "Perpetual beta is a release strategy, not an excuse to avoid shipping stable features.",
    ],
    synonyms: ["endless", "continuous", "constant"],
    tier: 2,
  },
  {
    word: "interim",
    definition: "In or for the intervening period; temporary",
    examples: [
      "An interim solution was deployed while the permanent fix was developed.",
      "She served as interim lead for six months before a permanent hire was made.",
    ],
    synonyms: ["temporary", "provisional", "stopgap"],
    tier: 1,
  },
  {
    word: "contemporary",
    definition: "Living or occurring at the same time; belonging to the present day",
    examples: [
      "Contemporary frameworks solve problems that were irrelevant a decade ago.",
      "Her design aesthetic is contemporary without chasing trends.",
    ],
    synonyms: ["modern", "current", "present-day"],
    tier: 1,
  },
  {
    word: "duration",
    definition: "The length of time that something lasts",
    examples: [
      "The duration of the outage was ninety minutes — too long to avoid a post-mortem.",
      "Estimating the duration of a complex project accurately is notoriously difficult.",
    ],
    synonyms: ["length", "period", "span"],
    tier: 1,
  },

  // ─── Tier 1: Scale & degree ──────────────────────────────────────────

  {
    word: "marginal",
    definition: "Related to a small margin; minor; at or near the lower limit of quality",
    examples: [
      "The performance gain was marginal and did not justify the added complexity.",
      "Marginal improvements add up over time if you are consistent about making them.",
    ],
    synonyms: ["minor", "slight", "minimal"],
    tier: 2,
  },
  {
    word: "abysmal",
    definition: "Extremely bad; of the most extreme kind",
    examples: [
      "The onboarding experience was abysmal — most users gave up before completing it.",
      "Abysmal test coverage made every release feel like a gamble.",
    ],
    synonyms: ["terrible", "dreadful", "appalling"],
    tier: 3,
  },
  {
    word: "exorbitant",
    definition: "Unreasonably large in amount; greatly exceeding normal bounds",
    examples: [
      "The vendor's pricing was exorbitant once usage scaled past the initial tier.",
      "An exorbitant number of meetings leaves no time for actual work.",
    ],
    synonyms: ["excessive", "extravagant", "unreasonable"],
    tier: 3,
  },
  {
    word: "immense",
    definition: "Extremely large or great in scale or degree",
    examples: [
      "The immense complexity of the codebase made onboarding new engineers slow.",
      "She had immense patience when explaining technical concepts to non-engineers.",
    ],
    synonyms: ["enormous", "vast", "colossal"],
    tier: 1,
  },
  {
    word: "moderate",
    definition: "Average in amount, intensity, or degree; not excessive or extreme",
    examples: [
      "A moderate improvement in latency is achievable without a full rewrite.",
      "She took a moderate stance on the debate, acknowledging merit on both sides.",
    ],
    synonyms: ["average", "reasonable", "temperate"],
    tier: 1,
  },
  {
    word: "magnitude",
    definition: "The great size or extent of something; importance",
    examples: [
      "The magnitude of the technical debt had been underestimated for years.",
      "A decision of this magnitude requires sign-off at the board level.",
    ],
    synonyms: ["scale", "size", "extent"],
    tier: 1,
  },
  {
    word: "nominal",
    definition: "Existing in name only; very small in amount compared with the actual value",
    examples: [
      "The performance difference between the two approaches is nominal in production.",
      "There is a nominal fee for the developer tier, mostly to filter casual signups.",
    ],
    synonyms: ["minimal", "token", "theoretical"],
    tier: 2,
  },
  {
    word: "excessive",
    definition: "More than is necessary, normal, or desirable; immoderate",
    examples: [
      "Excessive meetings are one of the most cited reasons engineers leave companies.",
      "The number of dependencies in the project had become excessive.",
    ],
    synonyms: ["extreme", "immoderate", "disproportionate"],
    tier: 1,
  },
  {
    word: "vast",
    definition: "Of very great extent or quantity; immense",
    examples: [
      "The vast majority of support tickets are caused by a small number of recurring issues.",
      "She had a vast knowledge of the industry that took years to accumulate.",
    ],
    synonyms: ["immense", "enormous", "extensive"],
    tier: 1,
  },
  {
    word: "fragile",
    definition: "Easily damaged or broken; lacking robustness or resilience",
    examples: [
      "The integration is fragile — any change to the upstream API breaks it.",
      "Fragile systems require constant attention that crowds out new development.",
    ],
    synonyms: ["delicate", "brittle", "vulnerable"],
    tier: 1,
  },

  // ─── Tier 2: Professional / analytical ─────────────────────────────

  {
    word: "subpoena",
    definition: "A legal writ ordering a person to appear in court or produce documents",
    examples: [
      "The company received a subpoena for all communications related to the acquisition.",
      "Handling a subpoena requires coordination between legal and engineering immediately.",
    ],
    synonyms: ["summons", "court order", "writ"],
    tier: 2,
  },
  {
    word: "constituency",
    definition: "A body of supporters or customers; voters or stakeholders in a particular group",
    examples: [
      "The product must serve its core constituency before expanding to adjacent markets.",
      "Each engineering team is a constituency with legitimate needs that must be balanced.",
    ],
    synonyms: ["supporters", "base", "stakeholders"],
    tier: 2,
  },
  {
    word: "infrastructure",
    definition: "The basic physical and organizational structures needed for operation",
    examples: [
      "Investing in infrastructure now reduces the cost of scaling later.",
      "The infrastructure team is the foundation everything else is built on.",
    ],
    synonyms: ["framework", "foundation", "base"],
    tier: 1,
  },
  {
    word: "commission",
    definition: "An instruction to produce something; a fee paid to an agent; bring into use",
    examples: [
      "They commissioned an independent audit of the security practices.",
      "The new data center was commissioned ahead of schedule.",
    ],
    synonyms: ["authorize", "contract", "mandate"],
    tier: 1,
  },
  {
    word: "scheme",
    definition: "A systematic plan or arrangement; a secret or underhanded plan",
    examples: [
      "The color scheme was deliberately chosen to reduce cognitive load.",
      "A naming scheme that is consistent makes exploration of the codebase intuitive.",
    ],
    synonyms: ["plan", "system", "arrangement"],
    tier: 1,
  },
  {
    word: "facilitator",
    definition: "A person who helps a group do something more easily; one who enables a process",
    examples: [
      "She acted as a facilitator in the design sprint rather than a decision-maker.",
      "A good facilitator draws out quieter voices and prevents dominant ones from steering.",
    ],
    synonyms: ["mediator", "coordinator", "enabler"],
    tier: 3,
  },
  {
    word: "institute",
    definition: "Set up or establish an organization or a system; a society or organization",
    examples: [
      "The team decided to institute a weekly architecture review going forward.",
      "The research institute published findings that changed how the industry thought about security.",
    ],
    synonyms: ["establish", "create", "found"],
    tier: 1,
  },
  {
    word: "rationalism",
    definition: "The practice of treating reason as the basis for belief and action",
    examples: [
      "Her approach to decision-making was grounded in rationalism rather than intuition.",
      "Pure rationalism without empathy often produces technically correct but unusable products.",
    ],
    synonyms: ["reason", "logic", "empiricism"],
    tier: 3,
  },
  {
    word: "paradoxical",
    definition: "Seeming absurd or contradictory, yet expressing a possible truth",
    examples: [
      "It is paradoxical that adding more safety checks can introduce new failure modes.",
      "The paradoxical result is that slowing down the team made them ship faster.",
    ],
    synonyms: ["contradictory", "self-contradicting", "ironic"],
    tier: 3,
  },
  {
    word: "discrimination",
    definition: "Unjust treatment based on category; the ability to distinguish between things",
    examples: [
      "The model showed discrimination in its outputs that reflected biases in the training data.",
      "Fine discrimination between similar design options is a mark of a mature aesthetic sense.",
    ],
    synonyms: ["bias", "distinction", "prejudice"],
    tier: 1,
  },
  {
    word: "misanthrope",
    definition: "A person who dislikes and distrusts other people generally",
    examples: [
      "He was not a misanthrope — he simply preferred asynchronous communication.",
      "A misanthrope rarely thrives in roles that require building broad coalitions.",
    ],
    synonyms: ["cynic", "recluse", "pessimist"],
    tier: 4,
  },
  {
    word: "biological",
    definition: "Relating to biology or living organisms; naturally inherent",
    examples: [
      "The biological metaphor for organizational growth is surprisingly accurate.",
      "Some cognitive biases have biological roots that predate modern organizations.",
    ],
    synonyms: ["organic", "natural", "living"],
    tier: 1,
  },
  {
    word: "suspension",
    definition: "The temporary stopping of something; the state of being suspended",
    examples: [
      "The account was placed in suspension pending a compliance review.",
      "A brief suspension of disbelief is required to see the full potential of the prototype.",
    ],
    synonyms: ["pause", "temporary halt", "deferral"],
    tier: 1,
  },
  {
    word: "forerunner",
    definition: "A person or thing that precedes the arrival of someone or something else",
    examples: [
      "The original product was a forerunner to an entire category of tools.",
      "Small signals of cultural change are often forerunners of major organizational shifts.",
    ],
    synonyms: ["precursor", "predecessor", "harbinger"],
    tier: 3,
  },

  // ─── Tier 3: Scientific / physical ──────────────────────────────────

  {
    word: "coagulate",
    definition: "Change from a liquid to a solid or semi-solid state; congeal",
    examples: [
      "Without regular refactoring, ideas coagulate into rigid patterns that resist change.",
      "Feedback that sits unprocessed tends to coagulate into a single undifferentiated complaint.",
    ],
    synonyms: ["solidify", "congeal", "thicken"],
    tier: 4,
  },
  {
    word: "desiccate",
    definition: "Remove moisture from; cause to become dry and lifeless",
    examples: [
      "Over-process can desiccate creativity just as surely as under-investment does.",
      "The post-acquisition culture desiccated quickly once the original founders left.",
    ],
    synonyms: ["dry out", "dehydrate", "parch"],
    tier: 4,
  },
  {
    word: "viscous",
    definition: "Having a thick, sticky consistency; resistant to flow",
    examples: [
      "The approval process had become viscous — simple decisions took weeks.",
      "Data pipelines that are too tightly coupled become viscous and hard to change.",
    ],
    synonyms: ["thick", "sluggish", "resistant"],
    tier: 3,
  },
  {
    word: "porous",
    definition: "Having tiny holes; not strict or secure; open to influence",
    examples: [
      "The security boundary was porous — too many exceptions had been granted over time.",
      "A porous organization absorbs external ideas more readily than a rigid one.",
    ],
    synonyms: ["permeable", "penetrable", "open"],
    tier: 2,
  },

  // ─── Tier 1: Provision & provision-related ──────────────────────────

  {
    word: "provision",
    definition: "The action of supplying something; a clause in a legal document",
    examples: [
      "The contract includes a provision for early termination with sixty days' notice.",
      "Provision of adequate resources is the leader's first responsibility.",
    ],
    synonyms: ["supply", "clause", "arrangement"],
    tier: 1,
  },

  // ─── Tier 1: Agreement / disagreement ──────────────────────────────

  {
    word: "assent",
    definition: "Express agreement or approval; consent to something",
    examples: [
      "She nodded in assent when the proposal was read aloud.",
      "The board gave its assent to the revised budget without objection.",
    ],
    synonyms: ["agreement", "consent", "approval"],
    tier: 3,
  },
  {
    word: "concession",
    definition: "A thing that is granted, especially in response to demands; an acknowledgment of defeat",
    examples: [
      "Making a concession on the timeline bought goodwill with the client.",
      "His concession that the original approach was flawed opened the door to real progress.",
    ],
    synonyms: ["compromise", "acknowledgment", "yielding"],
    tier: 2,
  },
  {
    word: "accede",
    definition: "Agree to a demand, request, or treaty; take up an office or position",
    examples: [
      "The team finally acceded to the client's request for weekly status reports.",
      "After much debate, the manager acceded to the engineer's architectural recommendation.",
    ],
    synonyms: ["agree", "consent", "comply"],
    tier: 3,
  },
  {
    word: "placate",
    definition: "Make someone less angry or hostile; appease or pacify",
    examples: [
      "A short memo was sent to placate the stakeholders frustrated by the delay.",
      "Offering an extra sprint to fix bugs helped placate the client's concerns.",
    ],
    synonyms: ["appease", "mollify", "pacify"],
    tier: 3,
  },
  {
    word: "rebuke",
    definition: "Express sharp disapproval or criticism of someone; a sharp reprimand",
    examples: [
      "The manager delivered a firm rebuke after the team skipped the code review step.",
      "She accepted the rebuke gracefully and committed to improving her process.",
    ],
    synonyms: ["reprimand", "censure", "admonish"],
    tier: 3,
  },
  {
    word: "upbraid",
    definition: "Find fault with or scold someone angrily; reproach sharply",
    examples: [
      "He upbraided the vendor publicly for missing three consecutive deadlines.",
      "She was upbraided for submitting the report without legal review.",
    ],
    synonyms: ["scold", "rebuke", "reprimand"],
    tier: 4,
  },
  {
    word: "dispute",
    definition: "Argue about something; question the truth or validity of a claim",
    examples: [
      "The two teams fell into a dispute over who owned the shared authentication service.",
      "She disputed the claim that the performance regression was introduced by her changes.",
    ],
    synonyms: ["contest", "challenge", "argue"],
    tier: 1,
  },
  {
    word: "wrangle",
    definition: "Have a long, complicated dispute or argument; argue about something",
    examples: [
      "The teams wrangled over the API design for two weeks before reaching alignment.",
      "Wrangling over priorities at every sprint planning meeting signals a process problem.",
    ],
    synonyms: ["argue", "dispute", "quarrel"],
    tier: 3,
  },
  {
    word: "quibble",
    definition: "Argue or raise objections about a trivial matter; a minor objection",
    examples: [
      "Instead of quibbling over variable names, focus on the architecture first.",
      "His only quibble with the proposal was the font choice on the slides.",
    ],
    synonyms: ["nitpick", "cavil", "object"],
    tier: 3,
  },

  // ─── Tier 1: Processes / systems ────────────────────────────────────

  {
    word: "methodology",
    definition: "A system of methods used in a particular area of study or activity",
    examples: [
      "The team adopted an agile methodology after struggling with waterfall planning.",
      "The research methodology was rigorous enough to withstand peer review.",
    ],
    synonyms: ["approach", "framework", "system"],
    tier: 2,
  },
  {
    word: "systemic",
    definition: "Relating to a system as a whole; fundamental and widespread rather than isolated",
    examples: [
      "The recurring outages point to a systemic problem in the release process.",
      "Addressing bias requires systemic change, not individual training alone.",
    ],
    synonyms: ["structural", "fundamental", "pervasive"],
    tier: 2,
  },
  {
    word: "deployment",
    definition: "The act of moving resources into position for action; the release of software to production",
    examples: [
      "Each deployment is automatically tested before it reaches the production environment.",
      "The deployment of new staff across three regional offices took six months.",
    ],
    synonyms: ["release", "rollout", "launch"],
    tier: 1,
  },
  {
    word: "conduit",
    definition: "A channel or means of transmitting or distributing something; a pipe for water or cables",
    examples: [
      "She served as a conduit between the executive team and the engineering department.",
      "The newsletter became a key conduit for sharing knowledge across distributed teams.",
    ],
    synonyms: ["channel", "pipeline", "medium"],
    tier: 2,
  },
  {
    word: "hierarchy",
    definition: "A system in which items are ranked according to relative importance or authority",
    examples: [
      "The flat hierarchy encouraged everyone to speak directly with the founders.",
      "Understanding the decision-making hierarchy saves time when escalating issues.",
    ],
    synonyms: ["structure", "ranking", "order"],
    tier: 2,
  },
  {
    word: "framework",
    definition: "A basic structure underlying a system or concept; a set of guiding principles",
    examples: [
      "The team adopted a new prioritization framework to cut down decision fatigue.",
      "Without a clear framework, every edge case becomes a debate.",
    ],
    synonyms: ["structure", "system", "model"],
    tier: 1,
  },
  {
    word: "sequence",
    definition: "A particular order in which related events follow each other; a series",
    examples: [
      "The deployment follows a fixed sequence: build, test, stage, then release.",
      "Breaking the onboarding into a clear sequence reduced new-hire confusion significantly.",
    ],
    synonyms: ["order", "series", "progression"],
    tier: 1,
  },
  {
    word: "optimization",
    definition: "The action of making the best or most effective use of a situation or resource",
    examples: [
      "The database optimization reduced query time from two seconds to fifty milliseconds.",
      "Premature optimization is one of the most common sources of wasted engineering effort.",
    ],
    synonyms: ["improvement", "refinement", "tuning"],
    tier: 2,
  },
  {
    word: "configuration",
    definition: "An arrangement of parts or elements in a particular form; settings for a system",
    examples: [
      "A small misconfiguration in the firewall rules caused the entire outage.",
      "The build configuration should be version-controlled alongside the application code.",
    ],
    synonyms: ["setup", "arrangement", "settings"],
    tier: 1,
  },

  // ─── Tier 1: Financial / economic ───────────────────────────────────

  {
    word: "commodity",
    definition: "A raw material or primary product that can be bought and sold; something common and undifferentiated",
    examples: [
      "When software becomes a commodity, price becomes the only differentiator.",
      "Oil remains the world's most strategically important commodity.",
    ],
    synonyms: ["product", "good", "raw material"],
    tier: 1,
  },
  {
    word: "fiscal",
    definition: "Relating to government revenue and public funds; of or relating to financial matters",
    examples: [
      "The fiscal year ends in December, so all budget requests must be submitted by October.",
      "Fiscal discipline during growth prevents the cash crises that kill scaling companies.",
    ],
    synonyms: ["financial", "budgetary", "economic"],
    tier: 1,
  },
  {
    word: "monetary",
    definition: "Relating to money or currency; of or relating to the supply of money",
    examples: [
      "The monetary value of the deal was less important than the strategic partnership it created.",
      "Tight monetary policy raises borrowing costs across the entire economy.",
    ],
    synonyms: ["financial", "pecuniary", "economic"],
    tier: 1,
  },
  {
    word: "expenditure",
    definition: "The action of spending funds; the total amount of money spent",
    examples: [
      "Total expenditure on infrastructure exceeded the original budget by thirty percent.",
      "Capital expenditure decisions require board-level approval above a certain threshold.",
    ],
    synonyms: ["spending", "outlay", "cost"],
    tier: 2,
  },
  {
    word: "revenue",
    definition: "Income generated from normal business operations; total income before deductions",
    examples: [
      "Annual recurring revenue is the metric investors watch most closely at this stage.",
      "The new pricing tier added significant revenue without proportional cost increase.",
    ],
    synonyms: ["income", "earnings", "receipts"],
    tier: 1,
  },
  {
    word: "asset",
    definition: "A resource with economic value owned by an organization; a useful or valuable thing",
    examples: [
      "The proprietary dataset is the company's most valuable asset.",
      "Her institutional knowledge is an asset that cannot easily be replaced.",
    ],
    synonyms: ["resource", "advantage", "holding"],
    tier: 1,
  },
  {
    word: "liability",
    definition: "A thing for which someone is responsible, especially a debt; something that puts one at a disadvantage",
    examples: [
      "Unresolved technical debt is both a business liability and a delivery bottleneck.",
      "The aging infrastructure is a liability that will need to be addressed before the IPO.",
    ],
    synonyms: ["obligation", "debt", "disadvantage"],
    tier: 1,
  },
  {
    word: "inflation",
    definition: "A general increase in prices and fall in purchasing value of money; an expansion beyond normal size",
    examples: [
      "Rising inflation forced the team to revisit salary bands that had not been updated in years.",
      "Scope inflation is what happens when no one is willing to say no to new requirements.",
    ],
    synonyms: ["price rise", "escalation", "increase"],
    tier: 1,
  },
  {
    word: "equity",
    definition: "The quality of being fair; ownership interest in a company; net value after deducting liabilities",
    examples: [
      "Early employees received equity as compensation for taking on the risk of joining at seed stage.",
      "Equity in outcome requires more than equal treatment — it requires addressing systemic barriers.",
    ],
    synonyms: ["fairness", "ownership", "shares"],
    tier: 1,
  },
  {
    word: "deficit",
    definition: "The amount by which something falls short; an excess of expenditure over revenue",
    examples: [
      "The project ran a skills deficit that required three months of external training to close.",
      "Running a deficit in the early years is acceptable if growth justifies the investment.",
    ],
    synonyms: ["shortfall", "gap", "shortage"],
    tier: 1,
  },
  {
    word: "appreciation",
    definition: "An increase in the value of an asset over time; recognition of quality or value",
    examples: [
      "Property appreciation in the city made the company's real estate holdings highly valuable.",
      "Currency appreciation can erode the revenue earned in foreign markets.",
    ],
    synonyms: ["increase", "growth", "rise"],
    tier: 1,
  },
  {
    word: "depreciation",
    definition: "A reduction in the value of an asset over time; an accounting deduction for wear",
    examples: [
      "The equipment depreciation schedule affects the company's reported profit each quarter.",
      "Software assets are often depreciated over three to five years for accounting purposes.",
    ],
    synonyms: ["devaluation", "decline", "write-down"],
    tier: 2,
  },

  // ─── Tier 1: Risk / probability / outcomes ───────────────────────────

  {
    word: "viable",
    definition: "Capable of working successfully; feasible and practical",
    examples: [
      "The only viable solution given the constraints was to migrate incrementally.",
      "Before committing resources, we need to establish that the model is commercially viable.",
    ],
    synonyms: ["feasible", "workable", "practical"],
    tier: 1,
  },
  {
    word: "imminent",
    definition: "About to happen very soon; impending",
    examples: [
      "With the deadline imminent, the team moved to a daily release cycle.",
      "The imminent arrival of a major competitor focused the product roadmap considerably.",
    ],
    synonyms: ["impending", "approaching", "forthcoming"],
    tier: 2,
  },
  {
    word: "repercussion",
    definition: "An unintended consequence of an event or action, especially an unwelcome one",
    examples: [
      "The policy change had repercussions across teams that no one had anticipated.",
      "Every architectural decision has repercussions that last years, not just sprints.",
    ],
    synonyms: ["consequence", "aftereffect", "ramification"],
    tier: 4,
  },
  {
    word: "precaution",
    definition: "A measure taken in advance to prevent something dangerous or undesirable",
    examples: [
      "As a precaution, the team rolled back the deployment before investigating the spike.",
      "Basic security precautions can prevent the majority of common attack vectors.",
    ],
    synonyms: ["safeguard", "measure", "provision"],
    tier: 2,
  },
  {
    word: "contingency",
    definition: "A future event or circumstance that is possible but cannot be certain; a plan for such an event",
    examples: [
      "The project plan included a two-week contingency buffer for unforeseen blockers.",
      "Every critical system should have a contingency in case the primary path fails.",
    ],
    synonyms: ["backup", "fallback", "provision"],
    tier: 2,
  },
  {
    word: "scenario",
    definition: "A postulated sequence of events; a setting or situation in which something occurs",
    examples: [
      "In the worst-case scenario, we lose two weeks and need to cut one feature.",
      "War-gaming different scenarios helped the team prepare for the launch.",
    ],
    synonyms: ["situation", "case", "possibility"],
    tier: 1,
  },
  {
    word: "upshot",
    definition: "The final or eventual outcome or conclusion of a sequence of events",
    examples: [
      "The upshot of three rounds of review was that the proposal was approved with minor changes.",
      "The upshot of ignoring the warning signs was a complete system failure at peak traffic.",
    ],
    synonyms: ["outcome", "result", "consequence"],
    tier: 3,
  },
  {
    word: "likelihood",
    definition: "The probability of something happening; the state of being likely",
    examples: [
      "The likelihood of success increases significantly with early user validation.",
      "There is a high likelihood that the bug will recur without a deeper architectural fix.",
    ],
    synonyms: ["probability", "chance", "prospect"],
    tier: 1,
  },
  {
    word: "potential",
    definition: "Having or showing the capacity to develop into something in the future; latent ability",
    examples: [
      "The platform has enormous potential once the user acquisition problem is solved.",
      "She recognized the potential in the junior engineer long before anyone else did.",
    ],
    synonyms: ["capacity", "promise", "possibility"],
    tier: 1,
  },

  // ─── Tier 1: Sophisticated adverbs ──────────────────────────────────

  {
    word: "exceedingly",
    definition: "To a very great degree; extremely",
    examples: [
      "The task proved exceedingly difficult once the team understood its true scope.",
      "She was exceedingly careful about committing to deadlines without full information.",
    ],
    synonyms: ["extremely", "exceptionally", "vastly"],
    tier: 2,
  },
  {
    word: "strikingly",
    definition: "In a way that attracts attention through being noticeably different or impressive",
    examples: [
      "The two implementations are strikingly similar despite being built independently.",
      "Her presentation was strikingly concise for a topic of that complexity.",
    ],
    synonyms: ["notably", "remarkably", "conspicuously"],
    tier: 3,
  },
  {
    word: "invariably",
    definition: "In every case or on every occasion; always",
    examples: [
      "Rushed deployments invariably introduce the bugs that careful ones prevent.",
      "She invariably arrived prepared, with data to support every recommendation.",
    ],
    synonyms: ["always", "consistently", "unfailingly"],
    tier: 2,
  },
  {
    word: "predominantly",
    definition: "Mainly; for the most part; as the strongest or main element",
    examples: [
      "The codebase is predominantly written in TypeScript, with some legacy Python modules.",
      "The team is predominantly senior, which speeds up onboarding for new hires.",
    ],
    synonyms: ["mainly", "primarily", "largely"],
    tier: 2,
  },
  {
    word: "markedly",
    definition: "In a clearly noticeable manner; to a significant degree",
    examples: [
      "Response times improved markedly after the caching layer was introduced.",
      "Her communication style shifted markedly once she moved into a leadership role.",
    ],
    synonyms: ["noticeably", "significantly", "considerably"],
    tier: 2,
  },
  {
    word: "solely",
    definition: "Not involving anyone or anything else; only",
    examples: [
      "The decision to migrate was made solely on the basis of long-term cost projections.",
      "She is solely responsible for the client relationship on this account.",
    ],
    synonyms: ["only", "exclusively", "entirely"],
    tier: 1,
  },
  {
    word: "arguably",
    definition: "It may be argued or asserted; used when making a claim that could be disputed",
    examples: [
      "This is arguably the most important architectural decision we will make this year.",
      "She is arguably the most technically capable engineer on the team.",
    ],
    synonyms: ["possibly", "plausibly", "conceivably"],
    tier: 1,
  },
  {
    word: "inherently",
    definition: "In a permanent, essential, or characteristic way; by its very nature",
    examples: [
      "Distributed systems are inherently more complex than monolithic ones.",
      "The approach is inherently scalable because it adds no shared state.",
    ],
    synonyms: ["intrinsically", "fundamentally", "naturally"],
    tier: 2,
  },
  {
    word: "conspicuously",
    definition: "In a way that stands out and is clearly visible; noticeably",
    examples: [
      "The bug was conspicuously absent from the release notes, raising questions.",
      "She was conspicuously quiet during the debate, which everyone noticed.",
    ],
    synonyms: ["noticeably", "obviously", "prominently"],
    tier: 3,
  },
  {
    word: "exhaustively",
    definition: "In a thorough and comprehensive manner; covering all cases",
    examples: [
      "The QA team exhaustively tested every edge case before the release.",
      "She exhaustively documented the migration steps so nothing was left to chance.",
    ],
    synonyms: ["thoroughly", "comprehensively", "completely"],
    tier: 4,
  },

  // ─── Tier 2: More specialized ────────────────────────────────────────

  {
    word: "synthesis",
    definition: "The combination of ideas, elements, or substances to form a connected whole",
    examples: [
      "Her report was a synthesis of findings from ten independent research teams.",
      "Good strategy is a synthesis of market insight, capability assessment, and timing.",
    ],
    synonyms: ["combination", "integration", "fusion"],
    tier: 2,
  },
  {
    word: "modality",
    definition: "A particular mode in which something exists, is experienced, or is expressed",
    examples: [
      "The interface supports multiple input modalities, including voice, touch, and keyboard.",
      "Understanding the modality of a user's context changes what an ideal response looks like.",
    ],
    synonyms: ["mode", "form", "channel"],
    tier: 3,
  },
  {
    word: "canon",
    definition: "A general law or principle; a collection of works considered authentic or authoritative",
    examples: [
      "Clean Architecture has become part of the software engineering canon.",
      "The new framework challenged the canonical assumptions that the field had relied on for years.",
    ],
    synonyms: ["standard", "doctrine", "body of work"],
    tier: 1,
  },
  {
    word: "matrix",
    definition: "An environment or structure in which something develops; a rectangular array of quantities",
    examples: [
      "The prioritization matrix weighed impact against effort across all proposed features.",
      "She mapped the stakeholder relationships in a matrix to identify influence and interest.",
    ],
    synonyms: ["grid", "framework", "array"],
    tier: 1,
  },
  {
    word: "algorithm",
    definition: "A process or set of rules to be followed in calculations or problem-solving; a step-by-step procedure",
    examples: [
      "The recommendation algorithm was updated to reduce recency bias in results.",
      "Understanding the underlying algorithm helps you predict where it will fail.",
    ],
    synonyms: ["procedure", "method", "process"],
    tier: 1,
  },
  {
    word: "liquidity",
    definition: "The availability of liquid assets to a market or company; ease of converting assets to cash",
    examples: [
      "Cash flow problems are really liquidity problems — the company may be profitable but illiquid.",
      "Investors prefer markets with high liquidity because positions can be exited quickly.",
    ],
    synonyms: ["cash flow", "convertibility", "fluidity"],
    tier: 2,
  },
  {
    word: "stochastic",
    definition: "Randomly determined; having a probability distribution and therefore not predictable exactly",
    examples: [
      "The model uses stochastic gradient descent to optimize across millions of parameters.",
      "Traffic patterns are stochastic — even the best load test cannot capture every real-world scenario.",
    ],
    synonyms: ["random", "probabilistic", "unpredictable"],
    tier: 3,
  },
  {
    word: "probabilistic",
    definition: "Based on or adapted to a theory of probability; involving chance",
    examples: [
      "The classifier gives probabilistic outputs rather than hard true-or-false labels.",
      "A probabilistic approach to risk assessment is more honest than a binary safe-or-unsafe framing.",
    ],
    synonyms: ["statistical", "stochastic", "likelihood-based"],
    tier: 3,
  },
  {
    word: "speculative",
    definition: "Engaged in or based on conjecture rather than knowledge; involving financial speculation",
    examples: [
      "The roadmap items beyond Q3 are speculative and subject to reprioritization.",
      "Speculative investments carry higher risk but also higher potential return.",
    ],
    synonyms: ["theoretical", "conjectural", "risky"],
    tier: 2,
  },
  {
    word: "adventitious",
    definition: "Coming from an external or unexpected source; arising spontaneously rather than by design",
    examples: [
      "The discovery was adventitious — the team was looking for one bug and found another.",
      "Adventitious learning happens when curious engineers explore systems beyond their own domain.",
    ],
    synonyms: ["incidental", "accidental", "extraneous"],
    tier: 4,
  },

  // ─── Tier 3: Power words ─────────────────────────────────────────────

  {
    word: "propitiate",
    definition: "Win or regain the favor of someone by doing something to please them; appease",
    examples: [
      "The executive team struggled to propitiate investors after the missed earnings quarter.",
      "Offering a formal apology was the only way to propitiate the client after the data loss.",
    ],
    synonyms: ["appease", "placate", "conciliate"],
    tier: 4,
  },
  {
    word: "reprobation",
    definition: "Strong condemnation; the state of being condemned or disapproved of severely",
    examples: [
      "The security breach drew widespread reprobation from customers and regulators alike.",
      "Her public reprobation of the decision was unusually direct for someone in her position.",
    ],
    synonyms: ["condemnation", "censure", "disapproval"],
    tier: 4,
  },
  {
    word: "interdict",
    definition: "Prohibit or forbid something; an authoritative prohibition",
    examples: [
      "The legal team moved to interdict the use of the disputed dataset pending the outcome of court proceedings.",
      "The new policy effectively interdicts the practice of deploying on Fridays.",
    ],
    synonyms: ["prohibit", "forbid", "ban"],
    tier: 4,
  },
  {
    word: "inescapable",
    definition: "Unable to be avoided or denied; unavoidable",
    examples: [
      "The inescapable conclusion from the data is that the current model is unsustainable.",
      "Technical debt is an inescapable reality of shipping under real-world constraints.",
    ],
    synonyms: ["unavoidable", "inevitable", "undeniable"],
    tier: 3,
  },
  // --- Manufacturing / Industrial / Trades ---
  // Equipment & Failure Precision
  {
    word: "defective",
    definition: "Having a fault or flaw that prevents proper function; not meeting required standards",
    examples: [
      "Three defective units were pulled from the line before the batch shipped.",
      "The quality inspector flagged the defective seal as the likely cause of the leak.",
    ],
    synonyms: ["faulty", "flawed", "substandard"],
    tier: 2,
  },
  {
    word: "intermittent",
    definition: "Occurring at irregular intervals; stopping and starting unpredictably",
    examples: [
      "The intermittent alarm on press #4 has been harder to diagnose than a constant fault.",
      "An intermittent power drop was causing random shutdowns on the conveyor motor.",
    ],
    synonyms: ["sporadic", "irregular", "on-and-off"],
    tier: 2,
  },
  {
    word: "calibrate",
    definition: "To adjust or standardize a measuring instrument or machine to ensure accurate readings",
    examples: [
      "You need to calibrate the torque wrench at the start of every shift.",
      "The technician calibrated the load cells after the sensor replacement.",
    ],
    synonyms: ["adjust", "tune", "standardize"],
    tier: 3,
  },
  {
    word: "diagnose",
    definition: "To identify the cause of a fault or problem through systematic investigation",
    examples: [
      "It took the maintenance team two hours to diagnose the root cause of the conveyor jam.",
      "You can't fix what you can't diagnose — start by pulling the error codes.",
    ],
    synonyms: ["identify", "pinpoint", "troubleshoot"],
    tier: 2,
  },
  {
    word: "rectify",
    definition: "To correct or fix a fault, error, or problem",
    examples: [
      "The supervisor asked the technician to rectify the misalignment before resuming production.",
      "We have 24 hours to rectify the nonconformance before the customer audit.",
    ],
    synonyms: ["correct", "fix", "resolve"],
    tier: 3,
  },
  {
    word: "refurbish",
    definition: "To restore a piece of equipment to good working condition through repair and cleaning",
    examples: [
      "Rather than buying new, we decided to refurbish the old hydraulic press.",
      "The refurbished palletizer ran as well as new equipment at a fraction of the cost.",
    ],
    synonyms: ["restore", "recondition", "overhaul"],
    tier: 3,
  },
  {
    word: "decommission",
    definition: "To officially take a machine or system out of service",
    examples: [
      "We plan to decommission the old injection molder once the replacement is qualified.",
      "Before you decommission any equipment, make sure all energy sources are locked out.",
    ],
    synonyms: ["retire", "withdraw", "shut down"],
    tier: 4,
  },
  {
    word: "overhaul",
    definition: "A thorough inspection and repair of a machine to restore it to full working order",
    examples: [
      "The pump was due for a full overhaul after 10,000 hours of operation.",
      "We scheduled the overhaul during the planned plant shutdown in July.",
    ],
    synonyms: ["rebuild", "refurbish", "reconditioning"],
    tier: 2,
  },
  {
    word: "retrofit",
    definition: "To add new components or technology to existing equipment that was not originally equipped with it",
    examples: [
      "We decided to retrofit the older lathes with digital readouts instead of replacing them.",
      "The safety upgrade required us to retrofit guards on all legacy machines on the floor.",
    ],
    synonyms: ["upgrade", "modify", "update"],
    tier: 3,
  },
  {
    word: "malfunction",
    definition: "A failure of a machine or system to operate correctly",
    examples: [
      "A malfunction in the cooling system caused the line to shut down for three hours.",
      "Document every malfunction in the maintenance log so we can spot patterns.",
    ],
    synonyms: ["failure", "fault", "breakdown"],
    tier: 2,
  },
  // Process & Quality
  {
    word: "standardize",
    definition: "To establish a consistent method, specification, or procedure across operations",
    examples: [
      "We need to standardize the changeover process so every shift runs it the same way.",
      "The quality manager wants to standardize the inspection checklist across all three lines.",
    ],
    synonyms: ["normalize", "unify", "regulate"],
    tier: 3,
  },
  {
    word: "streamline",
    definition: "To simplify or eliminate unnecessary steps in a process to make it more efficient",
    examples: [
      "The lean team was brought in to streamline the receiving dock workflow.",
      "Streamlining the approval process cut our order turnaround from five days to two.",
    ],
    synonyms: ["simplify", "optimize", "rationalize"],
    tier: 3,
  },
  {
    word: "benchmark",
    definition: "A standard or reference point used to measure or compare performance",
    examples: [
      "Our cycle time benchmark is 45 seconds per unit — anything above that triggers a review.",
      "We benchmarked our scrap rate against industry standards before setting improvement targets.",
    ],
    synonyms: ["standard", "reference point", "baseline"],
    tier: 2,
  },
  {
    word: "audit",
    definition: "A systematic inspection or review of a process, product, or system to verify compliance and quality",
    examples: [
      "The ISO audit is next month, so make sure your records are up to date.",
      "We conduct an internal audit every quarter to catch issues before the customer visit.",
    ],
    synonyms: ["inspection", "review", "assessment"],
    tier: 1,
  },
  {
    word: "compliance",
    definition: "Conforming to required rules, regulations, standards, or specifications",
    examples: [
      "Environmental compliance is non-negotiable — any violation carries serious penalties.",
      "The new operator needs to complete safety training to stay in compliance with OSHA standards.",
    ],
    synonyms: ["adherence", "conformance", "observance"],
    tier: 1,
  },
  {
    word: "throughput",
    definition: "The amount of product or work processed in a given period of time",
    examples: [
      "We increased throughput by 15% after eliminating the manual staging step.",
      "Track throughput by shift so we can see where the output drops off.",
    ],
    synonyms: ["output", "production rate", "capacity"],
    tier: 3,
  },
  {
    word: "downtime",
    definition: "Time during which a machine or production line is not operating",
    examples: [
      "Unplanned downtime cost us four hours of production on the night shift.",
      "Preventive maintenance is scheduled during planned downtime to avoid surprises.",
    ],
    synonyms: ["outage", "stoppage", "idle time"],
    tier: 2,
  },
  {
    word: "bottleneck",
    definition: "A point in a process where flow is restricted and work accumulates, slowing overall output",
    examples: [
      "The packaging station is the bottleneck — everything upstream feeds faster than it can keep up.",
      "Fixing the bottleneck at welding would free up capacity across the entire line.",
    ],
    synonyms: ["constraint", "choke point", "limiting factor"],
    tier: 3,
  },
  {
    word: "yield",
    definition: "The proportion of good output produced compared to total input; the efficiency of a process",
    examples: [
      "Our first-pass yield dropped to 88% after the die change — we need to find out why.",
      "Improving yield by even 2% would save thousands of dollars in scrap costs monthly.",
    ],
    synonyms: ["output rate", "efficiency", "pass rate"],
    tier: 1,
  },
  {
    word: "tolerance",
    definition: "The allowable range of variation in a measurement or dimension for a part to still be acceptable",
    examples: [
      "The tolerance on that shaft is plus or minus 0.002 inches — anything outside that is scrap.",
      "Tight tolerances require more precise tooling and slower feed rates.",
    ],
    synonyms: ["allowance", "variance", "specification range"],
    tier: 1,
  },
  // Supervision & Leadership
  {
    word: "delegate",
    definition: "To assign a task or responsibility to another person, typically a subordinate",
    examples: [
      "A good supervisor knows what to delegate and what to handle personally.",
      "She delegated the shift handoff report to her lead so she could focus on the line issue.",
    ],
    synonyms: ["assign", "entrust", "hand off"],
    tier: 2,
  },
  {
    word: "mentor",
    definition: "To guide and support a less experienced person through advice, knowledge, and example",
    examples: [
      "He agreed to mentor the new hire through the first 90 days on the floor.",
      "Pairing senior machinists with new employees is the best way to mentor technical skills.",
    ],
    synonyms: ["coach", "guide", "develop"],
    tier: 1,
  },
  {
    word: "onboard",
    definition: "To integrate a new employee into the organization through training and orientation",
    examples: [
      "We need a consistent process to onboard every new hire so nothing gets missed.",
      "It takes about two weeks to fully onboard someone on the assembly line.",
    ],
    synonyms: ["orient", "integrate", "train"],
    tier: 2,
  },
  {
    word: "reprimand",
    definition: "To formally rebuke or criticize an employee for a rule violation or performance issue",
    examples: [
      "The supervisor had to reprimand the technician for bypassing the lockout procedure.",
      "A written reprimand was issued after the third tardiness incident.",
    ],
    synonyms: ["rebuke", "discipline", "censure"],
    tier: 3,
  },
  {
    word: "commend",
    definition: "To formally praise or recommend someone for good work or exemplary behavior",
    examples: [
      "The plant manager took time to commend the team for achieving zero defects for the month.",
      "I want to commend the maintenance crew for turning that repair around so quickly.",
    ],
    synonyms: ["praise", "recognize", "acknowledge"],
    tier: 2,
  },
  {
    word: "accountability",
    definition: "The obligation to accept responsibility for one's actions and the outcomes of one's work",
    examples: [
      "Accountability on the shop floor starts with supervisors owning their shift numbers.",
      "When there's no clear accountability, problems get ignored and mistakes repeat.",
    ],
    synonyms: ["responsibility", "ownership", "answerability"],
    tier: 1,
  },
  {
    word: "competency",
    definition: "A defined skill or ability required to perform a job effectively",
    examples: [
      "Operating the CNC lathe is a core competency for any machinist on this line.",
      "The skills matrix tracks each operator's competency level for every station.",
    ],
    synonyms: ["skill", "capability", "proficiency"],
    tier: 2,
  },
  {
    word: "proficiency",
    definition: "A high degree of skill or expertise in a particular area",
    examples: [
      "She reached full proficiency on the welding station after six weeks of practice.",
      "We expect proficiency in forklift operation before any associate works in the warehouse.",
    ],
    synonyms: ["expertise", "mastery", "competence"],
    tier: 2,
  },
  {
    word: "cross-train",
    definition: "To train an employee to perform tasks or roles outside their primary function",
    examples: [
      "We cross-train every operator on at least two stations to reduce single-point dependencies.",
      "Cross-training the team helped us cover absences without bringing in temporary workers.",
    ],
    synonyms: ["multi-skill", "rotate", "broaden"],
    tier: 1,
  },
  {
    word: "troubleshoot",
    definition: "To systematically identify and resolve problems in a machine, process, or system",
    examples: [
      "Call maintenance if you can't troubleshoot the fault within 10 minutes.",
      "Good operators can troubleshoot minor issues without stopping the line.",
    ],
    synonyms: ["diagnose", "debug", "resolve"],
    tier: 3,
  },
  // Continuous Improvement
  {
    word: "optimize",
    definition: "To adjust a process or system to achieve the best possible performance or efficiency",
    examples: [
      "We brought in an engineer to optimize the cutting parameters and reduce cycle time.",
      "The goal of the kaizen event was to optimize flow through the assembly cell.",
    ],
    synonyms: ["improve", "fine-tune", "maximize"],
    tier: 2,
  },
  {
    word: "root-cause",
    definition: "The fundamental underlying reason for a problem, as opposed to its symptoms",
    examples: [
      "We won't stop the failures until we identify the root-cause and fix it permanently.",
      "The 5-Why analysis pointed to operator training as the root-cause of the defect.",
    ],
    synonyms: ["underlying cause", "source", "origin"],
    tier: 1,
  },
  {
    word: "preventive",
    definition: "Designed to stop a problem from occurring before it happens",
    examples: [
      "Preventive maintenance on the compressor is scheduled every 500 hours.",
      "A preventive approach to safety means fixing hazards before someone gets hurt.",
    ],
    synonyms: ["proactive", "precautionary", "anticipatory"],
    tier: 2,
  },
  {
    word: "corrective",
    definition: "Intended to fix a problem or deviation that has already occurred",
    examples: [
      "A corrective action report is required any time a product escapes inspection.",
      "The corrective maintenance took the line down for four hours but solved the problem.",
    ],
    synonyms: ["remedial", "restorative", "reactive"],
    tier: 2,
  },
  {
    word: "proactive",
    definition: "Acting in anticipation of future problems rather than reacting after they occur",
    examples: [
      "Being proactive about equipment wear means you plan repairs before breakdowns happen.",
      "The proactive safety walk caught two hazards before the morning shift started.",
    ],
    synonyms: ["anticipatory", "forward-thinking", "preventive"],
    tier: 2,
  },
  {
    word: "reactive",
    definition: "Responding to problems or events after they have already occurred",
    examples: [
      "A purely reactive maintenance strategy leads to higher costs and more unplanned downtime.",
      "We were too reactive last quarter — this year we're focusing on prevention.",
    ],
    synonyms: ["responsive", "remedial", "after-the-fact"],
    tier: 2,
  },
  {
    word: "sustainable",
    definition: "Able to be maintained consistently over the long term without depleting resources or causing harm",
    examples: [
      "The new process needs to be sustainable — not just a quick fix that breaks down in a month.",
      "Sustainable improvement requires training, documentation, and follow-through.",
    ],
    synonyms: ["lasting", "maintainable", "viable"],
    tier: 1,
  },
  {
    word: "scalable",
    definition: "Capable of being expanded or adapted to handle increased demand or scope",
    examples: [
      "Before we roll this out plant-wide, we need to confirm the solution is scalable.",
      "A scalable process works whether you're running one shift or three.",
    ],
    synonyms: ["expandable", "adaptable", "flexible"],
    tier: 3,
  },
  {
    word: "iterative",
    definition: "Based on repeated cycles of testing and improvement, each building on the last",
    examples: [
      "Our continuous improvement program is iterative — small gains every sprint add up over time.",
      "Use an iterative approach when piloting a new process: test, measure, adjust, repeat.",
    ],
    synonyms: ["incremental", "cyclical", "progressive"],
    tier: 3,
  },
];

export const SEED_WORDS: SeedWord[] = [
  ...BASE_SEED_WORDS,
  ...SEED_WORDS_ADDITIONS_1,
  ...SEED_WORDS_ADDITIONS_2,
  ...SEED_WORDS_ADDITIONS_3,
];

