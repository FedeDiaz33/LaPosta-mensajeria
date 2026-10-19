document.addEventListener("DOMContentLoaded", () => {
  initWhatsApp();
  initCotizador();
  initConfirmacion();
  initCobertura();
  initSeguimiento();
  initPedidos();
  initFooter();
});

/* ============ WHATSAPP ============ */
function initWhatsApp() {
  const btn = document.getElementById("whatsapp-btn");
  btn.href = `https://wa.me/${3815064447}?text=${encodeURIComponent(3815064447)}`;
}

/* ============ COTIZADOR EXPRESS ============ */
function initCotizador() {
  const origenSel = document.getElementById("origen");
  const destinoSel = document.getElementById("destino");
  const tipoSel = document.getElementById("tipo");
  const btn = document.getElementById("btn-calcular");
  const resultado = document.getElementById("resultado");
  const resultadoPrecio = document.getElementById("resultado-precio");
  const resultadoTiempo = document.getElementById("resultado-tiempo");
  const btnAceptarEnvio = document.getElementById("btn-aceptar-envio");

  ZONAS.forEach((z) => {
    origenSel.add(new Option(z.nombre, z.id));
    destinoSel.add(new Option(z.nombre, z.id));
  });
  destinoSel.value = "yerbabuena";

  TIPOS_ENVIO.forEach((t) => {
    tipoSel.add(new Option(`${t.nombre} · ${t.detalle}`, t.id));
  });
  tipoSel.value = "chico";

  function ocultarResultado() {
    resultado.classList.add("hidden");
    btnAceptarEnvio.classList.add("hidden");
    cotizacionActual = null;
  }
  [origenSel, destinoSel, tipoSel].forEach((el) => el.addEventListener("change", ocultarResultado));

  btn.addEventListener("click", () => {
    const zonaOrigen = ZONAS.find((z) => z.id === origenSel.value);
    const zonaDestino = ZONAS.find((z) => z.id === destinoSel.value);
    const tipo = tipoSel.value;

    const base = tarifaDe(zonaDestino, tipo);
    const recargoAnillo = zonaOrigen.id === zonaDestino.id ? 0 : Math.abs(zonaOrigen.anillo - zonaDestino.anillo) * 150;
    const precio = base + recargoAnillo;

    resultadoPrecio.textContent = formatoARS(precio);
    resultadoTiempo.textContent = zonaDestino.minutos;
    resultado.classList.remove("hidden");

    cotizacionActual = {
      origen: zonaOrigen.nombre,
      destino: zonaDestino.nombre,
      tipo: TIPOS_ENVIO.find((t) => t.id === tipo),
      precio,
      tiempo: zonaDestino.minutos,
    };
    btnAceptarEnvio.classList.remove("hidden");
  });
}

/* ============ COBERTURA Y TARIFARIO ============ */
function initCobertura() {
  const svg = document.getElementById("mapa-svg");
  const NS = "http://www.w3.org/2000/svg";

  const anillos = [130, 85, 40];
  const anilloColores = [ANILLO_COLOR[3], ANILLO_COLOR[2], ANILLO_COLOR[1]];
  anillos.forEach((r, i) => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", 200); c.setAttribute("cy", 170); c.setAttribute("r", r);
    c.setAttribute("fill", "none");
    c.setAttribute("stroke", anilloColores[i]);
    c.setAttribute("stroke-opacity", "0.3");
    c.setAttribute("stroke-width", "1.5");
    svg.appendChild(c);
  });

  ZONAS.forEach((z) => {
    const g = document.createElementNS(NS, "g");

    const circle = document.createElementNS(NS, "circle");
    circle.setAttribute("cx", z.cx); circle.setAttribute("cy", z.cy);
    circle.setAttribute("r", z.id === "centro" ? 7 : 5.5);
    circle.setAttribute("fill", ANILLO_COLOR[z.anillo]);
    circle.setAttribute("stroke", "#12182B");
    circle.setAttribute("stroke-width", "1.2");
    g.appendChild(circle);

    const text = document.createElementNS(NS, "text");
    text.setAttribute("x", z.cx); text.setAttribute("y", z.cy - 11);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "9");
    text.setAttribute("fill", "#2B2F36");
    text.setAttribute("font-family", "IBM Plex Mono, monospace");
    text.textContent = z.nombre;
    g.appendChild(text);

    svg.appendChild(g);
  });

  const leyenda = document.getElementById("mapa-leyenda");
  [1, 2, 3].forEach((a) => {
    const span = document.createElement("span");
    span.innerHTML = `<span class="mapa-dot" style="background:${ANILLO_COLOR[a]}"></span>${ANILLO_LABEL[a]}`;
    leyenda.appendChild(span);
  });

  const tarifarioBody = document.getElementById("tarifario-body");
  ZONAS.forEach((z) => {
    const row = document.createElement("div");
    row.className = "tarifario-row";
    row.innerHTML = `
      <span>${z.nombre}</span>
      <span>${z.minutos}</span>
      <span>${formatoARS(z.tarifaSobre)}</span>
      <span>${formatoARS(z.tarifaChico)}</span>
      <span>${formatoARS(z.tarifaGrande)}</span>
    `;
    tarifarioBody.appendChild(row);
  });
}

/* ============ SEGUIMIENTO EN VIVO (GPS SIMULADO) ============ */
function initSeguimiento() {
  const rutaBase = document.getElementById("ruta-base");
  const rutaProgreso = document.getElementById("ruta-progreso");
  const halo = document.getElementById("cadete-halo");
  const punto = document.getElementById("cadete-punto");
  const estadoTexto = document.getElementById("estado-texto");
  const estadoEta = document.getElementById("estado-eta");
  const progressFill = document.getElementById("progress-fill");
  const etapasList = document.getElementById("etapas-list");

  const TOTAL_MIN = 34;
  const totalLength = rutaBase.getTotalLength();

  ETAPAS.forEach((e) => {
    const li = document.createElement("li");
    li.dataset.umbral = e.umbral;
    li.innerHTML = `<span class="etapa-dot"></span>${e.texto}`;
    etapasList.appendChild(li);
  });
  const etapaItems = Array.from(etapasList.children);

  let progreso = 0;
  let pausado = false;

  function tick() {
    if (!pausado) {
      progreso += 0.004;
      if (progreso >= 1) {
        progreso = 1;
        pausado = true;
        setTimeout(() => { pausado = false; progreso = 0; }, 2200);
      }
    }

    const pt = rutaBase.getPointAtLength(progreso * totalLength);
    halo.setAttribute("cx", pt.x); halo.setAttribute("cy", pt.y);
    punto.setAttribute("cx", pt.x); punto.setAttribute("cy", pt.y);
    rutaProgreso.setAttribute("stroke-dasharray", `${progreso * 100} 100`);

    const etapaActual = [...ETAPAS].reverse().find((e) => progreso >= e.umbral) || ETAPAS[0];
    estadoTexto.textContent = etapaActual.texto;
    estadoEta.textContent = `${Math.max(0, Math.round(TOTAL_MIN * (1 - progreso)))} min`;
    progressFill.style.width = `${progreso * 100}%`;

    etapaItems.forEach((li) => {
      const activa = progreso >= parseFloat(li.dataset.umbral);
      li.classList.toggle("activa", activa);
      li.querySelector(".etapa-dot").classList.toggle("activa", activa);
    });
  }

  tick();
  setInterval(tick, 45);
}

/* ============ ALERTA DE PEDIDO (APP DEL CADETE) ============ */
function initPedidos() {
  const contenido = document.getElementById("phone-content");
  const DURACION_MS = 12000;

  let indice = 0;
  let estado = "pendiente"; // pendiente | aceptado | rechazado
  let inicioPendiente = Date.now();
  let intervaloCountdown = null;

  function pedidoActual() {
    return PEDIDOS_DEMO[indice % PEDIDOS_DEMO.length];
  }

  function render() {
    contenido.innerHTML = "";

    if (estado === "pendiente") {
      const p = pedidoActual();
      const ticket = document.createElement("div");
      ticket.className = "ticket";
      ticket.innerHTML = `
        <div class="ticket-head">
          <span class="eyebrow eyebrow-yellow" style="font-size:10px">Pedido cercano</span>
          <span class="ticket-tipo mono">${p.tipo}</span>
        </div>
        <p class="ticket-ruta">${p.origen} <span class="flecha">&rarr;</span> ${p.destino}</p>
        <p class="ticket-km mono">${p.km} km</p>
        <p class="ticket-precio mono">${formatoARS(p.precio)}</p>
        <div class="ticket-bar"><div class="ticket-bar-fill" id="ticket-bar-fill"></div></div>
        <div class="ticket-actions">
          <button class="btn btn-rechazar" id="btn-rechazar">Rechazar</button>
          <button class="btn btn-aceptar" id="btn-aceptar">Aceptar</button>
        </div>
      `;
      contenido.appendChild(ticket);
      document.getElementById("btn-rechazar").addEventListener("click", () => cambiarEstado("rechazado"));
      document.getElementById("btn-aceptar").addEventListener("click", () => cambiarEstado("aceptado"));
    } else {
      const div = document.createElement("div");
      div.className = `estado-final ${estado}`;
      if (estado === "aceptado") {
        div.innerHTML = `
          <span class="punto"></span>
          <p>Pedido aceptado</p>
          <p class="mono">Rumbo a ${pedidoActual().origen}</p>
        `;
      } else {
        div.innerHTML = `
          <span class="punto"></span>
          <p>Pedido reasignado</p>
          <p class="mono">Buscando otro cadete cercano…</p>
        `;
      }
      contenido.appendChild(div);
    }
  }

  function cambiarEstado(nuevo) {
    estado = nuevo;
    clearInterval(intervaloCountdown);
    render();
    setTimeout(() => {
      indice += 1;
      estado = "pendiente";
      inicioPendiente = Date.now();
      render();
      iniciarCountdown();
    }, 1600);
  }

  function iniciarCountdown() {
    intervaloCountdown = setInterval(() => {
      if (estado !== "pendiente") return;
      const pasado = Date.now() - inicioPendiente;
      const pct = Math.max(0, 100 - (pasado / DURACION_MS) * 100);
      const bar = document.getElementById("ticket-bar-fill");
      if (bar) bar.style.width = `${pct}%`;
      if (pct <= 0) {
        cambiarEstado("rechazado");
      }
    }, 80);
  }

  render();
  iniciarCountdown();
}

/* ============ FOOTER ============ */
function initFooter() {
  const barrios = document.getElementById("footer-barrios");
  ZONAS.forEach((z) => {
    const span = document.createElement("span");
    span.textContent = z.nombre;
    barrios.appendChild(span);
  });

  document.getElementById("footer-copy").textContent =
    `© ${new Date().getFullYear()} LA POSTA Cadetería · Dejanos una reseña en nuestra web de Google.`;
}


/* ============ CONFIRMAR PEDIDO POR WHATSAPP ============ */
let cotizacionActual = null;

function initConfirmacion() {
  const btnAbrir = document.getElementById("btn-aceptar-envio");
  const modal = document.getElementById("pedido-modal");
  const form = document.getElementById("pedido-form");
  const resumen = document.getElementById("pedido-resumen");
  const btnGps = document.getElementById("btn-gps");
  const gpsEstado = document.getElementById("gps-estado");
  const gpsInput = document.getElementById("pedido-retiro-gps");

  const val = (id) => document.getElementById(id).value.trim();

  function abrir() {
    if (!cotizacionActual) return;
    const c = cotizacionActual;
    resumen.innerHTML = `
      <span>${c.tipo.nombre} · ${c.tipo.detalle}</span>
      <span>${c.origen} &rarr; ${c.destino}</span>
      <strong>${formatoARS(c.precio)} · ${c.tiempo}</strong>
    `;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    document.getElementById("pedido-nombre").focus();
  }

  function cerrar() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  btnAbrir.addEventListener("click", abrir);
  document.getElementById("pedido-cerrar").addEventListener("click", cerrar);
  document.getElementById("pedido-backdrop").addEventListener("click", cerrar);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) cerrar();
  });

  btnGps.addEventListener("click", () => {
    if (!navigator.geolocation) {
      gpsEstado.textContent = "Tu navegador no permite obtener la ubicación. Escribí la dirección.";
      return;
    }
    gpsEstado.textContent = "Obteniendo ubicación…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        gpsInput.value = `https://maps.google.com/?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        gpsEstado.textContent = "Ubicación agregada al pedido ✔";
      },
      () => {
        gpsInput.value = "";
        gpsEstado.textContent = "No pudimos obtener la ubicación. Escribí la dirección.";
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cotizacionActual) return;
    const c = cotizacionActual;

    const lineas = [
      "Hola LA POSTA! Quiero solicitar este envío puerta a puerta:",
      "",
      "*SERVICIO*",
      `• Tipo: ${c.tipo.nombre} (${c.tipo.detalle})`,
      `• Retiro en: ${c.origen}`,
      `• Entrega en: ${c.destino}`,
      `• Tarifa estimada: ${formatoARS(c.precio)}`,
      `• Tiempo estimado: ${c.tiempo}`,
      `• Forma de pago: ${val("pedido-pago")}`,
    ];
    if (val("pedido-contenido")) lineas.push(`• Contenido: ${val("pedido-contenido")}`);

    lineas.push(
      "",
      "*MIS DATOS*",
      `• Nombre: ${val("pedido-nombre")}`,
      `• DNI: ${val("pedido-dni")}`,
      `• Teléfono: ${val("pedido-telefono")}`,
      "",
      "*RETIRO (dónde está el sobre/paquete)*",
      `• Dirección: ${val("pedido-retiro-dir")}`
    );
    if (val("pedido-retiro-ref")) lineas.push(`• Referencias: ${val("pedido-retiro-ref")}`);
    if (gpsInput.value) lineas.push(`• Ubicación GPS: ${gpsInput.value}`);

    lineas.push(
      "",
      "*ENTREGA (quién recibe)*",
      `• Recibe: ${val("pedido-recibe-nombre")}`,
      `• Teléfono: ${val("pedido-recibe-tel")}`,
      `• Dirección: ${val("pedido-entrega-dir")}`
    );
    if (val("pedido-entrega-ref")) lineas.push(`• Referencias: ${val("pedido-entrega-ref")}`);

    lineas.push("", "¿Me confirman disponibilidad? Gracias!");

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(lineas.join("\n"))}`;
    window.open(url, "_blank", "noopener");
    cerrar();
  });
}
