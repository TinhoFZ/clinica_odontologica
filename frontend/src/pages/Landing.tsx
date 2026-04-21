import Button from "../components/Button";

export default function Landing() {
    return (
        <>
            <Button
                link
                route="/register/patient"
                text="Se registar como paciente"
            />
            <Button
                link
                route="/register/dentist"
                text="Se registar como dentista"
            />

        </>
    );
}