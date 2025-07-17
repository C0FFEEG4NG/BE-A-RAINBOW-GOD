document.addEventListener('DOMContentLoaded', () => {
    const textContainer = document.getElementById('text-container');
    const catContainer = document.getElementById('cat-container');
    const catSprite = document.getElementById('cat-sprite');

    const rainbowColors = [
        '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'
    ]; // Red, Orange, Yellow, Green, Blue, Indigo, Violet

    const originalText = "BE A RAINBOW GOD!";
    let rainbowColorIndex = 0;

    // --- Text Animation ---

    function createRainbowText(text, offsetY, scaleY) {
        const textElement = document.createElement('div');
        textElement.style.position = 'absolute';
        textElement.style.top = '0';
        textElement.style.left = '0';
        textElement.style.transform = `translate(0, ${offsetY}px) scaleY(${scaleY})`; // Apply offset and scale for layered effect
        textElement.style.transformOrigin = 'center'; // Ensure scaling is from the center

        let htmlContent = '';
        for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            const color = rainbowColors[(rainbowColorIndex + i) % rainbowColors.length];
            htmlContent += `<span class="rainbow-letter" style="color:${color};">${letter}</span>`;
        }
        textElement.innerHTML = htmlContent;
        textContainer.appendChild(textElement);
        return textElement;
    }

    // Create multiple layers of text
    const textLayers = [];
    const numTextLayers = 10; // How many "ghost" copies of the text
    const textLayerOffset = 8; // Pixels offset for each layer
    const textScaleFactor = 0.98; // Slightly shrink each layer to create depth

    for (let i = 0; i < numTextLayers; i++) {
        const offsetY = i * textLayerOffset;
        const scaleY = 1 - (i * (1 - textScaleFactor) / numTextLayers); // Gradually scale
        const layer = createRainbowText(originalText, offsetY, scaleY);
        layer.style.zIndex = -i; // Layers further back have lower z-index
        layer.style.opacity = 1 - (i / (numTextLayers * 1.5)); // Fade out further layers
        textLayers.push(layer);
    }

    function animateText() {
        rainbowColorIndex = (rainbowColorIndex + 1) % rainbowColors.length; // Cycle color for the "main" layer start

        textLayers.forEach((layer, layerIndex) => {
            const spans = layer.querySelectorAll('.rainbow-letter');
            spans.forEach((span, letterIndex) => {
                const color = rainbowColors[(rainbowColorIndex + letterIndex + layerIndex * 2) % rainbowColors.length];
                span.style.color = color;

                // Jitter effect
                const jitterX = (Math.random() - 0.5) * 4; // -2 to 2 pixels
                const jitterY = (Math.random() - 0.5) * 4;
                span.style.transform = `translate(${jitterX}px, ${jitterY}px)`;
            });
        });
        requestAnimationFrame(animateText);
    }

    // --- Cat Animation ---

    let catX = window.innerWidth / 2;
    let catY = window.innerHeight / 2;
    let catDirectionX = 3; // Initial speed and direction
    let catDirectionY = 3;
    let catRotation = 0;
    let catFlip = 1; // 1 for normal, -1 for flipped

    // Function to create a rainbow-colored trail behind the cat
    function createCatTrail(x, y, rotation, flip) {
        const trailElement = document.createElement('img');
        trailElement.src = catSprite.src; // Use the same image for the trail
        trailElement.className = 'cat-trail';
        trailElement.style.left = `${x}px`;
        trailElement.style.top = `${y}px`;
        trailElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scaleX(${flip})`; // Center it, rotate, and flip
        document.body.appendChild(trailElement);

        // Animate opacity and size to fade out and shrink
        let opacity = 1;
        let scale = 1;
        let hueRotate = 0; // Initial hue rotation for the trail

        const trailColors = [
            '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'
        ];
        let currentTrailColorIndex = 0; // Use a distinct index for trail colors

        const fadeInterval = setInterval(() => {
            opacity -= 0.05; // Fade out faster
            scale -= 0.02; // Shrink
            hueRotate = (hueRotate + 10) % 360; // Cycle hue

            // Cycle through distinct colors for the trail
            currentTrailColorIndex = (currentTrailColorIndex + 1) % trailColors.length;
            trailElement.style.filter = `drop-shadow(0 0 5px ${trailColors[currentTrailColorIndex]})`; // Apply color as a glow

            if (opacity <= 0) {
                clearInterval(fadeInterval);
                trailElement.remove();
            } else {
                trailElement.style.opacity = opacity;
                trailElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale * flipX}, ${scale})`; // Scale and maintain flip
            }
        }, 50); // Adjust speed of fading
    }

    function animateCat() {
        // Create trail every few frames
        if (Math.random() < 0.7) { // Adjust frequency of trail creation
            createCatTrail(catX, catY, catRotation, catFlip);
        }

        // Move cat
        catX += catDirectionX;
        catY += catDirectionY;

        // Bounce off walls
        if (catX + catContainer.offsetWidth / 2 > window.innerWidth || catX - catContainer.offsetWidth / 2 < 0) {
            catDirectionX *= -1;
            catFlip *= -1; // Flip the cat horizontally when it hits a side wall
        }
        if (catY + catContainer.offsetHeight / 2 > window.innerHeight || catY - catContainer.offsetHeight / 2 < 0) {
            catDirectionY *= -1;
        }

        // Apply position and rotation
        catContainer.style.left = `${catX}px`;
        catContainer.style.top = `${catY}px`;
        catSprite.style.transform = `scaleX(${catFlip})`; // Apply flip directly to the sprite

        // Slight random rotation, as seen in the video
        catRotation = (Math.random() - 0.5) * 10; // -5 to 5 degrees
        catSprite.style.transform += ` rotate(${catRotation}deg)`; // Add rotation

        requestAnimationFrame(animateCat);
    }

    // Initialize positions
    catContainer.style.position = 'absolute';
    catContainer.style.transform = 'translate(-50%, -50%)'; // Center the cat relative to its `left`/`top`

    // Start animations
    animateText();
    animateCat();
});
