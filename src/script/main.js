const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

canvas.width = 1920
canvas.height = 1080

const perfectFrameTime = 1000 / 60
let deltaTime = 0
let lastTimestamp = 0

var player = new Player('p1', lastTimestamp, 1920/2, 1000)
var damages = new Array()
var displays = new Array()

var enemies = [
    new Enemy({
        id : '01', type : 'orc_warrior',
        x : 1920/2 + 200, y : 1080/2, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    })
    ,
    new Enemy({
        id : '02', type : 'orc_warrior',
        x : 1920/2, y : 1080/2 - 200, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '03', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 -250, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '03', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 -200, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '03', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 -150, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '03', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 -100, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '03', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 -50, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '03', type : 'orc_warrior',
        x : 1920/4, y : 1080/2, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '03', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 +50, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '04', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 +100, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '05', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 +150, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '06', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 +200, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '07', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 +250, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    }),
    new Enemy({
        id : '08', type : 'orc_warrior',
        x : 1920/4, y : 1080/2 +300, patrol : true, follow : true, knock_back : true, lastTimestamp : lastTimestamp
    })
]

function start() {    
    requestAnimationFrame(animate);
}

function animate(timestamp){

    requestAnimationFrame(animate);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;
    //console.log(Math.round(lastTimestamp))

    context.clearRect(0, 0, canvas.width, canvas.height)  
    context.closePath() 

    keypadLoop1()
    pad1Loop()
    player.update()

    var layer = new Array()    
    enemies.forEach(enemy => {
        enemy.update()
        if(!enemy.die){
            enemy.newAction()
        }
        layer.push(enemy)
    })

    layer.push(player)

    damages.forEach(damage =>{
        damage.update()
    })
    //to remove finished damages 
    damages = damages.filter(damage => damage.finished == false)

    //to kill enemies
    //enemies = enemies.filter(enemy => enemy.hp > 0)

    layer.sort((a,b) => a.layer - b.layer)
    layer.forEach(element => element.draw())

    displays.forEach(display => {
        display.draw()
        display.time -= 1
        if(display.time <= 0){
            displays = displays.filter(display => display.time > 0)
        }
    })   

}

start()



