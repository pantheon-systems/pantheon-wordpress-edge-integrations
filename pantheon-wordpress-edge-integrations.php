<?php
/**
 * Plugin Name: Pantheon Edge Integrations
 * Description: WordPress plugin to support Pantheon Edge Integrations and personalization features.
 * Author: Pantheon
 * Author URI: https://pantheon.io
 * Version: 0.1
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP;

define( 'PANTHEON_EDGE_INTEGRATIONS_DIR', __DIR__ );
define( 'PANTHEON_EDGE_INTEGRATIONS_FILE', __FILE__ );

$plugin_data = get_file_data( PANTHEON_EDGE_INTEGRATIONS_FILE, [ 'Version' => 'Version' ] );
$plugin_version = $plugin_data['Version'];
define( 'PANTHEON_EDGE_INTEGRATIONS_VERSION', $plugin_version );

// Check if the bootstrap function exists. If it doesn't, it means we're not using the Composer autoloader.
if ( ! function_exists( __NAMESPACE__ . '\\bootstrap' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap', 0 );
