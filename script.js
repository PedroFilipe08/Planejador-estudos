// ==========================
// CONFIGURAÇÕES
// ==========================

const META_SEMANAL = 25;

let materias = JSON.parse(localStorage.getItem("studyPlanner")) || [];

// ==========================
// ELEMENTOS
// ==========================

const lista = document.getElementById("listaMaterias");
const totalHoras = document.getElementById("totalHoras");
const porcentagem = document.getElementById("porcentagem");
const barra = document.getElementById("barra");

const inputMateria = document.getElementById("materia");
const inputHoras = document.getElementById("horas");

const btnAdicionar = document.getElementById("adicionar");
const btnDark = document.getElementById("darkMode");

// ==========================
// CORES
// ==========================

const cores = [
    "#4F7CFF",
    "#32C36C",
    "#FFB020",
    "#9B5DE5",
    "#F15BB5",
    "#00C2A8",
    "#FF6B6B",
    "#3A86FF"
];

// ==========================
// SALVAR
// ==========================

function salvar() {

    localStorage.setItem(
        "studyPlanner",
        JSON.stringify(materias)
    );

}

// ==========================
// TOTAL
// ==========================

function atualizarResumo(){

    let total = 0;

    materias.forEach(m =>{

        total += Number(m.horas);

    });

    totalHoras.textContent = total + "h";

    let progresso = (total / META_SEMANAL) * 100;

    if(progresso > 100)
        progresso = 100;

    porcentagem.textContent = progresso.toFixed(0) + "%";

    barra.style.width = progresso + "%";

}

// ==========================
// RENDER
// ==========================

function render(){

    lista.innerHTML = "";

    materias.forEach((materia,index)=>{

        lista.innerHTML += `

<div class="materia">

<div class="info">

<div
class="bolinha"
style="background:${materia.cor}">
</div>

<div>

<div class="nome">
${materia.nome}
</div>

<div class="horas">
${materia.horas} horas
</div>

</div>

</div>

<div class="acoes">

<button
class="editar"
onclick="editar(${index})">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="excluir"
onclick="remover(${index})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

    });

    atualizarResumo();

    salvar();

}

// ==========================
// ADICIONAR
// ==========================

btnAdicionar.onclick = ()=>{

    const nome = inputMateria.value.trim();

    const horas = Number(inputHoras.value);

    if(nome == ""){

        alert("Digite uma matéria.");

        return;

    }

    if(horas <= 0){

        alert("Digite as horas estudadas.");

        return;

    }

    materias.push({

        nome,

        horas,

        cor: cores[Math.floor(Math.random()*cores.length)]

    });

    inputMateria.value="";

    inputHoras.value="";

    render();

}

// ==========================
// REMOVER
// ==========================

function remover(index){

    if(confirm("Deseja excluir esta matéria?")){

        materias.splice(index,1);

        render();

    }

}

// ==========================
// EDITAR
// ==========================

function editar(index){

    let novoNome = prompt(
        "Nome da matéria:",
        materias[index].nome
    );

    if(novoNome===null)
        return;

    let novasHoras = prompt(
        "Horas estudadas:",
        materias[index].horas
    );

    if(novasHoras===null)
        return;

    materias[index].nome = novoNome;

    materias[index].horas = Number(novasHoras);

    render();

}

// ==========================
// TEMA
// ==========================

if(localStorage.getItem("tema")=="escuro"){

    document.body.classList.add("dark");

    btnDark.innerHTML='<i class="fa-solid fa-sun"></i>';

}

btnDark.onclick=()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("tema","escuro");

        btnDark.innerHTML='<i class="fa-solid fa-sun"></i>';

    }else{

        localStorage.setItem("tema","claro");

        btnDark.innerHTML='<i class="fa-solid fa-moon"></i>';

    }

}

// ==========================
// ENTER
// ==========================

inputHoras.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        btnAdicionar.click();

    }

});

inputMateria.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        btnAdicionar.click();

    }

});

// ==========================
// INICIAR
// ==========================

render();

render();



// COLAR O POMODORO AQUI
