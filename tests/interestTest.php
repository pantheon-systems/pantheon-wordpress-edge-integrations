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
	 * Test that we can get the expected Interest header key.
	 */
	public function testGetInterestHeaderKey() {
		$this->assertEquals(
			'P13n-Interest',
			Interest\get_interest_header_key()
		);

		// This tests code in set_interest. This assertion ensures that the headers we set are correct.
		$http_interest = strtoupper( 'HTTP_' . str_replace( '-', '_', Interest\get_interest_header_key() ) );
		$this->assertEquals(
			'HTTP_P13N_INTEREST',
			$http_interest
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
	 * Test Cookie expiration.
	 */
	public function testCookieExpiration() {
		$this->assertTrue(
			function_exists( '\\Pantheon\\EI\\WP\\Interest\\get_cookie_expiration' ),
			'get_cookie_expiration function does not exist'
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

	/**
	 * Test the pantheon.ei.cookie_expiration filter.
	 */
	public function testCookieExpirationFilter() {
		// Filter the interest threshold.
		add_filter( 'pantheon.ei.cookie_expiration', function( $value ) {
			return 7;
		}, 10, 1 );

		$this->assertEquals(
			Interest\get_cookie_expiration(),
			7,
			'Filtered cookie expiration does not match'
		);
	}

	/**
	 * Make sure get_interest exists.
	 * @group wp-interest
	 */
	public function testGetInterestExists() {
		$this->assertTrue(
			function_exists( '\\Pantheon\\EI\\WP\\Interest\\get_interest' ),
			'get_interest function does not exist'
		);
	}

	/**
	 * Make sure set_interest exists.
	 * @group wp-interest
	 */
	public function testSetInterestExists() {
		$this->assertTrue(
			function_exists( '\\Pantheon\\EI\\WP\\Interest\\set_interest' ),
			'set_interest function does not exist'
		);
	}

	/**
	 * Test the set_interest function.
	 *
	 * @dataProvider mockGetInterestData
	 * @group wp-interest
	 */
	public function testSetInterest( array $interest_data ) {
		// Get the actual data in a format that's easier to read.
		$parsed_data = EI\HeaderData::parse( Interest\get_interest_header_key(), $interest_data );

		$interest = Interest\set_interest( $interest_data );
		$this->assertIsArray( $interest );
		$this->assertNotEmpty(
			$interest,
			'Data is empty'
		);
		$this->assertEquals(
			$interest,
			$parsed_data,
			'Data does not match'
		);
	}

	/**
	 * Test the pantheon.ei.parsed_interest_data filter.
	 *
	 * @group wp-interest
	 */
	public function testParsedInterestData() {
		remove_all_filters( 'pantheon.ei.parsed_interest_data' );
		$input = [ 'HTTP_P13N_INTEREST' =>'Carl Sagan|Richard Feynman|Albert Einstein' ];
		// Filter the parsed interest data.
		add_filter( 'pantheon.ei.parsed_interest_data', function( $interest_data ) {
			return [ 'HTTP_P13N_INTEREST' =>'Carl Sagan|Richard Feynman|Albert Einstein' ];
		}, 10, 1 );

		$data = Interest\get_interest( $input );
		$this->assertEquals(
			$data,
			$input,
			'Parsed data does not match'
		);
	}

	/**
	 * Data provider for testGetInterests.
	 *
	 * @return array Mock interest data.
	 */
	public function mockGetInterestData() : array {
		return [
			[
				'mockInterestData' => [ 'HTTP_P13N_INTEREST' => 'Carl Sagan|Richard Feynman|Neil deGrasse Tyson' ]
			]
		];
	}
}
