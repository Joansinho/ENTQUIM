import React, { useState } from "react";
import axios from "axios";

const AddUser = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    id_rol: "", 
  });

  const [message, setMessage] = useState("");

  // Función para generar una contraseña aleatoria
// Función para generar una contraseña aleatoria que incluya letras, números y símbolos
const generatePassword = () => {
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
    
    // Garantizar al menos un carácter de cada tipo
    const allChars = lowerCase + upperCase + numbers + symbols;
    const password = [
      lowerCase.charAt(Math.floor(Math.random() * lowerCase.length)),
      upperCase.charAt(Math.floor(Math.random() * upperCase.length)),
      numbers.charAt(Math.floor(Math.random() * numbers.length)),
      symbols.charAt(Math.floor(Math.random() * symbols.length)),
    ];
  
    // Rellenar el resto de la contraseña hasta el tamaño deseado
    for (let i = password.length; i < 12; i++) {
      password.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
    }
  
    // Mezclar los caracteres para evitar un patrón predecible
    return password.sort(() => Math.random() - 0.5).join("");
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const password = generatePassword(); // Generar la contraseña automáticamente

    try {
      const response = await axios.post("http://localhost:3002/api/usuarios/registerByAdmin", {
        ...formData,
        contrasena: password, // Enviar la contraseña generada
      });

      if (response.status === 201) {
        setMessage(`Usuario registrado exitosamente. Se envió un correo a ${formData.correo} con la contraseña.`);
      } else {
        setMessage("Ocurrió un error al registrar al usuario.");
      }
    } catch (error) {
      setMessage("Error: " + error.response?.data?.error || "Error desconocido.");
    }
  };

  return (
    <div>
      <h2>Registrar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Correo:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rol:</label>
          <select
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            required
          >
            <option value="1">Administrador</option>
            <option value="2">Empleado</option>
            <option value="3">Cliente</option>
          </select>
        </div>
        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddUser;
