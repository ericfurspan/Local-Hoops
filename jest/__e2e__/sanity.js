const { element, by } = require('detox');
import { expect as UIExpect } from 'detox';

export const sanityTests = () => {
  it('Should render Explore map and list', async () => {
    await UIExpect(element(by.id('ExploreButton')).atIndex(0)).toBeVisible();
    await element(by.id('ExploreButton')).atIndex(0).tap();
    await UIExpect(element(by.id('ExploreMapContainer'))).toBeVisible();
    await UIExpect(element(by.id('toggleExploreViewMode'))).toExist();
    await element(by.id('toggleExploreViewMode')).tap();
    await UIExpect(element(by.id('ExploreListContainer'))).toBeVisible();
    await UIExpect(element(by.id('exitExplore'))).toExist();
    await element(by.id('exitExplore')).tap();
  });

  /*
  it('Create a new event', async () => {
    await UIExpect(element(by.id('newEvent'))).toExist();
    await element(by.id('newEvent')).tap();
    await UIExpect(element(by.id('cancelButton'))).toExist();
    await element(by.id('cancelButton')).tap();
  });
  */
  /*
  it('Should view event', async () => {
    await UIExpect(element(by.id('enterSignup'))).toBeVisible();
    await element(by.id('enterSignup')).tap();
  });

  it('Should delete event', async () => {
    await UIExpect(element(by.id('enterSignup'))).toBeVisible();
    await element(by.id('enterSignup')).tap();
  });
*/
};
