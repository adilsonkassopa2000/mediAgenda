
import { ApiConsultas } from "./funcoes/api.Consultas.js";

const  apiConsulta = new ApiConsultas()
const medico = await apiConsulta.get('medico')
const consultas = await apiConsulta.get('consulta')
const especialidades = await apiConsulta.get('especialidade')
const vaga = await apiConsulta.get('vaga')
const estado = await apiConsulta.get('estado')
const paciente = await apiConsulta.get('paciente')


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

const typeUser = localStorage.getItem('typeUser')//pega o tipo  de usuário logado

if(typeUser === 'medico'){
    const medicoId = localStorage.getItem('Id')//pega o id do médico logado
    const NomeUsuario = localStorage.getItem('NomeUsuario')//pega o nome do médico logado

    //atualiza as iniciais do médico no header
    headerInitials.innerText = NomeUsuario.split(' ').map(n => n[0]).join('')
    console.log(headerInitials.innerText)
    console.log(NomeUsuario)
}


sidebarName.innerText = sidebarName.innerText + ' ' + (medico.find(item => item.userId  === localStorage.getItem('Id'))?.nome || 'Médico')//atualiza o nome do médico na sidebar, caso o nome não seja encontrado, exibe 'Médico'

sidebarSpecialty.innerText =  (especialidades.find(item => item.Id === medico.find(item => item.userId  === localStorage.getItem('Id'))?.especialidadeId)?.especialidade || 'Especialidade')

btnSairMedico.addEventListener('click',()=>{
    localStorage.removeItem('Id')
    localStorage.removeItem('NomeUsuario')
    localStorage.removeItem('typeUser')
    window.location.href = '../lading-page.html'
})

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  completed:  { label: 'Realizada',  color: 'bg-blue-100 text-blue-700',  dot: 'bg-blue-500' },
  cancelled:  { label: 'Cancelada',  color: 'bg-red-100 text-red-700',    dot: 'bg-red-400' },
  pending:    { label: 'Pendente',   color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
};

//código dos cards e das consultas do dia ainda em desenvolvimento, pois depende de mais dados da API para ser implementado corretamente.

totalConsultaHoje.innerText = consultas.filter(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id) && item.vagaId === (vaga.find(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id) && new Date(item.data).toDateString() === new Date().toDateString())).Id ).length

totalConsultaRealizada.innerText = consultas.filter(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id) && item.vagaId === (vaga.find(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id) && new Date(item.data).toDateString() === new Date().toDateString())).Id && item.statusId === estado.find(e => e.estado === 'realizada')?.Id).length +' realizadas'


totalConsultaMes.innerText = consultas.filter(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))).Id && item.vagaId === (vaga.find(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id) && new Date(item.data).toDateString() === new Date().toDateString())).Id ).length


totalPaciente.innerText = consultas.filter(item => item.medicoId === (medico.find(item => item.userId === localStorage.getItem('Id')))?.Id).length || '0'//exibe o total de pacientes, caso não haja pacientes, exibe '0'

proximaConsultaInfo.innerHTML =`<p class="text-xl font-black font-tabular">${new Date(vaga.find(item => item.medicoId === (medico.find(item => item.userId === localStorage.getItem('Id'))?.Id))?.data).getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}</p>
                <p class="text-red-200 text-xs mt-0.5">Hoje, ${new Date().getDate()} de ${MONTHS_PT[new Date().getMonth()]} de ${new Date().getFullYear()}</p>
                <div class="border-t border-red-400/30 mt-3 pt-3">
                  <p class="text-sm font-bold">${(paciente.find(item => item.Id === (consultas.find(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id))?.pacienteId))).nome }</p>
                  <p class="text-xs text-red-200 mt-0.5">${(especialidades.find(item => item.Id === (medico.find(m => m.userId === localStorage.getItem('Id'))?.especialidadeId))?.especialidade || 'Especialidade')} · Consulta de rotina</p>
                </div>`//exibe as informações da próxima consulta agendada, ainda em desenvolvimento, pois depende de mais dados da API para ser implementado corretamente.


proximaConsultaInfo2.innerHTML = `<div class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                <span class="text-xs text-gray-500">Nº SNS</span>
                <span class="text-xs font-semibold text-gray-800 font-tabular">${(paciente.find(item => item.Id === (consultas.find(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id))?.pacienteId))).SNS }</span>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                <span class="text-xs text-gray-500">Telemóvel</span>
                <span class="text-xs font-semibold text-gray-800 font-tabular">${(paciente.find(item => item.Id === (consultas.find(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id))?.pacienteId))).phone }</span>
              </div>`

              //listar consulta do dia
consultaHData.innerText = `Consultas de ${new Date().getDate()} de ${MONTHS_PT[new Date().getMonth()]} de ${new Date().getFullYear()}`

consultas.filter(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id) && item.vagaId === (vaga.find(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id'))?.Id) && new Date(item.data).toDateString() === new Date().toDateString())).Id ).forEach(consulta => {
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

})


/**
 * Area do código para consultas medico, ainda em desenvolvimento, pois depende de mais dados da API para ser implementado corretamente.
 */
//elementos html para a área de consultas do médico
const consultasList = document.getElementById('consultas-list')//elemento onde as consultas do médico são listadas

const consultasEmpty = document.getElementById('consultas-empty')//elemento onde a mensagem de "nenhuma consulta encontrada" é exibida, caso não haja consultas para o médico logado

//inputs e buttons
const todasConsultas = document.querySelector('button[name="todasConsultas"]')//botão para filtrar todas as consultas
const confirmadasConsultas = document.querySelector('button[name="confirmadasConsultas"]')//botão para filtrar consultas confirmadas
const realizadasConsultas = document.querySelector('button[name="realizadasConsultas"]')//botão para filtrar consultas realizadas
const canceladasConsultas = document.querySelector('button[name="canceladasConsultas"]')//botão para filtrar consultas canceladas
const pendentesConsultas = document.querySelector('button[name="pendentesConsultas"]')//botão para filtrar consultas pendentes

const medicoConsulta = consultas.filter(item => item.medicoId === (medico.find(m => m.userId === localStorage.getItem('Id')))?.Id)//filtra as consultas do médico logado

if(medicoConsulta.length > 0){
    consultasEmpty.classList.add('hidden')//esconde a mensagem de "nenhuma consulta encontrada" caso haja consultas para o médico logado
    
    medicoConsulta.forEach(consulta => {
    const cfg = STATUS_CONFIG[(estado.find(item => item.Id === consulta.statusId)?.estado) || 'pending'] || STATUS_CONFIG['pending'];
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl card-shadow p-4 sm:p-5';
    card.innerHTML = `
      <div class="flex items-start gap-4">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
          ${(paciente.find(item => item.Id === consulta.pacienteId)?.nome || 'Paciente não encontrado').split(' ').map(n=>n[0]).slice(0,2).join('')}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 flex-wrap mb-2">
            <div>
              <p class="font-bold text-gray-900 text-sm">${paciente.find(item => item.Id === consulta.pacienteId)?.nome || 'Paciente não encontrado'}</p>
              <p class="text-xs text-gray-500">${especialidades.find(item => item.Id === medico.find(m => m.userId === localStorage.getItem('Id'))?.especialidadeId)?.especialidade || 'Especialidade não encontrada'} · Nº ${consulta.id}</p>
            </div>
            <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.color}">${cfg.label}</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div class="text-center bg-gray-50 rounded-xl py-2 px-1">
              <p class="text-xs font-bold text-gray-800 font-tabular">${vaga.find(item => item.Id === consulta.vagaId)?.hora}</p>
              <p class="text-[10px] text-gray-400">Hora</p>
            </div>
            <div class="text-center bg-gray-50 rounded-xl py-2 px-1">
              <p class="text-xs font-bold text-gray-800">${formatDatePT(vaga.find(item => item.Id === consulta.vagaId)?.date || consulta.date).split(' de ')[0] + ' ' + formatDatePT(vaga.find(item => item.Id === consulta.vagaId)?.date || consulta.date).split(' de ')[1].substring(0,3)}</p>
              <p class="text-[10px] text-gray-400">Data</p>
            </div>
            <div class="text-center bg-gray-50 rounded-xl py-2 px-1 col-span-2 sm:col-span-1">
              <p class="text-xs font-bold text-gray-800 font-tabular">${paciente.find(item => item.Id === consulta.pacienteId)?.SNS || 'Nº SNS não encontrado'}</p>
              <p class="text-[10px] text-gray-400">Nº SNS</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
        <button onclick="viewConsulta('${consulta.Id}')" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Ver
        </button>
        ${estado.find(item => item.Id === consulta.statusId)?.estado === 'confirmed' || estado.find(item => item.Id === consulta.statusId)?.estado === 'pending' ? `
        <button onclick="openCancel('${consulta.Id}')" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Cancelar
        </button>` : ''}
      </div>
    `;
    consultasList.appendChild(card);
  });


}else{
    consultasEmpty.classList.remove('hidden')//exibe a mensagem de "nenhuma consulta encontrada" caso não haja consultas para o médico logado
}