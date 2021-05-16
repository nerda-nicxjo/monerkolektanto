const canvas = document.getElementById("gamescreen");
const ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;

const scoreNumber = document.getElementById("scoreNumber");

class Player
{
    constructor(gameWidth, gameHeight, color, width, height, speed)
    {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.position = 
        {
            x: gameWidth/2 - width/2,
            y: gameHeight/2 - height/2
        };

        this.color = color;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.movement =
        {
            x: 0,
            y: 0
        };

        this.score = 0;
    }
    
    draw(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    moveLeft()
    {
        this.movement.x = -this.speed;
    }

    moveUp()
    {
        this.movement.y = -this.speed;
    }
    
    moveRight()
    {
        this.movement.x = this.speed;
    }
    
    moveDown()
    {
        this.movement.y = this.speed;
    }

    stopX()
    {
        this.movement.x = 0;
    }

    stopY()
    {
        this.movement.y = 0;
    }

    update(deltaTime, ctx)
    {
        if(!deltaTime) return;

        this.draw(ctx);
        this.position.x += this.movement.x / deltaTime;
        this.position.y += this.movement.y / deltaTime;

        if(this.position.x < 0)
        {
            this.position.x = 0;
        }
        else if(this.position.x > this.gameWidth - this.width)
        {
            this.position.x = this.gameWidth - this.width;
        }

        if(this.position.y < 0)
        {
            this.position.y = 0;
        }
        else if(this.position.y > this.gameHeight - this.height)
        {
            this.position.y = this.gameHeight - this.height;
        }
    }
}

class Coin
{
    constructor(gameWidth, gameHeight, color, radius)
    {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.color = color;
        this.radius = radius;

        this.position = 
        {
            x: this.findX(),
            y: this.findY()
        };
    }

    findX()
    {
        return Math.floor((Math.random()*(this.gameWidth-(this.radius*2)))+this.radius);
    }

    findY()
    {
        return Math.floor((Math.random()*(this.gameHeight-(this.radius*2)))+this.radius);
    }

    draw(ctx)
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    update()
    {
        this.position.x = this.findX();
        this.position.y = this.findY();
    }
}

class InputHandler
{
    constructor(player)
    {
        document.addEventListener('keydown', (event) =>
        {
            switch(event.key)
            {
                case "ArrowLeft": player.moveLeft();
                break;
                case "ArrowUp": player.moveUp();
                break;
                case "ArrowRight": player.moveRight();
                break;
                case "ArrowDown": player.moveDown();
                break;
            }
        });

        document.addEventListener('keyup', (event) =>
        {
            switch(event.key)
            {
                case "ArrowLeft": if(player.movement.x < 0) player.stopX();
                break;
                case "ArrowUp": if(player.movement.y < 0) player.stopY();
                break;
                case "ArrowRight": if(player.movement.x > 0) player.stopX();
                break;
                case "ArrowDown": if(player.movement.y > 0) player.stopY();
                break;
            }
        });
    }
}

function collisionHandler (player, coin)
{
    let p = 
    {
        centerX: Math.floor(player.position.x + (player.width/2)),
        centerY: Math.floor(player.position.y + (player.height/2))
    };

    let distance = Math.hypot(p.centerX - coin.position.x, p.centerY - coin.position.y);

    if (distance - (player.width/2) - (coin.radius) < 1)
    {
        coin.update();
        player.score += 1;
    }
}

let player = new Player(canvas.width, canvas.height, "green", 40, 40, 40);
let coin = new Coin(canvas.width, canvas.height, "green", 10);
new InputHandler(player);

let lastTime = 0;

function animate(timeStamp)
{
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, 800, 600);
    player.update(deltaTime, ctx);
    collisionHandler(player, coin);
    coin.draw(ctx);

    scoreNumber.innerHTML = player.score;

    requestAnimationFrame(animate);
}
animate();