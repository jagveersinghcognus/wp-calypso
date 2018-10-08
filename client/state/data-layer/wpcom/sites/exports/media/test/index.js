/** @format */

/**
 * Internal dependencies
 */
import { http } from 'state/data-layer/wpcom-http/actions';
import { NOTICE_CREATE } from 'state/action-types';
import { setMediaExportData } from 'state/site-settings/exporter/actions';
import { fetch, onSuccess, onError, fromApi } from '../';

// we are mocking impure-lodash here, so that conciergeInitialFetchError() will contain the expected id in the tests
jest.mock( 'lib/impure-lodash', () => ( {
	uniqueId: () => 'mock-unique-id',
} ) );

describe( 'fetch()', () => {
	test( 'should dispatch the expected http action.', () => {
		const action = {
			siteId: 123,
		};
		expect( fetch( action ) ).toEqual(
			http(
				{
					method: 'GET',
					path: `/sites/${ action.siteId }/exports/media`,
					apiNamespace: 'rest/v1.1',
					query: {
						http_envelope: 1,
					},
				},
				action
			)
		);
	} );
} );

describe( 'onSuccess()', () => {
	test( 'should dispatch the action for storing the received data on success.', () => {
		const action = {
			siteId: 123,
		};
		const data = {
			mediaExportUrl: 'aaa',
		};
		expect( onSuccess( action, data ) ).toEqual( setMediaExportData( data.mediaExportUrl ) );
	} );
} );

describe( 'onError()', () => {
	test( 'should dispatch an notice action on error.', () => {
		expect( onError().type ).toEqual( NOTICE_CREATE );
	} );
} );

describe( 'fromApi()', () => {
	test( 'should convert the encapsulated data as expected.', () => {
		expect(
			fromApi( {
				media_export_url: 'aaa',
			} )
		).toEqual( {
			mediaExportUrl: 'aaa',
		} );
	} );
} );