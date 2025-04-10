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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados para el formulario de registro
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [username, setUsername] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");

  const handleRegister = async () => {
    console.log("🧪 Se hizo clic en Registrarme");

    const userData = {
      name: nombre,
      last_name: apellido,
      username,
      email: emailRegister,
      password: passwordRegister,
    };

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuario creado exitosamente ✅");
        setOpen(false);
      } else {
        alert(data.message || "Error al registrar");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("No se pudo registrar el usuario");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        alert(data.message || "Inicio de sesión fallido");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Ocurrió un error al conectarse con el servidor.");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {!open && (
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
            value={email} // ← conectamos al estado
            onChange={(e) => setEmail(e.target.value)} // ← actualiza el estado
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
          />

          <TextField
            label="Apellido"
            variant="filled"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
          />

          <TextField
            label="UserName"
            variant="filled"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
          />

          <TextField
            label="Correo electrónico"
            variant="filled"
            value={emailRegister}
            onChange={(e) => setEmailRegister(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="filled"
            value={passwordRegister}
            onChange={(e) => setPasswordRegister(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#2c2c2c", color: "white" },
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
          />

          <Button variant="contained" color="primary" onClick={handleRegister}>
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
