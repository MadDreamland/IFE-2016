/**
 * Created by 10399 on 2017/2/23.
 */

//两个数求余
Math.mod = function (num1, num2) {
    return num1 - num2 * Math.floor(num1 / num2);
};

//将十进制数转换成二进制字符串
Math.toBinary = function (num) {
    if (num === 0) {
        return '';
    }
    return arguments.callee(Math.floor(num / 2)) + Math.mod(num, 2);
};

//字符串前填充0
String.prototype.fillZero = function (length) {
    self = this;
    while (self.length < length) {
        self = '0' + self;
    }
    return self;
};

//将二进制字符串转换为十进制
Math.toDecimalism = function (binary) {
    var num;
    if (binary.length === 0) {
        return 0;
    }
    num = binary.substr(0, 1) * Math.pow(2, binary.length - 1);
    return num + arguments.callee(binary.substr(1));
};

//简写 document.querySelector 函数
var $ = function (selector) {
    return document.querySelector(selector);
};

//创建飞船
var createSpaceship = function (id, speed, expend, supply) {
    //飞船构造函数
    var Spaceship = function () {
        this.id = id;     //飞船的唯一编号，从1开始
        this.speed = speed;      //飞船飞行的速度，单位：像素/秒
        this.energy = 100;      //飞船当前的能量，百分比形式
        this.expend = expend;       //飞船每秒消耗的能量
        this.supply = supply;       //飞船每秒的能量补充
        this.status = 'stop';     //飞船当前的状态
        this.orbitRadius = 0;       //飞船轨道半径
        this.angle = 0;     //飞船当前旋转的角度
        this.divOrbit = null;      //飞船轨道 DOM 对象
        this.divSpaceship = null;   //飞船 DOM 对象
        this.divPointer = null;     //飞船能量显示条 DOM 对象
        this.divCommand = null;     //控制该飞船的指令板 DOM 对象
    };

    //动力系统
    Spaceship.prototype.engine = function () {
        if (this.status === 'fly'){
            return;
        }
        this.status = 'fly';

        var _this = this;
        var intervalTime = 100;
        var omega = this.speed / this.orbitRadius;

        var fly = setInterval(function () {
            _this.angle += omega / 10;
            _this.energy -= Math.round(_this.expend * intervalTime / 1000);
            domRender(_this);
            if (_this.energy <= 0) {
                _this.status = 'stop';
            }
            if (_this.status === 'stop') {
                clearInterval(fly);
            }
        }, intervalTime);
    };

    //能源系统
    Spaceship.prototype.power = function () {
        var _this = this;
        setInterval(function () {
            _this.energy += _this.supply;
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
    Spaceship.prototype.receive = function (command) {
        var _this = this;
        var commands = {
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
        var adapter = function (binary) {
            var numId = Math.toDecimalism(binary.substr(0, 4));
            var numCommand = Math.toDecimalism(binary.substr(4));
            return {
                id: numId,
                command: planet.commands[numCommand].command
            }
        };
        var commandPacket = adapter(command);
        if (commandPacket.id === this.id) {
            commands[commandPacket.command]();
        }
    };

    var spaceship = new Spaceship();
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
var BUS = {
    packetLossProbability: 0.1,
    transmitTime: 300,
    transmit: function (command) {
        var _this = this;
        setTimeout(function () {
            var count = 0;
            if (Math.random() < _this.packetLossProbability) {
                DIYConsole.display('信号“' + command + '”发送失败，正在进行第' + ++count + '次重试');
                return _this.transmit(command);
            }

            for (var i = 0; i < spaceships.length; i++) {
                if (spaceships[i]){
                    spaceships[i].receive(command);
                }
            }
            DIYConsole.display('信号“' + command + '”发送成功');
        }, this.transmitTime);
    }
};

var DIYConsole = {
    divConsole: $('#console'),
    display: function (text) {
        this.divConsole.innerHTML += '<p>' + text + '</p>';
        this.divConsole.scrollTop = this.divConsole.scrollHeight;
    }
};


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
        var commandPacket = {
            id: id,
            command: command
        };
        BUS.transmit(this.adapter(commandPacket));
    },
    adapter: function (commandPacket) {
        var index;
        for (var i = 0; i < this.commands.length; i++) {
            if (this.commands[i].command === commandPacket.command) {
                index = i;
                break;
            }
        }
        return Math.toBinary(commandPacket.id).fillZero(4) + Math.toBinary(index).fillZero(4);
    }
};

var engineData = {
    progress: {
        speed: 3000,
        expend: 5
    },
    gallop: {
        speed: 5000,
        expend: 7
    },
    beyond: {
        speed: 8000,
        expend: 9
    }
};

var poweData = {
    strong: 2,
    light: 3,
    forever: 4
};

var spaceships = [];

//获取单选控件的值
var getInpRadioSelect = function (name) {
    var inpRadios = document.querySelectorAll('input[name=' + name + ']');
    for (var i = 0, item; item = inpRadios[i++];) {
        if (item.checked) {
            return item.value;
        }
    }
};

$('#new-spaceship').onclick = function () {
    var engineType = getInpRadioSelect('engine');
    var powerType = getInpRadioSelect('power');
    var countNull = 0;

    for (var i = 0; i < 4; i++) {
        if (spaceships[i]) {
            continue;
        }
        countNull++;
        if (countNull === 1) {
            spaceships[i] = createSpaceship(i + 1,
                engineData[engineType].speed,
                engineData[engineType].expend,
                poweData[powerType]
            );
        }
    }
    this.disabled = (countNull <= 1);
};