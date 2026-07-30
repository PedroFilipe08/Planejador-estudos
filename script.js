
// =====================================
// DADOS INICIAIS
// =====================================


let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [

    {
        texto:"Estudar Matemática",
        prioridade:"Alta",
        concluida:true
    },

    {
        texto:"Fazer resumo de História",
        prioridade:"Média",
        concluida:false
    },

    {
        texto:"Resolver exercícios de Física",
        prioridade:"Alta",
        concluida:false
    },

    {
        texto:"Organizar materiais",
        prioridade:"Baixa",
        concluida:true
    }

];



let disciplinas =
JSON.parse(localStorage.getItem("disciplinas")) || [

    {
        nome:"Matemática",
        horas:4
    },

    {
        nome:"História",
        horas:3
    },

    {
        nome:"Português",
        horas:2
    },

    {
        nome:"Física",
        horas:3
    }

];



let eventos =
JSON.parse(localStorage.getItem("eventos")) || [

    {
        data:"2026-07-10",
        texto:"Prova de Matemática"
    },

    {
        data:"2026-07-15",
        texto:"Entrega do trabalho"
    }

];



let horasEstudadas = disciplinas.reduce(
    (total,d)=>total+d.horas,
    0
);



let graficoTarefas;

let graficoHoras;





// =====================================
// NAVEGAÇÃO
// =====================================


function rolarTarefas(){

    document
    .getElementById("tarefas")
    .scrollIntoView({
        behavior:"smooth"
    });

}





// =====================================
// TAREFAS
// =====================================


function adicionarTarefa(){


    let texto =
    document
    .getElementById("tarefaInput")
    .value.trim();



    let prioridade =
    document
    .getElementById("prioridade")
    .value;



    if(texto===""){

        alert("Digite uma tarefa.");

        return;

    }



    tarefas.push({

        texto:texto,

        prioridade:prioridade,

        concluida:false

    });



    salvarDados();



    document
    .getElementById("tarefaInput")
    .value="";



    atualizarTela();

}





function concluirTarefa(index){


    tarefas[index].concluida =
    !tarefas[index].concluida;


    salvarDados();

    atualizarTela();

}




function removerTarefa(index){


    tarefas.splice(index,1);


    salvarDados();

    atualizarTela();

}





function mostrarTarefas(){


    let lista =
    document.getElementById("listaTarefas");


    lista.innerHTML="";



    tarefas.forEach((tarefa,index)=>{


        let item =
        document.createElement("li");



        if(tarefa.concluida){

            item.classList.add("concluida");

        }



        item.innerHTML=`


        <span>

        <strong>${tarefa.prioridade}</strong>

        -

        ${tarefa.texto}

        </span>


        <div>


        <button onclick="concluirTarefa(${index})">

        ✓

        </button>



        <button onclick="removerTarefa(${index})">

        🗑

        </button>


        </div>


        `;



        lista.appendChild(item);


    });


}





// =====================================
// PLANEJAMENTO
// =====================================


function adicionarDisciplina(){


    let nome =
    document
    .getElementById("disciplina")
    .value.trim();



    let horas =
    Number(
    document.getElementById("horas").value
    );



    if(nome==="" || horas<=0){

        alert("Preencha os dados.");

        return;

    }



    disciplinas.push({

        nome:nome,

        horas:horas

    });



    salvarDados();


    document.getElementById("disciplina").value="";

    document.getElementById("horas").value="";



    atualizarTela();


}





function mostrarDisciplinas(){


    let tabela =
    document.getElementById("cronograma");



    tabela.innerHTML="";



    disciplinas.forEach(d=>{


        tabela.innerHTML += `

        <tr>

        <td>${d.nome}</td>

        <td>${d.horas}h</td>

        </tr>

        `;


    });


}






// =====================================
// CALENDÁRIO
// =====================================


function adicionarEvento(){


    let data =
    document.getElementById("dataEvento")
    .value;



    let texto =
    document.getElementById("evento")
    .value.trim();



    if(data==="" || texto===""){

        alert("Preencha os campos.");

        return;

    }



    eventos.push({

        data:data,

        texto:texto

    });



    salvarDados();


    atualizarTela();



}





function mostrarEventos(){


    let lista =
    document.getElementById("listaEventos");



    lista.innerHTML="";



    eventos.forEach(e=>{


        lista.innerHTML += `

        <li>

        📅 <strong>${e.data}</strong>

        -

        ${e.texto}

        </li>

        `;


    });


}





// =====================================
// ESTATÍSTICAS
// =====================================


function atualizarEstatisticas(){


    let concluidas =
    tarefas.filter(
        t=>t.concluida
    ).length;



    let total =
    tarefas.length;



    let porcentagem=0;



    if(total>0){

        porcentagem =
        Math.round(
            (concluidas/total)*100
        );

    }



    horasEstudadas =
    disciplinas.reduce(
        (s,d)=>s+d.horas,
        0
    );



    document
    .getElementById("totalConcluidas")
    .textContent=concluidas;



    document
    .getElementById("horasEstudo")
    .textContent=horasEstudadas;



    document
    .getElementById("percentual")
    .textContent=
    porcentagem+"%";


}





// =====================================
// GRÁFICOS
// =====================================


function criarGraficos(){


    if(graficoTarefas){

        graficoTarefas.destroy();

    }


    if(graficoHoras){

        graficoHoras.destroy();

    }



    let concluidas =
    tarefas.filter(
        t=>t.concluida
    ).length;



    let pendentes =
    tarefas.length-concluidas;



    graficoTarefas =
    new Chart(

    document
    .getElementById("graficoTarefas"),

    {

    type:"doughnut",

    data:{


    labels:[

    "Concluídas",

    "Pendentes"

    ],


    datasets:[{


    data:[

    concluidas,

    pendentes

    ],


    backgroundColor:[

    "#1565c0",

    "#90caf9"

    ]


    }]


    }

    });



    graficoHoras =
    new Chart(

    document
    .getElementById("graficoHoras"),


    {


    type:"bar",


    data:{


    labels:

    disciplinas.map(
        d=>d.nome
    ),


    datasets:[{

    label:"Horas",

    data:

    disciplinas.map(
        d=>d.horas
    ),


    backgroundColor:"#1976d2"


    }]


    }


    });


}







// =====================================
// POMODORO
// =====================================


let tempo =
25*60;


let intervalo=null;



function atualizarTimer(){


    let minutos =
    Math.floor(tempo/60);



    let segundos =
    tempo%60;



    segundos =
    segundos<10
    ?"0"+segundos
    :segundos;



    document
    .getElementById("timer")
    .textContent=
    `${minutos}:${segundos}`;


}





function iniciarPomodoro(){


    if(intervalo)
    return;



    intervalo =
    setInterval(()=>{


        if(tempo>0){

            tempo--;

            atualizarTimer();

        }

        else{

            clearInterval(intervalo);

            intervalo=null;

            alert(
            "Pomodoro finalizado!"
            );

        }


    },1000);


}




function pausarPomodoro(){


    clearInterval(intervalo);

    intervalo=null;


}




function reiniciarPomodoro(){


    clearInterval(intervalo);


    intervalo=null;


    tempo=25*60;


    atualizarTimer();


}





// =====================================
// SALVAR
// =====================================


function salvarDados(){


localStorage.setItem(
"tarefas",
JSON.stringify(tarefas)
);



localStorage.setItem(
"disciplinas",
JSON.stringify(disciplinas)
);



localStorage.setItem(
"eventos",
JSON.stringify(eventos)
);


}






// =====================================
// ATUALIZAÇÃO GERAL
// =====================================


function atualizarTela(){


    mostrarTarefas();

    mostrarDisciplinas();

    mostrarEventos();

    atualizarEstatisticas();

    criarGraficos();

}





window.onload=function(){


    atualizarTela();

    atualizarTimer();


};
