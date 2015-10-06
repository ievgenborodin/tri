define(["jquery"], function($) {
    var Tri = function(config){
        
        /* /////    VARS    /// */
        var canvas, context, canvas2, context2, 
           iData, dots=[], z=5,
            canvasWrapper, tempZ=[], centerPoint = {}, offX=0, offY=0, 
           canvas4, on=true, srcValue, sides = [],
           screenWidth, screenHeight;
        
      canvas = $('#' + config.canvasId);
      context = canvas[0].getContext('2d');
      canvas2 = $('#' + config.canvas2Id);
      context2 = canvas2[0].getContext('2d');
      canvasWrapper = $('#' + config.canvasWrapper);
     
      screenState();  
        
     this.getWidth = function(){
        return screenWidth;
     };
        
     this.getHeight = function(){
        return screenHeight;
     };
        
     this.load = function(idata, idots, isides){
          iData = idata;
          dots = idots;
          sides = isides;
          tempZ = [];
          context.clearRect(0, 0, screenWidth, screenHeight);
          context2.clearRect(0, 0, canvas2.width(), canvas2.height());    
          drawToCanvas();
     };
       
     this.setScreen = function(){
        screenState();
     };
        
      /* //////	SCREEN STATE	//// */
    function screenState(){
        var tmpHeight = Math.floor(canvasWrapper.innerWidth() * 0.75); 
        canvasWrapper.innerHeight(tmpHeight + 'px');
        canvas.attr('width', canvasWrapper.width()-2 + 'px')
              .attr('height', canvasWrapper.height()-6 + 'px');
        canvas2.attr('width', canvasWrapper.width()-2 + 'px')
               .attr('height', canvasWrapper.height()-6 + 'px');
        screenWidth = canvas.width();
        screenHeight = canvas.height();
        centerPoint = {
            x: screenWidth / 2, 
            y: screenHeight / 2
        };
    };    
         

    /*  /////  Draw To Canvas   ///// */
    function drawToCanvas(){        
            for(var i = 0; i < dots.length; i++){
              context.fillStyle = "#"+dots[i].hex;           
              context.fillRect(dots[i].x, dots[i].y, 1,1);
            }
            var len = (sides.left.length - sides.top.length > 0) ? sides.left.length : sides.top.length;  
            for(var i=0; i<len; i++){
              if (sides.left[i]){
                context2.fillStyle = "#"+sides.left[i].dhex;
                context2.fillRect(sides.left[i].x, sides.left[i].y, 1,1);
              }
              if (sides.right[i]){
                context2.fillStyle = "#"+sides.right[i].dhex;
                context2.fillRect(sides.right[i].x, sides.right[i].y, 1,1);
              }  
              if (sides.top[i]){
                context2.fillStyle = "#"+sides.top[i].dhex;
                context2.fillRect(sides.top[i].x, sides.top[i].y, 1,1);
              }     
              if (sides.bottom[i]){
                context2.fillStyle = "#"+sides.bottom[i].dhex;
                context2.fillRect(sides.bottom[i].x, sides.bottom[i].y, 1,1);
              }
            }  
          };

        ///////////////////// On move function /////////////////
        function onMove(){
            if (on){
                    offX = loc.x - centerPoint.x;
                    offY = loc.y - centerPoint.y;
                    reStore(canvas[0], tempZ);	 
                    //timeNow = Date.now();
                    updateDepth(offX, offY);
                   // console.log(Date.now() - timeNow);
                }
            }

            /*	/////    WINDOW TO CANVAS	///// */
            wtc = function(canvas, x, y) {
                var bbox = canvas.getBoundingClientRect();
                return { x: x - bbox.left * (canvas.width / bbox.width),
                        y: y - bbox.top * (canvas.height / bbox.height)
                };
            };    

            canvas.on('touchmove mousemove', function(e){
                e.preventDefault(e); 
                loc = (e.type === 'mousemove') ? wtc(canvas[0],e.clientX,e.clientY) : wtc(canvas[0], e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);  
                onMove();
            }).on('click', function(e){
               on = (on) ? false : true;
            });


        /*  ////    GET Index   ///// */
          getIndex = function(canvas, x, y){
            return (canvas.width * y + x) * 4;
          };

          /*  /////   GET dot   ///// */
          getDot = function(canvas, x, y){
            var tmpi = getIndex(canvas, x, y);
            return {
              r: iData.data[tmpi],
              g: iData.data[tmpi + 1],
              b: iData.data[tmpi + 2],
              a: iData.data[tmpi + 3]
            }
          };           

          /*  /////   RE Store  ///// */
          function reStore(canvas, tz){
            for(var i = tz.length-1; i>=0; i--){
              context.clearRect(tz[i].x, tz[i].y, 1, 1);
              tz.pop();          
            }
          };

          /*  /////   Re Draw Z   ////// */
          updateDepth = function(offX, offY){
            var xz = Math.round(offX/z),
                yz = Math.round(offY/z),
                tmpx, tmpy, xai, yai, xa=0, ya=0, dot, tx, ty, xk, yk;

            yai = (yz < 0) ? 1 : -1;
            xai = (xz < 0) ? 1 : -1;
            xk = (yz!==0) ? Math.abs(xz / yz) : 0;
            yk = (xz!==0) ? Math.abs(yz / xz) : 0;      

            if (xz > 0){
              for(var i=sides.left.length-1; i>=0; i--){
                context.fillStyle = "#"+sides.left[i].dhex;
                tmpy = sides.left[i].y;
                tmpx = sides.left[i].x;
                for(var j=0; j<xz; j++){
                  if (ya !== yz) ya += (yai * yk); 
                  tx = tmpx - j;
                  ty = tmpy + Math.floor(ya);
                  dot = getDot(canvas[0], tx, ty);
                  if ((dot.r>210 && dot.g>210 && dot.b>210) || dot.a<10){
                    context.fillRect(tx, ty, 1,1);
                    tempZ.push({ x: tx, y: ty });
                  }
                }
                ya = 0;
              } 
            } else {
              for(var i=0; i<sides.right.length; i++){
                context.fillStyle = "#"+sides.right[i].dhex;
                tmpx = sides.right[i].x;
                tmpy = sides.right[i].y;
                for(var j=0; j>=xz; j--){
                  if (ya !== yz) ya += (yai * yk);
                  tx = tmpx - j;
                  ty = tmpy + Math.floor(ya);
                  dot = getDot(canvas[0], tx, ty);
                  if ((dot.r>210 && dot.g>210 && dot.b>210) || dot.a<10){
                    context.fillRect(tx, ty, 1,1);
                    tempZ.push({ hex: "ffffff", x: tx, y: ty });
                  }
                }
                ya = 0; 
              }
            }
            if (yz > 0){
              for(var i=0; i<sides.top.length; i++){
                context.fillStyle = "#"+sides.top[i].dhex;
                tmpx = sides.top[i].x;
                tmpy = sides.top[i].y;
                for(var j=0; j<yz; j++){
                  if (xa !== xz) xa += (xai * xk);
                  tx = tmpx + Math.floor(xa);
                  ty = tmpy - j;
                  dot = getDot(canvas[0], tx, ty);
                  if ((dot.r>210 && dot.g>210 && dot.b>210) || dot.a<10){
                    context.fillRect(tx, ty, 1,1);
                    tempZ.push({ hex: "ffffff", x: tx, y: ty });
                  }
                }
                xa = 0;
              } 
            } else {
              for(var i=0; i<sides.bottom.length; i++){
                context.fillStyle = "#"+sides.bottom[i].dhex;
                tmpx = sides.bottom[i].x;
                tmpy = sides.bottom[i].y;
                for(var j=0; j>=yz; j--){
                  if (xa !== xz) xa += (xai * xk);
                  tx = tmpx + Math.floor(xa);
                  ty = tmpy - j;
                  dot = getDot(canvas[0], tx, ty);
                  if ((dot.r>210 && dot.g>210 && dot.b>210) || dot.a<10){ 
                    context.fillRect(tx, ty, 1,1);
                    tempZ.push({ hex: "ffffff", x: tx, y: ty }); 
                  }
                }
                xa = 0; 
              }
            }
          };
    };
    
    return Tri;
});