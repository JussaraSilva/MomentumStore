// carrinho.js
function inicializarCarrinho() {
  const itensContainer = document.querySelector(".itens-container");
  const carrinhoVazioMsg = document.querySelector(".carrinho-vazio");
  const barratitulos = document.querySelector(".barratitulos-carrinho");
  const resumoSubtotal = document.getElementById("preco-subtotal");
  const resumoTotal = document.getElementById("preco-total");

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    document.dispatchEvent(new CustomEvent('carrinho:updated', { detail: { carrinho } }));
  }

  function renderCarrinho() {
    if (!itensContainer || !carrinhoVazioMsg || !barratitulos) {
      console.error('Elementos não encontrados:', {
        itensContainer, 
        carrinhoVazioMsg, 
        barratitulos
      });
      return;
    }
    
    itensContainer.innerHTML = ""; // limpa apenas os itens
    let subtotal = 0;

    if (carrinho.length === 0) {
      // Carrinho vazio: mostra mensagem, esconde barra de títulos
      carrinhoVazioMsg.style.display = "block";
      barratitulos.style.display = "none";
      resumoSubtotal.textContent = "R$ 0,00";
      resumoTotal.textContent = "R$ 0,00";
      return;
    }

    // Carrinho com produtos: esconde mensagem, mostra barra de títulos
    carrinhoVazioMsg.style.display = "none";
    barratitulos.style.display = "grid";

    carrinho.forEach((produto, index) => {
      subtotal += produto.preco * produto.quantidade;

      const item = document.createElement("div");
      item.classList.add("item-carrinho");

      item.innerHTML = `
        <div class="info-produto">
          <div class="imagem-item">
            <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/100x100?text=Imagem+Indisponível'">
          </div>

          <div class="details-produto">
            <div class="nome-item">
              <a>${produto.nome}</a>
            </div>
          </div>
        </div>

        
            <div class="preco-item">
              <span class="preco-labelMobile">Preço: </span>
              <span>R$${produto.preco.toLocaleString("pt-BR", {minimumFractionDigits: 2})}</span>
            </div>

            <div class="quantidade-item">
              <div class="quantidade-seletor">
                <div class="quantidade-input">
                  <button class="aumentar-item">+</button>
                  <input type="number" class="quantity" value="${produto.quantidade}" min="1">
                  <button class="diminuir-item">-</button>
                </div>
              </div>
            </div>

              <div class="subtotal-produto">
                <span class="subtotal-labelMobile">Subtotal: </span>
                <span class="no-wrap">R$ ${(produto.preco * produto.quantidade).toLocaleString("pt-BR", {minimumFractionDigits: 2})}</span>
              </div>
        

        <div class="excluir-item">
          <i class="bi bi-trash3-fill"></i>
        </div>
      `;

      // Eventos de quantidade
      const inputQt = item.querySelector('input[type="number"]');
      item.querySelector(".aumentar-item").addEventListener("click", () => {
        produto.quantidade++;
        inputQt.value = produto.quantidade;
        salvarCarrinho();
        renderCarrinho();
      });

      item.querySelector(".diminuir-item").addEventListener("click", () => {
        if (produto.quantidade > 1) produto.quantidade--;
        inputQt.value = produto.quantidade;
        salvarCarrinho();
        renderCarrinho();
      });

      inputQt.addEventListener("change", (e) => {
        const newValue = Math.max(1, parseInt(e.target.value) || 1);
        produto.quantidade = newValue;
        inputQt.value = newValue;
        salvarCarrinho();
        renderCarrinho();
      });

      item.querySelector(".excluir-item").addEventListener("click", () => {
        carrinho.splice(index, 1);
        salvarCarrinho();
        renderCarrinho();
      });

      itensContainer.appendChild(item);
    });

    // Atualiza resumo
    resumoSubtotal.textContent = `R$ ${subtotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})}`;
    resumoTotal.textContent = `R$ ${subtotal.toLocaleString("pt-BR", {minimumFractionDigits: 2})}`;
  }

  // Renderiza o carrinho quando a página carrega
  renderCarrinho();

  // Escuta por atualizações
  document.addEventListener('carrinho:updated', (e) => {
    carrinho = e.detail.carrinho || JSON.parse(localStorage.getItem("carrinho")) || [];
    renderCarrinho();
  });
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarCarrinho);
} else {
  inicializarCarrinho();
}