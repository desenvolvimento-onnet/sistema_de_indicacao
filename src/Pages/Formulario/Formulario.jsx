import React, { useState, useEffect } from 'react'; // Importa React e hooks necessários
import InputMask from 'react-input-mask'; // Biblioteca para máscaras
import styles from './Formulario.module.css'; // Estilos específicos
import Menu from '../../components/Menu.jsx'; // Componente de Menu
import { useNavigate } from 'react-router-dom'; // Navegação entre rotas

const Formulario = () => {
    const [formData, setFormData] = useState({
        name: '',
        collaboratorId: '',
        document: '',
        contact: '',
        city: '',
        district: '',
        street: '',
        number: '',
        status: '',
    });

    const [options, setOptions] = useState([]); // Estado para armazenar as opções do select
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento
    const navigate = useNavigate();

    // Função para buscar os nomes da API
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('http://localhost:3333/collaborators', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Erro ao buscar os nomes!');
                }
    
                const data = await response.json();
                console.log('Data:', data);
    
                // Ajuste para usar a estrutura correta
                if (data && Array.isArray(data.data)) {
                    setOptions(data.data); // Atualiza as opções com os dados retornados
                } else {
                    console.warn('Estrutura de resposta inesperada:', data);
                    setOptions([]);
                }
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
                alert('Erro ao carregar os nomes.');
            }
        };
    
        fetchOptions();
    }, []);
    
    

    // Atualiza o estado com os valores do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Função para enviar os dados do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3333/indications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao enviar os dados.');
            }

            alert('Dados enviados com sucesso!');
            navigate('/Registros'); // Navega para a página de registros
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao enviar os dados.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Menu />
            <div className={styles['form-container']}>
                {/* Texto explicativo do formulário */}
                <div className={styles['text-container']}>
                    <h1>OnNet Indica</h1>
                    <br/>
                    <p>Seja bem-vindo ao nosso sistema de indicações!</p>
                    <br/>
                    <p>Aqui, você pode recomendar amigos, familiares ou colegas de trabalho para nossos serviços de forma fácil e rápida.</p>
                    <br/>
                    <h2>Como funciona?</h2>
                    <br/>
                    <ul>
                        <li>Preencha o formulário com os dados da pessoa que você está indicando.</li>
                        <li>Selecione se você é um cliente ou funcionário.</li>
                        <li>Envie o formulário para que possamos entrar em contato com o indicado.</li>
                    </ul>
                </div>
                <br/>
                <form onSubmit={handleSubmit} className={styles['form']}>
                    {/* Campo Nome */}
                    <div className={styles['form-group']}>
                        <label htmlFor="name">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            maxLength='150'
                            required
                        />
                    </div>

                    <div className={styles['form-group-inline']}>
                        {/* Campo Telefone */}
                        <div className={styles['form-group']}>
                            <label htmlFor="contact">Telefone:</label>
                            <InputMask
                                mask="(99) 99999-9999"
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Campo CPF */}
                        <div className={styles['form-group']}>
                            <label htmlFor="document">CPF:</label>
                            <InputMask
                                mask="999.999.999-99"
                                id="document"
                                name="document"
                                value={formData.document}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    
                        {/* Campos de Endereço */}
                        <div className={styles['form-group']}>
                            <label htmlFor="street">Rua:</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                maxLength='100'
                                required
                            />
                        </div>

                    <div className={styles['form-group-inline']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="number">Número:</label>
                            <input
                                type="number"
                                id="number"
                                name="number"
                                value={formData.number}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value <= 99999) {
                                        handleChange(e);
                                    }
                                }}
                                max="99999"
                                required
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="district">Bairro:</label>
                            <input
                                type="text"
                                id="district"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                maxLength='100'
                                required
                            />
                        </div>
                    </div>
                    
                    <div className={styles['form-group']}>
                        <label htmlFor="city">Cidade:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            maxLength='50'
                            required
                        />
                    </div>

                    {/* Select de nomes */}
                    <div className={styles['form-group']}>
                        <label htmlFor="collaboratorId">Quem está fazendo a indicação:</label>
                        <select
                            id="collaboratorId"
                            name="collaboratorId"
                            className={styles['input-mask']}
                            value={formData.collaboratorId}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um colaborador
                            </option>
                            {options.map((collaborator) => (
                                <option key={collaborator.id} value={collaborator.id}>
                                    {collaborator.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Select de status */}
                    <div className={styles['form-group']}>
                        <label htmlFor="status">Situação da Indicação:</label>
                        <select
                            id="status"
                            name="status"
                            className={styles['input-mask']}
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um Status
                            </option>
                            <option value="PENDING">PENDING</option>
                            {/* <option value="ACCEPT">ACCEPT</option>
                            <option value="DECLINED">DECLINED</option>
                            <option value="COMPLETED">COMPLETED</option> */}
                        </select>
                    </div>

                    {/* Botão de Envio */}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Formulario;
