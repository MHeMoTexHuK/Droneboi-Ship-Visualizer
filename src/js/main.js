function element(id) { return document.getElementById(id) };

//globals
const   maxBuildingArea = 21,
		tileSize = 32,
		tileMargin = 0,
		totalTileSize = tileSize + tileMargin,
		
		shipAreaSize = totalTileSize * maxBuildingArea,
		padding = 14,
		
		statsStartX = padding * 3 + shipAreaSize,
		statsPadding = 6,
		statsHeight = 40 + statsPadding * 2,
		statsMarginTop = 12;

const DegreeToRadian = 180 / Math.PI;

var keyInput = element("key");
var shipLayout = element("shipArea");

window.onload = function() {
	generateSprites();
	
	if (window.location.search) {
		let argument = decodeURI(window.location.search.toString().split("?")[1]);
		
		if (argument) beginVisualization(argument);
	}
}
	
function beginVisualization(key) {
	let ship;
	
	try {
		keyDecoded = window.atob(key); //base64 to ascii
		ship = parseKey(keyDecoded);
		
		if (!ship.parts) throw new Error("Invalid key: parts array is undefined"); //simple validation. will work in most cases.
		
		beginRender(ship);
	} catch (e) {
		shipArea.style.display = "none";
		window.alert("Invalid key");
		console.log(e);
		return;
	}
	
	shipArea.style.display = "block";
}

function saveImage() {
	forceRenderEverything();
	
	let w = statsStartX + widestStat;
	let h = Math.max(shipAreaSize + padding * 2, shipStats.length * (statsHeight + statsMarginTop));
	
	let bufferCtx = bufferCanvas.getContext("2d");
	bufferCanvas.width = w; bufferCanvas.height = h;
	bufferCtx.fillRect(0, 0, w, h);
	bufferCtx.drawImage(canvasMain, 0, 0, w, h, 0, 0, w, h);
	
	return bufferCanvas.toDataURL("image/png;base64");
}


//When the user presses the "parse" button
function onParseKey() {
	let keyRaw = keyInput.value;
	beginVisualization(keyRaw);
}

//When the user presses the "save as image" button. Stackoverflow went brrrr.
function onSaveCanvas() {
	let link = document.createElement('a');
	link.download = "Droneboi key.png";
	link.href = saveImage();
  
	//fake click event
	if (document.createEvent) {
		e = document.createEvent("MouseEvents");
		e.initMouseEvent("click", true, true, window,
						 0, 0, 0, 0, 0, false, false, false,
						 false, 0, null);
		link.dispatchEvent(e);
	} else if (lnk.fireEvent) {
		link.fireEvent("onclick");
	};
}