<?php
/**
 * Main integration tests for WordPress Edge Integrations.
 *
 * @package Pantheon\EdgeIntegrations
 */

namespace Pantheon\EI\WP;

use Pantheon\EI;
use PHPUnit\Framework\TestCase;

/**
 * Main test class for WordPress Edge Integrations plugin.
 */
class testsBase extends TestCase {

	/**
	 * Make sure unit tests are running.
	 */
	public function testPHPUnitIsWorking() {
		$this->assertTrue( function_exists( '\\Pantheon\\EI\\WP\\bootstrap' ) );
	}

	/**
	 * Ensure the Globals are defined.
	 */
	public function testGlobalsAreDefined() {
		$this->assertTrue( defined( 'PANTHEON_EDGE_INTEGRATIONS_VERSION' ) );
		$this->assertTrue( defined( 'PANTHEON_EDGE_INTEGRATIONS_FILE' ) );
		$this->assertTrue( defined( 'PANTHEON_EDGE_INTEGRATIONS_DIR' ) );
	}

	/**
	 * Test the supported vary headers.
	 */
	public function testSupportedVaryHeaders() {
		$this->assertEquals( [ 'P13n-Geo-Country-Code', 'P13n-Interest' ],
		get_supported_vary_headers(),
		'The vary headers supported do not match.'
		);
	}

	/**
	 * Test the add_header_data function.
	 */
	public function testAddHeaderData() {
		$input = [
			'HTTP_IGNORED' => 'HTTP Ignored Entry',
			'IGNORED_ENTRY' => 'Completely ignored entry',
			'HTTP_SHOULD_BE_FOUND' => 'Should be found',
			'HTTP_VARY' => 'Something, Wicked, This, Way',
		];
		$vary_header = EI\HeaderData::varyHeader( [ 'Comes' ], $input );

		$interest = update_vary_headers( [ 'Comes' ], $input );
		$this->assertIsArray( $interest );
		$this->assertNotEmpty(
			$interest,
			'Data is empty'
		);
		$this->assertEquals(
			$interest,
			$vary_header,
			'Data does not match'
		);
	}

	/**
	 * Test the edge_integrations_enabled function.
	 */
	public function testEIEnabled() {
		remove_all_filters( 'pantheon.ei.parsed_geo_data' );
		remove_all_filters( 'pantheon.ei.parsed_interest_data' );
		$headers = get_supported_vary_headers();
		$enabled_headers = [];

		foreach ( $headers as $header ) {
			$data = EI\HeaderData::header( $header );

			if ( $data ) {
				$enabled_headers[] = $header;
			}
		}

		// If $enabled_headers is empty, edge_integrations_enabled should return false.
		if ( empty( $enabled_headers ) ) {
			$this->assertFalse( edge_integrations_enabled() );
		} else {
			$this->assertTrue( edge_integrations_enabled() );
		}

		// Force true or false with the filter.
		add_filter( 'pantheon.ei.enabled', '__return_true' );
		$this->assertTrue( edge_integrations_enabled() );
		remove_filter( 'pantheon.ei.enabled', '__return_true' );

		add_filter( 'pantheon.ei.enabled', '__return_false' );
		$this->assertFalse( edge_integrations_enabled() );
		remove_filter( 'pantheon.ei.enabled', '__return_false' );

		// Test edge_integrations_enabled by passing in geo data.
		$dummy_data = [
			'city' => 'City',
			'region' => 'State',
			'country' => 'US',
		];
		add_filter( 'pantheon.ei.parsed_geo_data', function( $data ) use ( $dummy_data ) {
			$data = empty( $data ) ? [] : $data;
			$data['city'] = $dummy_data['city'];
			$data['region'] = $dummy_data['region'];
			$data['country'] = $dummy_data['country'];
			return $data;
		} );
		$this->assertTrue( edge_integrations_enabled() );
		remove_all_filters( 'pantheon.ei.parsed_geo_data' );

		// Test edge_ingegrations_enabled by passing in interest data.
		add_filter( 'pantheon.ei.parsed_interest_data', function( $data ) {
			return ['interest'];
		} );
		$this->assertTrue( edge_integrations_enabled() );
		remove_all_filters( 'pantheon.ei.parsed_interest_data' );
	}
}
