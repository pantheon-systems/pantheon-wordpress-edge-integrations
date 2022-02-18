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
}
