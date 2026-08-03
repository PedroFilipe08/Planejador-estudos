const META_SEMANAL = 25;
const TEMPO_POMODORO = 25 * 60;
const CORES = ["#4F7CFF", "#32C36C", "#FFB020", "#9B5DE5", "#F15BB5", "#00C2A8", "#FF6B6B", "#3A86FF"];
const $ = id => document.getElementById(id);

let materias = JSON.parse(localStorage.getItem("studyPlanner")) || [];
let segundos = TEMPO_POMODORO;
let intervalo = null;

const lista = $("listaMaterias");
const inputMateria = $("materia");
const inputHoras = $("horas");
const timer = $("timer");
const statusPomodoro = $("pomodoroStatus");
const botaoIniciar = $("startPomodoro");

function salvar() {
    localStorage.setItem("studyPlanner", JSON.stringify(materias));
}

function atualizarResumo() {
    const total = materias.reduce((soma, materia) => soma + Number(materia.horas), 0);
    const progresso = Math.min(total / META_SEMANAL * 100, 100);

    $("totalHoras").textContent = `${total}h`;
    $("porcentagem").textContent = `${progresso.toFixed(0)}%`;
    $("barra").style.width = `${progresso}%`;
}

function renderizarMaterias() {
    lista.innerHTML = materias.map((materia, indice) => `
        <div class="materia ${materia.concluida ? "concluida" : ""}">
            <div class="info">
                <div class="bolinha" style="background:${materia.cor}"></div>
                <div>
                    <div class="nome">${materia.nome}</div>
                    <div class="horas">${materia.horas} horas</div>
                </div>
            </div>
            <div class="acoes">
                <button class="concluir" data-acao="concluir" data-indice="${indice}" title="${materia.concluida ? "Marcar como pendente" : "Marcar como concluída"}">
                    <i class="fa-solid ${materia.concluida ? "fa-rotate-left" : "fa-check"}"></i>
                </button>
                <button class="editar" data-acao="editar" data-indice="${indice}" title="Editar matéria"><i class="fa-solid fa-pen"></i></button>
                <button class="excluir" data-acao="excluir" data-indice="${indice}" title="Excluir matéria"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`).join("");

    atualizarResumo();
    salvar();
}

function adicionarMateria() {
    const nome = inputMateria.value.trim();
    const horas = Number(inputHoras.value);

    if (!nome || horas <= 0) {
        alert(!nome ? "Digite uma matéria." : "Digite as horas estudadas.");
        return;
    }

    materias.push({ nome, horas, cor: CORES[Math.floor(Math.random() * CORES.length)], concluida: false });
    inputMateria.value = inputHoras.value = "";
    renderizarMaterias();
}

lista.addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao]");
    if (!botao) return;

    const indice = Number(botao.dataset.indice);
    const acao = botao.dataset.acao;

    if (acao === "concluir") materias[indice].concluida = !materias[indice].concluida;
    if (acao === "excluir" && confirm("Deseja excluir esta matéria?")) materias.splice(indice, 1);

    if (acao === "editar") {
        const nome = prompt("Nome da matéria:", materias[indice].nome);
        const horas = prompt("Horas estudadas:", materias[indice].horas);
        if (nome === null || horas === null) return;
        if (!nome.trim() || Number(horas) <= 0) return alert("Informe nome e horas válidos.");
        materias[indice] = { ...materias[indice], nome: nome.trim(), horas: Number(horas) };
    }

    renderizarMaterias();
});

$("adicionar").addEventListener("click", adicionarMateria);
[inputMateria, inputHoras].forEach(input => input.addEventListener("keydown", evento => {
    if (evento.key === "Enter") adicionarMateria();
}));

function exibirTempo() {
    const minutos = Math.floor(segundos / 60);
    timer.textContent = `${String(minutos).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`;
}

function pausarPomodoro() {
    clearInterval(intervalo);
    intervalo = null;
    if (segundos > 0 && segundos < TEMPO_POMODORO) statusPomodoro.textContent = "Pausado";
}

function iniciarPomodoro() {
    if (intervalo || segundos <= 0) return;
    statusPomodoro.textContent = "Sessão de foco em andamento";

    intervalo = setInterval(() => {
        segundos--;
        exibirTempo();
        if (!segundos) {
            pausarPomodoro();
            statusPomodoro.textContent = "Sessão concluída! Bom trabalho.";
            botaoIniciar.disabled = true;
        }
    }, 1000);
}

function reiniciarPomodoro() {
    pausarPomodoro();
    segundos = TEMPO_POMODORO;
    statusPomodoro.textContent = "Sessão de foco";
    botaoIniciar.disabled = false;
    exibirTempo();
}

botaoIniciar.addEventListener("click", iniciarPomodoro);
$("pausePomodoro").addEventListener("click", pausarPomodoro);
$("resetPomodoro").addEventListener("click", reiniciarPomodoro);

const botaoTema = $("darkMode");
function atualizarTema() {
    const escuro = document.body.classList.contains("dark");
    localStorage.setItem("tema", escuro ? "escuro" : "claro");
    botaoTema.innerHTML = `<i class="fa-solid fa-${escuro ? "sun" : "moon"}"></i>`;
}

if (localStorage.getItem("tema") === "escuro") document.body.classList.add("dark");
botaoTema.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    atualizarTema();
});

renderizarMaterias();
exibirTempo();
atualizarTema();
