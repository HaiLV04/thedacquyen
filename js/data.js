/**
 * DATA.JS - Danh sách 11 thẻ đặc quyền mặc định, biểu tượng SVG & lưu trữ LocalStorage
 * Dành riêng cho: LỚP 1B1 - CÔ NGUYỄN THỊ HOÀI THANH
 */

const SVG_ICONS = {
  crown: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="goldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="40%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <path d="M15 72 L20 30 L38 52 L50 18 L62 52 L80 30 L85 72 Z" fill="url(#goldCrown)" stroke="#78350f" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="18" y="72" width="64" height="13" rx="5" fill="url(#goldCrown)" stroke="#78350f" stroke-width="3.5"/>
      <circle cx="50" cy="18" r="5.5" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
      <circle cx="20" cy="30" r="4.5" fill="#0284c7" stroke="#ffffff" stroke-width="1.8"/>
      <circle cx="80" cy="30" r="4.5" fill="#0284c7" stroke="#ffffff" stroke-width="1.8"/>
      <circle cx="34" cy="78" r="3.5" fill="#dc2626"/>
      <circle cx="50" cy="78" r="3.5" fill="#16a34a"/>
      <circle cx="66" cy="78" r="3.5" fill="#0284c7"/>
    </svg>
  `,

  medal: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="ribbonBlue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
        <linearGradient id="goldMedal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="60%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <polygon points="32,14 44,14 38,44 26,44" fill="url(#ribbonBlue)" stroke="#1e3a8a" stroke-width="2.5"/>
      <polygon points="68,14 56,14 62,44 74,44" fill="url(#ribbonBlue)" stroke="#1e3a8a" stroke-width="2.5"/>
      <circle cx="50" cy="62" r="26" fill="url(#goldMedal)" stroke="#78350f" stroke-width="3.5"/>
      <circle cx="50" cy="62" r="20" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="3 2"/>
      <polygon points="50,47 54,57 65,58 57,65 60,76 50,70 40,76 43,65 35,58 46,57" fill="#fffbeb" stroke="#78350f" stroke-width="1.8"/>
    </svg>
  `,

  shield: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="purpleShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="50%" stop-color="#9333ea"/>
          <stop offset="100%" stop-color="#6b21a8"/>
        </linearGradient>
      </defs>
      <path d="M50 14 C75 14 84 24 84 45 C84 70 50 88 50 88 C50 88 16 70 16 45 C16 24 25 14 50 14 Z" fill="url(#purpleShield)" stroke="#581c87" stroke-width="3.5"/>
      <polygon points="50,30 55,44 70,45 58,54 62,69 50,60 38,69 42,54 30,45 45,44" fill="#fde047" stroke="#78350f" stroke-width="2"/>
    </svg>
  `,

  twoStars: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="starGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
        <linearGradient id="starGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#db2777"/>
        </linearGradient>
      </defs>
      <g transform="translate(34, 54) scale(0.95)">
        <polygon points="0,-28 7,-8 28,-5 12,9 17,29 0,17 -17,29 -12,9 -28,-5 -7,-8" fill="url(#starGrad1)" stroke="#78350f" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="5" fill="#ffffff" opacity="0.9"/>
      </g>
      <g transform="translate(66, 38) scale(1.1)">
        <polygon points="0,-28 7,-8 28,-5 12,9 17,29 0,17 -17,29 -12,9 -28,-5 -7,-8" fill="url(#starGrad2)" stroke="#831843" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="5" fill="#ffffff" opacity="0.9"/>
      </g>
      <circle cx="16" cy="28" r="3" fill="#0284c7"/>
      <circle cx="82" cy="74" r="3.5" fill="#d97706"/>
    </svg>
  `,

  star: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="starSingle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#67e8f9"/>
          <stop offset="50%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
      </defs>
      <polygon points="50,12 61,36 88,38 67,56 74,82 50,68 26,82 33,56 12,38 39,36" fill="url(#starSingle)" stroke="#0c4a6e" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="50,22 57,38 74,40 60,52 64,69 50,60 36,69 40,52 26,40 43,38" fill="#ffffff" opacity="0.45"/>
    </svg>
  `,

  swap: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="pinkChair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#db2777"/>
        </linearGradient>
      </defs>
      <path d="M38 32 L38 56 L62 56 L62 32 C62 26 38 26 38 32 Z" fill="url(#pinkChair)" stroke="#831843" stroke-width="3"/>
      <path d="M34 56 L66 56 L66 64 L34 64 Z" fill="#fda4af" stroke="#831843" stroke-width="3" rx="3"/>
      <line x1="38" y1="64" x2="32" y2="84" stroke="#831843" stroke-width="4" stroke-linecap="round"/>
      <line x1="62" y1="64" x2="68" y2="84" stroke="#831843" stroke-width="4" stroke-linecap="round"/>
      <path d="M22 36 A 34 34 0 0 1 78 36" fill="none" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
      <polygon points="78,28 86,38 74,42" fill="#0284c7"/>
      <path d="M78 68 A 34 34 0 0 1 22 68" fill="none" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
      <polygon points="22,76 14,66 26,62" fill="#0284c7"/>
    </svg>
  `,

  clap: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="clapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="100%" stop-color="#15803d"/>
        </linearGradient>
      </defs>
      <path d="M26 62 C26 48 40 40 50 48 L46 68 L34 76 Z" fill="url(#clapGrad)" stroke="#14532d" stroke-width="3"/>
      <path d="M74 62 C74 48 60 40 50 48 L54 68 L66 76 Z" fill="url(#clapGrad)" stroke="#14532d" stroke-width="3"/>
      <circle cx="50" cy="46" r="6" fill="#fde047" stroke="#78350f" stroke-width="2"/>
      <line x1="50" y1="32" x2="50" y2="18" stroke="#d97706" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="36" y1="36" x2="24" y2="24" stroke="#d97706" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="64" y1="36" x2="76" y2="24" stroke="#d97706" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  `,

  dice: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="diceOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="60%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#c2410c"/>
        </linearGradient>
      </defs>
      <polygon points="50,20 76,34 50,48 24,34" fill="#ffedd5" stroke="#7c2d12" stroke-width="3"/>
      <polygon points="24,34 50,48 50,78 24,64" fill="url(#diceOrange)" stroke="#7c2d12" stroke-width="3"/>
      <polygon points="50,48 76,34 76,64 50,78" fill="#ea580c" stroke="#7c2d12" stroke-width="3"/>
      <circle cx="50" cy="34" r="4" fill="#7c2d12"/>
      <circle cx="34" cy="50" r="3.5" fill="#ffffff"/>
      <circle cx="40" cy="64" r="3.5" fill="#ffffff"/>
      <circle cx="62" cy="50" r="3.5" fill="#ffffff"/>
      <circle cx="68" cy="64" r="3.5" fill="#ffffff"/>
    </svg>
  `,

  board: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#16a34a"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
      </defs>
      <rect x="15" y="20" width="70" height="50" rx="6" fill="#b45309" stroke="#451a03" stroke-width="3"/>
      <rect x="20" y="25" width="60" height="40" rx="3" fill="url(#boardGrad)"/>
      <text x="32" y="50" font-family="'Quicksand', sans-serif" font-weight="900" font-size="20" fill="#ffffff">A B C</text>
      <polygon points="68,66 88,86 82,90 62,70" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
      <line x1="58" y1="62" x2="70" y2="74" stroke="#fde047" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  `,

  fan: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="fanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <g transform="translate(50,50)">
        <path d="M0,0 C-8,-26 -4,-42 6,-42 C16,-42 12,-26 0,0" fill="url(#fanGrad)" stroke="#064e3b" stroke-width="2.5"/>
        <g transform="rotate(120)">
          <path d="M0,0 C-8,-26 -4,-42 6,-42 C16,-42 12,-26 0,0" fill="url(#fanGrad)" stroke="#064e3b" stroke-width="2.5"/>
        </g>
        <g transform="rotate(240)">
          <path d="M0,0 C-8,-26 -4,-42 6,-42 C16,-42 12,-26 0,0" fill="url(#fanGrad)" stroke="#064e3b" stroke-width="2.5"/>
        </g>
        <circle cx="0" cy="0" r="10" fill="#a7f3d0" stroke="#064e3b" stroke-width="3"/>
        <circle cx="0" cy="0" r="4" fill="#064e3b"/>
      </g>
      <path d="M68 62 C78 62 84 72 84 82 C74 82 64 76 68 62 Z" fill="#16a34a" stroke="#064e3b" stroke-width="2.5"/>
    </svg>
  `,

  candy: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="candyPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#db2777"/>
        </linearGradient>
      </defs>
      <line x1="38" y1="46" x2="22" y2="84" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
      <line x1="62" y1="46" x2="78" y2="84" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
      <circle cx="38" cy="40" r="18" fill="url(#candyPink)" stroke="#831843" stroke-width="3"/>
      <path d="M38 28 A 12 12 0 0 1 50 40 A 6 6 0 0 1 38 46" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <circle cx="62" cy="40" r="18" fill="#38bdf8" stroke="#0369a1" stroke-width="3"/>
      <path d="M62 28 A 12 12 0 0 1 74 40 A 6 6 0 0 1 62 46" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="22" r="4" fill="#fde047" stroke="#78350f" stroke-width="1.5"/>
    </svg>
  `,

  gift: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="giftBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f43f5e"/>
          <stop offset="100%" stop-color="#be123c"/>
        </linearGradient>
      </defs>
      <rect x="25" y="42" width="50" height="42" rx="5" fill="url(#giftBody)" stroke="#881337" stroke-width="3"/>
      <rect x="20" y="32" width="60" height="14" rx="4" fill="#fda4af" stroke="#881337" stroke-width="3"/>
      <rect x="44" y="32" width="12" height="52" fill="#fde047" stroke="#78350f" stroke-width="2"/>
      <rect x="25" y="56" width="50" height="10" fill="#fde047" stroke="#78350f" stroke-width="2"/>
      <ellipse cx="42" cy="26" rx="8" ry="6" fill="#fef08a" stroke="#78350f" stroke-width="2"/>
      <ellipse cx="58" cy="26" rx="8" ry="6" fill="#fef08a" stroke="#78350f" stroke-width="2"/>
      <circle cx="50" cy="28" r="4.5" fill="#eab308"/>
    </svg>
  `,

  magicBack: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="sunPetals" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <g transform="translate(50,50)">
        <ellipse cx="0" cy="-28" rx="8" ry="14" fill="url(#sunPetals)" stroke="#b45309" stroke-width="2"/>
        <ellipse cx="20" cy="-20" rx="8" ry="14" transform="rotate(45 20 -20)" fill="url(#sunPetals)" stroke="#b45309" stroke-width="2"/>
        <ellipse cx="28" cy="0" rx="8" ry="14" transform="rotate(90 28 0)" fill="url(#sunPetals)" stroke="#b45309" stroke-width="2"/>
        <ellipse cx="20" cy="20" rx="8" ry="14" transform="rotate(135 20 20)" fill="url(#sunPetals)" stroke="#b45309" stroke-width="2"/>
        <ellipse cx="0" cy="28" rx="8" ry="14" fill="url(#sunPetals)" stroke="#b45309" stroke-width="2"/>
        <ellipse cx="-20" cy="20" rx="8" ry="14" transform="rotate(225 -20 20)" fill="url(#sunPetals)" stroke="#b45309" stroke-width="2"/>
        <ellipse cx="-28" cy="0" rx="8" ry="14" transform="rotate(270 -28 0)" fill="url(#sunPetals)" stroke="#b45309" stroke-width="2"/>
        <ellipse cx="-20" cy="-20" rx="8" ry="14" transform="rotate(315 -20 -20)" fill="url(#sunPetals)" stroke="#b45309" stroke-width="2"/>
        <circle cx="0" cy="0" r="18" fill="#fbbf24" stroke="#78350f" stroke-width="3"/>
        <circle cx="-6" cy="-4" r="2.5" fill="#451a03"/>
        <circle cx="6" cy="-4" r="2.5" fill="#451a03"/>
        <circle cx="-5" cy="-5" r="0.8" fill="#ffffff"/>
        <circle cx="7" cy="-5" r="0.8" fill="#ffffff"/>
        <path d="M-6 4 Q0 10 6 4" fill="none" stroke="#451a03" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="-9" cy="2" r="2.5" fill="#f43f5e" opacity="0.8"/>
        <circle cx="9" cy="2" r="2.5" fill="#f43f5e" opacity="0.8"/>
      </g>
    </svg>
  `
};

const DEFAULT_CARDS = [
  { id: 'c1', title: 'Làm Lớp Trưởng', iconType: 'crown', rarity: 'SSR', subtitle: 'Chỉ huy lớp 1B1 trong 1 ngày', active: true },
  { id: 'c2', title: 'Làm Lớp Phó', iconType: 'medal', rarity: 'SSR', subtitle: 'Trợ thủ đắc lực của cô Hoài Thanh', active: true },
  { id: 'c3', title: 'Làm Tổ Trưởng', iconType: 'shield', rarity: 'SR', subtitle: 'Dẫn dắt tổ thi đua giành điểm 10', active: true },
  { id: 'c4', title: '2 Sticker Bé Ngoan', iconType: 'twoStars', rarity: 'PINK', subtitle: 'Nhận 2 sticker khen thưởng từ cô', active: true },
  { id: 'c5', title: '1 Sticker Ngôi Sao', iconType: 'star', rarity: 'R', subtitle: 'Nhận 1 sticker ngôi sao lấp lánh', active: true },
  { id: 'c6', title: 'Đổi Chỗ Trong 1 Ngày', iconType: 'swap', rarity: 'PINK', subtitle: 'Chọn ngồi cạnh 1 bạn yêu quý', active: true },
  { id: 'c7', title: '1 Tràng Pháo Tay', iconType: 'clap', rarity: 'GREEN', subtitle: 'Cả lớp 1B1 vỗ tay tuyên dương!', active: true },
  { id: 'c8', title: 'Được Bốc Lại 1 Lần Nữa', iconType: 'dice', rarity: 'ORANGE', subtitle: 'Thử vận may thêm 1 lượt quay nữa', active: true },
  { id: 'c9', title: 'Gọi Bạn Lên Bảng', iconType: 'board', rarity: 'SSR', subtitle: 'Mời 1 bạn cùng lên bảng làm bài', active: true },
  { id: 'c10', title: 'Chiến Sĩ Tiết Kiệm Điện', iconType: 'fan', rarity: 'GREEN', subtitle: 'Tắt quạt và đèn lớp học cuối giờ', active: true },
  { id: 'c11', title: '2 Chiếc Kẹo Mút', iconType: 'candy', rarity: 'PINK', subtitle: 'Nhận 2 chiếc kẹo từ cô Hoài Thanh', active: true },
];

const svgImgCache = {};

function getSvgImage(key) {
  if (svgImgCache[key]) return svgImgCache[key];
  const raw = SVG_ICONS[key] || SVG_ICONS.gift;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(raw.trim());
  svgImgCache[key] = img;
  return img;
}

// Khởi tạo trước bộ nhớ cache ảnh SVG
Object.keys(SVG_ICONS).forEach(k => getSvgImage(k));

const DataStore = {
  cardsData: [],
  customImageBase64: null,

  loadSavedData() {
    try {
      const saved = localStorage.getItem('privilege_cards_sunny_v3');
      if (saved) {
        this.cardsData = JSON.parse(saved);
      } else {
        this.cardsData = JSON.parse(JSON.stringify(DEFAULT_CARDS));
      }
    } catch (e) {
      this.cardsData = JSON.parse(JSON.stringify(DEFAULT_CARDS));
    }

    // Luôn đảm bảo tất cả thẻ active sẵn sàng quay
    this.cardsData.forEach(c => c.active = true);
    return this.cardsData;
  },

  saveCardsData() {
    localStorage.setItem('privilege_cards_sunny_v3', JSON.stringify(this.cardsData));
  },

  getActiveCards() {
    return this.cardsData.filter(c => c.active);
  },

  addCard(newCard) {
    this.cardsData.push(newCard);
    this.saveCardsData();
  },

  deleteCard(index) {
    if (index >= 0 && index < this.cardsData.length) {
      this.cardsData.splice(index, 1);
      this.saveCardsData();
    }
  },

  resetToDefault() {
    this.cardsData = JSON.parse(JSON.stringify(DEFAULT_CARDS));
    this.saveCardsData();
    return this.cardsData;
  },

  getClassroomGrade() {
    return localStorage.getItem('classroom_grade_sunny') || 'LỚP 1B1';
  },

  setClassroomGrade(val) {
    localStorage.setItem('classroom_grade_sunny', val);
  },

  getClassroomTeacher() {
    return localStorage.getItem('classroom_teacher_sunny') || 'Cô Nguyễn Thị Hoài Thanh';
  },

  setClassroomTeacher(val) {
    localStorage.setItem('classroom_teacher_sunny', val);
  },

  getSpinDuration() {
    const val = parseInt(localStorage.getItem('spin_duration_seconds'), 10);
    return isNaN(val) ? 4 : val;
  },

  setSpinDuration(val) {
    localStorage.setItem('spin_duration_seconds', val);
  }
};

window.SVG_ICONS = SVG_ICONS;
window.DEFAULT_CARDS = DEFAULT_CARDS;
window.getSvgImage = getSvgImage;
window.DataStore = DataStore;
