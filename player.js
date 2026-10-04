class Player extends Entity {
    constructor(x, y) {
        super(-1, x, y, .05, 140 / 255, 232 / 255, 1, 6, .0002)
        this.lastAttack = 0;
        this.aimX = 0;
        this.aimY = 0;
        this.fov = 45;
    }
    draw(gl, enemies) {
        // Draw two additional lines 25 degrees above and below the aim line
        const angle = Math.atan2(this.aimY - this.y, this.aimX - this.x);
        const length = Math.hypot(this.aimX - this.x, this.aimY - this.y) * 100;
        const spread = this.fov / 2 * Math.PI / 180;

        const upperAngle = angle - spread;
        const lowerAngle = angle + spread;

        this.drawFOVCone(gl, this.x, this.y, this.x + length * Math.cos(upperAngle), this.y + length * Math.sin(upperAngle), this.x + length * Math.cos(lowerAngle), this.y + length * Math.sin(lowerAngle))

        super.draw(gl);

        // highlight enemy who will be attacked if attack
        var closestEnemy = this.getClosestEnemy(enemies);
        if (closestEnemy != null) {
            closestEnemy.highlight(enemies);
        }
    }
    // I really don't like this method, I feel like it has to contain a lot of repeated code from other drawing functions
    drawFOVCone(gl, x0, y0, x1, y1, x2, y2) {
        var vertices = new Float32Array([
            x0, y0, 0.25, 0.25, 0.25, 0.5,  
            x1, y1, 0.25, 0.25, 0.25, 0.5,
            x2, y2, 0.25, 0.25, 0.25, 0.5        
        ]);
        var n = 3; // The number of vertices

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const FSIZE = Float32Array.BYTES_PER_ELEMENT;

        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        var a_FragColor = gl.getAttribLocation(gl.program, 'a_Color');
        if (a_FragColor < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }
        
        gl.vertexAttribPointer(a_FragColor, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
        gl.enableVertexAttribArray(a_FragColor);

        // Required for transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    }
    // Hits nearest enemy
    attack(enemy) {
        this.lastAttack = Date.now();
        
        // Increment combo meter
        var comboMeter = document.getElementById('combo-meter');
        comboMeter.textContent = Number.parseInt(comboMeter.textContent) + 1;

        // maybe abstract into moveTo method
        this.x = enemy.x;
        this.y = enemy.y;

        enemy.hit();
    }
    // Counter nearest uncountered enemy
    counter() {
        
    }
    aimTowardsEntity(entity) {
        this.aimTowards(entity.x, entity.y)
    }
    aimTowards(x, y) {
        this.aimX = x;
        this.aimY = y;
    }
    // first enemy close to aim line within FOV degrees around aim line
    getClosestEnemy(enemies) {
        // Aim direction (normalized)
        const aimDx = this.aimX - this.x;
        const aimDy = this.aimY - this.y;
        const aimLen = Math.hypot(aimDx, aimDy);
        if (aimLen === 0) return null;          // aiming at self, no direction

        const aimUx = aimDx / aimLen;
        const aimUy = aimDy / aimLen;

        const halfAngle = this.fov * Math.PI / 180 / 2;          // 45° half-angle → 90° cone total
        const cosHalf   = Math.cos(halfAngle);

        let closestEnemy = null;
        let closestDistance = Number.MAX_VALUE;

        for (const enemy of enemies) {
            if (enemy.stunned()) continue;

            const ex = enemy.x - this.x;
            const ey = enemy.y - this.y;
            const dist = Math.hypot(ex, ey);
            if (dist === 0) continue;           // enemy on top of player

            // cos of angle between aim direction and enemy direction
            const dot = (ex * aimUx + ey * aimUy) / dist;

            if (dot < cosHalf) continue;        // outside the cone → skip

            if (dist < closestDistance) {
                closestEnemy = enemy;
                closestDistance = dist;
            }
        }
        return closestEnemy;
    }
}