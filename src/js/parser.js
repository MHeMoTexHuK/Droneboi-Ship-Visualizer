const rotationMap = [0, 2, 3, 1]; //Blame beau for that. 0 is auto, 1 is up, 2 down, 3 left, 4 right

function parseKey(key) {
	let ship = new Ship();
	
	let keyParts = key.split("|");
	
	let vehicleValues = keyParts[0].split(";");
	ship.header = vehicleValues[0];
	ship.offset = vehicleValues[1].split("~").map(v => -v);
	ship.unknownProperty = vehicleValues[2];
	ship.partsAmount = +keyParts[1];
	
	ship.parts = keyParts[2].split(":").map(partString => {
		if (partString.length < 1) return;
		let partParts = partString.split(";");
		
		let name = partParts[0].toLowerCase();
		let position = partParts[1].split("~").map(v => +v);
		if (position[0] < -11 || position[0] > 11 || position[1] < -11 || position[1] > 11) return; //out of bounds
		
		let rotation = +partParts[2];
		let power = +partParts[3];
		let color = +partParts[5];
		let direction = partParts[6] == 0 ? Math.floor(rotation / 90) : rotationMap[partParts[6] - 1];
		let isFlipped = partParts[7] > 0 ? true : false;
		let drawable = getPartDrawable(name);
		let size = getPartSize(name);
		let mass = getPartMass(name);
		
		return new Part(
			name,
			drawable, 
			+position[0] + Math.floor(maxBuildingArea / 2), 
			Math.floor(maxBuildingArea / 2) - position[1], 
			rotation, 
			power, 
			color,
			direction,
			isFlipped,
			size,
			mass
		);
	}).filter(v => v != undefined);
	
	let mass = 0, thrust = 0, momentum = 0;
	ship.parts.forEach(part => {
		mass += part.mass;
		if (part.hasThrust()) thrust += part.power;
		if (part.hasMomentum()) momentum += part.power;
	});
	ship.mass = mass;
	ship.thrust = thrust;
	ship.momentum = momentum;
	
	findCenters(ship);
	
	ship.sandboxOnly = checkForIllegalParts(ship);
	console.log(ship)
	return ship;
}

//Finds center of mass, thrust and rotation & assigns them to the ship object
function findCenters(ship) {
	let com = [0, 0], cot = [[0, 0], [0, 0], [0, 0], [0, 0]];
	let thrust = [0, 0, 0, 0];
	
	ship.parts.forEach(part => {
		let center = part.getCOM();
		com[0] += center[0]; com[1] += center[1];
		
		if (part.hasThrust() && part.power > 0) {
			let lerpAmount = Math.min(part.power / (thrust[part.direction] + part.power), 1);
			cot[part.direction][0] = lerp(cot[part.direction][0], center[0], lerpAmount);
			cot[part.direction][1] = lerp(cot[part.direction][1], center[1], lerpAmount);
			thrust[part.direction] += part.power;
		}
	});
	
	console.log(cot)
	
	com[0] /= ship.parts.length;
	com[1] /= ship.parts.length;
	
	ship.centerOfMass = com;
	ship.centersOfThrust = cot;
}

//returns true if the ship can only be used in sandbox, else returns false
//this function should probably be redone
function checkForIllegalParts(ship) {
	collisionsArray = [];
	for (let part of ship.parts) {
		if (
			//Check for overpower or negative power
			((part.type == "simple thruster" || part.type == "afterburner") && (part.power > 800 || part.power < 0)) ||
			(part.type == "ion thruster" && (part.power > 350 || part.power < 0)) ||
			(part.type == "momentum wheel" && (part.power > 650 || part.power < 0)) ||
			(part.type == "dynamo thruster" && (part.power > 200 || part.power < 0)) ||
			//Check for illegal position
			part.x % 1 !== 0 || part.y % 1 !== 0 ||
			//Check for illegal rotation
			part.rotation % 90 !== 0
		) 
			return true; //if anything above is true
			
		//Check for other blocks in this position and add itself to array if there's none
		if (collisionsArray[part.x + part.y * 22] > 0) {
			return true; 
		} else {
			collisionsArray[part.x + part.y * 22] = 1;
		};
	};
	
	if (ship.unknownProperty != 0) return true; //Whatever this property is, modifying it is illegal
	
	return false;
}

//utility
function lerp(a, b, amount) {
	return a * (1 - amount) + b * amount;
}