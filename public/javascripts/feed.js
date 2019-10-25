/* global document */

// TODO: Add corresponding links.

const testAuthor = 'Test Name';
const testText = 'I Love Mountains Again';
const testImg = '../assets/Valley-Taurus-Mountains-Turkey.jpg';
const testTitle = 'Test Title';

function generateNewCard(author, text, img, title) {
  const cards = document.getElementById('cards');

  const card = document.createElement('div');
  card.setAttribute('class', 'uk-card uk-card-default uk-card-hover uk-align-center');
  card.setAttribute('uk-scrollspy', 'cls: uk-animation-slide-left; repeat: true');

  const postTitle = document.createElement('h3');
  postTitle.setAttribute('class', 'uk-card-title uk-text-left-medium');
  postTitle.innerHTML = title;

  card.appendChild(postTitle);

  const cardMedia = document.createElement('div');
  cardMedia.setAttribute('class', 'uk-card-media-top');

  const cardImg = document.createElement('img');
  cardImg.setAttribute('src', img);

  cardMedia.appendChild(cardImg);
  card.appendChild(cardMedia);

  // ####Card Body####

  const cardBody = document.createElement('div');
  cardBody.setAttribute('class', 'uk-card-body');

  // Posted By Info
  const postBy = document.createElement('h3');
  postBy.setAttribute('class', 'uk-card-title uk-text-small');
  const Author = document.createElement('a');
  postBy.innerHTML = 'Posted by ';
  // Dynamic
  Author.innerHTML = author;

  postBy.appendChild(Author);
  cardBody.appendChild(postBy);

  const textContent = document.createElement('p');

  // Dynamic
  textContent.innerHTML = text;
  cardBody.appendChild(textContent);

  const likeIcon = document.createElement('a');
  likeIcon.setAttribute('href', '');
  likeIcon.setAttribute('uk-icon', 'heart');
  const commentsIcon = document.createElement('a');
  commentsIcon.setAttribute('href', '');
  commentsIcon.setAttribute('uk-icon', 'comments');

  cardBody.appendChild(likeIcon);
  cardBody.appendChild(commentsIcon);

  card.appendChild(cardBody);
  cards.appendChild(card);
}

function testGenerateNewCards() {
  generateNewCard(testAuthor, testText, testImg, testTitle);
  generateNewCard(testAuthor, testText, testImg, testTitle);
  generateNewCard(testAuthor, testText, testImg, testTitle);
}
