-- Modificar tabla pacientes
ALTER TABLE pacientes ADD COLUMN foto VARCHAR(255) AFTER nombre;
ALTER TABLE pacientes ADD COLUMN codigo_hospital VARCHAR(5) DEFAULT '00256';
ALTER TABLE pacientes ADD COLUMN codigo_seguro VARCHAR(10);
ALTER TABLE pacientes ADD COLUMN numero_carnet VARCHAR(20);

-- Crear tabla para recetas médicas
CREATE TABLE recetas_medicas (
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

-- Crear tabla para medicamentos en recetas
CREATE TABLE medicamentos_receta (
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

-- Modificar tabla pacientes
ALTER TABLE pacientes ADD COLUMN foto VARCHAR(255) AFTER nombre;
ALTER TABLE pacientes ADD COLUMN codigo_hospital VARCHAR(5) DEFAULT '00256';
ALTER TABLE pacientes ADD COLUMN codigo_seguro VARCHAR(10);
ALTER TABLE pacientes ADD COLUMN numero_carnet VARCHAR(20);

-- Crear tabla para recetas médicas
CREATE TABLE recetas_medicas (
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

-- Crear tabla para medicamentos en recetas
CREATE TABLE medicamentos_receta (
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

CREATE TABLE citas (
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

CREATE TABLE resultados_cita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_cita INT NOT NULL,
    diagnostico TEXT,
    examenes_realizados TEXT,
    siguiente_cita DATE,
    indicaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cita) REFERENCES citas(id)
);