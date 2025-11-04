// Constantes de cor baseadas no seu tailwind.config.js (verde customizado)
const PRIMARY_500 = '#29e361'; 
const PRIMARY_600 = '#22b64d'; 
const PRIMARY_800 = '#145d27';

// --- DADOS SIMULADOS ---
let produtos = [
    { id: 1, nome: "Notebook Gamer X", descricao: "Alta performance para jogos", caracteristicas: "i7, 16GB, 512SSD", valor: 7500.00, estoque: 15 },
    { id: 2, nome: "Smartphone Ultra Z", descricao: "Câmera 108MP", caracteristicas: "Snapdragon, 8GB, 128GB", valor: 3200.00, estoque: 40 },
    { id: 3, nome: "Monitor LED 27'", descricao: "144Hz, Full HD", caracteristicas: "HDMI, DisplayPort", valor: 1250.00, estoque: 5 }, // Estoque baixo
    { id: 4, nome: "Teclado Mecânico RGB", descricao: "Switch Blue", caracteristicas: "USB, Iluminação RGB", valor: 450.00, estoque: 32 },
    { id: 5, nome: "Mouse Gamer", descricao: "12000 DPI", caracteristicas: "6 botões programáveis", valor: 280.00, estoque: 8 } // Estoque baixo
];

let clientes = [
    { id: 101, nome: "Ana Silva", endereco: "Rua A, 123", telefone: "(11) 99123-4567", email: "ana@email.com" },
    { id: 102, nome: "Bruno Costa", endereco: "Av. B, 45", telefone: "(11) 98765-4321", email: "bruno@email.com" },
    { id: 103, nome: "Carlos Mendes", endereco: "Rua C, 789", telefone: "(11) 97654-3210", email: "carlos@email.com" }
];

let pedidos = [
    { id: 1234, cliente: "Ana Silva", valor: 3200.00, status: "preparo", data: "2025-11-03" },
    { id: 1233, cliente: "Bruno Costa", valor: 7500.00, status: "transito", data: "2025-11-02" },
    { id: 1232, cliente: "Carlos Mendes", valor: 1250.00, status: "aguardando", data: "2025-11-03" },
    { id: 1231, cliente: "Ana Silva", valor: 450.00, status: "entregue", data: "2025-10-30" }
];

// Instâncias de gráficos
let chartsInstances = {};

// --- MODAL DE CONFIRMAÇÃO ---
let currentConfirmCallback = null;

function showConfirmationModal(message, callback) {
    const modal = document.getElementById('confirmation-modal');
    const modalContent = document.getElementById('modal-content');
    const modalMessage = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    modalMessage.textContent = message;
    currentConfirmCallback = callback;
    
    // Configura o botão de confirmação para usar a cor de exclusão
    confirmBtn.className = 'px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors';
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
    }, 10);
    
    // Remove listeners antigos
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', handleCancel);

    // Adiciona novos listeners
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function handleConfirm() {
    closeConfirmationModal();
    if (currentConfirmCallback) {
        currentConfirmCallback();
        currentConfirmCallback = null;
    }
}

function handleCancel() {
    closeConfirmationModal();
    currentConfirmCallback = null;
}

// --- TOAST NOTIFICATION ---

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 bg-gray-800 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-up';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- FUNCIONALIDADE MENU MOBILE E NAVEGAÇÃO (Sidebar e Páginas) ---

/**
 * Funções públicas para o HTML.
 */
function showPage(pageId) {
    // 1. Esconde todas as páginas
    document.querySelectorAll('.page-content').forEach(section => {
        section.classList.add('hidden');
    });

    // 2. Mostra a página alvo
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        // Fecha o menu lateral no mobile
        document.getElementById('sidebar')?.classList.add('-translate-x-full'); 
    }

    // 3. Atualiza a classe de link ativo
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-link');
    });

    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active-link');
    }

    // 4. Renderiza dados/gráficos se necessário
    if (pageId === 'analytics') {
        setTimeout(desenharGraficosAnalytics, 100);
    } else if (pageId === 'home') {
        setTimeout(desenharGraficoHome, 100);
    }
    
    if (pageId === 'produtos-listar') {
        renderizarTabelaProdutos();
    }
    if (pageId === 'clientes-listar') {
        renderizarTabelaClientes();
    }
    if (pageId === 'pedidos') {
        renderizarPedidos();
    }
}

/**
 * Configura os botões de abrir e fechar o sidebar.
 */
function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('open-sidebar-btn');
    const closeBtn = document.getElementById('close-sidebar-btn');

    openBtn?.addEventListener('click', () => {
        sidebar.classList.remove('-translate-x-full');
    });

    closeBtn?.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
    });
}

/**
 * Configura o toggle dos submenus.
 */
function setupSubmenuToggle() {
    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = toggle.closest('.submenu-parent');
            const submenu = parentLi.querySelector('.submenu');
            const arrow = parentLi.querySelector('.arrow');
    
            const isOpen = submenu.style.maxHeight && submenu.style.maxHeight !== '0px';
            
            if (isOpen) {
                submenu.style.maxHeight = '0px';
                arrow.classList.remove('rotate-180');
            } else {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                arrow.classList.add('rotate-180');
            }
        });
    });
}

/**
 * Configura os ouvintes de clique nos links de navegação.
 */
function setupNavigationListeners() {
    document.querySelectorAll('.menu a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.currentTarget.getAttribute('data-page');
            showPage(pageId);
        });
    });
}


// --- LÓGICA DE PRODUTOS ---

function renderizarTabelaProdutos() {
    const tabelaBody = document.getElementById('tabela-produtos');
    if (!tabelaBody) return;

    tabelaBody.innerHTML = '';

    produtos.forEach((prod, index) => {
        const isLowStock = prod.estoque < 10;
        const statusClass = isLowStock ? 'bg-red-100 text-red-800' : 'bg-primary-100 text-primary-800';
        const statusText = isLowStock ? 'Estoque Baixo' : 'Disponível';
        
        const row = document.createElement('tr');
        row.className = `border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`;
        row.innerHTML = `
            <td class="py-4 px-6">
                <div class="font-medium text-gray-800">${prod.nome}</div>
                <div class="text-sm text-gray-500">${prod.descricao}</div>
            </td>
            <td class="py-4 px-6 font-semibold text-gray-800">R$ ${prod.valor.toFixed(2).replace('.', ',')}</td>
            <td class="py-4 px-6 font-medium text-gray-800">${prod.estoque} un.</td>
            <td class="py-4 px-6">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClass}">${statusText}</span>
            </td>
            <td class="py-4 px-6">
                <button onclick="editarProduto(${prod.id})" class="text-primary-600 hover:text-primary-800 font-medium mr-3">✏️ Editar</button>
                <button onclick="deletarProduto(${prod.id})" class="text-red-600 hover:text-red-800 font-medium">🗑️ Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(row);
    });
}

function editarProduto(id) {
    showToast(`Função de edição do produto ${id} será implementada`);
}

function deletarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;
    
    showConfirmationModal(`Tem certeza que deseja excluir o produto "${produto.nome}"?`, () => {
        produtos = produtos.filter(p => p.id !== id);
        renderizarTabelaProdutos();
        showToast(`🗑️ Produto excluído com sucesso!`);
    });
}

// Ouvinte para Formulário de Cadastro de Produto
document.getElementById('form-produto')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const novoProduto = {
        id: produtos.length + 1,
        nome: document.getElementById('prod-nome').value,
        descricao: document.getElementById('prod-descricao').value,
        caracteristicas: document.getElementById('prod-caracteristicas').value,
        valor: parseFloat(document.getElementById('prod-valor').value),
        estoque: parseInt(document.getElementById('prod-estoque').value, 10),
    };

    produtos.push(novoProduto);
    e.target.reset();
    
    showToast(`✅ Produto "${novoProduto.nome}" cadastrado com sucesso!`);
    
    setTimeout(() => showPage('produtos-listar'), 1000);
});

// --- LÓGICA DE CLIENTES ---

function renderizarTabelaClientes() {
    const tabelaBody = document.getElementById('tabela-clientes');
    if (!tabelaBody) return;

    tabelaBody.innerHTML = '';

    clientes.forEach((cli, index) => {
        const row = document.createElement('tr');
        row.className = `border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`;
        row.innerHTML = `
            <td class="py-4 px-6 font-medium text-gray-800">${cli.nome}</td>
            <td class="py-4 px-6 text-gray-600">${cli.email}</td>
            <td class="py-4 px-6 text-gray-600">${cli.telefone}</td>
            <td class="py-4 px-6">
                <button onclick="editarCliente(${cli.id})" class="text-primary-600 hover:text-primary-800 font-medium mr-3">✏️ Editar</button>
                <button onclick="deletarCliente(${cli.id})" class="text-red-600 hover:text-red-800 font-medium">🗑️ Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(row);
    });
}

function editarCliente(id) {
    showToast(`Função de edição do cliente ${id} será implementada`);
}

function deletarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;

    showConfirmationModal(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`, () => {
        clientes = clientes.filter(c => c.id !== id);
        renderizarTabelaClientes();
        showToast(`🗑️ Cliente excluído com sucesso!`);
    });
}

// Ouvinte para Formulário de Cadastro de Cliente
document.getElementById('form-cliente')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const novoCliente = {
        id: clientes.length + 101,
        nome: document.getElementById('cli-nome').value,
        endereco: document.getElementById('cli-endereco').value,
        telefone: document.getElementById('cli-telefone').value,
        email: document.getElementById('cli-email').value,
    };

    clientes.push(novoCliente);
    e.target.reset();
    
    showToast(`✅ Cliente "${novoCliente.nome}" cadastrado com sucesso!`);
    
    setTimeout(() => showPage('clientes-listar'), 1000);
});

// --- LÓGICA DE PEDIDOS ---

function renderizarPedidos() {
    const container = document.getElementById('lista-pedidos');
    if (!container) return;

    const statusConfig = {
        aguardando: { emoji: '⏳', color: 'blue', label: 'Aguardando Pagamento' },
        preparo: { emoji: '📦', color: 'yellow', label: 'Em Preparo' },
        transito: { emoji: '🚚', color: 'primary', label: 'Em Trânsito' },
        entregue: { emoji: '✅', color: 'primary', label: 'Entregue' }
    };
    
    // Mapeamento para classes de cor Tailwind
    const statusClassMap = (color) => {
        if (color === 'primary') return `bg-primary-100 text-primary-800`;
        return `bg-${color}-100 text-${color}-800`;
    };

    container.innerHTML = pedidos.map(ped => {
        const config = statusConfig[ped.status];
        return `
            <div class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="text-2xl">${config.emoji}</span>
                            <div>
                                <h3 class="font-bold text-gray-800">Pedido #${ped.id}</h3>
                                <p class="text-sm text-gray-600">${ped.cliente}</p>
                            </div>
                        </div>
                        <div class="flex gap-4 text-sm text-gray-500 ml-11">
                            <span>📅 ${new Date(ped.data).toLocaleDateString('pt-BR')}</span>
                            <span class="font-semibold text-primary-600">R$ ${ped.valor.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClassMap(config.color)}">${config.label}</span>
                </div>
            </div>
        `;
    }).join('');
}

// --- LÓGICA DE BUSCA/FILTRO (Reutilizando a função de pesquisa de arrays do seu JS anterior) ---

document.getElementById('search-produtos')?.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#tabela-produtos tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
});

document.getElementById('search-clientes')?.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#tabela-clientes tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
});

// --- LÓGICA DE IMPORTAÇÃO ---

document.getElementById('form-importar-produto')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('import-file');
    if (fileInput.files.length > 0) {
        showToast(`📁 Arquivo "${fileInput.files[0].name}" importado com sucesso!`);
        e.target.reset();
    }
});


// --- LÓGICA DE GRÁFICOS (Chart.js) ---

function desenharGraficoHome() {
    const ctx = document.getElementById('quickSalesChart');
    if (!ctx) return;

    if (chartsInstances.quickSales) chartsInstances.quickSales.destroy();

    chartsInstances.quickSales = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Vendas',
                data: [12, 19, 15, 25, 22, 30, 28],
                backgroundColor: PRIMARY_500,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function desenharGraficosAnalytics() {
    const ctxVendas = document.getElementById('vendasChart');
    if (ctxVendas) {
        if (chartsInstances.vendas) chartsInstances.vendas.destroy();
        chartsInstances.vendas = new Chart(ctxVendas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Vendas (Mil R$)',
                    data: [10, 12, 9, 15, 14, 18],
                    borderColor: PRIMARY_500,
                    backgroundColor: `${PRIMARY_500}33`, 
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: PRIMARY_500,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    const ctxCategoria = document.getElementById('categoriaChart');
    if (ctxCategoria) {
        if (chartsInstances.categoria) chartsInstances.categoria.destroy();
        chartsInstances.categoria = new Chart(ctxCategoria, {
            type: 'doughnut',
            data: {
                labels: ['Notebooks', 'Smartphones', 'Periféricos', 'Acessórios'],
                datasets: [{
                    data: [45, 35, 15, 5],
                    backgroundColor: [PRIMARY_500, '#3b82f6', '#f39c12', '#e74c3c'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    }

    const ctxAnual = document.getElementById('anualChart');
    if (ctxAnual) {
        if (chartsInstances.anual) chartsInstances.anual.destroy();
        chartsInstances.anual = new Chart(ctxAnual, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Receita (R$)',
                    data: [25000, 28000, 23000, 32000, 35000, 40000, 38000, 42000, 45000, 48000, 50000, 55000],
                    backgroundColor: PRIMARY_500,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}


// --- INICIALIZAÇÃO E ESTILOS ---

// Adiciona o CSS para a animação do Toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-up {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.3s ease-out; }
`;
document.head.appendChild(style);


// Inicialização principal
document.addEventListener('DOMContentLoaded', () => {
    // 1. Configura a UI (Sidebar e Submenus)
    setupSidebarToggle();
    setupSubmenuToggle(); 
    setupNavigationListeners(); // Adicionado para garantir que o clique nos links funcione
    
    // 2. Carrega a página inicial e dados
    showPage('home'); 
    // Outras renderizações são feitas dentro de showPage()
});