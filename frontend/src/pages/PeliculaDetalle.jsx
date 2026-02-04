import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, apiAuth } from '../services/api';
import { Container, Typography, Box, Button, Paper, Chip, IconButton, Divider } from '@mui/material';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner'; // Importamos el Spinner
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function PeliculaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [peli, setPeli] = useState(null);
  const [nombreDirector, setNombreDirector] = useState("Cargando...");
  const [loading, setLoading] = useState(true); // Nuevo estado de carga
  const isAuth = !!localStorage.getItem('access_token');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      // Retraso simulado de 1.2 segundos
      setTimeout(async () => {
        try {
          const resPeli = await api.get(`/api/peliculas/${id}/`);
          setPeli(resPeli.data);
          
          if (resPeli.data.director) {
            const resDir = await api.get(`/api/directores/${resPeli.data.director}/`);
            setNombreDirector(resDir.data.nombre);
          }
        } catch (error) {
          console.error("Error al cargar:", error);
        } finally {
          setLoading(false); // Apagamos el Spinner
        }
      }, 1200);
    };
    cargarDatos();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar película?")) return;
    try {
      await apiAuth.delete(`/api/peliculas/${id}/`);
      navigate('/catalogo');
    } catch (error) {
      alert("Error al eliminar.");
    }
  };

  // 1. Si está cargando, mostramos el Spinner centrado
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

  // 2. Si no se encontró la película tras la carga
  if (!peli) {
    return (
      <>
        <Navbar />
        <Typography align="center" sx={{ mt: 10 }}>Pelicula no encontrada.</Typography>
      </>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f4f7f6', minHeight: '100vh', pb: 5 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/catalogo')} 
          sx={{ mb: 3, color: '#666', fontWeight: 'bold' }}
        >
          Volver
        </Button>
        
        <Paper elevation={0} sx={{ p: 5, borderRadius: '32px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 6 
          }}>
            
            <Box sx={{ width: { xs: '100%', md: '400px' }, textAlign: 'center' }}>
              <img 
                src={peli.imagen?.startsWith('http') ? peli.imagen : `${API_URL}${peli.imagen}`} 
                alt={peli.titulo}
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  maxHeight: '550px',
                  objectFit: 'cover', 
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              />
              
              {isAuth && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <IconButton onClick={() => navigate(`/editar-pelicula/${peli.id}`)} sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete} sx={{ bgcolor: '#ffebee', color: '#d32f2f' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, color: '#1a1a1a', lineHeight: 1.1 }}>
                {peli.titulo}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3, mt: 2 }}>
                <Chip label={`Año: ${peli.estreno}`} sx={{ bgcolor: '#ff1744', color: 'white', fontWeight: 'bold' }} />
                <Chip label={`Director: ${nombreDirector}`} variant="outlined" sx={{ fontWeight: 'bold' }} />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                Sinopsis
              </Typography>
              
              <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8, fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
                {peli.sinopsis || "No hay sinopsis disponible."}
              </Typography>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
}