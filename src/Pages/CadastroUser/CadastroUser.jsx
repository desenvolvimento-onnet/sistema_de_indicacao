import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import EditarCadastro from '../../components/EditarCadastro';
import style from './CadastroUser.module.css';
import Menu from '../../components/Menu.jsx';

const roles = ['ADMIN', 'MANAGER', 'COLLABORATOR'];

const CadastroUser = () => {
  const [activeTab, setActiveTab] = useState('cadastro');
  const [formData, setFormData] = useState({
    // id: '',
    name: '',
    shortName: '',
    email: '',
    password: '',
    role: '',
    active: true,
  });

  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5555/collaborator');
  //       const data = await response.json();
  //       console.log(data);
  //       setUsers(data);
  //     } catch (error) {
  //       console.error("Erro ao carregar os usuários:", error);
  //     }
  //   };
  //   fetchUsers();
  // },);

  // const handleChange = (e, isEdit = false) => {
  //   const { name, value } = e.target;
  //   if (isEdit) {
  //     setEditData({ ...editData, [name]: value });
  //   } else {
  //     setFormData({ ...formData, [name]: value });
  //   }
  // };


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   alert('Usuário cadastrado com sucesso!\n' + JSON.stringify(formData));
  // };


  // const handleEditSubmit = (e) => {
  //   e.preventDefault();
  //   alert('Usuário atualizado com sucesso!\n' + JSON.stringify(editData));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value}); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const response = await fetch('http://localhost:3333/collaborators', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${sessionStorage.getItem('authToken')}`  

        },
        body: JSON.stringify(formData),
      });

      if (!response.ok){
        throw new Error(`Erro: ${response.statusText}`);
      }
      const result = await response.json();
      alert("Usuario cadastrado com sucesso!");
      // alert("Usuario cadastrado com sucesso!\n" + JSON.stringify(result));

      //limpa o formulario apos o sucesso
      setFormData({
        name: '',
        shortName: '',
        email: '',
        password: '',
        role: '',
        active: true,
      });
    }catch (error){
      console.error('Erro ao cadastrar o usuario: ', error);
      alert('Erro ao cadastrar o usuario. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div>
      <Menu />

      {/* Aba de Cadastro */}
      {activeTab === 'cadastro' && (
        <div className={style.containerCadastro}>
          <div className={style.textCadastro}>
            <h2 className={style.tituloCadastro}>Cadastro de Usuário</h2>
            <p>Preencha as informações dos colaboradores para habilitar o acesso ao sistema.</p>
          </div>
          <form onSubmit={handleSubmit} className={style.formularioCadastro}>
            <div className={style.campoFormulario}>
              <label className={style.labelFormulario}>Nome:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={style.inputFormulario}
                required
              />
            </div>
            <div className={style.campoFormulario}>
              <label className={style.labelFormulario}>Nome de Exibição:</label>
              <input
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                className={style.inputFormulario}
                required
              />
            </div>
            <div className={style.campoFormulario}>
              <label className={style.labelFormulario}>E-mail:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={style.inputFormulario}
                required
              />
            </div>
            <div className={style.campoFormulario}>
              <label className={style.labelFormulario}>Senha:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={style.inputFormulario}
                required
              />
            </div>
            <div className={style.campoFormulario}>
              <label className={style.labelFormulario}>Nível de Acesso:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={style.selectFormulario}
                required
              >
                <option value=""></option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className={style.botaoSubmitCadastro}>
              Cadastrar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CadastroUser;
