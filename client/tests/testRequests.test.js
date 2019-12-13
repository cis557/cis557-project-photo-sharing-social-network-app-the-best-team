/* global */

import testAPI
  from '../src/javascripts/testRequests';

const fetch = require('jest-fetch-mock');

describe('Baseline tests', () => {
  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('API is active', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    testAPI()
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });
});
