class Part {
	type = "";
	x = 0;
	y = 0;
	rotation = 0;
	power = 100;
	color = 0;
	isFlipped = false;
	isMultiblock = false;
	size = [1, 1];
	mass = 0;
	
	drawable = null;
	
	constructor(type, drawable, x, y, rotation, power, color, isFlipped, size, mass) {
		this.type = type;
		this.drawable = drawable;
		this.x = x;
		this.y = y;
		this.rotation = rotation;
		this.power = power;
		this.color = color;
		this.isFlipped = isFlipped;
		this.isMultiblock = size[0] > 1 || size[1] > 1;
		this.size = size;
		this.mass = mass;
	};
	
	draw(context, addRotation, scale, offsetX, offsetY) {
		this.drawable.draw(
			context, 
			this.x * totalTileSize + offsetX, 
			this.y * totalTileSize + offsetY, 
			this.color, 
			-this.rotation / DegreeToRadian + addRotation,
			scale
		);
	};
	
	getCOM() {
		return [this.x + this.size[0] / 2, this.y + this.size[1] / 2];
	}
	
	hasThrust() {
		return this.type == "simple thruster" || this.type == "afterburner" || this.type == "ion thruster" || this.type == "dynamo thruster";
	}
	
	hasMomentum() {
		return this.type == "momentum wheel";
	}
};


class PartDrawable {
	base = {x: 0, y: 0, w: 0, h: 0};
	mask = null;
	
	constructor(base, mask) {
		this.base = base;
		this.mask = mask;
	}

	draw(context, x, y, color, rotation, scale) {
		context.save();
		context.translate(x, y);
		context.rotate(rotation);
		
    	if (this.mask != null) 
    		context.drawImage(sprites, this.mask.x + color * masks.width, this.mask.y, this.mask.w, this.mask.h, -(this.mask.w * scale) / 2, -(this.mask.h * scale) / 2, this.mask.w * scale, this.mask.h * scale);
		if (this.base != null) 
			context.drawImage(bases, this.base.x, this.base.y, this.base.w, this.base.h, -(this.base.w * scale) / 2, -(this.base.h * scale) / 2, this.base.w * scale, this.base.h * scale);

		context.restore();
	}
}

class Ship {
	header = "";
	offset = [0, 0];
	unknownProperty = 0;
	partsAmount = 0;
	sandboxOnly = false;
	
	parts = [];
	mass = 0;
	thrust = 0;
	momentum = 0;
	
	centerOfMass = [0, 0];
	centerOfThrust = [0, 0];
	centerOfMomentum = [0, 0];
}