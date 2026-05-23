var remark_config = {
	host: 'https://remark42.mendeo.ru/',
	site_id: 'mendeo.ru',
	theme: getCurrentTheme()
}

function getCurrentTheme()
{
	const THEME_STORAGE_NAME = 'selected-theme';
	const STORAGE_LIGHT_THEME = 'light';
	const STORAGE_DARK_THEME = 'dark';
	const STORAGE_AUTO_THEME = 'auto';
	const REMARK42_LIGHT = 'light';
	const REMARK42_DARK = 'dark';
	const selectedTheme = localStorage.getItem(THEME_STORAGE_NAME);

	if (selectedTheme === STORAGE_LIGHT_THEME)
	{
		return REMARK42_LIGHT;
	}
	else if (selectedTheme === STORAGE_DARK_THEME)
	{
		return REMARK42_DARK;
	}
	else
	{
		if (window.matchMedia('(prefers-color-scheme: light)').matches)
		{
			return REMARK42_LIGHT;
		}
		else
		{
			return REMARK42_DARK;
		}
	}
}

!function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);
