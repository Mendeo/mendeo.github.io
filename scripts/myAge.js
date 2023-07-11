---
layout: js_minifier
---
(function()
{
	const myAge = document.getElementById('my_age');
	const now = Date.now();
	const bDate = new Date(1987, 5, 5).getTime();
	const age = Math.floor((now - bDate) / 31536000000);
	myAge.innerText = `${age} ${getSuffix(['лет', 'год', 'года'], age)}`;

	function getSuffix(words, n)
	{
		n = Math.abs(n);
		n %= 100;
		if (n >= 10 && n <= 20)
		{
			return words[0];
		}
		else
		{
			n %= 10;
			switch(n)
			{
			case 0: case 5: case 6: case 7: case 8: case 9:
				return words[0];
			case 1:
				return words[1];
			case 2: case 3: case 4:
				return words[2];
			}
		}
	}
})();