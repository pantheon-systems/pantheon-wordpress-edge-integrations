<?php
/**
 * Abstract service class.
 *
 * @package Pantheon/EdgeIntegrations
 */

namespace Pantheon\EI\WP\Infrastructure;

use Pantheon\EI\WP\Infrastructure\Plugin;

/**
 * Service class.
 */
abstract class Service {
	/**
	 * Plugin instance.
	 *
	 * @var Plugin
	 */
	protected $plugin;

	/**
	 * Class constructor.
	 *
	 * @param Plugin $plugin Plugin instance.
	 */
	public function __construct( Plugin $plugin ) {
		$this->plugin = $plugin;
	}

	/**
	 * Performs setup operations.
	 *
	 * @return void
	 */
	abstract public function register();
}
