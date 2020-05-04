//Разработано Александром Меняйло в апреле 2018 года. (deorathemen@gmail.com)
/*
The MIT License (MIT)

Copyright (c) Aleksandr Meniailo, Mendeo 2020

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

//$fn = 50;
Pi = 3.141592653589793238462643;

/*
P - Ширина основания нити резьбы.
C - Расстояние между нитями резьбы.
P + C - Шаг резьбы.
rad - радиус резьбы (измеряется по вершине нити резьбы.)
n - Число полных витков резьбы. С верху и снизу дополнительно добавляется по одному неполному витку.
fNum - при вызове модулей передавать $fn.
isFill - делать внутреннюю стенку для внешней резьбы, чтобы резьбе было на чём держаться.
tWall - ширина этой внутренней стенки для внешней резьбы или внешней стенки для внутренней резьбы.
K - Коэффициент исправления артефактов. Для внешней резьбы нужно оставить 0. Подбирается экспериментально :)
*/

module externalThread(P, C, rad, n, fNum = $fn, isFill = true, tWall = -1, K = 0) //
{
	E = P + C;
	HTh = E * (n + 1);
	H = cos(30) * P;
	radInt = rad - 7 * H / 8; //Внутренний радиус резьбы.
	if (isFill) 
	{
		cylinder(r = radInt + H * K, h = HTh, $fn = fNum); //К нужно, чтобы убрать артефакты при создании внутренней резьбы.
	}
	else
	{
		if (tWall > 0)
		{
			difference()
			{
				cylinder(r = radInt, h = HTh, $fn = fNum);
				cylinder(r = radInt - tWall, h = HTh, $fn = fNum);
			}
		}
	}
	difference()
	{
		translate([0, 0, -E])
		thLoops(P, C, rad, n + 2, fNum);
		translate([0, 0, -2 * E])
		cylinder(r = rad + P, h = 2 * E, $fn = fNum);
		translate([0, 0, HTh])
		cylinder(r = rad + P, h = 2 * E, $fn = fNum);
	}
}

module internalThread(P, C, rad, tWall, n, K, fNum = $fn)
{
	E = P + C;
	HTh = E * (n + 1);
	difference()
	{
		cylinder(r = rad + tWall, h = HTh, $fn = fNum);
		externalThread(P, C, rad, n, fNum, true, -1, K); // Коэффициент "K" убирает артефакты. Вместо 0.001 можно поставить другое число (зависит от $fn). 0.001 - это для $fn = 250.
	}
}

module thLoops(P, C, rad, n, fNum = $fn)
{
	E = P + C;
	H = cos(30) * P;
	radInt = rad - 7 * H / 8; //Внутренний радиус резьбы.
	delta = 360 / fNum; //Угол поворота
	for (alpha = [delta / 2: delta : (360 + delta / 2)* n]) //Начинаем с delta /2 чтобы многоугольник цилиндра совпал с многоугольником резьбы.
	{
		x1 = radInt * sin(alpha);
		y1 = -radInt * cos(alpha);
		z1 = E * alpha / 360;
		x2 = radInt * sin(alpha + delta);
		y2 = -radInt * cos(alpha + delta);
		z2 =  E * (alpha + delta) / 360;
		h1 = 7 * H / 8;
		
		segPoints = [
					[x1, y1, z1], //0
					[x2, y2, z2], //1
					[x1, y1, z1 + P], //2
					[x2, y2, z2 + P], //3
					[x1 + h1 * sin(alpha), y1 - h1 * cos(alpha), z1 + P / 2 - H * sqrt(3) / 24], //4
					[x2 + h1 * sin(alpha + delta), y2 - h1 * cos(alpha + delta), z2 + P / 2 - H * sqrt(3) / 24], //5
					[x1 + h1 * sin(alpha), y1 - h1 * cos(alpha), z1 + P / 2 + H * sqrt(3) / 24], //6
					[x2 + h1 * sin(alpha + delta), y2 - h1 * cos(alpha + delta), z2 + P / 2 + H * sqrt(3) / 24], //7
		];
		//Набором точек нужно в ручную определять треугольники, т.к. если определить просто грани, то программа сама плохо строит треугольники.
		segFaces = [
					[0, 1, 3], [0, 3, 2], //Задняя часть.
					[2, 6, 0], [0, 6, 4], //Левая грань.
					[1, 5, 3], [3, 5, 7], //Правая грань.
					[0, 4, 5], [0, 5, 1], //Нижняя грань.
					[4, 6, 7], [4, 7, 5],//Узкая грань.
					[6, 2, 3], [6, 3, 7] //Верхняя грань.
		];
		render()
		polyhedron(points = segPoints, faces = segFaces, convexity = 100);
	}
}