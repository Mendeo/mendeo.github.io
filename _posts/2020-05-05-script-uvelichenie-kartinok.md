---
layout: post
title: Сделал простой скрипт для увеличения картинок при клике на них
date: 2020-05-05 11:52:00 +03
modified: 2020-05-05 13:58:00 +03
categories: web javascript
tags: [web, javascript, css]
excerpt_separator: <a name="cut"></a>
links_in_new_tab: true
---
Вчера для своего сайта сделал небольшой скрипт. Теперь, если у тега "img" есть атрибут "scalable", то на картинку можно будет кликнуть, чтобы её увеличить. В значение атрибута "scalable" нужно задать размер маленькой картинки (с единицами измерения css). Это значение пойдёт в свойства css max-width и max-height изображения.  
Наконец можно будет заняться разделом "Мои фотографии"!  
Не стал искать готовых решений для такой простой задачи. Осваивать JS лучше на практике.  
Под катом код javascript и css.

<a name="cut"></a>
**JavaScript**  
Обернём в function, чтобы вставить код прямо в html моего сайта и не портить глобальную область видимости.
```javascript
(function()
{
  'use strict';
  //Создаём полупрозрачный серый фон на заднем плане под увеличенным изображением.
  const imgBg = document.createElement('div');
  document.getElementsByTagName('body')[0].appendChild(imgBg);
  imgBg.style = 'background-color: rgba(48, 48, 48, 0.6); position: fixed; top: 0px; left: 0px; width: 100%; z-index: 1';
  imgBg.hidden = true;
  fillBg();
  window.addEventListener('resize', fillBg);
  function fillBg()
  {
    imgBg.style.height = (document.documentElement.clientHeight + 100) + 'px';
  }
  
  const bigImgageScreenFraction = 0.7; //Доля от размера экрана, которую будет занимать увеличенное изображение

  document.querySelectorAll('img[scalable]').forEach((img) =>
  {
    const smallSize = img.getAttribute('scalable');
    const defaultStyle = `max-width: ${smallSize}; max-height: ${smallSize}`;
    img.style = defaultStyle;
    img.addEventListener('click', () => 
    {
      if (img.getAttribute('is-big') === 'true')
      {
        img.style = defaultStyle;
        img.setAttribute('is-big', false);
        imgBg.hidden = true;
      }
      else
      {
        imgBg.hidden = false;
        img.setAttribute('is-big', true);
        doImageBig(img);
      }
    });
    //Сохраняем пропорции при ресайзинге.
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
    console.log(bigImgHeight);
    console.log(bigImgWidth);
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
    img.style = `max-width: ${bigImgWidth}px; max-height: ${bigImgHeight}px; left: ${left}px; top: ${top}px; margin: auto; position: fixed; z-index: 2`;
  }
})();
```

**CSS**

```css
img[scalable]
{
  cursor: pointer;
  transition-property: max-width, max-height;
  transition-duration: 0.3s;
}
```