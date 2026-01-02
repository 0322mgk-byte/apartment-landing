// ==================== 전역 변수 ====================
let selectedAge = null;

// ==================== DOM 요소 ====================
const stickyCta = document.getElementById('stickyCta');
const leadFormSection = document.getElementById('leadForm');
const consultationForm = document.getElementById('consultationForm');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const todayCountElement = document.getElementById('todayCount');

// ==================== 초기화 ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeAgeButtons();
    initializePhoneInput();
    initializeFormValidation();
    initializeScrollAnimations();
    initializeIntersectionObserver();
    animateTodayCount();
});

// ==================== 연령대 선택 버튼 ====================
function initializeAgeButtons() {
    const ageButtons = document.querySelectorAll('.age-btn');
    const ageInput = document.getElementById('ageGroup');
    const ageError = document.getElementById('ageError');

    ageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 버튼 비활성화
            ageButtons.forEach(btn => btn.classList.remove('active'));

            // 클릭된 버튼 활성화
            this.classList.add('active');

            // 값 저장
            selectedAge = this.dataset.age;
            ageInput.value = selectedAge;

            // 에러 메시지 제거
            ageError.textContent = '';

            // Bounce 애니메이션
            this.style.animation = 'bounce 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

// ==================== 전화번호 자동 하이픈 ====================
function initializePhoneInput() {
    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');

        if (value.length <= 3) {
            e.target.value = value;
        } else if (value.length <= 7) {
            e.target.value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
    });
}

// ==================== 폼 유효성 검사 ====================
function initializeFormValidation() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');

    // 실시간 유효성 검사
    nameInput.addEventListener('blur', function() {
        validateName(this);
    });

    phoneInput.addEventListener('blur', function() {
        validatePhone(this);
    });

    // 입력 시 valid/invalid 클래스 제거
    nameInput.addEventListener('input', function() {
        this.classList.remove('valid', 'invalid');
        document.getElementById('nameError').textContent = '';
    });

    phoneInput.addEventListener('input', function() {
        this.classList.remove('valid', 'invalid');
        document.getElementById('phoneError').textContent = '';
    });
}

function validateName(input) {
    const nameError = document.getElementById('nameError');
    const value = input.value.trim();

    if (value.length < 2) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        nameError.textContent = '이름은 2글자 이상 입력해주세요.';
        return false;
    } else {
        input.classList.add('valid');
        input.classList.remove('invalid');
        nameError.textContent = '';
        showCheckmark(input);
        return true;
    }
}

function validatePhone(input) {
    const phoneError = document.getElementById('phoneError');
    const value = input.value;
    const pattern = /^010-\d{4}-\d{4}$/;

    if (!pattern.test(value)) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        phoneError.textContent = '올바른 전화번호를 입력해주세요';
        return false;
    } else {
        input.classList.add('valid');
        input.classList.remove('invalid');
        phoneError.textContent = '';
        showCheckmark(input);
        return true;
    }
}

function showCheckmark(input) {
    // 체크마크 애니메이션 효과 제거 (녹색 테두리 없음)
}

// ==================== 폼 제출 ====================
consultationForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // 연령대 체크
    if (!selectedAge) {
        const ageError = document.getElementById('ageError');
        ageError.textContent = '연령대를 선택해주세요.';
        document.querySelector('.age-group-buttons').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // 이름 체크
    const nameInput = document.getElementById('name');
    if (!validateName(nameInput)) {
        nameInput.focus();
        return;
    }

    // 전화번호 체크
    const phoneInput = document.getElementById('phone');
    if (!validatePhone(phoneInput)) {
        phoneInput.focus();
        return;
    }

    // 개인정보 동의 체크
    const privacyAgree = document.getElementById('privacyAgree');
    const privacyError = document.getElementById('privacyError');
    if (!privacyAgree.checked) {
        privacyError.textContent = '개인정보 수집 및 이용에 동의해주세요.';
        privacyAgree.focus();
        return;
    } else {
        privacyError.textContent = '';
    }

    // 폼 데이터 수집
    const formData = {
        ageGroup: selectedAge,
        name: nameInput.value.trim(),
        phone: phoneInput.value,
        callTime: document.querySelector('input[name="callTime"]:checked').value
    };

    // 버튼 상태 변경
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.loading-spinner').style.display = 'inline-block';

    try {
        // API 호출 시뮬레이션 (실제로는 백엔드 API로 전송)
        await submitFormData(formData);

        // 성공 처리
        submitBtn.querySelector('.loading-spinner').style.display = 'none';
        submitBtn.querySelector('.success-check').style.display = 'inline-block';

        setTimeout(() => {
            showSuccessModal();
            resetForm();
        }, 500);

    } catch (error) {
        // 에러 처리
        alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        submitBtn.disabled = false;
        submitBtn.querySelector('.loading-spinner').style.display = 'none';
        submitBtn.querySelector('.btn-text').style.display = 'inline-block';
    }
});

async function submitFormData(data) {
    // Google Apps Script 웹 앱 URL (config.js에서 로드)
    const GOOGLE_SCRIPT_URL = typeof CONFIG !== 'undefined' ? CONFIG.GOOGLE_SCRIPT_URL : '';

    console.log('폼 데이터 제출:', data);

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // CORS 우회
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // no-cors 모드에서는 응답을 읽을 수 없으므로 성공으로 간주
        return { success: true };

    } catch (error) {
        console.error('제출 오류:', error);
        throw error;
    }
}

function resetForm() {
    consultationForm.reset();
    selectedAge = null;

    // 연령대 버튼 초기화
    document.querySelectorAll('.age-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 입력 필드 클래스 초기화
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('valid', 'invalid');
    });

    // 버튼 상태 초기화
    submitBtn.disabled = false;
    submitBtn.querySelector('.success-check').style.display = 'none';
    submitBtn.querySelector('.btn-text').style.display = 'inline-block';
}

// ==================== 성공 모달 ====================
function showSuccessModal() {
    successModal.classList.add('active');
}

function closeModal() {
    successModal.classList.remove('active');
}

// 모달 외부 클릭 시 닫기
successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeModal();
    }
});

// ==================== 스크롤 애니메이션 ====================
function initializeScrollAnimations() {
    // 카카오톡 플로팅 버튼 표시/숨김
    const kakaoFloatingBtn = document.querySelector('.kakao-floating-btn');
    const footer = document.querySelector('.footer');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 리드폼 섹션이 화면에 보이는지 확인
        const formRect = leadFormSection.getBoundingClientRect();
        const isFormVisible = formRect.top < window.innerHeight;

        // 푸터가 화면에 보이는지 확인
        const footerRect = footer.getBoundingClientRect();
        const isFooterVisible = footerRect.top < window.innerHeight;

        // 리드폼이 보이고 푸터가 보이지 않을 때만 버튼 표시
        if (isFormVisible && !isFooterVisible) {
            kakaoFloatingBtn.classList.add('visible');
        } else {
            kakaoFloatingBtn.classList.remove('visible');
        }

        lastScrollTop = scrollTop;
    });
}

function scrollToForm() {
    leadFormSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    // 첫 번째 입력 필드에 포커스
    setTimeout(() => {
        if (!selectedAge) {
            document.querySelector('.age-btn').focus();
        } else {
            document.getElementById('name').focus();
        }
    }, 500);
}

// ==================== Intersection Observer ====================
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // 리드폼 섹션 애니메이션
    const formObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    formObserver.observe(leadFormSection);

    // 콘텐츠 카드 애니메이션 (스태거)
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // 0.1초 간격으로 순차 표시
            }
        });
    }, observerOptions);

    document.querySelectorAll('.content-card').forEach(card => {
        cardObserver.observe(card);
    });
}

// ==================== 오늘 상담 신청 수 애니메이션 ====================
function animateTodayCount() {
    const targetCount = 23;
    const startCount = Math.max(1, targetCount - 5);
    let currentCount = startCount;

    const interval = setInterval(() => {
        if (currentCount >= targetCount) {
            clearInterval(interval);
            return;
        }

        currentCount++;
        todayCountElement.textContent = currentCount;
    }, 200);
}

// ==================== Bounce 애니메이션 ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// ==================== 유틸리티 함수 ====================

// 페이지 로드 시 스크롤 위치 복원 (HMR을 위해 자동으로 유지)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
}

// 디버깅용 콘솔 로그
console.log('🎯 군산 성원상떼빌 랜딩페이지 초기화 완료');
console.log('📱 최대 너비: 1080px (모바일 최적화)');
