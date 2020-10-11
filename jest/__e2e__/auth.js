const { element, by } = require('detox');
import { expect as UIExpect } from 'detox';

export const authTests = () => {
  it('Should navigate to register page', async () => {
    await UIExpect(element(by.id('enterSignup'))).toBeVisible();
    await element(by.id('enterSignup')).tap();
  });

  it('Should register test@test.com', async () => {
    await UIExpect(element(by.id('registerNameInput'))).toBeVisible();
    await UIExpect(element(by.id('registerEmailInput'))).toBeVisible();
    await UIExpect(element(by.id('registerPasswordInput'))).toBeVisible();
    await UIExpect(element(by.id('registerConfirmPwInput'))).toBeVisible();
    await element(by.id('registerNameInput')).tap();
    await element(by.id('registerNameInput')).replaceText('Testy McTest');
    await element(by.id('registerEmailInput')).tap();
    await element(by.id('registerEmailInput')).replaceText('test@test.com');
    await element(by.id('registerPasswordInput')).tap();
    await element(by.id('registerPasswordInput')).replaceText('testpassword');
    await element(by.id('registerConfirmPwInput')).tap();
    await element(by.id('registerConfirmPwInput')).replaceText('testpassword');
    await element(by.id('trySignup')).tap();
    await UIExpect(element(by.id('Dashboard'))).toExist();
  });

  it('Should logout', async () => {
    await UIExpect(element(by.id('AccountButton'))).toExist();
    await element(by.id('AccountButton')).tap();
    await element(by.id('Logout')).tap();
  });

  it('Should navigate to login page', async () => {
    await UIExpect(element(by.id('enterLogin'))).toBeVisible();
    await element(by.id('enterLogin')).tap();
  });

  it('Should login test@test.com', async () => {
    await UIExpect(element(by.id('emailInput'))).toBeVisible();
    await UIExpect(element(by.id('passwordInput'))).toBeVisible();
    await element(by.id('emailInput')).tap();
    await element(by.id('emailInput')).replaceText('test@test.com');
    await element(by.id('passwordInput')).tap();
    await element(by.id('passwordInput')).replaceText('testpassword');
    await element(by.id('tryLogin')).tap();
    await UIExpect(element(by.id('Dashboard'))).toExist();
  });
};
