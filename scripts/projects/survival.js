---
layout: js_minifier
---
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
		cancerRates: [
			{
				name: 'любым',
				first: true,
				male:
				{
					incidence: [0.0001736, 0.0001156, 0.0000994, 0.0001586, 0.0001934, 0.000241, 0.0004133, 0.0006806, 0.0012659, 0.0022026, 0.0041485, 0.0075247, 0.0127452, 0.018747, 0.0240272, 0.0245194, 0.023075, 0.0164009],
					mortality: [0.0000338, 0.0000305, 0.000029, 0.0000383, 0.0000566, 0.0000721, 0.0001323, 0.0002551, 0.000555, 0.0010444, 0.002104, 0.0039739, 0.006709, 0.0100197, 0.0127059, 0.0149301, 0.0153293, 0.0136664]
				},
				female:
				{
					incidence: [0.0001618, 0.0000925, 0.0000878, 0.0001621, 0.0002446, 0.0005082, 0.0009816, 0.0016465, 0.0025869, 0.003665, 0.0049241, 0.0065249, 0.0086938, 0.0109344, 0.0133388, 0.0131779, 0.0132149, 0.0106516],
					mortality: [0.0000337, 0.0000206, 0.0000165, 0.0000284, 0.0000405, 0.0000783, 0.00018, 0.0003556, 0.0005847, 0.000928, 0.0013883, 0.0020716, 0.0029557, 0.0041308, 0.0055019, 0.0067181, 0.0076726, 0.0084318]
				}
			},
			{
				name: 'губы, полости рта, глотки',
				addition: 'C00-14',
				male:
				{
					incidence: [0.0000004, 0.0000008, 0.0000023, 0.0000033, 0.0000032, 0.0000042, 0.0000128, 0.0000425, 0.0001088, 0.0002135, 0.0003387, 0.0004818, 0.0006486, 0.0007282, 0.000701, 0.0005558, 0.0004214, 0.0003884],
					mortality: [0, 0, 0.0000002, 0.0000003, 0.0000006, 0.0000016, 0.0000052, 0.0000214, 0.0000548, 0.0001131, 0.0001902, 0.0002954, 0.0003887, 0.0004619, 0.0004224, 0.0003308, 0.000246, 0.0002124]
				},
				female:
				{
					incidence: [0.0000004, 0.0000009, 0.000001, 0.0000032, 0.0000045, 0.0000071, 0.0000099, 0.0000219, 0.0000438, 0.0000643, 0.0000884, 0.0001085, 0.0001251, 0.0001277, 0.0001554, 0.0001417, 0.0001656, 0.0001904],
					mortality: [0, 0, 0, 0.0000009, 0.0000006, 0.0000004, 0.0000027, 0.0000068, 0.0000147, 0.000028, 0.0000302, 0.0000451, 0.0000518, 0.0000563, 0.0000696, 0.0000614, 0.0000847, 0.0001214]
				}
			},
			{
				name: 'пищевода',
				male:
				{
					incidence: [0.0000002, 0, 0.0000002, 0.0000006, 0.0000011, 0.0000002, 0.0000016, 0.0000083, 0.0000259, 0.0000626, 0.0001267, 0.0002158, 0.0003235, 0.0004324, 0.0004468, 0.0004181, 0.0003199, 0.0002366],
					mortality: [0, 0, 0, 0, 0, 0.0000004, 0.0000016, 0.0000068, 0.000021, 0.000047, 0.0001077, 0.0001847, 0.0002783, 0.0003767, 0.0003815, 0.0003783, 0.0003012, 0.0002468]
				},
				female:
				{
					incidence: [0, 0, 0, 0, 0, 0.0000002, 0.000001, 0.0000033, 0.0000076, 0.0000123, 0.0000266, 0.0000296, 0.0000455, 0.0000588, 0.0000751, 0.0000877, 0.0001043, 0.0001122],
					mortality: [0, 0, 0, 0, 0.0000006, 0.0000002, 0.000001, 0.0000022, 0.000004, 0.000009, 0.0000193, 0.0000213, 0.0000346, 0.0000445, 0.0000502, 0.0000803, 0.0000883, 0.0000992]
				}
			},
			{
				name: 'желудка',
				male:
				{
					incidence: [0, 0, 0, 0.0000011, 0.0000031, 0.0000064, 0.0000177, 0.0000352, 0.000085, 0.0001516, 0.0002941, 0.0005288, 0.0008883, 0.0014, 0.0017063, 0.0018313, 0.0018931, 0.0013693],
					mortality: [0, 0.0000002, 0.0000002, 0.0000008, 0.0000014, 0.0000036, 0.0000115, 0.0000253, 0.0000593, 0.0001037, 0.0001993, 0.0003742, 0.0006671, 0.0010117, 0.0012916, 0.001584, 0.0017155, 0.0014886]
				},
				female:
				{
					incidence: [0.0000002, 0, 0, 0.0000009, 0.0000032, 0.0000081, 0.0000192, 0.0000337, 0.0000628, 0.0000983, 0.0001422, 0.0002011, 0.0003341, 0.0005042, 0.0006745, 0.000827, 0.0009245, 0.0007592],
					mortality: [0, 0, 0, 0.0000009, 0.0000017, 0.000006, 0.0000116, 0.0000232, 0.0000392, 0.0000607, 0.0000785, 0.0001329, 0.0002025, 0.0003139, 0.0004632, 0.0006697, 0.0008393, 0.0008517]
				}
			},
			{
				name: 'кишечника',
				addition: 'Тонкий кишечник, ободочная кишка, прямая кишка, ректосиг. соединение, анус (C17-21)',
				male:
				{
					incidence: [0.0000004, 0, 0.0000005, 0.0000025, 0.0000059, 0.000014, 0.0000324, 0.0000687, 0.0001482, 0.0002413, 0.0004635, 0.0008964, 0.0015794, 0.002443, 0.0032145, 0.0035037, 0.0034972, 0.0022026],
					mortality: [0, 0, 0.0000002, 0.0000006, 0.0000015, 0.0000048, 0.0000113, 0.0000263, 0.0000538, 0.0000926, 0.000188, 0.0004001, 0.0006864, 0.0012008, 0.0016477, 0.0023328, 0.0026323, 0.0024513]
				},
				female:
				{
					incidence: [0.0000002, 0.0000009, 0.0000015, 0.0000032, 0.0000073, 0.0000182, 0.0000365, 0.0000724, 0.0001381, 0.0002305, 0.0004269, 0.000691, 0.0010187, 0.0014789, 0.0019434, 0.0021359, 0.002092, 0.0016646],
					mortality: [0, 0, 0.0000003, 0.0000006, 0.0000023, 0.0000035, 0.0000117, 0.0000231, 0.0000439, 0.0000737, 0.000145, 0.000245, 0.0003992, 0.00063, 0.000931, 0.0013188, 0.0016284, 0.0018501]
				}
			},
			{
				name: 'печени',
				addition: 'Включая внутрепечёночные желчные протоки',
				male:
				{
					incidence: [0.0000044, 0.0000019, 0.0000012, 0.0000008, 0.0000011, 0.000003, 0.0000041, 0.0000063, 0.0000284, 0.0000532, 0.0001039, 0.0001672, 0.0002453, 0.000314, 0.0003992, 0.0004472, 0.0004358, 0.0003762],
					mortality: [0.0000004, 0.0000006, 0.0000002, 0.0000003, 0.0000006, 0.0000018, 0.0000041, 0.0000071, 0.0000268, 0.0000571, 0.0001015, 0.0001769, 0.0002695, 0.0003616, 0.0004352, 0.0005219, 0.0005053, 0.000451]
				},
				female:
				{
					incidence: [0.0000065, 0.0000009, 0.0000008, 0.0000026, 0.0000006, 0.000001, 0.0000032, 0.0000042, 0.0000078, 0.0000147, 0.00003, 0.00005, 0.0000832, 0.0001173, 0.0001588, 0.0001977, 0.0002378, 0.0002835],
					mortality: [0.0000005, 0.0000004, 0.0000005, 0.0000017, 0.0000009, 0.0000017, 0.000003, 0.0000042, 0.0000113, 0.0000176, 0.0000333, 0.0000522, 0.0000854, 0.0001386, 0.0001721, 0.0002467, 0.0003022, 0.0003568]
				}
			},
			{
				name: 'поджелудочной железы',
				male:
				{
					incidence: [0, 0.0000004, 0.0000002, 0, 0.0000006, 0.000003, 0.0000074, 0.0000173, 0.000042, 0.0000906, 0.0001671, 0.0002797, 0.0004337, 0.0006152, 0.0007181, 0.0007207, 0.0006994, 0.0005805],
					mortality: [0, 0, 0, 0, 0.0000003, 0.000001, 0.0000052, 0.0000146, 0.0000385, 0.0000842, 0.0001645, 0.0002784, 0.0004135, 0.0006139, 0.000738, 0.0007682, 0.0007623, 0.0006836]
				},
				female:
				{
					incidence: [0.0000002, 0.0000002, 0.0000008, 0.0000023, 0.0000017, 0.0000031, 0.0000059, 0.0000107, 0.0000223, 0.0000425, 0.0000829, 0.000146, 0.000235, 0.0003515, 0.000469, 0.0005869, 0.0006347, 0.0005614],
					mortality: [0, 0, 0, 0.0000003, 0.0000006, 0.0000015, 0.000003, 0.0000063, 0.0000182, 0.0000317, 0.0000685, 0.0001247, 0.0002161, 0.0003387, 0.000455, 0.000605, 0.0006279, 0.0006871]
				}
			},
			{
				name: 'гортани',
				male:
				{
					incidence: [0, 0, 0, 0.0000003, 0, 0.0000006, 0.0000016, 0.0000092, 0.0000284, 0.0000558, 0.000145, 0.0002413, 0.0003528, 0.000427, 0.0003875, 0.0003017, 0.0002251, 0.0001375],
					mortality: [0, 0, 0, 0, 0, 0, 0.0000003, 0.0000056, 0.0000134, 0.0000312, 0.000068, 0.000128, 0.0002003, 0.0002464, 0.0002707, 0.0002328, 0.0001809, 0.0001214]
				},
				female:
				{
					incidence: [0, 0, 0, 0, 0.0000006, 0.000001, 0.0000013, 0.0000018, 0.000004, 0.000009, 0.0000098, 0.000015, 0.0000159, 0.0000199, 0.0000207, 0.0000132, 0.000012, 0.0000086],
					mortality: [0, 0, 0, 0, 0, 0.0000004, 0, 0.0000007, 0.0000015, 0.0000039, 0.000004, 0.0000051, 0.0000078, 0.0000087, 0.0000076, 0.0000082, 0.0000092, 0.0000111]
				}
			},
			{
				name: 'лёгких',
				addition: 'Включая трахею и бронхи',
				male:
				{
					incidence: [0, 0.0000006, 0, 0.0000011, 0.0000034, 0.0000062, 0.0000141, 0.0000379, 0.0001135, 0.0002755, 0.0006899, 0.0014341, 0.0025022, 0.0034554, 0.0038129, 0.0032689, 0.0027437, 0.0017131],
					mortality: [0, 0, 0, 0.0000006, 0.0000025, 0.0000024, 0.0000071, 0.0000259, 0.0000846, 0.0002056, 0.0005237, 0.0011211, 0.0020597, 0.0029846, 0.0034115, 0.0033358, 0.0027481, 0.0019497]
				},
				female:
				{
					incidence: [0.0000002, 0, 0.0000003, 0.0000003, 0.0000052, 0.0000083, 0.0000138, 0.000023, 0.0000498, 0.0000852, 0.0001619, 0.0002246, 0.0003476, 0.0004791, 0.0005976, 0.0005486, 0.0005516, 0.0005368],
					mortality: [0, 0.0000002, 0, 0, 0.0000017, 0.0000012, 0.0000062, 0.0000129, 0.0000263, 0.0000472, 0.0000934, 0.0001509, 0.0002333, 0.0003326, 0.0004437, 0.0004745, 0.0005, 0.0005916]
				}
			},
			{
				name: 'кости',
				addition: 'Включая суставные хрящи',
				male:
				{
					incidence: [0.0000013, 0.0000044, 0.0000113, 0.000013, 0.0000118, 0.0000074, 0.0000082, 0.0000068, 0.0000089, 0.0000096, 0.0000132, 0.0000173, 0.000019, 0.0000249, 0.0000244, 0.0000223, 0.0000221, 0.0000142],
					mortality: [0.0000002, 0.0000015, 0.0000049, 0.0000061, 0.0000062, 0.0000036, 0.000003, 0.0000022, 0.0000049, 0.0000073, 0.0000089, 0.0000141, 0.0000197, 0.0000189, 0.000026, 0.0000155, 0.0000232, 0.0000142]
				},
				female:
				{
					incidence: [0.000003, 0.0000063, 0.0000101, 0.0000131, 0.0000087, 0.0000069, 0.0000073, 0.0000047, 0.0000073, 0.0000063, 0.0000069, 0.0000088, 0.0000111, 0.0000108, 0.0000119, 0.0000107, 0.0000092, 0.0000117],
					mortality: [0.0000009, 0.0000009, 0.0000018, 0.0000061, 0.0000017, 0.000001, 0.0000032, 0.0000023, 0.0000036, 0.0000047, 0.0000057, 0.0000051, 0.0000067, 0.0000108, 0.0000128, 0.0000091, 0.0000144, 0.0000142]
				}
			},
			{
				name: 'меланомы кожи',
				male:
				{
					incidence: [0.0000002, 0, 0.0000005, 0.0000033, 0.0000064, 0.0000121, 0.0000251, 0.0000347, 0.0000502, 0.0000703, 0.0000866, 0.0001268, 0.0001534, 0.0002436, 0.0003405, 0.000323, 0.0003508, 0.0002528],
					mortality: [0, 0, 0, 0.0000006, 0.0000011, 0.0000024, 0.0000058, 0.00001, 0.0000148, 0.0000237, 0.0000286, 0.0000444, 0.0000528, 0.0000761, 0.0001279, 0.0001183, 0.0001721, 0.0001618]
				},
				female:
				{
					incidence: [0, 0.0000002, 0, 0.0000041, 0.0000119, 0.0000273, 0.0000398, 0.0000564, 0.0000645, 0.000085, 0.0001012, 0.0001301, 0.0001562, 0.000195, 0.0002615, 0.0002492, 0.000241, 0.0002163],
					mortality: [0, 0, 0, 0.0000006, 0.000002, 0.0000029, 0.0000052, 0.0000067, 0.0000133, 0.0000182, 0.0000264, 0.0000267, 0.0000387, 0.0000531, 0.0000721, 0.0000898, 0.0000935, 0.0001103]
				}
			},
			{
				name: 'кожи (кроме меланомы)',
				male:
				{
					incidence: [0.0000002, 0.0000002, 0.0000005, 0.0000036, 0.0000053, 0.0000137, 0.0000298, 0.000056, 0.0001219, 0.0002026, 0.0003523, 0.0006126, 0.0010608, 0.0017527, 0.0027565, 0.0035715, 0.0041724, 0.0036851],
					mortality: [0.0000002, 0, 0, 0, 0, 0.0000002, 0.0000009, 0.000001, 0.0000023, 0.0000026, 0.0000072, 0.000015, 0.0000205, 0.0000359, 0.0000448, 0.0000805, 0.0001357, 0.0002387]
				},
				female:
				{
					incidence: [0.0000002, 0, 0.0000003, 0.0000017, 0.0000084, 0.0000183, 0.0000447, 0.0000967, 0.0001692, 0.0002577, 0.0004101, 0.0006603, 0.0010737, 0.0016913, 0.0025413, 0.0030775, 0.0034408, 0.0027652],
					mortality: [0, 0, 0, 0, 0, 0.0000002, 0.0000003, 0.0000012, 0.0000015, 0.0000012, 0.0000023, 0.0000043, 0.0000075, 0.000013, 0.0000201, 0.0000461, 0.0000663, 0.0001578]
				}
			},
			{
				name: 'молочной железы',
				male:
				{
					incidence: [0, 0, 0, 0, 0, 0.0000002, 0.0000008, 0.0000012, 0.0000054, 0.0000073, 0.0000094, 0.0000135, 0.0000266, 0.0000296, 0.0000432, 0.000033, 0.000053, 0.0000566],
					mortality: [0, 0, 0, 0, 0, 0, 0.0000005, 0.0000003, 0.0000004, 0.0000009, 0.0000012, 0.0000042, 0.0000069, 0.0000072, 0.0000149, 0.0000155, 0.0000154, 0.0000121]
				},
				female:
				{
					incidence: [0, 0, 0, 0.0000012, 0.0000111, 0.0000558, 0.000203, 0.0004461, 0.0008281, 0.0012004, 0.0013313, 0.0016186, 0.0020595, 0.0023203, 0.0024853, 0.0019737, 0.0017494, 0.0011654],
					mortality: [0, 0, 0, 0, 0.0000017, 0.0000079, 0.0000289, 0.0000751, 0.0001366, 0.0002181, 0.0003029, 0.0004291, 0.0005325, 0.0006444, 0.0007983, 0.0008678, 0.000958, 0.0010384]
				}
			},
			{
				name: 'предстательной железы',
				male:
				{
					incidence: [0, 0, 0, 0, 0.0000008, 0.0000004, 0.0000013, 0.0000022, 0.0000089, 0.0000524, 0.0002558, 0.0007947, 0.0019986, 0.0035806, 0.0054134, 0.0054678, 0.0045111, 0.0026779],
					mortality: [0, 0, 0, 0, 0, 0.0000002, 0.0000005, 0.0000007, 0.0000027, 0.0000086, 0.0000378, 0.0001266, 0.0003599, 0.0007247, 0.0013996, 0.0021961, 0.0026709, 0.0027426]
				}
			},
			{
				name: 'почки',
				male:
				{
					incidence: [0.0000159, 0.0000049, 0.0000007, 0.0000014, 0.0000031, 0.000008, 0.0000248, 0.0000555, 0.0001112, 0.0001964, 0.000301, 0.0004721, 0.0006554, 0.0007728, 0.0008814, 0.0006906, 0.0005737, 0.0003499],
					mortality: [0.0000013, 0.0000008, 0.0000002, 0, 0.0000006, 0.0000008, 0.000002, 0.0000041, 0.0000156, 0.00004, 0.0000815, 0.0001592, 0.0002548, 0.0003395, 0.0004396, 0.0004219, 0.00046, 0.0004005]
				},
				female:
				{
					incidence: [0.0000171, 0.0000054, 0.0000015, 0.000002, 0.0000038, 0.0000052, 0.0000155, 0.0000264, 0.0000512, 0.0000887, 0.0001611, 0.0002319, 0.0003481, 0.0004295, 0.0004915, 0.0003571, 0.0002822, 0.0002256],
					mortality: [0.0000014, 0.0000002, 0, 0, 0.0000003, 0.0000006, 0.0000017, 0.0000012, 0.0000051, 0.0000092, 0.0000214, 0.0000364, 0.0000684, 0.0001096, 0.0001542, 0.0001598, 0.000201, 0.0002508]
				}
			},
			{
				name: 'мочевого пузыря',
				male:
				{
					incidence: [0.0000004, 0.0000002, 0, 0.0000003, 0.0000031, 0.0000058, 0.000013, 0.0000194, 0.0000389, 0.000081, 0.0001681, 0.0003275, 0.0005745, 0.0008719, 0.0011687, 0.0012969, 0.0012864, 0.0008899],
					mortality: [0.0000004, 0, 0, 0, 0, 0.0000002, 0, 0.0000029, 0.0000039, 0.0000143, 0.0000361, 0.0000823, 0.0001556, 0.0002898, 0.0004534, 0.0006693, 0.0007943, 0.0007221]
				},
				female:
				{
					incidence: [0, 0.0000002, 0.0000003, 0.0000009, 0.0000029, 0.0000027, 0.0000038, 0.0000085, 0.0000118, 0.0000174, 0.000035, 0.0000572, 0.0000928, 0.0001228, 0.0001913, 0.0002166, 0.000229, 0.0001972],
					mortality: [0, 0, 0, 0, 0, 0.0000002, 0.0000005, 0.0000013, 0.0000011, 0.0000035, 0.0000057, 0.0000085, 0.0000186, 0.0000283, 0.0000526, 0.0000853, 0.0001299, 0.0001553]
				}
			},
			{
				name: 'головного мозга',
				addition: 'Включая дргуие отделы ЦНС',
				male:
				{
					incidence: [0.000021, 0.0000248, 0.0000175, 0.0000169, 0.0000182, 0.0000225, 0.0000341, 0.0000417, 0.0000478, 0.0000624, 0.0000904, 0.0001141, 0.0001458, 0.0001702, 0.0002054, 0.0001746, 0.0001291, 0.0000951],
					mortality: [0.0000093, 0.00001, 0.0000089, 0.0000075, 0.0000078, 0.000011, 0.0000193, 0.0000298, 0.0000426, 0.0000526, 0.000088, 0.000116, 0.0001432, 0.0001781, 0.0001976, 0.0001794, 0.0001688, 0.0001112]
				},
				female:
				{
					incidence: [0.0000196, 0.0000165, 0.0000137, 0.0000125, 0.0000119, 0.0000198, 0.0000286, 0.0000339, 0.0000338, 0.0000521, 0.000067, 0.000091, 0.0001054, 0.0001238, 0.0001442, 0.0001091, 0.0000983, 0.0000955],
					mortality: [0.0000108, 0.0000085, 0.0000067, 0.0000052, 0.0000076, 0.0000069, 0.0000119, 0.0000192, 0.0000225, 0.0000415, 0.0000618, 0.0000767, 0.0000979, 0.000121, 0.0001545, 0.0001244, 0.0001223, 0.0001257]
				}
			},
			{
				name: 'щитовидной железы',
				male:
				{
					incidence: [0, 0.0000004, 0.0000032, 0.0000152, 0.0000143, 0.0000125, 0.0000224, 0.000033, 0.0000391, 0.000049, 0.0000567, 0.0000619, 0.0000752, 0.0000758, 0.000083, 0.0000601, 0.0000419, 0.0000303],
					mortality: [0, 0, 0, 0, 0, 0.0000002, 0.0000006, 0.0000005, 0.0000025, 0.0000028, 0.0000041, 0.0000074, 0.0000157, 0.000016, 0.0000249, 0.000033, 0.0000243, 0.0000182]
				},
				female:
				{
					incidence: [0.0000002, 0.000002, 0.0000085, 0.0000325, 0.000051, 0.0000812, 0.000115, 0.0001457, 0.0001874, 0.0002056, 0.0002367, 0.0002695, 0.0002899, 0.0002722, 0.000257, 0.0001207, 0.0000983, 0.0000635],
					mortality: [0, 0, 0, 0, 0, 0.0000002, 0.0000003, 0.0000003, 0.0000005, 0.0000031, 0.0000027, 0.0000061, 0.0000087, 0.0000169, 0.0000292, 0.0000408, 0.000058, 0.0000641]
				}
			},
			{
				name: 'шейки матки',
				female:
				{
					incidence: [0, 0.0000002, 0.0000003, 0.0000009, 0.0000119, 0.0000924, 0.0002124, 0.0003431, 0.0004138, 0.0004032, 0.0003686, 0.0003569, 0.00032, 0.0002846, 0.0002524, 0.0002121, 0.0001974, 0.0001615],
					mortality: [0, 0, 0, 0, 0.0000026, 0.0000133, 0.0000425, 0.0000858, 0.000112, 0.0001326, 0.0001221, 0.0001368, 0.0001313, 0.000136, 0.0001296, 0.0001384, 0.0001479, 0.0001602]
				}
			},
			{
				name: 'яичника',
				female:
				{
					incidence: [0.0000007, 0.0000013, 0.0000049, 0.0000139, 0.0000192, 0.0000381, 0.0000617, 0.000098, 0.0001569, 0.0002575, 0.0003161, 0.0003372, 0.0003681, 0.0003838, 0.0004127, 0.0003196, 0.0002806, 0.0001799],
					mortality: [0, 0.0000002, 0, 0.0000015, 0.0000017, 0.0000058, 0.0000089, 0.0000195, 0.000039, 0.0000826, 0.0001112, 0.0001666, 0.0002072, 0.0002578, 0.0002834, 0.0002722, 0.0002686, 0.000228]
				}
			},
			{
				name: 'болезнью Ходжкина',
				male:
				{
					incidence: [0.0000022, 0.0000059, 0.0000098, 0.0000288, 0.000028, 0.0000271, 0.0000306, 0.0000279, 0.0000212, 0.0000197, 0.0000226, 0.0000221, 0.0000233, 0.0000289, 0.0000304, 0.0000262, 0.0000243, 0.0000101],
					mortality: [0, 0, 0.0000007, 0.0000011, 0.0000028, 0.0000038, 0.000006, 0.0000061, 0.0000066, 0.0000058, 0.0000075, 0.0000105, 0.0000138, 0.0000176, 0.000021, 0.0000223, 0.0000099, 0.0000222]
				},
				female:
				{
					incidence: [0.0000002, 0.0000016, 0.0000098, 0.0000252, 0.0000376, 0.0000396, 0.0000371, 0.0000289, 0.0000203, 0.000017, 0.0000136, 0.000015, 0.0000159, 0.0000189, 0.0000176, 0.0000157, 0.0000164, 0.0000111],
					mortality: [0, 0, 0, 0.0000003, 0.0000017, 0.0000029, 0.0000035, 0.0000038, 0.0000024, 0.0000029, 0.0000034, 0.0000043, 0.0000063, 0.0000083, 0.0000103, 0.0000111, 0.0000096, 0.0000123]
				}
			},
			{
				name: 'неходжкинской лимфомой',
				male:
				{
					incidence: [0.0000119, 0.0000155, 0.0000126, 0.0000133, 0.0000154, 0.0000177, 0.0000278, 0.0000459, 0.0000651, 0.0000701, 0.0001, 0.0001226, 0.0001763, 0.0002178, 0.0002674, 0.0002609, 0.000235, 0.0001274],
					mortality: [0.0000009, 0.0000019, 0.000002, 0.0000014, 0.000005, 0.0000058, 0.00001, 0.0000126, 0.0000222, 0.0000267, 0.0000404, 0.0000625, 0.0000971, 0.000134, 0.0001821, 0.0002076, 0.000171, 0.0001396]
				},
				female:
				{
					incidence: [0.0000079, 0.0000051, 0.000007, 0.0000078, 0.0000108, 0.0000198, 0.0000328, 0.0000356, 0.0000447, 0.0000535, 0.0000729, 0.0000954, 0.0001301, 0.000184, 0.0002083, 0.0001919, 0.0001847, 0.0001331],
					mortality: [0.0000002, 0.0000002, 0.0000003, 0.0000015, 0.000002, 0.0000046, 0.0000073, 0.0000092, 0.0000093, 0.0000131, 0.0000207, 0.0000373, 0.0000457, 0.0000799, 0.0001122, 0.0001355, 0.0001379, 0.0001374]
				}
			},
			{
				name: 'лейкемией',
				addition: 'С91-95',
				male:
				{
					incidence: [0.0000602, 0.0000427, 0.0000279, 0.0000272, 0.0000196, 0.000017, 0.0000244, 0.0000321, 0.0000359, 0.0000542, 0.0000878, 0.000149, 0.0002338, 0.0002984, 0.0004026, 0.0004451, 0.0003939, 0.000267],
					mortality: [0.0000099, 0.0000072, 0.0000071, 0.0000103, 0.0000174, 0.0000119, 0.0000119, 0.0000162, 0.0000202, 0.0000299, 0.000044, 0.0000788, 0.0001249, 0.0002111, 0.0002824, 0.0003734, 0.0003939, 0.000356]
				},
				female:
				{
					incidence: [0.0000526, 0.0000366, 0.0000194, 0.0000201, 0.0000123, 0.000019, 0.0000219, 0.0000272, 0.0000308, 0.0000469, 0.0000668, 0.0001027, 0.0001402, 0.0001886, 0.0002292, 0.0002751, 0.0002495, 0.0001905],
					mortality: [0.0000101, 0.0000065, 0.0000039, 0.0000055, 0.0000058, 0.0000077, 0.0000076, 0.0000124, 0.0000151, 0.0000213, 0.0000306, 0.0000514, 0.000071, 0.0001106, 0.0001545, 0.0002138, 0.0002198, 0.0002089]
				}
			}
		].sort((a, b) =>
		{
			if (a.first) return -1;
			if (a.name > b.name)
			{
				return 1;
			}
			if (a.name < b.name)
			{
				return -1;
			}
			return 0;
		})
	};
	const malesOnlyLocalisationIndexes = [];
	const femalesOnlyLocalisationIndexes = [];
	for (let index = 0; index < RATES.cancerRates.length; index++)
	{
		if (!RATES.cancerRates[index].female)
		{
			malesOnlyLocalisationIndexes.push(index);
		}
		if (!RATES.cancerRates[index].male)
		{
			femalesOnlyLocalisationIndexes.push(index);
		}
	}

	const SURVIVAL = calculateSurvival();
	const HEALTY_SURVIVAL = calculateHealthySurvival();
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
	function getHealthySurvival(sex, e, a, localizationIndex)
	{
		if (a < e) return 1;
		return HEALTY_SURVIVAL[localizationIndex][sex][a] / HEALTY_SURVIVAL[localizationIndex][sex][e];
	}
	function calculateSurvival_common(lambda)
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
					sum += lambda(sex, k);
				}
				aux[a] = Math.exp(-sum);
			}
			out[sex] = aux;
		}
		return out;
	}
	function calculateSurvival()
	{
		function lambda(sex, k)
		{
			return lambdaInterp(RATES.totalMortality[sex], k);
		}
		return calculateSurvival_common(lambda);
	}
	function calculateHealthySurvival()
	{
		const out = [];
		for (let localizationIndex = 0; localizationIndex < RATES.cancerRates.length; localizationIndex++)
		{
			const lambda = function(sex, k)
			{
				if (!RATES.cancerRates[localizationIndex][sex]) return lambdaInterp(RATES.totalMortality[sex], k);
				return lambdaInterp(RATES.totalMortality[sex], k) - lambdaInterp(RATES.cancerRates[localizationIndex][sex].mortality, k) + lambdaInterp(RATES.cancerRates[localizationIndex][sex].incidence, k);
			};
			out.push(calculateSurvival_common(lambda));
		}
		return out;
	}
	function getCancerProbability(sex, localizationIndex, ageStart, ageEnd)
	{
		return 1 - getHealthySurvival(sex, ageStart, ageEnd, localizationIndex) / getSurvival(sex, ageStart, ageEnd);
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
	function setDisplayNone(element, visibility)
	{
		element.style = visibility ? 'display: inherit' : 'display: none';
	}
	function setVisibilityHidden(element, visibility)
	{
		element.style = visibility ? 'visibility: inherit' : 'visibility: hidden';
	}
	//Блок, отвечающий за время дожития
	{
		const remainigAgeElement = document.getElementById('survival-remaining-age');
		const remainigAgeNameElement = document.querySelector('#survival-remaining-age + span');
		const currentAgeElement = document.getElementById('survival-curent-age-input');
		const currentAgeNameElement = document.querySelector('#survival-curent-age-input + span');
		const maleRadioElement = document.getElementById('survival-sex-males-input');
		const femaleRadioElement = document.getElementById('survival-sex-females-input');

		const futureAgeElement = document.getElementById('survival-future-age-input');
		const futureAgeNameElement = document.querySelector('#survival-future-age-input + span');
		const totalMortProbabilityElement = document.getElementById('survival-total-mort');

		const localizationSelectElement = document.getElementById('survival-localization-select');
		const localizationProbabilityElement = document.getElementById('survival-cancer-incidence');
		const tableFooterElement = document.querySelector('.formView table + span');
		const asterixElement = document.querySelector('#survival-localization-select + span');

		for (let loc of RATES.cancerRates)
		{
			localizationSelectElement.appendChild(new Option(loc.name));
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
		const getSelectedLocalizationIndex = function()
		{
			return localizationSelectElement.selectedIndex;
		};
		let localizationIndex = getSelectedLocalizationIndex();
		localizationSelectElement.addEventListener('change', () =>
		{
			localizationIndex = getSelectedLocalizationIndex();
			const addition = RATES.cancerRates[localizationIndex].addition;
			if (addition)
			{
				setVisibilityHidden(tableFooterElement, true);
				tableFooterElement.innerText = '*' + addition;
				setVisibilityHidden(asterixElement, true);
			}
			else
			{
				setVisibilityHidden(tableFooterElement, false);
				setVisibilityHidden(asterixElement, false);
			}
			recalc(true);
		});
		const disableOnlySexLocalizations = function()
		{
			for (let i of femalesOnlyLocalisationIndexes)
			{
				const flag = (sex === 'female');
				setDisplayNone(localizationSelectElement.options[i], flag);
				if (!flag && localizationIndex === i)
				{
					localizationSelectElement.selectedIndex = 0;
					localizationIndex = 0;
				}
			}
			for (let i of malesOnlyLocalisationIndexes)
			{
				const flag = (sex === 'male');
				setDisplayNone(localizationSelectElement.options[i], flag);
				if (!flag && localizationIndex === i)
				{
					localizationSelectElement.selectedIndex = 0;
					localizationIndex = 0;
				}
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
				totalMortProbabilityElement.innerText = '__';
				localizationProbabilityElement.innerText = '__';
			}
			else
			{
				if (!probabilityOnly) //Не нужно пересчитывать, если изменены данные, не относящиеся к текущему возрасту и полу.
				{
					const aux = Math.round(remainingAge(sex, currentAge));
					remainigAgeElement.innerText = aux;
					remainigAgeNameElement.innerText = name_var1(aux);
				}
				if (futureAgeError)
				{
					totalMortProbabilityElement.innerText = '__';
					localizationProbabilityElement.innerText = '__';
				}
				else
				{
					let aux = getDeathProbability(sex, currentAge, futureAge);
					totalMortProbabilityElement.innerText = Math.round(aux * 100 * 100) / 100 + '%';
					aux = getCancerProbability(sex, localizationIndex, currentAge, futureAge);
					localizationProbabilityElement.innerText = Math.round(aux * 100 * 100) / 100 + '%';
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
				currentAgeNameElement.innerText = '';
				currentAgeError = true;
			}
			else
			{
				currentAgeNameElement.innerText = name_var1(currentAge);
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
	}
})();
