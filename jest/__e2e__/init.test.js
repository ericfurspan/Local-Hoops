import detox, { device } from 'detox';
import adapter from 'detox/runners/jest/adapter';
import { authTests } from './auth';
import { sanityTests } from './sanity';
import { teardown } from './teardown';

const adapter = require('detox/runners/jest/adapter');
const detoxConfig = require('../../package.json').detox;

// Set the default timeout
jest.setTimeout(120000);
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  await detox.init(detoxConfig, { launchApp: false, initGlobals: false });
  await device.launchApp({ permissions: { notifications: 'YES', location: 'always' } });
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
