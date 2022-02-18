<?php
/**
 * Handles Geolocation functionality.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\Geo;

use Pantheon\EI;

/**
 * Return geolocation data for the current user.
 *
 * @param string $data_type The type of geo data to return. Allowed values: 'country', 'region', 'city', 'continent', 'conn-speed', 'conn-type' or an empty string. All other values will return an empty string. Defaults to ''.
 *
 * If an empty string is passed, get_geo() will return all Audience data encoded in JSON format.
 *
 * @param mixed $data Data to pass to the HeaderData class. By default, this is pulled from $_SERVER data.
 *
 * @param string $header The header to use for geolocation data. Defaults to 'Audience-Set'.
 *
 * @return string The requested geo data.
 */
function get_geo( string $data_type = '', $data = null, string $header = 'Audience-Set'  ) : string {
	// If the passed data type is not allowed, return an empty string.
	if ( ! in_array( $data_type, get_geo_allowed_values(), true ) ) {
		return '';
	}

	/**
	 * Filter the header to use for geolocation.
	 *
	 * @param array $allowed_geo_headers Array of allowed geo headers. Defaults to ['Audience-Set', 'Audience'].
	 */
	$allowed_geo_headers = apply_filters( 'pantheon.ei.allowed_geo_headers', [ 'Audience-Set', 'Audience' ] );

	// Make sure the header we're pulling from is an allowed geo header.
	if ( ! in_array( $header, $allowed_geo_headers, true ) ) {
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
	$parsed_geo = apply_filters( 'pantheon.ei.parsed_geo_data', EI\HeaderData::parse( $header, $data ) );

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

	/**
	 * Fires after the geo data is retrieved but before it is returned.
	 *
	 * Allows developers to hook into the geo data retrieval process and access the geo value and the type of data requested and the full passed data, if it exists.
	 *
	 * @hook pantheon.ei.get_geo
	 * @param string The geo data value.
	 * @param string The type of geo data requested.
	 * @param mixed Data passed to the HeaderData class. By default, this is pulled from $_SERVER data.
	 */
	do_action( 'pantheon.ei.before_get_geo', $parsed_geo[ $data_type ], $data_type, $data );

	/**
	 * Allow developers to modify the requested geo data. This filter fires after the data is parsed and before it is returned making this the last stop before data is output.
	 *
	 * @hook pantheon.ei.geo_data
	 * @param string The requested geo data.
	 */
	return apply_filters( 'pantheon.ei.get_geo', $parsed_geo[ $data_type ] );
}

/**
 * Returns the array of allowed geo data types.
 *
 * @return array
 */
function get_geo_allowed_values() : array {
	/**
	 * Allow developers to modify the allowed geo data types.
	 *
	 * @hook pantheon.ei.geo_data_types
	 * @param array The allowed geo data types.
	 */
	return apply_filters( 'pantheon.ei.geo_allowed_values', [ '', 'geo', 'country', 'region', 'city', 'postal-code', 'lat', 'lon', 'latlon' ] );
}
