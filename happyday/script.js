// Personal messages for different relationships
const personalMessages = {
    mom: {
        title: "Mẹ Hà",
        symbol: "crystal-heart",
        roseMessage: "Mẹ, ngày 20/10 vuii con iu mẹ không lẽ nói zạy :> làm gì có mẹ ơi mấy nay nhổ răng đau quá chắc phải đi hà nội để hết đau quáquá💕",
        letterMessage: " cái lá thư này tạo ra cho vui chứ muốn con nói lời yêu thương gì trong này à ? không có luôn  💖"
    },
    aunt: {
        title: "Mợ Thanh Thanh",
        symbol: "playful-flame",
        roseMessage: " Mợ chúc mợ một ngày 20/10 vui vẻ với lại thèm bánh căn quá :>> 🔥",
        letterMessage: "cái lá thư này tạo ra cho vui chứ muốn con nói lời yêu thương gì trong này à ? không có luôn  🔥"
    },
    grandma: {
        title: "Ngoại Thu",
        symbol: "ancient-tree",
        roseMessage: " Ngoại 20/10 vui với cả coi chớ thằng Trí hết gạo rồi nhé  🌳",
        letterMessage: " cái lá thư này tạo ra cho vui chứ muốn con nói lời yêu thương gì trong này à ? không có luôn :>>  🌳"
    },
    stranger: {
        title: "Người lạ - Khách ghé thăm",
        symbol: "crystal-heart",
        roseMessage: "Chúc mừng 20/10! Cảm ơn bạn đã ghé thăm trang web nhỏ này của mình. Mong bạn có một ngày thật vui vẻ và hạnh phúc! 💖",
        letterMessage: "Bạn thân mến,<br><br>Cảm ơn bạn đã ghé thăm trang web nhỏ này của mình. Mình hy vọng bạn sẽ có một ngày 20/10 thật vui vẻ và ý nghĩa! 💕<br><br>Trí"
    }
};

// Emotional messages
const emotionalMessages = {
    mom: "thoi dỡn đó mẹ 20/10 zuii 💗",
    aunt: "thoi dỡn đó mợ 20/10 zuii 💗",
    grandma: "thoi dỡn đó ngoạingoại 20/10 zuii  💗",
    stranger: "thoi dỡn đó các bạn 20/10 zuii 💗"
};

// DOM Elements
const identityScreen = document.getElementById('identity-screen');
const voiceScreen = document.getElementById('voice-screen');
const roomScreen = document.getElementById('room-screen');
const emotionalScreen = document.getElementById('emotional-screen');
const endingScreen = document.getElementById('ending-screen');

const typingText = document.getElementById('typing-text');
const voiceText = document.getElementById('voice-text');
const emotionalMessage = document.getElementById('emotional-message');

const identityButtons = document.querySelectorAll('.identity-btn');
const enterBtn = document.getElementById('enter-btn');
const objectCards = document.querySelectorAll('.object-card');
const sendFeedbackBtn = document.getElementById('send-feedback');

// Symbol elements
const symbolContainer = document.getElementById('symbol-container');
const symbolTitle = document.getElementById('symbol-title');
const symbolDescription = document.getElementById('symbol-description');

// Modal elements
const roseModal = document.getElementById('rose-modal');
const letterModal = document.getElementById('letter-modal');
const cakeModal = document.getElementById('cake-modal');
const laptopModal = document.getElementById('laptop-modal');
const speakerModal = document.getElementById('speaker-modal');
const doorModal = document.getElementById('door-modal');
const feedbackModal = document.getElementById('feedback-modal');

const roseMessage = document.getElementById('rose-message');
const letterMessage = document.getElementById('letter-message');

// Audio elements
const backgroundMusic = document.getElementById('background-music');
const remixMusic = document.getElementById('remix-music');
const playRemixBtn = document.getElementById('play-remix');

// Symbol audio elements
const momHeartbeat = document.getElementById('mom-heartbeat');
const auntFire = document.getElementById('aunt-fire');
const grandmaWind = document.getElementById('grandma-wind');
const transitionSound = document.getElementById('transition-sound');

// Portal effect
const portalEffect = document.getElementById('portal-effect');

// Close buttons
const closeButtons = document.querySelectorAll('.close');

// Current relationship and state
let currentRelationship = null;
let currentScreen = 'identity';
let threeScene, camera, renderer;
let roomObjects = [];
let musicStarted = false; // Track if music has been started

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Start typing effect
    startTypingEffect();
    
    // Start background music immediately
    startBackgroundMusic();
    
    // Add click event listeners to identity buttons
    identityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const relationship = this.getAttribute('data-relationship');
            selectRelationship(relationship);
        });
    });

    // Add event listeners to main buttons
    enterBtn.addEventListener('click', enterRoom);
    sendFeedbackBtn.addEventListener('click', showFeedbackModal);

    // Add event listeners to object cards
    objectCards.forEach(card => {
        card.addEventListener('click', function() {
            const objectType = this.getAttribute('data-object');
            showObjectModal(objectType);
        });
    });

    // Add event listeners to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Add event listeners to music controls
    if (playRemixBtn) {
        playRemixBtn.addEventListener('click', toggleRemixMusic);
    }

    // Add symbol audio controls
    const momHeartbeatBtn = document.getElementById('mom-heartbeat-btn');
    const auntFireBtn = document.getElementById('aunt-fire-btn');
    const grandmaWindBtn = document.getElementById('grandma-wind-btn');
    
    if (momHeartbeatBtn) {
        momHeartbeatBtn.addEventListener('click', () => toggleSymbolAudio('mom-heartbeat'));
    }
    if (auntFireBtn) {
        auntFireBtn.addEventListener('click', () => toggleSymbolAudio('aunt-fire'));
    }
    if (grandmaWindBtn) {
        grandmaWindBtn.addEventListener('click', () => toggleSymbolAudio('grandma-wind'));
    }

    // Add feedback form handler
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }

    // Add door ending handler
    const enterEndingBtn = document.getElementById('enter-ending');
    if (enterEndingBtn) {
        enterEndingBtn.addEventListener('click', function() {
            doorModal.style.display = 'none';
            showEmotionalScreen();
        });
    }

    // Add music toggle handler
    const musicToggleBtn = document.getElementById('music-toggle');
    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', toggleBackgroundMusic);
    }

    // Initialize 3D scene
    init3DScene();
    
    // Add some interactive effects
    addInteractiveEffects();
    
    // Start music monitoring
    startMusicMonitoring();
}

// Typing effect for the first screen
function startTypingEffect() {
    const text = "Ai đang vào web của conn đó...?";
    let index = 0;
    
    function typeChar() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, 100);
        }
    }
    
    setTimeout(typeChar, 1000);
}

// Start background music function
function startBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3; // Set volume to 30%
        // Don't try to play immediately, wait for user interaction
        console.log('Background music ready, waiting for user interaction...');
    }
}

// Ensure music continues playing without restarting
function ensureMusicPlaying() {
    if (backgroundMusic && musicStarted) {
        // Only resume if it's actually paused
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(e => {
                console.log('Music resume failed:', e);
            });
        }
        // If it's already playing, do nothing
    }
}

// Toggle background music function
function toggleBackgroundMusic() {
    const musicToggleBtn = document.getElementById('music-toggle');
    
    if (backgroundMusic) {
        if (backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                musicToggleBtn.innerHTML = '<i class="fas fa-pause"></i> Tắt nhạc nền';
                musicStarted = true;
                console.log('Background music started');
            }).catch(e => {
                console.log('Music play failed:', e);
                showNotification('🎵 Không thể phát nhạc. Hãy thử click vào trang trước!');
            });
        } else {
            backgroundMusic.pause();
            musicToggleBtn.innerHTML = '<i class="fas fa-play"></i> Bật nhạc nền';
            console.log('Background music paused');
        }
    }
}

// Check and resume music periodically
function checkMusicStatus() {
    if (backgroundMusic && musicStarted && backgroundMusic.paused) {
        console.log('Music was paused, resuming...');
        backgroundMusic.play().catch(e => {
            console.log('Auto-resume failed:', e);
        });
    }
}

// Start music monitoring
function startMusicMonitoring() {
    // Check music status every 2 seconds
    setInterval(checkMusicStatus, 2000);
    
    // Add event listeners to resume music on user interaction
    document.addEventListener('click', function() {
        if (backgroundMusic && musicStarted && backgroundMusic.paused) {
            backgroundMusic.play().catch(e => console.log('Click resume failed:', e));
        }
    });
    
    document.addEventListener('keydown', function() {
        if (backgroundMusic && musicStarted && backgroundMusic.paused) {
            backgroundMusic.play().catch(e => console.log('Key resume failed:', e));
        }
    });
}

// Play sound effects function
function playSound(soundType) {
    const sounds = {
        'transition': transitionSound,
        'heartbeat': momHeartbeat,
        'fire': auntFire,
        'wind': grandmaWind
    };
    
    const sound = sounds[soundType];
    if (sound) {
        sound.volume = 0.5;
        sound.currentTime = 0; // Reset to beginning
        sound.play().catch(e => {
            console.log(`${soundType} sound play failed:`, e);
        });
    }
}

function selectRelationship(relationship) {
    currentRelationship = relationship;
    
    // Play selection sound
    playSound('transition');
    
    // Show portal effect
    showPortalEffect();
    
    // After portal effect, switch to voice screen
    setTimeout(() => {
        switchToVoiceScreen();
    }, 2000);
}

function showPortalEffect() {
    portalEffect.classList.remove('portal-hidden');
    
    // Hide identity screen
    identityScreen.style.animation = 'fadeOut 0.5s ease-in-out forwards';
    
    setTimeout(() => {
        identityScreen.classList.remove('active');
    }, 500);
}

function switchToVoiceScreen() {
    voiceScreen.classList.add('active');
    currentScreen = 'voice';
    
    // Display the selected symbol
    displaySelectedSymbol();
    
    // Start typing the voice message
    startVoiceTyping();
    
    // Hide portal effect
    portalEffect.classList.add('portal-hidden');
}

function displaySelectedSymbol() {
    const messageData = personalMessages[currentRelationship];
    
    // Update symbol info
    symbolTitle.textContent = messageData.title;
    symbolDescription.textContent = getSymbolDescription(currentRelationship);
    
    // Create and display the symbol
    const symbolElement = createSymbolElement(messageData.symbol);
    symbolContainer.innerHTML = '';
    symbolContainer.appendChild(symbolElement);
}

function getSymbolDescription(relationship) {
    const descriptions = {
        mom: "",
        aunt: "",
        grandma: "",
        stranger: ""
    };
    return descriptions[relationship] || descriptions.stranger;
}

function createSymbolElement(symbolType) {
    const container = document.createElement('div');
    container.className = symbolType;
    
    switch(symbolType) {
        case 'crystal-heart':
            container.innerHTML = `
                <div class="heart-core"></div>
                <div class="heart-glow"></div>
                <div class="warmth-rings">
                    <div class="ring ring-1"></div>
                    <div class="ring ring-2"></div>
                    <div class="ring ring-3"></div>
                </div>
            `;
            break;
        case 'playful-flame':
            container.innerHTML = `
                <div class="flame-core"></div>
                <div class="flame-body"></div>
                <div class="flame-tips">
                    <div class="tip tip-1"></div>
                    <div class="tip tip-2"></div>
                    <div class="tip tip-3"></div>
                </div>
                <div class="sparkles">
                    <div class="sparkle sparkle-1"></div>
                    <div class="sparkle sparkle-2"></div>
                    <div class="sparkle sparkle-3"></div>
                </div>
            `;
            break;
        case 'ancient-tree':
            container.innerHTML = `
                <div class="tree-trunk"></div>
                <div class="tree-roots">
                    <div class="root root-1"></div>
                    <div class="root root-2"></div>
                    <div class="root root-3"></div>
                </div>
                <div class="floating-leaves">
                    <div class="leaf leaf-1"></div>
                    <div class="leaf leaf-2"></div>
                    <div class="leaf leaf-3"></div>
                    <div class="leaf leaf-4"></div>
                    <div class="leaf leaf-5"></div>
                </div>
                <div class="tree-glow"></div>
            `;
            break;
    }
    
    return container;
}

function startVoiceTyping() {
    const text = "Dù là ai... thì kệ, vô xem thằng Trí làm gì trong này 😤";
    let index = 0;
    voiceText.textContent = '';
    
    function typeChar() {
        if (index < text.length) {
            voiceText.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, 80);
        }
    }
    
    setTimeout(typeChar, 500);
}

function enterRoom() {
    // Play door sound
    playSound('transition');
    
    // Switch to room screen
    voiceScreen.classList.remove('active');
    roomScreen.classList.add('active');
    currentScreen = 'room';
    
    // Initialize 3D room
    init3DRoom();
}

function init3DScene() {
    // Create 3D universe background
    const container = document.getElementById('universe-container');
    
    // Add floating stars
    for (let i = 0; i < 100; i++) {
        createStar(container);
    }
}

function createStar(container) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
    `;
    container.appendChild(star);
}

function init3DRoom() {
    const roomContainer = document.getElementById('room-3d');
    
    // Create simple 3D room visualization
    const room = document.createElement('div');
    room.className = 'room-3d-visual';
    room.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #2c3e50, #34495e);
        position: relative;
        overflow: hidden;
        border-radius: 20px;
    `;
    
    // Add room objects
    const objects = [
        { icon: '🌹', x: '20%', y: '30%', name: 'Bấm vô đây trước coi nó nói gì nè nè 😵‍💫' },
        { icon: '💌', x: '80%', y: '25%', name: 'Thư ảo' },
        { icon: '🧁', x: '50%', y: '60%', name: 'Bánh kem' },
        { icon: '💻', x: '30%', y: '70%', name: 'Laptop' },
        { icon: '🎵', x: '70%', y: '70%', name: '' }
    ];
    
    objects.forEach(obj => {
        const object = document.createElement('div');
        object.className = 'room-object';
        object.style.cssText = `
            position: absolute;
            left: ${obj.x};
            top: ${obj.y};
            font-size: 3rem;
            cursor: pointer;
            transition: transform 0.3s ease;
            animation: float 3s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        object.textContent = obj.icon;
        object.title = obj.name;
        
        object.addEventListener('mouseenter', () => {
            object.style.transform = 'scale(1.2)';
        });
        
        object.addEventListener('mouseleave', () => {
            object.style.transform = 'scale(1)';
        });
        
        room.appendChild(object);
    });
    
    roomContainer.appendChild(room);
}

// Object interaction functions
function showObjectModal(objectType) {
    // Play appropriate sound based on relationship and object
    if (objectType === 'rose' || objectType === 'letter') {
        if (currentRelationship === 'mom') playSound('heartbeat');
        else if (currentRelationship === 'aunt') playSound('fire');
        else if (currentRelationship === 'grandma') playSound('wind');
        else playSound('transition');
    } else {
        playSound('transition');
    }
    
    // Show the specific object modal
    const modal = document.getElementById(`${objectType}-modal`);
    if (modal) {
        modal.style.display = 'block';
        
        // Update content based on relationship
        if (objectType === 'rose' && roseMessage) {
            const messageData = personalMessages[currentRelationship];
            roseMessage.innerHTML = `<p>${messageData.roseMessage}</p>`;
        }
        
        if (objectType === 'letter' && letterMessage) {
            const messageData = personalMessages[currentRelationship];
            letterMessage.innerHTML = `<p>${messageData.letterMessage}</p>`;
        }
        
        // Special effects for cake
        if (objectType === 'cake') {
            createConfetti();
        }
    }
}

function createConfetti() {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#00ffff'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * window.innerWidth}px;
                top: -10px;
                z-index: 10000;
                animation: confettiFall 3s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

function toggleRemixMusic() {
    if (remixMusic.paused) {
        remixMusic.play().catch(e => {
            console.log('Audio play failed:', e);
            showNotification('🎵 Nhạc remix đã được kích hoạt!');
        });
        playRemixBtn.innerHTML = '<i class="fas fa-pause"></i> Tạm Dừng';
    } else {
        remixMusic.pause();
        playRemixBtn.innerHTML = '<i class="fas fa-play"></i> Phát Nhạc';
    }
}

function toggleSymbolAudio(audioId) {
    const audio = document.getElementById(audioId);
    const button = document.querySelector(`#${audioId}-btn`);
    
    if (audio && button) {
        if (audio.paused) {
            audio.play().catch(e => {
                console.log('Symbol audio play failed:', e);
                showNotification('🔊 Âm thanh đặc biệt đã được kích hoạt!');
            });
            button.innerHTML = '<i class="fas fa-pause"></i> Tạm Dừng';
        } else {
            audio.pause();
            button.innerHTML = button.innerHTML.replace('Tạm Dừng', 'Phát Âm Thanh');
        }
    }
}

function showFeedbackModal() {
    feedbackModal.style.display = 'block';
}

function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('feedback-name').value;
    const message = document.getElementById('feedback-message').value;
    
    // Here you would typically send the data to a server
    // For now, we'll just show a success message
    showNotification('💌 Cảm ơn bạn đã gửi lời chúc! Trí sẽ rất vui khi nhận được!');
    
    // Close modal and reset form
    feedbackModal.style.display = 'none';
    e.target.reset();
    
    // Move to emotional screen
    setTimeout(() => {
        showEmotionalScreen();
    }, 1000);
}

function showEmotionalScreen() {
    roomScreen.classList.remove('active');
    emotionalScreen.classList.add('active');
    currentScreen = 'emotional';
    
    // Set emotional message
    const message = emotionalMessages[currentRelationship];
    emotionalMessage.textContent = message;
    
    // Music will be handled by monitoring system
    
    // After emotional moment, show ending
    setTimeout(() => {
        showEndingScreen();
    }, 8000);
}

function showEndingScreen() {
    emotionalScreen.classList.remove('active');
    endingScreen.classList.add('active');
    currentScreen = 'ending';
    
    // Display final symbol
    displayFinalSymbol();
}

function displayFinalSymbol() {
    const messageData = personalMessages[currentRelationship];
    const finalSymbolContainer = document.getElementById('final-symbol-container');
    const finalSymbolTitle = document.getElementById('final-symbol-title');
    const finalSymbolDescription = document.getElementById('final-symbol-description');
    
    if (finalSymbolContainer && finalSymbolTitle && finalSymbolDescription) {
        // Update final symbol info
        finalSymbolTitle.textContent = messageData.title;
        finalSymbolDescription.textContent = getFinalSymbolDescription(currentRelationship);
        
        // Create and display the final symbol
        const symbolElement = createSymbolElement(messageData.symbol);
        finalSymbolContainer.innerHTML = '';
        finalSymbolContainer.appendChild(symbolElement);
    }
}

function getFinalSymbolDescription(relationship) {
    const descriptions = {
        mom: "! 💖",
        aunt: " 🔥",
        grandma: " 🌳",
        stranger: "Cảm ơn bạn đã ghé thăm vũ trụ của Trí. Chúc bạn một ngày 20/10 thật vui vẻ! 💕"
    };
    return descriptions[relationship] || descriptions.stranger;
}

function showMemories() {
    memoriesModal.style.display = 'block';
    
    // Add some animation to memory items
    const memoryItems = document.querySelectorAll('.memory-item');
    memoryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'fadeInUp 0.5s ease-out forwards';
        }, index * 100);
    });
}

function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(e => {
            console.log('Audio play failed:', e);
            // Fallback: show a message instead of playing audio
            showNotification('🎵 Nhạc nền đã được kích hoạt! (Cần tương tác với trang để phát nhạc)');
        });
        playMusicBtn.innerHTML = '<i class="fas fa-pause"></i> Tạm Dừng';
    } else {
        backgroundMusic.pause();
        playMusicBtn.innerHTML = '<i class="fas fa-play"></i> Phát Nhạc';
    }
}

function showLoveMessage() {
    loveModal.style.display = 'block';
    
    // Trigger heart explosion animation
    const heartExplosion = document.querySelector('.heart-explosion');
    heartExplosion.style.animation = 'none';
    setTimeout(() => {
        heartExplosion.style.animation = 'heartBeat 1s ease-in-out infinite';
    }, 10);
}

function addInteractiveEffects() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click ripple effect to buttons
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });

    // Add floating animation to hearts
    animateFloatingHearts();
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function animateFloatingHearts() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        // Randomize animation duration and delay
        const duration = 4 + Math.random() * 4; // 4-8 seconds
        const delay = Math.random() * 2; // 0-2 seconds delay
        
        heart.style.animationDuration = duration + 's';
        heart.style.animationDelay = delay + 's';
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #feca57);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-30px); }
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(50px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add some fun interactions
document.addEventListener('keydown', function(e) {
    // Press 'H' for hearts
    if (e.key.toLowerCase() === 'h') {
        createRandomHeart();
    }
    
    // Press 'L' for love message
    if (e.key.toLowerCase() === 'l') {
        showLoveMessage();
    }
});

function createRandomHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.cssText = `
        position: fixed;
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight}px;
        animation: floatUp 3s ease-out forwards;
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// Add float up animation
const floatUpStyle = document.createElement('style');
floatUpStyle.textContent = `
    @keyframes floatUp {
        from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatUpStyle);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    showNotification('🎉 Bạn đã tìm thấy Easter Egg! Trí rất ấn tượng! 🎉');
    
    // Create a shower of hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createRandomHeart();
        }, i * 100);
    }
}
