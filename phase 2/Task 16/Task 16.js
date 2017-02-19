/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var domCity = document.getElementById("aqi-city-input");
	var domAQI = document.getElementById("aqi-value-input");
	var domCityTip = document.getElementById("city-tip");
	var domAQITip = document.getElementById("aqi-tip");
	var aqi = Number(domAQI.value.trim());
	var isValueCity = !/[^(\u4E00-\u9FA5|a-z|A-Z| )]/.test(domCity.value.trim()) && domCity.value.trim() != "";
	var isValueAQI = Number.isInteger(aqi) && aqi >= 0 && aqi <= 500 && domAQI.value != "";
	if (isValueCity && isValueAQI){
		//把输入的数据保存到aqiDate中
		aqiData[domCity.value.trim()] = aqi;
		//清空输入框
		domCity.value = "";
		domAQI.value = "";
		//清除错误提示
		domCityTip.innerHTML ="";
		domAQITip.innerHTML = "";
	}
	//输入错误
	else{
		if(!isValueCity){
			domCityTip.innerHTML = "请输入中文或字母";
		}
		else{
			domCityTip.innerHTML ="";
		}
		if(!isValueAQI){
			domAQITip.innerHTML = "请输入0-500的整数";
		}
		else{
			domAQITip.innerHTML = "";
		}
	}
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	//表头
	var inner = "<tr><th>城市</th><th>空气质量</th><th>操作</th></tr>";
	//表格内容
	for ( var tr in aqiData){
		inner += '<tr><td>' + tr + '</td><td>' + aqiData[tr] + '</td><td><button>删除</button></td></tr>';
	}
	//如果aqiData对象，没有任何属性，清空表格（这里是清空表头）
	if (Object.keys(aqiData) == ""){
		inner = "";
	}
	//先把表格所有内容保存到字符串中，再一次写入，减少对DOM的访问次数，提升性能
	domTable.innerHTML = inner;

	domButtons = domTable.getElementsByTagName('button');
	var city = "";
	//为表格中每个删除按钮绑定点击事件至delBtnHandle()
	for (var i = 0; i < domButtons.length; i++) {
		domButtons[i].onclick = function(){
			//city用于传递要删除的城市
			city = this.parentNode.previousSibling.previousSibling.innerHTML;
			delBtnHandle(city);
		};
	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
	addAqiData();
	renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
	// do sth.
	delete aqiData[city];
	renderAqiList();
}

function init() {
	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	var domButtons = document.getElementById("add-btn");
	var domCity = document.getElementById('aqi-city-input');
	var domAQI = document.getElementById("aqi-value-input");

	//给确认添加按钮绑定点击事件至addBtnHandle()
	domButtons.onclick = addBtnHandle;
	//给城市名称输入框绑定按键事件，当按下回车或小键盘回车时，将焦点转移至下一个输入框
	domCity.onkeypress = function(event){
		if (event.keyCode == (13 || 108)) {
			domAQI.focus();
		}
	}
	//给空气质量指数输入框绑定按键事件，当按下回车或小键盘回车时，提交数据并将焦点返回至第一个输入框
	domAQI.onkeypress = function(event){
		if (event.keyCode == (13 || 108)) {
			addBtnHandle();
			document.getElementById("aqi-city-input").focus();
		}
	}
	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
}
var domTable = document.getElementById("aqi-table");
init();
