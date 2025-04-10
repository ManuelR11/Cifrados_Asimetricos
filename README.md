# Laboratorio No. 4 - Cifrados Asimetricos

![Diagrama](https://github.com/ManuelR11/Cifrados_Asimetricos/blob/8869d4db89c59fd636e747bc3205950d5d89cbfc/DiagramaLab4-Cifrados.png)

Este proyecto es una aplicación web que permite a los usuarios:

- Crear cuentas y autenticarse.
- Generar claves públicas y privadas (RSA y ECC).
- Firmar archivos al subirlos usando claves privadas.
- Subir archivos sin firmar.
- Verificar archivos usando claves públicas.
- Visualizar los archivos subidos por otros usuarios y descargarlos.

---

## 🧱 Estructura del Proyecto

### Frontend (React + MUI)

Ubicado en la carpeta principal del cliente:

- `src/components/LoginForm.jsx`: Formulario de login y registro.
- `src/pages/Login/login.jsx`: Página principal de inicio de sesión.
- `src/pages/Home/home.jsx`: Componente `FileCard` donde se maneja la carga, firma y verificación.
- `FileCard.jsx`: Card principal que muestra las 3 secciones (Subida, Archivos, Verificación).

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Frontend

```bash
cd Cifrados_Asimetricos
npm install
npm run dev
```

Esto levantará el frontend en `http://localhost:5173`

---

## 📄 Descripción de Funcionalidades

### Registro y Login

- Se realiza desde el componente `LoginForm.jsx`.
- Autenticación mediante JWT, almacenado en `localStorage`.

### Generación de Llaves

- Al presionar "Create Keys", se generan nuevas llaves RSA y ECC.
- Se descargan al usuario como un `.zip`.

### Subida de Archivos

- 3 opciones: subir sin firmar, firmar con RSA o con ECC.
- Si se firma, se requiere subir la llave privada correspondiente.

### Visualización y Descarga

- Se listan los archivos subidos por todos los usuarios.
- Se permite la descarga individual de archivos.

### Verificación de Archivos

- Se selecciona un archivo y una clave pública para validar la firma.
- Se muestra si la firma fue válida, el nombre del firmante y el archivo firmado.

---

## 📦 Tecnologías Usadas

### Frontend:

- React + Vite
- Material UI (MUI)
- React Router DOM

---

## ✅ Acciones Cumplidas

- [x] Login y Registro funcional
- [x] Upload firmado y sin firmar
- [x] Verificación de firmas
- [x] Descarga de archivos
- [x] Generación de llaves con descarga

---

## 📬 Autor

**Manuel Rodas Gordillo 21509**

**Sebastian Solorzano 21826**

Universidad del Valle de Guatemala
CC3067 - Seguridad y Ciencia de Datos
