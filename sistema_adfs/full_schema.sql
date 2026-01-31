-- Base de datos para el sistema hospitalario

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'secretaria', 'doctor', 'paciente', 'clienteseguro') NOT NULL,
    estado TINYINT(1) DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de médicos
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
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    documento_identidad VARCHAR(20),
    tipo_sangre VARCHAR(5),
    alergias TEXT,
    foto VARCHAR(255),
    codigo_hospital VARCHAR(5) DEFAULT '00256',
    codigo_seguro VARCHAR(10),
    numero_carnet VARCHAR(20),
    tiene_seguro TINYINT(1) DEFAULT 0,
    id_seguro VARCHAR(50),
    codigo_paciente_unico VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de especialidades
CREATE TABLE IF NOT EXISTS especialidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS citas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT NOT NULL,
    id_doctor INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'pendiente',
    tipo_servicio VARCHAR(100) NOT NULL,
    notas TEXT,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id),
    FOREIGN KEY (id_doctor) REFERENCES medicos(id),
    CONSTRAINT unique_cita UNIQUE (id_doctor, fecha, hora_inicio)
);

-- Tabla de resultados de cita
CREATE TABLE IF NOT EXISTS resultados_cita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_cita INT NOT NULL,
    diagnostico TEXT,
    examenes_realizados TEXT,
    siguiente_cita DATE,
    indicaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cita) REFERENCES citas(id)
);

-- Tabla de recetas médicas
CREATE TABLE IF NOT EXISTS recetas_medicas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_receta VARCHAR(50) NOT NULL,
    fecha_receta DATE NOT NULL,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    numero_colegiado VARCHAR(20) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    diagnostico TEXT NOT NULL,
    notas_especiales TEXT,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id),
    FOREIGN KEY (id_medico) REFERENCES medicos(id)
);

-- Tabla de medicamentos en recetas
CREATE TABLE IF NOT EXISTS medicamentos_receta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_receta INT NOT NULL,
    principio_activo VARCHAR(100) NOT NULL,
    concentracion VARCHAR(50) NOT NULL,
    presentacion VARCHAR(100) NOT NULL,
    forma_farmaceutica VARCHAR(100) NOT NULL,
    dosis VARCHAR(50) NOT NULL,
    frecuencia VARCHAR(50) NOT NULL,
    duracion VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_receta) REFERENCES recetas_medicas(id)
);

-- Tabla de clientes del seguro
CREATE TABLE IF NOT EXISTS clientes_seguro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    poliza_id INT NOT NULL,
    servicio_activo TINYINT(1) DEFAULT 1,
    fecha_vencimiento DATE NOT NULL,
    estado TINYINT(1) DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATE,
    documento_identidad VARCHAR(20),
    num_afiliacion VARCHAR(50) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de pólizas
CREATE TABLE IF NOT EXISTS polizas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    cobertura_porcentaje DECIMAL(5,2),
    activa TINYINT(1) DEFAULT 1
);

-- Tabla de servicios del seguro
CREATE TABLE IF NOT EXISTS servicios_seguro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    descripcion TEXT,
    precio_seguro DECIMAL(10,2),
    tipo_cobertura VARCHAR(50),
    activo TINYINT(1) DEFAULT 1
);

-- Tabla de historial de aprobaciones
CREATE TABLE IF NOT EXISTS historial_aprobaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    servicio_id INT,
    poliza_id INT,
    estado_aprobacion ENUM('aprobado', 'rechazado', 'pendiente') DEFAULT 'pendiente',
    fecha_aprobacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comentarios TEXT,
    precio_aprobado DECIMAL(10,2),
    cobertura_aplicada DECIMAL(5,2),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios_seguro(id),
    FOREIGN KEY (poliza_id) REFERENCES polizas(id)
);

-- Tabla de medicamentos (farmacia)
CREATE TABLE IF NOT EXISTS medicamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    principio_activo VARCHAR(100),
    concentracion VARCHAR(50),
    presentacion VARCHAR(100),
    forma_farmaceutica VARCHAR(100),
    precio DECIMAL(10,2),
    stock INT DEFAULT 0,
    familia VARCHAR(100)
);