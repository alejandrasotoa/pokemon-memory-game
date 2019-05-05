'use strict';

const options = document.querySelector ('.main__form');
const startButton = document.querySelector ('.button__input');
const cardList = document.querySelector ('.card__list');
const feedback = document.querySelector ('.main__feedback');
const hiddenCards = document.querySelectorAll ('.hidden');

let difficulty = 4;
let gameCards = [];
const urlToFetch = 'https://pokeapi.co/api/v2/pokemon/';

let cardsChoice = [];
let winners = [];

const createFeedback = feedbackText => {
  const title = document.createElement ('h2');
  title.setAttribute ('class', 'text__feedback');
  const text = document.createTextNode (feedbackText);
  title.appendChild (text);
  feedback.appendChild (title);
};

const randomNumber = () => {
  return Math.ceil (Math.random () * 807);
};

const chooseDifficulty = event => {
  const trigger = event.target;
  if (trigger.value === undefined) {
    difficulty = parseInt (trigger.getAttribute ('name'));
  } else {
    difficulty = parseInt (trigger.value);
  }
};

const checkCards = (array, dataID) => {
  const searchCard = array.find (card => card === dataID);
  if (searchCard === undefined) {
    return false;
  } else {
    return true;
  }
};

const unflipCards = array => {
  for (const hiddenCard of array) {
    hiddenCard.classList.remove ('hidden');
  }
};

const flipCard = event => {
  feedback.innerHTML = '';
  const toFlip = event.currentTarget;
  const containerFlip = toFlip.parentElement;
  toFlip.classList.add ('hidden');
  const currentChoice = parseInt (containerFlip.getAttribute ('id'));

  const check = checkCards (cardsChoice, currentChoice);
  console.log (cardsChoice);
  if (cardsChoice.length === 0) {
    cardsChoice.push (currentChoice);
  } else if (check === true) {
    createFeedback ('¡Has encontrado una pareja!');
    const hiddenCards = document.querySelectorAll ('.hidden');
    for (const hiddenCard of hiddenCards) {
      hiddenCard.classList.add ('found__card');
      hiddenCard.classList.remove ('hidden');
    }
    winners = [...cardsChoice];
    cardsChoice = [];
  } else {
    createFeedback ('Intentalo de nuevo');
    const hiddenCards = document.querySelectorAll ('.hidden');
    setTimeout (() => {
      unflipCards (hiddenCards);
    }, 2000);

    cardsChoice.push (currentChoice);
    cardsChoice = [];
  }
};

const shuffle = array => {
  array.sort (() => Math.random () - 0.5);
  return array;
};

const createElement = (array, max) => {
  const newArray = array.slice (0, max);
  const arrayShuffle = shuffle (newArray);
  for (let i = 0; i < max; i++) {
    const cardHidden = document.createElement ('li');
    cardHidden.setAttribute ('class', 'game__item');
    cardHidden.setAttribute ('id', arrayShuffle[i].id);

    const cardBack = document.createElement ('div');
    cardBack.setAttribute ('class', 'flip__card');
    cardBack.addEventListener ('click', flipCard);

    const cardBackground = document.createElement ('div');
    cardBackground.setAttribute ('class', 'game__card');
    cardBackground.style.backgroundImage = 'url(' + arrayShuffle[i].photo + ')';

    cardHidden.appendChild (cardBack);
    cardHidden.appendChild (cardBackground);
    cardList.appendChild (cardHidden);
  }
};

const fetchPokemon = randomNumber => {
  fetch (`${urlToFetch}${randomNumber}`)
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
};

const startGame = () => {
  cardList.innerHTML = '';
  gameCards = [];
  for (let i = 0; i < difficulty; i++) {
    const randomFetch = randomNumber ();
    fetchPokemon (randomFetch);
  }
  const max = difficulty;
  setTimeout (() => {
    createElement (gameCards, max);
  }, 2500);
};

options.addEventListener ('click', chooseDifficulty);
startButton.addEventListener ('click', startGame);
