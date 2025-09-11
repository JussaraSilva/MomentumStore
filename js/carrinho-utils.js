(function() {
  'use strict';

  // Flag de ambiente para logs de debug
  const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  function debugLog(...args) {
    if (IS_DEV) console.log(...args);
  }

  // Helpers seguros para localStorage
  function safeGetJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      debugLog('[safeGetJSON] parse failed for', key, err);
      try { localStorage.removeItem(key); } catch(e) {}
      return fallback;
    }
  }

  function safeSetJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('[safeSetJSON] erro ao salvar', key, err);
      return false;
    }
  }

  // Versões seguras de obter/salvar carrinho
  function obterCarrinho() {
    return safeGetJSON('carrinho', []);
  }

  function salvarCarrinho(carrinho) {
    const ok = safeSetJSON('carrinho', carrinho);
    if (ok) {
      document.dispatchEvent(new CustomEvent('carrinho:updated', { detail: { carrinho } }));
    }
  }

  function parsePriceToNumber(text) {
    if (typeof text === 'number') return text;
    if (!text) return 0;
    return Number(String(text).replace(/[^\d\,\.\-]/g,'').replace(/\./g,'').replace(',', '.')) || 0;
  }

  function adicionarAoCarrinho(produto) {
    try {
      if (!produto) throw new Error('Produto inválido');

      // Garante ID (se faltar, cria um temporário)
      const produtoId = produto.id ? String(produto.id) : String(Date.now());

      // Quantidade coerente
      const quantidadeToAdd = Math.max(1, Number(produto.quantidade) || 1);

      // Preço tratado (assume parsePriceToNumber já existe neste arquivo)
      const precoNumero = parsePriceToNumber(produto.preco);

      // Pega carrinho atual de forma segura
      const carrinho = obterCarrinho() || [];

      // Procura por ID (comparação por string)
      const existente = carrinho.find(item => String(item.id) === produtoId);

      if (existente) {
        // Atualiza quantidade (não permite número negativo)
        existente.quantidade = Math.max(1, Number(existente.quantidade || 0) + quantidadeToAdd);
      } else {
        // Clona o produto para não mutar o objeto recebido
        const novoProduto = {
          ...produto,
          id: produtoId,
          quantidade: quantidadeToAdd,
          preco: precoNumero
        };
        carrinho.push(novoProduto);
      }

      // Salva e notifica UI
      salvarCarrinho(carrinho);
      document.dispatchEvent(new CustomEvent('carrinho:updated', { detail: { carrinho } }));

      // Notificação não-bloqueante (sua UI pode escutar e mostrar um toast)
      window.dispatchEvent(new CustomEvent('notificacao', {
        detail: { type: 'success', message: `${produto.nome || 'Produto'} adicionado ao carrinho!` }
      }));

      return true;
    } catch (err) {
      console.error('Erro em adicionarAoCarrinho:', err);
      window.dispatchEvent(new CustomEvent('notificacao', {
        detail: { type: 'error', message: 'Não foi possível adicionar o produto.' }
      }));
      return false;
    }
  }


  // Escute o evento de produto carregado
  document.addEventListener('produto:carregado', (e) => {
    debugLog('Produto carregado via evento:', e.detail.produto);
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

      debugLog('Produto do catálogo:', produto); // Para debug
      adicionarAoCarrinho(produto);
      return;
    }

    // 2) product page - CORREÇÃO DEFINITIVA
    const btnProduct = e.target.closest('#addToCart, #addtocart, [data-addtocart]');
    if (btnProduct) {
      debugLog('Botão clicado!');

      // Tenta obter dados do produto de múltiplas formas
      let produtoData = null;

      // 1. Tenta da variável global (mais comum)
      if (window.produtoPage) {
        debugLog('Encontrado em window.produtoPage:', window.produtoPage);
        produtoData = window.produtoPage;
      }
      // 2. Tenta dos data attributes do botão
      else if (btnProduct.dataset.id) {
        debugLog('Encontrado em data attributes do botão');
        produtoData = {
          id: btnProduct.dataset.id,
          nome: btnProduct.dataset.nome || 'Produto',
          preco: btnProduct.dataset.preco || 0,
          imgPrincipal: btnProduct.dataset.imagem || ''
        };
      }
      // 3. Tenta do DOM (fallback)
      else {
        debugLog('Buscando dados do DOM...');
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
        debugLog('Dados do produto encontrados:', produtoData);

        const produto = {
          id: produtoData.id || Date.now(), // Garante um ID
          nome: produtoData.nome,
          preco: parsePriceToNumber(produtoData.preco),
          imagem: produtoData.imgPrincipal || produtoData.imagem || '',
          quantidade: 1
        };

        debugLog('Produto a ser adicionado:', produto);
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
  debugLog('carrinho-utils carregado');
  debugLog('window.produtoPage no carregamento:', window.produtoPage);

  // Verifica periodicamente se o produtoPage foi carregado
  setInterval(() => {
    if (window.produtoPage && !window.produtoPageDebug) {
      debugLog('window.produtoPage agora está disponível:', window.produtoPage);
      window.produtoPageDebug = true;
    }
  }, 1000);
})();




