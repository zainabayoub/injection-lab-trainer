
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
    ]
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
    ]
  },
  ID: {
    cue: "ID injections are very shallow and often used for PPD and skin testing.",
    angle: "Insert at 10° to 15° just under the skin.",
    length: "Typical needle length: 1/4 to 1/2 inch with fine gauge.",
    siteMap: "Forearm • Upper Chest • Upper Back",
    sites: [
      { name: "Forearm", meta: "Most common for PPD" },
      { name: "Upper Chest", meta: "Skin testing site" },
      { name: "Upper Back", meta: "Between shoulder blades" }
    ]
  }
};

const syringeLibrary = [
  { id: "insulin", name: "Insulin Syringe", subtitle: "For U-100 insulin in units", barrel: "short" },
  { id: "tuberculin", name: "1 mL Tuberculin Syringe", subtitle: "For small measured mL volumes", barrel: "medium" },
  { id: "3ml", name: "3 mL Syringe", subtitle: "Common for larger IM volumes", barrel: "long" }
];

const scenarios = [
  {
    medication: "Dexamethasone",
    order: "Dexamethasone 6 mg IM",
    route: "IM",
    strength: "10 mg/mL",
    correctDose: "0.6 mL",
    syringeType: "3ml",
    vialColor: "#d6e4ef",
    vials: ["Dexamethasone","Heparin","Insulin Lispro","PPD"],
    safetyPrompt: "A student prepares 1.6 mL for this order. What is the main error?",
    safetyOptions: ["Wrong dose","Wrong route","Wrong patient","Wrong vial size"],
    safetyAnswer: "Wrong dose"
  },
  {
    medication: "Ketorolac",
    order: "Ketorolac 30 mg IM",
    route: "IM",
    strength: "30 mg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    vialColor: "#f3d58f",
    vials: ["Ketorolac","Vitamin B12","Heparin","Regular Insulin"],
    safetyPrompt: "A student chooses an insulin syringe for this medication. What is the main error?",
    safetyOptions: ["Wrong syringe","Wrong route","Wrong patient","Wrong site"],
    safetyAnswer: "Wrong syringe"
  },
  {
    medication: "Vitamin B12",
    order: "Cyanocobalamin 1000 mcg IM",
    route: "IM",
    strength: "1000 mcg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    vialColor: "#f2a7a7",
    vials: ["Vitamin B12","Dexamethasone","PPD","Heparin"],
    safetyPrompt: "A student plans to administer this ID. What is the main error?",
    safetyOptions: ["Wrong route","Wrong dose","Wrong vial","Wrong patient"],
    safetyAnswer: "Wrong route"
  },
  {
    medication: "Heparin",
    order: "Heparin 5000 units SQ",
    route: "SQ",
    strength: "5000 units/mL",
    correctDose: "1 mL",
    syringeType: "tuberculin",
    vialColor: "#a9d0f5",
    vials: ["Heparin","Dexamethasone","PPD","Ketorolac"],
    safetyPrompt: "A student labels this injection as IM. What is the main error?",
    safetyOptions: ["Wrong route","Wrong syringe","Wrong patient","Wrong concentration"],
    safetyAnswer: "Wrong route"
  },
  {
    medication: "Enoxaparin",
    order: "Enoxaparin 40 mg SQ",
    route: "SQ",
    strength: "100 mg/mL",
    correctDose: "0.4 mL",
    syringeType: "tuberculin",
    vialColor: "#a7e3ba",
    vials: ["Enoxaparin","Regular Insulin","Ketorolac","Vitamin B12"],
    safetyPrompt: "A student draws 4 mL. What is the main error?",
    safetyOptions: ["Wrong dose","Wrong route","Wrong syringe","Wrong site"],
    safetyAnswer: "Wrong dose"
  },
  {
    medication: "Epinephrine",
    order: "Epinephrine 0.3 mg SQ",
    route: "SQ",
    strength: "1 mg/mL",
    correctDose: "0.3 mL",
    syringeType: "tuberculin",
    vialColor: "#ccb7f6",
    vials: ["Epinephrine","PPD","Dexamethasone","Heparin"],
    safetyPrompt: "A student chooses a 3 mL syringe. What is the main error?",
    safetyOptions: ["Wrong syringe","Wrong route","Wrong patient","Wrong vial size"],
    safetyAnswer: "Wrong syringe"
  },
  {
    medication: "Regular Insulin",
    order: "Regular insulin 10 units SQ",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "10 units",
    syringeType: "insulin",
    vialColor: "#f4b4cf",
    vials: ["Regular Insulin","Heparin","Ketorolac","Vitamin B12"],
    safetyPrompt: "A student draws this to the 20-unit line. What is the main error?",
    safetyOptions: ["Wrong dose","Wrong route","Wrong site","Wrong needle length"],
    safetyAnswer: "Wrong dose"
  },
  {
    medication: "Insulin Lispro",
    order: "Insulin Lispro 24 units SQ",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "24 units",
    syringeType: "insulin",
    vialColor: "#9edcf0",
    vials: ["Insulin Lispro","Regular Insulin","Dexamethasone","Vitamin B12"],
    safetyPrompt: "A student selects a tuberculin syringe for this order. What is the main error?",
    safetyOptions: ["Wrong syringe","Wrong route","Wrong patient","Wrong site"],
    safetyAnswer: "Wrong syringe"
  },
  {
    medication: "Insulin Glargine",
    order: "Insulin Glargine 20 units SQ nightly",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "20 units",
    syringeType: "insulin",
    vialColor: "#b7e8d2",
    vials: ["Insulin Glargine","Enoxaparin","Ketorolac","PPD"],
    safetyPrompt: "A student documents the route as ID. What is the main error?",
    safetyOptions: ["Wrong route","Wrong syringe","Wrong patient","Wrong site"],
    safetyAnswer: "Wrong route"
  },
  {
    medication: "PPD",
    order: "PPD 0.1 mL ID",
    route: "ID",
    strength: "5 TU / 0.1 mL",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    vialColor: "#e3e8ee",
    vials: ["PPD","Heparin","Dexamethasone","Vitamin B12"],
    safetyPrompt: "A student selects the deltoid as the injection site. What is the main error?",
    safetyOptions: ["Wrong route site","Wrong dose","Wrong vial","Wrong patient"],
    safetyAnswer: "Wrong route site"
  },
  {
    medication: "Candida Antigen",
    order: "Candida antigen 0.1 mL ID",
    route: "ID",
    strength: "0.1 mL per test dose",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    vialColor: "#ddd2fb",
    vials: ["Candida Antigen","PPD","Ketorolac","Heparin"],
    safetyPrompt: "A student prepares 1 mL for administration. What is the main error?",
    safetyOptions: ["Wrong dose","Wrong route","Wrong site","Wrong syringe"],
    safetyAnswer: "Wrong dose"
  },
  {
    medication: "Allergy Antigen",
    order: "Dust mite antigen 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    vialColor: "#f4ced7",
    vials: ["Allergy Antigen","PPD","Insulin Lispro","Vitamin B12"],
    safetyPrompt: "A student chooses an IM route for this test. What is the main error?",
    safetyOptions: ["Wrong route","Wrong syringe","Wrong patient","Wrong needle length"],
    safetyAnswer: "Wrong route"
  }
];
