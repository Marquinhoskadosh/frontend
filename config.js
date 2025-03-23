const CAMPOS_RESERVA = [
    { id: "usuario", label: "Usuário", type: "text" },
    { id: "geracao", label: "Geração", type: "text" }, 
    { id: "sala", label: "Sala", type: "select", options: [
        "Sala de aula 1", "Sala de aula 2", "Auditório Restauração",
        "Auditório Start Kids", "Auditório Aliança", "Espaço Vida Nova"
    ]},
    { id: "data", label: "Data", type: "date" },
    { id: "periodo", label: "Período", type: "select", options: ["Manhã", "Tarde", "Noite"] }
];

export default CAMPOS_RESERVA;
