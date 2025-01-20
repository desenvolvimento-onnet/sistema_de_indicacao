import React, { useState } from 'react'; // Importa o React e o hook useState para gerenciar estados.
import InputMask from 'react-input-mask'; // Biblioteca para aplicar máscaras em inputs.
import styles from './Formulario.module.css'; // Importa os estilos específicos para o formulário.
import { Header } from '../../components/Header'; // Componente de cabeçalho.
import Menu from '../../components/Menu.jsx';
import { useNavigate } from 'react-router-dom'; // Hook para navegação entre rotas.
import { v4 as uuidv4 } from 'uuid';

const Formulario = () => {
    // Declaração do estado do formulário com useState, inicializando os campos vazios.
    const [formData, setFormData] = useState({
        name: '',
        collaboratorId: '01d7206b-f199-418d-a546-84ae63628da8',
        document: '',
        contact: '',
        city: '',
        district: '',
        street: '',
        number: '',
        // clienteOuFuncionario: '', // Determina se quem está indicando é cliente ou funcionário.
    });

    const [isLoading, setIsLoading] = useState(false); // Estado para indicar carregamento.

    // Função para lidar com mudanças nos inputs. Atualiza o estado do campo correspondente.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, // Mantém os valores anteriores do estado.
            [name]: value, // Atualiza apenas o campo alterado.
        });
    };
    
    // Função para lidar com o envio do formulário e enviar para a API.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita o comportamento padrão de recarregar a página
        setIsLoading(true); // Ativa o estado de carregamento

        // Logando o objeto JSON antes de enviá-lo
        console.log('Dados a serem enviados:', formData);
        try {
            const response = await fetch('http://localhost:3333/indications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(formData), // Converte os dados do formulário para JSON
                
            });
            console.log('Response: ', response.message);
    
            if (!response.ok) {
                const errorData = await response.json(); // Captura o erro da resposta
                throw new Error(errorData.message || 'Erro ao enviar os dados');
            }
    
            const data = await response.json(); // Obtém a resposta da API
            console.log('Resposta da API:', data);
            alert('Dados enviados com sucesso!'); // Exibe mensagem de sucesso
            setFormData({
                name: '',
                collaboratorId: '01d7206b-f199-418d-a546-84ae63628da8',
                document: '',
                contact: '',
                city: '',
                district: '',
                street: '',
                number: '',
            }); // Reseta o formulário

            //Navega para a pagina de Registros
            navigate('/Registros');

        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            alert(`Ocorreu um erro ao enviar os dados: ${error.message}`);
        } finally {
            setIsLoading(false); // Desativa o estado de carregamento
        }
    
    };

    // Hook para navegação entre páginas.
    const navigate = useNavigate();

    return (
        <div>
            <Menu/>
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
                {/* Formulário */}
                <form onSubmit={handleSubmit} className={styles['form']}>
                    {/* Campo Nome */}
                    <div className={styles['form-group']}>
                        <label htmlFor='name'>Nome:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles['input-mask']}
                            maxLength="100"
                            required
                        />
                    </div>

                    {/* Campos Telefone e CPF */}
                    <div className={styles['form-group-inline']}>
                        <div className={styles['inline-group']}>
                            <label htmlFor="contact">Telefone:</label>
                            <InputMask
                                mask="(99) 99999-9999" // Máscara para formato de telefone.
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className={styles['input-mask']}
                                required
                            />
                        </div>
                        <div className={styles['inline-group']}>
                            <label htmlFor="document">CPF:</label>
                            <InputMask
                                mask="999.999.999-99" // Máscara para CPF.
                                id="document"
                                name="document"
                                value={formData.document}
                                onChange={handleChange}
                                className={styles['input-mask']}
                                required
                            />
                        </div>
                    </div>
                    <br/>
                    {/* Campos Rua e Numero */}
                    <div className={styles['form-group-inline']}>
                        {/* Campo Rua */}
                        <div className={styles['form-group']}>
                            <label htmlFor="street">Rua:</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                className={styles['input-mask']}
                                maxLength="150"
                                required
                            />
                        </div>
                        <div className={styles['inline-group']}>
                            <label htmlFor="number">Número:</label>
                            <input
                                type="number"
                                id="number"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                onInput={(e) => {
                                    if (e.target.value.length > 4) {
                                        e.target.value = e.target.value.slice(0, 4); // Limita a 4 caracteres
                                    }
                                }}
                                className={styles['input-mask']}
                                max={9999} // Limita o valor máximo
                                min={0}    // Define um valor mínimo, se necessário
                                required
                            />
                        </div>

                    </div>

                    {/* Campos Bairro e Cidade */}
                    <div className={styles['form-group-inline']}>
                        <div className={styles['inline-group']}>
                            <label htmlFor="district">Bairro:</label>
                            <input
                                type="text"
                                id="district"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className={styles['input-mask']}
                                maxLength="50"
                                required
                            />
                        </div>
                        <div className={styles['inline-group']}>
                            <label htmlFor="city">Cidade:</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={styles['input-mask']}
                                maxLength="50"
                                required
                            />
                        </div>
                    </div>

                    {/* Campo Nome do Indicador e Opção Cliente/Funcionário */}
                    <div className={styles['radio-group']}>
                        <label>Quem está fazendo a indicação?</label>
                        <div className={styles['form-group']}>
                            <label htmlFor='collaboratorId'>Nome:</label>
                            <input
                                type="text"
                                id="collaboratorId"
                                name="collaboratorId"
                                value={formData.collaboratorId}
                                onChange={handleChange}
                                className={styles['input-mask']}
                                maxLength="100"
                                required
                            />
                        </div>
                        {/* <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="clienteOuFuncionario"
                                    value="cliente"
                                    checked={formData.clienteOuFuncionario === 'cliente'}
                                    onChange={handleChange}
                                />
                                Cliente
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="clienteOuFuncionario"
                                    value="funcionario"
                                    checked={formData.clienteOuFuncionario === 'funcionario'}
                                    onChange={handleChange}
                                />
                                Funcionário
                            </label>
                        </div> */}
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

export default Formulario; // Exporta o componente para ser usado em outras partes da aplicação.
