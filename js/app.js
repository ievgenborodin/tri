Modernizr.load([
    /*{
    load: "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"
    ,complete: function(){
      if (!window.jQuery)
        Modernizr.load('js/lib/jquery.js');
    }
  }*/
    'js/lib/jquery.js'
  ,'js/src/mgxp.js'
  ,{
    load: 'js/src/ui.js',
    complete: function(){
    
         mgxp = new Tri.mgxp(),
            ui = new Tri.ui(),
            
          /* mgxp block */
          canvasDivWrapper = $('#canvasWrapper'),
            
          /* ui block */
          outlineCanvas = $('#c2'),    
          save = $('#save'),
          inputStyle = $('#inputStyle');
            
      mgxp.init(canvasDivWrapper, ui.drawToCanvas);
      ui.init(mgxp, outlineCanvas, save, inputStyle);
      mgxp.loadFile('img/mcdonalds.png');
    }
  }
  ]);