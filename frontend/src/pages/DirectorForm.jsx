import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, apiAuth } from '../services/api';
import Navbar from '../components/Navbar';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Icono para que se vea pro

export default function DirectorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Separamos los datos de texto de la imagen para manejarlos mejor
  const [nombre, setNombre] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [imagen, setImagen] = useState(null); // Aquí guardaremos el archivo

  // CARGAR DATOS SI ESTAMOS EDITANDO
  useEffect(() => {
    if (id) {
      const fetchDirector = async () => {
        try {
          const response = await api.get(`/api/directores/${id}/`);
          setNombre(response.data.nombre);
          setNacionalidad(response.data.nacionalidad);
          // Nota: No podemos "pre-cargar" el archivo en el input por seguridad del navegador
        } catch (error) {
          console.error("Error cargando director:", error);
        }
      };
      fetchDirector();
    }
  }, [id]);

  // Manejar la selección del archivo real
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CREAMOS EL "SOBRE" (FormData) PARA ENVIAR EL ARCHIVO
    const data = new FormData();
    data.append('nombre', nombre);
    data.append('nacionalidad', nacionalidad);
    
    // Solo metemos la imagen al sobre si el usuario eligió una nueva
    if (imagen) {
      data.append('imagen', imagen);
    }

    try {
      const headers = { 'Content-Type': 'multipart/form-data' }; // Obligatorio para archivos

      if (id) {
        await apiAuth.put(`/api/directores/${id}/`, data, { headers });
        alert("¡Director actualizado!");
      } else {
        await apiAuth.post('/api/directores/', data, { headers });
        alert("¡Director registrado!");
      }
      navigate('/catalogo'); // O a donde prefieras volver
    } catch (error) {
      console.error(error);
      alert("Error al guardar. Revisa la consola.");
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '20px' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 900, textAlign: 'center', mb: 3 }}>
            {id ? '📝 Editar Director' : '🎬 Registrar Nuevo Director'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <TextField 
              label="Nombre Completo" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              fullWidth 
              variant="filled"
            />
            
            <TextField 
              label="Nacionalidad" 
              value={nacionalidad} 
              onChange={(e) => setNacionalidad(e.target.value)} 
              required 
              fullWidth 
              variant="filled"
            />

            {/* BOTÓN PARA SUBIR FOTO REAL */}
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ py: 2, borderStyle: 'dashed' }}
            >
              {imagen ? imagen.name : "Subir Foto del Director"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              sx={{ 
                mt: 2, 
                py: 1.5, 
                fontWeight: 'bold',
                backgroundColor: id ? '#1976d2' : '#ff1744',
                '&:hover': { backgroundColor: id ? '#115293' : '#b2102f' }
              }}
            >
              {id ? 'Guardar Cambios' : 'Registrar Director'}
            </Button>
            
            <Button 
              variant="text" 
              onClick={() => navigate('/catalogo')}
              sx={{ color: '#666' }}
            >
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}