let slideSlider = slideSlider || ($ => {
    let index = 1,//第index+1张图
		timer = null,//轮播定时器
        xwidth = null,//一张图的宽度
        slideLength = null,//轮播图张数
		intervalTime = null,//轮播时间
		playTime = null,//轮播效果时间
		playWhenHover = null;//鼠标悬停在广告上，是否轮播？
		//tag = 0;

	//检查index是否越界
	let judgeIndexBound = () => {
		if(index < 1){
			index = 5;
		}else if(index > 5){
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
		//console.log("before_prev_anim:"+index);
		if (!$('.fade-slider .fade-slides').is(":animated")){
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
				$('.fade-slider .fade-slides').animate({
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
		if (!$('.fade-slider .fade-slides').is(":animated")){
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
				$('.fade-slider .fade-slides').animate({
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
		if (!$('.fade-slider .fade-slides').is(":animated")){//注释后，解决触屏点击没反应
			pause();
			//console.log("move_anim:"+ScreenNumber);
			$('.fade-slider .fade-slides').animate({
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
        $('.fade-slider .fade-slider-prev').on("touchstart",prev_anim);
		$('.fade-slider .fade-slider-next').on("touchstart",next_anim);

		//触摸导航点
		$('.fade-slider .fade-slider-ctrl span').on("touchstart",function(e) {
			if(!$('.fade-slider .fade-slides').is(":animated")){
				index = $('.fade-slider-ctrl span').index($(this)) + 1;
				move_anim(index);
			}
		});
		
		//开始触摸时间
		$(".fade-slider").on("touchstart",function(e) {
			//监测到touch行为，显示前后箭头
			$('.fade-slider .fade-slider-prev,.fade-slider .fade-slider-next').css("visibility","visible");
			
			if($('.fade-slider .fade-slides').is(":animated")) return;
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
			if($('.fade-slider .fade-slides').is(":animated")){
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
				if(!$('.fade-slider .fade-slides').is(":animated")){
					$('.fade-slider .fade-slides').animate({
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
				if(!$('.fade-slider .fade-slides').is(":animated")){
					$('.fade-slider .fade-slides').animate({
						left: (2-slideLength)*xwidth+changeX
					},0);
				}
			}
			else{
				if(status != 3){
					status = 3;
				}
				if(!$('.fade-slider .fade-slides').is(":animated")){
					$('.fade-slider .fade-slides').animate({
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
		$(".fade-slider").on("touchend",function(e) {
			if($('.fade-slider .fade-slides').is(":animated")) return;
			touchFlag = false;
			if(touchMovePercent >= 20){
				//向前翻页
				if(status == 1){
					//console.log("向前翻页,status=1");
					//5(1-x)234
					//move->(5)1234
					//(1)2345
					//screen->1234(5)
					$('.fade-slider .fade-slides').animate({
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
					$('.fade-slider .fade-slides').css("left", -(slideLength - 1) * xwidth + endX);
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
					$('.fade-slider .fade-slides').css("left", endX);
					index++;
					move_anim(index);
				}
				else if(status == 2){
					//console.log("向后翻页,status=2");
					//234(5+x)1
					//move->2345(1)
					//1234(5)
					//screen->(1)2345
					$('.fade-slider .fade-slides').animate({
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
					$('.fade-slider .fade-slides').animate({
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
					$('.fade-slider .fade-slides').animate({
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
			slideLength = $('.fade-slider .fade-slides .fade-slider-list').length;
			//自动设置ul和li宽度
			let percision = parseFloat(parseInt(100/slideLength*100000))/100000;
			//console.log(percision);
			$('.fade-slider .fade-slides').css("width",slideLength*100+"%");
			$('.fade-slider .fade-slides .fade-slider-list').css("width",percision+"%");
			xwidth = $('.fade-slider .fade-slides .fade-slider-list').eq(0).width();
			
			autoplay();

			//前后按钮点击事件
            $('.fade-slider .fade-slider-prev').on("click",prev_anim);
			$('.fade-slider .fade-slider-next').on("click",next_anim);

			//导航点点击事件
            $('.fade-slider .fade-slider-ctrl span').on("click",function() {
				index = $('.fade-slider-ctrl span').index($(this)) + 1;
				//console.log("nav click:"+index);
				move_anim(index);
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
			    setScreenTo(index);
			    turnTo(index);
			});
        }
	}

})($);



    
