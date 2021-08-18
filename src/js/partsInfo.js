function getPartDrawable(blockName) {
	let drawable = DrawablesMap[blockName] 
	return drawable ? drawable : new PartDrawable(null, null);
}

function getPartMass(blockName) {
	for (possibleMass in MassesMap) if (MassesMap[possibleMass].includes(blockName)) return +possibleMass;
	return 0;
}

function getPartSize(blockName) {
	let size = MultiblocksMap[blockName];
	return size ? size : [1, 1];
}


/*
Created using a smol hand-made utility app
*/
DrawablesMap = {
	't1 block': new PartDrawable({
		x: 0, y: 0, w: 16, h: 16
	}, {
		x:0, y: 16, w: 16, h: 16
	}),
	't2 block': new PartDrawable({
		x: 16, y: 0, w: 16, h: 16
	}, {
		x:0, y: 16, w: 16, h: 16
	}),
	't1 wedge': new PartDrawable({
		x: 32, y: 0, w: 16, h: 16
	}, {
		x:32, y: 16, w: 16, h: 16
	}),
	't2 wedge': new PartDrawable({
		x: 48, y: 0, w: 16, h: 16
	}, {
		x:32, y: 16, w: 16, h: 16
	}),
	'structure block': new PartDrawable({
		x: 64, y: 0, w: 16, h: 16
	}, {
		x:64, y: 16, w: 16, h: 16
	}),
	'glass block': new PartDrawable({
		x: 0, y: 16, w: 16, h: 16
	}, null),
	'glass wedge': new PartDrawable({
		x: 16, y: 16, w: 16, h: 16
	}, null),
	'core': new PartDrawable({
		x: 32, y: 16, w: 16, h: 16
	}, {
		x:0, y: 16, w: 16, h: 16
	}),
	'simple thruster': new PartDrawable({
		x: 48, y: 16, w: 16, h: 16
	}, {
		x:16, y: 0, w: 16, h: 16
	}),
	'afterburner': new PartDrawable({
		x: 64, y: 16, w: 16, h: 16
	}, {
		x:0, y: 0, w: 16, h: 16
	}),
	'ion thruster': new PartDrawable({
		x: 0, y: 32, w: 16, h: 16
	}, {
		x:48, y: 0, w: 16, h: 16
	}),
	'dynamo thruster': new PartDrawable({
		x: 16, y: 32, w: 16, h: 16
	}, {
		x:64, y: 0, w: 16, h: 16
	}),
	'momentum wheel': new PartDrawable({
		x: 32, y: 32, w: 16, h: 16
	}, {
		x:32, y: 0, w: 16, h: 16
	}),
	'small fuel tank': new PartDrawable({
		x: 48, y: 32, w: 16, h: 16
	}, {
		x:0, y: 16, w: 16, h: 16
	}),
	'small battery': new PartDrawable({
		x: 64, y: 32, w: 16, h: 16
	}, {
		x:0, y: 16, w: 16, h: 16
	}),
	't1 rammer': new PartDrawable({
		x: 0, y: 48, w: 16, h: 16
	}, {
		x:80, y: 0, w: 16, h: 16
	}),
	't1 blaster': new PartDrawable({
		x: 16, y: 48, w: 16, h: 16
	}, {
		x:96, y: 0, w: 16, h: 16
	}),
	't1 pulse laser': new PartDrawable({
		x: 32, y: 48, w: 16, h: 16
	}, {
		x:112, y: 0, w: 16, h: 16
	}),
	't1 gatling gun': new PartDrawable({
		x: 48, y: 48, w: 16, h: 16
	}, {
		x:16, y: 16, w: 16, h: 16
	}),
	't1 rocket launcher': new PartDrawable({
		x: 64, y: 48, w: 16, h: 16
	}, {
		x:128, y: 0, w: 16, h: 16
	}),
	'explosive': new PartDrawable({
		x: 0, y: 64, w: 16, h: 16
	}, null),
	'connector': new PartDrawable({
		x: 16, y: 64, w: 16, h: 16
	}, {
		x:48, y: 16, w: 16, h: 16
	}),
	't1 solar panel': new PartDrawable({
		x: 32, y: 64, w: 16, h: 16
	}, null),
	't2 solar panel': new PartDrawable({
		x: 48, y: 64, w: 16, h: 16
	}, null),
	'solar block': new PartDrawable({
		x: 64, y: 64, w: 16, h: 16
	}, null),
	'hinge': new PartDrawable({
		x: 0, y: 80, w: 16, h: 16
	}, null),
	'seperator': new PartDrawable({
		x: 16, y: 80, w: 16, h: 16
	}, null), 
	'camera block': new PartDrawable ({
		x: 32, y: 80, w: 16, h:16
	}, {
		x:0, y: 16, w: 16, h: 16
	}),
	't1 drill': new PartDrawable({
		x: 48, y: 80, w: 16, h: 16
	}, {
		x:80, y: 16, w: 16, h: 16
	}),
	't1 mining laser': new PartDrawable({
		x: 64, y: 80, w: 16, h: 16
	}, {
		x:128, y: 16, w: 16, h: 16
	}),
	'small crate': new PartDrawable({
		x: 0, y: 96, w: 16, h: 16
	}, {
		x:0, y: 16, w: 16, h: 16
	}),
	'station block': new PartDrawable({
		x: 16, y: 96, w: 32, h: 32
	}, {
		x:16, y: 32, w: 32, h: 32
	}),
	't1 wedge 1x2': new PartDrawable({
		x: 48, y: 96, w: 16, h: 32
	}, {
		x:0, y: 32, w: 16, h: 32
	}),
	'medium fuel tank': new PartDrawable({
		x: 80, y: 0, w: 32, h: 32
	}, {
		x:16, y: 32, w: 32, h: 32
	}),
	'medium crate': new PartDrawable({
		x: 80, y: 32, w: 32, h: 32
	}, {
		x:16, y: 32, w: 32, h: 32
	}),
	'medium battery': new PartDrawable({
		x: 80, y: 64, w: 32, h: 32
	}, {
		x: 16, y: 32, w: 32, h: 32
	})
};

MassesMap = {
	0.25: ['glass wedge'],
	0.5: ['glass block', 't1 wedge', 't1 solar panel', 't2 solar panel', 'connector'],
	1: ['t1 block', 't2 wedge', 't1 wedge 1x2', 'structure block', 'solar block', 'hinge', 'seperator', 'camera block', 't1 rammer', 't1 blaster', 't1 pulse laser', 't1 gatling gun', 't1 rocket launcher', 't1 explosive'],
	2: ['core', 't2 block', 't1 drill', 'small crate', 'small fuel tank', 'simple thruster', 'afterburner', 'momentum wheel'],
	3: ['t1 mining laser', 'small battery', 'ion thruster', 'dynamo thruster'],
	4: ['station block'],
	8: ['medium fuel tank', 'medium crate'],
	12: ['medium battery']
};

MultiblocksMap = {
	't1 wedge 1x2': [1, 2],
	'station block': [2, 2],
	'medium fuel tank': [2, 2],
	'medium battery': [2, 2],
	'medium crate': [2, 2]
};