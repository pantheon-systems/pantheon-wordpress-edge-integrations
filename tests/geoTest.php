<?php
/**
 * Test Suite for Edge Integrations Geo.
 *
 * @package Pantheon\EdgeIntegrations
 */

use Pantheon\EI;
use Pantheon\EI\WP\Geo;
use PHPUnit\Framework\TestCase;

use function Pantheon\EI\WP\Geo\get_geo_allowed_values;

/**
 * Main test class for WordPress Edge Integrations plugin.
 */
class geoTests extends TestCase {

	/**
	 * Make sure unit tests are running.
	 */
	public function testBootstrapIsLoaded() {
		$this->assertTrue(
			function_exists( '\\Pantheon\\EI\\WP\\Geo\\bootstrap' ),
			'bootstrap function does not exist'
		);
	}

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
		// Get the actual data in a format that's easier to read.
		$parsed_data = EI\HeaderData::parse( 'Audience', $audience_data );

		// Get the geo country.
		$country = Geo\get_geo( 'country', $audience_data );
		$parsed_country = $parsed_data['geo'];

		// Test the country.
		$this->assertIsString( $country );
		$this->assertNotEmpty(
			$country,
			'Country data is empty'
		);
		$this->assertEquals(
			$country,
			$parsed_country,
			'Country data does not match'
		);

		// Test that `geo` can be passed and also returns the country.
		$geo = Geo\get_geo( 'geo', $audience_data );
		$this->assertIsString( $geo );
		$this->assertNotEmpty(
			$geo,
			'Geo data is empty'
		);
		$this->assertEquals(
			$geo,
			$parsed_country,
			'Geo data does not match'
		);

		// Get the geo region.
		$region = Geo\get_geo( 'region', $audience_data );
		$parsed_region = $parsed_data['region'];

		// Test the region.
		$this->assertIsString( $region );
		$this->assertNotEmpty(
			$region,
			'Region data is empty'
		);
		$this->assertEquals(
			$region,
			$parsed_region,
			'Region data does not match'
		);

		// Get the geo city.
		$city = Geo\get_geo( 'city', $audience_data );
		$parsed_city = $parsed_data['city'];

		// Test the city.
		$this->assertIsString( $city );
		$this->assertNotEmpty(
			$city,
			'City data is empty'
		);
		$this->assertEquals(
			$city,
			$parsed_city,
			'City data does not match'
		);

		// Get the geo postal code.
		$postal_code = Geo\get_geo( 'postal-code', $audience_data );
		$parsed_postal_code = $parsed_data['postal-code'];

		// Test the postal code.
		$this->assertIsString( $postal_code );
		$this->assertNotEmpty(
			$postal_code,
			'Postal code data is empty'
		);
		$this->assertEquals(
			$postal_code,
			$parsed_postal_code,
			'Postal code data does not match'
		);

		// Get the geo latitude.
		$latitude = Geo\get_geo( 'lat', $audience_data );
		$parsed_latitude = $parsed_data['lat'];

		// Test the latitude.
		$this->assertIsString( $latitude );
		$this->assertNotEmpty(
			$latitude,
			'Latitude data is empty'
		);
		$this->assertEquals(
			$latitude,
			$parsed_latitude,
			'Latitude data does not match'
		);

		// Get the geo longitude.
		$longitude = Geo\get_geo( 'lon', $audience_data );
		$parsed_longitude = $parsed_data['lon'];

		// Test the longitude.
		$this->assertIsString( $longitude );
		$this->assertNotEmpty(
			$longitude,
			'Longitude data is empty'
		);
		$this->assertEquals(
			$longitude,
			$parsed_longitude,
			'Longitude data does not match'
		);

		// Get the geo latitude/longitude.
		$lat_long = Geo\get_geo( 'latlon', $audience_data );
		$parsed_lat_long = $parsed_data['lat'] . ',' . $parsed_data['lon'];

		// Test the latitude/longitude.
		$this->assertIsString( $lat_long );
		$this->assertNotEmpty(
			$lat_long,
			'Latitude/longitude data is empty'
		);
		$this->assertEquals(
			$lat_long,
			$parsed_lat_long,
			'Latitude/longitude data does not match'
		);

		// Test that some other string returns empty.
		$this->assertEmpty(
			Geo\get_geo( 'some-other-string', $audience_data ),
			'Disallowed strings should return empty'
		);

		// Test the get_geo function with no data type passed.
		$empty_geo = Geo\get_geo( '', $audience_data );
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
	}

	/**
	 * Data provider for testGetGeo.
	 *
	 * @return array Mock audience data.
	 */
	private function mockAudienceData() : array {
		return [
			[
				'geo:US' => [ 'HTTP_AUDIENCE' => 'geo:US|city:Salt Lake City|postal-code:84103|region:Utah|lat:40.775740|lon:-111.879040' ]
			],
			[
				'geo:CA' => [ 'HTTP_AUDIENCE' => 'geo:CA|city:Vancouver|postal-code:V6Z 2E7|region:British Columbia|lat:49.2827|lon:-123.1207' ]
			],
			[
				'geo:UK' => [ 'HTTP_AUDIENCE' => 'geo:UK|city:London|postal-code:WC2N 5EJ|region:England|lat:51.5074|lon:-0.1278' ]
			],
		];
	}

	/**
	 * Test the pantheon.ei.geo_allowed_values filter and get_geo_allowed_values function.
	 */
	public function testGeoAllowedValues() {
		$allowed_values = get_geo_allowed_values();
		$this->assertIsArray( $allowed_values );
		$this->assertNotEmpty( $allowed_values );
		$this->assertEquals(
			$allowed_values,
			[
				'',
				'geo',
				'country',
				'region',
				'city',
				'postal-code',
				'lat',
				'lon',
				'latlon',
			],
			'Allowed values do not match'
		);

		// Add a new value to the allowed values.
		add_filter( 'pantheon.ei.geo_allowed_values', function( $values ) {
			$values[] = 'some-other-value';
			return $values;
		}, 10, 1 );

		// Validate that the new value is in the allowed values.
		$this->assertContains( 'some-other-value', get_geo_allowed_values() );
	}

	/**
	 * Test the pantheon.ei.parsed_geo_data filter.
	 */
	public function testParsedGeoData() {
		// Filter the parsed geo data.
		add_filter( 'pantheon.ei.parsed_geo_data', function( $geo_data ) {
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
}
