function createLine(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "gray");
  line.setAttribute("stroke-width", "2");
  return line;
}

const container = document.getElementById("container");
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "100%");
svg.setAttribute("height", "100%");
container.appendChild(svg);

let startCircle = null;
let line = null;

function connectCircles(circle) {
  if (!startCircle) {
    startCircle = circle;
  } else {
    const startCoords = startCircle.getBoundingClientRect();
    const endCoords = circle.getBoundingClientRect();

    const startX = startCoords.left + startCoords.width / 2;
    const startY = startCoords.top + startCoords.height / 2;
    const endX = endCoords.left + endCoords.width / 2;
    const endY = endCoords.top + endCoords.height / 2;

    line = createLine(startX, startY, endX, endY);
    svg.appendChild(line);

    // Remover a conexão ao clicar em qualquer lugar fora do círculo
    document.addEventListener("click", function(e) {
      if (!circle.contains(e.target)) {
        startCircle = null;
        svg.removeChild(line);
      }
    });
  }
}

const circles = document.querySelectorAll(".circle");
circles.forEach((circle) => {
  circle.addEventListener("click", () => {
    connectCircles(circle);
  });
});