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
use Pantheon\EI\WP\Interest;
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

	register_rest_route( API_NAMESPACE, 'segments/interests', [
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => __NAMESPACE__ . '\\get_interests_segments',
		],
		'schema' => __NAMESPACE__ . '\\get_interests_segments_schema',
	] );

	register_rest_route( API_NAMESPACE, 'config', [
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => __NAMESPACE__ . '\\get_config',
		],
		'schema' => __NAMESPACE__ . '\\get_config_schema',
	] );

	register_rest_route( API_NAMESPACE, 'config/geo/allowed', [
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => '\\Pantheon\\EI\\WP\\Geo\\get_geo_allowed_headers',
		],
		'schema' => __NAMESPACE__ . '\\get_geo_allowed_config_schema',
	] );

	register_rest_route( API_NAMESPACE, 'config/interest/cookie-expiration', [
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => '\\Pantheon\\EI\\WP\\Interest\\get_cookie_expiration',
		],
		'schema' => __NAMESPACE__ . '\\get_interest_cookie_expiration_schema',
	] );

	register_rest_route( API_NAMESPACE, 'config/interest/post-types', [
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => '\\Pantheon\\EI\\WP\\Interest\\get_interest_allowed_post_types',
		],
		'schema' => __NAMESPACE__ . '\\get_interest_allowed_post_types_schema',
	] );

	register_rest_route( API_NAMESPACE, 'config/interest/taxonomies', [
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => '\\Pantheon\\EI\\WP\\Interest\\get_interest_taxonomy',
		],
		'schema' => __NAMESPACE__ . '\\get_interest_allowed_taxonomies_schema',
	] );

	register_rest_route( API_NAMESPACE, 'config/interest/threshold', [
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => '\\Pantheon\\EI\\WP\\Interest\\get_interest_threshold',
		],
		'schema' => __NAMESPACE__ . '\\get_interest_threshold_schema',
	] );

	register_rest_route( API_NAMESPACE, 'user', [
		[
			'method' => WP_REST_Server::READABLE,
			'callback' => __NAMESPACE__ . '\\get_all_user_data',
		],
		'schema' => __NAMESPACE__ . '\\get_all_user_data_schema',
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
		'route' => get_rest_url( null, API_NAMESPACE . '/segments/interests' ),
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

/**
 * Return the interest segments. Interests are the terms of whatever taxonomy or taxonomies have been set as interests.
 *
 * @see get_interest_taxonomy()
 *
 * @return array An array of terms from the assigned interest taxonomy(ies).
 */
function get_interests_segments() : array {
	$interest_taxonomy = Interest\get_interest_taxonomy();
	$terms = get_terms( [
		'taxonomy' => $interest_taxonomy,
		'hide_empty' => false,
	] );
	$segments = [];
	$i = 0;

	foreach ( $terms as $term ) {
		$segments[ $i ] = new stdClass();
		$segments[ $i ]->name = $term->name;
		$segments[ $i ]->type = $term->taxonomy;
		$segments[ $i ]->id = $term->term_id;
		$i++;
	}

	return $segments;
}

/**
 * Define the interest segments schema.
 *
 * @return array The interest segments schema.
 */
function get_interests_segments_schema() : array {
	return [
		'title' => 'interest segments',
		'type' => 'array',
		'properties' => [
			'name' => [
				'description' => esc_html__( 'The segment name, in this case, the taxonomy term.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'string',
				'readonly' => true,
			],
			'type' => [
				'description' => esc_html__( 'The taxonomy the term belongs to.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'string',
				'readonly' => true,
			],
			'id' => [
				'description' => esc_html__( 'The taxonomy term ID of the term.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'integer',
				'readonly' => true,
			],
		],
	];
}

/**
 * Return current settings and configuration information in the config endpoint.
 * This endpoint displays the current working configuration of the plugin based on the filters that are in place.
 *
 * @return object The current configuration of the plugin.
 */
function get_config() : object {
	// The list of endpoints under /config.
	$endpoints = [
		'geo/allowed',
		'interest/cookie-expiration',
		'interest/post-types',
		'interest/taxonomies',
		'interest/threshold',
	];

	// Descriptions for the config endpoints.
	$descriptions = [
		'geo/allowed' => 'The list of geo segments that are allowed to be varied upon.',
		'interest/cookie-expiration' => 'The number of days until the interest cookie expires.',
		'interest/post-types' => 'The list of post types that are considered for interest segments.',
		'interest/taxonomies' => 'The list of taxonomies that are considered for interest segments.',
		'interest/threshold' => 'The minimum number of times a term must be used to be considered an interest.',
	];

	// Set up the config endpoint object.
	$config = new stdClass();
	$config->namespace = API_NAMESPACE;
	$config->routes = [];

	// Loop through each endpoint and add information.
	foreach ( $endpoints as $route ) {
		$config->routes[ API_NAMESPACE . "/config/$route" ] = [
			'description' => $descriptions[ $route ],
			'_link' => get_rest_url( null, API_NAMESPACE . "/config/$route" )
		];
	}

	$config->vary_headers = WP\get_supported_vary_headers();
	$config->version = PANTHEON_EDGE_INTEGRATIONS_VERSION;

	return $config;
}

/**
 * Define the schema for the config endpoint.
 *
 * @return array The config endpoint schema.
 */
function get_config_schema() : array {
	return [
		'title' => 'edge integrations config',
		'type' => 'object',
		'properties' => [
			'namespace' => [
				'description' => esc_html__( 'The namespace of the API.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'string',
				'readonly' => true,
			],
			'routes' => [
				'description' => esc_html__( 'The list of endpoints under /config.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'array',
				'readonly' => true,
				'items' => [
					'type' => 'object',
					'properties' => [
						'description' => [
							'description' => esc_html__( 'The description of the endpoint.', 'pantheon-wordpress-edge-integrations' ),
							'type' => 'string',
							'readonly' => true,
						],
						'_link' => [
							'description' => esc_html__( 'The link to the endpoint.', 'pantheon-wordpress-edge-integrations' ),
							'type' => 'string',
							'readonly' => true,
						],
					],
				],
			],
			'vary_headers' => [
				'description' => esc_html__( 'The list of headers that can be varied upon.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'array',
				'readonly' => true,
				'items' => [
					'type' => 'string',
				],
			],
			'version' => [
				'description' => esc_html__( 'The version of the Edge Integrations WordPress plugin.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'string',
				'readonly' => true,
			],
		],
	];
}

/**
 * Define the geo allowed config schema.
 *
 * @return array The geo allowed config schema.
 */
function get_geo_allowed_config_schema() : array {
	return [
		'title' => 'geo allowed config',
		'type' => 'array',
	];
}

/**
 * Define the cookie expiration schema.
 *
 * @return array
 */
function get_interest_cookie_expiration_schema() : array {
	return [
		'title' => 'interest cookie expiration',
		'type' => 'integer',
	];
}

/**
 * Define the interest post types schema.
 *
 * @return array
 */
function get_interest_allowed_post_types_schema() : array {
	return [
		'title' => 'interest allowed post types',
		'type' => 'array',
		'items' => [
			'type' => 'string',
		],
	];
}

/**
 * Define the interest taxonomies schema.
 *
 * @return array
 */
function get_interest_allowed_taxonomies_schema() : array {
	return [
		'title' => 'interest allowed taxonomies',
		'type' => 'array',
		'items' => [
			'type' => 'string',
		],
	];
}

/**
 * Define the interest threshold schema.
 *
 * @return array
 */
function get_interest_threshold_schema() : array {
	return [
		'title' => 'interest threshold',
		'type' => 'integer',
	];
}

/**
 * Return the current user's personalization data.
 *
 * @return object The current user's personalization data.
 */
function get_all_user_data() : object {
	$user = new stdClass();
	$user->geo = json_decode( Geo\get_geo() );
	$interest = Interest\get_interest();
	$user->interest = ! empty( $interest ) ? $interest[0] : '';
	return $user;
}

/**
 * Define the user data schema.
 *
 * @return array
 */
function get_all_user_data_schema() : array {
	return [
		'title' => 'all user data',
		'type' => 'object',
		'properties' => [
			'geo' => [
				'description' => esc_html__( 'The current user\'s geo segment.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'object',
				'readonly' => true,
				'properties' => [
					'country-code' => [
						'description' => esc_html__( 'The current user\'s ISO country code.', 'pantheon-wordpress-edge-integrations' ),
						'type' => 'string',
						'readonly' => true,
					],
					'country-name' => [
						'description' => esc_html__( 'The current user\'s country.', 'pantheon-wordpress-edge-integrations' ),
						'type' => 'string',
						'readonly' => true,
					],
					'city' => [
						'description' => esc_html__( 'The current user\'s city.', 'pantheon-wordpress-edge-integrations' ),
						'type' => 'string',
						'readonly' => true,
					],
					'region' => [
						'description' => esc_html__( 'The current user\'s state, territory, county or province.', 'pantheon-wordpress-edge-integrations' ),
						'type' => 'string',
						'readonly' => true,
					],
					'continent_code' => [
						'description' => esc_html__( 'The current user\'s continent code.', 'pantheon-wordpress-edge-integrations' ),
						'type' => 'string',
						'readonly' => true,
					],
					'conn-speed' => [
						'description' => esc_html__( 'The current user\'s internet connection speed.', 'pantheon-wordpress-edge-integrations' ),
						'type' => 'string',
						'readonly' => true,
					],
					'conn-type' => [
						'description' => esc_html__( 'The current user\'s internet connection type.', 'pantheon-wordpress-edge-integrations' ),
						'type' => 'string',
						'readonly' => true,
					],
				],
			],
			'interest' => [
				'description' => esc_html__( 'The current user\'s interest segment.', 'pantheon-wordpress-edge-integrations' ),
				'type' => 'string',
				'readonly' => true,
			],
		],
	];
}