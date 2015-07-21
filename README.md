# SimplyJS

SimplyJS is a JavaScript library made to foster a love of programming, web development, and game design. SimplyJS provides a simplified way for making browser-based games using DOM-manipulation to make moveable Images, display text, and dynamically generate buttons.

[Plunker of Pong Example](http://plnkr.co/edit/cgEsRStRQRFI5LyJlhCC)

[Plunker of Skeleton](http://plnkr.co/edit/IyOpIqcPTp9QD3ubU3Tq)

## Pong: A Simple Example
First create a basic skeleton project and save it as pong.html:

```
<!-- Game Design Project #1 ~ Simply Bounce -->
<!DOCTYPE html>
<html>
  <head> <title> Project 1 </title>
    <script src="simply.js"> </script>
    <script>
 function start()
 {

    // Your code goes here

 }
    </script>
  </head>
<body onload="start()"> <!-- The start function is called when the page is loaded  -->
 <h1> Project 1 </h1>
   <!-- This is where our game will be on the page -->
   <div id="target" style="margin:auto;background:lightgrey;"></div>
</body>
</html>
```

Now, we need some images. Go ahead and download [simply.js](http://host.simplycoding.org/simplyjs/simply.js), [paddle.png](http://host.simplycoding.org/images/paddle.png), [paddle2.png](http://host.simplycoding.org/images/paddle2.png), [s.png](http://host.simplycoding.org/images/s.png), or use your own.

### Starting the Library
The first thing we must do is tell SimplyJS to open an element on our page. We do this by adding the line:
```
sjs.open("target");
```
to our code, Where "target" is the element ID of the element we want our game to be drawn. The default name is "target" so if we just leave it blank, it will still work if an element has that ID.
### Making a Paddle

Now we are going to Make a new variable named 'paddle' and pass it the string "paddle.png".
Copy the following code into your start function
```
var paddle = new sjs.Image("paddle.png");
```
Now use the above line to make a ball variable using the s.png.

### Shrinking or Expanding Images

Sometimes we might want our objects to be a different size than the original image. This can be done two ways, we can set a size when we first create an object or we can change the size after the object is already created.

```
var paddle = new sjs.Image("paddle.png", 50, 100);
```

The above line changes the size of the paddle object as we are creating it. It sets the width to 50 and the height to 100.

```
paddle.setSize(50,100);
```

We can also use the setSize function. Again we set the width to 50 and the height to 100.

### Moving Objects Around

To move objects they need to be pushed in a direction:

```
var ball = new sjs.Image("s.png");
ball.pushUp();
ball.pushLeft(2);
```

this will create an image named ball and push it up and to the left. Notice
that by passing a number to pushLeft() we can change how much it will be pushed
in that direction. So the ball be moving faster to the left than up.

### Friction

You may notice that when you are pushing objects around they will begin to slow down.
This is due to the default amount of friction that an object is created with.
Friction can make a big difference in games because controlling objects with a low amount of friction is challenging.

To change an object's friction simply access it by using .friction after the object's name:
```
ball.friction = 0.5;
```

or to remove it entirely:

```
ball.friction = 0;
```

friction should be a number between 0 and 1.

### Controlling Objects
While using the SimplyJS library we will be making objects. We will be using an image to represent our objects.
In order to have the objects react how we want them too we need to give them a type. Here is an example of how to give an object a type:

```
paddle.type = "paddle";
```

The most important thing to remember about making objects is, we have to give our objects a type right after we make them.
Once our objects have a type we can control them with functions like the sjs.onHit function:

```
sjs.onHit("ball","paddle", sjs.bounceOff);
```

This will make any objects with the type "ball" bounce off any objects with the type "paddle" when they hit each other. Another way we can control our objects is having them follow the mouse when we move it:

```
paddle.followx(sjs.mouse);
```

This will make it so wherever we move our mouse our paddle object will follow (horizontally at least).

### Collision Handling

We can trigger additional logic to execute when two object types collide by using the sjs.onHit() function:

```
sjs.onHit("ball", "paddle", function(ball, paddle){
  sjs.bounceOff(ball, paddle);
  ball.scaleSpeed(2);
});
```

this will cause the ball to bounce off the paddle and cause the ball's speed to be 'scaled' (multiplied by 2) whenever the ball hits the paddle. Note that the objects that have collided ball, and paddle are passed in to the callback.

Also, we can detect when an object hits a wall by using one of the pre-built top_screen, bottom_screen, left_screen, right_screen objects.

for example:

```
ball.noBounds = true;
sjs.onHit("ball", ["top_screen", "bottom_screen"], function(){
  alert("you loose");
});
```

Will cause a popup whenever the ball hits either the top or bottom screen.
This also demonstrates that an array can be used in place of a single type.
**NOTE: the noBounds property must be set for detection to work with screen objects!**
