import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { send } from 'emailjs-com';
import fuera_2 from "../../assets/images/fuera_2.jpeg";

const RecuperacionContrasena = () => {
    const [correo, setCorreo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCorreo(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el envío por defecto del formulario
        try {
            // 1. Primero, solicitamos al backend que genere el código de recuperación
            const response = await axios.post('http://localhost:5000/recuperar-contrasena', { correo });
            
            setMensaje(response.data.message); // Mostrar el mensaje de éxito
            setError('');

            // 2. Luego, solicitamos el código generado
            const codigoResponse = await axios.post('http://localhost:5000/obtener-codigo-recuperacion', { correo });
            const { codigo } = codigoResponse.data; // El código recibido del backend

            // 3. Ahora enviamos el correo con el código de recuperación utilizando EmailJS
            const emailData = {
                to_email: correo,
                subject: 'Recuperación de Contraseña',
                message: `Tu código de recuperación es: ${codigo}`
            };

            // Configura EmailJS para el envío
            send(
                'service_podqncg', // Tu ID de servicio EmailJS
                'template_xnpls19', // Tu ID de plantilla EmailJS
                emailData,
                'it57DOPi1-ZuX3rXe' // Tu usuario de EmailJS
            )
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Correo enviado',
                        text: 'El código de recuperación ha sido enviado a tu correo.'
                    });
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al enviar el correo. Intenta nuevamente.'
                    });
                });

        } catch (error) {
            setError(error.response.data.message);
            setMensaje('');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            <div className="absolute inset-0">
                <img
                    src={fuera_2}  // Ahora está definido
                    alt="Fondo"
                    className="w-full h-full object-cover filter blur"
                />
                <div className="absolute inset-0 bg-gray-900 opacity-40"></div>
            </div>
            <div className="relative z-10 w-full max-w-md p-6 mx-auto">
                {/* Texto "Colonial" fuera del div blanco */}
                <div className="text-center mb-6">
                    <a href="/inicio" className="text-4xl font-bold text-gray-300 hover:text-gray-100 transition-colors">
                        Colonial
                    </a>
                </div>
                <section className="bg-white bg-opacity-60 rounded-lg shadow-2xl">
                    <div className="space-y-4 p-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Restablecer tu Contraseña
                        </h1>
                        <form className="space-y-4 text-center" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="correo"
                                    className="text-left block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    id="correo"
                                    value={correo}
                                    onChange={handleChange} // Usar la función handleChange
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Tu correo electrónico registrado"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white font-bold rounded-2xl shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-xl"
                            >
                                Recuperar Contraseña
                            </button>
                        </form>
                        <p className="text-sm text-gray-600">
                            ¿Ya la recordaste? <a href="/login" className="text-sm font-bold text-black">Inicia Sesión</a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RecuperacionContrasena;
