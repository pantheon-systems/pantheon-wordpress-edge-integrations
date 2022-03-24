<?php
/**
 * Adds integration with Google Analytics and Google Tag Manager.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\Analytics;

use Pantheon\EI\WP;

/**
 * Kick off the plugin.
 */
function bootstrap() {
	add_action( 'wp_head', __NAMESPACE__ . '\\after_head', 1 );
	add_action( 'wp_body_open', __NAMESPACE__ . '\\after_body', 1 );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );
	add_action( 'admin_init', __NAMESPACE__ . '\\register_setting' );
	add_filter( 'pantheon.ei.gtm_code', __NAMESPACE__ . '\\filter_gtm_code', 1 );
}

/**
 * Add the GTM code to the <head> element.
 */
function after_head() {
	$gtm_code = get_gtm_code();

	// Bail early if we don't have a GTM code or if the GTM code is being overridden externally.
	if ( is_bool( $gtm_code ) ) {
		return;
	}
	?>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','<?php echo esc_attr( $gtm_code ); ?>');</script>
<!-- End Google Tag Manager -->
	<?php
}

/**
 * Add the GTM code to the <body> element.
 */
function after_body() {
	$gtm_code = get_gtm_code();

	// Bail early if we don't have a GTM code or if the GTM code is being overridden externally.
	if ( is_bool( $gtm_code ) ) {
		return;
	}
	?>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo esc_attr( $gtm_code ); ?>"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
	<?php
}

/**
 * Enqueue the GTM script.
 */
function enqueue_scripts() {
	$vary_headers = WP\get_supported_vary_headers();
	wp_enqueue_script( 'ei-gtm', plugin_dir_url( dirname( __FILE__ ) ) . '/assets/js/gtm_headers.js', [], '1.0.0', true );

	wp_localize_script( 'ei-gtm', 'eiGtm', [
		'headersEnabled' => $vary_headers,
		'geo' => WP\Geo\get_geo(),
		'interest' => WP\Interest\get_interest(),
	] );
}

/**
 * Get the GTM code.
 * If no GTM code exists, return false.
 * Alternately, the user can filter this value as "true" if they want to use their own Google Analytics/Google Tag Manager plugin to store/manage their GTM code.
 *
 * @return bool|string The GTM code, or false if none exists.
 */
function get_gtm_code() {
	$gtm_code = apply_filters( 'pantheon.ei.gtm_code', false );

	// Return false if we don't have a valid GTM code.
	if ( ! $gtm_code || is_string( $gtm_code ) && false === stripos( $gtm_code, 'GTM' ) ) {
		return false;
	}

	return $gtm_code;
}

/**
 * Register the GTM setting and add the setting field.
 */
function register_setting() {
	$gtm_code = get_gtm_code();

	// Bail early and don't register the setting if we're overriding GTM in the EI plugin.
	if ( true === $gtm_code ) {
		return;
	}

	// Get the option value so we can check if GTM is set in the plugin or via a filter.
	$option = get_option( 'pantheon_ei_gtm_code' );

	// If the $gtm_code is a string, but we don't have an option, it was added via filter, so bail here and don't display the option in the admin.
	if ( is_string( $gtm_code ) && ! $option ) {
		return;
	}

	// Regiter the setting.
	\register_setting( 'general', 'pantheon_ei_gtm_code', [
		'sanitize_callback' => __NAMESPACE__ . '\\sanitize_gtm_code',
	] );

	// Add the setting to the admin.
	add_settings_field(
		'gtm-code',
		__( 'Google Tag Manager Code', 'pantheon-wordpress-edge-integrations' ),
		__NAMESPACE__ . '\\render_gtm_code_field',
		'general',
		'default',
		[
			'id' => 'gtm-code',
			'label_for' => 'gtm-code',
			'option_name' => 'pantheon_ei_gtm_code',
		]
	);
}

/**
 * Displays the input field for the Google Tag Manager code option field.
 *
 * @param array $args The arguments for the field passed from add_settings_field.
 */
function render_gtm_code_field( array $args ) {
	$id = $args['id'];
	$option_name = $args['option_name'];
	$value = get_option( $option_name, '' );
	?>
	<input
		type="text"
		id="<?php echo esc_attr( $id ); ?>"
		name="<?php echo esc_attr( $option_name ); ?>"
		value="<?php echo esc_attr( $value ); ?>"
		class="regular-text"
		placeholder="GTM-XXXXXX"
	/>
	<p class="description">
		<?php esc_html_e( 'Your Google Tag Manager (GTM) code. This is required for Google Tag Manager integration to work.', 'pantheon-wordpress-edge-integrations' ); ?>
	</p>
	<?php
}

/**
 * Sanitize the GTM code.
 *
 * @param string $gtm_code The (dirty) GTM code.
 *
 * @return string The sanitized GTM code.
 */
function sanitize_gtm_code( string $gtm_code ) : string {
	// Bail early if we don't have a GTM code.
	if ( ! $gtm_code ) {
		return '';
	}

	// GTM codes should contain GTM in them. Other analytics codes are not supported.
	if ( false === stripos( $gtm_code, 'GTM' ) ) {
		return '';
	}

	return sanitize_text_field( $gtm_code );
}

/**
 * Maybe filter the GTM code.
 *
 * The GTM code may come in three different options:
 * 1. true - if a developer wants to use their own analytics plugin to manage GTM. In this case, true overrides the filter and disables the option in the admin.
 * 2. false - if a developer has not defined a GTM code via the filter (the default state). In this case, the option in the admin is displayed.
 * 3. A string - if a developer has defined a GTM code via the filter. In this case, the option in the admin is hidden.
 *
 * @param bool|string $gtm_code
 *
 * @return bool|string
 */
function filter_gtm_code( $gtm_code ) {
	// Check for stored value for GTM code from the option in the admin..
	$option = get_option( 'pantheon_ei_gtm_code', $gtm_code );

	// If the option is true or false, we're either overriding the admin option or an option has not been set. In that case, we don't need to filter anything.
	if ( is_bool( $option ) ) {
		return $gtm_code;
	}

	// If the option is a string, it is the stored admin GTM code value, so we should filter the GTM code with the one stored in the database.
	return $option;
}
