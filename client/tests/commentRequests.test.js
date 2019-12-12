// testing all comment requests
import {
  addComment,
  editComment,
  deleteComment,
}
  from '../src/javascripts/commentRequests';

const fetch = require('jest-fetch-mock');

describe('commentRequests tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('Adds comment correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 201 }));

    addComment(12341234, 'this is really cool')
      .then((res) => {
        expect(res.status).toEqual(201);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Edits comment correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    editComment(123324, 234545, 'editing works!')
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });

  test('Deletes comment correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    deleteComment(123453, 98745)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(fetch.mock.calls.length).toEqual(1);
      })
      .catch(() => {});
  });
});
