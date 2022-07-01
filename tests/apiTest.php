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
		$this->assertEquals( 3, count( $available_segments ) );

		foreach ( $available_segments as $segment ) {
			$this->assertArrayHasKey( 'name', $segment );
			$this->assertEquals( $schema['properties']['name']['type'], gettype( $segment['name'] ) );
			$this->assertArrayHasKey( 'description', $segment );
			$this->assertEquals( $schema['properties']['description']['type'], gettype( $segment['description'] ) );
			$this->assertArrayHasKey( 'route', $segment );
			$this->assertEquals( $schema['properties']['route']['type'], gettype( $segment['route'] ) );
		}
	}

	public function testGetConnSegments() {
		$segments = get_conn_segments();
		$schema = get_conn_segments_schema();
		$allowed_values = ['conn-speed', 'conn-type'];

		$this->assertEquals( $schema['type'], gettype( $segments ) );
		$this->assertNotEmpty( $segments );
		$this->assertEquals( 2, count( $segments ) );

		foreach ( $segments as $segment ) {
			$this->assertEquals( 'object', gettype( $segment ) );
			$this->assertTrue( in_array( $segment->name, $allowed_values, true ) );
			// Both connection segments are disabled by default.
			$this->assertFalse( $segment->enabled );
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
		// Subtract 2 from the allowed values to account for the removal of conn-speed and conn-type.
		$this->assertEquals( count( $allowed_values ) - 2, count( $segments ) );

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

	/**
	 * Test the interest cookie expiration endpoing.
	 *
	 * @covers Pantheon\EI\WP\API\get_interest_cookie_expiration_schema
	 * @group wp-api
	 */
	public function testGetInterestCookieExpiration() {
		$schema = get_interest_cookie_expiration_schema();
		$response = $this->get_api_response( '/config/interest/cookie-expiration' );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( Interest\get_cookie_expiration(), $response->data );
	}

	/**
	 * Test the interest allowed post types endpoint.
	 *
	 * @covers Pantheon\EI\WP\API\get_interest_allowed_post_types_schema
	 * @group wp-api
	 */
	public function testGetInterestAllowedPostTypes() {
		$schema = get_interest_allowed_post_types_schema();
		$response = $this->get_api_response( '/config/interest/post-types' );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( Interest\get_interest_allowed_post_types(), $response->data );
	}

	/**
	 * Test the interest allowed taxonomies endpoint.
	 *
	 * @covers Pantheon\EI\WP\API\get_interest_allowed_taxonomies_schema
	 * @group wp-api
	 */
	public function testGetInterestAllowedTaxonomies() {
		$schema = get_interest_allowed_taxonomies_schema();
		$response = $this->get_api_response( '/config/interest/taxonomies' );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( Interest\get_interest_taxonomy(), $response->data );
	}

	/**
	 * Test the interest threshold endpoint.
	 *
	 * @covers Pantheon\EI\WP\API\get_interest_threshold_schema
	 * @group wp-api
	 */
	public function testGetInterestThreshold() {
		$schema = get_interest_threshold_schema();
		$response = $this->get_api_response( '/config/interest/threshold' );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( Interest\get_interest_threshold(), $response->data );
	}

	/**
	 * Test the get all user data endpoint.
	 *
	 * @covers Pantheon\EI\WP\API\get_all_user_data
	 * @covers Pantheon\EI\WP\API\get_all_user_data_schema
	 * @group wp-api
	 */
	public function testGetAllUserData() {
		$query_params = $this->mockUserData();
		$schema = get_all_user_data_schema();
		$response = $this->get_api_response( '/user', $query_params );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( $schema['properties']['geo']['type'], gettype( $response->data->geo ) );
		$this->assertEquals( $schema['properties']['interest']['type'], gettype( $response->data->interest ) );

		// Loop through the mock data and ensure that the API response came back with the same information.
		foreach ( $query_params as $segment => $value ) {
			if ( $segment === 'interest' ) {
				$this->assertEquals( $value, $response->data->$segment );
			} else {
				$this->assertEquals( $value, $response->data->geo->$segment );
			}
		}
	}

	/**
	 * Test the user city endpoint.
	 * @covers Pantheon\EI\WP\API\get_user_data_city
	 * @covers Pantheon\EI\WP\API\get_user_data_city_schema
	 * @group wp-api
	 */
	public function testGetUserDataCity() {
		$query_params = $this->mockUserData();
		$schema = get_user_data_city_schema();
		$response = $this->get_api_response( '/user/geo/city', $query_params );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( $query_params['city'], $response->data );
	}

	/**
	 * Test the user connection type endpoint.
	 * @covers Pantheon\EI\WP\API\get_user_data_conn_speed
	 * @covers Pantheon\EI\WP\API\get_user_data_conn_speed_schema
	 * @group wp-api
	 */
	public function testUserDataConnType() {
		$query_params = $this->mockUserData();
		$schema = get_user_data_conn_type_schema();
		$response = $this->get_api_response( '/user/conn-type', $query_params );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( $query_params['conn-type'], $response->data );
	}

	/**
	 * Test the user connection speed endpoint.
	 * @covers Pantheon\EI\WP\API\get_user_data_conn_speed
	 * @covers Pantheon\EI\WP\API\get_user_data_conn_speed_schema
	 * @group wp-api
	 */
	public function testUserDataConnSpeed() {
		$query_params = $this->mockUserData();
		$schema = get_user_data_conn_speed_schema();
		$response = $this->get_api_response( '/user/conn-speed', $query_params );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( $query_params['conn-speed'], $response->data );
	}

	/**
	 * Test the user continent code endpoint.
	 * @covers Pantheon\EI\WP\API\get_user_data_continent_code
	 * @covers Pantheon\EI\WP\API\get_user_data_continent_code_schema
	 * @group wp-api
	 */
	public function testUserDataContinentCode() {
		$query_params = $this->mockUserData();
		$schema = get_user_data_continent_code_schema();
		$response = $this->get_api_response( '/user/geo/continent-code', $query_params );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( $query_params['continent-code'], $response->data );
	}

	/**
	 * Test the user country code endpoint.
	 * @covers Pantheon\EI\WP\API\get_user_data_country_code
	 * @covers Pantheon\EI\WP\API\get_user_data_country_code_schema
	 * @group wp-api
	 */
	public function testUserDataCountryCode() {
		$query_params = $this->mockUserData();
		$schema = get_user_data_country_code_schema();
		$response = $this->get_api_response( '/user/geo/country-code', $query_params );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( $query_params['country-code'], $response->data );
	}

	/**
	 * Test the user country name endpoint.
	 * @covers Pantheon\EI\WP\API\get_user_data_country_name
	 * @covers Pantheon\EI\WP\API\get_user_data_country_name_schema
	 * @group wp-api
	 */
	public function testUserDataCountryName() {
		$query_params = $this->mockUserData();
		$schema = get_user_data_country_name_schema();
		$response = $this->get_api_response( '/user/geo/country-name', $query_params );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( $query_params['country-name'], $response->data );
	}

	/**
	 * Test the user region endpoint.
	 * @covers Pantheon\EI\WP\API\get_user_data_region
	 * @covers Pantheon\EI\WP\API\get_user_data_region_schema
	 * @group wp-api
	 */
	public function testUserDataRegion() {
		$query_params = $this->mockUserData();
		$schema = get_user_data_region_schema();
		$response = $this->get_api_response( '/user/geo/region', $query_params );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( $query_params['region'], $response->data );
	}

	/**
	 * Test the user interest endpoint.
	 * @covers Pantheon\EI\WP\API\get_user_data_interest
	 * @covers Pantheon\EI\WP\API\get_user_data_interest_schema
	 * @group wp-api
	 */
	public function testUserDataInterest() {
		$query_params = $this->mockUserData();
		$schema = get_user_data_interest_schema();
		$response = $this->get_api_response( '/user/interest', $query_params );

		$this->assertNotEmpty( $response->data );
		$this->assertEquals( $schema['type'], gettype( $response->data ) );
		$this->assertEquals( $query_params['interest'], $response->data );
	}

	/**
	 * Mock some user data for tests.
	 *
	 * @return array
	 */
	private function mockUserData() : array {
		return [
			'interest' => 'foo',
			'country-code' => 'US',
			'country-name' => 'United States',
			'region' => 'CA',
			'city' => 'San Francisco',
			'continent-code' => 'NA',
			'conn-speed' => 'broadband',
			'conn-type' => 'wifi',
		];
	}
}
