import {
  addLike,
  deleteLike,
}
  from '../src/javascripts/likeRequests';

const fetch = require('jest-fetch-mock');

describe('Baseline tests', () => {
  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('likes correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    addLike(12341234)
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => { console.log(err); });
  });

  test('deletes like correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    deleteLike(123324)
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => { console.log(err); });
  });
});
