/* eslint-disable no-await-in-loop */
/* global afterAll beforeAll expect it */

/**
 * @jest-environment jest-environment-webdriver
 */

const {
  Builder, By, until,
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

  await driver.wait(until.elementLocated(By.id('register')), 20000);
  const register = await driver.findElement(By.id('register'));
  expect(register).not.toEqual(null);
}, 60000);

it('Follows the link to the registration page', async () => {
  await driver.wait(until.elementLocated(By.id('register')), 20000);
  const register = await driver.findElement(By.id('register'));
  expect(register).not.toEqual(null);

  await register.click();

  driver.wait(until.urlIs('http://localhost:3000/register'));
  await driver.get('http://localhost:3000/register');

  await driver.wait(until.elementLocated(By.id('login')), 20000);
  const login = await driver.findElement(By.id('login'));
  expect(login).not.toEqual(null);
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

  await driver.wait(until.elementLocated(By.id('register')), 20000);
  const register = await driver.findElement(By.id('register'));
  expect(register).not.toEqual(null);
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

  await driver.wait(until.elementLocated(By.id('register')), 20000);
  const register = await driver.findElement(By.id('register'));
  expect(register).not.toEqual(null);
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

  await driver.wait(until.elementLocated(By.id('navbar')), 20000);
  const navbar = await driver.findElement(By.id('navbar'));
  expect(navbar).not.toEqual(null);
}, 60000);

it('Goes to the profile page', async () => {
  await driver.wait(until.elementLocated(By.id('profile')), 20000);
  const profile = await driver.findElement(By.id('profile'));
  expect(profile).not.toEqual(null);

  await profile.click();

  driver.wait(until.urlIs('http://localhost:3000/profile'));
  await driver.get('http://localhost:3000/profile');

  await driver.wait(until.elementLocated(By.id('recentPost')), 20000);
  const recentPost = await driver.findElement(By.id('recentPost'));
  expect(recentPost).not.toEqual(null);
}, 60000);
