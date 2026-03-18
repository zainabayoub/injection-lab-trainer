
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
    siteMap: "Forearm • Upper Chest • Upper Back",
    sites: [
      { name: "Forearm", meta: "Most common for PPD" },
      { name: "Upper Chest", meta: "Skin testing site" },
      { name: "Upper Back", meta: "Between shoulder blades" }
    ],
    icon: "ID"
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
    vialColor: "#a8c7ee",
    vials: ["Dexamethasone","Heparin","Insulin Lispro","PPD"],
    safetyPrompt: "A student prepares 1.6 mL for this order. What is the main error?",
    safetyOptions: ["Wrong dose","Wrong route","Wrong patient","Wrong vial size"],
    safetyAnswer: "Wrong dose",
    explainCorrect: "Dexamethasone matches the prescription, and an IM medication like this commonly uses a 3 mL syringe for the ordered volume.",
    explainWrongVial: "The order specifically calls for dexamethasone. Choosing a different medication would fail the medication verification step.",
    explainWrongSyringe: "An insulin syringe is not appropriate for an IM steroid injection like dexamethasone."
  },
  {
    medication: "Ketorolac",
    order: "Ketorolac 30 mg IM",
    route: "IM",
    strength: "30 mg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    vialColor: "#f6cc64",
    vials: ["Ketorolac","Vitamin B12","Heparin","Regular Insulin"],
    safetyPrompt: "A student chooses an insulin syringe for this medication. What is the main error?",
    safetyOptions: ["Wrong syringe","Wrong route","Wrong patient","Wrong site"],
    safetyAnswer: "Wrong syringe",
    explainCorrect: "Ketorolac is the correct medication, and a 3 mL syringe is appropriate for IM medication preparation.",
    explainWrongVial: "This prescription is for ketorolac, not another injectable. Medication matching comes before administration.",
    explainWrongSyringe: "Insulin syringes are for insulin units, not standard IM medications like ketorolac."
  },
  {
    medication: "Vitamin B12",
    order: "Cyanocobalamin 1000 mcg IM",
    route: "IM",
    strength: "1000 mcg/mL",
    correctDose: "1 mL",
    syringeType: "3ml",
    vialColor: "#f48f86",
    vials: ["Vitamin B12","Dexamethasone","PPD","Heparin"],
    safetyPrompt: "A student plans to administer this ID. What is the main error?",
    safetyOptions: ["Wrong route","Wrong dose","Wrong vial","Wrong patient"],
    safetyAnswer: "Wrong route",
    explainCorrect: "Vitamin B12 is commonly given IM, and the 3 mL syringe is a suitable selection for this volume.",
    explainWrongVial: "The prescription is specifically for cyanocobalamin. A different vial would be the wrong medication.",
    explainWrongSyringe: "A tuberculin or insulin syringe is not the best choice for a standard IM B12 injection."
  },
  {
    medication: "Heparin",
    order: "Heparin 5000 units SQ",
    route: "SQ",
    strength: "5000 units/mL",
    correctDose: "1 mL",
    syringeType: "tuberculin",
    vialColor: "#9ca8ef",
    vials: ["Heparin","Dexamethasone","PPD","Ketorolac"],
    safetyPrompt: "A student labels this injection as IM. What is the main error?",
    safetyOptions: ["Wrong route","Wrong syringe","Wrong patient","Wrong concentration"],
    safetyAnswer: "Wrong route",
    explainCorrect: "Heparin is commonly administered subcutaneously, and a 1 mL tuberculin syringe is appropriate for small measured volumes.",
    explainWrongVial: "Heparin is an SQ anticoagulant. Choosing an IM medication would not match the order.",
    explainWrongSyringe: "A 3 mL IM syringe is not the best choice for a small SQ heparin dose."
  },
  {
    medication: "Enoxaparin",
    order: "Enoxaparin 40 mg SQ",
    route: "SQ",
    strength: "100 mg/mL",
    correctDose: "0.4 mL",
    syringeType: "tuberculin",
    vialColor: "#9fe0b0",
    vials: ["Enoxaparin","Regular Insulin","Ketorolac","Vitamin B12"],
    safetyPrompt: "A student draws 4 mL. What is the main error?",
    safetyOptions: ["Wrong dose","Wrong route","Wrong syringe","Wrong site"],
    safetyAnswer: "Wrong dose",
    explainCorrect: "Enoxaparin is given SQ, and a 1 mL tuberculin syringe helps measure a small volume like 0.4 mL accurately.",
    explainWrongVial: "This prescription is specifically for enoxaparin, which is a subcutaneous anticoagulant.",
    explainWrongSyringe: "A smaller 1 mL syringe supports accurate measurement better than a larger IM syringe for this dose."
  },
  {
    medication: "Epinephrine",
    order: "Epinephrine 0.3 mg SQ",
    route: "SQ",
    strength: "1 mg/mL",
    correctDose: "0.3 mL",
    syringeType: "tuberculin",
    vialColor: "#f6b7a8",
    vials: ["Epinephrine","PPD","Dexamethasone","Heparin"],
    safetyPrompt: "A student chooses a 3 mL syringe. What is the main error?",
    safetyOptions: ["Wrong syringe","Wrong route","Wrong patient","Wrong vial size"],
    safetyAnswer: "Wrong syringe",
    explainCorrect: "Epinephrine is the correct medication, and a smaller syringe is better for accurately measuring 0.3 mL.",
    explainWrongVial: "The order is for epinephrine, so the correct vial must match before administration.",
    explainWrongSyringe: "A 3 mL syringe is too large for accurately preparing a small 0.3 mL SQ dose."
  },
  {
    medication: "Regular Insulin",
    order: "Regular insulin 10 units SQ",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "10 units",
    syringeType: "insulin",
    vialColor: "#f19fc0",
    vials: ["Regular Insulin","Heparin","Ketorolac","Vitamin B12"],
    safetyPrompt: "A student draws this to the 20-unit line. What is the main error?",
    safetyOptions: ["Wrong dose","Wrong route","Wrong site","Wrong needle length"],
    safetyAnswer: "Wrong dose",
    explainCorrect: "Insulin is measured in units, and an insulin syringe is specifically designed for U-100 insulin preparation.",
    explainWrongVial: "This order is for regular insulin. Other medications would not match the prescription.",
    explainWrongSyringe: "Insulin should be measured with an insulin syringe in units, not with a tuberculin or 3 mL syringe."
  },
  {
    medication: "Insulin Lispro",
    order: "Insulin Lispro 24 units SQ",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "24 units",
    syringeType: "insulin",
    vialColor: "#8acbe0",
    vials: ["Insulin Lispro","Regular Insulin","Dexamethasone","Vitamin B12"],
    safetyPrompt: "A student selects a tuberculin syringe for this order. What is the main error?",
    safetyOptions: ["Wrong syringe","Wrong route","Wrong patient","Wrong site"],
    safetyAnswer: "Wrong syringe",
    explainCorrect: "Insulin lispro is measured in units, so an insulin syringe is the safest and clearest choice.",
    explainWrongVial: "The prescription is for insulin lispro. Even another insulin type would not be an exact medication match.",
    explainWrongSyringe: "Tuberculin syringes measure mL, but insulin orders are taught and read in units with insulin syringes."
  },
  {
    medication: "Insulin Glargine",
    order: "Insulin Glargine 20 units SQ nightly",
    route: "SQ",
    strength: "U-100 (100 units/mL)",
    correctDose: "20 units",
    syringeType: "insulin",
    vialColor: "#c0e59a",
    vials: ["Insulin Glargine","Enoxaparin","Ketorolac","PPD"],
    safetyPrompt: "A student documents the route as ID. What is the main error?",
    safetyOptions: ["Wrong route","Wrong syringe","Wrong patient","Wrong site"],
    safetyAnswer: "Wrong route",
    explainCorrect: "Insulin glargine is a subcutaneous insulin medication and should be measured in units using an insulin syringe.",
    explainWrongVial: "The vial must match insulin glargine exactly to match the prescription.",
    explainWrongSyringe: "A dedicated insulin syringe is the correct teaching choice for a U-100 insulin order."
  },
  {
    medication: "PPD",
    order: "PPD 0.1 mL ID",
    route: "ID",
    strength: "5 TU / 0.1 mL",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    vialColor: "#cfd6dd",
    vials: ["PPD","Heparin","Dexamethasone","Vitamin B12"],
    safetyPrompt: "A student selects the deltoid as the injection site. What is the main error?",
    safetyOptions: ["Wrong route site","Wrong dose","Wrong vial","Wrong patient"],
    safetyAnswer: "Wrong route site",
    explainCorrect: "PPD is an intradermal test and is commonly administered on the forearm with a small tuberculin syringe.",
    explainWrongVial: "PPD is a testing solution, so it must match the order exactly and is not interchangeable with therapeutic injectables.",
    explainWrongSyringe: "A tuberculin syringe supports accurate measurement of the very small 0.1 mL ID dose."
  },
  {
    medication: "Candida Antigen",
    order: "Candida antigen 0.1 mL ID",
    route: "ID",
    strength: "0.1 mL per test dose",
    correctDose: "0.1 mL",
    syringeType: "tuberculin",
    vialColor: "#c6b7f1",
    vials: ["Candida Antigen","PPD","Ketorolac","Heparin"],
    safetyPrompt: "A student prepares 1 mL for administration. What is the main error?",
    safetyOptions: ["Wrong dose","Wrong route","Wrong site","Wrong syringe"],
    safetyAnswer: "Wrong dose",
    explainCorrect: "Candida antigen skin testing uses a very small ID volume, so a tuberculin syringe is appropriate.",
    explainWrongVial: "Candida antigen must be matched specifically to the order. Another vial would not meet medication verification.",
    explainWrongSyringe: "A tuberculin syringe is used for small measured intradermal volumes like 0.1 mL."
  },
  {
    medication: "Allergy Antigen",
    order: "Dust mite antigen 0.02 mL ID",
    route: "ID",
    strength: "0.02 mL test dose",
    correctDose: "0.02 mL",
    syringeType: "tuberculin",
    vialColor: "#f4b6c3",
    vials: ["Allergy Antigen","PPD","Insulin Lispro","Vitamin B12"],
    safetyPrompt: "A student chooses an IM route for this test. What is the main error?",
    safetyOptions: ["Wrong route","Wrong syringe","Wrong patient","Wrong needle length"],
    safetyAnswer: "Wrong route",
    explainCorrect: "Allergy testing doses are tiny ID volumes, so a tuberculin syringe and intradermal technique are appropriate.",
    explainWrongVial: "The correct vial must match the allergy antigen ordered for the test.",
    explainWrongSyringe: "A tuberculin syringe supports small intradermal measurements more accurately than larger syringes."
  }
];
