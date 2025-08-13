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


//