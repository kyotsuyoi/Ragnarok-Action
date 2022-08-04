let lastKey, lastKey2

const keys = {
    right : {
        pressed : false
    },
    left : {
        pressed : false
    },
    up : {
        pressed : false
    },
    down : {
        pressed : false
    },
    attack : {
        pressed : false
    },
    run : {
        pressed : false
    },
    attack_hard : {
        pressed : false
    }
}

window.addEventListener('keydown', ({keyCode}) => {
    keyCodeDown(keyCode)    
})

window.addEventListener('keyup', ({keyCode}) => {
    keyCodeUp(keyCode)   
})

function keyCodeDown(keyCode){
        
    //console.log('keydown:'+keyCode) 
    backgroundMusic()
    
    //Start Player 1 -----------------------------------
    switch (keyCode){
        
        case 38:
            if(!keys.up.pressed && !keys.down.pressed){
                keys.up.pressed = true       
                lastKey = 'up'  
                player.is_walking = true
                player.side = 'up'
                //console.log('keydown:'+keyCode)     
            }     
        break

        case 40:    
            if(!keys.down.pressed && !keys.down.pressed){        
                keys.down.pressed = true     
                lastKey = 'down'
                player.is_walking = true
                player.side = 'down'
                //console.log('keydown:'+keyCode)
            }
        break

        case 37:
            if(!keys.left.pressed && !keys.right.pressed){
                keys.left.pressed = true      
                lastKey = 'left'
                player.is_walking = true
                player.side = 'left'
                //console.log('keydown:'+keyCode)
            }
        break

        case 39:
            if(!keys.right.pressed && !keys.left.pressed){
                keys.right.pressed = true      
                lastKey = 'right'
                player.is_walking = true
                player.side = 'right'
                //console.log('keydown:'+keyCode)
            }
        break

        //attack
        case 97:
            if(!keys.attack.pressed && player.attack_cooldown <= 0){
                keys.attack.pressed = true  
                player.is_attack = true
                player.attack_hit = false

                player.attack_cooldown = player.attack_speed
            }
        break

        //run
        case 98:
            if(!keys.run.pressed && player.stamina>=5){
                keys.run.pressed = true  
                player.is_running = true
                player.staminaCoolDown = 50
                runSound()
            }
        break

        //attack hard
        case 100:
            if(!keys.attack.pressed && player.attack_hard_cooldown <= 0){
                keys.attack.pressed = true  
                player.is_attack_hard = true
                player.attack_hard_hit = false

                player.attack_hard_cooldown = player.attack_speed*2 - player.attack_speed/3
            }
        break
        
    }
    //End Player 1 -----------------------------------
        
}

function keyCodeUp(keyCode){
    //console.log('keyCode up:'+keyCode)
    
    //Start Player 1 -----------------------------------
    switch (keyCode){

        case 38:
            keys.up.pressed = false
            if(keys.left.pressed == true){
                lastKey = 'left'
            }
            if(keys.right.pressed == true){
                lastKey = 'right'
            }
        break

        case 40:            
            keys.down.pressed = false  
            if(keys.left.pressed == true){
                lastKey = 'left'
            }
            if(keys.right.pressed == true){
                lastKey = 'right'
            }
        break

        case 37:
            keys.left.pressed = false  
            if(keys.up.pressed == true){
                lastKey = 'up'
            }
            if(keys.down.pressed == true){
                lastKey = 'down'
            }
        break

        case 39:
            keys.right.pressed = false 
            if(keys.up.pressed == true){
                lastKey = 'up'
            }
            if(keys.down.pressed == true){
                lastKey = 'down'
            }
        break
        
        case 97:
            keys.attack.pressed = false  
        break
        
        case 98:
            if(keys.run.pressed){                
                keys.run.pressed = false   
                player.is_running = false
                runSoundStop()
            }
        break

        case 100:
            if(keys.attack_hard.pressed){                
                keys.attack_hard.pressed = false   
            }
        break
        
    }
        
    if(keys.up.pressed == false && keys.down.pressed == false && keys.left.pressed == false && keys.right.pressed == false){
        player.is_walking = false
    }
    //End Player 1 -----------------------------------

}

function keypadLoop1(){
    if(keys.right.pressed && (player.position.x + player.width <= canvas.width)){
        player.velocity.x = player.speed
    } else if (keys.left.pressed && (player.position.x > 0)){
        player.velocity.x = -player.speed
    }else{
        player.velocity.x = 0
    }

    if (keys.up.pressed && (player.position.y > 0)){
        player.velocity.y = -player.speed
    } else if (keys.down.pressed && (player.position.y + player.height <= canvas.height)){
        player.velocity.y = player.speed    
    }else{
        player.velocity.y = 0
    }
}

var gamepads = {};

function gamepadHandler(event, connecting) {
    var gamepad = event.gamepad;
    // Note:
    // gamepad === navigator.getGamepads()[gamepad.index]

    if (connecting) {
        gamepads[gamepad.index] = gamepad;
        console.log('gamepad_connected')
    } else {
        delete gamepads[gamepad.index];
    }
}

window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); })
window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); })

function buttonPressed(b) {
    //console.log(b)
    if (typeof(b) == "object") {
        return b.pressed
    }
    return b == 1.0
}

function pad1Loop() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [])
    if (!gamepads) {
        return
    }

    var gp = gamepads[0]
    if(gp==null)return

    //console.log(gp)
    //left
    if (buttonPressed(gp.buttons[14])) {
        keyCodeDown(37)
    }else{
        keyCodeUp(37)
    }

    //right
    if (buttonPressed(gp.buttons[15])) {
        keyCodeDown(39)
    }else{
        keyCodeUp(39)
    }

    //up
    if (buttonPressed(gp.buttons[12])) {
        keyCodeDown(38)
    } else {
        keyCodeUp(38)
    }

    //down
    if (buttonPressed(gp.buttons[13])) {
        keyCodeDown(40)
    } else {
        keyCodeUp(40)
    }

    //a
    if (buttonPressed(gp.buttons[0])) {
        keyCodeDown(98)
    }else{
        keyCodeUp(98)
    }

    //x
    if (buttonPressed(gp.buttons[2])) {
        keyCodeDown(97)
    }else{
        keyCodeUp(97)
    }

    //b
    if (buttonPressed(gp.buttons[1])) {
        keyCodeDown(101)
    } else {
        keyCodeUp(101)
    }

    //y
    if (buttonPressed(gp.buttons[3])) {
        keyCodeDown(100)
    } else {
        keyCodeUp(100)
    }

    //lb
    if (buttonPressed(gp.buttons[4])) {
        //keyCodeDown(97)
    } else {
        //keyCodeUp(97)
    }

    //rb
    if (buttonPressed(gp.buttons[5])) {
        keyCodeDown(104)
    }else{    
        keyCodeUp(104)
    }

    //lt
    if (buttonPressed(gp.buttons[6])) {
        keyCodeDown(103)
    } else {
        keyCodeUp(103)
    }

    if (buttonPressed(gp.buttons[7])) {
        
    }

    if (buttonPressed(gp.buttons[8])) {
        //console.log('b8')
    } else if (buttonPressed(gp.buttons[9])) {
        //console.log('b9')
    }

    if (buttonPressed(gp.buttons[10])) {
        //console.log('b10')
    } else if (buttonPressed(gp.buttons[11])) {
        //console.log('b11')
    }  
}