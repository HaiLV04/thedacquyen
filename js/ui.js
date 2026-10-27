/**
 * UI.JS - Xử lý tương tác giao diện người dùng (HUD Controls, Modal Quản Lý Thẻ, Sự Kiện Nút)
 */

const UI = {
  mainActionBtn: null,
  mainActionIconBox: null,
  mainActionLabel: null,
  statusToast: null,
  statusToastText: null,
  soundIconBox: null,
  soundText: null,
  modalManage: null,
  cardsManagerList: null,
  newCardFileInput: null,
  customImageBase64: null,

  init() {
    this.cacheElements();
    this.bindEvents();
    this.connectSceneCallbacks();
    this.initClassroomDisplay();
    this.updateSoundDisplay();
  },

  cacheElements() {
    this.mainActionBtn = document.getElementById('btn-main-action');
    this.mainActionIconBox = document.getElementById('main-action-icon-box');
    this.mainActionLabel = document.getElementById('main-action-label');
    this.statusToast = document.getElementById('status-toast');
    this.statusToastText = document.getElementById('status-toast-text');
    this.soundIconBox = document.getElementById('sound-icon-box');
    this.soundText = document.getElementById('sound-text');
    this.modalManage = document.getElementById('modal-manage');
    this.cardsManagerList = document.getElementById('cards-manager-list');
    this.newCardFileInput = document.getElementById('new-card-file');
  },

  initClassroomDisplay() {
    const grade = DataStore.getClassroomGrade();
    const teacher = DataStore.getClassroomTeacher();
    const duration = DataStore.getSpinDuration();

    document.getElementById('classroom-grade-display').textContent = grade;
    document.getElementById('classroom-teacher-display').textContent = teacher;
    document.getElementById('spin-duration-select').value = duration;
  },

  updateSoundDisplay() {
    this.soundIconBox.textContent = sound.enabled ? '🔊' : '🔇';
    this.soundText.textContent = sound.enabled ? 'BẬT' : 'TẮT';
  },

  updateStatusToast(msg) {
    this.statusToast.classList.remove('opacity-0', 'pointer-events-none');
    this.statusToastText.innerHTML = msg;
  },

  hideStatusToast() {
    this.statusToast.classList.add('opacity-0', 'pointer-events-none');
  },

  updateHUDControlsForState(state, extra) {
    if (state === STATE_IDLE) {
      this.mainActionIconBox.textContent = '▶';
      this.mainActionLabel.textContent = 'BẮT ĐẦU QUAY';
      this.mainActionBtn.className = 'group relative px-9 md:px-12 py-3.5 md:py-4 rounded-2xl font-black text-xl md:text-2xl tracking-wider uppercase transition-all duration-300 cursor-pointer overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 shadow-lg hover:scale-105 active:scale-95 border-2 border-white flex items-center gap-3';
      this.updateStatusToast('Bấm nút <strong class="text-rose-700 underline font-black">"BẮT ĐẦU QUAY"</strong> - Vòng quay sẽ tự động dừng và trao thẻ!');
    } else if (state === STATE_SPINNING) {
      const timeLeft = extra || DataStore.getSpinDuration();
      this.mainActionIconBox.textContent = '⏳';
      this.mainActionLabel.textContent = `ĐANG QUAY... (${timeLeft}s)`;
      this.mainActionBtn.className = 'group relative px-9 md:px-12 py-3.5 md:py-4 rounded-2xl font-black text-xl md:text-2xl tracking-wider uppercase transition-all duration-300 cursor-default overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 shadow-lg border-2 border-white flex items-center gap-3 animate-pulse';
      this.updateStatusToast(`🌀 Đang quay trong <strong class="text-rose-700">${timeLeft} giây</strong>... Hãy cùng đếm ngược nào! 🌸`);
    } else if (state === STATE_REVEALED) {
      this.hideStatusToast();
      this.mainActionIconBox.textContent = '↻';
      this.mainActionLabel.textContent = 'QUAY TIẾP LƯỢT MỚI';
      this.mainActionBtn.className = 'group relative px-9 md:px-12 py-3.5 md:py-4 rounded-2xl font-black text-xl md:text-2xl tracking-wider uppercase transition-all duration-300 cursor-pointer overflow-hidden bg-gradient-to-r from-orange-400 via-amber-400 to-pink-400 hover:from-orange-300 hover:to-pink-300 text-slate-950 shadow-lg hover:scale-105 active:scale-95 border-2 border-white flex items-center gap-3';
    }
  },

  updateCardCounters() {
    const active = DataStore.getActiveCards().length;
    document.getElementById('card-count-active').textContent = active;
    document.getElementById('modal-cards-count').textContent = active;
  },

  connectSceneCallbacks() {
    Scene3D.onStateChange = (state, extra) => {
      this.updateHUDControlsForState(state, extra);
    };

    Scene3D.onCountdownTick = (timeLeft) => {
      this.mainActionLabel.textContent = `ĐANG QUAY... (${timeLeft}s)`;
    };
  },

  bindEvents() {
    // Nút Bắt đầu / Tiếp tục quay
    this.mainActionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();

      if (Scene3D.currentState === STATE_IDLE) {
        Scene3D.startCarouselSpin();
      } else if (Scene3D.currentState === STATE_SPINNING) {
        Scene3D.stopCarouselAndReveal();
      } else if (Scene3D.currentState === STATE_REVEALED) {
        Scene3D.resetCardBackToCarousel();
      }
    });

    // Nút Xếp lại bài
    document.getElementById('btn-replay').addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      if (Scene3D.autoStopTimer) clearTimeout(Scene3D.autoStopTimer);
      if (Scene3D.countdownInterval) clearInterval(Scene3D.countdownInterval);
      if (Scene3D.spinTickInterval) clearInterval(Scene3D.spinTickInterval);
      if (Scene3D.spinTween) Scene3D.spinTween.kill();
      Scene3D.buildCards();
    });

    // Thay đổi thời gian quay
    document.getElementById('spin-duration-select').addEventListener('change', (e) => {
      DataStore.setSpinDuration(e.target.value);
    });

    // Bật / tắt âm thanh
    document.getElementById('btn-sound-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      sound.toggleSound();
      this.updateSoundDisplay();
      if (sound.enabled) sound.playClick();
    });

    // Toàn màn hình
    document.getElementById('btn-fullscreen').addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          alert(`Không thể bật toàn màn hình: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });

    // Chỉnh sửa tên lớp & tên cô giáo
    document.getElementById('btn-edit-classname').addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      const currentGrade = document.getElementById('classroom-grade-display').textContent.trim();
      const newGrade = prompt('Nhập tên lớp (VD: LỚP 1B1):', currentGrade);
      if (newGrade && newGrade.trim() !== '') {
        const cleanGrade = newGrade.trim().toUpperCase();
        document.getElementById('classroom-grade-display').textContent = cleanGrade;
        DataStore.setClassroomGrade(cleanGrade);
      }

      const currentTeacher = document.getElementById('classroom-teacher-display').textContent.trim();
      const newTeacher = prompt('Nhập tên cô giáo (VD: Cô Nguyễn Thị Hoài Thanh):', currentTeacher);
      if (newTeacher && newTeacher.trim() !== '') {
        const cleanTeacher = newTeacher.trim();
        document.getElementById('classroom-teacher-display').textContent = cleanTeacher;
        DataStore.setClassroomTeacher(cleanTeacher);
      }
    });

    // Khôi phục mặc định từ header
    document.getElementById('btn-reset-default').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Khôi phục danh sách về 11 thẻ đặc quyền mặc định của lớp 1B1?')) {
        sound.playClick();
        DataStore.resetToDefault();
        this.updateCardCounters();
        Scene3D.buildCards();
      }
    });

    // Mở / Đóng Modal
    document.getElementById('btn-manage-cards').addEventListener('click', () => this.openModal());
    document.getElementById('btn-quick-add').addEventListener('click', () => this.openModal());
    document.getElementById('btn-close-modal').addEventListener('click', () => this.closeModal());
    document.getElementById('btn-save-modal').addEventListener('click', () => this.closeModal());

    // Khôi phục mặc định trong modal
    document.getElementById('btn-reset-cards-modal').addEventListener('click', () => {
      if (confirm('Khôi phục danh sách về 11 thẻ mặc định ban đầu của lớp 1B1?')) {
        sound.playClick();
        DataStore.resetToDefault();
        this.renderModalCardsList();
      }
    });

    // Thêm thẻ mới
    document.getElementById('btn-submit-add-card').addEventListener('click', () => this.handleAddCardSubmit());

    // Xử lý chọn ảnh tải lên
    this.newCardFileInput.addEventListener('change', (e) => this.handleImageUpload(e));
  },

  openModal() {
    sound.playClick();
    this.renderModalCardsList();
    this.modalManage.classList.remove('hidden');
  },

  closeModal() {
    sound.playClick();
    this.modalManage.classList.add('hidden');
    this.updateCardCounters();
    Scene3D.buildCards();
  },

  handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      document.getElementById('file-chosen-name').textContent = file.name;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const compCanvas = document.createElement('canvas');
          compCanvas.width = 512;
          compCanvas.height = 700;
          const cctx = compCanvas.getContext('2d');
          cctx.drawImage(img, 0, 0, 512, 700);
          this.customImageBase64 = compCanvas.toDataURL('image/jpeg', 0.82);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.customImageBase64 = null;
      document.getElementById('file-chosen-name').textContent = 'Chưa chọn ảnh';
    }
  },

  handleAddCardSubmit() {
    const title = document.getElementById('new-card-title').value.trim();
    const iconType = document.getElementById('new-card-icon-select').value;
    const sub = document.getElementById('new-card-sub').value.trim();
    const rarity = document.getElementById('new-card-rarity').value;

    if (!title) {
      alert('Vui lòng nhập tên đặc quyền!');
      return;
    }

    sound.playClick();

    const newCard = {
      id: 'c_' + Date.now(),
      title: title,
      iconType: iconType,
      rarity: rarity,
      subtitle: sub || 'Phần thưởng chăm ngoan từ cô Hoài Thanh',
      active: true,
      customImage: this.customImageBase64
    };

    DataStore.addCard(newCard);
    this.renderModalCardsList();
    this.updateCardCounters();

    // Reset Form
    document.getElementById('new-card-title').value = '';
    document.getElementById('new-card-sub').value = '';
    this.customImageBase64 = null;
    this.newCardFileInput.value = '';
    document.getElementById('file-chosen-name').textContent = 'Chưa chọn ảnh';
  },

  renderModalCardsList() {
    this.cardsManagerList.innerHTML = '';
    DataStore.cardsData.forEach((card, index) => {
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between p-3 rounded-xl bg-amber-50/90 border-2 border-amber-300 hover:border-amber-500 transition-colors shadow-sm';

      let badgeColor = 'bg-sky-100 text-sky-900 border-sky-400';
      if (card.rarity === 'SSR') badgeColor = 'bg-amber-100 text-amber-950 border-amber-400';
      if (card.rarity === 'SR') badgeColor = 'bg-purple-100 text-purple-950 border-purple-400';
      if (card.rarity === 'PINK') badgeColor = 'bg-pink-100 text-pink-950 border-pink-400';
      if (card.rarity === 'ORANGE') badgeColor = 'bg-orange-100 text-orange-950 border-orange-400';
      if (card.rarity === 'GREEN') badgeColor = 'bg-emerald-100 text-emerald-950 border-emerald-400';

      const svgSnippet = SVG_ICONS[card.iconType] || SVG_ICONS.gift;

      item.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white border-2 border-amber-400 flex items-center justify-center p-1.5 shadow-sm">
            <div class="w-full h-full">${svgSnippet}</div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-black text-sm text-slate-900">${card.title}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full border-2 ${badgeColor} font-black">${card.rarity}</span>
            </div>
            <p class="text-xs text-amber-900 font-extrabold">${card.subtitle || 'Không có mô tả'}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-delete-card w-8 h-8 rounded-lg bg-rose-100 hover:bg-rose-500 text-rose-800 hover:text-white text-xs flex items-center justify-center transition-colors cursor-pointer border-2 border-rose-300 font-black" data-index="${index}" title="Xóa thẻ">
            ✕
          </button>
        </div>
      `;

      this.cardsManagerList.appendChild(item);
    });

    document.querySelectorAll('.btn-delete-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        if (confirm(`Xóa thẻ "${DataStore.cardsData[idx].title}"?`)) {
          DataStore.deleteCard(idx);
          this.renderModalCardsList();
          this.updateCardCounters();
        }
      });
    });

    this.updateCardCounters();
  }
};

window.UI = UI;
