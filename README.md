  # 🕰️ Momentum Store - Loja Virtual de Relógios de Luxo
  
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![Storage](https://img.shields.io/badge/Storage-LocalStorage-blue?style=for-the-badge)
  
  <p>Uma experiência de e-commerce premium especializada em relógios de luxo, funcionando completamente offline com persistência de dados via <b>LocalStorage</b>.</p>
</div>

---

### 📋 Índice
- [📖 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Como Executar](#-como-executar)
- [🎨 Design e UX](#-design-e-ux)
- [🔧 Funcionalidades Técnicas](#-funcionalidades-técnicas)
- [📱 Responsividade](#-responsividade)
- [🔮 Próximas Melhorias](#-próximas-melhorias)
- [📄 Licença](#-licença)

---

### 📖 Sobre o Projeto
A **Momentum Store** é uma loja virtual de alto padrão especializada em relógios de luxo das marcas mais exclusivas do mundo. Desenvolvida como um projeto frontend completo, utiliza **LocalStorage** para simular todas as funcionalidades de um e-commerce real sem necessidade de backend.

**Objetivo Principal:** Criar uma experiência de compra premium e intuitiva que funcione inteiramente no navegador do usuário, com persistência de dados entre sessões.

---

### ✨ Funcionalidades

#### 🛒 Sistema de Carrinho Completo
- ✅ Adição/remoção de produtos com interface intuitiva
- ✅ Persistência de dados via LocalStorage
- ✅ Contador de itens em tempo real no header
- ✅ Cálculo automático de subtotal, frete e total
- ✅ Edição de quantidades diretamente no carrinho

#### 📋 Processo de Checkout em 4 Etapas
1. **Revisão do Carrinho** - Visualização e edição dos produtos
2. **Informações de Entrega** - Formulário completo de dados do cliente
3. **Método de Pagamento** - Seleção entre múltiplas formas de pagamento
4. **Confirmação do Pedido** - Resumo final antes da conclusão

#### 🏪 Catálogo de Produtos
- ✅ Layout responsivo com grid de produtos
- ✅ Filtros por marca (Rolex, Patek Philippe, Cartier, etc.)
- ✅ Páginas de detalhes de produtos individuais
- ✅ Sistema de coleções por marca
- ✅ Seção de produtos em destaque

#### ⭐ Experiência Premium
- ✅ Design elegante e sofisticado
- ✅ Navegação suave e intuitiva
- ✅ Animações e transições cuidadosamente elaboradas
- ✅ Vídeo background na seção "Sobre Nós"
- ✅ Carrossel de marcas parceiras com Swiper.js

---

### 🛠️ Tecnologias Utilizadas
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização avançada com Flexbox e Grid Layout
- **JavaScript ES6+** - Funcionalidades interativas e dinâmicas
- **LocalStorage API** - Persistência de dados no navegador
- **Swiper.js** - Carrossel interativo de marcas parceiras
- **Google Fonts** - Tipografia premium (Roboto, Playfair Display)
- **Bootstrap Icons** - Conjunto completo de ícones
- **CSS Variables** - Sistema consistente de cores e espaçamentos

---

### 📁 Estrutura do Projeto
```text
momentum-store/
├── 📄 index.html              # Página inicial
├── 📂 pages/
│   ├── 📄 catalogo.html         # Catálogo completo de produtos
│   ├── 📄 produto-detalhe.html  # Página de detalhes do produto
│   ├── 📄 carrinho.html         # Página do carrinho de compras
│   └── 📄 checkout.html         # Processo de checkout multi-etapas
├── 📂 assets/
│   ├── 📂 css/
│   │   ├── 📄 style.css         # Estilos principais e variáveis
│   │   ├── 📄 header.css        # Estilos do cabeçalho e navegação
│   │   ├── 📄 carrinho.css      # Estilos específicos do carrinho
│   │   └── 📄 checkout.css      # Estilos do processo de checkout
│   ├── 📂 js/
│   │   ├── 📄 main.js           # Funcionalidades gerais e commons
│   │   ├── 📄 carrinho.js       # Gerenciamento do carrinho
│   │   ├── 📄 checkout.js       # Lógica do processo de checkout
│   │   └── 📄 produtos.js       # Controle do catálogo de produtos
│   ├── 📂 images/
│   │   ├── 📂 products-images/  # Imagens dos produtos (webp otimizadas)
│   │   ├── 📂 logo-marcas/      # Logos das marcas parceiras
│   │   └── 📂 icons/            # Ícones, selos e elementos UI
│   └── 📂 video/
│       └── 📄 video-autoplay-site.mp4 # Vídeo de background
└── 📄 README.md
