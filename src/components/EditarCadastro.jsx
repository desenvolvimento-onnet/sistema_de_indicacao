import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    const [saving, setSaving] = useState(false);  // Estado para controle de salvamento

    const navigate = useNavigate();
    const roles = ['ADMIN', 'MANAGER', 'COLLABORATOR'];

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:3333/collaborators', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na requisição!');
                }
                return response.json();
            })
            .then((data) => {
                setUsers(data ? data.data : []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao buscar os dados:', error);
                setError('Erro ao carregar os dados. Tente novamente mais tarde.');
                setLoading(false);
            });
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
        };

        fetch(`http://localhost:3333/collaborators/${selectedUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(updatedUser),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Erro ao salvar os dados!');
                return response.json();
            })
            .then(() => {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user
                    )
                );
                setIsModalOpen(false);
                setSaving(false);
            })
            .catch((error) => {
                console.error(error);
                setSaving(false);
            });
            console.log('Dados: ', updatedUser);
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
                            >
                                &laquo;
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={currentPage === index + 1 ? styles.active : ''}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
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
                handleSubmit={handleSubmit}
                saving={saving}
                roles={roles}
            />
        </div>
    );
};

export default EditarCadastro;
