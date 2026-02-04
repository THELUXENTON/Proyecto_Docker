import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api'; // Nota los dos puntos .. para salir de la carpeta pages
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Preparamos los datos tal cual pide OAuth
    const body = new URLSearchParams();
    body.append('grant_type', 'password');
    body.append('username', username);
    body.append('password', password);
    body.append('client_id', import.meta.env.VITE_CLIENT_ID);
    body.append('client_secret', import.meta.env.VITE_CLIENT_SECRET);

    try {
      const response = await api.post('/o/token/', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      // Guardamos el token igual que en el proyecto del profe
      localStorage.setItem('access_token', response.data.access_token);
      
      console.log("Acceso concedido:", response.data);
      navigate('/catalogo'); // Redirige a la página principal

    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
        
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Proyecto Final - Iniciar Sesión
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Usuario"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
          >
            INGRESAR
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}