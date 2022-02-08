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
		$this->assertTrue( function_exists( '\\Pantheon\\EI\\WP\\Interest\\bootstrap' ) );
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
	 * Test the get_interest function.
	 *
	 * @dataProvider mockGetInterestData
	 * @group wp-interest
	 */
	public function testGetInterest( array $interest_data ) {
		// Get the actual data in a format that's easier to read.
		$parsed_data = EI\HeaderData::parse( 'Interest', $interest_data );

		$interest = Interest\get_interest( $interest_data );
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
	 * Test the set_interest function.
	 * 
	 * @group wp-interest
	 */
	public function testSetInterest() {
		$input = [
			'HTTP_IGNORED' => 'HTTP Ignored Entry',
			'IGNORED_ENTRY' => 'Completely ignored entry',
			'HTTP_SHOULD_BE_FOUND' => 'Should be found',
			'HTTP_VARY' => 'Something, Wicked, This, Way',
		];
		$vary_header = EI\HeaderData::varyHeader( [ 'Comes' ], $input );

		$interest = Interest\set_interest( [ 'Comes' ], $input );
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
	 * Data provider for testGetInterests.
	 *
	 * @return array Mock interest data.
	 */
	private function mockGetInterestData() : array {
		return [
			[
				'Carl Sagan|Richard Feynman|Neil deGrasse Tyson' => [ 'HTTP_INTEREST' => 'Carl Sagan|Richard Feynman|Neil deGrasse Tyson' ]
			]
		];
	}
}
