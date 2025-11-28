let filas = []

const descInput   = document.getElementById('descInput')
const cantInput   = document.getElementById('cantInput')
const precioInput = document.getElementById('precioInput')

const btnAdd     = document.getElementById('btnAdd')
const btnClear   = document.getElementById('btnClear')
const btnGenerar = document.getElementById('btnGenerar')
const btnPDF     = document.getElementById('btnPDF')

btnAdd.addEventListener('click', () => {
  const desc = descInput.value.trim()
  const cant = cantInput.value
  const precio = precioInput.value

  if (!desc && !cant && !precio) return

  filas.push({ desc, cant, precio })

  descInput.value = ''
  cantInput.value = ''
  precioInput.value = ''

  renderTabla()
})

btnClear.addEventListener('click', () => {
  filas = []
  renderTabla()
})

function renderTabla() {
  const tablaCont = document.getElementById('tablaPreview')
  tablaCont.innerHTML = ''

  const table = document.createElement('table')

  const thead = document.createElement('thead')
  thead.innerHTML = `
    <tr>
      <th class="col-desc">Descripción del tratamiento a realizar</th>
      <th class="col-cant">Cantidad</th>
      <th class="col-pre">Precio</th>
    </tr>
  `
  table.appendChild(thead)

  const tbody = document.createElement('tbody')

  filas.forEach(f => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="col-desc">${escapeHtml(f.desc)}</td>
      <td class="col-cant">${escapeHtml(f.cant)}</td>
      <td class="col-pre">${escapeHtml(f.precio)}</td>
    `
    tbody.appendChild(tr)
  })

  if (filas.length === 0) {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="col-desc">&nbsp;</td>
      <td class="col-cant">&nbsp;</td>
      <td class="col-pre">&nbsp;</td>
    `
    tbody.appendChild(tr)
  }

  table.appendChild(tbody)
  tablaCont.appendChild(table)
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

btnGenerar.addEventListener('click', () => {

  if (descInput.value || cantInput.value || precioInput.value) {
    filas.push({
      desc: descInput.value,
      cant: cantInput.value,
      precio: precioInput.value
    })
  }

  document.getElementById("outPresupuesto").textContent = "Presupuesto: " + document.getElementById("presupuesto").value
  document.getElementById("outFecha").textContent       = "Fecha: " + document.getElementById("fecha").value
  document.getElementById("outValido").textContent      = "Válido hasta: " + document.getElementById("valido").value

  document.getElementById("outDestNombre").textContent  = "Nombre: " + document.getElementById("destNombre").value
  document.getElementById("outDestTel").textContent     = "Teléfono: " + document.getElementById("destTel").value

  document.getElementById("outEntrega").textContent = document.getElementById("entrega").value
  document.getElementById("outSaldo").textContent   = document.getElementById("saldo").value
  document.getElementById("outCuotas").textContent  = document.getElementById("cuotas").value

  renderTabla()

  document.getElementById("preview").style.display = "block"
  btnPDF.style.display = "inline-block"
})

btnPDF.addEventListener('click', async () => {
  const { jsPDF } = window.jspdf
  const preview = document.getElementById("preview")

  await new Promise(r => setTimeout(r, 50))

  const canvas = await html2canvas(preview, { scale: 2, useCORS: true })
  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF("p", "px", [canvas.width, canvas.height])
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
  pdf.save("presupuesto.pdf")
})
