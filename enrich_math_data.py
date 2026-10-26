# -*- coding: utf-8 -*-
"""
Enrich math_data.js with beautiful LaTeX formulas, clean spacing,
and structured theory/formulas/examples for Grade 7, 8, 10.
"""

import json
import re

with open("math_data.js", "r", encoding="utf-8") as f:
    raw = f.read()

json_str = raw.split("window.MATH_DATA = ")[1].rstrip(";\n ")
data = json.loads(json_str)

# Enhanced Grade 7 lessons with beautiful LaTeX
g7_enhanced = [
    {
        "id": "g7_ch01", "num": 1, "title": "ចំនួនគត់ (Whole Numbers)", "category": "នព្វន្ត",
        "summary": "ចំនួនគត់រួមមាន $0, 1, 2, 3, 4, \\dots$ តាងដោយសំណុំ $\\mathbb{N}_0 = \\{0, 1, 2, 3, \\dots\\}$។ ប្រព័ន្ធរបាប់ដប់ (Decimal System) ប្រើប្រាស់លេខ ១០ តួគឺ $0, 1, 2, 3, 4, 5, 6, 7, 8, 9$ ដោយផ្អែកលើតម្លៃតាមខ្ទង់ (Place Value)។",
        "formulas": [
            {"name": "លក្ខណៈប្តូរ", "math": "$$a + b = b + a \\quad \\text{និង} \\quad a \\times b = b \\times a$$"},
            {"name": "លក្ខណៈផ្តុំ", "math": "$$(a + b) + c = a + (b + c) \\quad \\text{និង} \\quad (a \\times b) \\times c = a \\times (b \\times c)$$"},
            {"name": "លក្ខណៈបំបែកនៃវិធីគុណចំពោះវិធីបូក", "math": "$$a \\times (b + c) = a \\times b + a \\times c$$"},
            {"name": "លំដាប់នៃប្រមាណវិធី", "math": "$$\\text{វង់ក្រចក } () \\;\\longrightarrow\\; \\text{ស្វ័យគុណ/ឫស} \\;\\longrightarrow\\; \\text{គុណ/ចែក} \\;\\longrightarrow\\; \\text{បូក/ដក}$$"}
        ],
        "examples": [
            {
                "title": "គណនាតម្លៃនៃកន្សោមរហ័សដោយប្រើលក្ខណៈផ្តុំ និងប្តូរ",
                "question": "គណនា $A = 25 \\times 37 \\times 4$",
                "solution": "$$A = (25 \\times 4) \\times 37 = 100 \\times 37 = 3700$$"
            },
            {
                "title": "គណនាតាមលំដាប់នៃប្រមាណវិធី",
                "question": "គណនា $B = 100 - [40 - (18 - 3 \\times 4) \\div 2] \\times 2$",
                "solution": "• គណនាក្នុងវង់ក្រចកតូច ៖ $18 - 3 \\times 4 = 18 - 12 = 6$\n• គណនាក្នុងតង្កៀប ៖ $40 - 6 \\div 2 = 40 - 3 = 37$\n• គណនាកន្សោមចុងក្រោយ ៖ $B = 100 - 37 \\times 2 = 100 - 74 = 26$"
            }
        ]
    },
    {
        "id": "g7_ch02", "num": 2, "title": "តួចែក និងពហុគុណ (Divisors & Multiples)", "category": "នព្វន្ត",
        "summary": "តួចែករួមធំបំផុត (PGCD / GCD) គឺជាចំនួនគត់ធំបំផុតដែលចែកដាច់នឹងចំនួនទាំងនោះ។ ពហុគុណរួមតូចបំផុត (PPCM / LCM) គឺជាចំនួនវិជ្ជមានតូចបំផុតដែលចែកដាច់នឹងចំនួនទាំងនោះ។ ចំនួនបឋមជាចំនួនដែលមានតួចែកតែពីរគត់ គឺ $1$ និងខ្លួនឯង។",
        "formulas": [
            {"name": "ទំនាក់ទំនងរវាង PGCD និង PPCM", "math": "$$\\text{PGCD}(a, b) \\times \\text{PPCM}(a, b) = a \\times b$$"},
            {"name": "សញ្ញាណចែកដាច់នឹង ២, ៣, ៥, ៩", "math": "• ចែកដាច់នឹង $2$ ៖ លេខខ្ទង់រាយជាលេខគូ ($0, 2, 4, 6, 8$)\n• ចែកដាច់នឹង $3$ និង $9$ ៖ ផលបូកលេខតាមខ្ទង់ចែកដាច់នឹង $3$ ឬ $9$\n• ចែកដាច់នឹង $5$ ៖ លេខខ្ទង់រាយបញ្ចប់ដោយ $0$ ឬ $5$"}
        ],
        "examples": [
            {
                "title": "រក PGCD និង PPCM តាមកត្តាបឋម",
                "question": "រក $\\text{PGCD}(24, 36)$ និង $\\text{PPCM}(24, 36)$",
                "solution": "• បំបែកជាកត្តាបឋម ៖ $24 = 2^3 \\times 3$ និង $36 = 2^2 \\times 3^2$\n• $\\text{PGCD}(24, 36) = 2^2 \\times 3 = 12$\n• $\\text{PPCM}(24, 36) = 2^3 \\times 3^2 = 8 \\times 9 = 72$"
            }
        ]
    },
    {
        "id": "g7_ch03", "num": 3, "title": "ចំនួនគត់រ៉ឺឡាទីប (Integers)", "category": "នព្វន្ត",
        "summary": "សំណុំចំនួនគត់រ៉ឺឡាទីប $\\mathbb{Z} = \\{\\dots, -3, -2, -1, 0, 1, 2, 3, \\dots\\}$។ តម្លៃដាច់ខាតនៃចំនួន $a$ តាងដោយ $|a|$ ជាចម្ងាយពីគល់ $0$ ទៅចំណុច $a$ នៅលើបន្ទាត់ចំនួន។",
        "formulas": [
            {"name": "ក្បួនសញ្ញានៃវិធីបូក និងដក", "math": "• បូកសញ្ញាដូចគ្នា ៖ $(+a) + (+b) = +(a+b) \\quad ; \\quad (-a) + (-b) = -(a+b)$\n• បូកសញ្ញាខុសគ្នា ៖ យកតម្លៃធំដកតម្លៃតូច សញ្ញាយកតាមចំនួនធំ\n• វិធីដក ៖ $a - b = a + (-b)$ (បូកនឹងចំនួនផ្ទុយ)"},
            {"name": "ក្បួនសញ្ញានៃវិធីគុណ និងចែក", "math": "$$(+) \\times (+) = (+) \\quad ; \\quad (-) \\times (-) = (+) \\quad ; \\quad (+) \\times (-) = (-)$$"}
        ],
        "examples": [
            {
                "title": "ប្រមាណវិធីលើចំនួនគត់រ៉ឺឡាទីប",
                "question": "គណនា $A = (-15) + (+8) - (-12)$ និង $B = (-6) \\times (-4) \\div (-8)$",
                "solution": "• $A = -15 + 8 + 12 = -15 + 20 = +5$\n• $B = (+24) \\div (-8) = -3$"
            }
        ]
    },
    {
        "id": "g7_ch04", "num": 4, "title": "ប្រភាគ (Fractions)", "category": "នព្វន្ត",
        "summary": "ប្រភាគមានទម្រង់ $\\dfrac{a}{b}$ ដែល $a$ ជាភាគយក និង $b \\neq 0$ ជាភាគបែង។ ប្រភាគស្មើគ្នាកាលណាផលគុណខ្វែងស្មើគ្នា $a \\times d = b \\times c$។",
        "formulas": [
            {"name": "វិធីបូក និងដកប្រភាគ", "math": "$$\\frac{a}{b} + \\frac{c}{b} = \\frac{a+c}{b} \\qquad ; \\qquad \\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$$"},
            {"name": "វិធីគុណ និងចែកប្រភាគ", "math": "$$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd} \\qquad ; \\qquad \\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}$$"}
        ],
        "examples": [
            {
                "title": "គណនាប្រភាគចម្រុះ",
                "question": "គណនា $P = \\left(\\dfrac{2}{3} + \\dfrac{1}{4}\\right) \\div \\dfrac{11}{12}$",
                "solution": "• គណនាក្នុងវង់ក្រចក ៖ $\\dfrac{2}{3} + \\dfrac{1}{4} = \\dfrac{8 + 3}{12} = \\dfrac{11}{12}$\n• គណនាផលចែក ៖ $P = \\dfrac{11}{12} \\div \\dfrac{11}{12} = 1$"
            }
        ]
    },
    {
        "id": "g7_ch09", "num": 9, "title": "សមីការដឺក្រេទី១មានមួយអញ្ញាត (Linear Equations)", "category": "ពីជគណិត",
        "summary": "សមីការដឺក្រេទី១មានមួយអញ្ញាតមានទម្រង់ទូទៅ $ax + b = 0$ ($a \\neq 0$) ដែល $x$ ជាអញ្ញាត។ ដំណោះស្រាយសមីការ គឺជាការស្វែងរកតម្លៃ $x$ ដែលធ្វើឱ្យសមភាពពិត។",
        "formulas": [
            {"name": "ដំណោះស្រាយសមីការទូទៅ", "math": "$$ax + b = 0 \\iff ax = -b \\iff x = -\\frac{b}{a}$$"},
            {"name": "វិធានប្តូរអង្គ", "math": "កាលណាប្តូរតួមួយពីអង្គម្ខាងទៅអង្គម្ខាងទៀត ត្រូវប្តូរសញ្ញាពី $(+)$ ទៅ $(-)$ ឬពី $(-)$ ទៅ $(+)$"}
        ],
        "examples": [
            {
                "title": "ដោះស្រាយសមីការមានវង់ក្រចក",
                "question": "ដោះស្រាយសមីការ ៖ $4(x - 2) + 5 = 2x + 9$",
                "solution": "$$4x - 8 + 5 = 2x + 9 \\iff 4x - 3 = 2x + 9 \\iff 4x - 2x = 9 + 3 \\iff 2x = 12 \\iff x = 6$$"
            }
        ]
    },
    {
        "id": "g7_ch16", "num": 16, "title": "បរិមាត្រ និងក្រឡាផ្ទៃពហុកោណ (Perimeter & Area)", "category": "ធរណីមាត្រ",
        "summary": "រូបមន្តគណនាបរិមាត្រ (ប្រវែងជុំវិញ) និងផ្ទៃក្រឡា (ទំហំផ្ទៃខាងក្នុង) នៃពហុកោណទូទៅក្នុងប្លង់។",
        "formulas": [
            {"name": "ចតុកោណកែង (បណ្តោយ $a$, ទទឹង $b$)", "math": "$$P = 2(a + b) \\qquad ; \\qquad S = a \\times b$$"},
            {"name": "ការ៉េ (ជ្រុង $a$)", "math": "$$P = 4a \\qquad ; \\qquad S = a^2$$"},
            {"name": "ត្រីកោណ (បាត $b$, កម្ពស់ $h$)", "math": "$$S = \\frac{1}{2} \\times b \\times h$$"},
            {"name": "ចតុកោណព្នាយ (បាតតូច $a$, បាតធំ $b$, កម្ពស់ $h$)", "math": "$$S = \\frac{(a + b) \\times h}{2}$$"}
        ],
        "examples": [
            {
                "title": "គណនាផ្ទៃក្រឡាចតុកោណព្នាយ",
                "question": "ចតុកោណព្នាយមួយមានបាត $a = 6\\text{ cm}$, $b = 10\\text{ cm}$ និងកម្ពស់ $h = 5\\text{ cm}$។ រកផ្ទៃក្រឡា $S$។",
                "solution": "$$S = \\frac{(6 + 10) \\times 5}{2} = \\frac{16 \\times 5}{2} = 40\\text{ cm}^2$$"
            }
        ]
    }
]

# Enhanced Grade 8 lessons
g8_enhanced = [
    {
        "id": "g8_ch01", "num": 1, "title": "ចំនួនសនិទាន (Rational Numbers)", "category": "នព្វន្ត-ពីជគណិត",
        "summary": "ចំនួនសនិទានជាចំនួនដែលអាចសរសេរជាទម្រង់ប្រភាគ $\\dfrac{a}{b}$ ដែល $a, b \\in \\mathbb{Z}$ និង $b \\neq 0$។ សំណុំនៃចំនួនសនិទានតាងដោយនិមិត្តសញ្ញា $\\mathbb{Q}$។",
        "formulas": [
            {"name": "និយមន័យសំណុំ $\\mathbb{Q}$", "math": "$$\\mathbb{Q} = \\left\\{ \\frac{a}{b} \\;\\middle|\\; a \\in \\mathbb{Z},\\; b \\in \\mathbb{Z},\\; b \\neq 0 \\right\\}$$"},
            {"name": "ប្រមាណវិធីលើចំនួនសនិទាន", "math": "$$\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd} \\qquad ; \\qquad \\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd} \\qquad ; \\qquad \\frac{a}{b} \\div \\frac{c}{d} = \\frac{ad}{bc}$$"}
        ],
        "examples": [
            {
                "title": "គណនាតម្លៃនៃកន្សោមសនិទាន",
                "question": "គណនា $A = \\dfrac{3}{4} - \\dfrac{5}{6} \\times \\dfrac{9}{10} + \\dfrac{1}{2}$",
                "solution": "• ធ្វើគុណមុន ៖ $\\dfrac{5}{6} \\times \\dfrac{9}{10} = \\dfrac{45}{60} = \\dfrac{3}{4}$\n• ជំនួសចូល ៖ $A = \\dfrac{3}{4} - \\dfrac{3}{4} + \\dfrac{1}{2} = \\dfrac{1}{2}$"
            }
        ]
    },
    {
        "id": "g8_ch02", "num": 2, "title": "ស្វ័យគុណ (Powers & Exponents)", "category": "ពីជគណិត",
        "summary": "ស្វ័យគុណនៃចំនួនពិត $a$ ស្វ័យគុណ $n$ ($a^n$)។ វិធាននៃស្វ័យគុណ និងការសរសេរជាទម្រង់ស្តង់ដារវិទ្យាសាស្ត្រ $a \\times 10^n$ ($1 \\le a < 10$)។",
        "formulas": [
            {"name": "វិធានគ្រឹះនៃស្វ័យគុណ", "math": "$$a^m \\times a^n = a^{m+n} \\qquad ; \\qquad \\frac{a^m}{a^n} = a^{m-n} \\qquad ; \\qquad (a^m)^n = a^{mn}$$"},
            {"name": "ស្វ័យគុណនៃផលគុណ និងផលចែក", "math": "$$(ab)^n = a^n b^n \\qquad ; \\qquad \\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$$"},
            {"name": "ស្វ័យគុណសូន្យ និងអវិជ្ជមាន", "math": "$$a^0 = 1 \\; (a \\neq 0) \\qquad ; \\qquad a^{-n} = \\frac{1}{a^n}$$"}
        ],
        "examples": [
            {
                "title": "សម្រួលកន្សោមស្វ័យគុណ",
                "question": "គណនា $M = \\dfrac{2^5 \\times 4^3}{8^3}$",
                "solution": "• បំប្លែងទៅជាគោល $2$ ៖ $4^3 = (2^2)^3 = 2^6$ និង $8^3 = (2^3)^3 = 2^9$\n• $M = \\dfrac{2^5 \\times 2^6}{2^9} = \\dfrac{2^{11}}{2^9} = 2^{11 - 9} = 2^2 = 4$"
            }
        ]
    },
    {
        "id": "g8_ch05", "num": 5, "title": "កន្សោមពីជគណិត និងសមភាពគួរចងចាំ", "category": "ពីជគណិត",
        "summary": "រូបមន្តទ្វេធា (សមភាពគួរចងចាំ) ការពន្លាត និងការដាក់កន្សោមពីជគណិតជាផលគុណកត្តាដឺក្រេទី១។",
        "formulas": [
            {"name": "ការ៉េនៃផលបូក", "math": "$$(a + b)^2 = a^2 + 2ab + b^2$$"},
            {"name": "ការ៉េនៃផលដក", "math": "$$(a - b)^2 = a^2 - 2ab + b^2$$"},
            {"name": "ផលសងការ៉េ", "math": "$$(a - b)(a + b) = a^2 - b^2$$"}
        ],
        "examples": [
            {
                "title": "ពន្លាត និងដាក់ជាផលគុណកត្តា",
                "question": "ពន្លាត $(3x - 2)^2$ និងដាក់ជាកត្តា $9x^2 - 16$",
                "solution": "• ពន្លាត ៖ $(3x - 2)^2 = (3x)^2 - 2(3x)(2) + 2^2 = 9x^2 - 12x + 4$\n• ដាក់ជាកត្តា ៖ $9x^2 - 16 = (3x)^2 - 4^2 = (3x - 4)(3x + 4)$"
            }
        ]
    },
    {
        "id": "g8_ch09", "num": 9, "title": "ប្លង់កូអរដោនេ និងក្រាប (Coordinate Plane & Graphs)", "category": "ពីជគណិត-ធរណីមាត្រ",
        "summary": "ប្លង់កូអរដោនេដេកាត $Oxy$។ ចំណុច $A(x_A, y_A)$។ ចម្ងាយរវាងពីរចំណុច កូអរដោនេចំណុចកណ្តាល និងសមីការបន្ទាត់ $y = ax + b$។",
        "formulas": [
            {"name": "ចម្ងាយរវាងពីរចំណុច $A$ និង $B$", "math": "$$AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$$"},
            {"name": "ចំណុចកណ្តាល $M$ នៃអង្កត់ $AB$", "math": "$$x_M = \\frac{x_A + x_B}{2} \\qquad ; \\qquad y_M = \\frac{y_A + y_B}{2}$$"},
            {"name": "លក្ខខណ្ឌបន្ទាត់ស្រប និងកែង", "math": "• ស្របគ្នា ៖ $a = a'$\n• កែងគ្នា ៖ $a \\times a' = -1$"}
        ],
        "examples": [
            {
                "title": "រកចម្ងាយ និងចំណុចកណ្តាល",
                "question": "គេមាន $A(1, 2)$ និង $B(5, 5)$។ គណនា $AB$ និងកូអរដោនេនៃ $M$ កណ្តាល $AB$។",
                "solution": "• $AB = \\sqrt{(5 - 1)^2 + (5 - 2)^2} = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5$\n• $x_M = \\dfrac{1 + 5}{2} = 3 \\quad ; \\quad y_M = \\dfrac{2 + 5}{2} = 3.5 \\implies M(3, 3.5)$"
            }
        ]
    }
]

# Enhanced Grade 10 lessons
g10_enhanced = [
    {
        "id": "g10_ch01", "num": 1, "title": "ពហុធា និងប្រមាណវិធីចែកពហុធា (Polynomials)", "category": "ពីជគណិត",
        "summary": "ពហុធាអថេរ $x$ ដឺក្រេ $n$ គឺជាកន្សោមពីជគណិត $P(x) = a_n x^n + a_{n-1} x^{n-1} + \\dots + a_1 x + a_0$ ($a_n \\neq 0$)។ វិធីចែកអឺគ្លីដ និងវិធីចែកកាត់ (Horner / Synthetic Division)។ ទ្រឹស្តីបទសំណល់ និងទ្រឹស្តីបទកត្តា។",
        "formulas": [
            {"name": "ទម្រង់ទូទៅនៃពហុធា", "math": "$$P(x) = a_n x^n + a_{n-1} x^{n-1} + \\dots + a_1 x + a_0 \\quad (a_n \\neq 0)$$"},
            {"name": "សមភាពវិធីចែកពហុធា", "math": "$$P(x) = D(x) \\cdot Q(x) + R(x) \\quad (\\text{deg } R < \\text{deg } D)$$"},
            {"name": "ទ្រឹស្តីបទសំណល់ (Remainder Theorem)", "math": "$$\\text{ចែក } P(x) \\text{ នឹង } (x - a) \\implies \\text{សំណល់ } R = P(a)$$"},
            {"name": "ទ្រឹស្តីបទកត្តា (Factor Theorem)", "math": "$$(x - a) \\text{ ជាកត្តានៃ } P(x) \\iff P(a) = 0$$"}
        ],
        "examples": [
            {
                "title": "រកសំណល់ និងដាក់ជាផលគុណកត្តា",
                "question": "គេឱ្យពហុធា $P(x) = x^3 - 4x^2 + x + 6$។\nក. គណនា $P(-1)$ រួចទាញរកកត្តាមួយនៃ $P(x)$។\nខ. ដាក់ $P(x)$ ជាផលគុណកត្តាដឺក្រេទី១។",
                "solution": "• ក. $P(-1) = (-1)^3 - 4(-1)^2 + (-1) + 6 = -1 - 4 - 1 + 6 = 0$។ ដូច្នេះ $(x + 1)$ ជាកត្តានៃ $P(x)$។\n• ខ. ចែក $P(x)$ នឹង $(x + 1)$ តាមវិធីចែក Horner ទទួលបានផលចែក ៖ $Q(x) = x^2 - 5x + 6 = (x - 2)(x - 3)$។\nដូចនេះ ៖ $$P(x) = (x + 1)(x - 2)(x - 3)$$"
            }
        ]
    },
    {
        "id": "g10_ch02", "num": 2, "title": "តក្កវិទ្យា សំណុំ និងចំនួន (Logic & Complex Numbers)", "category": "តក្កវិទ្យា-សំណុំ",
        "summary": "សំណើ និងតារាងសច្ចៈ។ ឈ្នាប់តក្កវិទ្យា $\\neg$ (មិន), $\\wedge$ (និង), $\\vee$ (ឬ), $\\Rightarrow$ (នាំឱ្យ), $\\Leftrightarrow$ (សមមូល)។ សំណុំ និងចំនួនកុំផ្លិចទម្រង់ពីជគណិត $z = a + bi$ ដែល $i^2 = -1$។",
        "formulas": [
            {"name": "ច្បាប់សមមូលសំខាន់", "math": "$$p \\Rightarrow q \\iff \\neg p \\vee q$$"},
            {"name": "ច្បាប់ដឺម៉ូហ្កាន (De Morgan's Laws)", "math": "$$\\neg(p \\wedge q) \\iff \\neg p \\vee \\neg q \\qquad ; \\qquad \\neg(p \\vee q) \\iff \\neg p \\wedge \\neg q$$"},
            {"name": "ចំនួនកុំផ្លិចទម្រង់ពីជគណិត", "math": "$$z = a + bi \\quad (a, b \\in \\mathbb{R},\\; i^2 = -1) \\implies |z| = \\sqrt{a^2 + b^2} \\; ; \\; \\bar{z} = a - bi$$"}
        ],
        "examples": [
            {
                "title": "គណនាម៉ូឌុល និងកុំផ្លិចឆ្លាស់",
                "question": "គេឱ្យចំនួនកុំផ្លិច $z = 3 - 4i$។ គណនាកុំផ្លិចឆ្លាស់ $\\bar{z}$, ម៉ូឌុល $|z|$ និង $z^2$។",
                "solution": "• កុំផ្លិចឆ្លាស់ ៖ $\\bar{z} = 3 + 4i$\n• ម៉ូឌុល ៖ $|z| = \\sqrt{3^2 + (-4)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$\n• $z^2 = (3 - 4i)^2 = 9 - 24i + 16i^2 = 9 - 24i - 16 = -7 - 24i$"
            }
        ]
    },
    {
        "id": "g10_ch03", "num": 3, "title": "សមីការ និងវិសមីការ (Quadratic Equations & Viète)", "category": "ពីជគណិត",
        "summary": "សមីការដឺក្រេទី២ $ax^2 + bx + c = 0$ ($a \\neq 0$)។ ឌីសគ្រីមីណង់ $\\Delta = b^2 - 4ac$។ រូបមន្តវីយ៉ែត (Viète's Formulas)។ វិសមីការដឺក្រេទី២ និងការដោះស្រាយសមីការអសនិទាន។",
        "formulas": [
            {"name": "ឌីសគ្រីមីណង់ និងឫស", "math": "$$\\Delta = b^2 - 4ac \\implies x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} \\quad (\\text{បើ } \\Delta > 0)$$"},
            {"name": "រូបមន្តវីយ៉ែត (ផលបូក និងផលគុណឫស)", "math": "$$S = x_1 + x_2 = -\\frac{b}{a} \\qquad ; \\qquad P = x_1 \\cdot x_2 = \\frac{c}{a}$$"},
            {"name": "សញ្ញានៃត្រីធាដឺក្រេទី២ $f(x) = ax^2 + bx + c$", "math": "• ក្រៅចន្លោះឫស ៖ យកសញ្ញាដូច $a$\n• ក្នុងចន្លោះឫស ៖ យកសញ្ញាផ្ទុយ $a$"}
        ],
        "examples": [
            {
                "title": "ដោះស្រាយសមីការ និងប្រើវីយ៉ែត",
                "question": "ដោះស្រាយសមីការ $x^2 - 7x + 12 = 0$ រួចផ្ទៀងផ្ទាត់រូបមន្តវីយ៉ែត។",
                "solution": "• $\\Delta = (-7)^2 - 4(1)(12) = 49 - 48 = 1 > 0$\n• ឫសទាំងពីរ ៖ $x_1 = \\dfrac{7 + 1}{2} = 4 \\; ; \\; x_2 = \\dfrac{7 - 1}{2} = 3$\n• ផ្ទៀងផ្ទាត់វីយ៉ែត ៖ $S = 4 + 3 = 7 = -(-7)/1$ និង $P = 4 \\times 3 = 12 = 12/1$ (ពិត)"
            }
        ]
    },
    {
        "id": "g10_ch04", "num": 4, "title": "ធរណីមាត្រក្នុងប្លង់ (Lines & Circles)", "category": "ធរណីមាត្រវិភាគ",
        "summary": "កូអរដោនេចំណុចក្នុងប្លង់ $Oxy$។ សមីការបន្ទាត់ $ax + by + c = 0$។ ចម្ងាយពីចំណុចទៅបន្ទាត់។ សមីការរង្វង់ទម្រង់កាណូនិច $(x - a)^2 + (y - b)^2 = R^2$។",
        "formulas": [
            {"name": "សមីការបន្ទាត់កាត់ចំណុច $A(x_0, y_0)$ មេគុណប្រាប់ទិស $m$", "math": "$$y - y_0 = m(x - x_0)$$"},
            {"name": "ចម្ងាយពីចំណុច $M(x_0, y_0)$ ទៅបន្ទាត់ $(d): ax + by + c = 0$", "math": "$$d(M, d) = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}$$"},
            {"name": "សមីការរង្វង់ផ្ចិត $I(a, b)$ កាំ $R$", "math": "$$(x - a)^2 + (y - b)^2 = R^2$$"}
        ],
        "examples": [
            {
                "title": "រកសមីការរង្វង់",
                "question": "រកសមីការរង្វង់ $(C)$ ដែលមានផ្ចិត $I(2, -3)$ និងកាត់តាមចំណុច $A(5, 1)$។",
                "solution": "• កាំរង្វង់ $R = IA = \\sqrt{(5 - 2)^2 + (1 - (-3))^2} = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$\n• សមីការរង្វង់ ៖ $(x - 2)^2 + (y + 3)^2 = 5^2 = 25$\n• ឬទម្រង់ទូទៅ ៖ $x^2 + y^2 - 4x + 6y - 12 = 0$"
            }
        ]
    },
    {
        "id": "g10_ch05", "num": 5, "title": "ផលធៀបត្រីកោណមាត្រ (Trigonometry)", "category": "ត្រីកោណមាត្រ",
        "summary": "ផលធៀបត្រីកោណមាត្រ $\\sin, \\cos, \\tan, \\cot$។ រូបមន្តគ្រឹះត្រីកោណមាត្រ។ ទ្រឹស្តីបទស៊ីនុស និងទ្រឹស្តីបទកូស៊ីនុស (Al-Kashi)។ រូបមន្តផ្ទៃក្រឡាត្រីកោណ។",
        "formulas": [
            {"name": "រូបមន្តគ្រឹះត្រីកោណមាត្រ", "math": "$$\\sin^2\\alpha + \\cos^2\\alpha = 1 \\qquad ; \\qquad \\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} \\qquad ; \\qquad 1 + \\tan^2\\alpha = \\frac{1}{\\cos^2\\alpha}$$"},
            {"name": "ទ្រឹស្តីបទកូស៊ីនុស (Law of Cosines)", "math": "$$a^2 = b^2 + c^2 - 2bc \\cos A \\qquad ; \\qquad b^2 = a^2 + c^2 - 2ac \\cos B$$"},
            {"name": "ទ្រឹស្តីបទស៊ីនុស (Law of Sines)", "math": "$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$"},
            {"name": "ផ្ទៃក្រឡាត្រីកោណ", "math": "$$S = \\frac{1}{2} bc \\sin A = \\frac{abc}{4R} = pr = \\sqrt{p(p-a)(p-b)(p-c)}$$"}
        ],
        "examples": [
            {
                "title": "គណនាជ្រុងតាមទ្រឹស្តីបទកូស៊ីនុស",
                "question": "ក្នុងត្រីកោណ $ABC$ មួយមាន $b = 5\\text{ cm}$, $c = 8\\text{ cm}$ និង $\\angle A = 60^\\circ$។ គណនាប្រវែងជ្រុង $a$។",
                "solution": "• តាមទ្រឹស្តីបទកូស៊ីនុស ៖ $a^2 = b^2 + c^2 - 2bc \\cos A$\n• $a^2 = 5^2 + 8^2 - 2(5)(8) \\cos 60^\\circ = 25 + 64 - 80 \\times \\frac{1}{2} = 89 - 40 = 49$\n• $a = \\sqrt{49} = 7\\text{ cm}$"
            }
        ]
    },
    {
        "id": "g10_ch08", "num": 8, "title": "វ៉ិចទ័រក្នុងប្លង់ (Vectors & Dot Product)", "category": "ធរណីមាត្រ-វ៉ិចទ័រ",
        "summary": "វ៉ិចទ័រ $\\vec{u}(x, y)$។ វិធានឆាស $\\vec{AB} + \\vec{BC} = \\vec{AC}$។ ផលគុណស្កាលែ $\\vec{u} \\cdot \\vec{v} = xx' + yy' = |\\vec{u}||\\vec{v}| \\cos\\theta$។ លក្ខខណ្ឌកែងគ្នានៃពីរវ៉ិចទ័រ។",
        "formulas": [
            {"name": "ផលគុណស្កាលែនៃពីរវ៉ិចទ័រ", "math": "$$\\vec{u} \\cdot \\vec{v} = x x' + y y' = |\\vec{u}||\\vec{v}| \\cos\\theta$$"},
            {"name": "លក្ខខណ្ឌកែងគ្នានៃពីរវ៉ិចទ័រ", "math": "$$\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0 \\iff x x' + y y' = 0$$"},
            {"name": "ប្រវែង (ម៉ូឌុល) នៃវ៉ិចទ័រ", "math": "$$|\\vec{u}| = \\sqrt{x^2 + y^2}$$"}
        ],
        "examples": [
            {
                "title": "រកលក្ខខណ្ឌកែងគ្នានៃវ៉ិចទ័រ",
                "question": "គេឱ្យ $\\vec{u} = (2, m)$ និង $\\vec{v} = (6, -4)$។ រកតម្លៃ $m$ ដើម្បីឱ្យ $\\vec{u} \\perp \\vec{v}$។",
                "solution": "$$\\vec{u} \\perp \\vec{v} \\iff \\vec{u} \\cdot \\vec{v} = 0 \\iff 2(6) + m(-4) = 0 \\iff 12 - 4m = 0 \\iff 4m = 12 \\iff m = 3$$"
            }
        ]
    }
]

# Update data dict
# Merge existing lessons with enhanced ones
def merge_lessons(existing, enhanced):
    out = []
    enhanced_map = {e["id"]: e for e in enhanced}
    for l in existing:
        if l["id"] in enhanced_map:
            out.append(enhanced_map[l["id"]])
        else:
            # Upgrade formulas format to array if it is string
            if isinstance(l.get("formulas"), str):
                lines = l["formulas"].split("\n")
                forms = []
                for line in lines:
                    if line.strip():
                        forms.append({"name": "រូបមន្ត", "math": line.strip()})
                l["formulas"] = forms
            if isinstance(l.get("examples"), str):
                l["examples"] = [{"title": "ឧទាហរណ៍", "question": l["title"], "solution": l["examples"]}]
            out.append(l)
    return out

data["lessons"]["7"] = merge_lessons(data["lessons"]["7"], g7_enhanced)
data["lessons"]["8"] = merge_lessons(data["lessons"]["8"], g8_enhanced)
data["lessons"]["10"] = merge_lessons(data["lessons"]["10"], g10_enhanced)

# Write back to math_data.js
js_code = "/* KPCambodianmathematics Comprehensive Data Store */\n"
js_code += "window.MATH_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"

with open("math_data.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("Enriched math_data.js with beautiful LaTeX formulas.")
