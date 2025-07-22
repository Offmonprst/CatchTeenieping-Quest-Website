document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('gameContainer');
    const gameImage = document.getElementById('gameImage');
    const clueText = document.getElementById('clueText');
    const answerInput = document.getElementById('answerInput');
    const checkButton = document.getElementById('checkButton');
    const gameMessage = document.getElementById('gameMessage');
    const nextButton = document.getElementById('nextButton');
    const timerDisplay = document.getElementById('timerDisplay');
    const correctScoreDisplay = document.getElementById('correctScore');
    const incorrectScoreDisplay = document.getElementById('incorrectScore');
    const splashScreen = document.getElementById('splashScreen');
    const startButton = document.getElementById('startButton');
    const splashTitle = document.getElementById('splashTitle');
    const splashDesc1 = document.getElementById('splashDesc1');
    const splashDesc2 = document.getElementById('splashDesc2');
    const playMusicButton = document.getElementById('playMusic');
    const pauseMusicButton = document.getElementById('pauseMusic');
    const correctLabel = document.getElementById('correctLabel');
    const incorrectLabel = document.getElementById('incorrectLabel');
    const timerLabel = document.getElementById('timerLabel');
    const cluePrefix = document.getElementById('cluePrefix');
    const langToggleButton = document.getElementById('langToggle'); 
    const backgroundMusic = document.getElementById('backgroundMusic');
    const correctSound = document.getElementById('correctSound');
    const incorrectSound = document.getElementById('incorrectSound');
    const milisecond = document.getElementById('secondLang');
    const quest = document.getElementById('Questions');
    const hamMenu = document.getElementById("menuToggle");
    const offScreenMenu = document.getElementById("moreOptionsContent");
    const donateTeks = document.getElementById('donateLink');
    const reportTeks = document.getElementById('reportBugLink');
    
    // --- Konfigurasi Game ---
    const MUSIC_VOLUME = 0.8;
    const MAX_ATTEMPTS = 3;
    const TIME_PER_QUESTION = 30
    const SFX_VOLUME = 0.9;
    
    const JSON_DATA_URL = 'https://raw.githubusercontent.com/Offmonprst/CatchTeenieping-Quest/refs/heads/main/catch-teeniping.json';
    const LANG_STRINGS_URL = 'https://raw.githubusercontent.com/Offmonprst/CatchTeenieping-Quest/refs/heads/main/lang_strings.json'; 
    
    let currentQuestionIndex = 0;
    let shuffledGameData = [];
    let attemptsLeft = MAX_ATTEMPTS;
    let timeLeft = TIME_PER_QUESTION;
    let timerInterval;
    let correctCount = 0; 
    let incorrectCount = 0;
     let currentLanguage = 'id';
    let loadedLangStrings = {}; 
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
    function playCorrectSound() {
        if (correctSound) {
            correctSound.volume = SFX_VOLUME;
            correctSound.currentTime = 0;
            correctSound.play();
        }
    }

    function playIncorrectSound() {
        if (incorrectSound) {
            incorrectSound.volume = SFX_VOLUME;
            incorrectSound.currentTime = 0; 
            incorrectSound.play();
        }
    }
    function pauseBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            playMusicButton.classList.remove('hidden');
            pauseMusicButton.classList.add('hidden');
        }
    }
        async function fetchLanguageStrings() {
            const response = await fetch(LANG_STRINGS_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} saat memuat ${LANG_STRINGS_URL}`);
            }
            loadedLangStrings = await response.json();
            applyLanguage(currentLanguage); 
            if (gameMessage) {
                gameMessage.textContent = "Error loading language. Please check console.";
                gameMessage.className = 'message incorrect';
            }
        }
    function applyLanguage(lang) {
        currentLanguage = lang;
        langToggleButton.textContent = (currentLanguage === 'id') ? 'EN' : 'ID';
        const currentLangStrings = loadedLangStrings[currentLanguage];
        if (!currentLangStrings) {
            console.error(`String bahasa untuk '${currentLanguage}' tidak ditemukan dalam loadedLangStrings.`, loadedLangStrings);
            return;
        }
        splashTitle.textContent = currentLangStrings.welcome_title;
        splashDesc1.textContent = currentLangStrings.game_description1;
        splashDesc2.textContent = currentLangStrings.game_description2;
        startButton.textContent = currentLangStrings.start_button;
        playMusicButton.textContent = currentLangStrings.play_music;
        pauseMusicButton.textContent = currentLangStrings.pause_music;
        correctLabel.textContent = currentLangStrings.correct_score_display;
        incorrectLabel.textContent = currentLangStrings.incorrect_score_display;
        timerLabel.textContent = currentLangStrings.time_left_display;
        milisecond.textContent = currentLangStrings.timersecond;
        cluePrefix.textContent = currentLangStrings.clue_prefix + " ";
        answerInput.placeholder = currentLangStrings.answer_input_placeholder;
        checkButton.textContent = currentLangStrings.check_button;
        nextButton.textContent = currentLangStrings.next_button;
        quest.textContent = currentLangStrings.question;
        donateTeks.textContent = currentLangStrings.donate;
        reportTeks.textContent = currentLangStrings.report;
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

    function timeUp() {
        incorrectCount++;
        updateScoreDisplay();
        const correctAnswer = shuffledGameData[currentQuestionIndex].name.toLowerCase();
        const timer = loadedLangStrings[currentLanguage].time_up_message;
        gameMessage.textContent = timer.replace('{correctAnswer}', correctAnswer.toUpperCase());
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
            gameMessage.textContent = loadedLangStrings[currentLanguage].game_complete_message
            .replace('{correctCount}', correctCount)
            .replace('{incorrectCount}', incorrectCount) || "Game complete!";
            gameMessage.className = 'message correct';
            checkButton.classList.add('hidden');
            answerInput.classList.add('hidden');
            nextButton.classList.add('hidden');
            clueText.textContent = 'Tidak ada lagi pertanyaan.';
            gameImage.src = 'https://lann.pw/get-upload?id=uploader-api-1:1752933871056.jpg';
            return;
        }

        attemptsLeft = MAX_ATTEMPTS; 
        const question = shuffledGameData[currentQuestionIndex];
        const attemp = loadedLangStrings[currentLanguage].attempts_left_message;
        gameImage.src = "https://raw.githubusercontent.com/Offmonprst/CatchTeenieping-Quest/refs/heads/main/image/" + question.image;
        clueText.textContent = question.from;
        answerInput.value = ''; 
        gameMessage.textContent = attemp.replace('{attemptsLeft}', attemptsLeft);
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
        	clearInterval(timerInterval);
        	playCorrectSound();
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
                gameMessage.textContent = loadedLangStrings[currentLanguage]?.incorrect_message_attempts?.replace('{attemptsLeft}', attemptsLeft) || `Wrong! You have ${attemptsLeft} attempts left.`;
                gameMessage.className = 'message incorrect';
                answerInput.focus();
                playIncorrectSound();
            } else {
                incorrectCount++;
                gameMessage.textContent = loadedLangStrings[currentLanguage]?.incorrect_message_no_attempts?.replace('{correctAnswer}', correctAnswer?.toUpperCase() || 'N/A') || `Attempts exhausted! The correct answer is: "${correctAnswer?.toUpperCase() || 'N/A'}".`;
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
    if (hamMenu) {
    hamMenu.addEventListener("click", () => {
    hamMenu.classList.toggle("active");
    offScreenMenu.classList.toggle("active");
    });
    }
     langToggleButton.addEventListener('click', () => {
     const nextLang = (currentLanguage === 'id') ? 'en' : 'id';
    applyLanguage(nextLang);
     });
    playMusicButton.addEventListener('click', playBackgroundMusic);
    pauseMusicButton.addEventListener('click', pauseBackgroundMusic);
    startButton.addEventListener('click', startGame);
    fetchLanguageStrings();
    updateScoreDisplay()
    loadQuestion();
});
