//Разработано 8.05.2019 г. Меняйло А.Н.
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

use <thread.scad>;

$fn = 250;

//Юпитер-37
//HDown = 70; //Без учёта высоты резьбы
//HUp = 43;
//intD = 64;

//Гелиос 44-2
//HDown = 40; //Без учёта высоты резьбы
//HUp = 36.2;
//intD = 64;

//Sony
//HDown = 38; //Без учёта высоты резьбы
//HUp = 25.6;
//intD = 68;

//Fotga M42-Nex
//HDown = 24; //Без учёта высоты резьбы
//HUp = 23;
//intD = 62;

//Макрокольца
HDown = 90;
HUp = 24;
intD = 50;

TWall = 3.6;

extD = intD + 2 * TWall;
bottomH = 1.2;
//Параметры резьбы
P = 1.4;
C = 3;
nThread = 1; //Для Гелиоса равно 2
hThread = (nThread + 1) * (P + C);
addForInternal = P * 0.6;
tWallIntThread = 1; //Толщина стенки, на которой держится внутренняя резьба.
threadD = extD - 2 * tWallIntThread;
wThread = 7 * sqrt(3) * P / 16; //Вычисление высоты самой ниточки резьбы.
tWallExtThread = (threadD - addForInternal - intD) / 2 - wThread; //Вычисление (для информации) толщины стенки, на которой держится внешняя резьба.

HInternal = HUp + HDown - TWall * 2 - bottomH * 2; //Высота внутреннего пространства в закрытом состоянии (для информации).

//Насечки на крышке.
notchingT = 1.5; //Сторона треугольника.
Ppolygon = $fn * extD * sin(180 / $fn); //Периметр многоугольника, которым программа подгоняет окружность цилиндра футляра.
notchingN = floor(Ppolygon / notchingT);
notchingTNew = Ppolygon / notchingN;
notchingD = 2 * notchingTNew / sqrt(3);
notchingH = HUp - TWall - hThread;
notchingDeep = notchingT * sqrt(3) / 2; //Высота треугольника.
deltaAlpha = 360 / notchingN;
echo(HInternal = HInternal, extD = extD, hThread = hThread, notchingTNew = notchingTNew, notchingN = notchingN, notchingDeep = notchingDeep, intD = intD, tWallExtThread = tWallExtThread, wThread = wThread);

//Надпись на крышке
textHeight = extD / 8;
textFont = "Nautilus Pompilius"; //Название шрифта для надписи (ШРИФТ ДОЛЖЕН БЫТЬ УСТАНОВЛЕН В СИСТЕМЕ).
textWidth = 2 * bottomH / 3;
textText = "Макро M42";//"M42-Sony E";//"Sony 16-50";//"Гелиос 44-2"; //"Юпитер-37";

//Параметры текста на стенке
textDepth = 0.6;
textStartAngle = 60; //Угол, с которого начинается надпсиь.
textAngle = 155;//120; //Угол, на котором заканчивается надпись.
textOnWall = ["М", "", "а", "к", "р", "о", "к", "о", "л", "ь", "ц", "а", " ", " ", "M", "", "4", "2"];//["M", " ", "4", "2", "-", "S", "o", "n", "y", " ", "E"];//["S", "o", "n", "y", " ", "1", "6", "-", "5", "0"];//["Г", "е", "л", "и", "о", "с", " ", "4", "4", "-", "2"];


//downPart();
//translate([0, 0, HDown])
//rotate([180, 0, 0])
//upPart(false);
upPartThread();

module downPart()
{
	difference()
	{
		difference()
		{
			union()
			{
				cylinder(d = extD, h = HDown);
				translate([0, 0, HDown])
				externalThread(P, C, (threadD - addForInternal) / 2, nThread, fNum = $fn, isFill = true);
			}
			translate([0, 0, TWall + bottomH])
			cylinder(d = intD, h = HDown + hThread); 
		}
		cylinder(d = intD, h = bottomH);
		//Пишем текст на стенке.
		translate([0, 0, HDown / 2 - textHeight / 4])
		rotateText(textOnWall, extD / 2 - textDepth, textStartAngle, textAngle, textHeight, textDepth + 1, textFont);
	}
	//Пишем текст на дне.
	/*
	translate([0, 0, bottomH])
	rotate([180, 0, 0])
	linear_extrude(height = textWidth)
	text(text = textText, halign = "center", valign = "center", size = textHeight, font = textFont);
	*/
}

module upPartThread()
{
	internalThread(P, C, threadD / 2, tWallIntThread, nThread, 0.001, fNum = $fn);
}

module upPart(needThread)
{
	difference()
	{
		union()
		{
			HNoThread = HUp - hThread;
			render()
			translate([0, 0, hThread])
			difference()
			{
				cylinder(d = extD, h = HNoThread);
				translate([0, 0, -(TWall + bottomH)])
				cylinder(d = intD, h = HNoThread);
			}
			if(needThread) upPartThread();
		}
		//Делаем насечки на крышке.
		r = extD / 2 - notchingD / 4;
		render()
		for (alpha = [0 : deltaAlpha : 360])
		{
			translate([r * cos(alpha), r * sin(alpha), hThread])
			rotate([0, 0, 180 + alpha])
			cylinder(d = notchingD, h = notchingH, $fn = 3);
		}
		//Убираем фаску сверху
		render()
		translate([0, 0, hThread + notchingH])
		linear_extrude(height = HUp - notchingH - hThread)
		{
			difference()
			{
				circle(d = extD + 1);
				offset(delta = -notchingDeep)
				circle(d = extD);
			}
		}
		//Продавливаем на крышке ямочку.
		translate([0, 0, HUp - bottomH])
		cylinder(d = extD - 2 * TWall, h = bottomH);
	}
		//Пишем текст на крышке.
		translate([0, 0, HUp - bottomH])
		linear_extrude(height = textWidth)
		text(text = textText, halign = "center", valign = "center", size = textHeight, font = textFont);
}

module rotateText(textVector, radius, startAngle, angle, textHeight, textWidth, textFont)
{
	for (a = [0 : len(textVector)])
	{
		alpha = a * angle / len(textVector) + startAngle;
		x = radius * cos(alpha);
		y = radius * sin(alpha);
		translate([x, y , 0])
		rotate([90, 0, alpha + 90])
		linear_extrude(height = textWidth)
		text(text = textVector[a], halign = "center", size = textHeight, font = textFont);
	}
}