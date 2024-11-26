import api from './Api';

const AuthService = {
    // Método para iniciar sesión
    login: async (correo, contrasena) => {
        console.log('Intentando iniciar sesión con:', { correo, contrasena });

        // Validaciones previas
        if (!correo || !contrasena) {
            console.warn('Faltan campos requeridos:', { correo, contrasena });
            throw new Error('Por favor, ingrese todos los campos requeridos.');
        }

        try {
            const response = await api.post('/usuarios/login', { correo, contrasena });
            console.log('Respuesta del servidor:', response);

            if (response.status === 200) {
                const { data } = response;
                console.log('Inicio de sesión exitoso, datos recibidos:', data);
                return data;
            } else {
                // Manejo de error específico
                if (response.status === 401) {
                    throw new Error('Correo o contraseña incorrectos.');
                }
                console.warn('Error en la respuesta del servidor, estado:', response.status);
                throw new Error('Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error.response || error);
            throw AuthService.handleError(error, 'Error en el inicio de sesión');
        }
    },

// Método para registrar un nuevo usuario
register: async (nombre, apellido, correo, contrasena, fecha_nacimiento, telefono) => {
    console.log('Registrando nuevo usuario:', { nombre, apellido, correo, contrasena, fecha_nacimiento, telefono });

    // Validaciones previas
    if (!nombre || !apellido || !correo || !contrasena || !fecha_nacimiento || !telefono) {
        throw new Error('Por favor, ingrese todos los campos requeridos.');
    }

    try {
        const response = await api.post('/usuarios/register', {
            nombre,
            apellido,
            correo,
            contrasena,
            fecha_nacimiento,
            telefono
        });
        console.log('Respuesta del servidor para registro:', response);

        if (response.status === 201) {
            const { data } = response; // Desestructurando para obtener solo los datos
            console.log('Registro exitoso, datos recibidos:', data);

            if (!data || !data.id_usuarios) {
                throw new Error('No se encontró el usuario en la respuesta.');
            }

            return data; // Devolvemos los datos del usuario
        } else {
            throw new Error('Error en el registro');
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        throw AuthService.handleError(error, 'Error en el registro');
    }
},

    // Método para solicitar el restablecimiento de contraseña
    requestPasswordReset: async (correo) => {
        console.log('Solicitando restablecimiento de contraseña para:', { correo });

        // Validaciones previas
        if (!correo) {
            throw new Error('Por favor, ingrese el correo electrónico.');
        }

        try {
            const response = await api.post('/usuarios/request-password-reset', { correo });
            console.log('Respuesta del servidor para solicitud de restablecimiento:', response);

            if (response.status === 200) {
                if (response.data.message) {
                    return response.data.message; // Si el servidor envía un mensaje
                }
                return response.data; // Devuelve los datos de la respuesta
            } else {
                throw new Error('Error en la solicitud de restablecimiento de contraseña');
            }
        } catch (error) {
            console.error('Error en la solicitud de restablecimiento de contraseña:', error);
            throw AuthService.handleError(error, 'Error en la solicitud de restablecimiento de contraseña');
        }
    },

    // Método para invalidar el token
    invalidateToken: async (token) => {
        console.log('Invalidando token:', token);

        // Validaciones previas
        if (!token) {
            throw new Error('Token no proporcionado.');
        }

        try {
            const response = await api.post('/usuarios/invalidate-token', { token });
            console.log('Respuesta del servidor al invalidar token:', response);

            if (response.status === 200) {
                return response.data; // Retorna cualquier dato necesario
            } else {
                throw new Error('Error al invalidar el token');
            }
        } catch (error) {
            console.error('Error al invalidar el token:', error);
            throw AuthService.handleError(error, 'Error al invalidar el token');
        }
    },

    // Método para manejar errores de manera centralizada
    handleError: (error, defaultMessage) => {
        if (error.response) {
            return new Error(error.response.data.message || defaultMessage);
        } else if (error.request) {
            return new Error('Error en la solicitud, intente nuevamente.');
        } else {
            return new Error('Error desconocido: ' + error.message);
        }
    },

    // Método para verificar el token
    verifyToken: async (token) => {
        console.log('Verificando token:', token);

        // Validaciones previas
        if (!token) {
            throw new Error('Token no proporcionado.');
        }

        try {
            const response = await api.get('/usuarios/verify-token', { token }); // Cambiado a POST
            console.log('Token verificado con éxito:', response);
            return response.data; // Esto puede incluir información del usuario si es necesario
        } catch (error) {
            console.error('Error al verificar el token:', error);
            throw AuthService.handleError(error, 'Token inválido o expirado.');
        }
    },

    updateUser: async (id_usuarios, updatedData) => {
    try {
        const response = await api.put(`/usuarios/${id_usuarios}`, updatedData);
        return response.data;  // Devuelve los datos del usuario actualizados
    } catch (error) {
        throw AuthService.handleError(error, 'No se pudo actualizar el usuario.');
    }
},

};

export default AuthService;