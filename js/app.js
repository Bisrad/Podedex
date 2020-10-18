// DOM Objects 
const displayPoke = document.querySelector('.section');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeLocation = document.querySelector('.poke-location');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.previous')
const rightButton = document.querySelector('.next')

// Create search Function for Current Pokemon ( on enters key )

// Create recently search buttons and localStorage

// clear search function 

// Constants and Variables

const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];

// Set default on url pull
let prevUrl = null;
let nextUrl = null;

// Utility Functions

// Capitalize
const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

// Reset Screen 
const resetScreen = () => {
    displayPoke.classList.remove('hide');
    for (const type of TYPES) {
        displayPoke.classList.remove(type);
    }
};

// Fetch data for search 
const fetchPokeList = url => {
    fetch(url)
    .then (res => res.json())
    .then(data => {
        const { results, previous, next } = data; // destructuring
        prevUrl = previous;
        nextUrl = next;
        // For loop through of items
        for (let i = 0; i < pokeListItems.length; i++ ) {
            const pokeListItem = pokeListItems[i];
            const resultsData = results[i];
            
            if (resultsData) {
                const { name , url } = resultsData;
                const urlArray = url.split('/');
                const id = urlArray[urlArray.length - 2]
                pokeListItem.textContent = id + '. ' + capitalize(name);
            } else {
                pokeListItem.textContent = '';
            }
        }
    });
};

// Fetch for Content 
const fetchPokeData = id => {
    // Async fetch Pokemon API 
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res =>res.json())
    .then(data => {
        // clear screen
        resetScreen();
        
        // grab data type and hide if only one type
        const dataTypes = data['types'];
        const dataFirstType = dataTypes[0];
        const dataSecondType = dataTypes[1];
        pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
        if (dataSecondType) {
            pokeTypeTwo.classList.remove('hide');
            pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
        } else {
            pokeTypeTwo.classList.add('hide');
            pokeTypeTwo.textContent = '';
        }
        // Color div according to pokemon type [1]
        displayPoke.classList.add(dataFirstType['type']['name']);
        
        // Fill other data info
        pokeName.textContent = capitalize(data['name']);
        pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
        pokeLocation.src = data['location_area_encounters'];
        console.log(data['location_area_encounters']);
        pokeFrontImage.src = data['sprites']['front_default'] || '' ; // circuit breaker
      });
    };
    
       // Handle Left button click
       const handleLeftButtonClick = () => {
        if (prevUrl) { // if Truthy
            fetchPokeList(prevUrl);
        }
    };
        
    // Handle Right button click
    const handleRightButtonClick = () => {
        if (nextUrl) { // if Truthy
            fetchPokeList(nextUrl);
        }
    };
    
    // Move to previous url on click
    const handleListItemClick = (e) => {
        if (!e.target) return;
      
        const listItem = e.target;
        if (!listItem.textContent) return; // Truthy
    
        const id = listItem.textContent.split('.')[0];
        fetchPokeData(id);
    };


// Add Event Listeners
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);

for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
}

// Initialize App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
