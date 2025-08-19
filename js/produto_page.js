// --- FUNÇÃO PARA ATIVAR A GALERIA DE IMAGENS ---
// Reutilizada do código anterior, sem mudanças
function ativarFuncionalidadeGaleria() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.querySelector('.thumbnail.active')?.classList.remove('active');
            this.classList.add('active');
            mainImage.src = this.src;
        });
    });
}

// --- FUNÇÃO PRINCIPAL QUE CARREGA A PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega o nome do produto da URL
    const params = new URLSearchParams(window.location.search);
    const nomeProdutoUrl = params.get('nome');

    // Se não houver nome na URL, exibe a mensagem de erro e sai
    if (!nomeProdutoUrl) {
        document.getElementById('productTitle').textContent = "Produto não encontrado.";
        return;
    }

    // 2. Carrega o banco de dados do arquivo JSON
    fetch('produtos.json')
        .then(response => {
            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo de dados. Status: ' + response.status);
            }
            return response.json();
        })
        .then(bancoDeDadosProdutos => {
            // 3. Busca o produto no banco de dados carregado
            const produto = bancoDeDadosProdutos.find(p => p.nome === nomeProdutoUrl);

            if (!produto) {
                document.getElementById('productTitle').textContent = "Produto não encontrado.";
                return;
            }

            // 4. Preenche os elementos do HTML com os dados do produto
            document.title = produto.nome;
            document.getElementById('productTitle').textContent = produto.nome;
            document.getElementById('productDescription').textContent = produto.descricao;
            document.getElementById('productPrice').textContent = produto.preco;
            
            const mainImage = document.getElementById('mainProductImage');
            mainImage.src = produto.imgPrincipal;
            mainImage.alt = produto.nome;

            // 5. Preenche a galeria de miniaturas (thumbs)
            const thumbnailContainer = document.getElementById('thumbnailContainer');
            thumbnailContainer.innerHTML = ''; 

            const todasImagens = [produto.imgPrincipal, ...produto.thumbs];

            todasImagens.forEach((imgSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.alt = `Thumbnail ${index + 1} de ${produto.nome}`;
                thumb.classList.add('thumbnail');
                if (index === 0) {
                    thumb.classList.add('active'); 
                }
                thumbnailContainer.appendChild(thumb);
            });

            // 6. Ativa a funcionalidade de clique nas miniaturas
            ativarFuncionalidadeGaleria();
        })
        .catch(error => {
            // Exibe o erro no console para depuração
            console.error('Erro:', error);
            document.getElementById('productTitle').textContent = "Erro ao carregar os dados do produto.";
        });
});