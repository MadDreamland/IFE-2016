//封装getElementById()函数
function $name(name){
	return document.getElementsByName(name)[0];
}

//封装getElementById()函数
function $(id){
	return document.getElementById(id);
}

//左侧入
function insertQueue(dir, date){
	//按分隔符将原始数据分割成数组
	var values = date.split(/[^\w\u4e00-\u9fa5]/);
	console.log(date);
	var content = "";
	for (var i = 0; i < values.length; i++){
		if (values[i] != "") {
			content += '<div>' + values[i] + '</div>';
		}
	}
	if(dir == 'left'){
		queue.innerHTML = content + queue.innerHTML;
	}
	else{
		queue.innerHTML += content;
	}
	input.focus();
	input.value = "";
}

//左侧出
function getoutQueue(dir){
	if (dir == 'left'){
		queue.removeChild(queue.firstChild);
	}
	else{
		queue.removeChild(queue.lastChild);
	}
}

//查找文本
function search(text){
	var queueContent = queue.childNodes;
	var canSearch = false;
	var count = 0;
	for (var i = 0; i < queueContent.length; i++){
		if (queueContent[i].innerHTML.indexOf(text) != -1){
			queueContent[i].innerHTML = queueContent[i].innerHTML.replace(new RegExp(text, 'g'), '<em>' + text + '</em>');
			canSearch = true;
			em[count++] = queueContent[i];
		}
	}
	if (!canSearch){
		alert('未找到 ' + text);
	}
}

function clearEm(){
	for (var i = 0; i < em.length; i++){
		em[i].innerHTML = em[i].innerHTML.replace(/<\/?em>/g, "");
	}
}

//给按钮绑定事件
function iniButton(){
	input.focus();
	$name('insert-left').onclick = function(){
		insertQueue('left', input.value);
	}
	$name('insert-right').onclick = function(){
		insertQueue('right', input.value);
	}
	$name('getout-left').onclick = function(){
		getoutQueue('left');
	}
	$name('getout-right').onclick = function(){
		getoutQueue('right');
	}
	$name('search').onclick = function(){
		search($name('input-search').value);
	}
	$name('input-search').onkeydown = function(event){
		clearEm();
		if (event.keyCode == (13 || 108)){
			search($name('input-search').value);
			//屏蔽回车键的表单提交功能
			return false;
		}
	};
}

var input = $name('input-date');
var queue = $('queue');
var em = [];	//存放标记过强调的节点
iniButton();