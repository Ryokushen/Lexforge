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
];
