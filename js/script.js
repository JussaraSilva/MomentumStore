// Seleciona o elemento do header
const header = document.querySelector('header');

// Define um ponto de rolagem a partir do qual a classe será adicionada (ex: 50 pixels)
// Você pode ajustar este valor conforme a altura do seu header
const scrollThreshold = 50;

// Adiciona um "ouvinte" de evento de rolagem na janela
window.addEventListener('scroll', () => {
  // window.scrollY retorna a quantidade de pixels que a página foi rolada verticalmente
  if (window.scrollY > scrollThreshold) {
    // Se a rolagem for maior que o nosso ponto definido, adiciona a classe 'scrolled'
    header.classList.add('scrolled');
  } else {
    // Se for menor (ou seja, o usuário voltou ao topo), remove a classe 'scrolled'
    header.classList.remove('scrolled');
  }
});


// Menu Ativo 

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop(); // ex: catalogo.html
  const menuItems = document.querySelectorAll('#menu-list li');

  menuItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        item.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    }
  });
});


// Menu Hamburguer
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger-btn");
  const menu = document.querySelector(".menu");

  if (hamburger && menu) {
    // Abre/fecha o menu
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation(); // evita fechar ao clicar no botão
      menu.classList.toggle("active");
    });

    // Fecha se clicar fora
    document.addEventListener("click", (e) => {
      if (menu.classList.contains("active") && !menu.contains(e.target)) {
        menu.classList.remove("active");
      }
    });
  }
});

function atualizarContadorHeader() {
  const cartCount = document.querySelector('.cart-count');
  if (!cartCount) return;

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const totalItens = carrinho.reduce((total, produto) => total + (produto.quantidade || 1), 0);
  
  cartCount.textContent = totalItens > 0 ? totalItens : '';
  cartCount.style.display = totalItens > 0 ? 'flex' : 'none';
}

// Chama a função quando o carrinho é atualizado
document.addEventListener('carrinho:updated', atualizarContadorHeader);

// Chama também quando a página carrega
document.addEventListener('DOMContentLoaded', atualizarContadorHeader);

// Exporta a função
window.atualizarContadorHeader = atualizarContadorHeader;


function configurarBotoesComprar() {
  const botoesComprar = document.querySelectorAll('.btn-comprar');
  
  botoesComprar.forEach(botao => {
    botao.addEventListener('click', (event) => {
      event.preventDefault();
      
      // Obter informações do produto do card pai
      const card = botao.closest('.produto-card');
      const nomeProduto = card.querySelector('h3').textContent;
      const precoTexto = card.querySelector('.preco').textContent;
      const preco = parseFloat(precoTexto.replace('R$ ', '').replace('.', '').replace(',', '.'));
      const imagem = card.querySelector('.img-principal').src;
      
      // Adicionar ao carrinho
      adicionarAoCarrinho({
        id: Date.now(), // ID temporário
        nome: nomeProduto,
        preco: preco,
        imagem: imagem,
        quantidade: 1
      });
      
    });
  });
}

// Chamar a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  configurarBotoesComprar();
});


// Colocar no mesmo arquivo (js/script.js)
function safeGetJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('localStorage parse failed for', key, err);
    localStorage.removeItem(key);
    return fallback;
  }
}

function salvarCarrinho(carrinho) {
  try {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    document.dispatchEvent(new CustomEvent('carrinho:updated', { detail: { carrinho } }));
  } catch (e) {
    console.error('Erro ao salvar carrinho', e);
  }
}

function adicionarAoCarrinho(produto, usarAlert = false) {
  try {
    if (!produto) throw new Error('Produto inválido');

    // Garante ID único (uso preferencial: produto.id)
    const produtoId = produto.id ? String(produto.id) : String(Date.now());

    // Quantidade coerente (>=1)
    const quantidadeToAdd = Math.max(1, Number(produto.quantidade) || 1);

    // Preço numérico básico (se vier string com R$, tenta limpar)
    let precoNumero = 0;
    if (typeof produto.preco === 'number') precoNumero = produto.preco;
    else if (typeof produto.preco === 'string') {
      precoNumero = Number(String(produto.preco).replace(/[^\d,.-]/g,'').replace(',', '.')) || 0;
    } else {
      precoNumero = Number(produto.price) || 0;
    }

    // Pega carrinho de forma segura
    const carrinho = safeGetJSON('carrinho', []);

    // Procura por ID (não por nome)
    const existente = carrinho.find(item => String(item.id) === produtoId);

    if (existente) {
      existente.quantidade = Math.max(1, Number(existente.quantidade || 0) + quantidadeToAdd);
    } else {
      // não muta o objeto original — cria novo registro
      const novoItem = {
        ...produto,
        id: produtoId,
        quantidade: quantidadeToAdd,
        preco: precoNumero
      };
      carrinho.push(novoItem);
    }

    // salvar e notificar
    salvarCarrinho(carrinho);

    // evento de notificação (melhor que alert)
    window.dispatchEvent(new CustomEvent('notificacao', {
      detail: { type: 'success', message: `${produto.nome || 'Produto'} adicionado ao carrinho!` }
    }));

    // fallback: alert (opcional)
    if (usarAlert) alert(`${produto.nome || 'Produto'} adicionado ao carrinho!`);

    return true;
  } catch (err) {
    console.error('Erro ao adicionar ao carrinho:', err);
    window.dispatchEvent(new CustomEvent('notificacao', {
      detail: { type: 'error', message: 'Não foi possível adicionar o produto.' }
    }));
    return false;
  }
}
