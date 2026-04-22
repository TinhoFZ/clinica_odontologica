CREATE DATABASE clinica_odontologica;

USE clinica_odontologica;

CREATE TABLE dentists(
    dentist_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    cro VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE
);
 
CREATE TABLE patients(
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    medical_history TEXT NULL,
    dentist_id INT NULL,
    FOREIGN KEY (dentist_id) REFERENCES dentists(dentist_id),
    CHECK (phone_number IS NOT NULL OR email IS NOT NULL)
);
 
 CREATE TABLE appointments (
	appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    dentist_id INT,
    appointment_date DATETIME,
    type VARCHAR(255) NOT NULL,
    status ENUM('scheduled', 'finished', 'canceled') DEFAULT 'scheduled',
	FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
	FOREIGN KEY (dentist_id) REFERENCES dentists(dentist_id)
); 

CREATE TABLE request_logs (
	request_id INT PRIMARY KEY AUTO_INCREMENT,
	method VARCHAR(10) NOT NULL,
	route VARCHAR(255) NOT NULL,
	status_code INT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE action_logs (
	action_id CHAR(36) PRIMARY KEY, -- UUID
	request_id INT,
    action VARCHAR(255),
    entity_type ENUM('patient', 'dentist', 'appointment'),
    entity_id INT,
    status ENUM('SUCCESS', 'ERROR') NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES request_logs(request_id)
);

SELECT * FROM patients;
SELECT * FROM dentists;
SELECT * FROM action_logs;
SELECT * FROM request_logs;