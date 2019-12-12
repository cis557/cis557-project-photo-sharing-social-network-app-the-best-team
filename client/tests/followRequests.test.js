/* global */

import {
  follow,
  unfollow,
}
  from '../src/javascripts/followRequests';

const fetch = require('jest-fetch-mock');

describe('Baseline tests', () => {
  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('follows correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    follow('tkharel')
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => { console.log(err); });
  });

  test('unfollows correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    unfollow('tkharel')
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => { console.log(err); });
  });
});
