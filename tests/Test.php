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
		$this->assertEquals( [ 'Audience-Set', 'Interest' ],
		get_supported_vary_headers(),
		'The vary headers supported do not match.'
		);
	}
}
