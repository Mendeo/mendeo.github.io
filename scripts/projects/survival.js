(function()
{
	'use strict';
	const MAX_AGE = 90;
	const RATES =
	{
		totalMortality:
		{
			male: [0.0011584, 0.0001952, 0.0002747, 0.0007688, 0.0013998, 0.0020026, 0.0035347, 0.005544, 0.0078004, 0.009496, 0.0129443, 0.0186514, 0.0282904, 0.0389475, 0.0520627, 0.0761966, 0.1055055, 0.1626455],
			female: [0.000967333, 0.000128579, 0.000160361, 0.000360802, 0.000463913, 0.000693919, 0.001208848, 0.001998062, 0.002710243, 0.003435062, 0.004592816, 0.006654533, 0.009779683, 0.015147211, 0.024011459, 0.043495949, 0.073966104, 0.167177759]			
		},
		cancerIncidence: new Map(
			[['любым',
				{
					male: [],
					female: [],
				}],
			['губы',
				{
					male: [],
					female: [],
				}],
			['языка',
				{
					male: [],
					female: [],
				}],
			['слюнной железы',
				{
					male: [],
					female: [],
					addition: 'Большие слюнные железы (C07, 08)'
				}],
			['пищевода',
				{
					male: [],
					female: []
				}],
			['желудка',
				{
					male: [],
					female: []
				}],
			['кишечника',
				{
					male: [],
					female: [],
					addition: 'Тонкий кишечник, ободочная кишка, прямая кишка, ректосиг. соединение, анус (C17-21)'
				}],
			['печени',
				{
					male: [],
					female: [],
					addition: 'Включая внутрепечёночные желчные протоки'
				}],
			['поджелудочной железы',
				{
					male: [],
					female: []
				}],
			['лёгких',
				{
					male: [],
					female: [],
					addition: 'Включая трахею и бронхи'
				}],
			['гортани',
				{
					male: [],
					female: []
				}],
			['кости',
				{
					male: [],
					female: [],
					addition: 'Включая суставные хрящи'
				}],
			['меланомы кожи',
				{
					male: [],
					female: []
				}],
			['кожи (кроме меланомы)',
				{
					male: [],
					female: []
				}],
			['молочной железы',
				{
					male: [],
					female: []
				}],
			['предстательной железы',
				{
					male: []
				}],
			['яичка',
				{
					male: []
				}],
			['почки',
				{
					male: [],
					female: []
				}],
			['мочевого пузыря',
				{
					male: [],
					female: []
				}],
			['глаза',
				{
					male: [],
					female: [],
					addition: 'Включая его придаточный аппарат'
				}],
			['головного мозга',
				{
					male: [],
					female: [],
					addition: 'Включая дргуие отделы ЦНС'
				}],
			['щитовидной железы',
				{
					male: [],
					female: []
				}],
			['яичника',
				{
					female: []
				}],
			['шейки матки',
				{
					female: []
				}],
			['тела матки',
				{
					female: []
				}],
			['крови',
				{
					male: [],
					female: [],
					addition: 'Лимфатическая и кроветворная ткань (С81-96)'
				}]
			].sort((a, b) =>
			{
				if (a[0] > b[0])
				{
					return 1;
				}
				if (a[0] < b[0])
				{
					return -1;
				}
				return 0;
			})
		)
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
	function getDeathProbability(sex, ageStart, ageEnd)
	{
		return 1 - getSurvival(sex, ageStart, ageEnd);
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
			const futureAgeMin = currentAge + 1;
			const futureAgeMax = MAX_AGE + 1;
			if (futureAgeElement.value === '' || Number.isNaN(futureAge) || !Number.isInteger(futureAge) || futureAge < futureAgeMin || futureAge > futureAgeMax) return NaN;
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
					const aux = getDeathProbability(sex, currentAge, futureAge);
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
				const futureAgeMin = currentAge + 1;
				futureAgeElement.min = futureAgeMin;
				if (futureAge < futureAgeMin)
				{
					futureAge = futureAgeMin;
					futureAgeElement.value = futureAge;
					futureAgeNameElement.innerText = name_var2(futureAge);
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

			if (isNaN(futureAge))
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
