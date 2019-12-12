// testing all comment requests
import {
  addComment,
  editComment,
  deleteComment,
}
  from '../src/javascripts/commentRequests';

const fetch = require('jest-fetch-mock');

describe('Baseline tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('Runs the testing suite', () => {
    expect(1).toEqual(1);
  });

  test('comments correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    addComment(12341234, 'this is really cool')
      .then((res) => {
        expect(res.status).toEqual(200);
      });
  });

  test('edits comment correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    editComment(123324, 234545, 'editing works!')
      .then((res) => {
        expect(res.status).toEqual(200);
      });
  });

  test('deletes comment correctly', () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 200 }));

    deleteComment(123453, 98745)
      .then((res) => {
        expect(res.status).toEqual(200);
      });
  });
});
