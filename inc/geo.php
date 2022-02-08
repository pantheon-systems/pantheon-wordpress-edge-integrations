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
 *
 * @TODO: Validate that we still actually need a bootstrap (we might not).
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
 * @param string $data_type The type of geo data to return. Allowed values: 'country', 'region', 'city', 'postal-code', 'lat', 'lon', 'latlon' or an empty string. All other values will return an empty string. Defaults to ''. 'geo' is allowed as an alias for 'country', but the latter is recommended.
 *
 * If an empty string is passed, get_geo() will return all Audience data encoded in JSON format.
 *
 * @param mixed $data Data to pass to the HeaderData class. By default, this is pulled from $_SERVER data.
 *
 * @return string The requested geo data.
 */
function get_geo( string $data_type = '', $data = null ) : string {
	$allowed_values = [ '', 'geo', 'country', 'region', 'city', 'postal-code', 'lat', 'lon', 'latlon' ];

	if ( ! in_array( $data_type, $allowed_values, true ) ) {
		return '';
	}

	$parsed_geo = EI\HeaderData::parse( 'Audience', $data );

	// If no geo data type was passed, return all Audience data.
	if ( empty( $data_type ) ) {
		return json_encode( $parsed_geo );
	}

	// The default 'geo' parameter returns the country code. Let 'country' pull the 'geo' data.
	$data_type = $data_type === 'country' ? 'geo' : $data_type;

	// If 'latlon' was requested, return the latitude and longitude.
	if ( $data_type === 'latlon' ) {
		$parsed_geo['latlon'] = $parsed_geo['lat'] . ',' . $parsed_geo['lon'];
	}

	return $parsed_geo[ $data_type ];
}
