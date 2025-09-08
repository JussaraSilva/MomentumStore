(function() {
  'use strict';

  function obterCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
  }

  function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }

  function parsePriceToNumber(text) {
    if (typeof text === 'number') return text;
    if (!text) return 0;
    return Number(String(text).replace(/[^\d\,\.\-]/g,'').replace(/\./g,'').replace(',', '.')) || 0;
  }

  function adicionarAoCarrinho(produto) {
    const carrinho = obterCarrinho();
    const key = String(produto.id);
    const existente = carrinho.find(item => String(item.id) === key);

    if (existente) {
      existente.quantidade += produto.quantidade || 1;
    } else {
      produto.quantidade = produto.quantidade || 1;
      produto.preco = parsePriceToNumber(produto.preco);
      carrinho.push(produto);
    }

    salvarCarrinho(carrinho);
    document.dispatchEvent(new CustomEvent('carrinho:updated', { detail: { carrinho } }));
    alert(`${produto.nome} adicionado ao carrinho!`);
  }

  // Escute o evento de produto carregado
  document.addEventListener('produto:carregado', (e) => {
    console.log('Produto carregado via evento:', e.detail.produto);
    window.produtoPage = e.detail.produto;
  });

  // --- Event delegation para ambos os botões ---
  document.addEventListener('click', e => {
    
    // 1) catálogo
const btnCatalogo = e.target.closest('.btn-comprar');
if (btnCatalogo) {
    const card = btnCatalogo.closest('.produto-catalogo');
    if (!card) return;

    // CORREÇÃO: Seleciona a imagem principal, não a primeira imagem
    const imagemPrincipal = card.querySelector('.img-principal')?.src || '';
    const imagemSelo = card.querySelector('.selo-garantia')?.src || '';
    
    // Garante que pega a imagem do produto, não do selo
    const imagem = imagemPrincipal && imagemPrincipal !== imagemSelo ? 
                  imagemPrincipal : 
                  card.querySelector('img')?.src || '';

    const produto = {
        id: card.dataset.id || btnCatalogo.dataset.id,
        nome: card.querySelector('h3')?.textContent.trim() || 'Produto',
        preco: Number(card.dataset.preco) || parsePriceToNumber(card.dataset.preco),
        imagem: imagem, // ← Usa a imagem corrigida
        quantidade: 1
    };
    
    console.log('Produto do catálogo:', produto); // Para debug
    adicionarAoCarrinho(produto);
    return;
}

    // 2) product page - CORREÇÃO DEFINITIVA
    const btnProduct = e.target.closest('#addToCart, #addtocart, [data-addtocart]');
    if (btnProduct) {
      console.log('Botão clicado!');
      
      // Tenta obter dados do produto de múltiplas formas
      let produtoData = null;
      
      // 1. Tenta da variável global (mais comum)
      if (window.produtoPage) {
        console.log('Encontrado em window.produtoPage:', window.produtoPage);
        produtoData = window.produtoPage;
      }
      // 2. Tenta dos data attributes do botão
      else if (btnProduct.dataset.id) {
        console.log('Encontrado em data attributes do botão');
        produtoData = {
          id: btnProduct.dataset.id,
          nome: btnProduct.dataset.nome || 'Produto',
          preco: btnProduct.dataset.preco || 0,
          imgPrincipal: btnProduct.dataset.imagem || ''
        };
      }
      // 3. Tenta do DOM (fallback)
      else {
        console.log('Buscando dados do DOM...');
        const productPage = document.querySelector('.product-page, [data-product]');
        if (productPage) {
          produtoData = {
            id: productPage.dataset.id || Date.now(),
            nome: document.querySelector('.product-name, h1')?.textContent.trim() || 'Produto',
            preco: document.querySelector('.product-price, [data-price]')?.textContent.trim() || '0',
            imgPrincipal: document.querySelector('.main-product-image, .product-image')?.src || ''
          };
        }
      }

      if (produtoData) {
        console.log('Dados do produto encontrados:', produtoData);
        
        const produto = {
          id: produtoData.id || Date.now(), // Garante um ID
          nome: produtoData.nome,
          preco: parsePriceToNumber(produtoData.preco),
          imagem: produtoData.imgPrincipal || produtoData.imagem || '',
          quantidade: 1
        };
        
        console.log('Produto a ser adicionado:', produto);
        adicionarAoCarrinho(produto);
      } else {
        console.error('Não foi possível obter dados do produto!');
        alert('Erro: Não foi possível adicionar o produto ao carrinho.');
      }
      return;
    }
  });

  window.carrinhoUtils = { obterCarrinho, salvarCarrinho, adicionarAoCarrinho, parsePriceToNumber };

  // Debug
  console.log('carrinho-utils carregado');
  console.log('window.produtoPage no carregamento:', window.produtoPage);

  // Verifica periodicamente se o produtoPage foi carregado
  setInterval(() => {
    if (window.produtoPage && !window.produtoPageDebug) {
      console.log('window.produtoPage agora está disponível:', window.produtoPage);
      window.produtoPageDebug = true;
    }
  }, 1000);
})();

// No final do carrinho-utils.js, adicione:

