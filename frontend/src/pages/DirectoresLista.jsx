import { useEffect, useState } from 'react';
import { api, apiAuth } from '../services/api';
import { 
  Container, Grid, Card, CardMedia, CardContent, 
  Typography, Box, IconButton, Button, Fade 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

export default function DirectoresLista() {
  const [directores, setDirectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem('access_token');
  
  const API_URL = import.meta.env.VITE_API_URL;
  const IMAGEN_GENERICA = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  useEffect(() => {
    loadDirectores();
  }, []);

  const loadDirectores = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await api.get('/api/directores/');
        setDirectores(response.data);
      } catch (error) {
        console.error("Error cargando directores:", error);
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar a este director?")) return;
    try {
      await apiAuth.delete(`/api/directores/${id}/`);
      setDirectores(directores.filter(d => d.id !== id));
    } catch (error) {
      alert("Error al eliminar.");
    }
  };

  const getImageUrl = (imgRoute) => {
    if (!imgRoute) return IMAGEN_GENERICA;
    return imgRoute.startsWith('http') ? imgRoute : `${API_URL}${imgRoute}`;
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

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', pb: 6 }}>
      <Navbar />
      <Container sx={{ mt: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a1a1a', mb: 1 }}>Directores</Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>Los maestros detrás de las historias.</Typography>
        </Box>
        
        {directores.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>No se encontraron directores en la base de datos.</Typography>
        ) : (
          <Grid container spacing={4}>
            {directores.map((dir) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dir.id}>
                <Fade in={true} timeout={500}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '20px', transition: '0.3s', border: '1px solid #f0f0f0', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0px 15px 35px rgba(0,0,0,0.1)' } }}>
                    <Box sx={{ p: 1.5 }}>
                      
                      {/* 👇 AQUÍ ESTÁ EL CAMBIO IMPORTANTE: agregamos 'dir.imagen' */}
                      <CardMedia 
                        component="img" 
                        image={getImageUrl(dir.imagen || dir.Imagen || dir.foto)} 
                        alt={dir.nombre} 
                        onError={(e) => { e.target.src = IMAGEN_GENERICA; }} 
                        sx={{ borderRadius: '16px', height: 320, objectFit: 'cover' }} 
                      />

                    </Box>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>{dir.nombre}</Typography>
                      <Typography variant="body2" sx={{ color: '#ff1744', fontWeight: 'bold', mb: 2 }}>{dir.nacionalidad}</Typography>
                      <Button variant="outlined" size="small" fullWidth sx={{ borderRadius: '10px', fontWeight: 'bold', borderColor: '#ff1744', color: '#ff1744' }} onClick={() => navigate(`/director-detalle/${dir.id}`)}>
                        VER DETALLES
                      </Button>
                    </CardContent>
                    {isAuth && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2, gap: 1.5, pt: 2, mx: 2, borderTop: '1px solid #f5f5f5' }}>
                        <IconButton size="small" onClick={() => navigate(`/editar-director/${dir.id}`)} sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(dir.id)} sx={{ bgcolor: '#ffebee', color: '#d32f2f' }}><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    )}
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}