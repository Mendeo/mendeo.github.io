---
layout: post
title: Сделал скрипт для увеличения картинок при клике на них
date: 2020-05-05 11:52:00 +03
modified: 2024-04-09 12:04:00 +03
categories: web javascript
tags: [web, javascript, css]
excerpt_separator: <a name="cut"></a>
links_in_new_tab: false
has_scalable_images: true
disqus_page_id: 769780B7f26Lr492jCOdPQZLIMdf3dK7O7574Ckg2q219vF644j4483319B759T6
---
Обновление от 04.04.2024.  
Итак, что это такое? Пусть есть веб-страница с одной или несколькими изображениями и требуется увеличивать изображение, при клике на него. Что-то вроде галереи. При загрузке страницы сначала на ней будут отображаться маленькие картинки с низким разрешением, но если на какую-либо картинку кликнуть, то начнёт загружаться изображение с высоким разрешением и произойдёт анимация увеличения. Во время загрузки большой картинки будет отображаться иконка загрузки (вращающиеся стрелки). Это будет происходить только при первом клике. Если на странице картинок несколько, слева и справа от увеличенной картинки появятся стрелки для листания.  
Исходный код можно скачать с [Github](https://github.com/Mendeo/image_enlarger), подробное описание как всё сделать под катом.  

<a name="cut"></a>
**Посмотреть как это работает**  
<img alt="Фото тюльпанов" data-src-big="{% link assets/posts/script-uvelichenie-kartinok/big/tulpan.jpg %}" src="{% link assets/posts/script-uvelichenie-kartinok/small/tulpan.jpg %}">
<img alt="Фото цветов айвы" data-src-big="{% link assets/posts/script-uvelichenie-kartinok/big/ajva.jpg %}" src="{% link assets/posts/script-uvelichenie-kartinok/small/ajva.jpg %}">

## Подготавливаем HTML
Для того, чтобы картинка могла увеличиваться требуется, чтобы у тега "img" был атрибут "data-src-big". В значение этого атрибута нужно прописать путь к изображению высокого разрешения. А в атрибут "src" нужно установить путь к изображению низкого разрешения.  

```html
<img alt="Фото тюльпанов" data-src-big="<путь к картинке с высоким разрешением, например 1920X1080>" src="<путь к картинке с низким разрешением, например 266X150>">
<img alt="Фото цветов айвы" data-src-big="<путь к картинке с высоким разрешением, например 1920X1080>" src="<путь к картинке с низким разрешением, например 266X150>">
```
Не забудтьте подключить CSS и JavaScript. Можно просто CSS прописать внутри ```<style></style>```, а JavaScript - внутри ```<script></script>```.

## Подготавливаем CSS  
Для этого требуется в ```img[data-src-big]``` в свойство ```background``` поместить ссылку на иконку загрузки. <a href="{%- link assets/posts/script-uvelichenie-kartinok/load.svg -%}" download>Скачать.</a>  
Далее, в ```.image-enlager-left-arrow:hover``` в свойство ```background``` поместить ссылку на левую стрелку. <a href="{%- link assets/posts/script-uvelichenie-kartinok/left-arrow.svg -%}" download>Скачать.</a>  
Наконец, в ```.image-enlager-right-arrow:hover``` в свойство ```background``` поместить ссылку на правую стрелку. <a href="{%- link assets/posts/script-uvelichenie-kartinok/right-arrow.svg -%}" download>Скачать.</a>  

**CSS-код:**  
```css
img[data-src-big]
{
  cursor: pointer;
  transition-property: width, height, left, top;
  background: url('<путь к иконке "загрузка">') no-repeat center;
}

.image-enlager-animation-normal
{
  transition-duration: 0.3s;
}

.image-enlager-animation-fast
{
  transition-duration: 0.001s;
}

.image-enlager-arrow
{
  background-color: rgba(0, 0, 0, 0);
  position: fixed;
  top: 0px;
  width: 30%;
  z-index: 3;
}

.image-enlager-arrow:hover
{
  cursor: pointer;
}

.image-enlager-left-arrow:hover
{
  background: url('<путь к стрелке влево>') no-repeat left;
}

.image-enlager-right-arrow:hover
{
  background: url('<путь к стрелке вправо>') no-repeat right;
}

.image-enlager-no-arrows:hover
{
  cursor: default;
  background: none;
}


.image-enlager-background
{
  background-color: rgba(48, 48, 48, 0.6);
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 1;
}

.image-enlager-placeholder
{
  background-color: rgb(200, 200, 200);
}

@media screen and (max-width: 1080px)
{
  .image-enlager-left-arrow:hover
  {
    background: none
  }

  .image-enlager-right-arrow:hover
  {
    background: none
  }
  
  .image-enlager-arrow
  {
    width: 20%;
  }
}
```

Для ночной темы можно инвертировать цвет стрелок:  
```css
.image-enlager-right-arrow
{
	filter: invert(100%);
}
.image-enlager-left-arrow
{
	filter: invert(100%);
}
.image-enlager-right-arrow
{
	filter: invert(100%);
}
```

## JavaScript  
Код JavaScript обернём в function, чтобы не портить глобальную область видимости.

```javascript
(function()
{
  'use strict';
  let currentBigImg;
  let isArrowClicked = false;
  //Создаём полупрозрачный серый фон на заднем плане под увеличенным изображением.
  //Он будет перекрывать все элементы экрана.
  const body = document.getElementsByTagName('body')[0];
  const imgBg = document.createElement('div');
  imgBg.className = 'image-enlager-background';
  body.appendChild(imgBg);
  //Левая и правая стрелки для листания картинок.
  const imgLeftArrow = document.createElement('div');
  imgLeftArrow.classList.add('image-enlager-arrow');
  imgLeftArrow.classList.add('image-enlager-left-arrow');
  imgLeftArrow.style = 'left: 0px;';
  body.appendChild(imgLeftArrow);
  const imgRightArrow = document.createElement('div');
  imgRightArrow.classList.add('image-enlager-arrow');
  imgRightArrow.classList.add('image-enlager-right-arrow');
  imgRightArrow.style = 'right: 0px;';
  body.appendChild(imgRightArrow);

  const imgSatellites = [imgBg, imgLeftArrow, imgRightArrow]; //Записываем все элементы, которые нужны для увеличенного изображения в один массив, чтобы не вызывать одни и теже действия над каждый отдельным элементом.
  imgSatellites.forEach(s => s.hidden = true);

  fillBg(); //Функция, которая растягивает серый фон по высоте на весь экран.
  //Перерисовываем высоту серого фона при изменении размеров окна браузера.
  window.addEventListener('resize', fillBg);
  function fillBg()
  {
    let height = (document.documentElement.clientHeight) + 'px';
    imgSatellites.forEach(s => s.style.height = height);
  }

  //Определяем долю от размера экрана, которую будет занимать увеличенное изображение
  let bigImgageScreenFraction;
  setImageScreenFraction();
  window.addEventListener('resize', setImageScreenFraction);
  function setImageScreenFraction()
  {
    if (window.matchMedia('(max-width: 768px)').matches) //Зашли с мобильного.
    {
      bigImgageScreenFraction = 1.0;
    }
    else //Зашли с компьютера.
    {
      bigImgageScreenFraction = 0.7;
    }
  }
  //Заглушка для картинки. Появляется вместо неё на том месте откуда она увеличилась.
  let placeholder = document.createElement('img');
  placeholder.className = 'image-enlager-placeholder';
  let imgCache = new Map();
  const imgs = document.querySelectorAll('img[data-src-big]');
  let isGoingToSmall = false; //Переменная для отслеживания анимации уменьшения.
  for (let i = 0; i < imgs.length; i++)
  {
    let img = imgs[i];
    img.smallSrc = img.src;
    img.index = i;

    const onFirstLoad = function()
    {
      img.removeEventListener('load', onFirstLoad);
      img.defaultStyle = `width: ${img.width}px; height: ${img.height}px`; //Устанавливаем фактические размеры маленькой картинки.
      img.style = img.defaultStyle; //Чтобы анимация работала при первом клике, нужно явно задать ширину и высоту для загруженной маленькой картинки.
      img.addEventListener('click', () =>
      {
        currentBigImg = img;
        img.className = 'image-enlager-animation-normal';
        if (img.isBig) //Картинка большая - уменьшаем
        {
          doImageSmall();
          //Восстанавливаем стрелки перелистывания, если картинка уменьшилась.
          if (img.index === 0)
          {
            showLeftArrow();
          }
          else if (img.index === imgs.length - 1)
          {
            showRightArrow();
          }
        }
        else //Картинка маленькая - увеличиваем.
        {
          doImageBig();
          //Убираем соответствующие стрелки перелистывания, если кликнули по первой или последней картинке.
          if (img.index === 0)
          {
            hideLeftArrow();
          }
          else if (img.index === imgs.length - 1)
          {
            hideRightArrow();
          }
        }
      });
      img.addEventListener('transitionend', () =>
      {
        if (isGoingToSmall) //Отследили завершение анимации уменьшения.
        {
          //Вставляем картинку обратно в поток.
          img.style = img.defaultStyle;
          isGoingToSmall = false;
          //Убираем заглушку.
          placeholder.hidden = true;
          //Если изображение было уменьшено по нажатию на стрелочку, то увеличиваем новое изображение.
          if (isArrowClicked)
          {
            isArrowClicked = false;
            currentBigImg.className = 'image-enlager-animation-fast';
            doImageBig();
          }
        }
      });
    };
    if (img.complete)
    {
      onFirstLoad();
    }
    else
    {
      img.addEventListener('load', onFirstLoad);
    }
  }

  //Эта функция уменьшает увеличенное изображение.
  function doImageSmall()
  {
    window.removeEventListener('resize', makeImageBig);
    if (currentBigImg.bigSrcStatus === 'loading') //Если картинка не загрузилась, то мы ставим старое маленькое изображение в источник.
    {
      currentBigImg.bigSrcStatus = 'needReload';
      //В Хроме пока большая картинка не загрузилась, то отображается background. Поэтому если мы уменьшаем картинку, нужно вернуть источник на маленьккую картинку.
      //В Firefox менять источник не нужно, т.к. он не кэширует недозагруженные изображения и одновременно не показывает background у них.
      if (!navigator.userAgent.includes('Firefox'))
      {
        currentBigImg.removeEventListener('load', bigImageLoaded);
        currentBigImg.src = currentBigImg.smallSrc;
        //Для всех браузеров, кроме Firefox, продолжаем загрузку картинки в фоне (когда она маленькая). Если пользователь кликает по разным изображениям, то все эти изображения будут кэшироваться в Map'е imgCache.
        let key = currentBigImg.getAttribute('data-src-big');
        if (!imgCache.has(key))
        {
          let auxImg = document.createElement('img');
          auxImg.src = key;
          imgCache.set(key, auxImg);
        }
      }
    }
    //Смотрим по каким координатам надо вернуть картинку на место.
    let coords = placeholder.getBoundingClientRect();
    //Устанавливаем для изображения уменьшенный размер.
    //Но position остаётся fixed, т.к. нужно, чтобы при анимации уменьшения не смещались остальные элементы страницы.
    currentBigImg.style = `${currentBigImg.defaultStyle}; position: fixed; left: ${coords.left}px; top: ${coords.top}px`;
    currentBigImg.isBig = false;
    //Убираем фон и стрелки листатели, только если нажали на саму картинку, а не на перелистывание.
    if (!isArrowClicked) imgSatellites.forEach(s => s.hidden = true);
    //Указываем, что мы собираемся уменьшить картинку.
    //Эта переменная опять станет false, когда завершится анимация уменьшения.
    isGoingToSmall = true;
    //document.getElementsByTagName('body')[0].style = 'overflow: auto;';
  }

  function bigImageLoaded(e)
  {
    let img = e.target;
    img.bigSrcStatus = 'loaded';
    imgCache.delete(img.getAttribute('data-src-big'));
    img.removeEventListener('load', bigImageLoaded);
  }
  //Эта функция отрисовывает все сопутствующие элементы при увеличении картинки. Само увеличение производится вызовом функции makeImageBig.
  function doImageBig()
  {
    imgSatellites.forEach(s => s.hidden = false);
    currentBigImg.isBig = true;
    //Перед тем как увеличить картинку вставляем вместо неё заглушку.
    placeholder.hidden = false;
    placeholder.style = `width: ${currentBigImg.width}px; height: ${currentBigImg.height}px;`;
    currentBigImg.before(placeholder);
    //document.getElementsByTagName('body')[0].style = 'overflow: hidden;';
    makeImageBig();
    window.addEventListener('resize', makeImageBig);
    if (currentBigImg.bigSrcStatus !== 'loaded') //Проверяем, загружена ли уже полноразмерная картинка.
    {
      //В Firefox не нужно менять источник снова, если он уже был раньше изменён на большую картинку, иначе Firefox начнёт перезагружать картинку.
      if (!(navigator.userAgent.includes('Firefox') && currentBigImg.bigSrcStatus === 'needReload')) currentBigImg.src = currentBigImg.getAttribute('data-src-big'); //Загружаем большое изображение.
      currentBigImg.bigSrcStatus = 'loading';
      currentBigImg.addEventListener('load', bigImageLoaded);
    }
  }

  //Эта функция вычисляет размеры и положение большого изображения и применяет вычисленные стили.
  function makeImageBig()
  {
    let screenHeight = document.documentElement.clientHeight;
    let screenWidth = document.documentElement.clientWidth;
    let imgWidth = currentBigImg.width;
    let imgHeight = currentBigImg.height;
    let bigImgHeight = Math.round(screenHeight * bigImgageScreenFraction);
    let bigImgWidth = Math.round(screenWidth * bigImgageScreenFraction);
    let ratio = imgWidth / imgHeight;
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
    currentBigImg.style = `width: ${bigImgWidth}px; height: ${bigImgHeight}px; left: ${left}px; top: ${top}px; position: fixed; z-index: 2;`;
  }

  //Обрабатываем клики на стрелочки - листалки.
  imgLeftArrow.addEventListener('click', () =>
  {
    if (currentBigImg.index > 0)
    {
      isArrowClicked = true;
      currentBigImg.className = 'image-enlager-animation-fast';
      doImageSmall(); //Увеличивать новое изображение будем после уменьшения старого.
      currentBigImg = imgs[currentBigImg.index - 1];

      //Долистали до первого изображения - убираем левую стрелку.
      if (currentBigImg.index === 0) hideLeftArrow();
      //Перелистнули с последнего изображения влево - возвращаем правую стрелку.
      if (currentBigImg.index === imgs.length - 2) showRightArrow();
    }
  });
  imgRightArrow.addEventListener('click', () =>
  {
    if (currentBigImg.index < imgs.length - 1)
    {
      isArrowClicked = true;
      currentBigImg.className = 'image-enlager-animation-fast';
      doImageSmall(); //Увеличивать новое изображение будем после уменьшения старого.
      currentBigImg = imgs[currentBigImg.index + 1];

      //Долистали до последнего изображения - убираем правую стрелку.
      if (currentBigImg.index === imgs.length - 1) hideRightArrow();
      //Перелестнули вправо с первого изображения - возвращаем левую стрелку.
      if (currentBigImg.index === 1) showLeftArrow();
    }
  });

  function showLeftArrow()
  {
    imgLeftArrow.classList.remove('image-enlager-no-arrows');
  }
  function hideLeftArrow()
  {
    imgLeftArrow.classList.add('image-enlager-no-arrows');
  }
  function showRightArrow()
  {
    imgRightArrow.classList.remove('image-enlager-no-arrows');
  }
  function hideRightArrow()
  {
    imgRightArrow.classList.add('image-enlager-no-arrows');
  }
})();
```
