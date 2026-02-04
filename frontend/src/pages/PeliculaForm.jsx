import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiAuth, api } from '../services/api';
import Navbar from '../components/Navbar';
import { Container, TextField, Button, Typography, Paper, Box, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function PeliculaForm() {
  // Usamos estados separados para controlar mejor el archivo vs el texto
  const [titulo, setTitulo] = useState('');
  const [estreno, setEstreno] = useState('');
  const [director, setDirector] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [imagen, setImagen] = useState(null); // Aquí guardaremos el ARCHIVO real
  
  const [directores, setDirectores] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  // 1. Cargar Directores y Datos (si es edición)
  useEffect(() => {
    api.get('/api/directores/').then(res => setDirectores(res.data));

    if (id) {
      api.get(`/api/peliculas/${id}/`).then(res => {
        setTitulo(res.data.titulo);
        setEstreno(res.data.estreno); // o res.data.anio
        setDirector(res.data.director);
        setSinopsis(res.data.sinopsis || '');
        // OJO: No podemos "pre-llenar" el input type="file" por seguridad del navegador.
        // Solo llenamos los textos.
      });
    }
  }, [id]);

  // 2. Manejar la selección del archivo
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  // 3. Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // CREAMOS EL SOBRE (FormData)
    const data = new FormData();
    data.append('titulo', titulo);
    data.append('estreno', estreno);
    data.append('director', director);
    data.append('sinopsis', sinopsis);
    
    // Solo agregamos la imagen si el usuario seleccionó una nueva
    if (imagen) {
      data.append('imagen', imagen); 
    }

    try {
      const headers = { 'Content-Type': 'multipart/form-data' }; // Obligatorio para archivos

      if (id) {
        await apiAuth.put(`/api/peliculas/${id}/`, data, { headers });
        alert("¡Película actualizada!");
      } else {
        await apiAuth.post('/api/peliculas/', data, { headers });
        alert("¡Película creada!");
      }
      navigate('/catalogo');
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar. Revisa la consola.");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            {id ? "Editar Película" : "Nueva Película"}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required fullWidth />
            <TextField label="Año" type="number" value={estreno} onChange={(e) => setEstreno(e.target.value)} required fullWidth />
            <TextField label="Sinopsis" multiline rows={3} value={sinopsis} onChange={(e) => setSinopsis(e.target.value)} fullWidth />

            {/* SELECTOR DE DIRECTOR */}
            <TextField select label="Director" value={director} onChange={(e) => setDirector(e.target.value)} required fullWidth>
              {directores.map((dir) => (
                <MenuItem key={dir.id} value={dir.id}>
                  {dir.nombre}
                </MenuItem>
              ))}
            </TextField>

            {/* BOTÓN DE SUBIR IMAGEN */}
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 1 }}>
              {imagen ? imagen.name : "Subir Poster (Imagen)"}
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
              Guardar Película
            </Button>
            <Button color="secondary" onClick={() => navigate('/catalogo')}>
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}