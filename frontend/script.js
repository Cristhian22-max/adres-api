const api = 'http://localhost:3000/api/adquisiciones';

let modoEdicion = false;
let idActual = null;

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0
});

const cantidadInput = document.getElementById('cantidad');
const valorUnitarioInput = document.getElementById('valorUnitario');
const valorTotalInput = document.getElementById('valorTotal');

// 🧮 Calcular valor total en tiempo real
function actualizarValorTotal() {
  const cantidad = parseInt(cantidadInput.value) || 0;
  const valorUnitario = parseInt(valorUnitarioInput.value) || 0;
  valorTotalInput.value = formatter.format(cantidad * valorUnitario);
}

cantidadInput.addEventListener('input', actualizarValorTotal);
valorUnitarioInput.addEventListener('input', actualizarValorTotal);

// 📥 Enviar formulario
document.getElementById('form-adquisicion').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const archivo = document.getElementById('documentacion').files[0];

  if (!modoEdicion && !archivo) {
    alert('Debes subir un archivo PDF.');
    return;
  }
  if (archivo && archivo.type !== 'application/pdf') {
    alert('El archivo debe ser un PDF.');
    return;
  }
  if (archivo && archivo.size > 4 * 1024 * 1024) {
    alert('El archivo no debe superar los 4MB.');
    return;
  }

  const formData = new FormData(form);
  const cantidad = parseInt(formData.get('cantidad'));
  const valorUnitario = parseInt(formData.get('valorUnitario'));
  const presupuesto = parseInt(formData.get('presupuesto'));
  const valorTotal = cantidad * valorUnitario;

  formData.set('cantidad', cantidad);
  formData.set('valorUnitario', valorUnitario);
  formData.set('presupuesto', presupuesto);
  formData.set('valorTotal', valorTotal);

  const url = modoEdicion ? `${api}/${idActual}` : api;
  const method = modoEdicion ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      body: formData
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Error: ${error.error || 'No se pudo guardar la adquisición'}`);
      return;
    }

    form.reset();
    valorTotalInput.value = '';
    modoEdicion = false;
    idActual = null;
    document.getElementById('btn-submit').textContent = 'Crear Adquisición';
    cargarListado();
  } catch (err) {
    console.error(err);
    alert('Error al guardar adquisición');
  }
});

// 🔁 Listado de adquisiciones
async function cargarListado(filtro = '') {
  try {
    const res = await fetch(api);
    const adquisiciones = await res.json();
    const contenedor = document.getElementById('listado');
    contenedor.innerHTML = '';

    const filtradas = adquisiciones.filter(item =>
      item.unidad.toLowerCase().includes(filtro.toLowerCase()) ||
      item.proveedor.toLowerCase().includes(filtro.toLowerCase())
    );

    filtradas.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('adquisicion');
      div.innerHTML = `
        <strong>${item.tipo}</strong> – ${item.unidad}<br>
        Cantidad: ${item.cantidad}, Total: ${formatter.format(item.valorTotal)}<br>
        Proveedor: ${item.proveedor}<br>
        Estado: ${item.activo ? 'Activo' : 'Inactivo'}<br>
        <button onclick="desactivar('${item.id}')">Desactivar</button>
        <button onclick="modificarAdquisicion('${item.id}')">Modificar</button>
        <button onclick="verHistorial('${item.id}')">Ver Historial</button>
        <button onclick="eliminar('${item.id}')">Eliminar</button>
        <div id="historial-${item.id}" class="historial oculto"></div>
        <hr>
      `;
      contenedor.appendChild(div);
    });

    // Para modificar, almacenamos la lista completa
    window.listaAdquisiciones = adquisiciones;
  } catch (err) {
    console.error('Error al cargar adquisiciones:', err);
  }
}

// 🔁 Modificar adquisición
function modificarAdquisicion(id) {
  const item = window.listaAdquisiciones.find(i => i.id === id);
  if (!item) return;

  const form = document.getElementById('form-adquisicion');
  form.presupuesto.value = item.presupuesto;
  form.unidad.value = item.unidad;
  form.tipo.value = item.tipo;
  form.cantidad.value = item.cantidad;
  form.valorUnitario.value = item.valorUnitario;
  form.fecha.value = item.fecha;
  form.proveedor.value = item.proveedor;
  form.documentacion.value = '';

  actualizarValorTotal();

  document.getElementById('btn-submit').textContent = 'Modificar Adquisición';
  modoEdicion = true;
  idActual = id;
}

async function desactivar(id) {
  await fetch(`${api}/${id}/desactivar`, { method: 'PATCH' });
  cargarListado();
}

async function verHistorial(id) {
  const res = await fetch(`${api}/${id}/historial`);
  const historial = await res.json();
  const contenedor = document.getElementById(`historial-${id}`);
  contenedor.innerHTML = `<strong>Historial:</strong><br>` + historial.map(h =>
    `• ${h.accion} - ${new Date(h.fecha).toLocaleString()}<br>`
  ).join('');
  contenedor.classList.toggle('oculto');
}

async function eliminar(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta adquisición?')) return;

  const res = await fetch(`${api}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    alert('Error al eliminar: ' + (err.error || 'desconocido'));
    return;
  }
  cargarListado();
}

document.getElementById('filtro').addEventListener('input', (e) => {
  cargarListado(e.target.value);
});

function alternarListado() {
  const listado = document.getElementById('listado');
  const titulo = document.getElementById('titulo-listado');
  const visible = listado.style.display !== 'none';
  listado.style.display = visible ? 'none' : 'block';
  titulo.style.display = visible ? 'none' : 'block';
}

cargarListado();