<?php
/**
 * Adds integration with Google Analytics and Google Tag Manager.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\Analytics;

use Pantheon\EI\WP;

/**
 * Kick off analytics.
 */
function bootstrap() {
	// Helper variable function that simplifies callbacks.
	$n = function ( $callback ) {
		return __NAMESPACE__ . "\\$callback";
	};

	add_action( 'wp_head', $n( 'after_head' ), 1 );
	add_action( 'wp_body_open', $n( 'after_body' ), 1 );
	add_action( 'pantheon.ei.after_enqueue_script', $n( 'localize_script' ) );
	add_filter( 'pantheon.ei.gtm_code', $n( 'filter_gtm_code' ), 1 );
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
 * Localize the GTM script.
 */
function localize_script() {
	$vary_headers = WP\get_supported_vary_headers();
	$interests = WP\Interest\get_interest();

	wp_localize_script( 'pantheon-ei', 'eiGtm', [
		'headersEnabled' => $vary_headers,
		'geo' => json_decode( WP\Geo\get_geo() ),
		'interest' => ! empty( $interests ) ? $interests : '',
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
	if ( ! $gtm_code || ( is_string( $gtm_code ) && false === stripos( $gtm_code, 'GTM' ) ) ) {
		return false;
	}

	return $gtm_code;
}

/**
 * Maybe filter the GTM code.
 *
 * The GTM code may come in three different options:
 * 1. true - if a developer wants to use their own analytics plugin to manage GTM. In this case, true overrides the filter and disables the option in the admin.
 * 2. false - if a developer has not defined a GTM code via the filter (the default state). In this case, the option in the admin is displayed.
 * 3. A string - if a developer has defined a GTM code via the filter. In this case, the option in the admin is hidden.
 *
 * @param bool|string $gtm_code The GTM code.
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
