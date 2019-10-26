/* global document fetch */

// TODO: Add corresponding links.

const testAuthor = 'Test Name';
const testText = 'I Love Mountains Again';
// const testImg = '../assets/Valley-Taurus-Mountains-Turkey.jpg';
const testTitle = 'Test Title';

async function generatePost(imageId) {
  const posts = document.getElementById('posts');

  const post = document.createElement('div');
  post.className = 'uk-card uk-card-default uk-card-hover uk-align-center';
  post.setAttribute('uk-scrollspy', 'cls: uk-animation-slide-left; repeat: true');
  posts.appendChild(post);

  const title = document.createElement('h3');
  title.className = 'uk-card-title uk-text-left-medium';
  title.innerHTML = testTitle;
  post.appendChild(title);

  const media = document.createElement('div');
  media.className = 'uk-card-media-top';
  post.appendChild(media);

  const img = document.createElement('img');
  // TODO: Don't hardcode this request.
  img.src = `http://localhost:3000/post/${imageId}`;
  media.appendChild(img);

  const body = document.createElement('div');
  body.className = 'uk-card-body';
  post.appendChild(body);

  const postBy = document.createElement('h3');
  postBy.className = 'uk-card-title uk-text-small';
  postBy.innerHTML = 'Posted by ';
  body.appendChild(postBy);

  const author = document.createElement('a');
  author.innerHTML = testAuthor;
  postBy.appendChild(author);

  const text = document.createElement('p');
  text.innerHTML = testText;
  body.appendChild(text);

  const likeIcon = document.createElement('a');
  likeIcon.href = '';
  likeIcon.setAttribute('uk-icon', 'heart');
  body.appendChild(likeIcon);

  const commentIcon = document.createElement('a');
  commentIcon.href = '';
  commentIcon.setAttribute('uk-icon', 'comments');
  body.appendChild(commentIcon);
}

async function generatePosts() {
  // TODO: Don't hardcode this request.
  const res = await fetch('http://localhost:3000/user');
  const user = await res.json();

  for (let i = user.posts.length - 1; i >= 0; i -= 1) {
    generatePost(user.posts[i]);
  }
}
