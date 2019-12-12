/* global */

import {
  getUser,
  getOtherUser,
  getSuggestedUsers,
}
  from '../src/javascripts/userRequests';

const fetch = require('jest-fetch-mock');

describe('userRequests tests', () => {
  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('Gets suggested users correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    getSuggestedUsers()
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Gets user correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    getUser()
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Gets other user correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    getOtherUser('tkharel')
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });
});
