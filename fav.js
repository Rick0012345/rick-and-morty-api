function displayFavorite(character) {
    const favoritesContainer = document.getElementById('favorites');
    const characterDiv = document.createElement('div');
    characterDiv.classList.add('character');
    characterDiv.innerHTML = `
        <h2>${character.name}</h2>
        <img src="${character.image}" alt="${character.name}">
        <p>Status: <span class="status">${character.status}</span></p>
        <p>Espécie: ${character.species}</p>
        <span class="star favorited">⭐</span>
        <button class="favorite-button">Desfavoritar</button>
    `;

    // Botão para desfavoritar
    const favoriteButton = characterDiv.querySelector('.favorite-button');
    favoriteButton.addEventListener('click', () => {
        removeFavorite(character.id);
        characterDiv.remove(); // Remove o personagem da tela
    });

    favoritesContainer.appendChild(characterDiv);
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(character => {
        displayFavorite(character); // Exibe o personagem favoritado
    });
}

// Inicializa o carregamento dos favoritos ao carregar a página
document.addEventListener('DOMContentLoaded', loadFavorites);

function removeFavorite(characterId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== characterId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
