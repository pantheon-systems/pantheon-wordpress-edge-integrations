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

add_action( 'plugins_loaded', 'Pantheon\EI\\bootstrap', 0 );
