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


function aplica() {
  const marcas = selecionadas(marcaChecks);
  const estilos = estilosSelecionados();

  let visiveis = [];

  cards.forEach(({ card, brandSlug, estilosDoCard }) => {
    const matchMarca  = marcas.length === 0  || marcas.includes(brandSlug);
    const matchEstilo = estilos.length === 0 || estilos.some(e => estilosDoCard.includes(e));
    const visivel = matchMarca && matchEstilo;

    card.classList.toggle("is-hidden", !visivel);
    card.setAttribute("aria-hidden", String(!visivel));

    if (visivel) visiveis.push(card);
  });

  // aplica estilo especial se só houver 1 resultado
  catalogo.classList.toggle("single-result", visiveis.length === 1);

  // opcional: também jogar a classe direto no card único
  if (visiveis.length === 1) {
    visiveis[0].classList.add("highlight-card");
  } else {
    cards.forEach(({ card }) => card.classList.remove("highlight-card"));
  }
}

  // Debug rápido (abra o console pra ver)
  // console.table(cards.map(c => ({brand: c.brandSlug, estilos: c.estilosDoCard.join(",")})));
});


document.addEventListener('DOMContentLoaded', () => {
  const btnAbrir = document.getElementById('abrirFiltros');
  const btnFechar = document.getElementById('fecharFiltros');
  const filtro = document.querySelector('.filtro-lateral');
  const overlay = document.querySelector('.overlay'); // Assumindo que o overlay já existe no HTML

  // Funções para adicionar/remover classes
  function abrirFiltro() {
    if (!filtro) return;
    filtro.classList.add('ativo');
    overlay.classList.add('ativo');
    btnAbrir && btnAbrir.classList.add('esconder');
    filtro.setAttribute('aria-hidden', 'false');
    btnAbrir && btnAbrir.setAttribute('aria-expanded', 'true');
    // Adiciona listener para fechar com 'Esc'
    document.addEventListener('keydown', onKeyDownClose);
  }

  function fecharFiltro() {
    if (!filtro) return;
    filtro.classList.remove('ativo');
    overlay.classList.remove('ativo');
    btnAbrir && btnAbrir.classList.remove('esconder');
    filtro.setAttribute('aria-hidden', 'true');
    btnAbrir && btnAbrir.setAttribute('aria-expanded', 'false');
    // Remove listener para fechar com 'Esc'
    document.removeEventListener('keydown', onKeyDownClose);
  }

  function onKeyDownClose(e) {
    if (e.key === 'Escape' || e.key === 'Esc') fecharFiltro();
  }

  // Lógica para calcular a altura do header e footer
  // e atualizar variáveis CSS
  function ajustarAlturaFiltro() {
    const header = document.querySelector('header, .site-header, .main-header, .header');
    const footer = document.querySelector('footer, .site-footer, .main-footer, .footer');
    
    // Altura do header em pixels
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Altura do footer em pixels
    const footerHeight = footer ? footer.offsetHeight : 0;

    // Atualiza as variáveis CSS no elemento root (<html>)
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
  }

  // Listeners
  if (btnAbrir) btnAbrir.addEventListener('click', abrirFiltro);
  if (btnFechar) btnFechar.addEventListener('click', fecharFiltro);
  if (overlay) overlay.addEventListener('click', fecharFiltro);

  // Atualiza a altura em resize e load
  window.addEventListener('resize', ajustarAlturaFiltro);
  window.addEventListener('load', ajustarAlturaFiltro);
  ajustarAlturaFiltro(); // Chama a função na inicialização
});


