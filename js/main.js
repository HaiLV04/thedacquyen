/**
 * MAIN.JS - Điểm khởi động chính của ứng dụng
 * Kết nối chặt chẽ data.js, audio.js, scene3d.js và ui.js
 */

window.addEventListener('DOMContentLoaded', () => {
  // 1. Tải dữ liệu lưu trữ từ LocalStorage
  DataStore.loadSavedData();

  // 2. Khởi tạo không gian 3D Three.js và hệ thống thẻ bài
  Scene3D.init();

  // 3. Khởi tạo giao diện điều khiển 2D HUD và gắn kết sự kiện
  UI.init();

  // 4. Xây dựng các thẻ bài 3D và hiển thị số lượng thẻ
  Scene3D.buildCards();
  UI.updateCardCounters();

  // Đảm bảo khi bộ font tiếng Việt (Nunito, Baloo 2) tải xong từ CDN thì tự động làm mới texture siêu nét
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      Scene3D.buildCards();
    });
  }

  // 5. Bắt đầu vòng lặp chuyển động render 3D
  Scene3D.animate();

  console.log('🎉 Ứng dụng "VÒNG QUAY ĐẶC QUYỀN 3D - LỚP 1B1" đã khởi chạy thành công!');
});
