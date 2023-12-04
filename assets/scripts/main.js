async function renderPage() {
    const albunsList = document.getElementById('albuns-list');
    const albuns = await fetchData();
    const highlights = await fetchHighlights();

    const carouselInner = document.getElementById('carousel-inner');

    function getCardMarker(album) {
        return `
        <a class="text-decoration-none text-reset" href="album.html?id=${album.id}" target="_blank">
            <img src="${album.cover}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title text-truncate text-secondary">${album.name}</h5>
                <p class="card-text text-secondary">${album.location}</p>
            </div>
        </a>`;
    }

    function getMap() {
        const centralLatLong = [-43.928605, -19.928011];

        mapboxgl.accessToken = 'pk.eyJ1IjoianBzYW50YW5hIiwiYSI6ImNscG9qNXlyZDBwMXoybG92bW5xNmJ3NHQifQ.jkG_k61BcboeqXHHGbMZ0w';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: centralLatLong,
            zoom: 12,
        });
        return map;
    }

    function getLocations(map) {
        for (let album of albuns) {
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(getCardMarker(album));
            const marker = new mapboxgl.Marker({ color: 'red' }).setLngLat(album.coordinates).setPopup(popup).addTo(map);
        }
    }

    const map = getMap();
    getLocations(map);

    for (let i = 0; i < highlights.length; i++) {
        const album = await fetchAlbum(highlights[i].albumId);

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');

        if (i == 0) {
            carouselItem.classList.add('active');
        }

        const carouselImage = document.createElement('img');
        carouselImage.setAttribute('src', album.cover);

        carouselItem.appendChild(carouselImage);

        carouselInner.appendChild(carouselItem);
    }

    for (let album of albuns) {
        const divCol = document.createElement('div');
        divCol.classList.add('col');

        const card = document.createElement('div');
        card.classList.add('card', 'h-100');

        const cardImage = document.createElement('img');
        cardImage.classList.add('card-img-top');
        cardImage.setAttribute('src', album.cover);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = album.name;

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerText = album.description;

        const cardButton = document.createElement('a');
        cardButton.classList.add('btn', 'btn-primary');
        cardButton.innerText = 'Ver detalhes';
        cardButton.setAttribute('href', `album.html?id=${album.id}`);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardButton);

        card.appendChild(cardImage);
        card.appendChild(cardBody);

        divCol.appendChild(card);

        albunsList.appendChild(divCol);
    }
}

async function fetchData() {
    try {
        const response = await fetch('https://tp2-2.jpsantanam.repl.co/albuns/');
        const albuns = await response.json();
        return albuns;
    } catch (error) {
        console.error(error);
    }
}

async function fetchAlbum(id) {
    try {
        const response = await fetch(`https://tp2-2.jpsantanam.repl.co/albuns?id=${id}`);
        const album = await response.json();
        return album[0];
    } catch (error) {
        console.error(error);
    }
}

async function fetchHighlights() {
    try {
        const response = await fetch('https://tp2-2.jpsantanam.repl.co/highlights');
        const albuns = await response.json();
        return albuns;
    } catch (error) {
        console.error(error);
    }
}

renderPage();