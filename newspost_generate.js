//In future we need to add corresponding links

var author = "Test Name";
var textInput = "I Love Mountains Again";
var imgInput = 'Valley-Taurus-Mountains-Turkey.jpg';
var titleInput = 'Test Title';


function generateNewCard(author, textInput, imgInput, titleInput){
    let cards = document.getElementById('cards');

    let card = document.createElement('div');
    card.setAttribute('class','uk-card uk-card-default uk-card-hover uk-align-center');
    card.setAttribute('uk-scrollspy', "cls: uk-animation-slide-left; repeat: true");

    let postTitle = document.createElement('h3');
    postTitle.setAttribute('class','uk-card-title uk-text-left-medium')
    postTitle.innerHTML = titleInput;

    card.appendChild(postTitle);

    let cardMedia = document.createElement('div');
    cardMedia.setAttribute('class','uk-card-media-top');

    let cardImg = document.createElement('img');
    cardImg.setAttribute('src', imgInput)

    cardMedia.appendChild(cardImg);
    card.appendChild(cardMedia);

    //####Card Body####

    let cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'uk-card-body');

    //Posted By Info
    let postBy = document.createElement('h3');
    postBy.setAttribute("class","uk-card-title uk-text-small");
    let Author = document.createElement('a');
    postBy.innerHTML = "Posted by ";
    //Dynamic
    Author.innerHTML = author;

    postBy.appendChild(Author);
    cardBody.appendChild(postBy);

    let textContent = document.createElement('p');

    //Dynamic
    textContent.innerHTML = textInput;
    cardBody.appendChild(textContent);

    let likeIcon = document.createElement('a')
    likeIcon.setAttribute("href", "");
    likeIcon.setAttribute("uk-icon","heart");
    let commentsIcon = document.createElement('a')
    commentsIcon.setAttribute("href", "");
    commentsIcon.setAttribute("uk-icon","comments");

    cardBody.appendChild(likeIcon);
    cardBody.appendChild(commentsIcon);

    card.appendChild(cardBody);
    cards.appendChild(card);

}

//Give it a try
generateNewCard(author, textInput, imgInput, titleInput);
generateNewCard(author, textInput, imgInput, titleInput);
generateNewCard(author, textInput, imgInput, titleInput);