
const apiBaseUrl = 'http://localhost:3001';

export class ApiConsultas{
    async get(modelo){
        try{
            const res = await fetch(`${apiBaseUrl}/${modelo}`)
            if (!res.ok) throw new Error(`Falha ao carregar rota ${modelo} (status ' + res.status + ')`);
            return await res.json()
        }catch(err){
            console.error(err)
        }
    }

    async create(modelo,data){
        try{
            const res = await fetch(`${apiBaseUrl}/${modelo}/create`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(data)

            })
            if (!res.ok) throw new Error(`Falha ao carregar rota ${modelo} (status ' + res.status + ')`);

            return await res.json()
        }catch(err){
            console.error(err)
        }
    }
    async update(modelo,data){
        try{
            const res = await fetch(`${apiBaseUrl}/${modelo}/update`,{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(data)

            })
            if (!res.ok) throw new Error(`Falha ao carregar rota ${modelo} (status ' + res.status + ')`);

            return await res.json()
        }catch(err){
            console.error(err)
        }
    }
    async delete(modelo,data){
        try{
            const res = await fetch(`${apiBaseUrl}/${modelo}/delete`,{
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(data)

            })
            if (!res.ok) throw new Error(`Falha ao carregar rota ${modelo} (status ' + res.status + ')`);

            return await res.json()
        }catch(err){
            console.error(err)
        }
    }
}