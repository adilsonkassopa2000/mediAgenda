import { ApiConsultas } from "./funcoes/api.Consultas.js";

const apiConsulta = new ApiConsultas()
const paciente = await apiConsulta.get('paciente')
const medico = await apiConsulta.get('medico')
const user = await apiConsulta.get('user')

//Elementos html login
const loginErr = document.getElementById('login-error')//container onde seram mostrados os erros
const loginErrMsg = document.getElementById('login-error-msg')//elemento que ira pegar as mensagens de erro
const loginEmailErr = document.getElementById('login-email-err')//vai mostrar erro relacionado ao email
const loginPwErr = document.getElementById('login-pw-err')//vai mostrar erros relacionados a senha

//inputs e buttons
const radioPaciente = document.querySelector('input[name = radioPaciente]')//input para o radio do paciente
const radioMedico = document.querySelector('input[name = radioMedico]')//input para o radio do Medico
const loginEmail = document.querySelector('input[name = loginEmail]')//input que vai pegar o email
const loginSenha = document.querySelector('input[name = loginSenha]')//input que vai pegar o email


const loginSubmitBtn = document.querySelector('button[name = loginSubmitBtn]')

radioPaciente.checked =false
radioMedico.checked =false



radioPaciente.addEventListener('change',()=>{
    if(radioPaciente.checked)
        radioMedico.checked =false
})

radioMedico.addEventListener('change',()=>{
    if(radioMedico.checked)
        radioPaciente.checked =false
})


loginSubmitBtn.addEventListener('click', async()=>{
    try{
        const data = {
            email:loginEmail.value,
            senha:loginSenha.value
        }

        
        const res  = await fetch('http://localhost:3001/user/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        //if (!res.ok) throw new Error(`Falha ao carregar rota `);
        

        const user = await res.json()
        console.log(user);
        


        if(radioMedico.checked){
            
            if(user.message){
                loginErr.classList.remove('hidden')
                loginErrMsg.innerText= user.message
                return
            }else if(user.email){
                const NomeUsuario = (medico.find(item => item.userId === user.Id))?.nome

                if(!NomeUsuario){
                    loginErr.classList.remove('hidden')
                    loginErrMsg.innerText= "este email não esta associado a um medico"
                    return
                }


                loginErr.classList.remove('hidden')
                 loginErr.classList.remove('bg-red-50')

                loginErr.classList.add('bg-green-50')

                loginErr.classList.remove('border-red-200')

                loginErr.classList.add('border-green-200')

                loginErrMsg.style.color = '#22c55e '
                loginErrMsg.innerText= 'Login Realizado com sucesso'

                //codigo que vai colocar o efeito de processamento no botão de login
                loginSubmitBtn.disabled = true;
                loginSubmitBtn.innerHTML = `<svg style="width:18px;height:18px;" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> A autenticar...`;
               

                localStorage.removeItem('NomeUsuario')
                localStorage.removeItem("typeUser")
                localStorage.removeItem("Id")

                
                localStorage.setItem('NomeUsuario',NomeUsuario)
                localStorage.setItem("typeUser","medico")
                localStorage.setItem("Id",user.Id)

               
                 


                setTimeout(()=>{
                    loginErr.classList.add('hidden')
                    loginErrMsg.innerText= ''

                    window.location.href='../lading-page.html'
                }, 1400)
                
            }
                
        }else if(radioPaciente.checked){
            if(user.message){
                loginErr.classList.remove('hidden')
                loginErrMsg.innerText= user.message
                return
            }else if(user.email){
                const NomeUsuario = (paciente.find(item => item.userId === user.Id))?.nome

                if(!NomeUsuario){
                    loginErr.classList.remove('hidden')
                    loginErrMsg.innerText= "este email não esta associado a um paciente"
                    return
                }



                loginErr.classList.remove('hidden')

                 loginErr.classList.remove('bg-red-50')

                loginErr.classList.add('bg-green-50')

                loginErr.classList.remove('border-red-200')

                loginErr.classList.add('border-green-200')

                loginErrMsg.style.color = '#22c55e '
                
                loginErrMsg.innerText= 'Login Realizado com sucesso'

                //codigo que vai colocar o efeito de processamento no botão de login
                loginSubmitBtn.disabled = true;
                loginSubmitBtn.innerHTML = `<svg style="width:18px;height:18px;" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> A autenticar...`;

                localStorage.setItem('NomeUsuario',NomeUsuario)
                localStorage.setItem("typeUser","paciente")
                localStorage.setItem("Id",user.Id)
                

                
                

                setTimeout(()=>{
                    loginErr.classList.add('hidden')
                    loginErrMsg.innerText= ''

                    window.location.href='../lading-page.html'
                }, 1400)
            }
        }else{
            if (user.message) {
                loginErr.classList.remove('hidden')
                loginErrMsg.innerText= user.message
                return
            }else if(user.email){
                const verifyMedico = medico.find(item => item.userId === user.Id)

                const verifyPaciente = paciente.find(item => item.userId === user.Id)
                if(!verifyMedico && !verifyPaciente){


                    loginErr.classList.remove('hidden')

                     loginErr.classList.remove('bg-red-50')

                    loginErr.classList.add('bg-green-50')

                    loginErr.classList.remove('border-red-200')

                    loginErr.classList.add('border-green-200')

                    loginErrMsg.style.color = '#22c55e '

                    loginErrMsg.innerText= 'Login Realizado com sucesso'

                    //codigo que vai colocar o efeito de processamento no botão de login
                    loginSubmitBtn.disabled = true;
                    loginSubmitBtn.innerHTML = `<svg style="width:18px;height:18px;" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> A autenticar...`;
                    

                    localStorage.setItem('adminUser',user.email)
                    localStorage.setItem("typeUser","admin")


                    

                   setTimeout(()=>{
                    loginErr.classList.add('hidden')
                    loginErrMsg.innerText= ''

                    window.location.href='../lading-page.html'
                }, 1400)
                }
                
            }
        }


    }catch(err){
        console.error(err);
        
    }
})



/**
 * CÓDIGO PARA O REGISTRO DE PACIENTES
 */


//ELEMENTOS HTML REGISTRO
const regConfirmerr = document.getElementById('reg-confirm-err');
const regConfirmerrMsg = document.getElementById('reg-confirm-err-msg');
const regEmailErr = document.getElementById('reg-email-err');
const regEmailErrMsg = document.getElementById('reg-email-err-msg');
const regDataErr = document.getElementById('reg-data-err');
const regDataErrMsg = document.getElementById('reg-data-err-msg');

const regNameErr = document.getElementById('reg-name-err');
const regNameErrMsg = document.getElementById('reg-name-err-msg');

const regNifErr = document.getElementById('reg-nif-err');
const regNifErrMsg = document.getElementById('reg-nif-err-msg');


//inputs e buttons
const regName = document.querySelector('input[name = regName]')//input para pegar o nome do paciente
const regEmail = document.querySelector('input[name = regEmail]')//input para pegar o email do paciente
const regNif = document.querySelector('input[name = regNif]')//input para pegar o nif do paciente
const regSns = document.querySelector('input[name = regSns]')//input para pegar o nº SNS do paciente
const regPhone = document.querySelector('input[name = regPhone]')//input para pegar o telemóvel do paciente
const regSenha = document.querySelector('input[name = regSenha]')//input para pegar a senha do paciente
const regConfirmSenha = document.querySelector('input[name = regConfirmSenha]')//input para pegar a confirmação da senha do paciente

const regData = document.querySelector('input[name = regData]')//input para pegar a data de nascimento do paciente
const regMorada = document.querySelector('input[name = regMorada]')//input para pegar a morada do paciente
const regSexo = document.querySelector('select[name = regSexo]')//input para pegar o sexo do paciente

const regSubmitBtn = document.querySelector('button[name = regSubmitBtn]')//button para submeter o formulario de registro


regSubmitBtn.addEventListener('click', async(e)=>{
    e.preventDefault()
    try{
        const data = {
            nome:regName.value,
            email:regEmail.value,
            nif:regNif.value,
            sns:regSns.value,
            telefone:regPhone.value,
            dataNascimento:regData.value,
            morada:regMorada.value,
            sexo:regSexo.value,
            senha:regSenha.value,
            confirmSenha:regConfirmSenha.value
        }

        console.log(data);

        if(data.senha !== data.confirmSenha){
            regConfirmerr.classList.remove('hidden')
            regConfirmerrMsg.innerText = 'As senhas não coincidem'
            return
        }else{
            regConfirmerr.classList.add('hidden')
            regConfirmerrMsg.innerText = ''
        }

        if(data.dataNascimento > new Date().toISOString().split('T')[0]){
            regDataErr.classList.remove('hidden')
            regDataErrMsg.innerText = 'Data de nascimento inválida. Por favor, selecione uma data válida.'
            return
        }else{
            regDataErr.classList.add('hidden')
            regDataErrMsg.innerText = ''
        }

        const verifyUserEmail = user.find(item => item.email === data.email)

         if(verifyUserEmail){
            regEmailErr.classList.remove('hidden')
            regEmailErrMsg.innerText = 'Este email já está a ser utilizado.'
            return
        }else{
            regEmailErr.classList.add('hidden')
            regEmailErrMsg.innerText = ''
        }

        const verifyPacienteNif = paciente.find(item => item.nif === data.nif)

        if(verifyPacienteNif){
            regNifErr.classList.remove('hidden')
            regNifErrMsg.innerText = 'Este NIF já está a ser utilizado.'
            return
        }else{
            regNifErr.classList.add('hidden')
            regNifErrMsg.innerText = ''
        }

        const verifyPacienteNome = paciente.find(item => item.nome === data.nome)

        if(verifyPacienteNome){
            regNameErr.classList.remove('hidden')
            regNameErrMsg.innerText = 'Este nome já está a ser utilizado.'
            return
        }else{
            regNameErr.classList.add('hidden')
            regNameErrMsg.innerText = ''
        }


        const users = await apiConsulta.create('user',{
            email: data.email,
            senha: data.senha
        });
        

       

        const pacientes = await apiConsulta.create('paciente',{
            nome: data.nome,
            NIF: data.nif,
            SNS: data.sns,
            phone: parseInt(data.telefone),
            dataNascimento: new Date(data.dataNascimento).toISOString(),
            morada: data.morada,
            sexo: data.sexo,
            userId:users.Id
        });

        console.log(pacientes);

        if(pacientes){
            switchTab('login')
             regName.value = ''
             regEmail.value = ''
             regNif.value = ''
             regSns.value = ''
             regPhone.value = ''
             regSenha.value = ''
             regConfirmSenha.value = ''
             regData.value = ''
             regMorada.value = ''
             regSexo.value = 'Masculino'
        }

        }catch(err){
            console.error(err)
        }
})



  // ===== TAB SWITCHING =====
  function switchTab(tab) {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const panelLogin = document.getElementById('panel-login');
    const panelRegister = document.getElementById('panel-register');

    if (tab === 'login') {
      tabLogin.className = 'flex-1 py-4 text-sm font-semibold transition-all duration-200 tab-active';
      tabRegister.className = 'flex-1 py-4 text-sm font-semibold transition-all duration-200 tab-inactive';
      panelLogin.classList.add('active');
      panelRegister.classList.remove('active');
    } else {
      tabRegister.className = 'flex-1 py-4 text-sm font-semibold transition-all duration-200 tab-active';
      tabLogin.className = 'flex-1 py-4 text-sm font-semibold transition-all duration-200 tab-inactive';
      panelRegister.classList.add('active');
      panelLogin.classList.remove('active');
      // Reset success state
      document.getElementById('register-success').classList.remove('active');
      document.getElementById('register-form').style.display = '';
    }
  }




  window.switchTab = switchTab;


  /**
   * CÓDIGOS PARA O MODAL PARA ALTERAR A PASSWORD
   */

  //elementos html
const logChangePass = document.getElementById("log-change-pass")
const modalChangePass = document.getElementById("modal-change-pass")

const tituloInf = document.getElementById("titulo-inf")

const errfEmail = document.getElementById("err-f-email")// vai mostrar o erro quando não se passar o email

const errfnSenha = document.getElementById("err-f-n-senha")// vai mostrar o erro quando não se passar a nova senha
const errfConfSenha = document.getElementById("err-f-conf-senha")// vai mostrar o erro quando não se passar a confrimação da senha

const chPassError = document.getElementById('ch-pass-error')
const chErrorMsg = document.getElementById('ch-error-msg')


  //elementos inputs e buttons

  const fEmail = document.querySelector("input[name = fEmail]")
  const chPassBtnCancelar = document.querySelector("button[name = chPassBtnCancelar]")
  const chPassBtnSubmit = document.querySelector("button[name = chPassBtnSubmit]")

  const fNovaSenha = document.querySelector("input[name = fNovaSenha]")

  const fConfSenha = document.querySelector("input[name = fConfSenha]")


//link para abrir o modal 
  logChangePass.addEventListener('click',()=>{
    modalChangePass.classList.add('open')

    fEmail.value =''
    fNovaSenha.value =''
    fConfSenha.value =''
    fNovaSenha.disabled = true
    fConfSenha.disabled = true

    chPassBtnSubmit.innerHTML ='Verificar Email'
    tituloInf.innerText='Digite o email da conta que deseja alterar a senha'
    errfConfSenha.classList.add('hidden')
    errfnSenha.classList.add('hidden')
    errfEmail.classList.add('hidden')
    chPassError.classList.add('hidden')
  })

  //botão fechar modal
  chPassBtnCancelar.addEventListener('click',()=>{
    modalChangePass.classList.remove('open')
  })

  //botão para submeter os dados
  chPassBtnSubmit.addEventListener('click',async ()=>{
    if(chPassBtnSubmit.innerText === 'Verificar Email'){
        if(!fEmail.value){
            errfEmail.classList.remove('hidden')
            return
        }else{
            errfEmail.classList.add('hidden')
        }

        const verifyEmail = user.find(item => item.email === fEmail.value)

        if(!verifyEmail){
            errfEmail.classList.remove('hidden')
            errfEmail.innerText ='não foi encontrado nenhuma conta associada a este email'
            return
        }else{
            errfEmail.classList.add('hidden')
        }

         //codigo que vai colocar o efeito de processamento no botão de login

        chPassBtnSubmit.innerHTML = `<svg style="width:18px;height:18px;" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> A verificar...`;
         
        setTimeout(()=>{
                    errfEmail.style.color = '#22c55e '
                    errfEmail.classList.remove('hidden')
                    errfEmail.innerText ='Email Verificado'

                    fNovaSenha.disabled = false
                    fConfSenha.disabled = false
                    fNovaSenha.focus()
                    tituloInf.innerText='Preencha os campos para alterar a senha'
                    chPassBtnSubmit.innerText ='Alterar a senha'
                }, 1400)
        
    }else if(chPassBtnSubmit.innerText === 'Alterar a senha'){
        if(!fNovaSenha.value || !fConfSenha.value){
            !fNovaSenha.value? errfnSenha.classList.remove('hidden'):errfnSenha.classList.add('hidden')
            !fConfSenha.value? errfConfSenha.classList.remove('hidden'):errfConfSenha.classList.add('hidden')
            return
        }

        if(fNovaSenha.value !== fConfSenha.value){
            errfConfSenha.classList.remove('hidden')
            errfConfSenha.innerText ='As senhas não são Iguais'
            return
        }else{
            errfConfSenha.classList.add('hidden')
            errfConfSenha.innerText ='campo  obrigatório'
        }

        
        const data = user.find(item => item.email === fEmail.value)

        

        const userSave = await fetch(`http://localhost:3001/user/updatePassword`,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id:data.Id,
                senha:fConfSenha.value.trim()
            })
        })

        //codigo que vai colocar o efeito de processamento no botão de login
        
        chPassBtnSubmit.innerHTML = `<svg style="width:18px;height:18px;" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Alterando...`;

        console.log('tudo:',userSave);
        console.log('message:',userSave.message)
        setTimeout(()=>{
            if(!userSave.message){
                chPassError.classList.remove('hidden')
                chErrorMsg.innerText =' Senha Alterada'
            }else{
                chPassError.classList.remove('hidden')
                chErrorMsg.innerText =userSave.message
            }

            setTimeout(()=>{
                modalChangePass.classList.remove('open')
            }, 1000)

        }, 1400)

        
        
        


    }


  })