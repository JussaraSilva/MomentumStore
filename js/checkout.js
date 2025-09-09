document.addEventListener('DOMContentLoaded', function () {
    // Selecionar elementos
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

    // Função para alternar a exibição dos campos de pagamento
    function togglePaymentFields() {
        paymentFields.forEach(field => field.style.display = 'none');
        const checkedInput = document.querySelector('.payment-method input[name="payment-method"]:checked');
        if (checkedInput) {
            const fieldsToShow = document.getElementById(checkedInput.value + '-fields');
            if (fieldsToShow) {
                fieldsToShow.style.display = 'block';
            }
        }
    }

    // Event listeners para os inputs radio
    paymentMethods.forEach(input => {
        input.addEventListener('change', togglePaymentFields);
    });

    // Event listeners para os containers (permite clicar em qualquer lugar do card)
    paymentMethodContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            // Encontra o input radio dentro deste container
            const radioInput = this.querySelector('input[type="radio"]');
            if (radioInput && e.target !== radioInput) {
                radioInput.checked = true;
                togglePaymentFields();
            }
        });
    });

    // Chama a função ao carregar a página
    togglePaymentFields();

    // Reconhecimento de bandeira do cartão (se cardValidator estiver disponível)
    if (creditCardNumberInput && creditCardBrandSelect && typeof cardValidator !== 'undefined') {
        creditCardNumberInput.addEventListener('input', function () {
            const cardNumber = this.value.replace(/\D/g, '');
            const cardInfo = cardValidator.number(cardNumber);
            
            creditCardBrandSelect.value = '';

            if (cardInfo.card) {
                creditCardBrandSelect.value = cardInfo.card.type;
            }
        });
    }

    // Máscara para o número do cartão
    if (creditCardNumberInput) {
        creditCardNumberInput.addEventListener('input', function (e) {
            const cleanValue = e.target.value.replace(/\s/g, '').slice(0, 16);
            let maskedValue = '';
            for (let i = 0; i < cleanValue.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    maskedValue += ' ';
                }
                maskedValue += cleanValue[i];
            }
            e.target.value = maskedValue;
        });
    }

    // Máscara para validade (MM/AA)
    if (creditCardValidity) {
        creditCardValidity.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Máscara para CVV (3 ou 4 dígitos)
    if (creditCardCvv) {
        creditCardCvv.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) {
                value = value.substring(0, 4);
            }
            e.target.value = value;
        });
    }
    
    // Alterna o tipo de campo para a chave Pix
    if (pixTipoSelect && pixChaveInput) {
        pixTipoSelect.addEventListener('change', function () {
            const tipo = this.value;
            
            // Limpa o input
            pixChaveInput.value = '';

            // Atualiza o placeholder e a máscara
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
    
    // Máscara para CPF e telefone na chave Pix
    if (pixChaveInput && pixTipoSelect) {
        pixChaveInput.addEventListener('input', function (e) {
            const tipo = pixTipoSelect.value;
            let value = e.target.value.replace(/\D/g, '');

            if (tipo === 'cpf') {
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                }
            } else if (tipo === 'telefone') {
                if (value.length <= 11) {
                    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
            }
            e.target.value = value;
        });
    }

    // Máscara para telefone
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            }
        });
    }
});