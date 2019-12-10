/* globals fetch */

import { api } from '../api';

async function addPost(title, description, privacy, image, tags) {
  // eslint-disable-next-line no-undef
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('privacy', privacy);
  formData.append('image', image);
  formData.append('tags', tags);

  return fetch(`${api.url}/addPost`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      mode: 'cors',
    });
}

async function editPost(postId, title, description) {
  return fetch(`${api.url}/editPost`,
    {
      method: 'POST',
      body: JSON.stringify({
        postId,
        title,
        description,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Accept: 'application/json; charset=UTF-8',
      },
      credentials: 'include',
      mode: 'cors',
    });
}

async function getPost(postId) {
  return fetch(`${api.url}/getPost/${postId}`,
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

async function getFeed() {
  return fetch(`${api.url}/getFeed`,
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

async function getLikes() {
  return fetch(`${api.url}/getLikes`,
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

async function deletePost(postId) {
  return fetch(`${api.url}/deletePost`,
    {
      method: 'POST',
      body: JSON.stringify({
        postId,
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
  addPost,
  editPost,
  getPost,
  getFeed,
  deletePost,
  getLikes,
};
