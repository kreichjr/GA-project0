console.log("Tamagotchi - GA Project 0")

const music = {
	player: document.querySelector("audio"),
	volArray: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1],
	currVolIndex: 4,
	setVolume: function(vol) {
		if (vol >= 0 && vol <= 1) {
			this.player.volume = vol
		}
	},
	volUp: function() {
		if (this.currVolIndex < 10) {
			this.currVolIndex += 1 
			this.setVolume(this.volArray[this.currVolIndex])
		}
	},
	volDown: function() {
		if (this.player.volume > 0) {
			this.currVolIndex -= 1
			this.setVolume(this.volArray[this.currVolIndex])
		}
	},
	muteToggle: function() {
		if (this.player.muted === true) {
			this.player.muted = false
			document.querySelector("#mute-toggle").innerText = "Mute"
		} else {
			this.player.muted = true
			document.querySelector("#mute-toggle").innerText = "Unmute"
		}
	},
	disableLoop: function() {
		this.player.setAttribute("loop","false")
	},
	createControls: function() {
		const volDownBtn = document.createElement("button")
		const volUpBtn = document.createElement("button")
		const muteBtn = document.createElement("button")
		const musicCredit = document.createElement("p")

		volDownBtn.innerText = "Volume Down (-)"
		volUpBtn.innerText = "Volume Up (+)"
		muteBtn.innerText = "Mute"
		musicCredit.innerText = "Music by Kenneth Reichelderfer Jr."

		volDownBtn.setAttribute("id", "vol-down")
		volUpBtn.setAttribute("id", "vol-up")
		muteBtn.setAttribute("id", "mute-toggle")

		volDownBtn.addEventListener("click", () => {this.volDown()})
		volUpBtn.addEventListener("click", () => {this.volUp()})
		muteBtn.addEventListener("click", () => {this.muteToggle()})

		document.querySelector("#audio").append(volDownBtn)
		document.querySelector("#audio").append(volUpBtn)
		document.querySelector("#audio").append(muteBtn)
		document.querySelector("#audio").append(musicCredit)
	},
	init: function() {
		this.setVolume(this.volArray[this.currVolIndex])
		this.player.play()
		this.createControls()
		this.setCSS()
	},
	setCSS: function() {
		document.body.style.backgroundColor = "#FF68B0"
		document.body.style.color = "#000000"	
		// TODO: make sure CSS styles for all elements updated on color shift

	}
}

const game = {
	music: music,
	isStarted: false,
	tamagotchi: undefined,
	inputBuffer: [null, null, null, null, null, null, null, null, null, null, null],
	globalTimer: undefined,
	timeElapsedInSeconds: 0,
	frameCounter: 0,
	start: function(name) {
		this.isStarted = true
		this._hideNameInput()
		this._updatetamagotchiName(name)
		this.tamagotchi = new tamagotchi(name)
		this.linkButtons()
		this.createActor()
		document.querySelector("#outershell").style.opacity = 100
		this.globalTimer = setInterval(() => {this.stateCheck()}, 17)
	},
	linkButtons: function() {
		document.querySelector("#eat-btn").addEventListener("click",() => {this.tamagotchi.feedTama()})
		document.querySelector("#light-btn").addEventListener("click",() => {this.tamagotchi.turnOffLight()})
		document.querySelector("#play-btn").addEventListener("click",() => {this.tamagotchi.playWithTama()})
	},
	createActor: function() {
		const imgTag = document.createElement('img')
		const actor = document.querySelector("#actor")
		imgTag.setAttribute("src","./img/actorRight-00.png")
		actor.append(imgTag)

	},
	stateCheck: function() {
		// increments a frame counter (slightly longer than a frame, 16.77777777 is 1 frame at 60fps)
		this.frameCounter++
		
		// if frame counter hits 60 frames, update second counter and reset frameCounter back to 0
		if (this.frameCounter === 60) {
			this.timeElapsedInSeconds++
			this.frameCounter = 0
		}

		// Every quarter of a second, try to update stats
		if (this.frameCounter % 15 === 0) {
			this.tamagotchi.getHungrier()
			this.tamagotchi.getSleepier()
			this.tamagotchi.getBoreder()
			this.updateScreenStats()
		}

		// Every 12 seconds, age up by one
		if (this.timeElapsedInSeconds % 12 === 0 && Math.floor(this.timeElapsedInSeconds / 12) > this.tamagotchi.age) {
			this.tamagotchi.ageUp()
		}

		if (this.tamagotchi.isMoving) {
			if (this.frameCounter % this.tamagotchi.animationSpeedSet[this.tamagotchi.animationSpeed] === 0) {
				this.tamagotchi.updateAnimationFrame()
			}
		} else {
			setTimeout(() => {this.tamagotchi.moveToNewSpot()}, 1000)
			this.tamagotchi.isMoving = true
		}
		
		// Check for death, if so, stop timer, and trigger death
		if (this.frameCounter % 5 === 0) {
			if (
					this.tamagotchi.hunger === 10 || 
					this.tamagotchi.sleepiness === 10 || 
					this.tamagotchi.boredom === 10
				) {
				this.endGame()
			}
		}
	},
	endGame: function() {
		clearInterval(this.globalTimer)
		this.music.player.setAttribute("loop","false")
		this.tamagotchi.runDeath()
	},
	updateScreenStats: function() {
		const valToStr = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]
		document.querySelector("#hunger-stat").innerText = `Hunger: ${valToStr[this.tamagotchi.hunger]}`
		document.querySelector("#sleepiness-stat").innerText = `Sleepiness: ${valToStr[this.tamagotchi.sleepiness]}`
		document.querySelector("#boredom-stat").innerText = `Boredom: ${valToStr[this.tamagotchi.boredom]}`
		document.querySelector("#age-stat").innerText = `Age: ${valToStr[this.tamagotchi.age]}`
	},
	_hideNameInput: function() {
		console.log(document.querySelector("#get-name").style.display = "none")
	},
	_updatetamagotchiName: function(name) {
		const tamaName = document.querySelector("#tama-name")
		tamaName.innerText = `Tamagotchi: ${name}`
	},
	_arrayEquals: function(a, b) {
  		return Array.isArray(a) &&
    			Array.isArray(b) &&
    			a.length === b.length &&
    			a.every((val, index) => val === b[index]);
	},
	_easterEgg: function(event) {
		console.log(event) // visual display of capturing key inputs
		const konamiCode = [
				"ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", 
				"ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", 
				"KeyB", "KeyA", "Enter"]
		this.inputBuffer.shift()
		this.inputBuffer.push(event.code)
		if (game._arrayEquals(konamiCode, this.inputBuffer)) {
			this.music.init()
		}
		
	}
}

class tamagotchi {
	constructor(name) {
		this.name = name
		this.hunger = 0
		this.sleepiness = 0
		this.boredom = 0
		this.age = 0
		this.animationRightArray = [
										"./img/actorRight-00.png",
										"./img/actorRight-01.png",
										"./img/actorRight-00.png",
										"./img/actorRight-02.png",
									]
		this.animationLeftArray = [
										"./img/actorLeft-00.png",
										"./img/actorLeft-01.png",
										"./img/actorLeft-00.png",
										"./img/actorLeft-02.png",
									]
		this.animationKey = 0
		this.animationSpeed = "normal"
		this.animationSpeedSet = {
			fastest: 4,
			fast: 8,
			normal:12,
			slow: 16,
			slowest: 20
		}
		this.width = 50
		this.height = 50
		this.xLimit = 340
		this.yLimit = 220
		this.currentX = 0
		this.currentY = 0
		this.movementDirection = "Right"
		this.isMoving = false
		this.isDead = false


	}

	feedTama() {
		// TODO: setEventListener to buttons!
		if (this.hunger > 0) {
			console.log(`${this.name} ate some food! Hunger decreased by 1!`)
			this.hunger -= 1
		} else {
			console.log(`${this.name} isn't hungry.`)
		}
	}

	turnOffLight() {
		// TODO: setEventListener to buttons!
		if (this.sleepiness > 0) {
			console.log(`${this.name} took a nap! Sleepiness decreased by 1!`)
			this.sleepiness -= 1
		} else {
			console.log(`${this.name} wasn't sleepy.`)
		}
	}

	playWithTama() {
		// TODO: setEventListener to buttons!
		if (this.boredom > 0) {
			console.log(`${this.name} played a game with you! Boredom decreased by 1!`)
			this.boredom -= 1
		} else {
			console.log(`${this.name} was doing something else already.`)
		}
	}

	ageUp() {
		this.age++
		this.width += 15
		this.height += 15
		document.querySelector("#actor img").style.width = `${this.width}px`
		document.querySelector("#actor img").style.height = `${this.height}px`
		console.log(`${this.name} got older! They are ${this.age} now!`)
	}

	getHungrier() {
		if (Math.random() < .125) {
			this.hunger++
		}
	}

	getSleepier() {
		if (Math.random() < .125) {
			this.sleepiness++
		}
	}

	getBoreder() {
		if (Math.random() < .125) {
			this.boredom++
		}
	}

	runDeath() {
		console.log(`Oh no! ${this.name} died. RIP lil buddy. :(`)
		document.querySelector("#actor img").setAttribute("src","./img/actorDead.png")
		alert("You died.")
		
	}

	moveToNewSpot() {
		let xRange = this.xLimit - this.width
		let yRange = this.yLimit - this.height
		let newX = Math.floor(Math.random() * xRange)
		let newY = Math.floor(Math.random() * yRange)

		if (newX > this.currentX) {
			this.movementDirection = "Right"
		} else if (newX <= this.currentX) {
			this.movementDirection = "Left"
		}

		//getting hypotenuse to determine walk speed
		let aSquared = (this.currentX - newX) ** 2
		let bSquared = (this.currentY - newY) ** 2
		let hypotenuse = Math.sqrt(aSquared + bSquared)

		if (hypotenuse < 80) {
			this.animationSpeed = "slowest"
		} else if (hypotenuse < 160) {
			this.animationSpeed = "slow"
		} else if (hypotenuse < 240) {
			this.animationSpeed = "normal"
		} else if (hypotenuse < 320) {
			this.animationSpeed = "fast"
		} else {
			this.animationSpeed = "fastest"
		}

		document.querySelector("#actor img").style.marginLeft = `${newX}px`
		document.querySelector("#actor img").style.marginTop = `${newY}px`
		// this.isMoving = true
		setTimeout(()=>{this.stopMoving()},2100)
		this.currentX = newX
		this.currentY = newY

	}

	stopMoving() {
		this.isMoving = false
		this.animationKey = 0
		this._setFrame()
	}

	updateAnimationFrame() {
		if (this.animationKey === 3) {
			this.animationKey = 0
		} else {
			this.animationKey++
		}
		this._setFrame()
	}

	_setFrame() {
		let key = this.animationKey
		if (this.movementDirection === "Right") {
			document.querySelector("#actor img").setAttribute("src",this.animationRightArray[key])
		} else if (this.movementDirection === "Left") {
			document.querySelector("#actor img").setAttribute("src",this.animationLeftArray[key])
		}
	}
}



const button = document.querySelector("button")
const textbox = document.querySelector("input")
document.onkeydown = (event) => {game._easterEgg(event)}

button.addEventListener("click", (event) => {
	if (document.querySelector("#get-name-input").value && !game.isStarted) {
		game.start(document.querySelector("#get-name-input").value)
	} else {
		alert("Please enter a name for your tamagotchi!")
	}
})

textbox.addEventListener("keydown", (event) => {
	if (event.code === "Enter" && !game.isStarted && document.querySelector("#get-name-input").value) {
		game.start(document.querySelector("#get-name-input").value)
	} else if (event.code === "Enter" && !game.isStarted) {
		alert("Please enter a name for your tamagotchi!")
	}
})


