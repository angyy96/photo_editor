function loadImage(src) {
    return new Promise((resolve, reject) => {
        try {
            const image = new Image;
            image.onload = () => resolve(image);
            image.src = src;
        } catch (err) {
            return reject(err)
        }
    });
}

function getMouse(element) {
    const mouse = {
        x: 0, y: 0,
        dx: 0, dy: 0,
        left: false,
        wheel: 0
    }

    element.addEventListener('mousemove', event => {
        const rect = element.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        mouse.dx = x - mouse.x;
        mouse.dy = y - mouse.y;

        mouse.x = x;
        mouse.y = y;
    })

    element.addEventListener('mousedown', event => {
        if (event.button === 0) {
            mouse.left = true;
        }
    })

    element.addEventListener('mouseup', event => {
        if (event.button === 0) {
            mouse.left = false;
        }
    })

    element.addEventListener('mousewheel', event => {
        mouse.wheel = event.deltaY;
        event.preventDefault();
    })

    mouse.update = () => {
        mouse.dx = 0
        mouse.dy = 0
        mouse.wheel = 0
    }

    return mouse;
}