# Contributing to Pantheon WordPress Edge Integrations

Contributing to this plugin assumes you are familiar with the Pantheon development environment and AGCDN. In addition, in order to fully test and install all the dependant packages, you will need the following developer tools in addition to cloning this repository locally:

* [Composer](https://getcomposer.org/)
* [Node](https://nodejs.org/)

It's important to note that the Edge Integration features will not work without an active Pantheon environment that has been provisioned with the Advanced Global CDN.

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

## Workflow

`build` contains the current latest release and `main` contains the corresponding stable development version. Always work on the `main` branch and open up PRs against `main`.

## Release Process

1. Merge all production-ready code into `main`.
2. On your local machine, checkout `main` and pull the latest.
3. Checkout a new release branch: `git checkout -b release-major.minor.patch` and bump the version number in [pantheon-wordpress-edge-integrations.php](https://github.com/pantheon-systems/pantheon-wordpress-edge-integrations/blob/main/pantheon-wordpress-edge-integrations.php#L7), and [package.json](https://github.com/pantheon-systems/pantheon-wordpress-edge-integrations/blob/main/package.json#L3)
4. Push up the release branch, and create a PR against the `build` branch.
5. After all tests and code reviews pass, and automation makes the commit containing the build files, merge the PR into `build`.
6. Navigate to the [Releases](https://github.com/pantheon-systems/pantheon-wordpress-edge-integrations/releases) page and click the "Draft a New Release" button.
7. Under "Choose a Tag", enter the release version (`major.minor.patch`) and select "Create a new tag: `major.minor.patch` on publish".
8. Set the target branch to `build`.
9. Enter the version number as the release title.
10. Click the "Auto-generate release notes" button to add the changelog to the release.
11. Publish the release!
12. Bump the version number in `pantheon-wordpress-edge-integrations.php` to `major.minor.patch-dev`, the version in `package.json` to `major.minor.patch`, and the version in the `README.md` to the latest _stable_ version (which should be the one you just published) and push directly to `main`.
