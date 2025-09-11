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


function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  
  // Verificar se o produto já está no carrinho
  const produtoExistente = carrinho.find(item => item.nome === produto.nome);
  
  if (produtoExistente) {
    produtoExistente.quantidade += 1;
  } else {
    carrinho.push(produto);
  }
  
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  
  // Disparar evento personalizado para atualizar o contador
  const event = new CustomEvent('carrinho:updated');
  document.dispatchEvent(event);
  
  // Feedback visual (opcional)
  alert(`${produto.nome} adicionado ao carrinho!`);
}