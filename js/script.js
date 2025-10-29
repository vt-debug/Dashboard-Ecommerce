document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------
    // 1. Controle de Navegação e Submenus
    // ------------------------------------------
    const mainContent = document.getElementById('main-content');
    const menuLinks = document.querySelectorAll('.menu a[data-page]');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    // Função para mostrar a página correta
    function showPage(pageId) {
        // Oculta todas as seções de conteúdo
        document.querySelectorAll('.page-content').forEach(section => {
            section.classList.remove('active');
        });

        // Mostra a seção desejada
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Atualiza o estado ativo dos links de menu
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // Se a página do dashboard for mostrada, desenha os gráficos
        if (pageId === 'dashboard') {
            desenharGraficos();
        }
    }

    // Inicializa na página 'home'
    showPage('home');

    // Event listener para links de navegação
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.currentTarget.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Event listener para toggles de submenu
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = toggle.closest('.submenu-parent');
            const submenu = parentLi.querySelector('.submenu');

            // Alterna a classe 'active' no pai e 'open' no submenu
            parentLi.classList.toggle('active');
            submenu.classList.toggle('open');
        });
    });

    // ------------------------------------------
    // 2. Simulação de Dados e Funcionalidades
    // ------------------------------------------

    // Dados de simulação
    let produtos = [
        { id: 1, nome: "Notebook Gamer X", descricao: "Alta performance para jogos", caracteristicas: "i7, 16GB, 512SSD", valor: 7500.00, estoque: 15 },
        { id: 2, nome: "Smartphone Ultra Z", descricao: "Câmera 108MP", caracteristicas: "Snapdragon, 8GB, 128GB", valor: 3200.00, estoque: 40 },
        { id: 3, nome: "Monitor LED 27'", descricao: "144Hz, Full HD", caracteristicas: "HDMI, DisplayPort", valor: 1250.00, estoque: 22 }
    ];

    let clientes = [
        { id: 101, nome: "Ana Silva", endereco: "Rua A, 123", telefone: "99123-4567", email: "ana@email.com" },
        { id: 102, nome: "Bruno Costa", endereco: "Av. B, 45", telefone: "98765-4321", email: "bruno@email.com" },
    ];

    // --- PRODUTOS ---

    // Função para renderizar a tabela de produtos
    function renderizarTabelaProdutos() {
        const tabelaBody = document.querySelector('#tabela-produtos tbody');
        if (!tabelaBody) return;

        tabelaBody.innerHTML = ''; // Limpa as linhas existentes

        produtos.forEach(prod => {
            const row = tabelaBody.insertRow();
            row.innerHTML = `
                <td>${prod.nome}</td>
                <td>R$ ${prod.valor.toFixed(2).replace('.', ',')}</td>
                <td>${prod.estoque}</td>
                <td><button class="btn-action" data-id="${prod.id}">Editar</button></td>
            `;
        });
    }
    // Chamar a renderização inicial
    renderizarTabelaProdutos();

    // Event listener para o formulário de Cadastro de Produto
    const formProduto = document.getElementById('form-produto');
    if (formProduto) {
        formProduto.addEventListener('submit', (e) => {
            e.preventDefault();

            const novoProduto = {
                id: produtos.length + 1, // ID Simulado
                nome: document.getElementById('prod-nome').value,
                descricao: document.getElementById('prod-descricao').value,
                caracteristicas: document.getElementById('prod-caracteristicas').value,
                valor: parseFloat(document.getElementById('prod-valor').value),
                estoque: parseInt(document.getElementById('prod-estoque').value, 10),
            };

            produtos.push(novoProduto);
            renderizarTabelaProdutos();
            formProduto.reset();
            alert(`Produto "${novoProduto.nome}" cadastrado com sucesso!`);
            showPage('produtos-listar'); // Vai para a lista após cadastro
        });
    }

    // Event listener para o formulário de Importação de Produto
    const formImportarProduto = document.getElementById('form-importar-produto');
    if (formImportarProduto) {
        formImportarProduto.addEventListener('submit', (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('import-file');
            if (fileInput.files.length > 0) {
                // Simulação de processamento de arquivo
                alert(`Arquivo "${fileInput.files[0].name}" simulado como importado com sucesso! (Funcionalidade real exige backend)`);
                formImportarProduto.reset();
            } else {
                alert('Por favor, selecione um arquivo para importar.');
            }
        });
    }

    // --- CLIENTES ---

    // Função para renderizar a tabela de clientes
    function renderizarTabelaClientes() {
        const tabelaBody = document.querySelector('#tabela-clientes tbody');
        if (!tabelaBody) return;

        tabelaBody.innerHTML = ''; // Limpa as linhas existentes

        clientes.forEach(cli => {
            const row = tabelaBody.insertRow();
            row.innerHTML = `
                <td>${cli.nome}</td>
                <td>${cli.email}</td>
                <td>${cli.telefone}</td>
                <td><button class="btn-action" data-id="${cli.id}">Editar</button></td>
            `;
        });
    }
    // Chamar a renderização inicial
    renderizarTabelaClientes();

    // Event listener para o formulário de Cadastro de Cliente
    const formCliente = document.getElementById('form-cliente');
    if (formCliente) {
        formCliente.addEventListener('submit', (e) => {
            e.preventDefault();

            const novoCliente = {
                id: clientes.length + 101, // ID Simulado
                nome: document.getElementById('cli-nome').value,
                endereco: document.getElementById('cli-endereco').value,
                telefone: document.getElementById('cli-telefone').value,
                email: document.getElementById('cli-email').value,
            };

            clientes.push(novoCliente);
            renderizarTabelaClientes();
            formCliente.reset();
            alert(`Cliente "${novoCliente.nome}" cadastrado com sucesso!`);
            showPage('clientes-listar'); // Vai para a lista após cadastro
        });
    }

    // ------------------------------------------
    // 3. Desenho de Gráficos com Chart.js 
    // ------------------------------------------
    let vendasChartInstance = null;
    let categoriaChartInstance = null;
    const PRIMARY_COLOR = '#29e361'; // A cor da identidade visual

    function desenharGraficos() {
        // Verifica e destrói instâncias anteriores para evitar duplicatas ao navegar
        if (vendasChartInstance) vendasChartInstance.destroy();
        if (categoriaChartInstance) categoriaChartInstance.destroy();

        // --- GRÁFICO 1: Vendas Mensais (Linha) ---
        const ctxVendas = document.getElementById('vendasChart');
        if (ctxVendas) {
            vendasChartInstance = new Chart(ctxVendas, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Vendas (Mil R$)',
                        data: [10, 12, 9, 15, 14, 18],
                        borderColor: PRIMARY_COLOR,
                        backgroundColor: PRIMARY_COLOR + '33',
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: PRIMARY_COLOR
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // CRUCIAL para respeitar a altura definida no CSS
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Vendas (Mil R$)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // --- GRÁFICO 2: Distribuição por Categoria (Pizza/Rosca) ---
        const ctxCategoria = document.getElementById('categoriaChart');

        if (ctxCategoria) {
            categoriaChartInstance = new Chart(ctxCategoria, {
                type: 'doughnut',
                data: {
                    labels: ['Notebooks', 'Smartphones', 'Periféricos', 'Acessórios'],
                    datasets: [{
                        label: 'Distribuição de Vendas',
                        data: [45, 35, 15, 5],
                        backgroundColor: [
                            PRIMARY_COLOR,
                            '#3498db',
                            '#f39c12',
                            '#e74c3c'
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // CRUCIAL para respeitar a altura definida no CSS
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
        }
    }
});