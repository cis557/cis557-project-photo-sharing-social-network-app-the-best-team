/* globals fetch */

import { api } from '../api';

export default async function testAPI() {
  return fetch(`${api.url}/testAPI`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}
