import './global.css';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Formulario from './Pages/Formulario/Formulario';
import Registros from './Pages/Registros/Registros';
import EditPage from './Pages/EditPage/EditPage';
import CadastroUser from './Pages/CadastroUser/CadastroUser';
import Teste from './Pages/Teste/Teste';
import EditarCadastro from './components/EditarCadastro';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública: página de login */}
        <Route path="/Home" element={<Home />} />

        {/* Redireciona a raiz para a página de login */}
        <Route path="/" element={<Navigate to="/Home" />} />

        {/* Rotas protegidas */}
        <Route
          path="/Formulario"
          element={
            <PrivateRoute>
              <Formulario />
            </PrivateRoute>
          }
        />
        <Route
          path="/Registros"
          element={
            <PrivateRoute>
              <Registros />
            </PrivateRoute>
          }
        />
        <Route
          path="/EditarCadastro"
          element={
            <PrivateRoute>
              <EditPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/Cadastro"
          element={
            <PrivateRoute>
              <CadastroUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/VisualizarUsuarios"
          element={
            <PrivateRoute>
              <EditarCadastro />
            </PrivateRoute>
          }
        />
        <Route
          path="/Teste"
          element={
            <PrivateRoute>
              <Teste />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
