let currentPage = 1; // Página atual
const charactersContainer = document.getElementById('characters');
let allCharacters = []; // Armazena todos os personagens
let currentFilter = 'All'; // Status filtrado atual

async function fetchCharacters(page) {
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const data = await response.json();

    // Adiciona os personagens à lista
    data.results.forEach(character => {
        allCharacters.push(character); // Armazena todos os personagens
        displayCharacter(character); // Chama a função para exibir o personagem
    });
}

// Função para exibir um único personagem
function displayCharacter(character) {
    const characterDiv = document.createElement('div');
    characterDiv.classList.add('character');
    characterDiv.innerHTML = `
        <h2>${character.name}</h2>
        <img src="${character.image}" alt="${character.name}">
        <p>Status: <span class="status">${character.status}</span></p>
        <p>Espécie: ${character.species}</p>
        <span class="star" data-favorited="false" style="display: none;">⭐</span> <!-- Estrela oculta -->
        <button class="favorite-button">Favoritar</button> <!-- Botão de favoritar -->
    `;
    
    // Adiciona evento de clique no botão de favoritar
    const favoriteButton = characterDiv.querySelector('.favorite-button');
    const star = characterDiv.querySelector('.star');

    // Verifica se o personagem está favoritado
    const isFavorited = checkIfFavorited(character.id);
    if (isFavorited) {
        star.style.display = 'inline'; // Exibe a estrela
        star.dataset.favorited = 'true'; // Define como favoritado
        star.classList.add('favorited'); // Adiciona a classe para a estrela
        favoriteButton.textContent = 'Desfavoritar'; // Altera o texto do botão
    }

    favoriteButton.addEventListener('click', () => {
        const isFavorited = star.dataset.favorited === 'true';

        if (!isFavorited) {
            // Armazena o personagem como favorito no localStorage
            storeFavorite(character);
            star.style.display = 'inline'; // Exibe a estrela quando favoritado
            star.dataset.favorited = 'true'; // Define como favoritado
            star.classList.add('favorited'); // Adiciona a classe para a estrela
            favoriteButton.textContent = 'Desfavoritar'; // Altera o texto do botão
        } else {
            // Remove o personagem dos favoritos
            removeFavorite(character.id);
            star.style.display = 'none'; // Oculta a estrela
            star.dataset.favorited = 'false'; // Define como não favoritado
            star.classList.remove('favorited'); // Remove a classe da estrela
            favoriteButton.textContent = 'Favoritar'; // Restaura o texto do botão
        }
    });
    
    charactersContainer.appendChild(characterDiv);
    
    // Adiciona a classe 'dead' se o status for 'Dead'
    if (character.status === 'Dead') {
        characterDiv.classList.add('dead'); 
    }
    
    // Adiciona a classe 'unknown' se o status for 'unknown'
    if (character.status === 'unknown') {
        characterDiv.classList.add('unknown');
    }
}

function storeFavorite(character) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(character);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function removeFavorite(characterId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== characterId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function checkIfFavorited(characterId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.id === characterId);
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(character => {
        displayCharacter(character); // Exibe o personagem como favorito
    });
}

// Função para filtrar personagens por status
function filterCharacters(status) {
    currentFilter = status; // Atualiza o status filtrado
    charactersContainer.innerHTML = ''; // Limpa o contêiner

    // Filtra os personagens com base no status
    const filteredCharacters = status === 'All' ? allCharacters : allCharacters.filter(character => character.status === status);

    // Exibe os personagens filtrados
    filteredCharacters.forEach(displayCharacter);
}

// Inicializa o carregamento dos personagens
fetchCharacters(currentPage);
loadFavorites(); // Carrega os favoritos ao iniciar

// Adiciona eventos de clique aos botões de filtro
document.getElementById('filter-alive').addEventListener('click', () => filterCharacters('Alive'));
document.getElementById('filter-dead').addEventListener('click', () => filterCharacters('Dead'));
document.getElementById('filter-unknown').addEventListener('click', () => filterCharacters('unknown'));
document.getElementById('filter-all').addEventListener('click', () => filterCharacters('All'));

// Função para verificar se o usuário chegou ao final da página
async function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) { // Se estiver perto do final
        currentPage++; // Incrementa a página
        await fetchCharacters(currentPage); // Busca mais personagens

        // Após carregar mais personagens, aplica o filtro atual
        filterCharacters(currentFilter);
    }
}

// Adiciona um listener para o evento de rolagem
window.addEventListener('scroll', handleScroll);
