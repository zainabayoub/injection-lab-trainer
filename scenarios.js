const routeGuides = {
  IM: {
    cue: "IM injections go into muscle tissue and commonly use the deltoid, ventrogluteal, or vastus lateralis.",
    angle: "Insert at 90° into the muscle.",
    length: "Typical needle length: 1 to 1.5 inches, depending on patient size.",
    siteMap: "Deltoid • Ventrogluteal • Vastus Lateralis",
    sites: [
      { name: "Deltoid", meta: "Upper arm muscle" },
      { name: "Ventrogluteal", meta: "Hip area" },
      { name: "Vastus Lateralis", meta: "Outer thigh muscle" }
    ],
    icon: "IM"
  },
  SQ: {
    cue: "SQ injections go into fatty tissue, often the back of the upper arm, lower abdomen, or top of thigh.",
    angle: "Usually 45°, or 90° with a short insulin needle.",
    length: "Typical needle length: 3/8 to 5/8 inch.",
    siteMap: "Back of Arm • Lower Abdomen • Top of Thigh",
    sites: [
      { name: "Back of Upper Arm", meta: "Fat tissue" },
      { name: "Lower Abdomen", meta: "2 inches from navel" },
      { name: "Top of Thigh", meta: "Fat tissue" }
    ],
    icon: "SQ"
  },
  ID: {
    cue: "ID injections are very shallow and often used for PPD and skin testing.",
    angle: "Insert at 10° to 15° just under the skin.",
    length: "Typical needle length: 1/4 to 1/2 inch with fine gauge.",
    siteMap: "Forearm • Upper Back",
    sites: [
      { name: "Forearm", meta: "Most common for PPD" },
      { name: "Upper Back", meta: "Common for skin testing" }
    ],
    icon: "ID"
  }
};

const syringeLibrary = [
  { id: "insulin", name: "Insulin Syringe", subtitle: "For U-100 insulin in units", barrel: "short" },
  { id: "tuberculin", name: "1 mL Tuberculin Syringe", subtitle: "For small measured mL volumes", barrel: "medium" },
  { id: "3ml", name: "3 mL Syringe", subtitle: "Common for larger IM volumes", barrel: "long" }
];

const vialPalette = {
  "Dexamethasone": "#a8c7ee",
  "Ketorolac": "#f6cc64",
  "Vitamin B12": "#f48f86",
  "Influenza Vaccine": "#8fc7f0",
  "DTaP Vaccine": "#f4b26b",
  "Ceftriaxone": "#a3d3bd",
  "Haloperidol": "#d8b0f2",
  "Testosterone Cypionate": "#d8c28d",
  "Medroxyprogesterone": "#efb6cf",
  "Promethazine": "#f0d18a",
  "Regular Insulin": "#f19fc0",
  "Insulin Lispro": "#8acbe0",
  "Insulin Glargine": "#c0e59a",
  "Heparin": "#9ca8ef",
  "Enoxaparin": "#9fe0b0",
  "Semaglutide": "#f6b7a8",
  "Tirzepatide": "#d1c2f2",
  "Adalimumab": "#94d9ce",
  "Epoetin Alfa": "#f2b7bf",
  "Filgrastim": "#d9e59f",
  "PPD": "#cfd6dd",
  "Candida Antigen": "#c6b7f1",
  "Dust Mite Antigen": "#f4b6c3",
  "Grass Pollen Antigen": "#b8e0b6",
  "Cat Dander Antigen": "#f0c2a0",
  "Penicillin Test Dose": "#a4d8f0",
  "Lidocaine Test Dose": "#f2d18f",
  "Bee Venom Antigen": "#f7c778",
  "Mold Antigen": "#b4d2a6",
  "Latex Antigen": "#e6b4d8",
  "Cephalosporin Test Dose": "#c2c8f0"
};

const IM_DISTRACTORS = ["Heparin", "PPD", "Regular Insulin", "Enoxaparin", "Candida Antigen"];
const SQ_DISTRACTORS = ["Ketorolac", "Vitamin B12", "PPD", "Dexamethasone", "Ceftriaxone"];
const ID_DISTRACTORS = ["Heparin", "Dexamethasone", "Regular Insulin", "Vitamin B12", "Ketorolac"];

function pickDistractors(correct, pool, count = 3) {
  return pool.filter(name => name !== correct).slice(0, count);
}

function buildExplainCorrect(medication, route, syringeType, note) {
  const syringeName = syringeType === "insulin"
    ? "an insulin syringe"
    : syringeType === "tuberculin"
      ? "a 1 mL tuberculin syringe"
      : "a 3 mL syringe";
  return `${medication} matches the prescription, and ${syringeName} is the best training choice for this ${route} order. ${note}`.trim();
}

function buildExplainWrongSyringe(route, syringeType) {
  if (syringeType === "insulin") {
    return "This order is taught and measured in insulin units, so an insulin syringe is the clearest and safest training choice.";
  }
  if (syringeType === "tuberculin") {
    return `A 1 mL tuberculin syringe is better for accurately measuring the small ${route} volume in this scenario.`;
  }
  return "A 3 mL syringe is the best training choice here because this IM medication is prepared in standard mL volume rather than insulin units.";
}

function buildScenario({
  medication,
  order,
  route,
  strength,
  correctDose,
  syringeType,
  note,
  distractors,
  safetyPrompt,
  safetyOptions,
  safetyAnswer
}) {
  return {
    medication,
    order,
    route,
    strength,
    correctDose,
    syringeType,
    vialColor: vialPalette[medication] || "#cfd6dd",
    vials: [medication, ...pickDistractors(medication, distractors, 3)],
    safetyPrompt,
    safetyOptions,
    safetyAnswer,
    explainCorrect: buildExplainCorrect(medication, route, syringeType, note),
    explainWrongVial: `The prescription is specifically for ${medication}. Choosing a different vial would fail the medication verification step.`,
    explainWrongSyringe: buildExplainWrongSyringe(route, syringeType)
  };
}

const scenarios = [
  // IM 20
  buildScenario({
    medication: "Influenza Vaccine",
    order: "Influenza vaccine 0.5 mL IM",
    route: "IM",
    strength: "0.5 mL single dose",
    correctDose: "0.5 mL",
    syringeType: "3ml",
    note: "Adult IM vaccines are commonly administered in the deltoid.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student plans to administer this SQ. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Influenza Vaccine",
    order: "High-dose influenza vaccine 0.7 mL IM",
    route: "IM",
    strength: "0.7 mL single dose",
    correctDose: "0.7 mL",
    syringeType: "3ml",
    note: "This scenario stays in the IM route and uses a standard mL syringe rather than an insulin syringe.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student draws 7 mL for this order. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong syringe", "Wrong site"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "DTaP Vaccine",
    order: "DTaP vaccine 0.5 mL IM",
    route: "IM",
    strength: "0.5 mL single dose",
    correctDose: "0.5 mL",
    syringeType: "3ml",
    note: "Pediatric IM vaccines are commonly taught in the vastus lateralis site family.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student selects the forearm as the site. What is the main error?",
    safetyOptions: ["Wrong route site", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route site"
  }),
  buildScenario({
    medication: "DTaP Vaccine",
    order: "Catch-up DTaP vaccine 0.5 mL IM",
    route: "IM",
    strength: "0.5 mL single dose",
    correctDose: "0.5 mL",
    syringeType: "3ml",
    note: "The ordered volume is still measured in mL and remains an intramuscular injection.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student labels this as an ID injection. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong patient", "Wrong concentration"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Vitamin B12",
    order: "Cyanocobalamin 1000 mcg IM",
    route: "IM",
    strength: "1000 mcg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    note: "Vitamin B12 is commonly taught as an IM medication in clinical skills labs.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student chooses a tuberculin syringe for this standard IM dose. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong patient", "Wrong vial"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Vitamin B12",
    order: "Cyanocobalamin 500 mcg IM",
    route: "IM",
    strength: "1000 mcg/mL",
    correctDose: "0.5 mL",
    syringeType: "3ml",
    note: "Even at a smaller volume, this remains a standard IM medication order.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student documents the route as SQ. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong dose", "Wrong site", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Ketorolac",
    order: "Ketorolac 30 mg IM",
    route: "IM",
    strength: "30 mg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    note: "Ketorolac is an IM medication and should be prepared in standard mL volume, not insulin units.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student chooses an insulin syringe for this medication. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong site", "Wrong patient"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Ketorolac",
    order: "Ketorolac 15 mg IM",
    route: "IM",
    strength: "30 mg/mL",
    correctDose: "0.5 mL",
    syringeType: "3ml",
    note: "This order still uses an IM route even though the total volume is smaller.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student draws 1.5 mL for this order. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Dexamethasone",
    order: "Dexamethasone 6 mg IM",
    route: "IM",
    strength: "10 mg/mL",
    correctDose: "0.6 mL",
    syringeType: "3ml",
    note: "This steroid order is still measured in mL and remains an IM preparation task.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student selects the lower abdomen as the site. What is the main error?",
    safetyOptions: ["Wrong route site", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route site"
  }),
  buildScenario({
    medication: "Dexamethasone",
    order: "Dexamethasone 4 mg IM",
    route: "IM",
    strength: "10 mg/mL",
    correctDose: "0.4 mL",
    syringeType: "3ml",
    note: "The medication remains IM even when the drawn volume is under 1 mL.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student prepares 4 mL for this order. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong syringe", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Ceftriaxone",
    order: "Ceftriaxone 500 mg IM",
    route: "IM",
    strength: "250 mg/mL",
    correctDose: "2 mL",
    syringeType: "3ml",
    note: "This simulated antibiotic order remains an IM preparation task using a standard syringe.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student records the route as ID. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong dose", "Wrong patient", "Wrong site"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Ceftriaxone",
    order: "Ceftriaxone 250 mg IM",
    route: "IM",
    strength: "250 mg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    note: "This scenario gives dose variation without changing the IM route family.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student chooses the PPD vial for this order. What is the main error?",
    safetyOptions: ["Wrong vial", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong vial"
  }),
  buildScenario({
    medication: "Haloperidol",
    order: "Haloperidol 5 mg IM",
    route: "IM",
    strength: "5 mg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    note: "This antipsychotic scenario remains a standard IM medication preparation question.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student chooses a TB syringe and labels the route SQ. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong patient", "Wrong dose"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Haloperidol",
    order: "Haloperidol 2.5 mg IM",
    route: "IM",
    strength: "5 mg/mL",
    correctDose: "0.5 mL",
    syringeType: "3ml",
    note: "This version changes the dose but keeps the same IM medication family.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student draws 2.5 mL. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong site", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Testosterone Cypionate",
    order: "Testosterone cypionate 200 mg IM",
    route: "IM",
    strength: "200 mg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    note: "Testosterone cypionate is labeled for IM administration.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student prepares this as an SQ injection. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Testosterone Cypionate",
    order: "Testosterone cypionate 100 mg IM",
    route: "IM",
    strength: "200 mg/mL",
    correctDose: "0.5 mL",
    syringeType: "3ml",
    note: "The dose changes, but this remains an IM oil-based medication scenario.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student selects the forearm as the injection site. What is the main error?",
    safetyOptions: ["Wrong route site", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route site"
  }),
  buildScenario({
    medication: "Medroxyprogesterone",
    order: "Medroxyprogesterone acetate 150 mg IM",
    route: "IM",
    strength: "150 mg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    note: "Medroxyprogesterone acetate contraceptive injection is labeled for deep IM administration.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student selects an insulin syringe for this order. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong dose", "Wrong site"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Medroxyprogesterone",
    order: "Medroxyprogesterone acetate 150 mg IM, repeat dose",
    route: "IM",
    strength: "150 mg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    note: "This keeps the same medication but changes the prescription wording for variety.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student pulls from the heparin vial instead. What is the main error?",
    safetyOptions: ["Wrong vial", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong vial"
  }),
  buildScenario({
    medication: "Promethazine",
    order: "Promethazine 25 mg IM",
    route: "IM",
    strength: "25 mg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    note: "This antiemetic scenario gives another standard IM medication with mL-based calculation.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student documents the injection as ID. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong dose", "Wrong syringe", "Wrong site"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Promethazine",
    order: "Promethazine 12.5 mg IM",
    route: "IM",
    strength: "25 mg/mL",
    correctDose: "0.5 mL",
    syringeType: "3ml",
    note: "This lowers the dose while keeping the medication, route, and syringe family stable.",
    distractors: IM_DISTRACTORS,
    safetyPrompt: "A student draws 5 mL for this order. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong site", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  }),

  // SQ 20
  buildScenario({
    medication: "Regular Insulin",
    order: "Regular insulin 6 units SQ",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "6 units",
    syringeType: "insulin",
    note: "U-100 insulin orders are taught in units and are best matched to an insulin syringe.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student draws this to the 16-unit line. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong site", "Wrong needle length"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Regular Insulin",
    order: "Regular insulin 12 units SQ",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "12 units",
    syringeType: "insulin",
    note: "This variation changes the insulin dose but not the syringe family or SQ route.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student uses a 3 mL syringe for this insulin order. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong patient", "Wrong vial"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Insulin Lispro",
    order: "Insulin lispro 8 units SQ before breakfast",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "8 units",
    syringeType: "insulin",
    note: "Rapid-acting insulin remains a unit-based SQ injection scenario.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student documents the route as IM. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong patient", "Wrong site"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Insulin Lispro",
    order: "Insulin lispro 24 units SQ with lunch",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "24 units",
    syringeType: "insulin",
    note: "The larger unit dose still belongs in the insulin syringe pathway.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student chooses the ketorolac vial. What is the main error?",
    safetyOptions: ["Wrong vial", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong vial"
  }),
  buildScenario({
    medication: "Insulin Glargine",
    order: "Insulin glargine 10 units SQ nightly",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "10 units",
    syringeType: "insulin",
    note: "Long-acting insulin remains a unit-based SQ medication in this simulator.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student marks the route as ID. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong patient", "Wrong site"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Insulin Glargine",
    order: "Insulin glargine 20 units SQ nightly",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "20 units",
    syringeType: "insulin",
    note: "This keeps the same medication but provides a second common basal-insulin dose.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student selects a tuberculin syringe instead of an insulin syringe. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong site", "Wrong dose"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Heparin",
    order: "Heparin 5,000 units SQ",
    route: "SQ",
    strength: "5,000 units/mL",
    correctDose: "1 mL",
    syringeType: "tuberculin",
    note: "Heparin is commonly taught as a small-volume SQ injection.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student labels this injection IM. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong patient", "Wrong concentration"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Heparin",
    order: "Heparin 7,500 units SQ",
    route: "SQ",
    strength: "10,000 units/mL",
    correctDose: "0.75 mL",
    syringeType: "tuberculin",
    note: "This version varies both the dose and the concentration while keeping the SQ skill set.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student draws 7.5 mL. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Enoxaparin",
    order: "Enoxaparin 30 mg SQ",
    route: "SQ",
    strength: "100 mg/mL",
    correctDose: "0.3 mL",
    syringeType: "tuberculin",
    note: "Small measured anticoagulant volumes work well as tuberculin-syringe practice.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student chooses a 3 mL syringe for this dose. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong dose", "Wrong site"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Enoxaparin",
    order: "Enoxaparin 40 mg SQ",
    route: "SQ",
    strength: "100 mg/mL",
    correctDose: "0.4 mL",
    syringeType: "tuberculin",
    note: "This keeps the medication the same while changing the dose to expand the bank.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student enters the route as IM. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong site", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Semaglutide",
    order: "Semaglutide 0.25 mg SQ weekly",
    route: "SQ",
    strength: "0.68 mg/mL",
    correctDose: "0.37 mL",
    syringeType: "tuberculin",
    note: "This simulator treats semaglutide as a small-volume SQ dosing exercise.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student documents 3.7 mL as the dose to draw. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong syringe", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Semaglutide",
    order: "Semaglutide 0.5 mg SQ weekly",
    route: "SQ",
    strength: "1.34 mg/mL",
    correctDose: "0.37 mL",
    syringeType: "tuberculin",
    note: "This adds medication repetition with a different labeled strength.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student selects the vitamin B12 vial. What is the main error?",
    safetyOptions: ["Wrong vial", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong vial"
  }),
  buildScenario({
    medication: "Tirzepatide",
    order: "Tirzepatide 2.5 mg SQ weekly",
    route: "SQ",
    strength: "4.17 mg/mL",
    correctDose: "0.6 mL",
    syringeType: "tuberculin",
    note: "This provides another GLP-style SQ scenario with a measured mL answer.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student uses an insulin syringe for this mL-based dose. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong patient", "Wrong concentration"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Tirzepatide",
    order: "Tirzepatide 5 mg SQ weekly",
    route: "SQ",
    strength: "8.33 mg/mL",
    correctDose: "0.6 mL",
    syringeType: "tuberculin",
    note: "The dose and strength both change, but the measured draw remains a small SQ volume.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student marks the route as ID. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong site", "Wrong dose"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Adalimumab",
    order: "Adalimumab 40 mg SQ",
    route: "SQ",
    strength: "40 mg/0.4 mL",
    correctDose: "0.4 mL",
    syringeType: "tuberculin",
    note: "This expands the SQ bank with another biologic-style subcutaneous scenario.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student prepares 4 mL instead of 0.4 mL. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong patient", "Wrong site"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Adalimumab",
    order: "Adalimumab 80 mg SQ",
    route: "SQ",
    strength: "80 mg/0.8 mL",
    correctDose: "0.8 mL",
    syringeType: "tuberculin",
    note: "This version keeps the biologic medication family but increases both dose and volume.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student chooses the dorsogluteal IM site. What is the main error?",
    safetyOptions: ["Wrong route site", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route site"
  }),
  buildScenario({
    medication: "Epoetin Alfa",
    order: "Epoetin alfa 10,000 units SQ",
    route: "SQ",
    strength: "20,000 units/mL",
    correctDose: "0.5 mL",
    syringeType: "tuberculin",
    note: "This adds another unit-based medication that is still drawn in mL rather than insulin units.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student selects a 3 mL syringe and records IM administration. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Epoetin Alfa",
    order: "Epoetin alfa 20,000 units SQ",
    route: "SQ",
    strength: "20,000 units/mL",
    correctDose: "1 mL",
    syringeType: "tuberculin",
    note: "This gives a full-1 mL SQ scenario that still fits the tuberculin syringe pathway.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student chooses the wrong vial and draws from ketorolac. What is the main error?",
    safetyOptions: ["Wrong vial", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong vial"
  }),
  buildScenario({
    medication: "Filgrastim",
    order: "Filgrastim 300 mcg SQ",
    route: "SQ",
    strength: "300 mcg/0.5 mL",
    correctDose: "0.5 mL",
    syringeType: "tuberculin",
    note: "This adds small-volume SQ biologic practice without changing the route family.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student documents the forearm as the selected site. What is the main error?",
    safetyOptions: ["Wrong route site", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route site"
  }),
  buildScenario({
    medication: "Filgrastim",
    order: "Filgrastim 480 mcg SQ",
    route: "SQ",
    strength: "480 mcg/0.8 mL",
    correctDose: "0.8 mL",
    syringeType: "tuberculin",
    note: "This version increases the SQ volume while preserving the same medication family.",
    distractors: SQ_DISTRACTORS,
    safetyPrompt: "A student uses an insulin syringe and records 80 units instead of the ordered mL-based biologic dose. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong dose", "Wrong route", "Wrong patient"],
    safetyAnswer: "Wrong syringe"
  }),

  // ID 20
  buildScenario({
    medication: "PPD",
    order: "PPD 0.1 mL ID",
    route: "ID",
    strength: "5 TU / 0.1 mL",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    note: "PPD is a classic intradermal forearm scenario using a very small measured volume.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student selects the deltoid as the injection site. What is the main error?",
    safetyOptions: ["Wrong route site", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route site"
  }),
  buildScenario({
    medication: "PPD",
    order: "Employee health PPD 0.1 mL ID",
    route: "ID",
    strength: "5 TU / 0.1 mL",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    note: "This changes the context wording while keeping the standard ID test volume.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student documents the route as SQ. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong dose", "Wrong syringe", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "PPD",
    order: "School clearance PPD 0.1 mL ID",
    route: "ID",
    strength: "5 TU / 0.1 mL",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    note: "This gives you another PPD variant without changing the core ID skill.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student prepares 1 mL for the injection. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong site", "Wrong syringe"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "PPD",
    order: "Repeat TB screening 0.1 mL ID",
    route: "ID",
    strength: "5 TU / 0.1 mL",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    note: "Repeat screening is another realistic way to vary the same medication and volume.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student chooses the heparin vial. What is the main error?",
    safetyOptions: ["Wrong vial", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong vial"
  }),
  buildScenario({
    medication: "Candida Antigen",
    order: "Candida antigen 0.1 mL ID",
    route: "ID",
    strength: "0.1 mL per test dose",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    note: "This keeps a classic skin-test style medication in the ID bank.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student chooses the ventrogluteal site. What is the main error?",
    safetyOptions: ["Wrong route site", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route site"
  }),
  buildScenario({
    medication: "Candida Antigen",
    order: "Candida control antigen 0.1 mL ID",
    route: "ID",
    strength: "0.1 mL per test dose",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    note: "This variant changes the wording while preserving the small intradermal technique.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student labels the route IM. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Dust Mite Antigen",
    order: "Dust mite antigen 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    note: "Very small allergy-test style volumes are a good fit for intradermal practice.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student prepares 0.2 mL instead of 0.02 mL. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong site", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Dust Mite Antigen",
    order: "Dust mite intradermal test 0.03 mL ID",
    route: "ID",
    strength: "0.03 mL test dose",
    correctDose: "0.03 mL",
    syringeType: "tuberculin",
    note: "This expands allergy-style ID practice with a slight change in test volume.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student chooses a 3 mL syringe for this test. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Grass Pollen Antigen",
    order: "Grass pollen antigen 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    note: "This adds variety to the allergy antigen set without changing the intradermal skill set.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student documents this as SQ in the lower abdomen. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong route site", "Wrong syringe", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Grass Pollen Antigen",
    order: "Grass pollen intradermal panel 0.05 mL ID",
    route: "ID",
    strength: "0.05 mL test dose",
    correctDose: "0.05 mL",
    syringeType: "tuberculin",
    note: "This gives you an upper-end small-volume ID scenario.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student selects the wrong vial and pulls dexamethasone. What is the main error?",
    safetyOptions: ["Wrong vial", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong vial"
  }),
  buildScenario({
    medication: "Cat Dander Antigen",
    order: "Cat dander antigen 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    note: "This keeps the allergy-testing theme but changes the antigen and label wording.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student selects the vastus lateralis site. What is the main error?",
    safetyOptions: ["Wrong route site", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route site"
  }),
  buildScenario({
    medication: "Cat Dander Antigen",
    order: "Cat dander intradermal test 0.03 mL ID",
    route: "ID",
    strength: "0.03 mL test dose",
    correctDose: "0.03 mL",
    syringeType: "tuberculin",
    note: "This pairs the same antigen family with a slightly larger bleb-forming test volume.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student prepares 0.3 mL. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong syringe", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Penicillin Test Dose",
    order: "Penicillin skin test 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    note: "Drug-allergy style intradermal testing is commonly described in 0.02 to 0.05 mL volumes.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student uses a 3 mL syringe for this tiny test dose. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong patient", "Wrong site"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Penicillin Test Dose",
    order: "Penicillin intradermal challenge 0.03 mL ID",
    route: "ID",
    strength: "0.03 mL test dose",
    correctDose: "0.03 mL",
    syringeType: "tuberculin",
    note: "This expands the drug-testing bank without leaving the same technique family.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student charts the route as IM. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong syringe", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Lidocaine Test Dose",
    order: "Lidocaine sensitivity test 0.05 mL ID",
    route: "ID",
    strength: "0.05 mL test dose",
    correctDose: "0.05 mL",
    syringeType: "tuberculin",
    note: "This gives you another small ID dose with a medication name students recognize.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student selects the lower abdomen as the site. What is the main error?",
    safetyOptions: ["Wrong route site", "Wrong dose", "Wrong vial", "Wrong patient"],
    safetyAnswer: "Wrong route site"
  }),
  buildScenario({
    medication: "Lidocaine Test Dose",
    order: "Lidocaine wheal test 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    note: "The same medication can be used with a different tiny ID test volume for variety.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student draws 2 mL for this order. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route", "Wrong syringe", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  }),
  buildScenario({
    medication: "Bee Venom Antigen",
    order: "Bee venom antigen 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    note: "This adds another allergy-testing label while staying in the same intradermal volume range.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student chooses the regular insulin vial. What is the main error?",
    safetyOptions: ["Wrong vial", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong vial"
  }),
  buildScenario({
    medication: "Mold Antigen",
    order: "Mold antigen 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    note: "This broadens the ID antigen set without changing the underlying skill pattern.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student uses an insulin syringe and calls the answer 2 units. What is the main error?",
    safetyOptions: ["Wrong syringe", "Wrong route", "Wrong dose", "Wrong patient"],
    safetyAnswer: "Wrong syringe"
  }),
  buildScenario({
    medication: "Latex Antigen",
    order: "Latex antigen 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    note: "Another antigen variant helps the bank feel less repetitive while staying realistic.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student documents this as an SQ thigh injection. What is the main error?",
    safetyOptions: ["Wrong route", "Wrong route site", "Wrong syringe", "Wrong patient"],
    safetyAnswer: "Wrong route"
  }),
  buildScenario({
    medication: "Cephalosporin Test Dose",
    order: "Cephalosporin skin test 0.03 mL ID",
    route: "ID",
    strength: "0.03 mL test dose",
    correctDose: "0.03 mL",
    syringeType: "tuberculin",
    note: "This closes the bank with another drug-allergy style intradermal scenario.",
    distractors: ID_DISTRACTORS,
    safetyPrompt: "A student selects the deltoid and prepares 0.3 mL instead. What is the main error?",
    safetyOptions: ["Wrong dose", "Wrong route site", "Wrong route", "Wrong patient"],
    safetyAnswer: "Wrong dose"
  })
];
