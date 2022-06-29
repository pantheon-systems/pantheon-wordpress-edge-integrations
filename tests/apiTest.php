<?php
/**
 * Test Suite for Edge Integrations API.
 *
 * @package Pantheon\EdgeIntegrations
 */

namespace Pantheon\EI\WP\API;

use Ironbound\WP_REST_API\SchemaValidator;
use Pantheon\EI\WP;
use Pantheon\EI\WP\Geo;
use Pantheon\Ei\WP\Interest;
use WP_REST_Request;
use WP_UnitTestCase;

/**
 * Main test class for WordPress Edge Integrations plugin API.
 */
class apiTests extends WP_UnitTestCase {
	public function setUp() : void {
		add_action( 'plugins_loaded', function() {
			$middleware = new SchemaValidator\Middleware( 'pantheon/v1', [
				'methodParamDescription' => __( 'HTTP method to get the schema for. If not provided, will use the base schema.', 'text-domain' ),
				'schemaNotFound'         => __( 'Schema not found.', 'text-domain' ),
			] );
			$middleware->initialize();
		} );
		parent::setUp();
		self::maybe_create_terms();
	}

	/**
	 * Create terms if we need them.
	 */
	private function maybe_create_terms() {
		$terms = get_terms( [
			'taxonomy'   => 'category',
			'hide_empty' => false,
		] );

		// Don't create more terms if we already have at least 10.
		if ( count( $terms ) < 10 ) {
			$this->factory->category->create_many( 10 );
		}
	}

	/**
	 * Quick wrapper around the WP_REST_Request class.
	 */
	private function get_api_response( $endpoint = '', $query_params = [] ) {
		$request = new WP_REST_Request( 'GET', '/' . API_NAMESPACE . $endpoint );
		if ( ! empty( $query_params ) ) {
			$request->set_query_params( $query_params );
		}
		return rest_do_request( $request );
	}

	/**
	 * Test the available segments function.
	 *
	 * @covers Pantheon\EI\WP\API\get_available_segments
	 * @covers Pantheon\EI\WP\API\get_segments_schema
	 * @covers Pantheon\EI\WP\API\get_segment_descriptions
	 * @group wp-api
	 */
	public function testGetSegments() {
		$available_segments = get_available_segments();
		$schema = get_segments_schema();
		$this->assertEquals( $schema['type'], gettype( $available_segments ) );
		$this->assertNotEmpty( $available_segments );
		$this->assertEquals( 2, count( $available_segments ) );

		foreach ( $available_segments as $segment ) {
			$this->assertArrayHasKey( 'name', $segment );
			$this->assertEquals( $schema['properties']['name']['type'], gettype( $segment['name'] ) );
			$this->assertArrayHasKey( 'description', $segment );
			$this->assertEquals( $schema['properties']['description']['type'], gettype( $segment['description'] ) );
			$this->assertArrayHasKey( 'route', $segment );
			$this->assertEquals( $schema['properties']['route']['type'], gettype( $segment['route'] ) );
		}
	}

	/**
	 * Test the geo segments function.
	 *
	 * @covers Pantheon\EI\WP\API\get_geo_segments
	 * @covers Pantheon\EI\WP\API\get_geo_segments_schema
	 * @group wp-api
	 */
	public function testGetGeoSegments() {
		$segments = get_geo_segments();
		$schema = get_geo_segments_schema();
		$allowed_values = array_filter( Geo\get_geo_allowed_values() );
		$supported_headers = array_map( function( $header ) {
			return strtolower( str_replace( 'P13n-Geo-', '', $header ) );
		}, WP\get_supported_vary_headers() );

		$this->assertEquals( $schema['type'], gettype( $segments ) );
		$this->assertNotEmpty( $segments );
		$this->assertEquals( count( $allowed_values ), count( $segments ) );

		foreach ( $segments as $segment ) {
			$this->assertEquals( 'object', gettype( $segment ) );
			if ( in_array( $segment->name, $supported_headers, true ) ) {
				$this->assertTrue( $segment->enabled );
			} else {
				$this->assertFalse( $segment->enabled );
			}
		}
	}

	/**
	 * Test the interest segments.
	 *
	 * @covers Pantheon\EI\WP\API\get_interest_segments
	 * @covers Pantheon\EI\WP\API\get_interest_segments_schema
	 * @group wp-api
	 */
	public function testGetInterestsSegments() {
		$terms = get_terms( [
			'taxonomy' => 'category',
			'hide_empty' => false,
			'fields' => 'id=>name',
		] );
		$segments = get_interests_segments();
		$schema = get_interests_segments_schema();

		$this->assertEquals( $schema['type'], gettype( $segments ) );
		$this->assertNotEmpty( $segments );
		$this->assertEquals( count( $terms ), count( $segments ) );

		foreach ( $segments as $segment ) {
			$this->assertEquals( 'object', gettype( $segment ) );
			// Check that the term name is in the array of terms.
			$this->assertContains( $segment->name, $terms );
			$this->assertEquals( $schema['properties']['name']['type'], gettype( $segment->name ) );
			// Check that the term_id is in the array of terms.
			$this->assertArrayHasKey( $segment->id, $terms );
			$this->assertEquals( $schema['properties']['id']['type'], gettype( $segment->id ) );
			$this->assertEquals( 'category', $segment->type );
			$this->assertEquals( $schema['properties']['type']['type'], gettype( $segment->type ) );
		}
	}

	/**
	 * Test the config endpoint.
	 *
	 * @covers Pantheon\EI\WP\API\get_config
	 * @covers Pantheon\EI\WP\API\get_config_schema
	 * @group wp-api
	 */
	public function testGetConfig() {
		$config = get_config();
		$schema = get_config_schema();
		$vary_headers = WP\get_supported_vary_headers();
		$version = PANTHEON_EDGE_INTEGRATIONS_VERSION;

		// Check the schema.
		$this->assertEquals( $schema['type'], gettype( $config ) );
		$this->assertEquals( $schema['properties']['namespace']['type'], gettype( $config->namespace ) );
		$this->assertEquals( $schema['properties']['routes']['type'], gettype( $config->routes ) );
		$this->assertEquals( $schema['properties']['vary_headers']['type'], gettype( $config->vary_headers ) );
		$this->assertEquals( $schema['properties']['version']['type'], gettype( $config->version ) );

		$this->assertEquals( $version, $config->version );
		$this->assertEquals( $vary_headers, $config->vary_headers );
		$this->assertEquals( API_NAMESPACE, $config->namespace );
		$this->assertEquals( 5, count( $config->routes ) );

		// Check the routes.
		foreach ( $config->routes as $name => $route ) {
			$this->assertEquals( $schema['properties']['routes']['items']['type'], gettype( $route ) );
			$this->assertEquals( get_rest_url() . $name, $route->_link );
		}
	}

	/**
	 * Test the allowed geo config endpoint
	 *
	 * @covers Pantheon\EI\WP\API\get_allowed_geo_config_schema
	 * @group wp-api
	 */
	public function testGeoAllowedConfig() {
		$schema = get_geo_allowed_config_schema();
		$response = $this->get_api_response( '/config/geo/allowed' );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( Geo\get_geo_allowed_headers(), $response->data );
	}
}
