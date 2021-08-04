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
	tamagachi: undefined,
	inputBuffer: [null, null, null, null, null, null, null, null, null, null, null],
	globalTimer: undefined,
	timeElapsedInSeconds: 0,
	frameCounter: 0,
	start: function(name) {
		this.isStarted = true
		this._hideNameInput()
		this._updateTamagachiName(name)
		this.tamagachi = new Tamagachi(name)
		this.linkButtons()
		document.querySelector("#outershell").style.opacity = 100
		this.globalTimer = setInterval(() => {this.stateCheck()}, 17)
	},
	linkButtons: function() {
		document.querySelector("#eat-btn").addEventListener("click",() => {this.tamagachi.feedTama()})
		document.querySelector("#light-btn").addEventListener("click",() => {this.tamagachi.turnOffLight()})
		document.querySelector("#play-btn").addEventListener("click",() => {this.tamagachi.playWithTama()})
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
			this.tamagachi.getHungrier()
			this.tamagachi.getSleepier()
			this.tamagachi.getBoreder()
		}

		// Every 12 seconds, age up by one
		if (this.timeElapsedInSeconds % 12 === 0 && Math.floor(this.timeElapsedInSeconds / 12) > this.tamagachi.age) {
			this.tamagachi.ageUp()
		}

		


		// Update Screen every other frame
		if (this.frameCounter % 2 === 0) {
			this.updateScreenStats()
		}

		
		// Check for death, if so, stop timer, and trigger death
		if (
				this.tamagachi.hunger === 10 || 
				this.tamagachi.sleepiness === 10 || 
				this.tamagachi.boredom === 10
			) {
			this.endGame()
		}
		
	},
	endGame: function() {
		clearInterval(this.globalTimer)
		this.tamagachi.runDeath()
	},
	updateScreenStats: function() {
		const valToStr = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]
		document.querySelector("#hunger-stat").innerText = `Hunger: ${valToStr[this.tamagachi.hunger]}`
		document.querySelector("#sleepiness-stat").innerText = `Sleepiness: ${valToStr[this.tamagachi.sleepiness]}`
		document.querySelector("#boredom-stat").innerText = `Boredom: ${valToStr[this.tamagachi.boredom]}`
		document.querySelector("#age-stat").innerText = `Age: ${valToStr[this.tamagachi.age]}`


	},
	_hideNameInput: function() {
		console.log(document.querySelector("#get-name").style.display = "none")
	},
	_updateTamagachiName: function(name) {
		const tamaName = document.querySelector("#tama-name")
		tamaName.innerText = `Tamagachi: ${name}`
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

class Tamagachi {
	constructor(name) {
		this.name = name
		this.hunger = 0
		this.sleepiness = 0
		this.boredom = 0
		this.age = 0
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
		console.log(`${this.name} got older! They are ${this.age} now!`)
	}

	getHungrier() {
		if (Math.random() < .15) {
			this.hunger++
		}
	}

	getSleepier() {
		if (Math.random() < .10) {
			this.sleepiness++
		}
	}

	getBoreder() {
		if (Math.random() < .2) {
			this.boredom++
		}
	}

	runDeath() {
		console.log(`Oh no! ${this.name} died. RIP lil buddy. :(`)
		alert("You died.")
		// TODO: IMPLEMENT DEATH / UPDATE SPRITE / STOP CSS MOVEMENT
	}


}










const button = document.querySelector("button")
const textbox = document.querySelector("input")
document.onkeydown = (event) => {game._easterEgg(event)}

button.addEventListener("click", (event) => {
	if (document.querySelector("#get-name-input").value && !game.isStarted) {
		game.start(document.querySelector("#get-name-input").value)
	} else {
		alert("Please enter a name for your Tamagachi!")
	}
})

textbox.addEventListener("keydown", (event) => {
	if (event.code === "Enter" && !game.isStarted && document.querySelector("#get-name-input").value) {
		game.start(document.querySelector("#get-name-input").value)
	} else if (event.code === "Enter" && !game.isStarted) {
		alert("Please enter a name for your Tamagachi!")
	}
})


