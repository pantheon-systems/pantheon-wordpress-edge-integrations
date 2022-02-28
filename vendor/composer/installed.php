<?php return array(
    'root' => array(
        'pretty_version' => 'dev-main',
        'version' => 'dev-main',
        'type' => 'wordpress-plugin',
        'install_path' => __DIR__ . '/../../',
        'aliases' => array(),
        'reference' => 'c2508b5b923b9c03ca8412770e1a2cb22b1808b1',
        'name' => 'pantheon-systems/pantheon-wordpress-edge-integrations',
        'dev' => false,
    ),
    'versions' => array(
        'pantheon-systems/pantheon-edge-integrations' => array(
            'pretty_version' => 'dev-main',
            'version' => 'dev-main',
            'type' => 'library',
            'install_path' => __DIR__ . '/../pantheon-systems/pantheon-edge-integrations',
            'aliases' => array(
                0 => '9999999-dev',
            ),
            'reference' => '4a6447a6d009ca8f6410390f4f0971ee7cd0de19',
            'dev_requirement' => false,
        ),
        'pantheon-systems/pantheon-wordpress-edge-integrations' => array(
            'pretty_version' => 'dev-main',
            'version' => 'dev-main',
            'type' => 'wordpress-plugin',
            'install_path' => __DIR__ . '/../../',
            'aliases' => array(),
            'reference' => 'c2508b5b923b9c03ca8412770e1a2cb22b1808b1',
            'dev_requirement' => false,
        ),
    ),
);
