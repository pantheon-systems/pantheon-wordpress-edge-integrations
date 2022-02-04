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
		$this->assertTrue( function_exists( '\\Pantheon\\EI\\WP\\Interest\\bootstrap' ) );
	}
}
