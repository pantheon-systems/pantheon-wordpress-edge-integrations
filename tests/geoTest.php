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
	 * Make sure unit tests are running.
	 */
	public function testBootstrapIsLoaded() {
		$this->assertTrue(
			function_exists( '\\Pantheon\\EI\\WP\\Geo\\bootstrap' ),
			'bootstrap function does not exist'
		);
	}

	/**
	 * Make get_geo exists.
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
	}


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
}
