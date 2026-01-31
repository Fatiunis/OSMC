-- Script SQL para crear las tablas de la base de datos hospital_db
-- Ejecuta esto en DBeaver después de conectar a MySQL

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'secretaria', 'doctor', 'paciente') NOT NULL,
    estado TINYINT(1) DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de especialidades
CREATE TABLE IF NOT EXISTS especialidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono_url VARCHAR(255)
);

-- Tabla de doctores (parece ser similar a medicos)
CREATE TABLE IF NOT EXISTS doctores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    especialidad_id INT,
    numero_colegiado VARCHAR(50),
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

-- Tabla de medicos (relacionada con usuarios)
CREATE TABLE IF NOT EXISTS medicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    numero_colegiado VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    fecha_nacimiento DATE,
    tipo_sangre VARCHAR(5),
    alergias TEXT,
    documento_identidad VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    doctor_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    observaciones TEXT,
    resultados TEXT,
    creada_por INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (doctor_id) REFERENCES doctores(id),
    FOREIGN KEY (creada_por) REFERENCES usuarios(id)
);

-- Tabla de recetas (si se usa)
CREATE TABLE IF NOT EXISTS recetas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cita_id INT,
    descripcion TEXT,
    medicamentos TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES citas(id)
);

-- Tablas para el módulo de seguro
CREATE TABLE IF NOT EXISTS clientes_seguro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    poliza_id INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS polizas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    cobertura_porcentaje DECIMAL(5,2),
    activa TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS servicios_seguro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(100),
    subcategoria VARCHAR(100),
    descripcion TEXT,
    precio_seguro DECIMAL(10,2),
    tipo_cobertura VARCHAR(50),
    activo TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS historial_aprobaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT,
    servicio_id INT,
    poliza_id INT,
    monto_aprobado DECIMAL(10,2),
    fecha_aprobacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes_seguro(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios_seguro(id),
    FOREIGN KEY (poliza_id) REFERENCES polizas(id)
);

-- Tabla para farmacia (medicamentos)
CREATE TABLE IF NOT EXISTS medicamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    familia VARCHAR(100),
    precio DECIMAL(10,2),
    stock INT DEFAULT 0
);