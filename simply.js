/*
 * SimplyJS JavaScript Library v1.0
 *
 * Copyright 2014 Simply Coding
 * https://www.simplycoding.org
 * Released under the MIT license
 *
 * Date: 2014-05-07
 */

function _sjs(){
  var t;
  this.stages = [];
  this.stage = '';

  this.mouse = { };
  this.gx = 0;
  this.gy = 0;
  this.scroll
  var collisionEvents = [], collided = [];
  var key_state = {}, key_events = {};
  var _this = this;
  this.open = function(target, w, h){
    if(w == undefined && h == undefined){w=500;h=400;}
    if(w != undefined && h == undefined)h=w;
    if(w == 0){
      getViewportSize
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
    t.x = t.getBoundingClientRect().top;
    t.y = t.getBoundingClientRect().left;

    this.top_screen = this.MakeObj({type: "top_screen", x:0, y:-1,
                             width: w, height: 1});
    this.top_screen.getWidth = vw;

    this.bottom_screen = this.MakeObj({type: "bottom_screen", x:0, y:h,
                                width: w, height: 1});
    this.bottom_screen.getWidth = vw;
    
    this.left_screen = this.MakeObj({type: "left_screen", x:-1, y:0,
                              width: 1, height: h});
    this.left_screen.getHeight = vh;
    
    this.right_screen = this.MakeObj({type: "right_screen", x:w, y:0,
                               width: 1, height: h});
    this.right_screen.getHeight = vh;
//    this.right_screen.update = function(){this.x=vw();}

    this.mouse = this.MakeObj({width:1,height:1});

    this.makeStage("default");

    setInterval(function(){_this.stages[_this.stage].update();},40);
    window.onkeydown = function(e){
      key_state[e.keyCode] = true;
    }
    window.onkeyup = function(e){
      key_state[e.keyCode] = false;
      if(_this.stages[_this.stage].keyUp!=undefined)
        _this.stages[_this.stage].keyUp();
    }
    t.onmousemove = function(e){
      _this.mouse.x = e.clientX - t.x;
      _this.mouse.y = e.clientY - t.y;  
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
      //alert(sjs.mouse.x+" "+sjs.mouse.y);
      if(_this.stages[_this.stage].touchEnd){
        _this.stages[_this.stage].touchEnd();   
        //e.preventDefault();
      }
    });
  }
  this.Base = function(){
    this.offset = function(x,y){
      this.x+=x;this.y+=y;
      this.node.style.left=Math.round(this.x)+(this.fixed?0:_this.gx)+"px";
      this.node.style.top =Math.round(this.y)+(this.fixed?0:_this.gy)+"px";
      return this;
    }
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
    this.setWidth = function(w){if(w){this.node.style.width = w+"px";}return this;}
    this.setHeight = function(h){if(h){this.node.style.height = h+"px";}return this;}
    this.getX = function(){if(this.fixed)return this.x-_this.gx; return this.x;}
    this.getY = function(){if(this.fixed)return this.y-_this.gy; return this.y;}
    this.top = function(){this.y=0;return this;}
    this.left = function(){this.x=0;return this;}
    this.right = function(){
      this.x = (t.width - this.getWidth());
      this.node.style.left = Math.round(this.x) + "px";
      return this;
    }

    this.bottom = function(){
      this.y = (t.height - this.getHeight());
      this.node.style.top = Math.round(this.y) + "px";
      return this;
    }
    this.centerV = function(){
      this.y = ((t.height/2) - (this.getHeight()/2));
      this.node.style.top = this.y + "px";
      return this;
    }
    this.centerH = function(){
      this.x = ((t.width/2) - (this.getWidth()/2));
      this.node.style.left = this.x + "px";
      return this;
    }
    this.getCenter = function(){
      return {x:this.x+(this.getWidth()/2), y:this.y+(this.getHeight()/2) };
    }
    this.isLeftOf = function(a){
      return ((this.getCenter().x - a.getCenter().x) < 0);
    }
    this.isRightOf = function(a){
      return ((this.getCenter().x - a.getCenter().x) > 0);
    }
    this.isTopOf = function(a){
      return ((this.getCenter().y - a.getCenter().y) < 0);
    }
    this.isBottomOf = function(a){
      return ((this.getCenter().y - a.getCenter().y) > 0);
    }
    this.moveLeftOf = function(a){
      c=a.getCenter();
      this.x=(c.x-a.getWidth()/2)-this.getWidth();
    }
    this.moveRightOf = function(a){
      c=a.getCenter();
      this.x=(c.x+a.getWidth()/2);
    } 
    this.moveTopOf = function(a){
      c=a.getCenter();
      this.y=(c.y-a.getHeight()/2)-this.getHeight();
    }
    this.moveBottomOf = function(a){
      c=a.getCenter();
      this.y=(c.y+a.getHeight()/2);
    }
    this.centerAt = function(nx, ny){
      this.x = nx-this.getWidth()/2;
      this.y = ny-this.getHeight()/2;
    }
     
    this.center = function(){this.centerV();this.centerH();return this;};
    this.getWidth  = function(){return this.node.offsetWidth;};
    this.getHeight = function(){return this.node.offsetHeight;};
    this.setSize = function(w, h){if(w != undefined && h == undefined)h=w;  this.node.width=w; this.node.height=h;}
    this.hide = function(){this.node.style.display="none";return this;};
    this.show = function(){this.node.style.display="inline";return this;};
    this.destroy = function(){removeFromStage(this);if(this.node)t.removeChild(this.node);};

    this.x = 0;
    this.y = 0;
  };
  baseObj = new this.Base();

  this.Moveable = function(){

    this.update = function(){
      this.x += this.sx; this.y += this.sy;
      if(Math.abs(this.sx) < 0.5)this.sx=0;
      if(Math.abs(this.sy) < 0.5)this.sy=0;
      this.sx -= this.friction*this.sx;
      this.sy -= this.friction*this.sy;
      
      if(this.isHeld && this.onHold != undefined){this.onHold();}

      if(this.followx_obj && this.followx_last){
        this.x += (this.followx_obj.x - this.followx_last);
        this.followx_last = this.followx_obj.x;
      }
      if(this.followy_obj && this.followy_last){
        this.y += (this.followy_obj.y - this.followy_last);
        this.followy_last = this.followy_obj.y;
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
    this.pushUp    = function(k){this.sy-=(this.accel*this.maxSpeed*(k?k:1));return this;}
    this.pushDown  = function(k){this.sy+=(this.accel*this.maxSpeed*(k?k:1));return this;}
    this.pushLeft  = function(k){this.sx-=(this.accel*this.maxSpeed*(k?k:1));return this;}
    this.pushRight = function(k){this.sx+=(this.accel*this.maxSpeed*(k?k:1));return this;}


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
        (function(o){setTimeout(function(){o.followx(_this.mouse);},100);})(this);
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
    this.onHit = function(o,callback){_this.onHit(this.type,o,callback);}
    this.setMaxMinX = function(mx,mn){this.max_x = mx;this.min_x = mn;}
    this.setMaxMinY = function(mx,mn){this.max_y = mx;this.min_y = mn;}
    this.onClick = function(callback){ this.node.onclick=callback; }
    this.onMouseDown = function(callback){this.node.onmousedown=callback; }
    this.onMouseUp = function(callback){ this.node.onmouseup=callback; }
    __this = this;
    this.sx = 0;
    this.sy = 0;
    this.accel = .15;
    this.maxSpeed = 10;
    this.friction = .05;
  }
  this.Moveable.prototype = baseObj;
  moveableObj = new this.Moveable();

  this.Image = function(src,width,height,radius,show) {
  
    if(height == undefined && width != undefined){
      var w = width; var h = width;
    } else {
      var w = width; var h = height;
    }
    this.setImage = function(src, width, height){
      if(height == undefined && width != undefined){
        var w = width; var h = width;
      } else {
        var w = width; var h = height;
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
        w = this.getWidth(); h = this.getHeight();
      }
      if(this.node)t.removeChild(this.node);
    



      newnode = new Image();
      newnode.src = src;
      newnode.style.position = "absolute";
    newnode.style.borderRadius="50%";
    newnode.style.padding=""+radius+"px";
    newnode.onmouseover=function(){tower.onmouseover();};
    newnode.onmouseout=function(){tower.onmouseout();};
      newnode.ondragstart=function(){return false;};
      newnode.onmousedown=this.node.onmousedown;
      newnode.onmouseup  =this.node.onmouseup;
      newnode.onclick    =this.node.onclick;
    this.node = newnode;
      if(w && h) {
        this.node.width = w; this.node.height = h;
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

    this.setFlipImages = function(left,right){
      this.left_img = left;
      this.right_img = right;
      this.facingLeft = true;
    }
    this.isFacingLeft = function(){return this.facingLeft;}
    this.faceLeft = function(){
      if(!this.facingLeft){
        this.setImage(this.left_img);this.facingLeft=true;
      }
    }
    this.isFacingRight = function(){return !this.facingLeft;}
    this.faceRight = function(){
      if(this.facingLeft || this.facingLeft == undefined ){
        this.setImage(this.right_img);
        this.facingLeft=false;
      }
    }
    this.faceFlip = function(){
      if(this.facingLeft)
        this.faceRight();
      else
        this.faceLeft();
    }
    this.src = src;
  this.onmouseover=function(){

    this.node.style.border="2px solid black";
  }
  this.onmouseout=function(){
    
    this.node.style.border="none";
  }

    this.node = new Image();
    this.node.src = src;
    this.node.style.position = "absolute";
    this.node.ondragstart=function(){return false;};
    if(w && h) {
      this.node.width = w; this.node.height = h;
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
  
    this.Image = function(src,width,height) {
  
    if(height == undefined && width != undefined){
      var w = width; var h = width;
    } else {
      var w = width; var h = height;
    }
    this.setImage = function(src, width, height){
      if(height == undefined && width != undefined){
        var w = width; var h = width;
      } else {
        var w = width; var h = height;
      }
      if(height == undefined && width == undefined){
        w = this.getWidth(); h = this.getHeight();
      }
      if(this.node)t.removeChild(this.node);
      newnode = new Image();
      newnode.src = src;
      newnode.style.position = "absolute";
      newnode.ondragstart=function(){return false;};
      newnode.onmousedown=this.node.onmousedown;
      newnode.onmouseup  =this.node.onmouseup;
      newnode.onclick    =this.node.onclick;
    this.node = newnode;
      if(w && h) {
        this.node.width = w; this.node.height = h;
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
    this.faceLeft = function(){
        this.setImage(this.left_img);
    }
    this.faceRight = function(){
        this.setImage(this.right_img);
    }
    this.faceUp = function(){
        this.setImage(this.up_img);
    }
    this.faceDown = function(){
        this.setImage(this.down_img);
    }

    this.src = src;
  this.onmouseover=function(){

    this.node.style.border="2px solid black";
  }
  this.onmouseout=function(){
    
    this.node.style.border="none";
  }

    this.node = new Image();
    this.node.src = src;
    this.node.style.position = "absolute";
    this.node.ondragstart=function(){return false;};
    if(w && h) {
      this.node.width = w; this.node.height = h;
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

  this.makeStage = function(s){
    if(this.stages[s] == undefined){
      this.stages[s] = {objects: [], update: this.updateStage};
      this.stages[s].objects.push(this.top_screen);
      this.stages[s].objects.push(this.bottom_screen);
      this.stages[s].objects.push(this.left_screen);
      this.stages[s].objects.push(this.right_screen);
      key_events[s] = {};
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
    }
  }

  this.clearStage = function(){
    this.stages[this.stage].objects = [];
  }

  this.updateStage = function(){
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
  }
  this.addKeysFromStage = function(stage){
    for(k in key_events[stage])
      key_events[this.stage][k] = key_events[stage][k];
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
      a.sx += (b.sx?b.sx:0)/8;
    }
    if(d.x > d.y){
      if(a.isTopOf(b))a.moveTopOf(b);
      if(a.isBottomOf(b))a.moveBottomOf(b);
      a.sy *= -1;
      a.sy += (b.sy?b.sy:0)/8;
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
      if(a.isBottomOf(b))a.moveBottomOf(b);
      a.sy=0;
    } else {
      if(a.isLeftOf(b))a.moveLeftOf(b);
      if(a.isRightOf(b))a.moveRightOf(b);
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
  

  this.onHit = function(a,b,callback,percent){
    
    if(typeof(a) == "object" && typeof(b) == "object") {
      for(var i=0;i<b.length;i++)
        for(var j=0;j<a.length;j++)
        addCollisionEvent({handler: callback, aType: a[j], bType: b[i], flag: true, per:percent});

    }
    if(typeof(a) == "object" && typeof(b) == "string") {
      for(var i=0;i<a.length;i++)
        addCollisionEvent({handler: callback, aType: a[i], bType: b, flag: true, per:percent});
      
    }
    if(typeof(a) == "string" && typeof(b) == "object") {
      for(var i=0;i<b.length;i++)
        addCollisionEvent({handler: callback, aType: a, bType: b[i], flag: true, per:percent});
      
    }
    if(typeof(a) == "string" && typeof(b) == "string") {
    addCollisionEvent({handler: callback, aType: a, bType: b, flag: true, per:percent});
   //  collisionEvents.push({handler: callback, aType: a, bType: b, flag: true, per:percent});

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
    top_left.x = Math.min(a.x, b.x);
    top_left.y = Math.min(a.y, b.y);
    bottom_right.x = Math.max(a.x+a.getWidth(), b.x+b.getWidth());
    bottom_right.y = Math.max(a.y+a.getHeight(), b.y+b.getHeight());
  
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

  this.addCopyToStage = function(o){
    var nImg = new _this.Image(o.src);   
    nImg.moveTo(o.getX(),o.getY());
    nImg.type = o.type;
    nImg.node.width  = o.node.width;
    nImg.node.height = o.node.height;
    nImg.sx = o.sx;
    nImg.sy = o.sy;
    nImg.ay = o.ay;
    nImg.friction = o.friction;
    nImg.left_img = o.left_img;
    nImg.right_img = o.right_img;
    nImg.facingLeft = o.facingLeft;

    return nImg;
  }

  this.getWidth = function(){return t.width;}
  this.getHeight = function(){return t.height;}

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
    if(e.bType == a.type && e.aType == b.type )
      testCollisionBetween(e,b,a);

    if(e.aType == a.type && e.bType == b.type ){
      if( _this.testCollision(a, b) ){
        if(e.per == undefined || e.per < _this.getOverlapRatio(a,b))
        {
          if(inArray([a,b],collided) == -1 &&
             inArray([b,a],collided) == -1){
            e.handler(a,b);
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
          (a.getY() >= (b.getY() + b.getHeight())) ||
          ((a.getX() + a.getWidth()) <= b.getX()) ||
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
var sjs = new _sjs();

var W_KEY     = 87;
var D_KEY     = 68;
var S_KEY     = 83;
var A_KEY     = 65;
var UP_KEY    = 38;
var DOWN_KEY  = 40;
var LEFT_KEY  = 37;
var RIGHT_KEY = 39;

