/*
 * SimplyJS JavaScript Library v1.2
 *
 * Copyright(c) 2018 Simply Coding
 * https://www.simplycoding.org
 * Released under the MIT license
 *
 * Date: 2018-11-16
 */

/**
 * @module sjs
 */
function _sjs(){
    var t;
    this.stages = [];
    this.stage = '';
    this.fullscreen = 0;
    this.mouse = { };
    this.gx = 0;
    this.gy = 0;
    this.scroll;
    this.paused = false;
    var collisionEvents = [], collided = [];
    var key_state = {}, key_events = {};
    var _this = this;
  
    /**
     * @func open
     * @desc Sets an element to be the root element for all
     * sjs objects.
     * @static
     * @param {string} target - The id of the target element
     * @param {number} w - (optional) The width to set the element to.
     * Defaults to 500.
     * @param {number} h - (optional) The height to set the element to.
     * Defaults to 400.
     */
    this.open = function(target, w, h){
      if(w == undefined && h == undefined){w=500;h=400;}
      if(w != undefined && h == undefined)h=w;
      if(w == 0){
        w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      }
      t = document.getElementById(target);
      if(t == undefined) {
        t = document.getElementById("target");
        if(t == undefined){
          alert("unable to open.");
          return;
        }
      }
      t.width = w;
      t.height = h;
      t.style.width    = w+"px";
      t.style.height   = h+"px";
      t.style.position = "relative";
      t.style.overflow = "hidden";
      t.x = t.getBoundingClientRect().left;
      t.y = t.getBoundingClientRect().top;
  
      /** @var {sjs.Base} module:sjs.top_screen */
      this.top_screen = this.MakeObj({type: "top_screen", x:0, y:-1,
                               width: w, height: 1});
      this.top_screen.getWidth = vw;
  
      /** @var {sjs.Base} module:sjs.bottom_screen */
      this.bottom_screen = this.MakeObj({type: "bottom_screen", x:0, y:h,
                                  width: w, height: 1});
      this.bottom_screen.getWidth = vw;
  
      /** @var {sjs.Base} module:sjs.left_screen */
      this.left_screen = this.MakeObj({type: "left_screen", x:-1, y:0,
                                width: 1, height: h});
      this.left_screen.getHeight = vh;
  
      /** @var {sjs.Base} module:sjs.right_screen */
      this.right_screen = this.MakeObj({type: "right_screen", x:w, y:0,
                                 width: 1, height: h});
      this.right_screen.getHeight = vh;
      this.right_screen.getX = function(){return this.offset_x+this.x;}
      this.right_screen.offset = function(x,y){this.offset_x = x;this.offset_y=y;}
      this.right_screen.update = function(){this.x=vw();}
      this.right_screen.offset_x=0;
      this.right_screen.offset_y=0;
  
      /** @var {sjs.Base} module:sjs.bottom_screen */
      this.bottom_screen.getWidth = vw;
      this.bottom_screen.getY = function(){return this.offset_y + this.y;}
      this.bottom_screen.offset = function(x,y){this.offset_x=x;this.offset_y=y;}
      this.bottom_screen.update = function(){this.y=vh();}
      this.bottom_screen.offset_y=0;
      this.bottom_screen.offset_x=0;
  
      this.mouse = this.MakeObj({width:1,height:1});
      this.mouse.x = undefined;
      this.mouse.y = undefined;
      this.mouse.getX = function(){ return _this.mouse.rx - t.x - _this.gx; };
      this.mouse.getY = function(){ return _this.mouse.ry - t.y - _this.gy; };
  
      this.makeStage("default");
  
      setInterval(function(){_this.stages[_this.stage].update();},40);
      window.onkeydown = function(e){
        key_state[e.keyCode] = true;
        if(e.keyCode == UP_KEY   || e.keyCode == DOWN_KEY ||
           e.keyCode == LEFT_KEY || e.keyCode == RIGHT_KEY)e.preventDefault();
      }
      window.onkeyup = function(e){
        key_state[e.keyCode] = false;
        if(_this.stages[_this.stage].keyUp){
          _this.stages[_this.stage].keyUp();
          e.preventDefault();
        }
  
      }
      t.onmousemove = function(e){
        _this.mouse.rx = e.clientX;
        _this.mouse.ry = e.clientY;
        _this.mouse.x = e.clientX - t.x - _this.gx;
        _this.mouse.y = e.clientY - t.y - _this.gy;
      }
      t.onmousedown = function(e){
        if(_this.stages[_this.stage].mouseDown!=undefined)
          _this.stages[_this.stage].mouseDown();
      }
      t.onmouseup = function(e){
      if(_this.stages[_this.stage].mouseUp!=undefined)
          _this.stages[_this.stage].mouseUp();
      }
      t.addEventListener("touchend", function(e){
        sjs.mouse.x = e.changedTouches[0].pageX;
        sjs.mouse.y = e.changedTouches[0].pageY;
        if(_this.stages[_this.stage].touchEnd){
          _this.stages[_this.stage].touchEnd();
          e.preventDefault();
        }
      });
    }
  
    /**
     * @class module:sjs.Base
     * @classdesc A class that contains basic functionality common to
     * many sjs components.
     */
    this.Base = function(){
  
  
      /**
       * @func module:sjs.Base#offset
       * @desc Moves the Object to a new position relative to
       * its current position.
       * @param {number} x - The amount to shift in the x(horizontal) direction.
       * @param {number} y - The amount to shift in the y(vertical) direction.
       */
      this.offset = function(x,y){
        this.x+=x;this.y+=y;
        this.node.style.left=Math.round(this.x)+(this.fixed?0:_this.gx)+"px";
        this.node.style.top =Math.round(this.y)+(this.fixed?0:_this.gy)+"px";
        return this;
      }
  
      /**
       * @func module:sjs.Base#moveTo
       * @desc Sets the object's position x and y coordinates.
       * @param {number} x - the new x coordinate
       * @param {number} y - the new y coordinate
       */
      this.moveTo = function(x,y){
        if(x==undefined && y==undefined){x=this.x;y=this.y;}
        if(y==undefined && x!=undefined){
          this.x=x; this.y=x;
        } else {
          this.x=x; this.y=y;
        }
        this.node.style.left=Math.round(x)+(this.fixed?0:_this.gx)+"px";
        this.node.style.top =Math.round(y)+(this.fixed?0:_this.gy)+"px";
        return this;
      }
  
      /**
       * @func module:sjs.Base#setWidth
       * @desc Sets the object's width.
       * @param {number} w - the new width in pixels
       */
      this.setWidth = function(w){if(w){this.node.style.width = w+"px";}return this;}
  
      /**
       * @func module:sjs.Base#setHeight
       * @desc Sets the object's Height.
       * @param {number} h - the new height in pixels
       */
      this.setHeight = function(h){if(h){this.node.style.height = h+"px";}return this;}
  
      /**
       * @func module:sjs.Base#scaleSize
       * @desc Scales the object by multiplying the width and the height. If the last paramter is omitted, then both the width and height are scaled. (ex. scaleSize(5) is the same as scaleSize(5, 5))
       * @param {number} a - the amount to scale the width in pixels
       * @param {number} b - the amount to scale the height in pixels (optional)
       */
      this.scaleSize = function(a,b){if(a!=undefined&&b==undefined){b=a;}this.setSize(this.getWidth()*a,this.getHeight()*b);}
  
      /**
       * @func module:sjs.Base#grow
       * @desc Adds a fixed amount to the width and height of the object. If the last paramter is omitted then both the width and the height are increased by the passed amount. (ex. grow(5, 5) is the same as grow(5))
       * @param {number} a - the amount to increase the height in pixels
       * @param {number} b - the amount to increase the width in pixels
       */
      this.grow = function(a,b){if(a!=undefined&&b==undefined){b=a;}var c = this.getCenter(); this.setSize(this.getWidth()+a,this.getHeight()+b); this.centerAt(c.x,c.y); }
  
  
      /**
       * @func module:sjs.Base#getX
       * @desc Gets the object's x position
       * @returns {number} the object's x coordinate
       */
      this.getX = function(){if(this.fixed){return this.x - _this.gx;} return this.x;}
  
      /**
       * @func module:sjs.Base#getY
       * @desc Gets the object's y position
       * @returns {number} the object's y coordinate
       */
      this.getY = function(){if(this.fixed){return this.y - _this.gy;} return this.y;}
  
      /**
       * @func module:sjs.Base#top
       * @desc Moves the object to the top of the screen (sets the y coordinate to 0).
       */
      this.top = function(){this.y=0;return this;}
  
      /**
       * @func module:sjs.Base#top
       * @desc Aligns the object to the left side of the screen (sets the x coordinate to 0).
       */
      this.left = function(){this.x=0;return this;}
  
      /**
       * @func module:sjs.Base#right
       * @desc Aligns the object flush against the right side of the screen.
       */
      this.right = function(){
        this.x = (t.width - this.getWidth());
        this.node.style.left = Math.round(this.x) + "px";
        return this;
      }
  
      /**
       * @func module:sjs.Base#bottom
       * @desc Aligns the object flush against the bottom the screen.
       */
      this.bottom = function(){
        this.y = (t.height - this.getHeight());
        this.node.style.top = Math.round(this.y) + "px";
        return this;
      }
  
      /**
       * @func module:sjs.Base#centerV
       * @desc Centers the object vertically.
       */
      this.centerV = function(){
        this.y = ((t.height/2) - (this.getHeight()/2));
        this.node.style.top = this.y + "px";
        return this;
      }
  
      /**
       * @func module:sjs.Base#centerH
       * @desc Centers the object horizontally.
       */
      this.centerH = function(){
        this.x = ((t.width/2) - (this.getWidth()/2));
        this.node.style.left = this.x + "px";
        return this;
      }
  
      /**
       * @func module:sjs.Base#getCenter
       * @desc Gets the center coordinates of the object.
       * @returns {Object} Object with an x and y attribute with the center of the object
       */
      this.getCenter = function(){
        return {x:this.x+(this.getWidth()/2), y:this.y+(this.getHeight()/2) };
      }
  
      /**
       * @func module:sjs.Base#isLeftOf
       * @desc Determines whether or not an object is to the left of another object.
       * @param a {Object} Object that is or derives from sjs.Base
       * @returns {boolean} true if the object is left of the passed object
       */
      this.isLeftOf = function(a){
        return (this.getCenter().x < a.getCenter().x);
      }
  
      /**
       * @func module:sjs.Base#isRightOf
       * @desc Determines whether or not an object is to the right of another object.
       * @param a {Object} Object that is or derives from sjs.Base
       * @returns {boolean} true if the object is left of the passed object
       */
      this.isRightOf = function(a){
        return (this.getCenter().x > a.getCenter().x);
      }
  
      /**
       * @func module:sjs.Base#isTopOf
       * @desc Determines whether or not an object is above of another object.
       * @param a {Object} Object that is or derives from sjs.Base
       * @returns {boolean} true if the object is above of the passed object
       */
      this.isTopOf = function(a){
        return (this.getCenter().y < a.getCenter().y);
      }
  
      /**
       * @func module:sjs.Base#isBottomOf
       * @desc Determines whether or not an object is below of another object.
       * @param a {Object} Object that is or derives from sjs.Base
       * @returns {boolean} true if the object is below of the passed object
       */
      this.isBottomOf = function(a){
        return (this.getCenter().y > a.getCenter().y);
      }
  
      this.isAboveOf = function(a,p){
        /*if(p==undefined)p=.5;
        var h = this.getY() + this.getHeight();
        return ((Math.abs(h - a.getY()) / this.getHeight())>p);
        */
        var d = _this.getDeltas(a,this);
        return (d.x > d.y);
      }
  
      /**
       * @func module:sjs.Base#moveLeftOf
       * @desc Moves an object exactly to the left of another object.
       * @param a {Object} Object to move to the left of that is or derives from sjs.Base
       */
      this.moveLeftOf = function(a){
        this.x=a.getX()-this.getWidth();
      }
  
      /**
       * @func module:sjs.Base#moveRightOf
       * @desc Moves an object exactly to the right of another object.
       * @param a {Object} Object to move to the right of that is or derives from sjs.Base
       */
      this.moveRightOf = function(a){
        this.x=a.getX()+a.getWidth();
      }
  
      /**
       * @func module:sjs.Base#moveTopOf
       * @desc Moves an object exactly above of another object.
       * @param a {Object} Object to move above of that is or derives from sjs.Base
       */
      this.moveTopOf = function(a){
        this.y=a.getY()-this.getHeight();
      }
  
      /**
       * @func module:sjs.Base#moveBottomOf
       * @desc Moves an object exactly below of another object.
       * @param a {Object} Object to move below of that is or derives from sjs.Base
       */
      this.moveBottomOf = function(a){
        this.y=a.getY()+a.getHeight();
      }
  
      /**
       * @func module:sjs.Base#centerAt
       * @desc Centers the object at a specified x and y coordinate.
       * @param nx {number} x coordinate to center the object around
       * @param ny {number} y coordinate to cetner the object around
       */
      this.centerAt = function(nx, ny){
        this.x = nx-this.getWidth()/2;
        this.y = ny-this.getHeight()/2;
      }
  
      /**
       * @func module:sjs.Base#center
       * @desc Centers an object vertically and horizontally. Is chainable.
       */
      this.center = function(){this.centerV();this.centerH();return this;};
  
      /**
       * @func module:sjs.Base#getWidth
       * @desc Gets the width of the object.
       * @returns {number} the current width of the object
       */
      this.getWidth  = function(){return this.node.offsetWidth;};
  
      /**
       * @func module:sjs.Base#getHeight
       * @desc Gets the height of the object.
       * @returns {number} the current height of the object
       */
      this.getHeight = function(){return this.node.offsetHeight;};
  
      /**
       * @func module:sjs.Base#setSize
       * @desc Sets the size of the object. If only the first paramter is passed, then both the height and width are set to that value.
       * @params w {number} the value to set the width to
       * @params h {number} the value to set the height to
       */
      this.setSize = function(w, h){if(w != undefined && h == undefined)h=w;  this.node.width=w; this.node.height=h;}
  
      /**
       * @func module:sjs.Base#hide
       * @desc Hides the object. Is Chainable.
       */
      this.hide = function(){this.node.style.display="none";return this;};
  
      /**
       * @func module:sjs.Base#show
       * @desc Shows the object. Is Chainable.
       */
      this.show = function(){this.node.style.display="inline";return this;};
  
      /**
       * @func module:sjs.Base#destroy
       * @desc Removes the object from the stage, and removes the node from the DOM.
       */
      this.destroy = function(){removeFromStage(this);if(this.node && this.node.parentNode == t)t.removeChild(this.node);};
  
  
      /**
       * @func module:sjs.Base#makeGlobal
       * @desc Removes the object from the stage so it is always visible. Is Chainable.
       */
      this.makeGlobal = function(){_this.removeFromStage(this);this.node.style.zIndex="100"; return this;}
  
      this.x = 0;
      this.y = 0;
    };
    baseObj = new this.Base();
  
    /**
     * @class module:sjs.Movable
     * @classdesc Contains functionality related to moving an object
     * with a velocity and friction attributes
     * @extends module:sjs.Base
     */
    this.Moveable = function(){
  
      this.update = function(){
        this.x += this.sx; this.y += this.sy;
        if(Math.abs(this.sx) < 0.5)this.sx=0;
        if(Math.abs(this.sy) < 0.5)this.sy=0;
        this.sx -= this.friction*this.sx;
        this.sy -= this.friction*this.sy;
  
        if(this.isHeld && this.onHold != undefined){this.onHold();}
  
        if(this.followx_obj && !isNaN(this.followx_last)){
          this.x += (this.followx_obj.getX() - this.followx_last);
          this.followx_last = this.followx_obj.getX();
        }
        if(this.followy_obj && !isNaN(this.followy_last)){
          this.y += (this.followy_obj.getY() - this.followy_last);
          this.followy_last = this.followy_obj.getY();
        }
  
        if(this.noBounds==undefined){
          c = _this.clamp(this.x, 0, vw()-this.getWidth());
          if(c != this.x){this.sx=0;this.x=c;}
          c = _this.clamp(this.y, 0, vh()-this.getHeight());
          if(c != this.y){this.sy=0;this.y=c;}
        }
        if(this.max_x != undefined && this.min_x != undefined)this.x = _this.clamp(this.x, this.min_x, this.max_x);
        if(this.max_y != undefined && this.min_y != undefined)this.y = _this.clamp(this.y, this.min_y, this.max_y);
        if(this.ay != undefined)this.sy += this.ay;
      }
      this.stop      = function(k){this.sx=0;this.sy=0;return this;}
      this.pushUp    = function(k){this.sy-=(this.accel*this.topSpeed*(k?k:1));return this;}
      this.pushDown  = function(k){this.sy+=(this.accel*this.topSpeed*(k?k:1));return this;}
      this.pushLeft  = function(k){this.sx-=(this.accel*this.topSpeed*(k?k:1));return this;}
      this.pushRight = function(k){this.sx+=(this.accel*this.topSpeed*(k?k:1));return this;}
      this.scaleSpeed = function(a,b){if(a!=undefined&&b==undefined){b=a;}this.sx*=a;this.sy*=b;}
      this.adjustSpeed = function(a,b){if(a!=undefined&&b==undefined){b=a;}this.sx+=a;this.sy+=b;}
      this.getClamp = function(){return {x: vw()-this.getWidth(),y:vh()-this.getHeight()};}
  
      this.bounce = function(){this.noBounds=true;
        if(this.type==undefined)this.type="object";
        _this.onHit(this.type, "left_screen", _this.bounceOff);
        _this.onHit(this.type, "right_screen", _this.bounceOff);
        _this.onHit(this.type, "top_screen", _this.bounceOff);
        _this.onHit(this.type, "bottom_screen", _this.bounceOff);
        return this;
      }
  
  
  
  
      this.setCourse = function(path){
        var i = 0;
        if(path.length > 0)
          this.slide(path[0].dx, path[0].dy, path[0].duration, slideCallback.bind(this))
        function slideCallback(){
          if(++i < path.length)
            this.slide(path[i].dx, path[i].dy, path[i].duration, slideCallback.bind(this));
        }
      };
      this.slide = function(dx, dy, time, cb){
        this.friction = 0;
        var tot = 0, x0 = this.x, y0 = this.y, lastTime = null;
        var timerId = requestAnimationFrame(updateSlide.bind(this));
        function updateSlide(timeStamp) {
          if(lastTime && timeStamp != lastTime){
            tot += timeStamp - lastTime;
            this.x = x0 + dx * (tot /(time*1000));
            this.y = y0 + dy * (tot /(time*1000));
            if(tot >= (time*1000))return (cb ? cb() : 0);
          }
          lastTime = timeStamp;
          timerId = window.requestAnimationFrame(updateSlide.bind(this));
        }
      };
  
  
  
      this.followx = function(a){
        if(a.x == undefined && a.y == undefined &&
          _this.mouse.x == undefined && _this.mouse.y == undefined){
          (function(o){setTimeout(function(){o.followx(_this.mouse);},100);})(this);
          return;
        }
        this.followx_obj = a;
        this.followx_last = a.x;
      }
      this.followy = function(a){
        if(a.x == undefined && a.y == undefined &&
          _this.mouse.x == undefined && _this.mouse.y == undefined){
          (function(o){setTimeout(function(){o.followy(_this.mouse);},100);})(this);
          return;
        }
        this.followy_obj = a;
        this.followy_last = a.y;
      }
      this.follow = function(a){
        this.followx(a);
        this.followy(a);
      }
      this.unfollowx = function(){delete this.followx_obj;delete this.followx_last;}
      this.unfollowy = function(){delete this.followy_obj;delete this.followy_last;}
      this.unfollow = function(){this.unfollowx();this.unfollowy();}
      this.draggable = function(){
        this_obj = this;
        (function(obj) {
          obj.onMouseDown(function(){ obj.follow(_this.mouse);
            t.onmouseup = function(){ obj.unfollow();};
          });
          t.onmouseup = function(){ obj.unfollow();};
        })(this_obj);
      }
      this.undraggable = function(){
        this.onMouseDown(function(){});
        this.onMouseUp(function(){});
      }
      this.onHit = function(o,callback){return _this.onHit(this.type,o,callback);}
      this.setMaxMinX = function(mx,mn){this.max_x = mx;this.min_x = mn;}
      this.setMaxMinY = function(mx,mn){this.max_y = mx;this.min_y = mn;}
      this.onClick = function(callback){ this.node.onclick=callback; }
      this.onMouseDown = function(callback){this.node.onmousedown=callback; }
      this.onMouseUp = function(callback){ this.node.onmouseup=callback; }
      this.setXSpeed = function(sx){if(sx!=undefined){this.sx=sx;}}
      this.setYSpeed = function(sy){if(sy!=undefined){this.sy=sy;}}
      this.setGravity = function(g){if(g==undefined){g=1;}this.ay=g;}
      this.removeGravity = function(){this.ay=0;}
      this.sx = 0;
      this.sy = 0;
      this.accel = .15;
      this.topSpeed = 10;
      this.friction = .05;
    }
    this.Moveable.prototype = baseObj;
    moveableObj = new this.Moveable();
  
    /**
     * @class module:sjs.Image
     * @classdesc Contains functionality for representing Objects with images.
     * @desc Use <b>new sjs.Image()</b> to create a new instance.
     * @extends module:sjs.Movable
     */
   this.Image = function(src,width,height,radius,show) {
      if(height == undefined && width != undefined){
        this.width = width; this.height = width;
      } else {
        this.width = width; this.height = height;
      }
      this.setImage = function(src, width, height){
        if(height == undefined && width != undefined){
          this.width = width; this.height = width;
        } else {
          this.width = width; this.height = height;
        }
      if(radius== undefined){
        this.radius=0;
      }else{
        this.radius=radius;
      }
      if(show==undefined){
        this.show=false;
      }else{
        this.show=show;
      }
        if(height == undefined && width == undefined){
          this.width = this.getWidth(); this.height = this.getHeight();
        }
        // save src in case object is serialized
        this.src = src;
  
        if(this.node && this.node.parentNode == t)t.removeChild(this.node);
        newnode = new Image();
        newnode.src = src;
        newnode.style.position = "absolute";
        if(typeof(tower) !== 'undefined') {
          newnode.style.borderRadius="50%";
          newnode.style.padding=""+radius+"px";
          newnode.onmouseover=function(){tower.onmouseover();};
          newnode.onmouseout=function(){Tower.onmouseout();};
        }
        newnode.ondragstart=function(){return false;};
        newnode.onmousedown=this.node.onmousedown;
        newnode.onmouseup  =this.node.onmouseup;
        newnode.onclick    =this.node.onclick;
        this.node = newnode;
        if(this.width && this.height) {
          this.node.width = this.width; this.node.height = this.height;
        }
        this.offset(0,0);
        t.appendChild(this.node);
      }
  
      this.copyImage = function(img){
        this.destroy();
        this.node = img.node.cloneNode(true);
        this.show();
        this.offset(0,0);
        t.appendChild(this.node);
      }
  
      this.setFlipImages = function(left,right,up,down){
        if(up == undefined || down == undefined){
          this.left_img = left;
          this.right_img = right;
        }else{
          this.left_img = left;
          this.right_img = right;
          this.up_img = up;
          this.down_img = down;
        }
      }
      this.setHFlipImages = function(left, right){
        this.left_img = left;
        this.right_img = right;
        if(this.facingLeft === undefined){
          this.facingLeft = false;
          this.faceLeft();
        } else {
          this.setImage(this.facingLeft?
          this.left_img:this.right_img);
        }
      }
      this.isFacingLeft = function(){return this.facingLeft;}
      this.pushHFacing = function(){ if(this.facingLeft)this.pushLeft(); else this.pushRight();}
      this.faceLeft = function(){
        if(!this.facingLeft && this.left_img){
          this.setImage(this.left_img);this.facingLeft=true;
        }
      }
      this.isFacingRight = function(){return !this.facingLeft;}
      this.faceRight = function(){
        if((this.facingLeft || this.facingLeft == undefined) && this.right_img){
          this.setImage(this.right_img);
          this.facingLeft=false;
        }
      }
      this.faceHFlip = this.faceFlip = function(){
        if(this.facingLeft){
          this.faceRight();
        } else {
          this.faceLeft();
        }
      }
  
  
      // Manualy set Class type
      this.classType = 'Image';
  
      // Set here so that the deserializer can set the src if need be
      this.src = src;
  
      // Serialization for saving levels
      var serializeAttrs = ['width', 'height', 'x', 'y', 'sx','sy', 'ax', 'ay', 'topSpeed', 'src', 'type', 'facingLeft', 'left_img', 'right_img', 'friction', 'classType', 'noBounds'];
  
      this.serialize = function(){
        var obj = {};
        for(var i = 0; i < serializeAttrs.length;i++) {
          obj[serializeAttrs[i]] = this[serializeAttrs[i]];
        }
        return obj;
      }
  
      // Deserialize if object is passed (stringified or otherwise)
      if(typeof src === 'string' && src[0] === '{') {
        src = JSON.parse(src);
      }
      if(typeof src === 'object'){
        for(var i = 0; i < serializeAttrs.length;i++) {
          this[serializeAttrs[i]] = src[serializeAttrs[i]];
        }
      }
      // this.faceLeft = function(){
      //     this.setImage(this.left_img);
      // }
      // this.faceRight = function(){
      //     this.setImage(this.right_img);
      // }
      this.faceUp = function(){
          this.setImage(this.up_img);
      }
      this.faceDown = function(){
          this.setImage(this.down_img);
      }
  
      this.onmouseover=function(){
        this.node.style.border="2px solid black";
      }
  
      this.onmouseout=function(){
        this.node.style.border="none";
      }
  
      this.node = new Image();
      this.node.src = this.src;
      this.node.style.position = "absolute";
      this.node.ondragstart=function(){return false;};
      if(this.width && this.height) {
        this.node.width = this.width; this.node.height = this.height;
      } else {
        this.node.onload = (function(){
          this.width = this.node.width; this.height = this.node.height;
        }).bind(this);
      }
      this.node.addEventListener("touchstart",(function(obj){ return function(e){obj.isHeld = true;} })(this) );
      this.node.addEventListener("touchenter",(function(obj){ return function(e){alert('enter');obj.isHeld = true;} })(this) );
      this.node.addEventListener("touchend", (function(obj){ return function(e){obj.isHeld = false;} })(this));
      this.node.addEventListener("touchcancel",(function(obj){ return function(e){obj.isHeld = false;} })(this));
      this.node.addEventListener("touchleave", (function(obj){ return function(e){obj.isHeld = false;} })(this));
      this.node.addEventListener("mousedown",(function(obj){ return function(){obj.isHeld = true;} })(this));
      this.node.addEventListener("mouseup", (function(obj){ return function(){obj.isHeld = false;} })(this));
    this.node.addEventListener("onmouseover", (function(obj){return function(){this.node.style.border="2px solid black";}})(this));
    this.node.addEventListener("onmouseout", (function(obj){return function(){this.node.style.border="none";}})(this));
      t.appendChild(this.node);
      _this.addToStage(this);
    };
    this.Image.prototype = moveableObj;
  
    /**
    * @class module:sjs.Button
    * @classdesc A simple wrapper for &lt;button&gt; DOM elements.
    * @extends module:sjs.Base
    */
    this.Button = function(txt, callback, size, color, font) {
      if(size == undefined)size=18;
      if(color == undefined)color="black";
      if(font == undefined)font="Arial";
      this.setText = function(txt){this.node.innerHTML = txt;}
      this.node = document.createElement('button');
      this.node.style.position = "absolute";
      this.node.innerHTML = txt;
      this.node.style.fontFamily=font;
      this.node.onclick = callback;
      this.node.style.fontSize=size+"px";
      this.node.style.color=color;
      t.appendChild(this.node);
      this.update = function(){};
      this.fixed=true;
      _this.addToStage(this);
    }
    this.Button.prototype = baseObj;
  
    /**
    * @class module:sjs.Text
    * @classdesc A simple wrapper for &lt;span&gt; DOM elements.
    * @extends module:sjs.Base
    */
    this.Text = function(txt, size, color, font){
      if(size == undefined)size=18;
      if(color == undefined)color="black";
      if(font == undefined)font="Arial";
  
      this.setText = function(txt){this.node.innerHTML = txt;}
  
      this.node = document.createElement('span');
      this.node.style.position = "absolute";
      this.node.style.fontSize=size+"px";
      this.node.style.color=color;
      this.node.style.fontFamily=font;
      this.node.innerHTML = txt;
      t.appendChild(this.node);
      this.update = function(){};
      _this.addToStage(this);
    }
    this.Text.prototype = baseObj;
    this.addScreens = function(){
      this.stages[this.stage].objects.push(this.top_screen);
      this.stages[this.stage].objects.push(this.bottom_screen);
      this.stages[this.stage].objects.push(this.left_screen);
      this.stages[this.stage].objects.push(this.right_screen);
    }
  
    this.makeStage = function(s){
      if(this.stages[s] == undefined){
        this.stages[s] = {objects: [], update: this.updateStage};
        key_events[s] = {};
        this.setStage(s);
        this.addScreens();
      } else {
        this.setStage(s);
      }
    }
  
    this.setStage = function(s){
      if(this.stages[s]!=undefined) {
        for(var i=0;this.stage!=''&&i<this.stages[this.stage].objects.length;i++)
          this.stages[this.stage].objects[i].hide();
        for(var i=0;i<this.stages[s].objects.length;i++)
          this.stages[s].objects[i].show();
        this.stage = s;
      } else { this.makeStage(s); }
    }
  
    this.clearStage = function(){
      this.stages[this.stage].objects = [];
    }
  
    this.updateStage = function(){
      if(_this.paused) { return; }
      for(var i=0;i<this.objects.length;i++){
        this.objects[i].update();
      }
  
      _this.testCollisions();
  
      for(var i=0;i<this.objects.length;i++){
        this.objects[i].moveTo();
      }
  
      // run key events
      for( k in key_events[_this.stage]){
        if(key_state[k]){key_events[_this.stage][k]();}
      }
  
      if(_this.scroll){
        _this.gx = _this.clamp((t.width/2) - (_this.scroll.obj.x+(_this.scroll.obj.getWidth()/2)), -(_this.scroll.area.getWidth()-t.width),0);
        _this.bottom_screen.getWidth=function(){return _this.scroll.area.getWidth();}
  
        _this.gy = _this.clamp((t.height/2) - (_this.scroll.obj.y+(_this.scroll.obj.getHeight()/2)), -(_this.scroll.area.getHeight()-t.height),0);
        //_this.gy = (t.height/2) - (_this.scroll.obj.y+(_this.scroll.obj.getHeight()/2));
      }
    }
  
    this.testCollisions = function(){
      for(var i=0;i<this.stages[this.stage].objects.length;i++){
        for(var j=i;j<this.stages[this.stage].objects.length;j++){
          for(var k=0;k<collisionEvents.length;k++){
            testCollisionBetween(collisionEvents[k],this.stages[this.stage].objects[i],
              this.stages[this.stage].objects[j]);
          }
        }
      }
    }
  
    this.destroyAll = function(type){
      for(var i=0;i<this.stages[this.stage].objects.length;i++){
        if(this.stages[this.stage].objects[i].type == type || !type){
          this.stages[this.stage].objects[i].destroy();
          i--;
        }
      }
      if(type==undefined)_this.addScreens();
    }
    this.addKeysFromStage = function(stage){
      for(k in key_events[stage])
        key_events[this.stage][k] = key_events[stage][k];
    }
  
    this.handleKeyDown = function(key, callback){
      document.addEventListener('keydown', function(e) {
        if(e.keyCode === key) { callback(e); }
      });
    }
  
    this.keyDown = function(key, callback){
      key_events[this.stage][key] = callback;
    }
  
    this.mouseDown = function(callback){
      this.stages[this.stage].mouseDown = callback;
    }
  
    this.mouseUp = function(callback){
      this.stages[this.stage].mouseUp = callback;
    }
  
    this.touchEnd = function(callback){
      this.stages[this.stage].touchEnd = callback;
    }
    this.getT = function(){return t;}
  
    this.bounceOff = function(a,b){
      var d = _this.getDeltas(a,b);
      /*var e = _this.getDeltas(_this.MakeObj({x:a.x-(a.sx?a.sx:0), y:a.y-(a.sy?a.sy:0),
                        width: a.getWidth(), height: a.getHeight()}),
      _this.MakeObj({x:b.x-(b.sx?b.sx:0), y:b.y-(b.sy?b.sy:0),
                        width: b.getWidth(), height: b.getHeight()}));
      d.x = (d.x+e.x)/2;
      d.y = (d.y+e.y)/2;
      */
  
      if(d.x < d.y){
        if(a.isLeftOf(b))a.moveLeftOf(b);
        if(a.isRightOf(b))a.moveRightOf(b);
        a.sx *= -1;
        a.sx += (b.sx?b.sx:0)/4;
        if(a.facingLeft != undefined)a.faceHFlip();
      }
      if(d.x > d.y){
        if(a.isTopOf(b))a.moveTopOf(b);
        if(a.isBottomOf(b))a.moveBottomOf(b);
        a.sy *= -1;
        a.sy += (b.sy?b.sy:0)/4;
      }
      /*if(d.x == d.y){
        a.sx *= -1; a.sy *= -1;
        a.sx += (b.sx?b.sx:0)/2;
        a.sy += (b.sy?b.sy:0)/2;
      }*/
    }
  
    this.stoppedBy = function(a,b){
      var d = sjs.getDeltas(a,b);
      if(d.x >= d.y){
        if(a.isTopOf(b))a.moveTopOf(b);
        else if(a.isBottomOf(b))a.moveBottomOf(b);
        a.sy=0;
      } else {
        if(a.isLeftOf(b))a.moveLeftOf(b);
        else if(a.isRightOf(b))a.moveRightOf(b);
        a.sx=0;
      }
    }
  
    this.MakeObj = function(o){
      var nobj = new this.Base();
      for(a in o){nobj[a]=o[a];}
      nobj.update = function(){};
      nobj.moveTo = function(){};
      nobj.show = function(){};
      nobj.hide = function(){};
      nobj.getWidth = function(){return this.width;};
      nobj.getHeight = function(){return this.height;};
      nobj.offset = function(x,y){if(x)this.x+=x; if(y)this.y+=y;};
      nobj.getX = function(){return this.x;}
      nobj.getY = function(){return this.y;}
      return nobj;
      /*return {type: o.type, x: o.x, y: o.y, getWidth:function(){return o.width;},getHeight:function(){return o.height;},show:function(){},hide:function(){},update:function(){},offset:function(x,y){if(x){this.x+=x;}if(y){this.y+=y;}},move:function(){}};*/
    }
  
    this.saveImageArray = function(array){
      var serializedImages = [];
      for(var i in array){
        if(array[i].classType === 'Image'){
          serializedImages.push(array[i].serialize());
        }
      }
      return JSON.stringify(serializedImages);
    };
  
    this.loadImageArray = function(str){
      var array = JSON.parse(str);
      var newArray = [];
      if(!(array instanceof Array))return console.log("loadImageArray(): Input error");
      for(var i in array){
        if(array[i].classType === 'Image'){
          newArray.push(new _this.Image(array[i]));
        }
      }
      return newArray;
    };
  
    addCollisionEvent = function(e){
      for(var i=0;i<collisionEvents.length;i++){
        if(   (collisionEvents[i].aType == e.aType
            && collisionEvents[i].bType == e.bType) ||
              (collisionEvents[i].bType == e.aType &&
               collisionEvents[i].aType == e.bType))
           {collisionEvents.splice(i,1);i--;}
      }
      collisionEvents.push(e);
  
    }
  
    /**
    * @func module:sjs.onHit
    * @desc Creates a new handler for when two objects
    * with the specified types collide. The types can
    * be the same.
    * @param {string} a - An object type for this rule
    * @param {string} b - Another object type for this rule
    * @param {function} callback - A callback function of the form
    * function(obj1, obj2){} that will be passed the two objects
    * that have collided.
    * @param {number} percent - A decimal number between 0 and 1
    * that specifies how much of the images must
    * overlap before considering them "collided".
    * 0% means any overlap will trigger a collision,
    * 100% means the objects must be completely overlaped to to
    * trigger a collision.
    */
    this.onHit = function(a,b,callback,percent,stages,minDelay){
      if(!percent){percent = 0;}
      if(!stages){stages=[this.stage];}
      if(typeof(stages)=="string")stages = [stages];
      var id = (new Date()).valueOf();
      if(typeof(a) == "object" && typeof(b) == "object") {
        for(var i=0;i<b.length;i++)
          for(var j=0;j<a.length;j++)
          addCollisionEvent({handler: callback, aType: a[j], bType: b[i], flag: true, per:percent, stages: stages, minDelay: minDelay, active: true, id: id});
  
      }
      if(typeof(a) == "object" && typeof(b) == "string") {
        for(var i=0;i<a.length;i++)
          addCollisionEvent({handler: callback, aType: a[i], bType: b, flag: true, per:percent, stages: stages, minDelay: minDelay, active: true, id: id});
  
      }
      if(typeof(a) == "string" && typeof(b) == "object") {
        for(var i=0;i<b.length;i++)
          addCollisionEvent({handler: callback, aType: a, bType: b[i], flag: true, per:percent, stages: stages, minDelay: minDelay, active: true, id: id});
  
      }
      if(typeof(a) == "string" && typeof(b) == "string") {
          addCollisionEvent({handler: callback, aType: a, bType: b, flag: true, per:percent, stages: stages, minDelay: minDelay, active: true, id: id});
      }
      return id;
    }

    this.removeOnHit = function(id) {
      for(var i=0;i<collisionEvents.length;i++) {
        if(collisionEvents[i].id === id) {
          collisionEvents.splice(i,1);
          return id;
        }
      }
    }
  
    this.getOverlapRatio = function(a,b){
      if(!this.testCollision(a,b))return 0;
      var delta = this.getDeltas(a,b);
      var min_width = Math.min(a.getWidth(), b.getWidth());
      var min_height = Math.min(a.getHeight(), b.getHeight());
      return (delta.x * delta.y) / (min_width * min_height);
    }
    this.getDeltas = function(a,b) {
      var top_left = {}, bottom_right = {};
      top_left.x = Math.min(a.getX(), b.getX());
      top_left.y = Math.min(a.getY(), b.getY());
      bottom_right.x = Math.max(a.getX()+a.getWidth(), b.getX()+b.getWidth());
      bottom_right.y = Math.max(a.getY()+a.getHeight(), b.getY()+b.getHeight());
  
      return {x:(a.getWidth() + b.getWidth()) - (bottom_right.x - top_left.x),
              y:(a.getHeight() + b.getHeight()) - (bottom_right.y - top_left.y)};
    }
    this.addToStage = function (obj){
      this.stages[this.stage].objects.push(obj);
      obj.show();
    }
    this.removeFromStage = function(obj){
      for(i=0;i<this.stages[this.stage].objects.length;i++) {
        if(obj == this.stages[this.stage].objects[i]) {
          this.stages[this.stage].objects.splice(i,1);
          i--;
        }
      }
    }
  
    this.scrollable = function(follow, area){
      this.scroll = {obj: follow, area: area};
    }
    this.addCopyOfArray = function(a){
      for(var i=0;i<a.length;i++)this.addCopyToStage(a[i]);
    }
  
    this.addCopyToStage = function(o){
      var nImg = new _this.Image(o.src);
      nImg.moveTo(o.getX(),o.getY());
      nImg.type = o.type;
      nImg.node.width  = o.node.width;
      nImg.node.height = o.node.height;
      nImg.sx = o.sx;
      nImg.sy = o.sy;
      nImg.left_img   = o.left_img;
      nImg.friction = o.friction;
      nImg.right_img  = o.right_img;
      nImg.facingLeft = o.facingLeft;
      nImg.noBounds   = o.noBounds;
  
      return nImg;
    }
  
    this.getWidth  = function(){return t.width;}
    this.getHeight = function(){return t.height;}
  
    this.pause = function() {
      _this.paused = true;
    }
  
    this.resume = function() {
      _this.paused = false;
    }
  
   // "Private" functions
  
    var _this = this;
  
    function vw(){ if(_this.scroll){return _this.scroll.area.getWidth();} return t.width;}
    function vh(){ if(_this.scroll){return _this.scroll.area.getHeight();} return t.height;}
  
  
  
    function removeFromStage(obj){
      for(var i=0;i<_this.stages[_this.stage].objects.length;i++){
        if(obj == _this.stages[_this.stage].objects[i])
          _this.stages[_this.stage].objects.splice(i,1);
      }
    }
  
    this.getobjs = function(){return this.stages[this.stage].objects;}
  
    this.clamp = function(x, min, max){
      return Math.min(Math.max(x, min), max);
    }
  
    function testCollisionBetween(e, a, b){
      if(a == undefined || b == undefined || e == undefined)return;
      if(a.type == undefined || b.type == undefined || a == b)return;
      if(e.bType == a.type && e.aType == b.type && e.bType !== e.aType)
        testCollisionBetween(e,b,a);
  
      if(e.aType == a.type && e.bType == b.type ){
        if( _this.testCollision(a, b) ){
          if((e.per == undefined || e.per < _this.getOverlapRatio(a,b)) &&
             e.stages.indexOf(_this.stage)!=-1)
          {
            if(inArray([a,b],collided) == -1 &&
               inArray([b,a],collided) == -1){
  
                if(e.active) {
                    e.handler(a,b);
                    if(e.minDelay){
                        e.active = false;
                        setTimeout(function(){e.active = true;}, e.minDelay);
                    }
                }
              //collided.push([a,b]);
            }
          }
        } else {
          if(inArray([a,b],collided) != -1)
              collided.splice(inArray([a,b],collided),1);
          if(inArray([b,a],collided) != -1)
              collided.splice(inArray([b,a],collided),1);
        }
      }
    }
  
    this.testCollision = function(a, b){
      return !(
            ((a.getY() + a.getHeight()) <= (b.getY())) ||
             (a.getY() >= (b.getY() + b.getHeight()))  ||
            ((a.getX() + a.getWidth()) <= b.getX())    ||
             (a.getX() >= (b.getX() + b.getWidth()))
      );
    }
  
    function inArray(v,a){
      for(var i=0;i<a.length;i++)
        if(a[i][0] == v[0] && a[i][1] == v[1])return i;
      return -1;
    }
  
    this.removeFromArray = function(a, o){
      for(var i=0;i<a.length;i++){
        if(a[i] == o){
          a.splice(i,1);
          i--;
        }
      }
    }
  
  
    function getViewportSize(w) {
  
      // Use the specified window or the current window if no argument
      w = w || window;
  
      // This works for all browsers except IE8 and before
      if (w.innerWidth != null) return { w: w.innerWidth, h: w.innerHeight };
  
      // For IE (or any browser) in Standards mode
      var d = w.document;
      if (document.compatMode == "CSS1Compat")
          return { w: d.documentElement.clientWidth,
             h: d.documentElement.clientHeight };
  
      // For browsers in Quirks mode
      return { w: d.body.clientWidth, h: d.body.clientHeight };
  
    }
  
  }
  /** @global */
  var sjs = new _sjs();
  
  var UP_KEY    = 38;
  var DOWN_KEY  = 40;
  var LEFT_KEY  = 37;
  var RIGHT_KEY = 39;
  var SPACE_KEY = 32;
  var A_KEY = 65;
  var B_KEY = 66;
  var C_KEY = 67;
  var D_KEY = 68;
  var E_KEY = 69;
  var F_KEY = 70;
  var G_KEY = 71;
  var H_KEY = 72;
  var I_KEY = 73;
  var J_KEY = 74;
  var K_KEY = 75;
  var L_KEY = 76;
  var M_KEY = 77;
  var N_KEY = 78;
  var O_KEY = 79;
  var P_KEY = 80;
  var Q_KEY = 81;
  var R_KEY = 82;
  var S_KEY = 83;
  var T_KEY = 84;
  var U_KEY = 85;
  var V_KEY = 86;
  var W_KEY = 87;
  var X_KEY = 88;
  var Y_KEY = 89;
  var Z_KEY = 90;
  var ZERO_KEY = 48;
  var ONE_KEY = 49;
  var TWO_KEY = 50;
  var THREE_KEY = 51;
  var FOUR_KEY = 52;
  var FIVE_KEY = 53;
  var SIX_KEY = 54;
  var SEVEN_KEY = 55;
  var EIGHT_KEY = 56;
  var NINE_KEY = 57;
  
