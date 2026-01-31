-- Contraseña: admin123
INSERT INTO usuarios (correo, contrasena, rol) VALUES 
('admin@hospital.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Contraseña: doctor123
INSERT INTO usuarios (correo, contrasena, rol) VALUES 
('doctor@hospital.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');

-- Obtener el ID del último usuario insertado
SET @doctor_id = LAST_INSERT_ID();

INSERT INTO medicos (id_usuario, especialidad, numero_colegiado) VALUES 
(@doctor_id, 'Cardiología', 'MED-12345');

-- Contraseña: paciente123
INSERT INTO usuarios (correo, contrasena, rol) VALUES 
('paciente@mail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'paciente');

-- Obtener el ID del último usuario insertado
SET @paciente_id = LAST_INSERT_ID();

INSERT INTO pacientes (id_usuario, fecha_nacimiento, tipo_sangre) VALUES 
(@paciente_id, '1990-05-15', 'O+');