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
use Pantheon\EI\WP\Geo;
use stdClass;
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
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => __NAMESPACE__ . '\\get_available_segments',
		],
		'schema' => __NAMESPACE__ . '\\get_segments_schema',
	] );

	register_rest_route( API_NAMESPACE, 'segments/geo', [
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => __NAMESPACE__ . '\\get_geo_segments',
		],
		'schema' => __NAMESPACE__ . '\\get_geo_segments_schema',
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
 * Define the schema for the segments endpoint.
 *
 * @return array The segments endpoint schema.
 */
function get_segmests_schema() : array {
	return [
		'title' => 'segments',
		'type' => 'array',
		'properties' => [
			'name' => [
				'description' => esc_html__( 'The type of segment.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'string',
				'readonly' => true,
			],
			'description' => [
				'description' => esc_html__( 'Description of the segment.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'string',
				'readonly' => true,
			],
			'route' => [
				'description' => esc_html__( 'The API endpoint URL for the segment.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'string',
				'readonly' => true,
			],
		],
	];
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
		'route' => get_rest_url( null, API_NAMESPACE . '/segments/geo' ),
	];

	$interest_description = [
		'name' => 'interest',
		'description' => 'User segments derived from site behavior and interest patterns.',
		'route' => get_rest_url( null, API_NAMESPACE . '/segments/interest' ),
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

/**
 * Return an array of the geo segments available and which ones are enabled.
 *
 * @return array An array of geo segments with values of true or false depending on which ones are varied on.
 */
function get_geo_segments() : array {
	$segments = array_filter( Geo\get_geo_allowed_values() );
	$allowed_headers = array_map(
		function( $header ) {
			return strtolower( str_replace( 'P13n-Geo-', '', $header ) );
		}, WP\get_supported_vary_headers() );
	$geo = [];

	foreach ( $segments as $segment ) {
		$element = new stdClass();
		$element->name = $segment;
		if ( in_array( $segment, $allowed_headers, true ) ) {
			$element->enabled = true;
			$geo[] = $element;
		} else {
			$element->enabled = false;
			$geo[] = $element;
		}
	}

	return $geo;
}

/**
 * Define the geo segments schema.
 *
 * @return array The geo segments schema.
 */
function get_geo_segments_schema() : array {
	return [
		'title' => 'geo segments',
		'type' => 'array',
		'properties' => [
			'name' => [
				'description' => esc_html__( 'The type of geo segment.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'string',
				'readonly' => true,
			],
			'enabled' => [
				'description' => esc_html__( 'Whether the geo segment is being varied upon.' ),
				'type' => 'boolean',
				'readonly' => true,
			],
		],
	];
}
