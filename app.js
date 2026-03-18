
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
        ${renderSyringeSVG(item)}
      </div>
      <span class="choice-title">${item.name}</span>
      <span class="choice-sub">${item.subtitle}</span>
    </button>
  `;
}

function renderSyringeSVG(item){
  const barrelWidth = item.id === "insulin" ? 112 : item.id === "tuberculin" ? 148 : 192;
  const lineCount = item.id === "insulin" ? 7 : item.id === "tuberculin" ? 8 : 9;
  const lineSpacing = barrelWidth / (lineCount + 1);
  let marks = "";
  for(let i = 1; i <= lineCount; i++){
    const x = 40 + i * lineSpacing;
    marks += `<line x1="${x}" y1="28" x2="${x}" y2="48" stroke="#b8c8d3" stroke-width="2"/>`;
  }
  const needleColor = item.id === "insulin" ? "#f3a451" : "#8aa0ad";
  return `
    <svg class="syringe-svg" viewBox="0 0 260 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="barrelGrad-${item.id}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#edf2f5"/>
        </linearGradient>
        <linearGradient id="plungerGrad-${item.id}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#d6dee3"/>
          <stop offset="100%" stop-color="#b8c6cf"/>
        </linearGradient>
      </defs>

      <line x1="10" y1="38" x2="28" y2="38" stroke="${needleColor}" stroke-width="3" stroke-linecap="round"/>
      <line x1="28" y1="38" x2="40" y2="38" stroke="#93a9b5" stroke-width="4" stroke-linecap="round"/>

      <rect x="40" y="24" rx="9" ry="9" width="${barrelWidth}" height="28" fill="url(#barrelGrad-${item.id})" stroke="#8da0ac" stroke-width="2.4"/>
      ${marks}
      <rect x="${40 + barrelWidth}" y="17" width="22" height="42" rx="8" fill="url(#plungerGrad-${item.id})" stroke="#80939f" stroke-width="2.2"/>
      <rect x="${30 + barrelWidth}" y="20" width="12" height="36" rx="5" fill="#edf2f5" stroke="#b8c6cf" stroke-width="1.4"/>

      ${item.id === "insulin" ? '<circle cx="18" cy="38" r="4" fill="#f3a451"/>' : ''}
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

      <rect x="27" y="12" width="56" height="22" rx="10" fill="url(#capGrad-${safeId(name)})" stroke="#b8c3ca" stroke-width="1.5"/>
      <rect x="16" y="28" width="78" height="102" rx="28" fill="url(#glassGrad-${safeId(name)})" stroke="#c5d0d5" stroke-width="4"/>

      <rect x="35" y="56" width="40" height="48" rx="10" fill="${color}" opacity="0.95"/>
      <rect x="43" y="64" width="9" height="32" rx="5" fill="rgba(255,255,255,.20)"/>

      <rect x="28" y="108" width="54" height="12" rx="6" fill="#ffffff" opacity="0.92" stroke="#d8dfe4" stroke-width="1"/>
      <rect x="33" y="112" width="44" height="4" rx="2" fill="#e8edf1"/>
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

function safeId(str){
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-');
}

function escapeHtml(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
