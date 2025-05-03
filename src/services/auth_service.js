//service encargado de la autenticacion, registro, logout y recuperacion de contraseña

const BASE_URL = 'http://127.0.0.1:8000/api/auth/';

//funcion encargada de iniciar sesion 
async function login(username,password){
    try{
        const response = await fetch(`${BASE_URL}login/`,{
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        });

        if (!response.ok){
            const error = await response.json();
            throw new Error(error.detail || 'Error al iniciar sesion')
        }

        return await response.json();
    }catch(error){
        console.error('Error en el login:', error);
        throw error;
    }
}

async function register(username,password,nombre,apellido,tipo_documento,numero_documento,correo,celular){
    try{
        const response = await fetch(`${BASE_URL}register/`,{
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                nombre: nombre,
                apellido: apellido,
                tipo_documento: tipo_documento,
                numero_documento: numero_documento,
                correo: correo,
                celular: celular
            }),
        });
        
        if (!response.ok){
            const error = await response.json();
            throw new Error(error.detail || 'Error al registrarse sesion')
        }

        return await response.json();
    }catch(error){
        console.error('Error en el registro: ',error);
        throw error;
    }
}



export{
    login,
    register
}
