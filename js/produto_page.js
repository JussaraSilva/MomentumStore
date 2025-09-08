// --- FUNÇÃO PARA ATIVAR A GALERIA DE IMAGENS ---
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
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Pega o nome do produto da URL
    const params = new URLSearchParams(window.location.search);
    const nomeProdutoUrl = params.get('nome');

    if (!nomeProdutoUrl) {
        document.getElementById('productTitle').textContent = "Produto não encontrado.";
        return;
    }

    try {
        // 2. Carrega o banco de dados do arquivo JSON
        const res = await fetch("../data/produtos.json");
        if (!res.ok) {
            throw new Error("Erro ao carregar o arquivo de dados. Status: " + res.status);
        }
        const bancoDeDadosProdutos = await res.json();

        // 3. Busca o produto no banco de dados carregado
        const produto = bancoDeDadosProdutos.find(p => p.nome === nomeProdutoUrl);

        if (!produto) {
            document.getElementById('productTitle').textContent = "Produto não encontrado.";
            return;
        }

        // 4. SALVA O PRODUTO NA VARIÁVEL GLOBAL
        window.produtoPage = produto;

        // DISPARE UM EVENTO QUANDO OS DADOS ESTIVEREM PRONTOS
        document.dispatchEvent(new CustomEvent("produto:carregado", {
            detail: { produto }
        }));

        // 5. Preenche os elementos do HTML com os dados do produto
        document.title = produto.nome;
        document.getElementById('productTitle').textContent = produto.nome;
        document.getElementById('productDescription').textContent = produto.descricao;
        document.getElementById('productPrice').textContent = produto.preco;
        
        const mainImage = document.getElementById('mainProductImage');
        mainImage.src = produto.imgPrincipal;
        mainImage.alt = produto.nome;

        // 6. Preenche a galeria de miniaturas (thumbs)
        const thumbnailContainer = document.getElementById('thumbnailContainer');
        thumbnailContainer.innerHTML = ''; 

        const todasImagens = [produto.imgPrincipal, ...(produto.thumbs || [])];

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

        // 7. Ativa a funcionalidade de clique nas miniaturas
        ativarFuncionalidadeGaleria();
        ativarButtonMiniaturas();

    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('productTitle').textContent = "Erro ao carregar os dados do produto.";
    }
});

// --- CONTROLE DOS BOTÕES DE NAVEGAÇÃO DAS MINIATURAS ---
function ativarButtonMiniaturas() {
    const prevBtn = document.getElementById('prevBtn-thumb');
    const nextBtn = document.getElementById('nextBtn-thumb');
    const thumbnailContainer = document.getElementById('thumbnailContainer');

    if (!prevBtn || !nextBtn || !thumbnailContainer) return;

    prevBtn.addEventListener('click', () => {
        const activeThumb = document.querySelector('.thumbnail.active');
        const prevThumb = activeThumb?.previousElementSibling || thumbnailContainer.lastElementChild;
        prevThumb?.click();
    });

    nextBtn.addEventListener('click', () => {
        const activeThumb = document.querySelector('.thumbnail.active');
        const nextThumb = activeThumb?.nextElementSibling || thumbnailContainer.firstElementChild;
        nextThumb?.click();
    });
}
