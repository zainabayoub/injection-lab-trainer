
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const resultsScreen = document.getElementById("resultsScreen");

const currentModeEl = document.getElementById("currentMode");
const progressTextEl = document.getElementById("progressText");
const scoreTextEl = document.getElementById("scoreText");
const progressFillEl = document.getElementById("progressFill");

const orderTextEl = document.getElementById("orderText");
const medicationTextEl = document.getElementById("medicationText");
const strengthTextEl = document.getElementById("strengthText");
const bestSyringeTextEl = document.getElementById("bestSyringeText");
const routePillEl = document.getElementById("routePill");

const routeCueTextEl = document.getElementById("routeCueText");
const angleTextEl = document.getElementById("angleText");
const lengthTextEl = document.getElementById("lengthText");
const siteMapTextEl = document.getElementById("siteMapText");
const siteFamilyTextEl = document.getElementById("siteFamilyText");
const siteDiagramEl = document.getElementById("siteDiagram");
const modePanelEl = document.getElementById("modePanel");
const feedbackBoxEl = document.getElementById("feedbackBox");

const resultsTitleEl = document.getElementById("resultsTitle");
const resultsBodyEl = document.getElementById("resultsBody");

const state = {
  mode: "tray",
  index: 0,
  score: 0,
  selectedSyringe: null
};

const modeLabels = {
  tray: "Medication Tray",
  calc: "Dose Challenge",
  sites: "Injection Sites",
  safety: "Safety Check"
};

document.querySelectorAll(".mode-card").forEach(btn => {
  btn.addEventListener("click", () => startMode(btn.dataset.mode));
});

document.getElementById("backHomeBtn").addEventListener("click", goHome);
document.getElementById("resultsHomeBtn").addEventListener("click", goHome);
document.getElementById("playAgainBtn").addEventListener("click", () => startMode(state.mode));

function startMode(mode){
  state.mode = mode;
  state.index = 0;
  state.score = 0;
  state.selectedSyringe = null;
  showScreen("game");
  render();
}

function goHome(){
  showScreen("home");
  clearFeedback();
}

function showScreen(screen){
  homeScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");

  if(screen === "home") homeScreen.classList.remove("hidden");
  if(screen === "game") gameScreen.classList.remove("hidden");
  if(screen === "results") resultsScreen.classList.remove("hidden");
}

function render(){
  const scenario = scenarios[state.index];
  const guide = routeGuides[scenario.route];
  const syringe = syringeLibrary.find(s => s.id === scenario.syringeType);

  currentModeEl.textContent = modeLabels[state.mode];
  progressTextEl.textContent = `${state.index + 1} / ${scenarios.length}`;
  scoreTextEl.textContent = state.score;
  progressFillEl.style.width = `${(state.index / scenarios.length) * 100}%`;

  orderTextEl.textContent = scenario.order;
  medicationTextEl.textContent = scenario.medication;
  strengthTextEl.textContent = scenario.strength;
  bestSyringeTextEl.textContent = syringe.name;
  routePillEl.textContent = scenario.route;
  siteFamilyTextEl.textContent = `${scenario.route} Site Family`;

  routeCueTextEl.textContent = guide.cue;
  angleTextEl.textContent = guide.angle;
  lengthTextEl.textContent = guide.length;
  siteMapTextEl.textContent = guide.siteMap;

  siteDiagramEl.innerHTML = guide.sites.map(site => `
    <div class="site-chip">
      <div>
        <div class="site-name">${site.name}</div>
        <div class="site-meta">${site.meta}</div>
      </div>
      <div class="soft-label">${scenario.route}</div>
    </div>
  `).join("");

  clearFeedback();
  state.selectedSyringe = null;
  renderModePanel(scenario, syringe, guide);
}

function renderModePanel(scenario, syringe, guide){
  if(state.mode === "tray"){
    const shuffledSyringes = shuffleArray(syringeLibrary);
    const shuffledVials = shuffleArray(scenario.vials);

    modePanelEl.innerHTML = `
      <h3 class="section-title">Step 1 • Choose the correct syringe</h3>
      <div class="choice-grid three">
        ${shuffledSyringes.map(item => syringeCard(item)).join("")}
      </div>

      <h3 class="section-title" style="margin-top:18px;">Step 2 • Choose the correct vial</h3>
      <div class="choice-grid two">
        ${shuffledVials.map(v => vialCard(v, getVialColor(v))).join("")}
      </div>
    `;
    bindSyringeChoices(scenario);
    bindVialChoices(scenario);
    return;
  }

  if(state.mode === "calc"){
    modePanelEl.innerHTML = `
      <h3 class="section-title">Dose Challenge</h3>
      <div class="mini-card" style="margin-bottom:14px;">
        <div class="route-icon ${scenario.route.toLowerCase()}">${guide.icon}</div>
        <span class="mini-title">Prompt</span>
        <p>Calculate the correct amount to draw for this order.</p>
      </div>
      <div class="slider-wrap">
        <label for="doseInput"><strong>Enter the correct amount</strong></label>
        <input id="doseInput" type="text" placeholder="Example: 0.6 mL or 10 units" />
        <div class="draw-readout">
          <span>Use the vial strength shown on the prescription.</span>
          <button id="submitDoseBtn" class="inline-btn">Check Answer</button>
        </div>
      </div>
    `;
    document.getElementById("submitDoseBtn").addEventListener("click", () => {
      const val = document.getElementById("doseInput").value.trim().toLowerCase();
      if(!val) return showBad("Enter an answer first.", "Add the exact amount to draw before checking.");
      if(normalizeDose(val) === normalizeDose(scenario.correctDose)){
        correctAdvance(
          "Correct dose.",
          `${scenario.correctDose} is the correct amount for this prescription. ${scenario.explainCorrect}`
        );
      } else {
        showBad(
          `Not quite. Correct answer: ${scenario.correctDose}`,
          `Recheck the vial strength and ordered dose. ${scenario.explainCorrect}`
        );
      }
    });
    return;
  }

  if(state.mode === "sites"){
    const options = shuffleArray([
      { route: "IM", label: "IM Site Group", summary: "Deltoid, ventrogluteal, vastus lateralis" },
      { route: "SQ", label: "SQ Site Group", summary: "Back of arm, lower abdomen, top of thigh" },
      { route: "ID", label: "ID Site Group", summary: "Forearm, upper chest, upper back" }
    ]);

    modePanelEl.innerHTML = `
      <h3 class="section-title">Injection Site Practice</h3>
      <div class="mini-card" style="margin-bottom:14px;">
        <div class="route-icon ${scenario.route.toLowerCase()}">${guide.icon}</div>
        <span class="mini-title">Prompt</span>
        <p>Select the best site family for this route.</p>
      </div>
      <div class="choice-grid two">
        ${options.map(opt => `
          <button class="choice-btn site-option" data-site-route="${opt.route}">
            <span class="choice-title">${opt.label}</span>
            <span class="choice-sub">${opt.summary}</span>
          </button>
        `).join("")}
      </div>
    `;
    document.querySelectorAll(".site-option").forEach(btn => {
      btn.addEventListener("click", () => {
        if(btn.dataset.siteRoute === scenario.route){
          btn.classList.add("selected-correct");
          correctAdvance(
            "Correct site family selected.",
            `${scenario.route} uses sites such as ${routeGuides[scenario.route].siteMap}.`
          );
        } else {
          btn.classList.add("selected-wrong");
          showBad(
            "Not quite.",
            `${scenario.route} is matched with: ${routeGuides[scenario.route].siteMap}.`
          );
        }
      });
    });
    return;
  }

  const safetyOptions = shuffleArray(scenario.safetyOptions);
  modePanelEl.innerHTML = `
    <h3 class="section-title">Safety Check</h3>
    <div class="mini-card" style="margin-bottom:14px;">
      <div class="route-icon ${scenario.route.toLowerCase()}">${guide.icon}</div>
      <span class="mini-title">Scenario</span>
      <p>${scenario.safetyPrompt}</p>
    </div>
    <div class="choice-grid two">
      ${safetyOptions.map(opt => `
        <button class="choice-btn safety-option" data-answer="${escapeHtml(opt)}">
          <span class="choice-title">${opt}</span>
        </button>
      `).join("")}
    </div>
  `;
  document.querySelectorAll(".safety-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const answer = btn.dataset.answer;
      if(answer === scenario.safetyAnswer){
        btn.classList.add("selected-correct");
        correctAdvance(
          "Correct safety issue identified.",
          `${scenario.safetyAnswer} is the best answer. ${scenario.explainCorrect}`
        );
      } else {
        btn.classList.add("selected-wrong");
        showBad(
          `Not quite. Correct answer: ${scenario.safetyAnswer}`,
          `This scenario is mainly about ${scenario.safetyAnswer.toLowerCase()}.`
        );
      }
    });
  });
}

function syringeCard(item){
  return `
    <button class="choice-btn syringe-option" data-syringe-id="${item.id}">
      <div class="syringe-graphic">
        <div class="needle"></div>
        <div class="barrel ${item.barrel}">
          <div class="marker-row">| | | | | |</div>
        </div>
        <div class="plunger"></div>
      </div>
      <span class="choice-title">${item.name}</span>
      <span class="choice-sub">${item.subtitle}</span>
    </button>
  `;
}

function vialCard(name, color){
  return `
    <button class="choice-btn vial-btn vial-option" data-vial-name="${escapeHtml(name)}">
      <div class="vial-top"></div>
      <div class="vial-graphic">
        <div class="vial-liquid" style="background:${color};"></div>
      </div>
      <span class="choice-title">${name}</span>
      <span class="choice-sub">Select this vial</span>
    </button>
  `;
}

function bindSyringeChoices(scenario){
  document.querySelectorAll(".syringe-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".syringe-option").forEach(x => x.classList.remove("selected-correct","selected-wrong"));
      if(btn.dataset.syringeId === scenario.syringeType){
        btn.classList.add("selected-correct");
        state.selectedSyringe = btn.dataset.syringeId;
        showGood("Correct syringe selected.", scenario.explainCorrect);
      } else {
        btn.classList.add("selected-wrong");
        state.selectedSyringe = null;
        showBad(
          `Not quite. Best syringe: ${syringeLibrary.find(s => s.id === scenario.syringeType).name}`,
          scenario.explainWrongSyringe
        );
      }
    });
  });
}

function bindVialChoices(scenario){
  document.querySelectorAll(".vial-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vial-option").forEach(x => x.classList.remove("selected-correct","selected-wrong"));
      if(!state.selectedSyringe || state.selectedSyringe !== scenario.syringeType){
        showBad("Choose the correct syringe first.", "Students should verify the syringe before final medication preparation.");
        return;
      }
      if(btn.dataset.vialName === scenario.medication){
        btn.classList.add("selected-correct");
        correctAdvance("Correct vial selected.", scenario.explainCorrect);
      } else {
        btn.classList.add("selected-wrong");
        showBad(`Not quite. Correct vial: ${scenario.medication}`, scenario.explainWrongVial);
      }
    });
  });
}

function correctAdvance(message, explanation){
  state.score += 1;
  scoreTextEl.textContent = state.score;
  showGood(message, explanation);
  setTimeout(() => {
    state.index += 1;
    if(state.index >= scenarios.length){
      showResults();
    } else {
      render();
    }
  }, 1100);
}

function showResults(){
  showScreen("results");
  const total = scenarios.length;
  const pct = Math.round((state.score / total) * 100);
  let rank = "Beginner Injector";
  if(pct >= 90) rank = "Clinical Pro";
  else if(pct >= 75) rank = "Safe Injector";
  else if(pct >= 60) rank = "Emerging Injector";

  resultsTitleEl.textContent = rank;
  resultsBodyEl.textContent = `You scored ${state.score} out of ${total} in ${modeLabels[state.mode]}.`;
}

function showGood(message, explanation){
  feedbackBoxEl.innerHTML = `
    <div class="feedback good">
      <span class="feedback-title">Correct</span>
      ${message}
      <span class="explain">${explanation || ""}</span>
    </div>
  `;
}

function showBad(message, explanation){
  feedbackBoxEl.innerHTML = `
    <div class="feedback bad">
      <span class="feedback-title">Try Again</span>
      ${message}
      <span class="explain">${explanation || ""}</span>
    </div>
  `;
}

function clearFeedback(){
  feedbackBoxEl.innerHTML = "";
}

function normalizeDose(str){
  return str.replace(/\s+/g," ").trim().toLowerCase();
}

function shuffleArray(arr){
  const copy = [...arr];
  for(let i = copy.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getVialColor(name){
  const match = scenarios.find(s => s.medication === name);
  return match ? match.vialColor : "#d8e2e8";
}

function escapeHtml(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
