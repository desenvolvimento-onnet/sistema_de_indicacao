import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Menu from '../../components/Menu.jsx';
import Modal from 'react-modal';
import ModalEditarIndicacao from '../../components/ModalEditarIndicacao.jsx';
import styles from './Registros.module.css';

Modal.setAppElement('#root');

const Registros = () => {
    const { id } = useParams();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchDocument, setSearchDocument] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndication, setSelectedIndication] = useState(null);
    const [saving, setSaving] = useState(false);
    const [collaborators, setCollaborators] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            navigate('/Home');
            return;
        }

        setLoading(true);
        fetch('http://localhost:3333/indications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            },
        })
            .then((response) => response.json())
            .then((json) => setUsers(json.indications))
            .catch((error) => console.error('Erro ao carregar dados:', error))
            .finally(() => setLoading(false));

        const fetchCollaborators = async () => {
            try {
                const response = await fetch('http://localhost:3333/collaborators', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Erro ao buscar os colaboradores!');
                }
                const data = await response.json();
                setCollaborators(data.data || []);
            } catch (error) {
                console.error('Erro ao buscar colaboradores:', error);
            }
        };

        fetchCollaborators();
    }, [navigate]);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        user.document.toLowerCase().includes(searchDocument.toLowerCase()) &&
        user.status.toLowerCase().includes(searchStatus.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleEditClick = (user) => {
        setSelectedIndication(user);
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);

        const updateIndication = {
            id: selectedIndication.id,
            indicatedBy: e.target.indicatedBy.value,
            name: e.target.name.value,
            document: e.target.document.value,
            contact: e.target.contact.value,
            city: e.target.city.value,
            district: e.target.district.value,
            street: e.target.street.value,
            number: e.target.number.value,
            status: e.target.status.value,
        };

        console.log('Payload enviado para PUT:', updateIndication);

        fetch(`http://localhost:3333/indications/${selectedIndication.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(updateIndication),
        })
            .then(async (response) => {
                console.log('Response status:', response.status);
                
                if (response.status === 204 || response.headers.get('content-length') === '0') {
                    console.log('Resposta sem conteúdo, atualização bem-sucedida');
                    return {}; // Retorna um objeto vazio
                }
                // Caso contrário, tenta parsear o JSON
                const data = await response.json();
                return data;
            })
            .then((data) => {
                if (data) {
                    console.log('Indicação atualizada com sucesso', data);
                    setUsers((prevIndications) =>
                        prevIndications.map((user) =>
                            user.id === updateIndication.id ? { ...user, ...updateIndication } : user
                        )
                    );
                    setIsModalOpen(false);
                    setSaving(false);
                }
            })
            .catch((error) => {
                console.error('Erro na requisição:', error.message);
                setSaving(false);
            });
    };

    return (
        <div>
            <Menu />
            <div className={styles.container}>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <h1>Relação de Indicações</h1>
                        <div className={styles.filters}>
                            <input
                                type="text"
                                placeholder="Filtrar por nome"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Filtrar por Documento"
                                value={searchDocument}
                                onChange={(e) => setSearchDocument(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Filtrar por Status"
                                value={searchStatus}
                                onChange={(e) => setSearchStatus(e.target.value)}
                            />
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Nome do(a) Indicado(a)</th>
                                        <th>Quem Indicou</th>
                                        <th>CPF</th>
                                        <th>Telefone</th>
                                        <th>Rua</th>
                                        <th>Número</th>
                                        <th>Bairro</th>
                                        <th>Cidade</th>
                                        <th>Status</th>
                                        <th>Editar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.indicatedBy}</td>
                                            <td>{user.document}</td>
                                            <td>{user.contact}</td>
                                            <td>{user.street}</td>
                                            <td>{user.number}</td>
                                            <td>{user.district}</td>
                                            <td>{user.city}</td>
                                            <td>{user.status}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className={styles.buttonEdit}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                        <div className={styles.pagination}>
                            <button
                                onClick={() => paginate(1)}
                                disabled={currentPage === 1}
                                className={`${styles.pageButton} ${
                                    currentPage === 1 ? styles.disabledButton : ''
                                }`}
                            >
                                &laquo;
                            </button>
                            {[...Array(totalPages).keys()].map((number) => (
                                <button
                                    key={number + 1}
                                    onClick={() => paginate(number + 1)}
                                    className={
                                        currentPage === number + 1
                                            ? `${styles.activePage} ${styles.pageButton}`
                                            : styles.pageButton
                                    }
                                >
                                    {number + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`${styles.pageButton} ${
                                    currentPage === totalPages ? styles.disabledButton : ''
                                }`}
                            >
                                &raquo;
                            </button>
                        </div>
                        
                    </>
                )}
            </div>
            <ModalEditarIndicacao
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                selectedIndication={selectedIndication}
                handleSubmit={handleSubmit}
                saving={saving}
                collaborators={collaborators}
            />
        </div>
    );
};

export default Registros;
