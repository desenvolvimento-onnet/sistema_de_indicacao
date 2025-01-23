import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EditarCadastro.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Menu from './Menu';
import React from 'react';
import Modal from 'react-modal';
import ModalEdicao from './ModalEdicao';

Modal.setAppElement('#root');

const EditarCadastro = () => {
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [saving, setSaving] = useState(false); // Controle de salvamento

    const roles = ['ADMIN', 'MANAGER', 'COLLABORATOR'];

    // Função para buscar usuários
    const fetchUsers = () => {
        setLoading(true);
        fetch('http://localhost:3333/collaborators', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            },
        })
            .then(async (response) => {
                if (!response.ok) throw new Error('Erro na requisição!');
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            })
            .then((data) => {
                if (!data || !data.data) throw new Error('Dados inválidos recebidos!');
                setUsers(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao buscar os dados:', error);
                setError('Erro ao carregar os dados. Tente novamente mais tarde.');
                setLoading(false);
            });
    };

    // Carrega os dados ao montar o componente
    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) =>
        (user.name || '').toLowerCase().includes(searchName.toLowerCase()) &&
        (user.email || '').toLowerCase().includes(searchEmail.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
    
        const updatedUser = {
            id: selectedUser.id,
            name: e.target.name.value,
            shortName: e.target.shortName.value,
            email: e.target.email.value,
            password: e.target.password.value,
            role: e.target.role.value,
            active: selectedUser.active,
        };
    
        fetch(`http://localhost:3333/collaborators/${selectedUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(updatedUser),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Erro ao salvar os dados!');
                return response.json();
            })
            .catch((error) => {
                console.error('Erro ao salvar:', error);
            })
            .finally(() => {
                setIsModalOpen(false); // Fecha o modal
                setSaving(false);
                window.location.reload(); // Recarrega a página
            });
    };
    

    return (
        <div>
            <Menu />
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.carregamento}>Carregando...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <>
                        <h1>Edição de Usuários Cadastrados</h1>
                        <div className={styles.filters}>
                            <input
                                type="text"
                                placeholder="Filtrar por Nome"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Filtrar por E-mail"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                            />
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Nome Abreviado</th>
                                    <th>E-mail</th>
                                    <th>Role</th>
                                    <th>Situação</th>
                                    <th className={styles.linhaEditar}>Editar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.shortName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.active ? 'Ativo' : 'Inativo'}</td>
                                        <td className={styles.botaoEditar}>
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className={styles.buttonEdit}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className={`${styles.pageButton} ${
                                    currentPage === 1 ? styles.disabledButton : ''
                                }`}
                            >
                                &laquo;
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={currentPage === index + 1 
                                        ? `${styles.activePage} ${styles.pageButton}` 
                                        : styles.pageButton}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
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
            <ModalEdicao
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                handleSubmit={handleSubmit}
                saving={saving}
                roles={roles}
            />
        </div>
    );
};

export default EditarCadastro;
