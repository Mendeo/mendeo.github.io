(function()
{
	'use strict';
	const RATES =
	{
		totalMortality:
		{
			male: [0.001411, 0.0002252, 0.0003099, 0.0008652, 0.0015434, 0.0023878, 0.0039674, 0.0061339, 0.0077045, 0.0094014, 0.0133206, 0.0193642, 0.0292172, 0.039993, 0.0523729, 0.0809097, 0.1099776, 0.1715715],
			female: [0.001145852, 0.000173445, 0.000191697, 0.000381298, 0.000498766, 0.000800791, 0.001366291, 0.002132296, 0.00267149, 0.003379217, 0.004530942, 0.006805873, 0.010106529, 0.015788334, 0.024429127, 0.045477217, 0.078561029, 0.169444133]
		}
	};
	const SURVIVAL = calculateSurvival();
	function lambdaInterp(lambda, age)
	{
		if (age < 0 || age > 100) throw new Error('Age range: 0-100');
		return lambda[Math.floor(age / 5)];
	}
	function getSurvival(sex, e, a)
	{
		if (a < e) return 1;
		console.log(sex);
		return SURVIVAL[sex][a] / SURVIVAL[sex][e];
	}
	function calculateSurvival()
	{
		const out = {};
		for (let sex of ['male', 'female'])
		{
			const aux = [];
			aux[0] = 1;
			for (let a = 1; a <= 100; a++)
			{
				let sum = 0;
				for (let k = 0; k <= a - 1; k++)
				{
					sum += lambdaInterp(RATES.totalMortality[sex], k);
				}
				aux[a] = Math.exp(-sum);
			}
			out[sex] = aux;
		}
		return out;
	}

	//Блок, отвечающий за время дожития
	{
		const remainigAgeElement = document.getElementById('survival-remaining-age');
		const remainigAgeNameElement = document.querySelector('#survival-remaining-age + span');
		const words = [' лет', ' год', ' года'];

		const currentAgeElement = document.getElementById('survival-curent-age-input');
		const sexElement = document.getElementById('survival-sex-males-input');
		currentAgeElement.addEventListener('input', invalidate());
		sexElement.addEventListener('change', invalidate());
		let rAge = remainingAge(0, 'male');
		remainigAgeElement.innerText = rAge;
		remainigAgeNameElement.innerText = name(rAge, words);
		function invalidate()
		{
			const age = Number(currentAgeElement.value);
			if (currentAgeElement.value === '' || Number.isNaN(age) || !Number.isInteger(age) || age < 0 || age > 100)
			{
				currentAgeElement.classList.add('input-error');
				remainigAgeElement.innerText = '__';
				remainigAgeNameElement.innerText = '';
			}
			else
			{
				currentAgeElement.classList.remove('input-error');
				console.log(sexElement.checked ? 'male' : 'female');
				rAge = remainingAge(age, sexElement.checked ? 'male' : 'female');
				remainigAgeElement.innerText = rAge;
				remainigAgeNameElement.innerText = name(rAge, words);
			}
		}
		function remainingAge(curentAge, sex)
		{
			let out = 0;
			for (let a = curentAge; a <= 100; a++)
			{
				out += getSurvival(sex, curentAge, a);
			}
			return out;
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