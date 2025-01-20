import styles from './MenuCollaborator.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper, faHdd, faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const MenuCollaborator = () => {
  const [visibleTooltip, setVisibleTooltip] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { icon: faHome, label: 'Início', path: '/Home' },
    { icon: faHdd, label: 'Registros', path: '/Registros' }
  ];

  const handleMouseEnter = (index) => {
    setVisibleTooltip(index);
  };

  const handleMouseLeave = () => {
    setVisibleTooltip(null);
  };

  const handleItemClick = (path) => {
    navigate(path);
  };

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

export default MenuCollaborator;
