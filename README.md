
Si es la primera vez instalando el proyecto:

Carpeta general (proyecto) crear manualmente o por cmd de la siguiente manera:

cd desktop/escritorio (o la ruta de preferencia)
mkdir proyecto
cd proyecto
mkdir server


PARA FRONT END (client):
cd client
npm install i
npm install react-router-dom
npm install axios
npm install react-toastify
npm install react-icons
npm install chart.js
npm install react-chartjs-2
npm install dotenv 
npm install @mui/material @emotion/react @emotion/styled
npm install react-datepicker

TRAER EL REPOSITORIO DE GITHUB (cmd):
abrir una nueva cmd
cd desktop/escritorio (o ruta de facil acceso)
git clone https://github.com/Joansinho/PROYECTO_FORMACION.git

Despues de clonar el repositorio llevar los archivos dentro de server y client a las carpetas correspondientes. (reemplazar si es necesario)


PARA BACKEND (server):
cd server
npm install morgan
npm install mysql
npm install dotenv
npm install bcryptjs jsonwebtoken
npm install express nodemailer cors body-parser mysql2
npm install express
npm install nodemailer
npm install cors
npm install body-parser
npm install mysql2
npm install express-validator
npm install multer
npm install react-top-loading-bar


EN WORKBENCH:
Crear la base de datos llamada dbentquim.
Insertar el script de base de datos.

Abrir un cmd y ejecutar lo siguiente:
mysql -u root -p
use dbentquim
CREATE USER 'adminentquim'@'localhost' IDENTIFIED BY 'entquim123';
GRANT ALL PRIVILEGES ON dbentquim.* TO 'adminentquim'@'localhost';
FLUSH PRIVILEGES;
exit;
(se puede crear un usuario con cualquier nombre y contraseña, es recomendable crear este.)


SI EL USUARIO YA ESTA CREADO SE DEBE ELIMINAR Y VOLVER A CREAR PARA QUE HAYA CONEXION CON LA BD.


node server.js en una terminal de visual code para correr el backend.


=== IMPORTANTE ===

(SI NO ESTAN EN SUS CARPTEAS LOS RESPECTIVOS ARCHIVOS)
creen dos archivos temporales en el cliente y server, dentro de esas dos carpetas iran los ".env", despues de crearlos pegan lo siguiente

***client***
REACT_APP_API_URL=http://localhost:3002/api
FRONTEND_URL=http://localhost:3000

***server***
DB_HOST=localhost
DB_USER=adminentquim
DB_PASSWORD=entquim123
DB_NAME=dbentquim
BASE_URL=http://localhost:3002/api
FRONTEND_URL=http://localhost:3000
EMAIL_USER=julianospina260@gmail.com
EMAIL_PASS=iiys rgqb cvsl wrxw
JWT_SECRET=wWXt5kkgHZK8RuWANTDqTsEKFI2VbNMsBjiJdTZC5fAAWdIwf18jtwwWqOZqdiLs

=== Nota ===
EMAIL_USER=julianospina260@gmail.com
EMAIL_PASS=iiys rgqb cvsl wrxw

mas adelante se creara un correo tipo empresa para esto y poder manejar el envio de correos mejor, por ahora es mi correo personal para las pruebas, lo demas son datos sensibles que nunca se subiran por los archivos .env y obviamente tener seguridad
