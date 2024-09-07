const mainCircle = document.getElementById("mainCircle");
const formContainer = document.getElementById("formContainer");
const circleForm = document.getElementById("circleForm");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let currentCircle = null;
let offsetX, offsetY;
let circles = []; // Array para mantener el registro de círculos
let smallCircles = []; // Array para los pequeños círculos

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Posicionar el círculo principal en la parte superior centrado
function positionMainCircle() {
    mainCircle.style.left = (window.innerWidth / 2 - 25) + 'px'; // Centrando horizontalmente
    mainCircle.style.top = '10px'; // Uno a la parte superior 
}

positionMainCircle(); // Llamar a la función al cargar la página

// Añadir eventos al círculo principal
addCircleEvents(mainCircle);
circles.push({ element: mainCircle, parent: null, generation: 0 });

// Colores de los círculos según su jerarquía
const colors = ['white', 'red', 'blue', 'green', 'yellow', 'gray', 'orange', 'pink', 'brown']; // Reemplaza 'newColor' con el color deseado

function onMouseDown(circle, e) {
    currentCircle = circle; // Establecer el círculo actual
    currentCircle.style.transition = 'none'; // Desactivar la transición durante el arrastre
    offsetX = e.clientX - currentCircle.getBoundingClientRect().left;
    offsetY = e.clientY - currentCircle.getBoundingClientRect().top;

    function onMouseMove(e) {
        currentCircle.style.left = (e.clientX - offsetX) + 'px';
        currentCircle.style.top = (e.clientY - offsetY) + 'px';
        drawLines(); // Redibuja las líneas en movimiento del círculo

        // Mueve el formulario junto con el círculo
        if (formContainer.style.display === 'block') {
            formContainer.style.left = (e.clientX - offsetX) + 'px';
            formContainer.style.top = (e.clientY - offsetY) + 'px';
        }
    }

    function onMouseUp() {
        currentCircle.style.transition = ''; // Reactivar la transición
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}

function onRightClick(e) {
    e.preventDefault(); // Evita el menú contextual
    const rect = currentCircle.getBoundingClientRect();
    formContainer.style.display = 'block';
    formContainer.style.top = rect.top + 'px';
    formContainer.style.left = (rect.right + 10) + 'px'; // Coloca el formulario al lado del círculo

    // Le añade la clase para animar la aparición del formulario
    formContainer.classList.remove('fadeOut');
    formContainer.classList.add('fadeIn');
}

function addCircleEvents(circle) {
    circle.addEventListener("mousedown", (e) => onMouseDown(circle, e));
    circle.addEventListener("contextmenu", onRightClick);
}

function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    
    // Dibuja líneas entre círculos
    circles.forEach(circleData => {
        const circleRect = circleData.element.getBoundingClientRect(); 
        const circleCenterX = circleRect.left + circleRect.width / 2;
        const circleCenterY = circleRect.top + circleRect.height / 2;
        const radius = circleRect.width / 2;

        if (circleData.parent) { 
            const parentRect = circleData.parent.getBoundingClientRect();
            const parentCenterX = parentRect.left + parentRect.width / 2;
            const parentCenterY = parentRect.top + parentRect.height / 2;
            const angleToParent = Math.atan2(circleCenterY - parentCenterY, circleCenterX - parentCenterX);

            const startX = circleCenterX - radius * Math.cos(angleToParent);
            const startY = circleCenterY - radius * Math.sin(angleToParent);
            const endX = parentCenterX + radius * Math.cos(angleToParent);
            const endY = parentCenterY + radius * Math.sin(angleToParent);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

// Control de formulario
circleForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const circleCount = parseInt(document.getElementById("circleCount").value);
    const smallCircleCount = parseInt(document.getElementById("smallCircleCount").value);

    removeSmallCircles(currentCircle); 

    // Crear nuevos pequeños círculos dentro del círculo padre
    createSmallCircles(smallCircleCount, currentCircle);
    
    // Crear círculos hijos alineados 50px debajo del círculo padre y centrados
    createChildCircles(circleCount, colors[getGeneration(currentCircle)]);
    formContainer.style.display = 'none'; 
    drawLines();
});

// Función para eliminar pequeños círculos existentes
function removeSmallCircles(parentCircle) {
    smallCircles.forEach(smallCircleData => {
        if (smallCircleData.parent === parentCircle) {
            smallCircleData.element.remove();
        }
    });

    smallCircles = smallCircles.filter(smallCircleData => smallCircleData.parent !== parentCircle);
}

document.getElementById('clearButton').addEventListener("click", function() {
    if (currentCircle) {
        const circleToDelete = currentCircle; 

        // Añadir la animación de salida
        circleToDelete.style.animation = 'fadeOut 0.5s forwards'; // Agregar clase de animación de salida
        setTimeout(() => {
            circles = circles.filter(circleData => circleData.element !== circleToDelete);

            circles.forEach(circleData => {
                if (circleData.parent === circleToDelete) {
                    circleData.parent = null;
                }
            });

            circleToDelete.remove();
            formContainer.style.display = 'none';
            drawLines();
            adjustBodyHeight();
        }, 500); // Esperar a que termine la animación antes de eliminar el círculo
    }
});

document.getElementById('closeButton').addEventListener('click', function() {
    formContainer.classList.remove('fadeIn');
    formContainer.classList.add('fadeOut');
    setTimeout(() => {
        formContainer.style.display = 'none'; 
    }, 500); // Espera que termine la animación antes de ocultar
});

formContainer.addEventListener('mousedown', (e) => {
    let offsetX = e.clientX - formContainer.getBoundingClientRect().left;
    let offsetY = e.clientY - formContainer.getBoundingClientRect().top;

    function onMouseMove(e) {
        formContainer.style.left = (e.clientX - offsetX) + 'px';
        formContainer.style.top = (e.clientY - offsetY) + 'px';
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function getGeneration(circle) {
    const circleData = circles.find(circleData => circleData.element === circle);
    return circleData ? circleData.generation + 1 : 0;
}

function createChildCircles(count, color) {
    const parentRect = currentCircle.getBoundingClientRect(); // Rectángulo del círculo padre
    const startY = parentRect.bottom + 50; // A 50px debajo del círculo padre

    // Determina el ancho total que ocuparán los círculos
    const totalCircleWidth = 50 * count + (count - 1) * 5; // 50px cada uno más 5px de margen entre círculos
    const startX = parentRect.left + (parentRect.width / 2) - (totalCircleWidth / 2); // Centra horizontalmente

    for (let i = 0; i < count; i++) {
        const additionalCircle = document.createElement("div");

        additionalCircle.classList.add("circle", color);
        additionalCircle.style.position = 'absolute';
        additionalCircle.style.width = '50px'; 
        additionalCircle.style.height = '50px';

        // Posiciona el nuevo círculo en fila centrada
        additionalCircle.style.left = (startX + i * 55) + 'px'; // 50px de ancho más 5px de margen
        additionalCircle.style.top = startY + 'px'; 

        document.body.appendChild(additionalCircle);

        // Añadir animación de entrada
        additionalCircle.style.animation = 'fadeIn 0.5s forwards'; // Fade in

        addCircleEvents(additionalCircle);
        circles.push({ element: additionalCircle, parent: currentCircle, generation: getGeneration(currentCircle) });

        createSmallCircles(0, additionalCircle);
    }
}

function createSmallCircles(count, parentCircle) {
    let smallCircleColor;
    const generation = getGeneration(parentCircle);
    
    switch (generation) {
        case 1: smallCircleColor = 'red'; break;
        case 2: smallCircleColor = 'blue'; break;
        case 3: smallCircleColor = 'green'; break;
        case 4: smallCircleColor = 'yellow'; break;
        case 5: smallCircleColor = 'gray'; break;
        case 6: smallCircleColor = 'orange'; break;
        case 7: smallCircleColor = 'pink'; break;
        case 8: smallCircleColor = 'brown'; break;
        case 9: smallCircleColor = 'white'; break;
        default: return;
    }

    const parentRect = parentCircle.getBoundingClientRect();
    const radius = 20;

    for (let i = 0; i < count; i++) {
        const smallCircle = document.createElement("div");
        smallCircle.classList.add("circle", smallCircleColor);
        smallCircle.style.width = '6px';
        smallCircle.style.height = '6px';
        smallCircle.style.borderRadius = '50%';
        smallCircle.style.position = 'absolute';
        smallCircle.style.border = 'none';

        const angle = (i / (count === 0 ? 1 : count)) * 2 * Math.PI; 
        smallCircle.style.left = Math.round(parentRect.width / 2 + (radius) * Math.cos(angle) - 5) + 'px'; 
        smallCircle.style.top = Math.round(parentRect.height / 2 + (radius) * Math.sin(angle) - 5) + 'px'; 

        parentCircle.appendChild(smallCircle);
        smallCircles.push({ element: smallCircle, parent: parentCircle, generation: generation + 1 });
    }
}

// Ajusta la altura del body después de crear pequeños círculos
function adjustBodyHeight() {
    let maxHeight = 0;

    circles.forEach(circleData => {
        const circleRect = circleData.element.getBoundingClientRect();
        maxHeight = Math.max(maxHeight, circleRect.bottom);
    });

    document.body.style.height = maxHeight + 'px';
}

// Dibuja líneas al cargar la página
drawLines();