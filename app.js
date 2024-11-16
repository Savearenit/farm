// Инициализация сцены
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("farmCanvas") });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Свет
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Поле фермы
const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, wireframe: true });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Клетки фермы
const grid = [];
for (let x = -5; x < 5; x++) {
  for (let z = -5; z < 5; z++) {
    const cellGeometry = new THREE.BoxGeometry(0.9, 0.1, 0.9);
    const cellMaterial = new THREE.MeshBasicMaterial({ color: 0x32CD32 });
    const cell = new THREE.Mesh(cellGeometry, cellMaterial);
    cell.position.set(x, 0, z);
    scene.add(cell);
    grid.push(cell);

    // Логика взаимодействия
    cell.userData.isPlanted = false;
    cell.onClick = () => {
      if (!cell.userData.isPlanted) {
        cell.material.color.set(0x8B4513);
        cell.userData.isPlanted = true;
      } else {
        cell.material.color.set(0x32CD32);
        cell.userData.isPlanted = false;
      }
    };
  }
}

// Обработчик кликов
window.addEventListener("click", (event) => {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(grid);
  if (intersects.length > 0) {
    intersects[0].object.onClick();
  }
});

// Камера
camera.position.y = 10;
camera.position.z = 10;
camera.lookAt(0, 0, 0);

// Анимация
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();