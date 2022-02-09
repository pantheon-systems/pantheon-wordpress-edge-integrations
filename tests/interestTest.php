<?php
/**
 * Test Suite for Edge Integrations Interests.
 *
 * @package Pantheon\EdgeIntegrations
 */

use Pantheon\EI;
use Pantheon\EI\WP\Interest;
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
	 * Test Interest post types.
	 */
	public function testRegisterScript() {
		$this->assertTrue( 
			function_exists( '\\Pantheon\\EI\\WP\\Interest\\get_interest_allowed_post_types' ),
			'get_interest_allowed_post_types function does not exist'
		);
	}

	/**
	 * Test Interest taxonomy.
	 */
	public function testInterestTaxomony() {
		$this->assertTrue( 
			function_exists( '\\Pantheon\\EI\\WP\\Interest\\get_interest_taxonomy' ),
			'get_interest_taxonomy function does not exist'
		);
	}

	/**
	 * Test Interest threshold.
	 */
	public function testInterestThreshold() {
		$this->assertTrue( 
			function_exists( '\\Pantheon\\EI\\WP\\Interest\\get_interest_threshold' ),
			'get_interest_threshold function does not exist'
		);
	}

	/**
	 * Test the pantheon.ei.post_types filter.
	 */
	public function testInterestPostTypesFilter() {
		// Filter the interest threshold.
		add_filter( 'pantheon.ei.post_types', function( $value ) {
			return [ 'post', 'a-custom-post-type' ];
		}, 10, 1 );

		$this->assertEquals(
			Interest\get_interest_allowed_post_types(),
			[ 'post', 'a-custom-post-type' ],
			'Filtered post types do not match'
		);
	}

	/**
	 * Test the pantheon.ei.taxonomy filter.
	 */
	public function testInterestTaxonomyFilter() {
		// Filter the interest taxonomy.
		add_filter( 'pantheon.ei.taxonomy', function( $value ) {
			return [ 'category', 'test-category' ];
		}, 10, 1 );

		$this->assertEquals(
			Interest\get_interest_taxonomy(),
			[ 'category', 'test-category' ],
			'Filtered taxonomy does not match'
		);
	}

	/**
	 * Test the pantheon.ei.interest_threshold filter.
	 */
	public function testInterestThresholdFilter() {
		// Filter the interest threshold.
		add_filter( 'pantheon.ei.interest_threshold', function( $value ) {
			return 5;
		}, 10, 1 );

		$this->assertEquals(
			Interest\get_interest_threshold(),
			5,
			'Filtered threshold does not match'
		);
	}
}
