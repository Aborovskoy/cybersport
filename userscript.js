// ==UserScript==
// @name         cybersport.ru
// @namespace    https://www.cybersport.ru/
// @version      0.1
// @description  cybersport.ru modificator
// @author       ABorovskoy
// @match        http*://*.cybersport.ru/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
// jshint multistr: true

var importantNews = '\
	<div class="post__wrapper" style="border-style:solid; border-color: #c1c1c1; border-width: 0 0 1px 0;">\
    	<p class="post__tag tag">\
        	%tag%\
		</p>\
	<br>\
		%news%\
	</div>\
';

var importantNewsBlock = '\
	<p style="color:var(--text); text-transform:none; margin-bottom:20px"><strong>Важные</strong></p>\
	<div style="border-style:solid; border-color: #c1c1c1; border-width: 1px 0 1px 0;">\
		%newsitems%\
		<p style="color:var(--text); text-transform:none; margin: 30px 0 20px 0;"><strong>Остальные</strong></p>\
	</div>\
';

var menu = '\
	<div class="menu__item "><a href="/base/match">Матчи</a></div>\
	<div class="menu__item "><a href="/streams">Стримы</a></div>\
	<div class="menu__item "><a href="/base/tournaments">Турниры</a></div>\
	<div class="menu__item"> \
    <span>Новости и Стастистика</span>\
    <ul class="sub-menu list-unstyled">\
    	<li class="sub-menu__item"><a href="/news">Новости</a></li>\
        <li class="sub-menu__item"><a href="/articles">Статьи</a></li>\
        <li class="sub-menu__item"><a href="/interviews">Интервью</a></li>\
        <li class="sub-menu__item"><a href="/videos">Видео</a></li>\
        <li class="sub-menu__item"><a href="/blog">Блоги</a></li>\
    <hr>\
        <li class="sub-menu__item"><a href="/base/teams">Команды</a></li>\
        <li class="sub-menu__item"><a href="/base/gamers">Игроки</a></li>\
        <li class="sub-menu__item"><a href="/base/organizations">Организации</a></li>\
    </ul>\
	</div>';

var script = document.createElement("script");
script.innerHTML = '\
    function clickCollapse (element_id) {\
        if (document.getElementById(element_id)) {\
            var element = document.getElementById(element_id);\
            if (element.style.display != "block") {\
                element.style.display = "block";\
                document.getElementById(element_id+"__link").innerHTML="СКРЫТЬ СТАТИСТИКУ";\
            }\
            else {\
                element.style.display = "none";\
                document.getElementById(element_id+"__link").innerHTML="ПОКАЗАТЬ СТАТИСТИКУ";\
            }\
        }\
    }';

var collapse = '<br>\
   <a id="collapse__link" href="javascript:void(0)" onclick="clickCollapse(\'collapse\')">ПОКАЗАТЬ СТАТИСТИКУ</a>\
   <div id="collapse" style="display: none;">\
     	%insertHTML% <br>\
   		<a href="javascript:void(0)" onclick="clickCollapse(\'collapse\')">СКРЫТЬ СТАТИСТИКУ</a>\
   </div>';


(function() {'use strict';

	function getCSSRules(){
	  var rules={}; var ds=document.styleSheets,dsl=ds.length;
	  for (var i=0;i<dsl;++i){
		var dsi=ds[i].cssRules,dsil=dsi.length;
		for (var j=0;j<dsil;++j) rules[dsi[j].selectorText]=dsi[j];
	  }
	  return rules;
	}
	/* ******************************* */
	function StyleSheet_insertRule(rule, index)
	{
	  // Выделяем селектор и стиль из параметра
	  if (rule.match(/^([^{]+)\{(.*)\}\s*$/))
	  {
		this.addRule(RegExp.$1, RegExp.$2, index);
		return index;
	  }
	  throw "Syntax error in CSS rule to be added";
	}


	function StyleSheet_makeCompatible(style)
	{
	  // Mozilla не даёт доступа к cssRules до загрузки стиля
	  //try 		{style.cssRules;}
	  //catch (e) {return style;	}

	  // Создаём CSSStyleSheet.cssRules
	  if (typeof style.cssRules == 'undefined' && typeof style.rules != 'undefined')
		style.cssRules = style.rules;

	  // Создаём CSSStyleSheet.insertRule и CSSStyleSheet.deleteRule
	  if (typeof style.insertRule == 'undefined' && typeof style.addRule != 'undefined')
		style.insertRule = StyleSheet_insertRule;
	  if (typeof style.deleteRule == 'undefined' && typeof style.removeRule != 'undefined')
		style.deleteRule = style.removeRule;

	  // Проверяем, существуют ли все нужные свойства
	  if (typeof style.cssRules == 'undefined' || typeof style.insertRule == 'undefined' || typeof style.deleteRule == 'undefined')
		return null;
	  else
		return style;
	}
	/* ******************************* */

	function addCSSRule(url){
	  var style;
	  style = document.createElement('style');
	  document.getElementsByTagName('head')[0].appendChild(style);
	  // Находим новый стиль в коллекции styleSheets
	  style = document.styleSheets[document.styleSheets.length - 1];
	  // Делаем объект совместимыми с W3C DOM2 (для IE)
	  return StyleSheet_makeCompatible(style);
	}
	
	function setCSSRule(name){
	  var rules=getCSSRules();
	  if (!rules.hasOwnProperty(name)){
		var style = addCSSRule();
		// Вставляем правило в конец таблицы стилей
		style.insertRule(name + '{}', style.cssRules.length);
		rules = getCSSRules();
	  }
	  return rules[name];
	}


	function removeElementsByClass(className, count = 0){
		var elements = document.getElementsByClassName(className);
		if (count > 0) {count = elements.length - count;}
    	while(elements.length > count){
        	elements[0].parentNode.removeChild(elements[0]);
    	}
	}

	function changeElementClassByClass(className, newClassName){
    	var elements = document.getElementsByClassName(className);
    	while(elements.length > 0){
        	elements[0].className = newClassName;
    	}
	}

	function setElementStyleByClass(className, style){
    	var elements = document.getElementsByClassName(className);
    	while(elements.length > 0){
        	elements[0].style = style;
    	}
	}

	function setCSSForTags(className, color, fontWeight){
		setCSSRule(className).style.color		= color;
		setCSSRule(className).style.background	= 'inherit';
		setCSSRule(className).style.fontWeight	= fontWeight;
		setCSSRule(className).style.padding		= '0px';
	}

	function getMatches(className){ // статистика матчей
		var content = '';
		var elements = document.getElementsByClassName(className);
    	while(elements.length > 0){
			content += elements[0].outerHTML;
        	elements[0].parentNode.removeChild(elements[0]);
    	}
		return content;
	}

	function getImportantNews(){ // на главной "важные новости"
		var content 	= '', news, tag, caption, html;
		var element_p;
		var elements	= document.getElementsByClassName('news-important__description');
    	while(elements.length > 0){
			caption   = elements[0].getElementsByClassName('news-important__title')[0].innerHTML;
        	element_p = elements[0].getElementsByClassName('news-important__tag')[0];
			element_p.getElementsByTagName('a')[0].innerHTML = caption;
			element_p.getElementsByTagName('a')[0].className = 'revers';
			tag	 = element_p.getElementsByTagName('a')[1].outerHTML;
			news = element_p.getElementsByTagName('a')[0].outerHTML;
			html = importantNews.replace(/%tag%/g, tag);
			html = html.replace(/%news%/g, news);
			content += html;
        	elements[0].parentNode.removeChild(elements[0]);
    	}
		return importantNewsBlock.replace(/%newsitems%/g, content);
		
	}

	function itsSubstrInHref(substr){return document.location.href.indexOf(substr) != -1;}

	

// *********************** Глобальные изменения *********************** //
// ____________________________________________________________________ //
	//удаление верхнего заголовка с матчами
	removeElementsByClass('matchticker matchticker--desktop');
	//удаление footer
	removeElementsByClass('footer__center');
	removeElementsByClass('footer__right');
	removeElementsByClass('footer__left');
	//убирание baloon вокруг тегов
	setCSSForTags('.tag', '#DF7401', '200'); 			// теги
	setCSSForTags(".post__tag a", '#DF7401', '200'); 	// теги в новостях и etc
	//настройка ссылок
	setCSSRule('a').style.color	= '#4169E1'; 			// цвет ссылки
	setCSSRule('a.revers').style.fontSize	= '14px';
	setCSSRule('a.revers').style.fontWeight	= '200';
	if (document.location.href == 'https://www.cybersport.ru/' || itsSubstrInHref('/news') ||  itsSubstrInHref('/articles') || itsSubstrInHref('/interviews') || itsSubstrInHref('/videos') || itsSubstrInHref('/blog') || itsSubstrInHref('/reports/') || itsSubstrInHref('/tags/')){
		setCSSRule('a.revers:visited').style.color	= '#8a795d';//'#9f8170'; // цвет посещенной ссылки
	}		
	//настройка основного меню
	setCSSRule('.header__bg').style.background				= '#353535'; //цвет основного меню
	setCSSRule('header .header__wrapper').style.background	= 'inherit'; 
	setCSSRule('.logo').style.padding						= '6px 20px 2px 0px';
	setCSSRule('.logo').style.backgroundImage				= '';
	setCSSRule('.menu').style.margin						= '0px';
	//настройка ночной темы
	setCSSRule('.mode-night').style.setProperty('--text', 					'#ccc7c4');	//текст
	setCSSRule('.mode-night').style.setProperty('--dark-bg', 				'#1d1e1a');	//content
	setCSSRule('.mode-night').style.setProperty('--dark-btn-attach', 		'#181915');	//button up
	setCSSRule('.mode-night').style.setProperty('--dark-bg-header-center', 	'#1d1e1a');	//menu
	setCSSRule('.mode-night').style.setProperty('--dark-reply-bg', 			'#1d1e1a');	//comments reply
	setCSSRule('.mode-night').style.setProperty('--dark-border-matchticker','#c1c1c1');	//разделитель
	
	removeElementsByClass('menu__item', 5); // +2 меню для мобильных гаджетов
	var content = document.getElementsByClassName('menu')[0].innerHTML;
	document.getElementsByClassName('menu')[0].innerHTML = menu + content;

	
	
	if (document.location.href == 'https://www.cybersport.ru/'){
	// *********************** Главная страница *********************** //
	// ________________________________________________________________ //

		//увеличение размера колонки с новостями
		document.getElementById('news_socials').style.width = '50%';
		//удаление пустого баннера
		removeElementsByClass('news__item--banner-square');
		//изменение заголовка "Новости" на "Сегодня"
		document.getElementsByClassName('title-block')[0].innerHTML = '<p style="color:var(--text); text-transform:none"><strong>Сегодня</strong></p>';
		
		//удаление телевизора ("важные новости")
		document.getElementsByClassName('news__item')[0].insertAdjacentHTML('beforebegin', getImportantNews());
		removeElementsByClass('televizor--desktop');	
		
		changeElementClassByClass('news__list news__list--2 list-unstyled', 				 'news-socials__list list-unstyled sys-content-list');
		changeElementClassByClass('news__list news__list--3 list-unstyled sys-content-list', 'news-socials__list list-unstyled sys-content-list');
		
		//скрытие картинки в новостях
		setCSSRule('.post__preview').style.display = "none";
		//тюнинг постов (справа от новостей)
		setCSSRule('.post').style.flexDirection	= 'inherit';
		setCSSRule('.post').style.borderColor	= '#c1c1c1';
		setCSSRule('.post').style.borderWidth	= '0 0 1px 0';
		setCSSRule('.post').style.borderStyle	= 'solid';
	} else {
	// *********************** Остальные страницы *********************** //
	// __________________________________________________________________ //
		// изменение цвета фильтра
		setCSSRule('.tabs--tab1 .tabs__item--tab1, .tabs--tab2 .tabs__item--tab2, .tabs--tab3 .tabs__item--tab3, .tabs--tab4 .tabs__item--tab4, .tabs--tab5 .tabs__item--tab5, .tabs--tab6 .tabs__item--tab6, .tabs--tab7 .tabs__item--tab7, .tabs--tab8 .tabs__item--tab8, .tabs--tab9 .tabs__item--tab9, .tabs__item--active').style.setProperty("background-color", "#333333", "important");
		setCSSRule('.tabs__navigation').style.border 			= '1px solid #333333';
		setCSSRule('.tabs__item').style.borderLeft 				= '1px solid #333333';
		setCSSRule('.matches__item--title').style.borderBottom	= '1px solid #333333';
		setCSSRule('.tournaments .tournaments__list .tournaments__item--title').style.borderBottom	= '1px solid #333333';
		
		// отключение фильтр в комментариях (все/популярные/новые), в "стримах -> смотреть все" оставляем
		if (document.location.href.indexOf('https://www.cybersport.ru/streams/game/') == -1 ){removeElementsByClass('tabs tabs--tab1 tabs--filter');}
		// скрытие статистики матчей в collapse
		if (itsSubstrInHref('https://www.cybersport.ru/base/match/group/')){ // заворачиваем статистику в collapse
			document.body.appendChild(script); 								 // добавлем скрипт в документ
			collapse = collapse.replace(/%insertHTML%/g, getMatches('matches'));
			document.getElementsByClassName('article__comments')[0].insertAdjacentHTML('beforebegin', collapse);	//before(collapse);
		}
		//Удаление "Читайте также ...."
		removeElementsByClass('article__mailru');

		setCSSRule('.report__streams').style.background					= 'inherit'; 	// фон стримов устанавливаем в наследование
		setCSSRule('.stream--page .stream__twitch').style.background	= 'inherit'; 	// фон стримов устанавливаем в наследование
		//настройка "ранга" в сомментариях
		setCSSForTags('.status--pro', 		'#6b1af8');
		setCSSForTags('.status--amateur', 	'#00b6c9', '100');
		setCSSForTags('.status--newbie', 	'#6fcf0d', '100');
		setCSSForTags('.status--nice-one', 	'#0062ff', '100');
		setCSSForTags('.status--master', 	'#3b240b', '100');
		setCSSForTags('.status--godlike', 	'#AEB404', '100');
		setCSSForTags('.status--over-9000', '#C22323', '100');

	}

})();
