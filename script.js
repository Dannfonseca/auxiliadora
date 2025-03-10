// Dados das categorias e produtos
const categorias = {
    'itens-acai': {
        nome: 'Itens de Açaí',
        cor: '#6b21a8',
        itens: ['Amendoim', 'Aveia', 'Paçoca', 'Leite', 'Ovomaltine', 'Chocoball', 'Sucrilhos', 'Granola', 'Jujuba', 'Flocos de Arroz', 'Granulado Preto', 'Granulado Colorido', 'Biscoitinho de Açaí']
    },
    'copos': {
        nome: 'Copos',
        cor: '#0284c7',
        itens: ['150 ml', '200 ml', '250 ml', '300 ml', '400 ml', '500 ml', '770 ml']
    },
    'picole': {
        nome: 'Picolé',
        cor: '#dc2626',
        itens: ['Coco', 'Flocos', 'Napolitano', 'Mini Saia', 'Milho verde', 'Limão']
    },
    'doces': {
        nome: 'Doces e Balas',
        cor: '#16a34a',
        itens: ['Bala Mole', 'Cartela de Chiclete', 'Mentos', 'Freegels', 'Halls Cereja', 'Trento', 'Paçoquita', 'Chiclete Blong', 'Trakinas', 'Zumbitos', 'Doce de Amendoim', 'Pirulito', 'Doce de Abóbora', 'Pé de Moça']
    },
    'coberturas': {
        nome: 'Coberturas',
        cor: '#d946ef',
        itens: ['Chocolate', 'Morango', 'Uva', 'Tuti-frutti', 'Caramelo', 'Leite Condensado', 'Menta', 'Maçã Verde', 'Graviola']
    },
    'acai-sorvete': {
        nome: 'Açaí e Sorvete',
        cor: '#8b5cf6',
        itens: ['Açaí', 'Sorvete Flocos', 'Sorvete Napolitano', 'Sorvete Creme']
    },
    'bebidas': {
        nome: 'Bebidas',
        cor: '#ef4444',
        itens: ['Coca-cola 2 lt', 'Coca lata', 'Antártica 2 lt', 'Antártica 1 lt', 'Antártica Lata', 'Tobi 2 lt', 'Guaravita', 'Convenção Pet', 'Água Mineral']
    },
    'alimentacao': {
        nome: 'Alimentação e utilitários',
        cor: '#f59e0b',
        itens: ['Hamburguer', 'Hamburguer Picanha', 'Bacon', 'Batata Palha', 'Batata Frita', 'Mussarela', 'Apresuntado', 'Linguiça Fatiada', 'Arroz', 'Feijão', 'Açúcar', 'Leite Integral', 'Leite em Pó', 'Filé de Peito de Frango', 'Carne', 'Cartela de Ovos', 'Colher Descartável', 'Sacola Forte', 'Maionese', 'Billy e Jack', 'Ketchup', 'Sacola 25/35', 'Papel Higiênico', 'Detergente', 'Toalha de papel', 'Bombril', 'Guardanapo']
    }
};

// Estado da aplicação
const estado = {
    categoriaAtual: 'itens-acai',
    quantidades: {},

    inicializar() {
        // Inicializa as quantidades com zero
        Object.values(categorias).forEach(categoria => {
            categoria.itens.forEach(item => {
                this.quantidades[this.normalizarNome(item)] = 0;
            });
        });
        
        // Carrega dados salvos do localStorage
        const dadosSalvos = localStorage.getItem('quantidades');
        if (dadosSalvos) {
            Object.assign(this.quantidades, JSON.parse(dadosSalvos));
        }
        
        this.atualizarContadorItens();
        this.renderizarCategoria(this.categoriaAtual);
    },
    
    normalizarNome(nome) {
        return nome.replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
    
    salvar() {
        localStorage.setItem('quantidades', JSON.stringify(this.quantidades));
        this.atualizarContadorItens();
    },
    
    incrementar(item) {
        const nomeNormalizado = this.normalizarNome(item);
        this.quantidades[nomeNormalizado]++;
        this.atualizarExibicao(item);
        this.salvar();
    },
    
    decrementar(item) {
        const nomeNormalizado = this.normalizarNome(item);
        if (this.quantidades[nomeNormalizado] > 0) {
            this.quantidades[nomeNormalizado]--;
            this.atualizarExibicao(item);
            this.salvar();
        }
    },
    
    atualizarExibicao(item) {
        const nomeNormalizado = this.normalizarNome(item);
        const elemento = document.getElementById(`quantidade-${nomeNormalizado}`);
        if (elemento) {
            elemento.textContent = this.quantidades[nomeNormalizado];
        }
    },
    
    limparTudo() {
        Object.keys(this.quantidades).forEach(key => {
            this.quantidades[key] = 0;
        });
        this.salvar();
        this.renderizarCategoria(this.categoriaAtual);
    },

    atualizarContadorItens() {
        const total = Object.values(this.quantidades).reduce((sum, qty) => sum + qty, 0);
        document.getElementById('itemCount').textContent = `${total} ${total === 1 ? 'item' : 'itens'}`;
    },
    
    renderizarCategoria(categoriaId) {
        this.categoriaAtual = categoriaId;
        const categoria = categorias[categoriaId];
        const container = document.getElementById('categoryContent');
        
        container.innerHTML = `
            <div class="category-card" style="border-color: ${categoria.cor}">
                <h2 style="color: ${categoria.cor}">${categoria.nome}</h2>
                <div class="items-list">
                    ${categoria.itens.map(item => `
                        <div class="item">
                            <span>${item}</span>
                            <div class="controls">
                                <button onclick="estado.decrementar('${item}')">-</button>
                                <span id="quantidade-${this.normalizarNome(item)}">${this.quantidades[this.normalizarNome(item)] || 0}</span>
                                <button onclick="estado.incrementar('${item}')">+</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Atualizar menu ativo
        document.querySelectorAll('.side-menu a').forEach(link => {
            link.classList.toggle('active', link.dataset.category === categoriaId);
        });
    }
};

// Funções de navegação
function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
    document.getElementById('menuOverlay').classList.toggle('active');
}

function closeMenu() {
    document.getElementById('sideMenu').classList.remove('active');
    document.getElementById('menuOverlay').classList.remove('active');
}

function enviarWhatsApp() {
    let mensagem = '';
    
    // Agrupar itens por categoria
    Object.entries(categorias).forEach(([categoriaId, categoria]) => {
        const itensCategoria = categoria.itens.filter(item => 
            estado.quantidades[estado.normalizarNome(item)] > 0
        );
        
        if (itensCategoria.length > 0) {
            mensagem += `\n*(${categoria.nome.toUpperCase()})*\n\n`; // Título em CAPS LOCK e negrito
            itensCategoria.forEach(item => {
                const quantidade = estado.quantidades[estado.normalizarNome(item)];
                mensagem += `➡️ ${quantidade}x ${item}\n`; // Adiciona um emoji e formatação para melhor visualização
            });
        }
    });
    
    if (!mensagem.trim()) {
        alert('Selecione pelo menos um item antes de enviar!');
        return;
    }
    
    const numeroWhatsApp = "5521984145211";
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem.trim())}`;
    window.open(linkWhatsApp, "_blank");
}

function limparTudo() {
    if (confirm('Tem certeza que deseja limpar todas as quantidades?')) {
        estado.limparTudo();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    estado.inicializar();
    
    // Menu toggle
    document.getElementById('menuToggle').addEventListener('click', toggleMenu);
    document.getElementById('closeMenu').addEventListener('click', closeMenu);
    document.getElementById('menuOverlay').addEventListener('click', closeMenu);
    
    // Navegação do menu
    document.querySelectorAll('.side-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            estado.renderizarCategoria(e.target.dataset.category);
            if (window.innerWidth < 768) {
                closeMenu();
            }
        });
    });
});