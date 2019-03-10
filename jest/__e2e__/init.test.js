const detox = require('detox');
const { device } = require('detox');
const config = require('../../package.json').detox;
const adapter = require('detox/runners/jest/adapter');
import { authTests} from './auth';
import { sanityTests } from './sanity';
import { teardown } from './teardown';

// Set the default timeout
jest.setTimeout(120000); // eslint-disable-line
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  await detox.init(config, {launchApp: false, initGlobals: false});
  await device.launchApp({permissions: {notifications: 'YES', location: 'always'}});
});

beforeEach(async () => {
  await adapter.beforeEach();
});

describe('Auth', authTests);
describe('Sanity', sanityTests);
describe('Teardown', teardown);

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});
