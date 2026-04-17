// --- KHỞI TẠO AOS ANIMATION ---
AOS.init({ duration: 800, once: true, offset: 100 });

// --- BIẾN GLOBAL ---
var audio = document.getElementById("bg-music");
var vinyl = document.getElementById("vinyl");
var overlay = document.getElementById("intro-overlay");

// --- MỞ THIỆP ---
function openInvitation() {
    document.getElementById("intro-overlay").classList.add("is-open");
    document.body.classList.remove("no-scroll");

    setTimeout(function() { 
        if (audio.paused) playMusic(); 
    }, 600);
}

// --- NHẠC NỀN ---
function playMusic() {
    audio.play()
        .then(function() { vinyl.classList.add("spinning"); })
        .catch(function() { vinyl.classList.remove("spinning"); });
}

function toggleMusic() {
    if (audio.paused) {
        playMusic();
    } else {
        audio.pause();
        vinyl.classList.remove("spinning");
    }
}

// --- COPY SỐ TÀI KHOẢN ---
function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(function() {
        var originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i> Đã sao chép';
        btnElement.style.background = "#4CAF50";
        btnElement.style.color = "#fff";
        
        setTimeout(function() {
            btnElement.innerHTML = originalText;
            btnElement.style.background = "#f0f0f0";
            btnElement.style.color = "#555";
        }, 2000);
    }, function(err) {
        console.error('Không thể sao chép', err);
    });
}

// --- ĐẾM NGƯỢC ---
var targetDate = new Date("Jan 11, 2026 11:00:00").getTime();

var countdownInterval = setInterval(function() {
    var now = new Date().getTime();
    var distance = targetDate - now;

    var d = Math.floor(distance / (1000 * 60 * 60 * 24));
    var h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((distance % (1000 * 60)) / 1000);

    if (document.getElementById("intro-days")) {
        document.getElementById("intro-days").innerText = d < 10 ? "0" + d : d;
        document.getElementById("intro-hours").innerText = h < 10 ? "0" + h : h;
        document.getElementById("intro-minutes").innerText = m < 10 ? "0" + m : m;
        document.getElementById("intro-seconds").innerText = s < 10 ? "0" + s : s;
    }

    if (distance < 0) {
        clearInterval(countdownInterval);
    }
}, 1000);

// --- GỬI FORM VỀ GOOGLE SHEET ---
var scriptURL = 'https://script.google.com/macros/s/AKfycbyQvE3D1wH35X2kkRQl_u9mNWMOMSeg2cDPsA3BoP3A-Q6IJfZbhqEDqFHRYfVIyppegw/exec';

var form = document.forms['wedding-form'];
var msgBox = document.getElementById("form-message");
var btnSubmit = document.querySelector(".submit-btn");

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    btnSubmit.disabled = true;
    msgBox.style.display = "none";

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(function(response) {
            msgBox.style.display = "block";
            msgBox.innerHTML = '<span class="msg-success"><i class="fas fa-check-circle"></i> Cảm ơn bạn! Chúng mình đã nhận được thông tin.</span>';
            btnSubmit.innerHTML = '<i class="fas fa-check"></i> Đã Gửi Xong';
            form.reset();
        })
        .catch(function(error) {
            msgBox.style.display = "block";
            msgBox.innerHTML = '<span class="msg-error">Có lỗi xảy ra! Bạn vui lòng thử lại hoặc nhắn tin trực tiếp nhé.</span>';
            btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi Lại';
            btnSubmit.disabled = false;
            console.error('Error!', error.message);
        });
});
