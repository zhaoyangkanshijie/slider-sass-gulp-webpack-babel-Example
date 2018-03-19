let slideSlider = slideSlider || ($ => {
    let index = 1,//第index+1张图
		timer = null,//轮播定时器
        yheight = null,//一张图的高度
        slideLength = null,//轮播图张数
		intervalTime = null,//轮播时间
		playTime = null;//轮播效果时间

	//检查index是否越界
	let judgeIndexBound = () => {
		if(index < 1){
			index = slideLength;
		}else if(index > slideLength){
			index = 1;
		}
	}

	//最后一张轮播图移动到第一张
	let endToBegin = () => {
		//console.log("endToBegin");
		$('.weixin-slider .weixin-slides .weixin-slider-list:last-child').prependTo($('.weixin-slider .weixin-slides'));
	}

	//第一张轮播图移动到最后一张
	let beginToEnd = () => {
		//console.log("beginToEnd");
		$('.weixin-slider .weixin-slides .weixin-slider-list:first-child').appendTo($('.weixin-slider .weixin-slides'));
	}

	//重置为第二屏
	let setScreenTo = ScreenNumber => {
		//console.log("setScreenTo"+ScreenNumber);
		$('.weixin-slider .weixin-slides').css("bottom", -(ScreenNumber - 1) * yheight);
	}

	//改变导航点样式
	let turnTo = NavDotNumber => {
		//console.log("turnTo"+NavDotNumber);
		$('.weixin-slider .weixin-slider-ctrl span').removeClass('active').eq(NavDotNumber-1).addClass('active');
	}

	//向前滑动动画
	let prev_anim = () => {
		//console.log("before_prev_anim:"+index);
		if (!$('.weixin-slider .weixin-slides').is(":animated")){
			index--;
			//console.log("prev_anim:"+index);
			if(index < 1){
				//(1)2345
				//(5)1234
				//screen->5(1)234
				//move->(5)1234
				//(1)2345
				//screen->1234(5)
				endToBegin();
				setScreenTo(2);
				$('.weixin-slider .weixin-slides').animate({
					bottom: 0//2屏到1屏
				}, playTime, () => {
					index = slideLength;
					setScreenTo(slideLength);
					beginToEnd();
					turnTo(index);
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
		if (!$('.weixin-slider .weixin-slides').is(":animated")){
			index++;
			//console.log("next_anim:"+index);
			if(index > slideLength){
				//1234(5)
				//2345(1)
				//screen->234(5)1
				//move->2345(1)
				//1234(5)
				//screen->(1)2345
				beginToEnd();
				setScreenTo(slideLength-1);
				$('.weixin-slider .weixin-slides').animate({
					bottom: (slideLength-1) * yheight
				}, playTime, () => {
					index = 1;
					setScreenTo(index);
					endToBegin();
					turnTo(index);
				});
			}
			else{
				move_anim(index);
			}
		}
	}

	//移动到指定屏
	let move_anim = ScreenNumber => {
		if (!$('.weixin-slider .weixin-slides').is(":animated")){//注释后，解决触屏点击没反应
			//console.log("move_anim:"+ScreenNumber);
			$('.weixin-slider .weixin-slides').animate({
				bottom: (ScreenNumber-1) * yheight
			}, playTime);
			turnTo(index);
		}
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
        $('.weixin-slider .weixin-slider-prev').on("touchstart",prev_anim);
		$('.weixin-slider .weixin-slider-next').on("touchstart",next_anim);

		//触摸导航点
		$('.weixin-slider .weixin-slider-ctrl span').on("touchstart",function(e) {
			if(!$('.weixin-slider .weixin-slides').is(":animated")){
				index = $('.weixin-slider-ctrl span').index($(this)) + 1;
				move_anim(index);
			}
		});
		
		//开始触摸时间
		$(".weixin-slider").on("touchstart",function(e) {
			//监测到touch行为，显示前后箭头
			$('.weixin-slider .weixin-slider-prev,.weixin-slider .weixin-slider-next').css("visibility","visible");
			if($('.weixin-slider .weixin-slides').is(":animated")) return;
			touchFlag = true;
			startX = e.originalEvent.changedTouches[0].pageX;
			//console.log(startX);
			//console.log("touchstart detected!");
		});
		
		//触摸移动事件
		$(".weixin-slider").on("touchmove",function(e) {
			//console.log(touchFlag);
			if($('.weixin-slider .weixin-slides').is(":animated")){
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
				if(!$('.weixin-slider .weixin-slides').is(":animated")){
					$('.weixin-slider .weixin-slides').animate({
						bottom: -yheight+changeX
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
				if(!$('.weixin-slider .weixin-slides').is(":animated")){
					$('.weixin-slider .weixin-slides').animate({
						bottom: (2-slideLength)*yheight+changeX
					},0);
				}
			}
			else{
				if(status != 3){
					status = 3;
				}
				if(!$('.weixin-slider .weixin-slides').is(":animated")){
					$('.weixin-slider .weixin-slides').animate({
						bottom: (1-index)*yheight+changeX
					},0);
				}
			}
			//console.log(changeX);
			endX = changeX;
			//console.log(touchMovePercent);
			//console.log("touchmove detected!");
		});
		
		//触摸结束事件
		$(".weixin-slider").on("touchend",function(e) {
			if($('.weixin-slider .weixin-slides').is(":animated")) return;
			touchFlag = false;
			if(touchMovePercent >= 20){
				//向前翻页
				if(status == 1){
					//console.log("向前翻页,status=1");
					//5(1-x)234
					//move->(5)1234
					//(1)2345
					//screen->1234(5)
					$('.weixin-slider .weixin-slides').animate({
						bottom: (1 - index) * yheight
					}, playTime,() =>{
						index = slideLength;
						beginToEnd();
						setScreenTo(index);
						turnTo(index);
					});
				}
				else if(status == 2){
					//console.log("向前翻页,status=2");
					//234(5-x)1
					//position->1234(5-x)
					//move->123(4)5
					endToBegin();
					$('.weixin-slider .weixin-slides').css("bottom", -(slideLength - 1) * yheight + endX);
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
					$('.weixin-slider .weixin-slides').css("bottom", endX);
					index++;
					move_anim(index);
				}
				else if(status == 2){
					//console.log("向后翻页,status=2");
					//234(5+x)1
					//move->2345(1)
					//1234(5)
					//screen->(1)2345
					$('.weixin-slider .weixin-slides').animate({
						bottom: (1 - index) * yheight
					}, playTime,() =>{
						index = 1;
						endToBegin();
						setScreenTo(index);
						turnTo(index);
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
					$('.weixin-slider .weixin-slides').animate({
						bottom:  -index * yheight
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
					$('.weixin-slider .weixin-slides').animate({
						bottom:  (2-index) * yheight
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
		});
	}

	return {
		//初始化函数：传入设置的值
		init: data => {
			intervalTime = data.intervalTime;
			playTime = data.playTime;
			slideLength = $('.weixin-slider .weixin-slides .weixin-slider-list').length;
			window.onload = function(){
				//防止高度获取不准确
				yheight = $('.weixin-slider .weixin-slides .weixin-slider-list').eq(0).height();
			};
			

			//向下按钮点击事件
			$('.weixin-slider .weixin-slider-btn').on("touchstart",next_anim);

			//导航点点击事件
            $('.weixin-slider .weixin-slider-ctrl span').on("click",function() {
				index = $('.weixin-slider-ctrl span').index($(this)) + 1;
				//console.log("nav click:"+index);
				move_anim(index);
			});

			touchEvent();

			//屏幕宽度变化适应
			$(window).resize( () =>{
			    yheight = $('.weixin-slider .weixin-slides .weixin-slider-list').eq(0).width();
			    setScreenTo(index);
			    turnTo(index);
			});
        }
	}

})($);



    
