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
        // Fila vacía para mantener la estructura si no hay datos
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

// Inicializar la tabla vacía al cargar
document.addEventListener('DOMContentLoaded', renderTabla)


// ---- LIMPIAR FORMULARIO COMPLETO ----
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

    // Agregar la fila pendiente si existe
    if (descInput.value || cantInput.value || precioInput.value) {
        filas.push({
            desc: descInput.value,
            cant: cantInput.value,
            precio: precioInput.value
        })
        renderTabla()
    }

    // Llenar campos del Preview
    outPresupuesto.textContent = "Presupuesto: " + presupuesto.value
    outFecha.textContent = "Fecha: " + fecha.value
    outValido.textContent = "Válido hasta: " + valido.value

    outDestNombre.textContent = "Nombre: " + destNombre.value
    outDestTel.textContent = "Teléfono: " + destTel.value

    outTotal.textContent = total.value
    outEntrega.textContent = entrega.value
    outSaldo.textContent = saldo.value
    outCuotas.textContent = cuotas.value

    // Mostrar el preview y el botón de descarga
    document.getElementById("preview").style.display = "block"
    document.getElementById("btnPDF").style.display = "inline-block"
})

// ---- PDF ----
document.getElementById("btnPDF").addEventListener('click', async () => {
    const { jsPDF } = window.jspdf
    const preview = document.getElementById("preview")

    // Pequeña pausa para asegurar que los estilos se apliquen
    await new Promise(r => setTimeout(r, 50))

    const canvas = await html2canvas(preview, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL("image/png")
    
    // Crear el PDF con las dimensiones del canvas
    const pdf = new jsPDF("p", "px", [canvas.width, canvas.height]) 
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
    pdf.save("presupuesto.pdf")
})