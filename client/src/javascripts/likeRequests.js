/* globals fetch */

import { api } from '../api';

async function addLike(postId) {
  return fetch(`${api.url}/like`,
    {
      method: 'POST',
      body: JSON.stringify({
        postId,
        method: 'add',
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

async function deleteLike(postId) {
  return fetch(`${api.url}/like`,
    {
      method: 'POST',
      body: JSON.stringify({
        postId,
        method: 'remove',
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
  addLike,
  deleteLike,
};
