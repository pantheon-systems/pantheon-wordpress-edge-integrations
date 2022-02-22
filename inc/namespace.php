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
	define( 'PANTHEON_EDGE_INTEGRATIONS_DIR', dirname( __DIR__, 1 ) );
	define( 'PANTHEON_EDGE_INTEGRATIONS_FILE', PANTHEON_EDGE_INTEGRATIONS_DIR . '/' . basename( dirname( __DIR__, 1 ) ) . '.php' );

	$plugin_data = get_file_data( PANTHEON_EDGE_INTEGRATIONS_FILE, [ 'Version' => 'Version' ] );
	$plugin_version = $plugin_data['Version'];
	define( 'PANTHEON_EDGE_INTEGRATIONS_VERSION', $plugin_version );

	// Load the Interest namespace.
	Interest\bootstrap();

	add_action( 'init', __NAMESPACE__ . '\\set_interest_header' );
}

/**
 * Get an array of vary headers supported by the plugin.
 *
 * @return array
 */
function get_supported_vary_headers() : array {
	$defaults = [
		'Audience-Set' => true,
		'Audience' => false,
		'Interest' => true,
	];

	/**
	 * Allow developers to modify the vary headers supported by the plugin.
	 *
	 * Array keys are vary headers, and values are whether or not they are supported.
	 *
	 * @param array $defaults Array of vary headers supported by the plugin.
	 */
	return apply_filters( 'pantheon.ei.supported_vary_headers', $defaults );
}

/**
 * Set the vary headers based on what's currently-supported.
 *
 * @return void
 */
function set_vary_headers() {
	$supported_vary_headers = get_supported_vary_headers();

	foreach ( $supported_vary_headers as $header => $enabled ) {
		if ( ! $enabled ) {
			continue;
		}

		header( "Vary: $header", false );
	}
}
