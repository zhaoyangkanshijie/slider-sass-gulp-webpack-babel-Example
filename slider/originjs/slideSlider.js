let slideSlider = slideSlider || ($ => {
    let index = 1,//第index+1张图
		timer = null,//轮播定时器
        xwidth = null,//一张图的宽度
        slideLength = null,//轮播图张数
		intervalTime = null,//轮播时间
		playTime = null,//轮播效果时间
		playWhenHover = null;//鼠标悬停在广告上，是否轮播？
		//tag = 0;

	//箭头函数
	// 1、对 this 的关联。函数内置 this 的值，取决于箭头函数在哪儿定义，而非箭头函数执行的上下文环境。
	// 2 、new 不可用。箭头函数不能使用 new 关键字来实例化对象，不然会报错。
	// 3、this 不可变。函数内置 this 不可变，在函数体内整个执行环境中为常量。
	// 4、没有arguments对象。

	// let sum = (num1, num2) => num1 + num2;
	// // 等同于：
	// let sum = let(num1, num2) {    
	// 	return num1 + num2;
	// };
	// let getTempItem = id => ({
	// 	id: id,
	// 	name: "Temp"
	// });
	// // 等同于:
	// let getTempItem = let(id) {
	// return {
	// 	id: id, 
	// 	name: "Temp"
	// 	};
	// };

	// 什么时候你不能使用箭头函数？
	// 1. 定义对象方法(方法，原型)
	// 2. 事件回调函数(button.addEventListener('click', () => {})
	// 3. 定义构造函数const Message = (text) => {this.text = text;};


	//检查index是否越界
	let judgeIndexBound = () => {
		if(index < 1){
			index = 5;
		}else if(index > 5){
			index = 1;
		}
	}

	//最后一张轮播图移动到第一张
	let endToBegin = () => {
		//console.log("endToBegin");
		$('.slide-slider .slide-slides .slide-slider-list:last-child').prependTo($('.slide-slider .slide-slides'));
	}

	//第一张轮播图移动到最后一张
	let beginToEnd = () => {
		//console.log("beginToEnd");
		$('.slide-slider .slide-slides .slide-slider-list:first-child').appendTo($('.slide-slider .slide-slides'));
	}

	//重置为第二屏
	let setScreenTo = ScreenNumber => {
		//console.log("setScreenTo"+ScreenNumber);
		$('.slide-slider .slide-slides').css("left", -(ScreenNumber - 1) * xwidth);
	}

	//改变导航点样式
	let turnTo = NavDotNumber => {
		//console.log("turnTo"+NavDotNumber);
		$('.slide-slider .slide-slider-ctrl span').removeClass('active').eq(NavDotNumber-1).addClass('active');
	}

	//向前滑动动画
	let prev_anim = () => {
		//console.log("before_prev_anim:"+index);
		if (!$('.slide-slider .slide-slides').is(":animated")){
			index--;
			//console.log("prev_anim:"+index);
			if(index < 1){
				//(1)2345
				//(5)1234
				//screen->5(1)234
				//move->(5)1234
				//(1)2345
				//screen->1234(5)
				pause();
				endToBegin();
				setScreenTo(2);
				$('.slide-slider .slide-slides').animate({
					left: 0//2屏到1屏
				}, playTime, () => {
					index = slideLength;
					setScreenTo(slideLength);
					beginToEnd();
					turnTo(index);
					autoplay();
				});
			}
			else{
				move_anim(index);
			}
		}
	}

	//向后滑动动画
	let next_anim = () => {
		//console.log("before_next_anim:"+index);
		if (!$('.slide-slider .slide-slides').is(":animated")){
			index++;
			//console.log("next_anim:"+index);
			if(index > slideLength){
				//1234(5)
				//2345(1)
				//screen->234(5)1
				//move->2345(1)
				//1234(5)
				//screen->(1)2345
				pause();
				beginToEnd();
				setScreenTo(slideLength-1);
				$('.slide-slider .slide-slides').animate({
					left: (1-slideLength) * xwidth
				}, playTime, () => {
					index = 1;
					setScreenTo(index);
					endToBegin();
					turnTo(index);
					pause();
					autoplay();
				});
			}
			else{
				move_anim(index);
			}
		}
	}

	//移动到指定屏
	let move_anim = ScreenNumber => {
		if (!$('.slide-slider .slide-slides').is(":animated")){//注释后，解决触屏点击没反应
			pause();
			//console.log("move_anim:"+ScreenNumber);
			$('.slide-slider .slide-slides').animate({
				left: (1 - ScreenNumber) * xwidth
			}, playTime);
			turnTo(index);
			pause();
			autoplay();
		}
	}

	//开始轮播(autoplay前，立即执行pause，防止click next后，animate没执行完，就不hover，导致pause抽风)
	let autoplay = () => {
		//console.log("autoplay");
		//tag++;
		//console.log(tag);
		timer = setInterval(next_anim,intervalTime);
	}

	//停止轮播
	let pause = () =>  {
		//console.log("pause");
		//tag--;
		//tag = tag < 0 ? 0 :tag;
		//console.log(tag);
		clearInterval(timer);
	}

	//手指滑动
	let touchEvent = () => {
		let startX = 0;//触摸开始位置
		let changeX = 0;//移动距离
		let touchFlag = false;//是否触摸
		let touchMovePercent = 0;//移动百分比
		let status = 0;//情况：0：重置；1：1屏向前拉，2:最后1屏向后拉，3：其余状况
		let endX = 0;//最终移动距离

		//前后按钮触摸事件
        $('.slide-slider .slide-slider-prev').on("touchstart",prev_anim);
		$('.slide-slider .slide-slider-next').on("touchstart",next_anim);

		//触摸导航点
		$('.slide-slider .slide-slider-ctrl span').on("touchstart",function(e) {
			if(!$('.slide-slider .slide-slides').is(":animated")){
				index = $('.slide-slider-ctrl span').index($(this)) + 1;
				move_anim(index);
			}
		});
		
		//开始触摸时间
		$(".slide-slider").on("touchstart",function(e) {
			//监测到touch行为，显示前后箭头
			$('.slide-slider .slide-slider-prev,.slide-slider .slide-slider-next').css("visibility","visible");
			
			if($('.slide-slider .slide-slides').is(":animated")) return;
			touchFlag = true;
			pause();
			startX = e.originalEvent.changedTouches[0].pageX;
			//console.log(startX);
			//console.log("touchstart detected!");
		});
		
		//触摸移动事件
		$(".slide-slider").on("touchmove",function(e) {
			pause();
			//console.log(touchFlag);
			if($('.slide-slider .slide-slides').is(":animated")){
				startX = e.originalEvent.changedTouches[0].pageX;
				return;
			}
			if(touchFlag == false){
				startX = e.originalEvent.changedTouches[0].pageX;
				touchFlag = true;
			}
			changeX = e.originalEvent.changedTouches[0].pageX - startX;
			touchMovePercent = changeX / window.innerWidth *100;
			if(index == 1){
				//只要是1，预先把last放到前面，5(1)234
				if(status != 1){
					status = 1;
					endToBegin();
					setScreenTo(2);
				}
				if(!$('.slide-slider .slide-slides').is(":animated")){
					$('.slide-slider .slide-slides').animate({
						left: -xwidth+changeX
					},0);
				}
			}
			else if(index == slideLength){
				//只要是last，预先把1放到后面，234(5)1
				if(status != 2){
					status = 2;
					beginToEnd();
					setScreenTo(slideLength-1);
				}
				if(!$('.slide-slider .slide-slides').is(":animated")){
					$('.slide-slider .slide-slides').animate({
						left: (2-slideLength)*xwidth+changeX
					},0);
				}
			}
			else{
				if(status != 3){
					status = 3;
				}
				if(!$('.slide-slider .slide-slides').is(":animated")){
					$('.slide-slider .slide-slides').animate({
						left: (1-index)*xwidth+changeX
					},0);
				}
			}
			//console.log(changeX);
			endX = changeX;
			//console.log(touchMovePercent);
			//console.log("touchmove detected!");
		});
		
		//触摸结束事件
		$(".slide-slider").on("touchend",function(e) {
			if($('.slide-slider .slide-slides').is(":animated")) return;
			touchFlag = false;
			if(touchMovePercent >= 20){
				//向前翻页
				if(status == 1){
					//console.log("向前翻页,status=1");
					//5(1-x)234
					//move->(5)1234
					//(1)2345
					//screen->1234(5)
					$('.slide-slider .slide-slides').animate({
						left: (1 - index) * xwidth
					}, playTime,() =>{
						index = slideLength;
						beginToEnd();
						setScreenTo(index);
					});
				}
				else if(status == 2){
					//console.log("向前翻页,status=2");
					//234(5-x)1
					//position->1234(5-x)
					//move->123(4)5
					endToBegin();
					$('.slide-slider .slide-slides').css("left", -(slideLength - 1) * xwidth + endX);
					index--;
					move_anim(index);
				}
				else{
					//console.log("向前翻页,status=3");
					//i->j
					index--;
					move_anim(index);
				}
			}else if(touchMovePercent <= -20){
				//向后翻页
				if(status == 1){
					//console.log("向后翻页,status=1");
					//5(1+x)234
					//position->(1+x)2345
					//move->1(2)345
					beginToEnd();
					$('.slide-slider .slide-slides').css("left", endX);
					index++;
					move_anim(index);
				}
				else if(status == 2){
					//console.log("向后翻页,status=2");
					//234(5+x)1
					//move->2345(1)
					//1234(5)
					//screen->(1)2345
					$('.slide-slider .slide-slides').animate({
						left: (1 - index) * xwidth
					}, playTime,() =>{
						index = 1;
						endToBegin();
						setScreenTo(index);
					});
				}
				else{
					//console.log("向后翻页,status=3");
					//i->j
					index++;
					move_anim(index);
				}
			}else{
				//恢复原位
				if(status == 1){
					//console.log("恢复原位,status=1");
					//5(1~x)234
					//5(1)234
					//1(2)345
					//screen->(1)2345
					$('.slide-slider .slide-slides').animate({
						left:  -index * xwidth
					}, playTime,() =>{
						beginToEnd();
						setScreenTo(index);
					});
				}
				else if(status == 2){
					//console.log("恢复原位,status=2");
					//234(5~x)1
					//234(5)1
					//123(4)5
					//screen->1234(5)
					$('.slide-slider .slide-slides').animate({
						left:  (2-index) * xwidth
					}, playTime,() =>{
						endToBegin();
						setScreenTo(index);
					});
				}
				else{
					//console.log("恢复原位,status=3");
					//i->i
					move_anim(index);
				}
			}
			touchMovePercent = 0;
			status = 0;
			endX = 0;
			//console.log("touchend detected!");
			
			pause();
			autoplay();
		});
	}

	return {
		//初始化函数：传入设置的值
		init: data => {
			intervalTime = data.intervalTime,
			playTime = data.playTime,
			playWhenHover = data.playWhenHover;
			slideLength = $('.slide-slider .slide-slides .slide-slider-list').length;
			//自动设置ul和li宽度
			let percision = parseFloat(parseInt(100/slideLength*100000))/100000;
			//console.log(percision);
			$('.slide-slider .slide-slides').css("width",slideLength*100+"%");
			$('.slide-slider .slide-slides .slide-slider-list').css("width",percision+"%");
			xwidth = $('.slide-slider .slide-slides .slide-slider-list').eq(0).width();
			
			autoplay();

			//前后按钮点击事件
            $('.slide-slider .slide-slider-prev').on("click",prev_anim);
			$('.slide-slider .slide-slider-next').on("click",next_anim);

			//导航点点击事件
            $('.slide-slider .slide-slider-ctrl span').on("click",function() {
				index = $('.slide-slider-ctrl span').index($(this)) + 1;
				//console.log("nav click:"+index);
				move_anim(index);
			});

			//广告鼠标悬停事件：设置是否轮播
			$('.slide-slider').hover(() =>{
				if(playWhenHover == false){
					pause();
				}
			},() =>{
				if(playWhenHover == false){
					pause();
					autoplay();
				}
			});

			touchEvent();

			//屏幕宽度变化适应
			$(window).resize( () =>{
			    xwidth = $('.slide-slider .slide-slides .slide-slider-list').eq(0).width();
			    setScreenTo(index);
			    turnTo(index);
			});
        }
	}

})($);



    
