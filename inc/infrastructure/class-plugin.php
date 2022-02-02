<?php
/**
 * Main plugin class.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\Infrastructure;

use Pantheon\EI\WP\Infrastructure\Service;
use Pantheon\EI\WP\Interest;

/**
 * Plugin class.
 */
final class Plugin {

	/**
	 * Main plugin file path.
	 *
	 * @var string
	 */
	private $plugin_file;

	/**
	 * Current plugin version.
	 *
	 * @var string
	 */
	private $plugin_version;

	/**
	 * Classes to register on startup.
	 *
	 * @var array
	 */
	private $service_classes = [
		Interest::class,
	];

	/**
	 * Class instances used in the plugin.
	 *
	 * @var array
	 */
	private $services = [];

	/**
	 * Class constructor.
	 *
	 * @param string $plugin_file Main plugin file.
	 * @param string $plugin_version Current plugin version.
	 */
	public function __construct( string $plugin_file, string $plugin_version ) {
		$this->plugin_file    = $plugin_file;
		$this->plugin_version = $plugin_version;
	}

	/**
	 * Performs setup operations.
	 */
	public function register() {
		foreach ( $this->service_classes as $service_class ) {
			$this->services[ $service_class ] = new $service_class( $this );

			if ( is_a( $this->services[ $service_class ], Service::class ) ) {
				$this->services[ $service_class ]->register();
			}
		}
	}

	/**
	 * Provides the plugin file.
	 *
	 * @return string
	 */
	public function get_plugin_file() : string {
		return $this->plugin_file;
	}

	/**
	 * Provides the current plugin version.
	 *
	 * @return string
	 */
	public function get_plugin_version() : string {
		return $this->plugin_version;
	}

	/**
	 * Returns a registered service instance.
	 *
	 * @param string $service_class Class name.
	 * @return Service|null
	 */
	public function get_service( string $service_class ) {
		if ( ! isset( $this->services[ $service_class ] ) ) {
			return null;
		}

		return $this->services[ $service_class ];
	}
}
