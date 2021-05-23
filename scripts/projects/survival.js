(function()
{
	'use strict';
	const MAX_AGE = 90;
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
	function remainingAge(sex, currentAge)
	{
		let out = 0;
		for (let a = currentAge; a <= 100; a++)
		{
			out += getSurvival(sex, currentAge, a);
		}
		return out;
	}
	function getLBR(sex, ageStart, ageEnd)
	{
		let out = 1;
		for (let a = ageStart; a <= ageEnd; a++)
		{
			out *= (1 - lambdaInterp(RATES.totalMortality[sex], a) * getSurvival(sex, ageStart, a));
		}
		return 1 - out;
	}
	function name_var1(n)
	{
		const words = [' лет', ' год', ' года'];
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
	function name_var2(n)
	{
		const words = [' года', ' лет'];
		n = Math.floor(n);
		n %= 100;
		if (n % 10 === 1)
		{
			if (n === 11)
			{
				return words[1];
			}
			else
			{
				return words[0];
			}
		}
		else
		{
			return words[1];
		}
	}
	//Блок, отвечающий за время дожития
	{
		const remainigAgeElement = document.getElementById('survival-remaining-age');
		const remainigAgeNameElement = document.querySelector('#survival-remaining-age + span');
		const currentAgeElement = document.getElementById('survival-curent-age-input');
		const maleRadioElement = document.getElementById('survival-sex-males-input');
		const femaleRadioElement = document.getElementById('survival-sex-females-input');

		const futureAgeElement = document.getElementById('survival-future-age-input');
		const futureAgeNameElement = document.querySelector('#survival-future-age-input + span');
		const totalMortProbabilityElement = document.getElementById('survival-total-mort');
		const getSelectedSex = function()
		{
			if (maleRadioElement.checked)
			{
				return 'male';
			}
			else if (femaleRadioElement.checked)
			{
				return 'female';
			}
			else
			{
				return null;
			}
		};
		const getSelectedCurrentAge = function()
		{
			let currentAge = Number(currentAgeElement.value);
			if (currentAgeElement.value === '' || Number.isNaN(currentAge) || !Number.isInteger(currentAge) || currentAge < 0 || currentAge > MAX_AGE) return NaN;
			return currentAge;
		};
		let currentAge = getSelectedCurrentAge();
		let sex = getSelectedSex();
		const getSelectedFutureAge = function()
		{
			let futureAge = Number(futureAgeElement.value);
			if (futureAgeElement.value === '' || Number.isNaN(futureAge) || !Number.isInteger(futureAge) || futureAge < 0 || futureAge > MAX_AGE) return NaN;
			return futureAge;
		};
		let futureAge = getSelectedFutureAge();
		let currentAgeError = false;
		let sexError = false;
		let futureAgeError = false;
		const recalc = function(probabilityOnly)
		{
			if (currentAgeError || sexError)
			{
				remainigAgeElement.innerText = '__';
				remainigAgeNameElement.innerText = '';
			}
			else
			{
				if (!probabilityOnly) //Не нужно пересчитывать, если изменены данные, не относящиеся к текущему возрасту и полу.
				{
					const aux = Math.round(remainingAge(sex, currentAge));
					remainigAgeElement.innerText = aux;
					remainigAgeNameElement.innerText = name_var1(aux);
				}
				if (!futureAgeError)
				{
					const aux = getLBR(sex, currentAge, futureAge);
					totalMortProbabilityElement.innerText = Math.round(aux * 100 * 100) / 100 + '%';
				}
			}
		};
		recalc();
		currentAgeElement.addEventListener('input', () =>
		{
			currentAge = getSelectedCurrentAge();
			if (isNaN(currentAge))
			{
				currentAgeElement.classList.add('input-error');
				currentAgeError = true;
			}
			else
			{
				futureAgeElement.min = currentAge;
				if (futureAge < currentAge)
				{
					futureAge = currentAge;
					futureAgeElement.value = futureAge;
				}
				currentAgeElement.classList.remove('input-error');
				currentAgeError = false;
			}
			recalc();
		});
		const onSexChanged = function()
		{
			sex = getSelectedSex();
			if (sex === null)
			{
				sexError = true;
			}
			else
			{
				sexError = false;
			}
			recalc();
		};
		maleRadioElement.addEventListener('change', onSexChanged);
		femaleRadioElement.addEventListener('change', onSexChanged);
		futureAgeElement.addEventListener('input', () =>
		{
			futureAge = getSelectedFutureAge();
			if (isNaN(futureAge) || futureAge < currentAge || futureAge > MAX_AGE)
			{
				futureAgeElement.classList.add('input-error');
				futureAgeError = true;
				futureAgeNameElement.innerText = '';
			}
			else
			{
				futureAgeElement.classList.remove('input-error');
				futureAgeError = false;
				futureAgeNameElement.innerText = name_var2(futureAge);
			}
			recalc(true);
		});
	}
})();
