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
 * @param string $data_type The type of geo data to return. Allowed values: 'country-code', 'country-name', 'region', 'city', 'continent-code', 'conn-speed', 'conn-type' or an empty string. All other values will return an empty string. Defaults to ''.
 *
 * If an empty string is passed, get_geo() will return all Audience data encoded in JSON format.
 *
 * @param mixed $data Data to pass to the HeaderData class. By default, this is pulled from $_SERVER data.
 *
 * @return string The requested geo data.
 */
function get_geo( string $data_type = '', $data = null ) : string {
	// If the passed data type is not allowed, return an empty string.
	$data_type = strtolower( $data_type );
	if ( ! in_array( $data_type, get_geo_allowed_values(), true ) ) {
		return '';
	}

	// Set the header and make sure it is a valid header.
	$header = 'P13n-Geo-' . ucwords( $data_type, '-' );
	if ( ! empty( $data_type ) && ! in_array( $header, get_geo_allowed_headers(), true ) ) {
		return '';
	}

	// If no geo data type was passed, return all geo data.
	if ( empty( $data_type ) ) {
		/**
		 * Allow developers to filter the data that is returned when no data type is passed.
		 *
		 * Normally, if no data type is passed, all geo data is fetched and returned. This filter allows the developer to specify the data that comes back.
		 *
		 * This gets passed through json_encode before being returned.
		 *
		 * @hook pantheon.ei.get_all_geo
		 * @param array $data The full, parsed geo data as an array.
		 */
		$all_geo = apply_filters( 'pantheon.ei.get_all_geo', [
			'country-code' => EI\HeaderData::parse( 'p13n-geo-country-code', $data ),
			'country-name' => EI\HeaderData::parse( 'p13n-geo-country-name', $data ),
			'region' => EI\HeaderData::parse( 'p13n-geo-region', $data ),
			'city' => EI\HeaderData::parse( 'p13n-geo-city', $data ),
			'continent-code' => EI\HeaderData::parse( 'p13n-geo-continent-code', $data ),
			'conn-speed' => EI\HeaderData::parse( 'p13n-geo-conn-speed', $data ),
			'conn-type' => EI\HeaderData::parse( 'p13n-geo-conn-type', $data ),
		] );

		return json_encode( $all_geo );
	}

	/**
	 * Allow developers to modify the requested geo data. This filter fires after the data is parsed and before it is returned making this the last stop before data is output.
	 *
	 * @hook pantheon.ei.get_geo_{$data_type}
	 * @param array The requested geo header data.
	 */
	return apply_filters( "pantheon.ei.get_geo_$data_type", EI\HeaderData::parse( $header, $data ) );
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
	return apply_filters( 'pantheon.ei.geo_allowed_values', [
		'',
		'country-code',
		'country-name',
		'region',
		'city',
		'continent-code',
		'conn-speed',
		'conn-type',
	] );
}

/**
 * Returns the array of allowed headers.
 *
 * @return array
 */
function get_geo_allowed_headers() : array {
	$values = get_geo_allowed_values();
	$headers = [];

	foreach ( $values as $value ) {
		if ( empty( $value ) ) {
			continue;
		}

		$headers[] = ucwords( "p13n-geo-$value", '-' );
	}

	/**
	 * Allow developers to modify the allowed geo headers.
	 *
	 * @hook pantheon.ei.geo_headers
	 * @param array The allowed geo headers.
	 */
	return apply_filters( 'pantheon.ei.geo_allowed_headers', $headers );
}
