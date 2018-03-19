let slideSlider = slideSlider || ($ => {
    let index = 1,//第index+1张图
		timer = null,//轮播定时器
        yheight = null,//一张图的高度
        slideLength = null,//轮播图张数
		intervalTime = null,//轮播时间
		playTime = null,//轮播效果时间
		playWhenHover = null;//鼠标悬停在广告上，是否轮播？

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
		$('.slide-slider .slide-slides .slide-slider-list:last-child').prependTo($('.slide-slider .slide-slides'));
	}

	//第一张轮播图移动到最后一张
	let beginToEnd = () => {
		//console.log("beginToEnd");
		$('.slide-slider .slide-slides .slide-slider-list:first-child').appendTo($('.slide-slider .slide-slides'));
	}

	//改变导航点样式
	let turnTo = NavDotNumber => {
		//console.log("turnTo"+NavDotNumber);
		$('.weixin-slider .weixin-slider-ctrl span').removeClass('active').eq(NavDotNumber-1).addClass('active');
	}

	//向前滑动动画
	let prev_anim = () => {
		//console.log("prev_anim");
		
	}

	//向后滑动动画
	let next_anim = () => {
		//console.log("next_anim");
		if (!$('.slide-slider .slide-slides').is(":animated")){

		}
	}

	//移动到指定屏
	let weixin_anim = ScreenNumber => {
		//console.log("weixin_anim");
		
	}

	//开始轮播
	let autoplay = () => {
		timer = setInterval(next_anim,intervalTime);
	}

	//停止轮播
	let pause = () =>  {
		clearInterval(timer);
	}

	//手指滑动
	let touchEvent = () => {
		let startX = 0;//触摸开始位置
		let changeX = 0;//移动距离
		let touchFlag = false;//是否触摸
		let touchMovePercent = 0;//移动百分比

		//前后按钮触摸事件
		$('.weixin-slider .weixin-slider-prev').unbind("click");
		$('.weixin-slider .weixin-slider-next').unbind("click");
        $('.weixin-slider .weixin-slider-prev').on("touchstart",prev_anim);
		$('.weixin-slider .weixin-slider-next').on("touchstart",next_anim);

		//触摸导航点
		$('.weixin-slider .weixin-slider-ctrl span').on("touchstart",function(e) {
			index = $('.weixin-slider-ctrl span').index($(this)) + 1;
			weixin_anim(index);
		});
		
		//开始触摸时间
		$(".weixin-slider").on("touchstart",function(e) {
			//监测到touch行为，显示前后箭头
			$('.weixin-slider .weixin-slider-prev,.weixin-slider .weixin-slider-next').css("visibility","visible");
			touchFlag = true;
			pause();
			startX = e.originalEvent.changedTouches[0].pageX;
			//console.log(startX);
			//console.log("touchstart detected!");
		});
		
		//触摸移动事件
		$(".weixin-slider").on("touchmove",function(e) {
			pause();
			//console.log(touchFlag);
			if(touchFlag == false){
				startX = e.originalEvent.changedTouches[0].pageX;
				touchFlag = true;
			}
			changeX = e.originalEvent.changedTouches[0].pageX - startX;
			touchMovePercent = changeX / window.innerWidth *100;
			
			//console.log(changeX);
			//console.log(touchMovePercent);
			//console.log("touchmove detected!");
		});
		
		//触摸结束事件
		$(".weixin-slider").on("touchend",function(e) {
			touchFlag = false;
			if(touchMovePercent >= 20){
				//向前翻页
				//console.log("向前翻页");
				prev_anim();
			}else if(touchMovePercent <= -20){
				//向后翻页
				//console.log("向后翻页");
				next_anim();
			}
			touchMovePercent = 0;
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
			slideLength = $('.weixin-slider .weixin-slides .weixin-slider-list').length;
			yheight = $('.weixin-slider .weixin-slides .weixin-slider-list').eq(0).height();
			endToBegin();
			
			weixin_anim(index);
			autoplay();

			//导航点点击事件
            $('.weixin-slider .weixin-slider-ctrl span').on("click",function() {
				index = $('.weixin-slider-ctrl span').index($(this)) + 1;
				//console.log("nav click:"+index);
				weixin_anim(index);
			});

			//广告鼠标悬停事件：设置是否轮播
			$('.weixin-slider').hover(() =>{
				if(playWhenHover == false){
					pause();
				}
			},() =>{
				if(playWhenHover == false){
					pause();
					autoplay();
				}
			});

			//touchEvent();

			//屏幕宽度变化适应
			$(window).resize( () =>{
			    yheight = $('.weixin-slider .weixin-slides .weixin-slider-list').eq(0).height();
			    turnTo(index);
			});
        }
	}

})($);



    
