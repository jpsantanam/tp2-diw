async function renderPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') ?? '';

    const album = await fetchAlbum(id);
    const photos = await fetchPhotos(id);
    const photosList = document.getElementById('photos-list');

    const titulo = document.querySelector('#titulo');
    titulo.innerText = album.name;

    const descricao = document.querySelector('#descricao');
    descricao.innerText = album.description;

    const mainImg = document.querySelector('#main-image');
    mainImg.setAttribute('src', album.cover);

    const coordenadas = document.getElementById('coordenadas');
    coordenadas.innerText = `Lat: ${album.coordinates[1]} Long: ${album.coordinates[0]}`;

    const ano = document.getElementById('ano');
    ano.innerText = album.date;

    const checkbox = document.getElementById('destaque');
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            addHighlight();
        } else {
            removeHighlight();
        }
    });

    for (let photo of photos) {
        const divCol = document.createElement('div');
        divCol.classList.add('col');

        const card = document.createElement('div');
        card.classList.add('card', 'h-100');

        const cardImage = document.createElement('img');
        cardImage.classList.add('card-img-top');
        cardImage.setAttribute('src', photo.image);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerText = photo.description;

        const cardButton = document.createElement('a');
        cardButton.setAttribute('href', `./item.html?id=${album.id}`);

        cardBody.appendChild(cardText);

        card.appendChild(cardImage);
        card.appendChild(cardBody);

        cardButton.appendChild(card);

        divCol.appendChild(cardButton);

        photosList.appendChild(divCol);
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

async function fetchPhotos(id) {
    try {
        const response = await fetch(`https://tp2-2.jpsantanam.repl.co/photos?albumId=${id}`);
        const photos = await response.json();
        return photos;
    } catch (error) {
        console.error(error);
    }
}

let idDestaque = null;

async function initiateCheckbox() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    try {
        const response = await fetch(`https://tp2-2.jpsantanam.repl.co/highlights?albumId=${id}`);
        const data = await response.json();
        setHighlight(data);
    } catch (error) {
        console.error('Album não é destaque', error);
    }
}

function setHighlight(highlight) {
    const checkbox = document.getElementById('destaque');

    if (highlight && highlight[0]) {
        checkbox.checked = true;

        idDestaque = highlight[0].id;
    }
}

function addHighlight() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const data = { albumId: parseInt(id) };
    const request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };

    fetch('https://tp2-2.jpsantanam.repl.co/highlights', request).then((response) => {
        console.log(response);
    });
    return true;
}

function removeHighlight() {
    const request = {
        method: 'DELETE',
    };

    fetch(`https://tp2-2.jpsantanam.repl.co/highlights/${idDestaque}`, request).then((response) => {
        console.log(response);
    });
    return true;
}

renderPage();
initiateCheckbox();
