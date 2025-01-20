// Importa React hooks e dependências externas
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Hooks para manipular parâmetros da URL e navegação
import styles from './EditPage.module.css'; // Importa estilos específicos
import InputMask from 'react-input-mask'; // Biblioteca para mascarar entradas, como CPF e telefone
import { LiaCloneSolid } from 'react-icons/lia';

// Componente principal para a edição de dados
const EditPage = () => {
    const { id } = useParams(); // Obtém o ID da URL para buscar o registro correspondente
    const navigate = useNavigate(); // Hook para redirecionar o usuário após ações

    // Estado inicial do formulário e variáveis auxiliares
    const [formData, setFormData] = useState({
        name: '', // Nome do indicado
        indicatorId: '8dfdd0c5-fa95-4210-a053-d146e9e29e34', // ID fixo do indicador
        document: '', // CPF do indicado
        contact: '', // Telefone do indicado
        city: '', // Cidade do indicado
        district: '', // Bairro do indicado
        street: '', // Rua do indicado
        number: '', // Número do endereço
    });

    const [loading, setLoading] = useState(true); // Estado de carregamento dos dados
    const [error, setError] = useState(null); // Armazena mensagens de erro

    // useEffect para buscar os dados do servidor ao montar o componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3333/indications/${id}`); // Faz requisição à API para buscar os dados do registro
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Erro ao buscar os dados: ', errorData);
                    throw new Error('Erro ao buscar os dados.'); // Lança erro se a resposta não for bem-sucedida

                }
                const data = await response.json(); // Converte os dados da resposta em JSON
                setFormData({
                    name: data.name || '', // Atualiza os campos do formulário com os dados recebidos ou valores padrão
                    indicatorId: data.indicatorId || '8dfdd0c5-fa95-4210-a053-d146e9e29e34',
                    document: data.document || '',
                    contact: data.contact || '',
                    city: data.city || '',
                    district: data.district || '',
                    street: data.street || '',
                    number: data.number || '',
                });
                setLoading(false); // Define que o carregamento foi concluído
            } catch (error) {
                console.error(error); // Exibe o erro no console para depuração
                setError('Erro ao carregar os dados. Tente novamente mais tarde.'); // Define uma mensagem de erro
                setLoading(false); // Finaliza o estado de carregamento, mesmo em caso de erro
            }
        };

        fetchData(); // Chama a função para buscar os dados
    }, [id]); // Dependência do ID garante que o efeito será executado se o ID mudar

    // Manipula alterações nos campos do formulário
    const handleChange = e => {
        const { name, value } = e.target; // Obtém o nome e valor do campo editado
        setFormData({ ...formData, [name]: value }); // Atualiza o estado do formulário dinamicamente
    };

    // Manipula o envio do formulário
    const handleSubmit = async e => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        try {
            const response = await fetch(`http://localhost:3333/indications/${id}`, {
                method: 'PUT', // Método HTTP para atualizar dados existentes
                headers: {
                    'Content-Type': 'application/json', // Especifica que o corpo da requisição é JSON
                },
                body: JSON.stringify(formData), // Converte os dados do formulário para JSON
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar os dados.'); // Lança erro se a resposta não for bem-sucedida
            }

            alert('Dados salvos com sucesso!'); // Notifica o usuário sobre o sucesso
            navigate('/Registros'); // Redireciona o usuário para a página de registros
        } catch (error) {
            console.error(error); // Exibe o erro no console
            alert('Erro ao salvar os dados. Tente novamente mais tarde.'); // Notifica o usuário sobre o erro
        }
    };

    // Renderização condicional durante o carregamento ou erro
    if (loading) {
        return <p>Carregando...</p>; // Exibe mensagem de carregamento enquanto os dados não foram carregados
    }

    if (error) {
        return <p>{error}</p>; // Exibe mensagem de erro, se houver
    }

    // Retorna o formulário de edição
    return (
        <div className={styles.edit_page}>
            <div className={styles.form_container}>
                <h2>Editar Dados</h2>
                <form onSubmit={handleSubmit}>
                    {/* Campo para editar o nome */}
                    <label>
                        Nome do(a) Indicado(a):
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            maxLength="150" // Limita o número de caracteres
                            required
                        />
                    </label>
                    {/* Campo para editar o telefone com máscara */}
                    <label>
                        Telefone:
                        <InputMask
                            mask="(99) 99999-9999"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    {/* Campo para editar o CPF com máscara */}
                    <label>
                        CPF:
                        <InputMask
                            mask="999.999.999-99"
                            name="document"
                            value={formData.document}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    {/* Campos para endereço */}
                    <label>
                        Rua:
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            maxLength="150"
                            required
                        />
                    </label>
                    <label>
                        Número:
                        <input
                            type="number"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Bairro:
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            maxLength="100"
                            required
                        />
                    </label>
                    <label>
                        Cidade:
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            maxLength="100"
                            required
                        />
                    </label>
                    {/* Botão para salvar os dados */}
                    <button type="submit" className={styles.save_button}>
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

// Exporta o componente para ser usado em outras partes da aplicação
export default EditPage;
