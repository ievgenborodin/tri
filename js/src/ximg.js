define(function() {
    var ximg = {
    idata: {},
    dots: [],
    sides: {},
    src: '',
    defWidth: 500,
    defHeight: 400,
    patterns: {
        r: 210,
        g: 210,
        b: 210,
        a: 130
    },
    
    loadFile: function(config){
        var that = this, 
            logo, imageSize = {}, screen = {}, canvas;
        screen.width = config.width || that.defWidth;
        screen.height = config.height || that.defHeight;
        logo = new Image();
        logo.src = config.src || that.src;
        logo.onload = function(){
            that.src = logo.src;
            // image size
            imageSize = that.setSize(logo, screen.width, screen.height); 
            // temp canvas
            canvas = document.createElement('canvas');
            canvas.setAttribute('width', screen.width + 'px');
            canvas.setAttribute('height', screen.height + 'px');
            // idata
            that.setiData(logo, canvas, imageSize);
            that.setDots(canvas, that.idata, that.patterns); 
            that.setSides(canvas, that.idata, that.dots);
            config.callback(that.idata, that.dots, that.sides);
            window.canvas = null;    
        };
    },
    
    setSize: function(image, screenWidth, screenHeight){
        var w, h, 
            iw = image.width,
            ih = image.height,
            imageK = iw / ih,
            sw = Math.floor(screenWidth * 0.7),
            sh = Math.floor(screenHeight * 0.7);      
        if (ih > sh || iw > sw) {
            if (imageK > 1) {
                w = iw = sw;
                h = ih = Math.floor(iw / imageK);
            } else {
                h = ih = sh;
                w = iw = Math.floor(ih * imageK);
            }
        } else {
            w = iw;
            h = ih;
        }
        return { width: w,   height: h };
    },
    
    setiData: function(image, screen, size){
        var iData = {},
            ctx = screen.getContext('2d'),
            sw = screen.width,
            sh = screen.height,
            iw = size.width,
            ih = size.height,
            x = sw/2 - iw/2,
            y = sh/2 - ih/2;
        ctx.drawImage(image, x, y, iw, ih);
        iData = ctx.getImageData(0,0,sw,sh);
        ximg.idata = iData;
    },    
        
    setDots: function(screen, idata, pattern){
            var dots = [],
                cw = screen.width,
                d = idata.data,
                p = pattern;    
            for (var i=0, j=0; i<=d.length; i+=4, j++) {
              if ((d[i]>p.r && d[i+1]>p.g && d[i+2]>p.b) || d[i+3]<p.a)
                continue;	
		      dots.push(ximg.getData(d, cw, i, j));
            }
            ximg.dots = dots;
        },
        
        getData: function(data, canvasWidth, index, j){
          var hex, loc; 
          loc = ximg.getXY(canvasWidth, j);
          hex = ximg.getHex(data[index], data[index+1], data[index+2]);
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

        getXY: function(cw, j){
            var x = j % cw; 
            return { 
                x: x,
                y: (j-x) / cw
            }
        },

        getHex: function(r,g,b){
           var hex = (r * 65536 + g * 256 + b).toString(16,6);
           if( hex.length < 6 )
              for(i=0, l=6-hex.length; i<l; i++)
                hex = '0'+hex; 
           return hex;
        },
    
        setSides: function(screen, idata, dotz){
          var that = this, leftSide = [], rightSide = [],
              topSide = [], bottomSide = [],
              dots = dotz,
              c4 = screen.width * 4,
              d = idata.data;
        
          leftSide[0] = {
            x: dots[0].x, 
            y: dots[0].y, 
            di: dots[0].di, 
            dhex: that.getDHex(dots[0].r, dots[0].g, dots[0].b)
          };
          for(var i=0; i<dots.length-1; i++)
            if (dots[i+1].di - dots[i].di>4){
              leftSide.push({
                x: dots[i+1].x, 
                y: dots[i+1].y, 
                di: dots[i+1].di,
                dhex: that.getDHex(dots[i+1].r, dots[i+1].g, dots[i+1].b)
              });
              rightSide.push({
                x: dots[i].x, 
                y: dots[i].y,
                di: dots[i].di, 
                dhex: that.getDHex(dots[i].r, dots[i].g, dots[i].b)
              });
            } else if ((d[dots[i].di + c4] > 210 
                    && d[dots[i].di + 1 + c4]>210
                    && d[dots[i].di + 2 + c4]>210)
                    || d[dots[i].di + 3 + c4]<10) {
              bottomSide.push({
                x: dots[i].x, 
                y: dots[i].y, 
                di: dots[i].di, 
                dhex: that.getDHex(dots[i].r, dots[i].g, dots[i].b)
              }); 
            } else if ((d[dots[i].di - c4]>210 
                    && d[dots[i].di + 1 - c4]>210
                    && d[dots[i].di + 2 - c4]>210)
                    || d[dots[i].di + 3 - c4]<10) {
              topSide.push({
                x: dots[i].x, 
                y: dots[i].y, 
                di: dots[i].di, 
                dhex: that.getDHex(dots[i].r, dots[i].g, dots[i].b)
              });
            }
          leftSide.pop();
          that.sides = {
            left: leftSide,
            right: rightSide,
            top: topSide,
            bottom: bottomSide
          }
        },

        getDHex: function(r,g,b){
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
            dark = ximg.getRGB(h.toFixed(0), s.toFixed(0), v);
            dhex = ximg.getHex(dark.r, dark.g, dark.b);
            return dhex;
        },

        getRGB: function(h,s,v){
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
        }
    };  
    return ximg; 
});