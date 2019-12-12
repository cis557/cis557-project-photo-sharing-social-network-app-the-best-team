/* globals fetch */

import { api } from '../api';

async function follow(username) {
  return fetch(`${api.url}/follow`,
    {
      method: 'POST',
      body: JSON.stringify({
        username,
        method: 'follow',
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

async function unfollow(username) {
  return fetch(`${api.url}/follow`,
    {
      method: 'POST',
      body: JSON.stringify({
        username,
        method: 'unfollow',
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
  follow,
  unfollow,
};
