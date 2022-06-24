<?php
/**
 * Pantheon Edge Integrations WP REST API integration.
 *
 * Provides API endpoints for Edge Integrations.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\API;

use Pantheon\EI\WP;
use WP_REST_Server;

const API_NAMESPACE = 'pantheon/v1/ei';

/**
 * Kickoff the WP REST API integration.
 */
function bootstrap() {
	add_action( 'rest_api_init', __NAMESPACE__ . '\\register_endpoints' );
}

/**
 * Register API routes.
 */
function register_endpoints() {
	register_rest_route( API_NAMESPACE, 'segments', [
		'method' => WP_REST_Server::READABLE,
		'callback' => __NAMESPACE__ . '\\get_available_segments',
	] );
}

/**
 * Return the available segments.
 *
 * @return array
 */
function get_available_segments() : array {
	$supported_vary_headers = WP\get_supported_vary_headers();
	$available_segments = [];

	foreach ( $supported_vary_headers as $vary_header ) {
		if ( false !== stripos( $vary_header, 'Interest' ) ) {
			$available_segments[] = 'interest';
		};

		if ( false !== stripos( $vary_header, 'Geo' ) ) {
			$available_segments[] = 'geo';
		};
	}

	if ( count( $available_segments ) > 1 ) {
		$segments = get_segment_descriptions();
	} else {
		$segments = get_segment_descriptions( $available_segments[0] );
	}

	return $segments;
}

/**
 * Get descriptions for enabled segments.
 *
 * @param string $segment The segment to get descriptions for. If empty, all segments are returned.
 *
 * @return array An array of segment descriptions or an array containing the name and description of the requested segment.
 */
function get_segment_descriptions( string $segment = '' ) : array {
	$geo_description = [
		'name' => 'geo',
		'description' => 'User segments derived from geolocation information.',
	];

	$interest_description = [
		'name' => 'interest',
		'description' => 'User segments derived from site behavior and interest patterns.',
	];

	if ( ! in_array( $segment, ['', 'geo', 'interest'], true ) ) {
		return [];
	}

	if ( '' === $segment ) {
		$description = [
			'geo' => $geo_description,
			'interest' => $interest_description,
		];
	}

	if ( 'geo' === $segment ) {
		$description = $geo_description;
	}

	if ( 'interest' === $segment ) {
		$description = $interest_description;
	}

	return $description;
}
