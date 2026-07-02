import { ApiConsultas } from "./funcoes/api.Consultas.js";
const apiConsultas = new ApiConsultas();

let consultas = await apiConsultas.get('consulta')
const vagas = await apiConsultas.get('vaga')
const estados = await apiConsultas.get('estado')
const medicos = await apiConsultas.get('medico')
const pacientes = await apiConsultas.get('paciente')
const especialidades = await apiConsultas.get('especialidade')


const StatusConfig = {
  confirmado: { label: 'Confirmada', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  realizada: { label: 'Realizada', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  cancelado: { label: 'Cancelada', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
  pendente: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
};



document.getElementById('admin-hd-data').innerText = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }); // pegar a data atual e formatar para o padrão brasileiro
let consultasHoje = ''

await atualizarVisaoGeral()

//Aba para Consultas de Hoje

    if(consultasHoje.length === 0){
        document.getElementById('schedule-full').innerHTML = ''
        document.getElementById('schedule-full').innerHTML = `<div class="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-500">Não há consultas agendadas para hoje.</p>
            </div>
        </div>`;
    } else {
        document.getElementById('schedule-full').innerHTML = ''
      scheduleRowHTML(consultasHoje, true, document.getElementById('schedule-full'));
    }
//area para funções de admin

async function atualizarVisaoGeral() {

    consultas = await apiConsultas.get('consulta')
    //cards estatisticas
    consultasHoje = consultas.filter(consulta => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) === new Date(vagas.find(vaga => vaga.Id === consulta.vagaId).hora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }))

    document.getElementById('admin-st-total-hj').innerText = consultasHoje.length; // total de consultas hoje

    document.getElementById('admin-st-total-rz').innerText = consultas.filter(consulta => (new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) === new Date(vagas.find(vaga => vaga.Id === consulta.vagaId).hora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) && consulta.estadoId === estados.find(estado => estado.estado === 'realizada').Id)).length +' realizadas'//total de consultas realizadas no dia


    document.getElementById('admin-st-total-md-at').innerText = medicos.filter(medico => medico.estadoId === estados.find(estado => estado.estado === 'Ativo').Id).length //pegar os medicos activos

    document.getElementById('admin-st-md-total').innerText = medicos.length +' total' //pegar o total de medico

    document.getElementById('admin-st-total-ct').innerText = consultas.filter(consulta => new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) === new Date(vagas.find(vaga => vaga.Id === consulta.vagaId).hora).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) ).length

    //código para atualizar a lista de consultas do dia
    if(consultasHoje.length === 0){
        document.getElementById('schedule-preview').innerHTML = ''
        document.getElementById('schedule-preview').innerHTML = `<div class="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-500">Não há consultas agendadas para hoje.</p>
            </div>
        </div>`;
    } else {
        document.getElementById('schedule-preview').innerHTML = ''
      scheduleRowHTML(consultasHoje, false, document.getElementById('schedule-preview'));
    }
}




function scheduleRowHTML(query, detailed, container) {
  

  query.forEach(item => {
    const cfg = StatusConfig[estados.find(estado => estado.Id === item.estadoId).estado];
    const newElement = document.createElement('div');
    newElement.classList ='px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors';

    newElement.innerHTML = `<div class="text-sm font-bold text-gray-700 font-tabular w-12 shrink-0">${new Date(vagas.find(vaga => vaga.Id === item.vagaId).hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
      <div class="w-2 h-2 rounded-full shrink-0 ${cfg.dot}"></div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 truncate">${pacientes.find(paciente => paciente.Id === item.pacienteId)?.nome || 'Paciente não encontrado'}</p>
        ${detailed
          ? `<p class="text-xs text-gray-500 truncate"> Dr. ${medicos.find(medico => medico.Id === item.medicoId)?.nome || 'Médico não encontrado'} · ${especialidades.find(especialidade => especialidade.Id === item.especialidadeId)?.especialidade || 'Especialidade não encontrada'}</p>`
          : `<p class="text-xs text-gray-500 truncate">${medicos.find(medico => medico.Id === item.medicoId)?.nome || 'Médico não encontrado'}</p>`}
      </div>
      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.color}">
        ${cfg.label}
      </span>`

      container.appendChild(newElement);
  })
}

window.apiConsultas = apiConsultas