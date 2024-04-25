---
layout: js_minifier
---
(function()
{
	'use strict';
	const radioLight = document.getElementById('radio-light-theme');
	const radioDark = document.getElementById('radio-dark-theme');
	const radioAuto = document.getElementById('radio-auto-theme');

	const styleLight = document.getElementById('light-theme-css');
	const styleDark = document.getElementById('dark-theme-css');

	const THEME_STORAGE_NAME = 'selected-theme';
	const STORAGE_LIGHT_THEME = 'light';
	const STORAGE_DARK_THEME = 'dark';
	const STORAGE_AUTO_THEME = 'auto';

	const selectedTheme = localStorage.getItem(THEME_STORAGE_NAME);
	setTheme(selectedTheme);

	radioDark.addEventListener('change', onThemeChange);
	radioLight.addEventListener('change', onThemeChange);
	radioAuto.addEventListener('change', onThemeChange);

	function setTheme(selectedTheme)
	{
		if (selectedTheme !== STORAGE_LIGHT_THEME && selectedTheme !== STORAGE_DARK_THEME && selectedTheme !== STORAGE_AUTO_THEME)
		{
			selectedTheme = STORAGE_AUTO_THEME;
			setThemeToLocalStorage(STORAGE_AUTO_THEME);
		}

		if (selectedTheme === STORAGE_LIGHT_THEME)
		{
			styleLight.media = 'all';
			styleDark.media = 'not all';
			radioLight.checked = true;
		}
		else if (selectedTheme === STORAGE_DARK_THEME)
		{
			styleLight.media = 'not all';
			styleDark.media = 'all';
			radioDark.checked = true;
		}
		else
		{
			styleLight.media = '(prefers-color-scheme: light)';
			styleDark.media = '(prefers-color-scheme: dark)';
			radioAuto.checked = true;
		}
	}

	function onThemeChange()
	{
		let selectedTheme = '';
		let ifSet = false;
		if (radioLight.checked)
		{
			selectedTheme = STORAGE_LIGHT_THEME;
			ifSet = true;
		}
		else if (radioDark.checked)
		{
			selectedTheme = STORAGE_DARK_THEME;
			ifSet = true;
		}
		else if (radioAuto.checked)
		{
			selectedTheme = STORAGE_AUTO_THEME;
			ifSet = true;
		}
		if (ifSet)
		{
			setThemeToLocalStorage(selectedTheme);
			setTheme(selectedTheme);
			if (window.DISQUS)
			{
				DISQUS.reset(
					{
						reload: true,
						config: disqus_config
					});
			}
		}
	}

	function setThemeToLocalStorage(value)
	{
		localStorage.setItem(THEME_STORAGE_NAME, value);
	}
})();