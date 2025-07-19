document.addEventListener('DOMContentLoaded', () => {
    const gameImage = document.getElementById('gameImage');
    const clueText = document.getElementById('clueText');
    const answerInput = document.getElementById('answerInput');
    const checkButton = document.getElementById('checkButton');
    const gameMessage = document.getElementById('gameMessage');
    const nextButton = document.getElementById('nextButton');
    const timerDisplay = document.getElementById('timerDisplay');
    const correctScoreDisplay = document.getElementById('correctScore');
    const incorrectScoreDisplay = document.getElementById('incorrectScore');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playMusicButton = document.getElementById('playMusic');
    const pauseMusicButton = document.getElementById('pauseMusic');
    const splashScreen = document.getElementById('splashScreen'); // Elemen baru
    const startButton = document.getElementById('startButton');
    // --- Konfigurasi Game ---
    const MUSIC_VOLUME = 1.0;
    const MAX_ATTEMPTS = 3;
    const TIME_PER_QUESTION = 60
    const JSON_DATA_URL = 'https://raw.githubusercontent.com/Offmonprst/CatchTeenieping-Quest/refs/heads/main/catch-teeniping.json';

    let currentQuestionIndex = 0;
    let shuffledGameData = [];
    let attemptsLeft = MAX_ATTEMPTS;
    let timeLeft = TIME_PER_QUESTION;
    let timerInterval;
    let correctCount = 0; 
    let incorrectCount = 0;
    // --- Fungsi Pengontrol Musik ---
    function playBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.volume = MUSIC_VOLUME;
            backgroundMusic.play().then(() => {
                // Berhasil putar, tampilkan tombol pause
                playMusicButton.classList.add('hidden');
                pauseMusicButton.classList.remove('hidden');
            }).catch(error => {
                // Gagal putar (misal: diblokir browser), tetap tampilkan tombol play
                console.warn("Gagal memutar musik: ", error);
                playMusicButton.classList.remove('hidden');
                pauseMusicButton.classList.add('hidden');
            });
        }
    }

    function pauseBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            // Tampilkan tombol play
            playMusicButton.classList.remove('hidden');
            pauseMusicButton.classList.add('hidden');
        }
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = TIME_PER_QUESTION;
        timerDisplay.textContent = timeLeft;
        timerDisplay.style.color = 'var(--text-color)';
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 5) {
                timerDisplay.style.color = 'var(--accent-color)';
            } else {
                timerDisplay.style.color = 'var(--text-color)';
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timeUp();
            }
        }, 1000);
    }

    //
    function timeUp() {
        incorrectCount++;
        updateScoreDisplay();
        const correctAnswer = shuffledGameData[currentQuestionIndex].name.toLowerCase();
        gameMessage.textContent = `Waktu habis! Jawaban yang benar adalah: "${correctAnswer.toUpperCase()}".`;
        gameMessage.className = 'message incorrect';
        checkButton.classList.add('hidden');
        answerInput.classList.add('hidden');
        answerInput.disabled = true;
        nextButton.classList.remove('hidden');
    }
    function updateScoreDisplay() {
        correctScoreDisplay.textContent = correctCount;
        incorrectScoreDisplay.textContent = incorrectCount;
    }
    async function loadQuestion() {
        if (shuffledGameData.length === 0) {
            // Ambil data jika belum ada
            try {
                const response = await fetch(JSON_DATA_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                shuffledGameData = shuffleArray([...data]);
            } catch (error) {
                console.error("Gagal mengambil data game:", error);
                gameMessage.textContent = 'Gagal memuat game. Silakan coba lagi nanti.';
                gameMessage.className = 'message incorrect';
                checkButton.classList.add('hidden');
                answerInput.classList.add('hidden');
                nextButton.classList.add('hidden');
                return;
            }
        }

        if (currentQuestionIndex >= shuffledGameData.length) {
            gameMessage.textContent = `Selamat! Anda telah menyelesaikan semua tebakan! Skor akhir Anda: Benar ${correctCount}, Salah ${incorrectCount}.`;
            gameMessage.className = 'message correct';
            checkButton.classList.add('hidden');
            answerInput.classList.add('hidden');
            nextButton.classList.add('hidden');
            clueText.textContent = 'Tidak ada lagi pertanyaan.';
            gameImage.src = 'https://lann.pw/get-upload?id=uploader-api-1:1752933871056.jpg';
            return;
        }

        attemptsLeft = MAX_ATTEMPTS; // Reset percobaan untuk pertanyaan baru
        const question = shuffledGameData[currentQuestionIndex];
        gameImage.src = "https://raw.githubusercontent.com/Offmonprst/CatchTeenieping-Quest/refs/heads/main/image/" + question.image;
        clueText.textContent = question.from;
        answerInput.value = ''; 
        gameMessage.textContent = `Anda punya ${attemptsLeft} kesempatan.`; 
        gameMessage.className = 'message'; 
        nextButton.classList.add('hidden'); 
        checkButton.classList.remove('hidden'); 
        answerInput.classList.remove('hidden'); 
        answerInput.disabled = false;
        answerInput.focus(); 
        startTimer()
        console.log(question);
    }

    // Fungsi untuk memeriksa jawaban
    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer = shuffledGameData[currentQuestionIndex].name.toLowerCase();

        if (userAnswer === correctAnswer) {
            correctCount++;
            gameMessage.textContent = 'Benar! Jawaban Anda tepat!';
            gameMessage.className = 'message correct';
            checkButton.classList.add('hidden');
            answerInput.classList.add('hidden');
            answerInput.disabled = true;
            nextButton.classList.remove('hidden');
        } else {        
            attemptsLeft--; 
            if (attemptsLeft > 0) {
                gameMessage.textContent = `Salah! Anda punya ${attemptsLeft} kesempatan lagi.`;
                gameMessage.className = 'message incorrect';
                answerInput.focus(); 
                startTimer();
            } else {
                incorrectCount++;
                gameMessage.textContent = `Kesempatan habis! Jawaban yang benar adalah: "${correctAnswer.toUpperCase()}".`;
                gameMessage.className = 'message incorrect';
                checkButton.classList.add('hidden');
                answerInput.classList.add('hidden');
                answerInput.disabled = true; 
                nextButton.classList.remove('hidden'); 
            }
        }
       updateScoreDisplay();
    }
    function startGame() {
        splashScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        playBackgroundMusic(); 
        updateScoreDisplay(); 
        loadQuestion(); 
    }
    checkButton.addEventListener('click', checkAnswer);

    answerInput.addEventListener('keypress', (event) => {
       
        if (event.key === 'Enter' && !checkButton.classList.contains('hidden') && !answerInput.disabled) {
            checkAnswer();
        }
    });

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        loadQuestion();
    });
    playMusicButton.addEventListener('click', playBackgroundMusic);
    pauseMusicButton.addEventListener('click', pauseBackgroundMusic);
    // Inisialisasi game saat halaman dimuat
    startButton.addEventListener('click', startGame);
    updateScoreDisplay()
    loadQuestion();
});
