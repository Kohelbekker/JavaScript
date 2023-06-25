<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
  <style>
    #field {
      width: 200px;
      height: 150px;
      border: 10px solid black;
      background-color: #00FF00;
      overflow: hidden;
      position: relative;

      &:hover {
        cursor: pointer;
      }
    }

    #ball {
      position: absolute;
      transition: 1s all;
      left: 0;
      top: 0;
    }
  </style>
</head>

<body style="height:2000px">

  Click on a field to move the ball there.
  <br> The ball should never leave the field.


  <div id="field">
    <img src="https://en.js.cx/clipart/ball.svg" id="ball"> . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
  </div>

  <script>
    // since field if 'position: relative' coordinates for the ball set
    // relatively to the field (so 0,0 is top corner of the field)
    function move(e) {
      let fieldCoord = field.getBoundingClientRect();
      let ballRad = ball.getBoundingClientRect().width / 2;

      // click coordinates - coord of the field begining - border - ball radius
      let coord = {
        left: e.clientX - fieldCoord.x - field.clientLeft - ballRad,
        top: e.clientY - fieldCoord.y - field.clientTop - ballRad,
      }

      // now we have to handle the borders overflow
      if (coord.top < 0) coord.top = 0;

      if (coord.left < 0) coord.left = 0;

      if (coord.left + ballRad * 2 > field.clientWidth) {
        coord.left = field.clientWidth - ballRad * 2;
      }

      if (coord.top + ballRad * 2 > field.clientHeight) {
        coord.top = field.clientHeight - ballRad * 2;
      }

      ball.style.top = coord.top + 'px';
      ball.style.left = coord.left + 'px';
    }

    field.addEventListener('click', move);
  </script>

</body>
</html>