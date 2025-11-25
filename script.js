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
        .custom-alert-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85); z-index: 999999;
            display: flex; justify-content: center; align-items: center;
            opacity: 0; visibility: hidden; transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        .custom-alert-overlay.show { opacity: 1; visibility: visible; }
        .custom-alert-box {
            background: #1e1e1e; width: 90%; max-width: 400px;
            padding: 30px; border-radius: 20px; text-align: center;
            border: 1px solid rgba(0, 242, 234, 0.3);
            box-shadow: 0 0 30px rgba(0, 242, 234, 0.15);
            transform: scale(0.8); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .custom-alert-overlay.show .custom-alert-box { transform: scale(1); }
        .success-icon {
            width: 70px; height: 70px; background: rgba(0, 255, 128, 0.1);
            border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;
            color: #00e676; font-size: 2.5rem; border: 2px solid #00e676;
            animation: bounceIn 0.8s;
        }
        .alert-title { color: white; font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; }
        .alert-desc { color: #b0b0b0; font-size: 0.95rem; margin-bottom: 25px; line-height: 1.5; }
        .btn-zalo-now {
            background: linear-gradient(45deg, #0068ff, #0099ff); color: white;
            padding: 12px 25px; border-radius: 50px; text-decoration: none;
            font-weight: bold; display: inline-block; width: 100%;
            box-shadow: 0 5px 15px rgba(0, 104, 255, 0.4); transition: 0.3s;
        }
        .btn-zalo-now:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 104, 255, 0.6); }
        @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
    `;
    document.head.appendChild(styleSheet);


    function showSuccessAlert(zaloLink) {

        const oldAlert = document.getElementById('customSuccessAlert');
        if (oldAlert) oldAlert.remove();

        const overlay = document.createElement('div');
        overlay.id = 'customSuccessAlert';
        overlay.className = 'custom-alert-overlay';
        overlay.innerHTML = `
            <div class="custom-alert-box">
                <div class="success-icon"><i class="fa-solid fa-check"></i></div>
                <h3 class="alert-title">Đã Xác Thực!</h3>
                <p class="alert-desc">Cảm ơn bạn đã tin tưởng dịch vụ.<br>Vui lòng nhấn nút bên dưới để gửi tin nhắn xác nhận số xu qua Zalo cho Admin nhé!</p>
                <a href="${zaloLink}" target="_blank" class="btn-zalo-now" id="btnRealZalo">
                    <i class="fa-solid fa-paper-plane"></i> MỞ ZALO NGAY
                </a>
            </div>
        `;
        document.body.appendChild(overlay);


        setTimeout(() => overlay.classList.add('show'), 10);


        document.getElementById('btnRealZalo').addEventListener('click', () => {
             setTimeout(() => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 300);
             }, 500); 
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

        els.modalAmount.innerText = vndFormatter.format(amount);
        const qrUrl = `https://img.vietqr.io/image/${CONFIG.BANK_ID}-${CONFIG.ACCOUNT_NO}-${CONFIG.TEMPLATE}.png?amount=${amount}`;
        els.modalQrImage.src = qrUrl;


        const formattedCoins = numberFormatter.format(coins);
        const zaloMsg = `Chào Admin, mình vừa chuyển khoản ${vndFormatter.format(amount)} để mua ${formattedCoins} Xu TikTok. Check và nạp giúp mình nhé!`;
        const finalZaloLink = `https://zalo.me/${CONFIG.ZALO_PHONE}?text=${encodeURIComponent(zaloMsg)}`;
        

        els.btnZaloModal.dataset.zaloLink = finalZaloLink;

        modalActions.open();
    });


    els.btnZaloModal.addEventListener('click', (e) => {
        e.preventDefault(); 
        

        modalActions.close();

        const zaloLink = els.btnZaloModal.dataset.zaloLink;


        if(zaloLink) {
            showSuccessAlert(zaloLink);
        }
    });



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
