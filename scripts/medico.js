
import { ApiConsultas } from "./funcoes/api.Consultas.js";

const  apiConsulta = new ApiConsultas()
const medico = await apiConsulta.get('medico')
const consultas = await apiConsulta.get('consulta')


/**
 * CÓDIGOS RELACIONADOS A PÁGINA DE MÉDICO
 * DASHBOARD.
 */

//header elementos html
const headerInitials = document.getElementById('header-initials');//elemento onde as iniciais do médico são exibidas

//cards elementos html
const totalConsultaHoje =  document.getElementById('total-consulta-hoje')//elemento onde o total de consultas do dia é exibido
const totalConsultaRealizada = document.getElementById('total-consulta-h-realizada')//elemento onde o total de consultas realizadas do dia é exibido

const totalConsultaMes = document.getElementById('total-consulta-mes')//elemento onde o total de consultas do mês é exibido
const totalConsultaMesTrend = document.getElementById('total-consulta-mes-trend')//elemento onde a tendência do mês é exibida

const totalPaciente = document.getElementById('total-paciente')//elemento onde o total de pacientes é exibido

//card proximas consultas agendada
const proximaConsultaInfo = document.getElementById('proxima-consulta-info')//elemento onde as informações da próxima consulta agendada são exibidas
const proximaConsultaInfo2 = document.getElementById('proxima-consulta-info-2')//elemento onde as informações da próxima consulta agendada são exibidas

//listar consultas do dia
const consultaHData = document.getElementById('consulta-h-data')//elemento onde a data das consultas do dia é exibida
const dashboardSchedule = document.getElementById('dashboard-schedule')//elemento onde as consultas do dia são listadas

/**
 * corpo do código para carregar os dados do médico e das consultas, e atualizar os elementos html correspondentes.
 */

const typeUser = sessionStorage.getItem('typeUser')//pega o tipo  de usuário logado

if(typeUser === 'medico'){
    const medicoId = sessionStorage.getItem('Id')//pega o id do médico logado
    const NomeUsuario = sessionStorage.getItem('NomeUsuario')//pega o nome do médico logado

    //atualiza as iniciais do médico no header
    headerInitials.innerText = NomeUsuario.split(' ').map(n => n[0]).join('')
    console.log(headerInitials.innerText)
    console.log(NomeUsuario)
}

const NomeUsuario = sessionStorage.getItem('NomeUsuario')//pega o nome do médico logado

console.log(NomeUsuario)
