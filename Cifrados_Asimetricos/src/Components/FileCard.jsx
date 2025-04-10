import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function FileCard() {
  // Variables globales
  const user = localStorage.getItem("user") || "Usuario";
  const publicKeyECC = (localStorage.getItem("publicKeyECC") || "No disponible").replace("-----BEGIN PUBLIC KEY-----", "").trim().slice(0, 50) + "...";
  const publicKeyRSA = (localStorage.getItem("publicKeyRSA") || "No disponible").replace("-----BEGIN PUBLIC KEY-----", "").trim().slice(0, 50) + "...";
  const navigate = useNavigate();

  // Estados para carga de archivo general
  const [selectedFile, setSelectedFile] = useState(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // Estados para verificación
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifyKeyFile, setVerifyKeyFile] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);

  // Estados para creación de claves
  const [openKeyModal, setOpenKeyModal] = useState(false);

  // Manejadores generales
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      setOpenUploadModal(true);
    } else {
      alert("Por favor, seleccione un archivo primero.");
    }
  };

  const handleSignOption = (option) => {
    alert(`Subiendo archivo con opción: ${option}`);
    setOpenUploadModal(false);
    setSelectedFile(null);
  };

  const handleCreateKeys = () => {
    setOpenKeyModal(true);
  };

  const confirmCreateKeys = async () => {
    try {
      const response = await fetch("http://localhost:8000/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Claves creadas:", data);
        localStorage.setItem("publicKeyECC", data.ecc_public_key);
        localStorage.setItem("publicKeyRSA", data.rsa_public_key);
        alert("Claves creadas exitosamente ✅");
      }
      else {
        alert(data.message || "Error al crear claves");
      }

    } catch (error) {
      console.error("Error al crear claves:", error);
      alert("Error al crear claves. Intente nuevamente.");
    }

    setOpenKeyModal(false);
  };

  const handleVerify = () => {
    const simulatedResult = Math.random() < 0.5;
    setVerifyResult(simulatedResult);
    setOpenVerifyModal(true);
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  const closeVerifyModal = () => setOpenVerifyModal(false);

  return (
    <Card
      sx={{
        width: "90%",
        maxWidth: 900,
        margin: "auto",
        marginTop: 5,
        padding: 3,
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6">Welcome {user}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Public key ECC: {publicKeyECC}
          </Typography>
          <Typography variant="body2">
            Public key RSA: {publicKeyRSA}
          </Typography>
        </Box>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="contained" color="success" onClick={handleCreateKeys}>
            Create keys
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </Box>

      <Divider sx={{ my: 3, borderColor: "#444" }} />

      {/* Secciones */}
      <Box
        display="flex"
        gap={3}
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {/* Sección 1: Subir archivo */}
        <Paper sx={{ flex: 1, p: 2, backgroundColor: "#2c2c2c" }}>
          <Typography variant="subtitle1" gutterBottom>
            Cargar archivo
          </Typography>

          <input
            type="file"
            id="upload-input"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadFileIcon />}
            htmlFor="upload-input"
          >
            Elegir archivo
          </Button>

          {selectedFile && (
            <Box mt={2}>
              <Typography variant="body2" color="gray">
                Archivo seleccionado: <strong>{selectedFile.name}</strong> (
                {Math.round(selectedFile.size / 1024)} KB)
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleUploadClick}
          >
            Upload
          </Button>
        </Paper>

        {/* Sección 2: Lista de archivos */}
        <Paper sx={{ flex: 1, p: 2, backgroundColor: "#2c2c2c" }}>
          <Typography variant="subtitle1" gutterBottom>
            Archivos
          </Typography>
          <List>
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="descargar" color="primary">
                  <CloudDownloadIcon />
                </IconButton>
              }
            >
              <ListItemText primary="Archivo 1" />
            </ListItem>
          </List>
        </Paper>

        {/* Sección 3: Verificación */}
        <Paper sx={{ flex: 1, p: 2, backgroundColor: "#2c2c2c" }}>
          <Typography variant="subtitle1" gutterBottom>
            Verificar archivo
          </Typography>

          <input
            type="file"
            id="verify-upload-input"
            style={{ display: "none" }}
            onChange={(e) => setVerifyFile(e.target.files[0])}
          />
          <input
            type="file"
            id="verify-key-input"
            style={{ display: "none" }}
            onChange={(e) => setVerifyKeyFile(e.target.files[0])}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadFileIcon />}
            htmlFor="verify-upload-input"
            sx={{ mb: 1 }}
          >
            Subir archivo a verificar
          </Button>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadFileIcon />}
            htmlFor="verify-key-input"
          >
            Subir clave pública
          </Button>

          {verifyFile && (
            <Typography variant="body2" mt={1} color="gray">
              Archivo: <strong>{verifyFile.name}</strong>
            </Typography>
          )}

          {verifyKeyFile && (
            <Typography variant="body2" color="gray">
              Clave pública: <strong>{verifyKeyFile.name}</strong>
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleVerify}
          >
            Verificar
          </Button>
        </Paper>
      </Box>

      {/* Modal: opciones de firma */}
      <Modal open={openUploadModal} onClose={() => setOpenUploadModal(false)}>
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
            ¿Cómo deseas subir el archivo?
          </Typography>

          <Typography variant="body2">
            Archivo: <strong>{selectedFile?.name}</strong>
          </Typography>

          <Button variant="contained" onClick={() => handleSignOption("RSA")}>
            Firmar con RSA
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSignOption("ECC")}
          >
            Firmar con ECC
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleSignOption("Sin firma")}
          >
            Subir sin firmar
          </Button>

          <Button onClick={() => setOpenUploadModal(false)} color="error">
            Cancelar
          </Button>
        </Paper>
      </Modal>

      {/* Modal: confirmación de creación de claves */}
      <Modal open={openKeyModal} onClose={() => setOpenKeyModal(false)}>
        <Paper
          sx={{
            width: 420,
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
          <Typography variant="h6" align="center" color="error">
            ¡Importante!
          </Typography>

          <Typography variant="body2" align="center">
            Si se crean nuevas keys, se van a perder los archivos previamente
            subidos con la anterior key.
          </Typography>

          <Button variant="contained" color="error" onClick={confirmCreateKeys}>
            Aceptar
          </Button>

          <Button variant="outlined" onClick={() => setOpenKeyModal(false)}>
            Permanecer con las keys actuales
          </Button>
        </Paper>
      </Modal>

      {/* Modal: resultado de verificación */}
      <Modal open={openVerifyModal} onClose={closeVerifyModal}>
        <Paper
          sx={{
            width: 450,
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
          <Typography
            variant="h6"
            align="center"
            color={verifyResult ? "success.main" : "error.main"}
          >
            {verifyResult
              ? "El archivo se ha verificado correctamente ✅"
              : "El archivo no se ha podido verificar correctamente ❌"}
          </Typography>

          <Divider sx={{ borderColor: "#444" }} />

          <Typography variant="body2">
            Firma del Usuario:{" "}
            <strong>{verifyFile?.name || "firma_usuario.sig"}</strong>
          </Typography>
          <Typography variant="body2">
            Archivo firmado:{" "}
            <strong>{verifyKeyFile?.name || "archivo.pdf"}</strong>
          </Typography>

          <Button onClick={closeVerifyModal} variant="contained" sx={{ mt: 2 }}>
            Cerrar
          </Button>
        </Paper>
      </Modal>
    </Card>
  );
}

export default FileCard;
