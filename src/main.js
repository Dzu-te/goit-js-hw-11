import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = '42024454-8ed2ac239bcd0125bd4fa3d9e';


const form = document.querySelector('.handleSearchSubmit');
const cardContainer = document.querySelector('.card_container');

const loader = document.createElement('div');
loader.classList.add('loader');
loader.textContent = 'Loading...';


function showLoader() {
  document.body.appendChild(loader);
}

function hideLoader() {
  document.body.removeChild(loader);
}

form.addEventListener('submit', onSearchSubmit);

function fetchImages(q) {
  showLoader();

  const params = new URLSearchParams({
    key: API_KEY,
    q: q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const url = `${BASE_URL}?${params.toString()}`;

  return fetch(url).then(resp => {
    if (!resp.ok) {
      throw new Error('Network response was not ok');
    }
    return resp.json();
  });
}

function onSearchSubmit(event) {
  event.preventDefault();

  const searchInput = form.elements.search;
  const searchValue = searchInput.value.trim();

  if (!searchValue) {
    iziToast.warning({
      title: 'Warning',
      message:
        'Sorry, there are no images matching your search query. Please try again!',
    });
    return;
  }

  fetchImages(searchValue)
    .then(data => {
      createMarkup(data.hits);
      initializeLightbox();
    })
    .catch(error => {
      console.error('Error fetching images:', error);
      iziToast.error({
        title: 'Error',
        message:
          'An error occurred while fetching images. Please try again later.',
      });
    })
    .finally(() => {
      hideLoader();
      form.reset();
    });
}

function createMarkup(images) {

  cardContainer.innerHTML = '';

  images.forEach(image => {
    const card = document.createElement('a');
    card.classList.add('card');
    card.href = image.largeImageURL;

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('span');
    likes.classList.add('info-item');
    likes.innerHTML = `<strong>Likes:</strong> <p class=${"pNumber"}>${image.likes}</p>`;

    const views = document.createElement('span');
    views.classList.add('info-item');
    views.innerHTML = `<strong>Views:</strong> <p class=${"pNumber"}>${image.views}</p>`;

    const comments = document.createElement('span');
    comments.classList.add('info-item');
    comments.innerHTML = `<strong>Comments:</strong> <p class=${"pNumber"}>${image.comments}</p>`;

    const downloads = document.createElement('span');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<strong>Downloads:</strong> <p class=${"pNumber"}>${image.downloads}</p>`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    card.appendChild(img);

    card.appendChild(info);

    cardContainer.appendChild(card);
  });
}

function initializeLightbox() {
  const lightbox = new SimpleLightbox('.card_container a');
  lightbox.refresh();
}
