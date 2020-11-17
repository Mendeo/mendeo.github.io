---
~
---

(function()
{
	'use strict';
	const styleTag = document.getElementById('mainStyle');
	const button = document.getElementById('changeThemeButton');

	let isDark = false;
	const THEME_STORAGE_NAME = 'themeSelected';
	const STORAGE_LIGHT_THEME = 'light';
	const STORAGE_DARK_THEME = 'dark';
	let selectedTheme = localStorage.getItem(THEME_STORAGE_NAME);
	if (selectedTheme)
	{
		if (selectedTheme === STORAGE_LIGHT_THEME)
		{
			isDark = false;
		}
		else if (selectedTheme === STORAGE_DARK_THEME)
		{
			isDark = true;
		}
		else
		{
			setThemeToLocalStorage(false);
		}
	}
	else
	{
		setThemeToLocalStorage(false);
	}

	function setThemeToLocalStorage(isDark)
	{
		if (isDark)
		{
			localStorage.setItem(THEME_STORAGE_NAME, STORAGE_DARK_THEME);
			isDark = true;
		}
		else
		{
			localStorage.setItem(THEME_STORAGE_NAME, STORAGE_LIGHT_THEME);
			isDark = false;
		}
	}

	changeTheme(isDark);
	button.addEventListener('click', function() 
	{
		isDark = !isDark;
		changeTheme(isDark);
	});
	
	function changeTheme(isDark)
	{
		if (isDark)
		{
			styleTag.href = '{% link assets/css/style_dark.scss %}';
			button.innerHTML = 'Светлая тема';
		}
		else
		{
			styleTag.href = '{% link assets/css/style_light.scss %}';
			button.innerHTML = 'Тёмная тема';
		}
		setThemeToLocalStorage(isDark);
	}
})();