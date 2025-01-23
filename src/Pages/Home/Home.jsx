import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import logo from '../../images/logo.webp';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Limpa erros anteriores
    
        try {
            // console.log('Enviando dados:', { email, password });
    
            // Faz a requisição para a API
            const response = await axios.post('http://localhost:3333/auth', {
                email,
                password,
            });
    
            // console.log('Resposta da API:', response);
    
            // Verifica e armazena o token
            const token = response.data.token;
            // console.log(token);
            if (token) {
                sessionStorage.setItem('authToken', token);
                // console.log(token);
                sessionStorage.setItem('userEmail', email);
                // console.log('E-mail: ', email);
                navigate('/Registros');
            } else {
                setError('Erro ao autenticar. Token não recebido.');
            }
        } catch (err) {
            console.error('Erro na autenticação:', err);
    
            if (err.response) {
                console.error('Detalhes do erro:', err.response.data);
    
                if (err.response.status === 400) {
                    setError('E-mail ou senha inválidos. Tente novamente.');
                } else {
                    setError(`Erro inesperado: ${err.response.status}`);
                }
            } else {
                setError('Erro ao conectar ao servidor. Verifique sua conexão.');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.logo_container}>
                        <img src={logo} alt="Logo OnNet" />
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.text_container}>
                        <h1>
                            Bem-vindo ao <span>OnNet Indica</span>
                        </h1>
                        <div className={styles.login}>
                            <form onSubmit={handleSubmit} className={styles.formLogin}>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">E-mail:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Digite seu e-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="password">Senha:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={styles.containerButton}>
                                    <button type="submit">Entrar</button>
                                </div>
                            </form>
                            <div className={styles.linkContainer}>
                                <Link to="/cadastro">Não tem uma conta? Cadastre-se</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
