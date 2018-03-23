let canvasRipple = canvasRipple || ($ => {
  let centerX = 0,//点击位置的x坐标
      centerY = 0,//点击位置的y坐标
      beginColor = "green",//起始扩散颜色
      endColor = "#ffffff",//结束扩散颜色
      opacity = 0.25,//canvas透明度
      context,//画布上下文
      element,//点击的元素
      radius = 0,//扩散半径
      speed = 20;//扩散速度

  let requestAnimFrame = function () {
    return (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  }()

  let buildRipple = () => {
    $('.canvasRipple').append("<canvas></canvas>");
    let canvas = $('.canvasRipple').find("canvas");
    canvas.css({ "width": "100%", "height": "100%", "opacity": opacity});
    for (let i = 0; i < canvas.length; i++) {
      canvas.eq(i).attr({ "width": canvas.eq(i).get(0).offsetWidth, "height": canvas.eq(i).get(0).offsetHeight });
    }
    $('.canvasRipple').find("canvas").on("click",function(e){
      context = $(this).get(0).getContext('2d');
      radius = 0;
      centerX = e.offsetX;
      centerY = e.offsetY;
      context.clearRect(0, 0, $(this).width(), $(this).height());
      element = $(this);
      drawRipple();
    });
  }

  let drawRipple = () => {
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    let maxRadius = Math.sqrt(element.width() * element.width() + element.height() * element.height());//最大扩散半径
    let radialGradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    radialGradient.addColorStop(0, beginColor);
    radialGradient.addColorStop(1, endColor);
    context.fillStyle = radialGradient;
    context.fill();
    radius += speed;
    if (radius < maxRadius) {
      requestAnimFrame(drawRipple);
    }
    else{
      context.clearRect(0, 0, element.width(), element.height());
    }
  }

  let setData = data => {
    beginColor = data.beginColor == undefined ? "green" : data.beginColor;
    endColor = data.endColor == undefined ? "#ffffff" : data.endColor;
    opacity = data.opacity == undefined ? 0.25 : data.opacity;
    speed = data.speed == undefined ? 20 : data.speed;
  }

  return {
    //初始化函数：传入设置的值
    init: data => {
      setData(data);
      buildRipple();
    }
  }

})($);
