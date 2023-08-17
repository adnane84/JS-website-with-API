// In this project I'll be usin TMDB API

const API_KEY = 'api_key=25d7a4f7203b32938357da0d8406b6ec';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;


const genres = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  }
];

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
const add = document.querySelector(".btn");


let selectedGenre = [];
let favoriteList = [];

setGenre();

function setGenre() {
  tagsEl.innerHTML = '';
  genres.forEach(genre => {
    const t = document.createElement('div');
    t.classList.add('tag');
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener('click', () => {
       if(selectedGenre.length == 0) {
         selectedGenre.push(genre.id)
       } else {
         if(selectedGenre.includes(genre.id)){
           selectedGenre.forEach((id, idx) => {
             if(id == genre.id) {
               selectedGenre.splice(idx, 1);
             }
           })
         } else {
          selectedGenre.push(genre.id);
         }
       }
       console.log(selectedGenre)
       getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')));
       highlightSelection();
      
    })
  
    tagsEl.append(t);
  })
  
};

function highlightSelection() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.classList.remove('highlight');
  })
  clearBtn();
  if(selectedGenre.length !== 0) {
    selectedGenre.forEach(id => {
        const highlightedTag = document.getElementById(id);
        highlightedTag.classList.add('highlight');
    })
  }
};

function clearBtn() {
  let clearBtn = document.getElementById('clear');
  if(clearBtn){
     clearBtn.classList.add('highlight')
  } else {
    let clear = document.createElement('div');
    clear.classList.add('tag', 'highlight');
    clear.id = 'clear';
    clear.innerText = 'Clear X';
    clear.addEventListener('click', () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    })
    tagsEl.append(clear);
  }
};



getMovies(API_URL);

function getMovies(url) {

  fetch(url).then(res => res.json()).then(data => {
    console.log(data.results)
    if(data.results !== 0) {
    showMovies(data.results);
    } else {
    main.innerHTML = `<h1 class="no-result">No Results Found</h1>`
    }

  })

};


function showMovies(data) {
  main.innerHTML = '';

  data.forEach(movie => {
    const {title, poster_path, vote_average, overview, id} = movie;
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `<img src="${IMG_URL + poster_path}" alt="${title}">

    <div class="movie-info">
      <h3>${title}</h3>
      <span class="${getColor(vote_average)}">${vote_average}</span>
    </div>

  <div class="overview">
    
    <h3>${title}</h3>
    <button class="btn" id="${id}">ADD TO FAV</button>
    ${overview}
  </div>`

  main.appendChild(movieEl);
 

  });


}


// To add a favorite button:
// Add a button in the card and link an event listener.

// In the event listener, take the movie object and add to local storage.

// To show te favorites, take the objects form the local storage and display them.





function getColor(vote) {
  if(vote >= 8) {
    return 'green'
  } else if (vote >= 5) {
    return 'orange'
  } else {
    return 'red'
  }
}


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(searchURL + '&query=' + searchTerm)
  } else {
    getMovies(API_URL);
  }
})