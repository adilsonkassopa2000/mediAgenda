import { ApiConsultas } from "./funcoes/api.Consultas.js";

const apiConsulta = new ApiConsultas()
const paciente = await apiConsulta.get('paciente')
const medico = await apiConsulta.get('medico')

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
        console.log(await paciente)
        if(radioMedico.checked){
            
            if(user.message){
                loginErr.classList.remove('hidden')
                loginErrMsg.innerText= user.message
                return
            }else if(user.email){
                const NomeUsuario = (medico.find(item => item.userId === user.Id)).nome

                sessionStorage.setItem('NomeUsuario',NomeUsuario)

                loginErr.classList.remove('hidden')
                loginErrMsg.innerText= 'Login Realizado com sucesso'

                setTimeout(()=> window.location.href='../lading-page.html',1400)
                loginErr.classList.add('hidden')
                loginErrMsg.innerText= ''
            }
                
        }else if(radioPaciente.checked){
            if(user.message){
                loginErr.classList.remove('hidden')
                loginErrMsg.innerText= user.message
                return
            }else if(user.email){
                const NomeUsuario = (paciente.find(item => item.userId === user.Id)).nome

                sessionStorage.setItem('NomeUsuario',NomeUsuario)
                
                loginErr.classList.remove('hidden')
                loginErrMsg.innerText= 'Login Realizado com sucesso'
                setTimeout(()=> window.location.href='../lading-page.html',1400)
                loginErr.classList.add('hidden')
                loginErrMsg.innerText= ''
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
                    sessionStorage.setItem('adminUser',user.email)

                    loginErr.classList.remove('hidden')
                    loginErrMsg.innerText= 'Login Realizado com sucesso'

                    setTimeout(()=> window.location.href='../lading-page.html',1400)
                    loginErr.classList.add('hidden')
                    loginErrMsg.innerText= ''
                }
                
            }
        }


    }catch(err){
        console.error(err);
        
    }
})