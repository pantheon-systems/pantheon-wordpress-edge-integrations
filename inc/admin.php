<?php
/**
 * Pantheon Edge Integrations admin interface.
 *
 * Handles admin features and settings for the Pantheon Edge Integrations plugin.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\Admin;

use Pantheon\EI\WP;
use Pantheon\EI\WP\Analytics;

/**
 * Kick off the back-end.
 */
function bootstrap() {
	// Helper variable function that simplifies callbacks.
	$n = function ( $callback ) {
		return __NAMESPACE__ . "\\$callback";
	};

	add_action( 'admin_init', $n( 'register_edge_settings' ) );
}

/**
 * Register all the EI settings.
 */
function register_edge_settings() {
	register_ei_status();
	register_gtm_settings();
}

/**
 * Register the GTM setting and add the setting field.
 */
function register_gtm_settings() {
	$gtm_code = Analytics\get_gtm_code();

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

	// Register the setting.
	register_setting( 'general', 'pantheon_ei_gtm_code', [
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
 * Register the EI status field.
 */
function register_ei_status() {
	add_settings_field(
		'ei-status',
		__( 'Edge Integrations Status', 'pantheon-wordpress-edge-integrations' ),
		__NAMESPACE__ . '\\render_ei_status_field',
		'general',
		'default',
		[
			'id' => 'ei-status',
			'label_for' => 'ei-status',
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
 * Render the Edge Integrations status field.
 *
 * @param array $args The argumens for the field passed from add_settings_field.
 */
function render_ei_status_field( array $args ) {
	$id = $args['id'];
	$status = WP\edge_integrations_enabled() ? 'enabled' : 'disabled';
	$label = $status === 'enabled' ? __( 'Configured', 'pantheon-wordpress-edge-integrations' ) : __( 'Not Configured', 'pantheon-wordpress-edge-integrations' );
	$additional_info = sprintf(
		'<p class="description">%1$s<br />%2$s</p>',
		__( 'You are seeing this message because the site does not detect the expected vary headers from the CDN. This could point to a problem in the URL that you are using, how you\'ve set up your allowed headers or that your CDN is not configured to serve the expected headers.', 'pantheon-wordpress-edge-integrations' ),
		__( 'Check your URL and contact your Account Manager if you feel like you are seeing this message in error.', 'pantheon-wordpress-edge-integrations' )
	);
	?>
	<div id="<?php echo esc_attr( $id ); ?>" name="ei-status" class="ei-status <?php echo esc_html( $status ); ?>">
		<p>
			<span class="ei-current-status">
				<?php echo esc_html( $label ); ?>
			</span>
		</p>
		<?php
		// Display some additional info if the status is disabled.
		if ( $status === 'disabled' ) {
			echo wp_kses_post( $additional_info );
		}
		?>
	</div>
	<?php
}

/**
 * Sanitize the GTM code.
 *
 * @param string $gtm_code The (dirty) GTM code.
 *
 * @return string The sanitized GTM code.
 */
function sanitize_gtm_code( string $gtm_code ): string {
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
