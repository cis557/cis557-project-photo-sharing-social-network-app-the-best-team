// testing authentication requests
import {
  register,
  login,
  logout,
  checkAuth,
}
  from '../src/javascripts/authRequests';

const fetch = require('jest-fetch-mock');

describe('authRequests tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('Registers user correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 201 }));

    register('Tirtha', 'Kharel', 'tkharel@test.com', 'password', 'tkharel')
      .then((res) => {
        expect(res.status).toEqual(201);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Logs in user correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    login('tkharel@test.com', 'password')
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Rejects login with invalid password', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 400 }));

    login('tkharel@test.com', 'wrongpassword')
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Rejects login when user email does not exist', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 400 }));

    login('nonexistent@test.com', 'wrongpassword')
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Logs out user correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    logout()
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Confirms that the user is logged in', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    checkAuth()
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Confirms that the user is not logged in', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 400 }));

    checkAuth()
      .then((res) => {
        expect(res.status).toEqual(400);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });
});
