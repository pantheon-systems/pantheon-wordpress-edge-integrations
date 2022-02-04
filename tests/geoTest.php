<?php
/**
 * Test Suite for Edge Integrations Geo.
 *
 * @package Pantheon\EdgeIntegrations
 */

use Pantheon\EI;
use PHPUnit\Framework\TestCase;

/**
 * Main test class for WordPress Edge Integrations plugin.
 */
class geoTests extends TestCase {

	/**
	 * Make sure unit tests are running.
	 */
	public function testBootstrapIsLoaded() {
		$this->assertTrue( function_exists( '\\Pantheon\\EI\\WP\\Geo\\bootstrap' ) );
	}
}
