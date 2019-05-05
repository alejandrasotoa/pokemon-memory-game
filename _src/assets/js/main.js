'use strict';

const options = document.querySelector ('.main__form');
const startButton = document.querySelector ('.button__input');
const cardList = document.querySelector ('.card__list');

let difficulty = 4;
let gameCards = [];
const urlToFetch = 'https://pokeapi.co/api/v2/pokemon/';

const randomNumber = () => {
  return Math.ceil (Math.random () * 807);
};

const chooseDifficulty = event => {
  const trigger = event.target;
  if (trigger.value === undefined) {
    difficulty = trigger.getAttribute ('name');
  } else {
    difficulty = parseInt(trigger.value);
  }
};

const flipCard = event => {
  const toFlip = event.currentTarget;
  toFlip.classList.add ('hidden');
};

const createElement = array => {
  for (const item of array) {
    const cardHidden = document.createElement ('li');
    cardHidden.setAttribute ('class', 'game__item');
    cardHidden.setAttribute ('id', item.id);

    const cardBack = document.createElement ('div');
    cardBack.setAttribute ('class', 'flip__card');
    cardBack.addEventListener ('click', flipCard);

    const cardBackground = document.createElement ('div');
    cardBackground.setAttribute ('class', 'game__card');
    cardBackground.style.backgroundImage = 'url(' + item.photo + ')';

    cardHidden.appendChild (cardBack);
    cardHidden.appendChild (cardBackground);
    cardList.appendChild (cardHidden);
  }
};

const fetchPokemon = () => {
  for (let i = 0; i < difficulty; i++) {
    if (gameCards.length < difficulty) {
      const randomFetch = randomNumber ();
      fetch (`${urlToFetch}${randomFetch}`)
        .then (response => response.json ())
        .then (data => {
          
          if (
            data.sprites.front_default !== null &&
            data.sprites.back_default !== null
          ) {
            gameCards.push ({
              id: data.id,
              name: data.name,
              photo: data.sprites.front_default,
            });

            gameCards.push ({
              id: data.id,
              name: data.name,
              photo: data.sprites.back_default,
            });
          }
        });
    }
  }
};

const startGame = () => {
  cardList.innerHTML= '';
  gameCards = [];
  fetchPokemon ();
  setTimeout (() => {
    createElement (gameCards);
  }, 2000);
};

options.addEventListener ('click', chooseDifficulty);
startButton.addEventListener ('click', startGame);
