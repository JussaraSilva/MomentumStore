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


