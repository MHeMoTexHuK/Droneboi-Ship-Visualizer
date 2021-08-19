metaDescription = document.createElement("meta");
metaDescription.property="og:description";
metaDescription.content = "Converts droneboi ship keys into an image preview. Work in progress. Made by the local furry"

if (window.location.search) {
	let argument = decodeURI(window.location.search.toString().split("?")[1]);
	
	if (argument) {
		try {
			let ship = parseKey(window.atob(argument));
			
			metaDescription.content += `\n\n• A default key is specified: ${ship.header}, ${ship.partsAmount} (${ship.parts.length}) parts. Open the link to generate a preview`;
		} catch (e) {
			metaDescription.content += "\n\nWarning: provided default value is not a droneboi ship key or the url is corrupted."
		}
	}
}

document.head.appendChild(metaDescription);