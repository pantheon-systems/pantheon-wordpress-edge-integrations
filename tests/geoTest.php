<?php
/**
 * Test Suite for Edge Integrations Geo.
 *
 * @package Pantheon\EdgeIntegrations
 */

use Pantheon\EI;
use Pantheon\EI\WP\Geo;
use PHPUnit\Framework\TestCase;

/**
 * Main test class for WordPress Edge Integrations plugin.
 */
class geoTests extends TestCase {
	/**
	 * Make sure get_geo exists.
	 * @group wp-geo
	 */
	public function testGetGeoExists() {
		$this->assertTrue(
			function_exists( '\\Pantheon\\EI\\WP\\Geo\\get_geo' ),
			'get_geo function does not exist'
		);
	}

	/**
	 * Test the get_geo function.
	 *
	 * @dataProvider mockAudienceData
	 * @group wp-geo
	 */
	public function testGetGeo( array $audience_data ) {
		remove_all_filters( 'pantheon.ei.parsed_geo_data' );

		foreach ( $audience_data as $header => $value ) {
			$data = [
				'HTTP_' . strtoupper( str_replace( '-', '_', $header ) ) => $value,
			];
			$region = $audience_data['P13n-Geo-Country-Code'];
			$data_type = str_replace( 'p13n-geo-', '', strtolower( $header ) );
			// Get the geo data.
			$value_to_test = Geo\get_geo( $data_type, $data );
			// Make sure the data matches.
			$this->assertIsString( $value_to_test );

			// We left the UK conn-type empty, so check for empty.
			if ( $region === 'UK' && $data_type === 'conn-type' ) {
				$this->assertEquals(
					'',
					$value_to_test,
					'UK conn-type should be empty'
				);
			} else {
				$this->assertNotEmpty(
					$value_to_test,
					"Data is empty for $region $data_type"
				);
			}

			$this->assertEquals(
				$value_to_test,
				$value,
				"Data does not match for $region $data_type"
			);

			// Build the parsed data for testing later.
			$parsed_data[ $data_type ] = $value;
		}

		// Test that some other string returns empty.
		$this->assertEmpty(
			Geo\get_geo( 'some-other-string' ),
			'Disallowed strings should return empty'
		);

		// Massage the data so we get actual results.
		$all_geo_data = $this->format_mock_header_data( $audience_data );

		// Test the get_geo function with no data type passed.
		$empty_geo = Geo\get_geo( '', $all_geo_data );
		$this->assertNotEmpty(
			$empty_geo,
			'Empty data type should not return empty'
		);

		// Decode the JSON we got back.
		$json_decoded_geo = (array) json_decode( $empty_geo );

		// Test that the decoded geo data matches the parsed data.
		$this->assertEquals(
			$json_decoded_geo,
			$parsed_data,
			'Empty data type should return parsed data'
		);

		// Ensure the json-encoded string matches what's expected.
		$this->assertEquals(
			$empty_geo,
			json_encode( $parsed_data ),
		);
	}

	/**
	 * Format mock data to emulate actual headers.
	 * Used to pass into returnPersonalizationObject which expects actual header data.
	 *
	 * @see EI\HeaderData::personalizationObject
	 * @param array $data The data to format.
	 *
	 * @return array The formatted data.
	 */
	private function format_mock_header_data( array $data ) : array {
		$new_data = [];
		foreach ( $data as $header => $value ) {
			$new_data[ strtoupper( str_replace( '-', '_', 'HTTP_' . $header ) ) ] = $value;
		}
		return $new_data;
	}

	/**
	 * Data provider for testGetGeo.
	 *
	 * @return array Mock audience data.
	 */
	public function mockAudienceData() : array {
		return [
			'us' => [ [
				'P13n-Geo-Country-Code' => 'US',
				'P13n-Geo-Country-Name' => 'united states',
				'P13n-Geo-City' => 'salt lake city',
				'P13n-Geo-Region' => 'UT',
				'P13n-Geo-Continent-Code' => 'NA',
				'P13n-Geo-Conn-Speed' => 'broadband',
				'P13n-Geo-Conn-Type' => 'wired',
			] ],
			'ca' => [ [
				'P13n-Geo-Country-Code' => 'CA',
				'P13n-Geo-Country-Name' => 'canada',
				'P13n-Geo-City' => 'vancouver',
				'P13n-Geo-Region' => 'BC',
				'P13n-Geo-Continent-Code' => 'NA',
				'P13n-Geo-Conn-Speed' => 'cable',
				'P13n-Geo-Conn-Type' => 'wifi',
			] ],
			'uk' => [ [
				'P13n-Geo-Country-Code' => 'UK',
				'P13n-Geo-Country-Name' => 'united kingdom',
				'P13n-Geo-City' => 'london',
				'P13n-Geo-Region' => 'LND',
				'P13n-Geo-Continent-Code' => 'EU',
				'P13n-Geo-Conn-Speed' => 'xdsl',
				'P13n-Geo-Conn-Type' => '',
			] ],
		];
	}

	/**
	 * Test the pantheon.ei.geo_allowed_values filter and get_geo_allowed_values function.
	 *
	 * @group wp-geo
	 */
	public function testGeoAllowedValues() {
		$allowed_values = Geo\get_geo_allowed_values();
		$this->assertIsArray( $allowed_values );
		$this->assertNotEmpty( $allowed_values );
		$this->assertEquals(
			$allowed_values,
			[
				'',
				'country-code',
				'country-name',
				'city',
				'region',
				'continent-code',
				'conn-speed',
				'conn-type',
			],
			'Allowed values do not match'
		);

		// Add a new value to the allowed values.
		add_filter( 'pantheon.ei.geo_allowed_values', function( $values ) {
			$values[] = 'some-other-value';
			return $values;
		}, 10, 1 );

		// Validate that the new value is in the allowed values.
		$this->assertContains( 'some-other-value', Geo\get_geo_allowed_values() );

		// Reset the data back to the original.
		add_filter( 'pantheon.ei.geo_allowed_values', function() {
			return [
				'',
				'country-code',
				'country-name',
				'city',
				'region',
				'continent-code',
				'conn-speed',
				'conn-type',
			];
		}, 10, 1 );
	}

	/**
	 * Test the pantheon.ei.geo_allowed_values filter and get_geo_allowed_values function.
	 *
	 * @group wp-geo
	 */
	public function testGeoAllowedHeaders() {
		$allowed_headers = Geo\get_geo_allowed_headers();
		$this->assertIsArray( $allowed_headers );
		$this->assertNotEmpty( $allowed_headers );
		$this->assertEquals(
			$allowed_headers,
			[
				'P13n-Geo-Country-Code',
				'P13n-Geo-Country-Name',
				'P13n-Geo-City',
				'P13n-Geo-Region',
				'P13n-Geo-Continent-Code',
				'P13n-Geo-Conn-Speed',
				'P13n-Geo-Conn-Type',
			],
			'Allowed headers do not match'
		);

		// Add a new header value to the allowed headers.
		add_filter( 'pantheon.ei.geo_allowed_headers', function( $values ) {
			$values[] = 'some-other-header';
			return $values;
		}, 10, 1 );

		// Validate that the new header value is in the allowed headers.
		$this->assertContains( 'some-other-header', Geo\get_geo_allowed_headers() );

		// Reset the data back to the original.
		add_filter( 'pantheon.ei.geo_allowed_headers', function() {
			return [
				'P13n-Geo-Country-Code',
				'P13n-Geo-Country-Name',
				'P13n-Geo-City',
				'P13n-Geo-Region',
				'P13n-Geo-Continent-Code',
				'P13n-Geo-Conn-Speed',
				'P13n-Geo-Conn-Type',
			];
		}, 10, 1 );
	}

	/**
	 * Test the pantheon.ei.parsed_geo_data filter.
	 *
	 * @group wp-geo
	 */
	public function testParsedGeoData() {
		// Filter the parsed geo data.
		add_filter( 'pantheon.ei.get_all_geo', function( $geo_data ) {
			return [
				'name' => 'Chris Reynolds',
				'role' => 'Software Engineer',
				'team' => 'CMS Ecosystems',
				'email' => 'me@someemaildomainthatdoesnotexist.io',
			];
		}, 10, 1 );

		// Get geo with no parameters. Should return all geo data in JSON. Since we're filtering it, it should return the arbitrary data we passed.
		$data = Geo\get_geo();
		$this->assertJson( $data );
		$this->assertEquals(
			$data,
			json_encode( [
				'name' => 'Chris Reynolds',
				'role' => 'Software Engineer',
				'team' => 'CMS Ecosystems',
				'email' => 'me@someemaildomainthatdoesnotexist.io',
			] ),
			'Parsed data does not match'
		);
	}

	/**
	 * Test the pantheon.ei.get_geo filter.
	 *
	 * @group wp-geo
	 */
	public function testGetGeoFilter() {
		// Filter the geo data.
		add_filter( 'pantheon.ei.get_geo_country-name', function( $value ) {
			return 'Antarctica';
		}, 10, 1 );

		$this->assertEquals(
			Geo\get_geo( 'country-name' ),
			'Antarctica',
			'Filtered geo data does not match'
		);
	}

	/**
	 * Test that we dn't get an undefined array key error when calling a geo value that doesn't exist.
	 *
	 * @group wp-geo
	 */
	public function testUndefinedArrayKey() {
		// Reset the geo data to nothing.
		add_filter( 'pantheon.ei.get_all_geo', function() {
			return [];
		}, 10 );

		$this->assertEmpty( Geo\get_geo( 'conn-speed' ) );
	}
}
