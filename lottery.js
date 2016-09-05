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
    var ctxObj, ctx, ctx1, ctx2, ctx3, ctx4, ctx5, ctx_l, ctx_bg, ctx_bg_1;
    var obj;
    var animateId, animateLightId, animateFlickerId, resultAnimateId,attachAnimateGId;
    var t1, t2;
    var speedUp = true;
    var lightNum = 0; // 闪动色块
    var lightColors = ["red", "grey", "yellow", "green"];
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
        { type: "L2", strateType: "K12", step: [6, 62, 6] },
        { type: "L2", strateType: "K18", step: [6, 62, 6] },

        { type: "L3", strateType: "K15", step: [6, 67, 6] },
        { type: "L3", strateType: "K19", step: [6, 67, 6] },
        { type: "L3", strateType: "K20", step: [6, 67, 6] }
    ];
    var strategy = [
        { type: "K0", count: 1, x: 0, y: 0, step: [20], flag: true, marginTime: 50 },
        { type: "K1", count: 1, x: 0, y: 0, step: [14], flag: true, marginTime: 50 },
        { type: "K2", count: 1, x: 0, y: 0, step: [9], flag: true, marginTime: 50 },
        { type: "K3", count: 1, x: 0, y: 0, step: [12], flag: true, marginTime: 50 },

        { type: "K6", count: 2, x: 0, y: 0, step: [12, 5], flag: true, marginTime: 50 },
        { type: "K7", count: 2, x: 0, y: 0, step: [18, 14], flag: true, marginTime: 50 },
        { type: "K8", count: 3, x: 0, y: 0, step: [12, 15, 7], flag: true, marginTime: 50 },
        { type: "K9", count: 3, x: 0, y: 0, step: [9, 18, 15], flag: true, marginTime: 50 },
        { type: "K10", count: 3, x: 0, y: 0, step: [9, 14, 4], flag: true, marginTime: 50 },
        { type: "K12", count: 3, x: 0, y: 0, step: [14, 10, 9], flag: true, marginTime: 50 },
        { type: "K15", count: 3, x: 0, y: 0, step: [9, 21, 14], flag: true, marginTime: 50 },
        { type: "K18", count: 2, x: 0, y: 0, step: [11, 26], flag: true, marginTime: 50 },
        { type: "K19", count: 3, x: 0, y: 0, step: [9, 14, 37], flag: true, marginTime: 50 },
        { type: "K20", count: 4, x: 0, y: 0, step: [5, 14, 41, 22], flag: true, marginTime: 50 }
    ];
    var currentBaseStrategy, currentStrategy;
    var animateStrategyId;
    var arcPointData = [];
    var arcPoint = { x: 0, y: 0, r: 8, margin: [29, 11], c: ["red", "green", "yellow"], t1: "", t2: "", marginTime: 800 };
    var totalAmount = { amount: 0.0, payAmount: 0.0, marginTime: 30, t1: "", t2: "", t: "", k: "" };
    var imageHover = [], imageClick = [];
    var currentAnimateBoxObjs = [];
    var goldData = [];
    var imagePath = "../js/lucky/image/";
    var isBegin = true;
    var imageData = [];

    var img_bg = new Image();
    img_bg.src = imagePath + "act-bg-5.jpg";

    return {
        isBegin:isBegin,
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

            ctx_bg.fillStyle = "#fff7d3";
            ctx_bg.fillRect(0, 0, _opt.maxX, _opt.maxY);

            // 画背景图层
            obj.setCurrentPoint(_opt, _opt.direction);

            var img1_h = new Image();
            img1_h.name = "img_h_" + _opt.curX + "_" + _opt.curY;
            img1_h.src = imagePath + "act-hb-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img1_h, type: "R" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img2_h = new Image();
            img2_h.name = "img2_h_" + _opt.curX + "_" + _opt.curY;
            img2_h.src = imagePath + "act-xxhg-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img2_h, type: "T" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img3_h = new Image();
            img3_h.name = "img3_h_" + _opt.curX + "_" + _opt.curY;
            img3_h.src = imagePath + "act-hb-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img3_h, type: "R" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img4_h = new Image();
            img4_h.name = "img4_h_" + _opt.curX + "_" + _opt.curY;
            img4_h.src = imagePath + "act-jbx-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img4_h, type: "G" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img5_h = new Image();
            img5_h.name = "img5_h_" + _opt.curX + "_" + _opt.curY;
            img5_h.src = imagePath + "act-hb-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img5_h, type: "R" });

            obj.setCurrentPoint(_opt, _opt.direction);
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: null, type: "L" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img7_h = new Image();
            img7_h.name = "img7_h_" + _opt.curX + "_" + _opt.curY;
            img7_h.src = imagePath + "act-xxhg-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img7_h, type: "T" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img8_h = new Image();
            img8_h.name = "img8_h_" + _opt.curX + "_" + _opt.curY;
            img8_h.src = imagePath + "act-ybx-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img8_h, type: "A" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img9_h = new Image();
            img9_h.name = "img9_h_" + _opt.curX + "_" + _opt.curY;
            img9_h.src = imagePath + "act-hb-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img9_h, type: "R" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img10_h = new Image();
            img10_h.name = "img10_h_" + _opt.curX + "_" + _opt.curY;
            img10_h.src = imagePath + "act-xxhg-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img10_h, type: "T" });

            obj.setCurrentPoint(_opt, _opt.direction);
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: null, type: "L" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img12_h = new Image();
            img12_h.name = "img12_h_" + _opt.curX + "_" + _opt.curY;
            img12_h.src = imagePath + "act-hb-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img12_h, type: "R" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img13_h = new Image();
            img13_h.name = "img13_h_" + _opt.curX + "_" + _opt.curY;
            img13_h.src = imagePath + "act-tbx-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img13_h, type: "C" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img14_h = new Image();
            img14_h.name = "img14_h_" + _opt.curX + "_" + _opt.curY;
            img14_h.src = imagePath + "act-hb-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img14_h, type: "R" });

            obj.setCurrentPoint(_opt, _opt.direction);
            var img15_h = new Image();
            img15_h.name = "img15_h_" + _opt.curX + "_" + _opt.curY;
            img15_h.src = imagePath + "act-xxhg-2.png";
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: img15_h, type: "T" });

            obj.setCurrentPoint(_opt, _opt.direction);
            imageHover.push({ x: _opt.curX, y: _opt.curY, img: null, type: "L" });


            img_bg.onload = function () {
                ctx_bg.drawImage(img_bg, 0, 0, _opt.maxX, _opt.maxY);
            }

            var imgClick1 = new Image();
            imgClick1.src = imagePath + "act-jbx-3.png";
            imageClick.push({ type: "G", img: imgClick1 });

            var imgClick2 = new Image();
            imgClick2.src = imagePath + "act-ybx-3.png";
            imageClick.push({ type: "A", img: imgClick2 });

            var imgClick3 = new Image();
            imgClick3.src = imagePath + "act-tbx-3.png";
            imageClick.push({ type: "C", img: imgClick3 });

            var imgClick4 = new Image();
            imgClick4.src = imagePath + "act-hb-3.png";
            imageClick.push({ type: "R", img: imgClick4 });


        },
        drawMoveBox: function () {
            //    画移动的盒子
            t1 = new Date();
            if (t1 - t2 > _opt.marginMillisecond || !t2) {

                if (_opt.marginMillisecond > 0 && speedUp && currentBaseStrategy.step[0] > 0) {
                    // 加速
                    _opt.marginMillisecond -= 100;
                    currentBaseStrategy.step[0]--;
                }
                else if (!speedUp && currentBaseStrategy.step[2] > 0) {
                    // 减速
                    _opt.marginMillisecond += 85;
                    currentBaseStrategy.step[2]--;
                }
                else {
                    // 高匀速
                    if (currentBaseStrategy.step[1] > 0) {
                        currentBaseStrategy.step[1]--;
                    }
                    else {
                        speedUp = false;
                    }
                }

                ctx.clearRect(0, 0, _opt.maxX, _opt.maxY);

                if (!ctx) ctx = document.getElementById("canvas_0").getContext("2d");

                obj.setCurrentPoint(_opt, _opt.direction);

                var hoverObj = imageHover.find(function (i) { return i.x == _opt.curX && i.y == _opt.curY });
                if (!!hoverObj.img) {
                    ctx.drawImage(hoverObj.img, _opt.curX, _opt.curY);
                }

                ctx.strokeStyle = "#f82f14";
                ctx.lineWidth = 4;
                ctx.strokeRect(_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);

                t2 = t1;
            }

            obj.animateFloatBox();
        },
        animateFloatBox: function () {
            if (currentBaseStrategy.step.every(function (s) { return s === 0 }) && !speedUp) {
                obj.stopAnimate();

                // 根据当前图片内容，来决定是否继续触发其它动画
                if (!!currentBaseStrategy.strateType) {
                    currentStrategy = strategy.find(function (s) { return s.type == currentBaseStrategy.strateType; });
                    obj.animateLightBorder();
                    arcPoint.marginTime = 30;
                }
                else {
                    // 无其它动画，触发开奖动画
                    // 触发奖品附加动画
                    var h = imageHover.find(function (i) { return i.x == _opt.curX && i.y == _opt.curY; });

                    if (h.type != "T") {
                        randomGold(30, _opt.curX, _opt.curY);
                        currentAnimateBoxObjs.push({ type: h.type, context: ctx, x: _opt.curX, y: _opt.curY, marginTime: 30, t1: "", t2: "", step: 600, gold: goldData });
                        obj.attachAnimateOpenBox();
                    }

                    obj.resultAnimate();
                }
            }
            else {
                animateId = requestAnimationFrame(obj.drawMoveBox);
            }

        },
        drawLightBorder: function () {
            ctx.clearRect(_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);

            lightNum++;
            ctx.strokeStyle = lightColors[lightNum % 4];
            ctx.strokeRect(_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);

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

                    // 触发奖品附加动画
                    var h = imageHover.find(function (i) { return i.x == currentStrategy.x && i.y == currentStrategy.y; });

                    if (h.type != "T") {
                        randomGold(30, currentStrategy.x, currentStrategy.y);
                        currentAnimateBoxObjs.push({ type: h.type, context: ctxObj, x: currentStrategy.x, y: currentStrategy.y, marginTime: 30, t1: "", t2: "", step: 600, gold: goldData });
                        obj.attachAnimateOpenBox();
                    }

                    currentStrategy.x = 0;
                    currentStrategy.y = 0;
                }
                if (currentStrategy.step.every(function (s) { return s == 0; })) {
                    cancelAnimationFrame(animateStrategyId);
                    cancelAnimationFrame(animateLightId);
                    console.log("恭喜您,中奖啦！！！");
                    obj.resultAnimate();
                    arcPoint.marginTime = 1000;
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
                    cancelAnimationFrame(animateStrategyId);
                    return;
                }

                var r = { x: currentStrategy.x, y: currentStrategy.y };
                if (currentStrategy.x == 0 && currentStrategy.y == 0) {
                    currentStrategy.x = _opt.curX;
                    currentStrategy.y = _opt.curY;
                }
                else {
                    ctxObj.clearRect(0, 0, _opt.maxX, _opt.maxY);
                }

                r = obj.getNextPoint(currentStrategy.x, currentStrategy.y, true);
                currentStrategy.x = r.x;
                currentStrategy.y = r.y;

                var hoverObj = imageHover.find(function (i) { return i.x == currentStrategy.x && i.y == currentStrategy.y });
                if (!!hoverObj.img) {
                    ctxObj.drawImage(hoverObj.img, currentStrategy.x, currentStrategy.y);
                }

                ctxObj.strokeStyle = "#f82f14";
                ctxObj.lineWidth = 4;
                ctxObj.strokeRect(currentStrategy.x, currentStrategy.y, _opt.boxW, _opt.boxH);

                t2 = t1;
            }

            obj.animateStrategy();
        },
        drawFlicker: function () {
            if (!ctx_l) { ctx_l = document.getElementById("canvas_l").getContext("2d"); ctx_l.globalAlpha = 0.5; }

            arcPoint.t1 = new Date();

            if (arcPoint.t1 - arcPoint.t2 > arcPoint.marginTime || !arcPoint.t2)
            {
                ctx_l.clearRect(0, 0, _opt.maxX, _opt.maxY);
                for (var i = 0; i < arcPointData.length; i++) {
                    ctx_l.beginPath();
                    ctx_l.fillStyle = arcPointData[i].c[parseInt(Math.random() * 10) % 3];
                    ctx_l.arc(arcPointData[i].x, arcPointData[i].y, arcPointData[i].r, 0, Math.PI * 2);

                    ctx_l.fill();
                }
                arcPoint.t2 = arcPoint.t1;
            }

            animateFlickerId = requestAnimationFrame(obj.drawFlicker);
        },
        attachAnimateFlicker: function () {
            arcPointData = [];
            do {
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
                var temp = Object.assign({}, arcPoint);
                arcPointData.push(temp);

            } while (!(arcPoint.x == arcPoint.margin[1] + arcPoint.r && arcPoint.y == arcPoint.margin[1] + arcPoint.r) || arcPointData.length == 1);

            obj.drawFlicker();
        },
        attachAnimateOpenBox: function () {
            //    金宝箱
            for (var i = 0; i < currentAnimateBoxObjs.length; i++) {
                var currentAnimateObj = currentAnimateBoxObjs[i];
                if (currentAnimateObj.step <= 0) continue;

                if (currentAnimateObj.step < 0) {
                    cancelAnimationFrame(attachAnimateGId);
                    return;
                }

                currentAnimateObj.t1 = new Date();
                if (currentAnimateObj.t1 - currentAnimateObj.t2 > currentAnimateObj.marginTime || !currentAnimateObj.t2) {

                    var currentContextObj = currentAnimateObj.context;
                    currentContextObj.clearRect(0, 0, _opt.maxX, _opt.maxY);

                    var clickImg = imageClick.find(function (i) { return i.type == currentAnimateObj.type });
                    currentContextObj.drawImage(clickImg.img, currentAnimateObj.x, currentAnimateObj.y);

                    for (var i = 0; i < currentAnimateObj.gold.length; i++) {
                        currentAnimateObj.gold[i].x += currentAnimateObj.gold[i].vx;
                        currentAnimateObj.gold[i].y += currentAnimateObj.gold[i].vy;
                        currentAnimateObj.gold[i].vy += currentAnimateObj.gold[i].g;

                        //if (currentAnimateObj.gold[i].y >= currentAnimateObj.y + _opt.boxH) {
                        //    currentAnimateObj.gold[i].y = currentAnimateObj.y + _opt.boxH;
                        //    currentAnimateObj.gold[i].vy = -currentAnimateObj.gold[i].vy * 0.75;
                        //}

                        if (currentAnimateObj.gold[i].y >= _opt.maxY) {
                            currentAnimateObj.gold[i].y = _opt.maxY;
                            currentAnimateObj.gold[i].vy = -currentAnimateObj.gold[i].vy * 0.75;
                        }

                        currentContextObj.drawImage(currentAnimateObj.gold[i].img, currentAnimateObj.gold[i].x, currentAnimateObj.gold[i].y);
                    }

                    currentContextObj.strokeStyle = "#f82f14";
                    currentContextObj.lineWidth = 4;
                    currentContextObj.strokeRect(currentAnimateObj.x, currentAnimateObj.y, _opt.boxW, _opt.boxH);

                    currentAnimateObj.step--;

                    currentAnimateObj.t2 = currentAnimateObj.t1;
                }

            }


            attachAnimateGId = requestAnimationFrame(obj.attachAnimateOpenBox);
        },

        beginAnimate: function () {
            //    开始动画
            if (!isBegin) {
                return;
            }
            else {
                this.isBegin = false;
            }

            if (_opt.isLogin && _opt.isAllow) {
                ctx = document.getElementById("canvas_0").getContext("2d");
                ctx1 = document.getElementById("canvas_1").getContext("2d");
                ctx2 = document.getElementById("canvas_2").getContext("2d");
                ctx3 = document.getElementById("canvas_3").getContext("2d");
                ctx4 = document.getElementById("canvas_4").getContext("2d");

                //-----正式
                $.invoke_api({ NewVerAct_GetAwardMoney: {} }, {
                    success: function (data, textStatus, jqXHR) {
                        switch (data.Status) {
                            case 1:
                                console.log(data);
                                if (!!data.row) {
                                    var rs = data.row.RandomStrategy;
                                    var ss = data.row.StrongStrategy;
                                    var amount = (168 + parseFloat(data.row.Award)) / 680;

                                    var rsn = parseInt(Math.random() * 10) % rs.length;
                                    var ssn = parseInt(Math.random() * 10) % ss.length;

                                    // 初始用户策略
                                    currentBaseStrategy = baseStrategy.find(function (s) { return (s.type == rs[rsn] && !s.strateType) || (s.type == rs[rsn] && s.strateType == ss[ssn]); });
                                    totalAmount.t = rs[rsn];
                                    totalAmount.k = ss[ssn];
                                    totalAmount.amount = amount;

                                    obj.animateFloatBox();
                                }


                                break;
                            case 1602:
                                var rs = ["T1","T2","T3","T4"];

                                var rsn = parseInt(Math.random() * 10) % rs.length;

                                // 初始用户策略
                                currentBaseStrategy = baseStrategy.find(function (s) { return (s.type == rs[rsn] && !s.strateType); });
                                totalAmount.t = rs[rsn];
                                totalAmount.k = "";
                                totalAmount.amount = 0;

                                obj.animateFloatBox();
                                break;
                            case 1603://活动未开始
                                $('body').parent().Dialog({
                                    type: "Ask",
                                    title: "温馨提示",
                                    messageTitle: "活动未开始",
                                    message: "抽奖活动暂未开始，请参照活动时间说明进行抽奖",
                                    buttons: [{         // 排列顺序从左到右
                                        name: "确定",
                                        callback: function () { closeDialog(0); }
                                    }],
                                    closeHandler: function () { closeDialog(0); } // 右上角关闭按钮执行事件
                                });
                                break;
                            case 1604:// 活动已结束
                                $('body').parent().Dialog({
                                    type: "Ask",
                                    title: "温馨提示",
                                    messageTitle: "活动已结束",
                                    message: "抽奖活动已结束",
                                    buttons: [{         // 排列顺序从左到右
                                        name: "确定",
                                        callback: function () { closeDialog(0); }
                                    }],
                                    closeHandler: function () { closeDialog(0); } // 右上角关闭按钮执行事件
                                });
                                break;
                            case 1605:// 奖励已领取
                                $('body').parent().Dialog({
                                    type: "Ask",
                                    title: "温馨提示",
                                    messageTitle: "奖励已领取",
                                    message: "您已完成了今天抽奖，明天再来吧！",
                                    buttons: [{         // 排列顺序从左到右
                                        name: "确定",
                                        callback: function () { closeDialog(0); }
                                    }],
                                    closeHandler: function () { closeDialog(0); } // 右上角关闭按钮执行事件
                                });
                                break;
                            case 1606:// 正在领取中
                                $('body').parent().Dialog({
                                    type: "Ask",
                                    title: "温馨提示",
                                    messageTitle: "正在领取中",
                                    message: "您已完成了今天抽奖，奖品还在领取中，请查看主账户金额。稍后如没到账，请联系客服！",
                                    buttons: [{         // 排列顺序从左到右
                                        name: "确定",
                                        callback: function () { closeDialog(0); }
                                    }],
                                    closeHandler: function () { closeDialog(0); } // 右上角关闭按钮执行事件
                                });
                                break;
                            case -9:
                                $('body').parent().Dialog({
                                    type: "Ask",
                                    title: "温馨提示",
                                    messageTitle: "系统维护中",
                                    message: "抽奖活动正在维护，如有其它疑问，请联系客服",
                                    buttons: [{         // 排列顺序从左到右
                                        name: "确定",
                                        callback: function () { closeDialog(0); }
                                    }],
                                    closeHandler: function () { closeDialog(0); } // 右上角关闭按钮执行事件
                                });
                                break;
                            default:
                                $('body').parent().Dialog({
                                    type: "Ask",
                                    title: "温馨提示",
                                    messageTitle: "系统维护中",
                                    message: "抽奖活动正在维护，如有其它疑问，请联系客服",
                                    buttons: [{         // 排列顺序从左到右
                                        name: "确定",
                                        callback: function () { closeDialog(0); }
                                    }],
                                    closeHandler: function () { closeDialog(0); } // 右上角关闭按钮执行事件
                                });
                                break;
                        }
                    },
                    error: function (jqXHR, textStatus) {
                    }
                });

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

            if (!totalAmount.t2 && totalAmount.amount == 0) {
                _opt.callBack();
                ctx_bg.save();
                ctx_bg.translate(300, 250);

                ctx_bg.font = "48px serif";

                var amount = totalAmount.amount.toFixed(1);

                ctx_bg.clearRect(0, 0, 440, 68);
                ctx_bg.fillStyle = "#ecd8a3";
                ctx_bg.fillRect(0, 0, 440, 68);

                ctx_bg.beginPath();
                ctx_bg.font = "18px Microsoft YaHei";
                ctx_bg.fillStyle = "#ab6938";
                ctx_bg.fillText("非常遗憾！本次未能中奖，希望您明天再接再厉！", 34, 45);
                ctx_bg.restore();
                return;
            }

            if (totalAmount.t1 - totalAmount.t2 > totalAmount.marginTime || !totalAmount.t2) {
                ctx_bg.save();
                ctx_bg.translate(300, 250);

                ctx_bg.font = "48px serif";

                var amount = totalAmount.amount.toFixed(1);

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

                if (amount < 10 && amount > 0) {
                    totalAmount.payAmount += 0.1;
                    totalAmount.amount -= 0.1;
                }
                else if (amount < 200 && amount >= 10) {
                    totalAmount.payAmount += 10;
                    totalAmount.amount -= 10;
                }
                else if (amount < 2000 && amount >= 200) {
                    totalAmount.payAmount += 100;
                    totalAmount.amount -= 100;
                }
                else {
                    cancelAnimationFrame(resultAnimateId);
                    _opt.callBack();
                    $.invoke_api({ NewVerAct_AcceptAward: {} }, {
                        success: function (data, textStatus, jqXHR) {
                            switch (data.Status) {
                                case 16: loginConponent.Show(); break;
                                case 1:
                                    console.log("查看钱包");

                                    break;
                                case -9:// 系统异常
                                    $('body').parent().Dialog({
                                        type: "Ask",
                                        title: "温馨提示",
                                        messageTitle: "领取错误",
                                        message: "奖金领取时发生错误，请联系客服",
                                        buttons: [{
                                            name: "确定",
                                            callback: function () { closeDialog(0); }
                                        }],
                                        closeHandler: function () { closeDialog(0); } // 右上角关闭按钮执行事件
                                    });
                                    break;
                                default:
                                    $('body').parent().Dialog({
                                        type: "Ask",
                                        title: "温馨提示",
                                        messageTitle: "领取异常",
                                        message: "奖金领取时发生错误，请联系客服",
                                        buttons: [{         // 排列顺序从左到右
                                            name: "确定",
                                            callback: function () { closeDialog(0); }
                                        }],
                                        closeHandler: function () { closeDialog(0); } // 右上角关闭按钮执行事件
                                    });
                                    break;
                            }
                        },
                        error: function (jqXHR, textStatus) {
                            $('body').parent().Dialog({
                                type: "Ask",
                                title: "温馨提示",
                                messageTitle: "领取异常",
                                message: "奖金领取时发生错误，请联系客服",
                                buttons: [{         // 排列顺序从左到右
                                    name: "确定",
                                    callback: function () { closeDialog(0); }
                                }],
                                closeHandler: function () { closeDialog(0); } // 右上角关闭按钮执行事件
                            });
                        }
                    });


                    return;
                }

                totalAmount.t2 = totalAmount.t1;
            }

            obj.resultAnimate();
        }
    };

    function randomGold(n, pointX, pointY) {
        goldData = [];
        for (var i = 0; i < n; i++) {
            var imgGold = new Image();
            imgGold.src = imagePath + "jb" + (i % 5 == 0 ? 1 : i % 5) + ".png";
            var p = {
                x: pointX + Math.random() * 120,
                y: pointY + _opt.boxH - Math.random() * 20,
                vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 5,
                vy: -30,
                g: 1.5 + Math.random(),
                img: imgGold
            }
            goldData.push(p);
        }
    }
}

