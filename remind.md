```javascript
<html>
	<head>
		<meta charset="utf-8">
		<title>测试</title>

		<link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.3/css/bootstrap.min.css" rel="stylesheet">
		<script src="https://cdn.bootcss.com/jquery/3.1.0/jquery.min.js"></script>
	 
		<style type="text/css">
			.container{
				position: relative;
				border: 1px solid red;
				height: 900px;

			}
			canvas{
				position: absolute;
			}
			#canvas_bg{
				z-index: -2;
			}
			#canvas{
				z-index: -1;				
			}
			#canvas_1{
				z-index: 1;
			}
			#canvas_2{
				z-index: 2;
			}
			#canvas_3{
				z-index: 3;
			}
		</style>

	</head>
	<body>
		<div class="container">
			<canvas id="canvas_bg" width="1028" height="712"></canvas>
			<canvas id="canvas" width="1028" height="712"></canvas>
			<canvas id="canvas_1" width="1028" height="712"></canvas>
			<canvas id="canvas_2" width="1028" height="712"></canvas>
			<canvas id="canvas_3" width="1028" height="712"></canvas>
		</div>
		<button onclick="begin()">开始</button>
	</body>
</html>

<script type="text/javascript">
	function bx() { 
	var _opt = { 
		isAllow:true, 
		isLogin:true, 
		id:"canvas", 
		curX:0, 
		curY:0,
		maxX:1028, 
		maxY:712, 
		boxW:150, 
		boxH:150, 
		boxB:4, 
		pading:40, 
		direction:true, // 顺时针 false：逆时针 
		rules:[], 
		lapCount:5, 
		marginMillisecond:500, 
		totalMillisecond:2*1000, 
		callBack: function () {} 
	};

	var ctx,ctx1,ctx2;
	var obj;
	var animateId,animateLightId;
	var t1,t2;
	var speedUp = true;
	var speedTimeOut;
	var totalStep = 0; // 减速之后的步数
	var lightNum = 0; // 闪动色块
	var lightColors = ["blue","grey","yellow","green"];
	var strategy = [// 第一次触发之后存在的特效组合，随机产生
	    {type:"shoot",count:1,time:600,x:0,y:0,step:[5],flag:true},
	    {type:"shoot",count:2,time:1200,margin:500,x:0,y:0,step:[3,15],flag:true},
	    {type:"shoot",count:3,time:1800,margin:500,x:0,y:0,step:[6,12,8],flag:true}
	];
	var currentStrategy;
	var lightTriggerInverval;
	var animateStrategyId;

	return {
	    init:function(option){
	        //    初始化场景
	        _opt = $.extend(_opt,option);
	        obj = this;

	        obj.drawBg();
	    },
	    setCurrentPoint: function (_opt,direction) {
	    //        计算坐标点位置
	        if (direction){
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
	        else{
	        //    逆时针
	        }
	    },
	    getNextPoint: function (x,y,direction) {
	        if (direction){
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
	                y= y - 2 * _opt.boxB - _opt.boxH;
	            }
	            else {
	                x = _opt.pading + _opt.boxB;
	                y = _opt.pading + _opt.boxB;
	            }
	        }
	        else{

	        }

	        return {x:x,y:y};
	    },
	    drawBg:function() {
	    	var ctx_bg = document.getElementById("canvas_bg").getContext("2d");
	   
	    	// 画背景图层
	    	// 
	    	var img1 = new Image();
	    	img1.src = "../animate/image/1.png";
	    
	    	img1.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img1,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	}; 
 
	    	var img2 = new Image();
	    	img2.src = "../animate/image/2.png";
	   
	    	img2.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img2,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};  
	    	
	    	var img3 = new Image();
	    	img3.src = "../animate/image/3.png";
	    	img3.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img3,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	}; 
	    	
	    	var img4 = new Image();
	    	img4.src = "../animate/image/4.png";
	    	img4.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img4,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	}; 

	    	var img5 = new Image();
	    	img5.src = "../animate/image/5.png";
	    	img5.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img5,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	}; 

	    	var img6 = new Image();
	    	img6.src = "../animate/image/6.png";
	    	img6.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img6,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};

	    	var img7 = new Image();
	    	img7.src = "../animate/image/7.png";
	    	img7.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img7,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};
	    	
	    	var img8 = new Image();
	    	img8.src = "../animate/image/8.png";
	    	img8.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img8,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};
	    	
	    	var img9 = new Image();
	    	img9.src = "../animate/image/9.png";
	    	img9.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img9,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};
	    	
	    	var img10 = new Image();
	    	img10.src = "../animate/image/10.png";
	    	img10.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img10,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};
	    	
	    	var img11 = new Image();
	    	img11.src = "../animate/image/11.png";
	    	img11.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img11,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};

	    	var img12 = new Image();
	    	img12.src = "../animate/image/12.png";
	    	img12.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img12,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};

	    	var img13 = new Image();
	    	img13.src = "../animate/image/13.png";
	    	img13.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img13,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};

	    	var img14 = new Image();
	    	img14.src = "../animate/image/14.png";
	    	img14.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img14,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};

	    	var img15 = new Image();
	    	img15.src = "../animate/image/15.png";
	    	img15.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img15,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};

	    	var img16 = new Image();
	    	img16.src = "../animate/image/16.png";
	    	img16.onload = function(){
	    		obj.setCurrentPoint(_opt, _opt.direction);
            	ctx_bg.drawImage(img16,_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);	    		
	    	};
	    },
	    drawMoveBox:function(){
	        //    画移动的盒子
	        t1 = new Date();
	        if (t1 - t2 > _opt.marginMillisecond && _opt.marginMillisecond < _opt.totalMillisecond || !t2) {

	            if (_opt.marginMillisecond > 0 && speedUp) {
	                _opt.marginMillisecond -= 50;
	            }
	            else if (!speedUp) {
	                _opt.marginMillisecond += 85;
	                //+140,; +120,7; +100,8; +90,9; +80,10,+75,11; +70,12; +65,13; +60,14; +55,15

	            }
	            else {
	                if (!speedTimeOut) {
	                    speedTimeOut = setTimeout(function () {
	                        speedUp = false;
	                    }, 1 * 860);
	                    /*
	                    *
	                    *
	                    * 850,
	                    * 860,72
	                    * 870,73
	                    * 880,72
	                    * 890,73
	                    * 895,74
	                    * 900,75
	                    * 910,75
	                    * 920,76
	                    * 930,76
	                    * 940,76
	                    * 950,77
	                    * 960,78
	                    * 970,79
	                    * 980,79
	                    * 990,80
	                    * 1000,80
	                    * 1010,81
	                    * 1020,82
	                    * 1030,82
	                    * 1040,82
	                    * 1050,84
	                    * 1060,84
	                    * 1070,85
	                    * 1080,85
	                    * 1090,86
	                    * 1100,86
	                    * */
	                }
	            }

	            ctx.clearRect(0, 0, 1028, 712);

	            if (!ctx) ctx = document.getElementById(_opt.id).getContext("2d");

	            obj.setCurrentPoint(_opt, _opt.direction);
	            ctx.fillStyle = "red";
	            ctx.fillRect(_opt.curX, _opt.curY, _opt.boxW, _opt.boxH);
	            t2 = t1; // 用于控制速度
	        }

	        //console.log(_opt.curX,_opt.curY,_opt.marginMillisecond,_opt.totalMillisecond);

	        obj.animateFloatBox();
	    },
	    animateFloatBox: function () {
	        //    移动盒子
	        //    1.根据规则去触发不同的动画场景，每个动画都单独定义出来
	        var requestAnimationFrame = window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
	            window.msRequestAnimationFrame ||
	            window.mozRequestAnimationFrame ||
	            window.oRequestAnimationFrame;

	        if (_opt.marginMillisecond >= 800 && !speedUp) {
	            obj.stopAnimate();
	            // 根据当前图片内容，来决定是否继续触发其它动画
	            if (true){
	                console.log("开启边框闪动动画，触发下一组动画效果");
	                currentStrategy = strategy[2];
	                obj.animateLightBorder();
	            }
	            else{
	                // 无其它动画，触发开奖动画
	            }
	        }
	        else{
	            animateId = requestAnimationFrame(obj.drawMoveBox);
	        }

	    },
	    drawLightBorder:function(){
	        ctx.clearRect(_opt.curX,_opt.curY,_opt.boxW,_opt.boxH);
	        //console.log(lightNum);
	        lightNum++;
	        ctx.fillStyle=lightColors[lightNum%4];
	        ctx.fillRect(_opt.curX,_opt.curY,_opt.boxW,_opt.boxH);

	        obj.animateLightBorder();
	    },
	    animateLightBorder: function () {
	        //    闪亮边框 场景
	        var requestAnimationFrame = window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
	            window.msRequestAnimationFrame ||
	            window.mozRequestAnimationFrame ||
	            window.oRequestAnimationFrame;

	        animateLightId = requestAnimationFrame(obj.drawLightBorder);
	 
	        if (currentStrategy.flag){
	            currentStrategy.flag = false;
	            obj.animateStrategy();
	        }
	        else{
	            if (currentStrategy.step[currentStrategy.count - 1] == 0 && currentStrategy.count != 0){ 
	                obj.animateStrategy();
	                currentStrategy.count--;
	                console.log("已获得奖金");
	            }
	            if (currentStrategy.step.every(function (s) {return s==0;})){
	                console.log("闪烁结束")
	                cancelAnimationFrame(animateStrategyId);
	                cancelAnimationFrame(animateLightId);
	                alert("恭喜您，您获得的奖金为：");
	            }
	        }
	    },
	    animateStrategy:function(){
	        //    附加电流 场景
	        var requestAnimationFrame = window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
	            window.msRequestAnimationFrame ||
	            window.mozRequestAnimationFrame ||
	            window.oRequestAnimationFrame;

	        animateStrategyId = requestAnimationFrame(obj.drawStrategy);  
	    },
	    drawStrategy: function() {
	        // 执行策略动画
	        t1 = new Date();
	        if (t1 - t2 > 150 || !t2){
	        	var ctxObj = currentStrategy.count == 3?ctx3:(currentStrategy.count == 2 ? ctx2:ctx1);

	            currentStrategy.step[currentStrategy.count - 1]--;

	            if (currentStrategy.step[currentStrategy.count - 1] == 0)
	            {
	                console.log("执行策略动画--结束");
	                cancelAnimationFrame(animateStrategyId);
	                currentStrategy.x = 0;
	                currentStrategy.y = 0;
	                return;
	            }

	            var r = {x:currentStrategy.x,y:currentStrategy.y};
	            if (currentStrategy.x == 0 && currentStrategy.y == 0){
	                currentStrategy.x = _opt.curX;
	                currentStrategy.y = _opt.curY;
	            }
	            else{
	                ctxObj.clearRect(r.x, r.y,_opt.boxW,_opt.boxH);
	            }

	            r = obj.getNextPoint(currentStrategy.x,currentStrategy.y,true);
	            currentStrategy.x = r.x;
	            currentStrategy.y = r.y;
	           
	            ctxObj.fillStyle = "blue";
	            ctxObj.fillRect(currentStrategy.x, currentStrategy.y,_opt.boxW,_opt.boxH);

	            t2 = t1;
	        }

	        obj.animateStrategy();
	    },
	    beginAnimate: function () {
	        //    开始动画
	        if (_opt.isLogin && _opt.isAllow){	        	
	            ctx = document.getElementById(_opt.id).getContext("2d");
	            ctx1 = document.getElementById("canvas_1").getContext("2d");
	            ctx2 = document.getElementById("canvas_2").getContext("2d");
	            ctx3 = document.getElementById("canvas_3").getContext("2d");
	            ctx.globalAlpha = 0.5;
	            ctx.shadowColor = "black";
				ctx.shadowBlur = 10;
	            ctx1.globalAlpha = 0.5;
	            ctx2.globalAlpha = 0.5;
	            ctx3.globalAlpha = 0.5;

	            obj.animateFloatBox();
	        }
	        else if (!_opt.isLogin){
	        //    提示登录后才能进行抽奖
	        }
	        else if (!_opt.isAllow){
	        //    提示已不允许抽奖
	        }
	    },
	    stopAnimate:function(){
	    //    暂停动画
	        cancelAnimationFrame(animateId);
	    },
	    result: function () {
	        //    结果
	    }
	};
}

var b = bx(); 
	b.init({}); 

// 调用 
function begin(){
	
	b.beginAnimate();	
}
</script>
```

