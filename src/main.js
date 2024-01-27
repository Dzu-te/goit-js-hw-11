import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '42024454-8ed2ac239bcd0125bd4fa3d9e';

const fullUrl = `${BASE_URL}?key=${API_KEY}`;
console.log(fullUrl);

function fetchImages(q) {
  return fetch(`${fullUrl}&q=${q}`).then(resp => {
    if (!resp.ok) {
      throw new Error('Network response was not ok');
    }
    return resp.json();
  });
}

const formInit = document.querySelector('.searchPhotos');
const cardContainer = document.querySelector('.card_container');

formInit.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const searchInput = formInit.elements.search;
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
    });

  searchInput.value = '';
}

function createMarkup(images) {
  console.log(images);
  cardContainer.innerHTML = '';

  images.forEach(image => {
    const card = document.createElement('a');
    card.classList.add('card');
    card.href = image.largeImageURL;

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;

    card.appendChild(img);
    cardContainer.appendChild(card);
  });
}

function initializeLightbox() {
  const lightbox = new SimpleLightbox('.card_container a');
  lightbox.refresh();
}
