//创建飞船
var createSpaceship = function (id) {
    //飞船对象
    var spaceship = {
        id: id;     //飞船的唯一编号
        speed: 20;      //飞船飞行的速度，单位：像素/秒
        energy: 100;      //飞船当前的能量，百分比形式
        status: 'stop';     //飞船当前的状态
    };

    //开始飞行
    spaceship.prototype.start = function () {
        var _this = this;

        var fly = setInterval(function () {

        }, 100);

        var expend = setInterval(function () {
            _this.energy -= 5;
        }, 1000);

        if (_this.energy <= 0){
            _this.stop();
        };
        if (status === 'stop') {
            clearInterval(fly);
            clearInterval(expend);
        };
    };

    //能源系统
    spaceship.prototype.power = function () {
        var power = setInterval(function () {
            this.energy += 2;
            if (this.energy > 100){
                this.energy = 100;
            }
        }, 1000);
    };

    //停止飞行
    spaceship.prototype.stop = function () {
        this.status = 'stop';
    };
    
    //销毁飞船
    spaceship.prototype.destroy = function () {
        spaceships[this.id] = null;
    };

    //信号接收处理系统
    spaceship.prototype.receive = function (commandPacket) {
        if (commandPacket.id === this.id) {
            this[commandPacket.command]();
        }
    };

    divUniverse = document.getElementById('universe');

    //在DOM中添加新轨道
    divOrbit = document.createElement('div');
    divOrbit.style.height = divOrbit.style.width = (100 + id * 50) + 'px';
    divOrbit.style[border-radius] = divOrbit.style[margin-left] = (divOrbit.style.height / 2) + 'px';
    divOrbit.style.top = (((divUniverse.style.height - divOrbit.style.height) / 2) - 3) + 'px';

    //在DOM中添加新飞船
    divSpacaship = document.createElement('div');
    divSpacaship.innerHTML = id + '号-' + spaceship.energy + '%';
    divOrbit.appendChild(divSpacaship);
    divUniverse.appendChild(divOrbit);

    //新增控制面板
    divControlPanel = document.getElementById('control-panel');
    divCommand = document.createElement('div');
    divCommand.innerHTML = '对' + id + '号飞船下达指令：' +
        '<button name="start">开始飞行</button>' +
        '<button stop="stop">停止飞行</button>' +
        '<button name="destroy">销毁</button>';
    divControlPanel.appendChild(divCommand);

    return spaceship;
};

//信号传播介质
var Mediator = function() {
    var packetLossProbability = 0.3;
    var send = function (id, command) {
        setTimeout(function () {
            if (Math.random() < packetLossProbability){
                return;
            }
            if (!spaceships[id]) {
                return;
            }
            for (var i = 0, item; item = spaceships[i++];) {
                item.receive({
                    id: id,
                    command: command;
                });
            }
        }, 1000);

    return {
        send: send;
    };
}();

var buttonNew = document.getElementById('new-spaceship');
buttonNew.onclick = function () {
    var test = createSpaceship(1);
}
