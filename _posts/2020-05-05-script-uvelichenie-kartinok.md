---
layout: post
title: Сделал скрипт для увеличения картинок при клике на них
date: 2020-05-05 11:52:00 +03
modified: 2020-05-05 22:59:00 +03
categories: web javascript
tags: [web, javascript, css]
excerpt_separator: <a name="cut"></a>
links_in_new_tab: true
---
За вчера и сегодня для своего сайта сделал небольшой скрипт. Теперь, если у тега "img" есть атрибут "scalable", то на картинку можно будет кликнуть, чтобы её увеличить. В значение атрибута "scalable" нужно задать размер маленькой картинки (с единицами измерения css). Это значение пойдёт в свойства css max-width и max-height изображения.  
Наконец можно будет заняться разделом "Мои фотографии"!  
Не стал искать готовых решений для такой задачи. Осваивать JS лучше на практике.  
Под катом код javascript с комментариями и css.

<a name="cut"></a>
**JavaScript**  
Обернём в function, чтобы вставить код прямо в html моего сайта и не портить глобальную область видимости.
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
  window.addEventListener('resize', fillBg); //Перерисовываем высоту серого фона при изменении размеров окна браузера.
  function fillBg()
  {
    imgBg.style.height = (document.documentElement.clientHeight + 100) + 'px';
  }
  
  const bigImgageScreenFraction = 0.7; //Доля от размера экрана, которую будет занимать увеличенное изображение
  let coords;
  let placeholder = document.createElement('img'); //Заглушка для картинки. Появляется вместо картинки на том месте откуда она увеличилась
  document.querySelectorAll('img[scalable]').forEach((img) =>
  {
    const smallSize = img.getAttribute('scalable');
    let defaultStyle = `max-width: ${smallSize}; max-height: ${smallSize}`;
    img.style = defaultStyle;
    let isGoingToSmall = false;
    img.addEventListener('click', () => 
    {
      if (img.getAttribute('is-big') === 'true') //Картинка большая - уменьшаем
      {
        img.style = `${defaultStyle}; position: fixed; left: ${coords.left}px; top: ${coords.top}px`; //Возвращаем уменьшенный размер, но position: fixed, т.к. нужно, чтобы при анимации уменьшения не смещались остальные элементы страницы.
        img.setAttribute('is-big', false);
        imgBg.hidden = true;
        isGoingToSmall = true; //Отслеживаем конец анимации, чтобы убрать position:fixed и вернуть картнку в поток.
      }
      else //Картинка маленькая - увеличиваем.
      {
        imgBg.hidden = false;
        img.setAttribute('is-big', true);
        coords = img.getBoundingClientRect(); //Запоминаем координаты картинки перед увеличением.
        //Перед тем как увеличить картинку вставляем вместо неё заглушку.
        placeholder.hidden = false;
        placeholder.style = `width: ${img.width}px; height: ${img.height}px; background-color: rgb(200, 200, 200)`;
        img.before(placeholder);
        doImageBig(img); //Увеличиваем картинку.
      }
    });
    img.addEventListener('transitionend', () =>
    {
      if (isGoingToSmall) //Отследили завершение анимации уменьшения.
      {
        img.style = defaultStyle; //Вставляем картинку обратно в поток.
        isGoingToSmall = false;
        placeholder.hidden = true; //Убираем заглушку
      }
    }); 
    //Сохраняем центровку увеличенной картинки при изменении размеров окна браузера.
    window.addEventListener('resize', () => 
    {
      if (img.getAttribute('is-big') === 'true') doImageBig(img);
    });
  });
  
  //Эта функция расчитывает размеры увеличенного изображения и центрирует его.
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
    img.style = `max-width: ${bigImgWidth}px; max-height: ${bigImgHeight}px; left: ${left}px; top: ${top}px; position: fixed; z-index: 2`;
  }
})();
```

**CSS**

```css
img[scalable]
{
  cursor: pointer;
  transition-property: max-width, max-height, left, top;
  transition-duration: 0.3s;
}
```