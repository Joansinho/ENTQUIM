const nodemailer = require('nodemailer');

// Configurar nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto por el servicio que utilices
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Exportar el transporter
module.exports = transporter;
