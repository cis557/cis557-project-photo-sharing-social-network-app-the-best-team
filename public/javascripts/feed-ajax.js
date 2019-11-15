/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const testTitle = 'Placeholder post title';
const testAuthor = 'Placeholder post author';
const testText = 'Placeholder post text';

const generatePost = async function generatePost(imgId, email) {
  const posts = $('#posts');

  const post = $('<div></div>')
    .attr('class', 'uk-card uk-card-default uk-card-hover uk-align-center')
    .attr('uk-scrollspy', 'cls: uk-animation-fade; repeat: true');

  const title = $('<h3></h3>')
    .attr('class', 'uk-card-title uk-text-left-medium')
    .html(testTitle);
  post.append(title);

  const media = $('<div></div>')
    .attr('class', 'uk-card-media-top');
  post.append(media);

  const img = $('<img></img>')
    .attr('src', `/post/${imgId}`);
  media.append(img);

  const body = $('<div></div>')
    .attr('class', 'uk-card-body');
  post.append(body);

  const postBy = $('<h3></h3>')
    .attr('class', 'uk-card-title uk-text-small')
    .html('Posted by ');
  body.append(postBy);

  const author = $('<a></a>')
    .html(testAuthor);
  postBy.append(author);

  const text = $('<p></p>')
    .html(testText);
  body.append(text);

  const likeIcon = $('<i></i>')
    .attr('id', imgId)
    .attr('class', 'far fa-heart not-liked')
    .click(function click() {
      const cls = $(this).attr('class');
      if (cls.includes('not-liked')) {
        $(this).removeAttr('class');
        $(this).attr('class', 'fas fa-heart liked');
        const id = $(this).attr('id');
        $.post(`/like/${id}`, function success(data) {
          if (data.code !== 200) {
            $(this).removeAttr('class');
            $(this).attr('class', 'far fa-heart not-liked');
          }
        });
      } else {
        $(this).removeAttr('class');
        $(this).attr('class', 'far fa-heart not-liked');
        const id = $(this).attr('id');
        $.ajax({
          url: `/like/${id}`,
          type: 'DELETE',
          success: function success(data) {
            if (data.code !== 200) {
              $(this).removeAttr('class');
              $(this).attr('class', 'fas fa-heart liked');
            }
          },
        });
      }
    });
  $.get(`/like/${imgId}`, (data) => {
    if (data.includes(email)) {
      likeIcon.removeAttr('class');
      likeIcon.attr('class', 'fas fa-heart liked');
    }
  });
  body.append(likeIcon);

  const commentIcon = $('<a></a>')
    .attr('uk-icon', 'comments');
  body.append(commentIcon);

  posts.append(post);
};

const generatePosts = async function generatePosts() {
  const res = await fetch('/user');
  const user = await res.json();

  for (let i = user.posts.length - 1; i >= 0; i -= 1) {
    generatePost(user.posts[i], user.email);
  }
};

$(document).ready(() => {
  generatePosts();
});
