const mainCircle = document.getElementById("mainCircle"); 
const formContainer = document.getElementById("formContainer"); 
const circleForm = document.getElementById("circleForm"); 
const canvas = document.getElementById("canvas"); 
const ctx = canvas.getContext("2d"); 
const imageContainerTop = document.getElementById("imageContainerTop"); 
const dataModal = document.getElementById("dataModal"); 
const dataCloseButton = document.getElementById("dataCloseButton"); 
const viewDataButton = document.getElementById("viewDataButton"); 

let currentCircle = null; 
let offsetX, offsetY; 
let circles = []; 
let smallCircles = []; 
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight; 

function positionMainCircle() {
    const imageContainerRect = imageContainerTop.getBoundingClientRect(); 
    mainCircle.style.left = (window.innerWidth / 2 - 40) + 'px'; 
    mainCircle.style.top = (imageContainerRect.bottom + 5) + 'px'; 
    imageContainerTop.style.left = (window.innerWidth / 2 - (imageContainerTop.offsetWidth / 2)) + 'px';
}

positionMainCircle(); 
addCircleEvents(mainCircle);
circles.push({ element: mainCircle, parent: null, generation: 0, topContainer: imageContainerTop }); 
const colors = ['white', 'red', 'blue', 'green', 'yellow', 'gray', 'orange', 'pink', 'brown']; 

function onCircleClick(circle, e) {
    currentCircle = circle; 
    formContainer.style.display = 'block'; 
    const rect = currentCircle.getBoundingClientRect();
    formContainer.style.top = '10px'; 
    formContainer.style.left = (window.innerWidth - formContainer.offsetWidth - 10) + 'px'; 
}

function onRightClick(circle, e) {
    e.preventDefault(); 
    currentCircle = circle; 
    currentCircle.style.transition = 'none'; 
    offsetX = e.clientX - currentCircle.getBoundingClientRect().left;
    offsetY = e.clientY - currentCircle.getBoundingClientRect().top;

    function onMouseMove(e) {
        currentCircle.style.left = (e.clientX - offsetX) + 'px'; 
        currentCircle.style.top = (e.clientY - offsetY) + 'px'; 
        const currentTopContainer = circles.find(circleData => circleData.element === currentCircle).topContainer; 
        currentTopContainer.style.left = (e.clientX - offsetX + (currentCircle.offsetWidth / 2) - (currentTopContainer.offsetWidth / 2)) + 'px';
        currentTopContainer.style.top = (parseFloat(currentCircle.style.top) + currentCircle.offsetHeight + 5) + 'px'; 
        drawLines(); 
        adjustBodyHeight(); 
    }

    function onMouseUp() {
        currentCircle.style.transition = ''; 
        document.removeEventListener("mousemove", onMouseMove); 
        document.removeEventListener("mouseup", onMouseUp); 
    }
    document.addEventListener("mousemove", onMouseMove); 
    document.addEventListener("mouseup", onMouseUp); 
}

function addCircleEvents(circle) {
    circle.addEventListener("click", (e) => {
        onCircleClick(circle, e);
    });
    circle.addEventListener("mousedown", (e) => {
        if (e.button === 2) { 
            onRightClick(circle, e);
        }
    });
}

function showTotalData() {
    const totalData = {
        totalGroups: circles.length, 
        totalPersons: 0,
        totalBelievers: 0,
        totalBaptized: 0,
        totalNewBaptized: 0,
    };

    circles.forEach(circleData => {
        const topContainer = circleData.topContainer; 
        totalData.totalPersons += parseInt(topContainer.querySelector("#personCountDisplay").innerText) || 0; 
        totalData.totalBelievers += parseInt(topContainer.querySelector("#believerCountDisplay").innerText) || 0; 
        totalData.totalBaptized += parseInt(topContainer.querySelector("#baptizedCountDisplay").innerText) || 0; 
        totalData.totalNewBaptized += parseInt(topContainer.querySelector("#newlyBaptizedCountDisplay").innerText) || 0; 
    });

    const dataHTML = `
        <p><strong>Total Cantidad de Grupos:</strong> ${totalData.totalGroups}</p>
        <p><strong>Cantidad de Personas:</strong> ${totalData.totalPersons}</p>
        <p><strong>Cantidad de Creyentes:</strong> ${totalData.totalBelievers}</p>
        <p><strong>Cantidad de Bautizados:</strong> ${totalData.totalBaptized}</p>
        <p><strong>Cantidad de Nuevos Bautizados:</strong> ${totalData.totalNewBaptized}</p>
    `;
    document.getElementById('dataDisplay').innerHTML = dataHTML;
    dataModal.style.display = 'block'; 
}

viewDataButton.addEventListener('click', showTotalData);

dataCloseButton.addEventListener('click', function() {
    dataModal.style.display = 'none'; 
});

function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
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
            ctx.strokeStyle = '#96d1f8cc'; 
            ctx.lineWidth = 2; 
            ctx.stroke(); 
        }
    });
}

circleForm.addEventListener("submit", function(e) {
    e.preventDefault(); 
    const personCountValue = document.getElementById("personCount").value;
    const believerCountValue = document.getElementById("believerCount").value;
    const baptizedCountValue = document.getElementById("baptizedCount").value;
    const newlyBaptizedCountValue = document.getElementById("newlyBaptizedCount").value;
    const churchNameValue = document.getElementById("churchName").value;
    const leaderNameValue = document.getElementById("leaderName").value;
    const startDateValue = document.getElementById("startDate").value;
    const placeValue = document.getElementById("place").value;

    const currentTopContainer = circles.find(circleData => circleData.element === currentCircle).topContainer; 
    currentTopContainer.querySelector("#personCountDisplay").innerText = personCountValue;
    currentTopContainer.querySelector("#believerCountDisplay").innerText = believerCountValue;
    currentTopContainer.querySelector("#baptizedCountDisplay").innerText = baptizedCountValue;
    currentTopContainer.querySelector("#newlyBaptizedCountDisplay").innerText = newlyBaptizedCountValue;

    const circleInfo = document.createElement("div");
    circleInfo.classList.add("circle-info");
    circleInfo.innerHTML = `
       <div class="circle-info-label">${churchNameValue}</div>
       <div class="circle-info-label">${leaderNameValue}</div>
       <div class="circle-info-label">${startDateValue}</div>
       <div class="circle-info-label">${placeValue}</div>
    `;
    currentTopContainer.appendChild(circleInfo); 

    const circleCount = parseInt(document.getElementById("circleCount").value); 
    const toggleValues = Array.from({ length: 12 }, (_, index) => 
        document.getElementById(`toggle${index + 3}`).checked 
    );

    const tipoDeIglecia = document.getElementById("tipoDeIglecia").value; 
    const iglesiaComunToggle = document.getElementById("toggle15"); 

    if (tipoDeIglecia === "nuevos_creyentes") {
        currentCircle.style.borderRadius = "50%"; 
        currentCircle.style.border = "2px solid #3498db"; 
    } else if (tipoDeIglecia === "creyentes_antiguos") {
        currentCircle.style.borderRadius = "0"; 
        currentCircle.style.border = "2px solid #3498db"; 
    } else if (tipoDeIglecia === "tradicional") {
        currentCircle.style.borderRadius = "0"; 
        currentCircle.style.border = "2px solid red"; 
    }
    
    if (iglesiaComunToggle.checked && tipoDeIglecia === "tradicional") {
        currentCircle.style.border = "2px dashed red"; 
    } else if (iglesiaComunToggle.checked) {
        currentCircle.style.border = "2px dashed #3498db"; 
    }

    console.log(toggleValues); 
    removeSmallCircles(currentCircle); 
    createChildCircles(circleCount, currentCircle.classList[1]); 
    const imageGrid = currentCircle.querySelector('.image-grid'); 
    const checkboxes = document.querySelectorAll('.toggle input[type="checkbox"]'); 
    const images = imageGrid.querySelectorAll('img'); 
    images.forEach((img, index) => {
        if (checkboxes[index + 2] && !checkboxes[index + 2].checked) { 
            img.classList.add('inactive'); 
        } else {
            img.classList.remove('inactive'); 
        }
    });
    formContainer.style.display = 'none'; 
    drawLines(); 
    adjustBodyHeight(); 
});

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
        circleToDelete.style.animation = 'fadeOut 0.5s forwards'; 
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
        }, 500); 
    }
});

// Cambié el evento de cerrar para que reabra el formulario si se cierra
document.getElementById('closeButton').addEventListener('click', function() {
    formContainer.style.display = 'none'; 
});

formContainer.addEventListener('mousedown', (e) => {
    e.stopPropagation(); 
});

function getGeneration(circle) {
    const circleData = circles.find(circleData => circleData.element === circle); 
    return circleData ? circleData.generation + 1 : 0; 
}

function createChildCircles(count, color) {
    const parentRect = currentCircle.getBoundingClientRect(); 
    const startY = parentRect.bottom + 100; 
    const totalCircleWidth = 80 * count + (count - 1) * 30; 
    const startX = parentRect.left + (parentRect.width / 2) - (totalCircleWidth / 2); 

    for (let i = 0; i < count; i++) {
        const additionalCircle = document.createElement("div"); 
        additionalCircle.classList.add("circle", color); 
        additionalCircle.style.position = 'absolute'; 
        additionalCircle.style.width = '80px'; 
        additionalCircle.style.height = '80px'; 
        additionalCircle.style.left = (startX + i * (80 + 30)) + 'px'; 
        additionalCircle.style.top = startY + 'px'; 

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");
        const imageGrid = document.createElement("div"); 
        imageGrid.classList.add("image-grid");

        for (let j = 1; j <= 12; j++) {
            const img = document.createElement("img");
            img.src = `img/foto${j}.png`;
            img.alt = `Foto ${j + 2}`;
            img.width = 20;
            img.height = 20;
            img.classList.add('inactive'); 
            imageGrid.appendChild(img); 
        }

        imageContainer.appendChild(imageGrid);
        additionalCircle.appendChild(imageContainer);
        const newImageContainerTop = document.createElement("div");
        newImageContainerTop.classList.add("image-container-top");
        newImageContainerTop.id = `imageContainerTop${i}`; 
        newImageContainerTop.style.position = 'absolute';
        newImageContainerTop.style.left = ((startX + i * (80 + 30) + (80 / 2) - (newImageContainerTop.offsetWidth / 2)) -42) + 'px'; 
        newImageContainerTop.style.top = (startY - 39) + 'px';
        newImageContainerTop.innerHTML = `
            <div class="image-item">
                <img src="img/foto13.png" alt="Foto 13" width="20" height="20">
                <div class="value-display" id="personCountDisplay">0</div>
            </div>
            <div class="image-item">
                <img src="img/foto14.png" alt="Foto 14" width="20" height="20">
                <div class="value-display" id="believerCountDisplay">0</div>
            </div>
            <div class="image-item">
                <img src="img/foto15.png" alt="Foto 15" width="20" height="20">
                <div class="value-display" id="baptizedCountDisplay">0</div>
            </div>
            <div class="image-item">
                <img src="img/foto16.png" alt="Foto 16" width="20" height="20">
                <div class="value-display" id="newlyBaptizedCountDisplay">0</div>
            </div>
        `;
        
        document.body.appendChild(newImageContainerTop); 
        circles.push({ 
            element: additionalCircle, 
            parent: currentCircle, 
            generation: getGeneration(currentCircle), 
            topContainer: newImageContainerTop 
        });
        document.body.appendChild(additionalCircle); 
        additionalCircle.style.animation = 'fadeIn 0.5s forwards'; 
        addCircleEvents(additionalCircle); 
        createSmallCircles(0, additionalCircle); 
    }
}

function createSmallCircles(count, parentCircle) {
    let smallCircleColor; 
    const generation = getGeneration(parentCircle); 
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

function adjustBodyHeight() {
    let maxHeight = 0; 
    circles.forEach(circleData => {
        const circleRect = circleData.element.getBoundingClientRect(); 
        maxHeight = Math.max(maxHeight, circleRect.bottom); 
    });
    document.body.style.height = (maxHeight + 500) + 'px'; 
    const documentWidth = Math.max(...circles.map(circleData => circleData.element.getBoundingClientRect().right)); 
    document.body.style.width = documentWidth + 'px'; 
}

drawLines();