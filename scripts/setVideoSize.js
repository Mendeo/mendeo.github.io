// Скрипт для задания размеров видео блоков
(function()
{
	'use strict';
	const videos = document.querySelectorAll('.video');
	videos.forEach(v =>
	{
		const parent = v.parentNode;
		const width = parent.clientWidth;
		resize(v, width);
		window.addEventListener('resize', () => resize(v, width));
	});
	
	function resize(video, width)
	{
		if (window.matchMedia('(max-width: 768px)').matches) 
		{
			width *= 1; //Зашли с телефона.
		}
		else
		{
			width *= 0.7; //Зашли с компьютера.
		}
		video.style.width = width + 'px';
		video.style.height = width * 9 / 16 + 'px';
	}
})();