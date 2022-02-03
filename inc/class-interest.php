<?php
/**
 * Interest functionality.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP;

use Pantheon\EI\WP\Infrastructure\Service;

/**
 * Interests class.
 */
final class Interest extends Service {

	/**
	 * Performs setup operations.
	 */
	public function register() {
		add_action( 'wp_enqueue_scripts', [ $this, 'register_script' ] );
		add_action( 'the_post', [ $this, 'localize_interests' ] );
	}

	/**
	 * Registers the script.
	 *
	 * @return void
	 */
	public function register_script() {
		wp_enqueue_script( 'pantheon-ei-interest', plugins_url( '/dist/js/assets.js', PANTHEON_EDGE_INTEGRATIONS_FILE ), [], PANTHEON_EDGE_INTEGRATIONS_VERSION, true );
	}

	/**
	 * Localizes the script.
	 *
	 * @param WP_Post $post_object The current post.
	 */
	public function localize_interests( $post_object ) {
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
}
