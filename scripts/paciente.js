import { ApiConsultas } from "./funcoes/api.Consultas.js";

const apiConsulta = new ApiConsultas()


const pacientes = await apiConsulta.get('paciente')
const users = await apiConsulta.get('user')
const estados = await apiConsulta.get('estado')
let consultas = await apiConsulta.get('consulta')
const especialidades = await apiConsulta.get('especialidade')
const medicos = await apiConsulta.get('medico')
const vagas = await apiConsulta.get('vaga')

const userId = localStorage.getItem('Id')
const pacienteLogado = pacientes.find(paciente => paciente.userId === userId)


/**
 * ELEMENTOS DO DASHBOARD 
 */

//CÓDIGOS DOS ELEMENTOS DO SIDEBAR
//informação do paciente logado

document.getElementById('info-paciente-nome').textContent = pacienteLogado.nome

document.getElementById('info-paciente-SNS').textContent ='SNS: ' + pacienteLogado.SNS


//SECÇÃO DA VISÃO GERAL

document.getElementById('visao-paciente-nome').textContent ='Bem-vindo,  ' + pacienteLogado.nome
let proximaConsulta =''

await renderVisao()






//ABA PROXIMAS CONSULTAS

if(proximaConsulta.length === 0 ){
       document.getElementById('upcoming-list').innerHTML = renderEmptyState(
      '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
      'Sem consultas agendadas',
      'Não tem consultas futuras. Agende uma nova consulta agora.',
      'index.html',
      'Agendar Consulta'
    ) 
}else{
    document.getElementById('upcoming-list').innerHTML =''
    renderAppointmentCard(proximaConsulta,false,document.getElementById('upcoming-list'))
}
    




//ABA HISTORIA

let pacienteHistoria = consultas.filter(consulta => consulta.pacienteId === pacienteLogado.Id)

if(pacienteHistoria.length === 0){
    document.getElementById('history-list').innerHTML = renderEmptyState(
      '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
      'Histórico vazio',
      'Ainda não tem consultas realizadas ou canceladas.'
    );
}else{
    document.getElementById('history-list').innerHTML = ''
    renderAppointmentCard(pacienteHistoria,true, document.getElementById('history-list'))
}




//SECÇÃO DE FUNCÕES 

function renderAppointmentRow(cons) {
  
    

  cons.forEach(apt => {
        const cfg = statusConfig[estados.find(estado => estado.Id === apt.estadoId).estado];

        const newElement = document.createElement('div')
        newElement.classList = 'px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors'

        newElement.innerHTML =`<div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0"></div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 truncate">${especialidades.find(sp => sp.Id === apt.especialidadeId).especialidade}</p>
        <p class="text-xs text-gray-500 truncate">Dr. ${medicos.find(medico => medico.Id === apt.medicoId).nome}</p>
      </div>
      <div class="text-right shrink-0">
        <p class="text-xs font-semibold text-gray-700">${new Date(vagas.find(vaga => vaga.Id === apt.vagaId).hora).toLocaleDateString('pt-BR', {
            weekday: 'long',  // "sexta-feira"
            day: 'numeric',   // "5"
            month: 'long',    // "junho"
            year: 'numeric',   // "2026"
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })}</p>
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.color}">
          <span class="w-1.5 h-1.5 rounded-full ${cfg.dot}"></span>
          ${cfg.label}
        </span>
      </div>`

      document.getElementById('recent-appointments-list').appendChild(newElement)
  });
}


// ===== RENDER APPOINTMENT CARD (upcoming/history) =====
function renderAppointmentCard(cons, showDownload,content) {

  cons.forEach(apt =>{
    const cfg = statusConfig[estados.find(estado => estado.Id === apt.estadoId).estado];

    const newElement = document.createElement('div')
    newElement.classList = '"bg-white rounded-2xl card-shadow overflow-hidden'

    const notesHtml = apt.notes
    ? `<div class="mt-3 bg-gray-50 rounded-xl px-3 py-2"><p class="text-xs text-gray-500">${apt.notes}</p></div>`
    : '';
  const downloadBtn = (showDownload && estados.find(estado => estado.Id === apt.estadoId).estado === 'realizada')
    ? `<button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C0152B] border border-[#C0152B]/30 rounded-lg hover:bg-red-50 transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Comprovativo
       </button>`
    : '';
  const cancelBtn = (estados.find(estado => estado.Id === apt.estadoId).estado === 'confirmado' || estados.find(estado => estado.Id === apt.estadoId).estado === 'pendente')
    ? `<button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors" onclick ="cancelarConsulta('${apt.Id}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
        Cancelar
       </button>`
    : '';

    newElement.innerHTML = `<div class="p-4 sm:p-5">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl shrink-0"></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p class="font-bold text-gray-900">${especialidades.find(sp => sp.Id === apt.especialidadeId).especialidade}</p>
                <p class="text-sm text-gray-600">${medicos.find(medico => medico.Id === apt.medicoId).nome}</p>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg?.color}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${cfg?.iconPath}</svg>
                ${cfg?.label}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>${new Date(vagas.find(vaga => vaga.Id === apt.vagaId).hora).toLocaleDateString('pt-BR', {
                    weekday: 'long',  // "sexta-feira"
                    day: 'numeric',   // "5"
                    month: 'long',    // "junho"
                    year: 'numeric',   // "2026"
            })}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="font-semibold font-tabular">${new Date(vagas.find(vaga => vaga.Id === apt.vagaId).hora).toLocaleDateString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="truncate">Hospital Público Central</span>
              </div>
            </div>

            ${notesHtml}
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
          <p class="text-xs text-gray-400 font-tabular"></p>
          <div class="flex items-center gap-2">
            ${downloadBtn}
            ${cancelBtn}
          </div>
        </div>
      </div>`

      content.appendChild(newElement)
  })

}

async function cancelarConsulta(id){
    if(!id) return
    const data ={
        estadoId : estados.find(estado => estado.estado === 'cancelado').Id
    }
    const updateConc = await apiConsulta.update('consulta',{
        id,
        data
    })

    if(!updateConc || updateConc == undefined) return

    const novasCconsultas = await apiConsulta.get('consulta')

    
    

    proximaConsulta = novasCconsultas.filter(consulta => consulta.pacienteId === pacienteLogado.Id && (consulta.estadoId !== estados.find(estado => estado.estado === 'cancelado').Id && consulta.estadoId !== estados.find(estado => estado.estado === 'realizada').Id))

    pacienteHistoria = novasCconsultas.filter(consulta => consulta.pacienteId === pacienteLogado.Id)

    document.getElementById('history-list').innerHTML = ''
    renderAppointmentCard(pacienteHistoria,true, document.getElementById('history-list'))

    document.getElementById('upcoming-list').innerHTML =''
    renderAppointmentCard(proximaConsulta,false,document.getElementById('upcoming-list'))
    renderVisao()
}

async function renderVisao() {

  consultas = await apiConsulta.get('consulta')
      //VISAO GERAL ESTATISTICAS 
    document.getElementById('visao-total-consulta').textContent =consultas.filter(consulta => consulta.pacienteId === pacienteLogado.Id).length

    document.getElementById('visao-total-realizada').textContent =consultas.filter(consulta => consulta.pacienteId === pacienteLogado.Id && consulta.estadoId === estados.find(estado => estado.estado === 'realizada').Id).length

    document.getElementById('visao-total-agendada').textContent =consultas.filter(consulta => consulta.pacienteId === pacienteLogado.Id && (consulta.estadoId === estados.find(estado => estado.estado === 'confirmado').Id || consulta.estadoId === estados.find(estado => estado.estado === 'pendente').Id)).length

    document.getElementById('visao-total-cancelada').textContent =consultas.filter(consulta => consulta.pacienteId === pacienteLogado.Id && consulta.estadoId === estados.find(estado => estado.estado === 'cancelado').Id).length

    


    

    proximaConsulta = consultas.filter(consulta => consulta.pacienteId === pacienteLogado.Id && (consulta.estadoId !== estados.find(estado => estado.estado === 'cancelado').Id && consulta.estadoId !== estados.find(estado => estado.estado === 'realizada').Id))

    //VISAO GERAL PROXIMA CONSULTA
    const prConsulta = consultas.find(consulta =>{
      let data = ''
      let vg = ''
      proximaConsulta.find(pr =>{
        if (data === '') {
          data = new Date(vagas.find(vaga => vaga.Id === pr.vagaId).hora)
        }
        if( data >= new Date(vagas.find(vaga => vaga.Id === pr.vagaId).hora)){
          data = new Date(vagas.find(vaga => vaga.Id === pr.vagaId).hora)
          vg = vagas.find(vaga => vaga.Id === pr.vagaId)
        }
          
      })
      return consulta.vagaId === vg.Id
    })

    const cfg = statusConfig[estados.find(estado => estado.Id === prConsulta.estadoId).estado];

    

    document.getElementById('visao-pr-ep').textContent = especialidades.find(sp => sp.Id === prConsulta.especialidadeId).especialidade// pegar a especialidade da proxima consulta

    document.getElementById('visao-pr-dr').textContent = 'Dr. ' + medicos.find(medico => medico.Id === prConsulta.medicoId).nome // pegar o nome do dotor

    document.getElementById('visao-pr-hora').textContent = new Date(vagas.find(vaga => vaga.Id === prConsulta.vagaId).hora).toLocaleString("pt-BR", {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })// pegar a hora da consulta

  document.getElementById('visao-pr-data').textContent = new Date(vagas.find(vaga => vaga.Id === prConsulta.vagaId).hora).toLocaleString("pt-BR", {
    day: 'numeric',   // "5"
      month: 'short',    // "junho"
      year: 'numeric'   // "2026"
  })// pegar a data da proxima consulta


    document.getElementById('visao-pr-estado').innerHTML =` <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold  ${cfg.color}">
      <span class="w-1.5 h-1.5 rounded-full ${cfg.dot}"></span>
      ${cfg.label}
    </span>`



    //VISAO GERAL CONSULTAS RECENTE
    if(proximaConsulta.length === 0 ){
          document.getElementById('upcoming-list').innerHTML =''
          document.getElementById('upcoming-list').innerHTML = renderEmptyState(
          '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
          'Sem consultas agendadas',
          'Não tem consultas futuras. Agende uma nova consulta agora.',
          'index.html',
          'Agendar Consulta'
        ) 
    }else{
      document.getElementById('upcoming-list').innerHTML =''
      renderAppointmentRow(proximaConsulta)
    }
        
}

window.cancelarConsulta = cancelarConsulta
window.renderAppointmentRow = renderAppointmentRow