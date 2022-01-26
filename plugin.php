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

/**
 * Include the namespace
 */
require_once __DIR__ . '/inc/namespace.php';

add_action( 'plugins_loaded', 'Pantheon\EI\\bootstrap', 0 );
