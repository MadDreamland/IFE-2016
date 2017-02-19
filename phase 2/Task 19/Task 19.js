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
		inner += '<div><div class=\"hint\" style=\"bottom:' + queue[i] + 'px;\">' + queue[i] + '</div><div class=\"bar\" style = \"height: ' + queue[i] + 'px;\"></div></div>';
	}
	display.innerHTML = inner;
	console.log(display.innerHTML);
}

//入队列
function inQueue(dir){
	//判断元素数量
	if (queue.length > 60) {
		alert("元素数量最大为60！");
		return;
	}
	//判断输入值是否为数字
	var num = Number(input.value);
	if (!isNaN(num) && (num >= 10) && (num <= 100) && (num == Math.round(num))){
		if (dir == 'left'){
			queue.unshift(num);
		}
		else{
			queue.push(num);
		}
		render();
	}
	else {
		alert("请输入10-100之间的整数！");
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

//排序
function sort(){
	var i = 0, j = 0;
	var sI = setInterval(function(){
		if(j < queue.length - i){
			if(queue[j] > queue[j + 1]){
				var temp = queue[j];
				queue[j] = queue[j + 1];
				queue[j + 1] = temp;
				var jump = true;
				render();
			}
			j++;
		}
		else{
			i++;
			j = 0;
		}
		if(i >= queue.length){
			clearInterval(sI);
		}
	}, 100);
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
	$('sort').onclick = function(){
		sort();
	}
}

var input = document.getElementsByName('input-number')[0];
var display = $('display');
iniButton();