---
~
---

//Подключение системы комментариев.
var disqus_config = function ()
{
	this.page.url = '{{ site.url }}{{ page.url }}';
	this.page.identifier = '{{ page.url }}';
	//Отправка оставленного комментария ко мне в телеграм.
	this.callbacks.onNewComment = [function(comment)
	{
		//console.log('New comment!');
		const msg = 
		{
			text: comment.text,
			page: '{{ site.url }}{{ page.url }}',
			id: comment.id
		};
		const error = 'Cannot resend message to telegram.';
		fetch(MESSAGE_SERVER,
		{
			method: 'POST',
			headers:
			{
				'Content-Type': 'text/plain' //'application/json' - not work for wix site (wix send 403 for options requests)
			},
			body: JSON.stringify(msg)
		}).then(function(res) 
		{
			if (!res.ok) console.log(error);
		}).catch(function(err)
		{
			console.log(error);
			console.log(err);
		});
	}];
};
	
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://https-mendeo-ru.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();