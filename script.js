let currentPage = 1; // Página atual
        const charactersContainer = document.getElementById('characters') || null;
        const favoritesContainer = document.getElementById('favorites') || null;
        let allCharacters = []; // Armazena todos os personagens
        let currentFilter = 'All'; // Status filtrado atual

        async function fetchCharacters(page) {
            const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
            const data = await response.json();

            data.results.forEach(character => {
                allCharacters.push(character); // Armazena todos os personagens
            });

            filterCharacters(currentFilter); // Aplica o filtro após carregar os personagens
        }

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

            const isFavorited = checkIfFavorited(character.id);
            if (isFavorited) {
                star.style.display = 'inline';
                star.dataset.favorited = 'true'; 
                star.classList.add('favorited');
                favoriteButton.textContent = 'Desfavoritar'; 
            }

            favoriteButton.addEventListener('click', () => {
                const isFavorited = star.dataset.favorited === 'true';

                if (!isFavorited) {
                    storeFavorite(character); 
                    star.style.display = 'inline';
                    star.dataset.favorited = 'true'; 
                    star.classList.add('favorited');
                    favoriteButton.textContent = 'Desfavoritar';
                } else {
                    removeFavorite(character.id); 
                    star.style.display = 'none';
                    star.dataset.favorited = 'false'; 
                    star.classList.remove('favorited'); 
                    favoriteButton.textContent = 'Favoritar';
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
                removeFavorite(character.id); 
                characterDiv.remove(); 

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

        // Função para aplicar o filtro
        function applyFilter(status) {
            currentFilter = status; // Atualiza o filtro atual
            filterCharacters(currentFilter); // Filtra os personagens
        }

        // Função para filtrar os personagens com base no status
        function filterCharacters(status) {
            charactersContainer.innerHTML = ''; // Limpa os personagens visíveis

            let filteredCharacters;

            if (status === 'All') {
                filteredCharacters = allCharacters; // Mostra todos os personagens
            } else {
                filteredCharacters = allCharacters.filter(character => character.status === status);
            }

            // Exibe os personagens filtrados
            filteredCharacters.forEach(character => displayCharacter(character));
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