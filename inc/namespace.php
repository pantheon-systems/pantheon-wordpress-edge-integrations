<?php
/**
 * Pantheon Edge Integrations main namespace file.
 *
 * Handles global edge integrations functionality.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP;

use Pantheon\EI;

/**
 * Kick it off!
 */
function bootstrap() {
	// Helper variable function that simplifies callbacks.
	$n = function( $callback ) {
		return __NAMESPACE__ . "\\$callback";
	};

	define( 'PANTHEON_EDGE_INTEGRATIONS_DIR', dirname( __DIR__, 1 ) );
	define( 'PANTHEON_EDGE_INTEGRATIONS_FILE', PANTHEON_EDGE_INTEGRATIONS_DIR . '/' . basename( dirname( __DIR__, 1 ) ) . '.php' );

	$plugin_data = get_file_data( PANTHEON_EDGE_INTEGRATIONS_FILE, [ 'Version' => 'Version' ] );
	$plugin_version = $plugin_data['Version'];
	define( 'PANTHEON_EDGE_INTEGRATIONS_VERSION', $plugin_version );

	// Bootstrap all the things.
	Admin\bootstrap();
	Analytics\bootstrap();
	API\bootstrap();
	Interest\bootstrap();

	// Display a notice if EI headers are not found.
	add_action( 'admin_init', $n( 'maybe_display_notice' ), 1 );

	// Set the Vary headers.
	add_action( 'init', $n( 'set_vary_headers' ), 999 );

	// Enqueue scripts.
	add_action( 'wp_enqueue_scripts', $n( 'enqueue_script' ) );
	add_action( 'admin_enqueue_scripts', $n( 'enqueue_admin_scripts' ) );
}

/**
 * Display an admin notice if the EI headers are not found.
 */
function maybe_display_notice() {
	if (
		is_admin() &&
		current_user_can( 'activate_plugins' ) &&
		! edge_integrations_enabled()
	) {
		add_action( 'admin_notices', __NAMESPACE__ . '\\ei_not_active_notice' );
	}
}

/**
 * Display a notice if Edge Integrations are not enabled.
 */
function ei_not_active_notice() {
	$message = sprintf(
		'<p>%1$s <a href="%2$s">%3$s</a></p>',
		__( 'Pantheon Edge Integrations does not detect the required edge configuration in this environment.', 'pantheon-wordpress-edge-integrations' ),
		admin_url( 'options-general.php#ei-status' ),
		__( 'Check Status', 'pantheon-wordpress-edge-integrations' )
	);

	printf( '<div class="error">%s</div>', wp_kses_post( $message ) );
}

/**
 * Registers & enqueues the script.
 *
 * @return void
 */
function enqueue_script() {
	/* Use minified libraries if SCRIPT_DEBUG is turned off. */
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	// Enqueue the script anytime we're not in the admin.
	if ( ! is_admin() ) {
		wp_enqueue_script( 'pantheon-ei', plugins_url( '/dist/js/assets' . $suffix . '.js', PANTHEON_EDGE_INTEGRATIONS_FILE ), [], PANTHEON_EDGE_INTEGRATIONS_VERSION, true );

		/**
		 * Allow developers to hook in after the pantheon-ei script is enqueued.
		 *
		 * @hook pantheon.ei.enqueue_script
		 * @param string $plugin_version The plugin version.
		 * @param string $plugin_file The plugin file path.
		 */
		do_action( 'pantheon.ei.after_enqueue_script', [
			'plugin_version' => PANTHEON_EDGE_INTEGRATIONS_VERSION,
			'plugin_file'    => PANTHEON_EDGE_INTEGRATIONS_FILE,
		] );
	}
}

/**
 * Enqueue admin scripts.
 */
function enqueue_admin_scripts() {
	wp_enqueue_style( 'ei-admin', plugins_url( '/assets/css/admin.css', PANTHEON_EDGE_INTEGRATIONS_FILE ), [], PANTHEON_EDGE_INTEGRATIONS_VERSION );
}

/**
 * Get an array of vary headers supported by the plugin.
 *
 * @return array Array of supported vary header keys.
 */
function get_supported_vary_headers() : array {
	/**
	 * Allow developers to modify the vary headers supported by the plugin.
	 *
	 * Array keys are vary headers, and values are whether or not they are supported.
	 *
	 * @param array $defaults Array of vary headers supported by the plugin.
	 */
	$defaults = apply_filters( 'pantheon.ei.supported_vary_headers', [
		'P13n-Geo-Country-Code' => true,
		'P13n-Geo-Country-Name' => false,
		'P13n-Geo-Region' => false,
		'P13n-Geo-City' => false,
		'P13n-Geo-Continent-Code' => false,
		'P13n-Geo-Conn-Type' => false,
		'P13n-Geo-Conn-Speed' => false,
		'P13n-Interest' => true,
	] );

	// Omit headers that are not supported.
	if ( ! is_bool( $defaults ) ) {
		foreach ( $defaults as $key => $value ) {
			if ( $value === false ) {
				unset( $defaults[ $key ] );
			}
		}
	}

	// Return the modified array of supported vary header keys.
	return array_keys( $defaults );
}

/**
 * Set the vary headers based on what's currently-supported.
 *
 * @return void
 */
function set_vary_headers() {
	$supported_vary_headers = get_supported_vary_headers();

	// Set the Vary headers.
	header( 'Vary: ' . implode( ', ', $supported_vary_headers ), false );
}

/**
 * Adds header key and custom data to vary header.
 *
 * @param array $key Key for the header, or array of keys.
 * @param array $data Data to pass to the HeaderData class.
 *
 * @return array The header data.
 */
function update_vary_headers( array $key = null, array $data = null ) : array {
	/**
	 * Get the data from the HeaderData class and allow it to be filtered.
	 *
	 * @hook pantheon.ei.add_header_data
	 * @param array The full, parsed header data as an array.
	 */
	$vary_header = apply_filters( 'pantheon.ei.custom_header_data', EI\HeaderData::varyHeader( $key, $data ) );

	return $vary_header;
}

/**
 * Check if Edge Integrations have been configured.
 *
 * Validates header data for any supported vary headers, including those that have been added later.
 *
 * @return bool Whether Edge Integrations have been configured and the CDN is returning data.
 */
function edge_integrations_enabled() : bool {
	$edge_enabled = false;
	$geo = Geo\get_geo();
	$interest = Interest\get_interest();

	// Check if we have geo or interest headers.
	if (
		! empty( $geo ) ||
		! empty( $interest )
	) {
		$edge_enabled = true;
	}

	// Check any other headers that might have been set.
	if ( ! $edge_enabled ) {
		// Get the custom header data, if it's been set.
		$custom_headers = apply_filters( 'pantheon.ei.custom_header_data', '' );

		// Get the software-supported headers.
		$headers = get_supported_vary_headers();
		$enabled_headers = [];

		// Loop through the headers and see if we've got data.
		foreach ( $headers as $header ) {
			$data = EI\HeaderData::header( $header );

			if ( ! empty( $data ) ) {
				$enabled_headers[] = $header;
			}
		}

		// Check if custom headers were set AND they are not empty.
		if ( ! empty( $custom_headers ) && ! empty( $enabled_headers ) ) {
			$edge_enabled = true;
		}
	}

	/**
	 * Allow developers to filter the output of edge_integrations_enabled.
	 *
	 * This can be used to force the application to think that the headers have been detected when they haven't.
	 *
	 * Note: This does not change whether the headers exist, output may be unexpected if this value is "true" but the headers are not present.
	 *
	 * @param bool $enabled Whether Edge Integrations have been configured and the CDN is returning data.
	 */
	return apply_filters( 'pantheon.ei.enabled', $edge_enabled );
}
