let slideSlider = slideSlider || ($ => {
    let index = 1,//第index+1张图
		timer = null,//轮播定时器
        xwidth = null,//一张图的宽度
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

	//改变导航点样式
	let turnTo = NavDotNumber => {
		//console.log("turnTo"+NavDotNumber);
		$('.fade-slider .fade-slider-ctrl span').removeClass('active').eq(NavDotNumber-1).addClass('active');
	}

	//向前滑动动画
	let prev_anim = () => {
		//console.log("prev_anim");
		index--;
		judgeIndexBound();
		fade_anim(index);
	}

	//向后滑动动画
	let next_anim = () => {
		//console.log("next_anim");
		index++;
		judgeIndexBound();
		fade_anim(index);
	}

	//移动到指定屏
	let fade_anim = ScreenNumber => {
		//console.log("fade_anim");
		for (let i = 1; i < slideLength; i++) {
			if(ScreenNumber == i){
				$('.fade-slider .fade-slides .fade-slider-list').eq(ScreenNumber-1).fadeIn(playTime);
			}
			else{
				$('.fade-slider .fade-slides .fade-slider-list').eq(i-1).fadeOut(playTime);
			}
		}
		turnTo(ScreenNumber);
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
		$('.fade-slider .fade-slider-prev').on("touchstart",function(){
			prev_anim();
			$('.fade-slider .fade-slider-prev').unbind("click");
		});
		$('.fade-slider .fade-slider-prev').on("touchstart",function(){
			next_anim();
			$('.fade-slider .fade-slider-next').unbind("click");
		});

		//触摸导航点
		$('.fade-slider .fade-slider-ctrl span').on("touchstart",function(e) {
			index = $('.fade-slider-ctrl span').index($(this)) + 1;
			fade_anim(index);
		});
		
		//开始触摸时间
		$(".fade-slider").on("touchstart",function(e) {
			//监测到touch行为，显示前后箭头
			$('.fade-slider .fade-slider-prev,.fade-slider .fade-slider-next').css("visibility","visible");
			touchFlag = true;
			pause();
			startX = e.originalEvent.changedTouches[0].pageX;
			//console.log(startX);
			//console.log("touchstart detected!");
		});
		
		//触摸移动事件
		$(".fade-slider").on("touchmove",function(e) {
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
		$(".fade-slider").on("touchend",function(e) {
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
			intervalTime = data.intervalTime;
			playTime = data.playTime;
			playWhenHover = data.playWhenHover;
			slideLength = $('.fade-slider .fade-slides .fade-slider-list').length;
			xwidth = $('.fade-slider .fade-slides .fade-slider-list').eq(0).width();
			
			fade_anim(index);
			autoplay();

			//前后按钮点击事件
            $('.fade-slider .fade-slider-prev').on("click",prev_anim);
			$('.fade-slider .fade-slider-next').on("click",next_anim);

			//导航点点击事件
            $('.fade-slider .fade-slider-ctrl span').on("click",function() {
				index = $('.fade-slider-ctrl span').index($(this)) + 1;
				//console.log("nav click:"+index);
				fade_anim(index);
			});

			//广告鼠标悬停事件：设置是否轮播
			$('.fade-slider').hover(() =>{
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
			    xwidth = $('.fade-slider .fade-slides .fade-slider-list').eq(0).width();
			    turnTo(index);
			});
        }
	}

})($);



    
