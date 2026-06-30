// Audio Context for Sounds
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
}

function playSuccessSound() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

function playErrorSound() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

// State Management
const app = {
    mode: '', // 'practice' or 'exam'
    activeQuestions: [],
    currentIndex: 0,
    userAnswers: {},
    flaggedQuestions: {}, // Lưu trạng thái đánh dấu câu hỏi
    gridFilter: 'all', // 'all', 'done', 'undone', 'flagged'
    timerInterval: null,
    timeRemaining: 0,
    startTime: null, // Lưu thời gian bắt đầu làm bài
    studentName: '',
    settings: {
        showAnswerImmediate: false,
        shuffleOptions: true
    },
    isReviewing: false,
    currentExamSetIndex: null,
    selectedExamSetIndex: null,

    init: function() {
        // Áp dụng theme đã lưu
        this.applyTheme();
        
        // Cập nhật thống kê học tập ở trang chủ
        this.updateHomeStats();
        
        // Nạp lại câu hỏi từ localStorage nếu có bản lưu tạm của việc Import
        const savedImported = localStorage.getItem('savedQuestions');
        if (savedImported) {
            try {
                let loadedQuestions = JSON.parse(savedImported);
                // Lọc sạch câu hỏi rỗng (ví dụ câu 290 trống)
                defaultQuestions = loadedQuestions.filter(q => q.options && Object.keys(q.options).length > 0);
                
                // Đồng bộ và làm sạch lại localStorage nếu phát hiện câu lỗi
                if (loadedQuestions.length !== defaultQuestions.length) {
                    localStorage.setItem('savedQuestions', JSON.stringify(defaultQuestions));
                }
            } catch (e) {
                console.error("Lỗi nạp câu hỏi lưu tạm:", e);
            }
        }

        // Kiểm tra và buộc nhập tên học sinh
        const savedName = localStorage.getItem('studentName');
        if (!savedName) {
            window.location.href = 'index.html';
            return;
        }
        this.studentName = savedName;
        this.updateUserBadge();
    },

    updateUserBadge: function() {
        const badge = document.getElementById('user-badge');
        const nameText = document.getElementById('user-display-name');
        if (badge && nameText) {
            if (this.studentName) {
                nameText.innerText = this.studentName;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    changeName: function() {
        window.location.href = 'index.html?change=true';
    },

    toggleTheme: function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('appTheme', newTheme);
        
        this.updateThemeToggleUI(newTheme);
    },
    
    applyTheme: function() {
        const savedTheme = localStorage.getItem('appTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeToggleUI(savedTheme);
    },
    
    updateThemeToggleUI: function(theme) {
        const btn = document.getElementById('btn-theme-toggle');
        if (!btn) return;
        
        const icon = btn.querySelector('.theme-icon');
        const text = btn.querySelector('.theme-text');
        
        if (theme === 'dark') {
            icon.innerText = '🌙';
            text.innerText = 'Tối (Dịu mắt)';
        } else {
            icon.innerText = '☀️';
            text.innerText = 'Sáng (Giấy ấm)';
        }
    },

    navigate: function(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        
        if (screenId === 'screen-home') {
            this.resetQuizState();
            this.updateHomeStats();
            
            // Cập nhật lời chào
            const greeting = document.getElementById('home-greeting');
            if (greeting) {
                greeting.innerText = this.studentName 
                    ? `Chào mừng ${this.studentName} đến với giải pháp ôn thi trắc nghiệm tối ưu!`
                    : "Giải pháp ôn thi trắc nghiệm tối ưu dành cho sinh viên";
            }
        } else if (screenId === 'screen-practice-settings') {
            this.initPracticeSettings();
        } else if (screenId === 'screen-data-import') {
            this.renderQuestionManagerList();
        } else if (screenId === 'screen-stats') {
            this.renderStatsScreen();
        } else if (screenId === 'screen-exam-settings') {
            this.initExamSettings();
        }
    },

    confirmExitQuiz: function() {
        let msg = "Bạn có chắc chắn muốn dừng làm bài và quay lại Trang chủ không?";
        if (this.mode === 'exam' && !this.isReviewing) {
            msg = "Bài thi đang tính giờ. Quay lại Trang chủ sẽ hủy kết quả làm bài của bạn. Bạn vẫn muốn tiếp tục?";
        }
        if (confirm(msg)) {
            this.navigate('screen-home');
        }
    },

    resetQuizState: function() {
        this.activeQuestions = [];
        this.currentIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions = {};
        this.gridFilter = 'all';
        this.isReviewing = false;
        this.startTime = null;
        clearInterval(this.timerInterval);
        document.getElementById('sidebar-timer-container').style.display = 'none';
        document.querySelector('.sidebar-submit-btn-container').style.display = 'block';
    },

    initPracticeSettings: function() {
        const totalQs = defaultQuestions.length;
        const toInput = document.getElementById('practice-range-to');
        const fromInput = document.getElementById('practice-range-from');
        const infoSpan = document.getElementById('practice-range-info');
        
        if (toInput && fromInput && infoSpan) {
            fromInput.value = 1;
            toInput.value = totalQs;
            toInput.max = totalQs;
            infoSpan.innerText = `(Tổng số: ${totalQs} câu)`;
        }
        
        // Reset radio buttons to 'all'
        const radioAll = document.querySelector('input[name="practice-range-mode"][value="all"]');
        if (radioAll) {
            radioAll.checked = true;
            this.togglePracticeRangeInputs();
        }
    },
    
    togglePracticeRangeInputs: function() {
        const customRadio = document.querySelector('input[name="practice-range-mode"][value="custom"]');
        const container = document.getElementById('practice-custom-range-inputs');
        if (container && customRadio) {
            container.style.display = customRadio.checked ? 'flex' : 'none';
        }
    },

    shuffleQuestionOptions: function(q, shuffleEnabled) {
        let keys = ['A', 'B', 'C', 'D'];
        
        if (shuffleEnabled) {
            // 1. Kiểm tra tham chiếu chữ cái (ví dụ: "A và B", "phương án C hoặc D")
            let hasLetterReference = false;
            const letterRefRegex = /\b[A-D]\s*(và|hoặc|,)\s*[A-D]\b/i;
            
            keys.forEach(k => {
                if (letterRefRegex.test(q.options[k] || "")) {
                    hasLetterReference = true;
                }
            });
            
            if (!hasLetterReference) {
                // 2. Phân loại đáp án đặc biệt (Tất cả ý trên, Cả 3 đáp án...)
                const specialKeywords = [
                    "tất cả", "đều đúng", "đều sai", 
                    "cả 3", "cả ba", "không có", "tất cả các", "các ý trên", "các phương án trên"
                ];
                
                let normalKeys = [];
                let specialKeys = [];
                
                keys.forEach(k => {
                    const text = (q.options[k] || "").toLowerCase().trim();
                    const isSpecial = specialKeywords.some(keyword => text.includes(keyword));
                    if (isSpecial) {
                        specialKeys.push(k);
                    } else {
                        normalKeys.push(k);
                    }
                });
                
                // 3. Trộn ngẫu nhiên đáp án thường (Fisher-Yates chuẩn)
                for (let i = normalKeys.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [normalKeys[i], normalKeys[j]] = [normalKeys[j], normalKeys[i]];
                }
                
                // 4. Trộn ngẫu nhiên đáp án đặc biệt (nếu có từ 2 trở lên)
                for (let i = specialKeys.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [specialKeys[i], specialKeys[j]] = [specialKeys[j], specialKeys[i]];
                }
                
                // Ghép lại: Thường lên trước, đặc biệt xếp dưới cùng
                keys = [...normalKeys, ...specialKeys];
            }
        }
        
        q.sessionOptionsOrder = keys;
        return keys;
    },

    startPractice: function() {
        initAudio();

        const ch1 = document.getElementById('chap1').checked;
        const ch2 = document.getElementById('chap2').checked;
        const ch3 = document.getElementById('chap3').checked;
        
        let pool = [];
        if (ch1) pool = pool.concat(defaultQuestions.filter(q => q.chapter === 1));
        if (ch2) pool = pool.concat(defaultQuestions.filter(q => q.chapter === 2));
        if (ch3) pool = pool.concat(defaultQuestions.filter(q => q.chapter === 3));

        if (pool.length === 0) {
            alert("Vui lòng chọn ít nhất 1 chương!");
            return;
        }

        // Lọc theo khoảng câu hỏi nếu chọn chế độ custom
        const rangeMode = document.querySelector('input[name="practice-range-mode"]:checked').value;
        if (rangeMode === 'custom') {
            const fromVal = parseInt(document.getElementById('practice-range-from').value) || 1;
            const toVal = parseInt(document.getElementById('practice-range-to').value) || defaultQuestions.length;
            
            if (fromVal > toVal) {
                alert("Số câu bắt đầu không được lớn hơn số câu kết thúc!");
                return;
            }
            
            // Lọc các câu hỏi có ID số học nằm trong khoảng chọn
            pool = pool.filter(q => {
                const idNum = parseInt(q.id) || 0;
                return idNum >= fromVal && idNum <= toVal;
            });
            
            if (pool.length === 0) {
                alert(`Không tìm thấy câu hỏi nào thuộc khoảng từ câu ${fromVal} đến câu ${toVal} của các chương đã chọn!`);
                return;
            }
        }

        this.settings.showAnswerImmediate = document.getElementById('setting-show-answer').value === 'immediate';
        this.settings.shuffleOptions = document.getElementById('setting-shuffle-options').checked;

        this.mode = 'practice';
        this.activeQuestions = pool;
        this.currentIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions = {};
        this.gridFilter = 'all';
        this.startTime = Date.now();

        // Tráo đáp án cố định cho phiên học này
        this.activeQuestions.forEach(q => {
            this.shuffleQuestionOptions(q, this.settings.shuffleOptions);
        });
        
        // Phục hồi tiến độ nếu có
        const savedProgress = localStorage.getItem('practiceProgress');
        if (savedProgress) {
            if (confirm("Bạn có muốn tiếp tục bài ôn tập đang dang dở?")) {
                try {
                    const data = JSON.parse(savedProgress);
                    this.userAnswers = data.userAnswers || {};
                    this.currentIndex = data.currentIndex || 0;
                    this.flaggedQuestions = data.flaggedQuestions || {};
                    this.startTime = data.startTime || Date.now();
                } catch (e) {
                    console.error("Lỗi phục hồi tiến độ:", e);
                }
            }
        }

        document.getElementById('sidebar-timer-container').style.display = 'none';
        document.getElementById('sidebar-mode-badge').innerText = 'Đang Ôn Tập';
        
        // Reset chip active
        document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
        document.getElementById('chip-filter-all').classList.add('active');

        this.navigate('screen-quiz');
        this.renderQuestion();
        this.updateStats();
        this.renderQuestionGrid();
    },

    startExam: function() {
        initAudio();

        const timeSetting = document.querySelector('input[name="exam-time"]:checked').value;
        const totalMinutes = parseInt(timeSetting);

        const examType = document.querySelector('input[name="exam-type-selection"]:checked').value;
        let examQuestions = [];

        if (examType === 'sets') {
            if (this.selectedExamSetIndex === null) {
                alert("Vui lòng chọn một bộ đề!");
                return;
            }
            const sets = this.getExamSets();
            const selectedSet = sets[this.selectedExamSetIndex];
            examQuestions = JSON.parse(JSON.stringify(selectedSet.questions));
            this.currentExamSetIndex = this.selectedExamSetIndex;
        } else {
            const q1 = this.getRandomSubset(defaultQuestions.filter(q => q.chapter === 1), 13);
            const q2 = this.getRandomSubset(defaultQuestions.filter(q => q.chapter === 2), 13);
            const q3 = this.getRandomSubset(defaultQuestions.filter(q => q.chapter === 3), 14);
            examQuestions = [...q1, ...q2, ...q3];
            this.currentExamSetIndex = null;
        }

        // Shuffle the final 40 questions
        examQuestions.sort(() => Math.random() - 0.5);

        this.mode = 'exam';
        this.activeQuestions = examQuestions;
        this.currentIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions = {};
        this.gridFilter = 'all';
        this.settings.showAnswerImmediate = false; // Exam never shows immediate
        this.settings.shuffleOptions = true; // Always shuffle options in exam
        this.startTime = Date.now();

        // Tráo đáp án cố định cho phiên thi này
        this.activeQuestions.forEach(q => {
            this.shuffleQuestionOptions(q, this.settings.shuffleOptions);
        });

        this.timeRemaining = totalMinutes * 60;
        document.getElementById('sidebar-timer-container').style.display = 'block';
        document.getElementById('sidebar-mode-badge').innerText = this.currentExamSetIndex !== null 
            ? `Thi Bộ Đề ${this.currentExamSetIndex + 1}` 
            : 'Đang Thi Thử';
        this.startTimer();
        
        // Reset chip active
        document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
        document.getElementById('chip-filter-all').classList.add('active');

        this.navigate('screen-quiz');
        this.renderQuestion();
        this.updateStats();
        this.renderQuestionGrid();
    },

    getRandomSubset: function(arr, count) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    },

    initExamSettings: function() {
        this.selectedExamSetIndex = null;
        const selectedRadio = document.querySelector('input[name="exam-type-selection"]:checked');
        if (selectedRadio) {
            this.toggleExamTypeSelection();
        } else {
            const randomRadio = document.querySelector('input[name="exam-type-selection"][value="random"]');
            if (randomRadio) {
                randomRadio.checked = true;
            }
            this.toggleExamTypeSelection();
        }
        const startBtn = document.getElementById('btn-start-exam');
        if (startBtn) {
            startBtn.innerText = '⏱️ Bắt Đầu Tính Giờ Làm Bài';
            startBtn.disabled = false;
        }
    },

    toggleExamTypeSelection: function() {
        const val = document.querySelector('input[name="exam-type-selection"]:checked').value;
        const container = document.getElementById('exam-sets-container');
        const startBtn = document.getElementById('btn-start-exam');
        
        if (val === 'sets') {
            container.style.display = 'block';
            this.renderExamSets();
            if (this.selectedExamSetIndex === null) {
                startBtn.innerText = '⏱️ Vui lòng chọn một bộ đề';
                startBtn.disabled = true;
            } else {
                startBtn.innerText = `⏱️ Bắt Đầu Làm Bộ Đề ${this.selectedExamSetIndex + 1}`;
                startBtn.disabled = false;
            }
        } else {
            container.style.display = 'none';
            startBtn.innerText = '⏱️ Bắt Đầu Tính Giờ Làm Bài';
            startBtn.disabled = false;
        }
    },

    renderExamSets: function() {
        const grid = document.getElementById('exam-sets-grid');
        const progressLbl = document.getElementById('exam-sets-progress-lbl');
        if (!grid) return;
        
        const sets = this.getExamSets();
        
        let completedSets = localStorage.getItem('completedExamSets');
        if (completedSets) {
            try { completedSets = JSON.parse(completedSets); } catch (e) { completedSets = {}; }
        } else {
            completedSets = {};
        }
        
        let completedCount = 0;
        grid.innerHTML = '';
        
        sets.forEach(set => {
            const hasCompleted = completedSets[set.index] !== undefined;
            if (hasCompleted) completedCount++;
            
            const card = document.createElement('div');
            card.className = `exam-set-card${this.selectedExamSetIndex === set.index ? ' selected' : ''}`;
            
            let statusHTML = '';
            if (hasCompleted) {
                const scoreVal = completedSets[set.index].score;
                statusHTML = `
                    <span class="exam-set-status completed">✓ Đã làm</span>
                    <span class="exam-set-score">${scoreVal.toFixed(1)}đ</span>
                `;
            } else {
                statusHTML = `
                    <span class="exam-set-status pending">○ Chưa làm</span>
                `;
            }
            
            card.innerHTML = `
                <div class="exam-set-title">${set.name}</div>
                <div class="exam-set-range">Chương 1: 10 câu | Chương 2: 20 câu | Chương 3: 10 câu</div>
                <div class="exam-set-footer">
                    ${statusHTML}
                </div>
            `;
            
            card.onclick = () => {
                this.selectedExamSetIndex = set.index;
                this.renderExamSets();
                
                const startBtn = document.getElementById('btn-start-exam');
                if (startBtn) {
                    startBtn.innerText = `⏱️ Bắt Đầu Làm Bộ Đề ${set.index + 1}`;
                    startBtn.disabled = false;
                }
            };
            
            grid.appendChild(card);
        });
        
        if (progressLbl) {
            progressLbl.innerText = `Tiến trình: ${completedCount}/${sets.length} bộ đề đã hoàn thành`;
        }
    },

    getExamSets: function() {
        const pool1 = defaultQuestions.filter(q => q.chapter === 1);
        const pool2 = defaultQuestions.filter(q => q.chapter === 2);
        const pool3 = defaultQuestions.filter(q => q.chapter === 3);
        
        const n1 = pool1.length;
        const n2 = pool2.length;
        const n3 = pool3.length;
        
        const K = Math.max(
            Math.ceil(n1 / 10),
            Math.ceil(n2 / 20),
            Math.ceil(n3 / 10)
        );
        
        const getIndicesForPool = (poolSize, targetCount, setIndex, totalSets) => {
            const indices = [];
            if (poolSize === 0) return indices;
            
            if (poolSize >= targetCount) {
                let start = 0;
                if (totalSets > 1) {
                    start = Math.round(setIndex * (poolSize - targetCount) / (totalSets - 1));
                }
                for (let j = 0; j < targetCount; j++) {
                    indices.push(start + j);
                }
            } else {
                for (let j = 0; j < targetCount; j++) {
                    indices.push(j % poolSize);
                }
            }
            return indices;
        };
        
        const sets = [];
        for (let i = 0; i < K; i++) {
            const indices1 = getIndicesForPool(n1, 10, i, K);
            const indices2 = getIndicesForPool(n2, 20, i, K);
            const indices3 = getIndicesForPool(n3, 10, i, K);
            
            const qs1 = indices1.map(idx => pool1[idx]);
            const qs2 = indices2.map(idx => pool2[idx]);
            const qs3 = indices3.map(idx => pool3[idx]);
            
            sets.push({
                index: i,
                name: `Bộ đề thi thử ${i + 1}`,
                questions: [...qs1, ...qs2, ...qs3]
            });
        }
        
        return sets;
    },

    startTimer: function() {
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                alert("Đã hết thời gian làm bài!");
                this.submitQuiz(true); // force submit
            }
        }, 1000);
    },

    updateTimerDisplay: function() {
        const m = Math.floor(this.timeRemaining / 60).toString().padStart(2, '0');
        const s = (this.timeRemaining % 60).toString().padStart(2, '0');
        document.getElementById('quiz-timer').innerText = `${m}:${s}`;
    },

    renderQuestion: function() {
        const q = this.activeQuestions[this.currentIndex];
        if (!q) return;
        
        // Hiển thị tiến trình làm bài
        document.getElementById('quiz-progress').innerText = `Câu ${this.currentIndex + 1}/${this.activeQuestions.length}`;
        const pct = ((this.currentIndex + 1) / this.activeQuestions.length) * 100;
        document.getElementById('progress-bar').style.width = `${pct}%`;

        // Ghi tiêu đề câu hỏi và chương
        document.getElementById('question-chapter-badge').innerText = `Chương ${q.chapter}`;
        document.getElementById('question-id-lbl').innerText = `Câu ${q.id}`;
        
        // Ẩn mã câu hỏi và chương trong chế độ thi thử (trừ khi đang xem lại kết quả)
        if (this.mode === 'exam' && !this.isReviewing) {
            document.getElementById('question-chapter-badge').style.display = 'none';
            document.getElementById('question-id-lbl').style.display = 'none';
        } else {
            document.getElementById('question-chapter-badge').style.display = 'inline-block';
            document.getElementById('question-id-lbl').style.display = 'inline-block';
        }

        document.getElementById('question-text').innerText = q.text.replace(/\[CHƯA CÓ NỘI DUNG\].*$/, '');

        // Quản lý nút Đánh dấu (Flag)
        const btnFlag = document.getElementById('btn-flag');
        const isFlagged = !!this.flaggedQuestions[this.currentIndex];
        if (isFlagged) {
            btnFlag.classList.add('flagged');
            btnFlag.querySelector('.flag-text').innerText = 'Đã đánh dấu';
        } else {
            btnFlag.classList.remove('flagged');
            btnFlag.querySelector('.flag-text').innerText = 'Đánh dấu câu này';
        }

        if (this.isReviewing) {
            btnFlag.style.opacity = '0.5';
            btnFlag.style.pointerEvents = 'none';
        } else {
            btnFlag.style.opacity = '1';
            btnFlag.style.pointerEvents = 'auto';
        }

        // Tạo danh sách đáp án
        const container = document.getElementById('options-container');
        container.innerHTML = '';

        // Đọc thứ tự đáp án cố định của câu này trong phiên này
        let keys = q.sessionOptionsOrder;
        if (!keys) {
            keys = this.shuffleQuestionOptions(q, this.settings.shuffleOptions);
        }

        keys.forEach((k, index) => {
            const displayLetter = ['A', 'B', 'C', 'D'][index]; // Lọc ký tự hiển thị A, B, C, D
            this.createOptionButton(container, q, k, q.options[k], displayLetter);
        });

        // Điều chỉnh vô hiệu hóa nút chuyển câu
        document.getElementById('btn-prev').disabled = this.currentIndex === 0;
        document.getElementById('btn-next').disabled = this.currentIndex === this.activeQuestions.length - 1;

        // Lưu tạm tiến độ nếu đang ở chế độ ôn tập
        if (this.mode === 'practice' && !this.isReviewing) {
            localStorage.setItem('practiceProgress', JSON.stringify({
                userAnswers: this.userAnswers,
                currentIndex: this.currentIndex,
                flaggedQuestions: this.flaggedQuestions,
                startTime: this.startTime
            }));
        }
    },

    createOptionButton: function(container, q, actualKey, text, displayLetter) {
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        btn.innerHTML = `<div class="option-letter">${displayLetter}</div> <div style="flex:1;">${text}</div>`;
        
        const isSelected = this.userAnswers[this.currentIndex] === actualKey;
        if (isSelected) btn.classList.add('selected');

        const hasImmediateAnswer = this.mode === 'practice' && this.settings.showAnswerImmediate && this.userAnswers[this.currentIndex] !== undefined;

        if (this.isReviewing || hasImmediateAnswer) {
            if (actualKey === q.correct) {
                btn.classList.add('correct');
            } else if (isSelected) {
                btn.classList.add('wrong');
            }
        }

        btn.onclick = () => {
            if (this.isReviewing) return;
            
            // Nếu ôn tập hiển thị ngay mà đã trả lời rồi thì khóa không cho đổi
            if (this.mode === 'practice' && this.settings.showAnswerImmediate && this.userAnswers[this.currentIndex] !== undefined) {
                return;
            }

            this.userAnswers[this.currentIndex] = actualKey;
            
            if (this.settings.showAnswerImmediate) {
                if (actualKey === q.correct) {
                    playSuccessSound();
                } else {
                    playErrorSound();
                }
            }

            this.renderQuestion();
            this.updateStats();
            this.renderQuestionGrid();
        };

        container.appendChild(btn);
    },

    toggleFlagQuestion: function() {
        if (this.isReviewing) return;
        
        const isFlagged = !this.flaggedQuestions[this.currentIndex];
        this.flaggedQuestions[this.currentIndex] = isFlagged;
        
        const btnFlag = document.getElementById('btn-flag');
        if (isFlagged) {
            btnFlag.classList.add('flagged');
            btnFlag.querySelector('.flag-text').innerText = 'Đã đánh dấu';
        } else {
            btnFlag.classList.remove('flagged');
            btnFlag.querySelector('.flag-text').innerText = 'Đánh dấu câu này';
        }
        
        this.updateStats();
        this.renderQuestionGrid();
    },

    updateStats: function() {
        const total = this.activeQuestions.length;
        const done = Object.keys(this.userAnswers).length;
        const flagged = Object.values(this.flaggedQuestions).filter(Boolean).length;
        
        document.getElementById('stat-done').innerText = done;
        document.getElementById('stat-flagged').innerText = flagged;
        document.getElementById('stat-total').innerText = total;
    },

    setGridFilter: function(filter) {
        this.gridFilter = filter;
        
        document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
        document.getElementById(`chip-filter-${filter}`).classList.add('active');
        
        this.renderQuestionGrid();
    },

    renderQuestionGrid: function() {
        const container = document.getElementById('question-grid');
        container.innerHTML = '';
        
        this.activeQuestions.forEach((q, idx) => {
            const isDone = this.userAnswers[idx] !== undefined;
            const isFlagged = !!this.flaggedQuestions[idx];
            
            // Bộ lọc hiển thị câu hỏi
            if (this.gridFilter === 'done' && !isDone) return;
            if (this.gridFilter === 'undone' && isDone) return;
            if (this.gridFilter === 'flagged' && !isFlagged) return;
            
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.innerText = idx + 1;
            
            if (idx === this.currentIndex) item.classList.add('active');
            if (isDone) item.classList.add('done');
            if (isFlagged) item.classList.add('flagged');
            
            // Nếu đang xem lại bài thi
            if (this.isReviewing) {
                if (isDone) {
                    if (this.userAnswers[idx] === q.correct) {
                        item.classList.add('correct');
                    } else {
                        item.classList.add('wrong');
                    }
                } else {
                    item.classList.add('wrong'); // Không trả lời coi như sai
                }
            }
            
            item.onclick = () => {
                this.currentIndex = idx;
                this.renderQuestion();
                this.renderQuestionGrid();
            };
            
            container.appendChild(item);
        });
    },

    nextQuestion: function() {
        if (this.currentIndex < this.activeQuestions.length - 1) {
            this.currentIndex++;
            this.renderQuestion();
            this.renderQuestionGrid();
        }
    },

    prevQuestion: function() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion();
            this.renderQuestionGrid();
        }
    },

    submitQuiz: function(force = false) {
        if (!force && !this.isReviewing && Object.keys(this.userAnswers).length < this.activeQuestions.length) {
            if (!confirm("Bạn chưa làm hết các câu hỏi. Vẫn muốn nộp bài?")) {
                return;
            }
        }

        clearInterval(this.timerInterval);
        
        let correctCount = 0;
        let wrongCount = 0;
        let unansweredCount = 0;
        
        this.activeQuestions.forEach((q, idx) => {
            const userAns = this.userAnswers[idx];
            if (userAns === undefined) {
                unansweredCount++;
            } else if (userAns === q.correct) {
                correctCount++;
            } else {
                wrongCount++;
            }
        });

        const score = (correctCount / this.activeQuestions.length) * 10;
        
        // Tính thời gian làm bài
        const timeSpentSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        const timeMinutes = Math.floor(timeSpentSeconds / 60).toString().padStart(2, '0');
        const timeSeconds = (timeSpentSeconds % 60).toString().padStart(2, '0');
        const timeString = `${timeMinutes} phút ${timeSeconds} giây`;

        // Điền dữ liệu màn hình kết quả
        document.getElementById('score-text').innerText = score.toFixed(2);
        document.getElementById('res-correct').innerText = correctCount;
        document.getElementById('res-wrong').innerText = wrongCount;
        document.getElementById('res-unanswered').innerText = unansweredCount;
        document.getElementById('result-detail').innerText = `Bạn đã trả lời đúng ${correctCount}/${this.activeQuestions.length} câu (${Math.round((correctCount / this.activeQuestions.length) * 100)}%)`;
        document.getElementById('result-time').innerText = `Thời gian thực hiện: ${timeString}`;

        const nameLabel = document.getElementById('result-student-name');
        if (nameLabel) {
            if (this.studentName) {
                nameLabel.innerText = `Thí sinh: ${this.studentName}`;
                nameLabel.style.display = 'block';
            } else {
                nameLabel.style.display = 'none';
            }
        }

        // Cập nhật thống kê câu hỏi sai
        this.updateQuestionStats();

        // Lưu thống kê lịch sử
        this.saveHistoryStats(score, correctCount, wrongCount, unansweredCount, timeString);

        if (this.mode === 'practice') {
            localStorage.removeItem('practiceProgress');
        }

        // Lưu kết quả bộ đề thi thử
        if (this.mode === 'exam' && this.currentExamSetIndex !== null) {
            let completedSets = localStorage.getItem('completedExamSets');
            if (completedSets) {
                try { completedSets = JSON.parse(completedSets); } catch (e) { completedSets = {}; }
            } else {
                completedSets = {};
            }
            const currentRecord = completedSets[this.currentExamSetIndex];
            if (!currentRecord || score > currentRecord.score) {
                completedSets[this.currentExamSetIndex] = {
                    score: score,
                    timestamp: new Date().toLocaleString('vi-VN'),
                    correct: correctCount,
                    total: this.activeQuestions.length
                };
                localStorage.setItem('completedExamSets', JSON.stringify(completedSets));
            }
        }

        // Tạo danh sách câu hỏi đã làm trực quan
        this.renderResultsReviewList();

        this.navigate('screen-results');
    },

    renderResultsReviewList: function() {
        const container = document.getElementById('results-review-list');
        container.innerHTML = '';
        
        this.activeQuestions.forEach((q, idx) => {
            const userAnsKey = this.userAnswers[idx];
            const isCorrect = userAnsKey === q.correct;
            
            let statusClass = 'status-unanswered';
            let statusLabel = 'Bỏ qua';
            if (userAnsKey !== undefined) {
                statusClass = isCorrect ? 'status-correct' : 'status-wrong';
                statusLabel = isCorrect ? 'Đúng' : 'Sai';
            }
            
            const item = document.createElement('div');
            item.className = `review-list-item ${statusClass}`;
            
            const userAnsText = userAnsKey ? `${userAnsKey}. ${q.options[userAnsKey]}` : 'Chưa trả lời';
            const correctAnsText = `${q.correct}. ${q.options[q.correct]}`;
            
            item.innerHTML = `
                <div class="review-q-num">${idx + 1}</div>
                <div class="review-q-body">
                    <div class="review-q-text">Câu ${q.id}: ${q.text.replace(/\[CHƯA CÓ NỘI DUNG\].*$/, '')}</div>
                    <div class="review-q-choices">
                        <span class="choice-box">
                            <span>Lựa chọn của bạn: </span>
                            <strong style="color: ${userAnsKey ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--text-muted)'}">${userAnsText}</strong>
                        </span>
                        ${!isCorrect ? `
                        <span class="choice-box">
                            <span>Đáp án đúng: </span>
                            <strong style="color: var(--success)">${correctAnsText}</strong>
                        </span>` : ''}
                    </div>
                </div>
                <span class="review-status-badge">${statusLabel}</span>
            `;
            
            item.onclick = () => {
                this.reviewAnswers();
                this.currentIndex = idx;
                this.renderQuestion();
                this.renderQuestionGrid();
            };
            
            container.appendChild(item);
        });
    },

    reviewAnswers: function() {
        this.isReviewing = true;
        this.currentIndex = 0;
        this.navigate('screen-quiz');
        this.renderQuestion();
        this.renderQuestionGrid();
        
        // Ẩn nút nộp bài và thời gian ở sidebar trong chế độ xem lại
        document.querySelector('.sidebar-submit-btn-container').style.display = 'none';
        document.getElementById('sidebar-timer-container').style.display = 'none';
        document.getElementById('sidebar-mode-badge').innerText = 'Xem Lại Đáp Án';
    },

    saveHistoryStats: function(score, correctCount, wrongCount, unansweredCount, timeString) {
        let stats = localStorage.getItem('studyHistoryStats');
        if (!stats) {
            stats = { practicesCount: 0, examsCount: 0, examScores: [] };
        } else {
            try {
                stats = JSON.parse(stats);
            } catch (e) {
                stats = { practicesCount: 0, examsCount: 0, examScores: [] };
            }
        }
        
        if (this.mode === 'practice') {
            stats.practicesCount = (stats.practicesCount || 0) + 1;
        } else if (this.mode === 'exam') {
            stats.examsCount = (stats.examsCount || 0) + 1;
            if (!stats.examScores) stats.examScores = [];
            stats.examScores.push(score);
        }
        
        localStorage.setItem('studyHistoryStats', JSON.stringify(stats));

        // Lưu lịch sử chi tiết
        let historyList = localStorage.getItem('studyHistoryList');
        if (!historyList) {
            historyList = [];
        } else {
            try {
                historyList = JSON.parse(historyList);
            } catch (e) {
                historyList = [];
            }
        }

        const newRecord = {
            type: this.mode,
            timestamp: new Date().toLocaleString('vi-VN'),
            score: this.mode === 'exam' ? score : null,
            correct: correctCount,
            wrong: wrongCount,
            unanswered: unansweredCount,
            total: this.activeQuestions.length,
            timeSpent: timeString,
            userAnswers: JSON.parse(JSON.stringify(this.userAnswers)),
            activeQuestions: JSON.parse(JSON.stringify(this.activeQuestions)),
            studentName: this.studentName
        };

        historyList.unshift(newRecord); // Đưa bản ghi mới lên đầu
        if (historyList.length > 30) {
            historyList = historyList.slice(0, 30);
        }
        localStorage.setItem('studyHistoryList', JSON.stringify(historyList));
    },

    updateHomeStats: function() {
        let stats = localStorage.getItem('studyHistoryStats');
        if (!stats) {
            stats = { practicesCount: 0, examsCount: 0, examScores: [] };
        } else {
            try {
                stats = JSON.parse(stats);
            } catch (e) {
                stats = { practicesCount: 0, examsCount: 0, examScores: [] };
            }
        }
        
        document.getElementById('home-stat-practices').innerText = stats.practicesCount || 0;
        document.getElementById('home-stat-exams').innerText = stats.examsCount || 0;
        
        let avgScore = 0;
        if (stats.examScores && stats.examScores.length > 0) {
            const sum = stats.examScores.reduce((a, b) => a + b, 0);
            avgScore = sum / stats.examScores.length;
        }
        document.getElementById('home-stat-avg-score').innerText = avgScore.toFixed(2);

        // Cập nhật tiến độ bộ đề thi thử
        const sets = this.getExamSets();
        let completedSets = localStorage.getItem('completedExamSets');
        if (completedSets) {
            try { completedSets = JSON.parse(completedSets); } catch (e) { completedSets = {}; }
        } else {
            completedSets = {};
        }
        const completedCount = Object.keys(completedSets).length;
        const setsSpan = document.getElementById('home-stat-exam-sets');
        if (setsSpan) {
            setsSpan.innerText = `${completedCount}/${sets.length}`;
        }
    },

    resetStats: function() {
        if (confirm("Bạn có chắc chắn muốn xóa tất cả thống kê tiến trình học tập, lịch sử và thống kê câu sai không?")) {
            localStorage.removeItem('studyHistoryStats');
            localStorage.removeItem('practiceProgress');
            localStorage.removeItem('studyHistoryList');
            localStorage.removeItem('quizQuestionStats');
            localStorage.removeItem('completedExamSets');
            this.updateHomeStats();
            alert("Đã xóa dữ liệu thành công!");
        }
    },

    updateQuestionStats: function() {
        if (this.isReviewing) return;

        let questionStats = localStorage.getItem('quizQuestionStats');
        if (!questionStats) {
            questionStats = {};
        } else {
            try {
                questionStats = JSON.parse(questionStats);
            } catch (e) {
                questionStats = {};
            }
        }

        this.activeQuestions.forEach((q, idx) => {
            const userAns = this.userAnswers[idx];
            if (userAns !== undefined) {
                const isCorrect = userAns === q.correct;
                if (!questionStats[q.id]) {
                    questionStats[q.id] = {
                        id: q.id,
                        attempts: 0,
                        correct: 0,
                        wrong: 0,
                        lastAttemptTime: 0
                    };
                }
                
                questionStats[q.id].attempts += 1;
                if (isCorrect) {
                    questionStats[q.id].correct += 1;
                } else {
                    questionStats[q.id].wrong += 1;
                }
                questionStats[q.id].lastAttemptTime = Date.now();
            }
        });

        localStorage.setItem('quizQuestionStats', JSON.stringify(questionStats));
    },

    renderStatsScreen: function() {
        const statsList = document.getElementById('stats-q-list');
        if (!statsList) return;

        let questionStats = localStorage.getItem('quizQuestionStats');
        if (questionStats) {
            try {
                questionStats = JSON.parse(questionStats);
            } catch (e) {
                questionStats = {};
            }
        } else {
            questionStats = {};
        }

        const search = document.getElementById('stats-search').value.toLowerCase().trim();
        const filterChap = document.getElementById('stats-filter-chap').value;
        const sortBy = document.getElementById('stats-sort-by').value;
        const minAttempts = parseInt(document.getElementById('stats-min-attempts').value) || 0;

        let totalAttempted = 0;
        let totalWrongQuestions = 0;
        let grandAttempts = 0;
        let grandCorrect = 0;

        Object.values(questionStats).forEach(s => {
            if (s.attempts > 0) {
                totalAttempted++;
                grandAttempts += s.attempts;
                grandCorrect += s.correct;
                if (s.wrong > 0) {
                    totalWrongQuestions++;
                }
            }
        });

        document.getElementById('stats-total-attempted').innerText = totalAttempted;
        document.getElementById('stats-total-wrong').innerText = totalWrongQuestions;
        
        let avgAccuracy = grandAttempts > 0 ? Math.round((grandCorrect / grandAttempts) * 100) : 0;
        document.getElementById('stats-avg-accuracy').innerText = avgAccuracy + '%';

        let filteredStats = [];

        defaultQuestions.forEach(q => {
            const stat = questionStats[q.id];
            const attempts = stat ? stat.attempts : 0;
            const wrong = stat ? stat.wrong : 0;
            const correct = stat ? stat.correct : 0;
            const wrongPct = attempts > 0 ? Math.round((wrong / attempts) * 100) : 0;

            if (wrong === 0) return;
            if (attempts < minAttempts) return;
            if (filterChap !== 'all' && q.chapter !== parseInt(filterChap)) return;

            if (search) {
                const textMatch = (q.text || "").toLowerCase().includes(search);
                const idMatch = (q.id + "").toLowerCase().includes(search);
                const optionMatch = Object.values(q.options || {}).some(opt => opt.toLowerCase().includes(search));
                if (!textMatch && !idMatch && !optionMatch) return;
            }

            filteredStats.push({
                question: q,
                attempts: attempts,
                correct: correct,
                wrong: wrong,
                wrongPct: wrongPct
            });
        });

        if (sortBy === 'wrong-desc') {
            filteredStats.sort((a, b) => b.wrong - a.wrong);
        } else if (sortBy === 'pct-desc') {
            filteredStats.sort((a, b) => {
                if (b.wrongPct !== a.wrongPct) {
                    return b.wrongPct - a.wrongPct;
                }
                return b.wrong - a.wrong;
            });
        } else if (sortBy === 'attempts-desc') {
            filteredStats.sort((a, b) => b.attempts - a.attempts);
        }

        statsList.innerHTML = '';

        const practiceBtn = document.getElementById('btn-stats-practice');
        const examBtn = document.getElementById('btn-stats-exam');
        if (filteredStats.length === 0) {
            statsList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 40px 0;">Không tìm thấy câu hỏi sai nào phù hợp!</div>`;
            if (practiceBtn) practiceBtn.disabled = true;
            if (examBtn) examBtn.disabled = true;
            return;
        } else {
            if (practiceBtn) practiceBtn.disabled = false;
            if (examBtn) examBtn.disabled = false;
        }

        filteredStats.forEach(item => {
            const q = item.question;
            const card = document.createElement('div');
            card.className = 'stats-q-item';
            
            let pctClass = 'low';
            if (item.wrongPct >= 75) {
                pctClass = 'high';
            } else if (item.wrongPct >= 40) {
                pctClass = 'medium';
            }

            const cleanText = (q.text || "").replace(/\[CHƯA CÓ NỘI DUNG\].*$/, '');

            card.innerHTML = `
                <div class="stats-q-header">
                    <span class="stats-q-title">Câu ${q.id} (Chương ${q.chapter})</span>
                    <div class="stats-q-badges">
                        <span class="stats-badge-wrong-pct ${pctClass}">Tỷ lệ sai: ${item.wrongPct}%</span>
                    </div>
                </div>
                <div class="stats-q-body">${cleanText}</div>
                <div class="stats-q-stats-row">
                    <span>Số lần làm: <strong>${item.attempts}</strong></span>
                    <span style="color: var(--success);">Đúng: <strong>${item.correct}</strong></span>
                    <span style="color: var(--danger);">Sai: <strong>${item.wrong}</strong></span>
                </div>
                <button class="stats-q-details-btn" onclick="app.toggleStatsQDetails(this)">
                    👁️ Hiện đáp án & lựa chọn
                </button>
                <div class="stats-q-details">
                    <div class="stats-q-options">
                        <div class="${q.correct === 'A' ? 'stats-q-correct-opt' : ''}">A. ${q.options.A || ''}</div>
                        <div class="${q.correct === 'B' ? 'stats-q-correct-opt' : ''}">B. ${q.options.B || ''}</div>
                        <div class="${q.correct === 'C' ? 'stats-q-correct-opt' : ''}">C. ${q.options.C || ''}</div>
                        <div class="${q.correct === 'D' ? 'stats-q-correct-opt' : ''}">D. ${q.options.D || ''}</div>
                    </div>
                </div>
            `;
            statsList.appendChild(card);
        });

        const footerText = document.createElement('div');
        footerText.style.textAlign = 'center';
        footerText.style.color = 'var(--text-muted)';
        footerText.style.fontSize = '0.85rem';
        footerText.style.padding = '15px 0 10px 0';
        footerText.innerText = `Đang hiển thị ${filteredStats.length} câu hỏi sai phù hợp.`;
        statsList.appendChild(footerText);
    },

    toggleStatsQDetails: function(btn) {
        const details = btn.nextElementSibling;
        if (details.classList.contains('active')) {
            details.classList.remove('active');
            btn.innerHTML = '👁️ Hiện đáp án & lựa chọn';
        } else {
            details.classList.add('active');
            btn.innerHTML = '👁️ Ẩn đáp án & lựa chọn';
        }
    },

    startPracticeOnWrong: function() {
        initAudio();

        let questionStats = localStorage.getItem('quizQuestionStats');
        if (questionStats) {
            try {
                questionStats = JSON.parse(questionStats);
            } catch (e) {
                questionStats = {};
            }
        } else {
            questionStats = {};
        }

        const search = document.getElementById('stats-search').value.toLowerCase().trim();
        const filterChap = document.getElementById('stats-filter-chap').value;
        const minAttempts = parseInt(document.getElementById('stats-min-attempts').value) || 0;

        let pool = [];

        defaultQuestions.forEach(q => {
            const stat = questionStats[q.id];
            const attempts = stat ? stat.attempts : 0;
            const wrong = stat ? stat.wrong : 0;

            if (wrong === 0) return;
            if (attempts < minAttempts) return;
            if (filterChap !== 'all' && q.chapter !== parseInt(filterChap)) return;

            if (search) {
                const textMatch = (q.text || "").toLowerCase().includes(search);
                const idMatch = (q.id + "").toLowerCase().includes(search);
                const optionMatch = Object.values(q.options || {}).some(opt => opt.toLowerCase().includes(search));
                if (!textMatch && !idMatch && !optionMatch) return;
            }

            pool.push(q);
        });

        if (pool.length === 0) {
            alert("Không có câu hỏi sai nào phù hợp để ôn tập!");
            return;
        }

        pool.sort((a, b) => {
            const statA = questionStats[a.id];
            const statB = questionStats[b.id];
            const wrongA = statA ? statA.wrong : 0;
            const wrongB = statB ? statB.wrong : 0;
            return wrongB - wrongA;
        });

        this.settings.showAnswerImmediate = true;
        this.settings.shuffleOptions = true;

        this.mode = 'practice';
        this.activeQuestions = pool;
        this.currentIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions = {};
        this.gridFilter = 'all';
        this.startTime = Date.now();

        this.activeQuestions.forEach(q => {
            this.shuffleQuestionOptions(q, this.settings.shuffleOptions);
        });

        document.getElementById('sidebar-timer-container').style.display = 'none';
        document.getElementById('sidebar-mode-badge').innerText = 'Ôn Tập Câu Hay Sai';

        document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
        document.getElementById('chip-filter-all').classList.add('active');

        this.navigate('screen-quiz');
        this.renderQuestion();
        this.updateStats();
        this.renderQuestionGrid();
    },

    startExamOnWrong: function() {
        initAudio();

        let questionStats = localStorage.getItem('quizQuestionStats');
        if (questionStats) {
            try {
                questionStats = JSON.parse(questionStats);
            } catch (e) {
                questionStats = {};
            }
        } else {
            questionStats = {};
        }

        const search = document.getElementById('stats-search').value.toLowerCase().trim();
        const filterChap = document.getElementById('stats-filter-chap').value;
        const minAttempts = parseInt(document.getElementById('stats-min-attempts').value) || 0;

        let pool = [];

        defaultQuestions.forEach(q => {
            const stat = questionStats[q.id];
            const attempts = stat ? stat.attempts : 0;
            const wrong = stat ? stat.wrong : 0;

            if (wrong === 0) return;
            if (attempts < minAttempts) return;
            if (filterChap !== 'all' && q.chapter !== parseInt(filterChap)) return;

            if (search) {
                const textMatch = (q.text || "").toLowerCase().includes(search);
                const idMatch = (q.id + "").toLowerCase().includes(search);
                const optionMatch = Object.values(q.options || {}).some(opt => opt.toLowerCase().includes(search));
                if (!textMatch && !idMatch && !optionMatch) return;
            }

            pool.push(q);
        });

        if (pool.length === 0) {
            alert("Không có câu hỏi sai nào phù hợp để thi thử!");
            return;
        }

        let examQuestions = [...pool];
        examQuestions.sort(() => Math.random() - 0.5);
        if (examQuestions.length > 20) {
            examQuestions = examQuestions.slice(0, 20);
        }

        this.mode = 'exam';
        this.activeQuestions = examQuestions;
        this.currentIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions = {};
        this.gridFilter = 'all';
        this.settings.showAnswerImmediate = false;
        this.settings.shuffleOptions = true;
        this.startTime = Date.now();

        this.activeQuestions.forEach(q => {
            this.shuffleQuestionOptions(q, this.settings.shuffleOptions);
        });

        this.timeRemaining = 20 * 60;
        document.getElementById('sidebar-timer-container').style.display = 'block';
        document.getElementById('sidebar-mode-badge').innerText = 'Thi Thử Câu Hay Sai';
        this.startTimer();

        document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
        document.getElementById('chip-filter-all').classList.add('active');

        this.navigate('screen-quiz');
        this.renderQuestion();
        this.updateStats();
        this.renderQuestionGrid();
    },

    resetQuestionStatsOnly: function() {
        if (confirm("Bạn có chắc chắn muốn xóa thống kê và lịch sử câu trả lời sai không? Chỉ số số lần làm sai của các câu hỏi sẽ quay về 0.")) {
            localStorage.removeItem('quizQuestionStats');
            this.renderStatsScreen();
            alert("Đã xóa dữ liệu thống kê câu sai thành công!");
        }
    },

    showHistoryModal: function() {
        const modal = document.getElementById('modal-history');
        const listContainer = document.getElementById('history-modal-list');
        if (!modal || !listContainer) return;

        listContainer.innerHTML = '';
        
        let historyList = localStorage.getItem('studyHistoryList');
        if (historyList) {
            try {
                historyList = JSON.parse(historyList);
            } catch (e) {
                historyList = [];
            }
        } else {
            historyList = [];
        }

        if (historyList.length === 0) {
            listContainer.innerHTML = `
                <div class="history-empty-state">
                    <div class="history-empty-icon">📂</div>
                    <p>Bạn chưa thực hiện lượt ôn tập hay thi thử nào.</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 6px;">Các kết quả thi sẽ hiển thị tại đây sau khi bạn nộp bài.</p>
                </div>
            `;
        } else {
            historyList.forEach((item, idx) => {
                const card = document.createElement('div');
                const isExam = item.type === 'exam';
                const badgeClass = isExam ? 'exam' : 'practice';
                const badgeText = isExam ? 'Thi Thử' : 'Ôn Tập';
                
                let scoreHtml = '';
                let itemClass = '';
                if (isExam) {
                    const scoreNum = parseFloat(item.score);
                    scoreHtml = `<div class="history-score">${scoreNum.toFixed(2)}</div>`;
                    if (scoreNum < 4.0) {
                        itemClass = 'fail';
                    }
                } else {
                    scoreHtml = `<div class="history-score" style="color: var(--primary);">--</div>`;
                }

                card.className = `history-item ${itemClass}`;
                card.style.cursor = 'pointer';
                card.setAttribute('title', 'Nhấn vào để xem chi tiết bài làm này');
                card.onclick = () => this.viewHistoryRecord(idx);
                card.innerHTML = `
                    <div class="history-item-left">
                        <div class="history-item-meta">
                            <span class="history-badge ${badgeClass}">${badgeText}</span>
                            <span class="history-date">${item.timestamp}</span>
                        </div>
                        <span class="history-duration">⏱️ ${item.timeSpent}</span>
                    </div>
                    <div class="history-item-right">
                        ${scoreHtml}
                        <span class="history-accuracy">Đúng ${item.correct}/${item.total}</span>
                    </div>
                `;
                listContainer.appendChild(card);
            });
        }

        modal.style.display = 'flex';
    },

    closeHistoryModal: function() {
        const modal = document.getElementById('modal-history');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    viewHistoryRecord: function(index) {
        let historyList = localStorage.getItem('studyHistoryList');
        if (!historyList) return;
        try {
            historyList = JSON.parse(historyList);
        } catch (e) {
            return;
        }

        const record = historyList[index];
        if (!record) return;

        // Kiểm tra xem bản ghi có chứa dữ liệu chi tiết câu hỏi không
        if (!record.activeQuestions || record.activeQuestions.length === 0) {
            alert("Rất tiếc! Bản ghi lịch sử cũ này không lưu chi tiết câu hỏi (chỉ các bài làm mới từ bây giờ mới có thể xem lại chi tiết).");
            return;
        }

        // Đóng modal lịch sử
        this.closeHistoryModal();

        // Nạp trạng thái bài làm từ lịch sử vào app
        this.activeQuestions = record.activeQuestions;
        this.userAnswers = record.userAnswers || {};
        this.mode = record.type;
        this.studentName = record.studentName || '';
        this.isReviewing = true;

        // Tính toán/điền dữ liệu màn hình kết quả
        const scoreVal = record.score !== null ? parseFloat(record.score) : ((record.correct / record.total) * 10);
        document.getElementById('score-text').innerText = scoreVal.toFixed(2);
        document.getElementById('res-correct').innerText = record.correct;
        document.getElementById('res-wrong').innerText = record.wrong !== undefined ? record.wrong : (record.total - record.correct);
        document.getElementById('res-unanswered').innerText = record.unanswered !== undefined ? record.unanswered : 0;
        document.getElementById('result-detail').innerText = `Bài làm lúc: ${record.timestamp}\nTỷ lệ đúng: ${record.correct}/${record.total} câu (${Math.round((record.correct / record.total) * 100)}%)`;
        document.getElementById('result-time').innerText = `Thời gian thực hiện: ${record.timeSpent}`;

        const nameLabel = document.getElementById('result-student-name');
        if (nameLabel) {
            if (this.studentName) {
                nameLabel.innerText = `Thí sinh: ${this.studentName}`;
                nameLabel.style.display = 'block';
            } else {
                nameLabel.style.display = 'none';
            }
        }

        // Tạo danh sách câu hỏi đã làm trực quan
        this.renderResultsReviewList();

        // Chuyển sang màn hình kết quả để xem lại
        this.navigate('screen-results');
    },



    renderQuestionManagerList: function() {
        const listContainer = document.getElementById('manager-q-list');
        if (!listContainer) return;
        
        const search = document.getElementById('manager-search').value.toLowerCase().trim();
        const filterChap = document.getElementById('manager-filter-chap').value;
        
        let filtered = defaultQuestions;
        
        if (filterChap !== 'all') {
            const chapNum = parseInt(filterChap);
            filtered = filtered.filter(q => q.chapter === chapNum);
        }
        
        if (search) {
            filtered = filtered.filter(q => 
                (q.id + "").toLowerCase().includes(search) || 
                (q.text || "").toLowerCase().includes(search) ||
                Object.values(q.options || {}).some(optVal => optVal.toLowerCase().includes(search))
            );
        }
        
        filtered.sort((a, b) => {
            const numA = parseInt(a.id) || 0;
            const numB = parseInt(b.id) || 0;
            return numA - numB;
        });

        listContainer.innerHTML = '';
        
        if (filtered.length === 0) {
            listContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 40px 0;">Không tìm thấy câu hỏi nào phù hợp!</div>`;
            return;
        }

        filtered.forEach(q => {
            const item = document.createElement('div');
            item.className = 'manager-q-item';
            item.style.padding = '16px';
            item.style.borderRadius = '16px';
            item.style.border = '1px solid var(--border-color)';
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.gap = '10px';
            item.style.background = 'rgba(255, 255, 255, 0.02)';
            
            const isCorrectA = q.correct === 'A' ? 'color: var(--success); font-weight:700;' : '';
            const isCorrectB = q.correct === 'B' ? 'color: var(--success); font-weight:700;' : '';
            const isCorrectC = q.correct === 'C' ? 'color: var(--success); font-weight:700;' : '';
            const isCorrectD = q.correct === 'D' ? 'color: var(--success); font-weight:700;' : '';

            // Clean display
            const displayText = (q.text || "").replace(/\[CHƯA CÓ NỘI DUNG\].*$/, '');

            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 8px;">
                    <span style="font-weight: 700; color: var(--primary);">Câu ${q.id} (Chương ${q.chapter})</span>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.85rem; width: auto;" onclick="app.openEditQuestionModal('${q.id}')">✏️ Sửa</button>
                        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.85rem; border-color: rgba(239, 68, 68, 0.4); color: var(--danger); width: auto;" onclick="app.deleteQuestion('${q.id}')">🗑️ Xóa</button>
                    </div>
                </div>
                <div style="font-weight: 600; color: var(--text-primary); margin-top: 4px;">${displayText}</div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 6px; font-size: 0.85rem; color: var(--text-secondary); padding-left: 8px;">
                    <div style="${isCorrectA}">A. ${q.options.A || ''}</div>
                    <div style="${isCorrectB}">B. ${q.options.B || ''}</div>
                    <div style="${isCorrectC}">C. ${q.options.C || ''}</div>
                    <div style="${isCorrectD}">D. ${q.options.D || ''}</div>
                </div>
            `;
            listContainer.appendChild(item);
        });

        const footerText = document.createElement('div');
        footerText.style.textAlign = 'center';
        footerText.style.color = 'var(--text-muted)';
        footerText.style.fontSize = '0.85rem';
        footerText.style.padding = '15px 0 10px 0';
        footerText.innerText = `Đang hiển thị toàn bộ ${filtered.length} câu hỏi phù hợp.`;
        listContainer.appendChild(footerText);
    },

    resetToDefaultQuestions: function() {
        if (confirm("Bạn có chắc chắn muốn khôi phục toàn bộ câu hỏi về mặc định của hệ thống? Mọi câu hỏi tự thêm hoặc chỉnh sửa của bạn sẽ bị xóa.")) {
            localStorage.removeItem('savedQuestions');
            window.location.reload();
        }
    },

    openAddQuestionModal: function() {
        document.getElementById('modal-q-title').innerText = "Thêm Câu Hỏi Mới";
        document.getElementById('modal-q-mode').value = "add";
        
        const ids = defaultQuestions.map(q => parseInt(q.id) || 0);
        const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
        
        document.getElementById('form-q-id').value = nextId;
        document.getElementById('form-q-id').disabled = false;
        
        document.getElementById('form-q-chap').value = "1";
        document.getElementById('form-q-text').value = "";
        document.getElementById('form-q-optA').value = "";
        document.getElementById('form-q-optB').value = "";
        document.getElementById('form-q-optC').value = "";
        document.getElementById('form-q-optD').value = "";
        document.getElementById('form-q-correct').value = "A";
        
        document.getElementById('modal-question').style.display = 'flex';
    },

    openEditQuestionModal: function(qId) {
        const q = defaultQuestions.find(item => item.id === qId);
        if (!q) return;
        
        document.getElementById('modal-q-title').innerText = "Chỉnh Sửa Câu Hỏi";
        document.getElementById('modal-q-mode').value = "edit";
        document.getElementById('modal-q-original-id').value = qId;
        
        document.getElementById('form-q-id').value = q.id;
        document.getElementById('form-q-id').disabled = true;
        
        document.getElementById('form-q-chap').value = q.chapter;
        document.getElementById('form-q-text').value = q.text || "";
        document.getElementById('form-q-optA').value = q.options.A || "";
        document.getElementById('form-q-optB').value = q.options.B || "";
        document.getElementById('form-q-optC').value = q.options.C || "";
        document.getElementById('form-q-optD').value = q.options.D || "";
        document.getElementById('form-q-correct').value = q.correct || "A";
        
        document.getElementById('modal-question').style.display = 'flex';
    },

    closeQuestionModal: function() {
        document.getElementById('modal-question').style.display = 'none';
    },

    saveQuestionManual: function() {
        const mode = document.getElementById('modal-q-mode').value;
        const origId = document.getElementById('modal-q-original-id').value;
        
        const id = document.getElementById('form-q-id').value.trim();
        const chapter = parseInt(document.getElementById('form-q-chap').value);
        const text = document.getElementById('form-q-text').value.trim();
        const optA = document.getElementById('form-q-optA').value.trim();
        const optB = document.getElementById('form-q-optB').value.trim();
        const optC = document.getElementById('form-q-optC').value.trim();
        const optD = document.getElementById('form-q-optD').value.trim();
        const correct = document.getElementById('form-q-correct').value;
        
        if (!id || !text || !optA || !optB || !optC || !optD) {
            alert("Vui lòng nhập đầy đủ tất cả thông tin!");
            return;
        }
        
        if (mode === 'add') {
            const exists = defaultQuestions.some(q => q.id === id);
            if (exists) {
                alert("Mã câu hỏi (ID) này đã tồn tại! Vui lòng chọn mã khác.");
                return;
            }
            
            defaultQuestions.push({
                id: id,
                chapter: chapter,
                text: text,
                options: { A: optA, B: optB, C: optC, D: optD },
                correct: correct
            });
        } else {
            const q = defaultQuestions.find(item => item.id === origId);
            if (q) {
                q.chapter = chapter;
                q.text = text;
                q.options = { A: optA, B: optB, C: optC, D: optD };
                q.correct = correct;
            }
        }
        
        localStorage.setItem('savedQuestions', JSON.stringify(defaultQuestions));
        
        this.closeQuestionModal();
        this.renderQuestionManagerList();
        this.updateHomeStats();
        
        alert("Lưu câu hỏi thành công!");
    },

    deleteQuestion: function(qId) {
        if (!confirm(`Bạn có chắc chắn muốn xóa câu hỏi mã ${qId} không?`)) return;
        
        defaultQuestions = defaultQuestions.filter(q => q.id !== qId);
        localStorage.setItem('savedQuestions', JSON.stringify(defaultQuestions));
        
        this.renderQuestionManagerList();
        this.updateHomeStats();
        alert("Đã xóa câu hỏi thành công!");
    },

    showQRModal: function() {
        const modal = document.getElementById('modal-qr-preview');
        if (modal) {
            modal.style.display = 'flex';
        }
    },

    closeQRModal: function() {
        const modal = document.getElementById('modal-qr-preview');
        if (modal) {
            modal.style.display = 'none';
        }
    }
};

// Khởi chạy khi tải trang
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
