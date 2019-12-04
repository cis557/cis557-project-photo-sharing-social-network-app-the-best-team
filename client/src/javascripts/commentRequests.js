/* globals fetch */

import { api } from '../api';

async function addComment(postId, text) {
  return fetch(`${api.url}/addComment`,
    {
      method: 'POST',
      body: JSON.stringify({
        postId,
        text,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

async function editComment(postId, commentId, text) {
  return fetch(`${api.url}/editComment`,
    {
      method: 'POST',
      body: JSON.stringify({
        postId,
        commentId,
        text,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

async function deleteComment(postId, commentId) {
  return fetch(`${api.url}/deleteComment`,
    {
      method: 'DELETE',
      body: JSON.stringify({
        postId,
        commentId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

export {
  addComment,
  editComment,
  deleteComment,
};
