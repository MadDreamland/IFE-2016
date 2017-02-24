/**
 * Created by 10399 on 2017/2/23.
 */
//封装
var $ = function (selector) {
    return document.querySelector(selector);
};

//创建飞船
var createSpaceship = function (id) {
    //飞船构造函数
    var Spaceship = function (id) {
        this.id = id;     //飞船的唯一编号，从1开始
        this.speed = 1500;      //飞船飞行的速度，单位：像素/秒
        this.energy = 100;      //飞船当前的能量，百分比形式
        this.expend =
        this.status = 'stop';     //飞船当前的状态
        this.orbitRadius = 0;       //飞船轨道半径
        this.angle = 0;
        this.divOrbit = null;      //飞船轨道 DOM 对象
        this.divSpaceship = null;
        this.divPointer = null;
        this.divCommand = null;
    };

    //动力系统
    Spaceship.prototype.engine = function () {
        if (this.status === 'fly'){
            return;
        }
        this.status = 'fly';
        var _this = this;
        var omega = this.speed / this.orbitRadius;

        var fly = setInterval(function () {
            _this.angle += omega / 10;
            _this.energy -= Math.round(5 / 10);
            domRender(_this);
            if (_this.energy <= 0) {
                _this.status = 'stop';
            }
            if (_this.status === 'stop') {
                clearInterval(fly);
            }
        }, 100);
    };

    //能源系统
    Spaceship.prototype.power = function () {
        var _this = this;
        setInterval(function () {
            _this.energy += 2;
            if (_this.energy > 100) {
                _this.energy = 100;
            }
            domRender(_this);
        }, 1000);
    };

    //自爆系统
    Spaceship.prototype.selfDestruction = function () {
        this.divOrbit.parentNode.removeChild(this.divOrbit);
        this.divCommand.parentNode.removeChild(this.divCommand);
        spaceships[spaceship.id - 1] = null;
        $('#new-spaceship').disabled = false;
    };

    //信号接收处理系统
    Spaceship.prototype.receive = function (commandPacket) {
        var _this = this;
        var command = {
            //开始飞行
            start: function() {
                _this.engine();      //启动动力系统
            },
            //停止飞行
            stop: function () {
                _this.status = 'stop';
            },
            //销毁飞船
            destroy: function () {
                _this.selfDestruction();        //启动自爆系统
            }
        };
        if (commandPacket.id === this.id) {
            command[commandPacket.command]();
        }

    };

    var spaceship = new Spaceship(id);
    createSpaceshipDomObject(spaceship);        //创建飞船到DOM
    spaceship.power();      //启动能源系统

    return spaceship;
};

//创建飞船到DOM
var createSpaceshipDomObject = function (spaceship) {
    spaceship.orbitRadius = (100 + spaceship.id * 80) / 2;
    var divUniverse = document.getElementById('universe');

    //添加新轨道
    spaceship.divOrbit = document.createElement('div');
    spaceship.divOrbit.className = 'orbit';
    spaceship.divOrbit.style.height = spaceship.divOrbit.style.width = (2 * spaceship.orbitRadius) + 'px';
    spaceship.divOrbit.style['border-radius'] = spaceship.orbitRadius + 'px';
    spaceship.divOrbit.style.top = (((500 - 2 * spaceship.orbitRadius) / 2) - 3) + 'px';
    spaceship.divOrbit.style['margin-left'] = (-1 * (spaceship.orbitRadius + 3)) + 'px';

    //添加新飞船
    spaceship.divSpaceship = document.createElement('div');
    spaceship.divSpaceship.className = 'spaceship';
    spaceship.divSpaceship.innerHTML = spaceship.id + '号-<span>' + spaceship.energy + '</span>%';

    //添加能量指示器
    spaceship.divPointer = document.createElement('div');
    spaceship.divPointer.className = 'pointer';

    //将轨道、飞船和指示器加入DOM树
    spaceship.divSpaceship.appendChild(spaceship.divPointer);
    spaceship.divOrbit.appendChild(spaceship.divSpaceship);
    divUniverse.appendChild(spaceship.divOrbit);

    //新增控制面板
    var divControlPanel = document.getElementById('control-panel');
    spaceship.divCommand = document.createElement('div');
    spaceship.divCommand.innerHTML = '对' + spaceship.id + '号飞船下达指令：';
    for (var i = 0, item; item = planet.commands[i++];) {
        var button = document.createElement('button');
        button.innerHTML = item.description;
        button.onclick = function (item) {
            return function () {
                planet.sendCommand(spaceship.id, item.command);
            }
        }(item);
        spaceship.divCommand.appendChild(button);
    }
    var node = divControlPanel.querySelector('div') ? divControlPanel.querySelectorAll('div')[spaceship.id - 1] : divControlPanel.lastChild;
    divControlPanel.insertBefore(spaceship.divCommand, node);
};

//DOM渲染
var domRender = function (spaceship) {
    var color = {
        height: '#61bf65',
        medium: '#ffa142',
        low: '#ff5b5b'
    };
    spaceship.divOrbit.style.transform = 'rotate(' + spaceship.angle + 'deg)';
    spaceship.divSpaceship.querySelector('span').innerText = spaceship.energy;
    spaceship.divPointer.style.width = (60 * spaceship.energy * 0.01) + 'px';
    if (spaceship.energy >= 66) {
        spaceship.divPointer.style.background = color.height;
    }
    else if (spaceship.energy >= 33) {
        spaceship.divPointer.style.background = color.medium;
    }
    else {
        spaceship.divPointer.style.background = color.low;
    }
};

//信号传播介质
var mediator = function () {
    var packetLossProbability = 0.3;
    var transmit = function (commandPacket) {
        setTimeout(function () {
            //如果丢包，直接结束信号传输
            if (Math.random() < packetLossProbability) {
                $('#console').innerHTML += '<p>信号“' + commandPacket.id + '号：' + commandPacket.command + '”发送失败（丢包）</p>';
                return $('#console').scrollTop = $('#console').scrollHeight;
            }
            for (var i = 0; i < spaceships.length; i++) {
                if (spaceships[i]){
                    spaceships[i].receive(commandPacket);
                }
            }
            $('#console').innerHTML += '<p>信号“' + commandPacket.id + '号：' + commandPacket.command + '”发送成功</p>';
            $('#console').scrollTop = $('#console').scrollHeight;
        }, 1000);
    };

    return {
        transmit: transmit
    };
}();




var planet = {
    commands: [
        {
            command: 'start',
            description: '开始飞行'
        },
        {
            command: 'stop',
            description: '停止飞行'
        },
        {
            command: 'destroy',
            description: '销毁'
        }
    ],
    sendCommand: function (id, command) {
        mediator.transmit({
            id: id,
            command: command
        });
    }
};


var spaceships = [];

$('#new-spaceship').onclick = function () {
    var countNull = 0;

    for (var i = 0; i < 4; i++) {
        if (! spaceships[i]) {
            countNull++;
            if (countNull === 1) {
                spaceships[i] = createSpaceship(i + 1);
            }
        }
    }
    this.disabled = (countNull <= 1);
};