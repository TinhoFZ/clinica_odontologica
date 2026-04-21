function buildPatientPayload(patient) {
    return {
        id: patient.id,
        role: 'patient'
    };
}

function buildDentistPayload(dentist) {
    return {
        id: dentist.id,
        role: 'dentist'
    };
}

module.exports = { buildPatientPayload, buildDentistPayload };