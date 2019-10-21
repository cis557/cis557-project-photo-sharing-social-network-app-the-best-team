/* eslint-disable no-await-in-loop */
/* global afterAll beforeAll beforeEach expect it */

/**
 * @jest-environment jest-environment-webdriver
 */

const {
  Builder, By, Key, until,
} = require('selenium-webdriver');
require('selenium-webdriver/chrome');

// const request = require('supertest');
// const app = require('../app');
const www = require('../bin/www');

let driver = new Builder().forBrowser('chrome').build();

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
}, 20000);

afterAll((done) => {
  www.server.shutdown(done);
});

async function getPage() {
  driver.wait(until.urlIs('http://localhost:3000/login'));
  await driver.get('http://localhost:3000/login');
}

beforeEach(async () => {
  await getPage();
});

afterAll(async () => {
  await driver.quit();
}, 20000);

it('Loads the login page', async () => {
  await driver.wait(until.elementLocated(By.id('heading')), 10000);
  const heading = await driver.findElement(By.id('heading'));
  expect(heading).not.toEqual(null);
}, 60000);
