console.log("Tamagotchi - GA Project 0")

const music = {
	player: document.querySelector("audio"),
	volArray: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1],
	currVolIndex: 0,
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
		document.body.style.backgroundColor = "#FF68B0"
		document.body.style.color = "#000000"
	}
}

const game = {
	music: music,
	isStarted: false,
	start: function(name) {
		this.isStarted = true
		this._hideName()
		this.music.init()

	},
	_hideName: function() {
		console.log(document.querySelector("#get-name").style.display = "none")
	}
}

class Tamagachi {
	constructor() {
		this.hunger = 0
		this.sleepiness = 0
		this.boredom = 0
		this.age = 0
	}
}










const button = document.querySelector("button")
const textbox = document.querySelector("input")

button.addEventListener("click", (event) => {
	if (document.querySelector("#get-name-input").value && !game.isStarted) {
		game.start()
	} else {
		alert("Please enter a name for your Tamagachi!")
	}
})

textbox.addEventListener("keypress", (event) => {
	if (event.code === "Enter" && !game.isStarted) {
		game.start()
	}
})


