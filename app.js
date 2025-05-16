const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const upload = require('./multer-config');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const filePath = './adquisiciones.json';

// Utilidades para leer y guardar
function leerDatos() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
}
function guardarDatos(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Obtener adquisiciones
app.get('/api/adquisiciones', (req, res) => {
  const data = leerDatos();
  res.json(data);
});

// Crear adquisición con archivo
app.post('/api/adquisiciones', upload.single('documentacion'), (req, res) => {
  const {
    presupuesto,
    unidad,
    tipo,
    cantidad,
    valorUnitario,
    valorTotal,
    fecha,
    proveedor
  } = req.body;

  if (
    !presupuesto || isNaN(presupuesto) ||
    !unidad || !tipo || !cantidad || !valorUnitario ||
    !valorTotal || !fecha || !proveedor || !req.file
  ) {
    return res.status(400).json({ error: 'Datos inválidos o archivo faltante' });
  }

  const nueva = {
    id: uuidv4(),
    activo: true,
    historial: [{ accion: 'creado', fecha: new Date(), datos: req.body }],
    presupuesto: parseInt(presupuesto),
    unidad,
    tipo,
    cantidad: parseInt(cantidad),
    valorUnitario: parseInt(valorUnitario),
    valorTotal: parseInt(valorTotal),
    fecha,
    proveedor,
    documentacion: req.file.filename
  };

  const data = leerDatos();
  data.push(nueva);
  guardarDatos(data);

  res.status(201).json(nueva);
});

// Modificar adquisición (con o sin archivo nuevo)
app.put('/api/adquisiciones/:id', upload.any(), (req, res) => {
  const id = req.params.id;
  const data = leerDatos();
  const index = data.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });

  const {
    presupuesto,
    unidad,
    tipo,
    cantidad,
    valorUnitario,
    valorTotal,
    fecha,
    proveedor
  } = req.body;

  if (
    !presupuesto || isNaN(presupuesto) ||
    !unidad || !tipo || !cantidad || !valorUnitario ||
    !valorTotal || !fecha || !proveedor
  ) {
    return res.status(400).json({ error: 'Datos inválidos o incompletos' });
  }

  data[index].historial.push({ accion: 'modificado', fecha: new Date(), datos: req.body });

  data[index] = {
    ...data[index],
    presupuesto: parseInt(presupuesto),
    unidad,
    tipo,
    cantidad: parseInt(cantidad),
    valorUnitario: parseInt(valorUnitario),
    valorTotal: parseInt(valorTotal),
    fecha,
    proveedor
  };

  if (req.files && req.files.length > 0) {
    data[index].documentacion = req.files[0].filename;
  }

  guardarDatos(data);
  res.json(data[index]);
});

// Desactivar adquisición
app.patch('/api/adquisiciones/:id/desactivar', (req, res) => {
  const id = req.params.id;
  const data = leerDatos();
  const item = data.find(a => a.id === id);
  if (!item) return res.status(404).json({ error: 'No encontrado' });

  item.activo = false;
  item.historial.push({ accion: 'desactivado', fecha: new Date() });

  guardarDatos(data);
  res.json({ mensaje: 'Desactivado correctamente' });
});

// Eliminar adquisición y archivo PDF
app.delete('/api/adquisiciones/:id', (req, res) => {
  const id = req.params.id;
  let data = leerDatos();
  const index = data.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });

  const archivo = data[index].documentacion;
  const rutaArchivo = path.join(__dirname, 'uploads', archivo);

  if (fs.existsSync(rutaArchivo)) {
    try {
      fs.unlinkSync(rutaArchivo);
    } catch (err) {
      console.error('Error al eliminar archivo:', err.message);
    }
  }

  data.splice(index, 1);
  guardarDatos(data);
  res.json({ mensaje: 'Eliminado correctamente' });
});

// Consultar historial
app.get('/api/adquisiciones/:id/historial', (req, res) => {
  const id = req.params.id;
  const data = leerDatos();
  const item = data.find(a => a.id === id);
  if (!item) return res.status(404).json({ error: 'No encontrado' });

  res.json(item.historial);
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
