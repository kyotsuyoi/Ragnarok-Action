const background_song = new sound("src/sound/35.mp3")
const run_sound = new sound("src/sound/ork_warrior_step2.wav")
const enemy_walk_sound = new Audio("./src/sound/ork_warrior_step1.wav")

function sound(src) {
    this.sound = document.createElement("audio")
    this.sound.src = src
    this.sound.setAttribute("preload", "auto")
    this.sound.setAttribute("controls", "none")
    this.sound.style.display = "none"
    document.body.appendChild(this.sound)

    this.play = function(){
        this.sound.play();       
    }
    this.stop = function(){
        this.sound.pause()
    } 
}

function backgroundMusic(){
    background_song.play()
}

function attackSound(  ) {
    var sound = new Audio("./src/sound/_attack_dagger.wav");
    sound.play()
    sound.onended = function(){
        sound.currentSrc = null
        sound.src = ""
        sound.srcObject = null
        sound.remove()
        sound = null
    }
}

function attackHitSound(){
    var sound = new Audio("./src/sound/_hit_dagger.wav")
    sound.play()
    sound.onended = function(){
        sound.currentSrc = null
        sound.src = ""
        sound.srcObject = null
        sound.remove()
        sound = null
    }
}

function shieldSound(){
    var sound = new Audio("src/sound/shield_sound.wav")
    sound.play()
    sound.onended = function(){
        sound.currentSrc = null
        sound.src = ""
        sound.srcObject = null
        sound.remove()
        sound = null
    }
}

function shieldGrabSound(){
    var sound = new Audio("./src/sound/shield_grab_sound.wav")
    sound.play()
    sound.onended = function(){
        sound.currentSrc = null
        sound.src = ""
        sound.srcObject = null
        sound.remove()
        sound = null
    }
}

function runSound(){
    //var run_sound = new sound("src/sound/run_sound.wav")
    run_sound.play()
    run_sound.onended = function(){
        run_sound.currentSrc = null
        run_sound.src = ""
        run_sound.srcObject = null
        run_sound.remove()
        run_sound = null
    }
}

function runSoundStop(){
    run_sound.stop()  
    //run_sound = new sound("src/sound/run_sound.wav")
}

function enemyAttackSound(){
    var sound = new Audio("./src/sound/ork_warrior_attack2.wav")
    sound.play()
    sound.onended = function(){
        sound.currentSrc = null
        sound.src = ""
        sound.srcObject = null
        sound.remove()
        sound = null
    }
}

function enemyDamageSound(){
    var sound = new Audio("./src/sound/ork_warrior_damage.wav")
    sound.play()
    sound.onended = function(){
        sound.currentSrc = null
        sound.src = ""
        sound.srcObject = null
        sound.remove()
        sound = null
    }
}

function enemyDieScreemSound(){
    var sound = new Audio("./src/sound/ork_warrior_die1.wav")
    sound.play()
    sound.onended = function(){
        sound.currentSrc = null
        sound.src = ""
        sound.srcObject = null
        sound.remove()
        sound = null
    }
}

function enemyDieSound(){
    var sound = new Audio("./src/sound/ork_warrior_die2.wav")
    sound.play()
    sound.onended = function(){
        sound.currentSrc = null
        sound.src = ""
        sound.srcObject = null
        sound.remove()
        sound = null
    }
}

function enemyStandSound(){
    var sound = new Audio("./src/sound/ork_warrior_breath.wav")
    sound.play()
    sound.onended = function(){
        sound.currentSrc = null
        sound.src = ""
        sound.srcObject = null
        sound.remove()
        sound = null
    }
}

// function enemyWalkSound(){
//     //var scream_sound = new Audio("./src/sound/ork_warrior_step1.wav")
//     enemy_walk_sound.play()
//     enemy_walk_sound.onended = function(){
//         enemy_walk_sound.currentSrc = null
//         enemy_walk_sound.src = ""
//         enemy_walk_sound.srcObject = null
//         enemy_walk_sound.remove()
//         enemy_walk_sound = null
//     }
// }

// function enemyWalkSoundStop(){
//     enemy_walk_sound.stop();   
//     //run_sound = new sound("src/sound/run_sound.wav")
// }
