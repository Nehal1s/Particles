window.addEventListener('load', ()=>{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    


    class Particle{
        constructor(effect, x, y, color){
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.size = this.effect.gap;
            this.vx = Math.random() * 2 -1;
            this.vy = Math.random() * 2 -1;
            this.color = color
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.ease = 0.08;
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.friction = 0.9;
            this.force = 0;
            this.angle = 0;
           
        }
        draw(context){
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.size, this.size)
        }
        update(){
            //distance between mousex and pixel x
            this.dx = this.effect.mouse.x - this.x
            //distance between mousey and pixel y
            this.dy = this.effect.mouse.y - this.y


            //sasta pythogores
            this.distance = this.dx * this.dx + this.dy * this.dy;

            //force
            this.force = -this.effect.mouse.radius / this.distance

            if(this.distance < this.effect.mouse.radius){
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }


            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease
        }
        warp(){
            this.x = Math.random() * this.effect.width
            this.y = Math.random() * this.effect.height
            this.ease = 0.1;
        }

    }



    class Effect{
        constructor(width, height){
            this.width = width
            this.height = height
            this.particleArray = [];
            this.image =  document.getElementById('image1');
            this.centerX = (this.width - this.image.width) * 0.5;
            this.centerY = (this.height - this.image.height) * 0.5;
            this.gap = 3;
            this.mouse = {
                radius: 10000,
                x: undefined,
                y: undefined
            }
            window.addEventListener('mousemove', (e)=>{
                this.mouse.x = e.x
                this.mouse.y = e.y
            })
        }
        init(context){
            context.drawImage(this.image, this.centerX, this.centerY);
            const pixels = context.getImageData(0, 0, this.width, this.height).data;
            for (let i = 0; i < this.height; i+=this.gap) {
                for (let j = 0; j < this.width; j+=this.gap) {
                    const index = (i * this.width + j) * 4;
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const alpha = pixels[index + 3];
                    const color = 'rgb(' + red + ',' + green + ',' + blue+')';

                    if(alpha > 0) { this.particleArray.push(new Particle(this, j, i, color))}
                }
            }

        }
        update(){
            this.particleArray.forEach(particle => particle.update() );
        }
        draw(context){
            this.particleArray.forEach(particle => particle.draw(context) );
        }
        warp(){
            this.particleArray.forEach(particle => particle.warp() );
        }

    }
    
    let effect = new Effect(canvas.width, canvas.height);
    effect.init(ctx)

    const animate =  () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        effect.draw(ctx)
        effect.update()

        requestAnimationFrame(animate)
    }
    animate()


    const warpButton = document.getElementById('warpButton')
    warpButton.addEventListener('click', ()=>{
        effect.warp()
    })
    
})