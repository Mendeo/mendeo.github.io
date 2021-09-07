---
layout: js_minifier
---
(function()
{
	'use strict';
	const styleLight = document.getElementById('main-style-light');
	const styleDark = document.getElementById('main-style-dark');
	const radioLight = document.getElementById('theme-light-input-radio');
	const radioDark = document.getElementById('theme-dark-input-radio');
	const radioSystem = document.getElementById('theme-system-input-radio');

	const THEME_STORAGE_NAME = 'themeSelected';
	const STORAGE_LIGHT_THEME = 'light';
	const STORAGE_DARK_THEME = 'dark';
	const STORAGE_SYSTEM_THEME = 'system';

	const selectedTheme = localStorage.getItem(THEME_STORAGE_NAME);
	setTheme(selectedTheme, true);

	radioDark.addEventListener('change', onThemeChange);
	radioLight.addEventListener('change', onThemeChange);
	radioSystem.addEventListener('change', onThemeChange);

	function setTheme(selectedTheme, setRadio)
	{
		if (!selectedTheme)
		{
			selectedTheme = STORAGE_SYSTEM_THEME;
			setThemeToLocalStorage(selectedTheme);
		}

		if (selectedTheme === STORAGE_LIGHT_THEME)
		{
			styleLight.media = 'all';
			styleDark.media = 'not all';
			if (setRadio) radioLight.checked = true;
		}
		else if (selectedTheme === STORAGE_DARK_THEME)
		{
			styleLight.media = 'not all';
			styleDark.media = 'all';
			if (setRadio) radioDark.checked = true;
		}
		else
		{
			styleLight.media = '(prefers-color-scheme: light)';
			styleDark.media = '(prefers-color-scheme: dark)';
			if (setRadio) radioSystem.checked = true;
			if (selectedTheme !== STORAGE_SYSTEM_THEME)
			{
				setThemeToLocalStorage(STORAGE_SYSTEM_THEME);
			}
		}
	}

	function onThemeChange()
	{
		let selectedTheme = '';
		if (radioLight.checked)
		{
			selectedTheme = STORAGE_LIGHT_THEME;
		}
		else if (radioDark.checked)
		{
			selectedTheme = STORAGE_DARK_THEME;
		}
		else if (radioSystem.checked)
		{
			selectedTheme = STORAGE_SYSTEM_THEME;
		}
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

	function setThemeToLocalStorage(value)
	{
		localStorage.setItem(THEME_STORAGE_NAME, value);
	}
})();