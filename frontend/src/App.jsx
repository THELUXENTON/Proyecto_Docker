import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import PeliculaForm from './pages/PeliculaForm';
import DirectorForm from './pages/DirectorForm';
import PeliculaDetalle from './pages/PeliculaDetalle';
import DirectoresLista from './pages/DirectoresLista';
import DirectorDetalle from './pages/DirectorDetalle'; // Asegúrate de crear este archivo

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/directores" element={<DirectoresLista />} />
        <Route path="/pelicula/:id" element={<PeliculaDetalle />} />
        
        {/* NUEVA RUTA DE DETALLES DE DIRECTOR */}
        <Route path="/director-detalle/:id" element={<DirectorDetalle />} />
        
        {/* Rutas Privadas (Administración) */}
        <Route path="/crear-pelicula" element={<PeliculaForm />} />
        <Route path="/editar-pelicula/:id" element={<PeliculaForm />} />
        <Route path="/crear-director" element={<DirectorForm />} />
        <Route path="/editar-director/:id" element={<DirectorForm />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;