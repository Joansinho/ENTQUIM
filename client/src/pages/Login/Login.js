import React, { useState, useEffect } from 'react';
import Images from '../../utils/Images/Images';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import { TextField, IconButton } from '@mui/material';
import { validateCorreo, validateName, validateContrasena } from '../../utils/helpers';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [isRegisterView, setIsRegisterView] = useState(false);
    const [isAdditionalInfoView, setIsAdditionalInfoView] = useState(false);
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [contrasenaVisible, setContrasenaVisible] = useState(false);
    const { handleLogin, handleRegister, user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [correoError, setCorreoError] = useState('');
    const [contrasenaError, setContrasenaError] = useState('');
    const [nameError, setNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [birthDateError, setBirthDateError] = useState('');
    const [setIsRegistered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const toggleView = () => {
        setIsRegisterView(prev => !prev);
        setIsAdditionalInfoView(false);
        setErrorMessage('');
    };

    const handleCorreoChange = (e) => {
        const value = e.target.value.slice(0, 35); // Limita a 35 caracteres
        setCorreo(value);
        if (!validateCorreo(value)) {
            setCorreoError('Debe tener el formato nombre@dominio.com.');
        } else {
            setCorreoError('');
        }
    };

    const handleContrasenaChange = (e) => {
        const value = e.target.value.slice(0, 35); // Limita a 35 caracteres
        setContrasena(value);
        if (!validateContrasena(value)) {
            setContrasenaError('Debe tener 8-35 caracteres, incluir letras, números y un símbolo.');
        } else {
            setContrasenaError('');
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, '').slice(0, 15); // Solo letras y espacios, máximo 15 caracteres
        setName(value);
        if (!validateName(value)) {
            setNameError('Solo se permiten letras y espacios.');
        } else {
            setNameError('');
        }
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, '').slice(0, 15); // Solo letras y espacios, máximo 15 caracteres
        setLastName(value);
        if (!validateName(value)) {
            setLastNameError('Solo se permiten letras y espacios.');
        } else {
            setLastNameError('');
        }
    };

    const handleBirthDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();
    
        setBirthDate(e.target.value);
    
        if (selectedDate > currentDate) {
            setBirthDateError('La fecha no puede ser en el futuro.');
        } else if (currentDate.getFullYear() - selectedDate.getFullYear() > 120) {
            setBirthDateError('Por favor, selecciona un año coherente.');
        } else {
            setBirthDateError('');
        }
    };
    

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10); // Solo números, máximo 10 caracteres
        setPhone(value);
    
        if (value.length < 10) {
            setPhoneError('El número debe tener 10 dígitos.');
        } else {
            setPhoneError('');
        }
    };
    

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!correo || !contrasena) {
            setErrorMessage('La contraseña o el correo son inválidos.');
            return;
        }

        try {
            await handleLogin(correo, contrasena);
        } catch (error) {
            setErrorMessage('La contraseña o el correo son inválidos.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
    
        if (nameError || lastNameError || correoError || contrasenaError) {
            setErrorMessage('Por favor corrige los errores antes de continuar.');
            return;
        }
    
        // Pasa a la vista adicional solo si no hay errores
        setIsAdditionalInfoView(true);
    };
    
    const handleAdditionalInfoSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
    
        if (birthDateError || phoneError) {
            setErrorMessage('Por favor corrige los errores antes de registrar.');
            return;
        }
    
        try {
            await handleRegister(name, lastName, correo, contrasena, birthDate, phone);
            // Cambiar a vista de login y mantener el correo
            setIsRegistered(true);
            setIsRegisterView(false);
            setIsAdditionalInfoView(false);
        } catch (error) {
            setErrorMessage('Error al registrar el usuario. Inténtalo de nuevo.');
        }
    };
    
    const handleContrasenaVisibility = () => {
        setContrasenaVisible(prev => !prev);
    };


    return (
        <main className="main">
            <div className={`contenedor__todo ${isRegisterView ? 'register-view' : ''}`}>
                <div className="caja__trasera">
                    <div className="caja__trasera_login">
                        <h3>¿Ya tienes una cuenta?</h3>
                        <p>Inicia sesión para entrar en la página</p>
                        <button id="btn__iniciar_sesion" onClick={toggleView}>Iniciar sesión</button>
                    </div>
                    <div className="caja__trasera_register">
                        <h3>¿Aún no tienes una cuenta?</h3>
                        <p>Regístrate para que puedas iniciar sesión</p>
                        <button id="btn__registrarse" onClick={toggleView}>Registrarse</button>
                    </div>
                </div>

                <div className="contenedor__login-register">
                    {!isAdditionalInfoView && (
                        <form className={`formulario__login ${isRegisterView ? 'hidden' : ''}`} onSubmit={handleLoginSubmit}>
                            <h2>Iniciar sesión</h2>
                            <TextField
                                label="Correo Electrónico"
                                variant='standard'
                                size="small"
                                margin='dense'
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value.slice(0, 35))} // Limita caracteres
                                fullWidth
                                required
                                InputProps={{
                                    style: { border: 'none' },
                                }}
                            />
                            <TextField
                                label="Contraseña"
                                variant='standard'
                                size="small"
                                margin='dense'
                                type={contrasenaVisible ? 'text' : 'password'}
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value.slice(0, 35))} // Limita caracteres
                                fullWidth
                                required
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={handleContrasenaVisibility}>
                                            <img
                                                src={contrasenaVisible ? Images.icons.visibilityoff : Images.icons.visibility}
                                                alt="toggle password visibility"
                                                className='visibility-icon'
                                            />
                                        </IconButton>
                                    ),
                                    style: { border: 'none' },
                                }}
                            />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button type="submit" className='login-button'>Entrar</button>
                            <p>
                                <Link to="/RecoverPassword">¿Olvidaste tu contraseña?</Link>
                            </p>
                        </form>
                    )}

                    {!isAdditionalInfoView && (
                        <form className={`formulario__register ${!isRegisterView ? 'hidden' : ''}`} onSubmit={handleRegisterSubmit}>
                            <h2>Registrarse</h2>
                            <TextField
                                label="Nombre"
                                variant='standard'
                                size="small"
                                margin='dense'
                                value={name}
                                onChange={handleNameChange}
                                error={!!nameError}
                                helperText={nameError}
                                fullWidth
                                required
                                InputProps={{
                                    style: { border: 'none' },
                                }}
                            />
                            <TextField
                                label="Apellido"
                                variant='standard'
                                size="small"
                                margin='dense'
                                value={lastName}
                                onChange={handleLastNameChange}
                                error={!!lastNameError}
                                helperText={lastNameError}
                                fullWidth
                                required
                                InputProps={{
                                    style: { border: 'none' },
                                }}
                            />
                            <TextField
                                label="Correo Electrónico"
                                variant='standard'
                                size="small"
                                margin='dense'
                                value={correo}
                                onChange={handleCorreoChange}
                                error={!!correoError}
                                helperText={correoError}
                                fullWidth
                                required
                                InputProps={{
                                    style: { border: 'none' },
                                }}
                            />
                            <TextField
                                label="Contraseña"
                                variant='standard'
                                size="small"
                                margin='dense'
                                type={contrasenaVisible ? 'text' : 'password'}
                                value={contrasena}
                                onChange={handleContrasenaChange}
                                error={!!contrasenaError}
                                helperText={contrasenaError}
                                fullWidth
                                required
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={handleContrasenaVisibility}>
                                            <img
                                                src={contrasenaVisible ? Images.icons.visibilityoff : Images.icons.visibility}
                                                alt="toggle password visibility"
                                                className='visibility-icon'
                                            />
                                        </IconButton>
                                    ),
                                    style: { border: 'none' },
                                }}
                            />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button type="submit" className='login-button'>Siguiente</button>
                        </form>
                    )}

                    {isAdditionalInfoView && (
                        <form className="formulario__additional-info" onSubmit={handleAdditionalInfoSubmit}>
                            <h2>Información Adicional</h2>
                            <TextField
                                label="Fecha de Nacimiento"
                                variant='standard'
                                size="small"
                                margin='dense'
                                type="date"
                                value={birthDate}
                                onChange={handleBirthDateChange}
                                fullWidth
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="Teléfono"
                                variant='standard'
                                size="small"
                                margin='dense'
                                value={phone}
                                onChange={handlePhoneChange}
                                fullWidth
                                required
                                InputProps={{
                                    style: { border: 'none' },
                                }}
                            />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button type="submit" className='login-button'>Registrar</button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Login;
