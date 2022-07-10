let page = 1;
const apiKey = 'DEMO_KEY';
let apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${page}&api_key=${apiKey}`;
let fetchedData = [];
let localStorData = [];
const imagesContainer = document.querySelector('.images-container');
const loader = document.querySelector('.loader');
const favorites = document.querySelector('.favorites');
const loadMore = document.querySelector('.load-more');
const saveConfirmed = document.querySelector('.save-confirmed');
let isFavoriteActive = false;

favorites.addEventListener('click', () => {
  imagesContainer.innerText = '';
  if (localStorage.getItem('data')) {
    localStorData = JSON.parse(localStorage.getItem('data'));
    isFavoriteActive = true;
    createAndAppendCards(localStorData);
  }
});

loadMore.addEventListener('click', () => {
  page++;
  apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${page}&api_key=${apiKey}`;
  createLayout();
  isFavoriteActive = false;
});

const getNasaPictures = async () => {
  try {
    const response = await fetch(apiUrl);
    fetchedData = await response.json();
    return;
  } catch (error) {
    console.log(error);
  }
};

const addRemoveListener = (element) => {
  const rmFavorites = element.querySelector('.rmFav');
  isFavoriteActive
    ? rmFavorites.classList.remove('hidden')
    : rmFavorites.classList.add('hidden');
  rmFavorites.addEventListener('click', (e) => {
    const filteredData = localStorData.filter((item) => {
      console.log(item.id);
      console.log(e.target.parentElement.id);
      return item.id !== e.target.parentElement.id;
      c;
    });
    console.log(filteredData);
    localStorage.setItem('data', JSON.stringify(filteredData));
    localStorData = JSON.parse(localStorage.getItem('data'));
    createAndAppendCards(localStorData);
  });
};

const addToFavoriteListener = (element) => {
  const addFavorites = element.querySelector('.addFav');
  isFavoriteActive
    ? addFavorites.classList.add('hidden')
    : addFavorites.classList.remove('hidden');
  addFavorites.addEventListener('click', (e) => {
    localStorData.push({
      img_src:
        e.target.parentElement.parentElement.children[0].getAttribute('href'),
      earth_date: e.target.parentElement.children[4].children[0].innerText,
      rover: {
        name: e.target.parentElement.children[4].children[1].innerText.slice(6),
      },
      id: e.target.parentElement.id,
    });
    console.log(saveConfirmed);
    localStorage.setItem('data', JSON.stringify(localStorData));
    saveConfirmed.classList.toggle('hidden');
    setTimeout(() => {
      saveConfirmed.classList.toggle('hidden');
    }, 1000);
  });
};

const createAndAppendCards = (array) => {
  imagesContainer.innerText = '';
  array.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <a href=${item.img_src} title="View Full Image" target="_blank">
            <img
              src=${item.img_src}
              alt="NASA Picture of the Day"
              class="card-img-top"
            />
          </a>
          <div class="card-body" id=${
            isFavoriteActive
              ? item.id
              : 'id' + Math.random().toString(16).slice(2)
          }>
            <h5 class="card-title"></h5>
            <span class="clickable addFav">Add to Favorites</span>
            <span class="clickable rmFav">Remove</span>
            <p class="card-text">
            </p>
            <small class="text-muted">
              <strong>${item.earth_date}
              </strong>
              <span>Rover:${item.rover.name}</span>
            </small>
          </div>
    `;

    addToFavoriteListener(card);
    addRemoveListener(card);

    imagesContainer.appendChild(card);
  });
};

const createLayout = async () => {
  loader.classList.remove('hidden');
  await getNasaPictures();
  loader.classList.add('hidden');
  createAndAppendCards(fetchedData.photos);
};

// * START
createLayout();
