var Tri = window.Tri || {}; 
Tri.mgxp = (function($){
  var mgxp = function(){  
    var trigger, wrapper, canvas, context, center, logo, iData,
        dots, leftSide, rightSide, topSide, bottomSide,
      
    patterns = [
      {
        r: 210,
        g: 210,
        b: 210,
        a: 130
      }
    ];  
          
    this.init = function(canvasDiv, callback){
        wrapper = canvasDiv;
        wrapper.html('<canvas id="canvas"></canvas>');
        canvas = $('#canvas');
        context = canvas[0].getContext('2d');
        trigger = callback;
        screenState();
    };
      
    this.loadFile = function(src, callback){
        setFile(src);
        if (callback) callback(this);
    };
    
    this.getCanvas = function(){
       	return {
       		canvas: canvas,
       		context: context
       	}
    }; 
        
    this.getCenter = function(){
        return center;
    },  
      
    this.getDots = function(){
        return dots;
    };  
      
    this.getData = function(){
        return iData;
    };  
      
    this.getSides = function(){
        return{
            left: leftSide,
            right: rightSide,
            top: topSide, 
            bottom: bottomSide
        }
    };  
      
    var setFile = function(src){
        var size;
        logo = new Image();
        logo.src = src;
        logo.onload = function(){  /* check = startExp */
          size = chkSize();
          startExp(size.w, size.h);
        }
    },
    
    chkSize = function() {
        var imageK, w, h, 
            k = 0.7,
            iWidth = logo.width,
            iHeight = logo.height,
            cWidth = Math.floor(canvas.width() * 0.7),
            cHeight = Math.floor(canvas.height() * 0.7);      
        if (iHeight > cHeight || iWidth > cWidth) {
            imageK = iWidth / iHeight;
            if (imageK > 1) {
                w = iWidth = cWidth;
                h = iHeight = Math.floor(iWidth / imageK);
            } else {
                h = iHeight = cHeight;
                w = iWidth = Math.floor(iHeight * imageK);
            }
        } else {
            w = iWidth;
            h = iHeight;
        }
        return {
            w: w,
            h: h
        }
      },    
        
    screenState = function(){
        var tmpHeight;
        tmpHeight = Math.floor(wrapper.innerWidth() * 0.75); 
        wrapper.innerHeight(tmpHeight + 'px');
        canvas.attr('width', wrapper.width()-2 + 'px').attr('height', wrapper.height()-6 + 'px');
        center = {
          x: canvas.width()/2, 
          y: canvas.height()/2
        };
        //if(logo.src) setFile(logo.src);
       },
        
    startExp = function(w,h){
       resetValues();  // (w, h){  var imgWidth = w || logo.width,
       preDraw(w,h);      //    imgHeight = h || logo.height; 
       findObjects();
    },
        
    resetValues = function(){
      iData = {};
      dots = [];
      leftSide = [];
      rightSide = [];
      topSide = [];
      bottomSide = [];
    },
        
    preDraw = function(w,h){
          var cWidth = canvas.width(),
              cHeight = canvas.height(),
              imgWidth = w,
              imgHeight = h,
              x = cWidth/2 - imgWidth/2,
              y = cHeight/2 - imgHeight/2;
          context.drawImage(logo, x, y, imgWidth, imgHeight);
          iData = context.getImageData(0,0,cWidth,cHeight);
          clrScr();
    },
        
    clrScr = function(){
          context.clearRect(0, 0, canvas.width(), canvas.height());
    },
        
    findObjects = function(){
        skipDots();
        findSides();
        trigger();
    },
        
    skipDots = function(){
          var d = iData.data,
              p = patterns[0];    
        
          for (var i=0; i<=d.length; i+=4) {
		    if ((d[i]>p.r && d[i+1]>p.g && d[i+2]>p.b) || d[i+3]<p.a)
                continue;	
		    dots.push(getData(d, i));
	      }
    },
        
    findSides = function(){
        var c4 = canvas.width()*4,
            d = iData.data;
        
          leftSide[0] = {
            x: dots[0].x, 
            y: dots[0].y, 
            di: dots[0].di, 
            dhex: getDHex(dots[0].r, dots[0].g, dots[0].b)
          };
          for(var i=0; i<dots.length-1; i++)
            if (dots[i+1].di - dots[i].di>4){
              leftSide.push({
                x: dots[i+1].x, 
                y: dots[i+1].y, 
                di: dots[i+1].di,
                dhex: getDHex(dots[i+1].r, dots[i+1].g, dots[i+1].b)
              });
              rightSide.push({
                x: dots[i].x, 
                y: dots[i].y,
                di: dots[i].di, 
                dhex: getDHex(dots[i].r, dots[i].g, dots[i].b)
              });
            } else if ((d[dots[i].di + c4] > 210 
                    && d[dots[i].di + 1 + c4]>210
                    && d[dots[i].di + 2 + c4]>210)
                    || d[dots[i].di + 3 + c4]<10) {
              bottomSide.push({
                x: dots[i].x, 
                y: dots[i].y, 
                di: dots[i].di, 
                dhex: getDHex(dots[i].r, dots[i].g, dots[i].b)
              }); 
            } else if ((d[dots[i].di - c4]>210 
                    && d[dots[i].di + 1 - c4]>210
                    && d[dots[i].di + 2 - c4]>210)
                    || d[dots[i].di + 3 - c4]<10) {
              topSide.push({
                x: dots[i].x, 
                y: dots[i].y, 
                di: dots[i].di, 
                dhex: getDHex(dots[i].r, dots[i].g, dots[i].b)
              });
            }
          leftSide.pop();
    },    
        
    getData = function(data, index){
        var hex, loc; 
          loc = getXY(index);
          hex = getHex(data[index], data[index+1], data[index+2]);
          return {
            di: index,
            x: loc.x,
            y: loc.y,
            r: data[index],
            g: data[index+1],
            b: data[index+2],
            hex: hex
          }
    },	
      
    getXY = function(index){
          var x = (index/4) % canvas.width(); 
          return { 
            x: x,
            y: ((index/4)-x) / canvas.width()
          }
    },

    getHex = function(r,g,b){
            var hex = (r * 65536 + g * 256 + b).toString(16,6);
            if( hex.length < 6 )
              for(i=0, l=6-hex.length; i<l; i++)
                hex = '0'+hex; 
          return hex;
    },

    getDHex = function(r,g,b){
            var h, s, v, m, M, c, dhex, dark;
            r /= 255;
            g /= 255;
            b /= 255;
            M = Math.max(r, g, b);
            m = Math.min(r, g, b);
            c = M - m;
            if (c == 0) h = 0;
            else if (M == r) 
              h = (((g - b) / c) % 6) * 60;
            else if (M == g) 
              h = ((b - r) / c + 2) * 60;
            else 
              h = ((r - g) / c + 4) * 60;
            if (h < 0) 
              h += 360;
            v = M * 100;
            s = (!M) ? 0 : (c / M * 100);

            v = (v - 30) > 0 ? v.toFixed(0) - 30 : 0;
            dark = getRGB(h.toFixed(0), s.toFixed(0), v);
            dhex = getHex(dark.r, dark.g, dark.b);
            return dhex;
    },

    getRGB = function(h,s,v){
            var hh, X, C, r=0, g=0, b=0, m, hex;
            C = v / 100 * s / 100;
            hh = h / 60;
            X = C * (1 - Math.abs(hh % 2 - 1));
            if (hh >= 0 && hh < 1){
              r = C;  g = X;
            } else if (hh >= 1 && hh < 2) {
              r = X;  g = C;
            } else if (hh >= 2 && hh < 3) {
              g = C;  b = X;
            } else if (hh >= 3 && hh < 4) {
              g = X;  b = C;
            } else if (hh >= 4 && hh < 5) {
              r = X;  b = C;
            } else {
              r = C;  b = X;
            }
            m = (v / 100) - C;
            r = Math.floor((r + m) * 255); 
            g = Math.floor((g + m) * 255);
            b = Math.floor((b + m) * 255);
            return {
              r: r,
              g: g,
              b: b,
            }
    };  
  };
  return mgxp;
})(jQuery);