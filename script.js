document.getElementById("generarTabla").addEventListener("click", generarTabla);
document.getElementById("calcular").addEventListener("click", () => {
  const metodo = document.getElementById("metodo").value;
  if (metodo === "esquinaNoroeste") {
    calcularEsquinaNoroeste();
  } else if (metodo === "costeMinimo") {
    calcularCosteMinimo();
  }
});

function generarTabla() {
  const fuentes = parseInt(document.getElementById("fuentes").value);
  const destinos = parseInt(document.getElementById("destinos").value);

  let matrizHTML = "<table>";
  matrizHTML += "<tr><th></th>";
  for (let j = 0; j < destinos; j++) {
    matrizHTML += `<th>Destino ${j + 1}</th>`;
  }
  matrizHTML += "<th>Oferta</th></tr>";

  for (let i = 0; i < fuentes; i++) {
    matrizHTML += `<tr><th>Fuente ${i + 1}</th>`;
    for (let j = 0; j < destinos; j++) {
      matrizHTML += `<td><input type="number" id="costo-${i}-${j}" min="0" value="0"></td>`;
    }
    matrizHTML += `<td><input type="number" id="oferta-${i}" min="0" value="0"></td></tr>`;
  }

  matrizHTML += "<tr><th>Demanda</th>";
  for (let j = 0; j < destinos; j++) {
    matrizHTML += `<td><input type="number" id="demanda-${j}" min="0" value="0"></td>`;
  }
  matrizHTML += "<td></td></tr></table>";

  document.getElementById("matrizCostos").innerHTML = matrizHTML;
  document.getElementById("tablaEntrada").style.display = "block";
}

function calcularEsquinaNoroeste() {
  const fuentes = parseInt(document.getElementById("fuentes").value);
  const destinos = parseInt(document.getElementById("destinos").value);

  let oferta = [];
  for (let i = 0; i < fuentes; i++) {
    oferta.push(parseInt(document.getElementById(`oferta-${i}`).value));
  }

  let demanda = [];
  for (let j = 0; j < destinos; j++) {
    demanda.push(parseInt(document.getElementById(`demanda-${j}`).value));
  }

  let costos = [];
  for (let i = 0; i < fuentes; i++) {
    costos.push([]);
    for (let j = 0; j < destinos; j++) {
      costos[i].push(parseInt(document.getElementById(`costo-${i}-${j}`).value));
    }
  }

  let asignaciones = Array.from({ length: fuentes }, () => Array(destinos).fill(0));

  let i = 0, j = 0;
  while (i < fuentes && j < destinos) {
    let asignable = Math.min(oferta[i], demanda[j]);
    asignaciones[i][j] = asignable;
    oferta[i] -= asignable;
    demanda[j] -= asignable;

    if (oferta[i] === 0) i++;
    if (demanda[j] === 0) j++;
  }

  let totalCosto = 0;
  for (let i = 0; i < fuentes; i++) {
    for (let j = 0; j < destinos; j++) {
      totalCosto += asignaciones[i][j] * costos[i][j];
    }
  }

  mostrarResultados(asignaciones, totalCosto);
}

function calcularCosteMinimo() {
  const fuentes = parseInt(document.getElementById("fuentes").value);
  const destinos = parseInt(document.getElementById("destinos").value);

  let oferta = [];
  for (let i = 0; i < fuentes; i++) {
    oferta.push(parseInt(document.getElementById(`oferta-${i}`).value));
  }

  let demanda = [];
  for (let j = 0; j < destinos; j++) {
    demanda.push(parseInt(document.getElementById(`demanda-${j}`).value));
  }

  let costos = [];
  for (let i = 0; i < fuentes; i++) {
    costos.push([]);
    for (let j = 0; j < destinos; j++) {
      costos[i].push(parseInt(document.getElementById(`costo-${i}-${j}`).value));
    }
  }

  let asignaciones = Array.from({ length: fuentes }, () => Array(destinos).fill(0));

  let celdas = [];
  for (let i = 0; i < fuentes; i++) {
    for (let j = 0; j < destinos; j++) {
      celdas.push({ i, j, costo: costos[i][j] });
    }
  }
  celdas.sort((a, b) => a.costo - b.costo);

  for (let celda of celdas) {
    let { i, j } = celda;
    
    if (oferta[i] > 0 && demanda[j] > 0) {  // Solo asignamos si hay oferta y demanda
      let asignable = Math.min(oferta[i], demanda[j]);  // Asignar lo mínimo entre oferta y demanda
      asignaciones[i][j] = asignable;  // Asignamos la cantidad

      // Actualizamos oferta y demanda
      oferta[i] -= asignable;
      demanda[j] -= asignable;
    }
  }

  let totalCosto = 0;
  for (let i = 0; i < fuentes; i++) {
    for (let j = 0; j < destinos; j++) {
      totalCosto += asignaciones[i][j] * costos[i][j];
    }
  }

  mostrarResultados(asignaciones, totalCosto);
}

function mostrarResultados(asignaciones, totalCosto) {
  let resultadosHTML = "<table>";
  resultadosHTML += "<tr><th></th>";
  for (let j = 0; j < asignaciones[0].length; j++) {
    resultadosHTML += `<th>Destino ${j + 1}</th>`;
  }
  resultadosHTML += "</tr>";

  for (let i = 0; i < asignaciones.length; i++) {
    resultadosHTML += `<tr><th>Fuente ${i + 1}</th>`;
    for (let j = 0; j < asignaciones[i].length; j++) {
      resultadosHTML += `<td>${asignaciones[i][j]}</td>`;
    }
    resultadosHTML += "</tr>";
  }

  resultadosHTML += "</table>";

  document.getElementById("asignaciones").innerHTML = resultadosHTML;
  document.getElementById("costoTotal").innerText = `Costo Total: ${totalCosto}`;
  document.getElementById("resultado").style.display = "block";
}
