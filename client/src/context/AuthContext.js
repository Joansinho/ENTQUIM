import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import AuthService from "../services/AuthService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

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
                case "success":
                    toast.success(message, { autoClose: 1000 });
                    break;
                case "error":
                    toast.error(message, { autoClose: 1000 });
                    break;
                case "info":
                    toast.info(message, { autoClose: 1000 });
                    break;
                default:
                    break;
            }
        }
    }, []);

    const handleInvalidToken = () => {
        console.log("Token inválido o expirado");
        localStorage.removeItem("token");
        setUser(null);
        showToast("Sesión expirada. Por favor, inicia sesión nuevamente.", "error");
        navigate("/Iniciar-Sesion");
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:3002/api/usuarios/verify-token", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data.user); // Actualiza la información del usuario
            } else {
                handleInvalidToken();
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            handleInvalidToken();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData(); // Verifica el usuario al cargar la app
    }, []);

    const handleLogin = async (correo, contrasena) => {
        setLoading(true);
        try {
            const data = await AuthService.login(correo, contrasena);
            if (data.token) {
                console.log("Inicio de sesión exitoso:", data.user);
                localStorage.setItem("token", data.token); // Solo guarda el token
                await fetchUserData(); // Obtiene la información actualizada del usuario
                showToast("Inicio de sesión exitoso!", "success");
                navigate("/");
            } else {
                showToast("No se encontró el token en la respuesta.", "error");
            }
        } catch (err) {
            console.error("Error en inicio de sesión:", err);
            showToast(err.message || "Error al iniciar sesión. Verifica tus credenciales.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (nombre, apellido, correo, contrasena, fecha_nacimiento, telefono) => {
        setLoading(true);
        try {
            const response = await AuthService.register(nombre, apellido, correo, contrasena, fecha_nacimiento, telefono);
            if (response && response.id_usuarios) {
                console.log("Registro exitoso:", response);
                showToast("Registro exitoso. Puedes iniciar sesión ahora.", "success");
                navigate("/Iniciar-Sesion");
            } else {
                showToast("No se encontró el usuario en la respuesta.", "error");
            }
        } catch (err) {
            console.error("Error en registro:", err);
            showToast("Error al registrar el usuario. Inténtalo de nuevo.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await AuthService.invalidateToken(token);
                console.log("Token invalidado con éxito");
            } catch (err) {
                console.error("Error al invalidar el token:", err);
                showToast("Error al cerrar sesión. Inténtalo de nuevo.", "error");
            }
        }

        localStorage.removeItem("token");
        setUser(null);
        navigate("/Iniciar-Sesion");
        setLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                handleLogin,
                handleLogout,
                handleRegister,
                fetchUserData,
                loading,
                token: localStorage.getItem("token"),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
