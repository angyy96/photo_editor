(async function() {
	const canvas = document.getElementById('canvas'); 
	const context = canvas.getContext('2d');
	let originalImage = await loadImage('img/space.jpg');
	const mouse = getMouse(canvas);

	const greyFilterInput = document.getElementById('filterGray');
	const blueFilterInput = document.getElementById('filterBlue');
	const redFilterInput = document.getElementById('filterRed');
	const greenFilterInput = document.getElementById('filterGreen');

	let image = originalImage;

	const imageParams =  {
		offsetX: 0,
		offsetY: 0,
		scale: 1
	}

	const filters = {
		grey: false,
		blue: false,
		green: false,
		red: false
	}

	canvas.width = 750;
	canvas.height = 750;

	update();

	function update() {
		requestAnimationFrame(update);

		if (mouse.left) {
			imageParams.offsetX += mouse.dx;
			imageParams.offsetY += mouse.dy;
		}

		if (mouse.wheel) {
			imageParams.scale += mouse.wheel / 1000;
		}

		clearCanvas();

		context.drawImage(
			image,
			0, 0,
			image.width, image.height,
			imageParams.offsetX, imageParams.offsetY,
			image.width * imageParams.scale,
			image.height * imageParams.scale
		)

		mouse.update();
	}

	function clearCanvas() {
		canvas.width = canvas.width;
	}

	greyFilterInput.addEventListener('change', event => {
		filters.grey =  greyFilterInput.checked;
		updateFilter();
	})

	blueFilterInput.addEventListener('change', event => {
		filters.blue = blueFilterInput.checked;
		updateFilter();
	})

	redFilterInput.addEventListener('change', event => {
		filters.red =  redFilterInput.checked;
		updateFilter();
	})

	greenFilterInput.addEventListener('change', event => {
		filters.green =  greenFilterInput.checked;
		updateFilter();
	})

	function updateFilter() {
		if (!filters.grey && !filters.red && !filters.blue && !filters.green) {
			image = originalImage
		}
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.width = image.width;
		canvas.height = image.height;

		context.drawImage(
			originalImage,
			0, 0, originalImage.width, originalImage.height,
			0, 0, originalImage.width, originalImage.height
		)

		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

		if (filters.grey) {
			for (let i = 0; i < imageData.data.length; i += 4) {
				const average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
				imageData.data[i] = average; 
				imageData.data[i + 1] = average; 
				imageData.data[i + 2] = average; 
			}
		}
		else {
			if (filters.blue) {
				for (let i = 0; i < imageData.data.length; i += 4) {
					imageData.data[i + 2] = 0; 
				}
			}
			if (filters.green) {
				for (let i = 0; i < imageData.data.length; i += 4) {
					imageData.data[i + 1] = 0; 
				}
			}

			if (filters.red) {
				for (let i = 0; i < imageData.data.length; i += 4) {
					imageData.data[i] = 0; 
				}
			}
		}

		context.putImageData(
			imageData, 
			0, 
			0, 
			0, 
			0, 
			image.width, 
			image.height
		);
		
		image = canvas;
	}

	document.getElementById('download').addEventListener('click', () => {
		const aELement = document.createElement('a');
		aELement.href = canvas.toDataURL('image/jpg');
		aELement.setAttribute('download', 'sampleName.jpg');
		aELement.click();
	})

	const loadImageInput = document.getElementById('loadImage');
	loadImageInput.addEventListener('change', event => {
		const file = loadImageInput.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const newImage = new Image;
			newImage.onload = () => {
				originalImage = image = newImage;
			}
			newImage.src = reader.result;
		}
	})
})()
