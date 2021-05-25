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
		cancerIncidence: [
			['любым',
				{
					male: [0.0001736, 0.0001156, 0.0000994, 0.0001586, 0.0001934, 0.000241, 0.0004133, 0.0006806, 0.0012659, 0.0022026, 0.0041485, 0.0075247, 0.0127452, 0.018747, 0.0240272, 0.0245194, 0.023075, 0.0164009],
					female: [0.0001618, 0.0000925, 0.0000878, 0.0001621, 0.0002446, 0.0005082, 0.0009816, 0.0016465, 0.0025869, 0.003665, 0.0049241, 0.0065249, 0.0086938, 0.0109344, 0.0133388, 0.0131779, 0.0132149, 0.0106516],
				}],
			['губы',
				{
					male: [0, 0.0000002, 0, 0, 0, 0, 0.0000011, 0.0000017, 0.0000058, 0.00001, 0.00002, 0.000039, 0.0000695, 0.0000913, 0.0001218, 0.0001533, 0.00016, 0.0001841],
					female: [0.0000002, 0, 0, 0, 0, 0, 0, 0.0000005, 0.0000004, 0.0000004, 0.0000023, 0.0000034, 0.0000097, 0.0000128, 0.000024, 0.0000437, 0.0000584, 0.0000684],
				}],
			['языка',
				{
					male: [0, 0, 0, 0.0000003, 0.0000003, 0.0000006, 0.0000044, 0.0000088, 0.0000216, 0.0000368, 0.0000637, 0.0000929, 0.0001242, 0.0001369, 0.0001135, 0.0000834, 0.0000519, 0.0000445],
					female: [0, 0, 0, 0.0000003, 0.0000006, 0.000001, 0.0000022, 0.0000055, 0.0000098, 0.0000137, 0.0000193, 0.0000255, 0.00003, 0.0000307, 0.0000398, 0.0000292, 0.0000304, 0.0000302],
				}],
			['слюнной железы',
				{
					male: [0, 0.0000004, 0.0000007, 0.0000011, 0.0000006, 0.0000008, 0.0000013, 0.0000056, 0.0000041, 0.0000096, 0.0000164, 0.0000206, 0.0000266, 0.0000302, 0.0000338, 0.0000427, 0.000043, 0.0000485],
					female: [0, 0.0000007, 0.0000005, 0.0000006, 0.0000006, 0.0000037, 0.0000032, 0.0000053, 0.0000074, 0.0000078, 0.0000109, 0.0000124, 0.0000179, 0.0000177, 0.0000195, 0.0000198, 0.0000216, 0.0000308],
					addition: 'Большие слюнные железы (C07, 08)'
				}],
			['пищевода',
				{
					male: [0.0000002, 0, 0.0000002, 0.0000006, 0.0000011, 0.0000002, 0.0000016, 0.0000083, 0.0000259, 0.0000626, 0.0001267, 0.0002158, 0.0003235, 0.0004324, 0.0004468, 0.0004181, 0.0003199, 0.0002366],
					female: [0, 0, 0, 0, 0, 0.0000002, 0.000001, 0.0000033, 0.0000076, 0.0000123, 0.0000266, 0.0000296, 0.0000455, 0.0000588, 0.0000751, 0.0000877, 0.0001043, 0.0001122]
				}],
			['желудка',
				{
					male: [0, 0, 0, 0.0000011, 0.0000031, 0.0000064, 0.0000177, 0.0000352, 0.000085, 0.0001516, 0.0002941, 0.0005288, 0.0008883, 0.0014, 0.0017063, 0.0018313, 0.0018931, 0.0013693],
					female: [0.0000002, 0, 0, 0.0000009, 0.0000032, 0.0000081, 0.0000192, 0.0000337, 0.0000628, 0.0000983, 0.0001422, 0.0002011, 0.0003341, 0.0005042, 0.0006745, 0.000827, 0.0009245, 0.0007592]
				}],
			['кишечника',
				{
					male: [0.0000004, 0, 0.0000005, 0.0000025, 0.0000059, 0.000014, 0.0000324, 0.0000687, 0.0001482, 0.0002413, 0.0004635, 0.0008964, 0.0015794, 0.002443, 0.0032145, 0.0035037, 0.0034972, 0.0022026],
					female: [0.0000002, 0.0000009, 0.0000015, 0.0000032, 0.0000073, 0.0000182, 0.0000365, 0.0000724, 0.0001381, 0.0002305, 0.0004269, 0.000691, 0.0010187, 0.0014789, 0.0019434, 0.0021359, 0.002092, 0.0016646],
					addition: 'Тонкий кишечник, ободочная кишка, прямая кишка, ректосиг. соединение, анус (C17-21)'
				}],
			['печени',
				{
					male: [0.0000044, 0.0000019, 0.0000012, 0.0000008, 0.0000011, 0.000003, 0.0000041, 0.0000063, 0.0000284, 0.0000532, 0.0001039, 0.0001672, 0.0002453, 0.000314, 0.0003992, 0.0004472, 0.0004358, 0.0003762],
					female: [0.0000065, 0.0000009, 0.0000008, 0.0000026, 0.0000006, 0.000001, 0.0000032, 0.0000042, 0.0000078, 0.0000147, 0.00003, 0.00005, 0.0000832, 0.0001173, 0.0001588, 0.0001977, 0.0002378, 0.0002835],
					addition: 'Включая внутрепечёночные желчные протоки'
				}],
			['поджелудочной железы',
				{
					male: [0, 0.0000004, 0.0000002, 0, 0.0000006, 0.000003, 0.0000074, 0.0000173, 0.000042, 0.0000906, 0.0001671, 0.0002797, 0.0004337, 0.0006152, 0.0007181, 0.0007207, 0.0006994, 0.0005805],
					female: [0.0000002, 0.0000002, 0.0000008, 0.0000023, 0.0000017, 0.0000031, 0.0000059, 0.0000107, 0.0000223, 0.0000425, 0.0000829, 0.000146, 0.000235, 0.0003515, 0.000469, 0.0005869, 0.0006347, 0.0005614]
				}],
			['гортани',
				{
					male: [0, 0, 0, 0.0000003, 0, 0.0000006, 0.0000016, 0.0000092, 0.0000284, 0.0000558, 0.000145, 0.0002413, 0.0003528, 0.000427, 0.0003875, 0.0003017, 0.0002251, 0.0001375],
					female: [0, 0, 0, 0, 0.0000006, 0.000001, 0.0000013, 0.0000018, 0.000004, 0.000009, 0.0000098, 0.000015, 0.0000159, 0.0000199, 0.0000207, 0.0000132, 0.000012, 0.0000086]
				}],
			['лёгких',
				{
					male: [0, 0.0000006, 0, 0.0000011, 0.0000034, 0.0000062, 0.0000141, 0.0000379, 0.0001135, 0.0002755, 0.0006899, 0.0014341, 0.0025022, 0.0034554, 0.0038129, 0.0032689, 0.0027437, 0.0017131],
					female: [0.0000002, 0, 0.0000003, 0.0000003, 0.0000052, 0.0000083, 0.0000138, 0.000023, 0.0000498, 0.0000852, 0.0001619, 0.0002246, 0.0003476, 0.0004791, 0.0005976, 0.0005486, 0.0005516, 0.0005368],
					addition: 'Включая трахею и бронхи'
				}],
			['кости',
				{
					male: [0.0000013, 0.0000044, 0.0000113, 0.000013, 0.0000118, 0.0000074, 0.0000082, 0.0000068, 0.0000089, 0.0000096, 0.0000132, 0.0000173, 0.000019, 0.0000249, 0.0000244, 0.0000223, 0.0000221, 0.0000142],
					female: [0.000003, 0.0000063, 0.0000101, 0.0000131, 0.0000087, 0.0000069, 0.0000073, 0.0000047, 0.0000073, 0.0000063, 0.0000069, 0.0000088, 0.0000111, 0.0000108, 0.0000119, 0.0000107, 0.0000092, 0.0000117],
					addition: 'Включая суставные хрящи'
				}],
			['меланомы кожи',
				{
					male: [0.0000002, 0, 0.0000005, 0.0000033, 0.0000064, 0.0000121, 0.0000251, 0.0000347, 0.0000502, 0.0000703, 0.0000866, 0.0001268, 0.0001534, 0.0002436, 0.0003405, 0.000323, 0.0003508, 0.0002528],
					female: [0, 0.0000002, 0, 0.0000041, 0.0000119, 0.0000273, 0.0000398, 0.0000564, 0.0000645, 0.000085, 0.0001012, 0.0001301, 0.0001562, 0.000195, 0.0002615, 0.0002492, 0.000241, 0.0002163]
				}],
			['кожи (кроме меланомы)',
				{
					male: [0.0000002, 0.0000002, 0.0000005, 0.0000036, 0.0000053, 0.0000137, 0.0000298, 0.000056, 0.0001219, 0.0002026, 0.0003523, 0.0006126, 0.0010608, 0.0017527, 0.0027565, 0.0035715, 0.0041724, 0.0036851],
					female: [0.0000002, 0, 0.0000003, 0.0000017, 0.0000084, 0.0000183, 0.0000447, 0.0000967, 0.0001692, 0.0002577, 0.0004101, 0.0006603, 0.0010737, 0.0016913, 0.0025413, 0.0030775, 0.0034408, 0.0027652]
				}],
			['молочной железы',
				{
					male: [0, 0, 0, 0, 0, 0.0000002, 0.0000008, 0.0000012, 0.0000054, 0.0000073, 0.0000094, 0.0000135, 0.0000266, 0.0000296, 0.0000432, 0.000033, 0.000053, 0.0000566],
					female: [0, 0, 0, 0.0000012, 0.0000111, 0.0000558, 0.000203, 0.0004461, 0.0008281, 0.0012004, 0.0013313, 0.0016186, 0.0020595, 0.0023203, 0.0024853, 0.0019737, 0.0017494, 0.0011654]
				}],
			['предстательной железы',
				{
					male: [0, 0, 0, 0, 0.0000008, 0.0000004, 0.0000013, 0.0000022, 0.0000089, 0.0000524, 0.0002558, 0.0007947, 0.0019986, 0.0035806, 0.0054134, 0.0054678, 0.0045111, 0.0026779]
				}],
			['яичка',
				{
					male: [0.0000038, 0.0000004, 0.000001, 0.0000108, 0.000032, 0.000039, 0.0000424, 0.0000439, 0.0000323, 0.000031, 0.00002, 0.0000173, 0.0000133, 0.0000142, 0.0000155, 0.0000165, 0.000011, 0.0000162]
				}],
			['почки',
				{
					male: [0.0000159, 0.0000049, 0.0000007, 0.0000014, 0.0000031, 0.000008, 0.0000248, 0.0000555, 0.0001112, 0.0001964, 0.000301, 0.0004721, 0.0006554, 0.0007728, 0.0008814, 0.0006906, 0.0005737, 0.0003499],
					female: [0.0000171, 0.0000054, 0.0000015, 0.000002, 0.0000038, 0.0000052, 0.0000155, 0.0000264, 0.0000512, 0.0000887, 0.0001611, 0.0002319, 0.0003481, 0.0004295, 0.0004915, 0.0003571, 0.0002822, 0.0002256]
				}],
			['мочевого пузыря',
				{
					male: [0.0000004, 0.0000002, 0, 0.0000003, 0.0000031, 0.0000058, 0.000013, 0.0000194, 0.0000389, 0.000081, 0.0001681, 0.0003275, 0.0005745, 0.0008719, 0.0011687, 0.0012969, 0.0012864, 0.0008899],
					female: [0, 0.0000002, 0.0000003, 0.0000009, 0.0000029, 0.0000027, 0.0000038, 0.0000085, 0.0000118, 0.0000174, 0.000035, 0.0000572, 0.0000928, 0.0001228, 0.0001913, 0.0002166, 0.000229, 0.0001972]
				}],
			['глаза',
				{
					male: [0.0000102, 0.0000008, 0.0000002, 0.0000006, 0.0000011, 0.0000002, 0.0000025, 0.0000022, 0.0000045, 0.0000079, 0.0000058, 0.0000164, 0.0000183, 0.000023, 0.0000277, 0.0000165, 0.0000188, 0.0000121],
					female: [0.0000087, 0.0000011, 0, 0, 0.0000003, 0.0000017, 0.0000014, 0.0000028, 0.0000047, 0.0000061, 0.0000128, 0.0000109, 0.000016, 0.0000217, 0.0000262, 0.000021, 0.0000156, 0.0000136],
					addition: 'Включая его придаточный аппарат'
				}],
			['головного мозга',
				{
					male: [0.000021, 0.0000248, 0.0000175, 0.0000169, 0.0000182, 0.0000225, 0.0000341, 0.0000417, 0.0000478, 0.0000624, 0.0000904, 0.0001141, 0.0001458, 0.0001702, 0.0002054, 0.0001746, 0.0001291, 0.0000951],
					female: [0.0000196, 0.0000165, 0.0000137, 0.0000125, 0.0000119, 0.0000198, 0.0000286, 0.0000339, 0.0000338, 0.0000521, 0.000067, 0.000091, 0.0001054, 0.0001238, 0.0001442, 0.0001091, 0.0000983, 0.0000955],
					addition: 'Включая дргуие отделы ЦНС'
				}],
			['щитовидной железы',
				{
					male: [0, 0.0000004, 0.0000032, 0.0000152, 0.0000143, 0.0000125, 0.0000224, 0.000033, 0.0000391, 0.000049, 0.0000567, 0.0000619, 0.0000752, 0.0000758, 0.000083, 0.0000601, 0.0000419, 0.0000303],
					female: [0.0000002, 0.000002, 0.0000085, 0.0000325, 0.000051, 0.0000812, 0.000115, 0.0001457, 0.0001874, 0.0002056, 0.0002367, 0.0002695, 0.0002899, 0.0002722, 0.000257, 0.0001207, 0.0000983, 0.0000635]
				}],
			['яичника',
				{
					female: [0.0000007, 0.0000013, 0.0000049, 0.0000139, 0.0000192, 0.0000381, 0.0000617, 0.000098, 0.0001569, 0.0002575, 0.0003161, 0.0003372, 0.0003681, 0.0003838, 0.0004127, 0.0003196, 0.0002806, 0.0001799]
				}],
			['шейки матки',
				{
					female: [0, 0.0000002, 0.0000003, 0.0000009, 0.0000119, 0.0000924, 0.0002124, 0.0003431, 0.0004138, 0.0004032, 0.0003686, 0.0003569, 0.00032, 0.0002846, 0.0002524, 0.0002121, 0.0001974, 0.0001615]
				}],
			['тела матки',
				{
					female: [0.0000002, 0, 0.0000003, 0, 0.0000015, 0.0000115, 0.0000316, 0.0000619, 0.0001349, 0.0002722, 0.0005542, 0.0007826, 0.0009263, 0.0009981, 0.0009714, 0.0006792, 0.0005228, 0.0003001]
				}],
			['крови',
				{
					male: [0.0000746, 0.0000642, 0.0000505, 0.0000693, 0.0000636, 0.0000621, 0.0000852, 0.0001106, 0.000132, 0.0001601, 0.0002467, 0.0003622, 0.0005265, 0.0006662, 0.000872, 0.0008788, 0.0007645, 0.0004672],
					female: [0.000061, 0.0000434, 0.0000361, 0.0000534, 0.0000614, 0.0000791, 0.0000928, 0.0000957, 0.0001041, 0.0001351, 0.0001873, 0.0002671, 0.0003722, 0.0004991, 0.0005906, 0.0005943, 0.0005348, 0.0003617],
					addition: 'Лимфатическая и кроветворная ткань (С81-96)'
				}]
		].sort((a, b) =>
		{
			if (a[0] === 'любым') return -1;
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
	};
	const malesOnlyLocalisationIndexes = [];
	const femalesOnlyLocalisationIndexes = [];
	for (let index = 0; index < RATES.cancerIncidence.length; index++)
	{
		if (!RATES.cancerIncidence[index][1].female)
		{
			malesOnlyLocalisationIndexes.push(index);
		}
		if (!RATES.cancerIncidence[index][1].male)
		{
			femalesOnlyLocalisationIndexes.push(index);
		}
	}

	const SURVIVAL = calculateSurvival();
	function lambdaInterp(lambda, age)
	{
		if (age < 0 || age > 100) throw new Error('Age range: 0-100');
		if (lambda.length !== 18) throw new Error('Error in data arrays');
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
	function setVisibility(element, visibility)
	{
		element.style = visibility ? 'display: inherit' : 'display: none';
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

		const localizationSelectElement = document.getElementById('survival-localization-select');
		for (let loc of RATES.cancerIncidence)
		{
			localizationSelectElement.appendChild(new Option(loc[0]));
		}

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
		const disableOnlySexLocalizations = function()
		{
			for (let i of femalesOnlyLocalisationIndexes)
			{
				setVisibility(localizationSelectElement.options[i], (sex === 'female'));
			}
			for (let i of malesOnlyLocalisationIndexes)
			{
				setVisibility(localizationSelectElement.options[i], (sex === 'male'));
			}
		};
		disableOnlySexLocalizations();
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
			disableOnlySexLocalizations();
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
		//Блок расчёта вероятности заболевания ЗНО
		const getSelectedLocalization = function()
		{
			return RATES.cancerIncidence[localizationSelectElement.selectedIndex][1];
		};
		let localization = getSelectedLocalization();
		localizationSelectElement.addEventListener('change', () =>
		{
			let localization = getSelectedLocalization();
			console.log(localization);
		});
		console.log(localization);
	}
})();
