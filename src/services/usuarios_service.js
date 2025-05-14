//servicio para usuarios

const BASE_URL = "http://127.0.0.1:8000/api/usuario/";

async function listar_usuarios(){
    try{
        const response = await fetch(`${BASE_URL}usuarios/`,{
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(error.detail || "Error al conseguir los usuarios")
        }

        return await response.json().catch(() => null)
    }catch(error){
        console.error('Error al conseguir los usuarios: ',error)
    }
}

async function cambiar_estado_usuario(id){
    try{
        const response = await fetch(`${BASE_URL}usuarios/${id}/cambiar_estado/`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json'
            },
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(error.detail || "Error al cambiar el estado del usuario");
        }

        return await response.json().catch(() => null)
    }catch(error){
        console.error("Error al cambiar el estado del usuario: ",error)
        throw error;
    }
}

async function eliminar_usuario(id){
    try{
        const response = await fetch(`${BASE_URL}usuarios/${id}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json'
                },
            });

            if(!response.ok){
                const error = await response.json();
                throw new Error(error.detail || "Error al eliminar el usuario");
            }
            
            return await response.json().catch(() =>null)
    }catch(error){
        console.error("Error al eliminar el usuario: ",error);
        throw error;
    }
}

async function crear_usuario(username, password, nombre, apellido, correo, rol_id){
    try{
        const response = await fetch(`${BASE_URL}usuarios/`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                username:username,
                nombre:nombre,
                apellido:apellido,
                correo:correo,
                rol_id:rol_id,
                password:password
            }),
        });

        if(!response.ok){
            const error = await response.json()
            throw new Error(error.detail || "Error al crear el usuario");
        }
        return await response.json().catch(() => null);
    }catch(error){
        console.error("Error al crear el usuario: ",error);
    }
}

// api_service.js

async function editar_usuario(id, username, password, nombre, apellido, correo, rol_id) {
  try {
    const userData = {
      username: username,
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      rol_id: rol_id,
      password:password
    };
    
    const response = await fetch(`${BASE_URL}usuarios/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData)
      throw new Error(errorData.detail || "Error al editar el usuario");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error al editar el usuario: ");
    throw error; // Re-lanzar el error para que pueda ser manejado por quien llama a la función
  }
}



export{
    listar_usuarios,
    cambiar_estado_usuario,
    eliminar_usuario,
    crear_usuario,
    editar_usuario
}