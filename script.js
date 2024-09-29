let currentPage = 1; // Página atual
const charactersContainer = document.getElementById('characters') || null;
const favoritesContainer = document.getElementById('favorites') || null;
let allCharacters = []; // Armazena todos os personagens
let currentFilter = 'All'; // Status filtrado atual

// Função para buscar personagens
async function fetchCharacters(page) {
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const data = await response.json();

    // Adiciona os personagens à lista
    data.results.forEach(character => {
        allCharacters.push(character); // Armazena todos os personagens
        if (charactersContainer) {
            displayCharacter(character); // Exibe na página principal
        }
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

    // Adiciona evento de clique no botão de favoritar/desfavoritar
    favoriteButton.addEventListener('click', () => {
        const isFavorited = star.dataset.favorited === 'true';

        if (!isFavorited) {
            storeFavorite(character); // Armazena no localStorage
            star.style.display = 'inline'; // Exibe a estrela
            star.dataset.favorited = 'true'; // Define como favoritado
            star.classList.add('favorited'); // Adiciona a classe
            favoriteButton.textContent = 'Desfavoritar'; // Muda o texto do botão
        } else {
            removeFavorite(character.id); // Remove do localStorage
            star.style.display = 'none'; // Oculta a estrela
            star.dataset.favorited = 'false'; // Define como não favoritado
            star.classList.remove('favorited'); // Remove a classe
            favoriteButton.textContent = 'Favoritar'; // Restaura o texto do botão
        }
    });

    charactersContainer.appendChild(characterDiv);

    // Aplica estilos de acordo com o status
    if (character.status === 'Dead') {
        characterDiv.classList.add('dead'); 
    }
    if (character.status === 'unknown') {
        characterDiv.classList.add('unknown');
    }
}

// Função para exibir os favoritos no `fav.html`
function displayFavorite(character) {
    const characterDiv = document.createElement('div');
    characterDiv.classList.add('character');
    characterDiv.innerHTML = `
        <h2>${character.name}</h2>
        <img src="${character.image}" alt="${character.name}">
        <p>Status: <span class="status">${character.status}</span></p>
        <p>Espécie: ${character.species}</p>
        <span class="star" data-favorited="true">⭐</span> <!-- Estrela visível -->
        <button class="favorite-button">Desfavoritar</button> <!-- Botão desfavoritar -->
    `;
    
    const favoriteButton = characterDiv.querySelector('.favorite-button');
    const star = characterDiv.querySelector('.star');

    // Evento para desfavoritar na página de favoritos
    favoriteButton.addEventListener('click', () => {
        removeFavorite(character.id); // Remove do localStorage
        characterDiv.remove(); // Remove o personagem da lista visual

        // Atualiza na página principal caso o personagem esteja sendo exibido lá
        const mainCharacter = document.querySelector(`.character[data-id="${character.id}"]`);
        if (mainCharacter) {
            const starInMain = mainCharacter.querySelector('.star');
            const buttonInMain = mainCharacter.querySelector('.favorite-button');
            starInMain.style.display = 'none'; // Oculta a estrela
            starInMain.dataset.favorited = 'false';
            buttonInMain.textContent = 'Favoritar'; // Restaura o texto do botão
        }
    });

    favoritesContainer.appendChild(characterDiv);
}

// Função para armazenar um personagem como favorito no localStorage
function storeFavorite(character) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.id === character.id)) {
        favorites.push(character); // Evita duplicação
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// Função para remover um personagem do localStorage
function removeFavorite(characterId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== characterId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Função para verificar se o personagem já está favoritado
function checkIfFavorited(characterId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.id === characterId);
}

// Carrega os personagens favoritos na página `fav.html`
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(displayFavorite);
}

// Carregamento inicial
if (charactersContainer) {
    fetchCharacters(currentPage); // Carrega personagens na página principal
}
if (favoritesContainer) {
    loadFavorites(); // Carrega personagens favoritados na página de favoritos
}

// Função para verificar se o usuário chegou ao final da página
async function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) { // Se estiver perto do final
        currentPage++; // Incrementa a página
        await fetchCharacters(currentPage); // Busca mais personagens

        // Aplica o filtro atual se necessário
        filterCharacters(currentFilter);
    }
}

// Adiciona um listener para o evento de rolagem
if (charactersContainer) {
    window.addEventListener('scroll', handleScroll);
}
