// pedido_realizado.js
document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 1. CARREGAR DADOS DO LOCALSTORAGE
    // ----------------------------------------------------
    const dadosPessoais = JSON.parse(localStorage.getItem('dadosPessoais'));
    const dadosPagamento = JSON.parse(localStorage.getItem('dadosPagamento'));
    const carrinho = JSON.parse(localStorage.getItem('carrinho'));

    // ----------------------------------------------------
    // 2. PREENCHER INFORMAÇÕES PESSOAIS E DE PAGAMENTO
    // ----------------------------------------------------
    if (dadosPessoais) {
        document.getElementById('nome-form').textContent = dadosPessoais.nome;
        document.getElementById('email-form').textContent = dadosPessoais.email;
        document.getElementById('endereco-form').textContent = `${dadosPessoais.rua}, ${dadosPessoais.cidade}, ${dadosPessoais.cep}`;
        document.getElementById('telefone-form').textContent = dadosPessoais.telefone;
        document.getElementById('enderecoEntrega-form').textContent = `${dadosPessoais.rua}, ${dadosPessoais.cidade}, ${dadosPessoais.cep}`;
    }

    if (dadosPagamento) {
        let textoPagamento = '';
        let detalhesPagamento = '';

        if (dadosPagamento.metodo === 'credito') {
            textoPagamento = 'Cartão de Crédito';
            const numCartao = dadosPagamento.detalhes.numero;
            const ultimosDigitos = numCartao.slice(-4);
            detalhesPagamento = `**** **** **** ${ultimosDigitos}`;

            document.getElementById('validade-form').textContent = dadosPagamento.detalhes.validade;
            document.getElementById('cvv-form').textContent = dadosPagamento.detalhes.cvv;
        } else if (dadosPagamento.metodo === 'debito') {
            textoPagamento = 'Cartão de Débito';
            const numCartao = dadosPagamento.detalhes.numero;
            const ultimosDigitos = numCartao.slice(-4);
            detalhesPagamento = `**** **** **** ${ultimosDigitos}`;

            document.getElementById('validade-form').textContent = dadosPagamento.detalhes.validade;
            document.getElementById('cvv-form').textContent = dadosPagamento.detalhes.cvv;
        } else if (dadosPagamento.metodo === 'pix') {
            textoPagamento = 'PIX';
            detalhesPagamento = `Chave ${dadosPagamento.detalhes.tipo}: ${dadosPagamento.detalhes.chave}`;

            const validadeElement = document.getElementById('validade-form');
            if (validadeElement) validadeElement.parentElement.style.display = 'none';
            const cvvElement = document.getElementById('cvv-form');
            if (cvvElement) cvvElement.parentElement.style.display = 'none';
        }

        document.getElementById('pagamento-form').textContent = textoPagamento;
        document.getElementById('cartao-form').textContent = detalhesPagamento;
    }

    // ----------------------------------------------------
    // 3. PREENCHER DETALHES DO PEDIDO (CARRINHO)
    // ----------------------------------------------------
    const informacoesPedidoContainer = document.querySelector('.informacoes_pedido');
    const quantidadeItensSpan = informacoesPedidoContainer.querySelector('.quantidade-itens');
    const subtotalSpan = informacoesPedidoContainer.querySelector('.sub-total span:last-child');
    const totalSpan = informacoesPedidoContainer.querySelector('.total-pedido .preco-total');

    const primeiroDetalhePedido = informacoesPedidoContainer.querySelector('.detalhes-pedido');
    if (primeiroDetalhePedido) {
        primeiroDetalhePedido.innerHTML = '';
        informacoesPedidoContainer.insertBefore(primeiroDetalhePedido, informacoesPedidoContainer.querySelector('.subtotal-pedido'));
    }

    let totalItens = 0;
    let subtotal = 0;

    if (carrinho && carrinho.length > 0) {
        carrinho.forEach(produto => {
            const precoProduto = produto.preco * produto.quantidade;
            subtotal += precoProduto;
            totalItens += produto.quantidade;

            const produtoHTML = document.createElement('div');
            produtoHTML.classList.add('detalhes-pedido');
            produtoHTML.innerHTML = `
                <div class="imagem-produto">
                    <img src="${produto.imagem}" alt="Imagem do Produto">
                </div>
                <div class="nome_price-produto">
                    <span>${produto.nome}</span>
                    <span>Preço: <strong class="preco-produto">R$ ${precoProduto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
                </div>
                <div class="quantidade-produto">
                    <strong>Qtd: <span class="quantidade-items">${produto.quantidade}</span></strong>
                </div>
            `;
            informacoesPedidoContainer.insertBefore(produtoHTML, informacoesPedidoContainer.querySelector('.subtotal-pedido'));
        });

        quantidadeItensSpan.textContent = `(${totalItens}) ${totalItens > 1 ? 'itens' : 'item'}`;
        subtotalSpan.textContent = `R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

        const frete = 0;
        const desconto = 0;
        const totalFinal = subtotal + frete - desconto;

        totalSpan.textContent = `R$ ${totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    } else {
        quantidadeItensSpan.textContent = '(0) item';
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Nenhum produto encontrado no pedido.';
        informacoesPedidoContainer.insertBefore(emptyMessage, informacoesPedidoContainer.querySelector('.subtotal-pedido'));
        subtotalSpan.textContent = 'R$ 0,00';
        totalSpan.textContent = 'R$ 0,00';
    }

    // ----------------------------------------------------
    // 4. LÓGICA DE VALIDAÇÃO E FINALIZAÇÃO
    // ----------------------------------------------------

    const avisoPessoais = document.querySelector('.confirmacao_pessoais .aviso-erro');
    const avisoEntrega = document.querySelector('.confirmacao_entrega .aviso-erro');
    const avisoPagamento = document.querySelector('.confirmacao_pagamento .aviso-erro');

    function validarFormularioCompleto() {
        let isValid = true;

        // Validação de dados pessoais e de endereço
        const pessoaisCompletos = dadosPessoais && dadosPessoais.nome && dadosPessoais.email && dadosPessoais.telefone && dadosPessoais.rua && dadosPessoais.cidade && dadosPessoais.cep;
        if (!pessoaisCompletos) {
            if (avisoPessoais) avisoPessoais.style.display = 'block';
            if (avisoEntrega) avisoEntrega.style.display = 'block';
            isValid = false;
        } else {
            if (avisoPessoais) avisoPessoais.style.display = 'none';
            if (avisoEntrega) avisoEntrega.style.display = 'none';
        }

        // Validação de dados de pagamento
        let pagamentoCompleto = false;
        if (dadosPagamento && dadosPagamento.metodo) {
            if (dadosPagamento.metodo === 'credito' || dadosPagamento.metodo === 'debito') {
                pagamentoCompleto = dadosPagamento.detalhes && dadosPagamento.detalhes.numero && dadosPagamento.detalhes.titular && dadosPagamento.detalhes.validade && dadosPagamento.detalhes.cvv;
            } else if (dadosPagamento.metodo === 'pix') {
                pagamentoCompleto = dadosPagamento.detalhes && dadosPagamento.detalhes.tipo && dadosPagamento.detalhes.chave;
            }
        }
        if (!pagamentoCompleto) {
            if (avisoPagamento) avisoPagamento.style.display = 'block';
            isValid = false;
        } else {
            if (avisoPagamento) avisoPagamento.style.display = 'none';
        }
        
        // Validação do carrinho
        if (!carrinho || carrinho.length === 0) {
             isValid = false;
        }

        return isValid;
    }

    function verificarCompletudeDados() {
        const iconContainers = document.querySelectorAll('.icon-status');
        const pessoaisCompletos = !!(dadosPessoais && dadosPessoais.nome && dadosPessoais.email && dadosPessoais.telefone && dadosPessoais.rua && dadosPessoais.cidade && dadosPessoais.cep);
        exibirIconeStatus(iconContainers[0], pessoaisCompletos, !!dadosPessoais);

        const entregaCompleta = !!(dadosPessoais && dadosPessoais.rua && dadosPessoais.cidade && dadosPessoais.cep);
        exibirIconeStatus(iconContainers[1], entregaCompleta, !!dadosPessoais);

        let pagamentoCompleto = false;
        let pagamentoExiste = !!dadosPagamento;
        if (dadosPagamento && dadosPagamento.metodo) {
            pagamentoCompleto = dadosPagamento.metodo === 'pix' ?
                (dadosPagamento.detalhes && dadosPagamento.detalhes.tipo && dadosPagamento.detalhes.chave) :
                (dadosPagamento.detalhes && dadosPagamento.detalhes.numero && dadosPagamento.detalhes.titular && dadosPagamento.detalhes.validade && dadosPagamento.detalhes.cvv);
        }
        exibirIconeStatus(iconContainers[2], pagamentoCompleto, pagamentoExiste);
    }

    function exibirIconeStatus(container, completo, existe) {
        const icons = container.querySelectorAll('i');
        icons.forEach(icon => icon.style.display = 'none');

        if (completo) {
            container.querySelector('.bi-patch-check.success').style.display = 'inline-block';
        } else if (existe) {
            container.querySelector('.bi-patch-exclamation.warning').style.display = 'inline-block';
        } else {
            container.querySelector('.bi-patch-question.error').style.display = 'inline-block';
        }
    }

    const formConfirmacao = document.getElementById('form-confirmacao');
    const radiosConfirmacao = document.querySelectorAll('input[name="confirmacao-info"]');
    const btnFinalizar = document.getElementById('btn-finalizar');

    if (formConfirmacao) {
        formConfirmacao.addEventListener('submit', function(e) {
            e.preventDefault();
            const isFormValid = validarFormularioCompleto();

            if (isFormValid) {
                const concordou = document.getElementById('concordo').checked;
                if (concordou) {
                    alert('Compra finalizada com sucesso!');
                    localStorage.removeItem('dadosPessoais');
                    localStorage.removeItem('dadosPagamento');
                    localStorage.removeItem('carrinho');
                } else {
                    alert('Você precisa concordar com as informações para finalizar a compra.');
                }
            } else {
                alert('Por favor, preencha todas as informações necessárias para finalizar a compra.');
            }
        });
    }

    if (radiosConfirmacao && btnFinalizar) {
        radiosConfirmacao.forEach(radio => {
            radio.addEventListener('change', function() {
                btnFinalizar.disabled = this.value !== 'sim' || !validarFormularioCompleto();
            });
        });

        // Chama a validação inicial para garantir que o botão comece no estado correto
        btnFinalizar.disabled = !validarFormularioCompleto();
    }
    
    // Chama a função principal para iniciar o preenchimento e a verificação visual
    verificarCompletudeDados();

    // Chama a validação para exibir os avisos vermelhos na carga inicial da página
    validarFormularioCompleto();
});