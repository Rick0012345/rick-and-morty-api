// Carrega os favoritos do localStorage e exibe no fav.html
function loadFavorites() {
    const favoritesContainer = document.getElementById('favorites');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>Você não tem nenhum personagem favoritado.</p>';
        return;
    }

    favorites.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('character');
        characterDiv.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}">
            <p>Status: <span class="status">${character.status}</span></p>
            <p>Espécie: ${character.species}</p>
            <span class="star favorited">⭐</span>
            <button class="unfavorite-button">Desfavoritar</button> <!-- Botão de desfavoritar -->
        `;
        
        // Adiciona evento de clique no botão de desfavoritar
        const unfavoriteButton = characterDiv.querySelector('.unfavorite-button');
        unfavoriteButton.addEventListener('click', () => {
            removeFavorite(character.id);
            characterDiv.remove(); // Remove o personagem da página
        });

        favoritesContainer.appendChild(characterDiv);
    });
}

// Remove o personagem dos favoritos no localStorage
function removeFavorite(characterId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== characterId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Carrega os favoritos ao carregar a página
document.addEventListener('DOMContentLoaded', loadFavorites);
