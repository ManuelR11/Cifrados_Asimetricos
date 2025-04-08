import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Modal,
  Paper,
} from "@mui/material";

function LoginForm() {
  const [open, setOpen] = useState(false); // Modal abierto
  const navigate = useNavigate(); // Hook para redireccionar

  const handleLogin = () => {
    // Aquí podrías validar login en el futuro
    navigate("/home");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {!open && ( // Mostrar solo si el modal NO está abierto
        <Box
          sx={{
            width: 350,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 4,
            borderRadius: 2,
            backgroundColor: "#1e1e1e",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)",
            color: "#fff",
          }}
        >
          <Typography variant="h5" align="center" color="white">
            Iniciar Sesión
          </Typography>

          <TextField
            label="Correo o Usuario"
            variant="filled"
            fullWidth
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{
              style: { color: "#aaa" },
            }}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="filled"
            fullWidth
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{
              style: { color: "#aaa" },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#3f51b5",
              "&:hover": { backgroundColor: "#303f9f" },
            }}
            onClick={handleLogin}
          >
            Iniciar Sesión
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleOpen}
            sx={{
              borderColor: "#888",
              color: "#ccc",
              "&:hover": { borderColor: "#fff", color: "#fff" },
            }}
          >
            Registrarse
          </Button>
        </Box>
      )}

      {/* Modal para registrar nuevo usuario */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="registro-modal"
        aria-describedby="formulario-registro"
      >
        <Paper
          sx={{
            width: 400,
            margin: "auto",
            marginTop: "10vh",
            padding: 4,
            backgroundColor: "#1e1e1e",
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" align="center">
            Crear nuevo usuario
          </Typography>
          <TextField
            label="Nombre"
            variant="filled"
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
          />
          <TextField
            label="Correo electrónico"
            variant="filled"
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="filled"
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
          />
          <Button variant="contained" color="primary">
            Registrarme
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
        </Paper>
      </Modal>
    </>
  );
}

export default LoginForm;
