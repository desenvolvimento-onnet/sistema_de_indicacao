import React from 'react';
import Modal from 'react-modal';
import styles from './Modal.module.css';

const ModalEdicao = ({
    isModalOpen,
    setIsModalOpen,
    selectedUser,
    handleSubmit,
    saving,
    roles,
    setSelectedUser,
}) => {
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)} // Fecha o modal
            overlayClassName={styles.modalOverlay}
            className={styles.modalContent}
        >
            <h2>Editar Usuário Cadastrado</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.inlineGroup}>
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
                <div className={styles.campoFormulario}>
                    <label className={styles.labelFormulario}>Usuário ativo:</label>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            name="active"
                            checked={selectedUser?.active || false}
                            onChange={(e) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    active: e.target.checked,
                                })
                            }
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
                <button
                    type="submit"
                    className={styles.botaoSalvarEdicao}
                    disabled={saving}
                >
                    {saving ? 'Salvando...' : 'Salvar'}
                </button>
            </form>
        </Modal>
    );
};

export default ModalEdicao;
