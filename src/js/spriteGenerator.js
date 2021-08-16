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
const mctx = canvas.getContext("2d");
mctx.drawImage(masks, 0, 0);

const sprites = element("canvasSprites");
sprites.width = masks.width * colors.length;
const sctx = sprites.getContext("2d");


window.setTimeout(() => {
	let c;
	for (c in colors) {
		let color = colors[c];
		let maskData = mctx.getImageData(0, 0, 144, 64);
		let pix = maskData.data;

		//tint
		for (var i = 0, n = pix.length; i < n; i += 4) {
			if (pix[i + 3] < 10) continue; //transparent, ignore completely
			let alpha = pix[i + 3] / 255;

			pix[i] *= (color[0] / 255) * alpha; // Red component
			pix[i + 1] *= (color[1] / 255) * alpha; // Blue component
			pix[i + 2] *= (color[2] / 255) * alpha; // Green component
		}

		sctx.putImageData(maskData, c * masks.width, 0);
	}
	console.log("generated " + c + " color spaces")
}, 100);