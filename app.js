let index=0
let score=0

const game=document.getElementById("game")

function loadScenario(){

let s=scenarios[index]

game.innerHTML=`

<div class="card">

<h2>Prescription</h2>

<p>${s.order}</p>

<p><b>Route:</b> ${s.route}</p>

<p><b>Vial Strength:</b> ${s.concentration}</p>

</div>

<div class="card">

<h3>Select the correct vial</h3>

${s.vials.map(v=>`<div class="vial" onclick="selectVial('${v}')">${v}</div>`).join("")}

</div>

<div id="feedback"></div>

`

}

function selectVial(choice){

let s=scenarios[index]

let feedback=document.getElementById("feedback")

if(choice===s.medication){

score++

feedback.innerHTML=`<div class="card correct">Correct!</div>`

}else{

feedback.innerHTML=`<div class="card incorrect">Incorrect. Correct answer: ${s.medication}</div>`

}

setTimeout(next,1500)

}

function next(){

index++

if(index>=scenarios.length){

game.innerHTML=`

<div class="card">

<h2>Session Complete</h2>

<p>Score: ${score} / ${scenarios.length}</p>

<button onclick="restart()">Practice Again</button>

</div>

`

return

}

loadScenario()

}

function restart(){

index=0
score=0
loadScenario()

}

loadScenario()
