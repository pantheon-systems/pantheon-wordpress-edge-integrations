<?php
/**
 * Test Suite for Edge Integrations Interests.
 *
 * @package Pantheon\EdgeIntegrations
 */

use Pantheon\EI;
use PHPUnit\Framework\TestCase;

/**
 * Main test class for WordPress Edge Integrations plugin.
 */
class interestsTests extends TestCase {

	/**
	 * Make sure unit tests are running.
	 */
	public function testNamespaceLoaded() {
		$this->assertTrue(
			function_exists( '\\Pantheon\\EI\\WP\\Interest\\bootstrap' ),
			'bootstrap function does not exist'
		);
	}

	/**
	 * Test script registration.
	 */
	public function testRegisterScript() {
		$this->assertTrue( 
			function_exists( '\\Pantheon\\EI\\WP\\Interest\\register_script' ),
			'register_script function does not exist'
		);
	}

	/**
	 * Test Interest localization.
	 */
	public function testInterestLocalization() {
		$this->assertTrue( 
			function_exists( '\\Pantheon\\EI\\WP\\Interest\\localize_interests' ),
			'localize_interests function does not exist'
		);
	}
}
