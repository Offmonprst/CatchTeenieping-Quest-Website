document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');
    const startButton = document.getElementById('startButton');
    const splashTitle = document.getElementById('splashTitle');
    const splashDesc1 = document.getElementById('splashDesc1');
    const splashDesc2 = document.getElementById('splashDesc2');
    const guessPictureGameContainer = document.getElementById('guessPictureGameContainer');
    const scrambleWordGameContainer = document.getElementById('scrambleWordGameContainer');
    const gameImage = document.getElementById('gameImage');
    const clueText = document.getElementById('clueText'); // clue for guess picture
    const answerInput = document.getElementById('answerInput'); // input for guess picture
    const checkButton = document.getElementById('checkButton'); // check button for guess picture
    const nextButton = document.getElementById('nextButton'); // next button for guess picture
    const questionTitle = document.getElementById('questionTitle'); // H1 title for guess picture
    const cluePrefix = document.getElementById('cluePrefix'); // "Petunjuk:" for guess picture
    const shuffledWordDisplay = document.getElementById('shuffledWord');
    const scrambleClueText = document.getElementById('scrambleClueText');
    const scrambleAnswerInput = document.getElementById('scrambleAnswerInput');
    const scrambleCheckButton = document.getElementById('scrambleCheckButton');
    const scrambleNextButton = document.getElementById('scrambleNextButton');
    const scrambleQuestionTitle = document.getElementById('scrambleTitle'); // H1 title for scramble word
    const scrambleCluePrefix = document.getElementById('scrambleCluePrefix'); // "Petunjuk:" for scramble word
    const scrambleHighScoreDisplay = document.getElementById('scrambleHighScore');
    const highScoreDisplay = document.getElementById('highScore'); // High score display (main)
    const highScoreLabel = document.getElementById("highScoreLabel"); // High score label (main)
    const currentScoreDisplay = document.getElementById('currentScoreDisplay'); // Current score display (main)
    const currentScoreLabel = document.getElementById("currentScoreLabel"); // Current score label (main)
    const gameMessage = document.getElementById('gameMessage'); // General game message area
    const timerDisplay = document.getElementById('timerDisplay'); // Timer display for Guess Picture
    const timerLabel = document.getElementById('timerLabel'); // Timer label for Guess Picture
    const timeUnitDisplay = document.getElementById('timeUnit'); // Time unit for Guess Picture ("detik")
    const scrambleTimerDisplay = document.getElementById('scrambleTimerDisplay'); // Timer display for Scramble Word
    const scrambleTimerLabel = document.getElementById('scrambleTimerLabel'); // Timer label for Scramble Word
    const scrambleTimeUnit = document.getElementById('scrambleTimeUnit'); // Time unit for Scramble Word
    const hamMenu = document.getElementById("menuToggle");
    const offScreenMenu = document.getElementById("moreOptionsContent"); // Hamburger menu content
    const langToggleButton = document.getElementById('langToggle'); 
    const splashLangID = document.getElementById('splashLangID'); // ID button in splash screen
    const splashLangEN = document.getElementById('splashLangEN'); // EN button in splash screen
    const playMusicButton = document.getElementById('playMusic');
    const pauseMusicButton = document.getElementById('pauseMusic');
    const goToGuessPictureButton = document.getElementById('goToGuessPicture'); // Game navigation button
    const goToScrambleWordButton = document.getElementById('goToScrambleWord'); // Game navigation button
    const milisecond = document.getElementById('secondLang');
    const quest = document.getElementById('Questions');
    const scrambleHighScoreLabel = document.getElementById('scrambleHighScoreLabel');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const correctSound = document.getElementById('correctSound');
    const incorrectSound = document.getElementById('incorrectSound');
    const donateTeks = document.getElementById('donateLink');
    const reportTeks = document.getElementById('reportBugLink');
    const scrambleCurrentScoreLabel = document.getElementById("scrambleCurrentScoreLabel");
    // === Konfigurasi Game Global ===
    const INITIAL_TIME_GP = 15; // Waktu awal dalam detik
    const INITIAL_TIME_SW = 45;
    const MAX_TIME = 60; // Waktu maksimum yang bisa dicapai timer
    const TIME_BONUS_CORRECT = 5; // Waktu bonus dalam detik untuk jawaban benar
    const MAX_ATTEMPTS = 2; // Batas percobaan menjawab per pertanyaan (per game type)

    const POINTS_CORRECT = 50; // Poin untuk jawaban benar
    const POINTS_INCORRECT = 25; // Poin untuk jawaban salah (akan dikurangi dari skor)

    const MUSIC_VOLUME = 0.8;
    const SFX_VOLUME = 0.9;

    // === URL Sumber Data ===
    // PASTIKAN URL GITHUB RAW ANDA BENAR DI SINI!
    const GUESS_PICTURE_DATA_URL = 'https://raw.githubusercontent.com/Offmonprst/CatchTeenieping-Quest/refs/heads/main/catch-teeniping.json'; 
    const SCRAMBLE_WORD_DATA_URL = 'https://raw.githubusercontent.com/Offmonprst/CatchTeenieping-Quest/refs/heads/main/catch-teeniping.json';
    const LANG_STRINGS_URL = 'https://raw.githubusercontent.com/Offmonprst/CatchTeenieping-Quest/refs/heads/main/lang_strings.json'; 

    // === Variabel Status Game Global ===
    let commonTimerInterval; // Timer yang digunakan bersama oleh kedua game
    let currentLanguage = 'id'; // Bahasa default
    let loadedLangStrings = {}; // Menyimpan string UI
    let currentActiveGame = null; // 'guessPicture' atau 'scrambleWord'

    // === Variabel Status Game (Tebak Gambar) ===
    let gp_currentQuestionIndex = 0;
    let gp_shuffledData = [];
    let gp_attemptsLeft = MAX_ATTEMPTS;
    let gp_timeLeft = INITIAL_TIME_GP;
    let gp_currentScore = 0;
    let gp_highScore = 0;
    let gp_rawData = [];

    // === Variabel Status Game (Susun Kata) ===
    let sw_currentQuestionIndex = 0;
    let sw_shuffledData = [];
    let sw_attemptsLeft = MAX_ATTEMPTS;
    let sw_timeLeft = INITIAL_TIME_SW;
    let sw_currentScore = 0;
    let sw_highScore = 0;
    let sw_rawData = [];
    let sw_correctAnswer = ''; // Jawaban benar untuk kata acak saat ini

    // === Fungsi Bantuan (Utilities) ===
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
  function acakHuruf(str) {
  let arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
       arr[j] = temp;
       }
      let result = arr.join(' - ');
      return result.toUpperCase();
     }
    // === Fungsi Kontrol Audio ===
    function playBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.volume = MUSIC_VOLUME;
            backgroundMusic.play().then(() => {
                if (playMusicButton) playMusicButton.classList.add('hidden');
                if (pauseMusicButton) pauseMusicButton.classList.remove('hidden');
            }).catch(error => {
                console.warn("Autoplay musik diblokir atau gagal diputar:", error);
                if (playMusicButton) playMusicButton.classList.remove('hidden');
                if (pauseMusicButton) pauseMusicButton.classList.add('hidden');
            });
        }
    }

    function pauseBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            if (playMusicButton) playMusicButton.classList.remove('hidden');
            if (pauseMusicButton) pauseMusicButton.classList.add('hidden');
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

    // === Fungsi Multi-bahasa (I18n) ===
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
        const allLangButtons = [splashLangID, splashLangEN];
        allLangButtons.forEach(button => {
            if (button) {
                if (button.id.includes(currentLanguage.toUpperCase())) {
                    button.classList.add('active-lang');
                } else {
                    button.classList.remove('active-lang');
                }
            }
        });

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
        timerLabel.textContent = currentLangStrings.time_left_display;
        milisecond.textContent = currentLangStrings.time_unit;
        cluePrefix.textContent = currentLangStrings.clue_prefix + " ";
        answerInput.placeholder = currentLangStrings.answer_input_placeholder;
        checkButton.textContent = currentLangStrings.check_button;
        nextButton.textContent = currentLangStrings.next_button;
        quest.textContent = currentLangStrings.question;
        donateTeks.textContent = currentLangStrings.donate;
        reportTeks.textContent = currentLangStrings.report;
        goToGuessPictureButton.textContent = currentLangStrings.guess_picture_game_nav;
        goToScrambleWordButton.textContent = currentLangStrings.scramble_word_game_nav;
        highScoreLabel.textContent = currentLangStrings.high_score_display;
        currentScoreLabel.textContent = currentLangStrings.current_score_display;
        scrambleCluePrefix.textContent = currentLangStrings.clue_prefix + " ";
        scrambleAnswerInput.placeholder = currentLangStrings.answer_input_placeholder;
        scrambleCheckButton.textContent = currentLangStrings.check_button;
        scrambleNextButton.textContent = currentLangStrings.next_button;
  	  scrambleQuestionTitle.textContent = currentLangStrings.scramble_game_title;
        scrambleHighScoreLabel.textContent = currentLangStrings.high_score_display;
        scrambleCurrentScoreLabel.textContent = currentLangStrings.current_score_display;
        scrambleTimerLabel.textContent = currentLangStrings.time_left_display;
        scrambleTimeUnit.textContent = currentLangStrings.time_unit;
    }

    // === Fungsi Logika Timer Umum (Digunakan oleh kedua game) ===
    function startCommonTimer(displayElement, initialTime, onTimeUpCallback) {
        clearInterval(commonTimerInterval); // Pastikan tidak ada timer lain berjalan
        let timerTimeLeft = initialTime; // Gunakan variabel lokal untuk waktu hitung mundur di dalam interval

        displayElement.textContent = timerTimeLeft;
        displayElement.style.color = 'var(--text-color)'; 

        commonTimerInterval = setInterval(() => {
            timerTimeLeft--;
            displayElement.textContent = timerTimeLeft;

            if (timerTimeLeft <= 10 && timerTimeLeft > 0) { 
                displayElement.style.color = 'var(--accent-color)'; 
            } else if (timerTimeLeft <= 0) {
                displayElement.style.color = 'var(--error-color)';
                clearInterval(commonTimerInterval);
                onTimeUpCallback(); // Panggil callback game over yang sesuai
            } else {
                displayElement.style.color = 'var(--text-color)'; 
            }
        }, 1000); 
    }

    // === Fungsi Game Over (Tebak Gambar) ===
    function guessPictureGameOver() {
        clearInterval(commonTimerInterval); 
        pauseBackgroundMusic(); 
        if (gp_currentScore > gp_highScore) { 
            gp_highScore = gp_currentScore;
            localStorage.setItem('guessPictureHighScore', gp_highScore); // Kunci unik
            updateGuessPictureHighScoreDisplay();
            gameMessage.textContent = loadedLangStrings[currentLanguage]?.time_up_message_game_over || "Time's Up! Game Over!"; 
            gameMessage.className = 'message incorrect';
            answerInput.value = '';
            answerInput.disabled = true;
            answerInput.classList.add('hidden');
            checkButton.classList.add('hidden'); 
            nextButton.classList.remove('hidden');
            nextButton.textContent = loadedLangStrings[currentLanguage]?.restart_game_button || "Restart Game";
            nextButton.removeEventListener('click', loadNextQuestion); 
            nextButton.addEventListener('click', restartGuessPictureGame); 
            gameImage.src = 'https://lann.pw/get-upload?id=uploader-api-1:1752933871056.jpg'; 
    }
}
    // === Fungsi Game Over (Susun Kata) ===
    function scrambleWordGameOver() {
        clearInterval(commonTimerInterval);
        pauseBackgroundMusic();
        if (sw_currentScore > sw_highScore) {
            sw_highScore = sw_currentScore;
            localStorage.setItem('scrambleWordHighScore', sw_highScore); // Kunci unik
            updateScrambleWordHighScoreDisplay();
        }
            scrambleGameMessage.textContent = loadedLangStrings[currentLanguage]?.time_up_message_game_over || "Time's Up! Game Over!";
            scrambleGameMessage.className = 'message incorrect';
            scrambleAnswerInput.value = '';
            scrambleAnswerInput.disabled = true;
            scrambleAnswerInput.classList.add('hidden');
            scrambleCheckButton.classList.add('hidden');
            scrambleNextButton.classList.remove('hidden');
            scrambleNextButton.textContent = loadedLangStrings[currentLanguage]?.restart_game_button || "Restart Game";
            scrambleNextButton.removeEventListener('click', loadNextScrambleWordQuestion);
            scrambleNextButton.addEventListener('click', restartScrambleWordGame);
            shuffledWordDisplay.textContent = loadedLangStrings[currentLanguage]?.game_over_word_display || "GAME OVER";
    }

    // === Fungsi Restart Game (Tebak Gambar) ===
    function restartGuessPictureGame() {
        gp_currentQuestionIndex = 0;
        gp_currentScore = 0;   
        gp_attemptsLeft = MAX_ATTEMPTS;
        gp_timeLeft = INITIAL_TIME_GP // Reset waktu awal game
         updateGuessPictureScoreDisplay(); 
         loadGuessPictureQuestion(); 
         nextButton.textContent = loadedLangStrings[currentLanguage]?.next_button || "Next"; 
         nextButton.removeEventListener('click', restartGuessPictureGame);
         nextButton.addEventListener('click', loadNextQuestion);
         guessPictureGameContainer.classList.remove('hidden');
         splashScreen.classList.add('hidden');
        playBackgroundMusic(); 
    }

    // === Fungsi Restart Game (Susun Kata) ===
    function restartScrambleWordGame() {
        sw_currentQuestionIndex = 0;
        sw_currentScore = 0;
        sw_attemptsLeft = MAX_ATTEMPTS;
        sw_timeLeft = INITIAL_TIME_SW; 
        updateScrambleWordScoreDisplay();
        loadScrambleWordQuestion();
        scrambleNextButton.textContent = loadedLangStrings[currentLanguage]?.next_button || "Next";
        scrambleNextButton.removeEventListener('click', restartScrambleWordGame);
        scrambleNextButton.addEventListener('click', loadNextScrambleWordQuestion);
        scrambleWordGameContainer.classList.remove('hidden');
        splashScreen.classList.add('hidden');
        playBackgroundMusic();
    }


    // === Fungsi Logika Skor ===
    // Tebak Gambar Score
    function updateGuessPictureScoreDisplay() {
       currentScoreDisplay.textContent = gp_currentScore;
    }

    function updateGuessPictureHighScoreDisplay() {
       highScoreDisplay.textContent = gp_highScore;
    }

    // Susun Kata Score
    function updateScrambleWordScoreDisplay() {
      scrambleCurrentScoreDisplay.textContent = sw_currentScore;
    }

    function updateScrambleWordHighScoreDisplay() {
        scrambleHighScoreDisplay.textContent = sw_highScore;
    }

    // === Fungsi Logika Game Utama (Tebak Gambar) ===
    async function fetchGuessPictureData() {
        try {
            const response = await fetch(GUESS_PICTURE_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} saat memuat ${GUESS_PICTURE_DATA_URL}`);
            }
            gp_rawData = await response.json();
            gp_shuffledData = shuffleArray([...gp_rawData]); 
            gp_currentQuestionIndex = 0; 
        } catch (error) {
            console.error("Gagal mengambil data game Tebak Gambar:", error);
            if (gameMessage) {
                gameMessage.textContent = loadedLangStrings[currentLanguage]?.["error_loading_game"] || "Failed to load game data. Please try again.";
                gameMessage.className = 'message incorrect';
            }
            return false; 
        }
        return true; 
    }

    async function loadGuessPictureQuestion() {
        clearInterval(commonTimerInterval); 

        if (gp_rawData.length === 0) {
            const success = await fetchGuessPictureData();
            if (!success) return; 
        }
        
        if (gp_currentQuestionIndex >= gp_shuffledData.length) {
            guessPictureGameOver(); 
            return;
        }

        gp_attemptsLeft = MAX_ATTEMPTS;
        const question = gp_shuffledData[gp_currentQuestionIndex];
        gameImage.src = "https://raw.githubusercontent.com/Offmonprst/CatchTeenieping-Quest/refs/heads/main/image/" + question.image;
        clueText.textContent = question.from; 
        answerInput.value = '';
        answerInput.classList.remove('hidden'); 
        answerInput.disabled = false; 
        answerInput.focus();
        gameMessage.textContent = loadedLangStrings[currentLanguage]?.attempts_left_message?.replace('{attemptsLeft}', gp_attemptsLeft) || `You have ${gp_attemptsLeft} attempts.`;
        gameMessage.className = 'message';
        nextButton.classList.add('hidden'); 
        checkButton.classList.remove('hidden'); 
        startCommonTimer(timerDisplay, gp_timeLeft, guessPictureGameOver);
    }

    function loadNextQuestion() {
        gp_currentQuestionIndex++;
        loadGuessPictureQuestion();
    }

    function checkGuessPictureAnswer() { 
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer = gp_shuffledData[gp_currentQuestionIndex]?.name?.toLowerCase(); 
        if (userAnswer === correctAnswer) {
            gp_currentScore += POINTS_CORRECT; 
                gameMessage.textContent = loadedLangStrings[currentLanguage]?.correct_message || "Correct! Your answer is right!";
                gameMessage.className = 'message correct';
                playCorrectSound();
                gp_timeLeft += TIME_BONUS_CORRECT;
                if (gp_timeLeft > MAX_TIME) {
                gp_timeLeft = MAX_TIME;
                }
                checkButton.classList.add('hidden');
                answerInput.classList.add('hidden');
                answerInput.disabled = true;
                nextButton.classList.remove('hidden');
                loadNextQuestion();
        } else {        
            gp_currentScore -= POINTS_INCORRECT;
            gp_attemptsLeft--; 
            if (gp_attemptsLeft > 0) {
                gameMessage.textContent = loadedLangStrings[currentLanguage]?.incorrect_message_attempts?.replace('{attemptsLeft}', gp_attemptsLeft) || `Wrong! You have ${gp_attemptsLeft} attempts left.`;
                gameMessage.className = 'message incorrect';
                playIncorrectSound();
                answerInput.focus();
                startCommonTimer(timerDisplay, gp_timeLeft, guessPictureGameOver); // Lanjutkan timer
            } else { 
                   gp_currentScore -= POINTS_INCORRECT; // Kurangi poin terakhir
                    gameMessage.textContent = loadedLangStrings[currentLanguage]?.incorrect_message_no_attempts?.replace('{correctAnswer}', correctAnswer?.toUpperCase() || 'N/A') || `Attempts exhausted! The correct answer is: "${correctAnswer?.toUpperCase() || 'N/A'}".`;
                    playIncorrectSound();
                    checkButton.classList.add('hidden');
                    answerInput.classList.add('hidden');
                    answerInput.disabled = true;
                    nextButton.classList.remove('hidden');
                    nextButton.removeEventListener('click', restartGuessPictureGame);
                    nextButton.addEventListener('click', loadNextQuestion);
            }
        }
        updateGuessPictureScoreDisplay(); 
    }

    // === Fungsi Logika Game (Susun Kata) ===
    async function fetchScrambleWordData() {
        try {
            const response = await fetch(SCRAMBLE_WORD_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} saat memuat ${SCRAMBLE_WORD_DATA_URL}`);
            }
            sw_rawData = await response.json();
            sw_shuffledData = shuffleArray([...sw_rawData]); 
            sw_currentQuestionIndex = 0; 
        } catch (error) {
            console.error("Gagal mengambil data game Susun Kata:", error);
            if (scrambleGameMessage) {
                scrambleGameMessage.textContent = loadedLangStrings[currentLanguage]?.["error_loading_game"] || "Failed to load game data. Please try again.";
                scrambleGameMessage.className = 'message incorrect';
            }
            return false; 
        }
        return true; 
    }

    async function loadScrambleWordQuestion() {
        clearInterval(commonTimerInterval);
        if (sw_rawData.length === 0) {
            const success = await fetchScrambleWordData();
            if (!success) return; 
        }
        if (sw_currentQuestionIndex >= sw_shuffledData.length) {
            scrambleWordGameOver(); 
            return;
        }
        sw_attemptsLeft = MAX_ATTEMPTS;
        const question = sw_shuffledData[sw_currentQuestionIndex];
        sw_correctAnswer = question.name.toLowerCase();
        shuffledWordDisplay.textContent = acakHuruf(question.name); 
        scrambleClueText.textContent = question.name.toUpperCase().replace(/[bcdfghjklmnpqrstvwxyz]/gi, '_')
        scrambleAnswerInput.value = '';
        scrambleAnswerInput.classList.remove('hidden');
        scrambleAnswerInput.disabled = false;
        scrambleAnswerInput.focus();
        scrambleGameMessage.textContent = loadedLangStrings[currentLanguage]?.attempts_left_message?.replace('{attemptsLeft}', sw_attemptsLeft) || `You have ${sw_attemptsLeft} attempts.`;
        scrambleGameMessage.className = 'message';
        scrambleNextButton.classList.add('hidden');
        scrambleCheckButton.classList.remove('hidden');
        startCommonTimer(scrambleTimerDisplay, sw_timeLeft, scrambleWordGameOver);
    }

    function loadNextScrambleWordQuestion() {
        sw_currentQuestionIndex++;
        loadScrambleWordQuestion();
    }

    function checkScrambleWordAnswer() {
        const userAnswer = scrambleAnswerInput.value.trim().toLowerCase();
        if (userAnswer === sw_correctAnswer) {
            sw_currentScore += POINTS_CORRECT; 
            scrambleGameMessage.textContent = loadedLangStrings[currentLanguage]?.correct_message || "Correct! Your answer is right!";
            playCorrectSound();
            sw_timeLeft += TIME_BONUS_CORRECT;
            if (sw_timeLeft > MAX_TIME) {
                sw_timeLeft = MAX_TIME;
            }
            scrambleCheckButton.classList.add('hidden');
            scrambleAnswerInput.classList.add('hidden');
            scrambleAnswerInput.disabled = true;
            scrambleNextButton.classList.remove('hidden');
            loadNextScrambleWordQuestion();
        } else {        
            sw_currentScore -= POINTS_INCORRECT; 
            sw_attemptsLeft--; 
            if (sw_attemptsLeft > 0) { 
                scrambleGameMessage.textContent = loadedLangStrings[currentLanguage]?.incorrect_message_attempts?.replace('{attemptsLeft}', sw_attemptsLeft) || `Wrong! You have ${sw_attemptsLeft} attempts left.`;
                scrambleGameMessage.className = 'message incorrect';
                playIncorrectSound();
                scrambleAnswerInput.focus();
                startCommonTimer(scrambleTimerDisplay, sw_timeLeft, scrambleWordGameOver);
            } else { 
                    scrambleGameMessage.textContent = loadedLangStrings[currentLanguage]?.incorrect_message_no_attempts?.replace('{correctAnswer}', sw_correctAnswer?.toUpperCase() || 'N/A') || `Attempts exhausted! The correct answer is: "${sw_correctAnswer?.toUpperCase() || 'N/A'}".`;
                    playIncorrectSound();
                    scrambleCheckButton.classList.add('hidden');
                    scrambleAnswerInput.classList.add('hidden');
                    scrambleAnswerInput.disabled = true;
                    scrambleNextButton.classList.remove('hidden');
                    scrambleNextButton.removeEventListener('click', restartScrambleWordGame);
                    scrambleNextButton.addEventListener('click', loadNextScrambleWordQuestion);
            }
        }
        updateScrambleWordScoreDisplay(); 
    }

    // === Fungsi Kontrol Tampilan Game ===
    async function startGame(gameType) { 
        if (splashScreen) splashScreen.classList.add('hidden');
        
        currentActiveGame = gameType; // Set game yang sedang aktif

        // Sembunyikan semua game container
        if (guessPictureGameContainer) guessPictureGameContainer.classList.add('hidden');
        if (scrambleWordGameContainer) scrambleWordGameContainer.classList.add('hidden');

        // Reset dan mulai game yang dipilih
        if (gameType === 'guessPicture') {
            if (guessPictureGameContainer) guessPictureGameContainer.classList.remove('hidden');
            gp_currentScore = 0; // Reset score untuk game ini
            gp_timeLeft = INITIAL_TIME_GP; // Reset waktu
            updateGuessPictureScoreDisplay(); // Update display
            updateGuessPictureHighScoreDisplay(); // Update display
            const success = await fetchGuessPictureData();
            if (success) {
                loadGuessPictureQuestion();
            } else {
                if (guessPictureGameContainer) guessPictureGameContainer.classList.add('hidden'); // Sembunyikan jika gagal
                if (splashScreen) splashScreen.classList.remove('hidden'); // Kembali ke splash
            }
        } else if (gameType === 'scrambleWord') {
            if (scrambleWordGameContainer) scrambleWordGameContainer.classList.remove('hidden');
            sw_currentScore = 0; // Reset score untuk game ini
            sw_timeLeft = INITIAL_TIME_SW; // Reset waktu
            updateScrambleWordScoreDisplay(); // Update display
            updateScrambleWordHighScoreDisplay(); // Update display
            const success = await fetchScrambleWordData();
            if (success) {
                loadScrambleWordQuestion();
            } else {
                if (scrambleWordGameContainer) scrambleWordGameContainer.classList.add('hidden'); // Sembunyikan jika gagal
                if (splashScreen) splashScreen.classList.remove('hidden'); // Kembali ke splash
            }
        }
        playBackgroundMusic(); 
    }


    // === Event Listeners ===
    checkButton.addEventListener('click', checkGuessPictureAnswer);
    scrambleCheckButton.addEventListener('click', checkScrambleWordAnswer);

    answerInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !checkButton.classList.contains('hidden') && !answerInput.disabled) {
            checkAnswer();
        }
    });
    if (scrambleAnswerInput) {
        scrambleAnswerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && scrambleCheckButton && !scrambleCheckButton.classList.contains('hidden') && !scrambleAnswerInput.disabled) {
                checkScrambleWordAnswer(); 
            }
        });
    }


    playMusicButton.addEventListener('click', playBackgroundMusic);
    if (pauseMusicButton) pauseMusicButton.addEventListener('click', pauseBackgroundMusic);
    
    // Start Button (untuk memulai game default pertama, bisa ganti jadi launch splash screen)
    startButton.addEventListener('click', () => startGame('guessPicture')); // Default start Tebak Gambar

    // Tombol Bahasa
     langToggleButton.addEventListener('click', () => {
     const nextLang = (currentLanguage === 'id') ? 'en' : 'id';
    applyLanguage(nextLang);
     });
     
    splashLangID.addEventListener('click', () => applyLanguage('id'));
    splashLangEN.addEventListener('click', () => applyLanguage('en'));
    
   goToGuessPictureButton.addEventListener('click', () => startGame('guessPicture'));
   goToScrambleWordButton.addEventListener('click', () => startGame('scrambleWord'));

    hamMenu.addEventListener("click", () => {
    hamMenu.classList.toggle("active");
    offScreenMenu.classList.toggle("active");
    });

    // === Inisialisasi Awal ===
    fetchLanguageStrings();
    gp_highScore = parseInt(localStorage.getItem('guessPictureHighScore') || 0); 
    updateGuessPictureHighScoreDisplay(); 
    sw_highScore = parseInt(localStorage.getItem('scrambleWordHighScore') || 0);
    updateScrambleWordHighScoreDisplay();
});