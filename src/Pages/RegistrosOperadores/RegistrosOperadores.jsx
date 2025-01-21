import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RegistrosOperadores.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Menu from '../../components/Menu.jsx';

const RegistrosOperadores = () => {
    const { id } = useParams();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchDocument, setSearchDocument] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    // const [searchOperator, setSearchOperator] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if(!token){
            navigate('/Home');
            return;
        }
        
        setLoading(true);
        fetch('http://localhost:3333/indications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
            },
        })
            .then(response => response.json())
            .then(json => setUsers(json.indications))
            .catch(error => console.error('Erro ao carregar dados:', error))
            .finally(() => setLoading(false));

           
    }, [navigate]);

    

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        user.document.toLowerCase().includes(searchDocument.toLowerCase()) &&
        user.status.toLowerCase().includes(searchStatus.toLowerCase()) 
        // user.operator.toLowerCase().includes(searchOperator.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = pageNumber => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleEditClick = id => {
        navigate(`/edit/${id}`); 
    };

    console.log('Dados: ', users);

    return (
        <div>
            <Menu/>
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
                                onChange={e => setSearchName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Filtrar por Documento"
                                value={searchDocument}
                                onChange={e => setSearchDocument(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Filtrar por Status"
                                value={searchStatus}
                                onChange={e => setSearchStatus(e.target.value)}
                            />
                            {/* <input
                                type="text"
                                placeholder="Filtrar por Operador"
                                value={searchOperator}
                                onChange={e => setSearchOperator(e.target.value)}
                            /> */}
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Nome do(a) Indicado(a)</th>
                                        <th>Quem Indicou</th>
                                        <th>Telefone</th>
                                        <th>CPF</th>
                                        <th>Rua</th>
                                        <th>Número</th>
                                        <th>Bairro</th>
                                        <th>Cidade</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map(user => (
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.pagination}>
                            <button
                                onClick={() => paginate(1)}
                                disabled={currentPage === 1}
                                className={`${styles.pageButton} ${currentPage === 1 ? styles.disabledButton : ''}`}
                            >
                                &laquo;
                            </button>
                            {[...Array(totalPages).keys()].map(number => (
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
                                className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabledButton : ''}`}
                            >
                                &raquo;
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegistrosOperadores;
