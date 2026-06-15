
import { ApiConsultas } from "./funcoes/api.Consultas.js";

const apiConsulta = new ApiConsultas()
const medico = (await apiConsulta.get('medico')) || []
const consultas = (await apiConsulta.get('consulta')) || []
const especialidades = (await apiConsulta.get('especialidade')) || []
const vaga = (await apiConsulta.get('vaga')) || []
const estado = (await apiConsulta.get('estado')) || []
const paciente = (await apiConsulta.get('paciente')) || []
const users = (await apiConsulta.get('user')) || []


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

//side bar
const sidebarName= document.getElementById('sidebar-name')//elemento onde o nome do médico é exibido na sidebar
const sidebarSpecialty = document.getElementById('sidebar-specialty')//elemento onde a especialidade do médico é exibida na sidebar
const btnSairMedico = document.getElementById('btn-sair-medico')//elemento do botão de sair da conta

/**
 * corpo do código para carregar os dados do médico e das consultas, e atualizar os elementos html correspondentes.
 */

const typeUser = localStorage.getItem('typeUser')
const currentUserId = localStorage.getItem('Id')
let medicoLogado = medico.find(item => item.userId === currentUserId)
const medicoId = medicoLogado?.Id
console.log('medico logado:',medicoId);


if(!typeUser || !currentUserId){
    window.location.href = '../sign-up-login-screen.html'
}

if(typeUser === 'medico'){
    const NomeUsuario = localStorage.getItem('NomeUsuario') || 'Médico'

    headerInitials.innerText = NomeUsuario.split(' ').map(n => n[0]).join('')
}

sidebarName.innerText = `${sidebarName.innerText} ${medicoLogado?.nome || 'Médico'}`
sidebarSpecialty.innerText = especialidades.find(item => item.Id === medicoLogado?.especialidadeId)?.especialidade || 'Especialidade'

btnSairMedico.addEventListener('click',()=>{
    localStorage.removeItem('Id')
    localStorage.removeItem('NomeUsuario')
    localStorage.removeItem('typeUser')
    window.location.href = '../sign-up-login-screen.html'
})

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const STATUS_CONFIG = {
  confirmado: { label: 'Confirmada', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  realizada:  { label: 'Realizada',  color: 'bg-blue-100 text-blue-700',  dot: 'bg-blue-500' },
  cancelado:  { label: 'Cancelada',  color: 'bg-red-100 text-red-700',    dot: 'bg-red-400' },
  pendente:    { label: 'Pendente',   color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
};

function formatDatePT(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

//código dos cards e das consultas do dia ainda em desenvolvimento, pois depende de mais dados da API para ser implementado corretamente.




const consultasDoMedico = consultas.filter(item => item.medicoId === medicoId)
const vagasHoje = vaga.filter(item => item.medicoId === medicoId && new Date(item.data).toDateString() === new Date().toDateString())
const vagaHojeId = vagasHoje[0]?.Id


totalConsultaHoje.innerText = consultasDoMedico.filter(item => item.vagaId === vagaHojeId).length

totalConsultaRealizada.innerText = `${consultasDoMedico.filter(item => item.vagaId === vagaHojeId && item.statusId === estado.find(e => e.estado === 'realizada')?.Id).length} realizadas`

totalConsultaMes.innerText = consultasDoMedico.filter(item => item.vagaId === vagaHojeId).length

totalPaciente.innerText = consultasDoMedico.length || '0'

const consultaMaisProxima = consultasDoMedico.find(item => item.vagaId === vagaHojeId)
const pacienteProxima = paciente.find(item => item.Id === consultaMaisProxima?.pacienteId)

proximaConsultaInfo.innerHTML =`<p class="text-xl font-black font-tabular">${vagaHojeId ? new Date(vaga.find(item => item.Id === vagaHojeId)?.hora).getHours() : '--'}:${vagaHojeId ? new Date(vaga.find(item => item.Id === vagaHojeId)?.hora).getMinutes().toString().padStart(2, '0') : '--'}</p>
                <p class="text-red-200 text-xs mt-0.5">Hoje, ${new Date().getDate()} de ${MONTHS_PT[new Date().getMonth()]} de ${new Date().getFullYear()}</p>
                <div class="border-t border-red-400/30 mt-3 pt-3">
                  <p class="text-sm font-bold">${pacienteProxima?.nome || 'Paciente não encontrado'}</p>
                  <p class="text-xs text-red-200 mt-0.5">${especialidades.find(item => item.Id === medicoLogado?.especialidadeId)?.especialidade || 'Especialidade'} · Consulta de rotina</p>
                </div>`

proximaConsultaInfo2.innerHTML = `<div class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                <span class="text-xs text-gray-500">Nº SNS</span>
                <span class="text-xs font-semibold text-gray-800 font-tabular">${pacienteProxima?.SNS || 'Nº SNS não encontrado'}</span>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                <span class="text-xs text-gray-500">Telemóvel</span>
                <span class="text-xs font-semibold text-gray-800 font-tabular">${pacienteProxima?.phone || 'Sem telefone'}</span>
              </div>`

//listar consulta do dia
consultaHData.innerText = `Consultas de ${new Date().getDate()} de ${MONTHS_PT[new Date().getMonth()]} de ${new Date().getFullYear()}`

const listConsultasHoje = consultasDoMedico.filter(item => item.vagaId === vagaHojeId)



if(listConsultasHoje.length > 0) {
listConsultasHoje.forEach(consulta => {
    const cfg = STATUS_CONFIG[(estado.find(item => item.Id === consulta.statusId)?.estado) || 'pending'] || STATUS_CONFIG['pending'];
    const row = document.createElement('div');
    row.className = 'px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors';
    row.innerHTML = `
      <div class="text-sm font-bold text-gray-700 font-tabular w-12 shrink-0">${new Date(vaga.find(item => item.Id === consulta.vagaId)?.hora ).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
})}</div>
      <div class="w-2 h-2 rounded-full shrink-0 ${cfg.dot}"></div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 truncate">${paciente.find(item => item.Id === consulta.pacienteId)?.nome || 'Paciente não encontrado'}</p>
        <p class="text-xs text-gray-500 truncate">${especialidades.find(item => item.Id === medico.find(m => m.userId === localStorage.getItem('Id'))?.especialidadeId)?.especialidade || 'Especialidade não encontrada'}</p>
      </div>
      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.color}">${cfg.label}</span>
    `;
    dashboardSchedule.appendChild(row);

})}else{
   dashboardSchedule.innerHTML = `<div  class=" bg-white rounded-2xl card-shadow p-12 text-center">
        <div class="text-5xl mb-4">🔍</div>
        <p class="text-gray-500 text-sm">Nenhuma consulta encontrada</p>
      </div>`//exibe a mensagem de "nenhuma consulta encontrada" caso não haja consultas para o médico logado
      
  
}
/**
 * Area do código para consultas medico, ainda em desenvolvimento, pois depende de mais dados da API para ser implementado corretamente.
 */
//elementos html para a área de consultas do médico
const consultasList = document.getElementById('consultas-list')//elemento onde as consultas do médico são listadas

const consultasEmpty = document.getElementById('consultas-empty')//elemento onde a mensagem de "nenhuma consulta encontrada" é exibida, caso não haja consultas para o médico logado

/**
 * secção da aba do medico para ver a consulta
 */


//elementos html do cabeçalho para pesquisar consultas

//inputs e buttons
const searchConsulta = document.querySelector('input[name="searchConsulta"]')//botão para filtrar todas as consultas
const todasConsultas = document.querySelector('button[name="todasConsultas"]')//botão para filtrar todas as consultas
const confirmadasConsultas = document.querySelector('button[name="confirmadasConsultas"]')//botão para filtrar consultas confirmadas
const realizadasConsultas = document.querySelector('button[name="realizadasConsultas"]')//botão para filtrar consultas realizadas
const canceladasConsultas = document.querySelector('button[name="canceladasConsultas"]')//botão para filtrar consultas canceladas
const pendentesConsultas = document.querySelector('button[name="pendentesConsultas"]')//botão para filtrar consultas pendentes


let medicoConsulta = consultasDoMedico

function renderApiConsultas() {
    consultasList.innerHTML = '';

    if (medicoConsulta.length === 0) {
        consultasList.classList.add('hidden');
        consultasEmpty.classList.remove('hidden');
        return;
    }

    consultasList.classList.remove('hidden');
    consultasEmpty.classList.add('hidden');

    medicoConsulta.forEach(consulta => {
        const cfg = STATUS_CONFIG[(estado.find(item => item.Id === consulta.estadoId)?.estado) || 'pending'] || STATUS_CONFIG['pending'];

        const pacienteInfo = paciente.find(item => item.Id === consulta.pacienteId);
        const vagaInfo = vaga.find(item => item.Id === consulta.vagaId);
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl card-shadow p-4 sm:p-5';
        card.innerHTML = `
          <div class="flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              ${(pacienteInfo?.nome || 'Paciente não encontrado').split(' ').map(n=>n[0]).slice(0,2).join('')}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2 flex-wrap mb-2">
                <div>
                  <p class="font-bold text-gray-900 text-sm">${pacienteInfo?.nome || 'Paciente não encontrado'}</p>
                  <p class="text-xs text-gray-500">${especialidades.find(item => item.Id === medicoLogado?.especialidadeId)?.especialidade || 'Especialidade não encontrada'}</p>
                </div>
                <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.color}">${cfg.label}</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div class="text-center bg-gray-50 rounded-xl py-2 px-1">
                  <p class="text-xs font-bold text-gray-800 font-tabular">${vagaInfo?.hora ? new Date(vagaInfo.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                  <p class="text-[10px] text-gray-400">Hora</p>
                </div>
                <div class="text-center bg-gray-50 rounded-xl py-2 px-1">
                  <p class="text-xs font-bold text-gray-800">${formatDatePT(vagaInfo?.data || consulta.date)}</p>
                  <p class="text-[10px] text-gray-400">Data</p>
                </div>
                <div class="text-center bg-gray-50 rounded-xl py-2 px-1 col-span-2 sm:col-span-1">
                  <p class="text-xs font-bold text-gray-800 font-tabular">${pacienteInfo?.SNS || 'Nº SNS não encontrado'}</p>
                  <p class="text-[10px] text-gray-400">Nº SNS</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button onclick="viewConsultas('${consulta.Id}')" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Ver
            </button>
            ${estado.find(item => item.Id === consulta.estadoId)?.estado === 'confirmado' || estado.find(item => item.Id === consulta.estadoId)?.estado === 'pendente' ? `
            <button onclick="openCancelConsulta('${consulta.Id}')" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Cancelar
            </button>` : ''}
          </div>
        `;
        consultasList.appendChild(card);
    });
}

renderApiConsultas();

searchConsulta.addEventListener('input', () => {
  const searchTerm = searchConsulta.value.trim().toLowerCase();

  if (!searchTerm) {
    medicoConsulta = consultasDoMedico;
    renderApiConsultas();
    return;
  }

  const matchingPatientIds = paciente
    .filter(item => item.nome?.toLowerCase().includes(searchTerm))
    .map(item => item.Id);

  medicoConsulta = consultasDoMedico.filter(item => matchingPatientIds.includes(item.pacienteId));
  renderApiConsultas();
})

todasConsultas.addEventListener('click', ()=>{
  medicoConsulta = consultasDoMedico
  renderApiConsultas();
})


//busca todas as consultas do médico com o estado confirmado
confirmadasConsultas.addEventListener('click', ()=>{
  medicoConsulta = consultasDoMedico.filter(item => item.estadoId === (estado.find(item => item.estado === 'confirmado').Id))
 
  renderApiConsultas();
})


//busca todas as consultas do médico com o estado realizada
realizadasConsultas.addEventListener('click', ()=>{
  medicoConsulta = consultasDoMedico.filter(item => item.estadoId === (estado.find(item => item.estado === 'realizada').Id))
 
  renderApiConsultas();
})


//busca todas as consultas do médico com o estado cancelado
canceladasConsultas.addEventListener('click', ()=>{
  medicoConsulta = consultasDoMedico.filter(item => item.estadoId === (estado.find(item => item.estado === 'cancelado').Id))
 
  renderApiConsultas();
})

//busca todas as consultas do médico com o estado pendente
pendentesConsultas.addEventListener('click', ()=>{
  medicoConsulta = consultasDoMedico.filter(item => item.estadoId === (estado.find(item => item.estado === 'pendente').Id))
 
  renderApiConsultas();
})


window.renderConsultas = renderApiConsultas;
window.openCancelConsulta = openCancelConsulta;
window.viewConsultas = viewConsultas;
window.addEventListener('load', () => {
    window.renderConsultas = renderApiConsultas;
    renderApiConsultas();
});


document.querySelector('button[name="btnCabcelConsulta"]').addEventListener('click', async () => {
    const id = document.querySelector('button[name="btnCabcelConsulta"]').getAttribute('data-consulta-id');
    

    if(!id) return;

    const dataConsultaCancel = await apiConsulta.update('consulta', { id:id,data:{estadoId: estado.find(e => e.estado === 'cancelado')?.Id} })


    if(!dataConsultaCancel){
        showToast('Erro ao cancelar consulta.', 'error');
    }
});

function openCancelConsulta(id) {
  cancelTargetId = id;
  document.querySelector('button[name="btnCabcelConsulta"]').setAttribute('data-consulta-id', id);
  document.getElementById('modal-cancel').classList.remove('hidden');
}

function viewConsultas(id) {
    //aqui deve abrir um modal com as informações da consulta, como data, hora, paciente, especialidade, etc... e opções para editar ou cancelar a consulta
    document.getElementById('modal-patient').innerText = (paciente.find(item => item.Id === consultas.find(item => item.Id ==id).pacienteId)).nome //vai retornar o nome do paciente na consulta

    document.getElementById('modal-sns').innerText = (paciente.find(item => item.Id === consultas.find(item => item.Id ==id).pacienteId)).SNS

    document.getElementById('modal-date').innerText=formatDatePT((vaga.find(item => item.Id === consultas.find(item => item.Id ==id).vagaId)).data)

    document.getElementById('modal-time').innerText=new Date((vaga.find(item => item.Id === consultas.find(item => item.Id ==id).vagaId)).hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    document.getElementById('modal-phone').innerText = (paciente.find(item => item.Id === consultas.find(item => item.Id ==id).pacienteId)).phone

    document.getElementById('modal-specialty').innerText = especialidades.find(item => item.Id === (medico.find(item => item.Id === consultas.find(item => item.Id ==id).medicoId)).especialidadeId).especialidade
    

    document.getElementById('modal-view').classList.remove('hidden');

}


/**
 * códigos para adicionar as vagas do médico, ainda em desenvolvimento, pois depende de mais dados da API para ser implementado corretamente.
 */

// Elementos HTML da aba de vagas que vão ser usados para guardar as vagas no backend
const vagaCalendarMonth = document.getElementById('vaga-cal-month')
const vagaTimeTitle = document.getElementById('vaga-time-title')
const vagaTimeEmpty = document.getElementById('vaga-time-empty')
const vagaSlotsContainer = document.getElementById('vaga-slots-container')
const vagaMorningSlots = document.getElementById('vaga-morning-slots')
const vagaAfternoonSlots = document.getElementById('vaga-afternoon-slots')
const vagaSelectedSummary = document.getElementById('vaga-selected-summary')
const vagaSummaryText = document.getElementById('vaga-summary-text')
const vagaStrip = document.getElementById('vaga-strip')
const vagaStripDate = document.getElementById('vaga-strip-date')
const vagaStripSlots = document.getElementById('vaga-strip-slots')
const btnSaveVaga = document.getElementById('btn-save-vaga')
const vagaCalendarGrid = document.getElementById('vaga-cal-grid')

// Estado local para acompanhar a data e os horários selecionados na aba de vagas
let vagaSelecionadaData = ''
let vagaSelecionadaHorarios = new Set()

function atualizarResumoVagaNoDOM() {
  if (!vagaSelectedSummary || !vagaSummaryText || !vagaStrip || !vagaStripDate || !vagaStripSlots || !btnSaveVaga) return

  const totalHorarios = vagaSelecionadaHorarios.size

  if (totalHorarios > 0 && vagaSelecionadaData) {
    vagaSelectedSummary.classList.remove('hidden')
    vagaSummaryText.textContent = `${totalHorarios} horário${totalHorarios > 1 ? 's' : ''} seleccionado${totalHorarios > 1 ? 's' : ''}: ${[...vagaSelecionadaHorarios].sort().join(', ')}`
    vagaStrip.classList.remove('hidden')
    vagaStrip.style.display = 'flex'

    const [ano, mes, dia] = vagaSelecionadaData.split('-')
    vagaStripDate.textContent = `${dia} de ${MONTHS_PT[parseInt(mes, 10) - 1]} de ${ano}`
    vagaStripSlots.textContent = `${totalHorarios} vaga${totalHorarios > 1 ? 's' : ''} disponível${totalHorarios > 1 ? 'is' : ''}`
    btnSaveVaga.disabled = false
  } else {
    vagaSelectedSummary.classList.add('hidden')
    vagaStrip.classList.add('hidden')
    btnSaveVaga.disabled = true
  }
}

function limparSelecaoVaga() {
  vagaSelecionadaData = ''
  vagaSelecionadaHorarios = new Set()

  if (vagaTimeEmpty) vagaTimeEmpty.classList.remove('hidden')
  if (vagaSlotsContainer) vagaSlotsContainer.classList.add('hidden')
  if (vagaTimeTitle) vagaTimeTitle.textContent = 'Selecione primeiro uma data'
  if (vagaStrip) vagaStrip.classList.add('hidden')
  if (btnSaveVaga) btnSaveVaga.disabled = true
  if (vagaSelectedSummary) vagaSelectedSummary.classList.add('hidden')
}

// Função para transformar a data e o horário selecionado num objeto Date válido
function buildVagaDateTime(date, time) {
  return new Date(`${date}T${time}:00`)
}

// Função para criar uma vaga por cada horário selecionado na base de dados
async function salvarVagasNoBanco(dataSelecionada, horariosSelecionados) {
  if (!medicoId) {
    window.showToast('Não foi possível identificar o médico logado.', false)
    return
  }

  if (!dataSelecionada || horariosSelecionados.length === 0) {
    window.showToast('Selecione uma data e pelo menos um horário.', false)
    return
  }

  try {
    const promessas = horariosSelecionados.map(horario => {
      const dataHora = buildVagaDateTime(dataSelecionada, horario)

      return apiConsulta.create('vaga', {
        medicoId: medicoId,
        data: new Date(`${dataSelecionada}T00:00:00`).toISOString(),
        hora: dataHora.toISOString(),
        estadoId:estado.find(item => item.estado === 'Ativo').Id
      })
    })


    const resultados = await Promise.allSettled(promessas)
    const vagasCriadas = resultados.filter(item => item.status === 'fulfilled' && item.value).length

    if (vagasCriadas > 0) {
      window.showToast(`${vagasCriadas} vaga${vagasCriadas > 1 ? 's' : ''} guardada${vagasCriadas > 1 ? 's' : ''} com sucesso.`, true)
      limparSelecaoVaga()
      return
    }

    window.showToast('Erro ao guardar as vagas. Tente novamente.', false)
  } catch (error) {
    console.error('Erro ao guardar vagas:', error)
    window.showToast('Erro ao guardar as vagas.', false)
  }
}

// Evento de clique no calendário para guardar a data escolhida na aba de vagas
vagaCalendarGrid?.addEventListener('click', (event) => {
  const botaoData = event.target.closest('button')

  if (!botaoData) return

  const diaTexto = botaoData.textContent.trim()
  const dia = Number(diaTexto)

  if (!Number.isInteger(dia)) return

  const mesAnoTexto = vagaCalendarMonth?.textContent?.trim() || ''
  const [mesNome, anoTexto] = mesAnoTexto.split(' ')
  const mesIndex = MONTHS_PT.findIndex(item => item.toLowerCase() === mesNome?.toLowerCase())

  if (mesIndex === -1 || !anoTexto) return

  vagaSelecionadaData = `${anoTexto}-${String(mesIndex + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
  vagaSelecionadaHorarios = new Set()

  if (vagaTimeEmpty) vagaTimeEmpty.classList.add('hidden')
  if (vagaSlotsContainer) vagaSlotsContainer.classList.remove('hidden')
  if (vagaTimeTitle) vagaTimeTitle.textContent = `Horários — ${String(dia).padStart(2, '0')} de ${MONTHS_PT[mesIndex]}`

  atualizarResumoVagaNoDOM()
})

// Evento de clique nos horários da manhã para registar os horários escolhidos
vagaMorningSlots?.addEventListener('click', (event) => {
  const botaoHorario = event.target.closest('button')

  if (!botaoHorario) return

  const horario = botaoHorario.textContent.trim()

  if (vagaSelecionadaHorarios.has(horario)) {
    vagaSelecionadaHorarios.delete(horario)
  } else {
    vagaSelecionadaHorarios.add(horario)
  }

  atualizarResumoVagaNoDOM()
})

// Evento de clique nos horários da tarde para registar os horários escolhidos
vagaAfternoonSlots?.addEventListener('click', (event) => {
  const botaoHorario = event.target.closest('button')

  if (!botaoHorario) return

  const horario = botaoHorario.textContent.trim()

  if (vagaSelecionadaHorarios.has(horario)) {
    vagaSelecionadaHorarios.delete(horario)
  } else {
    vagaSelecionadaHorarios.add(horario)
  }

  atualizarResumoVagaNoDOM()
})

// Evento de guardar as vagas quando o botão for clicado
btnSaveVaga?.addEventListener('click', async (event) => {
  event.preventDefault()
  event.stopPropagation()

  await salvarVagasNoBanco(vagaSelecionadaData, [...vagaSelecionadaHorarios].sort())
})

window.addEventListener('load', () => {
  window.saveVaga = salvarVagasNoBanco
  window.clearVaga = limparSelecaoVaga
})

/**
 * Espaço para o código do perfil do medico
 */

//Elementos Html 
const PInpNome = document.querySelector('input[name = PInpNome]')

const PInpCrm = document.querySelector('input[name = PInpCrm]')

const PInpPhone = document.querySelector('input[name = PInpPhone]')

const PInpEmail = document.querySelector('input[name = PInpEmail]')

const PInpEspecialidade = document.querySelector('input[name = PInpEspecialidade]')


//elementos de segurança 
const pPwdCurrent = document.querySelector('input[name = pPwdCurrent]')

const PPwdNew = document.querySelector('input[name = PPwdNew ]')

const PPwdConfirm = document.querySelector('input[name = PPwdConfirm]')

//botão d esalvar
const PBtnSalvar = document.querySelector('button[name = PBtnSalvar]')

renderDadosPerfil()


PBtnSalvar.addEventListener('click', async ()=>{
    const dados = {}
    if(PInpNome.value !== medicoLogado.nome)
      dados['nome'] = PInpNome.value

    if(PInpPhone.value !== medicoLogado.phone)
      dados['phone'] = parseInt(PInpPhone.value)

    
    if(pPwdCurrent.value){
      const data = {
        email: users.find(item => item.Id === medicoLogado.userId).email,
        senha:pPwdCurrent.value
      }
      const res  = await fetch('http://localhost:3001/user/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })

      const verify = await res.json()

      if(!verify.email){
        document.getElementById('p-label-err').innerText = 'A senha atual esta errada'
        return
      }else{
        document.getElementById('p-label-err').innerText = ''
      }

      if (PPwdNew.value != PPwdConfirm.value) {
          document.getElementById('p-label-confirm').innerText = 'as senhas não são iguais'
          return
      }else{
        document.getElementById('p-label-confirm').innerText = ''
      }

      const SUpdate = await apiConsulta.update('user',{
        id:users.find(item => item.Id === medicoLogado.userId).Id,
        data:{senha:PPwdConfirm.value}
      })
    }

    if(dados === {})
      return
    
    const salvo = await apiConsulta.update('medico',{
      id:medicoId,
      data:dados
    })

    
    

    if(salvo.nome){
      medicoLogado =  salvo
      renderDadosPerfil()
    }
     
})

function renderDadosPerfil(){
  
  PInpNome.value = medicoLogado.nome
  PInpCrm.value = medicoLogado.CRM
  PInpPhone.value = medicoLogado.phone
  PInpEmail.value = users.find(item => item.Id === medicoLogado.userId).email
  PInpEspecialidade.value = especialidades.find(item => item.Id === medicoLogado.especialidadeId).especialidade

}


