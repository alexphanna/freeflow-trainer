// Shared texture cache for incoming sprites
var IncomingTextureCache = {
  texture: null,
  ready: false,
  loading: false,
};

class Incoming {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(gl) {
    // Set the vertex information
    var n = this.initVertexBuffers(gl);
    if (n < 0) {
      console.log("Failed to set the vertex information");
      return;
    }

    // If the texture isn't ready yet, start loading and skip drawing this frame.
    if (!IncomingTextureCache.ready) {
      if (!IncomingTextureCache.loading) {
        this.initTextures(gl);
      }
      return;
    }

    // Texture is ready: bind it and draw the quad synchronously.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, IncomingTextureCache.texture);
    var u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
    gl.uniform1i(u_Sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }

  initVertexBuffers(gl) {
    const halfSize = 0.1;
    // Offset the sprite so it sits just above the entity's radius
    const yOffset = (this.radius || 0.05) + halfSize; // fallback if radius not provided

    var verticesTexCoords = new Float32Array([
      // Vertex coordinate (x, y), Texture coordinate (s, t)
      this.x - halfSize, this.y + yOffset, 0.0, 1.0,
      this.x + halfSize, this.y + yOffset, 1.0, 1.0,
      this.x - halfSize, this.y + yOffset - 2 * halfSize, 0.0, 0.0,
      this.x + halfSize, this.y + yOffset - 2 * halfSize, 1.0, 0.0,
    ]);
    var n = 4; // The number of vertices

    // Create a buffer object
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    // Write the positions of vertices to a vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var u_UseTexture = gl.getUniformLocation(gl.program, "u_UseTexture");
    gl.uniform1i(u_UseTexture, true);

    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
      console.log("Failed to get the storage location of a_Position");
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    // Get the storage location of a_TexCoord
    var a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    if (a_TexCoord < 0) {
      console.log("Failed to get the storage location of a_TexCoord");
      return -1;
    }
    // Assign the buffer object to a_TexCoord variable
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    // Enable the generic vertex attribute array
    gl.enableVertexAttribArray(a_TexCoord);

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
  }

  initTextures(gl) {
    if (IncomingTextureCache.loading || IncomingTextureCache.ready) return true;
    IncomingTextureCache.loading = true;

    var image = new Image();
    image.onload = function () {
      var texture = gl.createTexture();
      if (!texture) {
        console.log("Failed to create the texture object");
        IncomingTextureCache.loading = false;
        return;
      }

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      IncomingTextureCache.texture = texture;
      IncomingTextureCache.ready = true;
      IncomingTextureCache.loading = false;
    };
    image.onerror = function () {
      console.log("Failed to load incoming.png");
      IncomingTextureCache.loading = false;
    };
    image.src = "./resources/incoming.png";

    return true;
  }
}
