//servicio para los roles

const BASE_URL = 'http://127.0.0.1:8000/api/rol/';

//listar las maricadas

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

async function listar_permisos(){
    try{
        const response = await fetch(`${BASE_URL}permiso/`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
            },
        });

        if(!response.ok){
            const error =   await response.json();
            throw new Error(error.detail || "Error al conseguir los permisos")
        }

        return await response.json().catch(() => null);
    }catch(error){
        console.error("Error al conseguir los permisos: ",error)
    }
}
//crear las maricadas

async function crear_rol(nombre,descripcion){
    try{
        const response = await fetch(`${BASE_URL}roles/`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
            }),
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(error.detail || "Error al crear el rol")
        }
        return await response.json().catch(() => null);
    }catch(error){
        console.error("Error al crear el rol: ",error)
    }
}

async function asignar_permisos_rol(rolId, modulosSeleccionados){
    try{
        const batchData = modulosSeleccionados.map(permisoId => ({
            rol_id: rolId,
            permiso_id: permisoId
        }));

        const response = await fetch(`${BASE_URL}permisos-rol/batch/`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(batchData)
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(error.detail || "Error al asignar los permisos");
        }

        return await response.json().catch(() => null);
    }catch(error){
        console.error("Error al asignar los permisos: ",error)
    }
}

export{
    listar_roles,
    listar_permisos,
    crear_rol,
    asignar_permisos_rol
}