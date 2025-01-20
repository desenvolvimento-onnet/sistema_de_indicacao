import React from 'react';
import Modal from 'react-modal';
import styles from './Modal.module.css';

const UserEditModal = ({ isModalOpen, setIsModalOpen, selectedUser, handleSubmit, saving, roles }) => {
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            overlayClassName={styles.modalOverlay}
            className={styles.modalContent}
        >
            <h2>Editar Usuário Cadastrado</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.campoFormulario}>
                    <label className={styles.labelFormulario}>Nome:</label>
                    <input
                        className={styles.inputFormulario}
                        type="text"
                        name="name"
                        defaultValue={selectedUser?.name || ''}
                    />
                </div>
                <div className={styles.campoFormulario}>
                    <label className={styles.labelFormulario}>Nome de Exibição:</label>
                    <input
                        className={styles.inputFormulario}
                        type="text"
                        name="shortName"
                        defaultValue={selectedUser?.shortName || ''}
                    />
                </div>
                <div className={styles.campoFormulario}>
                    <label className={styles.labelFormulario}>E-mail:</label>
                    <input
                        className={styles.inputFormulario}
                        type="email"
                        name="email"
                        defaultValue={selectedUser?.email || ''}
                    />
                </div>
                <div className={styles.campoFormulario}>
                    <label className={styles.labelFormulario}>Senha:</label>
                    <input
                        className={styles.inputFormulario}
                        type="password"
                        name="password"
                        defaultValue={selectedUser?.password || ''}
                    />
                </div>
                <div className={styles.campoFormulario}>
                    <label className={styles.labelFormulario}>Nível de Acesso:</label>
                    <select
                        className={styles.selectFormulario}
                        name="role"
                        defaultValue={selectedUser?.role || ''}
                    >
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className={styles.botaoSalvarEdicao} disabled={saving} onClick={() => {
                    window.location.reload();
                }}>
                    {saving ? 'Salvando...' : 'Salvar'}

                </button>
            </form>
        </Modal>
    );
};

export default UserEditModal;
