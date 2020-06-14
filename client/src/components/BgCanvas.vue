<template lang="pug">
    <div id="bg">
        <canvas id="bgCanvas"></canvas>
    </div>
</template>

<script>
export default {
    name: "BgCanvas",
    data: () => {
        return {
            bg: null,
            ctx: null,
            colors: [
                '#030307',
                '#1b1f3d',
                '#272c58',
                '#333a74',
                '#3f478f',
                '#070b2a'
            ],
            mouse: {
                x: undefined,
                y: undefined
            },
            maxR: 10,
            circles: []
        }
    },
    methods: {
        circle(r, x, y, dx, dy, color) {
            return {
                r: r,
                minR: r,
                x: x,
                y: y,
                dx: dx,
                dy: dy,
                color: color,
                originalColor: color
            }
        },
        draw(circle) {
            this.ctx.beginPath();
            this.ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
            this.ctx.fillStyle = circle.color;
            this.ctx.fill();
        },
        update(circle) {
            if (circle.x + circle.r > innerWidth || circle.x - circle.r < 0)
                circle.dx = -circle.dx;
            if (circle.y + circle.r > innerHeight || circle.y - circle.r < 0)
                circle.dy = -circle.dy;
            circle.x += circle.dx;
            circle.y += circle.dy;

            // Interactivity.
            if (circle.color != '#ffffff') {
                if (parseInt(Math.random() * 500) == 1) {
                    circle.color = '#ffffff';
                    setTimeout(function() { circle.color = circle.originalColor; }, 200);
                }
            }

            if (this.mouse.x - circle.x < 50 && this.mouse.x - circle.x > -50 && this.mouse.y - circle.y < 50 && this.mouse.y - circle.y > -50) {
                if (circle.r < this.maxR) circle.r += 1;
            } else
                if (circle.r > circle.minR) circle.r -= 1;

            this.draw(circle);
        },
        animate() {
            requestAnimationFrame(this.animate);
            this.ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let c in this.circles)
                this.update(this.circles[c]);
        },
        mouseEvent(e) {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            // console.log(this.mouse);
        },
        resize() {
            this.bg.width = window.innerWidth;
            this.bg.height = window.innerHeight;
        }
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.resize);
        window.removeEventListener('mousemove', this.mouseEvent);
    },
    mounted: function() {
        this.bg = document.getElementById('bgCanvas');
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.ctx = this.bg.getContext('2d');
        window.addEventListener('resize', this.resize);
        window.addEventListener('mousemove', this.mouseEvent);

        for (let i = 0; i < 100; i++) {
            let r = Math.random() * 3 + 1;
            let x = Math.random() * (innerWidth - 2*r) + r;
            let y = Math.random() * (innerHeight - 2*r) + r;
            let dx = (Math.random() - 0.5) * 3;
            let dy = (Math.random() - 0.5) * 3;
            let color = this.colors[parseInt(Math.random() * this.colors.length)];
            this.circles.push(this.circle(r, x, y, dx, dy, color));
        }

        this.animate();
    }
}
</script>

<style lang="scss" scoped>
#bg {
    position: fixed;
    top: 0;
    left: 0;
}

canvas {
    display: block;
}
</style>
