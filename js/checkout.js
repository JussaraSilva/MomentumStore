document.addEventListener('DOMContentLoaded', function () {
    // -------------------------
    // 1) PAGAMENTO
    // -------------------------
    const paymentMethods = document.querySelectorAll('.payment-method input[name="payment-method"]');
    const paymentMethodContainers = document.querySelectorAll('.payment-method');
    const paymentFields = document.querySelectorAll('.payment-fields');
    const creditCardNumberInput = document.getElementById('credito-numero');
    const creditCardBrandSelect = document.getElementById('credito-bandeira');
    const pixTipoSelect = document.getElementById('pix-tipo');
    const pixChaveContainer = document.getElementById('pix-chave-container');
    const pixChaveInput = document.getElementById('pix-chave');
    const creditCardValidity = document.getElementById('credito-validade');
    const creditCardCvv = document.getElementById('credito-cvv');
    const telefoneInput = document.getElementById('telefone');

    function togglePaymentFields() {
        paymentFields.forEach(field => field.style.display = 'none');
        const checkedInput = document.querySelector('.payment-method input[name="payment-method"]:checked');
        if (checkedInput) {
            const fieldsToShow = document.getElementById(checkedInput.value + '-fields');
            if (fieldsToShow) fieldsToShow.style.display = 'block';
        }
    }

    paymentMethods.forEach(input => input.addEventListener('change', togglePaymentFields));
    paymentMethodContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            const radioInput = this.querySelector('input[type="radio"]');
            if (radioInput && e.target !== radioInput) {
                radioInput.checked = true;
                togglePaymentFields();
            }
        });
    });

    togglePaymentFields();

    if (creditCardNumberInput && creditCardBrandSelect && typeof cardValidator !== 'undefined') {
        creditCardNumberInput.addEventListener('input', function () {
            const cardNumber = this.value.replace(/\D/g, '');
            const cardInfo = cardValidator.number(cardNumber);
            creditCardBrandSelect.value = cardInfo.card ? cardInfo.card.type : '';
        });
    }

    if (creditCardNumberInput) {
        creditCardNumberInput.addEventListener('input', function (e) {
            const cleanValue = e.target.value.replace(/\s/g, '').slice(0, 16);
            e.target.value = cleanValue.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    if (creditCardValidity) {
        creditCardValidity.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
            e.target.value = value;
        });
    }

    if (creditCardCvv) {
        creditCardCvv.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value.substring(0, 4);
        });
    }

    if (pixTipoSelect && pixChaveInput) {
        pixTipoSelect.addEventListener('change', function () {
            pixChaveInput.value = '';
            const tipo = this.value;
            if (tipo === 'cpf') {
                pixChaveInput.placeholder = '000.000.000-00';
                pixChaveInput.maxLength = 14;
            } else if (tipo === 'telefone') {
                pixChaveInput.placeholder = '(00) 00000-0000';
                pixChaveInput.maxLength = 15;
            } else if (tipo === 'email') {
                pixChaveInput.placeholder = 'exemplo@email.com';
                pixChaveInput.maxLength = 50;
            } else if (tipo === 'aleatoria') {
                pixChaveInput.placeholder = 'Chave Pix Aleatória';
                pixChaveInput.maxLength = 36;
            } else {
                pixChaveInput.placeholder = 'Informe sua chave Pix';
                pixChaveInput.maxLength = 255;
            }
        });
    }

    if (pixChaveInput && pixTipoSelect) {
        pixChaveInput.addEventListener('input', function (e) {
            const tipo = pixTipoSelect.value;
            let value = e.target.value.replace(/\D/g, '');
            if (tipo === 'cpf') {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else if (tipo === 'telefone') {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }

    // -------------------------
    // 2) RESUMO DO CARRINHO
    // -------------------------
    const resumoContainer = document.getElementById('resumo-checkout');
    const resumoSubtotal = document.getElementById('resumo-subtotal');
    const resumoTotal = document.getElementById('resumo-total');
    const resumoFrete = document.getElementById('resumo-frete');
    const resumoDesconto = document.getElementById('resumo-desconto');

    function renderResumoCheckout() {
        const carrinho = window.carrinhoUtils?.obterCarrinho() || [];
        resumoContainer.innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let frete = 0;

        if (carrinho.length === 0) {
            resumoContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        }

        carrinho.forEach(produto => {
            const itemSubtotal = produto.preco * produto.quantidade;
            subtotal += itemSubtotal;
            const item = document.createElement('div');
            item.classList.add('resumo-item');
            item.innerHTML = `
                <div class="header-produto">
                    <div class="item-image"><img src="${produto.imagem}" alt="${produto.nome}"></div>
                    <div class="item-details">
                        <h3 class="item-name">${produto.nome}</h3>
                        <div class="item-quantity">Qtd: ${produto.quantidade}</div>
                        <div class="item-subtotal">R$ ${itemSubtotal.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>
                    </div>
                </div>
            `;
            resumoContainer.appendChild(item);
        });

        resumoSubtotal.textContent = `R$ ${subtotal.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
        resumoFrete.textContent = `R$ ${frete.toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
        resumoTotal.textContent = `R$ ${(subtotal + frete - desconto).toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
    }

    renderResumoCheckout();
    document.addEventListener('carrinho:updated', renderResumoCheckout);

    // -------------------------
    // 3) SALVAR DADOS DO FORMULÁRIO NO LOCALSTORAGE
    // -------------------------
    
    // Função para salvar os dados do formulário
    function salvarDadosFormulario() {
        // Coletar dados de informações pessoais
        const dadosPessoais = {
            nome: document.getElementById('name').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('phone').value,
            rua: document.getElementById('rua').value,
            cidade: document.getElementById('cidade').value,
            cep: document.getElementById('cep').value
        };
        
        // Coletar método de pagamento selecionado
        const metodoPagamento = document.querySelector('input[name="payment-method"]:checked');
        
        let dadosPagamento = {};
        
        if (metodoPagamento) {
            dadosPagamento.metodo = metodoPagamento.value;
            
            // Coletar dados específicos do método de pagamento
            if (metodoPagamento.value === 'credito') {
                dadosPagamento.detalhes = {
                    numero: document.getElementById('credito-numero').value,
                    bandeira: document.getElementById('credito-bandeira').value,
                    titular: document.getElementById('credito-titular').value,
                    validade: document.getElementById('credito-validade').value,
                    cvv: document.getElementById('credito-cvv').value,
                    parcelas: document.getElementById('credito-parcelas').value
                };
            } else if (metodoPagamento.value === 'debito') {
                dadosPagamento.detalhes = {
                    numero: document.getElementById('debito-numero').value,
                    titular: document.getElementById('debito-titular').value,
                    validade: document.getElementById('debito-validade').value,
                    cvv: document.getElementById('debito-cvv').value,
                    banco: document.getElementById('debito-banco').value
                };
            } else if (metodoPagamento.value === 'pix') {
                dadosPagamento.detalhes = {
                    tipo: document.getElementById('pix-tipo').value,
                    chave: document.getElementById('pix-chave').value
                };
            }
        }
        
        // Salvar dados no localStorage
        localStorage.setItem('dadosPessoais', JSON.stringify(dadosPessoais));
        localStorage.setItem('dadosPagamento', JSON.stringify(dadosPagamento));
        
        console.log('Dados salvos no localStorage:', { dadosPessoais, dadosPagamento });
        
        return true;
    }
    
    // Adicionar evento de submit ao formulário
    const formCheckout = document.querySelector('.checkout-info');
    if (formCheckout) {
        formCheckout.addEventListener('submit', function(e) {
            e.preventDefault();
            if (salvarDadosFormulario()) {
                // Se os dados foram salvos com sucesso, prosseguir com o fluxo
                alert('Informações salvas com sucesso!');
            }
        });
    }

    // -------------------------
    // 4) BOTÃO FINALIZAR COMPRA
    // -------------------------
    function btnFinalizarCompra() {
        const btnFinalizar = document.getElementById('btn-finalizarCompra');
        
        // Verifica se o botão existe antes de adicionar o event listener
        if (!btnFinalizar) {
            console.error("Botão 'btn-finalizarCompra' não encontrado!");
            return;
        }

        btnFinalizar.addEventListener('click', function (e) {
            e.preventDefault(); // Previne comportamento padrão (útil se estiver em um form)
            
            // Primeiro salva os dados do formulário
            if (!salvarDadosFormulario()) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Obtém o carrinho ATUALIZADO no momento do clique
            const carrinho = window.carrinhoUtils?.obterCarrinho() || [];
            
            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio.');
                return;
            }

            // Salva também os dados do carrinho no localStorage
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            
            // Redireciona para a página de sucesso
            window.location.href = "pedido_realizado.html";
        });
    }

    // EXECUTA a função para configurar o clique do botão
    btnFinalizarCompra();

});