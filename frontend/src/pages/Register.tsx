import { useState } from 'react';
import Form from '../components/sections/Form';
import Input from '../components/Input';
import { registerUser } from '../services/patient';
import Button from '../components/Button';

export default function Register() {
    const [phoneAsContact, setPhoneAsContact] = useState(false);
    const toggle = () => {
        setPhoneAsContact(prev => !prev);
        handlePhoneChange();
    };
    
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    

    function handlePhoneChange() {
        if(phoneAsContact) {
            return (
                <Input 
                    value={phoneNumber ?? ''}
                    placeholder='Número de telefone'
                    type='tel'
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            )
        } else {
            return (
                <Input 
                    value={email}
                    placeholder='Email'
                    type='email'
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
            )
        }
    }

    return (
        <div className='prose'>
            <Form 
                onSubmit={async (e) => {
                    e.preventDefault();
                    await registerUser({
                        name,
                        cpf,
                        email,
                        phoneNumber,
                        passwordHash: password,
                        address,
                        birthDate
                    });
                }}
            >
                <h1>Registrar</h1>
                <Input 
                    value={name}
                    placeholder='Nome completo'
                    required
                    onChange={(e) => setName(e.target.value)}
                />
                <Input 
                    value={cpf}
                    placeholder='CPF'
                    required
                    onChange={(e) => setCpf(e.target.value)}
                />

                {handlePhoneChange()}
                
                <Input 
                    value={password}
                    placeholder='Senha'
                    type='password'
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input 
                    value={address}
                    placeholder='Endereço'
                    required
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Input 
                    value={birthDate}
                    placeholder='Data de nascimento'
                    type='date'
                    onChange={(e) => setBirthDate(e.target.value)}
                />

                <Button
                    text='Teste'
                    className='border border-black'
                    onClick={() => toggle()}
                />

                <Button
                    text='Registrar'
                    className='border border-black'
                />

            </Form>

        </div>
    );
}