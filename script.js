// Tarot Card Web Application Logic

// Synthesized Web Audio API Sound Controller
class TarotAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio API is not supported in this browser.", e);
      }
    }
    // Resume context if suspended (browser security)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playShuffle() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    
    // Series of card ruffle sounds
    for (let i = 0; i < 8; i++) {
      const time = now + i * 0.12;
      this.playCardRuffle(time);
    }
  }

  playCardRuffle(time) {
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, time);
    filter.Q.setValueAtTime(4, time);
    
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.07, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start(time);
    osc.stop(time + 0.11);
  }

  playFlip() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    
    // Swoop sound
    const swoopOsc = this.ctx.createOscillator();
    const swoopGain = this.ctx.createGain();
    swoopOsc.frequency.setValueAtTime(70, now);
    swoopOsc.frequency.exponentialRampToValueAtTime(380, now + 0.35);
    
    swoopGain.gain.setValueAtTime(0.06, now);
    swoopGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    swoopOsc.connect(swoopGain);
    swoopGain.connect(this.ctx.destination);
    swoopOsc.start(now);
    swoopOsc.stop(now + 0.35);
    
    // Sparkly celestial chime (arpeggio)
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    frequencies.forEach((freq, idx) => {
      const chimeTime = now + 0.15 + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, chimeTime);
      
      gain.gain.setValueAtTime(0, chimeTime);
      gain.gain.linearRampToValueAtTime(0.04, chimeTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, chimeTime + 0.7);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(chimeTime);
      osc.stop(chimeTime + 0.8);
    });
  }

  playHover() {
    this.init();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(293.66, now); // D4 (Soft warm note)
    
    gain.gain.setValueAtTime(0.012, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }
}

const audio = new TarotAudio();

// Complete Tarot Card Data Pool (12 Cards with local images)
const tarotDeck = [
  {
    id: "the_fool",
    name: "0. The Fool (바보)",
    image: "assets/the_fool.png",
    general: "새로운 시작과 무한한 가능성의 카드입니다. 완벽한 계획이 없더라도 마음에 이끌리는 대로 순수하게 첫 발을 내딛기 좋은 날입니다. 모험심이 행운을 부릅니다.",
    love: "상대방에 대한 조건 없는 호감이나 설렘이 생기는 날입니다. 얽매이지 않는 신선한 연애 감정을 나눌 수 있습니다.",
    career: "새로운 프로젝트나 낯선 영역의 도전에 매우 긍정적입니다. 계산적인 태도보다는 열정적인 실행력이 열쇠입니다.",
    advice: "지나친 걱정이나 두려움은 내려놓으세요. 마음을 비우고 자유를 만끽할 때 새로운 차원이 열립니다."
  },
  {
    id: "the_magician",
    name: "I. The Magician (마법사)",
    image: "assets/the_magician.png",
    general: "창의력, 자신감, 그리고 주도권의 카드입니다. 당신은 이미 필요한 모든 능력과 도구를 손에 쥐고 있습니다. 머릿속 아이디어를 실행으로 옮기기에 더없이 완벽한 타이밍입니다.",
    love: "당신의 매력이 극대화되어 상대방을 매료시킬 수 있는 날입니다. 솔직하고 위트 있는 대화가 호감을 키웁니다.",
    career: "탁월한 소통 능력과 창의성을 발휘해 어려운 업무나 협상을 성공적으로 풀어나가게 됩니다. 능력 발휘에 최적입니다.",
    advice: "망설이지 말고 적극적으로 기획하고 말하세요. 당신의 능력을 세상에 꺼내 보일 때입니다."
  },
  {
    id: "the_lovers",
    name: "VI. The Lovers (연인)",
    image: "assets/the_lovers.png",
    general: "조화, 매력적인 관계, 그리고 중요한 선택의 카드입니다. 마음이 맞는 동료나 사랑하는 사람과의 깊은 감정 교류가 예상되며, 조화로운 소통이 하루의 활력이 될 것입니다.",
    love: "서로에 대한 애정이 더욱 견고해지고 마음이 통하는 최고의 날입니다. 싱글이라면 강한 끌림을 느끼는 인연을 만날 수 있습니다.",
    career: "팀워크와 파트너십이 아주 훌륭하게 작용합니다. 다른 사람과의 협업 및 의사소통에서 기대 이상의 이익을 얻게 됩니다.",
    advice: "마음의 소리에 귀를 기울이고, 머리보다는 진실된 감정이 가리키는 방향을 선택하세요."
  },
  {
    id: "the_hermit",
    name: "IX. The Hermit (은둔자)",
    image: "assets/the_hermit.png",
    general: "성찰, 내면의 지혜, 그리고 조용한 탐색의 카드입니다. 외적인 번잡함에서 벗어나 나만의 시간을 갖고 차분히 생각을 정리하기 좋은 날입니다. 진리는 이미 내면에 있습니다.",
    love: "외적인 화려함보다는 서로의 깊은 신뢰와 정신적 교감을 나누는 단계입니다. 혼자만의 충전 시간이 필요할 수도 있습니다.",
    career: "당장의 성과를 내기보다 장기적인 계획을 세우거나 깊이 있는 학업, 연구, 분석 작업에 고도의 집중력을 발휘할 수 있습니다.",
    advice: "소란스러운 외부 조언 대신, 내면의 고요 속에 숨겨진 등불을 찾으세요. 조용한 기다림이 답을 줍니다."
  },
  {
    id: "the_star",
    name: "XVII. The Star (별)",
    image: "assets/the_star.png",
    general: "희망, 영감, 그리고 마음의 치유를 상징하는 아주 긍정적인 카드입니다. 힘든 시간이 지나가고 내면에 평온한 빛이 채워지는 날입니다. 우주가 당신에게 긍정의 기운을 보냅니다.",
    love: "상처를 딛고 새로운 사랑에 대한 믿음이 샘솟습니다. 순수하고 이상적인 교감을 나누기에 좋은 때입니다.",
    career: "영감이 넘쳐나고 미래에 대한 낙관적인 청사진이 그려집니다. 예술적인 활동이나 기획 업무에서 두각을 나타냅니다.",
    advice: "자신의 재능과 운명을 온전히 믿으세요. 어두운 밤하늘 속에서도 당신을 인도하는 별은 항상 빛나고 있습니다."
  },
  {
    id: "the_sun",
    name: "XIX. The Sun (태양)",
    image: "assets/the_sun.png",
    general: "성공, 활력, 기쁨, 그리고 풍요를 상징하는 최고의 긍정 카드입니다. 모든 일이 명확해지고 활기찬 에너지가 뿜어져 나옵니다. 따뜻한 행운이 하루를 가득 밝혀줍니다.",
    love: "꾸밈없이 솔직하고 정열적인 사랑이 이루어지는 날입니다. 서로에게 큰 웃음과 기쁨을 주는 맑은 관계가 유지됩니다.",
    career: "노력해 온 일들이 마침내 환한 빛을 발하며 주변의 인정과 축하를 받습니다. 리더십을 발휘하기에도 좋습니다.",
    advice: "자신을 온전히 드러내고 하루를 즐기세요! 밝은 에너지는 주변 사람들에게도 행복을 전파합니다."
  },
  {
    id: "the_moon",
    name: "XVIII. The Moon (달)",
    image: "assets/the_moon.png",
    general: "불안감, 미스터리, 그리고 직관과 환상의 카드입니다. 주변 상황이 모호하게 느껴지거나 내면의 불안감이 피어오를 수 있습니다. 그러나 이는 더 깊은 감수성과 직관을 깨우는 통로가 되기도 합니다.",
    love: "오해나 사소한 감정의 오르내림이 있을 수 있습니다. 성급한 추측이나 의심을 피하고 차분히 대화할 타이밍입니다.",
    career: "서류 검토나 계약 조율 시 숨겨진 함정이 없는지 꼼꼼하게 더블 체크가 필요합니다. 본능적인 직관을 신뢰하세요.",
    advice: "안개 속을 걷는 듯한 불확실성 속에서도 걱정 마세요. 달빛은 어둠 속 미세한 길을 안내해 줄 것입니다."
  },
  {
    id: "the_world",
    name: "XXI. The World (세계)",
    image: "assets/the_world.png",
    general: "완성과 조화, 성공적인 결말, 그리고 새로운 차원의 시작을 알리는 궁극적인 조화의 카드입니다. 하나의 주기가 완벽하게 조화를 이루며 매듭지어지는 해방감과 성취감을 만끽할 수 있습니다.",
    love: "서로에게 궁극적인 동반자로서 안정을 느끼거나, 오랫동안 앓아왔던 연애 문제가 완벽히 해결되는 날입니다.",
    career: "프로젝트를 성공리에 완수하고 최고의 만족감을 얻습니다. 당신의 입지와 역량이 마침내 완벽하게 증명됩니다.",
    advice: "성취를 마음껏 축하하고 스스로를 격려해 주세요. 이제 한 단계 높은 도약의 무대가 기다리고 있습니다."
  },
  {
    id: "wheel_of_fortune",
    name: "X. Wheel of Fortune (운명의 수레바퀴)",
    image: "assets/wheel_of_fortune.png",
    general: "변화, 운명적인 흐름, 그리고 전환점의 카드입니다. 거스를 수 없는 긍정적인 운명의 흐름이 시작되고 있습니다. 예기치 못한 우연이나 행운의 기회가 찾아올 예정이니 주저 없이 흐름에 몸을 맡기세요.",
    love: "거부하기 힘든 운명적인 만남이나 뜻밖의 고백이 있을 수 있습니다. 관계의 큰 터닝 포인트를 맞이하게 됩니다.",
    career: "막혔던 프로젝트의 흐름이 급변하며 순풍을 타게 되거나, 뜻밖의 이직 및 제안 등 반가운 소식을 접할 수 있습니다.",
    advice: "세상의 모든 변화에는 주기가 있습니다. 과거에 머무르기보다는 다가오는 변화의 물결을 유연하게 받아들이세요."
  },
  {
    id: "strength",
    name: "VIII. Strength (힘)",
    image: "assets/strength.png",
    general: "내면의 인내심, 부드러운 힘, 그리고 극복의 카드입니다. 물리적인 권력이나 공격적인 언행이 아닌, 부드러운 카리스마와 자애로운 태도로 맹수를 길들이듯 어려움을 슬기롭게 해결해 나갈 힘이 당신 안에 있습니다.",
    love: "상대방의 약점까지 품어주는 깊은 포용력이 관계를 견고하게 지탱합니다. 따뜻한 포용으로 갈등을 녹여낼 수 있습니다.",
    career: "압박감이 강한 상황에서도 감정에 휩쓸리지 않고 평정심을 유지하여 훌륭히 마무리를 지어 신뢰를 쌓습니다.",
    advice: "분노나 조급함을 다스리고 미소로 대처하세요. 부드러운 인내가 강한 바람보다 언제나 더 강력합니다."
  },
  {
    id: "justice",
    name: "XI. Justice (정의)",
    image: "assets/justice.png",
    general: "균형, 공정함, 결정적인 진실을 판단하는 카드입니다. 감정에 흔들리지 않고 객관적이고 이성적으로 사안을 검토해야 하는 날입니다. 당신의 도덕적인 선택이 올바른 방향을 제시할 것입니다.",
    love: "서로 대등한 입장에서 관계를 바라보며 조화를 유지하는 시기입니다. 서운했던 일은 논리적이고 정중하게 풀어나가세요.",
    career: "계약, 문서 조율, 결정적인 업무 평가 등에서 공정한 처우와 명확한 판단력을 바탕으로 한 정직한 결과를 이끌어냅니다.",
    advice: "한쪽으로 치우치지 않는 이성적 저울을 유지하세요. 정직과 명확성이 가장 단단한 무기입니다."
  },
  {
    id: "temperance",
    name: "XIV. Temperance (절제)",
    image: "assets/temperance.png",
    general: "절제, 중용, 그리고 치유와 융합의 카드입니다. 극단적인 선택이나 감정을 삼가고, 상반된 입장들을 부드럽게 절충하여 조화로운 균형점을 찾는 것이 매우 중요하며, 이를 통해 평화가 찾아옵니다.",
    love: "서로 양보하고 배려하며 잔잔하고 조화롭게 흘러가는 연애 기간입니다. 자극보다는 편안함이 가치를 발휘합니다.",
    career: "의견 대립이 있는 부서나 팀원 사이에서 조율자 역할을 하며 문제를 원만하게 정돈해 큰 기여를 하게 됩니다.",
    advice: "너무 넘치지도 부족하지도 않게 물을 섞어 적절한 온도를 맞추듯, 조급증을 내려놓고 여유로운 페이스를 찾으세요."
  }
];

// App States and DOM Elements
const landingPanel = document.getElementById('landing-panel');
const cardBoard = document.getElementById('card-board');
const readingPanel = document.getElementById('reading-panel');
const boardPrompt = document.getElementById('board-prompt');
const shuffleBtn = document.getElementById('shuffle-btn');

let currentSpread = [];
let selectedIndex = -1;
let interactionAllowed = false;

// 1. Initialize Event Listeners
shuffleBtn.addEventListener('click', () => {
  audio.init();
  startTarotReading();
});

// 2. Start Tarot Reading Flow
function startTarotReading() {
  // UI Reset
  landingPanel.classList.add('fade-out');
  readingPanel.classList.remove('active');
  cardBoard.innerHTML = '';
  cardBoard.classList.remove('active');
  selectedIndex = -1;
  interactionAllowed = false;

  setTimeout(() => {
    landingPanel.style.display = 'none';
    cardBoard.classList.add('active');
    
    // Play Shuffle Sound and build shuffling overlay animation
    audio.playShuffle();
    boardPrompt.textContent = "운명의 카드를 섞는 중입니다...";
    
    const shuffleContainer = document.createElement('div');
    shuffleContainer.className = 'shuffle-effect shuffle-active';
    for (let i = 0; i < 3; i++) {
      const placeholder = document.createElement('div');
      placeholder.className = 'card-shuffle-placeholder';
      placeholder.style.animationDelay = `${i * 0.25}s`;
      shuffleContainer.appendChild(placeholder);
    }
    cardBoard.appendChild(shuffleContainer);

    // After Shuffling animation, deal cards
    setTimeout(() => {
      shuffleContainer.remove();
      dealCards();
    }, 1200);

  }, 500);
}

// 3. Select 7 random cards and layout
function dealCards() {
  // Shuffle complete pool and pick 7 cards
  const shuffledPool = [...tarotDeck].sort(() => 0.5 - Math.random());
  currentSpread = shuffledPool.slice(0, 7);

  boardPrompt.textContent = "신중하게 마음을 가다듬고 카드 1장을 선택해 주세요.";

  currentSpread.forEach((cardData, idx) => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';
    
    // We will apply 'dealt' class sequentially with a slight delay for dynamic feel
    setTimeout(() => {
      cardWrapper.classList.add('dealt');
    }, idx * 100);

    // Inner card structure (front, back, flip containers)
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    // Back card face (uses the generated image)
    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';
    cardBack.style.backgroundImage = `url('assets/card_back.png')`;

    // Front card face
    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';

    // Illustrated card
    const img = document.createElement('img');
    img.src = cardData.image;
    img.alt = cardData.name;
    img.className = 'card-img';
    
    const titleBanner = document.createElement('div');
    titleBanner.className = 'card-title-banner';
    // extract only Korean name for simple UI
    const nameParts = cardData.name.split(' (');
    const krName = nameParts.length > 1 ? nameParts[1].replace(')', '') : cardData.name;
    titleBanner.textContent = krName;

    cardFront.appendChild(img);
    cardFront.appendChild(titleBanner);

    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    cardWrapper.appendChild(cardInner);
    
    // Audio on hover
    cardWrapper.addEventListener('mouseenter', () => {
      if (interactionAllowed && selectedIndex === -1) {
        audio.playHover();
      }
    });

    // Handle selection click
    cardWrapper.addEventListener('click', () => {
      if (interactionAllowed && selectedIndex === -1) {
        selectCard(cardWrapper, idx);
      }
    });

    cardBoard.appendChild(cardWrapper);
  });

  // Enable interaction after card dealing finishes
  setTimeout(() => {
    interactionAllowed = true;
  }, 1000);
}

// 4. Handle card selection
function selectCard(selectedWrapper, idx) {
  selectedIndex = idx;
  interactionAllowed = false;
  boardPrompt.textContent = "";

  audio.playFlip();

  // Selected Card moves to center & flips
  selectedWrapper.classList.add('selected-focus');
  selectedWrapper.classList.add('flipped');

  // Fade out other cards
  const allCards = document.querySelectorAll('.card-wrapper');
  allCards.forEach((card, i) => {
    if (i !== idx) {
      card.classList.add('fade-away');
    }
  });

  // Display daily reading details after flip animation finishes
  setTimeout(() => {
    showReadingResult(currentSpread[idx]);
  }, 900);
}

// 5. Populate and show reading result panel
function showReadingResult(card) {
  const nameEl = document.getElementById('res-card-name');
  const generalEl = document.getElementById('res-general');
  const loveEl = document.getElementById('res-love');
  const careerEl = document.getElementById('res-career');
  const adviceEl = document.getElementById('res-advice');
  const actionContainer = document.querySelector('.reading-actions');

  nameEl.textContent = card.name;
  generalEl.textContent = card.general;
  loveEl.textContent = card.love;
  careerEl.textContent = card.career;
  adviceEl.textContent = card.advice;

  readingPanel.classList.add('active');
  readingPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Update actions block
  actionContainer.innerHTML = '';
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn-secondary';
  resetBtn.textContent = '다른 운세 뽑아보기';
  resetBtn.addEventListener('click', resetTarotApp);
  actionContainer.appendChild(resetBtn);
}

// 6. Reset Tarot Application
function resetTarotApp() {
  readingPanel.classList.remove('active');
  cardBoard.classList.remove('active');
  cardBoard.innerHTML = '';
  
  landingPanel.style.display = 'flex';
  setTimeout(() => {
    landingPanel.classList.remove('fade-out');
  }, 50);
}
