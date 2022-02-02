<?php
/**
 * Pantheon Edge Integrations main namespace file.
 *
 * Handles global edge integrations functionality.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP;

use Pantheon\EI\WP\Infrastructure\Plugin;

/**
 * Kick it off!
 */
function bootstrap() {
	add_action( 'pantheon.ei.init', __NAMESPACE__ . '\\pantheon_ei', 20 );
	add_action(
		'plugins_loaded',
		function() {
			/**
			 * Fires before the Pantheon Edge Integration plugin loads.
			 */
			do_action( 'pantheon.ei.init' );
		},
		20
	);
}

/**
 * Retrieves the plugin instance.
 *
 * @return Plugin
 */
function pantheon_ei() : Plugin {
	static $pantheon_ei;

	if ( is_null( $pantheon_ei ) ) {
		$pantheon_ei = new Plugin( __FILE__, '1.0' );
		$pantheon_ei->register();
	}

	return $pantheon_ei;
}
