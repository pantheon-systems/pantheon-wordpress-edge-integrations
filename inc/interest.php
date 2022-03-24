<?php
/**
 * Handles Interest functionality.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\Interest;

use Pantheon\EI;

/**
 * Bootstrap Interest functionality.
 */
function bootstrap() {
	// Helper variable function that simplifies callbacks.
	$n = function( $callback ) {
		return __NAMESPACE__ . "\\$callback";
	};

	add_action( 'init', $n( 'set_interest_header' ) );
	add_action( 'wp_enqueue_scripts', $n( 'localize_script' ) );
}

/**
 * Pass interest data to the script.
 *
 * @return void
 */
function localize_script() {
	global $post;
	$post_id = $post->ID;
	$taxonomy = get_interest_taxonomy();
	$post_terms = wp_get_post_terms( $post_id, $taxonomy, [ 'fields' => 'slugs' ] ) ?: [];

	wp_localize_script(
		'pantheon-ei',
		'eiInterest',
		[
			/**
			 * Allow engineers to modify terms before they are localized.
			 *
			 * @hook pantheon.ei.localized_terms
			 * @param array Terms to localize.
			 */
			'post_terms' => apply_filters( 'pantheon.ei.localized_terms', $post_terms ),
			'interest_threshold' => get_interest_threshold(),
			'cookie_expiration' => get_cookie_expiration(),
		]
	);
}

/**
 * Sets the Interest to header if cookie is defined and set.
 *
 * @return void
 */
function set_interest_header() {
	$cookie_key = 'interest';
	if ( ! array_key_exists( $cookie_key, $_COOKIE ) ) {
		return;
	}

	$interest = sanitize_text_field( wp_unslash( $_COOKIE[ $cookie_key ] ) );
	if ( empty( $interest ) ) {
		return;
	}

	get_interest( [ 'HTTP_INTEREST' => $interest ] );
}

/**
 * Set interest data.
 *
 * @param array $key Key for the header, or array of keys.
 * @param array $data Data to pass to the HeaderData class.
 *
 * @return array The requested interest data.
 */
function set_interest( array $key = null, array $data = null ) : array {
	/**
	 * Get the interest data from the HeaderData class and allow it to be filtered.
	 *
	 * @hook pantheon.ei.set_interest_data
	 * @param array The full, parsed Interest data as an array.
	 */
	$vary_header = apply_filters( 'pantheon.ei.set_interest_data', EI\HeaderData::varyHeader( $key, $data ) );

	return $vary_header;
}

/**
 * Return interest data.
 *
 * @param array $data Data to pass to the HeaderData class. By default, this is pulled from $_SERVER data.
 *
 * @return array The requested interest data.
 */
function get_interest( array $data = null ) : array {
	/**
	 * Get the interest data from the HeaderData class and allow it to be filtered.
	 *
	 * @hook pantheon.ei.parsed_interest_data
	 * @param array The full, parsed Interest data as an array.
	 */
	$parsed_interest = apply_filters( 'pantheon.ei.parsed_interest_data', EI\HeaderData::parse( 'Interest', $data ) );

	return $parsed_interest;
}

/**
 * Returns the post type support for interests.
 *
 * @return array
 */
function get_interest_allowed_post_types() : array {
	/**
	 * Allow engineers to modify post type support.
	 *
	 * @hook pantheon.ei.post_types
	 * @param array Post types to target for interests.
	 */
	return apply_filters( 'pantheon.ei.post_types', [ 'post' ] );
}

/**
 * Returns the taxonomy used to determine interests.
 *
 * @return array
 */
function get_interest_taxonomy() : array {
	/**
	 * Allow engineers to modify the targeted taxonomy.
	 *
	 * @hook pantheon.ei.taxonomy
	 * @param array Taxonomies to use for determining interests.
	 */
	return apply_filters( 'pantheon.ei.taxonomy', [ 'category' ] );
}

/**
 * Returns the threshold for interests.
 *
 * @return int
 */
function get_interest_threshold() : int {
	/**
	 * Allow engineers to modify the interest threshold.
	 *
	 * @hook pantheon.ei.interest_threshold
	 * @param int Number of times a term should be visited before adding to interest header.
	 */
	return apply_filters( 'pantheon.ei.interest_threshold', 3 );
}

/**
 * Returns the cookie expiration for interests.
 *
 * @return int
 */
function get_cookie_expiration() : int {
	/**
	 * Allow engineers to modify the cookie expiration.
	 *
	 * @hook pantheon.ei.cookie_expiration
	 * @param int How many days the interest cookie persists.
	 */
	return apply_filters( 'pantheon.ei.cookie_expiration', 14 );
}
