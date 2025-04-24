const canvas1 = document.getElementById("polygon");
const ctx1 = canvas1.getContext("2d");

let alpha = 1;
let fadingOut = true;
let waiting = false;
let waitTimer = 0;
let currentPolygon = generatePolygonData();

function generatePolygonData() {
  const minSides = 3;
  const maxSides = 10;
  const sides =
    Math.floor(Math.random() * (maxSides - minSides + 1)) + minSides;
  const angleStep = (2 * Math.PI) / sides;
  const centerX = canvas1.width / 2;
  const centerY = canvas1.height / 2;
  const minRadius = 50;
  const maxRadius = 100;

  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep;
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
}

function drawPolygon(points) {
  ctx1.beginPath();
  points.forEach((p, i) => {
    if (i === 0) {
      ctx1.moveTo(p.x, p.y);
    } else {
      ctx1.lineTo(p.x, p.y);
    }
  });
  ctx1.closePath();
  ctx1.strokeStyle = "black";
  ctx1.stroke();
  ctx1.fillStyle = "rgba(100, 150, 255, 1)";
  ctx1.fill();
}

function animatePolygon() {
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx1.globalAlpha = alpha;

  drawPolygon(currentPolygon);

  if (!waiting) {
    if (fadingOut) {
      alpha -= 0.02;
      if (alpha <= 0) {
        alpha = 0;
        fadingOut = false;
        currentPolygon = generatePolygonData();
      }
    } else {
      alpha += 0.02;
      if (alpha >= 1) {
        alpha = 1;
        waiting = true;
        waitTimer = setTimeout(() => {
          waiting = false;
          fadingOut = true;
        }, 3000); // 1 секунда
      }
    }
  }

  requestAnimationFrame(animatePolygon);
}

animatePolygon();

// Отрисовка прямых
const canvas2 = document.getElementById("line");
const ctx2 = canvas2.getContext("2d");

const maxLines = 10;
const lines = [];

function createRandomLine(minLen = 150, maxLen = 300) {
  const x1 = Math.random() * canvas2.width;
  const y1 = Math.random() * canvas2.height;

  const length = Math.random() * (maxLen - minLen) + minLen;
  const angle = Math.random() * 2 * Math.PI;

  const x2 = x1 + length * Math.cos(angle);
  const y2 = y1 + length * Math.sin(angle);

  return {
    x1,
    y1,
    x2,
    y2,
    alpha: 0,
  };
}

function drawLines() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  lines.forEach((line) => {
    ctx2.beginPath();
    ctx2.moveTo(line.x1, line.y1);
    ctx2.lineTo(line.x2, line.y2);
    ctx2.strokeStyle = `rgba(0, 0, 0, ${line.alpha})`;
    ctx2.stroke();
  });
}

function animateLines() {
  requestAnimationFrame(animateLines);

  lines.forEach((line) => {
    if (line.alpha < 1) {
      line.alpha += 0.02;
    }
  });

  drawLines();
}

function addNewLine() {
  const newLine = createRandomLine();
  lines.push(newLine);

  if (lines.length > maxLines) {
    const oldLine = lines.shift();
    fadeOutLine(oldLine);
  }
}

function fadeOutLine(line) {
  const fadeInterval = setInterval(() => {
    line.alpha -= 0.02;
    if (line.alpha <= 0) {
      clearInterval(fadeInterval);
    }
  }, 16);
}

animateLines();

setInterval(() => {
  addNewLine();
}, 500);

// отрисовка углов
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const lifespan = 5000;
const length = 100;
const blueFigures = [];
const greenAngles = [];

function drawLine(x1, y1, x2, y2, color = "blue", opacity = 1) {
  ctx.strokeStyle = `rgba(${
    color === "blue" ? "0,0,255" : "0,128,0"
  },${opacity})`;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// function drawCross(centerX, centerY, angle1, angle2, length, opacity = 1) {
//   const dx1 = (Math.cos(angle1) * length) / 2;
//   const dy1 = (Math.sin(angle1) * length) / 2;
//   const x1 = centerX - dx1;
//   const y1 = centerY - dy1;
//   const x2 = centerX + dx1;
//   const y2 = centerY + dy1;
//   drawLine(x1, y1, x2, y2, "blue", opacity);

//   const dx2 = (Math.cos(angle2) * length) / 2;
//   const dy2 = (Math.sin(angle2) * length) / 2;
//   const x3 = centerX - dx2;
//   const y3 = centerY - dy2;
//   const x4 = centerX + dx2;
//   const y4 = centerY + dy2;
//   drawLine(x3, y3, x4, y4, "blue", opacity);
// }

function drawAngle(x, y, angleDeg, length = 80, opacity = 1) {
  const angleRad = (angleDeg * Math.PI) / 180;
  const color = "green";

  drawLine(
    x,
    y,
    x + Math.cos(0) * length,
    y + Math.sin(0) * length,
    color,
    opacity
  );
  drawLine(
    x,
    y,
    x + Math.cos(angleRad) * length,
    y + Math.sin(angleRad) * length,
    color,
    opacity
  );

  ctx.beginPath();
  ctx.arc(x, y, 20, 0, angleRad, false);
  ctx.strokeStyle = `rgba(0,128,0,${opacity})`;
  ctx.stroke();

  ctx.fillStyle = `rgba(0,128,0,${opacity})`;
  ctx.font = "14px Arial";
  const midAngle = angleRad / 2;
  const tx = x + Math.cos(midAngle) * 25;
  const ty = y + Math.sin(midAngle) * 25;
  ctx.fillText(`${angleDeg}°`, tx, ty);
}

function isFarEnough(x, y, minDistance = 100) {
  const allCenters = [...blueFigures, ...greenAngles];
  return allCenters.every((obj) => {
    const dx = x - obj.x;
    const dy = y - obj.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance > minDistance;
  });
}

function getSafeCoordinates(minDistance = 100, maxTries = 100) {
  for (let i = 0; i < maxTries; i++) {
    const x = Math.random() * (canvas.width - 200) + 100;
    const y = Math.random() * (canvas.height - 200) + 100;
    if (isFarEnough(x, y, minDistance)) {
      return { x, y };
    }
  }
  return null;
}

function spawn() {
  if (blueFigures.length === 0 && greenAngles.length === 0) {
    // const blueCoords = getSafeCoordinates(120);
    // if (blueCoords) {
    //   const angle1 = Math.random() * Math.PI;
    //   let angle2 = Math.random() * Math.PI;
    //   while (Math.abs(angle2 - angle1) < Math.PI / 6) {
    //     angle2 = Math.random() * Math.PI;
    //   }
    //   blueFigures.push({
    //     x: blueCoords.x,
    //     y: blueCoords.y,
    //     angle1,
    //     angle2,
    //     createdAt: Date.now(),
    //   });
    // }

    const greenCoords = getSafeCoordinates(120);
    if (greenCoords) {
      const angleDeg = Math.floor(Math.random() * 140 + 20);
      greenAngles.push({
        x: greenCoords.x,
        y: greenCoords.y,
        angleDeg,
        createdAt: Date.now(),
      });
    }
  }
}
//
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".smezhnyy-ugol__wrap").addEventListener("click", () => {
    console.log("click");
    document.querySelector(".smezhnyy-ugol__text").classList.add("visible");
  });

  document.querySelector(".vertikalnye-ugly__wrap").addEventListener("click", () => {
    document.querySelector(".vertikalnye-ugly__text").style.display = "block";
  });
});

console.log(document.querySelector(".smezhnyy-ugol__wrap"));
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();

  // for (let i = blueFigures.length - 1; i >= 0; i--) {
  //   const fig = blueFigures[i];
  //   const age = now - fig.createdAt;
  //   const opacity = age < 1000 ? age / 1000 : 1 - (age - 4000) / 1000;
  //   if (age > lifespan) {
  //     blueFigures.splice(i, 1);
  //   } else {
  //     // drawCross(fig.x, fig.y, fig.angle1, fig.angle2, length, opacity);
  //   }
  // }

  for (let i = greenAngles.length - 1; i >= 0; i--) {
    const angle = greenAngles[i];
    const age = now - angle.createdAt;
    const opacity = age < 1000 ? age / 1000 : 1 - (age - 4000) / 1000;
    if (age > lifespan) {
      greenAngles.splice(i, 1);
    } else {
      drawAngle(angle.x, angle.y, angle.angleDeg, 80, opacity);
    }
  }

  requestAnimationFrame(animate);
}

setInterval(spawn, 500);
animate();

// const angleIcons = document.querySelectorAll(".angleIcon__wrap");

const angleIcons = document.querySelectorAll(".angleIcon__wrap");

angleIcons.forEach((el, index) => {
  el.addEventListener("click", () => {
    // Сначала сбрасываем все элементы к обычному состоянию
    angleIcons.forEach((item) => {
      item.style.scale = 1;
      item.style.backgroundColor = "transparent";
      item.style.margin = "0 20px";
    });

    // Если есть следующий элемент
    if (index < angleIcons.length - 1) {
      const nextEl = angleIcons[index + 1];

      // Следующий элемент становится активным
      nextEl.style.scale = 1.5;
      nextEl.style.backgroundColor = "#06fa0e";
      nextEl.style.margin = "0 50px";
    }
  });
});
