class Player extends Entity {
    constructor(x, y) {
        // #7de1fe
        super(-1, x, y, .05, 125 / 255, 225 / 255, 254 / 255, 100, .0002)
        this.lastAttack = 0;
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
    drawFOVCone(gl, x0, y0, x1, y1, x2, y2) {
        // Cone
        var vertices = new Float32Array([
            x0, y0, 0.25, 0.25, 0.25, 0.5,  
            x1, y1, 0.25, 0.25, 0.25, 0.5,
            x2, y2, 0.25, 0.25, 0.25, 0.5        
        ]);
        const n = 3; // The number of vertices

        bindBuffers(gl, vertices, 6);

        // Required for transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, n);

        // Circle
        var circle = new Circle(x0, y0, 0.25, 0.25, 0.25, 0.25, 0.5, true);
        circle.draw(gl);
    }
    // Hits nearest enemy
    attack(enemy) {
        this.lastAttack = Date.now();

        // maybe abstract into moveTo method
        this.x = enemy.x;
        this.y = enemy.y;

        enemy.hit();
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