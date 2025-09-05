// chamada das funções no dom load
window.addEventListener("load", () => {
  setupCarrinho();
  calcSubtotal();
});

function setupCarrinho() {
  // Configura os eventos para todos os itens do carrinho
  document.querySelectorAll(".item-carrinho").forEach(item => {
    const btnAumentar = item.querySelector(".aumentar-item");
    const btnDiminuir = item.querySelector(".diminuir-item");
    const input = item.querySelector(".quantity");
    const btnExcluir = item.querySelector(".excluir-item");

    // Verifica se os elementos existem antes de adicionar eventos
    if (btnAumentar && input) {
      btnAumentar.addEventListener("click", () => {
        let quantidade = parseInt(input.value) || 1;
        quantidade++;
        input.value = quantidade;
        calcSubtotalItem(item);
      });
    }

    if (btnDiminuir && input) {
      btnDiminuir.addEventListener("click", () => {
        let quantidade = parseInt(input.value) || 1;
        if (quantidade > 1) {
          quantidade--;
          input.value = quantidade;
          calcSubtotalItem(item);
        }
      });
    }

    if (input) {
      input.addEventListener("input", () => {
        let valor = parseInt(input.value) || 1;
        if (valor < 1) {
          input.value = 1;
          valor = 1;
        }
        calcSubtotalItem(item);
      });
    }

    if (btnExcluir) {
      btnExcluir.addEventListener("click", () => {
        item.remove();
        // Aqui você pode adicionar o cálculo do total geral depois
      });
    }
  });
}

// Função para calcular subtotal de um item específico
function calcSubtotalItem(item) {
  try {
    const precoElement = item.querySelector(".preco-item span");
    const quantityInput = item.querySelector(".quantity");
    const subtotalElement = item.querySelector(".subtotal-produto span");

    if (precoElement && quantityInput && subtotalElement) {
      let precoTexto = precoElement.textContent;
      let preco = parseFloat(
        precoTexto.replace("R$", "")
          .replace(/\./g, "")
          .replace(",", ".")
          .trim()
      );
      
      let quantity = parseInt(quantityInput.value) || 1;
      let subtotal = preco * quantity;
      
      subtotalElement.textContent = subtotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }
  } catch (error) {
    console.error("Erro ao calcular subtotal do item:", error);
  }
}

// Função para calcular todos os subtotais (usada no load)
function calcSubtotal() {
  document.querySelectorAll(".item-carrinho").forEach(item => {
    calcSubtotalItem(item);
  });
}

console.log("Itens no carrinho:", document.querySelectorAll(".item-carrinho").length);
document.querySelectorAll(".item-carrinho").forEach((item, index) => {
  console.log(`Item ${index}:`, {
    aumentar: item.querySelector(".aumentar-item"),
    diminuir: item.querySelector(".diminuir-item"),
    input: item.querySelector(".quantity"),
    excluir: item.querySelector(".excluir-item")
  });
});
