import { Box } from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie'; // Icono de claqueta/cine
import { keyframes } from '@emotion/react';

// 1. Definimos la animación de giro
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default function Spinner() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh" // Ajustado para que no empuje el Navbar demasiado
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        {/* 2. El icono con la animación aplicada */}
        <MovieIcon 
          sx={{ 
            fontSize: 80, 
            color: '#ff1744', // El rojo de tu proyecto
            animation: `${rotate} 2s linear infinite` // Gira infinito cada 2 segundos
          }} 
        />
        
        <Box
          component="span"
          sx={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#666',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          Cargando Cine...
        </Box>
      </Box>
    </Box>
  );
}