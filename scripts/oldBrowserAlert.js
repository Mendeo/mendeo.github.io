(function()
{
	'use strict';
	if (!"".includes)
	{
		//console.log('This is IE');
		var OLD_BROWSER_ALERT_STORAGE = 'oldBrowserAlertShown';
		var isShown = localStorage.getItem(OLD_BROWSER_ALERT_STORAGE);
		if (!isShown)
		{
			localStorage.setItem(OLD_BROWSER_ALERT_STORAGE, true);
			alert('Вы пользуетесь устаревшим браузером, поэтому, к сожалению, часть функционала сайта будет для Вас недоступна.');
		}
	}
})();