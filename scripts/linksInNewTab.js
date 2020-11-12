//Открываем ссылки в новом окне
(function ()
{
	'use strict';
	let links = document.querySelectorAll('.post a');
	links.forEach((link) =>
	{
		link.target = '_blank';
		link.rel = 'noopener';
	});
})();