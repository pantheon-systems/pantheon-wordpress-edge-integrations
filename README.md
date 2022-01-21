# Pantheon WordPress Edge Integrations

[![Unsupported](https://img.shields.io/badge/pantheon-unsupported-yellow?logo=pantheon&color=FFDC28&style=for-the-badge)](https://github.com/topics/unsupported?q=org%3Apantheon-systems "Unsupported, e.g. a tool we are actively using internally and are making available, but do not promise to support")

WordPress plugin to support Pantheon Edge Integrations and personalization features

## Local Setup

**Note:** _These steps are a temporary stopgap until all the repos are aligned and published on packagist. Watch this space, this will be updated in the future._

1. Clone this repository
2. Create a `/packages/` directory.
3. Clone `git@github.com:pantheon-systems/pantheon-edge-integrations.git` into `/packages`.
4. Open the `composer.json` inside `/packages/pantheon-edge-integrations`.
5. Rename the project from `kalamuna/smart-cdn` to `pantheon-systems/pantheon-edge-integrations`.
6. Run `composer install`
7. 💸

## Linting

This plugin comes with the following linting tools:

* ESlint - For JavaScript linting
* PHPCS - For PHP linting & coding standards
* Stylelint - For CSS/SaSS linting

In addition, some intelligent defaults are added via `@humanmade/coding-standards` (Composer) and `@humanmade/eslint-config` (NPM) that can be tweaked through configuration files.

## Testing

The following testing tools are bundled, as well, for different forms of user interaction and integration tests.

* TestCafe - For front-end, user-interaction-based testing
* PHPUnit - For PHP-based integration tests
* Robo - For any testing that requires a live environment

Combinations of these tools can be built into the `RoboFile.php`, e.g. spinning up a site and running TestCafe or PHPUnit tests that require database access against it.