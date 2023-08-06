let count=0;

function addRectangle() {
    const container = document.getElementById('container');
  
    const elementContainer = document.createElement('div');
    elementContainer.className = `container${count} main`;

    elementContainer.style.width = '100px';
    elementContainer.style.height = '100px';
  
    const rectangle = createRectangle();
    const topCircle = createCircle('top');
    const rightCircle = createCircle('right');
    const bottomCircle = createCircle('bottom');
    const leftCircle = createCircle('left');
    
    count++;

    positionCircle(elementContainer, topCircle, '50%', '0');
    positionCircle(elementContainer, rightCircle, '100%', '50%');
    positionCircle(elementContainer, bottomCircle, '50%', '100%');
    positionCircle(elementContainer, leftCircle, '0', '50%');
  
    elementContainer.appendChild(rectangle);
    elementContainer.appendChild(topCircle);
    elementContainer.appendChild(rightCircle);
    elementContainer.appendChild(bottomCircle);
    elementContainer.appendChild(leftCircle);
  
    elementContainer.addEventListener('mousedown', startDrag);
  
    container.appendChild(elementContainer);
  }
  
  function createRectangle() {
    const rectangle = document.createElement('div');
    rectangle.className = `container${count} rectangle`;
    rectangle.style.width = '100px';
    rectangle.style.height = '100px';
    return rectangle;
  }
  
  function createCircle(position) {
    const circle = document.createElement('div');
    circle.style.width = '10px';
    circle.style.height = '10px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = 'gray';
    circle.style.position = 'absolute';
    circle.className = (`container${count} circle ${position}`)
    return circle;
  }
  
  function positionCircle(rectangle, circle, x, y) {
    const rectCoords = rectangle.getBoundingClientRect();
    const rectX = rectCoords.left;
    const rectY = rectCoords.top;
    const rectWidth = rectCoords.width;
    const rectHeight = rectCoords.height;
  
    let circleX = x;
    let circleY = y;
    
    if (x == '50%') {
      circleX = rectX + rectWidth / 2;
    } else if (x == '100%') {
      circleX = rectX + rectWidth;
    }
  
    if (y == '50%') {
      circleY = rectY + rectHeight / 2;
    } else if (y == '100%') {
      circleY = rectY + rectHeight;
    }
  
    circle.style.left = circleX + 'px';
    circle.style.top = circleY + 'px';
    circle.style.transform = 'translate(-50%, -50%)';
  }

  function findClassByString(element, searchString) {
    if (!element || typeof element.classList !== 'object') {
      return '';
    }
  
    const classes = Array.from(element.classList);
    const foundClass = classes.find((className) =>
      className.includes(searchString)
    );
  
    return foundClass || '';
  }

  function startDrag(e) {
    const elementContainer = e.target;
    const container = document.getElementById('container');
    const id = findClassByString(elementContainer,'container');
    const elementCoords = elementContainer.getBoundingClientRect();
    const offsetX = e.clientX - elementCoords.left;
    const offsetY = e.clientY - elementCoords.top;
    
    topCircle = document.querySelector(`.${id}.top`);
    rightCircle = document.querySelector(`.${id} .right`);
    bottomCircle = document.querySelector(`.${id} .bottom`);
    leftCircle = document.querySelector(`.${id} .left`);
    
    document.onmousemove = function (e) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
  
      elementContainer.style.left = Math.min(Math.max(0, x), containerWidth - elementCoords.width) + 'px';
      elementContainer.style.top = Math.min(Math.max(0, y), containerHeight - elementCoords.height) + 'px';
  
      const circleCoords = elementContainer.getBoundingClientRect();
      const circleX = circleCoords.left + circleCoords.width / 2;
      const circleY = circleCoords.top + circleCoords.height / 2;

      updateCirclePosition(topCircle, circleX, circleCoords.top);
      updateCirclePosition(rightCircle, circleCoords.right, circleY);
      updateCirclePosition(bottomCircle, circleX, circleCoords.bottom);
      updateCirclePosition(leftCircle, circleCoords.left, circleY);
    };
  
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
  
  function updateCirclePosition(circle, x, y) {
    circle.style.left = x + 'px'; 
    circle.style.top = y + 'px';
  }
