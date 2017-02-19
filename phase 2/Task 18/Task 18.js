//存放数据的数组
var queue = [];

//封装getElementById()函数
function $(id) {
	return document.getElementById(id);
}

//渲染数组
function render(){
	var inner = "";
	for (var i = 0; i < queue.length; i++){
		inner += '<div>' + queue[i] + '</div>';
	}
	display.innerHTML = inner;
}

//入队列
function inQueue(dir){
	//判断输入值是否为数字
	if (!isNaN(input.value) && input.value != ""){
		if (dir == 'left'){
			queue.unshift(input.value);
		}
		else{
			queue.push(input.value);
		}
		render();
	}
	else {
		alert("请输入有效的数字！");
	}
	//输入提交后，清空输入框内容并让输入框重新获得焦点
	input.value = "";
	input.focus();
}

//出队列
function outQueue(dir){
	if (queue.length == 0){
		input.focus();
		return;
	}
	if (dir == 'left'){
		alert(queue.shift());
	}
	else {
		alert(queue.pop());
	}
	render();
	input.focus();
}

//给按钮绑定事件
function iniButton(){
	input.focus();
	//给输入框绑定按键事件。按下回车键或小键盘回车键时按从左入的方式提交数据
	input.onkeypress = function(event){
		if (event.keyCode == (13 || 108)) {
			inQueue('left');
			//屏蔽回车键的表单提交功能
			return false;
		}
	}
	$('left-in').onclick = function(){
		inQueue('left');
	}
	$('right-in').onclick = function(){
		inQueue('right');
	}
	$('left-out').onclick = function(){
		outQueue('left');
	}
	$('right-out').onclick = function(){
		outQueue('right');
	}
}

var input = document.getElementsByName('input-number')[0];
var display = $('display');
iniButton();