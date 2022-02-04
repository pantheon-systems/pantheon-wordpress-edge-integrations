<?php
/**
 * Bootstrap
 *
 * @package Pantheon/EdgeIntegrations
 */

use Pantheon\EI\WP;

/**
 * Call the autoloader
 */
require_once __DIR__ . '/../../vendor/autoload.php';

/**
 * Bootstrap WordPress.
 */
defined( 'ABSPATH' ) or define( 'ABSPATH', __DIR__ . '/../../vendor/wordpress/wordpress/src/' );
defined( 'WPINC' ) or define( 'WPINC', 'wp-includes' );
require_once ABSPATH . WPINC . '/default-constants.php';
require_once ABSPATH . WPINC . '/functions.php';
require_once ABSPATH . WPINC . '/load.php';
require_once ABSPATH . WPINC . '/plugin.php';
wp_initial_constants();

/**
 * Bootsrap the plugin
 */
WP\bootstrap();
