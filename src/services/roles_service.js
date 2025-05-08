// servicio para los roles

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
            throw new Error(error.detail || "Error al conseguir los roles");
        }

        return await response.json().catch(() => null);
    }catch(error){
        console.error('Error al conseguir los roles: ', error);
    }
}

async function detalles_con_permisos(id){
    try{
        const response = await fetch(`${BASE_URL}roles/${id}/detalle_con_permiso/`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(error.detail || 'Error al conseguir los datos del rol');
        }

        return await response.json().catch(() => null);
    }catch(error){
        console.error("Error al conseguir la info del rol: ", error);
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
            const error = await response.json();
            throw new Error(error.detail || "Error al conseguir los permisos");
        }

        return await response.json().catch(() => null);
    }catch(error){
        console.error("Error al conseguir los permisos: ", error);
    }
}

async function crear_rol(nombre, descripcion){
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
            throw new Error(error.detail || "Error al crear el rol");
        }
        return await response.json().catch(() => null);
    }catch(error){
        console.error("Error al crear el rol: ", error);
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
        console.error("Error al asignar los permisos: ", error);
    }
}

async function borrar_rol(id){
    try{
        const response = await fetch(`${BASE_URL}roles/${id}/`,{
            method:"DELETE",
            headers:{"Content-Type":"application/json"}
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(error.message || "Error al eliminar el rol");
        }
        return await response.json().catch(() => null);

    }catch(error){
        console.error("Error al eliminar el rol: ", error);
    }
}

async function actualizar_rol(id, nombre, descripcion, estado){
    try{
        const response = await fetch(`${BASE_URL}roles/${id}/`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                estado: estado
            }),
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(error.message || "Error al actualizar el rol");
        }
        return await response.json().catch(() => null);
    }catch(error){
        console.error("Error al actualizar el rol: ", error);
        throw error;
    }
}

async function cambiar_estado_rol(id){
    try{
        const response = await fetch(`${BASE_URL}roles/${id}/cambiar_estado/`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
            },
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(error.detail || "Error al cambiar el estado del rol");
        }

        return await response.json().catch(() => null);
    }catch(error){
        console.error("Error al cambiar el estado del rol: ", error);
        throw error;
    }
}

// === Nuevas funciones para manejo completo de permisos ===

async function obtener_permisos_por_rol(rolId) {
    try {
        const response = await fetch(`${BASE_URL}permisos-rol/permisos_por_rol/?rol_id=${rolId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `Error al obtener permisos del rol ${rolId}`);
        }

        return await response.json().catch(() => null);
    } catch (error) {
        console.error(`Error al obtener permisos del rol ${rolId}: `, error);
        throw error;
    }
}

async function eliminar_permiso_rol(permisoRolId) {
    try {
        const response = await fetch(`${BASE_URL}permisos-rol/${permisoRolId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `Error al eliminar el permiso ${permisoRolId}`);
        }

        return await response.json().catch(() => null);
    } catch (error) {
        console.error(`Error al eliminar el permiso ${permisoRolId}: `, error);
        throw error;
    }
}

async function actualizar_rol_con_permisos(rolId, rolData, nuevosPermisosIds) {
    try {
        // 1. Actualizar info del rol
        await actualizar_rol(rolId, rolData.nombre, rolData.descripcion, rolData.estado);

        // 2. Obtener permisos actuales
        const permisosActuales = await obtener_permisos_por_rol(rolId);

        // 3. Eliminar los que ya no están seleccionados
        for (const permiso of permisosActuales) {
            if (!nuevosPermisosIds.includes(permiso.permiso_id)) {
                await eliminar_permiso_rol(permiso.id);
            }
        }

        // 4. Agregar los que no existían
        const actualesIds = permisosActuales.map(p => p.permiso_id);
        const nuevos = nuevosPermisosIds.filter(id => !actualesIds.includes(id));

        if (nuevos.length > 0) {
            await asignar_permisos_rol(rolId, nuevos);
        }

        return true;
    } catch (error) {
        console.error(`Error al actualizar el rol con permisos:`, error);
        throw error;
    }
}

// Exportación
export {
    listar_roles,
    detalles_con_permisos,
    listar_permisos,
    crear_rol,
    asignar_permisos_rol,
    borrar_rol,
    actualizar_rol,
    cambiar_estado_rol,
    obtener_permisos_por_rol,
    eliminar_permiso_rol,
    actualizar_rol_con_permisos
};
