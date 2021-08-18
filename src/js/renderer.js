const canvasMain = element("canvasMain");
const render = canvasMain.getContext("2d");
render.imageSmoothingEnabled = false;
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
	render.font = "40px monospace";
	createStats(ship)
	
	//Recursive call, cancelled on the next beginRender() call
	let lastCall = new Date().getTime();
	lastTimeout = window.setTimeout(self = () => {
		render.clearRect(0, 0, canvasMain.width, canvasMain.height);
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
		let scale = (2.4 / (Math.max(animationFrame, 3) * 0.15)) * 2;
		let addRotation = 1 / (animationFrame * 0.3);
		
		part.draw(render, addRotation < 0.1 ? 0 : addRotation, scale < 2.2 ? 2 : scale, padding, padding);
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
			padding + 40 + (statsHeight + statsMarginTop) * stat
		);
	
		i += symbols;
		if (symbols >= shipStats.length) stat++;
	}
}

function renderCenters(ship) {
	let offset = padding - 16; //I can't think of a better solution   my brain is dying   aaaaaaa help im dying inside because of javascriptus
	
	render.translate(0.5, 0.5); //render.drawH(...) methods draw everything with 0.5px offset. 
	//COT
	if (cotCheckbox.checked) {
		for (dirCOT of ship.centersOfThrust) {
			if (dirCOT[0] <= 0 && dirCOT[1] <= 0) continue;
			
			let x = dirCOT[0] * totalTileSize + offset, y = dirCOT[1] * totalTileSize + offset;
		
			render.strokeStyle = "#ddaa44";
			renderCross(x, y);
			renderSquare(x, y, 8);
		}
	}
	
	//COM
	if (comCheckbox.checked) {
		let x = ship.centerOfMass[0] * totalTileSize + offset, y = ship.centerOfMass[1] * totalTileSize + offset;
		
		render.strokeStyle = "#dd7744";
		renderCross(x, y);
		renderCircle(x, y, 8);
	}
	render.translate(-0.5, -0.5)
}

//Drawing methods used by function above
function renderCross(x, y) {
	render.beginPath();
	render.moveTo(padding, y);
	render.lineTo(padding * 2 + shipAreaSize, y);
	render.moveTo(x, padding);
	render.lineTo(x, padding * 2 + shipAreaSize);
	render.stroke();
}

function renderCircle(x, y, radius) {
	render.beginPath();
	render.arc(x, y, radius, 0, Math.PI * 2);
	render.stroke();
}

function renderSquare(x, y, size) {
	render.beginPath();
	render.moveTo(x + size, y + size);
	render.lineTo(x - size, y + size);
	render.lineTo(x - size, y - size);
	render.lineTo(x + size, y - size);
	render.lineTo(x + size, y + size);
	render.stroke();
}

//Generates ship stats
function createStats(ship) {
	shipStats = [
		"Ship header:    " + ship.header,
		"Spawn offset:   " + "x: " + ship.offset[0] + ", y: " + ship.offset[1],
		"Blocks:         " + ship.partsAmount + " (" + ship.parts.length + ")",
		"Total mass:     " + ship.mass,
		"Total thrust:   " + ship.thrust + " (" + (ship.thrust / ship.mass).toFixed(1) + " TWR)",
		"Total momentum: " + ship.momentum + " (" + (ship.momentum / ship.mass).toFixed(1) + " MWR)",
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