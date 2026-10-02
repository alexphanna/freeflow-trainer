// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // https://stackoverflow.com/a/4037426
  /*canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight*/

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(1, 1, 1, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  gameLoop(gl, canvas);
}

function gameLoop(gl, canvas) {
  var enemies = [];
  for (var i = 0; i < 4; i++) {
    var angle = Math.PI * 2 * Math.random();
    // spawn enemy at random location inside arena
    enemies.push(new Enemy(i, Math.sin(angle) * (Math.random() * .5 + .5), Math.cos(angle) * (Math.random() * .5 + .5)));
  }
  var enemyIndex = 0;

  var player = new Player(0, 0)
    
  window.addEventListener("gamepadconnected", (e) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
    console.log(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length,
    );
    
    // Start drawing
    var tick = function() {
      let gp = navigator.getGamepads()[e.gamepad.index];

      // Draw static shapes
      var arena = new Circle(0, 0, 1, 0, 0, 0)
      arena.draw(gl);

      // Square pressed
      if (gp.buttons[2].pressed == true && Date.now() - player.lastAttack > ATTACK_COOLDOWN) {
        var closestEnemy = player.getClosestEntity(enemies);

        if (closestEnemy == null) 
          return;

        player.attack(closestEnemy);

        gp.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 100,
          weakMagnitude: 1.0,
          strongMagnitude: 1.0,
        });

        // Should only increment if current attacking enemy is the same as the attacked enemy
        if (closestEnemy.id == enemies[enemyIndex].id)
          enemyIndex++;
      }

      for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw(gl)

        // move the enemy whose up towards player
        if (i == enemyIndex) {
          enemies[i].moveTowardsEntity(player)
          // debug tracking line
          drawLine(gl, enemies[i].x, enemies[i].y, player.x, player.y)
        }
        else {
          // idle animation
          enemies[i].lastMove = Date.now();
          //enemies[i].moveTowards(enemiesMath.random(), Math.random());
        }
      }
      
      // player should be drawn after enemies
      player.draw(gl, enemies);
      player.moveTowards(player.x + gp.axes[0] / 100, player.y - gp.axes[1] / 100) // 100 is arbitrary

      requestAnimationFrame(tick, canvas); // Request that the browser calls tick*/
    };
    tick();
  });
}