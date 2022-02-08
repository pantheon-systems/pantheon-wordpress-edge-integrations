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

/**
 * Return geolocation data for the current user.
 *
 * @param string $data_type The type of geo data to return. Allowed values: 'country', 'region', 'city', 'postal-code', 'latlon'. All other values will return an empty string. Defaults to 'country'.
 *
 * @param mixed $data Data to pass to the HeaderData class. By default, this is pulled from $_SERVER data.
 *
 * @return string The requested geo data.
 */
function get_geo( string $data_type = 'country', $data = null ) : string {
	$allowed_values = [ 'geo', 'country', 'region', 'city', 'postal-code', 'lat', 'lon', 'latlon' ];

	if ( ! in_array( $data_type, $allowed_values, true ) ) {
		return '';
	}

	// The default 'geo' parameter returns the country code. Let 'country' pull the 'geo' data.
	$data_type = $data_type === 'country' ? 'geo' : $data_type;
	$parsed_geo = EI\HeaderData::parse( 'Audience', $data );
	$geo = $parsed_geo[ $data_type ];

	return $geo;
}
