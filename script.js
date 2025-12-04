let filas = []

const inputsSecuencia = [
  "presupuesto","fecha","valido",
  "destNombre","destTel",
  "descInput","cantInput","precioInput",
  "total","entrega","saldo","cuotas"
]

// ---- ENTER pasa al siguiente campo ----
inputsSecuencia.forEach((id, i) => {
  const inp = document.getElementById(id)
  inp.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault()
      const next = document.getElementById(inputsSecuencia[i+1])
      if (next) next.focus()
    }
  })
})

// ---- FILAS ----
const btnAdd = document.getElementById('btnAdd')
const btnClearFilas = document.getElementById('btnClearFilas')

btnAdd.addEventListener('click', () => {
  const desc = descInput.value.trim()
  const cant = cantInput.value
  const precio = precioInput.value
  if (!desc && !cant && !precio) return

  filas.push({ desc, cant, precio })

  descInput.value = ''
  cantInput.value = ''
  precioInput.value = ''
  descInput.focus()

  renderTabla()
})

btnClearFilas.addEventListener('click', () => {
  filas = []
  renderTabla()
})

function renderTabla() {
  const tablaCont = document.getElementById('tablaPreview')
  tablaCont.innerHTML = ''

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr>
        <th class="col-desc">Descripción del tratamiento a realizar</th>
        <th class="col-cant">Cantidad</th>
        <th class="col-pre">Precio</th>
      </tr>
    </thead>
  `

  const tbody = document.createElement('tbody')

  if (filas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td class="col-desc">&nbsp;</td>
        <td class="col-cant">&nbsp;</td>
        <td class="col-pre">&nbsp;</td>
      </tr>
    `
  } else {
    filas.forEach(f => {
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td class="col-desc">${f.desc}</td>
        <td class="col-cant">${f.cant}</td>
        <td class="col-pre">${f.precio}</td>
      `
      tbody.appendChild(tr)
    })
  }

  table.appendChild(tbody)
  tablaCont.appendChild(table)
}

// ---- LIMPIAR FORMULARIO ----
document.getElementById("btnClearForm").addEventListener("click", () => {
  document.getElementById("form").reset()
  filas = []
  renderTabla()
})

// ---- AUTO RELLENAR ----
document.getElementById("btnFill").addEventListener("click", () => {
  presupuesto.value = "254"
  fecha.value = "28/11/2025"
  valido.value = "15/12/2025"
  destNombre.value = "Juan Pérez"
  destTel.value = "1122334455"

  filas = [
    { desc: "Limpieza y desinfección del equipo", cant: "1", precio: "5000" },
    { desc: "Cambio de repuestos internos", cant: "2", precio: "8000" }
  ]

  total.value   = "21000"
  entrega.value = "7000"
  saldo.value   = "14000"
  cuotas.value  = "3 cuotas de $4700"

  renderTabla()
})

// ---- GENERAR PREVIEW ----
document.getElementById('btnGenerar').addEventListener('click', () => {

  if (descInput.value || cantInput.value || precioInput.value) {
    filas.push({
      desc: descInput.value,
      cant: cantInput.value,
      precio: precioInput.value
    })
    renderTabla()
  }

  outPresupuesto.textContent = "Presupuesto: " + presupuesto.value
  outFecha.textContent = "Fecha: " + fecha.value
  outValido.textContent = "Válido hasta: " + valido.value

  outDestNombre.textContent = "Nombre: " + destNombre.value
  outDestTel.textContent = "Teléfono: " + destTel.value

  outTotal.textContent = total.value
  outEntrega.textContent = entrega.value
  outSaldo.textContent = saldo.value
  outCuotas.textContent = cuotas.value

  document.getElementById("preview").style.display = "block"
  document.getElementById("btnPDF").style.display = "inline-block"
})



// ✅ ---- PDF A4 CORREGIDO ----
document.getElementById("btnPDF").addEventListener('click', async () => {
  const { jsPDF } = window.jspdf
  const preview = document.getElementById("preview")

  await new Promise(r => setTimeout(r, 50))

  const canvas = await html2canvas(preview, { scale: 2, useCORS: true })
  const imgData = canvas.toDataURL("image/png")

  // Tamaño A4 real en px a ~96 DPI
  const pdfWidth = 794
  const pdfHeight = 1123

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [pdfWidth, pdfHeight]
  })

  // Ajuste manteniendo proporción
  const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height)
  const imgW = canvas.width * ratio
  const imgH = canvas.height * ratio

  const x = (pdfWidth - imgW) / 2
  const y = (pdfHeight - imgH) / 2

  pdf.addImage(imgData, "PNG", x, y, imgW, imgH)
  pdf.save("presupuesto.pdf")
})
