document.addEventListener("DOMContentLoaded", function () {
  // -------------------------
  // 1) PAGAMENTO
  // -------------------------
  const paymentMethods = document.querySelectorAll(
    '.payment-method input[name="payment-method"]'
  );
  const paymentMethodContainers = document.querySelectorAll(".payment-method");
  const paymentFields = document.querySelectorAll(".payment-fields");
  const creditCardNumberInput = document.getElementById("credito-numero");
  const creditCardBrandSelect = document.getElementById("credito-bandeira");
  const pixTipoSelect = document.getElementById("pix-tipo");
  const pixChaveContainer = document.getElementById("pix-chave-container");
  const pixChaveInput = document.getElementById("pix-chave");
  const creditCardValidity = document.getElementById("credito-validade");
  const creditCardCvv = document.getElementById("credito-cvv");
  const telefoneInput = document.getElementById("telefone");

  function togglePaymentFields() {
    paymentFields.forEach((field) => (field.style.display = "none"));
    const checkedInput = document.querySelector(
      '.payment-method input[name="payment-method"]:checked'
    );
    if (checkedInput) {
      const fieldsToShow = document.getElementById(
        checkedInput.value + "-fields"
      );
      if (fieldsToShow) fieldsToShow.style.display = "block";
    }
  }

  paymentMethods.forEach((input) =>
    input.addEventListener("change", togglePaymentFields)
  );
  paymentMethodContainers.forEach((container) => {
    container.addEventListener("click", function (e) {
      const radioInput = this.querySelector('input[type="radio"]');
      if (radioInput && e.target !== radioInput) {
        radioInput.checked = true;
        togglePaymentFields();
      }
    });
  });

  togglePaymentFields();

  if (
    creditCardNumberInput &&
    creditCardBrandSelect &&
    typeof cardValidator !== "undefined"
  ) {
    creditCardNumberInput.addEventListener("input", function () {
      const cardNumber = this.value.replace(/\D/g, "");
      const cardInfo = cardValidator.number(cardNumber);
      creditCardBrandSelect.value = cardInfo.card ? cardInfo.card.type : "";
    });
  }

  if (creditCardNumberInput) {
    creditCardNumberInput.addEventListener("input", function (e) {
      const cleanValue = e.target.value.replace(/\s/g, "").slice(0, 16);
      e.target.value = cleanValue.replace(/(.{4})/g, "$1 ").trim();
    });
  }

  if (creditCardValidity) {
    creditCardValidity.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 2)
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      e.target.value = value;
    });
  }

  if (creditCardCvv) {
    creditCardCvv.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      e.target.value = value.substring(0, 4);
    });
  }

  if (pixTipoSelect && pixChaveInput) {
    pixTipoSelect.addEventListener("change", function () {
      pixChaveInput.value = "";
      const tipo = this.value;
      if (tipo === "cpf") {
        pixChaveInput.placeholder = "000.000.000-00";
        pixChaveInput.maxLength = 14;
      } else if (tipo === "telefone") {
        pixChaveInput.placeholder = "(00) 00000-0000";
        pixChaveInput.maxLength = 15;
      } else if (tipo === "email") {
        pixChaveInput.placeholder = "exemplo@email.com";
        pixChaveInput.maxLength = 50;
      } else if (tipo === "aleatoria") {
        pixChaveInput.placeholder = "Chave Pix Aleatória";
        pixChaveInput.maxLength = 36;
      } else {
        pixChaveInput.placeholder = "Informe sua chave Pix";
        pixChaveInput.maxLength = 255;
      }
    });

    pixChaveInput.addEventListener("input", function (e) {
      const tipo = pixTipoSelect.value;
      let value = e.target.value;
      if (tipo === "cpf") {
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else if (tipo === "telefone") {
        value = value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
      }
      e.target.value = value;
    });
  }

  if (telefoneInput) {
    telefoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      e.target.value = value;
    });
  }

  // -------------------------
  // 2) RESUMO DO CARRINHO (FUNÇÃO FALTANTE)
  // -------------------------
  const resumoContainer = document.getElementById("resumo-checkout");
  const resumoSubtotal = document.getElementById("resumo-subtotal");
  const resumoTotal = document.getElementById("resumo-total");
  const resumoFrete = document.getElementById("resumo-frete");
  const resumoDesconto = document.getElementById("resumo-desconto");

  // Função para formatar valores monetários corretamente
  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2
    });
  }

  function renderResumoCheckout() {
    // Obtém o carrinho do localStorage
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    resumoContainer.innerHTML = '';
    let subtotal = 0;
    let desconto = 0;
    let frete = 0;

    if (carrinho.length === 0) {
      resumoContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
      return;
    }

    carrinho.forEach(produto => {
      // Garante que temos os campos necessários
      const preco = produto.preco || produto.price || 0;
      const quantidade = produto.quantidade || produto.quantity || 1;
      const itemSubtotal = preco * quantidade;
      subtotal += itemSubtotal;
      
      const item = document.createElement('div');
      item.classList.add('resumo-item');
      item.innerHTML = `
        <div class="header-produto">
          <div class="item-image">
            ${produto.imagem ? `<img src="${produto.imagem}" alt="${produto.nome}">` : ''}
          </div>
          <div class="item-details">
            <h3 class="item-name">${produto.nome || 'Produto sem nome'}</h3>
            <div class="item-quantity">Qtd: ${quantidade}</div>
            <div class="item-subtotal">${formatarMoeda(itemSubtotal)}</div>
          </div>
        </div>
      `;
      resumoContainer.appendChild(item);
    });

    // Atualiza totais
    resumoSubtotal.textContent = formatarMoeda(subtotal);
    resumoFrete.textContent = formatarMoeda(frete);
    resumoTotal.textContent = formatarMoeda(subtotal + frete - desconto);
    
    // Atualiza também o resumo final na etapa 4
    const resumoFinal = document.getElementById("resumo-itens-revisao");
    const resumoSubtotalFinal = document.getElementById("resumo-subtotal-final");
    const resumoFreteFinal = document.getElementById("resumo-frete-final");
    const resumoTotalFinal = document.getElementById("resumo-total-final");
    
    if (resumoFinal) {
      resumoFinal.innerHTML = carrinho.map(produto => {
        const preco = produto.preco || produto.price || 0;
        const quantidade = produto.quantidade || produto.quantity || 1;
        const itemSubtotal = preco * quantidade;
        return `<div>${produto.nome} - ${quantidade}x ${formatarMoeda(preco)} = ${formatarMoeda(itemSubtotal)}</div>`;
      }).join('');
    }
    
    if (resumoSubtotalFinal) resumoSubtotalFinal.textContent = formatarMoeda(subtotal);
    if (resumoFreteFinal) resumoFreteFinal.textContent = formatarMoeda(frete);
    if (resumoTotalFinal) resumoTotalFinal.textContent = formatarMoeda(subtotal + frete - desconto);
  }

  // Executa a função para carregar o resumo
  renderResumoCheckout();

  // -------------------------
  // 3) SALVAR DADOS DO FORMULÁRIO
  // -------------------------
  function salvarDadosFormulario() {
    const dadosPessoais = {
      nome: document.getElementById("name").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("phone").value,
      rua: document.getElementById("rua").value,
      cidade: document.getElementById("cidade").value,
      cep: document.getElementById("cep").value,
    };

    const metodoPagamento = document.querySelector(
      'input[name="payment-method"]:checked'
    );
    let dadosPagamento = {};
    if (metodoPagamento) {
      dadosPagamento.metodo = metodoPagamento.value;
      if (metodoPagamento.value === "credito") {
        dadosPagamento.detalhes = {
          numero: document.getElementById("credito-numero").value,
          bandeira: document.getElementById("credito-bandeira").value,
          titular: document.getElementById("credito-titular").value,
          validade: document.getElementById("credito-validade").value,
          cvv: document.getElementById("credito-cvv").value,
          parcelas: document.getElementById("credito-parcelas").value,
        };
      } else if (metodoPagamento.value === "debito") {
        dadosPagamento.detalhes = {
          numero: document.getElementById("debito-numero").value,
          titular: document.getElementById("debito-titular").value,
          validade: document.getElementById("debito-validade").value,
          cvv: document.getElementById("debito-cvv").value,
          banco: document.getElementById("debito-banco").value,
        };
      } else if (metodoPagamento.value === "pix") {
        dadosPagamento.detalhes = {
          tipo: document.getElementById("pix-tipo").value,
          chave: document.getElementById("pix-chave").value,
        };
      }
    }
    localStorage.setItem("dadosPessoais", JSON.stringify(dadosPessoais));
    localStorage.setItem("dadosPagamento", JSON.stringify(dadosPagamento));
    return true;
  }

  // -------------------------
  // 4) WIZARD DE ETAPAS
  // -------------------------
  (function () {
    const steps = Array.from(document.querySelectorAll(".checkout-step"));
    const totalSteps = steps.length;
    const fillBar = document.getElementById("wizard-fill");
    const btnNext = document.getElementById("next-step");
    const btnPrev = document.getElementById("prev-step");
    const btnFinalizar = document.getElementById("btn-finalizar-compra");

    let current = 1;

    function showStep(n) {
      salvarDadosFormulario(); // <-- salva a cada troca
      current = Math.max(1, Math.min(totalSteps, n));
      steps.forEach((s) => s.classList.remove("active"));
      const active = document.querySelector(
        '.checkout-step[data-step="' + current + '"]'
      );
      if (active) active.classList.add("active");

      const pct = Math.round((current / totalSteps) * 100);
      if (fillBar) fillBar.style.width = pct + "%";

      btnPrev.style.display = current === 1 ? "none" : "inline-block";
      btnNext.style.display = current === totalSteps ? "none" : "inline-block";
      btnFinalizar.style.display =
        current === totalSteps ? "inline-block" : "none";
        
      // Atualiza o resumo quando chegar na etapa 4
      if (current === 4) {
        renderResumoCheckout();
      }
    }

    btnNext && btnNext.addEventListener("click", () => showStep(current + 1));
    btnPrev && btnPrev.addEventListener("click", () => showStep(current - 1));

    btnFinalizar &&
    btnFinalizar.addEventListener("click", () => {
    if (!salvarDadosFormulario()) return;

    // Verifica se o usuário concordou com os termos
    const concordo = document.querySelector('input[name="concordo"]:checked');
    if (!concordo || concordo.value !== 'sim') {
      alert('Você precisa concordar com os termos para finalizar a compra.');
      return;
    }

    // Pega os itens do carrinho antes de limpar
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const dadosPessoais = JSON.parse(localStorage.getItem("dadosPessoais"));
    const dadosPagamento = JSON.parse(localStorage.getItem("dadosPagamento"));

    // Cria a mensagem de confirmação substituindo todo o conteúdo da página
    const mainElement = document.querySelector("main");

    // HTML gerado agora usa classes, sem estilos inline
    let resumoHtml = `
      <div class="container-checkout">
        <div class="pedido-finalizado">
          <h2 class="titulo-finalizado">🎉 Pedido realizado com sucesso!</h2>
          <p class="texto-agradecimento">Obrigado por comprar conosco. Seu pedido:</p>
          <div class="bloco-resumo">
            <h3 class="subtitulo-resumo">Resumo do Pedido</h3>
            <ul class="lista-itens-resumo">
    `;

    let total = 0;
    carrinho.forEach((item) => {
      const preco = item.preco || item.price || 0;
      const quantidade = item.quantidade || item.quantity || 1;
      const subtotal = preco * quantidade;
      resumoHtml += `
        <li class="item-resumo">
          <strong>${item.nome}</strong> - ${quantidade}x ${formatarMoeda(preco)} = ${formatarMoeda(subtotal)}
        </li>
      `;
      total += subtotal;
    });

    resumoHtml += `
            </ul>
            <div class="total-resumo-valor">
              <strong>Total: ${formatarMoeda(total)}</strong>
            </div>
          </div>
          
          <div class="bloco-resumo">
            <h3 class="subtitulo-resumo">Informações de Entrega</h3>
            <p><strong>Endereço:</strong> ${dadosPessoais.rua}, ${dadosPessoais.cidade} - CEP: ${dadosPessoais.cep}</p>
            <p><strong>Contato:</strong> ${dadosPessoais.telefone}</p>
          </div>
          
          <div class="bloco-resumo">
            <h3 class="subtitulo-resumo">Forma de Pagamento</h3>
            <p><strong>Método:</strong> ${dadosPagamento.metodo}</p>
            
            ${dadosPagamento.metodo === 'credito' ? `
              <p><strong>Cartão:</strong> ${dadosPagamento.detalhes.bandeira} terminando em ${dadosPagamento.detalhes.numero.slice(-4)}</p>
              <p><strong>Parcelas:</strong> ${dadosPagamento.detalhes.parcelas}x</p>
            ` : ''}
            
            ${dadosPagamento.metodo === 'pix' ? `
              <p><strong>Tipo de chave:</strong> ${dadosPagamento.detalhes.tipo}</p>
            ` : ''}
          </div>
          
          <p class="email-confirmacao">Um e-mail de confirmação foi enviado para <strong>${dadosPessoais.email}</strong></p>
          
          <a href="../index.html" class="btn-voltar-loja">Voltar para a Loja</a>
        </div>
      </div>
    `;

    // Substitui todo o conteúdo do main
    mainElement.innerHTML = resumoHtml;

    // Limpa carrinho
    localStorage.removeItem("carrinho");
  });

    showStep(1);
  })();

  // Função para controlar o select customizado
function setupCustomSelects() {
    const customSelects = document.querySelectorAll(".custom-select-container");

    customSelects.forEach(container => {
        const selectedDiv = container.querySelector(".select-selected");
        const itemsList = container.querySelector(".select-items");
        const hiddenSelect = container.nextElementSibling; // Pega o <select> oculto

        selectedDiv.addEventListener("click", function(e) {
            e.stopPropagation();
            closeAllSelects(this);
            itemsList.classList.toggle("select-hide");
        });

        itemsList.querySelectorAll("li").forEach(item => {
            item.addEventListener("click", function(e) {
                // Atualiza o texto da div e o valor do select nativo
                const selectedValue = this.getAttribute("data-value");
                selectedDiv.innerHTML = this.innerHTML;
                hiddenSelect.value = selectedValue;

                // Esconde a lista
                itemsList.classList.add("select-hide");
            });
        });

        // Fechar o menu quando o usuário clica fora
        document.addEventListener("click", closeAllSelects);

        function closeAllSelects(element) {
            const arrNo = [];
            document.querySelectorAll(".select-items").forEach(item => {
                if (element != item && element != selectedDiv) {
                    item.classList.add("select-hide");
                }
            });
        }
    });
}

// Chame a função quando a página carregar
window.addEventListener('DOMContentLoaded', setupCustomSelects);
});