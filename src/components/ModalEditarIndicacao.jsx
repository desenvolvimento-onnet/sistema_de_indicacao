import React from 'react';
import Modal from 'react-modal';
import styles from './ModalEditarIndicacao.module.css';

const ModalEditarIndicacao = ({
  isModalOpen,
  setIsModalOpen,
  selectedIndication,
  handleSubmit,
  saving,
  collaborators,
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      overlayClassName={styles.modalOverlay}
      className={styles.modalContent}
    >
      <h2>Editar Indicação</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.campoFormulario}>
          <label className={styles.labelFormulario}>Nome do(a) Indicado(a):</label>
          <input
            className={styles.inputFormulario}
            type="text"
            name="name"
            maxLength="150"
            defaultValue={selectedIndication?.name || ''}
            required
          />
        </div>
        <div className={styles.campoFormulario}>
          <label className={styles.labelFormulario}>Quem indicou:</label>
          <select
            className={styles.inputFormulario}
            name="indicatedBy"
            defaultValue={selectedIndication?.indicatedBy || ''}
            required
          >
            <option value="" disabled>
              Selecione um colaborador
            </option>
            {collaborators.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.name}>
                {collaborator.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles['form-group-inline']}>
          <div className={styles.campoFormulario}>
            <label className={styles.labelFormulario}>Telefone:</label>
            <input
              className={styles.inputFormulario}
              id="contact"
              name="contact"
              type="text"
              defaultValue={selectedIndication?.contact || ''}
              required
            />
          </div>
          <div className={styles.campoFormulario}>
            <label className={styles.labelFormulario}>CPF:</label>
            <input
              className={styles.inputFormulario}
              id="document"
              name="document"
              type="text"
              defaultValue={selectedIndication?.document || ''}
              required
            />
          </div>
        </div>
        <div className={styles.campoFormulario}>
          <label className={styles.labelFormulario}>Rua:</label>
          <input
            className={styles.inputFormulario}
            type="text"
            name="street"
            maxLength="100"
            defaultValue={selectedIndication?.street || ''}
          />
        </div>
        <div className={styles['form-group-inline']}>
          <div className={styles.campoFormulario}>
            <label className={styles.labelFormulario}>Número:</label>
            <input
              className={styles.inputFormulario}
              type="number"
              name="number"
              max="99999"
              defaultValue={selectedIndication?.number || ''}
            />
          </div>
          <div className={styles.campoFormulario}>
            <label className={styles.labelFormulario}>Bairro:</label>
            <input
              className={styles.inputFormulario}
              type="text"
              name="district"
              maxLength="100"
              defaultValue={selectedIndication?.district || ''}
            />
          </div>
          <div className={styles.campoFormulario}>
            <label className={styles.labelFormulario}>Cidade:</label>
            <input
              className={styles.inputFormulario}
              type="text"
              name="city"
              maxLength="50"
              defaultValue={selectedIndication?.city || ''}
            />
          </div>
        </div>
        <div className={styles.campoFormulario}>
          <label className={styles.labelFormulario}>Status:</label>
          <select
            className={styles.inputFormulario}
            name="status"
            defaultValue={selectedIndication?.status || ''}
            required
          >
            <option value="" disabled>
              Selecione o status
            </option>
            <option value="PENDING">Pendente</option>
            <option value="ACCEPT">Aceito</option>
            <option value="DECLINED">Rcusado</option>
            <option value="COMPLETED">Concluído (Pago)</option>
          </select>
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

export default ModalEditarIndicacao;
