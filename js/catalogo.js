document.addEventListener("DOMContentLoaded", async () => {
  const catalogo = document.querySelector(".produtos-catalogo");

  // Injeta regra forte para esconder produtos
  if (!document.getElementById("hide-rule")) {
    const style = document.createElement("style");
    style.id = "hide-rule";
    style.textContent = ".is-hidden{display:none !important;}";
    document.head.appendChild(style);
  }

  // 1️⃣ Carrega produtos do JSON
  const res = await fetch("catalogo.json");
  const produtos = await res.json();

  // 2️⃣ Injeta produtos no DOM
  produtos.forEach(produto => {
    const produtoHTML = `
      <article class="produto-catalogo ${produto.marca || ""} ${produto.estilo || ""}" data-id="${produto.id}">
        <img src="/assets/images/icons/selo-de-autencidade.webp" alt="Selo de Garantia" class="selo-garantia">
        <div class="product-img-container">
          <img src="${produto.img}" alt="${produto.nome}" class="img-principal">
        </div>
        <div class="product-information">
          <h3>${produto.nome}</h3>
          <p class="preco">R$ ${produto.preco.toLocaleString('pt-BR')}</p>
          <button class="btn-comprar" data-id="${produto.id}">
            <i class="bi bi-bag-check"></i> Adicionar ao Carrinho
          </button>
        </div>
      </article>
    `;
    catalogo.insertAdjacentHTML("beforeend", produtoHTML);
  });

  // 3️⃣ Inicializa filtros e lógica
  initFiltros();
  initOverlay();
});

function initFiltros() {
  const filtros   = document.querySelector(".filtro-lateral");
  const catalogo  = document.querySelector(".produtos-catalogo");
  if (!filtros || !catalogo) return;

  const ESTILOS = ["esportivo", "classico", "casual", "luxo"];
  const produtos = Array.from(catalogo.querySelectorAll(".produto-catalogo"));

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
    "jaeger lecoultre": "jaeger-lecoultre",
    "jaeger-lecoultre": "jaeger-lecoultre"
  };

  const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const marcaChecks  = Array.from(filtros.querySelectorAll('input[name="marca"]'));
  const estiloChecks = Array.from(filtros.querySelectorAll('input[name="estilo"]'));

  marcaChecks.forEach(chk => {
    const label = chk.closest("label");
    const key = label ? normalize(label.textContent || "") : "";
    chk.dataset.slug = brandSlugMap[key] || normalize(chk.value);
  });

  const KNOWN_BRANDS = new Set(Object.values(brandSlugMap));

  const cards = produtos.map(card => {
    const classes = Array.from(card.classList);
    const estilosDoCard = ESTILOS.filter(e => classes.includes(e));
    let brandSlug = classes.find(c => KNOWN_BRANDS.has(c)) || "";
    return { card, brandSlug, estilosDoCard };
  });

  function selecionadas(list) {
    return list.filter(c => c.checked).map(c => c.dataset.slug || normalize(c.value));
  }

  function estilosSelecionados() {
    return estiloChecks.filter(c => c.checked).map(c => normalize(c.value));
  }

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

    catalogo.classList.toggle("single-result", visiveis.length === 1);
    if (visiveis.length === 1) {
      visiveis[0].classList.add("highlight-card");
    } else {
      cards.forEach(({ card }) => card.classList.remove("highlight-card"));
    }
  }

  filtros.addEventListener("change", (e) => {
    const t = e.target;
    if (!t || t.nodeName !== "INPUT") return;
    if (t.name === "marca" || t.name === "estilo") aplica();
  });

  const limpar = filtros.querySelector("#limpar-filtros");
  if (limpar) limpar.addEventListener("click", () => {
    [...marcaChecks, ...estiloChecks].forEach(c => (c.checked = false));
    aplica();
  });

  aplica();
}

function initOverlay() {
  const btnAbrir = document.getElementById('abrirFiltros');
  const btnFechar = document.getElementById('fecharFiltros');
  const filtro = document.querySelector('.filtro-lateral');
  const overlay = document.querySelector('.overlay');

  function abrirFiltro() {
    if (!filtro) return;
    filtro.classList.add('ativo');
    overlay.classList.add('ativo');
    btnAbrir && btnAbrir.classList.add('esconder');
    filtro.setAttribute('aria-hidden', 'false');
    btnAbrir && btnAbrir.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onKeyDownClose);
  }

  function fecharFiltro() {
    if (!filtro) return;
    filtro.classList.remove('ativo');
    overlay.classList.remove('ativo');
    btnAbrir && btnAbrir.classList.remove('esconder');
    filtro.setAttribute('aria-hidden', 'true');
    btnAbrir && btnAbrir.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeyDownClose);
  }

  function onKeyDownClose(e) {
    if (e.key === 'Escape' || e.key === 'Esc') fecharFiltro();
  }

  if (btnAbrir) btnAbrir.addEventListener('click', abrirFiltro);
  if (btnFechar) btnFechar.addEventListener('click', fecharFiltro);
  if (overlay) overlay.addEventListener('click', fecharFiltro);

  function ajustarAlturaFiltro() {
    const header = document.querySelector('header, .site-header, .main-header, .header');
    const footer = document.querySelector('footer, .site-footer, .main-footer, .footer');
    const headerHeight = header ? header.offsetHeight : 0;
    const footerHeight = footer ? footer.offsetHeight : 0;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
  }

  window.addEventListener('resize', ajustarAlturaFiltro);
  window.addEventListener('load', ajustarAlturaFiltro);
  ajustarAlturaFiltro();
}



