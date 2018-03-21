let initial = 	{
	gap : 100,
	bfc : false,
	perspective : 500,
	intervalTime : 5000,
	playTime : 0.5,
	playWhenHover : false
};
$(() =>{
	ThreeDimansionSlider.init(initial);
	ThreeDimansionResponsive.init();
});