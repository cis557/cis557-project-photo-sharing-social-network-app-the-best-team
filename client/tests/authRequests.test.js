// testing authentication requests
import {
  register,
  login,
  logout,
  checkAuth,
}
  from '../src/javascripts/authRequests';

const fetch = require('jest-fetch-mock');

describe('Baseline tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('Registers user correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    register('Tirtha', 'Kharel', 'tkharel@test.com', 'password', 'tkharel')
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => { console.log(err); });
  });

  test('logs user correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    login('tkharel@test.com', 'password')
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => { console.log(err); });
  });

  test('password invalid', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 400 }));

    login('tkharel@test.com', 'wrongpassword')
      .then((res) => {
        expect(res.status).toEqual(400);
      })
      .catch((err) => { console.log(err); });
  });

  test('user email does not exist', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 400 }));

    register('nonexistent@test.com', 'wrongpassword')
      .then((res) => {
        expect(res.status).toEqual(400);
      })
      .catch((err) => { console.log(err); });
  });

  test('logout', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    logout()
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => { console.log(err); });
  });

  test('user is logged in', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    checkAuth()
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => { console.log(err); });
  });

  test('user is not logged in', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 400 }));

    checkAuth()
      .then((res) => {
        expect(res.status).toEqual(400);
      })
      .catch((err) => { console.log(err); });
  });
});
