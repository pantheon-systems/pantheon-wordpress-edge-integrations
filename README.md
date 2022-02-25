# Pantheon WordPress Edge Integrations

[![Unsupported](https://img.shields.io/badge/pantheon-unsupported-yellow?logo=pantheon&color=FFDC28&style=for-the-badge)](https://github.com/topics/unsupported?q=org%3Apantheon-systems "Unsupported, e.g. a tool we are actively using internally and are making available, but do not promise to support") ![Pantheon WordPress Edge Integrations](https://github.com/pantheon-systems/pantheon-wordpress-edge-integrations/actions/workflows/test.yml/badge.svg)

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

## Workflow

`build` contains the current latest release and `main` contains the corresponding stable development version. Always work on the `main` branch and open up PRs against `main`.

## Release Process

1. Merge all production-ready code into `main`.
2. On your local machine, checkout `main` and pull the latest.
3. Checkout a new release branch: `git checkout -b release-major.minor.patch` and bump the version number in [pantheon-wordpress-edge-integrations.php](https://github.com/pantheon-systems/pantheon-wordpress-edge-integrations/blob/main/pantheon-wordpress-edge-integrations.php#L7)
4. Push up the release branch, and create a PR against the `build` branch.
5. After all tests pass, and automation makes the commit containing the build files, merge the PR into `build`.
6. Locally checkout the `build` branch and pull the latest.
7. Create a new tag: `git tag major.minor.patch`. Iterate on the previous [tag](https://github.com/pantheon-systems/pantheon-wordpress-edge-integrations/tags) as needed.
7. Push the tag to the repo: `git push origin tag major.minor.patch`. This step triggers `release.yml` which will create a new release containing the compiled source files.
9. Bump the version number in the `main` branch to major.minor.patch-dev via Pull Request once the release is published.
