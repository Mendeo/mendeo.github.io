---
layout: js_minifier
---

const MESSAGE_SERVER = 'https://deorathemen.wixsite.com/messages/_functions/mendeo_msg'; //Устанавливаем эту переменную глобально.
(function()
{
	'use strict';
	const COUNTED_STORAGE_NAME = 'counted';
	if (!localStorage.getItem(COUNTED_STORAGE_NAME))
	{
		localStorage.setItem(COUNTED_STORAGE_NAME, 'true');
		navigator.sendBeacon(MESSAGE_SERVER, JSON.stringify({counter: true}));
	}
})();