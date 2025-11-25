document.addEventListener('DOMContentLoaded', () => {
    // <!-- Developer By DEVTANPHAT | TELEGRAM : @USERIAMTP | ZALO.ME/0946743849 | DEVTANPHAT.SITE --> //
    const CONFIG = {
        BANK_ID: 'MB',
        ACCOUNT_NO: '03111179999',
        TEMPLATE: 'compact',
        ZALO_PHONE: '0913111908' 
    };

    const els = {
        coinInput: document.getElementById('coinInput'),
        currentRate: document.getElementById('currentRate'),
        totalPrice: document.getElementById('totalPrice'),
        btnShowModal: document.getElementById('btnShowModal'),
        paymentModal: document.getElementById('paymentModal'),
        closeModalBtn: document.querySelector('.close-modal'),
        modalAmount: document.getElementById('modalAmount'),
        modalQrImage: document.getElementById('modalQrImage'),
        btnZaloModal: document.getElementById('btnZaloModal'),
        btnCopyAmount: document.getElementById('btnCopyAmount'),
        btnCopyAccount: document.querySelector('.btn-copy[data-copy-target="#modalAccountNo"]')
    };

    let currentOrderState = null;
    const vndFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
    const numberFormatter = new Intl.NumberFormat('vi-VN');

 
    function calculatePrice(coins) {
        let rate = 290000;
        if (coins >= 50000) rate = 280000;
        else if (coins >= 10000) rate = 285000;
        else if (coins >= 5000) rate = 288000;
        return { total: (coins / 1000) * rate, rate };
    }

 
    els.coinInput.addEventListener('input', (e) => {
        const coins = parseFloat(e.target.value);
        if (!coins || coins < 0) {
            els.totalPrice.innerText = "0 VNĐ";
            return;
        }
        const { total, rate } = calculatePrice(coins);
        els.currentRate.innerText = numberFormatter.format(rate);
        els.totalPrice.innerText = vndFormatter.format(total);
    });

    // Quản lý đóng mở Modal
    const modalActions = {
        open: () => {
            els.paymentModal.classList.add('show');
            document.body.style.overflow = 'hidden'; 
        },
        close: () => {
            els.paymentModal.classList.remove('show');
            document.body.style.overflow = ''; 
        }
    };
    els.closeModalBtn.addEventListener('click', modalActions.close);
    window.addEventListener('click', (e) => {
        if (e.target === els.paymentModal) modalActions.close();
    });

    // --- XỬ LÝ NÚT THANH TOÁN (MỞ MODAL & TẠO LINK ZALO) ---
    els.btnShowModal.addEventListener('click', () => {
        const coins = parseFloat(els.coinInput.value);
        if (!coins || coins < 1000) {
            alert('Vui lòng nhập tối thiểu 1.000 xu!');
            els.coinInput.focus();
            return;
        }

        const { total } = calculatePrice(coins);
        const amount = Math.round(total);
        currentOrderState = { amountStr: amount.toString() };

        // 1. Hiển thị thông tin QR và Số tiền
        els.modalAmount.innerText = vndFormatter.format(amount);
        const qrUrl = `https://img.vietqr.io/image/${CONFIG.BANK_ID}-${CONFIG.ACCOUNT_NO}-${CONFIG.TEMPLATE}.png?amount=${amount}`;
        els.modalQrImage.src = qrUrl;

        // 2. Tạo nội dung tin nhắn Zalo tự động (Soạn sẵn)
        const formattedCoins = numberFormatter.format(coins);
        const zaloMsg = `Chào Admin, mình vừa chuyển khoản ${vndFormatter.format(amount)} để mua ${formattedCoins} Xu TikTok. Check và nạp giúp mình nhé!`;
        
        // 3. Gán link vào nút (nhưng chưa mở ngay, chờ sự kiện click ở dưới)
        els.btnZaloModal.href = `https://zalo.me/${CONFIG.ZALO_PHONE}?text=${encodeURIComponent(zaloMsg)}`;

        modalActions.open();
    });

    // --- MỚI: XỬ LÝ KHI KHÁCH BẤM "XÁC NHẬN ĐÃ CHUYỂN" ---
    els.btnZaloModal.addEventListener('click', (e) => {
        e.preventDefault(); // Ngăn trình duyệt mở link ngay lập tức

        // 1. Hiển thị thông báo cảm ơn
        alert("Cảm ơn quý khách đã tin tưởng và ủng hộ. Hẹn gặp quý khách lần sau!");

        // 2. Lấy đường dẫn Zalo đã tạo ở trên
        const targetUrl = els.btnZaloModal.getAttribute('href');

        // 3. Mở Zalo trong tab mới
        if (targetUrl) {
            window.open(targetUrl, '_blank');
        }

        // 4. Đóng modal sau khi khách xác nhận
        modalActions.close();
    });
    // ----------------------------------------------------


    // Xử lý sao chép (Copy)
    async function handleCopy(text, btnElement) {
        try {
            await navigator.clipboard.writeText(text);
            const originalHtml = btnElement.innerHTML;
            btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Đã chép';
            btnElement.style.color = '#0068ff';
            setTimeout(() => {
                btnElement.innerHTML = originalHtml;
                btnElement.style.color = '';
            }, 2000);
        } catch (err) { console.error(err); }
    }
    if(els.btnCopyAccount) els.btnCopyAccount.addEventListener('click', function() { handleCopy(CONFIG.ACCOUNT_NO, this); });
    if(els.btnCopyAmount) els.btnCopyAmount.addEventListener('click', function() { if(currentOrderState) handleCopy(currentOrderState.amountStr, this); });


    // Hiệu ứng cuộn trang (Scroll Animation)
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const animatedElements = document.querySelectorAll('.hero, .calculator-section, .process, .testimonials, footer');
    animatedElements.forEach(el => { el.classList.add('hidden-element'); observer.observe(el); });
    
    document.querySelectorAll('.step-item').forEach((el, index) => {
        el.classList.add('hidden-element'); el.style.transitionDelay = `${index * 100}ms`; observer.observe(el);
    });
    document.querySelectorAll('.review-card').forEach((el, index) => {
        el.classList.add('hidden-element'); el.style.transitionDelay = `${index * 100}ms`; observer.observe(el);
    });

    // Thông báo ảo (Fake Notification)
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi'];
    const middleNames = ['Văn', 'Thị', 'Hữu', 'Đức', 'Ngọc', 'Thanh', 'Minh', 'Quốc'];
    const lastNames = ['Anh', 'Tuấn', 'Hùng', 'Dũng', 'Nam', 'Hương', 'Lan', 'Hoa', 'Trang'];
    function getRandomName() {
        const f = firstNames[Math.floor(Math.random() * firstNames.length)];
        const m = middleNames[Math.floor(Math.random() * middleNames.length)];
        const l = lastNames[Math.floor(Math.random() * lastNames.length)];
        return Math.random() > 0.3 ? `${f} ${m} ${l}` : `${f} ${l}`;
    }
    const times = ['Vừa xong', '1 phút trước', '2 phút trước', '30 giây trước'];
    
    function createNotification() {
        const name = getRandomName();
        const coinAmount = [1000, 2000, 3000, 5000, 10000, 20000][Math.floor(Math.random() * 6)];
        const time = times[Math.floor(Math.random() * times.length)];
        const notifyDiv = document.createElement('div');
        notifyDiv.classList.add('notify-item');
        notifyDiv.innerHTML = `<i class="fa-solid fa-bell" style="color: #ffd700; font-size: 1.2em;"></i><div><strong>${name}</strong> vừa nạp <strong style="color: #00f2ea;">${numberFormatter.format(coinAmount)} Xu</strong><br><span style="font-size: 0.9em; color: #ccc;">${time}</span></div>`;
        document.getElementById('notification-area').appendChild(notifyDiv);
        setTimeout(() => notifyDiv.remove(), 5000);
    }
    function randomLoop() { setTimeout(() => { createNotification(); randomLoop(); }, Math.round(Math.random() * (7000 - 3000)) + 3000); }
    randomLoop();


    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const btnMute24h = document.getElementById('btnMute24h');
    const btnUnderstand = document.getElementById('btnUnderstood');
    const btnCloseWelcome = document.getElementById('btnCloseWelcome');
    const STORAGE_KEY = 'welcome_popup_hidden_until';

    function showWelcomePopup() {
        const hiddenUntil = localStorage.getItem(STORAGE_KEY);
        const now = new Date().getTime();

        if (!hiddenUntil || now > parseInt(hiddenUntil)) {
            setTimeout(() => {
                welcomeOverlay.classList.add('show');
            }, 1000); 
        }
    }

    function closeWelcomePopup() {
        welcomeOverlay.classList.remove('show');
    }

    if(btnUnderstand) btnUnderstand.addEventListener('click', closeWelcomePopup);
    if(btnCloseWelcome) btnCloseWelcome.addEventListener('click', closeWelcomePopup);
    if(welcomeOverlay) welcomeOverlay.addEventListener('click', (e) => {
        if (e.target === welcomeOverlay) closeWelcomePopup();
    });

    if(btnMute24h) btnMute24h.addEventListener('click', () => {
        const nextShowTime = new Date().getTime() + (24 * 60 * 60 * 1000); 
        localStorage.setItem(STORAGE_KEY, nextShowTime);
        closeWelcomePopup();
    });

    showWelcomePopup();
});