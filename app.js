
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

const gaugeLibrary = [
  { id: "im", label: "21G–23G", subtitle: "Typical IM training range" },
  { id: "sq", label: "25G–31G", subtitle: "Typical SQ training range" },
  { id: "id", label: "25G–27G", subtitle: "Typical ID training range" },
  { id: "wide", label: "18G–20G", subtitle: "Too broad for this tray" }
];

const state = {
  mode: "tray",
  index: 0,
  score: 0,
  selectedSyringe: null,
  selectedGauge: null
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
  state.selectedGauge = null;
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
  bestSyringeTextEl.textContent = syringeDisplayName(syringe.id);
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
  state.selectedGauge = null;
  renderModePanel(scenario, syringe, guide);
}

function renderModePanel(scenario, syringe, guide){
  if(state.mode === "tray"){
    const shuffledSyringes = shuffleArray(syringeLibrary);
    const shuffledVials = shuffleArray(scenario.vials);
    const shuffledGauges = shuffleArray(gaugeLibrary);

    modePanelEl.innerHTML = `
      <h3 class="section-title">Step 1 • Choose the correct syringe</h3>
      <div class="choice-grid three">
        ${shuffledSyringes.map(item => syringeCard(item)).join("")}
      </div>

      <h3 class="section-title" style="margin-top:18px;">Step 2 • Choose the correct needle gauge</h3>
      <div class="choice-grid two">
        ${shuffledGauges.map(item => `
          <button class="choice-btn gauge-option" data-gauge-id="${item.id}">
            <span class="choice-title">${item.label}</span>
            <span class="choice-sub">${item.subtitle}</span>
          </button>
        `).join("")}
      </div>

      <h3 class="section-title" style="margin-top:18px;">Step 3 • Choose the correct vial</h3>
      <div class="choice-grid two">
        ${shuffledVials.map(v => vialCard(v, getVialColor(v))).join("")}
      </div>
    `;
    bindSyringeChoices(scenario);
    bindGaugeChoices(scenario);
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

function syringeDisplayName(id){
  if(id === "3ml") return "3 mL Syringe";
  if(id === "tuberculin") return "1 mL TB Syringe";
  if(id === "insulin") return "Unit Syringe";
  return id;
}

function correctGaugeId(route){
  if(route === "IM") return "im";
  if(route === "SQ") return "sq";
  return "id";
}

function syringeCard(item){
  return `
    <button class="choice-btn syringe-option" data-syringe-id="${item.id}">
      <div class="syringe-graphic">
        ${renderSyringeSVG(item)}
      </div>
      <span class="choice-title">${syringeDisplayName(item.id)}</span>
      <span class="choice-sub">${item.id === "3ml" ? "Thicker barrel for larger measured volume" : item.id === "tuberculin" ? "Slim barrel for small measured mL doses" : "Unit markings with insulin color cue"}</span>
    </button>
  `;
}

function renderSyringeSVG(item){
  if(item.id === "3ml"){
    return `
      <svg class="syringe-svg" viewBox="0 0 280 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="barrelGrad3" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#edf2f5"/>
          </linearGradient>
          <linearGradient id="plungerGrad3" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#d6dee3"/>
            <stop offset="100%" stop-color="#b8c6cf"/>
          </linearGradient>
        </defs>
        <line x1="12" y1="46" x2="30" y2="46" stroke="#8aa0ad" stroke-width="4" stroke-linecap="round"/>
        <line x1="30" y1="46" x2="42" y2="46" stroke="#93a9b5" stroke-width="5" stroke-linecap="round"/>
        <rect x="42" y="30" width="172" height="32" rx="12" fill="url(#barrelGrad3)" stroke="#889aa5" stroke-width="2.6"/>
        ${Array.from({length:9},(_,i)=> {
          const x = 58 + i*16;
          return `<line x1="${x}" y1="34" x2="${x}" y2="58" stroke="#b8c8d3" stroke-width="2"/>`;
        }).join("")}
        <rect x="214" y="24" width="24" height="44" rx="8" fill="url(#plungerGrad3)" stroke="#80939f" stroke-width="2.2"/>
        <rect x="203" y="27" width="11" height="38" rx="5" fill="#edf2f5" stroke="#b8c6cf" stroke-width="1.4"/>
      </svg>
    `;
  }
  if(item.id === "tuberculin"){
    return `
      <svg class="syringe-svg" viewBox="0 0 280 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="barrelGradtb" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#edf2f5"/>
          </linearGradient>
          <linearGradient id="plungerGradtb" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#d6dee3"/>
            <stop offset="100%" stop-color="#b8c6cf"/>
          </linearGradient>
        </defs>
        <line x1="16" y1="48" x2="38" y2="48" stroke="#8aa0ad" stroke-width="3" stroke-linecap="round"/>
        <line x1="38" y1="48" x2="50" y2="48" stroke="#93a9b5" stroke-width="4" stroke-linecap="round"/>
        <rect x="50" y="36" width="154" height="20" rx="8" fill="url(#barrelGradtb)" stroke="#889aa5" stroke-width="2.2"/>
        ${Array.from({length:11},(_,i)=> {
          const x = 63 + i*11;
          return `<line x1="${x}" y1="38" x2="${x}" y2="54" stroke="#b8c8d3" stroke-width="1.8"/>`;
        }).join("")}
        <rect x="204" y="31" width="18" height="30" rx="6" fill="url(#plungerGradtb)" stroke="#80939f" stroke-width="2"/>
        <rect x="195" y="33" width="9" height="26" rx="4" fill="#edf2f5" stroke="#b8c6cf" stroke-width="1.2"/>
      </svg>
    `;
  }
  return `
    <svg class="syringe-svg" viewBox="0 0 280 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="barrelGradins" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#edf2f5"/>
        </linearGradient>
        <linearGradient id="plungerGradins" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#d6dee3"/>
          <stop offset="100%" stop-color="#b8c6cf"/>
        </linearGradient>
      </defs>
      <line x1="16" y1="48" x2="28" y2="48" stroke="#f0a143" stroke-width="3" stroke-linecap="round"/>
      <line x1="28" y1="48" x2="40" y2="48" stroke="#93a9b5" stroke-width="3" stroke-linecap="round"/>
      <rect x="40" y="38" width="110" height="16" rx="7" fill="url(#barrelGradins)" stroke="#889aa5" stroke-width="2"/>
      ${Array.from({length:10},(_,i)=> {
        const x = 52 + i*9;
        return `<line x1="${x}" y1="39" x2="${x}" y2="53" stroke="#b8c8d3" stroke-width="1.6"/>`;
      }).join("")}
      <rect x="150" y="33" width="15" height="26" rx="5" fill="url(#plungerGradins)" stroke="#80939f" stroke-width="1.9"/>
      <rect x="143" y="35" width="7" height="22" rx="3" fill="#edf2f5" stroke="#b8c6cf" stroke-width="1.1"/>
      <circle cx="20" cy="48" r="4" fill="#f0a143"/>
    </svg>
  `;
}

function vialCard(name, color){
  return `
    <button class="choice-btn vial-btn vial-option" data-vial-name="${escapeHtml(name)}">
      <div class="vial-graphic">
        ${renderVialSVG(color, name)}
      </div>
      <span class="choice-title">${name}</span>
      <span class="choice-sub">Select this vial</span>
    </button>
  `;
}

function renderVialSVG(color, name){
  return `
    <svg class="vial-svg" viewBox="0 0 110 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="glassGrad-${safeId(name)}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#eef3f6"/>
        </linearGradient>
        <linearGradient id="capGrad-${safeId(name)}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#cfd7dc"/>
          <stop offset="100%" stop-color="#adb9c0"/>
        </linearGradient>
      </defs>
      <rect x="26" y="12" width="58" height="18" rx="9" fill="url(#capGrad-${safeId(name)})" stroke="#b8c3ca" stroke-width="1.5"/>
      <rect x="20" y="28" width="70" height="100" rx="28" fill="url(#glassGrad-${safeId(name)})" stroke="#c4d0d6" stroke-width="4"/>
      <rect x="37" y="54" width="36" height="46" rx="10" fill="${color}" opacity="0.96"/>
      <rect x="45" y="62" width="8" height="30" rx="4" fill="rgba(255,255,255,.2)"/>
      <rect x="32" y="104" width="46" height="12" rx="6" fill="#ffffff" opacity="0.95" stroke="#d6dee3" stroke-width="1"/>
      <rect x="38" y="108" width="34" height="4" rx="2" fill="#e6ecef"/>
    </svg>
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
          `Not quite. Best syringe: ${syringeDisplayName(scenario.syringeType)}`,
          scenario.explainWrongSyringe
        );
      }
    });
  });
}

function bindGaugeChoices(scenario){
  document.querySelectorAll(".gauge-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".gauge-option").forEach(x => x.classList.remove("selected-correct","selected-wrong"));
      const correct = correctGaugeId(scenario.route);
      if(btn.dataset.gaugeId === correct){
        btn.classList.add("selected-correct");
        state.selectedGauge = btn.dataset.gaugeId;
        showGood("Correct needle gauge selected.", `${btn.querySelector('.choice-title').textContent} is the training range used here for ${scenario.route} injections.`);
      } else {
        btn.classList.add("selected-wrong");
        state.selectedGauge = null;
        const right = gaugeLibrary.find(g => g.id === correct);
        showBad("Not quite.", `${right.label} is the tray range used here for ${scenario.route} injections.`);
      }
    });
  });
}

function bindVialChoices(scenario){
  document.querySelectorAll(".vial-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vial-option").forEach(x => x.classList.remove("selected-correct","selected-wrong"));
      if(!state.selectedSyringe || state.selectedSyringe !== scenario.syringeType){
        showBad("Choose the correct syringe first.", "Verify the syringe before final medication preparation.");
        return;
      }
      if(!state.selectedGauge || state.selectedGauge !== correctGaugeId(scenario.route)){
        showBad("Choose the correct needle gauge first.", "The medication tray now includes syringe, gauge, and vial selection.");
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

function safeId(str){
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-');
}

function correctGaugeId(route){
  if(route === "IM") return "im";
  if(route === "SQ") return "sq";
  return "id";
}

function escapeHtml(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
