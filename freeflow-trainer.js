// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec2 a_TexCoord;\n" +
  "attribute vec4 a_Color;\n" +
  "uniform bool u_UseTexture;\n" + // toggle flag
  "varying vec2 v_TexCoord;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "  if (u_UseTexture) {\n" +
  "    v_TexCoord = a_TexCoord;\n" +
  "  } else {\n" +
  "    v_Color = a_Color;\n" +
  "  }\n" +
  "}\n";

var FSHADER_SOURCE =
  "precision mediump float;\n" +
  "uniform bool u_UseTexture;\n" +
  "uniform sampler2D u_Sampler;\n" +
  "varying vec2 v_TexCoord;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  if (u_UseTexture) {\n" +
  "    gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n" +
  "  } else {\n" +
  "    gl_FragColor = v_Color;\n" +
  "  }\n" +
  "}\n";

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // https://stackoverflow.com/a/4037426
  /*canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight*/

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }
  // Enable alpha blending for textured sprites
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  gameLoop(gl, canvas);
}

function gameLoop(gl, canvas) {
  var enemies = [];
  for (var i = 0; i < 10; i++) {
    var angle = Math.PI * 2 * Math.random();
    // spawn enemy at random location inside arena
    enemies.push(
      new Enemy(
        i,
        Math.sin(angle) * (Math.random() * 0.5 + 0.5),
        Math.cos(angle) * (Math.random() * 0.5 + 0.5),
      ),
    );
  }
  var enemyIndex = 0;

  var player = new Player(0, 0);
  player.aimTowardsEntity(enemies[enemyIndex]);

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
    var tick = function () {
      let gp = navigator.getGamepads()[e.gamepad.index];

      // Draw static shapes
      // #8ce8ff
      var arena = new Arena(0, 0, 1, 140 / 255, 232 / 255, 1);
      arena.draw(gl);

      // Square pressed
      if (
        gp.buttons[2].pressed == true &&
        Date.now() - player.lastAttack > ACTION_COOLDOWN
      ) {
        var closestEnemy = player.getClosestEnemy(enemies);

        if (closestEnemy != null) {
          player.attack(closestEnemy);

          vibrateGamepad(gp, 100);

          // Increment combo meter
          var comboMeter = document.getElementById("combo");
          comboMeter.textContent = Number.parseInt(comboMeter.textContent.substring(0,comboMeter.textContent.length - 1,),) +1 + "x";

          // Should only increment if current attacking enemy is the same as the attacked enemy
          if (closestEnemy.id == enemies[enemyIndex].id)
            enemyIndex = (enemyIndex + 1) % enemies.length;

          /*closestEnemy = player.getClosestEntity(enemies);
          if (closestEnemy != null) player.aimTowardsEntity(closestEnemy);
          console.log(closestEnemy);
          //player.aimTowardsEntity(enemies[enemyIndex]);*/
        }
      }
      // Triangle pressed
      else if (gp.buttons[3].pressed == true &&
        Date.now() - player.lastAttack > ACTION_COOLDOWN) {
        if (player.distanceToEntity(enemies[enemyIndex]) < COUNTER_RADIUS) {
          vibrateGamepad(gp, 100);

          player.attack(enemies[enemyIndex]);
          enemyIndex = (enemyIndex + 1) % enemies.length;
        }
      }

      for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw(gl);

        // move the enemy whose up towards player
        if (i == enemyIndex) {
          enemies[i].moveTowardsEntity(player);
          const dist = player.distanceToEntity(enemies[i]);

          if (dist < ENEMY_ATTACK_RADIUS) {
            vibrateGamepad(gp, 200);

            player.hit();
            enemyIndex = (enemyIndex + 1) % enemies.length;

            // Update health
            var health = document.getElementById("health");
            health.textContent = player.health;
          }
          if (dist < INCOMING_RADIUS) {
            var incoming = new Incoming(enemies[i].x, enemies[i].y, enemies[i].radius * 2.5); 
            incoming.draw(gl);
          }
          // debug tracking line
          //drawLine(gl, enemies[i].x, enemies[i].y, player.x, player.y, 0, 1, 0)
        } else {
            // enemy moves idly around the arena, but not towards the player
            if ((enemies[i].aimX == null && enemies[i].aimY == null) || (Math.hypot(enemies[i].aimX - enemies[i].x, enemies[i].aimY - enemies[i].y) < 0.1)) {
              do {
                enemies[i].aimX = enemies[i].x + (Math.random() - 0.5);
                enemies[i].aimY = enemies[i].y + (Math.random() - 0.5);
              } while (Math.hypot(enemies[i].aimX, enemies[i].aimY) > 1);
            }
            enemies[i].speed =  3 / 100000;
            enemies[i].moveTowards(enemies[i].aimX, enemies[i].aimY);
        }
      }

      // player should be drawn after enemies
      player.draw(gl, enemies);
      if (Math.abs(gp.axes[0]) > 0.25 || Math.abs(gp.axes[1]) > 0.25) {
        player.moveTowards(
          player.x + gp.axes[0],
          player.y - gp.axes[1],
        );
        // aim towards the direction of movement
      }

      // there should be a bit of a cooldown for going back to facing the direction of movement after right stick is released
      if (Math.abs(gp.axes[2]) > 0.25 || Math.abs(gp.axes[3]) > 0.25) {
        player.aimTowards(gp.axes[2], -gp.axes[3]);
      }

      requestAnimationFrame(tick, canvas); // Request that the browser calls tick*/
    };
    tick();
  });
}
