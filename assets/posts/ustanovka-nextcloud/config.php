<?php
$CONFIG = array (
  'instanceid' => '<������������� �������������>',
  'passwordsalt' => '<������������� �������������>',
  'secret' => '<������������� �������������>',
  'trusted_domains' => 
  array (
    0 => 'nextcloud.example.com',
    1 => 'localhost', 
    2 => '192.168.1.3'
  ),
  'datadirectory' => '/home/nextcloud/data',
  'dbtype' => 'pgsql',
  'version' => '18.0.3.0',
  'overwrite.cli.url' => '<��� url>',
  'dbname' => 'nextcloud',
  'dbhost' => 'localhost:5432',
  'dbport' => '',
  'dbtableprefix' => 'oc_',
  'dbuser' => 'nextcloud',
  'dbpassword' => '<������ �� Postgresql>',
  'installed' => true,
  'enable_previews' => true,
  'overwriteprotocol' => 'https',
  'default_language' => 'ru',
  'default_locale' => 'ru_RU',
  'updatechecker' => true,
  'memcache.local' => '\OC\Memcache\APCu',
  'memcache.distributed' => '\OC\Memcache\Redis',
  'redis' => [
    'host' => 'localhost',
    'port' => 6379,
    'timeout' => 0.0,
    'password' => '<������ Redis>'
  ],
  'memcache.locking' => '\OC\Memcache\Redis'
);
