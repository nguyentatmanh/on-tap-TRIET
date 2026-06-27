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
            text.innerText = 'Giao diện tối';
        } else {
            icon.innerText = '☀️';
            text.innerText = 'Giao diện sáng';
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
            let keys = ['A', 'B', 'C', 'D'];
            if (this.settings.shuffleOptions) {
                keys.sort(() => Math.random() - 0.5);
            }
            q.sessionOptionsOrder = keys;
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

        // Pick 40 random questions: ~13 from chap1, 13 from chap2, 14 from chap3
        const q1 = this.getRandomSubset(defaultQuestions.filter(q => q.chapter === 1), 13);
        const q2 = this.getRandomSubset(defaultQuestions.filter(q => q.chapter === 2), 13);
        const q3 = this.getRandomSubset(defaultQuestions.filter(q => q.chapter === 3), 14);

        let examQuestions = [...q1, ...q2, ...q3];
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
            let keys = ['A', 'B', 'C', 'D'];
            keys.sort(() => Math.random() - 0.5);
            q.sessionOptionsOrder = keys;
        });

        this.timeRemaining = totalMinutes * 60;
        document.getElementById('sidebar-timer-container').style.display = 'block';
        document.getElementById('sidebar-mode-badge').innerText = 'Đang Thi Thử';
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
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
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
            keys = ['A', 'B', 'C', 'D'];
            if (this.settings.shuffleOptions) {
                keys.sort(() => Math.random() - 0.5);
            }
            q.sessionOptionsOrder = keys;
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

        // Lưu thống kê lịch sử
        this.saveHistoryStats(score);

        if (this.mode === 'practice') {
            localStorage.removeItem('practiceProgress');
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

    saveHistoryStats: function(score) {
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
    },

    resetStats: function() {
        if (confirm("Bạn có chắc chắn muốn xóa tất cả thống kê tiến trình học tập không?")) {
            localStorage.removeItem('studyHistoryStats');
            localStorage.removeItem('practiceProgress');
            this.updateHomeStats();
            alert("Đã xóa dữ liệu thành công!");
        }
    },

    handleFileUpload: function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const status = document.getElementById('import-status');
        status.style.color = 'var(--text-primary)';
        status.innerText = 'Đang phân tích file Word...';

        const reader = new FileReader();
        reader.onload = function(loadEvent) {
            const arrayBuffer = loadEvent.target.result;
            
            // Sử dụng mammoth.js để giải nén text từ docx
            mammoth.extractRawText({arrayBuffer: arrayBuffer})
                .then(function(result) {
                    const text = result.value;
                    document.getElementById('import-text').value = text;
                    app.importData(); // Tự động xử lý
                })
                .catch(function(err) {
                    status.style.color = 'var(--danger)';
                    status.innerText = 'Lỗi đọc file Word: ' + err.message;
                });
        };
        reader.readAsArrayBuffer(file);
    },

    importData: function() {
        const text = document.getElementById('import-text').value;
        if (!text.trim()) {
            alert("Vui lòng dán nội dung hoặc chọn file Word.");
            return;
        }

        let updateCount = 0;
        
        // Regex bắt "Câu 1:", "Câu 10a.", v.v...
        const regex = /Câu\s+(\d+[ab]?)\s*[:\.]([\s\S]*?)(?=Câu\s+\d+[ab]?\s*[:\.]|$)/gi;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const id = match[1].toLowerCase();
            const content = match[2];

            const optRegex = /A\.\s*([\s\S]*?)B\.\s*([\s\S]*?)C\.\s*([\s\S]*?)D\.\s*([\s\S]*?)$/gi;
            const optMatch = optRegex.exec(content);

            const qRef = defaultQuestions.find(q => q.id.toLowerCase() === id);
            if (qRef) {
                if (optMatch) {
                    qRef.text = content.replace(optMatch[0], '').trim();
                    qRef.options['A'] = optMatch[1].trim();
                    qRef.options['B'] = optMatch[2].trim();
                    qRef.options['C'] = optMatch[3].trim();
                    qRef.options['D'] = optMatch[4].trim();
                } else {
                    qRef.text = content.trim(); 
                }
                updateCount++;
            }
        }

        const status = document.getElementById('import-status');
        if (updateCount > 0) {
            status.style.color = 'var(--success)';
            status.innerText = `Đã nhận diện thành công văn bản cho ${updateCount} câu hỏi!`;
            
            // Lưu dữ liệu đã chèn vào localStorage để giữ tạm
            localStorage.setItem('savedQuestions', JSON.stringify(defaultQuestions));
            
            // Hiển thị nút Tải xuống file data.js mới
            document.getElementById('export-section').style.display = 'block';
            document.getElementById('export-text').value = JSON.stringify(defaultQuestions, null, 2);
        } else {
            status.style.color = 'var(--danger)';
            status.innerText = `Không tìm thấy câu hỏi nào hợp lệ. Đảm bảo cấu trúc có "Câu 1:", "A.", "B.", "C.", "D."`;
        }
    },

    downloadDataFile: function() {
        const fileContent = `const rawAnswers = \`${rawAnswers.trim()}\`;\n\nlet defaultQuestions = ${JSON.stringify(defaultQuestions, null, 4)};`;
        
        const blob = new Blob([fileContent], { type: "text/javascript" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = "data.js";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    switchImportTab: function(tab) {
        const btnAuto = document.getElementById('tab-btn-auto');
        const btnManual = document.getElementById('tab-btn-manual');
        const contentAuto = document.getElementById('import-tab-auto');
        const contentManual = document.getElementById('import-tab-manual');
        
        if (tab === 'auto') {
            btnAuto.classList.add('active');
            btnManual.classList.remove('active');
            contentAuto.style.display = 'block';
            contentManual.style.display = 'none';
        } else {
            btnAuto.classList.remove('active');
            btnManual.classList.add('active');
            contentAuto.style.display = 'none';
            contentManual.style.display = 'block';
            this.renderQuestionManagerList();
        }
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
