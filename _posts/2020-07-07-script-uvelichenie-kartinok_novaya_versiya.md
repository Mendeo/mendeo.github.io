---
layout: post
title: Улучшил скрипт для увеличения картинок при клике на них
date: 2020-07-07 15:45:00 +03
modified: 2020-07-07 16:03:00 +03
categories: web javascript
tags: [web, javascript, css]
excerpt_separator: <a name="cut"></a>
links_in_new_tab: true
has_scalable_images: true
---
Улучшил скрипт, для увеличения картинок, о котором я [писал]({%- post_url 2020-07-07-script-uvelichenie-kartinok_novaya_versiya -%}) раньше. Теперь изображения большого размера сразу не загружаются. Загрузка начинается только после клика на картинку. Пришлось повозиться с кэшированием и особенностями работы в разных браузерах. Новый скрипт и пример его работы представлен по катом. А последние изменения, если таковые будут, можно отслеживать на [Github](https://github.com/Mendeo/image_enlarger). К сожалению, история разработки не сохранилась из-за проблем с git.  
В обновлённом скрипте обрабатываются картинки с тегом “img”, имеющие атрибут “src-big”. В этот атрибут нужно прописать путь к изображению высокого разрешения. А в атрибут "src" нужно установить путь к изображению низкого разрешения. Размер уменьшенного изображения определяется размером картинки низкого разрешения, а размер увеличенного изображения - размерами экрана.

<a name="cut"></a>
**Посмотреть как это работает**  
<img alt="Фото тюльпанов" src-big="/assets/photos/big/tulpan.jpg" src="/assets/photos/small/tulpan.jpg">
<img alt="Фото цветов айвы" src-big="/assets/photos/big/ajva.jpg" src="/assets/photos/small/ajva.jpg">

**html**  

```html
<img alt="Фото тюльпанов" src-big="/assets/photos/big/tulpan.jpg" src="/assets/photos/small/tulpan.jpg">
<img alt="Фото цветов айвы" src-big="/assets/photos/big/ajva.jpg" src="/assets/photos/small/ajva.jpg">
```

**JavaScript**  

```javascript
(function()
{
	'use strict';
	//Создаём полупрозрачный серый фон на заднем плане под увеличенным изображением.
	//Он будет перекрывать все элементы экрана.
	const imgBg = document.createElement('div');
	document.getElementsByTagName('body')[0].appendChild(imgBg);
	imgBg.style = 'background-color: rgba(48, 48, 48, 0.6); position: fixed; top: 0px; left: 0px; width: 100%; z-index: 1';
	imgBg.hidden = true;
	fillBg(); //Функция, которая растягивает серый фон по высоте на весь экран.
	//Перерисовываем высоту серого фона при изменении размеров окна браузера.
	window.addEventListener('resize', fillBg);
	function fillBg()
	{
		imgBg.style.height = (document.documentElement.clientHeight + 100) + 'px';
	}
	
	//Определяем долю от размера экрана, которую будет занимать увеличенное изображение
	let bigImgageScreenFraction;
	if (window.matchMedia('(max-width: 1080px)').matches) //Зашли с мобильного.
	{
		bigImgageScreenFraction = 1.0;
	}
	else //Зашли с компьютера.
	{
		bigImgageScreenFraction = 0.7;
	}
	//Заглушка для картинки. Появляется вместо неё на том месте откуда она увеличилась.
	let placeholder = document.createElement('img');
	let imgCache = new Map();
	document.querySelectorAll('img[src-big]').forEach((img) =>
	{
		img.smallSrc = img.src;
		if (img.complete)
		{
			onFirstLoad();
		}
		else
		{
			img.addEventListener('load', onFirstLoad);
		}
		function onFirstLoad()
		{
			img.removeEventListener('load', onFirstLoad);
			let defaultStyle = `width: ${img.width}px; height: ${img.height}px`; //Устанавливаем фактические размеры маленькой картинки.
			img.style = defaultStyle; //Чтобы анимация работала при первом клике, нужно явно задать ширину и высоту для загруженной маленькой картинки.
			let isGoingToSmall = false;
			function bigImageLoading()
			{
				img.bigSrcStatus = 'loaded';
				imgCache.delete(img.getAttribute('src-big'));
				img.removeEventListener('load', bigImageLoading);
			}
			img.addEventListener('click', () => 
			{
				if (img.isBig) //Картинка большая - уменьшаем
				{
					if (img.bigSrcStatus === 'loading') //Если картинка не загрузилась, то мы ставим старое маленькое изображение в источник.
					{
						img.bigSrcStatus = 'needReload';
						if (!navigator.userAgent.includes('Firefox')) //В Firefox менять источник не нужно, т.к. он не кэширует недозагруженные изображения и одновременно не показывает background у них.
						{
							img.removeEventListener('load', bigImageLoading);
							img.src = img.smallSrc;
							//Для всех браузеров, кроме Firefox, продолжаем загрузку картинки в фоне (когда она маленькая). Если пользователь кликает по разным изображениям, то все эти изображения будут кэшироваться в Map'е imgCache.
							let key = img.getAttribute('src-big');
							if (!imgCache.has(key))
							{
								let auxImg = document.createElement('img');
								auxImg.src = key
								imgCache.set(key, auxImg);
							}
						}
					}
					//Смотрим по каким координатам надо вернуть картинку на место.
					let coords = placeholder.getBoundingClientRect();
					//Устанавливаем для изображения уменьшенный размер.
					//Но position остаётся fixed, т.к. нужно, чтобы при анимации уменьшения не смещались остальные элементы страницы.
					img.style = `${defaultStyle}; position: fixed; left: ${coords.left}px; top: ${coords.top}px`;
					img.isBig = false;
					imgBg.hidden = true;
					//Указываем, что мы собираемся уменьшить картинку.
					//Эта переменная опять станет false, когда завершится анимация уменьшения.
					isGoingToSmall = true;
				}
				else //Картинка маленькая - увеличиваем.
				{
					imgBg.hidden = false;
					img.isBig = true;
					//Перед тем как увеличить картинку вставляем вместо неё заглушку.
					placeholder.hidden = false;
					placeholder.style = `width: ${img.width}px; height: ${img.height}px; background-color: rgb(200, 200, 200)`;
					img.before(placeholder);
					doImageBig(img);
					if (img.bigSrcStatus !== 'loaded') //Проверяем, загружена ли уже полноразмерная картинка.
					{
						//В Firefox не нужно менять источник снова, если он уже был раньше изменён на большую картинку, иначе Firefox начнёт перезагружать картинку.
						if (!(navigator.userAgent.includes('Firefox') && img.bigSrcStatus === 'needReload')) img.src = img.getAttribute('src-big'); //Загружаем большое изображение.
						img.bigSrcStatus = 'loading';
						img.addEventListener('load', bigImageLoading);
					}
				}
			});
			img.addEventListener('transitionend', () =>
			{
				if (isGoingToSmall) //Отследили завершение анимации уменьшения.
				{
					//Вставляем картинку обратно в поток.
					img.style = defaultStyle;
					isGoingToSmall = false;
					//Убираем заглушку.
					placeholder.hidden = true;
				}
			}); 
			//Сохраняем центровку увеличенной картинки при изменении размеров окна браузера.
			window.addEventListener('resize', () => 
			{
				if (img.IsBig) doImageBig(img);
			});
		}
	});
	
	//Эта функция расчитывает размеры увеличенного изображения и центрирует его.
	//Принимает параметр размера маленького изображения (ширина и высота), что вычислить соотношение сторон.
	function doImageBig(img)
	{
		let screenHeight = document.documentElement.clientHeight;
		let screenWidth = document.documentElement.clientWidth;
		let imgWidth = img.width;
		let imgHeight = img.height;
		let bigImgHeight = Math.round(screenHeight * bigImgageScreenFraction);
		let bigImgWidth = Math.round(screenWidth * bigImgageScreenFraction);
		let ratio = imgWidth / imgHeight
		let newWidth = Math.round(bigImgHeight * ratio);
		if (newWidth < bigImgWidth)
		{
			bigImgWidth = newWidth;
		}
		else
		{
			bigImgHeight = Math.round(bigImgWidth / ratio);
		}
		let left = Math.round(0.5 * (screenWidth - bigImgWidth));
		let top = Math.round(0.5 * (screenHeight - bigImgHeight));
		img.style = `width: ${bigImgWidth}px; height: ${bigImgHeight}px; left: ${left}px; top: ${top}px; position: fixed; z-index: 2`;
	}
})();
```

**CSS**  

```css
img[src-big]
{
	cursor: pointer;
	transition-property: width, height, left, top;
	transition-duration: 0.3s;
	background: url('assets/load.png') no-repeat center;
}
```