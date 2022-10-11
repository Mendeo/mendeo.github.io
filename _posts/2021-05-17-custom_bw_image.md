---
layout: post
title: "Web страница для подготовки изображений к гравировки"
date: 2022-10-11 20:20:00 +03
modified: 2022-10-11 20:25:00 +03
categories: js web
tags: [гравировка, javascript, web, фотография, чёрное-белое]
excerpt_separator: <a name="cut"></a>
links_in_new_tab: true
has_scalable_images: true
disqus_page_id: GVVVWMhEi5E3413o57a2A7DJ74pBr6A657n3rbfsjdvHxuHDEN3JORC0gs8SjkYc
---
На днях хотел сделать программку для помощи в распознавании текстов, но как это иногда бывает получилось другое. А именно, вышла простая программа для подготовки изображений для гравировки. Суть заключается в том, что исходное изображение преобразуется в двухцветное (чёрно-белое) с возможностью выбирать уровень яркости, при котором точка исходного изображения считается белой или чёрной. Кроме гравировки такое изображение позволяет, например, увидеть невидимые низкоконтрастные детали на исходном изображении, например отпечатки пальцев на отсканированной фотографии и т.п. В общем забавная вещь. И тут я решил вспомнить навыки веб программирования и сделал отдельное веб приложение! Можете поиграться прям тут ниже или на [отдельной странице](https://bw.mendeo.ru).
<a name="cut"></a>

### Пример подготовки изображения для гравировки (кликабельно)

<style scoped>
	.custom-bw-image-post-picture-container
	{
		display: flex;
		flex-direction: row;
		width: 60%;
		justify-content: space-between;
	}
	@media screen and (max-width: 1080px)
	{
		.custom-bw-image-post-picture-container
		{
			flex-direction: column;
			width 100%;
		}
		.custom-bw-image-post-picture-container > div:first-child
		{
			margin-bottom: 1rem;
		}
	}
	.custom-bw-image-post-picture-container-item
	{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>

<div class="custom-bw-image-post-picture-container">
	<div class="custom-bw-image-post-picture-container-item">
		<span>Исходное фото, снятое на телефон</span>
		<img alt="Исходное фото, снятое на телефон" src-big="{% link assets/posts/custom_bw_image/big/cat.jpg %}" src="{% link assets/posts/custom_bw_image/small/cat.jpg %}">
	</div>
	<div class="custom-bw-image-post-picture-container-item">
		<span>Изображение, готовое для гравировки</span>
		<img alt="Изображение, готовое для гравировки" src-big="{% link assets/posts/custom_bw_image/big/cat_bw.jpg %}" src="{% link assets/posts/custom_bw_image/small/cat_bw.jpg %}">
	</div>
</div>

### Попробовать своё изображение  
{%- include projects/custom_bw_image.html -%}