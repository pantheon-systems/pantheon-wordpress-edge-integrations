<?php
/**
 * Handles Geolocation functionality.
 *
 * @package Pantheon/EdgeIntegrations
 */
// phpcs:ignoreFile
// Ignoring this file temporarily.

namespace Pantheon\EI\WP\Geo;

function bootstrap() {
	// Helper variable function that simplifies callbacks.
	$n = function( $callback ) {
		return __NAMESPACE__ . "\\$callback";
	};
}