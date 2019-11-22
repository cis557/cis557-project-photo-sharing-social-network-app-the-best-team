/* eslint-disable no-undef */

async function generatePost(user, i) {
  const posts = $('#posts');

  const postId = user.posts[i];
  const postRes = await fetch(`/post/${postId}`);
  const postJson = await postRes.json();

  const post = $('<div></div>')
    .attr('class', 'uk-card uk-card-default uk-card-hover uk-align-center')
    .attr('uk-scrollspy', 'cls: uk-animation-fade; repeat: true');

  const title = $('<h3></h3>')
    .attr('class', 'uk-card-title uk-text-left-medium')
    .html(postJson.title || '');
  post.append(title);

  const media = $('<div></div>')
    .attr('class', 'uk-card-media-top');
  post.append(media);

  const img = $('<img></img>')
    .attr('src', `data:image/png;base64,${btoa(String.fromCharCode.apply(null, postJson.image.data))}`);
  media.append(img);

  const body = $('<div></div>')
    .attr('class', 'uk-card-body');
  post.append(body);

  const postBy = $('<h3></h3>')
    .attr('class', 'uk-card-title uk-text-small')
    .html('Posted by ');
  body.append(postBy);

  const author = $('<a></a>')
    .html(user.username || 'anonymous');
  postBy.append(author);

  const description = $('<p></p>')
    .html(postJson.description || '');
  body.append(description);

  const likeIcon = $('<i></i>')
    .attr('id', postId)
    .attr('class', 'far fa-heart not-liked')
    .click(function click(e) {
      e.preventDefault();
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
  $.get(`/like/${postId}`, (data) => {
    if (data.includes(user.email)) {
      likeIcon.removeAttr('class');
      likeIcon.attr('class', 'fas fa-heart liked');
    }
  });
  body.append(likeIcon);

  const commentIcon = $('<a></a>')
    .attr('uk-icon', 'comments');
  body.append(commentIcon);

  posts.append(post);
}

const generatePosts = async function generatePosts() {
  const res = await fetch('/user');
  const user = await res.json();

  for (let i = user.posts.length - 1; i >= 0; i -= 1) {
    generatePost(user, i);
  }
};

$(document).ready(() => {
  generatePosts();
});
