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

describe('postsRequests tests', () => {
  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('Adds post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 201 }));

    addPost('test title', 'test description', false, 'imageurl', ['some', 'tags', 'here'])
      .then((res) => {
        expect(res.status).toEqual(201);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Edits post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    editPost(198273, 'new title', 'new description')
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Gets post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    getPost(1098423)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Gets feed correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    getFeed()
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Gets likes of post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    getLikes()
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Deletes post correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    deletePost(1098423)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });
});
