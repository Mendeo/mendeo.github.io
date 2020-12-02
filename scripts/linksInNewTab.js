---
layout: js_minifier
---

//Открываем ссылки в новом окне
(function ()
{
	'use strict';
	let links = document.querySelectorAll('.post a');
	for (let i = 0; i < links.length; i++)
	{
		links[i].target = '_blank';
		links[i].rel = 'noopener';
	}
})();