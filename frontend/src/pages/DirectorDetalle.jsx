import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, apiAuth } from '../services/api';
import { Container, Typography, Box, Button, Paper, IconButton, Divider, Chip } from '@mui/material';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function DirectorDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuth = !!localStorage.getItem('access_token');
  
  // 1. TRAEMOS LA URL DE DJANGO DESDE EL .ENV
  const API_URL = import.meta.env.VITE_API_URL; 
  const IMAGEN_GENERICA = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  useEffect(() => {
    loadDirector();
  }, [id]);

  const loadDirector = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await api.get(`/api/directores/${id}/`);
        setDirector(res.data);
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setLoading(false);
      }
    }, 800); // Le bajé un poquito el tiempo para que sea más ágil
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar a este director?")) return;
    try {
      await apiAuth.delete(`/api/directores/${id}/`);
      navigate('/directores');
    } catch (error) {
      alert("Error al eliminar.");
    }
  };

  // 2. FUNCIÓN PARA CORREGIR LA RUTA DE LA IMAGEN
  const getImageUrl = (imgData) => {
    if (!imgData) return IMAGEN_GENERICA;
    // Si ya trae http (ej: una url de internet), la dejamos igual. 
    // Si no, le pegamos el dominio de Django al principio.
    return imgData.startsWith('http') ? imgData : `${API_URL}${imgData}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <Spinner />
        </Box>
      </>
    );
  }

  if (!director) {
      return (
          <>
            <Navbar />
            <Typography align="center" sx={{ mt: 5 }}>No se encontró la información del director.</Typography>
          </>
      );
  }

  return (
    <Box sx={{ backgroundColor: '#f4f7f6', minHeight: '100vh', pb: 5 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/directores')} 
          sx={{ mb: 3, color: '#666', fontWeight: 'bold' }}
        >
          Volver a Directores
        </Button>
        
        <Paper elevation={0} sx={{ p: 5, borderRadius: '32px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 6 
          }}>
            
            <Box sx={{ width: { xs: '100%', md: '400px' }, textAlign: 'center' }}>
              {/* 3. APLICAMOS LA FUNCIÓN AQUÍ */}
              <img 
                src={getImageUrl(director.Imagen || director.imagen || director.foto)} 
                alt={director.nombre}
                onError={(e) => { e.target.src = IMAGEN_GENERICA; }}
                style={{ 
                  width: '100%', 
                  height: '550px', 
                  objectFit: 'cover', 
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              />
              
              {isAuth && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <IconButton onClick={() => navigate(`/editar-director/${director.id}`)} sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete} sx={{ bgcolor: '#ffebee', color: '#d32f2f' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, color: '#1a1a1a' }}>
                {director.nombre}
              </Typography>
              
              <Box sx={{ mt: 2, mb: 3 }}>
                <Chip 
                    label={`Nacionalidad: ${director.nacionalidad}`} 
                    sx={{ bgcolor: '#ff1744', color: 'white', fontWeight: 'bold', px: 1 }} 
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                Perfil Profesional
              </Typography>
              
              <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8, fontSize: '1.1rem' }}>
                {director.biografia || `Director de cine con nacionalidad ${director.nacionalidad}, reconocido por su contribución a la industria cinematográfica y su visión artística única en CINELAB.`}
              </Typography>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
}