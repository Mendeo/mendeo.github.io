---
layout: post
title: Cписок логинов, которые подбирали к моему ssh
date: 2020-04-13 12:01:00 +03
modified: 2020-04-13 14:33:00 +03
categories: linux bash
tags: [ssh, попытки взлома, linux, bash]
excerpt_separator: <a name="cut"></a>
links_in_new_tab: true
disqus_page_id: 06L36g5iesodDFs94Ax88M287c3d5zL8N4f445xyIqmGCx653i578487M8Gnkh98
---
У меня дома на raspberry pi крутятся разные мои сервисы. И конечно у меня есть ssh доступ к этому компьютеру. Доступ настроен через ssh-ключи, порт стандартный 22.  
Так вот, я постоянно вижу попытки взлома ssh, а именно: пытаются подобрать логин для входа. Ну что же, давайте, шутки ради, посмотрим какие логины подставляют мамкины хацкеры в мой ssh. Я набросал парочку скриптов, которые собирают эти логины в файл. За несколько месяцев набралось уже 8225 уникальных. Под катом мои скрипты &#x1f600;.

<a name="cut"></a>
Получаем список уникальных логинов, которые пытались подобрать взломщики с момента последней загрузки:

```bash
#!/bin/bash
journalctl -u ssh.service | awk '/Invalid user/ {print($8)}' | sort -u
```

Скрипт сохраняем в файле findSshUsers.

Теперь скрипт, который смотрит сколько у нас уже было логинов в файле users.txt, затем добавляет туда новые уникальные логины и далее выводит соответствующие сообщения:

```bash
#!/bin/bash
rOld=$(cat users.txt | awk 'END {print FNR}')
tmp=$(mktemp)
(./findSshUsers; cat users.txt) | sort -u > $tmp
cat $tmp > users.txt
rm $tmp
rNew=$(cat users.txt | awk 'END {print FNR}')
echo Было $rOld логинов.
echo Стало $rNew логинов.
echo Добавлено $(($rNew - $rOld)) логинов.
```