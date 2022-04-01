<?php
/**
 * Plugin Name: Pantheon Edge Integrations
 * Description: WordPress plugin to support Pantheon Edge Integrations and personalization features.
 * Author: Pantheon
 * Author URI: https://pantheon.io
 * Version: 0.2.13
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP;

// Check if the bootstrap function exists. If it doesn't, it means we're not using the Composer autoloader.
if ( ! function_exists( __NAMESPACE__ . '\\bootstrap' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap', 0 );
