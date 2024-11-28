<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>유령체증 시뮬레이션</title>
  <style>
    body {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f0f0f0;
    }
    canvas {
      background-color: #ffffff;
      border: 1px solid #ccc;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
    }
    button:active {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <canvas id="road" width="600" height="600"></canvas>
  <button id="ghostTrafficButton">유령체증</button>

  <script>
    const canvas = document.getElementById('road');
    const ctx = canvas.getContext('2d');
    const numCars = 15;
    const radius = 200; // 원형 도로 반지름
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseSpeed = 30 / 3600 * (radius * Math.PI * 2 / 60); // 약 30km/h -> 픽셀/프레임
    const cars = [];
    let ghostTrafficActivated = false;

    // 차량 초기화
    for (let i = 0; i < numCars; i++) {
      cars.push({
        angle: (i / numCars) * 2 * Math.PI,
        speed: baseSpeed,
        color: 'blue',
        isSlowing: false
      });
    }

    // 도로 및 차량 그리기
    function drawRoad() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 도로 그리기
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();

      // 차량 그리기
      cars.forEach(car => {
        const carX = centerX + radius * Math.cos(car.angle);
        const carY = centerY + radius * Math.sin(car.angle);
        ctx.beginPath();
        ctx.arc(carX, carY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = car.color;
        ctx.fill();
        ctx.closePath();
      });
    }

    // 차량 이동 업데이트
    function updateCars() {
      cars.forEach((car, i) => {
        // 차량 이동
        car.angle = (car.angle + car.speed / radius) % (2 * Math.PI);

        // 유령체증 활성화 시 특정 차량 속도 감소
        if (ghostTrafficActivated && i === 0 && !car.isSlowing) {
          car.speed *= 0.5;
          car.color = 'red';
          car.isSlowing = true;
        }

        // 뒤 차량의 속도 조정 (간격 유지)
        if (i > 0) {
          const prevCar = cars[i - 1];
          const distance = (prevCar.angle - car.angle + 2 * Math.PI) % (2 * Math.PI);
          const targetDistance = (2 * Math.PI) / numCars;

          if (distance < targetDistance) {
            car.speed = Math.max(car.speed - 0.05, baseSpeed * 0.3); // 속도 감소
            car.color = 'red';
          } else {
            car.speed = Math.min(car.speed + 0.02, baseSpeed); // 속도 복구
            car.color = 'blue';
          }
        }
      });
    }

    // 애니메이션 루프
    function animate() {
      updateCars();
      drawRoad();
      requestAnimationFrame(animate);
    }

    // 유령체증 버튼 클릭 핸들러
    document.getElementById('ghostTrafficButton').addEventListener('click', () => {
      ghostTrafficActivated = true;
    });

    // 애니메이션 시작
    drawRoad();
    animate();
  </script>
</body>
</html>
