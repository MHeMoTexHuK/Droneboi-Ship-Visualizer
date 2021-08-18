/*
This script prepares the tinted sprite atlases. Texture tinting is too expensive process to perform it on CPU in runtime and
i dont want to perform this operation on GPU because it would require me to do a ton of low-level stuff which i really don't like
*/

//copied from my previous project
const colors = [[250, 250, 250], [70, 70, 70], [0, 153, 255], [255, 140, 40], [255, 50, 50], [75, 255, 100], [255, 200, 0], [210, 40, 40], [140, 140, 140], [240, 150, 200], [126, 102, 20], [204, 204, 0], [200, 100, 100], [158, 116, 79], [221, 223, 223]];

const bases = element("imgBases");
const masks = element("imgMasks");

//buffer cus i can't get image data of <img>
const canvas = document.createElement('canvas');
canvas.width = masks.width;
canvas.height = masks.height;
const bctx = canvas.getContext("2d");
bctx.drawImage(masks, 0, 0);

const masksTinted = element("canvasTintedMasks");
masksTinted.width = masks.width * colors.length;
const mctx = masksTinted.getContext("2d");

const mirroredBases = element("canvasMirroredBases");
mirroredBases.width = bases.width;
mirroredBases.height = bases.height;
const mbctx = mirroredBases.getContext("2d");

const mirroredMasks = element("canvasMirroredMasks");
mirroredMasks.width = masksTinted.width;
mirroredMasks.height = masksTinted.height;
const mmctx = mirroredMasks.getContext("2d");


window.setTimeout(() => {
	let start = new Date().getTime();
	
	//Tinted masks
	let c;
	for (c in colors) {
		let color = colors[c];
		let maskData = bctx.getImageData(0, 0, 144, 64);
		let pix = maskData.data;

		//tint
		for (var i = 0, n = pix.length; i < n; i += 4) {
			if (pix[i + 3] < 10) continue; //transparent, ignore completely
			let alpha = pix[i + 3] / 255;

			pix[i] *= (color[0] / 255) * alpha; // Red component
			pix[i + 1] *= (color[1] / 255) * alpha; // Blue component
			pix[i + 2] *= (color[2] / 255) * alpha; // Green component
		}

		mctx.putImageData(maskData, c * masks.width, 0);
	}
	
	//Mirrored bases
	mbctx.save();
	mbctx.translate(mirroredBases.width, 0);
	mbctx.scale(-1, 1);
	for (i in DrawablesMap) {
		let drawable = DrawablesMap[i].base;
		mbctx.drawImage(
			bases, 
			drawable.x, drawable.y, drawable.w, drawable.h,
			mirroredBases.width - drawable.x - drawable.w, drawable.y,
			drawable.w, drawable.h
		);
	}
	mbctx.restore();
	
	//mirrored masks. holy fox, i feel like im doing something wrong. at least these 2 actions are mostly performed at gpu and are not as slow as tinting (50+ milliseconds!)
	mmctx.save();
	mmctx.translate(mirroredMasks.width, 0);
	mmctx.scale(-1, 1);
	
	for (color in colors) {
		for (i in DrawablesMap) {
			let drawable = DrawablesMap[i].mask;
			if (drawable == null) continue;
			let offset = color * masks.width;
			mmctx.drawImage(
				masksTinted,
				drawable.x + offset, drawable.y,
				drawable.w, drawable.h,
				mirroredMasks.width - drawable.x - drawable.w - offset, drawable.y,
				drawable.w, drawable.h
			);
		}
	}
	
	mmctx.restore();
	
	let end = new Date().getTime();
	console.log(`Succesfully generated ${c} color spaces, mirrored bases and mirrored masks. Took ${end - start} ms.`);
}, 100);