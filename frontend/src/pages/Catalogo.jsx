import { useEffect, useState } from 'react';
import { api, apiAuth } from '../services/api';
import { 
  Container, Grid, Card, CardMedia, CardContent, 
  Typography, Box, IconButton, Button, TextField, 
  InputAdornment, Fade 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner'; // Importamos el Spinner

export default function Catalogo() {
  const [peliculas, setPeliculas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();
  
  const isAuth = !!localStorage.getItem('access_token');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadPeliculas();
  }, []);

  const loadPeliculas = async () => {
    setLoading(true);
    // Retraso de 1.2s para que se vea el Spinner como en PokemonList
    setTimeout(async () => {
      try {
        const response = await api.get('/api/peliculas/');
        setPeliculas(response.data);
      } catch (error) {
        console.error("Error cargando películas:", error);
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta película?")) return;
    try {
      await apiAuth.delete(`/api/peliculas/${id}/`);
      setPeliculas(peliculas.filter(p => p.id !== id));
    } catch (error) {
      alert("Error al eliminar.");
    }
  };

  const getImageUrl = (imgRoute) => {
    if (!imgRoute) return "https://via.placeholder.com/300x450?text=Sin+Imagen";
    return imgRoute.startsWith('http') ? imgRoute : `${API_URL}${imgRoute}`;
  };

  const peliculasFiltradas = peliculas.filter(p => 
    p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

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

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', pb: 6 }}>
      <Navbar />
      
      <Container sx={{ mt: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a1a1a', mb: 1 }}>
            Cartelera de Cine
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            Explora nuestra selección de películas y clásicos.
          </Typography>

          <TextField 
            placeholder="¿Qué quieres ver hoy?..."
            variant="outlined"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ 
              width: { xs: '100%', md: '60%' }, 
              backgroundColor: 'white', 
              borderRadius: '50px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              '& .MuiOutlinedInput-root': { borderRadius: '50px' } 
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#ff1744' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        {/* 2. Si no hay películas tras la carga o filtrado */}
        {peliculasFiltradas.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h5" color="textSecondary">
              No encontramos películas con ese nombre 🎬
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {peliculasFiltradas.map((peli) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={peli.id}>
                <Fade in={true} timeout={500}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0px 15px 35px rgba(0,0,0,0.1)'
                      },
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <Box sx={{ p: 1.5 }}>
                        <CardMedia
                          component="img"
                          image={getImageUrl(peli.imagen)} 
                          alt={peli.titulo}
                          sx={{ borderRadius: '16px', height: 320, objectFit: 'cover' }}
                        />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#333', fontSize: '1.1rem', mb: 0.5 }}>
                        {peli.titulo}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888', mb: 2 }}>
                        Año: {peli.estreno}
                      </Typography>
                      
                      <Button 
                        variant="outlined"
                        size="small" 
                        fullWidth
                        sx={{ 
                          borderRadius: '10px', 
                          fontWeight: 'bold', 
                          borderColor: '#ff1744', 
                          color: '#ff1744',
                          '&:hover': { borderColor: '#d50000', backgroundColor: '#fff5f5' }
                        }}
                        onClick={() => navigate(`/pelicula/${peli.id}`)}
                      >
                        Ver Detalles
                      </Button>
                    </CardContent>
                    
                    {isAuth && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        pb: 2, 
                        gap: 1.5,
                        borderTop: '1px solid #f5f5f5',
                        pt: 2,
                        mx: 2
                      }}>
                        <IconButton 
                          size="small" 
                          sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }} 
                          onClick={() => navigate(`/editar-pelicula/${peli.id}`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ backgroundColor: '#ffebee', color: '#d32f2f' }} 
                          onClick={() => handleDelete(peli.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
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