document.addEventListener('DOMContentLoaded', () => {
    const textContainer = document.getElementById('text-container');

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

    // --- Dot Trail Animation ---

    let mouseX = window.innerWidth / 2; // Start in center
    let mouseY = window.innerHeight / 2; // Start in center
    const dotSize = 20; // Size of the dot
    let dotColorIndex = 0; // To cycle colors for the dots
    let lastTrailTime = 0;
    const minTrailInterval = 50; // milliseconds between trail dots (adjust for density)

    // Update mouse coordinates on mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Function to create a rainbow-colored trail dot
    function createTrailDot(x, y, color) {
        const dotElement = document.createElement('div');
        dotElement.className = 'trail-dot';
        dotElement.style.left = `${x}px`;
        dotElement.style.top = `${y}px`;
        dotElement.style.backgroundColor = color; // Set dot color
        document.body.appendChild(dotElement);

        // Animate opacity and size to fade out and shrink
        let opacity = 1;
        let scale = 1;

        const fadeInterval = setInterval(() => {
            opacity -= 0.05; // Fade out faster
            scale -= 0.02; // Shrink

            if (opacity <= 0) {
                clearInterval(fadeInterval);
                dotElement.remove();
            } else {
                dotElement.style.opacity = opacity;
                dotElement.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }
        }, 50); // Adjust speed of fading
    }

    function animateDot(currentTime) {
        // Create trail dot with current rainbow color based on interval
        if (currentTime - lastTrailTime > minTrailInterval) {
            const trailColor = rainbowColors[dotColorIndex % rainbowColors.length];
            createTrailDot(mouseX, mouseY, trailColor);
            dotColorIndex = (dotColorIndex + 1) % rainbowColors.length; // Cycle color for the next dot
            lastTrailTime = currentTime;
        }

        requestAnimationFrame(animateDot);
    }

    // Start animations
    animateText();
    // Pass a starting time to animateDot
    requestAnimationFrame(animateDot);
});
