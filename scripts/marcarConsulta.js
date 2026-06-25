import { ApiConsultas } from "./funcoes/api.Consultas.js";

const apiConsultas = new ApiConsultas()
const pacientes = await apiConsultas.get('paciente')
const medicos = await apiConsultas.get('medico')
const especialidades = await apiConsultas.get('especialidade')
const estados = await apiConsultas.get('estado')
const users = await apiConsultas.get('user')
const vagas = await apiConsultas.get('vaga')


const typeUser = localStorage.getItem('typeUser')
const currentUserId = localStorage.getItem('Id')

if(!typeUser || !currentUserId){
    window.location.href = '../sign-up-login-screen.html'
}

if(typeUser !== 'paciente'){
    window.location.href = '../sign-up-login-screen.html'
}

const paciente = pacientes.find(item => item.userId === currentUserId)
console.log(paciente);


/**
 * Passo 1 - os dados do cliente
 * Aqui vão todos os códigos do passo 1
 */

//elementos Html
const patientName = document.querySelector('input[name = patientName]')

const patientNIF = document.querySelector('input[name = patientNIF]')

const patientSNS = document.querySelector('input[name = patientSNS]')

const patientPhone = document.querySelector('input[name = patientPhone]')

const patientEmail = document.querySelector('input[name = patientEmail]')


renderDadosPasso1()

function renderDadosPasso1(){
    patientName.value = paciente.nome
    patientNIF.value = paciente.NIF
    patientSNS.value = paciente.SNS
    patientPhone.value = paciente.phone
    patientEmail.value = users.find(item => item.Id === paciente.userId).email
}



/**
 * Passo 2 - os dados do cliente
 * Aqui vão todos os códigos do passo 2
 */

//Elementos Html
const specialtySearch = document.querySelector('input[name = specialtySearch]')

const specialtyGrid = document.getElementById('specialty-grid')





let stepEspecialidade = especialidades.filter(sp => (medicos.filter(medico => (vagas.filter(vaga => vaga.medicoId).map(vaga => vaga.medicoId).includes(medico.Id)))).map(medico => medico.especialidadeId).includes(sp.Id) )





specialtySearch.addEventListener('input',()=>{
    if(!specialtySearch.value){
        stepEspecialidade = especialidades.filter(sp => (medicos.filter(medico => (vagas.filter(vaga => vaga.medicoId).map(vaga => vaga.medicoId).includes(medico.Id)))).map(medico => medico.especialidadeId).includes(sp.Id) )
        renderSpecialtyGrid()
        return
    }
    
    const verify = stepEspecialidade.filter(sp => sp.especialidade.includes(specialtySearch.value))
    
    if(verify.length != 0){
        
        stepEspecialidade = verify
        renderSpecialtyGrid()
    }else{
        stepEspecialidade = verify
        renderSpecialtyGrid()
        stepEspecialidade = especialidades.filter(sp => (medicos.filter(medico => (vagas.filter(vaga => vaga.medicoId).map(vaga => vaga.medicoId).includes(medico.Id)))).map(medico => medico.especialidadeId).includes(sp.Id) )

        
    }
    
    
    
    
})

let selectedSpecialty = null;


// ===== STEP 2: Specialty =====
function renderSpecialtyGrid() {
  specialtyGrid.innerHTML = '';
  

  if (stepEspecialidade.length === 0) {
    specialtyGrid.innerHTML = `<div class="col-span-full py-16 text-center"><p class="text-4xl mb-3">🔍</p><p class="text-gray-500 font-medium">Nenhuma especialidade encontrada</p></div>`;
    return;
  }

  stepEspecialidade.forEach(sp => {
    const isSelected = selectedSpecialty?.Id === sp.Id;
    const btn = document.createElement('button');
    btn.className = `text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 ${
      isSelected ? 'border-[#C0152B] bg-red-50 shadow-lg shadow-red-100' : 'border-gray-100 bg-white card-shadow hover:border-red-200'
    }`;
    btn.innerHTML = `
      <h3 class="text-sm font-bold text-gray-800 mb-1 leading-tight">${sp.especialidade}</h3>
      <p class="text-[11px] text-gray-400 mb-2 leading-tight">${sp.descricao}</p>
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold ${vagas.filter(vaga => (medicos.filter(medico => medico.especialidadeId === sp.Id )).map(medico => medico.Id).includes(vaga.medicoId)).length <= 4 ? 'text-amber-600' : 'text-green-600'}">${vagas.filter(vaga => (medicos.filter(medico => medico.especialidadeId === sp.Id )).map(medico => medico.Id).includes(vaga.medicoId)).length} vagas</span>
        ${isSelected ? `<span class="w-4 h-4 rounded-full bg-[#C0152B] flex items-center justify-center"><span class="w-2 h-2 rounded-full bg-white"></span></span>` : ''}
      </div>`;
    btn.addEventListener('click', () => {
      selectedSpecialty = sp;
      document.getElementById('btn-specialty-next').disabled = false;
      document.getElementById('specialty-selected-indicator').classList.remove('hidden');
      document.getElementById('specialty-selected-indicator').classList.add('flex');
      document.getElementById('specialty-selected-emoji').textContent = sp.emoji;
      document.getElementById('specialty-selected-text').textContent = `${sp.especialidade} · ${vagas.filter(vaga => (medicos.filter(medico => medico.especialidadeId === sp.Id )).map(medico => medico.Id).includes(vaga.medicoId)).length} vagas disponíveis`;
      renderSpecialtyGrid();
    });
    specialtyGrid.appendChild(btn);
  });
}

window.renderSpecialtyGrid = renderSpecialtyGrid





/**
* Passo 3 - os dados do cliente
* Aqui vão todos os códigos do passo 2
*/

//Elementos Html
const doctorsList = document.getElementById('doctors-list')
const doutor = medicos.filter(medico => stepEspecialidade.map(md => md.Id).includes(medico.especialidadeId))

let vetMarcarList = []

let bookingData = {
  patientName: '', patientNIF: '', patientSNS: '', patientPhone: '', patientEmail: '',
  specialty: null, doctor: null, date: '', time: '', appointmentId: ''
};

const doutorVaga = vagas.filter(vaga =>{
  if(!vetMarcarList.find(item => item?.medicoId === vaga.medicoId)&&
  vaga.estadoId === estados.find(estado => estado.estado === 'Ativo').Id
  ){
    vetMarcarList.push(vaga)
    return vaga
  }
}) 




// ===== STEP 3: Doctor =====
function renderDoctors() {
  const sp = bookingData.specialty;
  document.getElementById('doctor-specialty-emoji').textContent = sp?.emoji || '';
  document.getElementById('doctor-specialty-name').textContent = sp?.name || '';
  document.getElementById('doctor-specialty-label').textContent = sp?.name || '';

  
  // const list = document.getElementById('doctors-list');
  doctorsList.innerHTML = '';

  doutorVaga.forEach(doctor => {
    const isSelected = selectedDoctor?.Id === doctor.Id;
    const btn = document.createElement('button');
    btn.className = `w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
      isSelected ? 'border-[#C0152B] bg-red-50/50 shadow-lg shadow-red-100' : 'border-gray-100 bg-white card-shadow hover:border-red-200 hover:bg-red-50/20'
    }`;
    const starsHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    const langsHtml = `<span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded-full">Português</span>`;
    btn.innerHTML = `
      <div class="flex items-start gap-4">
        <div class="w-14 h-14 rounded-2xl ${doctor.color} flex items-center justify-center text-white font-extrabold text-lg shrink-0">${doctor.initials}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-3 mb-1">
            <div>
              <h3 class="text-base font-bold text-gray-900">${medicos.find(medico => medico.Id === doctor.medicoId).nome}</h3>
              <p class="text-xs text-gray-500">${especialidades.find(item => item.Id === medicos.find(medico => medico.Id === doctor.medicoId).especialidadeId).especialidade} · CRM ${medicos.find(medico => medico.Id === doctor.medicoId).CRM}</p>
            </div>
            <div class="flex items-center gap-1 shrink-0">${starsHtml}<span class="text-sm font-bold text-gray-700 font-tabular">${doctor.rating}</span><span class="text-xs text-gray-400">(${doctor.reviews})</span></div>
          </div>
          <p class="text-xs text-gray-500 mb-3">${medicos.find(medico => medico.Id === doctor.medicoId).escola}</p>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
              <span class="text-xs text-gray-500">${medicos.find(medico => medico.Id === doctor.medicoId).anoExperiencia} experiência</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="text-xs font-semibold text-green-700">Próxima vaga: ${new Date(doctor.hora).toLocaleString("pt-BR", {
                dateStyle: "full",
                timeStyle: "medium"
              })}</span>
            </div>
            <div class="flex gap-1">${langsHtml}</div>
          </div>
        </div>
        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
          isSelected ? 'border-[#C0152B] bg-[#C0152B]' : 'border-gray-300'
        }">
          ${isSelected ? '<span class="w-2 h-2 rounded-full bg-white block"></span>' : ''}
        </div>
      </div>`;
    btn.addEventListener('click', () => {
      selectedDoctor = doctor;
      document.getElementById('btn-doctor-next').disabled = false;
      renderDoctors();
    });
    doctorsList.appendChild(btn);
  });
}


window.renderDoctors = renderDoctors
window.bookingData = bookingData