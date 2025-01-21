import React, { useState, useEffect } from 'react'; // Importa React e hooks necessários
import InputMask from 'react-input-mask'; // Biblioteca para máscaras
import styles from './Teste.module.css'; // Estilos específicos
import Menu from '../../components/Menu.jsx'; // Componente de Menu
import { useNavigate } from 'react-router-dom'; // Navegação entre rotas
import ModalEditarIndicacao from '../../components/ModalEditarIndicacao.jsx';

const Teste = () => {

    return (
        <div>
            <ModalEditarIndicacao/>
        </div>
    );
};

export default Teste;
