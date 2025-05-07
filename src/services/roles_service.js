//servicio para los roles

const BASE_URL = 'http://127.0.0.1:8000/api/rol/';

async function listar_roles(){
    try{
        const response = await fetch(`${BASE_URL}roles/`,{
            method: 'GET',
            headers : {
                'Content-Type':'application/json',
            },
        });
        
        if(!response.ok){
            const error = await response.json();
            throw new Error(error.detail || "Error al consegir los roles")
        }

        return await response.json().catch(() => null);
    }catch(error){
        console.error('Error al conseguir los roles: ',error)
    }
}

export{
    listar_roles
}