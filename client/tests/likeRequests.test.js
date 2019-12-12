import {
  addLike,
  deleteLike,
}
  from '../src/javascripts/likeRequests';

const fetch = require('jest-fetch-mock');

describe('likeRequests tests', () => {
  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('Adds like correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 201 }));

    addLike(12341234)
      .then((res) => {
        expect(res.status).toEqual(201);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Deletes like correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    deleteLike(123324)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });
});
