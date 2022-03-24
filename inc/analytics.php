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

}

/**
 * Add the GTM code to the <head> element.
 */
function after_head() {
	$gtm_code = get_gtm_code();

	// Bail early if we don't have a GTM code.
	if ( ! $gtm_code ) {
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

	// Bail early if we don't have a GTM code.
	if ( ! $gtm_code ) {
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
	$gtm_code = get_gtm_code();

	// Bail early if we don't have a GTM code.
	if ( ! $gtm_code ) {
		return;
	}

	$vary_headers = WP\get_supported_vary_headers();
	wp_enqueue_script( 'ei-gtm', plugin_dir_url( dirname( __FILE__ ) ) . '/assets/js/gtm_headers.js', [], '1.0.0', true );

	wp_localize_script( 'ei-gtm', 'eiGtm', [
		'gtmCode' => $gtm_code,
		'headersEnabled' => $vary_headers,
		'geo' => WP\Geo\get_geo(),
		'interest' => WP\Interest\get_interest(),
	] );
}

/**
 * Get the GTM code.
 * If no GTM code exists, return false.
 *
 * @return string|false The GTM code, or false if none exists.
 */
function get_gtm_code() {
	$gtm_code = apply_filters( 'pantheon.ei.gtm_code', '__return_false' );

	// Bail if we don't have a valid GTM code.
	if ( ! is_string( $gtm_code ) || false === stripos( $gtm_code, 'GTM' ) ) {
		return false;
	}

	return $gtm_code;
}
