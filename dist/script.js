const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const siteHeader = document.querySelector('[data-header]');
const hero = document.querySelector('.hero');

const updateHeaderState = () => {
  if (!siteHeader || !hero) return;
  siteHeader.classList.toggle('is-scrolled', hero.getBoundingClientRect().bottom <= 60);
};

updateHeaderState();
if ('IntersectionObserver' in window && hero) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    siteHeader?.classList.toggle('is-scrolled', !entry.isIntersecting);
  }, { rootMargin: '-60px 0px 0px 0px' });
  heroObserver.observe(hero);
} else {
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

if (menuButton && mobileNav) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'メニューを開く');
    mobileNav.hidden = true;
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) closeMenu();
  });
}

const quizQuestions = [
  {
    question: 'どんな味わいが好きですか？',
    options: [
      { label: 'すっきり、軽やかな味', scores: { fruity: 2 }, preference: 'fruity' },
      { label: 'バランスの良い味', scores: { balance: 2 }, preference: 'balance' },
      { label: 'コクのある、まろやかな味', scores: { rich: 2 }, preference: 'rich' },
      { label: 'しっかり苦味を感じる味', scores: { deep: 2 }, preference: 'deep' },
    ],
  },
  {
    question: 'コーヒーはどんな飲み方が多いですか？',
    options: [
      { label: 'ブラックで飲むことが多い', scores: { fruity: 1, deep: 1 } },
      { label: 'ブラックもミルク入りもどちらも飲む', scores: { balance: 2 } },
      { label: 'ミルクを入れて飲むことが多い', scores: { rich: 2 } },
      { label: '気分でいろいろ変える', scores: { balance: 1, rich: 1 } },
    ],
  },
  {
    question: 'コーヒーを飲みたいのはどんな時間ですか？',
    options: [
      { label: '朝のスタートに', scores: { fruity: 2 }, preference: 'fruity' },
      { label: '仕事や家事の合間に', scores: { balance: 2 }, preference: 'balance' },
      { label: 'ほっと一息つく時間に', scores: { rich: 2 }, preference: 'rich' },
      { label: '夜や、気分を落ち着けたい時間に', scores: { deep: 2 }, preference: 'deep' },
    ],
  },
  {
    question: '好きな香りに近いのは？',
    options: [
      { label: '花や柑橘のような華やかな香り', scores: { fruity: 2 }, preference: 'fruity' },
      { label: 'やさしく飲みやすい香り', scores: { balance: 2 }, preference: 'balance' },
      { label: 'ナッツやチョコのような香り', scores: { rich: 2 }, preference: 'rich' },
      { label: '香ばしく深みのある香り', scores: { deep: 2 }, preference: 'deep' },
    ],
  },
  {
    question: '飲んだあとに残ってほしい印象は？',
    options: [
      { label: '軽やかでさっぱり', scores: { fruity: 2 } },
      { label: '心地よく、ちょうどいい余韻', scores: { balance: 2 } },
      { label: 'やさしい甘さとまろやかさ', scores: { rich: 2 } },
      { label: 'しっかりとした深い余韻', scores: { deep: 2 } },
    ],
  },
];

const quizResults = {
  fruity: {
    title: 'FRUITY TYPE',
    description: '華やかな香りと、<br />軽やかな酸味を楽しめるタイプ。',
    coffee: 'ETHIOPIA YIRGACHEFFE',
    notes: 'Floral / Citrus / Clean',
    taste: { 酸味: 4, 苦味: 1, コク: 2, 香り: 5 },
  },
  balance: {
    title: 'BALANCE TYPE',
    description: '酸味・苦味・コクのバランスがよく、<br />毎日心地よく楽しめるタイプ。',
    coffee: 'COLOMBIA SUPREMO',
    notes: 'Sweet / Balanced / Smooth',
    taste: { 酸味: 3, 苦味: 3, コク: 3, 香り: 3 },
  },
  rich: {
    title: 'RICH TYPE',
    description: 'やわらかな甘さとコクを<br />じっくり楽しめるタイプ。',
    coffee: 'BRAZIL SANTOS',
    notes: 'Nutty / Sweet / Round',
    taste: { 酸味: 2, 苦味: 3, コク: 4, 香り: 4 },
  },
  deep: {
    title: 'DEEP TYPE',
    description: 'しっかりとした苦味と<br />深いコクを楽しめるタイプ。',
    coffee: 'MANDHELING DARK ROAST',
    notes: 'Bitter / Smoky / Full-bodied',
    taste: { 酸味: 1, 苦味: 5, コク: 4, 香り: 3 },
  },
};

const quizModal = document.querySelector('[data-quiz-modal]');
const quizDialog = quizModal?.querySelector('.quiz-dialog');
const quizView = quizModal?.querySelector('[data-quiz-view]');
const openQuizButtons = document.querySelectorAll('[data-open-quiz]');
const coffeeModal = document.querySelector('[data-coffee-modal]');
const policyModal = document.querySelector('[data-policy-modal]');
let currentQuestion = 0;
let answers = Array(quizQuestions.length).fill(null);
let lastFocusedElement = null;
let activeModal = null;

const openModal = (modal, focusTarget) => {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  activeModal = modal;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  window.requestAnimationFrame(() => {
    modal.classList.add('is-open');
    (focusTarget || modal.querySelector('.quiz-close'))?.focus();
  });
};

const closeModal = (restoreFocus = true) => {
  if (!activeModal) return;
  const modal = activeModal;
  const focusTarget = lastFocusedElement;
  activeModal = null;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  window.setTimeout(() => {
    modal.hidden = true;
    if (restoreFocus && focusTarget instanceof HTMLElement) focusTarget.focus();
  }, 220);
};

const resetQuiz = () => {
  currentQuestion = 0;
  answers = Array(quizQuestions.length).fill(null);
};

const focusFirstControl = () => {
  window.requestAnimationFrame(() => {
    quizView?.querySelector('button:not([disabled]), a')?.focus();
  });
};

const renderQuestion = () => {
  if (!quizView) return;
  const item = quizQuestions[currentQuestion];
  const selected = answers[currentQuestion];
  quizView.style.animation = 'none';
  quizView.offsetHeight;
  quizView.style.animation = '';
  quizView.innerHTML = `
    <div class="quiz-meta"><span>QUESTION ${String(currentQuestion + 1).padStart(2, '0')}</span><span>${currentQuestion + 1} / ${quizQuestions.length}</span></div>
    <div class="quiz-progress" aria-label="診断の進捗 ${currentQuestion + 1}/${quizQuestions.length}"><span style="width:${((currentQuestion + 1) / quizQuestions.length) * 100}%"></span></div>
    <h2 class="quiz-question" id="quiz-title">${item.question}</h2>
    <div class="quiz-options" role="radiogroup" aria-labelledby="quiz-title">
      ${item.options.map((option, index) => `<button class="quiz-option${selected === index ? ' is-selected' : ''}" type="button" role="radio" aria-checked="${selected === index}" data-option="${index}">${option.label}</button>`).join('')}
    </div>
    <div class="quiz-actions">
      ${currentQuestion > 0 ? '<button class="quiz-button quiz-back" type="button" data-quiz-back>戻る</button>' : ''}
      <button class="quiz-button quiz-next" type="button" data-quiz-next ${selected === null ? 'disabled' : ''}>${currentQuestion === quizQuestions.length - 1 ? '結果を見る' : '次へ'} →</button>
    </div>`;

  quizView.querySelectorAll('[data-option]').forEach((button) => {
    button.addEventListener('click', () => {
      answers[currentQuestion] = Number(button.dataset.option);
      quizView.querySelectorAll('[data-option]').forEach((option) => {
        const isSelected = option === button;
        option.classList.toggle('is-selected', isSelected);
        option.setAttribute('aria-checked', String(isSelected));
      });
      quizView.querySelector('[data-quiz-next]').disabled = false;
    });
  });

  quizView.querySelector('[data-quiz-back]')?.addEventListener('click', () => {
    currentQuestion -= 1;
    renderQuestion();
    focusFirstControl();
  });

  quizView.querySelector('[data-quiz-next]')?.addEventListener('click', () => {
    if (answers[currentQuestion] === null) return;
    if (currentQuestion < quizQuestions.length - 1) {
      currentQuestion += 1;
      renderQuestion();
      focusFirstControl();
    } else {
      renderResult(calculateResult());
    }
  });
};

const calculateResult = () => {
  const scores = { fruity: 0, balance: 0, rich: 0, deep: 0 };
  answers.forEach((answer, questionIndex) => {
    const scoreMap = quizQuestions[questionIndex].options[answer].scores;
    Object.entries(scoreMap).forEach(([type, score]) => { scores[type] += score; });
  });
  const highest = Math.max(...Object.values(scores));
  const tied = Object.keys(scores).filter((type) => scores[type] === highest);
  if (tied.length === 1) return tied[0];
  for (const questionIndex of [0, 2, 3]) {
    const preferred = quizQuestions[questionIndex].options[answers[questionIndex]].preference;
    if (preferred && tied.includes(preferred)) return preferred;
  }
  return 'balance';
};

const renderResult = (type) => {
  if (!quizView) return;
  const result = quizResults[type];
  const stars = (value) => '★'.repeat(value) + '☆'.repeat(5 - value);
  quizView.style.animation = 'none';
  quizView.offsetHeight;
  quizView.style.animation = '';
  quizView.innerHTML = `
    <div class="quiz-result">
      <p class="quiz-result-label">あなたのコーヒータイプは</p>
      <h2 id="quiz-title">${result.title}</h2>
      <p class="quiz-result-description">${result.description}</p>
      <div class="quiz-recommendation"><small>おすすめの一杯</small><strong>${result.coffee}</strong><span>${result.notes}</span></div>
      <dl class="quiz-taste-chart">${Object.entries(result.taste).map(([label, value]) => `<div><dt>${label}</dt><dd aria-label="5段階中${value}">${stars(value)}</dd></div>`).join('')}</dl>
      <div class="quiz-result-actions">
        <button class="quiz-button quiz-back" type="button" data-quiz-restart>もう一度診断する</button>
        <button class="quiz-button quiz-start" type="button" data-result-start>このコーヒーで始める</button>
      </div>
    </div>`;
  quizView.querySelector('[data-quiz-restart]').addEventListener('click', () => {
    resetQuiz();
    renderQuestion();
    focusFirstControl();
  });
  quizView.querySelector('[data-result-start]').addEventListener('click', closeQuiz);
  focusFirstControl();
};

function openQuiz() {
  if (!quizModal || !quizDialog) return;
  resetQuiz();
  renderQuestion();
  openModal(quizModal, quizView?.querySelector('button:not([disabled])'));
}

function closeQuiz() {
  closeModal();
}

openQuizButtons.forEach((button) => button.addEventListener('click', openQuiz));
quizModal?.querySelectorAll('[data-close-quiz]').forEach((button) => button.addEventListener('click', closeQuiz));

document.addEventListener('keydown', (event) => {
  if (!activeModal) return;
  if (event.key === 'Escape') {
    closeModal();
    return;
  }
  if (event.key !== 'Tab') return;
  const dialog = activeModal.querySelector('[role="dialog"]');
  const focusable = [...(dialog?.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') || [])];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.querySelectorAll('[data-close-modal]').forEach((control) => control.addEventListener('click', () => closeModal()));

document.querySelectorAll('[data-open-coffee]').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.coffee-card');
    const content = coffeeModal?.querySelector('[data-coffee-content]');
    if (!card || !content) return;
    const image = card.querySelector('.coffee-photo')?.cloneNode(true);
    const body = card.querySelector('.coffee-card-body')?.cloneNode(true);
    if (!image || !body) return;
    body.querySelector('.coffee-detail')?.remove();
    const title = body.querySelector('h3');
    if (title) {
      const heading = document.createElement('h2');
      heading.id = 'coffee-modal-title';
      heading.innerHTML = title.innerHTML;
      title.replaceWith(heading);
    }
    const layout = document.createElement('div');
    layout.className = 'detail-modal-contents';
    layout.append(image, body);
    content.replaceChildren(layout);
    openModal(coffeeModal);
  });
});

coffeeModal?.querySelector('[data-coffee-plans]')?.addEventListener('click', () => closeModal(false));

const policyCopy = {
  terms: ['利用規約', '本サイトはポートフォリオ作品として制作された架空のWebサイトです。実際の商品販売・契約・決済等は行われません。'],
  privacy: ['プライバシーポリシー', '本サイトはポートフォリオ作品として制作された架空のWebサイトです。フォームに入力された個人情報を実際に送信・保存することはありません。'],
};
document.querySelectorAll('[data-open-policy]').forEach((button) => {
  button.addEventListener('click', () => {
    const copy = policyCopy[button.dataset.openPolicy];
    if (!copy || !policyModal) return;
    policyModal.querySelector('#policy-modal-title').textContent = copy[0];
    policyModal.querySelector('[data-policy-content]').textContent = copy[1];
    openModal(policyModal);
  });
});

document.querySelectorAll('[data-plan]').forEach((link) => {
  link.addEventListener('click', () => {
    const plan = link.dataset.plan;
    const radio = document.querySelector(`#coffee-subscription input[name="plan"][value="${plan}"]`);
    if (!radio) return;
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
  });
});

const coffeeFilterButtons = [...document.querySelectorAll('[data-coffee-filter]')];
const coffeeCards = [...document.querySelectorAll('[data-coffee-tags]')];

coffeeFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.coffeeFilter;

    coffeeFilterButtons.forEach((item) => {
      const isCurrent = item === button;
      item.classList.toggle('is-active', isCurrent);
      item.setAttribute('aria-pressed', String(isCurrent));
    });

    coffeeCards.forEach((card) => {
      const tags = (card.dataset.coffeeTags || '').split(/\s+/);
      card.hidden = filter !== 'all' && !tags.includes(filter);
    });
  });
});

const faqButtons = [...document.querySelectorAll('[data-faq-toggle]')];

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const answerId = button.getAttribute('aria-controls');
    const answer = answerId ? document.getElementById(answerId) : null;
    if (!item || !answer) return;

    const isOpen = button.getAttribute('aria-expanded') === 'true';
    item.classList.toggle('is-open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
    answer.setAttribute('aria-hidden', String(isOpen));
  });
});

const subscriptionForm = document.getElementById('coffee-subscription');

if (subscriptionForm) {
  const selectedPlanStatus = document.querySelector('.subscription-selected-plan');
  const fields = [
    ['subscription-name', 'お名前を入力してください。'],
    ['subscription-email', 'メールアドレスを入力してください。'],
    ['subscription-phone', '電話番号を入力してください。'],
    ['subscription-postal', '郵便番号を入力してください。'],
    ['subscription-address', '住所を入力してください。'],
  ];

  const showError = (id, message) => {
    const error = document.getElementById(`${id}-error`);
    const input = document.getElementById(id);
    if (error) error.textContent = message;
    if (input) input.setAttribute('aria-invalid', String(Boolean(message)));
  };

  fields.forEach(([id]) => {
    document.getElementById(id)?.addEventListener('input', () => showError(id, ''));
  });

  subscriptionForm.querySelectorAll('input[name="plan"], input[name="grind"], select[name="startDate"], input[name="consent"]').forEach((input) => {
    input.addEventListener('change', () => {
      const id = input.name === 'startDate' ? 'subscription-date' : `subscription-${input.name}`;
      document.getElementById(`${id}-error`).textContent = '';
      if (input.name === 'plan' && input.checked && selectedPlanStatus) {
        selectedPlanStatus.querySelector('strong').textContent = input.value.toUpperCase();
        selectedPlanStatus.hidden = false;
      }
    });
  });

  subscriptionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalid = null;

    fields.forEach(([id, requiredMessage]) => {
      const input = document.getElementById(id);
      const value = input.value.trim();
      const message = !value ? requiredMessage : id === 'subscription-email' && !input.validity.valid ? '正しいメールアドレスを入力してください。' : '';
      showError(id, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    const choices = [
      ['plan', 'プランを選択してください。'],
      ['grind', 'コーヒーの状態を選択してください。'],
      ['startDate', 'お届け開始日を選択してください。'],
    ];
    choices.forEach(([name, message]) => {
      const input = subscriptionForm.querySelector(`[name="${name}"]:checked`) || subscriptionForm.querySelector(`[name="${name}"]`);
      const valid = name === 'startDate' ? Boolean(input.value) : Boolean(subscriptionForm.querySelector(`[name="${name}"]:checked`));
      const id = name === 'startDate' ? 'subscription-date' : `subscription-${name}`;
      document.getElementById(`${id}-error`).textContent = valid ? '' : message;
      if (!valid && !firstInvalid) firstInvalid = input;
    });

    const consent = subscriptionForm.elements.consent;
    document.getElementById('subscription-consent-error').textContent = consent.checked ? '' : '同意のうえ、お進みください。';
    if (!consent.checked && !firstInvalid) firstInvalid = consent;
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Portfolio-only interaction: no request, storage, payment, or email is performed.
    subscriptionForm.reset();
    if (selectedPlanStatus) selectedPlanStatus.hidden = true;
    const success = subscriptionForm.querySelector('.subscription-success');
    success.hidden = false;
    success.focus();
  });

  subscriptionForm.querySelector('[data-subscription-close]')?.addEventListener('click', () => {
    subscriptionForm.querySelector('.subscription-success').hidden = true;
    subscriptionForm.querySelector('input[name="plan"]:checked')?.focus();
  });
}
