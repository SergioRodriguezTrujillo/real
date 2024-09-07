
const mainCircle = document.getElementById("mainCircle");
const formContainer = document.getElementById("formContainer");
const circleForm = document.getElementById("circleForm");
const deleteCircleButton = document.getElementById("deleteCircle");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let currentCircle = null;
let offsetX, offsetY;
let circles = []; // Array para mantener el registro de círculos

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Position the main circle in the center of the page
function positionMainCircle() {
    mainCircle.style.left = (window.innerWidth / 2 - 25) + 'px'; // Centrado horizontalmente
    mainCircle.style.top = (window.innerHeight / 2 - 25) + 'px'; // Centrado verticalmente
}

positionMainCircle(); // Llama a la función al cargar la página

// Añade eventos a los círculos iniciales
addCircleEvents(mainCircle);
circles.push({ element: mainCircle, parent: null });

function onMouseDown(circle, e) {
    currentCircle = circle; // Establece el círculo actual
    currentCircle.style.transition = 'none'; // Desactiva la transición durante el arrastre
    offsetX = e.clientX - currentCircle.getBoundingClientRect().left;
    offsetY = e.clientY - currentCircle.getBoundingClientRect().top;

    function onMouseMove(e) {
        currentCircle.style.left = (e.clientX - offsetX) + 'px';
        currentCircle.style.top = (e.clientY - offsetY) + 'px';

        // Actualiza el canvas con las líneas
        drawLines();

        // Mueve el formulario junto con el círculo
        const rect = currentCircle.getBoundingClientRect();
        formContainer.style.top = rect.top + 'px';
        formContainer.style.left = (rect.right + 10) + 'px'; // Coloca el formulario a la derecha del círculo
    }

    function onMouseUp() {
        currentCircle.style.transition = ''; // Reactiva la transición
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
        const radius = circleRect.width / 2; // Radio del círculo

        if (circleData.parent) { // Si tiene padre, dibuja la línea
            const parentRect = circleData.parent.getBoundingClientRect();
            const parentCenterX = parentRect.left + parentRect.width / 2;
            const parentCenterY = parentRect.top + parentRect.height / 2;
            const angleToParent = Math.atan2(circleCenterY - parentCenterY, circleCenterX - parentCenterX); // Ángulo hacia el padre

            // Calcula los puntos en el borde del círculo
            const startX = circleCenterX - radius * Math.cos(angleToParent);
            const startY = circleCenterY - radius * Math.sin(angleToParent);
            const endX = parentCenterX + radius * Math.cos(angleToParent);
            const endY = parentCenterY + radius * Math.sin(angleToParent);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = '#3498db';  // Color de la línea
            ctx.lineWidth = 2;             // Grosor de la línea
            ctx.stroke();
        }
    });
}

circleForm.addEventListener("submit", function(e) {
    e.preventDefault(); // Evita el envío del formulario

    const circleName = document.getElementById("circleName").value;
    const circleCount = parseInt(document.getElementById("circleCount").value);

    // Actualiza el nombre del círculo actual
    currentCircle.textContent = circleName;

    // Crea círculos adicionales en posiciones alrededor del círculo actual
    for (let i = 0; i < circleCount; i++) {
        const additionalCircle = document.createElement("div");
        additionalCircle.classList.add("circle");
        additionalCircle.textContent = "Persona " + (i + 1);

        // Posiciona el nuevo círculo alrededor del círculo actual
        const angle = (i / circleCount) * 2 * Math.PI; // Distribuye en un círculo
        const radius = 80; // Radio para la distribución de círculos
        additionalCircle.style.position = 'absolute';
        additionalCircle.style.left = Math.round(parseInt(currentCircle.style.left) + radius * Math.cos(angle)) + 'px';
        additionalCircle.style.top = Math.round(parseInt(currentCircle.style.top) + radius * Math.sin(angle)) + 'px';

        document.body.appendChild(additionalCircle);
        
        // Añade eventos a los círculos adicionales
        addCircleEvents(additionalCircle);
        
        // Registra el círculo y su padre
        circles.push({ element: additionalCircle, parent: currentCircle });
    }

    // Ajusta la altura del body según la posición más baja de los círculos
    adjustBodyHeight();

    drawLines(); // Dibuja las líneas después de agregar círculos
    formContainer.style.display = 'none'; // Oculta el formulario después de aceptar
});

function adjustBodyHeight() {
    let maxHeight = 0; // Variable para almacenar la altura máxima encontrada

    // Calcula la altura máxima entre todos los círculos
    circles.forEach(circleData => {
        const circleRect = circleData.element.getBoundingClientRect();
        maxHeight = Math.max(maxHeight, circleRect.bottom); // Almacena la posición más baja
    });

    // Ajusta la altura del body
    document.body.style.height = maxHeight + 'px';
}

deleteCircleButton.addEventListener("click", function() {
    if (currentCircle) {
        const circleToDelete = currentCircle; // Círculo que se va a eliminar
        circles = circles.filter(circleData => circleData.element !== circleToDelete); // Elimina el círculo de la lista

        // Elimina todas las líneas conectadas a este círculo
        circles.forEach(circleData => {
            if (circleData.parent === circleToDelete) {
                circleData.parent = null; // Eliminar la conexión con el padre
            }
        });

        circleToDelete.remove(); // Elimina el círculo del DOM
        formContainer.style.display = 'none'; // Oculta el formulario
        drawLines(); // Redibuja las líneas después de eliminar el círculo

        // Ajusta la altura del body después de eliminar un círculo
        adjustBodyHeight();
    }
});

// Llama a la función para centrar el círculo principal cuando se carga la página
positionMainCircle();