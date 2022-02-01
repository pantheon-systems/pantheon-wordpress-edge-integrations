<?php
/**
 * Pantheon Edge Integrations main namespace file.
 *
 * Handles global edge integrations functionality.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP;

/**
 * Kick it off!
 */
function bootstrap() {
	$n = function( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// Action hooks and filters go here.
	add_action( 'wp_enqueue_scripts', $n( 'peiwp_enqueue_scripts' ) );
	add_action( 'the_post', $n( 'peiwp_localize_interests' ) );
}

/**
 * Enqueue scripts.
 */
function peiwp_enqueue_scripts() {
	wp_enqueue_script( 'pantheon-wp-edge', plugins_url( '/dist/js/assets.js', PANTHEON_EDGE_INTEGRATIONS_FILE ), [], PANTHEON_EDGE_INTEGRATIONS_VERSION, true );
}

/**
 * Get categories for the current post and pass to JavaScript.
 *
 * @param WP_Post $post_object The current post.
 */
function peiwp_localize_interests( $post_object ) {
	if ( ! is_singular() ) {
		return;
	}

	/**
	 * Allow engineers to modify the taxonomy list.
	 *
	 * @hook peiwp_taxonomy
	 * @param {array} Taxonomies to use for determining interests.
	 */
	$taxonomy = apply_filters( 'peiwp_taxonomy', [ 'category' ] );

	$post_terms = wp_get_post_terms( $post_object->ID, $taxonomy, [ 'fields' => 'slugs' ] );
	if ( ! $post_terms ) {
		return;
	}

	wp_localize_script(
		'pantheon-wp-edge',
		'pants_ei',
		[
			/**
			 * Allow engineers to modify terms before they are localized.
			 *
			 * @hook peiwp_localized_terms
			 * @param {array} Terms to localize.
			 */
			'post_terms' => apply_filters( 'peiwp_localized_terms', $post_terms ),
			/**
			 * Allow engineers to modify the interest threshold.
			 *
			 * @hook peiwp_interest_threshold
			 * @param {int} Number of times a term should be visited before adding to interest header.
			 */
			'interest_threshold' => apply_filters( 'peiwp_interest_threshold', 3 ),
			'interest_category' => $taxonomy,
		]
	);
}
