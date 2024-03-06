import React from 'react';
import {
    Card,
    Spacer,
    Button,
    Input,
} from '@nextui-org/react';
import { Container } from "@mui/material";
import { MailIcon } from '../assets/MailIcon';
import { Password } from '../assets/Password.jsx';
import { EyeFilledIcon } from "../assets/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../assets/EyeSlashFilledIcon";
import { loginRequest, profileRequest } from '@/api/auth.js';
import { useAuthStore } from '@/store/auth.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const setToken = useAuthStore(state => state.setToken);
    const setProfile = useAuthStore(state => state.setProfile);
    const navigate = useNavigate();

    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [errorMessage, setErrorMessage] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
        const password = (e.currentTarget.elements[1] as HTMLInputElement).value;
        setErrorMessage('');
        setIsLoading(true);

        try {
            const resLogin = await loginRequest(email, password);
            setToken(resLogin.data.token);

            const resProfile = await profileRequest();
            setProfile(resProfile.data.profile);

            navigate("/");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("Error data:", error.response.data);
                    console.error("Error status:", error.response.status);

                    if (error.response.status === 401) {
                        setErrorMessage("Credenciales inválidas. Por favor, intenta de nuevo.");
                    } else if (error.response.status === 400) {
                        setErrorMessage("Ingresa un correo y una contraseña");
                    } else {
                        setErrorMessage("Ocurrió un error. Por favor, intenta de nuevo más tarde.");
                    }
                } else if (error.request) {
                    console.error("No response from server:", error.request);
                    alert("No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.");
                } else {
                    console.error("Error:", error.message);
                    alert("Ocurrió un error inesperado.");
                }
            } else {
                // No es un error de Axios
                console.error("Error:", error);
                alert("Ocurrió un error inesperado.");
            }
        } finally {
            setIsLoading(false); // Finalizar la carga independientemente del resultado
        }
    }

    return (
        <div>
            <Container
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
            >
                <form onSubmit={handleSubmit} className='w-full flex justify-center'>
                    <Card className='p-10 w-[50%]'>
                        <p className='text-2xl text-center mb-7 font-bold'>Login</p>
                        <Input
                            //@ts-ignore
                            clearable
                            bordered
                            fullWidth
                            color="default"
                            size="lg"
                            placeholder="Email"
                            endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none" />}
                            className='mb-2'
                        />
                        <Spacer y={1} />
                        <Input
                            //@ts-ignore
                            clearable
                            bordered
                            fullWidth
                            color="default"
                            size="lg"
                            placeholder="Password"
                            contentLeft={<Password />}
                            css={{ mb: '6px' }}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                        />
                        {errorMessage && <p className='text-red-500 text-center mt-2'>{errorMessage}</p>}
                        <Spacer y={1} />
                        <Button className='mt-6' color='primary' type="submit">
                            {isLoading ? (
                                <div className="spinner"></div>
                            ): (
                                "Iniciar sesion"
                            )}
                        </Button>
                    </Card>
                </form>
            </Container>
        </div>
    );
}