import api from './api';

type Patient = {
    patientId: number;
    name: string;
    cpf: string
    email?: string | null;
    phoneNumber?: string | null;
    passwordHash: string;
    address: string;
    birthDate: string;
    medicalHistory?: string | null;
    dentistId?: number | null;
}

type CreatePatientDTO = Omit<
    Patient,
    'patientId' | 'medicalHistory' | 'dentistId'
>


export const registerUser = async ({ name, cpf, email, phoneNumber, passwordHash, address, birthDate }: CreatePatientDTO) => {
    const res = await api.post('/patients/register', {
        name,
        cpf,
        email,
        phone_number: phoneNumber,
        password_hash: passwordHash,
        address,
        birth_date: birthDate
    });
    return res.data;
}