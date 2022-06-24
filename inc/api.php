<?php
/**
 * Pantheon Edge Integrations WP REST API integration.
 *
 * Provides API endpoints for Edge Integrations.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\API;

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
