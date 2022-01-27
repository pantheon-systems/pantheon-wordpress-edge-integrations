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

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap', 0 );
