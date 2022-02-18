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
		$parsed_data = EI\HeaderData::parse( 'Audience-Set', $audience_data );
// var_dump($audience_data);
		// Get the geo country.
		$country = Geo\get_geo( 'country', $audience_data );
		$parsed_country = $parsed_data['country'];

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

		// Get the geo continent.
		$continent = Geo\get_geo( 'continent', $audience_data );
		$parsed_continent = $parsed_data['continent'];

		// Test the continent.
		$this->assertIsString( $continent );
		$this->assertNotEmpty(
			$continent,
			'Continent data is empty'
		);
		$this->assertEquals(
			$continent,
			$parsed_continent,
			'Continent data does not match'
		);

		// Get the connection type.
		$conn_type = Geo\get_geo( 'conn-type', $audience_data );
		$parsed_conn_type = $parsed_data['conn-type'];

		// Test the connection type.
		$this->assertIsString( $conn_type );
		$this->assertNotEmpty(
			$conn_type,
			'Connection type data is empty'
		);
		$this->assertEquals(
			$conn_type,
			$parsed_conn_type,
			'Connection type data does not match'
		);

		// Get the connection speed.
		$conn_speed = Geo\get_geo( 'conn-speed', $audience_data );
		$parsed_conn_speed = $parsed_data['conn-speed'];

		// Test the connection speed.
		$this->assertIsString( $conn_speed );
		$this->assertNotEmpty(
			$conn_speed,
			'Connection speed data is empty'
		);
		$this->assertEquals(
			$conn_speed,
			$parsed_conn_speed,
			'Connection speed data does not match'
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
	public function mockAudienceData() : array {
		return [
			[
				'US' => [ 'HTTP_AUDIENCE_SET' => 'country:US|city:Salt Lake City|region:UT|continent:NA|conn-speed:broadband|conn-type:wired' ]
			],
			[
				'CA' => [ 'HTTP_AUDIENCE_SET' => 'country:CA|city:Vancouver|region:BC|continent:NA|conn-speed:cable|conn-type:wifi' ]
			],
			[
				'UK' => [ 'HTTP_AUDIENCE_SET' => 'country:UK|city:London|region:LND|continent:EU|conn-speed:xdsl|conn-type:?' ]
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
				'country',
				'region',
				'city',
				'continent',
				'conn-speed',
				'conn-type',
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

		// Reset the geo data to something resembling real data. This is a hack because data is retained across tests.
		add_filter( 'pantheon.ei.parsed_geo_data', function() {
			return EI\HeaderData::parse( 'Audience-Set', $this->mockAudienceData()[0]['US'] );
		}, 10 );
	}

	/**
	 * Test that the pantheon.ei.get_geo action hook fires.
	 */
	public function testGetGeoAction() {
		Geo\get_geo();
		$this->assertGreaterThan( 0, did_action( 'pantheon.ei.before_get_geo' ) );
	}

	/**
	 * Test the pantheon.ei.get_geo filter.
	 */
	public function testGetGeoFilter() {
		// Filter the geo data.
		add_filter( 'pantheon.ei.get_geo', function( $value ) {
			return 'Antarctica';
		}, 10, 1 );

		$this->assertEquals(
			Geo\get_geo( 'country' ),
			'Antarctica',
			'Filtered geo data does not match'
		);
	}
}
