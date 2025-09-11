document.addEventListener('DOMContentLoaded', function () {
    // -------------------------
    // 1) PREENCHER DADOS DO PEDIDO REALIZADO
    // -------------------------
    function preencherDadosAgradecimento() {
        // Recuperar dados do localStorage
        const dadosPessoais = JSON.parse(localStorage.getItem('dadosPessoais') || '{}');
        const dadosPagamento = JSON.parse(localStorage.getItem('dadosPagamento') || '{}');
        const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
        
        // 1. Preencher nome no título
        const nomeTitulo = document.getElementById('form-name');
        if (nomeTitulo && dadosPessoais.nome) {
            nomeTitulo.textContent = dadosPessoais.nome;
        }
        
        // 2. Preencher informações pessoais
        const nomeForm = document.getElementById('nome-form');
        const emailForm = document.getElementById('email-form');
        const enderecoForm = document.getElementById('endereco-form');
        const telefoneForm = document.getElementById('telefone-form');
        
        if (nomeForm && dadosPessoais.nome) nomeForm.textContent = dadosPessoais.nome;
        if (emailForm && dadosPessoais.email) emailForm.textContent = dadosPessoais.email;
        if (enderecoForm && dadosPessoais.rua && dadosPessoais.cidade) {
            enderecoForm.textContent = `${dadosPessoais.rua}, ${dadosPessoais.cidade}, CEP: ${dadosPessoais.cep || ''}`;
        }
        if (telefoneForm && dadosPessoais.telefone) telefoneForm.textContent = dadosPessoais.telefone;
        
        // 3. Preencher informações de pagamento
        const pagamentoForm = document.getElementById('pagamento-form');
        const cartaoForm = document.getElementById('cartao-form');
        const validadeForm = document.getElementById('validade-form');
        const cvvForm = document.getElementById('cvv-form');
        
        if (pagamentoForm && dadosPagamento.metodo) {
            let metodoTexto = '';
            switch(dadosPagamento.metodo) {
                case 'credito': metodoTexto = 'Cartão de Crédito'; break;
                case 'debito': metodoTexto = 'Cartão de Débito'; break;
                case 'pix': metodoTexto = 'PIX'; break;
                default: metodoTexto = dadosPagamento.metodo;
            }
            pagamentoForm.textContent = metodoTexto;
        }
        
        if (dadosPagamento.detalhes) {
            if (cartaoForm && dadosPagamento.detalhes.numero) {
                cartaoForm.textContent = `Número: ${dadosPagamento.detalhes.numero}`;
            }
            if (validadeForm && dadosPagamento.detalhes.validade) {
                validadeForm.textContent = `Validade: ${dadosPagamento.detalhes.validade}`;
            }
            if (cvvForm && dadosPagamento.detalhes.cvv) {
                cvvForm.textContent = `CVV: ${dadosPagamento.detalhes.cvv}`;
            }
        }
        
        // 4. Preencher informações do carrinho
        preencherResumoPedido(carrinho);
        
        // 5. Verificar se todos os dados estão preenchidos e mostrar ícones de status
        verificarStatusDados(dadosPessoais, dadosPagamento);
    }
    
    // -------------------------
    // 2) PREENCHER RESUMO DO PEDIDO
    // -------------------------
    function preencherResumoPedido(carrinho) {
        const quantidadeItens = document.querySelector('.quantidade-itens');
        const quantidadeItems = document.querySelector('.quantidade-items');
        const precoProduto = document.querySelector('.preco-produto');
        const precoTotal = document.querySelector('.preco-total');
        const subtotalSpan = document.querySelector('.sub-total span:last-child');
        const freteSpan = document.querySelector('.frete span:last-child');
        const detalhesPedido = document.querySelector('.detalhes-pedido');
        
        if (carrinho.length === 0) return;
        
        const primeiroProduto = carrinho[0];
        const subtotal = carrinho.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
        const totalItens = carrinho.reduce((total, produto) => total + produto.quantidade, 0);
        
        // Atualizar quantidades
        if (quantidadeItens) quantidadeItens.textContent = `(${totalItens}) ${totalItens === 1 ? 'item' : 'itens'}`;
        if (quantidadeItems) quantidadeItems.textContent = primeiroProduto.quantidade;
        
        // Atualizar preços
        if (precoProduto) precoProduto.textContent = `R$ ${primeiroProduto.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        if (precoTotal) precoTotal.textContent = `R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        if (subtotalSpan) subtotalSpan.textContent = `R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        if (freteSpan) freteSpan.textContent = 'R$ 0,00';
        
        // Atualizar imagem e nome do produto
        const imagemProduto = detalhesPedido.querySelector('.imagem-produto img');
        const nomeProduto = detalhesPedido.querySelector('.nome_price-produto span:first-child');
        
        if (imagemProduto && primeiroProduto.imagem) {
            imagemProduto.src = primeiroProduto.imagem;
            imagemProduto.alt = primeiroProduto.nome;
        }
        
        if (nomeProduto && primeiroProduto.nome) {
            nomeProduto.textContent = primeiroProduto.nome;
        }
    }
    
    // -------------------------
    // 3) VERIFICAR STATUS DOS DADOS
    // -------------------------
    function verificarStatusDados(dadosPessoais, dadosPagamento) {
        const containers = [
            { element: document.querySelector('.info-pessoal-container'), data: dadosPessoais },
            { element: document.querySelector('.info-entrega-container'), data: dadosPessoais },
            { element: document.querySelector('.info-pagamento-container'), data: dadosPagamento }
        ];
        
        containers.forEach(container => {
            if (!container.element || !container.data) return;
            
            const successIcon = container.element.querySelector('.success');
            const warningIcon = container.element.querySelector('.warning');
            const errorIcon = container.element.querySelector('.error');
            const avisoErro = container.element.querySelector('.aviso-erro');
            
            // Verificar se os dados estão completos
            const dadosCompletos = Object.keys(container.data).length > 0;
            
            if (dadosCompletos) {
                if (successIcon) successIcon.style.display = 'block';
                if (warningIcon) warningIcon.style.display = 'none';
                if (errorIcon) errorIcon.style.display = 'none';
                if (avisoErro) avisoErro.style.display = 'none';
            } else {
                if (successIcon) successIcon.style.display = 'none';
                if (warningIcon) warningIcon.style.display = 'block';
                if (errorIcon) errorIcon.style.display = 'none';
                if (avisoErro) avisoErro.style.display = 'block';
            }
        });
    }
    
    // -------------------------
    // 4) VALIDAÇÃO DO FORMULÁRIO DE CONFIRMAÇÃO
    // -------------------------
    function configurarValidacaoConfirmacao() {
        const formConfirmacao = document.getElementById('form-confirmacao');
        const btnFinalizar = document.getElementById('btn-finalizar');
        const radioConcordo = document.getElementById('concordo');
        const radioNaoConcordo = document.getElementById('nao-concordo');
        
        if (!formConfirmacao || !btnFinalizar) return;
        
        // Habilitar/desabilitar botão baseado na seleção
        function atualizarEstadoBotao() {
            btnFinalizar.disabled = !radioConcordo.checked;
        }
        
        radioConcordo.addEventListener('change', atualizarEstadoBotao);
        radioNaoConcordo.addEventListener('change', atualizarEstadoBotao);
        
        // Evento de submit do formulário
        formConfirmacao.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (radioConcordo.checked) {
                alert('Pedido confirmado com sucesso! Obrigado pela compra.');
                // Aqui você pode redirecionar para a página inicial ou fazer outras ações
                window.location.href = "../index.html";
            }
        });
    }
    
    // -------------------------
    // EXECUTAR FUNÇÕES
    // -------------------------
    preencherDadosAgradecimento();
    configurarValidacaoConfirmacao();
    
    // Limpar carrinho após finalização (opcional)
    const btnFinalizarCompra = document.getElementById('btn-finalizar');
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', function() {
            // Limpar carrinho após finalização bem-sucedida
            localStorage.removeItem('carrinho');
            localStorage.removeItem('dadosPessoais');
            localStorage.removeItem('dadosPagamento');
        });
    }
});