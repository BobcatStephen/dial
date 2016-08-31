```javascript
/**
 * Created by tengfa on 2016/8/27.
 */

function bx() {
    var _opt = {
        isAllow: true,
        isLogin: true,
        curX: 0,
        curY: 0,
        maxX: 1028,
        maxY: 712,
        boxW: 150,
        boxH: 150,
        boxB: 4,
        pading: 40,
        direction: true, // 顺时针 false：逆时针
        rules: [],
        lapCount: 5,
        marginMillisecond: 620,
        callBack: function () { }
    };

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame;
    var ctxObj,ctx, ctx1, ctx2, ctx3, ctx4, ctx5, ctx_l, ctx_bg, ctx_bg_1;
    var obj;
    var animateId, animateLightId, animateFlickerId, resultAnimateId;
    var t1, t2;
    var speedUp = true;
    var lightNum = 0; // 闪动色块
    var lightColors = ["blue", "grey", "yellow", "green"];
    var baseStrategy = [
        //----------------谢谢参与------------
        { type: "T1", step: [6, 53, 6] },
        { type: "T2", step: [6, 58, 6] },
        { type: "T3", step: [6, 61, 6] },
        { type: "T4", step: [6, 66, 6] },
        //----------------红包----------------
        { type: "R1", step: [6, 52, 6] },
        { type: "R2", step: [6, 54, 6] },
        { type: "R3", step: [6, 56, 6] },
        { type: "R4", step: [6, 60, 6] },
        { type: "R5", step: [6, 63, 6] },
        { type: "R6", step: [6, 65, 6] },
        //----------------金------------------
        { type: "G1", step: [6, 55, 6] },
        //----------------银------------------
        { type: "A1", step: [6, 59, 6] },
        //----------------铜------------------
        { type: "C1", step: [6, 64, 6] },
        //----------------幸运暴击------------
        { type: "L1", strateType: "K0", step: [6, 57, 6] },
        { type: "L1", strateType: "K1", step: [6, 57, 6] },
        { type: "L1", strateType: "K2", step: [6, 57, 6] },
        { type: "L1", strateType: "K3", step: [6, 57, 6] },
        { type: "L1", strateType: "K6", step: [6, 57, 6] },
        { type: "L1", strateType: "K7", step: [6, 57, 6] },
        { type: "L1", strateType: "K8", step: [6, 57, 6] },
        { type: "L1", strateType: "K9", step: [6, 57, 6] },

        { type: "L2", strateType: "K8", step: [6, 62, 6] },
        { type: "L2", strateType: "K9", step: [6, 62, 6] },
        { type: "L2", strateType: "K10", step: [6, 62, 6] },
        { type: "L2", strateType: "K18", step: [6, 62, 6] },

        { type: "L3", strateType: "K15", step: [6, 67, 6] },
        { type: "L3", strateType: "K19", step: [6, 67, 6] },
        { type: "L3", strateType: "K20", step: [6, 67, 6] }
    ];
    var strategy = [
        { type: "K0", count: 1, x: 0, y: 0, step: [4], flag: true, marginTime: 50 },
        { type: "K1", count: 1, x: 0, y: 0, step: [14], flag: true, marginTime: 50 },
        { type: "K2", count: 1, x: 0, y: 0, step: [9], flag: true, marginTime: 50 },
        { type: "K3", count: 1, x: 0, y: 0, step: [12], flag: true, marginTime: 50 },

        { type: "K6", count: 2, x: 0, y: 0, step: [12, 5], flag: true, marginTime: 50 },
        { type: "K7", count: 2, x: 0, y: 0, step: [2, 14], flag: true, marginTime: 50 },
        { type: "K8", count: 3, x: 0, y: 0, step: [11, 15, 7], flag: true, marginTime: 50 },
        { type: "K9", count: 3, x: 0, y: 0, step: [9, 2, 15], flag: true, marginTime: 50 },
        { type: "K10", count: 3, x: 0, y: 0, step: [9, 13, 4], flag: true, marginTime: 50 },
        { type: "K15", count: 3, x: 0, y: 0, step: [10, 3, 14], flag: true, marginTime: 50 },
        { type: "K18", count: 2, x: 0, y: 0, step: [5, 10], flag: true, marginTime: 50 },
        { type: "K19", count: 3, x: 0, y: 0, step: [9, 14, 5], flag: true, marginTime: 50 },
        { type: "K20", count: 4, x: 0, y: 0, step: [5, 14, 9, 6], flag: true, marginTime: 50 }
    ];
    var currentBaseStrategy, currentStrategy;
    var animateStrategyId;
    var arcPoint = { x: 0, y: 0, r: 8, margin: [29, 11], c: ["red", "grey", "yellow"], t1: "", t2: "", marginTime: 30 };
    var totalAmount = { amount: 888.8, payAmount: 0.0, marginTime: 30, t1: "", t2: "", t: "" };

    return {
        init: function (option) {
            //    初始化场景
            _opt = $.extend(_opt, option);
            obj = this;

            obj.attachAnimateFlicker();
            obj.drawBg();
        },
        setCurrentPoint: function (_opt, direction) {
            //        计算坐标点位置
            if (direction) {
                // 顺时针
                if (_opt.curX < _opt.maxX - _opt.pading - _opt.boxB - _opt.boxW &&
                    _opt.curY == _opt.pading + _opt.boxB) {
                    //    位于第一维度
                    _opt.curX = _opt.curX + 2 * _opt.boxB + _opt.boxW;
                }
                else if (_opt.curX == _opt.maxX - _opt.pading - _opt.boxB - _opt.boxW &&
                    _opt.curY < _opt.maxY - _opt.pading - _opt.boxB - _opt.boxH) {
                    //    位于第二维度
                    _opt.curY = _opt.curY + 2 * _opt.boxB + _opt.boxH;
                }
                else if (_opt.curY == _opt.maxY - _opt.pading - _opt.boxB - _opt.boxH &&
                    _opt.curX < _opt.maxX && _opt.curX > _opt.pading + _opt.boxB) {
                    //    位于第三维度
                    _opt.curX = _opt.curX - 2 * _opt.boxB - _opt.boxW;
                }
                else if (_opt.curX == _opt.pading + _opt.boxB && _opt.curY < _opt.maxY) {
                    //    位于第四维度
                    _opt.curY = _opt.curY - 2 * _opt.boxB - _opt.boxH;
                }
                else {
                    _opt.curX = _opt.pading + _opt.boxB;
                    _opt.curY = _opt.pading + _opt.boxB;
                }
            }
            else {
                //    逆时针
            }
        },
        getNextPoint: function (x, y, direction) {
            if (direction) {
                if (x < _opt.maxX - _opt.pading - _opt.boxB - _opt.boxW &&
                    y == _opt.pading + _opt.boxB) {
                    //    位于第一维度
                    x = x + 2 * _opt.boxB + _opt.boxW;
                }
                else if (x == _opt.maxX - _opt.pading - _opt.boxB - _opt.boxW &&
                    y < _opt.maxY - _opt.pading - _opt.boxB - _opt.boxH) {
                    //    位于第二维度
                    y = y + 2 * _opt.boxB + _opt.boxH;
                }
                else if (y == _opt.maxY - _opt.pading - _opt.boxB - _opt.boxH &&
                    x < _opt.maxX && x > _opt.pading + _opt.boxB) {
                    //    位于第三维度
                    x = x - 2 * _opt.boxB - _opt.boxW;
                }
                else if (x == _opt.pading + _opt.boxB && y < _opt.maxY) {
                    //    位于第四维度
                    y = y - 2 * _opt.boxB - _opt.boxH;
                }
                else {
                    x = _opt.pading + _opt.boxB;
                    y = _opt.pading + _opt.boxB;
                }
            }
            else {

            }

            return { x: x, y: y };
        },
        drawBg: function () {
            ctx_bg = document.getElementById("canvas_bg").getContext("2d");
            //ctx5 = document.getElementById("canvas_r").getContext("2d");
            var imagePath = "/Lottery/image/";

            ctx_bg.fillStyle = "#fff7d3";
            ctx_bg.fillRect(0, 0, _opt.maxX, _opt.maxY);

            var imageData = [];
            // 画背景图层
            obj.setCurrentPoint(_opt, _opt.direction);
            var img1 = new Image();
            img1.name = "img_" + _opt.curX + "_" + _opt.curY;
            img1.src = imagePath + "act-hb-1.png";
            imageData.push(img1);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img2 = new Image();
            img2.name = "img_" + _opt.curX + "_" + _opt.curY;
            img2.src = imagePath + "act-xxhg.png";
            imageData.push(img2);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img3 = new Image();
            img3.name = "img_" + _opt.curX + "_" + _opt.curY;
            img3.src = imagePath + "act-hb-1.png";
            imageData.push(img3);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img4 = new Image();
            img4.name = "img_" + _opt.curX + "_" + _opt.curY;
            img4.src = imagePath + "act-jbx.png";
            imageData.push(img4);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img5 = new Image();
            img5.name = "img_" + _opt.curX + "_" + _opt.curY;
            img5.src = imagePath + "act-hb-1.png";
            imageData.push(img5);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img6 = new Image();
            img6.name = "img_" + _opt.curX + "_" + _opt.curY;
            img6.src = imagePath + "act-bj.png";
            imageData.push(img6);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img7 = new Image();
            img7.name = "img_" + _opt.curX + "_" + _opt.curY;
            img7.src = imagePath + "act-xxhg.png";
            imageData.push(img7);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img8 = new Image();
            img8.name = "img_" + _opt.curX + "_" + _opt.curY;
            img8.src = imagePath + "act-ybx.png";
            imageData.push(img8);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img9 = new Image();
            img9.name = "img_" + _opt.curX + "_" + _opt.curY;
            img9.src = imagePath + "act-hb-1.png";
            imageData.push(img9);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img10 = new Image();
            img10.name = "img_" + _opt.curX + "_" + _opt.curY;
            img10.src = imagePath + "act-xxhg.png";
            imageData.push(img10);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img11 = new Image();
            img11.name = "img_" + _opt.curX + "_" + _opt.curY;
            img11.src = imagePath + "act-bj.png";
            imageData.push(img11);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img12 = new Image();
            img12.name = "img_" + _opt.curX + "_" + _opt.curY;
            img12.src = imagePath + "act-hb-1.png";
            imageData.push(img12);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img13 = new Image();
            img13.name = "img_" + _opt.curX + "_" + _opt.curY;
            img13.src = imagePath + "act-tbx.png";
            imageData.push(img13);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img14 = new Image();
            img14.name = "img_" + _opt.curX + "_" + _opt.curY;
            img14.src = imagePath + "act-hb-1.png";
            imageData.push(img14);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img15 = new Image();
            img15.name = "img_" + _opt.curX + "_" + _opt.curY;
            img15.src = imagePath + "act-xxhg.png";
            imageData.push(img15);

            obj.setCurrentPoint(_opt, _opt.direction);
            var img16 = new Image();
            img16.name = "img_" + _opt.curX + "_" + _opt.curY;
            img16.src = imagePath + "act-bj.png";
            imageData.push(img16);

            var loadCount = 0;
            var imageLoadInterval = setInterval(function () {
                obj.setCurrentPoint(_opt, _opt.direction);

                ctx_bg.fillStyle = "#f8ecc2";
                ctx_bg.fillRect(_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);

                ctx_bg.drawImage(imageData[loadCount], _opt.curX, _opt.curY, _opt.boxW, _opt.boxH);

                loadCount++;
                if (loadCount == 16) {
                    clearInterval(imageLoadInterval);
                    imageLoadInterval = null;
                }
            }, 50);

        },
        drawMoveBox: function () {
            //    画移动的盒子
            t1 = new Date();
            if (t1 - t2 > _opt.marginMillisecond || !t2) {

                if (_opt.marginMillisecond > 0 && speedUp && currentBaseStrategy.step[0] > 0) {
                    // 加速
                    console.log(_opt.marginMillisecond, "加速", currentBaseStrategy.step[0]);
                    _opt.marginMillisecond -= 100;
                    currentBaseStrategy.step[0]--;
                }
                else if (!speedUp && currentBaseStrategy.step[2] > 0) {
                    // 减速
                    console.log(_opt.marginMillisecond, "减速", currentBaseStrategy.step[2]);
                    _opt.marginMillisecond += 85;
                    currentBaseStrategy.step[2]--;
                }
                else {
                    console.log(_opt.marginMillisecond, "高匀速", currentBaseStrategy.step[1]);
                    // 高匀速
                    if (currentBaseStrategy.step[1] > 0) {
                        currentBaseStrategy.step[1]--;
                    }
                    else {
                        speedUp = false;
                    }
                }

                ctx.clearRect(0, 0, 1028, 712);

                if (!ctx) ctx = document.getElementById("canvas_0").getContext("2d");

                obj.setCurrentPoint(_opt, _opt.direction);
                //ctx.fillStyle = "#FFF";
                //ctx.fillRect(_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);
                ctx.strokeStyle = "#F00";
                ctx.lineWidth = 4;
                ctx.strokeRect(_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);

                t2 = t1;
            }

            obj.animateFloatBox();
        },
        animateFloatBox: function () {
            //    移动盒子
            //    1.根据规则去触发不同的动画场景，每个动画都单独定义出来


            if (currentBaseStrategy.step.every(function (s) { return s === 0 }) && !speedUp) {
                obj.stopAnimate();
                // 根据当前图片内容，来决定是否继续触发其它动画
                if (!!currentBaseStrategy.strateType) {
                    currentStrategy = strategy.find(function (s) { return s.type == currentBaseStrategy.strateType; });
                    obj.animateLightBorder();
                }
                else {
                    // 无其它动画，触发开奖动画
                    console.log("恭喜您，获得奖品");
                    obj.resultAnimate();
                }
            }
            else {
                animateId = requestAnimationFrame(obj.drawMoveBox);
            }

        },
        drawLightBorder: function () {
            ctx.clearRect(_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);
            //console.log(lightNum);
            lightNum++;
            ctx.fillStyle = lightColors[lightNum % 4];
            ctx.fillRect(_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);

            obj.animateLightBorder();
        },
        animateLightBorder: function () {
            //    闪亮边框 场景

            animateLightId = requestAnimationFrame(obj.drawLightBorder);

            if (currentStrategy.flag) {
                currentStrategy.flag = false;
                obj.animateStrategy();
            }
            else {
                if (currentStrategy.step[currentStrategy.count - 1] == 0 && currentStrategy.count != 0) {
                    obj.animateStrategy();
                    currentStrategy.count--;
                    console.log("单个开奖-已获得奖金");
                }
                if (currentStrategy.step.every(function (s) { return s == 0; })) {
                    cancelAnimationFrame(animateStrategyId);
                    cancelAnimationFrame(animateLightId);
                    console.log("恭喜您，您获得的奖金为：");
                    obj.resultAnimate();
                }
            }
        },
        animateStrategy: function () {
            //    附加电流 场景

            animateStrategyId = requestAnimationFrame(obj.drawStrategy);
        },
        drawStrategy: function () {
            // 执行策略动画
            t1 = new Date();
            if (t1 - t2 > currentStrategy.marginTime || !t2) {
                ctxObj = currentStrategy.count == 3 ? ctx3 : (currentStrategy.count == 2 ? ctx2 : (currentStrategy.count == 4 ? ctx4 : ctx1));

                currentStrategy.step[currentStrategy.count - 1]--;

                if (currentStrategy.step[currentStrategy.count - 1] == 0) {
                    console.log("执行策略动画--结束");
                    cancelAnimationFrame(animateStrategyId);
                    currentStrategy.x = 0;
                    currentStrategy.y = 0;
                    return;
                }

                var r = { x: currentStrategy.x, y: currentStrategy.y };
                if (currentStrategy.x == 0 && currentStrategy.y == 0) {
                    currentStrategy.x = _opt.curX;
                    currentStrategy.y = _opt.curY;
                }
                else {
                    ctxObj.clearRect(r.x, r.y, _opt.boxW, _opt.boxH);
                }

                r = obj.getNextPoint(currentStrategy.x, currentStrategy.y, true);
                currentStrategy.x = r.x;
                currentStrategy.y = r.y;

                ctxObj.fillStyle = "blue";
                ctxObj.fillRect(currentStrategy.x, currentStrategy.y, _opt.boxW, _opt.boxH);

                t2 = t1;
            }

            obj.animateStrategy();
        },
        drawFlicker: function () {
            if (!ctx_l) { ctx_l = document.getElementById("canvas_l").getContext("2d"); ctx_l.globalAlpha = 0.5; }

            arcPoint.t1 = new Date();

            if (arcPoint.t1 - arcPoint.t2 > arcPoint.marginTime || !arcPoint.t2) {

                if (arcPoint.x < _opt.maxX - arcPoint.margin[1] - arcPoint.r &&
                    arcPoint.y == arcPoint.margin[1] + arcPoint.r) {
                    //    位于第一维度
                    arcPoint.x = arcPoint.x + arcPoint.r * 2 + arcPoint.margin[0];
                }
                else if (arcPoint.x == _opt.maxX - arcPoint.margin[1] - arcPoint.r &&
                    arcPoint.y < _opt.maxY - arcPoint.margin[1] - arcPoint.r) {
                    //    位于第二维度
                    arcPoint.y = arcPoint.y + arcPoint.r * 2 + arcPoint.margin[0];
                }
                else if (arcPoint.y == _opt.maxY - arcPoint.margin[1] - arcPoint.r + 1 &&
                    arcPoint.x < _opt.maxX && arcPoint.x > arcPoint.margin[1] + arcPoint.r) {
                    //    位于第三维度
                    arcPoint.x = arcPoint.x - (arcPoint.r * 2 + arcPoint.margin[0]);
                }
                else if (arcPoint.x == arcPoint.margin[1] + arcPoint.r && arcPoint.y < _opt.maxY) {
                    //    位于第四维度
                    arcPoint.y = arcPoint.y - (arcPoint.r * 2 + arcPoint.margin[0]);
                }
                else {
                    arcPoint.x = arcPoint.margin[1] + arcPoint.r;
                    arcPoint.y = arcPoint.margin[1] + arcPoint.r;
                }
                ctx_l.beginPath();
                ctx_l.fillStyle = arcPoint.c[parseInt(Math.random() * 10) % 3];
                ctx_l.arc(arcPoint.x, arcPoint.y, arcPoint.r, 0, Math.PI * 2);

                ctx_l.fill();
                arcPoint.t2 = arcPoint.t1;

            }

            obj.attachAnimateFlicker();
        },
        attachAnimateFlicker: function () {

            animateFlickerId = requestAnimationFrame(obj.drawFlicker);
        },
        attachAnimateOpenBox1: function () {
            //    红包

        },
        attachAnimateOpenBox2: function () {
            //    金宝箱

        },
        attachAnimateOpenBox3: function () {
            //    银宝箱

        },
        beginAnimate: function () {
            //    开始动画
            if (_opt.isLogin && _opt.isAllow) {
                ctx = document.getElementById("canvas_0").getContext("2d");
                ctx1 = document.getElementById("canvas_1").getContext("2d");
                ctx2 = document.getElementById("canvas_2").getContext("2d");
                ctx3 = document.getElementById("canvas_3").getContext("2d");
                ctx4 = document.getElementById("canvas_4").getContext("2d");


                ctx.globalAlpha = 0.5;
                ctx1.globalAlpha = 0.5;
                ctx2.globalAlpha = 0.5;
                ctx3.globalAlpha = 0.5;
                ctx4.globalAlpha = 0.5;

                // 初始用户策略
                currentBaseStrategy = baseStrategy.find(function (s) { return (s.type == "L1" && !s.strateType) || (s.type == "L1" && s.strateType == "K9"); });
                totalAmount.t = "T1";

                obj.animateFloatBox();
            }
            else if (!_opt.isLogin) {
                //    提示登录后才能进行抽奖
            }
            else if (!_opt.isAllow) {
                //    提示已不允许抽奖
            }
        },
        stopAnimate: function () {
            //    暂停动画
            cancelAnimationFrame(animateId);
        },
        resultAnimate: function () {
            resultAnimateId = requestAnimationFrame(obj.result);
        },
        result: function () {
            //    结果
            totalAmount.t1 = new Date();

            if (totalAmount.t1 - totalAmount.t2 > totalAmount.marginTime || !totalAmount.t2) {
                ctx_bg.save();
                ctx_bg.translate(300, 250);

                ctx_bg.font = "48px serif";

                var amount = totalAmount.amount.toFixed(1);
                console.log(amount, totalAmount.amount <= 0);

                if (totalAmount.amount <= 0) {
                    cancelAnimationFrame(resultAnimateId);
                    return;
                }

                if (amount < 10) {
                    totalAmount.payAmount += 0.1;
                    totalAmount.amount -= 0.1;
                }
                else if (amount < 200) {
                    totalAmount.payAmount += 10;
                    totalAmount.amount -= 10;
                }
                else if (amount < 2000) {
                    totalAmount.payAmount += 100;
                    totalAmount.amount -= 100;
                }


                ctx_bg.clearRect(0, 0, 440, 68);
                ctx_bg.fillStyle = "#ecd8a3";
                ctx_bg.fillRect(0, 0, 440, 68);

                ctx_bg.beginPath();
                ctx_bg.font = "18px Microsoft YaHei";
                ctx_bg.fillStyle = "#ab6938";
                ctx_bg.fillText("恭喜您！本次抽奖共获得￥", 34, 45);

                ctx_bg.font = "30px Microsoft YaHei";
                ctx_bg.fillStyle = "#ca1f00";
                ctx_bg.fillText(parseFloat(totalAmount.payAmount).toFixed(1), 250, 45);

                ctx_bg.font = "18px Microsoft YaHei";
                ctx_bg.fillStyle = "#ab6938";
                ctx_bg.fillText("元奖金", 345, 45);

                ctx_bg.restore();

                totalAmount.t2 = totalAmount.t1;
            }

            obj.resultAnimate();
        }
    };
}


```
