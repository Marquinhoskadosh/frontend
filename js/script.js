const senhaAdmin = "310356"; // Definir uma senha fixa (ou puxar do backend)

function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}-${mes}-${ano}`;
}

async function carregarReservas() {
    try {
        const response = await fetch("https://reserva-salas-production.up.railway.app/reservas");
        //const response = await fetch("https://reserva-salas-sx6r.onrender.com/reservas");
        
        const reservas = await response.json();
        const tabela = document.getElementById("tabela-reservas");
        tabela.innerHTML = "";

        reservas.forEach(reserva => {
            const row = tabela.insertRow();
            row.innerHTML = `
                <td>${reserva.usuario}</td>
                <td>${reserva.geracao}</td>
                <td>${reserva.sala}</td>
                <td>${formatarData(reserva.data)}</td>
                <td>${reserva.periodo}</td>
                <td>${reserva.motivo}</td>
                <td><button class="delete-btn" onclick="excluirReserva(${reserva.id})">Excluir</button></td>
            `;
        });
    } catch (error) {
        alert("Erro ao carregar reservas.");
    }
}

function validarSenhaStart(callback) {
    const senha = prompt("Digite a senha para continuar:");
    if (senha === senhaAdmin) {
        callback();
    } else {
        alert("Não tem a senha? Reserva de espaço com Pastora RAQUEL.");
    }
}

async function excluirReserva(id) {
    validarSenha(async () => {
        if (confirm("Tem certeza que deseja excluir esta reserva?")) {
            try {
                const response = await fetch("https://reserva-salas-production.up.railway.app/reservas", {
                //const response = await fetch("https://reserva-salas-sx6r.onrender.com/reservas", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id })
                });

                const responseText = await response.text();

                if (response.ok) {
                    alert("Reserva excluída com sucesso!");
                    carregarReservas();
                } else {
                    alert(responseText);
                }
            } catch (error) {
                alert("Erro de conexão com o servidor.");
            }
        }
    });
}

function definirDataMinima() {
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("data").setAttribute("min", hoje);
}

async function reservarSala() {
    const usuario = document.getElementById("usuario").value;
    const geracao = document.getElementById("geracao").value;
    const sala = document.getElementById("sala").value;
    const data = document.getElementById("data").value;
    const periodo = document.getElementById("periodo").value;
    const motivo = document.getElementById("motivo").value;

    if (!usuario || !geracao || !sala || !data || !periodo || !motivo) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const reserva = { usuario, geracao, sala, data, periodo, motivo };

    // Definir as salas que exigem validação de senha
    const salasRequerSenha = ["Auditório Start Kids"];

    // Se a sala precisar de validação de senha, chamar validarSenha
    if (salasRequerSenha.includes(sala)) {
        validarSenhaStart(async () => {
            await enviarReserva(reserva);
        });
    } else {
        await enviarReserva(reserva);
    }
}

// Função separada para enviar a reserva (para evitar repetição de código)
async function enviarReserva(reserva) {
    try {
        const response = await fetch("https://reserva-salas-production.up.railway.app/reservas", {
        //const response = await fetch("https://reserva-salas-sx6r.onrender.com/reservas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reserva)
        });

        const responseText = await response.text();

        if (response.ok) {
            alert("Reserva realizada com sucesso!");
            document.getElementById("reservaForm").reset();
        } else {
            alert(responseText);
        }
    } catch (error) {
        alert("Erro de conexão com o servidor.");
    }
}

window.onload = () => {
    definirDataMinima();
    if (document.getElementById("tabela-reservas")) {
        carregarReservas();
    }
};
