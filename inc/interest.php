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

	add_action( 'wp_enqueue_scripts', $n( 'register_script' ) );
	add_action( 'the_post', $n( 'localize_interests' ) );
}

/**
 * Registers the script.
 *
 * @return void
 */
function register_script() {
	/* Use minified libraries if SCRIPT_DEBUG is turned off. */
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_script( 'pantheon-ei-interest', plugins_url( '/dist/js/assets' . $suffix . '.js', PANTHEON_EDGE_INTEGRATIONS_FILE ), [], PANTHEON_EDGE_INTEGRATIONS_VERSION, true );
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
 * Localizes the script.
 *
 * @param WP_Post $post_object The current post.
 */
function localize_interests( $post_object ) {
	/**
	 * Allow engineers to modify post type support.
	 *
	 * @hook pantheon.ei.post_types
	 * @param array Post types to target for interests.
	 */
	if ( ! is_singular( apply_filters( 'pantheon.ei.post_types', [ 'post' ] ) ) ) {
		return;
	}

	/**
	 * Allow engineers to modify the targeted taxonomy.
	 *
	 * @hook pantheon.ei.taxonomy
	 * @param array Taxonomies to use for determining interests.
	 */
	$taxonomy = apply_filters( 'pantheon.ei.taxonomy', [ 'category' ] );

	$post_terms = wp_get_post_terms( $post_object->ID, $taxonomy, [ 'fields' => 'slugs' ] );
	if ( ! $post_terms ) {
		return;
	}

	wp_localize_script(
		'pantheon-ei-interest',
		'pantheon_ei',
		[
			/**
			 * Allow engineers to modify terms before they are localized.
			 *
			 * @hook pantheon.ei.localized_terms
			 * @param array Terms to localize.
			 */
			'post_terms' => apply_filters( 'pantheon.ei.localized_terms', $post_terms ),
			/**
			 * Allow engineers to modify the interest threshold.
			 *
			 * @hook pantheon.ei.interest_threshold
			 * @param int Number of times a term should be visited before adding to interest header.
			 */
			'interest_threshold' => apply_filters( 'pantheon.ei.interest_threshold', 3 ),
		]
	);
}

