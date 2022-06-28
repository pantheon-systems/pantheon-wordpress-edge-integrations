<?php
/**
 * Test Suite for Edge Integrations API.
 *
 * @package Pantheon\EdgeIntegrations
 */

namespace Pantheon\EI\WP\API;

use PHPUnit\Framework\TestCase;
USE WP_REST_Request;

/**
 * Main test class for WordPress Edge Integrations plugin API.
 */
class apiTests extends TestCase {
	/**
	 * Quick wrapper around the WP_REST_Request class.
	 */
	private function get_api_request( $endpoint = API_NAMESPACE ) {
		return new WP_REST_Request( 'GET', $endpoint );
	}

	/**
	 * Test the available segments function.
	 *
	 * @group wp-api
	 */
	public function testGetAvailableSegments() {
		$available_segments = get_available_segments();
		$this->assertIsArray( $available_segments );
		$this->assertNotEmpty( $available_segments );
		$this->assertEquals( 2, count( $available_segments ) );
	}
}
