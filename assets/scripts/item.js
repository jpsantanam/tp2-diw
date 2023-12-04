async function renderPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') ?? '';

    const album = await fetchAlbum(id);
    const photos = await fetchPhotos(id);
    const carouselInner = document.getElementById('carousel-inner');

    const title = document.querySelector('#titulo');
    title.innerText = album.name;

    for (let i = 0; i < photos.length; i++) {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');

        if (i == 0) {
            carouselItem.classList.add('active');
        }

        const carouselImage = document.createElement('img');
        carouselImage.classList.add('d-block', 'w-100');
        carouselImage.setAttribute('src', photos[i].image);

        const carouselCaption = document.createElement('div');
        carouselCaption.classList.add('carousel-caption', 'd-md-block');

        const captionTitle = document.createElement('h5');
        captionTitle.innerText = album.name;

        const caption = document.createElement('p');
        caption.innerText = album.description;

        carouselCaption.appendChild(captionTitle);
        carouselCaption.appendChild(caption);

        carouselItem.appendChild(carouselImage);
        carouselItem.appendChild(carouselCaption);

        carouselInner.appendChild(carouselItem);
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

renderPage();
