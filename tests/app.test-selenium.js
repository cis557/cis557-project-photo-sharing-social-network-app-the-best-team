/* eslint-disable no-await-in-loop */
/* global afterAll beforeAll expect it */

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
const testName = 'testName';
const testEmail = 'testEmail@test.com';
const testPasswordCorrect = 'correctPassword';
const testPasswordIncorrect = 'incorrectPassword';

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
}, 20000);

afterAll(async () => {
  await www.server.shutdown();
  await driver.quit();
});

it('Loads the login page', async () => {
  driver.wait(until.urlIs('http://localhost:3000/login'));
  await driver.get('http://localhost:3000/login');

  await driver.wait(until.elementLocated(By.id('heading')), 20000);
  const heading = await driver.findElement(By.id('heading'));
  expect(heading).not.toEqual(null);
}, 60000);

it('Follows the link to the registration page', async () => {
  await driver.wait(until.elementLocated(By.id('register')), 20000);
  const register = await driver.findElement(By.id('register'));
  expect(register).not.toEqual(null);

  await register.click();

  driver.wait(until.urlIs('http://localhost:3000/register'));
  await driver.get('http://localhost:3000/register');

  await driver.wait(until.elementLocated(By.id('heading')), 20000);
  const heading = await driver.findElement(By.id('heading'));
  expect(heading).not.toEqual(null);
}, 60000);

it('Registers a new account', async () => {
  await driver.wait(until.elementLocated(By.id('name')), 20000);
  const name = await driver.findElement(By.id('name'));
  expect(name).not.toEqual(null);

  await driver.wait(until.elementLocated(By.id('email')), 20000);
  const email = await driver.findElement(By.id('email'));
  expect(email).not.toEqual(null);

  await driver.wait(until.elementLocated(By.id('password')), 20000);
  const password = await driver.findElement(By.id('password'));
  expect(password).not.toEqual(null);

  await driver.wait(until.elementLocated(By.id('submit')), 20000);
  const submit = await driver.findElement(By.id('submit'));
  expect(submit).not.toEqual(null);

  await name.sendKeys('');
  await name.sendKeys(testName);

  await email.sendKeys('');
  await email.sendKeys(testEmail);

  await password.sendKeys('');
  await password.sendKeys(testPasswordCorrect);

  await submit.click();

  driver.wait(until.urlIs('http://localhost:3000/login'));
  await driver.get('http://localhost:3000/login');

  await driver.wait(until.elementLocated(By.id('heading')), 20000);
  const heading = await driver.findElement(By.id('heading'));
  expect(heading).not.toEqual(null);
}, 60000);

it('Rejects invalid login attempt', async () => {
  await driver.wait(until.elementLocated(By.id('email')), 20000);
  const email = await driver.findElement(By.id('email'));
  expect(email).not.toEqual(null);

  await driver.wait(until.elementLocated(By.id('password')), 20000);
  const password = await driver.findElement(By.id('password'));
  expect(password).not.toEqual(null);

  await driver.wait(until.elementLocated(By.id('submit')), 20000);
  const submit = await driver.findElement(By.id('submit'));
  expect(submit).not.toEqual(null);

  await email.sendKeys('');
  await email.sendKeys(testEmail);

  await password.sendKeys('');
  await password.sendKeys(testPasswordIncorrect);

  await submit.click();

  driver.wait(until.urlIs('http://localhost:3000/login'));
  await driver.get('http://localhost:3000/login');

  await driver.wait(until.elementLocated(By.id('heading')), 20000);
  const heading = await driver.findElement(By.id('heading'));
  expect(heading).not.toEqual(null);
}, 60000);

it('Accepts valid login attempt', async () => {
  await driver.wait(until.elementLocated(By.id('email')), 20000);
  const email = await driver.findElement(By.id('email'));
  expect(email).not.toEqual(null);

  await driver.wait(until.elementLocated(By.id('password')), 20000);
  const password = await driver.findElement(By.id('password'));
  expect(password).not.toEqual(null);

  await driver.wait(until.elementLocated(By.id('submit')), 20000);
  const submit = await driver.findElement(By.id('submit'));
  expect(submit).not.toEqual(null);

  await email.sendKeys('');
  await email.sendKeys(testEmail);

  await password.sendKeys('');
  await password.sendKeys(testPasswordCorrect);

  await submit.click();

  driver.wait(until.urlIs('http://localhost:3000/feed'));
  await driver.get('http://localhost:3000/feed');

  await driver.wait(until.elementLocated(By.id('heading')), 20000);
  const heading = await driver.findElement(By.id('heading'));
  expect(heading).not.toEqual(null);

  await driver.wait(until.elementLocated(By.id('cards')), 20000);
  const cards = await driver.findElement(By.id('cards'));
  expect(cards).not.toEqual(null);
}, 60000);
