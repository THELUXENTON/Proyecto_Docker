import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // IMPORTANTE: Esta línea faltaba
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

export default function Navbar() {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.clear(); // Limpia el token y rastro de sesión
    navigate('/catalogo');
    window.location.reload(); // Recarga para actualizar el estado visual de isAuth
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important' }}>
          
          {/* Logo y Nombre - Redirige al Catálogo */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/catalogo')}>
            <MovieFilterIcon sx={{ color: '#ff1744', mr: 1, fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              CINE<span style={{ color: '#ff1744' }}>LAB</span>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Botones visibles para TODOS (Públicos) */}
            <Button variant="text" sx={{ fontWeight: 600, color: '#555' }} onClick={() => navigate('/catalogo')}>
              Cartelera
            </Button>
            <Button variant="text" sx={{ fontWeight: 600, color: '#555' }} onClick={() => navigate('/directores')}>
              Directores
            </Button>

            {/* Botones condicionales (Solo para Administradores logueados) */}
            {isAuth ? (
              <>
                <Button variant="text" sx={{ borderRadius: '8px', fontWeight: 600 }} onClick={() => navigate('/crear-director')}>
                  + Director
                </Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    borderRadius: '8px', 
                    backgroundColor: '#333', 
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#000' }
                  }} 
                  onClick={() => navigate('/crear-pelicula')}
                >
                  + Película
                </Button>
                <Button color="error" onClick={handleLogout} sx={{ fontWeight: 600 }}>
                  Salir
                </Button>
              </>
            ) : (
              /* Botón visible solo si NO hay sesión iniciada */
              <Button 
                variant="contained" 
                sx={{ 
                  borderRadius: '8px', 
                  backgroundColor: '#ff1744', 
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#d50000' }
                }} 
                onClick={() => navigate('/login')}
              >
                Entrar
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}