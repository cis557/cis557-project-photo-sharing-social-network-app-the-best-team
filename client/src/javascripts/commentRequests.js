/* globals fetch */

import { api } from '../api';

async function addComment(postId, text) {
  return fetch(`${api.url}/comment`,
    {
      method: 'POST',
      body: JSON.stringify({
        method: 'add',
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
  return fetch(`${api.url}/comment`,
    {
      method: 'POST',
      body: JSON.stringify({
        postId,
        commentId,
        text,
        method: 'edit',
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
  return fetch(`${api.url}/comment`,
    {
      method: 'POST',
      body: JSON.stringify({
        postId,
        commentId,
        method: 'delete',
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
