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

namespace Pantheon\EI;

// If the bootstrap function does not exist, we're probably not using the Composer autoloader, so require that first.
if ( ! function_exists( __NAMESPACE__ . '\\bootstrap' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap', 0 );
