let ThreeDimansionSlider = ThreeDimansionSlider || ($ => {
	let index = 0,//第index+1张图
		gap = 0,//轮播图之间间距
		bfc = false,//是否隐藏背面
		angle = 0,//轮播图之间角度
		radius = 500,//边心距
		perspective = 500,//透视距离
        xwidth = null,//一张图的宽度
        slideLength = null,//轮播图张数
		intervalTime = null,//轮播时间
		playTime = null,//轮播效果时间
		playWhenHover = null,//鼠标悬停在广告上，是否轮播？
		timer = null;//轮播定时器

	let rotateCarousel = () => {
		//console.log(index);
		//index = index % 6;
		$('.three-dimansion-slider .three-dimansion-slides').css("transform", "rotateY(" + index * -angle + "rad)");
	}

	let setupCarousel = () => {
		$('.three-dimansion-slider .three-dimansion-slides .three-dimansion-slider-list').css("padding",gap + "px");
		if (bfc) $('.three-dimansion-slider .three-dimansion-slides .three-dimansion-slider-list').css("backfaceVisibility", "hidden");
		$('.three-dimansion-slider').css("perspective",perspective+"px")
		$('.three-dimansion-slider .three-dimansion-slides').css("transform-origin","50% 50% " + -radius + "px");
		$('.three-dimansion-slider .three-dimansion-slides').css("transition","transform "+playTime+"s");

		$('.three-dimansion-slider-list').css("transform-origin", "50% 50% " + -radius + "px");
		for (let i = 1; i < slideLength; i++) {
			$('.three-dimansion-slider .three-dimansion-slides .three-dimansion-slider-list').eq(i).css("transform", "rotateY(" + i * angle + "rad)");
		}

		rotateCarousel();
	}

	let setData = data => {
		gap = data.gap == undefined ? 0 : data.gap;
		bfc = data.bfc == undefined ? false : data.bfc;
		perspective = data.perspective == undefined ? 0 : data.perspective;
		xwidth = $('.three-dimansion-slider .three-dimansion-slides .three-dimansion-slider-list').eq(0).width();
		slideLength = $('.three-dimansion-slider .three-dimansion-slides .three-dimansion-slider-list').length;
		angle = 2 * Math.PI / slideLength;
		index = 0;
		radius = data.radius == undefined ? xwidth / (2 * Math.tan(Math.PI / slideLength)) : data.radius;
		intervalTime = data.intervalTime == undefined ? 10000 : data.intervalTime;
		playTime = data.playTime == undefined ? 0.5 : data.playTime;
		playWhenHover = data.playWhenHover == undefined ? false : data.playWhenHover;
	}

	//改变导航点样式
	let turnTo = NavDotNumber => {
		//console.log("turnTo"+NavDotNumber);
		$('.three-dimansion-slider .three-dimansion-slider-ctrl span').removeClass('active').eq(NavDotNumber-1).addClass('active');
	}

	//向前滑动动画
	let prev_anim = () => {
		index--;
		rotateCarousel();
		//console.log(index);
		turnTo(index%5+1);
	}

	//向后滑动动画
	let next_anim = () => {
		index++;
		rotateCarousel();
		//console.log(index);
		turnTo(index%5+1);
	}

	//移动到指定屏
	let move_anim = ScreenNumber => {
		//console.log("ScreenNumber:"+(ScreenNumber+1));
		//console.log("index:"+(index+1));
		let move = (ScreenNumber-index%5)%5;
		//console.log("move:"+move);
		if(move > 2) index -= 5 - move;
		else if(move < -2) index += 5 + move;
		else index += move;
		rotateCarousel();
		turnTo(index%5+1);
	}

	//开始轮播
	let autoplay = () => {
		timer = setInterval(next_anim,intervalTime);
	}

	//停止轮播
	let pause = () =>  {
		clearInterval(timer);
	}

	return {
		//初始化函数：传入设置的值
		init: data => {
			setData(data);
			setupCarousel();
			autoplay();

			//屏幕宽度变化适应
			window.onresize = function(){
				// xwidth = $('.three-dimansion-slider .three-dimansion-slides .three-dimansion-slider-list').eq(0).width();
				// radius = data.radius == undefined ? xwidth / (2 * Math.tan(Math.PI / slideLength)) : data.radius;
				// index = 0;
				// setupCarousel();
				document.location.reload();
			};

			//前后按钮点击事件
			$('.prev').on("click",prev_anim);
			$('.next').on("click",next_anim);

			//导航点点击事件
            $('.three-dimansion-slider .three-dimansion-slider-ctrl span').on("click",function() {
				move_anim($('.three-dimansion-slider-ctrl span').index($(this)));
			});

			//广告鼠标悬停事件：设置是否轮播
			$('.three-dimansion-slider').hover(() =>{
				if(playWhenHover == false){
					pause();
				}
			},() =>{
				if(playWhenHover == false){
					pause();
					autoplay();
				}
			});
        }
	}

})($);



    
