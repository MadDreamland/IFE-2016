//封装getElementById()函数
function $name(name){
	return document.getElementsByName(name)[0];
}

//封装querySelector()函数
function $(selector){
	return document.querySelector(selector);
}

/* 函数功能：使某个元素以某种样式闪烁数次
 * 形参：
 * target：要闪烁的目标
 * style：指定要闪烁的样式（会在该样式与原始样式之间闪烁）
 * interval：闪烁的间隔（两种样式之间切换的间隔）
 * times：闪烁的次数
 */
function twinkle(target, style, interval, times){
	//保存旧样式
	var oldStyleValue = target.style[style.split(/[:;]/)[0]];
	var styleName = style.split(/[:;]/)[0];
	var styleValue = style.split(":")[1];

	function hint(){
		target.style[styleName] = styleValue;
	}

	function none(){
		target.style[styleName] = oldStyleValue;
	}

	var ms = 0;
	for (var i = 0; i < times; i++){
		setTimeout(hint, ms);
		setTimeout(none, ms + interval);
		ms += interval * 2;
	}
}

function addTag(value){
	for (var i = 0; i < displayTag.childNodes.length; i++) {
		if (value == displayTag.childNodes[i].innerHTML){
			twinkle(displayTag.childNodes[i], "background: #DDD200", 200, 3);
			return;
		}
	}
	displayTag.innerHTML = '<div onmouseover="mouseover(event.target)" onmouseout="mouseout(event.target)" onclick="remove(event.target)">' + value + '</div>' + displayTag.innerHTML;
	if (displayTag.childNodes.length > 10){
		displayTag.removeChild(displayTag.lastChild);
	}
}

function mouseover(target){
	target.innerHTML = '删除 ' + target.innerHTML;
	target.style.padding = "0 15px 0 15px";
}

function mouseout(target){
	target.innerHTML = target.innerHTML.replace(/删除 /, "");
	target.style.padding = "0 38px 0 39px";
}

function remove(target){
	target.parentNode.removeChild(target);
}

//左侧入
function addInterest(value){
	//按分隔符将原始数据分割成数组
	var interests = value.split(/[^\w\u4e00-\u9fa5]/);
	var content = "";
	for (var i = 0; i < interests.length; i++){
		if (interests[i] != "") {
			content += '<div>' + interests[i] + '</div>';
		}
	}
	displayInterest.innerHTML = content + displayInterest.innerHTML;
	while (displayInterest.childNodes.length > 10){
		displayInterest.removeChild(displayInterest.lastChild);
	}
}

//给按钮绑定事件
function iniButton(){
	inputTag.focus();
	inputTag.onkeydown = function(event){
		if (event.keyCode == (13 || 108 || 8 || 188)){
			if (inputTag.value.trim() != ""){
				addTag(inputTag.value.trim());
			}
			else{
				alert("请输入有效的内容");
			}
			inputTag.value = "";
		}
	};
	$name('confirm').onclick = function(){
		var input = $name('input-interest');
		if (input.value.trim() != ""){
			addInterest(input.value.trim());
		}
		else{
			alert("请输入有效的内容");
		}
		input.focus();
		input.value = "";
	}
}

var inputTag = $name("input-tag");
var displayTag = $("#tag > .display");
var displayInterest = $("#interest > .display");

iniButton();