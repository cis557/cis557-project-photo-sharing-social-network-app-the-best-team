/* eslint-disable no-await-in-loop */
/* global afterAll beforeAll beforeEach expect it */

/**
 * @jest-environment jest-environment-webdriver
 */

// This file will run Selenium tests, which are not Travis-friendly.
// In order to run these Selenium tests, follow these steps:
//   1. Change the name of "index.test.js" (e.g., to "index.test-travis.js")
//   2. Change the name of this file to "index.text.js"
//   3. Run "yarn test"

const {
  Builder, By, Key, until,
} = require('selenium-webdriver');
require('selenium-webdriver/chrome');

let driver = new Builder().forBrowser('chrome').build();

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
}, 20000);

async function getPage() {
  driver.wait(until.urlIs('http://localhost:8000/index.html'));
  await driver.get('http://localhost:8000/index.html');
}

beforeEach(async () => {
  await getPage();
});

afterAll(async () => {
  await driver.quit();
}, 20000);

