let slideSliderResponsive = slideSliderResponsive || ($ => {
    return {
		//初始化函数：传入设置的值
		init : () => {
			
			//调整导航点左margin，使其居中
			let fixNavCtrl = () => {
				//获取导航点个数
				let navCtrlNum = $('.slide-slider .slide-slider-ctrl').children('span').length;
				//导航点width：10px，左margin：16px
				let setNavCtrlLeft = 0;
				if(navCtrlNum % 2 == 1){
					setNavCtrlLeft = (-1) * ((10 / 2) + Math.floor(navCtrlNum / 2) * (10 + 16));
				}else{
					setNavCtrlLeft = (-1) * ((16 / 2) + (navCtrlNum / 2) * 10 + (navCtrlNum / 2 - 1) * 16);
				}
				$('.slide-slider .slide-slider-ctrl').css('marginLeft',setNavCtrlLeft);
			}
			
			//广告鼠标悬停事件：屏幕宽度小于1440（含），不再出现
			$('.slide-slider,.slide-slides,.slide-slider .slide-slider-next,.slide-slider .slide-slider-prev').hover(() => {
				if($(window).width() > 1440){
					$('.slide-slider .slide-slider-prev,.slide-slider .slide-slider-next').css("visibility","visible");
				}
			},() =>{
				$('.slide-slider .slide-slider-prev,.slide-slider .slide-slider-next').css("visibility","hidden");
			});
			
			fixNavCtrl();
        }
    }
})($);