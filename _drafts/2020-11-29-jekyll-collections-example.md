---
layout: post
title:  "Немного о Jekyll"
date:   2020-11-29
modified: 2020-11-29
categories: Jekyll Liquid web
tags: [Jekyll, Liquid, web]
excerpt_separator: <a name="cut"></a>
links_in_new_tab: true
disqus_page_id: 7f568w7Q2214MWp69Jm9V5eA0675AEqc7p7J9ZdBeH2TLko4653w2Q8X92aP62v9
---

Хочется немного рассказать о магии автоматизации, которую я применяю, когда разрабатываю техническую часть своего сайта. Мой сайт построен при помощи генератора статических сайтов [Jekyll](https://jekyllrb.com/). Очень много о Jekyll и статических сайтах можно прочитать в Интернете. Под катом очень кратко, в качестве введения, расскажу немного теории. А потом более конкретно, я хочу рассказать о том как я применил [Liquid](https://jekyllrb.com/docs/liquid/) (язык разметки, который применяется в Jekyll) для генерации галерии фотографий в соответствующем [разделе]({%- link gallery.html -%}) моего сайта.
<a name="cut"></a>
Статические сайты они статические в том плане, что задача web сервера, который обслуживает сайт сводится к простой отдачи заранее созданных файлов. То есть не подразумевается использования какой-нибудь базы данных, или генерации html на лету. Все html страницы, стили и скриптовые файлы уже заранее сгенерированны Jekyll'ом (статические) и web сервер их просто отдаёт по запросу клиента.  
Зачем вообще генерировать эти файлы, нельзя ли их просто создать руками, раз уж на то пошло? Ну конечно можно, просто это неудобно. Первое, что приходит в голову о назначении генератора сайта - это повторное использование уже написанных кусков кода. Например, разные страницы могут содержать много общих элементов, каких-то заголовков, скриптов и прочее. Это всё можно написать один раз и Jekyll подставит эти данные в нужные места автоматически.
Но на самом деле вся магия Jekyll - это возможности делать автоматизацию при помощи специальной разметки, которая называется Liquid. По сути - это программирование того, как будет устроен итоговый файл, который сгенерирует Jekyll.

Вернёмся к галереи фотографий. Фотографии группируются по тематике. На странице отображается заголовок темы, ниже идут фотографии с подписями, относящиеся к данной теме. Дальше идёт следующая группа со своим заголовком и фотографиями и т.д.


