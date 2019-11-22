/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

// TODO: Clean up the vanilla/jQuery mixing in this file.

let user;

function clickLikeButton(e) {
  e.preventDefault();
  const cls = $(this).attr('class');
  if (cls.includes('not-liked')) {
    $(this).removeAttr('class');
    $(this).attr('class', 'fas fa-heart liked');
    const postId = $(this).attr('postId');
    $.post(`/like/${postId}`, function success(data) {
      if (data.code !== 200) {
        $(this).removeAttr('class');
        $(this).attr('class', 'far fa-heart not-liked');
      }
    });
  } else {
    $(this).removeAttr('class');
    $(this).attr('class', 'far fa-heart not-liked');
    const postId = $(this).attr('postId');
    $.ajax({
      url: `/like/${postId}`,
      type: 'DELETE',
      success: function success(data) {
        if (data.code !== 200) {
          $(this).removeAttr('class');
          $(this).attr('class', 'fas fa-heart liked');
        }
      },
    });
  }
}

function clickAddCommentButton(e) {
  e.preventDefault();

  const postId = $(this).attr('postId');
  const commentInput = document.getElementById(`commentInput-${postId}`);

  if (commentInput.value === '') {
    return;
  }

  $.ajax({
    url: `/comment/${postId}`,
    type: 'POST',
    data: {
      text: commentInput.value,
    },
    success: function success() {
      updatePostComments(postId);
    },
  });

  commentInput.value = '';
}

function clickDeleteCommentButton(e) {
  e.preventDefault();

  const postId = $(this).attr('postId');
  const commentId = $(this).attr('commentId');
  const username = $(this).attr('username');

  if (username !== user.username) {
    return;
  }

  $.ajax({
    url: `/comment/${postId}/${commentId}`,
    type: 'DELETE',
    success: function success() {
      updatePostComments(postId);
    },
  });
}

async function updatePostComments(postId) {
  const commentsContainer = document.getElementById(`commentsContainer-${postId}`);

  let child = commentsContainer.lastElementChild;

  while (child) {
    commentsContainer.removeChild(child);
    child = commentsContainer.lastElementChild;
  }

  const postRes = await fetch(`/post/${postId}`);
  const postJson = await postRes.json();

  for (let j = 0; j < postJson.comments.length; j += 1) {
    const comment = document.createElement('div');
    comment.setAttribute('postId', postId);
    comment.setAttribute('class', 'comment');
    comment.innerHTML = `${postJson.comments[j].username}: ${postJson.comments[j].text}`;
    commentsContainer.appendChild(comment);

    if (postJson.comments[j].username === user.username) {
      const deleteButton = document.createElement('input');
      deleteButton.setAttribute('type', 'button');
      deleteButton.setAttribute('postId', postId);
      deleteButton.setAttribute('commentId', postJson.comments[j]._id);
      deleteButton.setAttribute('username', user.username);
      deleteButton.setAttribute('value', 'X');
      deleteButton.onclick = clickDeleteCommentButton;
      commentsContainer.appendChild(deleteButton);
    }
  }
}

async function generatePost(i) {
  const posts = $('#posts');

  const postId = user.posts[i];
  const postRes = await fetch(`/post/${postId}`);
  const postJson = await postRes.json();

  const post = $('<div></div>')
    .attr('class', 'uk-card uk-card-default uk-card-hover uk-align-center')
    .attr('uk-scrollspy', 'cls: uk-animation-fade; repeat: true');
  posts.append(post);

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
    .attr('postId', postId)
    .attr('class', 'far fa-heart not-liked')
    .click(clickLikeButton);
  $.get(`/like/${postId}`, (data) => {
    if (data.includes(user.email)) {
      likeIcon.removeAttr('class');
      likeIcon.attr('class', 'fas fa-heart liked');
    }
  });
  body.append(likeIcon);

  const commentInput = $('<textarea></textarea>')
    .attr('id', `commentInput-${postId}`);
  body.append(commentInput);

  const commentSubmit = $('<input></input>')
    .attr('type', 'button')
    .attr('value', 'Submit')
    .attr('postId', postId)
    .click(clickAddCommentButton);
  body.append(commentSubmit);

  const commentsContainer = $('<div></div>')
    .attr('id', `commentsContainer-${postId}`);
  body.append(commentsContainer);

  updatePostComments(postId);
}

const generatePosts = async function generatePosts() {
  const res = await fetch('/user');
  user = await res.json();

  for (let i = user.posts.length - 1; i >= 0; i -= 1) {
    generatePost(i);
  }
};

$(document).ready(() => {
  generatePosts();
});
