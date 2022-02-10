<?php
/**
 * Handles Interest functionality.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\Interest;

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
 * Localizes the script.
 *
 * @param WP_Post $post_object The current post.
 */
function localize_interests( $post_object ) {
	if ( ! is_singular( get_interest_allowed_post_types() ) ) {
		return;
	}

	$taxonomy = get_interest_taxonomy();

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
			'interest_threshold' => get_interest_threshold(),
		]
	);
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

