/* //////     CONFIG    /////// */
require.config({
    //urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: 'js/lib',
    paths: {
        'src': '../src'
    },
    enforceDefine: true
});

/* //////     MAIN    /////// */
define(["jquery", "src/ximg", "src/tri"], function($, ximg, Tri) {
    var canvasId, outlineId, tri, currSrc;
        
    canvasId = 'canvas';
    outlineId = 'c2';
    currSrc = 'img/mcdonalds.png';
    
    tri = new Tri({
        canvasWrapper: 'canvasWrapper',
        canvasId: canvasId,
        canvas2Id: outlineId
    });
    
    ximg.loadFile({
        src: currSrc, 
        width: tri.getWidth(),
        height: tri.getHeight(),
        callback: tri.load
    });   
    
    /* /// Save button  /// */    
    $('#save').on('click',function(){
        $.post("html/save.php", {
            data: $('#' + canvasId)[0].toDataURL("image/png")
        }, function (file) {
            window.location.href =  "html/download.php?path=" + file
        });
    });
    
    /* /////    Click to toggle Samples     ///// */
    $('.sample').on('click', function(){
        var e = $(this);
        $('.sample').removeClass('active');
        e.toggleClass('active');
        if (e.hasClass('active')){
            currSrc = 'img/'+e.attr('id')+'.png';
            ximg.loadFile({ src: currSrc, width: tri.getWidth(),
                        height: tri.getHeight(), callback: tri.load });
        }
    });
            
    /* /// Auto Resize  /// */
    $(window).resize(function(){
        tri.setScreen();
        ximg.loadFile({ src: currSrc, width: tri.getWidth(),
                        height: tri.getHeight(), callback: tri.load });
    });  
    
    /* /////  Custom  File   ///// */
    $('#inputStyle').on('click', function(){
        $('#file').click();
    });
    $('#file').change(function(){   
      var files = this.files,
          reader = new FileReader();
      reader.onload = function(e){
            currSrc = e.target.result;
            ximg.loadFile({ src: currSrc, width: tri.getWidth(),
                        height: tri.getHeight(), callback: tri.load });
        }   
        reader.readAsDataURL(this.files[0]);
    }); 
});