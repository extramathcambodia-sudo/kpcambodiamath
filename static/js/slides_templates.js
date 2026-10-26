/* Ready-made decks for the slide maker (studio.html › ស្លាយបង្រៀន › បញ្ចូល › គំរូមេរៀន).
   Each entry builds a deck with KPSlides.api. Text markup: $…$ maths, **bold**, __underline__,
   !!red!!, ==orange==; elements with anim:true appear one click at a time in the slide show. */
(function () {
  var R = String.raw;

  function sequences(A) {
    var T = A.T, shape = A.shape, page = A.slide, S = A.school;
    var info = { school: 'KP', school2: 'Cambodian Mathematics', teacher: 'បង្រៀនដោយ លោកគ្រូ ...' };
    // one line of text; step() is the same but appears on click
    var line = function (x, y, w, text, o) {
      var e = T(x, y, w, 64, text, { size: 32, valign: 'middle' });
      for (var k in o) e[k] = o[k];
      return e;
    };
    var step = function (x, y, w, text, o) { var e = line(x, y, w, text, o); e.anim = true; return e; };
    var solTitle = function (x, y) { return T(x || 440, y || 112, 400, 64, '!!__ដំណោះស្រាយ__!!', { size: 34, align: 'center' }); };

    var slides = [
      /* 1 */ S.cover('គណិតវិទ្យា ថ្នាក់ទី១១', '==ជំពូកទី១==      មេរៀនទី១', 'ស្វ៊ីតចំនួនពិត', info),
      /* 2 */ S.toc(['==១.សញ្ញាណស្វ៊ីត==', R`២.តួទី $n$ នៃស្វ៊ីត`]),
      /* 3 */ S.objective(['បង្ហាញសញ្ញាណស្វ៊ីតចំនួនពិត ស្វ៊ីតរាប់អស់ និងស្វ៊ីតអនន្តតួ', R`សរសេរតួនៃស្វ៊ីត និងកំណត់តួទី $n$ នៃស្វ៊ីត`]),

      /* 4 warm-up */ page([
        line(40, 115, 1200, R`!!__លំហាត់ ៖__!!  គេមានអនុគមន៍ $f(x) = 2x - 1$  ចូររកតម្លៃនៃ  $f(1),\ f(2),\ f(3),\ f(4)$`, { size: 30 }),
        line(110, 185, 1000, R`!!__ដំណោះស្រាយ__!!      គេមានអនុគមន៍  $f(x) = 2x - 1$`),
        step(100, 260, 700, R`$\Rightarrow f(1) = 2(1) - 1 = 1$`, { size: 36 }),
        step(140, 335, 700, R`$f(2) = 2(2) - 1 = 3$`, { size: 36 }),
        step(140, 410, 700, R`$f(3) = 2(3) - 1 = 5$`, { size: 36 }),
        step(140, 485, 700, R`$f(4) = 2(4) - 1 = 7$`, { size: 36 })
      ].concat(S.conclude(565, R`$f(1) = 1,\ \ f(2) = 3,\ \ f(3) = 5,\ \ f(4) = 7$`))),

      /* 5 motivation */ page([
        line(40, 130, 800, R`បើគេតម្រៀបចំនួន តាមលំដាប់ ចំពោះ`),
        line(520, 190, 600, R`$x = 1,\ 2,\ 3,\ 4,\ \ldots$`, { size: 40 }),
        line(390, 265, 700, R`គេបាន ៖    $1,\ 3,\ 5,\ 7,\ \ldots$`, { size: 36 }),
        step(200, 370, 900, '!!តើចំនួនដែលរៀបតាមលំដាប់បែបនេះ គេហៅថាអ្វី?!!', { size: 36, align: 'center' }),
        step(560, 460, 600, '!!- ហៅថា ស្វ៊ីតចំនួនពិត ។!!', { size: 38 })
      ]),

      /* 6 section 1 + example 1 */ page([
        T(40, 108, 900, 70, 'មេរៀនទី ១ ៖   ស្វ៊ីតចំនួនពិត', { size: 44, font: 'display', color: 'title' }),
        T(40, 175, 700, 70, '១. សញ្ញាណស្វ៊ីត', { size: 44, font: 'display', color: 'accent' }),
        line(80, 250, 1180, R`!!__ឧទាហរណ៍ ១ ៖__!!  - គេមានអនុគមន៍  $f : \mathbb{N} \to \mathbb{R},\ \ n \mapsto f(n) = 2n + 1$`, { size: 30 }),
        step(60, 320, 700, R`បើ $n = 1$ នោះ $f(1) = 2 \times 1 + 1 = 3$   តួទី១`, { size: 28 }),
        step(60, 385, 700, R`បើ $n = 2$ នោះ $f(2) = 2 \times 2 + 1 = 5$   តួទី២`, { size: 28 }),
        step(60, 450, 700, R`បើ $n = 3$ នោះ $f(3) = 2 \times 3 + 1 = 7$   តួទី៣`, { size: 28 }),
        step(60, 515, 700, R`បើ $n = 4$ នោះ $f(4) = 2 \times 4 + 1 = 9$   តួទី៤`, { size: 28 }),
        step(60, 580, 600, '..........................................', { size: 28 }),
        step(770, 320, 500, R`គេបាន ចំនួនរៀបតាមលំដាប់គឺ $3,\ 5,\ 7,\ 9,\ \ldots$`, { size: 26 }),
        step(770, 385, 500, 'បង្កើតបានជា !!ស្វ៊ីតនៃចំនួនពិត!!។', { size: 28 }),
        T(820, 440, 160, 40, R`$n \in \mathbb{N}$`, { size: 24, align: 'center' }),
        T(1050, 440, 200, 40, R`$f(n) = 2n + 1$`, { size: 24, align: 'center' }),
        shape('ellipse', 840, 480, 120, 170, { fill: '#e7f0fb', stroke: 'title', sw: 3 }),
        shape('ellipse', 1090, 480, 120, 170, { fill: '#fff3e6', stroke: 'brand', sw: 3 }),
        T(840, 488, 120, 160, '1\n2\n3\n4', { size: 30, bold: true, color: 'title', align: 'center', valign: 'middle' }),
        T(1090, 488, 120, 160, '3\n5\n7\n9', { size: 30, bold: true, color: 'accent', align: 'center', valign: 'middle' }),
        shape('arrow', 920, 507, 190, 16, { stroke: 'accent', sw: 3 }),
        shape('arrow', 920, 543, 190, 16, { stroke: 'accent', sw: 3 }),
        shape('arrow', 920, 579, 190, 16, { stroke: 'accent', sw: 3 }),
        shape('arrow', 920, 615, 190, 16, { stroke: 'accent', sw: 3 })
      ]),

      /* 7 definition */ page([
        S.box(40, 118, 1100, 96, R`!!ជាទូទៅ ៖!!  ស្វ៊ីតចំនួនពិតគឺជាអនុគមន៍!!លេខ!!ដែលកំណត់ពី $\mathbb{N}$ ទៅ $\mathbb{R}$ ។`, { size: 34 }),
        T(50, 225, 1180, 420, R`គេកំណត់សរសេរឈ្មោះ !!ស្វ៊ីតចំនួនពិត!! តាងដោយ  $(a_n),\ (b_n),\ (c_n),\ \ldots$
    ហើយ  $a_1,\ a_2,\ a_3,\ \ldots,\ a_n$  តាងឱ្យតួនៃស្វ៊ីតនីមួយៗ
          $a_1$ ជា តួទី ១ ,  $a_2$ ជា តួទី ២ , ..... ,  $a_n$ ជា តួទី $n$
          ដែល  $n \in \mathbb{N}^*,\ \ \mathbb{N}^* = \{1, 2, 3, \ldots\}$
ករណីដែលគេឱ្យចំនួនគត់  $n = 0,\ 1,\ 2,\ 3,\ \ldots$
នោះ ស្វ៊ីត $(a_n)$ ផ្តើមពីតួ  $a_0,\ a_1,\ a_2,\ \ldots,\ a_n$ ។`, { size: 34 })
      ]),

      /* 8 example 2: finite / infinite */ page([
        line(40, 115, 500, '!!__ឧទាហរណ៍ ២ ៖__!!', { size: 34 }),
        line(40, 180, 1000, R`- បើគេមានស្វ៊ីតនៃចំនួនពិត   $1,\ 3,\ 5,\ 7,\ 9,\ 11,\ 13,\ 15$`, { size: 32 }),
        T(380, 240, 900, 90, R`និង  $1,\ \dfrac{1}{2},\ \dfrac{1}{3},\ \ldots,\ \dfrac{1}{20}$   នោះ ស្វ៊ីតនេះជា !!ស្វ៊ីតរាប់អស់!! ។`, { size: 32, valign: 'middle' }),
        S.box(30, 335, 700, 76, '☞  !!ស្វ៊ីតរាប់អស់!! គឺជាស្វ៊ីតដែលគេរាប់ចំនួនតួបាន ។', { size: 28, anim: true }),
        line(40, 425, 800, R`- បើគេមានស្វ៊ីតនៃចំនួនពិត  $1,\ 2,\ 3,\ 4,\ \ldots$`, { size: 32 }),
        line(110, 495, 900, 'នោះ ស្វ៊ីតនេះជា !!ស្វ៊ីតរាប់មិនអស់ (ស្វ៊ីតអនន្តតួ)!! ។', { size: 32 }),
        S.box(100, 565, 1070, 80, '☞  !!ស្វ៊ីតអនន្តតួ!! គឺជាស្វ៊ីតដែលគេមិនអាចរាប់ចំនួនតួបាន ។', { size: 30, anim: true }),
        shape('line', 860, 420, 380, 30, { stroke: 'title', sw: 3 }),
        T(860, 445, 400, 40, '1     3     5     7     9    11   13   15', { size: 18, color: 'title' })
      ]),

      /* 9 practice 1 */ page([
        line(180, 150, 1000, '!!__លំហាត់គំរូ ១ ៖__!!    ចូរបំពេញតួនៃស្វ៊ីតខាងក្រោមនេះ ឱ្យបានបីតួទៀត', { size: 34 }),
        line(320, 260, 330, R`!!ក.!!  $1,\ 5,\ 9,$`, { size: 40 }),
        step(650, 260, 400, R`$13,\ 17,\ 21$`, { size: 40, color: 'title' }),
        line(320, 380, 330, R`!!ខ.!!  $1,\ 8,\ 27,$`, { size: 40 }),
        step(650, 380, 400, R`$64,\ 125,\ 216$`, { size: 40, color: 'title' }),
        line(320, 500, 500, R`!!គ.!!  $1,\ 5,\ 14,\ 30,\ 55,$`, { size: 40 }),
        step(820, 500, 400, R`$91,\ 140,\ 204$`, { size: 40, color: 'title' })
      ]),

      /* 10 practice 2 */ page([
        line(360, 180, 600, '!!__លំហាត់គំរូ ២ ៖__!!', { size: 36 }),
        T(360, 260, 880, 110, R`!!១.!!  សរសេរតួនៃស្វ៊ីត $(a_n)$ កំណត់ដោយ  $a_n = \dfrac{1}{n+2}$  ដែល  $1 \le n \le 4$ ។`, { size: 32, valign: 'middle' }),
        T(360, 410, 880, 110, R`!!២.!!  សរសេរតួនៃស្វ៊ីតតាមលំដាប់តគ្នា  $a_n = 2 + \dfrac{1}{2^n}$  ដែល  $n \in \mathbb{N}$ ។`, { size: 32, valign: 'middle' })
      ]),

      /* 11 solution 1 */ page([
        line(80, 110, 400, '!!__ដំណោះស្រាយ__!!', { size: 34 }),
        T(80, 170, 1100, 80, R`!!១.!!  សរសេរតួនៃស្វ៊ីត $(a_n)$ កំណត់ដោយ  $a_n = \dfrac{1}{n+2}$  ដែល  $1 \le n \le 4$`, { size: 28, valign: 'middle' }),
        step(100, 255, 660, R`ចំពោះ $n = 1$ នោះ  $a_1 = \dfrac{1}{1+2} = \dfrac{1}{3}$`, { size: 28, h: 80 }),
        step(100, 335, 660, R`ចំពោះ $n = 2$ នោះ  $a_2 = \dfrac{1}{2+2} = \dfrac{1}{4}$`, { size: 28, h: 80 }),
        step(100, 415, 660, R`ចំពោះ $n = 3$ នោះ  $a_3 = \dfrac{1}{3+2} = \dfrac{1}{5}$`, { size: 28, h: 80 }),
        step(100, 495, 660, R`ចំពោះ $n = 4$ នោះ  $a_4 = \dfrac{1}{4+2} = \dfrac{1}{6}$`, { size: 28, h: 80 }),
        step(100, 575, 700, R`គេបាន តួនៃស្វ៊ីត  $(a_n)_{1 \le n \le 4} :\ \dfrac{1}{3},\ \dfrac{1}{4},\ \dfrac{1}{5},\ \dfrac{1}{6}$`, { size: 28, h: 76 }),
        step(800, 260, 200, '!!ដូចនេះ!!', { size: 32 }),
        S.box(820, 330, 420, 110, R`ស្វ៊ីត $(a_n)_{1 \le n \le 4} :\ \dfrac{1}{3},\ \dfrac{1}{4},\ \dfrac{1}{5},\ \dfrac{1}{6}$`, { size: 28, anim: true, align: 'center' })
      ]),

      /* 12 solution 2 */ page([
        T(80, 110, 1100, 80, R`!!២.!!  សរសេរតួនៃស្វ៊ីតតាមលំដាប់តគ្នា  $a_n = 2 + \dfrac{1}{2^n}$  ដែល  $n \in \mathbb{N}$`, { size: 30, valign: 'middle' }),
        step(180, 200, 760, R`ចំពោះ $n = 1$ នោះ  $a_1 = 2 + \dfrac{1}{2} = \dfrac{5}{2}$`, { size: 30, h: 85 }),
        step(180, 285, 760, R`ចំពោះ $n = 2$ នោះ  $a_2 = 2 + \dfrac{1}{2^2} = \dfrac{9}{4}$`, { size: 30, h: 85 }),
        step(180, 370, 760, R`ចំពោះ $n = 3$ នោះ  $a_3 = 2 + \dfrac{1}{2^3} = \dfrac{17}{8}$`, { size: 30, h: 85 }),
        step(160, 460, 820, R`គេបាន តួនៃស្វ៊ីត  $(a_n)_{n \in \mathbb{N}} :\ \dfrac{5}{2},\ \dfrac{9}{4},\ \dfrac{17}{8},\ \ldots$`, { size: 30, h: 85 })
      ].concat(S.conclude(560, R`ស្វ៊ីត  $(a_n)_{n \in \mathbb{N}} :\ \dfrac{5}{2},\ \dfrac{9}{4},\ \dfrac{17}{8},\ \ldots$`, 120))),

      /* 13 section 2 */ page([
        T(50, 108, 700, 70, R`២. តួទី $n$ នៃស្វ៊ីត`, { size: 44, font: 'display', color: 'accent' }),
        line(40, 185, 1200, R`!!__ឧទាហរណ៍ ៖__!!    កំណត់តួទី $n$ នៃស្វ៊ីត  $3,\ 5,\ 7,\ 9,\ 11,\ \ldots$   ចំពោះ  $\forall n \in \mathbb{N}^*$`, { size: 30 }),
        T(80, 270, 1100, 160, R`$$3\;\overset{+2}{\frown}\;5\;\overset{+2}{\frown}\;7\;\overset{+2}{\frown}\;9\;\overset{+2}{\frown}\;11,\ \ldots \quad\longrightarrow\quad 2n + (3 - 2) = 2n + 1$$`, { size: 34, anim: true }),
        step(160, 470, 900, R`គេបាន តួទី !!$n$!! នៃស្វ៊ីតគឺ  $a_n = 2n + 1,\ \ \forall n \in \mathbb{N}^*$`, { size: 32 })
      ]),

      /* 14 observing the pattern */ page([
        line(60, 115, 1200, R`!!__ឧទាហរណ៍ ៖__!!   កំណត់តួទី $n$ នៃស្វ៊ីត  $3,\ 5,\ 7,\ 9,\ 11,\ \ldots$   ចំពោះ  $\forall n \in \mathbb{N}^*$`, { size: 30 }),
        line(40, 200, 360, 'គេសង្កេតឃើញ ៖'),
        step(440, 200, 500, R`$a_1 = 3 = 2 \times 1 + 1$`, { size: 36 }),
        step(440, 270, 500, R`$a_2 = 5 = 2 \times 2 + 1$`, { size: 36 }),
        step(440, 340, 500, R`$a_3 = 7 = 2 \times 3 + 1$`, { size: 36 }),
        step(440, 410, 500, R`$a_4 = 9 = 2 \times 4 + 1$`, { size: 36 }),
        step(440, 470, 400, '...........................', { size: 32 }),
        step(50, 560, 650, R`តាមលំនាំគំរូ គេបាន ៖   $a_n = 2 \times n + 1$`, { size: 32 }),
        step(720, 560, 140, '!!ដូចនេះ ៖!!', { size: 32 }),
        S.box(870, 550, 380, 84, R`$a_n = 2n + 1,\ \forall n \in \mathbb{N}^*$`, { size: 32, anim: true, align: 'center' })
      ]),

      /* 15 method + exercise */ page([
        T(110, 120, 1080, 150, R`ដើម្បីសរសេររូបមន្តតួទី !!$n$!! នៃស្វ៊ីត គេពិនិត្យមើលតួនីមួយៗនៃស្វ៊ីត រួចរកមើលលំនាំគំរូរបស់វា ។ តួនីមួយៗនៃស្វ៊ីតជាអនុគមន៍នៃចំនួនតួ ។`, { size: 34, valign: 'middle' }),
        line(40, 320, 1200, R`!!__លំហាត់ ៖__!!     កំណត់តួទី !!$n$!! ចំពោះ $\forall n \in \mathbb{N}^*$  នៃស្វ៊ីតខាងក្រោម ៖`, { size: 32 }),
        T(270, 420, 520, 140, R`ក.  $\dfrac{2}{3},\ \dfrac{3}{4},\ \dfrac{4}{5},\ \dfrac{5}{6},\ \ldots$`, { size: 38, valign: 'middle' }),
        T(840, 420, 420, 140, R`ខ.  $-1,\ 2,\ 7,\ 14,\ 23,\ \ldots$`, { size: 34, valign: 'middle' })
      ]),

      /* 16 solution a */ page([
        line(40, 115, 600, R`!!ក.!!  $\dfrac{2}{3},\ \dfrac{3}{4},\ \dfrac{4}{5},\ \dfrac{5}{6},\ \ldots$`, { size: 34, h: 90 }),
        step(40, 215, 640, R`ភាគយក ៖  $2,\ 3,\ 4,\ 5,\ \ldots \to n + 1$`, { size: 30 }),
        step(40, 285, 640, R`ភាគបែង ៖  $3,\ 4,\ 5,\ 6,\ \ldots \to n + 2$`, { size: 30 }),
        line(40, 370, 300, 'គេសង្កេតឃើញ ៖'),
        step(330, 360, 340, R`$a_1 = \dfrac{2}{3} = \dfrac{1+1}{1+2}$`, { size: 28, h: 80 }),
        step(330, 440, 340, R`$a_2 = \dfrac{3}{4} = \dfrac{2+1}{2+2}$`, { size: 28, h: 80 }),
        step(690, 360, 340, R`$a_3 = \dfrac{4}{5} = \dfrac{3+1}{3+2}$`, { size: 28, h: 80 }),
        step(690, 440, 340, R`$a_4 = \dfrac{5}{6} = \dfrac{4+1}{4+2}$`, { size: 28, h: 80 })
      ].concat(S.conclude(555, R`$a_n = \dfrac{n+1}{n+2},\ \ \forall n \in \mathbb{N}^*$`))),

      /* 17 solution b */ page([
        line(40, 115, 700, R`!!ខ.!!  $-1,\ 2,\ 7,\ 14,\ 23,\ \ldots$`, { size: 34 }),
        step(40, 190, 700, R`ផលដកជាប់គ្នា ៖  $3,\ 5,\ 7,\ 9$  (ពាក់កណ្តាល)`, { size: 28 }),
        step(40, 255, 700, R`ផលដកលើកទី២ ៖  $2,\ 2,\ 2 \ \to\ 1n^2$`, { size: 28 }),
        step(40, 320, 700, R`$n^2 :\ 1,\ 4,\ 9,\ 16,\ 25,\ \ldots$`, { size: 30 }),
        step(40, 385, 700, R`$a_n - n^2 :\ -2,\ -2,\ -2,\ -2,\ \ldots \ \to\ -2$`, { size: 30 }),
        step(720, 190, 520, R`គេសង្កេតឃើញ ៖  $a_1 = -1 = 1^2 - 2$`, { size: 28 }),
        step(890, 255, 360, R`$a_2 = 2 = 2^2 - 2$`, { size: 28 }),
        step(890, 320, 360, R`$a_3 = 7 = 3^2 - 2$`, { size: 28 }),
        step(40, 470, 900, R`តាមលំនាំគំរូ គេបាន ៖  $a_n = n^2 - 2$`, { size: 30 })
      ].concat(S.conclude(560, R`$a_n = n^2 - 2,\ \ \forall n \in \mathbb{N}^*$`))),

      /* 18-20 quizzes */
      S.quiz(R`!!១.!! កំណត់តួទី $n$ ចំពោះ $\forall n \in \mathbb{N}^*$ នៃស្វ៊ីតខាងក្រោម ៖
$2,\ 4,\ 6,\ 8,\ 10,\ \ldots$`, [R`$a_n = 2n$`, R`$a_n = 4n - 2$`, R`$a_n = 3n - 1$`, R`$a_n = n + 1$`], 0),
      S.quiz(R`!!២.!! កំណត់តួទី $n$ ចំពោះ $\forall n \in \mathbb{N}^*$ នៃស្វ៊ីតខាងក្រោម ៖
$1,\ 5,\ 9,\ 13,\ 17,\ \ldots$`, [R`$a_n = 2n + 1$`, R`$a_n = 4n - 3$`, R`$a_n = 3n - 1$`, R`$a_n = n + 1$`], 1),
      S.quiz(R`!!៣.!! កំណត់តួទី $n$ ចំពោះ $\forall n \in \mathbb{N}^*$ នៃស្វ៊ីតខាងក្រោម ៖
$1,\ 4,\ 9,\ 16,\ 25,\ \ldots$`, [R`$a_n = 2n$`, R`$a_n = 2n^2$`, R`$a_n = n^2$`, R`$a_n = n^3$`], 2),

      /* 21 homework 1 */ S.homework(R`កំណត់តួទី !!$n$!! ចំពោះ $\forall n \in \mathbb{N}^*$ នៃស្វ៊ីតខាងក្រោម ៖
ក.   $5,\ 7,\ 9,\ 11,\ 13,\ \ldots$
ខ.   $-3,\ -1,\ 1,\ 3,\ 5,\ \ldots$`),

      /* ===== part 2 ===== */
      /* 22 */ S.toc(['==៣.អថេរភាពនៃស្វ៊ីត==', '៣.១.ស្វ៊ីតកើន-ស្វ៊ីតចុះ', '៣.២.ស្វ៊ីតម៉ូណូតូន']),
      /* 23 */ S.objective(['បង្ហាញថាស្វ៊ីតមួយ ជាស្វ៊ីតកើន ឬ ស្វ៊ីតចុះ', 'បង្ហាញថាស្វ៊ីតមួយជាស្វ៊ីតម៉ូណូតូន']),

      /* 24 homework answers */ page([
        T(440, 110, 400, 60, '!!__ដំណោះស្រាយកិច្ចការផ្ទះ__!!', { size: 32, align: 'center' }),
        line(40, 180, 600, R`!!ក.!!  $5,\ 7,\ 9,\ 11,\ 13,\ \ldots$`),
        step(40, 250, 600, R`ផលដកថេរ $2 \to 2n$ ;  $5 - 2 = 3$`, { size: 28 }),
        step(60, 315, 560, R`$a_1 = 5 = 2 \times 1 + 3$`, { size: 30 }),
        step(60, 375, 560, R`$a_2 = 7 = 2 \times 2 + 3$`, { size: 30 }),
        S.box(60, 455, 520, 84, R`$a_n = 2n + 3,\ \forall n \in \mathbb{N}^*$`, { anim: true, align: 'center', size: 32 }),
        line(660, 180, 600, R`!!ខ.!!  $-3,\ -1,\ 1,\ 3,\ 5,\ \ldots$`),
        step(660, 250, 600, R`ផលដកថេរ $2 \to 2n$ ;  $-3 - 2 = -5$`, { size: 28 }),
        step(680, 315, 560, R`$a_1 = -3 = 2 \times (1) - 5$`, { size: 30 }),
        step(680, 375, 560, R`$a_2 = -1 = 2 \times (2) - 5$`, { size: 30 }),
        S.box(680, 455, 520, 84, R`$a_n = 2n - 5,\ \forall n \in \mathbb{N}^*$`, { anim: true, align: 'center', size: 32 })
      ]),

      /* 25 increasing / decreasing */ page([
        T(40, 108, 560, 70, '៣. អថេរភាពនៃស្វ៊ីត', { size: 44, font: 'display', color: 'accent' }),
        T(660, 112, 560, 64, '!!__៣.១ ស្វ៊ីតកើន - ស្វ៊ីតចុះ__!!', { size: 38 }),
        S.box(440, 190, 800, 230, R`!!__និយមន័យ ៖__!!
❶ ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស្វ៊ីតកើន!! លុះត្រាតែ $a_{n+1} > a_n$ ឬ $a_{n+1} - a_n > 0$
❷ ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស្វ៊ីតចុះ!! លុះត្រាតែ $a_{n+1} < a_n$ ឬ $a_{n+1} - a_n < 0$`, { size: 29, valign: 'top' }),
        shape('rect', 60, 200, 160, 210, { fill: '#ffffff', stroke: '#dee2e6', sw: 2 }),
        shape('line', 85, 270, 120, 30, { stroke: 'title', sw: 4, rot: -45 }),
        T(60, 365, 160, 40, 'ស្វ៊ីតកើន', { size: 20, color: 'title', bold: true, align: 'center' }),
        shape('rect', 240, 200, 160, 210, { fill: '#ffffff', stroke: '#dee2e6', sw: 2 }),
        shape('line', 265, 270, 120, 30, { stroke: 'accent', sw: 4, rot: 45 }),
        T(240, 365, 160, 40, '!!ស្វ៊ីតចុះ!!', { size: 20, bold: true, align: 'center' }),
        line(40, 440, 500, '!!__លំហាត់គំរូ ១ ៖__!!', { size: 32 }),
        line(110, 510, 1000, R`!!ក.!! បង្ហាញថា ស្វ៊ីត $(a_n)$ ដែល  $a_n = 3n + 1$  ជា ស្វ៊ីតកើន ។`, { size: 30 }),
        line(110, 580, 1000, R`!!ខ.!! បង្ហាញថា ស្វ៊ីត $(a_n)$ ដែល  $a_n = 12 - 2n$  ជា ស្វ៊ីតចុះ ។`, { size: 30 })
      ]),

      /* 26 solution a */ page([
        solTitle(),
        line(40, 180, 1000, R`!!ក.!! បង្ហាញថា ស្វ៊ីត $(a_n)$ ដែល  $a_n = 3n + 1$  ជា ស្វ៊ីតកើន`, { size: 30 }),
        line(40, 255, 800, R`គេមាន  $a_n = 3n + 1$`, { size: 32 }),
        step(40, 320, 800, R`$\Rightarrow a_{n+1} = 3(n+1) + 1 = 3n + 4$`, { size: 32 }),
        step(40, 390, 900, R`គេបាន   $a_{n+1} - a_n = (3n + 4) - (3n + 1) = 3 > 0$`, { size: 32 }),
        step(40, 460, 800, R`នោះ   $a_{n+1} > a_n,\ \forall n \in \mathbb{N}$`, { size: 32 })
      ].concat(S.conclude(560, R`ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស្វ៊ីតកើន`))),

      /* 27 solution b */ page([
        line(40, 120, 1000, R`!!ខ.!! បង្ហាញថា ស្វ៊ីត $(a_n)$ ដែល  $a_n = 12 - 2n$  ជា ស្វ៊ីតចុះ`, { size: 30 }),
        line(60, 200, 800, R`គេមាន  $a_n = 12 - 2n$`, { size: 32 }),
        step(130, 270, 900, R`$\Rightarrow a_{n+1} = 12 - 2(n+1) = -2n + 10$`, { size: 32 }),
        step(40, 345, 1000, R`គេបាន   $a_{n+1} - a_n = (-2n + 10) - (12 - 2n) = -2 < 0$`, { size: 32 }),
        step(40, 420, 800, R`នោះ   $a_{n+1} < a_n,\ \forall n \in \mathbb{N}$`, { size: 32 })
      ].concat(S.conclude(560, R`ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស្វ៊ីតចុះ`))),

      /* 28 ratio test */ page([
        line(40, 120, 800, R`❖ ចំពោះ  $a_n > 0,\ \ \forall n \in \mathbb{N}$`, { size: 34 }),
        S.box(300, 210, 940, 260, R`❸ ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស្វ៊ីតកើន!! លុះត្រាតែ  $a_{n+1} > a_n$  ឬ  $\dfrac{a_{n+1}}{a_n} > 1$

❹ ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស្វ៊ីតចុះ!! លុះត្រាតែ  $a_{n+1} < a_n$  ឬ  $\dfrac{a_{n+1}}{a_n} < 1$`, { size: 36 })
      ]),

      /* 29 practice 2 */ page([
        line(160, 130, 600, '!!__លំហាត់គំរូ ២ ៖__!!', { size: 36 }),
        line(160, 220, 1000, 'តើស្វ៊ីតខាងក្រោម មួយណាជាស្វ៊ីតកើន មួយណាជាស្វ៊ីតចុះ ។', { size: 36 }),
        line(160, 330, 900, R`!!ក.!! ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = 2^{n-1}$`, { size: 36 }),
        T(160, 440, 900, 120, R`!!ខ.!! ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = \left(\dfrac{2}{3}\right)^{n+1}$`, { size: 36, valign: 'middle' })
      ]),

      /* 30 solution a */ page([
        solTitle(),
        line(40, 180, 900, R`!!ក.!! ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = 2^{n-1}$`, { size: 32 }),
        step(40, 255, 1000, R`គេមាន  $a_n = 2^{n-1} \ \Rightarrow\ a_{n+1} = 2^{(n+1)-1} = 2^n$`, { size: 32 }),
        step(40, 335, 1000, R`គេបាន  $\dfrac{a_{n+1}}{a_n} = \dfrac{2^n}{2^{n-1}} = \dfrac{2^n}{2^n \cdot 2^{-1}} = 2 > 1$`, { size: 32, h: 100 }),
        step(40, 450, 800, R`នោះ  $a_{n+1} > a_n,\ \forall n \in \mathbb{N}$`, { size: 32 })
      ].concat(S.conclude(560, R`ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស្វ៊ីតកើន`))),

      /* 31 solution b */ page([
        T(40, 112, 900, 100, R`!!ខ.!! ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = \left(\dfrac{2}{3}\right)^{n+1}$`, { size: 30, valign: 'middle' }),
        step(40, 215, 1100, R`គេមាន  $a_n = \left(\dfrac{2}{3}\right)^{n+1} \Rightarrow a_{n+1} = \left(\dfrac{2}{3}\right)^{(n+1)+1} = \left(\dfrac{2}{3}\right)^{n+2}$`, { size: 30, h: 100 }),
        step(40, 325, 1100, R`គេបាន  $\dfrac{a_{n+1}}{a_n} = \dfrac{\left(\frac{2}{3}\right)^{n+2}}{\left(\frac{2}{3}\right)^{n+1}} = \dfrac{\left(\frac{2}{3}\right)^{n+1} \cdot \frac{2}{3}}{\left(\frac{2}{3}\right)^{n+1}} = \dfrac{2}{3} < 1$`, { size: 30, h: 130 }),
        step(40, 470, 800, R`នោះ  $a_{n+1} < a_n,\ \forall n \in \mathbb{N}$`, { size: 30 })
      ].concat(S.conclude(565, R`ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស្វ៊ីតចុះ`))),

      /* 32 monotone */ page([
        T(40, 112, 360, 60, '!!__៣.២ ស្វ៊ីតម៉ូណូតូន__!!', { size: 32 }),
        S.box(420, 110, 820, 230, R`!!និយមន័យ ៖!!  ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា !!ស្វ៊ីតម៉ូណូតូន!! លុះត្រាតែ ៖
       $a_1 < a_2 < a_3 < a_4 < \ldots < a_n < a_{n+1} < \ldots$
ឬ    $a_1 > a_2 > a_3 > a_4 > \ldots > a_n > a_{n+1} > \ldots$`, { size: 32, valign: 'top' }),
        T(60, 380, 1100, 64, R`❖ !!__សំគាល់__!!    ស្វ៊ីតកើន ឬ ស្វ៊ីតចុះ ជា !!ស្វ៊ីតម៉ូណូតូន!! ។`, { size: 34, anim: true }),
        T(160, 480, 300, 60, 'ស្វ៊ីតកើន', { size: 28, bold: true, fill: '#e7f0fb', border: 'title', bw: 2, radius: 10, align: 'center', valign: 'middle', color: 'title', anim: true }),
        T(160, 565, 300, 60, '!!ស្វ៊ីតចុះ!!', { size: 28, bold: true, fill: '#fff0f0', bw: 2, border: 'accent', radius: 10, align: 'center', valign: 'middle', anim: true }),
        shape('arrow', 470, 520, 300, 24, { stroke: 'title', sw: 3, rot: 8, anim: true }),
        shape('arrow', 470, 570, 300, 24, { stroke: 'accent', sw: 3, rot: -8, anim: true }),
        T(790, 515, 360, 76, 'ស្វ៊ីតម៉ូណូតូន', { size: 30, bold: true, fill: 'title', color: '#ffffff', radius: 14, align: 'center', valign: 'middle', anim: true })
      ]),

      /* 33 exercise 1 */ page([
        line(40, 120, 500, '!!__លំហាត់ ១ ៖__!!', { size: 34 }),
        line(40, 200, 1000, 'តើស្វ៊ីតខាងក្រោម មួយណាជាស្វ៊ីតម៉ូណូតូន ។', { size: 36 }),
        T(40, 280, 1100, 100, R`!!ក.!!   $1,\ \dfrac{1}{2},\ \dfrac{1}{3},\ \dfrac{1}{4},\ \dfrac{1}{5},\ \ldots,\ \dfrac{1}{n},\ \ldots$`, { size: 34, valign: 'middle' }),
        T(40, 400, 500, 100, R`!!ខ.!!   $a_n = \dfrac{2^n}{n},\ \ n \ge 1$`, { size: 34, valign: 'middle' }),
        T(540, 400, 700, 100, R`!!គ.!!   $1,\ -\dfrac{1}{2},\ \dfrac{1}{3},\ -\dfrac{1}{4},\ \ldots,\ (-1)^{n+1}\dfrac{1}{n},\ \ldots$`, { size: 30, valign: 'middle' })
      ]),

      /* 34 solutions a, b */ page([
        T(240, 108, 300, 56, '!!__ដំណោះស្រាយ__!!', { size: 30, align: 'center' }),
        T(30, 165, 620, 90, R`!!ក.!!  $1,\ \dfrac{1}{2},\ \dfrac{1}{3},\ \dfrac{1}{4},\ \ldots,\ \dfrac{1}{n},\ \ldots$`, { size: 28, valign: 'middle' }),
        T(30, 265, 640, 90, R`ដោយ  $1 > \dfrac{1}{2} > \dfrac{1}{3} > \dfrac{1}{4} > \ldots > \dfrac{1}{n} > \ldots$`, { size: 28, valign: 'middle', anim: true }),
        T(30, 365, 640, 90, R`នាំឱ្យ ស្វ៊ីតនេះជា !!ស្វ៊ីតចុះ!! ដូចនេះជា !!ស្វ៊ីតម៉ូណូតូន!!`, { size: 28, valign: 'middle', anim: true }),
        T(700, 165, 540, 90, R`!!ខ.!!  $a_n = \dfrac{2^n}{n},\ n \ge 1$`, { size: 28, valign: 'middle' }),
        T(700, 255, 540, 80, R`$n = 1 \Rightarrow a_1 = \dfrac{2^1}{1} = 2$`, { size: 26, valign: 'middle', anim: true }),
        T(700, 335, 540, 80, R`$n = 2 \Rightarrow a_2 = \dfrac{2^2}{2} = 2$`, { size: 26, valign: 'middle', anim: true }),
        T(700, 415, 540, 80, R`$n = 3 \Rightarrow a_3 = \dfrac{2^3}{3} = \dfrac{8}{3}$`, { size: 26, valign: 'middle', anim: true }),
        T(700, 495, 540, 60, R`ដោយ  $a_1 = 2 = a_2 < a_3 < a_4 < \ldots$`, { size: 26, valign: 'middle', anim: true }),
        S.box(240, 570, 1000, 76, R`!!ដូចនេះ!!  ស្វ៊ីត $a_n = \dfrac{2^n}{n}$ មិនមែនជា ស្វ៊ីតម៉ូណូតូន`, { size: 30, anim: true, y: 560, h: 90 })
      ]),

      /* 35 solution c */ page([
        T(40, 120, 1000, 100, R`!!គ.!!  $1,\ -\dfrac{1}{2},\ \dfrac{1}{3},\ -\dfrac{1}{4},\ \ldots,\ (-1)^{n+1}\dfrac{1}{n},\ \ldots$`, { size: 34, valign: 'middle' }),
        T(80, 250, 1000, 100, R`ដោយ  $1 > -\dfrac{1}{2}\ ,\ \ -\dfrac{1}{2} < \dfrac{1}{3}\ ,\ \ \dfrac{1}{3} > -\dfrac{1}{4}\ ,\ \ldots$`, { size: 34, valign: 'middle', anim: true }),
        S.box(40, 400, 1180, 110, R`!!ដូចនេះ!!   $1,\ -\dfrac{1}{2},\ \dfrac{1}{3},\ -\dfrac{1}{4},\ \ldots,\ (-1)^{n+1}\dfrac{1}{n},\ \ldots$  មិនមែនជា ស្វ៊ីតម៉ូណូតូន`, { size: 30, anim: true })
      ]),

      /* 36 exercise 2 */ page([
        line(80, 220, 500, '!!__លំហាត់ ២ ៖__!!', { size: 36 }),
        line(80, 300, 1000, 'សិក្សាភាពម៉ូណូតូននៃស្វ៊ីតដែលកំណត់ដូចខាងក្រោម ៖', { size: 36 }),
        T(80, 390, 900, 110, R`!!ក.!!  ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = \dfrac{1}{n}$`, { size: 36, valign: 'middle' }),
        T(80, 510, 900, 110, R`!!ខ.!!  ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$  ដែល  $a_n = \dfrac{2n + 1}{n + 3}$`, { size: 36, valign: 'middle' })
      ]),

      /* 37 solution a */ page([
        T(40, 112, 900, 100, R`!!ក.!!  គេមាន  $a_n = \dfrac{1}{n} \ \Rightarrow\ a_{n+1} = \dfrac{1}{n+1}$`, { size: 34, valign: 'middle' }),
        T(40, 225, 1200, 110, R`គេបាន  $a_{n+1} - a_n = \dfrac{1}{n+1} - \dfrac{1}{n} = \dfrac{n - n - 1}{n(n+1)} = -\dfrac{1}{n(n+1)} < 0,\ \forall n \in \mathbb{N}$`, { size: 32, valign: 'middle', anim: true }),
        step(120, 360, 600, R`នាំឱ្យ   $a_{n+1} < a_n$`, { size: 32 }),
        step(120, 440, 900, R`គេបាន  ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$  ជា ស្វ៊ីតចុះ`, { size: 32 })
      ].concat(S.conclude(560, R`ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស្វ៊ីតម៉ូណូតូន`))),

      /* 38 solution b */ page([
        T(40, 108, 1200, 100, R`!!ខ.!!  គេមាន  $a_n = \dfrac{2n+1}{n+3} \ \Rightarrow\ a_{n+1} = \dfrac{2(n+1)+1}{(n+1)+3} = \dfrac{2n+3}{n+4}$`, { size: 30, valign: 'middle' }),
        T(40, 210, 1200, 110, R`គេបាន  $a_{n+1} - a_n = \dfrac{2n+3}{n+4} - \dfrac{2n+1}{n+3} = \dfrac{(2n+3)(n+3) - (2n+1)(n+4)}{(n+4)(n+3)}$`, { size: 30, valign: 'middle', anim: true }),
        T(40, 320, 1200, 100, R`$= \dfrac{2n^2 + 6n + 3n + 9 - 2n^2 - 8n - n - 4}{(n+4)(n+3)} = \dfrac{5}{(n+4)(n+3)} > 0,\ \forall n \in \mathbb{N}$`, { size: 30, valign: 'middle', anim: true }),
        step(40, 430, 1000, R`នាំឱ្យ  $a_{n+1} > a_n$   គេបាន ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស្វ៊ីតកើន`, { size: 30 })
      ].concat(S.conclude(555, R`ស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ជា ស្វ៊ីតម៉ូណូតូន`))),

      /* 39-41 quizzes */
      S.quiz(R`!!១.!! តើបណ្តាស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ខាងក្រោម មួយណាជាស្វ៊ីតកើន?`,
        [R`$a_n = 3n - 4$`, R`$a_n = -n - 4$`, R`$a_n = -5 - 2n$`, R`$a_n = (-1)^n \cdot 2^{n+1}$`], 0),
      S.quiz(R`!!២.!! តើបណ្តាស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ខាងក្រោម មួយណាជាស្វ៊ីតចុះ?`,
        [R`$a_n = -n + 2$`, R`$a_n = 2n - 4$`, R`$a_n = 4^n - 2$`, R`$a_n = \left(\frac{3}{2}\right)^n$`], 0),
      S.quiz(R`!!៣.!! តើបណ្តាស្វ៊ីត $(a_n)_{n \in \mathbb{N}}$ ខាងក្រោម មួយណាជាស្វ៊ីតកើន?`,
        [R`$a_n = \left(\frac{2}{3}\right)^n$`, R`$a_n = \left(\frac{1}{2}\right)^n$`, R`$a_n = \frac{n}{n+1}$`, R`$a_n = (0.12)^{n+1}$`], 2),

      /* 42 homework 2 */ S.homework(R`សិក្សាភាពម៉ូណូតូននៃស្វ៊ីតដែលកំណត់ដូចខាងក្រោម ៖
!!ក.!!  ស្វ៊ីត $(a_n)$ ដែល  $a_n = n^2 - 4n - 5$
!!ខ.!!  ស្វ៊ីត $(a_n)$ ដែល  $a_{n+1} = a_n^{\,2}$  និង  $a_0 = 2$`),

      /* 43 */ S.thanks()
    ];
    return { name: 'ថ្នាក់ទី១១ · មេរៀនទី១ ស្វ៊ីតចំនួនពិត', theme: 'school', school: info.school, school2: info.school2, teacher: info.teacher, slides: slides };
  }

  window.KPSlideTemplates = [
    { name: '📘 ថ្នាក់ទី១១ · ស្វ៊ីតចំនួនពិត (៤៣ ស្លាយ)', build: sequences }
  ];
})();
