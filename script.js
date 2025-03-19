let currentClan = 'home';


const clanData = {
    malefic: {
        elements: 'Dark, Ghost, Venom',
        color: '#6b21a8',
    },
    wingeon: {
        elements: 'Flying, Dragon',
        color: '#0284c7',
    },
    ironhard: {
        elements: 'Metal, Crystal',
        color: '#64748b',
    },
    volcanic: {
        elements: 'Fire',
        color: '#dc2626',
    },
    seavell: {
        elements: 'Water, Ice',
        color: '#0891b2',
    },
    gardestrike: {
        elements: 'Fighting, Normal',
        color: '#b45309',
    },
    orebound: {
        elements: 'Rock, Earth',
        color: '#92400e',
    },
    naturia: {
        elements: 'Grass, Bug',
        color: '#16a34a',
    },
    psycraft: {
        elements: 'Psychic, Fairy',
        color: '#d946ef',
    },
    raibolt: {
        elements: 'Electric',
        color: '#facc15',
    }
};

// Adiciona o evento ao botão "Bag Inteira"
document.getElementById('selectEntireBag').addEventListener('click', selectEntireBag);

function selectEntireBag() {
    // Verifica se currentClan foi inicializado
    if (!currentClan) {
        console.error('currentClan não foi inicializado.');
        return;
    }

    // Faz uma requisição para obter todos os Pokémons do clã atual
    fetch(`http://localhost:3000/clans/${currentClan}/pokemons`)
        .then(response => response.json())
        .then(pokemons => {
            // Filtra apenas os Pokémons disponíveis
            const availablePokemons = pokemons.filter(pokemon => pokemon.status === 'available');

            if (availablePokemons.length === 0) {
                alert('Nenhum Pokémon disponível para empréstimo.');
                return;
            }

            // Verifica se todos os Pokémons disponíveis já estão selecionados
            const allSelected = availablePokemons.every(pokemon => selectedPokemons[pokemon.id]);

            if (allSelected) {
                // Se todos já estão selecionados, remove a seleção de todos
                availablePokemons.forEach(pokemon => {
                    delete selectedPokemons[pokemon.id];
                });

                // Altera o botão para "Adicionar Tudo"
                const selectButton = document.getElementById('selectEntireBag');
                selectButton.textContent = 'Adicionar Tudo';
                selectButton.classList.remove('remove-all');

                
            } else {
                // Adiciona os Pokémons disponíveis à lista de selecionados
                availablePokemons.forEach(pokemon => {
                    selectedPokemons[pokemon.id] = true;
                });

                // Altera o botão para "Retirar Tudo"
                const selectButton = document.getElementById('selectEntireBag');
                selectButton.textContent = 'Retirar Tudo';
                selectButton.classList.add('remove-all');

                
            }

            // Atualiza a interface para refletir a seleção
            loadPokemonsByClan(currentClan);
        })
        .catch(error => {
            console.error('Erro ao buscar Pokémons do clã:', error);
            alert('Erro ao buscar Pokémons do clã. Tente novamente.');
        });
}

// Adiciona o evento ao botão "Adicionar Pokémon"
const addPokemonButton = document.getElementById('addPokemonButton');
addPokemonButton.addEventListener('click', addPokemonToBag);

// Função para adicionar Pokémon à bag
function addPokemonToBag() {
    const newPokemonName = document.getElementById('newPokemonName').value.trim();
    const newPokemonItem = document.getElementById('newPokemonItem').value.trim();
    const selectedClan = document.getElementById('clanSelect').value;

    // Validação: Nome do Pokémon e clã são obrigatórios
    if (!newPokemonName || !selectedClan) {
        
        return;
    }

    // Desabilitar o botão de adicionar Pokémon temporariamente
    const addButton = document.getElementById('addPokemonButton');
    addButton.disabled = true;

    // Corpo da requisição
    const requestBody = {
        name: newPokemonName,
        held_item: newPokemonItem || null
    };

    // Enviar a solicitação para o backend
    fetch(`http://localhost:3000/clans/${selectedClan}/pokemons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Erro ao adicionar o Pokémon.');
            });
        }
        return response.json();
    })
    .then(data => {
        // Fechar o modal
        closeAddPokemonModal();

        // Limpar o formulário
        document.getElementById('newPokemonName').value = '';
        document.getElementById('newPokemonItem').value = '';
        document.getElementById('clanSelect').selectedIndex = 0;

        // Redirecionar para a home
        navigateTo('home');

        // Recarregar a página para garantir que os dados estejam atualizados
        window.location.reload();
    })
    .catch(error => {
        console.error('Erro ao adicionar o Pokémon:', error);
        alert(error.message || 'Erro ao adicionar o Pokémon. Tente novamente.');
    })
    .finally(() => {
        // Reabilitar o botão após a conclusão da requisição
        addButton.disabled = false;
    });
}


function toggleEntireBag() {
    const currentClanData = clanData[currentClan]; // Obtém os dados do clã atual
    const pokemons = currentClanData.pokemons; // Lista de Pokémons do clã

    // Verifica se há Pokémons disponíveis
    if (pokemons.length === 0) {
        alert('Este clã não possui Pokémons disponíveis.');
        return;
    }

    // Verifica se todos os Pokémons já estão selecionados
    const allSelected = pokemons.every(pokemon => selectedPokemons[pokemon]);

    if (allSelected) {
        // Se todos já estão selecionados, remove a seleção de todos
        pokemons.forEach(pokemon => {
            if (selectedPokemons[pokemon]) {
                selectPokemon(pokemon, false); // Desseleciona o Pokémon
            }
        });
        alert('Bag inteira removida!');
    } else {
        // Seleciona todos os Pokémons disponíveis
        pokemons.forEach(pokemon => {
            if (!isPokemonInUse(pokemon)) { // Verifica se o Pokémon não está em uso
                selectPokemon(pokemon, true); // Seleciona o Pokémon
            }
        });
        alert('Bag inteira selecionada!');
    }
}



function isPokemonInUse(pokemon) {
    const isInUse = history.some(entry => entry.pokemon === pokemon && !entry.returned);
    console.log(`Pokémon ${pokemon} está em uso?`, isInUse); // Verifica o status do Pokémon
    return isInUse;
}


// Adicionar evento de clique ao logo para voltar à tela inicial
document.querySelector('.logo').addEventListener('click', () => navigateTo('home'));

// Atualizar os ícones dos clãs com suas cores específicas
function updateClanIcons() {
    console.log('Atualizando ícones dos clãs...'); // Verifica se a função está sendo chamada

    // Atualizar ícones nos cards da página inicial
    document.querySelectorAll('.clan-card').forEach(card => {
        const clan = card.dataset.clan;
        console.log('Clã encontrado:', clan); // Verifica o clã atual

        if (clanData[clan]) {
            const iconDiv = card.querySelector('.clan-icon');
            iconDiv.style.color = clanData[clan].color;
            card.style.borderColor = clanData[clan].color;
        }
    });

    // Atualizar cores dos botões na sidebar
    document.querySelectorAll('.clan-button').forEach(button => {
        const clan = button.dataset.clan;
        console.log('Clã encontrado:', clan); // Verifica o clã atual

        if (clan !== 'home' && clanData[clan]) {
            button.style.setProperty('--hover-color', clanData[clan].color);
            if (button.classList.contains('active')) {
                button.style.borderLeftColor = clanData[clan].color;
                button.style.color = clanData[clan].color;
            }
        }
    });
}

// Modificar a função navigateTo para atualizar as cores dos clãs
const originalNavigateTo = navigateTo;
navigateTo = function(clan) {
    originalNavigateTo(clan);
    updateClanIcons();
    
    // Atualizar a cor do título do clã quando estiver na página do clã
    if (clan !== 'home' && clanData[clan]) {
        document.getElementById('clan-title').style.color = clanData[clan].color;
    }
};

// Inicializar os ícones quando a página carregar
window.addEventListener('load', () => {
    updateClanIcons();
});



// Estado da aplicação
let trainers = JSON.parse(localStorage.getItem('trainers')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];
let selectedPokemons = {};

let currentTrainerIndex = null;
let partialReturnSelection = {};

// Elementos DOM
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const sidebar = document.getElementById('sidebar');
const menuOverlay = document.getElementById('menuOverlay');
const clanButtons = document.querySelectorAll('.clan-button');
const clanCards = document.querySelectorAll('.clan-card');
const homeSection = document.getElementById('home-section');
const clanSection = document.getElementById('clan-section');
const clanTitle = document.getElementById('clan-title');
const clanElements = document.getElementById('clan-elements');
const pokemonSelection = document.getElementById('pokemon-selection');
const emptyClan = document.getElementById('empty-clan');
const backToHome = document.getElementById('backToHome');
const exploreButton = document.getElementById('exploreButton');
const viewActiveButton = document.getElementById('viewActiveButton');
const activePokemonsList = document.getElementById('activePokemonsList');
const historyButton = document.getElementById('historyButton');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');
const historySearch = document.getElementById('historySearch');
const historyFilter = document.getElementById('historyFilter');
const partialReturnModal = document.getElementById('partialReturnModal');
const partialReturnList = document.getElementById('partialReturnList');
const confirmPartialReturn = document.getElementById('confirmPartialReturn');
const trainerName = document.getElementById('trainerName');
const confirmSelection = document.getElementById('confirmSelection');

// Funções
function toggleSidebar() {
    sidebar.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

function closeSidebar() {
    sidebar.classList.remove('active');
    menuOverlay.classList.remove('active');
}

function navigateTo(clan) {
    // Atualiza a variável global currentClan
    currentClan = clan;

    console.log('Navegando para o clã:', clan);

    // Atualiza o título do clã na interface
    const clanTitle = document.getElementById('clan-title');
    if (clanTitle) {
        clanTitle.textContent = clan.charAt(0).toUpperCase() + clan.slice(1);
    }

    // Atualiza os elementos do clã
    const clanElements = document.getElementById('clan-elements');
    if (clanElements && clanData[clan]) {
        clanElements.textContent = clanData[clan].elements;
    }

    // Mostra a seção apropriada
    if (clan === 'home') {
        homeSection.classList.remove('hidden');
        clanSection.classList.add('hidden');
        renderActivePokemons();
    } else {
        homeSection.classList.add('hidden');
        clanSection.classList.remove('hidden');
        loadPokemonsByClan(clan);
    }

    // Fecha o sidebar em dispositivos móveis
    if (window.innerWidth < 768) {
        closeSidebar();
    }
}

function loadPokemonsByClan(clan) {
    fetch(`http://localhost:3000/clans/${clan}/pokemons`)
        .then(response => response.json())
        .then(pokemons => {
            const pokemonSelection = document.getElementById('pokemon-selection');
            pokemonSelection.innerHTML = '';

            if (pokemons.length === 0) {
                pokemonSelection.classList.add('hidden');
                emptyClan.classList.remove('hidden');
            } else {
                pokemonSelection.classList.remove('hidden');
                emptyClan.classList.add('hidden');

                pokemons.forEach(pokemon => {
                    const div = document.createElement('div');
                    div.className = 'pokemon-item';
                    div.dataset.pokemon = pokemon.id;
                    div.dataset.version = pokemon.version;

                    const pokemonName = document.createElement('div');
                    pokemonName.className = 'pokemon-name';
                    pokemonName.textContent = pokemon.name + (pokemon.held_item ? ` (${pokemon.held_item})` : '');
                    div.appendChild(pokemonName);

                    const pokemonActions = document.createElement('div');
                    pokemonActions.className = 'pokemon-actions';

                    const selectButton = document.createElement('button');
                    selectButton.className = 'select-button';

                    if (pokemon.status !== 'available') {
                        div.classList.add('unavailable');
                        selectButton.disabled = true;
                        selectButton.classList.add('unavailable');
                    } else {
                        selectButton.textContent = '+';
                        selectButton.addEventListener('click', () => togglePokemonSelection(pokemon.id, pokemon.version, selectButton));
                    }

                    // Adiciona o botão de exclusão (-)
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-button';
                    deleteButton.textContent = '-';
                    deleteButton.addEventListener('click', () => deletePokemon(pokemon.id));

                    pokemonActions.appendChild(selectButton);
                    pokemonActions.appendChild(deleteButton); // Adiciona o botão de exclusão ao lado do botão de seleção
                    div.appendChild(pokemonActions);

                    pokemonSelection.appendChild(div);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar Pokémons do clã:', error);
        });
}

function togglePokemonSelection(pokemonId, version, button) {
    const pokemonItem = button.closest('.pokemon-item');

    // Verifica se o Pokémon já está selecionado
    if (selectedPokemons[pokemonId]) {
        // Remove o Pokémon da lista de selecionados
        delete selectedPokemons[pokemonId];

        // Atualiza a interface
        if (pokemonItem) {
            pokemonItem.classList.remove('selected'); // Remove a classe 'selected' do Pokémon
            button.classList.remove('selected'); // Remove a classe 'selected' do botão
            button.textContent = '+'; // Restaura o texto do botão
        }
    } else {
        // Adiciona o Pokémon à lista de selecionados
        selectedPokemons[pokemonId] = true;

        // Atualiza a interface
        if (pokemonItem) {
            pokemonItem.classList.add('selected'); // Adiciona a classe 'selected' ao Pokémon
            button.classList.add('selected'); // Adiciona a classe 'selected' ao botão
            button.textContent = '✓'; // Altera o texto do botão para um símbolo de confirmação
        }
    }

    // Força a atualização do DOM
    pokemonItem.offsetHeight;

    console.log('Pokémons selecionados:', selectedPokemons);
}

// Função para abrir o modal de adicionar Pokémon
function openAddPokemonModal() {
    const modal = document.getElementById('addPokemonModal');
    modal.style.display = 'flex';
    loadClansInModal(); // Carrega os clãs no select
}

// Função para fechar o modal de adicionar Pokémon
function closeAddPokemonModal() {
    const modal = document.getElementById('addPokemonModal');
    modal.style.display = 'none';

    // Limpar o formulário ao fechar o modal
    document.getElementById('newPokemonName').value = '';
    document.getElementById('newPokemonItem').value = '';
    document.getElementById('clanSelect').selectedIndex = 0;
}

// Adicionar evento de clique ao botão de adicionar Pokémon
document.getElementById('addPokemonButton').addEventListener('click', openAddPokemonModal);
// Adicionar evento de submit ao formulário de adicionar Pokémon
document.getElementById('addPokemonForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const newPokemonName = document.getElementById('newPokemonName').value.trim();
    const newPokemonItem = document.getElementById('newPokemonItem').value.trim();
    const selectedClan = document.getElementById('clanSelect').value;

    // Validação: Nome do Pokémon e clã são obrigatórios
    if (!newPokemonName || !selectedClan) {
        
        return;
    }

    // Enviar a solicitação para o backend
    fetch(`http://localhost:3000/clans/${selectedClan}/pokemons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newPokemonName, held_item: newPokemonItem || null }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Erro ao adicionar o Pokémon.');
            });
        }
        return response.json();
    })
    .then(data => {
        
        closeAddPokemonModal(); // Fechar o modal
        loadPokemonsByClan(currentClan); // Recarregar a lista de Pokémons do clã atual
    })
    .catch(error => {
        console.error('Erro ao adicionar o Pokémon:', error);
        alert(error.message || 'Erro ao adicionar o Pokémon. Tente novamente.');
    });
});


function selectPokemon(pokemon) {
    console.log(`Pokémon selecionado: ${pokemon}`);

    // Verifica se o Pokémon já está selecionado
    if (selectedPokemons[pokemon]) {
        alert(`${pokemon} já está selecionado!`);
        return;
    }

    // Adiciona o Pokémon à lista de selecionados
    selectedPokemons[pokemon] = true;

    // Atualiza a interface
    const pokemonItem = document.querySelector(`.pokemon-item[data-pokemon="${pokemon}"]`);
    if (pokemonItem) {
        pokemonItem.classList.add('selected');
        const selectButton = pokemonItem.querySelector('.select-button');
        selectButton.classList.add('selected'); // Adiciona a classe 'selected' ao botão
        selectButton.disabled = true;
    }

    console.log('Pokémons selecionados:', selectedPokemons);
}

document.querySelectorAll('.select-button').forEach(button => {
    button.addEventListener('click', () => {
        const pokemonId = button.closest('.pokemon-item').dataset.pokemon;
        const version = button.closest('.pokemon-item').dataset.version;
        togglePokemonSelection(pokemonId, version, button);
    });
});

function returnPokemon(pokemonId, version) {
    fetch(`http://localhost:3000/history/${pokemonId}/return`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ version }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Pokémon devolvido com sucesso!');
            loadPokemonsByClan(currentClan); // Atualiza a lista
            renderActivePokemons(); // Atualiza a tela
            setTimeout(() => window.location.reload(), 1000); // Recarrega a página
        }
    })
    .catch(error => {
        console.error('Erro ao devolver Pokémon:', error);
        alert('Erro ao devolver Pokémon. O servidor pode estar offline.');
    });
}




function isPokemonInUse(pokemon) {
    return history.some(entry => entry.pokemon === pokemon && !entry.returned);
}

function getPokemonUser(pokemon) {
    const entry = history.find(entry => entry.pokemon === pokemon && !entry.returned);
    return entry ? { trainer: entry.trainer, date: entry.date } : null;
}

function saveSelection() {
    const name = trainerName.value.trim();
    if (!name) {
        alert("Por favor, insira seu nome.");
        return;
    }

    const pokemonsToSave = Object.keys(selectedPokemons);
    if (pokemonsToSave.length === 0) {
        alert("Nenhum Pokémon selecionado.");
        return;
    }

    // Verifica se todos os Pokémons selecionados ainda estão disponíveis
    fetch(`http://localhost:3000/clans/${currentClan}/pokemons`)
        .then(response => response.json())
        .then(pokemons => {
            const unavailablePokemons = pokemonsToSave.filter(pokemonId => {
                const pokemon = pokemons.find(p => p.id === pokemonId);
                return pokemon && pokemon.status !== 'available';
            });

            if (unavailablePokemons.length > 0) {
                alert(`Os seguintes Pokémons já estão em uso: ${unavailablePokemons.join(', ')}. Atualizando a página...`);
                window.location.reload(); // Atualiza a página
                return;
            }

            // Envia a requisição para registrar os Pokémons selecionados
            fetch('http://localhost:3000/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trainer: name,
                    pokemons: pokemonsToSave, // Array de IDs dos Pokémons
                }),
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Erro ao registrar Pokémons.');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Pokémons registrados:', data);

                // Limpa a seleção e o input
                selectedPokemons = {};
                trainerName.value = '';

                // Recarrega os Pokémons
                loadPokemonsByClan(currentClan);
                function addPokemonToBag() {
                    const newPokemonName = document.getElementById('newPokemonName').value.trim();
                    const newPokemonItem = document.getElementById('newPokemonItem').value.trim();
                    const selectedClan = document.getElementById('clanSelect').value;
                
                    // Validação: Nome do Pokémon e clã são obrigatórios
                    if (!newPokemonName || !selectedClan) {
                        
                        return;
                    }
                
                    // Corpo da requisição
                    const requestBody = {
                        name: newPokemonName,
                        held_item: newPokemonItem || null
                    };
                
                    // Enviar a solicitação para o backend
                    fetch(`http://localhost:3000/clans/${selectedClan}/pokemons`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(errorData => {
                                throw new Error(errorData.error || 'Erro ao adicionar o Pokémon.');
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        closeAddPokemonModal(); // Fechar o modal
                        window.location.reload(); // Recarregar a página para atualizar a lista de Pokémons
                    })
                    .catch(error => {
                        console.error('Erro ao adicionar o Pokémon:', error);
                        alert(error.message || 'Erro ao adicionar o Pokémon. Tente novamente.');
                    });
                }
                // Atualiza a lista de Pokémons em uso
                renderActivePokemons();

                // Exibe uma mensagem de sucesso
                alert(`${pokemonsToSave.length} Pokémon(s) registrado(s) com sucesso!`);

                // Volta para a Home
                navigateTo('home');
            })
            .catch(error => {
                console.error('Erro ao registrar Pokémons:', error);
                alert(error.message || 'Erro ao registrar Pokémons. Tente novamente.');
            });
        })
        .catch(error => {
            console.error('Erro ao buscar Pokémons do clã:', error);
        });
}

function renderActivePokemons() {
    fetch('http://localhost:3000/history/active')
        .then(response => response.json())
        .then(activePokemons => {
            const activePokemonsList = document.getElementById('activePokemonsList');
            activePokemonsList.innerHTML = '';

            if (activePokemons.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-message';
                emptyMessage.textContent = 'Nenhum Pokémon em uso no momento.';
                activePokemonsList.appendChild(emptyMessage);
                return;
            }

            // Exibir os registros agrupados
            activePokemons.forEach((group, index) => {
                const item = document.createElement('div');
                item.className = 'active-pokemon-item';

                const header = document.createElement('div');
                header.className = 'active-pokemon-header';

                const trainerInfo = document.createElement('div');
                trainerInfo.className = 'active-pokemon-trainer';
                trainerInfo.textContent = group.trainer;

                const dateInfo = document.createElement('div');
                dateInfo.className = 'active-pokemon-date';
                dateInfo.textContent = group.date;

                // Botão "Devolver"
                const returnButton = document.createElement('button');
                returnButton.className = 'return-button';
                returnButton.textContent = 'Devolver';
                returnButton.addEventListener('click', () => openReturnModal(index));

                header.appendChild(trainerInfo);
                header.appendChild(dateInfo);
                header.appendChild(returnButton);

                const pokemonList = document.createElement('div');
                pokemonList.className = 'active-pokemon-list';
                pokemonList.textContent = group.pokemons.join(', '); // Exibe os nomes dos Pokémons

                item.appendChild(header);
                item.appendChild(pokemonList);

                activePokemonsList.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar Pokémons ativos:', error);
        });
}

async function returnAllPokemons(group) {
    const groupId = `${group.trainer}-${group.date}`;
    console.log('Devolvendo grupo:', groupId);

    if (confirm('Tem certeza que deseja devolver todos os Pokémons?')) {
        for (const pokemon of group.pokemons) {
            try {
                await fetch(`http://localhost:3000/history/${pokemon}/return`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error(`Erro ao devolver Pokémon ${pokemon}:`, error);
            }
        }

        alert('Todos os Pokémons foram devolvidos com sucesso!');
        renderActivePokemons();
        renderHistory();
        loadPokemonsByClan(currentClan);
    }
}


function openReturnModal(index) {
    fetch('http://localhost:3000/history/active')
        .then(response => response.json())
        .then(activePokemons => {
            const group = activePokemons[index];
            currentTrainerIndex = index;
            partialReturnSelection = {};

            // Limpar lista anterior
            const partialReturnList = document.getElementById('partialReturnList');
            if (!partialReturnList) {
                console.error('Elemento partialReturnList não encontrado.');
                return;
            }
            partialReturnList.innerHTML = '';

            // Adicionar Pokémons do grupo ao modal
            group.pokemons.forEach(pokemon => {
                const item = document.createElement('div');
                item.className = 'partial-return-item';
                item.dataset.pokemon = pokemon;

                const pokemonName = document.createElement('div');
                pokemonName.className = 'pokemon-name';
                pokemonName.textContent = pokemon;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'partial-return-checkbox';
                checkbox.addEventListener('change', (e) => {
                    partialReturnSelection[pokemon] = e.target.checked;
                    item.classList.toggle('selected', e.target.checked);
                });

                item.appendChild(pokemonName);
                item.appendChild(checkbox);

                partialReturnList.appendChild(item);
            });

            // Mostrar modal
            const partialReturnModal = document.getElementById('partialReturnModal');
            if (partialReturnModal) {
                partialReturnModal.style.display = 'flex';
                const modalOverlay = partialReturnModal.querySelector('.modal-overlay');
                if (modalOverlay) {
                    modalOverlay.style.display = 'block';
                }
            } else {
                console.error('Elemento partialReturnModal não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar Pokémons ativos:', error);
        });
}

function confirmPartialReturnAction() {
    const pokemonsToReturn = Object.keys(partialReturnSelection).filter(pokemon => partialReturnSelection[pokemon]);
    console.log('Pokémons selecionados para devolução:', pokemonsToReturn);

    if (pokemonsToReturn.length === 0) {
        alert('Selecione pelo menos um Pokémon para devolver.');
        return;
    }

    // Buscar os registros de histórico
    fetch('http://localhost:3000/history')
        .then(response => response.json())
        .then(history => {
            console.log('Histórico completo:', history);

            // Buscar os nomes dos Pokémons a partir dos IDs
            const promises = history.map(entry => {
                return fetch(`http://localhost:3000/pokemons/${entry.pokemon}`)
                    .then(response => response.json())
                    .then(pokemon => ({ ...entry, pokemonName: pokemon.name }));
            });

            Promise.all(promises)
                .then(historyWithNames => {
                    console.log('Histórico com nomes:', historyWithNames);

                    // Filtrar os Pokémons selecionados que estão ativos
                    const entriesToReturn = historyWithNames.filter(entry => 
                        pokemonsToReturn.includes(entry.pokemonName) && 
                        entry.returned === 0 // Certifique-se de que o Pokémon não foi devolvido
                    );
                    console.log('Registros a serem devolvidos:', entriesToReturn);

                    if (entriesToReturn.length === 0) {
                        alert('Nenhum Pokémon selecionado está ativo para devolução.');
                        return;
                    }

                    // Devolver os Pokémons selecionados
                    const returnPromises = entriesToReturn.map(entry => {
                        return fetch(`http://localhost:3000/history/${entry.id}/return`, {
                            method: 'PUT',
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Pokémon devolvido:', data);
                        });
                    });

                    Promise.all(returnPromises)
                        .then(() => {
                            alert('Pokémons devolvidos com sucesso!');
                            closePartialReturnModal(); // Fechar o modal
                            renderActivePokemons(); // Atualizar a lista de Pokémons em uso
                            if (currentClan !== 'home') {
                                loadPokemonsByClan(currentClan); // Recarregar Pokémons do clã atual
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao devolver Pokémon:', error);
                            alert('Erro ao devolver Pokémon. Atualizando a página...');
                            window.location.reload(); // Atualiza a página
                        });
                })
                .catch(error => {
                    console.error('Erro ao buscar nomes dos Pokémons:', error);
                });
        })
        .catch(error => {
            console.error('Erro ao buscar histórico:', error);
        });
}

function closePartialReturnModal() {
    partialReturnModal.style.display = 'none';
}


function openHistoryModal() {
    renderHistory();
    historyModal.style.display = 'flex';
}

function closeHistoryModal() {
    historyModal.style.display = 'none';
}

function renderHistory(filter = 'all', search = '') {
    fetch('http://localhost:3000/history')
        .then(response => response.json())
        .then(history => {
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = '';

            const groupedHistory = {};
            history.forEach(entry => {
                const key = `${entry.trainer}-${entry.date}`;
                if (!groupedHistory[key]) {
                    groupedHistory[key] = {
                        trainer: entry.trainer,
                        date: entry.date,
                        pokemons: [],
                        allReturned: true,
                    };
                }
                groupedHistory[key].pokemons.push({
                    name: entry.pokemon_name, // Usar o nome do Pokémon
                    returned: entry.returned,
                    returnDate: entry.returnDate,
                });

                if (!entry.returned) {
                    groupedHistory[key].allReturned = false;
                }
            });

            const sortedEntries = Object.values(groupedHistory)
                .filter(group => {
                    if (filter === 'active' && group.allReturned) return false;
                    if (filter === 'returned' && !group.allReturned) return false;

                    if (search) {
                        const searchLower = search.toLowerCase();
                        const trainerMatch = group.trainer.toLowerCase().includes(searchLower);
                        const pokemonMatch = group.pokemons.some(p => p.name.toLowerCase().includes(searchLower));
                        return trainerMatch || pokemonMatch;
                    }

                    return true;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            if (sortedEntries.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-message';
                emptyMessage.textContent = 'Nenhum registro encontrado.';
                historyList.appendChild(emptyMessage);
                return;
            }

            sortedEntries.forEach(group => {
                const item = document.createElement('div');
                item.className = `history-item ${group.allReturned ? 'returned' : 'active'}`;

                const header = document.createElement('div');
                header.className = 'history-header';

                const trainerInfo = document.createElement('div');
                trainerInfo.className = 'history-trainer';
                trainerInfo.textContent = group.trainer;

                const dateInfo = document.createElement('div');
                dateInfo.className = 'history-date';
                dateInfo.textContent = group.date;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'Deletar';
                deleteButton.addEventListener('click', () => deleteHistoryItem(group.trainer, group.date));

                header.appendChild(trainerInfo);
                header.appendChild(dateInfo);
                header.appendChild(deleteButton);

                const pokemonsList = document.createElement('div');
                pokemonsList.className = 'history-pokemons';

                const activePokemons = group.pokemons.filter(p => !p.returned).map(p => p.name);
                const returnedPokemons = group.pokemons.filter(p => p.returned);

                if (activePokemons.length > 0) {
                    const activePokemonsDiv = document.createElement('div');
                    activePokemonsDiv.innerHTML = `
                        <span class="history-status active">Em uso</span>: ${activePokemons.join(', ')}
                    `;
                    pokemonsList.appendChild(activePokemonsDiv);
                }

                const returnsByDate = {};
                returnedPokemons.forEach(p => {
                    if (!returnsByDate[p.returnDate]) {
                        returnsByDate[p.returnDate] = [];
                    }
                    returnsByDate[p.returnDate].push(p.name);
                });

                Object.entries(returnsByDate).forEach(([returnDate, pokemons]) => {
                    const returnedPokemonsDiv = document.createElement('div');
                    returnedPokemonsDiv.innerHTML = `
                        <span class="history-status returned">Devolvido</span>: ${pokemons.join(', ')}
                        <div class="history-return-date">em ${returnDate}</div>
                    `;
                    pokemonsList.appendChild(returnedPokemonsDiv);
                });

                item.appendChild(header);
                item.appendChild(pokemonsList);

                historyList.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar histórico:', error);
        });
}

// Event Listeners
menuToggle.addEventListener('click', toggleSidebar);
closeMenu.addEventListener('click', closeSidebar);
menuOverlay.addEventListener('click', closeSidebar);
backToHome.addEventListener('click', () => navigateTo('home'));
historyButton.addEventListener('click', openHistoryModal);
confirmPartialReturn.addEventListener('click', confirmPartialReturnAction);
confirmSelection.addEventListener('click', saveSelection);

clanButtons.forEach(button => {
    button.addEventListener('click', () => {
        navigateTo(button.dataset.clan);
    });
});

clanCards.forEach(card => {
    card.addEventListener('click', () => {
        navigateTo(card.dataset.clan);
    });
});

exploreButton.addEventListener('click', () => {
    // Abrir o sidebar em dispositivos móveis
    if (window.innerWidth < 768) {
        toggleSidebar();
    } else {
        // Em desktop, navegar para o primeiro clã
        navigateTo('malefic');
    }
});

viewActiveButton.addEventListener('click', () => {
    // Rolar para a seção de Pokémons ativos
    activePokemonsList.scrollIntoView({ behavior: 'smooth' });
});

historySearch.addEventListener('input', () => {
    renderHistory(historyFilter.value, historySearch.value);
});

historyFilter.addEventListener('change', () => {
    renderHistory(historyFilter.value, historySearch.value);
});

// Verificar tamanho da tela para ajustar o sidebar
function checkScreenSize() {
    if (window.innerWidth >= 768) {
        sidebar.classList.remove('active');
        menuOverlay.classList.remove('active');
    }
}

// Inicialização
window.addEventListener('load', () => {
    navigateTo('home');
    checkScreenSize();
});

function closeHistoryModal() {
    historyModal.style.display = 'none';
}

window.addEventListener('resize', checkScreenSize);

// Adiciona o evento ao botão "Deletar Tudo"
const deleteAllHistoryButton = document.getElementById('delete-all-history-button');
deleteAllHistoryButton.addEventListener('click', deleteAllHistory);

function deleteHistoryItem(trainer, date) {
    const password = prompt('Digite a senha para deletar este item:');
    if (password !== 'raito123') {
        alert('Senha incorreta!');
        return;
    }

    fetch(`http://localhost:3000/history/trainer/${encodeURIComponent(trainer)}/date/${encodeURIComponent(date)}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert('Registro deletado com sucesso!');
            renderHistory(); // Recarrega a lista de histórico
        } else {
            alert('Erro ao deletar o registro.');
        }
    })
    .catch(error => {
        console.error('Erro ao deletar o registro:', error);
    });
}

function deleteAllHistory() {
    const password = prompt('Digite a senha para deletar todo o histórico:');
    if (password === 'raito123') {
        fetch('http://localhost:3000/history', {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Histórico deletado com sucesso!');
                renderHistory(); // Recarrega a lista de histórico
            } else {
                alert('Erro ao deletar o histórico.');
            }
        })
        .catch(error => {
            console.error('Erro ao deletar o histórico:', error);
        });
    } else {
        alert('Senha incorreta!');
    }
}

function renderHistory(filter = 'all', search = '') {
    fetch('http://localhost:3000/history')
        .then(response => response.json())
        .then(history => {
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = '';

            // Agrupar por treinador e data
            const groupedHistory = {};
            history.forEach(entry => {
                const key = `${entry.trainer}-${entry.date}`;
                if (!groupedHistory[key]) {
                    groupedHistory[key] = {
                        trainer: entry.trainer,
                        date: entry.date,
                        pokemons: [],
                        allReturned: true,
                    };
                }
                groupedHistory[key].pokemons.push({
                    name: entry.pokemon,
                    returned: entry.returned,
                    returnDate: entry.returnDate,
                });

                if (!entry.returned) {
                    groupedHistory[key].allReturned = false;
                }
            });

            // Filtrar e ordenar
            const sortedEntries = Object.values(groupedHistory)
                .filter(group => {
                    if (filter === 'active' && group.allReturned) return false;
                    if (filter === 'returned' && !group.allReturned) return false;

                    if (search) {
                        const searchLower = search.toLowerCase();
                        const trainerMatch = group.trainer.toLowerCase().includes(searchLower);
                        const pokemonMatch = group.pokemons.some(p => p.name.toLowerCase().includes(searchLower));
                        return trainerMatch || pokemonMatch;
                    }

                    return true;
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            if (sortedEntries.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-message';
                emptyMessage.textContent = 'Nenhum registro encontrado.';
                historyList.appendChild(emptyMessage);
                return;
            }

            // Exibir os registros agrupados
            sortedEntries.forEach(group => {
                const item = document.createElement('div');
                item.className = `history-item ${group.allReturned ? 'returned' : 'active'}`;

                const header = document.createElement('div');
                header.className = 'history-header';

                const trainerInfo = document.createElement('div');
                trainerInfo.className = 'history-trainer';
                trainerInfo.textContent = group.trainer;

                const dateInfo = document.createElement('div');
                dateInfo.className = 'history-date';
                dateInfo.textContent = group.date;

                // Botão de Deletar
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'Deletar';
                deleteButton.addEventListener('click', () => deleteHistoryItem(group.trainer, group.date));

                header.appendChild(trainerInfo);
                header.appendChild(dateInfo);
                header.appendChild(deleteButton);

                const pokemonsList = document.createElement('div');
                pokemonsList.className = 'history-pokemons';

                // Agrupar por status (em uso / devolvidos)
                const activePokemons = group.pokemons.filter(p => !p.returned).map(p => p.name);
                const returnedPokemons = group.pokemons.filter(p => p.returned);

                if (activePokemons.length > 0) {
                    const activePokemonsDiv = document.createElement('div');
                    activePokemonsDiv.innerHTML = `
                        <span class="history-status active">Em uso</span>: ${activePokemons.join(', ')}
                    `;
                    pokemonsList.appendChild(activePokemonsDiv);
                }

                // Agrupar devoluções por data
                const returnsByDate = {};
                returnedPokemons.forEach(p => {
                    if (!returnsByDate[p.returnDate]) {
                        returnsByDate[p.returnDate] = [];
                    }
                    returnsByDate[p.returnDate].push(p.name);
                });

                Object.entries(returnsByDate).forEach(([returnDate, pokemons]) => {
                    const returnedPokemonsDiv = document.createElement('div');
                    returnedPokemonsDiv.innerHTML = `
                        <span class="history-status returned">Devolvido</span>: ${pokemons.join(', ')}
                        <div class="history-return-date">em ${returnDate}</div>
                    `;
                    pokemonsList.appendChild(returnedPokemonsDiv);
                });

                item.appendChild(header);
                item.appendChild(pokemonsList);

                historyList.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar histórico:', error);
        });
}

// Função para carregar os clãs no select da modal
function loadClansInModal() {
    const clanSelect = document.getElementById('clanSelect');
    clanSelect.innerHTML = ''; // Limpa o select antes de carregar os clãs

    // Adiciona os clãs ao select
    Object.keys(clanData).forEach(clan => {
        const option = document.createElement('option');
        option.value = clan;
        option.textContent = clan.charAt(0).toUpperCase() + clan.slice(1); // Formata o nome do clã
        clanSelect.appendChild(option);
    });
}


// Adiciona o evento de clique uma única vez
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button')) {
        const pokemonItem = event.target.closest('.pokemon-item');
        const pokemonId = pokemonItem.dataset.pokemon;
        deletePokemon(pokemonId);
    }
});

let isDeleting = false;

function deletePokemon(pokemonId) {
    if (isDeleting) return;

    const password = prompt('Digite a senha para deletar este Pokémon:');
    if (password === 'raito123') {
        isDeleting = true;

        fetch(`http://localhost:3000/pokemons/${pokemonId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.status === 404) {
                throw new Error('Pokémon não encontrado.');
            }
            if (!response.ok) {
                throw new Error('Erro ao deletar o Pokémon.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Pokémon deletado com sucesso!');
            loadPokemonsByClan(currentClan);
        })
        .catch(error => {
            console.error('Erro ao deletar o Pokémon:', error);
            alert(error.message || 'Erro ao deletar o Pokémon. Tente novamente.');
        })
        .finally(() => {
            isDeleting = false;
        });
    } else {
        alert('Senha incorreta!');
    }
}

function showSpinner() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideSpinner() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

function addPokemonToBag() {
    const newPokemonName = document.getElementById('newPokemonName').value.trim();
    const newPokemonItem = document.getElementById('newPokemonItem').value.trim();
    const selectedClan = document.getElementById('clanSelect').value;

    if (!newPokemonName || !selectedClan) {
        
        return;
    }

    const addButton = document.getElementById('addPokemonButton');
    addButton.disabled = true;

    showSpinner(); // Mostrar o spinner

    const requestBody = {
        name: newPokemonName,
        held_item: newPokemonItem || null
    };

    fetch(`http://localhost:3000/clans/${selectedClan}/pokemons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Erro ao adicionar o Pokémon.');
            });
        }
        return response.json();
    })
    .then(data => {
        closeAddPokemonModal();
        navigateTo('home');
        window.location.reload();
    })
    .catch(error => {
        console.error('Erro ao adicionar o Pokémon:', error);
        alert(error.message || 'Erro ao adicionar o Pokémon. Tente novamente.');
    })
    .finally(() => {
        addButton.disabled = false;
        hideSpinner(); // Esconder o spinner
    });
}

console.log('Clã atual:', currentClan);