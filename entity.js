class Entity extends Circle {
    constructor(x, y, r, g, b, speed) {
        super(x, y, .05, r, g, b);
        this.speed = speed;
        this.g_last = Date.now();
        this.lastHit = 0;
    }
    moveTowardsEntity(entity) {
        this.moveTowards(entity.x, entity.y)
    }
    hit() {
        this.lastHit = Date.now();
    }
    moveTowards(x, y) {
        const now = Date.now();

        const elapsed = now - this.g_last;
        this.g_last = now;

        if (now - this.lastHit <= STUN_DURATION)
            return;

        const dx = x - this.x;
        const dy = y - this.y;
        const dist = Math.hypot(dx, dy);
        const step = this.speed * elapsed;

        if (dist <= step) {
            this.x = x;
            this.y = y;
            return;
        }

        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
    }
}