/* global */

import {
  follow,
  unfollow,
}
  from '../src/javascripts/followRequests';

const fetch = require('jest-fetch-mock');

describe('followRequests tests', () => {
  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('Follows user correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    follow('tkharel')
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Unfollows user correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    unfollow('tkharel')
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });
});
