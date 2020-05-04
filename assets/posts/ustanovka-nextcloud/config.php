<?php
$CONFIG = array (
  'instanceid' => '<сгенерируется автоматически>',
  'passwordsalt' => '<сгенерируется автоматически>',
  'secret' => '<сгенерируется автоматически>',
  'trusted_domains' => 
  array (
    0 => 'nextcloud.example.com',
    1 => 'localhost',
  ),
  'datadirectory' => '/home/nextcloud/data',
  'dbtype' => 'pgsql',
  'version' => '18.0.3.0',
  'overwrite.cli.url' => '<ваш url>',
  'dbname' => 'nextcloud',
  'dbhost' => 'localhost:5432',
  'dbport' => '',
  'dbtableprefix' => 'oc_',
  'dbuser' => 'nextcloud',
  'dbpassword' => '<Пароль от Postgresql>',
  'installed' => true,
  'enable_previews' => true,
  'enabledPreviewProviders' => array(
    OC\Preview\Illustrator
    OC\Preview\Movie
    OC\Preview\MSOffice2003
    OC\Preview\MSOffice2007
    OC\Preview\MSOfficeDoc
    OC\Preview\OpenDocument
    OC\Preview\PDF
    OC\Preview\Photoshop
    OC\Preview\Postscript
    OC\Preview\StarOffice
    OC\Preview\SVG
    OC\Preview\TIFF
    OC\Preview\Font
    OC\Preview\BMP
    OC\Preview\GIF
    OC\Preview\HEIC
    OC\Preview\JPEG
    OC\Preview\MarkDown
    OC\Preview\MP3
    OC\Preview\PNG
    OC\Preview\TXT
    OC\Preview\XBitmap
  ),
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
    'password' => '<пароль Redis>'
  ],
  'memcache.locking' => '\OC\Memcache\Redis'
);
