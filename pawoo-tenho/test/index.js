const mockery = require('mockery');
const path = require('path');
const {expect} = require('chai');

describe('pawoo-tenho', () => {
	let callback = null;

	before(() => {
		mockery.registerMock('../utils/pawoo.js', {
			toot: (...args) => {
				if (typeof callback === 'function') {
					callback(...args);
				}
			},
		});
	});

	beforeEach(() => {
		callback = null;
		mockery.enable({
			warnOnUnregistered: false,
		});
	});

	afterEach(() => {
		delete require.cache[path.resolve(__dirname, '../index.js')];
		mockery.disable();
	});

	it('toots something', () => {
		process.env.PAWOO_TENHO_TOKEN = 'pawoo-tenho-token';

		const promise = new Promise((resolve) => {
			callback = ({access_token, status, visibility}) => {
				expect(access_token).to.equal('pawoo-tenho-token');
				expect(status).to.be.a('string');
				expect(status).to.have.string('配牌！');
				expect(status).to.have.string('人人人');
				expect(visibility).to.equal('unlisted');

				delete process.env.PAWOO_TENHO_TOKEN;
				resolve();
			};
		});

		require('../index.js');

		return promise;
	});
});