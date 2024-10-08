---
layout: post
title: Настройка VPS для проброса портов на домашний веб сервер
date: 2020-05-04 18:43:00 +03
modified: 2024-09-26 13:10:00 +03
categories: linux vps
tags: [vps, iptables, проброс портов, linux]
excerpt_separator: <a name="cut"></a>
links_in_new_tab: true
disqus_page_id: YE49187P36cYv81i000HiQ3MwsdD21885YA5Ge6Y0c6N5sAoi2CmT00CXu8EsM9e
---
Тут я выяснил, что купить выделенный сервер стоит очень дёшево. По крайней мере дешевле, чем купить выделенный белый IP у моего провайдера. Ну раз такое дело, то я решил отказаться от белого IP и дать доступ к своим домашним веб серверам (nextcloud и git сервер) при помощи выделенного сервера. К тому же теперь можно не зависеть от провайдера, а раздавать интернет для домашнего сервера хоть через телефон.

VPS (от англ. Virtual Private Server) виртуальный сервер, который создается средствами виртуализации на физическом сервере, который в свою очередь находится в дата-центре провайдера VPS. Таких провайдеров очень много. К VPS даётся доступ по SSH под root пользователем. Можно выбрать разные операционные системы. У меня Ubuntu 18.04.

Критерием выбора VPS была цена. Чем дешевле, тем лучше, так как у такого сервера в моём случае будет только одна задача: перенаправлять трафик пришедший на белый IP VPS по VPN туннелю на мой домашний Raspberry Pi компьютер.

Действительно, всего за 130 рублей в месяц у меня есть VPS с 512 МБ оперативной памяти и 10 ГБ места на HDD. Этого с лихвой хватит на перенаправление трафика. А учитывая, что мой провайдер просит 180 рублей просто за выделенный IP, то это очень выгодная покупка.

Теперь осталось настроить VPS.

<a name="cut"></a>
## Настройка VPN

### VPN сервер на VPS
В качестве VPN я выбрал старый добрый PPTP. Говорят у него проблемы с шифрованием, но для меня это не имеет значение, т.к. пробрасывать по туннелю я буду HTTPS трафик, который уже и так шифрованный.

Установим PPTP сервер.

```bash
apt install pptpd
```

В интернете много руководств по настройке VPN в Linux. Я просто приведу свои основные конфиги:

**/etc/pptpd.conf**

```bash
option /etc/ppp/pptpd-options
logwtmp
localip 192.168.1.1
remoteip 192.168.1.2
```

**/etc/ppp/pptpd-options**

```bash
name pptpd
refuse-pap
refuse-chap
refuse-mschap
require-mschap-v2
require-mppe-128
ms-dns 77.88.8.8
ms-dns 77.88.8.1
lock
nobsdcomp
novj
novjccomp
nologfd
```

Поскольку у меня дома интернет подаётся через pppoe, то необходимо уменьшить mtu вложенного туннеля, который мы пытаемся настроить. Для этого в файле /etc/ppp/options прописываем

```bash
mru 1420
```

А в файле /etc/ppp/ip-up в последней строке прописывается соответствующее mtu

```bash
ifconfig $1 mtu 1420
```

Возможно я что-то напутал, однако после этих настроек у меня прекратились постоянные обрывы соединения.

В файле /etc/ppp/chap-secrets указывается логин и пароль для подключения клиентов VPN.

Сервер запускается командой pptpd. После этого при подключении клиента поднимается новый сетевой интерфейс ppp0. У VPS будет IP 192.168.1.1, а у домашнего сервера 192.168.1.2.

## Настройка проброса HTTP, HTTPS и SSH трафика.

Удалим на всякий случай имеющийся в Ubuntu файрвол ufw.  
Следующий скрипт - это настройка iptables. iptables - это программа для перенаправления и фильтрации IP трафика в Linux. В первых строках нужно вписать ваши параметры.

```bash
#!/bin/bash
IP_INT="192.168.1.2" #Локальный IP адрес PPTP клиента.
IP_EXT="<внешний IP>" #Внешний IP адрес VPS сервера.
IF_INT="ppp0" #Имя PPTP интерфейса.
IF_EXT="eth0" #Имя внешнего интерфейса.

sysctl net.ipv4.ip_forward=1 #Разрешаем перенаправление трафика на другой сетевой интерфейс.

#Очищаем все таблицы iptables
iptables -F

#Настройка входящих соединений.
PORT=443 #Перенаправление HTTPS
iptables -t nat -A PREROUTING -i $IF_EXT -p tcp -d $IP_EXT --dport $PORT -j DNAT --to-destination $IP_INT:$PORT #Изменяем адрес назначения у пришедших пакетов на локальный адрес PPTP клиента.
iptables -A FORWARD -i $IF_EXT -o $IF_INT -p tcp --dport $PORT -m conntrack --ctstate NEW -j ACCEPT #Разрешаем перенаправление нового входящего соединения на локальный адрес PPTP клиента.

PORT=80 #Перенаправление HTTP
iptables -t nat -A PREROUTING -i $IF_EXT -p tcp -d $IP_EXT --dport $PORT -j DNAT --to-destination $IP_INT:$PORT
iptables -A FORWARD -i $IF_EXT -o $IF_INT -p tcp --dport $PORT -m conntrack --ctstate NEW -j ACCEPT

PORT=2222 #Перенаправление SSH
iptables -t nat -A PREROUTING -i $IF_EXT -p tcp -d $IP_EXT --dport $PORT -j DNAT --to-destination $IP_INT:$PORT
iptables -A FORWARD -i $IF_EXT -o $IF_INT -p tcp --dport $PORT -m conntrack --ctstate NEW -j ACCEPT

iptables -A FORWARD -i $IF_EXT -o $IF_INT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT # Разрешаем перенаправление входящих пакетов для уже созданных соединений на локальный адрес PPTP клиента.

#Исходящие соединения
iptables -A FORWARD -m conntrack --ctstate NEW,ESTABLISHED,RELATED -i $IF_INT -o $IF_EXT -j ACCEPT #Разрешаем перенаправление исходящих соединений с внутреннего интерфейса PPTP клиента в интернет.
iptables -t nat -A POSTROUTING -o $IF_EXT -j SNAT --to-source $IP_EXT #Меняем в перенаправленных пакетах адрес источника на адрес внешнего интерфейса

iptables -P FORWARD DROP #Запрещаем любое другое перенаправление трафика.
```

Сохраняем этот скрипт в файл, даём этому файлу разрешение на исполнение и исполняем. В итоге мы получим перенаправление HTTP и HTTPS трафика, а также пакетов на порт 2222, который я использую для подключения по SSH к домашнему серверу. Кроме того, у домашнего сервера будет доступ в интернет с белого IP адреса VPS.

И pptpd и настройки iptables не сложно поставить в автозагрузку, но я этого пока не делал.

## Настройка домашнего сервера

Настроим файрвол при помощи всё того же iptables.

```bash
#!/bin/bash
iptables -F

iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT #Пропустить пакеты для уже установленных соединений. (Нужно, чтобы был доступ в интернет)

#Для того, чтобы поднимался pptp
modprobe ip_nat_pptp
iptables -A INPUT -p gre -j ACCEPT 

#Разрешаем входящий трафик для HTTP, HTTPS и SSH на порту 2222
iptables -A INPUT -p tcp --dport 2222 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

iptables -P INPUT DROP #Запрещаем все остальные входящие пакеты.
```

Установим PPTP клиент.

```bash
sudo apt install pptp-linux
```

**/etc/ppp/options.pptp**

```bash
lock
noauth
refuse-pap
refuse-eap
refuse-chap
refuse-mschap
nobsdcomp
nodeflate
require-mppe-128
```

**/etc/ppp/peers/vps**

```bash
pty "pptp <ip VPS> --nolaunchpppd --timeout 0.1 --loglevel 0"
name "<логин>"
remotename pptp
require-mppe-128
defaultroute #создавать маршрут по умолчанию
replacedefaultroute #принудительно изменять маршрут по умолчанию (чтобы был интернет через pptp)
unit 1
persist
maxfail 0 #Пытаться переподключиться всегда
holdoff 30 #интервал между подключениями
file /etc/ppp/options.pptp
ipparam vps
```

В файле /etc/ppp/chap-secrets указывается логин и пароль для подключения клиентов VPN.

Подключиться к VPN нужно следующей командой

```bash
sudo pon vps
```

Отключиться
```bash
sudo poff
```

При подключении поднимается новый сетевой интерфейс ppp1.  
Остаётся только установить поднятие pptp и выполнение iptables при старте системы, но это в другой раз.