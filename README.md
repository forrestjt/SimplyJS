SimplyJS
========

SimplyJS is a JavaScript library made to foster a love of programming, web development, and game design. SimplyJS provides a simplified way for making browser-based games using DOM-manipulation to make moveable Images, display text, and dynamically generate buttons.

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

Now, we need some images. Go ahead and download simply.js, paddle.png, paddle2.png, s.png, or use your own.

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
