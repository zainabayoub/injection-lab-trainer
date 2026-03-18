
const homeScreen=document.getElementById("homeScreen"),gameScreen=document.getElementById("gameScreen"),resultsScreen=document.getElementById("resultsScreen"),currentModeEl=document.getElementById("currentMode"),progressTextEl=document.getElementById("progressText"),scoreTextEl=document.getElementById("scoreText"),progressFillEl=document.getElementById("progressFill"),orderTextEl=document.getElementById("orderText"),medicationTextEl=document.getElementById("medicationText"),strengthTextEl=document.getElementById("strengthText"),bestSyringeTextEl=document.getElementById("bestSyringeText"),routePillEl=document.getElementById("routePill"),routeCueTextEl=document.getElementById("routeCueText"),angleTextEl=document.getElementById("angleText"),lengthTextEl=document.getElementById("lengthText"),siteMapTextEl=document.getElementById("siteMapText"),siteFamilyTextEl=document.getElementById("siteFamilyText"),siteDiagramEl=document.getElementById("siteDiagram"),modePanelEl=document.getElementById("modePanel"),feedbackBoxEl=document.getElementById("feedbackBox"),resultsTitleEl=document.getElementById("resultsTitle"),resultsBodyEl=document.getElementById("resultsBody");
const gaugeLibrary=[{id:"im",label:"21G–23G",subtitle:"Needle gauge option"},{id:"sq",label:"25G–31G",subtitle:"Needle gauge option"},{id:"id",label:"25G–27G",subtitle:"Needle gauge option"},{id:"wide",label:"18G–20G",subtitle:"Needle gauge option"}];
const state={mode:"tray",index:0,score:0,selectedSyringe:null,selectedGauge:null,questionSet:[],readyForNext:false};
const modeLabels={tray:"Medication Tray",calc:"Dose Challenge",sites:"Injection Sites",safety:"Safety Check"};
document.querySelectorAll(".mode-card").forEach(btn=>btn.addEventListener("click",()=>startMode(btn.dataset.mode)));
document.getElementById("backHomeBtn").addEventListener("click",goHome);
document.getElementById("resultsHomeBtn").addEventListener("click",goHome);
document.getElementById("playAgainBtn").addEventListener("click",()=>startMode(state.mode));
function startMode(mode){state.mode=mode;state.index=0;state.score=0;state.selectedSyringe=null;state.selectedGauge=null;state.readyForNext=false;state.questionSet=shuffleArray(scenarios);showScreen("game");render()}
function goHome(){showScreen("home");clearFeedback()}
function showScreen(screen){homeScreen.classList.add("hidden");gameScreen.classList.add("hidden");resultsScreen.classList.add("hidden");if(screen==="home")homeScreen.classList.remove("hidden");if(screen==="game")gameScreen.classList.remove("hidden");if(screen==="results")resultsScreen.classList.remove("hidden")}
function render(){const scenario=state.questionSet[state.index]||scenarios[state.index],guide=routeGuides[scenario.route],syringe=syringeLibrary.find(s=>s.id===scenario.syringeType),gameGridEl=document.querySelector(".game-grid"),isTrayMode=state.mode==="tray";currentModeEl.textContent=modeLabels[state.mode];progressTextEl.textContent=`${state.index+1} / ${state.questionSet.length||scenarios.length}`;scoreTextEl.textContent=state.score;progressFillEl.style.width=`${state.index/(state.questionSet.length||scenarios.length)*100}%`;gameGridEl.classList.toggle("tray-layout",isTrayMode);feedbackBoxEl.classList.toggle("tray-feedback",isTrayMode);orderTextEl.textContent=scenario.order;medicationTextEl.textContent=scenario.medication;strengthTextEl.textContent=scenario.strength;bestSyringeTextEl.textContent=syringeDisplayName(syringe.id);routePillEl.textContent=scenario.route;siteFamilyTextEl.textContent=`${scenario.route} Site Family`;routeCueTextEl.textContent=guide.cue;angleTextEl.textContent=guide.angle;lengthTextEl.textContent=guide.length;siteMapTextEl.textContent=guide.siteMap;siteDiagramEl.innerHTML=guide.sites.map(site=>`<div class="site-chip"><div><div class="site-name">${site.name}</div><div class="site-meta">${site.meta}</div></div><div class="soft-label">${scenario.route}</div></div>`).join("");clearFeedback();state.selectedSyringe=null;state.selectedGauge=null;renderModePanel(scenario,syringe,guide)}

function renderBodyDiagram(route){
  if(route==="IM"){
    return `<div class="body-diagram-wrap">
      <div class="body-card">
        <div class="body-card-title">Front View</div>
        ${frontBodySVG([{x:126,y:66,cls:"im"},{x:92,y:145,cls:"im"},{x:160,y:145,cls:"im"}])}
      </div>
      <div class="site-legend">
        <div class="site-legend-item"><span class="site-dot im"></span><div><strong>Deltoid</strong><br><span>Upper arm muscle</span></div></div>
        <div class="site-legend-item"><span class="site-dot im"></span><div><strong>Vastus Lateralis</strong><br><span>Outer thigh muscle</span></div></div>
        <div class="site-legend-item"><span class="site-dot im"></span><div><strong>Ventrogluteal</strong><br><span>Hip area</span></div></div>
      </div>
    </div>`;
  }
  if(route==="SQ"){
    return `<div class="body-diagram-wrap">
      <div class="body-card">
        <div class="body-card-title">Front View</div>
        ${frontBodySVG([{x:88,y:92,cls:"sq"},{x:126,y:112,cls:"sq"},{x:160,y:145,cls:"sq"}])}
      </div>
      <div class="site-legend">
        <div class="site-legend-item"><span class="site-dot sq"></span><div><strong>Back of Upper Arm</strong><br><span>Fat tissue area</span></div></div>
        <div class="site-legend-item"><span class="site-dot sq"></span><div><strong>Lower Abdomen</strong><br><span>2 inches from navel</span></div></div>
        <div class="site-legend-item"><span class="site-dot sq"></span><div><strong>Top of Thigh</strong><br><span>Fat tissue area</span></div></div>
      </div>
    </div>`;
  }
  return `<div class="body-diagram-wrap">
    <div class="body-card">
      <div class="body-card-title">Common Test Sites</div>
      ${dualBodySVG()}
    </div>
    <div class="site-legend">
      <div class="site-legend-item"><span class="site-dot id"></span><div><strong>Forearm</strong><br><span>Most common for PPD</span></div></div>
      <div class="site-legend-item"><span class="site-dot id"></span><div><strong>Upper Chest</strong><br><span>Skin testing site</span></div></div>
      <div class="site-legend-item"><span class="site-dot id"></span><div><strong>Upper Back</strong><br><span>Between shoulder blades</span></div></div>
    </div>
  </div>`;
}

function frontBodySVG(markers){
  const dots = markers.map(m=>`<circle cx="${m.x}" cy="${m.y}" r="6.5" fill="${m.cls==="im"?"#f4c542":"#f26c4f"}" stroke="#fff" stroke-width="2"/>`).join("");
  return `<svg class="body-svg" viewBox="0 0 250 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="skinGradFront" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#f7dfcf"/><stop offset="100%" stop-color="#efc9b6"/></linearGradient></defs>
    <circle cx="125" cy="36" r="20" fill="url(#skinGradFront)" stroke="#d9b29d" stroke-width="2"/>
    <rect x="108" y="55" width="34" height="24" rx="12" fill="url(#skinGradFront)" stroke="#d9b29d" stroke-width="2"/>
    <rect x="90" y="76" width="70" height="74" rx="26" fill="url(#skinGradFront)" stroke="#d9b29d" stroke-width="2"/>
    <rect x="66" y="82" width="22" height="70" rx="11" fill="url(#skinGradFront)" stroke="#d9b29d" stroke-width="2"/>
    <rect x="162" y="82" width="22" height="70" rx="11" fill="url(#skinGradFront)" stroke="#d9b29d" stroke-width="2"/>
    <rect x="100" y="148" width="20" height="82" rx="10" fill="url(#skinGradFront)" stroke="#d9b29d" stroke-width="2"/>
    <rect x="130" y="148" width="20" height="82" rx="10" fill="url(#skinGradFront)" stroke="#d9b29d" stroke-width="2"/>
    ${dots}
  </svg>`;
}

function dualBodySVG(){
  return `<svg class="body-svg" viewBox="0 0 320 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="skinGradDual" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#f7dfcf"/><stop offset="100%" stop-color="#efc9b6"/></linearGradient></defs>
    <g transform="translate(20,0)">
      <circle cx="70" cy="36" r="18" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="55" y="54" width="30" height="22" rx="11" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="38" y="74" width="64" height="70" rx="24" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="18" y="82" width="18" height="66" rx="9" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="104" y="82" width="18" height="66" rx="9" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="48" y="142" width="18" height="76" rx="9" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="74" y="142" width="18" height="76" rx="9" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <circle cx="36" cy="118" r="6.5" fill="#7c94c7" stroke="#fff" stroke-width="2"/>
      <circle cx="70" cy="96" r="6.5" fill="#7c94c7" stroke="#fff" stroke-width="2"/>
    </g>
    <g transform="translate(170,0)">
      <circle cx="70" cy="36" r="18" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="55" y="54" width="30" height="22" rx="11" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="38" y="74" width="64" height="70" rx="24" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="18" y="82" width="18" height="66" rx="9" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="104" y="82" width="18" height="66" rx="9" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="48" y="142" width="18" height="76" rx="9" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <rect x="74" y="142" width="18" height="76" rx="9" fill="url(#skinGradDual)" stroke="#d9b29d" stroke-width="2"/>
      <circle cx="70" cy="92" r="6.5" fill="#7c94c7" stroke="#fff" stroke-width="2"/>
    </g>
  </svg>`;
}



function buildSiteChoices(route){
  const correctPool = routeGuides[route].sites.map(s => ({label:s.name, route, summary:s.meta, correct:true}));
  const correctChoice = shuffleArray(correctPool)[0];
  const distractors = [];
  Object.entries(routeGuides).forEach(([r,g]) => {
    if(r !== route){
      g.sites.forEach(s => distractors.push({label:s.name, route:r, summary:s.meta, correct:false}));
    }
  });
  const pickedDistractors = shuffleArray(distractors).slice(0,3);
  return shuffleArray([correctChoice, ...pickedDistractors]);
}

function renderModePanel(scenario,syringe,guide){
if(state.mode==="tray"){
    modePanelEl.className="panel interaction-panel tray-mode";
    const shuffledSyringes=shuffleArray(syringeLibrary),shuffledVials=shuffleArray(scenario.vials),shuffledGauges=shuffleArray(gaugeLibrary);
    modePanelEl.innerHTML=`
      <div class="tray-board">
        <div class="tray-section">
          <div class="tray-step">Step 1 • Syringe</div>
          <div class="tray-options compact-three">
            ${shuffledSyringes.map(item=>syringeCard(item)).join("")}
          </div>
        </div>
        <div class="tray-section">
          <div class="tray-step">Step 2 • Needle Gauge</div>
          <div class="tray-options compact-two">
            ${shuffledGauges.map(item=>`<button class="choice-btn gauge-option" data-gauge-id="${item.id}"><span class="choice-title">${item.label}</span></button>`).join("")}
          </div>
        </div>
        <div class="tray-section">
          <div class="tray-step">Step 3 • Vial</div>
          <div class="tray-options compact-two">
            ${shuffledVials.map(v=>vialCard(v,getVialColor(v))).join("")}
          </div>
        </div>
      </div>`;
    bindSyringeChoices(scenario);
    bindGaugeChoices(scenario);
    bindVialChoices(scenario);
    return
  }
if(state.mode==="calc"){modePanelEl.className="panel interaction-panel";modePanelEl.innerHTML=`<h3 class="section-title">Dose Challenge</h3><div class="mini-card" style="margin-bottom:14px;"><div class="route-icon ${scenario.route.toLowerCase()}">${guide.icon}</div><span class="mini-title">Prompt</span><p>Calculate the correct amount to draw for this order.</p></div><div class="slider-wrap"><label for="doseInput"><strong>Enter the correct amount</strong></label><input id="doseInput" type="text" placeholder="Example: 0.6 mL or 10 units" /><div class="draw-readout"><span>Use the vial strength shown on the prescription.</span><button id="submitDoseBtn" class="inline-btn">Check Answer</button></div></div>`;document.getElementById("submitDoseBtn").addEventListener("click",()=>{const val=document.getElementById("doseInput").value.trim().toLowerCase();if(!val)return showBad("Enter an answer first.","Add the exact amount to draw before checking.");if(normalizeDose(val)===normalizeDose(scenario.correctDose)){correctAdvance("Correct dose.",`${scenario.correctDose} is the correct amount for this prescription. ${scenario.explainCorrect}`)}else{showBad(`Not quite. Correct answer: ${scenario.correctDose}`,`Recheck the vial strength and ordered dose. ${scenario.explainCorrect}`)}});return}
if(state.mode==="sites"){
    modePanelEl.className="panel interaction-panel";
    const options=buildSiteChoices(scenario.route);
    modePanelEl.innerHTML=`<h3 class="section-title">Injection Site Practice</h3><div class="mini-card" style="margin-bottom:14px;"><span class="mini-title">Prompt</span><p>Select the best site for this route.</p></div><div class="choice-grid two">${options.map(opt=>`<button class="choice-btn site-option" data-site-route="${opt.route}" data-correct="${opt.correct}"><span class="choice-title">${opt.label}</span><span class="choice-sub">${opt.summary}</span></button>`).join("")}</div>`;
    document.querySelectorAll(".site-option").forEach(btn=>btn.addEventListener("click",()=>{
      if(btn.dataset.correct==="true"){
        btn.classList.add("selected-correct");
        correctAdvance("Correct site selected.", `${btn.querySelector('.choice-title').textContent} is an appropriate site for the ${scenario.route} route.`);
      }else{
        btn.classList.add("selected-wrong");
        showBad("Not quite.", `${btn.querySelector('.choice-title').textContent} is not the best match for the ${scenario.route} route in this scenario.`);
      }
    }));
    return
  }
modePanelEl.className="panel interaction-panel";const safetyOptions=shuffleArray(scenario.safetyOptions);modePanelEl.innerHTML=`<h3 class="section-title">Safety Check</h3><div class="mini-card" style="margin-bottom:14px;"><div class="route-icon ${scenario.route.toLowerCase()}">${guide.icon}</div><span class="mini-title">Scenario</span><p>${scenario.safetyPrompt}</p></div><div class="choice-grid two">${safetyOptions.map(opt=>`<button class="choice-btn safety-option" data-answer="${escapeHtml(opt)}"><span class="choice-title">${opt}</span></button>`).join("")}</div>`;document.querySelectorAll(".safety-option").forEach(btn=>btn.addEventListener("click",()=>{const answer=btn.dataset.answer;if(answer===scenario.safetyAnswer){btn.classList.add("selected-correct");correctAdvance("Correct safety issue identified.",`${scenario.safetyAnswer} is the best answer. ${scenario.explainCorrect}`)}else{btn.classList.add("selected-wrong");showBad(`Not quite. Correct answer: ${scenario.safetyAnswer}`,`This scenario is mainly about ${scenario.safetyAnswer.toLowerCase()}.`)}}))
}
function syringeDisplayName(id){if(id==="3ml")return"3 mL Syringe";if(id==="tuberculin")return"1 mL TB Syringe";if(id==="insulin")return"Unit Syringe";return id}
function syringeCard(item){return`<button class="choice-btn syringe-option" data-syringe-id="${item.id}"><div class="syringe-graphic">${renderSyringeSVG(item)}</div><span class="choice-title">${syringeDisplayName(item.id)}</span></button>`}
function renderSyringeSVG(item){if(item.id==="3ml"){return`<svg class="syringe-svg" viewBox="0 0 280 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="barrelGrad3" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#edf2f5"/></linearGradient><linearGradient id="plungerGrad3" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#d6dee3"/><stop offset="100%" stop-color="#b8c6cf"/></linearGradient></defs><line x1="12" y1="46" x2="30" y2="46" stroke="#8aa0ad" stroke-width="4" stroke-linecap="round"/><line x1="30" y1="46" x2="42" y2="46" stroke="#93a9b5" stroke-width="5" stroke-linecap="round"/><rect x="42" y="30" width="172" height="32" rx="12" fill="url(#barrelGrad3)" stroke="#889aa5" stroke-width="2.6"/>${Array.from({length:9},(_,i)=>{const x=58+i*16;return`<line x1="${x}" y1="34" x2="${x}" y2="58" stroke="#b8c8d3" stroke-width="2"/>`}).join("")}<rect x="214" y="24" width="24" height="44" rx="8" fill="url(#plungerGrad3)" stroke="#80939f" stroke-width="2.2"/><rect x="203" y="27" width="11" height="38" rx="5" fill="#edf2f5" stroke="#b8c6cf" stroke-width="1.4"/></svg>`}
if(item.id==="tuberculin"){return`<svg class="syringe-svg" viewBox="0 0 280 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="barrelGradtb" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#edf2f5"/></linearGradient><linearGradient id="plungerGradtb" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#d6dee3"/><stop offset="100%" stop-color="#b8c6cf"/></linearGradient></defs><line x1="16" y1="48" x2="38" y2="48" stroke="#8aa0ad" stroke-width="3" stroke-linecap="round"/><line x1="38" y1="48" x2="50" y2="48" stroke="#93a9b5" stroke-width="4" stroke-linecap="round"/><rect x="50" y="36" width="154" height="20" rx="8" fill="url(#barrelGradtb)" stroke="#889aa5" stroke-width="2.2"/>${Array.from({length:11},(_,i)=>{const x=63+i*11;return`<line x1="${x}" y1="38" x2="${x}" y2="54" stroke="#b8c8d3" stroke-width="1.8"/>`}).join("")}<rect x="204" y="31" width="18" height="30" rx="6" fill="url(#plungerGradtb)" stroke="#80939f" stroke-width="2"/><rect x="195" y="33" width="9" height="26" rx="4" fill="#edf2f5" stroke="#b8c6cf" stroke-width="1.2"/></svg>`}
return`<svg class="syringe-svg" viewBox="0 0 280 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="barrelGradins" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#edf2f5"/></linearGradient><linearGradient id="plungerGradins" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#d6dee3"/><stop offset="100%" stop-color="#b8c6cf"/></linearGradient></defs><line x1="16" y1="48" x2="28" y2="48" stroke="#f0a143" stroke-width="3" stroke-linecap="round"/><line x1="28" y1="48" x2="40" y2="48" stroke="#93a9b5" stroke-width="3" stroke-linecap="round"/><rect x="40" y="38" width="110" height="16" rx="7" fill="url(#barrelGradins)" stroke="#889aa5" stroke-width="2"/>${Array.from({length:10},(_,i)=>{const x=52+i*9;return`<line x1="${x}" y1="39" x2="${x}" y2="53" stroke="#b8c8d3" stroke-width="1.6"/>`}).join("")}<rect x="150" y="33" width="15" height="26" rx="5" fill="url(#plungerGradins)" stroke="#80939f" stroke-width="1.9"/><rect x="143" y="35" width="7" height="22" rx="3" fill="#edf2f5" stroke="#b8c6cf" stroke-width="1.1"/><circle cx="20" cy="48" r="4" fill="#f0a143"/></svg>`}
function vialCard(name,color){return`<button class="choice-btn vial-btn vial-option" data-vial-name="${escapeHtml(name)}"><div class="vial-graphic">${renderVialSVG(color,name)}</div><span class="choice-title">${name}</span><span class="choice-sub">Select this vial</span></button>`}
function renderVialSVG(color,name){return`<svg class="vial-svg" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="glassGrad-${safeId(name)}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#eef3f6"/></linearGradient><linearGradient id="capTop-${safeId(name)}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#d2dae0"/><stop offset="100%" stop-color="#aeb8c0"/></linearGradient><linearGradient id="metalBand-${safeId(name)}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#b6c2ca"/><stop offset="100%" stop-color="#8e9ba5"/></linearGradient></defs><ellipse cx="60" cy="20" rx="24" ry="9" fill="url(#capTop-${safeId(name)})" stroke="#a5b1b9" stroke-width="1.4"/><rect x="36" y="20" width="48" height="10" rx="4" fill="url(#metalBand-${safeId(name)})" stroke="#94a0a8" stroke-width="1"/><ellipse cx="60" cy="30" rx="24" ry="8" fill="#aeb8c0" opacity="0.85"/><path d="M34 38 C34 28, 42 24, 50 24 L70 24 C78 24, 86 28, 86 38 L86 118 C86 130, 76 138, 60 138 C44 138, 34 130, 34 118 Z" fill="url(#glassGrad-${safeId(name)})" stroke="#c1ccd3" stroke-width="3.5"/><path d="M45 62 C45 56, 49 52, 55 52 L65 52 C71 52, 75 56, 75 62 L75 104 C75 110, 71 114, 65 114 L55 114 C49 114, 45 110, 45 104 Z" fill="${color}" opacity="0.94"/><rect x="50" y="60" width="8" height="46" rx="4" fill="rgba(255,255,255,.18)"/><path d="M44 42 C41 46, 40 52, 40 60 L40 112 C40 123, 46 130, 54 134" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="5" stroke-linecap="round"/><rect x="42" y="118" width="36" height="11" rx="5.5" fill="#ffffff" opacity="0.95" stroke="#d6dee3" stroke-width="1"/><rect x="48" y="121" width="24" height="4" rx="2" fill="#e6ecef"/></svg>`}
function bindSyringeChoices(scenario){document.querySelectorAll(".syringe-option").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".syringe-option").forEach(x=>x.classList.remove("selected-correct","selected-wrong"));if(btn.dataset.syringeId===scenario.syringeType){btn.classList.add("selected-correct");state.selectedSyringe=btn.dataset.syringeId;showGood("Correct syringe selected.",scenario.explainCorrect)}else{btn.classList.add("selected-wrong");state.selectedSyringe=null;showBad(`Not quite. Best syringe: ${syringeDisplayName(scenario.syringeType)}`,scenario.explainWrongSyringe)}}))}
function bindGaugeChoices(scenario){document.querySelectorAll(".gauge-option").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".gauge-option").forEach(x=>x.classList.remove("selected-correct","selected-wrong"));const correct=correctGaugeId(scenario.route);if(btn.dataset.gaugeId===correct){btn.classList.add("selected-correct");state.selectedGauge=btn.dataset.gaugeId;showGood("Correct needle gauge selected.",`${btn.querySelector('.choice-title').textContent} is the training range used here for ${scenario.route} injections.`)}else{btn.classList.add("selected-wrong");state.selectedGauge=null;const right=gaugeLibrary.find(g=>g.id===correct);showBad("Not quite.",`${right.label} is the tray range used here for ${scenario.route} injections.`)}}))}
function bindVialChoices(scenario){document.querySelectorAll(".vial-option").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".vial-option").forEach(x=>x.classList.remove("selected-correct","selected-wrong"));if(!state.selectedSyringe||state.selectedSyringe!==scenario.syringeType){showBad("Choose the correct syringe first.","Verify the syringe before final medication preparation.");return}if(!state.selectedGauge||state.selectedGauge!==correctGaugeId(scenario.route)){showBad("Choose the correct needle gauge first.","The medication tray now includes syringe, gauge, and vial selection.");return}if(btn.dataset.vialName===scenario.medication){btn.classList.add("selected-correct");correctAdvance("Correct vial selected.",scenario.explainCorrect)}else{btn.classList.add("selected-wrong");showBad(`Not quite. Correct vial: ${scenario.medication}`,scenario.explainWrongVial)}}))}
function correctAdvance(message,explanation){
  state.score+=1;
  scoreTextEl.textContent=state.score;
  state.readyForNext=true;
  showGood(message, explanation, true);
}
function goToNextQuestion(){
  state.index+=1;
  if(state.index>=(state.questionSet.length||scenarios.length)){showResults()}else{render()}
}
function showResults(){showScreen("results");const total=(state.questionSet.length||scenarios.length),pct=Math.round(state.score/total*100);let rank="Beginner Injector";if(pct>=90)rank="Clinical Pro";else if(pct>=75)rank="Safe Injector";else if(pct>=60)rank="Emerging Injector";resultsTitleEl.textContent=rank;resultsBodyEl.textContent=`You scored ${state.score} out of ${total} in ${modeLabels[state.mode]}.`}
function showGood(message,explanation,showNext=false){feedbackBoxEl.innerHTML=`<div class="feedback good"><span class="feedback-title">Correct</span>${message}<span class="explain">${explanation||""}</span>${showNext?`<div class="feedback-actions"><button class="next-btn" id="nextQuestionBtn">Next Question</button></div>`:""}</div>`; if(showNext){document.getElementById("nextQuestionBtn").addEventListener("click", goToNextQuestion);}}
function showBad(message,explanation){feedbackBoxEl.innerHTML=`<div class="feedback bad"><span class="feedback-title">Try Again</span>${message}<span class="explain">${explanation||""}</span></div>`}
function clearFeedback(){feedbackBoxEl.innerHTML=""}
function normalizeDose(str){return str.replace(/\s+/g," ").trim().toLowerCase()}
function shuffleArray(arr){const copy=[...arr];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function getVialColor(name){const match=scenarios.find(s=>s.medication===name);return match?match.vialColor:"#d8e2e8"}
function safeId(str){return str.toLowerCase().replace(/[^a-z0-9]+/g,"-")}
function correctGaugeId(route){if(route==="IM")return"im";if(route==="SQ")return"sq";return"id"}
function escapeHtml(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
