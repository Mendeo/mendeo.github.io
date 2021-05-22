(function()
{
	'use strict';
	//Блок, отвечающий за время дожития
	{
		const remainigAgeElement = document.getElementById('survival-remaining-age');
		const remainigAgeNameElement = document.querySelector('#survival-remaining-age + span');
		const futureYearsElement = document.getElementById('survival-future-years-input');
		const futureYearsNameElement = document.getElementById('#survival-future-years-input + span');
		const currentAgeElement = document.getElementById('survival-curent-age-input');
		const maleRadioElement = document.getElementById('survival-sex-males-input');
		const femaleRadioElement = document.getElementById('survival-sex-females-input');
		const words = [' лет', ' год', ' года'];
		const remainingAge = function (curentAge, sex)
		{
			let out = 0;
			for (let a = curentAge; a <= 100; a++)
			{
				out += getSurvival(sex, curentAge, a);
			}
			return out;
		};
		const invalidate = function()
		{
			let sex = '';
			if (maleRadioElement.checked)
			{
				sex = 'male';
			}
			else if (femaleRadioElement.checked)
			{
				sex = 'female';
			}
			else
			{
				throw new Error('Sex selector error!');
			}
			const age = Number(currentAgeElement.value);
			if (currentAgeElement.value === '' || Number.isNaN(age) || !Number.isInteger(age) || age < 0 || age > 100)
			{
				currentAgeElement.classList.add('input-error');
				remainigAgeElement.innerText = '__';
				remainigAgeNameElement.innerText = '';
				futureYearsNameElement.innerText = '';
			}
			else
			{
				currentAgeElement.classList.remove('input-error');
				const rAge = Math.round(remainingAge(age, sex));
				remainigAgeElement.innerText = rAge;
				remainigAgeNameElement.innerText = name(rAge, words);
				futureYearsElement.max = 100 - rAge + 1;
				
			}
		};
		invalidate();
		currentAgeElement.addEventListener('input', invalidate);
		maleRadioElement.addEventListener('change', invalidate);
		femaleRadioElement.addEventListener('change', invalidate);
	}

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
		let index = Math.floor(age / 5);
		if (index > lambda.length - 1) index = lambda.length - 1;
		return lambda[index];
	}
	function getSurvival(sex, e, a)
	{
		if (a < e) return 1;
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
	function getLBR(sex, ageStart, ageEnd)
	{
		let out = 0;
		for (let a = ageStart; a <= ageEnd; a++)
		{
			out += lambdaInterp(RATES.totalMortality[sex], a) * getSurvival(sex, a);
		}
		return out;
	}
	function name(n, words)
	{
		n = Math.floor(n);
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
