---
~
---

(function()
{
	'use strict';
	const styleTag = document.getElementById('mainStyle');
	function changeTheme(isDark)
	{
		if (isDark)
		{
			styleTag.href = '{% link assets/css/style_dark.scss %}';
		}
		else
		{
			styleTag.href = '{% link assets/css/style_light.scss %}';
		}
	}
})();