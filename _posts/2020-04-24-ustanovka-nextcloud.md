---
layout: post
title: Чистая установка nextcloud на raspberry pi
date: 2020-04-24 14:20:00 +03
modified: 2022-09-25 20:21:00 +03
categories: linux nextcloud
tags: [nextcloud, nginx, php, raspberry pi, linux]
excerpt_separator: <a name="cut"></a>
links_in_new_tab: true
disqus_page_id: 29zr5552r08s91G972UgDO9811x99OE5724Nk78Aays08h7Y57kIL91C0C6ANyU7
---
### Обновление от 22.04.2022
За время работы моего сервера возникали разные сбои. Например, Nextcloud обновлялся и новые версии уже плохо работали со старой конфигурацией nginx. Поэтому переодически в файлах конфигурации делались разные улучшения. Пришло время обновить [nginx.conf]({% link assets/posts/ustanovka-nextcloud/nginx.conf %}) и [php.ini]({% link assets/posts/ustanovka-nextcloud/php.ini %}) и в этом посте.
<br><br>

Наконец то установил [Nextcloud](https://nextcloud.com/) на свой домашний сервер на raspberry pi. Я конечно лёгких путей не искал, решил собрать всё из исходников, вместо того, чтобы просто установить snap пакет. Зачем? Ну во-первых, у меня не было опыта работы с nginx, хотелось чему-то научиться, я думаю это пригодится для будущих проектов. Во-вторых, у меня не было опыта работы с postgresql. А это точно пригодится. К тому же у меня уже стоял на сервере postgresql - на нём крутится gogs. Доставить на существующую СУБД ещё один продукт мне кажется более целостным решением. Ну и ещё, я никогда не работал с php, на котором написан nextcloud. Но правда не знаю, где могут мне могут пригодиться полученные знания об устройстве php &#x1f600;. Попутно узнал что есть такая штука redis. Запомню, может это тоже в будущем понадобится.

В итоге всё работает. И пока всё нравится. Малинка справляется.  
Под катом мои наброски о настройке. Там всё очень неподробно - это просто записи ключевых моментов, чтобы не забыть. Кто будет проделывать то же самое должен разобраться.

<a name="cut"></a>
### Что я делал
Часть работы была проделана с настройками в конфигурационных файлах. Выкладываю свои конфиги сюда. Подробно описывать не буду, можно сравнить с оригинальными конфигами и посмотреть в чём отличие от моих. Также не буду здесь описывать процедуру получения SSL от Let's encrypt. Предполагается, что у вас уже есть сертификат.

**Конфиги**  
[php.ini]({% link assets/posts/ustanovka-nextcloud/php.ini %})  
[nginx.conf]({% link assets/posts/ustanovka-nextcloud/nginx.conf %})  
[php-fpm.conf]({% link assets/posts/ustanovka-nextcloud/php-fpm.conf %})  
[redis.conf]({% link assets/posts/ustanovka-nextcloud/redis.conf %})  
[config.php]({% link assets/posts/ustanovka-nextcloud/config.php %})  

**Systemd**  
[nginx.service]({% link assets/posts/ustanovka-nextcloud/nginx.service %})  
[php-fpm.service]({% link assets/posts/ustanovka-nextcloud/php-fpm.service %})  
[redis.service]({% link assets/posts/ustanovka-nextcloud/redis.service %})  
[nextcloud-cron.service]({% link assets/posts/ustanovka-nextcloud/nextcloud-cron.service %})  
[nextcloud-cron.timer]({% link assets/posts/ustanovka-nextcloud/nextcloud-cron.timer %})  

[Архив](https://download.nextcloud.com/server/releases/nextcloud-18.0.4.zip) Nextcloud был скачан с официального сайта. Под него был создан отдельный пользователь nextcloud. Файлы nextcloud были помещены в папку /home/nextcloud/www . Папка с пользовательскими данными: /home/nextcloud/data

Была собрана из [исходников](https://ftp.postgresql.org/pub/source/v12.2/postgresql-12.2.tar.gz) и установлена СУБД postgresql. В БД был создан пользователь "nextcloud" и база данных от этого пользователя с именем "nextcloud".

**Сборка выполняется командой "make", а установка - "sudo checkinstall".**

## Сборка nginx

Скачать и распаковать pcre

```bash
wget https://sourceforge.net/projects/pcre/files/pcre/8.45/pcre-8.45.tar.gz
tar -xf pcre-8.45.tar.gz
```

Установить libxslt

```bash
sudo apt install libxslt1-dev
```

Конфигурирование

```bash
./configure --with-threads --with-http_stub_status_module --with-http_ssl_module --sbin-path=/usr/local/bin --with-http_v2_module --with-http_xslt_module --with-http_gunzip_module --with-http_gzip_static_module --with-pcre=../pcre-8.45 --with-pcre-jit --error-log-path=/usr/local/var/log/nginx-error.log --http-log-path=/usr/local/var/log/nginx-access.log --pid-path=/usr/local/var/nginx.pid --lock-path=/usr/local/var/nginx.lock
```

## Сборка php

### Установил необходимые пакеты:

```bash
sudo apt install libwebp-dev
sudo apt install libavif-dev
sudo apt install libxpm-dev
sudo apt install libzip-dev
sudo apt install libsystemd-dev
sudo apt install libsqlite3-dev
sudo apt install libxml2-dev   
sudo apt install libbz2-dev
sudo apt install libcurl4-gnutls-dev
sudo apt install libgmp-dev
sudo apt install libc-client2007e-dev
sudo apt install libkrb5-dev
sudo apt install libldap2-dev
sudo apt install libonig-dev
sudo apt install libpng-dev
sudo apt install libjpeg-dev
sudo apt install libsodium-dev
```

Выдержка из документации:
> Перемещение файлов настройки в нужные директории  
> cp php.ini-development /usr/local/php/php.ini  
> Важно, что мы запрещаем Nginx от отправлять запросы в бэкенд PHP-FPM, если файл не существует, что помогает избежать атаки инъекции скрипта.  
> Мы может исправить это путем установки директивы cgi.fix_pathinfo равной 0 в нашем php.ini файле.  
> Найдите опцию cgi.fix_pathinfo= и измените ее следующим образом:  
> cgi.fix_pathinfo=0  

**На самом деле путь для php.ini надо смотреть путём вызова коменды "php --ini"**

Конфигурирование

```bash
./configure --enable-bcmath --enable-fpm --with-fpm-systemd --with-openssl --with-zlib --with-curl --with-bz2 --enable-exif --enable-ftp --with-openssl-dir --with-gmp --with-mhash --with-imap --with-imap-ssl --enable-intl --with-ldap --enable-mbstring --enable-pcntl --with-pdo-pgsql=/usr/local/pgsql --with-pgsql=/usr/local/pgsql --with-kerberos --with-zip --with-xsl --enable-soap --with-pear --enable-gd --with-webp --with-jpeg --with-avif --with-xpm --with-freetype --enable-gd-jis-conv --with-sodium
```

**При выполнении checkinstall на установке PEAR вылетала ошибка пришлось установить вручную. Чтобы с этим не заморачиваться можно PEAR не ставить, НО тогда будет нельзя поставить сторониие модули PHP, такие как apcu и redis, которые используются для кэширования в nextcloud.**

Установка PEAR вручную после сборки php

```bash
sapi/cli/php pear/install-pear-nozlib.phar -n -dshort_open_tag=0 -dopen_basedir= -derror_reporting=1803 -dmemory_limit=-1 -ddetect_unicode=0
```

Закомментировать строки в Makefile, где встречается install-pear, чтобы checkinstall не ставил PEAR. Но оставить сами директивы install. Повторить chekinstall.

Скопировать php.ini куда указывает 
```bash
php --ini
```

Скопировать php-fpm.conf в /usr/local/etc/php-fpm.conf

Я на всякий случай установил imagick:

```bash
sudo apt install libmagickwand-dev
sudo apt install libmagickcore-dev
sudo pecl install imagick
```

И прописал его в php.ini
```bash
extension=imagick.so
```

Указать prefix когда спросит /usr/local/lib/php/extensions

### Установка APCu (система кэширования для PHP)

```bash
sudo pecl install apcu
```

Добавляем в Config.php

```php
'memcache.local' => '\OC\Memcache\APCu',
```

И записываем его в php.ini

```bash
extension=apcu.so
```

### Установка Redis

Установка в php

```bash
sudo pecl install redis
```

Собраем Redis (просто выполнить "make", а потом "checkinstall").

Созадём пользователя Redis

```bash
 sudo useradd -c "Пользователь redis" -m -p <пароль> -s /bin/false redis
```
Прописываем пользователя nextcloud в группу redis

```bash
sudo usermod -a -G redis nextcloud
```

Добавиляем Redis в Config.php
```php
'memcache.distributed' => '\OC\Memcache\Redis',
  'redis' => [
  'host' => 'localhost',
  'port' => 6379,
  'timeout' => 0.0,
  'password' => '<пароль>'
],
'memcache.locking' => '\OC\Memcache\Redis'
```

Записываем Redis в php.ini
```bash
extension=redis.so
```

Далее остаётся поставить свои данные в конфиги:
**nginx.conf**
* Заменить nextcloud.example.com на свой домен.
* Задать путь для файлов SSL сертификата.
* Указать путь установки nextcloud.

**config.php**
* Заменить nextcloud.example.com на свой домен.
* Задать пароль от Redis.

Настройки postgresql nextcloud запросит при первом запуске.

**redis.conf**
* Задать пароль от Redis (поле "requirepass").

Установить юниты systemd для автозагрузки и наслаждаться работой с Nextcloud.
Установить автозапуск cron.php каждые 5 минут в systemd (юниты приложил).
В настройках nextcloud (через сайт) указать, что используется системный cron.