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


    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        /* Overlay chung */
        .custom-alert-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85); z-index: 999999;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; visibility: hidden; transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        .custom-alert-overlay.show { opacity: 1; visibility: visible; }
        
        /* Hộp thông báo */
        .custom-alert-box {
            background: #1e1e1e; width: 90%; max-width: 420px;
            padding: 30px; border-radius: 20px; text-align: center;
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
            transform: scale(0.8); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
        }
        .custom-alert-overlay.show .custom-alert-box { transform: scale(1); }

        /* Style cho Success (Cảm ơn) */
        .box-success { border: 1px solid rgba(0, 242, 234, 0.3); box-shadow: 0 0 30px rgba(0, 242, 234, 0.15); }
        .success-icon {
            width: 70px; height: 70px; background: rgba(0, 255, 128, 0.1);
            border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;
            color: #00e676; font-size: 2.5rem; border: 2px solid #00e676;
            animation: bounceIn 0.8s;
        }

        /* Style cho Warning (Cảnh báo lỗi) */
        .box-warning { border: 1px solid rgba(255, 0, 80, 0.3); box-shadow: 0 0 30px rgba(255, 0, 80, 0.15); }
        .warning-icon {
            width: 70px; height: 70px; background: rgba(255, 0, 80, 0.1);
            border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;
            color: #ff0050; font-size: 2.5rem; border: 2px solid #ff0050;
            animation: shake 0.5s;
        }

        /* Text & Button */
        .alert-title { color: white; font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; }
        .alert-desc { color: #b0b0b0; font-size: 0.95rem; margin-bottom: 25px; line-height: 1.5; }
        .alert-note { display: block; margin-top: 10px; font-size: 0.85rem; color: #ffd700; font-style: italic;}
        
        .btn-alert-action {
            padding: 14px 25px; border-radius: 50px; text-decoration: none;
            font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;
            transition: 0.3s; cursor: pointer; border: none; font-size: 1rem; outline: none;
        }
        /* Nút xanh Zalo */
        .btn-zalo-style { background: linear-gradient(45deg, #0068ff, #0099ff); color: white; box-shadow: 0 5px 15px rgba(0, 104, 255, 0.4); }
        .btn-zalo-style:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 104, 255, 0.6); }
        
        /* Nút đóng cảnh báo */
        .btn-close-style { background: #333; color: white; border: 1px solid #444; }
        .btn-close-style:hover { background: #444; transform: translateY(-2px); }

        @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    `;
    document.head.appendChild(styleSheet);



    function showWarningAlert(message) {

        const oldAlert = document.getElementById('customAlertOverlay');
        if (oldAlert) oldAlert.remove();

        const overlay = document.createElement('div');
        overlay.id = 'customAlertOverlay';
        overlay.className = 'custom-alert-overlay';
        
        overlay.innerHTML = `
            <div class="custom-alert-box box-warning">
                <div class="warning-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <h3 class="alert-title">Thông Báo</h3>
                <p class="alert-desc">${message}</p>
                <button class="btn-alert-action btn-close-style" id="btnCloseAlert">
                    <i class="fa-solid fa-xmark"></i> Đóng lại
                </button>
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => overlay.classList.add('show'), 10);


        const closeBtn = document.getElementById('btnCloseAlert');
        const closeAction = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
            els.coinInput.focus(); 
        };
        
        closeBtn.addEventListener('click', closeAction);
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay) closeAction();
        });
    }



    function showSuccessAlert(zaloLink, rawMessage) {
        const oldAlert = document.getElementById('customAlertOverlay');
        if (oldAlert) oldAlert.remove();

        const overlay = document.createElement('div');
        overlay.id = 'customAlertOverlay';
        overlay.className = 'custom-alert-overlay';
        
        overlay.innerHTML = `
            <div class="custom-alert-box box-success">
                <div class="success-icon"><i class="fa-solid fa-check"></i></div>
                <h3 class="alert-title">Đã Xác Thực!</h3>
                <p class="alert-desc">
                    Hệ thống đã tự động sao chép nội dung chuyển khoản.
                    <p class="alert-desc">Cảm ơn bạn đã tin tưởng dịch vụ.<br>Vui lòng nhấn nút bên dưới để gửi tin nhắn xác nhận số xu qua Zalo cho Admin nhé!</p>
                    <span class="alert-note"><i class="fa-solid fa-circle-info"></i> Bạn vui lòng nhấn "Dán" (Paste) vào ô chat Zalo nhé!</span>
                </p>
                <button class="btn-alert-action btn-zalo-style" id="btnRealZalo">
                    <i class="fa-solid fa-paper-plane"></i> MỞ ZALO & DÁN TIN NHẮN
                </button>
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => overlay.classList.add('show'), 10);

        document.getElementById('btnRealZalo').addEventListener('click', async () => {
             try { await navigator.clipboard.writeText(rawMessage); } catch (err) {}
             window.open(zaloLink, '_blank');
             setTimeout(() => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 300);
             }, 1000);
        });
    }



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

    const modalActions = {
        open: () => { els.paymentModal.classList.add('show'); document.body.style.overflow = 'hidden'; },
        close: () => { els.paymentModal.classList.remove('show'); document.body.style.overflow = ''; }
    };
    els.closeModalBtn.addEventListener('click', modalActions.close);
    window.addEventListener('click', (e) => { if (e.target === els.paymentModal) modalActions.close(); });



    els.btnShowModal.addEventListener('click', () => {
        const coins = parseFloat(els.coinInput.value);
        

        if (!coins || coins < 10) {
            showWarningAlert('Vui lòng nhập tối thiểu 10 xu bạn nhé!');
            return;
        }

        const { total } = calculatePrice(coins);
        const amount = Math.round(total);
        currentOrderState = { amountStr: amount.toString() };

        els.modalAmount.innerText = vndFormatter.format(amount);
        const qrUrl = `https://img.vietqr.io/image/${CONFIG.BANK_ID}-${CONFIG.ACCOUNT_NO}-${CONFIG.TEMPLATE}.png?amount=${amount}`;
        els.modalQrImage.src = qrUrl;

        const formattedCoins = numberFormatter.format(coins);
        const rawMsg = `Chào Admin, mình vừa chuyển khoản ${vndFormatter.format(amount)} để mua ${formattedCoins} Xu TikTok. Check và nạp giúp mình nhé!`;
        const finalZaloLink = `https://zalo.me/${CONFIG.ZALO_PHONE}?text=${encodeURIComponent(rawMsg)}`;
        
        els.btnZaloModal.dataset.zaloLink = finalZaloLink;
        els.btnZaloModal.dataset.rawMsg = rawMsg;

        modalActions.open();
    });


    els.btnZaloModal.addEventListener('click', (e) => {
        e.preventDefault(); 
        modalActions.close();
        const zaloLink = els.btnZaloModal.dataset.zaloLink;
        const rawMsg = els.btnZaloModal.dataset.rawMsg;
        if(zaloLink && rawMsg) showSuccessAlert(zaloLink, rawMsg);
    });



    async function handleCopy(text, btnElement) {
        try {
            await navigator.clipboard.writeText(text);
            const originalHtml = btnElement.innerHTML;
            btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Đã chép';
            btnElement.style.color = '#0068ff';
            setTimeout(() => { btnElement.innerHTML = originalHtml; btnElement.style.color = ''; }, 2000);
        } catch (err) {}
    }
    if(els.btnCopyAccount) els.btnCopyAccount.addEventListener('click', function() { handleCopy(CONFIG.ACCOUNT_NO, this); });
    if(els.btnCopyAmount) els.btnCopyAmount.addEventListener('click', function() { if(currentOrderState) handleCopy(currentOrderState.amountStr, this); });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('show'); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.15 });

    const animatedElements = document.querySelectorAll('.hero, .calculator-section, .process, .testimonials, footer');
    animatedElements.forEach(el => { el.classList.add('hidden-element'); observer.observe(el); });
    document.querySelectorAll('.step-item, .review-card').forEach((el, index) => {
        el.classList.add('hidden-element'); el.style.transitionDelay = `${index * 100}ms`; observer.observe(el);
    });


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
        const coinAmount = [10, 20, 50, 100, 1000, 5000][Math.floor(Math.random() * 6)];
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
            setTimeout(() => { welcomeOverlay.classList.add('show'); }, 1000); 
        }
    }
    function closeWelcomePopup() { welcomeOverlay.classList.remove('show'); }

    if(btnUnderstand) btnUnderstand.addEventListener('click', closeWelcomePopup);
    if(btnCloseWelcome) btnCloseWelcome.addEventListener('click', closeWelcomePopup);
    if(welcomeOverlay) welcomeOverlay.addEventListener('click', (e) => { if (e.target === welcomeOverlay) closeWelcomePopup(); });
    if(btnMute24h) btnMute24h.addEventListener('click', () => {
        const nextShowTime = new Date().getTime() + (24 * 60 * 60 * 1000); 
        localStorage.setItem(STORAGE_KEY, nextShowTime);
        closeWelcomePopup();
    });
    showWelcomePopup();
});
