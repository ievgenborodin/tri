<!DOCTYPE html>
<html>
<head>
  <title>Color Picker</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
  <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
  <link rel="shortcut icon" href="css/tri.ico" />
  <link href="css/bootstrap.min.css" rel="stylesheet" />
  <link href="css/style.css" rel="stylesheet" />
  <script src="js/lib/modernizr.js"></script>
  <script src="js/app.js"></script>
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
        <div id="header" class="row">
          <div class="col-xs-12">
            <div >
              <h2 id="title">Tri</h2>
              <span id="description">image depth generator</span>
            </div>
          </div>  
        </div>
        <div class="row">
          <div id="samples" class="col-xs-12 col-sm-2 bpad">
            <div class="row lrpad">
              <div id="mcdonalds" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/mcdonalds.png">
              </div>
              <div id="microsoft" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/microsoft.png">
              </div>
              <div id="hi" class="col-xs-1 col-sm-12 pre-logo active">
                <img class="img-responsive" src="img/previews/hi.png">
              </div>
              <div id="bandshell" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/bandshell.jpg">
              </div>
              <div id="adhoc" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/adhoc.jpg">
              </div>
              <div id="apple" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/apple.png">
              </div>
              <div id="filmax" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/filmax.png">
              </div>
              <div id="pizzahut" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/pizzahut.png">
              </div>
              <div id="facebook" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/facebook.png">
              </div>
              <div id="adidas" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/adidas.png">
              </div>
              <div id="target" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/target.png">
              </div>
              <div id="walls" class="col-xs-1 col-sm-12 pre-logo">
                <img class="img-responsive" src="img/previews/walls.jpg">
              </div>
            </div>
          </div>
          <div id="main" class="col-xs-12 col-sm-10">
            <span class="lbl bpad">Click here to load your file:</span>
              <br class="br-xs">
              <span class="btn btn-default bpad" id="inputStyle">Choose File</span>
              <div id="hid">
                <input type="file" id="file" accept="image/*">
              </div>
            
            <span id="save" class="btn btn-default save">Save</span>
            <div id="canvasWrapper">      
              <canvas id="canvas"></canvas>
            </div>
            <div id="outline">
              <canvas id="c2"></canvas>
              <span>Outline</span> 
            </div>
          </div>
        </div>
        <div id="foot" class="row">
          <div class="col-xs-12">
            <p>&#x86; Move [on the screen] to rotate the image.</p>
            <p>&#x86; Click [on the screen] to hold/release the position.</p>
            <p>&#x86; Click [on save] to download current position.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>