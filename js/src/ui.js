var Tri = window.Tri || {}; 
Tri.ui = (function($){
  var ui = function(){
    var canvas, canvas2, ctx, ctx2, save, inputStyle,
        dots, sides, centerPoint,
        tmpIndex = 0, tempZ = [], offX = 0, offY = 0, z = 7, 
        on=true, Mgxp, iData;    
      
    this.init = function(mgxp, c2, Save, inputFile){
        var c = mgxp.getCanvas();
        canvas = c.canvas;
        ctx = c.context;
        canvas2 = c2;
        canvas2.attr('width', canvas.width() + 'px').attr('height', canvas.height() + 'px');
        ctx2 = canvas2[0].getContext('2d');
        save = Save;
        Mgxp = mgxp;
        inputStyle = inputFile;
        centerPoint = mgxp.getCenter();
        setEvents(mgxp);
    };      
      
    this.drawToCanvas = function(){
        iData = Mgxp.getData();
        dots = Mgxp.getDots();
        sides = Mgxp.getSides();
        if (dots !== undefined) {
        for(var i = 0; i < dots.length; i++){
          ctx.fillStyle = "#"+dots[i].hex;           
          ctx.fillRect(dots[i].x, dots[i].y, 1,1);
        }
        var len = (sides.left.length - sides.top.length > 0) ? sides.left.length : sides.top.length;  
        for(var i=0; i<len; i++){
          if (sides.left[i]){
            ctx2.fillStyle = "#"+sides.left[i].dhex;
            ctx2.fillRect(sides.left[i].x, sides.left[i].y, 1,1);
          }
          if (sides.right[i]){
            ctx2.fillStyle = "#"+sides.right[i].dhex;
            ctx2.fillRect(sides.right[i].x, sides.right[i].y, 1,1);
          }  
          if (sides.top[i]){
            ctx2.fillStyle = "#"+sides.top[i].dhex;
            ctx2.fillRect(sides.top[i].x, sides.top[i].y, 1,1);
          }     
          if (sides.bottom[i]){
            ctx2.fillStyle = "#"+sides.bottom[i].dhex;
            ctx2.fillRect(sides.bottom[i].x, sides.bottom[i].y, 1,1);
          }
        }  
        }
    };  
      
    var setEvents = function(mgxp){
        canvas.on('touchmove mousemove', function(e){
          e.preventDefault(e); 
          loc = (e.type === 'mousemove') ? getBoundingBox(canvas,e.clientX,e.clientY) : getBoundingBox(canvas,e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY);  
          onMove();
        })
        .on('click', function(e){
           on = (on) ? false : true;
        });
        
        inputStyle.on('click', function(){
            $('#file').click();
        });   
        $('#file').change(function(){   
          var files = this.files,
              reader = new FileReader();
          logo = new Image();
          reader.onload = (function(myImage){
            return function(e){
              myImage.src = e.target.result;
              myImage.onload = chkSize(); //function(){
            }    
          })(logo);
          reader.readAsDataURL(this.files[0]);
        });  

        save.on('click',function(){
            $.post("html/save.php", {
                data: canvas[0].toDataURL("image/png")
            }, function (file) {
                window.location.href =  "html/download.php?path=" + file
            });
        });

        $('.pre-logo').on('click', function(){
            var e = $(this);
            console.log("this="+e);
            $('.pre-logo').removeClass('active');
            on = true;
            e.toggleClass('active');
            if (e.hasClass('active')){
                mgxp.loadFile('img/'+e.attr('id')+'.png', ui.drawToCanvas(mgxp));
            }
        });

        /* /// Auto Resize  /// */
        $(window).resize(function(){
          centerPoint = {
            x: canvas.width()/2, 
            y: canvas.height()/2
          };
        });
    },
        
      getBoundingBox= function(element, x, y) {
        var bbox = element[0].getBoundingClientRect();
        return { x: x - bbox.left * (element[0].width / bbox.width),
                y: y - bbox.top * (element[0].height / bbox.height)
        };
      },
        
      onMove = function(){
            if (on){
                offX = loc.x - centerPoint.x;
                offY = loc.y - centerPoint.y;
                reStore();	          
                reDrawZ(offX, offY);
            }
      },

      getDot = function(x, y){
        var tmpi = getIndex(x, y);
        return {
          r: iData.data[tmpi],
          g: iData.data[tmpi + 1],
          b: iData.data[tmpi + 2],
          a: iData.data[tmpi + 3]
        }
      },
        
      getIndex = function(x, y){
        return (canvas.width() * y + x) * 4;
      },

      reStore = function(){
        for(var i = tempZ.length-1; i>=0; i--){
          ctx.clearRect(tempZ[i].x, tempZ[i].y, 1, 1);
          tempZ.pop();          
        }
      },

      /*  /////   Re Draw Z   ////// */
      reDrawZ = function(offX, offY){
        var xz = Math.round(offX/z),
            yz = Math.round(offY/z),
            tmpx, tmpy, xai, yai, xa=0, ya=0, dot, tx, ty, xk, yk;
        
        yai = (yz < 0) ? 1 : -1;
        xai = (xz < 0) ? 1 : -1;
        xk = (yz!==0) ? Math.abs(xz / yz) : 0;
        yk = (xz!==0) ? Math.abs(yz / xz) : 0;      

        if (xz > 0){
          for(var i=sides.left.length-1; i>=0; i--){
            ctx.fillStyle = "#"+sides.left[i].dhex;
            tmpy = sides.left[i].y;
            tmpx = sides.left[i].x;
            for(var j=0; j<xz; j++){
              if (ya !== yz) ya += (yai * yk); 
              tx = tmpx - j;
              ty = tmpy + Math.floor(ya);
              dot = getDot(tx, ty);
              if ((dot.r>210 && dot.g>210 && dot.b>210) || dot.a<10){
                ctx.fillRect(tx, ty, 1,1);
                tempZ.push({ x: tx, y: ty });
              }
            }
            ya = 0;
          } 
        } else {
          for(var i=0; i<sides.right.length; i++){
            ctx.fillStyle = "#"+sides.right[i].dhex;
            tmpx = sides.right[i].x;
            tmpy = sides.right[i].y;
            for(var j=0; j>=xz; j--){
              if (ya !== yz) ya += (yai * yk);
              tx = tmpx - j;
              ty = tmpy + Math.floor(ya);
              dot = getDot(tx, ty);
              if ((dot.r>210 && dot.g>210 && dot.b>210) || dot.a<10){
                ctx.fillRect(tx, ty, 1,1);
                tempZ.push({ hex: "ffffff", x: tx, y: ty });
              }
            }
            ya = 0; 
          }
        }
        if (yz > 0){
          for(var i=0; i<sides.top.length; i++){
            ctx.fillStyle = "#"+sides.top[i].dhex;
            tmpx = sides.top[i].x;
            tmpy = sides.top[i].y;
            for(var j=0; j<yz; j++){
              if (xa !== xz) xa += (xai * xk);
              tx = tmpx + Math.floor(xa);
              ty = tmpy - j;
              dot = getDot(tx, ty);
              if ((dot.r>210 && dot.g>210 && dot.b>210) || dot.a<10){
                ctx.fillRect(tx, ty, 1,1);
                tempZ.push({ hex: "ffffff", x: tx, y: ty });
              }
            }
            xa = 0;
          } 
        } else {
          for(var i=0; i<sides.bottom.length; i++){
            ctx.fillStyle = "#"+sides.bottom[i].dhex;
            tmpx = sides.bottom[i].x;
            tmpy = sides.bottom[i].y;
            for(var j=0; j>=yz; j--){
              if (xa !== xz) xa += (xai * xk);
              tx = tmpx + Math.floor(xa);
              ty = tmpy - j;
              dot = getDot(tx, ty);
              if ((dot.r>210 && dot.g>210 && dot.b>210) || dot.a<10){ 
                ctx.fillRect(tx, ty, 1,1);
                tempZ.push({ hex: "ffffff", x: tx, y: ty }); 
              }
            }
            xa = 0; 
          }
        }
      };         
  };
                  
  return ui;
})(jQuery);