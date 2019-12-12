/* global */

import {
  addPost,
  editPost,
  getPost,
  getFeed,
  getLikes,
  deletePost,
}
  from '../src/javascripts/postRequests';

const fetch = require('jest-fetch-mock');

describe('Baseline tests', () => {
  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('adds post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    addPost('test title', 'test description', false, 'imageurl', ['some', 'tags', 'here'])
      .then((res) => {
        expect(res.status).toEqual(200);
      });
  });

  test('edits post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    editPost(198273, 'new title', 'new description')
      .then((res) => {
        expect(res.status).toEqual(200);
      });
  });

  test('gets post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    getPost(1098423)
      .then((res) => {
        expect(res.status).toEqual(200);
      });
  });

  test('gets feed correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    getFeed()
      .then((res) => {
        expect(res.status).toEqual(200);
      });
  });

  test('gets likes of post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    getLikes()
      .then((res) => {
        expect(res.status).toEqual(200);
      });
  });

  test('deletes post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    deletePost(1098423)
      .then((res) => {
        expect(res.status).toEqual(200);
      });
  });
});
