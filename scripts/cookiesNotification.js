---
layout: js_minifier
---

(function()
{
	'use strict';
	const COOKIES_NOTIFICATION_STORAGE_NAME = 'cookiesNotification';
	if (!localStorage.getItem(COOKIES_NOTIFICATION_STORAGE_NAME))
	{
		const notificationForm = document.querySelector('#cookiesNotification');
		notificationForm.style = 'display: flex;';
		const button = document.querySelector('#cookiesNotification button');
		button.addEventListener('click', () =>
		{
			notificationForm.style = 'display: none;';
			localStorage.setItem(COOKIES_NOTIFICATION_STORAGE_NAME, true);
		});
	}
})();