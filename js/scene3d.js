/**
 * SCENE3D.JS - Toàn bộ mã nguồn Three.js r128 & GSAP
 * Dựng môi trường 3D, thẻ bài 3D chất lượng cao, xoay tròn theo vòng quay và lật thẻ trúng thưởng
 */

const STATE_IDLE = 'idle';
const STATE_SPINNING = 'spinning';
const STATE_REVEALED = 'revealed';

const Scene3D = {
  canvas: null,
  scene: null,
  camera: null,
  renderer: null,
  carouselGroup: null,
  cardMeshes: [],
  floatingElements: [],
  pedestalDisc: null,
  raycaster: null,
  mouse: null,
  hoveredCard: null,

  currentState: STATE_IDLE,
  CAROUSEL_RADIUS: 5.6,
  CARD_WIDTH: 2.3,
  CARD_HEIGHT: 3.3,
  CARD_DEPTH: 0.06,

  activeCardIndex: 0,
  revealedCardMesh: null,
  spinTween: null,
  spinTickInterval: null,
  autoStopTimer: null,
  countdownInterval: null,
  sharedBackTexture: null,
  clock: null,

  // Callbacks để thông báo về UI
  onStateChange: null,
  onCountdownTick: null,

  init(canvasElement) {
    this.canvas = canvasElement || document.getElementById('three-canvas');
    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfef9c3);
    this.scene.fog = new THREE.FogExp2(0xfef9c3, 0.015);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0.45, 12.2);
    this.camera.lookAt(0, 0.2, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Tone Mapping cân bằng - Tránh lóa sáng trên nền vàng pastel
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.96;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);

    // Ánh sáng dịu ấm, giữ trọn độ nét của màu sắc
    const ambientLight = new THREE.AmbientLight(0xfffaed, 1.15);
    this.scene.add(ambientLight);

    const sunLight1 = new THREE.DirectionalLight(0xfff7ed, 0.65);
    sunLight1.position.set(4, 7, 8);
    this.scene.add(sunLight1);

    this.createFloatingCuteStickers();
    this.createCutePedestal();

    this.carouselGroup = new THREE.Group();
    this.carouselGroup.position.set(0, 0.2, 0);
    this.scene.add(this.carouselGroup);

    this.bindEvents();
  },

  createFloatingCuteStickers() {
    const stickersList = ['🌸', '🌻', '🌼', '🌈', '☁️', '⭐', '🎈', '🍭', '🦋', '🎨', '💖'];

    const stickerTextures = stickersList.map(emoji => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      ctx.font = '80px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 64, 68);
      return new THREE.CanvasTexture(c);
    });

    for (let i = 0; i < 60; i++) {
      const mat = new THREE.SpriteMaterial({
        map: stickerTextures[i % stickerTextures.length],
        transparent: true,
        opacity: 0.85
      });
      const sprite = new THREE.Sprite(mat);

      const angle = Math.random() * Math.PI * 2;
      const dist = 7.0 + Math.random() * 8.0;
      sprite.position.x = Math.cos(angle) * dist;
      sprite.position.y = (Math.random() - 0.5) * 12.0;
      sprite.position.z = (Math.random() - 0.5) * 14.0 - 2;

      const size = 0.6 + Math.random() * 0.7;
      sprite.scale.set(size, size, 1);

      sprite.userData = {
        baseY: sprite.position.y,
        speed: 0.8 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2
      };

      this.scene.add(sprite);
      this.floatingElements.push(sprite);
    }
  },

  createCutePedestal() {
    const pedestal = new THREE.Group();
    pedestal.position.set(0, -1.75, 0);
    pedestal.rotation.x = Math.PI / 2;

    const ringGeo1 = new THREE.RingGeometry(this.CAROUSEL_RADIUS - 0.25, this.CAROUSEL_RADIUS + 0.15, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    pedestal.add(new THREE.Mesh(ringGeo1, ringMat1));

    const ringGeo2 = new THREE.RingGeometry(1.6, 2.2, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    this.pedestalDisc = new THREE.Mesh(ringGeo2, ringMat2);
    pedestal.add(this.pedestalDisc);

    this.scene.add(pedestal);
  },

  generateBackFaceTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 700;
    const ctx = c.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 512, 700);
    bgGrad.addColorStop(0, '#fef08a');
    bgGrad.addColorStop(0.5, '#fde047');
    bgGrad.addColorStop(1, '#fef08a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 700);

    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    for (let x = 40; x < 512; x += 55) {
      for (let y = 40; y < 700; y += 55) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 14;
    ctx.strokeRect(18, 18, 476, 664);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 452, 640);

    const backSvgImg = getSvgImage('magicBack');
    const drawCenterCrest = () => {
      ctx.drawImage(backSvgImg, 146, 225, 220, 220);
    };

    if (backSvgImg.complete) {
      drawCenterCrest();
    } else {
      backSvgImg.onload = () => {
        drawCenterCrest();
        texture.needsUpdate = true;
      };
    }

    ctx.font = '900 28px "Quicksand", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#78350f';
    ctx.fillText('🌸 BÉ NGOAN LỚP 1B1 🌸', 256, 125);

    ctx.font = '800 20px "Quicksand", sans-serif';
    ctx.fillStyle = '#9a3412';
    ctx.fillText('✦ CÔ HOÀI THANH KHEN TẶNG ✦', 256, 560);

    const texture = new THREE.CanvasTexture(c);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  },

  generateFrontFaceTexture(card) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 700;
    const ctx = c.getContext('2d');

    let themeColor = '#d97706';
    let rarityText = '★ BÉ NGOAN ★';
    let subColor = '#c2410c';

    if (card.rarity === 'SSR') {
      themeColor = '#d97706';
      rarityText = '★ ĐẶC QUYỀN VÀNG KIM ★';
      subColor = '#b45309';
    } else if (card.rarity === 'SR') {
      themeColor = '#7e22ce';
      rarityText = '★ ĐẶC QUYỀN TÍM PASTEL ★';
      subColor = '#6b21a8';
    } else if (card.rarity === 'PINK') {
      themeColor = '#be185d';
      rarityText = '★ ĐẶC QUYỀN HỒNG DÂU ★';
      subColor = '#9d174d';
    } else if (card.rarity === 'ORANGE') {
      themeColor = '#c2410c';
      rarityText = '★ ĐẶC QUYỀN CAM TƯƠI ★';
      subColor = '#9a3412';
    } else if (card.rarity === 'GREEN') {
      themeColor = '#15803d';
      rarityText = '★ ĐẶC QUYỀN XANH LÁ ★';
      subColor = '#166534';
    } else {
      themeColor = '#1d4ed8';
      rarityText = '★ ĐẶC QUYỀN XANH TRỜI ★';
      subColor = '#1e40af';
    }

    const texture = new THREE.CanvasTexture(c);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    function drawCardFace() {
      ctx.fillStyle = '#fffdf5';
      ctx.fillRect(0, 0, 512, 700);

      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(25, 25, 462, 650);

      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 16;
      ctx.strokeRect(18, 18, 476, 664);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(28, 28, 456, 644);

      // Băng rôn tiêu đề
      ctx.fillStyle = themeColor;
      ctx.fillRect(38, 38, 436, 48);

      ctx.font = '900 22px "Quicksand", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌸 LỚP 1B1 • CÔ HOÀI THANH 🌸', 256, 62);

      // Badge độ hiếm
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(120, 98, 272, 34, 17);
      ctx.fill();
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.font = '900 15px "Quicksand", sans-serif';
      ctx.fillStyle = themeColor;
      ctx.fillText(rarityText, 256, 115);

      // Nền tròn icon
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(256, 255, 115, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 4.5;
      ctx.stroke();

      const iconKey = card.iconType || 'gift';
      const svgImg = getSvgImage(iconKey);

      const renderSvg = () => {
        ctx.drawImage(svgImg, 166, 165, 180, 180);
        texture.needsUpdate = true;
      };

      if (svgImg.complete) {
        renderSvg();
      } else {
        svgImg.onload = renderSvg;
      }

      // Tên đặc quyền: màu đen than đậm đà (#0f172a), font 900
      ctx.font = '900 40px "Quicksand", sans-serif';
      ctx.fillStyle = '#0f172a';

      const words = (card.title || '').split(' ');
      let lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        if (ctx.measureText(testLine).width < 420) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      lines.push(currentLine);

      const titleStartY = lines.length > 1 ? 430 : 445;
      lines.forEach((line, index) => {
        ctx.fillText(line, 256, titleStartY + index * 48);
      });

      // Lời nhắn / phụ đề
      if (card.subtitle) {
        ctx.font = '800 23px "Quicksand", sans-serif';
        ctx.fillStyle = subColor;
        ctx.fillText(card.subtitle, 256, titleStartY + lines.length * 48 + 22);
      }

      // Chân thẻ
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(40, 615, 432, 40);
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 615, 432, 40);

      ctx.font = '900 15px "Quicksand", sans-serif';
      ctx.fillStyle = themeColor;
      ctx.fillText('✦ BÉ CHĂM NGOAN • CẢ LỚP YÊU QUÝ ✦', 256, 635);

      texture.needsUpdate = true;
    }

    drawCardFace();

    if (card.customImage) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, 512, 700);
        ctx.drawImage(img, 0, 0, 512, 700);
        texture.needsUpdate = true;
      };
      img.src = card.customImage;
    }

    return texture;
  },

  buildCards() {
    while (this.carouselGroup.children.length > 0) {
      const obj = this.carouselGroup.children[0];
      this.carouselGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
    }
    this.cardMeshes = [];

    if (!this.sharedBackTexture) {
      this.sharedBackTexture = this.generateBackFaceTexture();
    }

    const activeCards = DataStore.getActiveCards();
    const count = activeCards.length;
    if (count === 0) return;

    const cardGeometry = new THREE.BoxGeometry(this.CARD_WIDTH, this.CARD_HEIGHT, this.CARD_DEPTH);

    activeCards.forEach((card, index) => {
      const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0xfde047,
        metalness: 0.1,
        roughness: 0.45,
        transparent: true,
        opacity: 1.0
      });

      const backMaterial = new THREE.MeshStandardMaterial({
        map: this.sharedBackTexture,
        metalness: 0.05,
        roughness: 0.5,
        transparent: true,
        opacity: 1.0
      });

      const frontTexture = this.generateFrontFaceTexture(card);
      const frontMaterial = new THREE.MeshStandardMaterial({
        map: frontTexture,
        metalness: 0.05,
        roughness: 0.5,
        transparent: true,
        opacity: 1.0
      });

      const materials = [
        edgeMaterial,
        edgeMaterial.clone(),
        edgeMaterial.clone(),
        edgeMaterial.clone(),
        frontMaterial,
        backMaterial
      ];

      const mesh = new THREE.Mesh(cardGeometry, materials);

      const angle = (index / count) * Math.PI * 2;
      const posX = Math.sin(angle) * this.CAROUSEL_RADIUS;
      const posZ = Math.cos(angle) * this.CAROUSEL_RADIUS;

      mesh.position.set(posX, 0, posZ);
      mesh.rotation.y = angle + Math.PI;

      mesh.userData = {
        cardData: card,
        index: index,
        baseAngle: angle,
        basePos: new THREE.Vector3(posX, 0, posZ),
        baseRotY: angle + Math.PI,
      };

      this.carouselGroup.add(mesh);
      this.cardMeshes.push({
        mesh: mesh,
        cardData: card
      });
    });

    this.carouselGroup.rotation.y = 0;
    this.currentState = STATE_IDLE;
    if (this.onStateChange) this.onStateChange(STATE_IDLE);
  },

  startCarouselSpin() {
    if (this.cardMeshes.length === 0) return;

    this.currentState = STATE_SPINNING;
    const durationSeconds = DataStore.getSpinDuration();

    let timeLeft = durationSeconds;
    if (this.onStateChange) this.onStateChange(STATE_SPINNING, timeLeft);

    if (this.spinTickInterval) clearInterval(this.spinTickInterval);
    this.spinTickInterval = setInterval(() => {
      sound.playTick();
    }, 95);

    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        if (this.onCountdownTick) this.onCountdownTick(timeLeft);
      } else {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }, 1000);

    if (this.spinTween) this.spinTween.kill();
    this.spinTween = gsap.to(this.carouselGroup.rotation, {
      y: '+=31.4159',
      duration: 3.5,
      ease: 'none',
      repeat: -1
    });

    if (this.autoStopTimer) clearTimeout(this.autoStopTimer);
    this.autoStopTimer = setTimeout(() => {
      this.stopCarouselAndReveal();
    }, durationSeconds * 1000);
  },

  stopCarouselAndReveal(targetMesh = null) {
    if (this.currentState !== STATE_SPINNING && this.currentState !== STATE_IDLE) return;

    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.spinTickInterval) {
      clearInterval(this.spinTickInterval);
      this.spinTickInterval = null;
    }
    if (this.spinTween) {
      this.spinTween.kill();
      this.spinTween = null;
    }

    const count = this.cardMeshes.length;
    let chosenIndex = 0;

    if (targetMesh && targetMesh.userData) {
      chosenIndex = targetMesh.userData.index;
    } else {
      chosenIndex = Math.floor(Math.random() * count);
    }

    this.activeCardIndex = chosenIndex;
    const chosenItem = this.cardMeshes[chosenIndex];
    const mesh = chosenItem.mesh;
    this.revealedCardMesh = mesh;

    this.currentState = STATE_REVEALED;
    if (this.onStateChange) this.onStateChange(STATE_REVEALED, chosenItem.cardData);

    // Tính toán góc quay chính xác để thẻ được chọn dừng đúng chính giữa màn hình (X = 0)
    const targetAngle = -mesh.userData.baseAngle;
    const currentRotY = this.carouselGroup.rotation.y;
    const twoPi = Math.PI * 2;

    let diff = (targetAngle - currentRotY) % twoPi;
    if (diff > 0) diff -= twoPi;
    const finalCarouselRotY = currentRotY + diff - twoPi * 2;

    gsap.to(this.carouselGroup.rotation, {
      y: finalCarouselRotY,
      duration: 2.2,
      ease: 'power3.out',
      onComplete: () => {
        this.revealWinningCard(mesh);
      }
    });
  },

  revealWinningCard(mesh) {
    const targetRadius = this.CAROUSEL_RADIUS + 2.5;
    const angle = mesh.userData.baseAngle;

    // Di chuyển đều cả X và Z để tọa độ trung tâm tuyệt đối X = 0
    gsap.to(mesh.position, {
      x: Math.sin(angle) * targetRadius,
      z: Math.cos(angle) * targetRadius,
      y: 0.25,
      duration: 1.3,
      ease: 'power2.out'
    });

    gsap.to(mesh.scale, {
      x: 1.38,
      y: 1.38,
      z: 1.38,
      duration: 1.3,
      ease: 'back.out(1.5)'
    });

    gsap.to(mesh.rotation, {
      y: mesh.userData.baseRotY + Math.PI,
      duration: 1.3,
      ease: 'power2.inOut',
      onComplete: () => {
        sound.playFanfare();
        this.launchConfetti();
      }
    });
  },

  resetCardBackToCarousel() {
    if (!this.revealedCardMesh) {
      this.currentState = STATE_IDLE;
      if (this.onStateChange) this.onStateChange(STATE_IDLE);
      return;
    }

    const mesh = this.revealedCardMesh;
    gsap.to(mesh.position, {
      x: mesh.userData.basePos.x,
      y: 0,
      z: mesh.userData.basePos.z,
      duration: 0.9,
      ease: 'power2.inOut'
    });

    gsap.to(mesh.scale, {
      x: 1.0,
      y: 1.0,
      z: 1.0,
      duration: 0.8
    });

    gsap.to(mesh.rotation, {
      y: mesh.userData.baseRotY,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        this.revealedCardMesh = null;
        this.currentState = STATE_IDLE;
        if (this.onStateChange) this.onStateChange(STATE_IDLE);
      }
    });
  },

  launchConfetti() {
    if (typeof confetti !== 'function') return;

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#d97706', '#db2777', '#0284c7', '#16a34a', '#ffffff']
    });

    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.75 },
        colors: ['#d97706', '#db2777', '#fde047']
      });
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.75 },
        colors: ['#0284c7', '#9333ea', '#d97706']
      });
    }, 250);
  },

  bindEvents() {
    window.addEventListener('resize', () => this.onWindowResize());
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));
    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
  },

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (this.currentState === STATE_IDLE) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.cardMeshes.map(c => c.mesh));
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (this.hoveredCard !== hit) {
          if (this.hoveredCard) this.resetHover(this.hoveredCard);
          this.hoveredCard = hit;
          this.applyHover(hit);
          sound.playHover();
        }
      } else {
        if (this.hoveredCard) {
          this.resetHover(this.hoveredCard);
          this.hoveredCard = null;
        }
      }
    }
  },

  applyHover(mesh) {
    document.body.style.cursor = 'pointer';
    gsap.to(mesh.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.25 });
  },

  resetHover(mesh) {
    document.body.style.cursor = 'default';
    gsap.to(mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.25 });
  },

  onClick(e) {
    if (this.currentState === STATE_SPINNING) {
      this.stopCarouselAndReveal();
    } else if (this.currentState === STATE_IDLE) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.cardMeshes.map(c => c.mesh));
      if (intersects.length > 0) {
        this.stopCarouselAndReveal(intersects[0].object);
      }
    }
  },

  onTouchStart(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

      if (this.currentState === STATE_SPINNING) {
        e.preventDefault();
        this.stopCarouselAndReveal();
      } else if (this.currentState === STATE_IDLE) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.cardMeshes.map(c => c.mesh));
        if (intersects.length > 0) {
          e.preventDefault();
          this.stopCarouselAndReveal(intersects[0].object);
        }
      }
    }
  },

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  },

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    this.floatingElements.forEach(sprite => {
      sprite.position.y = sprite.userData.baseY + Math.sin(elapsedTime * sprite.userData.speed + sprite.userData.phase) * 0.45;
    });

    if (this.pedestalDisc) {
      this.pedestalDisc.rotation.z = -elapsedTime * 0.4;
    }

    if (this.currentState === STATE_IDLE) {
      this.cardMeshes.forEach((item, i) => {
        const mesh = item.mesh;
        if (mesh !== this.hoveredCard) {
          const floatOffset = Math.sin(elapsedTime * 2.0 + i * 0.55) * 0.05;
          mesh.position.y = floatOffset;
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
};

window.Scene3D = Scene3D;
