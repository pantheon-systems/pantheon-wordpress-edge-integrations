<?php
/**
 * Handles Geolocation functionality.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\Geo;

use Pantheon\EI;

/**
 * Kick off our namespace.
 */
function bootstrap() {
	// Helper variable function that simplifies callbacks.
	$n = function( $callback ) {
		return __NAMESPACE__ . "\\$callback";
	};
}
