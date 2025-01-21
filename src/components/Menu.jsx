import styles from './Menu.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHdd, faNewspaper, faHome, faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const roleBasedMenu = {
  ADMIN: [
    { icon: faNewspaper, label: 'Formulário', path: '/Formulario' },
    { icon: faHdd, label: 'Registros', path: '/Registros' },
    { icon: faUser, label: 'Cadastrar Usuários', path: '/Cadastro' },
    { icon: faUserCog, label: 'Editar Usuários', path: '/VisualizarUsuarios' },
  ],
  MANAGER: [
    { icon: faNewspaper, label: 'Formulário', path: '/Formulario' },
    { icon: faHdd, label: 'Registros', path: '/Registros' },
    { icon: faUser, label: 'Cadastrar Usuários', path: '/Cadastro' },
    { icon: faUserCog, label: 'Editar Usuários', path: '/VisualizarUsuarios' },
  ],
  COLLABORATOR: [
    { icon: faHdd, label: 'Registros dos Colaboradores', path: '/RegistrosOperadores' },
  ],
};

const Menu = () => {
  const [visibleTooltip, setVisibleTooltip] = useState(null);
  const [role, setRole] = useState(null); 
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleMouseEnter = (index) => setVisibleTooltip(index);
  const handleMouseLeave = () => setVisibleTooltip(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const userEmail = sessionStorage.getItem('userEmail');

    //Verifica o token e o e-mail logado
    // console.log('Token:', token);
    // console.log('E-mail do usuário logado:', userEmail);

    if (!token || !userEmail) {
      console.error('Token ou e-mail não encontrado no sessionStorage.');
      setError('Por favor, faça login novamente.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:3333/collaborators/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          // console.log('Status da resposta:', response.status);
          throw new Error('Erro na requisição!');
        }
        return response.json();
      })
      .then((data) => {
        // console.log('Dados da API:', data.collaborator);

        const user = data?.collaborator

        if (user) {
          setRole(user.role); // Apenas o role
          setUserDetails(user); // Detalhes completos do usuário
          // console.log('Usuário logado:', user);
        } else {
          console.error('Usuário logado não encontrado.');
          setError('Usuário logado não encontrado.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados:', error);
        setError('Erro ao carregar os dados. Tente novamente mais tarde.');
        setLoading(false);
      });
  }, []);

  // console.log('Role atual no estado:', role);
  // console.log('Detalhes do usuário:', userDetails);

  const menuItems = [
    { icon: faHome, label: 'Início', path: '/Home' },
    ...(roleBasedMenu[role] || []),
  ];

  const handleItemClick = (path) => navigate(path);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // if (role === 'COLLABORATOR') {
  //   return <MenuCollaborator />;
  // }

  return (
    <nav className={styles.sidebar_navigation}>
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleItemClick(item.path)}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span
              className={`${styles.tooltip} ${visibleTooltip === index ? styles.visible : ''}`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
