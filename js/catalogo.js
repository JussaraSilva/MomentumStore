document.addEventListener("DOMContentLoaded", () => {
  // Injeta uma regra forte pra esconder (vence CSS teimoso)
  if (!document.getElementById("hide-rule")) {
    const style = document.createElement("style");
    style.id = "hide-rule";
    style.textContent = ".is-hidden{display:none !important;}";
    document.head.appendChild(style);
  }

  const filtros   = document.querySelector(".filtro-lateral");
  const catalogo  = document.querySelector(".produtos-catalogo");
  if (!filtros || !catalogo) return;

  const produtos  = Array.from(catalogo.querySelectorAll(".produto-catalogo"));
  const ESTILOS   = ["esportivo", "classico", "casual", "luxo"];

  // Mapa robusto: texto da label -> slug usado na classe do card
  const brandSlugMap = {
    "audemars piguet": "audemars",
    "cartier": "cartier",
    "rolex": "rolex",
    "patek philippe": "patek",
    "tag heuer": "tag-heuer",
    "vacheron constantin": "vacheron-constantin",
    "breitling": "breitling",
    "iwc": "iwc",
    "omega": "omega",
    "panerai": "panerai",
    "tudor": "tudor",
    "zenith": "zenith",
    "bvlgari": "bvlgari",
    "longines": "longines",
    // se um dia tiver filtro pra essas:
    "jaeger lecoultre": "jaeger-lecoultre",
    "jaeger-lecoultre": "jaeger-lecoultre"
  };

  const normalize = (s) => s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim();

  const marcaChecks  = Array.from(filtros.querySelectorAll('input[name="marca"]'));
  const estiloChecks = Array.from(filtros.querySelectorAll('input[name="estilo"]'));

  // Amarra o slug da marca na checkbox via texto da label (ignora value errado)
  marcaChecks.forEach(chk => {
    const label = chk.closest("label");
    const key = label ? normalize(label.textContent || "") : "";
    chk.dataset.slug = brandSlugMap[key] || normalize(chk.value); // fallback
  });

  // Conjunto de slugs de marcas conhecidos (pra facilitar detecção no card)
  const KNOWN_BRANDS = new Set(Object.values(brandSlugMap));

  // Pré-indexa info de cada card (marca + estilos)
  const cards = produtos.map(card => {
    const classes = Array.from(card.classList);
    const estilosDoCard = ESTILOS.filter(e => classes.includes(e));
    // tenta achar a marca por classes conhecidas
    let brandSlug = classes.find(c => KNOWN_BRANDS.has(c));
    // fallback: primeira classe "livre" que não seja produto-* nem estilo
    if (!brandSlug) {
      brandSlug = classes.find(c => c !== "produto-catalogo" && !/^produto-/.test(c) && !ESTILOS.includes(c)) || "";
    }
    return { card, brandSlug, estilosDoCard };
  });

  function selecionadas(list) {
    return list.filter(c => c.checked).map(c => c.dataset.slug || normalize(c.value));
  }

  function estilosSelecionados() {
    return estiloChecks.filter(c => c.checked).map(c => normalize(c.value));
  }

  function aplica() {
    const marcas = selecionadas(marcaChecks);     // union dentro do grupo
    const estilos = estilosSelecionados();        // union dentro do grupo

    cards.forEach(({ card, brandSlug, estilosDoCard }) => {
      const matchMarca  = marcas.length === 0  || marcas.includes(brandSlug);
      const matchEstilo = estilos.length === 0 || estilos.some(e => estilosDoCard.includes(e));
      const visivel = matchMarca && matchEstilo;
      card.classList.toggle("is-hidden", !visivel);
      card.setAttribute("aria-hidden", String(!visivel));
    });
  }

  // Ouve alterações (delegação)
  filtros.addEventListener("change", (e) => {
    const t = e.target;
    if (!t || t.nodeName !== "INPUT") return;
    if (t.name === "marca" || t.name === "estilo") aplica();
  });

  // Aplica no load (caso tenha algo marcado)
  aplica();

  // (Opcional) suporte a botão "limpar filtros"
  const limpar = filtros.querySelector("#limpar-filtros");
  if (limpar) limpar.addEventListener("click", () => {
    [...marcaChecks, ...estiloChecks].forEach(c => (c.checked = false));
    aplica();
  });

  // Debug rápido (abra o console pra ver)
  // console.table(cards.map(c => ({brand: c.brandSlug, estilos: c.estilosDoCard.join(",")})));
});
