// AuthContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AuthService from '../services/AuthService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const showToast = useCallback((message, type) => {
        const currentTime = Date.now();
        if (!showToast.lastToast || currentTime - showToast.lastToast >= 5000) {
            showToast.lastToast = currentTime;
            switch (type) {
                case 'success':
                    toast.success(message, { autoClose: 1000 });
                    break;
                case 'error':
                    toast.error(message, { autoClose: 1000 });
                    break;
                case 'info':
                    toast.info(message, { autoClose: 1000 });
                    break;
                default:
                    break;
            }
        }
    }, []);

    useEffect(() => {
        const checkUserSession = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                try {
                    await AuthService.verifyToken(token);
                    setUser(JSON.parse(storedUser));
                } catch {
                    handleInvalidToken();
                }
            }
            setLoading(false);
        };;

        const handleInvalidToken = () => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            showToast('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
            navigate('/Iniciar-Sesion');
        };

        checkUserSession();
    }, [navigate, showToast]);

    const handleLogin = async (correo, contrasena) => {
        setLoading(true);
        try {
            const data = await AuthService.login(correo, contrasena);
            if (data.user) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                showToast('Inicio de sesión exitoso!', 'success');
                navigate('/');
            } else {
                showToast('No se encontró el usuario en la respuesta.', 'error');
            }
        } catch (err) {
            console.error("Error en inicio de sesión:", err);
            showToast(err.message || 'Error al iniciar sesión. Verifica tus credenciales.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (nombre, apellido, correo, contrasena, fecha_nacimiento, telefono) => {
        setLoading(true);
        try {
            const data = await AuthService.register(nombre, apellido, correo, contrasena, fecha_nacimiento, telefono);
            if (data) {
                showToast('Registro exitoso! Por favor, inicia sesión.', 'success');
                navigate('/Iniciar-Sesion');
            }
        } catch (err) {
            console.error("Error en registro:", err);
            showToast(err.message || 'Error en el registro. Intente nuevamente.', 'error');
        } finally {
            setLoading(false);
        }
    };    

    const handleLogout = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (token) {
            try {
                await AuthService.invalidateToken(token);
                console.log('Token invalidado exitosamente');
            } catch (err) {
                console.error("Error al invalidar el token:", err);
                showToast('Error al cerrar sesión. Inténtalo de nuevo.', 'error');
            }
        }

        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/Iniciar-Sesion');
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleRegister, handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
