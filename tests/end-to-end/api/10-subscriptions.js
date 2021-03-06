/* eslint-env mocha */
/* globals expect */

import { getCredentials, api, request, credentials } from '../../data/api-data.js';

describe('[Subscriptions]', function() {
	this.retries(0);

	before(done => getCredentials(done));

	it('/subscriptions.get', (done) => {
		request.get(api('subscriptions.get'))
			.set(credentials)
			.expect('Content-Type', 'application/json')
			.expect(200)
			.expect((res) => {
				expect(res.body).to.have.property('success', true);
				expect(res.body).to.have.property('update');
				expect(res.body).to.have.property('remove');
			})
			.end(done);
	});

	it('/subscriptions.get?updatedSince', (done) => {
		request.get(api('subscriptions.get'))
			.set(credentials)
			.query({
				updatedSince: new Date
			})
			.expect(200)
			.expect((res) => {
				expect(res.body).to.have.property('success', true);
				expect(res.body).to.have.property('update').that.have.lengthOf(0);
				expect(res.body).to.have.property('remove').that.have.lengthOf(0);
			})
			.end(done);
	});

	it('/subscriptions.getOne:', () => {
		let testChannel;
		it('create an channel', (done) => {
			request.post(api('channels.create'))
				.set(credentials)
				.send({
					name: `channel.test.${ Date.now() }`
				})
				.end((err, res) => {
					testChannel = res.body.channel;
					done();
				});
		});
		it('subscriptions.getOne', (done) => {
			request.get(api('subscriptions.getOne'))
				.set(credentials)
				.query({
					roomId: testChannel._id
				})
				.expect('Content-Type', 'application/json')
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property('success', true);
					expect(res.body).to.have.property('subscription').and.to.be.an('object');
				})
				.end(done);
		});
	});

	describe('[/subscriptions.read]', () => {
		it('should mark public channels as read', (done) => {
			request.post(api('subscriptions.read'))
				.set(credentials)
				.send({
					rid: 'foobar123-somechannel'
				})
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property('success', true);
				})
				.end(done);
		});

		it('should mark groups as read', (done) => {
			request.post(api('subscriptions.read'))
				.set(credentials)
				.send({
					rid: 'foobar123-somegroup'
				})
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property('success', true);
				})
				.end(done);
		});

		it('should mark DMs as read', (done) => {
			request.post(api('subscriptions.read'))
				.set(credentials)
				.send({
					rid: 'foobar123-somedm'
				})
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.property('success', true);
				})
				.end(done);
		});

		it('should fail on invalid params', (done) => {
			request.post(api('subscriptions.read'))
				.set(credentials)
				.send({
					rid: 12345
				})
				.expect(400)
				.expect((res) => {
					expect(res.body).to.have.property('success', false);
					expect(res.body).to.have.property('error');
				})
				.end(done);
		});

		it('should fail on empty params', (done) => {
			request.post(api('subscriptions.read'))
				.set(credentials)
				.send({})
				.expect(400)
				.expect((res) => {
					expect(res.body).to.have.property('success', false);
					expect(res.body).to.have.property('error');
				})
				.end(done);
		});
	});
});
