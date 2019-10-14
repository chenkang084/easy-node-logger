const Logger = require('../lib').default;

const { describe, it } = require('mocha');
const { join } = require('path');
const { existsSync } = require('fs');
const { expect } = require('chai');

describe('test logger', () => {
  it('test logger file', () => {
    const logger = new Logger({
      projectName: 'easy-node-logger',
      logFilePath: 'test.log',
      environment: 'node'
    });

    for (let i = 0; i < 2; i++) {
      logger.info('test info method');
      logger.debug('test info method');
      logger.warn('test info method');
      logger.error('test info method');
    }

    const filePath = join(__dirname, '../test.log');

    const flag = existsSync(filePath);

    expect(flag).is.equal(true);
  });
});
