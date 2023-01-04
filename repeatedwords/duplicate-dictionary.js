window.DuplicateWordsApp.DictionaryModule = function(lang) {
  "use strict";

  if (lang !== 'ru') {
    return null;
  }

  var dict = {};

  function parseMorphemes(line) { // преобразует части слов в упорядоченный массив
    return line.toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/^[^а-яё]+/, '')
      .replace(/[^а-яё]+$/, '')
      .split(/[^а-яё]+/)
      .sort(function(a, b) { return a.length - b.length; });
  }

  /*  СПОРНЫЕ СЛУЧАИ: 
      поле = полет <> летать (!!!)
      имеющий = одноименный <> имя (!!!)
      делить = делать = разделяемый = деловой = Нью-Дели
      идет = идея
      начинают = начинка
      понятие <> понимать
      принимать <> примут
      противоречащий = речь
      последний = последствия
      оппонент <> пропонент
      снег <> снежный
      провести <> проводить
      находить <> нашел
      тема = темный
      вместо = вместе
      подсказка = высказать (?)
      формат = форма = оформленный (?)
      уходить = расходный (?)
      распад = подпадает (?)
      состояние = противостояние (?)
  */

  // повторы, которые могут не учитываться
  dict.exceptions = 'из, за, на, не, ни, во, по, бы, до, от, для, под, над, гг'; 

  dict.immutableRoots = 'назад, никто, пока, ради, там, так, как, кто, что, раз, вне, при, ли';

  dict.unbreakableRoots = parseMorphemes( // проблемные корни, которые могут быть неверно разбиты
    'ваш, век, вер, вес, вид, вод, вред, вечер, власт, вопрос, войн, втор, '+
    'восто, возраж, восстанов, газон, '+
    'дел, дан, дат, доход, доступ, доклад, долж, '+ 
    'закон, заслон, запад, задач, '+
    'июн, июл, истор, име, иде, извест, ' +
    'крат, крыл, лин, лет, лом, '+
    'мыш, мир, '+
    'наш, начал, начин, недел, наход, налог, нато, '+
    'област, образ, остров, отраж, обреч, особ, определ, обращ, '+
    'оппон, обстанов, '+
    'пут, пора, получ, полн, прав, правл, правил, проект, прост, постав, '+
    'процесс, преступ, планет, полит, послед, продолж, предел, повестк, '+
    'провер, предлож, пространств, приним, призна, пол, полн, прос, '+
    'пропон, '+
    'рад, развит, разработ, '+
    'сид, свиде, след, слов, случ, стран, сил, систем, средств, стол, столиц, сведен, '+ 
    'сторон, связ, ситуац, союз, совет, стат, суверен, содерж, соверш, свет, слон, '+
    'состоя, сказ, состав, стро, стрем, '+
    'тиш, тест, точк, толк, '+
    'удел, устав, услов, участ, уваж, уступ, улиц, указ, формул, '+
    'цен, цел, '+
    'ясн'
  ); 

  dict.prefixes = parseMorphemes(
    'в-, во-, взо-, вне-, внутри-, возо-, вы-, до-, еже-, за-, зако-,'+
    'изо-, испод-, к-, кое-, ку-, меж-, междо-, между-, на-, над-, надо-, '+
    'наи-, не-, недо-, ни-, низо-, о-, об-, обо-, около-, от-, ото-, па-, '+
    'пере-, по-, под-, подо-, поза-, после-, пра-, пред-, преди-, предо-, про-,'+
    'противо-, разо-, с-, со-, сверх-, среди-, су-, тре-, у-, без-, бес-, вз-,'+
    'вс-, воз-, вос-, из-, ис-, низ-, нис-, обез-, обес-, раз-, рас-, роз-, рос-,'+
    'разъ-, безъ-, съ-, '+
    'через-, черес-, чрез-, чрес-, пре-, при-, зло-, взаимо-, псевдо-, анти-, гео-,'+
    'везде-, много-, одно-, неодно-, дву-, двух'
  );

  dict.suffixes = parseMorphemes( 
    '-айш-, -е-, -ее-, -ей-, -ейш-, -же-, -ше-, -л-, -ел-, -ти, -ть, -и, -ащ-,'+
    '-ящ-, -вш-, -ш-, -ущ-, -ющ-, -ем-, -им-, -ом-, -нн-, -енн-, -онн-, -т-, -ить, -а-, -я-,'+
    '-учи-, -ючи-, -вши-, -ши-, -ес-, -ен-, -ер-, -й-, -ейш-, -айш-, -к-, -ик-, '+
    '-ек-, -ок-, -чик, -ёк-, -еньк-, -оньк-, -ечк-, -ичк-, -ич-, -очк-, -ашк-, -ашн-, -ишк-, -ашек-'+
    '-ушк-, -юшк-, -ышк-, -ец-, -иц-, -енк-, -инк-, -онк-, -ин-, -ищ-, -ушек, -ышек,'+
    '-ёныш, -еньк-, -оньк-, -ехоньк-, -оханьк-, -ёшеньк-, -ошеньк-, '+
    '-юсеньк-, -енн-, -оват-, -еньк-, -оньк-, -енечко, -онечко, -еват, -оват, -тель, -итель, '+
    '-чик, -щик, -ник, -ир, -ниц-, -к-, -иц-, -юх, -ёнок, -ушк-, -ышк-, -ость, -ост-, -як, -ун, -ач, '+
    '-ив-, -ивн-, -чив-, -лив-, -ист-, -изм-, -ск-, -еск-, -ов-, -ев-, -н-, -евит-, -ин-, '+
    '-ова-, -ева-, -ыва-, -и-, -я-, -е-, -а-, -а, -о, -у, -ийск-, -ств-, -еств, -арн-, -арик, -ац-,'+
    '-от-, -лог, -ь, '+
    '-чн-, -ованность, -явш-, -яющ-, -вск-, -овск-'
  ); // , -ход

  dict.endings = parseMorphemes( 
    '-а, -ам, -ами, -ас, -ах, -ая, -е, -её, -ей, -ем, -еми, -емя,'+
    '-ех, -ею, -ёт, -ёте, -ёх, -ёшь, -и, -ие, -ий, -ия, -им, -ими, -ит,'+
    '-ите, -их, -ишь, -ию, -ми, -мя, -о, -ов, -ого, -ое, -оё,'+
    '-ой, -ом, -ому, -ою, -у, -ум, -умя, -ут, -ух, -ую, -шь, -ый, -ые'+
    '-а, -я, -ы, -и, -ов, -ей, -е, -ам, -ям, -у, -ю,'+ // сущ. и.м.-в.п.
    '-ой, -ёй, -ами, -ями, -ом, -ем, -ём, -ах, -ях,'+ // сущ. т.п.-п.п.
    '-у, -ю, -ешь, -ет, -ем, -ете, -ут, -ют, -ишь, -ит, -им, -ите, -ат, -ят,'+ // гл. 1/2 спряж.
    '-ый, -ий, -ая, -яя, -ое, -ее, -ые, -ие, -ого, -его, -ой, -ей, -ых, -их,'+ // прил. им./род.п.
    '-ому, -ему, -ой, -ей, -ым, -им, -ую, -юю, -ыми, -ими, -ом, -ем' + // прил. дат./вин./твор.п.
    '-ийся, -егося, -емуся, -имся, -емся, -аяся, -ейся, -уюся, -ееся, ' + // причастия ед.ч.
    '-иеся, -ихся, -имся, -имися' // причастия мн.ч.
    // убрано: -м, 
  ); 

  return dict;
};