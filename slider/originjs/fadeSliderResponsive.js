let slideSliderResponsive = slideSliderResponsive || ($ => {
    return {
		//初始化函数：传入设置的值
		init : () => {
			
			//调整导航点左margin，使其居中
			let fixNavCtrl = () => {
				//获取导航点个数
				let navCtrlNum = $('.fade-slider .fade-slider-ctrl').children('span').length;
				//导航点width：10px，左margin：16px
				let setNavCtrlLeft = 0;
				if(navCtrlNum % 2 == 1){
					setNavCtrlLeft = (-1) * ((10 / 2) + Math.floor(navCtrlNum / 2) * (10 + 16));
				}else{
					setNavCtrlLeft = (-1) * ((16 / 2) + (navCtrlNum / 2) * 10 + (navCtrlNum / 2 - 1) * 16);
				}
				$('.fade-slider .fade-slider-ctrl').css('marginLeft',setNavCtrlLeft);
			}
			
			//广告鼠标悬停事件：屏幕宽度小于1440（含），不再出现
			$('.fade-slider,.fade-slides,.fade-slider .fade-slider-next,.fade-slider .fade-slider-prev').hover(() => {
				if($(window).width() > 1440){
					$('.fade-slider .fade-slider-prev,.fade-slider .fade-slider-next').css("visibility","visible");
				}
			},() =>{
				$('.fade-slider .fade-slider-prev,.fade-slider .fade-slider-next').css("visibility","hidden");
			});
			
			fixNavCtrl();
        }
    }
})($);