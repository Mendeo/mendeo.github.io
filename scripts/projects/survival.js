(function()
{
	'use strict';
	//Блок, отвечающий за время дожития
	{
		const remainigAgeElement = document.getElementById('survival-remaining-age');
		const remainigAgeNameElement = document.querySelector('#survival-remaining-age + span');
		let rAge = remainingAge(0);
		remainigAgeElement.innerText = rAge;
		const words = [' лет', ' год', ' года'];
		remainigAgeNameElement.innerText = name(rAge, words);

		document.getElementById('survival-curent-age-input').addEventListener('input', function()
		{
			const age = Number(this.value);
			if (this.value === '' || Number.isNaN(age) || !Number.isInteger(age) || age < 0 || age > 100)
			{
				this.classList.add('input-error');
				remainigAgeElement.innerText = '__';
				remainigAgeNameElement.innerText = '';
			}
			else
			{
				this.classList.remove('input-error');
				rAge = remainingAge(age);
				remainigAgeElement.innerText = rAge;
				remainigAgeNameElement.innerText = name(rAge, words);
			}
		});
		function remainingAge(curentAge)
		{
			return curentAge + 10;
		}
	}
	function name(n, words)
	{
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