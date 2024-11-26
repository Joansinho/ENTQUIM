-- Script BD de la pagina Entquim, Se actualizara esta semana para dejarla funcional antes del viernes, faltan datos

CREATE DATABASE IF NOT EXISTS dbentquim;
USE dbentquim;

-- Crear tabla Roles
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(30) NOT NULL
);

-- Crear tabla Categoria
CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Presentaciones (
    id_presentacion INT AUTO_INCREMENT PRIMARY KEY,
    presentacion TEXT
);

-- Crear tabla Producto
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    stock INT,
    plagas TEXT,
    dosis TEXT,
    imagen VARCHAR(255),
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria) ON DELETE SET NULL
);


CREATE TABLE productos_presentaciones (
    id_producto INT,
    id_presentacion INT,
    PRIMARY KEY (id_producto, id_presentacion),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_presentacion) REFERENCES presentaciones(id_presentacion)
);


CREATE TABLE Movimientos_Inventario (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    tipo_movimiento VARCHAR(50), -- 'entrada', 'salida'
    cantidad INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comentario VARCHAR(255),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);


-- Crear tabla Usuarios
CREATE TABLE Usuarios (
    id_usuarios INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(55),
    apellido VARCHAR(55),
    correo VARCHAR(70) UNIQUE NOT NULL,
    contrasena VARCHAR(70) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR (15),
    direccion VARCHAR (100),
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_rol INT,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol) ON DELETE SET NULL
);

CREATE TABLE Metodos_Pago (
    id_metodo_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_usuarios INT,
    nombre_titular VARCHAR(100),
    numero_tarjeta CHAR(16), -- Se puede enmascarar en el frontend por seguridad
    mm_aa CHAR(5),           -- Mes y año en formato MM/AA
    cvc CHAR(3),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuarios) REFERENCES Usuarios(id_usuarios) ON DELETE CASCADE
);

CREATE TABLE Actividad_Usuarios (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    id_usuarios INT,
    tiempo_en_pagina INT, -- en segundos
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuarios) REFERENCES Usuarios(id_usuarios) ON DELETE CASCADE
);


-- Crear tabla Venta
CREATE TABLE Ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    total DECIMAL(10, 2),
    estado VARCHAR(20),
    correo VARCHAR(100),
    id_usuarios INT,
    FOREIGN KEY (id_usuarios) REFERENCES Usuarios(id_usuarios) ON DELETE SET NULL
);

-- Crear tabla Detalle_De_Venta
CREATE TABLE Detalles_De_Ventas (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    id_venta INT,
    cantidad INT,
    precio_Unitario DECIMAL(10, 2),
    metodo_pago ENUM('CONTRA_ENTREGA', 'TARJETA') NOT NULL,
    id_metodo_pago INT NULL,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_metodo_pago) REFERENCES Metodos_Pago(id_metodo_pago) ON DELETE SET NULL
);


CREATE TABLE Movimientos_Ventas (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    tipo_movimiento VARCHAR(50), -- 'venta', 'devolución', etc.
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2),
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta) ON DELETE CASCADE
);
-- Crear tabla Carrito
CREATE TABLE Carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    etado VARCHAR(50) DEFAULT 'activo', -- Estados posibles: 'activo', 'finalizado'
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuarios) ON DELETE CASCADE
);

-- Crear tabla Carrito_Detalles
CREATE TABLE Carrito_Detalles (
    id_detalles_de_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT,
    id_producto INT,
    cantidad INT DEFAULT 1,
    FOREIGN KEY (id_carrito) REFERENCES Carrito(id_carrito) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

-- Crear tabla Orden
CREATE TABLE Ordenes (
    id_orden INT AUTO_INCREMENT PRIMARY KEY,
    id_usuarios INT,
    fecha DATE,
    total DECIMAL(10, 2),
    FOREIGN KEY (id_usuarios) REFERENCES usuarios(id_usuarios) ON DELETE SET NULL
);

-- Crea tabla tokens
CREATE TABLE tokens_usuarios (
    id_token INT AUTO_INCREMENT PRIMARY KEY,
    id_usuarios INT,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (id_usuarios) REFERENCES usuarios(id_usuarios)
);

-- Inserciones en Roles

INSERT INTO Roles (rol) VALUES ('Administrador');
INSERT INTO Roles (rol) VALUES ('Empleado');
INSERT INTO Roles (rol) VALUES ('Cliente');


INSERT INTO categorias (id_categoria, nombre)
VALUES (1, 'Insectos'),
	   (2, 'Roedores'),
       (3, 'Murcielagos'),
       (4, 'Larvas');
       
INSERT INTO presentaciones(id_presentacion, presentacion)
VALUES (1, 'Garrafa x 20Lt'),
	   (2, 'Botella x 1Lt'),
       (3, 'Botella x 0.5Lt'),
       (4, 'Frasco x 80ml'),
       (5, 'Frasco x 25ml'),
       (6, 'Caneca x 10kg'),
       (7, 'Tarro x 2.5kg'),
       (8, 'Tarro x 1Kg'),
       (9, 'Sobre x 50g'),
       (10, 'Sobre x 20g'),
       (11, 'Sobre x 10g'),
       (12, 'Colapsible x 100g'),
       (13, 'Tarro x 0.5kg'),
       (14, 'Pote x 100g'),
       (15, 'Tarro x 400g'),
       (16, 'Tarro x 200g'),
       (17, 'Caneca x 25Kg')
;

insert into productos (id_producto, nombre, descripcion, precio, stock, plagas, dosis, imagen, id_categoria)
values (1, 'DELMETRIN 2.50 EC', 'Insecticida piretroide líquido Concentrado Emulsionable (EC) a base de Deltametrina al 2.50% p/v, excelente para aplicación de choque y acción inmediata (KNOCK DOWN) sobre todo tipo de insectos rastreros y voladores en todos los ambientes.',
		19700, 20, 'Mosquitos de los géneros Anopheles y Culex, mosquitos de las especies Aedes aegypti y Aedes albopictus, Flebótomos, Pito o chinche besucona, jejenes, pulgas, cucarachas, moscas, arañas, lepismas, piojos, escorpiones, chinches, coquitos (Alphitobius diaperinus), garrapatas, escarabajos, gorgojos, hormigas, plagas de los granos almacenados, termitas del suelo y de la madera entre otros.',
        'Dilúyase en agua o en solventes como ACPM, aceite mineral, varsol o kerosene para aplicar por aspersión o nebulización de forma manual o a motor. Infestaciones altas (choque): 10 ml / litro de agua para cubrir de 15 a 20 m2. Infestaciones bajas (mantenimiento): 5 ml / litro de agua para cubrir de 15 a 20 m2. Explotaciones avícolas: 10 ml / litro de agua para cubrir de 8 a 10 m2 en aspersión de gota gruesa para control de Alphitobius diaperinus (coquito o panzer). 3 ml / litro de agua para aplicar por aspersión sobre aves en control de ácaros, piojos y pulgas. Explotaciones pecuarias: 5 ml / litro de agua para aplicar por aspersión como baño garrapaticida sobre los animales. Caninos: 4 ml / litro de agua para aplicar como pulguicia y garrapaticida. Permita que el producto actúe por 10 minutos en el canino y luego enjuague.',
        'http://localhost:3002/api/assets/products/delmetrin10WP.png', 1),
        (2, 'ZOORAT Pellets', 'Cebo rodenticida coumarínico pelletizado a base de Brodifacouma al 0.005%, anticoagulante de segunda generación específico para el control de todas las especies de roedores-plaga en interiores o recintos cubiertos, en todos los ambientes.',
        136700, 20, 'Rata de techo (Rattus rattus) Rata de alcantarilla (Rattus norvégicus) Ratón casero (Mus músculus) Rata arrocera (Oryzomys sp) Rata de agua (Holochilus sp) Ratón de la caña (Sigmodon sp) Ratón de campo (Zigodontomys sp)',
        'Campañas masivas de control de roedores: En promedio se aplican 50 gramos por vivienda. Aplicaciones agropecuarias: De 2 a 3 Kg por hectárea. Coloque de 5 a 10 gramos de ZOORAT ®, Pellets, cada 5 metros lineales por sitio de aplicación. En infestaciones altas debe repetirse la aplicación cada semana hasta que cese el consumo con monitoreo en los focos de infestación, complementando siempre con acciones de mejoramiento ambiental.',
        'http://localhost:3002/api/assets/products/delmetrin250.png', 2),
        (3, 'ZOORAT Bloques', 'Cebo rodenticida coumarínico en bloques de parafina de 3g a base de Brodifacouma al 0.005%, anticoagulante de segunda generación específico para el control de todas las especies de roedores-plaga en exteriores a la intemperie, en todos los ambientes.',
        136700, 20, 'Rata de techo (Rattus rattus) Rata de alcantarilla (Rattus norvégicus) Ratón casero (Mus músculus) Rata arrocera (Oryzomys sp) Rata de agua (Holochilus sp) Ratón de la caña (Sigmodon sp) Ratón de campo (Zigodontomys sp).',
        'Campañas masivas de control de roedores: En promedio se aplican 50 gramos por vivienda. Aplicaciones agropecuarias: De 2 a 3 Kg por hectárea. Coloque 2 o 3 bloques de ZOORAT ®, Bloques, cada 5 metros lineales por sitio de aplicación. En infestaciones altas debe repetirse la aplicación cada semana hasta que cese el consumo con monitoreo en los focos de infestación, complementando siempre con acciones de mejoramiento ambiental.',
        'http://localhost:3002/api/assets/products/delmetrinMadera.png', 2),
        (4, 'ZOORAT Gel', 'Cebo rodenticida coumarínico en pasta gelatinosa a base de Brodifacouma al 0.015%, anticoagulante de segunda generación específico para controlar todas las especies de roedores-plaga en todos los ambientes, en sitios secos o donde los roedores no encuentran disponibilidad de agua para beber permanentemente. Rinde tres veces más que cualquier otro rodenticida.',
        14800, 20, 'Rata de techo (Rattus rattus) Rata de alcantarilla (Rattus norvégicus) Ratón casero (Mus músculus) Rata arrocera (Oryzomys sp) Rata de agua (Holochilus sp) Ratón de la caña (Sigmodon sp) Ratón de campo (Zigodontomys sp)',
        'PARA OBTENER MAYOR RENDIMIENTO Y MAYOR CUBRIMIENTO DE ÁREA, MEZCLE UNA PARTE DE ZOORAT®, Gel CON DOS PARTES DE AGUA O DOS PARTES DE ALIMENTO Y APLIQUE. Campañas masivas de control de roedores: En promedio se aplican 30 gramos por vivienda. Aplicaciones agropecuarias: De 1 a 1,5 Kg por hectárea. Coloque de 3 a 5 gramos de ZOORAT®, Gel cada 5 metros lineales por sitio de aplicación. En infestaciones altas debe repetirse la aplicación cada semana hasta que cese el consumo.',
        'http://localhost:3002/api/assets/products/destroner-1sg.png', 2),
        (5, 'VAMPIRICIDA ENTQUIM', 'Brodifacouma 0.15%, Ungüento Anticoagulante: Moderno Vampiricida desarrollado específicamente para el control eficaz de los murciélagos hematófagos o vampiros, principales transmisores de la Rabia Silvestre o Rabia paralítica bovina en los animales domésticos de sangre caliente.',
        31700, 20, 'Murciélagos hematófagos (vampiros) de las Especies Desmodus rotundus, Diphylla ecaudata y Diaemus youngii.',
        'Aplicación sobre el vampiro: con una espátula aplique 1 gramo de Vampiricida ENTQUIM® sobre el dorso de cada vampiro. Posteriormente libérelos en horas de la noche, sin lastimarlos. Aprovechando su comportamiento permanente de acicalamiento y aseo mutuo, cada vampiro tratado puede intoxicar de 30 a 50 vampiros. Aplicación sobre el animal afectado: Bajo criterio y vigilancia de un Médico Veterinario, con una espátula aplique 2 gramos de Vampiricida ENTQUIM® en las partes del animal donde se observen mordeduras frescas. Cubra totalmente la herida en un área aproximada de 9 cm2 (3 cm x 3 cm).',
        'http://localhost:3002/api/assets/products/vampiricida.png', 3),
        (6, 'DELMETRIN MADERA', 'Inmunizante Insecticida piretroide líquido Concentrado Emulsionable (EC) a base de Deltametrina al 2.50% p/v, eficaz en la prevención y control de todos los insectos y hongos que atacan las maderas en todos los ambientes.',
        112600, 20, 'Insectos xilófagos: hormiga carpintera (Camponotus sp), Comejen (Termites sp), Gorgojo de la guadua (Dinoderus minutus), Termitas del suelo (Reticulitermes sp), Gorgojo de la madera (Criptotermes brevis y Lycteus brunneus) entre otros. Hongos xilófagos: hongo descoloreador (de azuleo), hongo degradador (Aphyllphorales), hongos de putrefacción café (Meruliporia incrassata y Gloeophyllum trabeum) y putrefacción blanca (Trametes versicolor y Trametes hirsuta) entre otros.',
        'Dilúyase en agua o en solventes orgánicos como ACPM, varsol, kerosene o aceite mineral. Para tratamientos curativos o preventivos se aplica por aspersión, inmersión, inyección o brochado en maderas al natural, sin decoración y sin acabados con humedad por debajo del 25% en peso para permitir su perfecta absorción y penetración.',
        'http://localhost:3002/api/assets/products/zoorat-bloques.png', 1),
        (7, 'DELMETRIN 10WP', 'Insecticida piretroide Polvo Mojable (WP) a base de Deltametrina al 10.0% p/p, que garantiza prolongada acción residual sobre cualquier tipo de superficie, específico para el control de todos los insectos rastreros y voladores en todos los ambientes.',
        107000, 20, 'Mosquitos de los géneros Anopheles y Culex, mosquitos de las especies Aedes aegypti y Aedes albopictus, Flebótomos, Pito o chinche besucona, jejenes, pulgas, cucarachas, moscas, arañas, lepismas, piojos, escorpiones, chinches, coquitos (Alphitobius diaperinus), garrapatas, escarabajos, gorgojos, hormigas, plagas de los granos almacenados, termitas del suelo y de la madera entre otros.',
        'Dilúyase en agua para aplicar sobre cualquier tipo superficie por aspersión de gota gruesa de forma manual o a motor para lograr prolongada acción residual.',
        'http://localhost:3002/api/assets/products/zoorat-gel.png', 1),
        (8, 'DESTRONER 1SG', 'Insecticida - larvicida organofosforado residual en gránulos de arena a base de Temephos al 1.0%, específico para el control de larvas de los mosquitos transmisores del Dengue y la Fiebre Amarilla, y larvas de moscas en materia orgánica en estercoleras en todos los ambientes.',
        24100, 20, 'Larvas de mosquitos de los géneros Culex spp, Anopheles spp, Aedes, Simulium, Psorophora, Uliseta y Mansonia. Larvas de moscas de varias especies pertenecientes al orden Díptera.',
        'La aplicación debe hacerse simultáneamente sobre todos los cuerpos de agua estancada o criaderos que se encuentren dentro del área a intervenir.',
        'http://localhost:3002/api/assets/products/zoorat-pellets.png', 4);
        
        
INSERT INTO productos_presentaciones (id_producto, id_presentacion)
VALUES
    (1, 1),  -- Producto 1 tiene presentación 1
    (1, 2),  -- Producto 1 tiene presentación 2
    (1, 3),  -- Producto 2 tiene presentación 3
    (1, 4),  -- Producto 3 tiene presentación 4
    (1, 5),
    (2, 6),
    (2, 7),
    (2, 8),
    (2, 9),
    (2, 10),
    (2, 11),
    (3, 6),
    (3, 7),
    (3, 8),
    (4, 12),
    (4, 8),
    (4, 13),
    (4, 14),
    (5, 14),
    (6, 1),
    (6, 2),
    (6, 3),
    (6, 4),
    (6, 5),
    (7, 15),
    (7, 16),
    (7, 5),
    (8, 17),
    (8, 8)
;