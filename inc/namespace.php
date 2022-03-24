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
	// Helper variable function that simplifies callbacks.
	$n = function( $callback ) {
		return __NAMESPACE__ . "\\$callback";
	};

	define( 'PANTHEON_EDGE_INTEGRATIONS_DIR', dirname( __DIR__, 1 ) );
	define( 'PANTHEON_EDGE_INTEGRATIONS_FILE', PANTHEON_EDGE_INTEGRATIONS_DIR . '/' . basename( dirname( __DIR__, 1 ) ) . '.php' );

	$plugin_data = get_file_data( PANTHEON_EDGE_INTEGRATIONS_FILE, [ 'Version' => 'Version' ] );
	$plugin_version = $plugin_data['Version'];
	define( 'PANTHEON_EDGE_INTEGRATIONS_VERSION', $plugin_version );

	// Load the Interest namespace.
	Interest\bootstrap();

	// Set the Vary headers.
	add_action( 'init', $n( 'set_vary_headers' ) );

	// Enqueue the script.
	add_action( 'wp_enqueue_scripts', $n( 'enqueue_script' ) );
}

/**
 * Registers & enequeues the script.
 *
 * @return void
 */
function enqueue_script() {
	/* Use minified libraries if SCRIPT_DEBUG is turned off. */
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	// Enqueue the script anytime we're not in the admin.
	if ( ! is_admin() ) {
		wp_enqueue_script( 'pantheon-ei', plugins_url( '/dist/js/assets' . $suffix . '.js', PANTHEON_EDGE_INTEGRATIONS_FILE ), [], PANTHEON_EDGE_INTEGRATIONS_VERSION, true );
	}
}

/**
 * Get an array of vary headers supported by the plugin.
 *
 * @return array Array of supported vary header keys.
 */
function get_supported_vary_headers() : array {
	/**
	 * Allow developers to modify the vary headers supported by the plugin.
	 *
	 * Array keys are vary headers, and values are whether or not they are supported.
	 *
	 * @param array $defaults Array of vary headers supported by the plugin.
	 */
	$defaults = apply_filters( 'pantheon.ei.supported_vary_headers', [
		'Audience-Set' => true,
		'Audience' => false,
		'Interest' => true,
	] );

	// Omit headers that are not supported.
	$key = array_search( false, $defaults, true );
	if ( false !== $defaults ) {
		unset( $defaults[ $key ] );
	}

	// Return the modified array of supported vary header keys.
	return array_keys( $defaults );
}

/**
 * Set the vary headers based on what's currently-supported.
 *
 * @return void
 */
function set_vary_headers() {
	$supported_vary_headers = get_supported_vary_headers();

	// Set the Vary headers.
	header( 'Vary: ' . implode( ', ', $supported_vary_headers ), false );
}
