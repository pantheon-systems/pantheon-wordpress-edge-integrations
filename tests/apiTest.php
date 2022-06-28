<?php
/**
 * Test Suite for Edge Integrations API.
 *
 * @package Pantheon\EdgeIntegrations
 */

namespace Pantheon\EI\WP\API;

use Ironbound\WP_REST_API\SchemaValidator;
use PHPUnit\Framework\TestCase;
use WP_REST_Request;

/**
 * Main test class for WordPress Edge Integrations plugin API.
 */
class apiTests extends TestCase {
	public function __construct() {
		parent::__construct();
		add_action( 'plugins_loaded', function() {
			$middleware = new SchemaValidator\Middleware( 'pantheon/v1', [
				'methodParamDescription' => __( 'HTTP method to get the schema for. If not provided, will use the base schema.', 'text-domain' ),
				'schemaNotFound'         => __( 'Schema not found.', 'text-domain' ),
			] );
			$middleware->initialize();
		} );
	}
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
	public function testGetSegments() {
		$available_segments = get_available_segments();
		$this->assertIsArray( $available_segments );
		$this->assertNotEmpty( $available_segments );
		$this->assertEquals( 2, count( $available_segments ) );
	}
}
