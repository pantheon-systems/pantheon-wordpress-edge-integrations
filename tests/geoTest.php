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

}
