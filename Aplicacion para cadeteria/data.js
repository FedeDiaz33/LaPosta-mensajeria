// Zonas de cobertura, tarifas de referencia y datos de la demo.
// Reemplazá estos valores por los reales del negocio.

const ZONAS = [
  { id: "centro",     nombre: "Centro",              anillo: 1, minutos: "20-30 min", tarifaSobre: 2000, tarifaChico: 1900, tarifaGrande: 2600, cx: 200, cy: 170 },
  { id: "sur",         nombre: "Barrio Sur",          anillo: 1, minutos: "25-35 min", tarifaSobre: 1800, tarifaChico: 2000, tarifaGrande: 2700, cx: 150, cy: 220 },
  { id: "urquiza",     nombre: "Villa Urquiza",       anillo: 1, minutos: "25-35 min", tarifaSobre: 2650, tarifaChico: 2050, tarifaGrande: 2750, cx: 255, cy: 130 },
  { id: "norte",       nombre: "Barrio Norte",        anillo: 2, minutos: "35-45 min", tarifaSobre: 2900, tarifaChico: 2400, tarifaGrande: 3200, cx: 195, cy: 90  },
  { id: "yerbabuena",  nombre: "Yerba Buena",         anillo: 2, minutos: "35-50 min", tarifaSobre: 3200, tarifaChico: 2700, tarifaGrande: 3600, cx: 90,  cy: 110 },
  { id: "talitas",     nombre: "Las Talitas",         anillo: 2, minutos: "40-50 min", tarifaSobre: 4100, tarifaChico: 2600, tarifaGrande: 3500, cx: 300, cy: 90  },
  { id: "tafiviejo",   nombre: "Tafí Viejo",          anillo: 3, minutos: "50-65 min", tarifaSobre: 5800, tarifaChico: 3300, tarifaGrande: 4300, cx: 320, cy: 40  },
  { id: "banda",       nombre: "Banda del Río Salí",  anillo: 3, minutos: "50-65 min", tarifaSobre: 6400, tarifaChico: 3200, tarifaGrande: 4200, cx: 90,  cy: 250 },
];

const TIPOS_ENVIO = [
  { id: "sobre",  nombre: "Sobre / documento", detalle: "Hasta 500 g" },
  { id: "chico",  nombre: "Paquete chico",     detalle: "Hasta 5 kg"  },
  { id: "grande", nombre: "Paquete grande",    detalle: "Hasta 15 kg" },
];

const ANILLO_COLOR = { 1: "#3FA66A", 2: "#FFC53D", 3: "#FF6A3D" };
const ANILLO_LABEL = { 1: "Zona 1 · más rápida", 2: "Zona 2", 3: "Zona 3 · extendida" };

const ETAPAS = [
  { umbral: 0,    texto: "Retirado en Centro" },
  { umbral: 0.12, texto: "En camino" },
  { umbral: 0.7,  texto: "Cerca del destino" },
  { umbral: 0.96, texto: "Entregado" },
];

const PEDIDOS_DEMO = [
  { origen: "Centro",       destino: "Yerba Buena",   km: 6.2, precio: 2200, tipo: "Paquete chico"  },
  { origen: "Barrio Norte", destino: "Villa Urquiza",  km: 3.1, precio: 1900, tipo: "Sobre"           },
  { origen: "Centro",       destino: "Las Talitas",    km: 8.4, precio: 2600, tipo: "Paquete grande"  },
];

const NUMERO_WHATSAPP = "5493815064447";
const MENSAJE_WHATSAPP = "Hola LA POSTA! Quiero enviar un paquete/sobre puerta a puerta. ¿Me pasan precio?";

function tarifaDe(zona, tipo) {
  if (tipo === "sobre") return zona.tarifaSobre;
  if (tipo === "chico") return zona.tarifaChico;
  return zona.tarifaGrande;
}

function formatoARS(numero) {
  return "$" + numero.toLocaleString("es-AR");
}
