# Pantheon WordPress Edge Integrations

[![Unsupported](https://img.shields.io/badge/pantheon-unsupported-yellow?logo=pantheon&color=FFDC28&style=for-the-badge)](https://github.com/topics/unsupported?q=org%3Apantheon-systems "Unsupported, e.g. a tool we are actively using internally and are making available, but do not promise to support") [![CircleCI](https://circleci.com/gh/pantheon-systems/pantheon-wordpress-edge-integrations/tree/main.svg?style=svg)](https://circleci.com/gh/pantheon-systems/pantheon-wordpress-edge-integrations/tree/main)

WordPress plugin to support Pantheon Edge Integrations and personalization features

## Linting

This plugin comes with the following linting tools:

* [ESlint](https://eslint.org/) - For JavaScript linting
* [PHPCS](https://github.com/squizlabs/PHP_CodeSniffer) - For PHP linting & coding standards
* [Stylelint](https://stylelint.io/) - For CSS/SaSS linting

In addition, some intelligent defaults are added via [`@humanmade/coding-standards`](https://github.com/humanmade/coding-standards#readme) (Composer) and [`@humanmade/eslint-config`](https://github.com/humanmade/coding-standards/blob/master/packages/eslint-config-humanmade/readme.md) (NPM) that can be tweaked through configuration files.

## Testing

The following testing tools are bundled, as well, for different forms of user interaction and integration tests.

* [TestCafe](https://testcafe.io/) - For front-end, user-interaction-based testing
* [PHPUnit](https://phpunit.de/index.html) - For PHP-based integration tests
* [Robo](https://robo.li/) - For any testing that requires a live environment

Combinations of these tools can be built into the `RoboFile.php`, e.g. spinning up a site and running TestCafe or PHPUnit tests that require database access against it.
