---
layout: js_minifier
---

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