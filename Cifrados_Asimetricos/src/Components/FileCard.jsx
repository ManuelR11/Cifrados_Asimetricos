import React, { useState } from "react";
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

function FileCard({
  user = "Usuario",
  publicKeyECC = "ECC123...",
  publicKeyRSA = "RSA456...",
}) {
  const [publicKeyInput, setPublicKeyInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openKeyModal, setOpenKeyModal] = useState(false);

  // Modal: subir archivo
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

  // Modal: create keys
  const handleCreateKeys = () => {
    setOpenKeyModal(true);
  };

  const confirmCreateKeys = () => {
    alert("Nuevas claves generadas."); // aquí puedes llamar una función real
    setOpenKeyModal(false);
  };

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
        <Button variant="contained" color="success" onClick={handleCreateKeys}>
          Create keys
        </Button>
      </Box>

      <Divider sx={{ my: 3, borderColor: "#444" }} />

      {/* Cuerpo dividido en 3 secciones */}
      <Box
        display="flex"
        gap={3}
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {/* Subir archivo */}
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

        {/* Lista de archivos */}
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

        {/* Verificar archivo + input de key */}
        <Paper sx={{ flex: 1, p: 2, backgroundColor: "#2c2c2c" }}>
          <Typography variant="subtitle1" gutterBottom>
            Verificar archivo
          </Typography>

          <TextField
            label="Public Key"
            variant="filled"
            value={publicKeyInput}
            onChange={(e) => setPublicKeyInput(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              input: { color: "#fff" },
              label: { color: "#aaa" },
              backgroundColor: "#3a3a3a",
            }}
          />

          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            fullWidth
          >
            Upload
            <input type="file" hidden />
          </Button>

          <Button variant="outlined" sx={{ mt: 1 }} fullWidth>
            Browse
          </Button>
        </Paper>
      </Box>

      {/* Modal: opciones para firmar archivo */}
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
    </Card>
  );
}

export default FileCard;
