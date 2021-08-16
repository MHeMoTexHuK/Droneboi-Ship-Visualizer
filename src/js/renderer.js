const canvasMain = element("canvasMain");
const render = canvasMain.getContext("2d");
const comCheckbox = element("comCheckbox"),
	  cotCheckbox = element("cotCheckbox"),
	  corCheckbox = element("corCheckbox");

var shipStats, shipStatsSize, widestStat = 0;
var frame;
var lastTimeout;

let shipVar;

//Prepares everything for continuous rendering
function beginRender(ship) {
	if (lastTimeout) window.clearTimeout(lastTimeout);
	
	shipVar = ship; //for other functions
	
	frame = 0;
	render.font = "20px monospace";
	createStats(ship)
	
	//Recursive call, cancelled on the next beginRender() call
	let lastCall = new Date().getTime();
	lastTimeout = window.setTimeout(self = () => {
		render.clearRect(0, 0, 900, 400);
		render.fillStyle = "#00000033";
		render.fillRect(padding, padding, padding + shipAreaSize, padding + shipAreaSize)
		
		try {
			renderShip(ship);
			renderCenters(ship);
			renderStats(ship);
		} catch (e) {
			console.log(e);
		}
		
		let now = new Date().getTime();
		frame += (now - lastCall) * (1/60);
		lastCall = now;
		
		lastTimeout = window.setTimeout(self, 1000/60);
	}, 0)
}

//Does this need explaination?
function renderShip(ship) {
	for (let i = 0; i < Math.min(frame * 3, ship.parts.length); i++) {
		let part = ship.parts[i];
		let animationFrame = Math.max(frame - i / 3, 0);
		let scale = 2.4 / (Math.max(animationFrame, 3) * 0.15);
		let addRotation = 1 / (animationFrame * 0.3);
		
		part.draw(render, addRotation < 0.1 ? 0 : addRotation, scale < 1.1 ? 1 : scale, padding, padding);
	}
}

//Renders vehicle stats
function renderStats(ship) {
	let toRender = Math.min(Math.floor(frame * 1.5), shipStatsSize); //2 symbols per 3 frames
	let i = 0;
	let stat = 0;
	
	while (i < toRender) {
		let symbolsLeft = toRender - i;
		let symbols = Math.min(shipStats[stat].length, symbolsLeft, shipStatsSize);
		
		//Render background
		render.fillStyle = "#00000033";
		render.fillRect(
			statsStartX, 
			padding + (statsHeight + statsMarginTop) * stat,
			widestStat + statsPadding * 2,
			statsHeight + statsPadding
		);
		//Render text
		render.fillStyle = "#eaccff";
		render.fillText(
			shipStats[stat].substring(0, symbols), 
			statsStartX + statsPadding, 
			padding + 20 + (statsHeight + statsMarginTop) * stat
		);
	
		i += symbols;
		if (symbols >= shipStats.length) stat++;
	}
}

function renderCenters(ship) {
	let offset = padding - 8;
	
	//COM
	if (comCheckbox.checked) {
		let x = ship.centerOfMass[0] * totalTileSize + offset, y = ship.centerOfMass[1] * totalTileSize + offset;
		
		render.strokeStyle = "#dd7766";
		renderCross(x, y);
		render.beginPath();
		render.arc(x, y, 5, 0, Math.PI * 2);
		render.stroke();
	}
	
	//COT
	if (cotCheckbox.checked) {
		let x = ship.centerOfThrust[0] * totalTileSize + offset, y = ship.centerOfThrust[1] * totalTileSize + offset;
		
		render.strokeStyle = "#ddaa44";
		renderCross(x, y);
		render.beginPath();
		render.moveTo(x + 5, y + 5);
		render.lineTo(x - 5, y + 5);
		render.lineTo(x - 5, y - 5);
		render.lineTo(x + 5, y - 5);
		render.lineTo(x + 5, y + 5);
		render.stroke();
	}
	
	//COR
	if (corCheckbox.checked) {
		let x = ship.centerOfRotation[0] * totalTileSize + offset, y = ship.centerOfRotation[1] * totalTileSize + offset;
		
		render.strokeStyle = "#5588ff";
		renderCross(x, y);
		render.beginPath();
		render.moveTo(x + 5, y);
		render.lineTo(x, y + 5);
		render.lineTo(x - 5, y);
		render.lineTo(x, y - 5);
		render.lineTo(x + 5, y);
		render.stroke();
	}
}

//Used by function above, renders a cross.
function renderCross(x, y) {
	render.beginPath();
	render.moveTo(padding, y);
	render.lineTo(padding * 2 + shipAreaSize, y);
	render.moveTo(x, padding);
	render.lineTo(x, padding * 2 + shipAreaSize);
	render.stroke();
}

function createStats(ship) {
	shipStats = [
		"Ship header:   " + ship.header,
		"Spawn offset:  " + "x: " + ship.offset[0] + ", y: " + ship.offset[1],
		"Blocks:        " + ship.partsAmount + " (" + ship.parts.length + ")",
		"Total mass:    " + ship.mass,
		"Thrust:        " + ship.thrust + " (" + (ship.thrust / ship.mass).toFixed(1) + " TWR)",
		"Momentum:      " + ship.momentum + " (" + (ship.momentum / ship.mass).toFixed(1) + " MWR)",
		ship.sandboxOnly ? "Singleplayer sandbox only" : "Multiplayer-compatible"
	];
	shipStatsSize = 0;
	shipStats.forEach(v => {
		shipStatsSize += v.length;
		widestStat = Math.max(render.measureText(v).width, widestStat);
	});
}

//Renders a single frame as if the animation has already finished + add a background
function forceRenderEverything() {
	let lastFrame = frame;
	frame = 99999; //To ensure that every block will be rendered, no matter how many blocks are there
	
	render.fillStyle = "#37384C";
	render.fillRect(0, 0, 900, 400);
	render.fillStyle = "#00000033";
	render.fillRect(padding, padding, padding + shipAreaSize, padding + shipAreaSize)
	
	try {
		renderShip(shipVar);
		renderCenters(shipVar);
		renderStats(shipVar);
	} catch (e) {
		console.log(e);
	}
	
	frame = lastFrame;
}