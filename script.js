let heroContainer = document.getElementById("hero-container") ;
let searchInput = document.getElementById("user-input") ;
let searchDialogue = document.getElementById("movie-list-dialogue")
let movieListContainer = document.getElementById("movielist");
let searchBtn = document.getElementById("search-icon");
let clearSearchBtn = document.getElementById("close-icon");
let heroHeader = document.getElementById("hero-header");
let homeBtn = document.getElementById("home-btn");
let indMovieContainer = document.getElementById("ind-movie-container");

let favMovies = [];
let movie = "fast and furious";
let currentPage = "home";

document.addEventListener("DOMContentLoaded", ()=>{
    homePageMovies(movie);
    loadFavorites();
    // console.log(favMovies);
    // localStorage.clear();
})

// ---function to fetch data on search---
async function getMoviesSearch(searchItem){
    try{
    const URL = `https://omdbapi.com/?s=${searchItem}&page=1&apikey=6c932eb9`;
    const response = await fetch(`${URL}`);
    return  await response.json();}   
    catch(err){
        console.log(err);
    }
}
// ---function to fetch data on id---

async function getMoviesID(searchItem){
    try{
    const URL = `https://omdbapi.com/?i=${searchItem}&page=1&apikey=6c932eb9`;
    const response = await fetch(`${URL}`);
    return  await response.json();}   
    catch(err){
        console.log(err);
    }
}

// --- Home Page Movie Suggestion -----
async function homePageMovies(movie){
    const data =  await getMoviesSearch(movie);
    heroHeader.style.display = "flex";
    heroContainer.style.display = "flex";
    indMovieContainer.style.display = "none";

    heroHeader.textContent = "Movie Suggestions";
    if(data.Response == "True"){
        const moviesArray = data.Search;
        // console.log(moviesArray);
        heroContainer.innerHTML = "";
        // create card element 
        moviesArray.map((movie)=>{
            let movieIndex = favMovies.findIndex((val) => movie.imdbID === val.id);
            //   console.log(movieIndex);
            const cardEl = `<div class="card" data-id = "${movie.imdbID}" >
            <div class="poster" onClick = "showMovieDetails(event)"><img src="${movie.Poster}" alt="Movie Poster" class="poster-img"></div>
            <div class="movie-title" onClick = "showMovieDetails(event)"> 
                <h3 class="title">${movie.Title}</h3>
                <p class="year">Year: ${movie.Year}</p>
            </div>
            <div class="fav-btn" onClick = "addOrRemoveFav(event)">

                <button class="add-fav" style="background-color: ${movieIndex === -1 ? 'transparent' : 'salmon'}">${movieIndex === -1 ? 'Add to Favorites' : 'Remove Favorites'}</button>

            </div>
        </div>`

        heroContainer.innerHTML += cardEl;
        })
    }
    }
//adding event listener to change page from favorites to Homepage
homeBtn.addEventListener("click", function(){
    homePageMovies(movie);
    searchInput.value = ""
    currentPage = "home";
})

//Live search from input
searchInput.addEventListener("input", async function(){
    const inputValue = this.value;
    if(inputValue != ""){
        clearSearchBtn.style.display = "flex"
    }else{
        clearSearchBtn.style.display = "none"
    }
    // console.log(inputValue);
    if(inputValue.length > 1){
        liveSearch(inputValue);
}
else{
    searchDialogue.style.display = "none";
}
})

async function liveSearch(inputValue){
    console.log("Live search triggered with input:", inputValue);
    const data =  await getMoviesSearch(inputValue);
    
    if(data.Response == "True"){
        searchDialogue.style.display = "block";
        if(data.Search.length > 5){
            movieListContainer.innerHTML = "";
            const limitData = data.Search.slice(0,5);
            // console.log(limitData);
            limitData.map((movie)=>{
            const movieList = `<li class="movie" data-id = "${movie.imdbID}" onClick = "showMovieDetails(event)">
            <div class="list-image" >
                <img src="${movie.Poster}" alt="img">
            </div>
            <div class="list-movie-info">
                <h3 class="list-movie-title">${movie.Title}</h3>
                <p class="list-year">${movie.Year}</p>
            </div>
        </li>
        <hr>`
        // console.log(movieList);
            movieListContainer.innerHTML += movieList;
        })
        }
    }
}

// listener to clear search bar 
clearSearchBtn.addEventListener("click", ()=>{
    searchInput.value = "";
    movieListContainer.innerHTML = "";
    clearSearchBtn.style.display = "none"
})

// listener to make search dialogue box disapper when clicked outside of the dialogue or input box
window.addEventListener("click", (event)=>{
    console
    if(event.target.className != "form-control"  ){
        searchDialogue.style.display = "none";
    }
})

// On click of search icon button the searched movies should appear
searchBtn.addEventListener("click" , showSearchedMovies);

async function showSearchedMovies(){
    const searchedValue = searchInput.value;
    heroHeader.style.display = "flex";
    heroContainer.style.display = "flex";
    indMovieContainer.style.display = "none";

    const data =  await getMoviesSearch(searchedValue);
    if(data.Response == "True"){
        const moviesArray = data.Search;
        // console.log(moviesArray);
        heroContainer.innerHTML = ""
        heroHeader.textContent = "Searched Results";
        // create card element 
        moviesArray.map((movie)=>{
            let movieIndex = favMovies.findIndex((val) => movie.imdbID === val.id);
            const cardEl = `<div class="card" data-id = "${movie.imdbID}">
            <div class="poster" onClick = "showMovieDetails(event)"><img src="${movie.Poster}" alt="Movie Poster" class="poster-img"></div>
            <div class="movie-title" onClick = "showMovieDetails(event)">
                <h3 class="title">${movie.Title}</h3>
                <p class="year">Year: ${movie.Year}</p>
            </div>
            <div class="fav-btn" onClick = "addOrRemoveFav(event)">

                <button class="add-fav" style="background-color: ${movieIndex === -1 ? 'transparent' : 'salmon'}">${movieIndex === -1 ? 'Add to Favorites' : 'Remove Favorites'}</button>

            </div>
        </div>`

        heroContainer.innerHTML += cardEl;
        })

    }   
}

// Add  or remove movie to favorites
function addOrRemoveFav(event){
    const cardEL = event.target.closest('.card');
    console.log(cardEL);

    const posterElement = cardEL.querySelector('.poster-img');
      const posterSrc = posterElement.src;
      console.log(posterSrc);

      // Access other details as needed
      const titleEL = cardEL.querySelector('.title').innerText;
      const yearEL = cardEL.querySelector('.year').innerText;


    const imdbId = cardEL.dataset.id;

    // console.log(imdbId);
    const movieIndex = favMovies.findIndex(movie => 
        movie.id === imdbId 
        // movie.title === titleEL &&
        // movie.year === yearEL &&
        // movie.poster === posterSrc
      );

    console.log(movieIndex);
    if(movieIndex == -1){
        favMovies.push({id:imdbId, title: titleEL, year:yearEL, poster: posterSrc});
        event.target.style.backgroundColor = "salmon";
        event.target.closest('.add-fav').textContent = "Remove Favourites";
    }else{
        event.target.style.backgroundColor = "transparent";
        event.target.closest('.add-fav').textContent = "Add Favourites";
        favMovies.splice(movieIndex, 1);
        if(currentPage == "favorite"){
            heroContainer.removeChild(cardEL);
        }
    }
    saveFavorites();
}
// save and get favourite movies 
function loadFavorites() {
    const storedFavorites = localStorage.getItem("favMovies");
    console.log(JSON.parse(storedFavorites));
    if (JSON.parse(storedFavorites)[0]!=null) {
        favMovies = JSON.parse(storedFavorites);
    }
}

function saveFavorites() {
    localStorage.setItem("favMovies", JSON.stringify(favMovies));
}

// Favorite movies page
 function showFavMovies(){
    heroHeader.style.display = "flex";
    heroContainer.style.display = "flex";
    indMovieContainer.style.display = "none";
    heroHeader.textContent = "Favorites";
    searchInput.value = ""
    if(favMovies.length == 0){
        heroContainer.innerHTML = `<div id="no-movie"><p>No Movie added in favorites</p></div>`
    }else{
    currentPage = "favorite";
    console.log("clicked");
    heroContainer.innerHTML ="";
        
        // create card element 
        favMovies.forEach((movie)=>{
            // let movieIndex = favMovies.indexOf({movie.imdbID});
            const cardEl = `<div class="card" data-id = "${movie.id}" >
            <div class="poster" onClick = "showMovieDetails(event)"><img src="${movie.poster}" alt="Movie Poster" class="poster-img"></div>
            <div class="movie-title" onClick = "showMovieDetails(event)">
                <h3 class="title">${movie.title}</h3>
                <p class="year">${movie.year}</p>
            </div>
            <div class="fav-btn" onClick = "addOrRemoveFav(event)">
                <button class="add-fav" style="background-color: salmon">Remove Favorites</button>
            </div>
        </div>`

        heroContainer.innerHTML += cardEl;
        })
    }}

//show Individual Movie details
async function showMovieDetails(event){
    let cardEL = event.target.closest('.card');
    if(cardEL == null){
        cardEL = event.target.closest('.movie');
    }
    
    const id = cardEL.dataset.id;
    const details = await getMoviesID(id)

    if(details.Response != "False"){
        let movieIndex = favMovies.findIndex((val) => id === val.id);
        const addEL = `<div # = "ind-movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
        <div class="fav-btn ind-fav-btn" onClick = "addOrRemoveFav(event)">
                <button class="add-fav" style="background-color: ${movieIndex === -1 ? 'transparent' : 'salmon'}">${movieIndex === -1 ? 'Add to Favorites' : 'Remove Favorites'}</button>
            </div> 
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        
    </div>`
    
    indMovieContainer.innerHTML = addEL;
    heroHeader.style.display = "none";
    heroContainer.style.display = "none";
    indMovieContainer.style.display = "flex";

    }
}

 

//Fav1;
// function addOrRemoveFavOne(event){
//     const cardEL = event.target.closest('.card');
//     const imgEl = event.target.closest('img');
//     console.log(imgEl);
//     const imdbId = cardEL.dataset.id;

//     // console.log(imdbId);
//     const movieIndex = favMovies.indexOf(imdbId);
//     // console.log(movieIndex);
//     if(movieIndex == -1){
//         favMovies.push(imdbId);
//         event.target.style.backgroundColor = "salmon";
//         event.target.closest('.add-fav').textContent = "Remove Favourites";
//     }else{
//         event.target.style.backgroundColor = "transparent";
//         event.target.closest('.add-fav').textContent = "Add Favourites";
//         favMovies.splice(movieIndex, 1);
//         if(currentPage == "favorite"){
//             heroContainer.removeChild(cardEL);
//         }
//     }
//     saveFavorites();
// }

//show fav
// async function showFavMoviesOne(){
//     heroHeader.style.display = "flex";
//     heroContainer.style.display = "flex";
//     indMovieContainer.style.display = "none";
//     heroHeader.textContent = "Favorites";
//     if(favMovies.length == 0){
//         heroContainer.innerHTML = `<div id="no-movie"><p>No Movie added in favorites</p></div>`
//     }else{
//     currentPage = "favorite";
//     console.log("clicked");
//     const moviesArray = []
//     let data;
//     heroContainer.innerHTML ="";
//     if(favMovies.length > 0){
//         await Promise.all(
//             favMovies.map(async (id) => {
//                 const data = await getMoviesID(id);
//                 if (data.Response !== "False") {
//                     moviesArray.push(data);
//                 }
//             })
//         );
//     }else{
//         console.log("No favorites")
//     }
//     console.log(moviesArray);
//     // const data =  await getMoviesID(movie);
//     if(moviesArray.length > 0){
//         // console.log(moviesArray);
        
//         // create card element 
//         moviesArray.forEach((movie)=>{
//             let movieIndex = favMovies.indexOf(movie.imdbID);
//             const cardEl = `<div class="card" data-id = "${movie.imdbID}"onClick = "showMovieDetails(event)" >
//             <div class="poster"><img src="${movie.Poster}" alt="Movie Poster" class="poster-img"></div>
//             <div class="movie-title">
//                 <h3 class="title">${movie.Title}</h3>
//                 <p class="year">Year: ${movie.Year}</p>
//             </div>
//             <div class="fav-btn" onClick = "addOrRemoveFav(event)">

//                 <button class="add-fav" style="background-color: ${movieIndex === -1 ? 'transparent' : 'salmon'}">${movieIndex === -1 ? 'Add to Favorites' : 'Remove Favorites'}</button>

//             </div>
//         </div>`

//         heroContainer.innerHTML += cardEl;
//         })
// }
//     }}
