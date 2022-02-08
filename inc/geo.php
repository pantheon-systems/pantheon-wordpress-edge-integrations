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
	/**
	 * Allow developers to modify the allowed geo data types.
	 *
	 * @hook pantheon.ei.geo_data_types
	 * @param array The allowed geo data types.
	 */
	$allowed_values = apply_filters( 'pantheon.ei.geo_allowed_values', [ '', 'geo', 'country', 'region', 'city', 'postal-code', 'lat', 'lon', 'latlon' ] );

	// If the passed data type is not allowed, return an empty string.
	if ( ! in_array( $data_type, $allowed_values, true ) ) {
		return '';
	}

	/**
	 * Get the geo data from the HeaderData class and allow it to be filtered.
	 *
	 * For filtering purposes, the data passed is an array of key/value pairs of geo data. Because this filter fires after the data types are checked, it's possible (but not recommended) to provide data that would otherwise be filtered out.
	 *
	 * @hook pantheon.ei.geo_data
	 * @param array The full, parsed Audience geo data as an array.
	 */
	$parsed_geo = apply_filters( 'pantheon.ei.parsed_geo_data', EI\HeaderData::parse( 'Audience', $data ) );

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
