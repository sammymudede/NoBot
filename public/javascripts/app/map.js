var w, h;
var radius = 7;
var POIradius = 130;
var speed = 1;
first = true;
var Pin = "None";
var background = new Image();
background.src = "assets/images/300SCRG.png";
var pinimage = new Image();
pinimage.src = "assets/images/pin-red-icon.png"

var SCRG300 = {
  SCR261: {
    x: 640,
    y: 965
  },
  SCR262: {
    x: 750,
    y: 965
  },
  SCR263: {
    x: 870,
    y: 965
  },
  SCR264: {
    x: 970,
    y: 965
  },
  SCR265: {
    x: 800,
    y: 1190
  },
  SCR281: {
    x: 640,
    y: 750
  },
  SCR282: {
    x: 755,
    y: 750
  },
  SCRLibrary: {
    x: 1016,
    y: 1430
  },
  SCR278: {
    x: 460,
    y: 635
  },
  SCR277: {
    x: 460,
    y: 735
  },
  SCR276: {
    x: 460,
    y: 840
  },
  SCR283: {
    x: 855,
    y: 750
  },
  "Game Room": {
    x: 938,
    y: 750
  },
  SCR275: {
    x: 460,
    y: 940
  },
  SCR274: {
    x: 460,
    y: 1040
  },
  SCR273: {
    x: 460,
    y: 1140
  },
  SCR272: {
    x: 460,
    y: 1240
  },
  SCR271: {
    x: 460,
    y: 1370
  },
  SCR270: {
    x: 590,
    y: 1430
  },
  SCR269: {
    x: 710,
    y: 1430
  },
  SCR269: {
    x: 710,
    y: 1430
  },
  SCR268: {
    x: 810,
    y: 1430
  },
  SCR267: {
    x: 910,
    y: 1430
  }
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

updateLoc = function() {
  if ((robot.x - robot.dest_x) > speed) {
    robot.x -= speed;
  }
  if ((robot.x - robot.dest_x) < -speed) {
    robot.x += speed;
  }
  if ((robot.y - robot.dest_y) > speed) {
    robot.y -= speed;
  }
  if ((robot.y - robot.dest_y) < -speed) {
    robot.y += speed;
  }
  draw();
}

getLoc = function() {
  $.ajax({
    type :  "POST",
    url  :  "/getLocation",
    success: function(data){
      robot.dest_x = data.x;
      robot.dest_y = data.y;
      if (first) {
        robot.x = data.x;
        robot.y = data.y;
        first = false;
      }
    }
  });
};

findEvent = function(room) {
  var result = "";
  if (calendarData[room] != null) {
    result = calendarData[room].currentEvent;
  }
  return result;
}

setLoc = function(new_loc) {
  var url = "/setLocation";
  send(url, new_loc);
};

set_canvas = function(x, y) {
  if (x > 1) {
    w = x*140;
  } else {
    w = 138;
  }
  if (y > 1) {
    h = y*140;
  } else {
    h = 138;
  }
  var string = '<canvas id="map-canvas" width="' + w + '" height="' + h + '"></canvas>';
  $("#mapper").html(string);
  canvas = document.getElementById("map-canvas");
  ctx = ctx = canvas.getContext("2d");

  canvas.addEventListener("mousedown", function(evt)
  {
    mousePos = getMousePos(canvas, evt);
    var xxx = robot.x + (mousePos.x - w/2);
    var yyy = robot.y + (mousePos.y - h/2);
    var json = {
      x: xxx,
      y: yyy
    };
    setLoc(json);
  });
}

var robot = {
  x: 0,
  y: 0,
  render: function() {
    ctx.beginPath();
    ctx.arc(w/2, h/2, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#18bc9c';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#2c3e50';
    ctx.stroke();
  },
  dest_x: 0,
  dest_y: 0
};

printLoc = function() {
  console.log("x: " + robot.x);
  console.log("y: " + robot.y);
  console.log("---------------");
}

function getDistance(a, b) {
  return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
};

function drawEventName(i, val) {
  var text = findEvent(i);
  var start = 0;
  var step = 11;
  var it = 1;
  ctx.font = "10pt Helvetica Neue";
  ctx.fillStyle="#2c3e50";
  while (start < text.length) {
    var t = text.substr(start, step);
    start += step;
    ctx.fillText(t, w/2 + val.x - robot.x - 40, h/2 + val.y - robot.y + 11*it);
    it++;
  }
}

function showPOI() {
  jQuery.each(SCRG300, function(i, val) {
    var dist = getDistance(val, robot);
    if (i == "SCR265") {
      if (dist < 300) {
        ctx.font = "14pt Helvetica Neue";
        ctx.fillStyle="#2c3e50";
        ctx.fillText(i, w/2 + (val.x - robot.x)*0.6 - 40, h/2 + (val.y - robot.y)*0.6);
        ctx.font = "10pt Helvetica Neue";
        ctx.fillStyle="#2c3e50";
        var text = findEvent(i);
        ctx.fillText(text, w/2 + (val.x - robot.x)*0.6 - 40, h/2 + (val.y - robot.y)*0.6 + 12);
      }
    } else {
      if (dist < POIradius) {
        ctx.font = "14pt Helvetica Neue";
        ctx.fillStyle="#2c3e50";
        ctx.fillText(i, w/2 + val.x - robot.x - 40, h/2 + val.y - robot.y);
        drawEventName(i, val);
        // ctx.fillText(text, w/2 + val.x - robot.x - 40, h/2 + val.y - robot.y + 10);
      };
    }
  });
};

function draw() {
  ctx.drawImage(background, robot.x - w/2, robot.y - h/2, w, h, 0, 0, w, h);
  showPOI();

  //showing pin location and visual cues on the border of the map
  if (Pin != "None") {
    var pinloc = SCRG300[Pin];
    var outta_screen = false;
    var disposition = {
      horiz: false,
      vert: false
    }
    if (Math.abs(pinloc.x - robot.x) > w/2 - 15) {
      outta_screen = true;
      disposition.horiz = true;
    }
    if (Math.abs(pinloc.y - robot.y) > h/2 - 15) {
      outta_screen = true;
      disposition.vert = true;
    }

    if (outta_screen) {
      var hh = 2*(pinloc.y - robot.y)*(pinloc.x - robot.x)/w;
      var ww = 2*(pinloc.y - robot.y)*(pinloc.x - robot.x)/h;
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      if (disposition.horiz){
        if (pinloc.x < robot.x) {
          ctx.moveTo(0, h/2 - hh - 30);
          ctx.lineTo(0, h/2 - hh - 10);
        } else {
          ctx.moveTo(w, h/2 + hh - 30);
          ctx.lineTo(w, h/2 + hh - 10);
        }
      }
      if (disposition.vert){
        if (pinloc.y < robot.y) {
          ctx.moveTo(w/2 - ww - 10, 0);
          ctx.lineTo(w/2 - ww + 10, 0);
        } else {
          ctx.moveTo(w/2 + ww - 10, h);
          ctx.lineTo(w/2 + ww + 10, h);
        }
      }
      if (disposition.vert && disposition.horiz) {
        if (pinloc.x < robot.x) {
          if (pinloc.y < robot.y) {
            //top left
            ctx.moveTo(10, 0);
            ctx.lineTo(0, 10);
          } else {
            //bottom left
            ctx.moveTo(0, h-10);
            ctx.lineTo(10, h);
          }
        } else {
          if (pinloc.y < robot.y) {
            //top right
            ctx.moveTo(w-10, 0);
            ctx.lineTo(w, 10);
          } else {
            //bottom right
            ctx.moveTo(w, h-10);
            ctx.lineTo(w-10, h);
          }
        }
      }
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // that was the section responsible for drawing red lines on the border

    ctx.drawImage(pinimage, w/2 + pinloc.x - robot.x - 20, h/2 + pinloc.y - robot.y - 45, 30, 30);
  };
  robot.render();
}

$(document).ready(function(e) {
  var startx, starty, map;
  try {
    startx = document.getElementById("map").getAttribute("data-sizex");
    starty = document.getElementById("map").getAttribute("data-sizey");
    set_canvas(startx, starty);
    setInterval(getLoc, 500);
    setInterval(updateLoc, 10);
  } catch(err) {
    ;
  }


});
