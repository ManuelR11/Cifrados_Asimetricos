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
  const [selectedFile, setSelectedFile] = useState(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [signMethod, setSignMethod] = useState(null);
  const [privateKeyFile, setPrivateKeyFile] = useState(null);

  const [verifyFile, setVerifyFile] = useState(null);
  const [verifyKeyFile, setVerifyKeyFile] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyData, setVerifyData] = useState({});
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [openKeyModal, setOpenKeyModal] = useState(false);

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
    if (option === "RSA") {
      setSignMethod("rsa");
    } else if (option === "ECC") {
      setSignMethod("ecc");
    } else {
      uploadFileWithoutSignature();
    }
  };

  const uploadFileWithoutSignature = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Archivo subido sin firma");
      } else {
        alert("❌ " + (data.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al conectar con el servidor");
    }

    setOpenUploadModal(false);
    setSelectedFile(null);
    setSignMethod(null);
    setPrivateKeyFile(null);
  };

  const uploadFileWithSignature = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedFile || !privateKeyFile || !signMethod) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("private_key_pem", privateKeyFile);

    try {
      const response = await fetch(
        `http://localhost:8000/upload/${signMethod}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("✅ Archivo firmado y subido con éxito");
      } else {
        alert("❌ " + (data.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al conectar con el servidor");
    }

    setOpenUploadModal(false);
    setSelectedFile(null);
    setSignMethod(null);
    setPrivateKeyFile(null);
  };

  const handleCreateKeys = () => setOpenKeyModal(true);
  const confirmCreateKeys = () => {
    alert("Nuevas claves generadas.");
    setOpenKeyModal(false);
  };

  const handleVerify = async () => {
    if (!verifyFile || !verifyKeyFile) {
      alert("Debes subir el archivo y la clave pública");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("file", verifyFile);
    formData.append("public_key_pem", verifyKeyFile);
    formData.append("method", "rsa");

    try {
      const response = await fetch("http://localhost:8000/verify-signature", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      setVerifyResult(data.match);
      setVerifyData(data);
      setOpenVerifyModal(true);
    } catch (error) {
      console.error("Error al verificar:", error);
      alert("No se pudo verificar la firma.");
    }
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

      <Box
        display="flex"
        gap={3}
        flexWrap="wrap"
        justifyContent="space-between"
      >
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

      <Modal
        open={openUploadModal}
        onClose={() => {
          setOpenUploadModal(false);
          setSignMethod(null);
          setPrivateKeyFile(null);
        }}
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
            ¿Cómo deseas subir el archivo?
          </Typography>
          <Typography variant="body2">
            Archivo: <strong>{selectedFile?.name}</strong>
          </Typography>

          {!signMethod && (
            <>
              <Button
                variant="contained"
                onClick={() => handleSignOption("RSA")}
              >
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
            </>
          )}

          {signMethod && (
            <>
              <Typography variant="body2" color="gray">
                Llave privada para firma ({signMethod.toUpperCase()}):
              </Typography>
              <input
                type="file"
                id="private-key-input"
                style={{ display: "none" }}
                onChange={(e) => setPrivateKeyFile(e.target.files[0])}
              />
              <Button
                variant="outlined"
                component="label"
                htmlFor="private-key-input"
              >
                Seleccionar llave privada
              </Button>
              {privateKeyFile && (
                <Typography variant="body2" color="lightgreen">
                  Archivo seleccionado: <strong>{privateKeyFile.name}</strong>
                </Typography>
              )}
              <Button
                variant="contained"
                color="success"
                onClick={uploadFileWithSignature}
                disabled={!privateKeyFile}
              >
                Confirmar envío
              </Button>
            </>
          )}

          <Button
            onClick={() => {
              setOpenUploadModal(false);
              setSignMethod(null);
              setPrivateKeyFile(null);
            }}
            color="error"
          >
            Cancelar
          </Button>
        </Paper>
      </Modal>

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
          {verifyResult && (
            <>
              <Typography variant="body2">
                Firma del Usuario:{" "}
                <strong>{verifyData.username || "Desconocido"}</strong>
              </Typography>
              <Typography variant="body2">
                Archivo firmado:{" "}
                <strong>{verifyData.file || "archivo.pdf"}</strong>
              </Typography>
            </>
          )}
          <Button onClick={closeVerifyModal} variant="contained" sx={{ mt: 2 }}>
            Cerrar
          </Button>
        </Paper>
      </Modal>
    </Card>
  );
}

export default FileCard;
