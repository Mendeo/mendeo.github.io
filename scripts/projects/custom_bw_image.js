(function()
{
	'use strict';
	const inputImg = document.getElementById('inputImage');
	const blackPower = document.getElementById('blackPower');
	const powerSpan = document.querySelector('#blackPowerContainer span');
	const outputImg = document.getElementById('outputImage');
	const inputFileEl = document.getElementById('inputFile');
	const body = document.getElementsByTagName('body')[0];
	const imgBg = document.createElement('div');
	const progressBar = document.getElementById('progressBarContainer');
	const progressBar_bar = document.querySelector('#progressBarContainer progress');
	const errorFileSpan = document.querySelector('#inputFile + span');

	let hasNoInputFileYet = true;
	startShowHide(true);

	function startShowHide(isHide)
	{
		inputImg.hidden = isHide;
		outputImg.hidden = isHide;
		blackPower.hidden = isHide;
		powerSpan.hidden = isHide;
	}

	blackPowerWidth();
	window.addEventListener('resize', blackPowerWidth);
	function blackPowerWidth()
	{
		blackPower.style = `width: ${inputImg.width}px;`;
	}
	powerSpan.innerText = blackPower.value;
	blackPower.addEventListener('input', () => powerSpan.innerText = blackPower.value);

	imgBg.className = 'custom-bw-image-progress-bar-background';
	body.appendChild(imgBg);
	removeProgressBar();

	function showProgressBar()
	{
		window.addEventListener('resize', showProgressBar);
		fillBackground(); //Функция, которая растягивает серый фон по высоте на весь экран.
		//Перерисовываем высоту серого фона при изменении размеров окна браузера.
		imgBg.hidden = false;
		progressBar.hidden = false;
		const screenHeight = document.documentElement.clientHeight;
		const screenWidth = document.documentElement.clientWidth;
		const progressCoord = progressBar.getBoundingClientRect();
		const progressWidth = progressCoord.right - progressCoord.left;
		const progressHeight = progressCoord.bottom - progressCoord.top;
		const left = Math.round(0.5 * (screenWidth - progressWidth));
		const top = Math.round(0.5 * (screenHeight - progressHeight));
		progressBar.style = `left: ${left}px; top: ${top}px`;
	}
	function removeProgressBar()
	{
		window.removeEventListener('resize', showProgressBar);
		imgBg.hidden = true;
		progressBar.hidden = true;
	}
	function fillBackground()
	{
		let height = (document.documentElement.clientHeight) + 'px';
		imgBg.style.height = height;
	}

	//Обработка изображения.
	const refCanvas = document.createElement('canvas');
	const refCanvasCtx = refCanvas.getContext('2d', { willReadFrequently: true });
	let imageDataInitial;
	let calcSpeed;

	const refImg = new Image();
	inputFileEl.addEventListener('change', () =>
	{
		refCanvasCtx.clearRect(0, 0, refCanvas.width, refCanvas.height);
		//Даём время на очистку канваса.
		setTimeout(()=>
		{
			const imgFile = inputFileEl.files[0];
			if (imgFile.type.startsWith('image/'))
			{
				errorFileSpan.hidden = true;
				if (hasNoInputFileYet)
				{
					startShowHide(false);
					hasNoInputFileYet  = false;
				}
				const reader = new FileReader();
				reader.readAsDataURL(imgFile);
				reader.addEventListener('load', () =>
				{
					refImg.src = reader.result;
					inputImg.src = refImg.src;
					if (refImg.complete)
					{
						doImageProcess();
					}
					else
					{
						refImg.addEventListener('load', () =>
						{
							doImageProcess();
						});
					}
				});
			}
			else
			{
				errorFileSpan.hidden = false;
			}
		}, 0);
	});

	function doImageProcess()
	{
		refCanvas.width = refImg.width;
		refCanvas.height = refImg.height;
		blackPowerWidth();
		refCanvasCtx.drawImage(inputImg, 0, 0);
		imageDataInitial = refCanvasCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);
		blackPower.removeEventListener('change', makeBlackWhite);
		blackPower.removeEventListener('input', makeBlackWhite);
		calcSpeed = 0; //0 - ещё не меряли, 1 - медленно, 2 - быстро
		makeBlackWhite();
	}

	function makeBlackWhite()
	{
		const power = blackPower.valueAsNumber;
		const imageData = refCanvasCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);
		progressBar_bar.value = 0;
		showProgressBar();
		let currentPercent = 0;
		let percent = 0;
		let i = 0;
		calc();
		function calc()
		{
			let calcPercentStartTime;
			if (calcSpeed === 0) calcPercentStartTime = new Date();
			while(percent === currentPercent)
			{
				const avg = (imageDataInitial.data[i] + imageDataInitial.data[i + 1] + imageDataInitial.data[i + 2]) / 3;
				let pointValue = avg > power ? 255 : 0;
				imageData.data[i] = pointValue; // red
				imageData.data[i + 1] = pointValue; // green
				imageData.data[i + 2] = pointValue; // blue
				i += 4
				if (i === imageData.data.length)
				{
					refCanvasCtx.clearRect(0, 0, refCanvas.width, refCanvas.height); //Так работает лучше.
					refCanvasCtx.putImageData(imageData, 0, 0);
					outputImg.src = refCanvas.toDataURL();
					removeProgressBar();
					return;
				};
				percent = Math.floor(i * 100 / (imageData.data.length - 1));
			}
			currentPercent = percent;
			progressBar_bar.value = currentPercent;
			if (calcSpeed === 0) //Если ещё не измеряли скорость расчётов, то измеряем сейчас.
			{
				let calcPercentTimeLength = (new Date()) - calcPercentStartTime;
				if (calcPercentTimeLength > 1) //Расчёт одного процента дольше миллисекунды.
				{
					calcSpeed = 1;
					blackPower.addEventListener('change', makeBlackWhite);
				}
				else
				{
					calcSpeed = 2;
					blackPower.addEventListener('input', makeBlackWhite);
				}
			}
			if (calcSpeed === 1) //Если, считается долго
			{
				setTimeout(calc, 0); //Даём время обновиться прогресс бару
			}
			else if (calcSpeed === 2) //Если считается быстро - не обновляем прогресс бар
			{
				calc();
			}
		}
	}
})();
