(() => {
  const questions = {
    foundation: {
      title: "Research Foundation & Significance",
      items: [
        "What real-world problem did your study address, and why was it important to investigate?",
        "How did your purpose and research question or questions respond to the problem you identified?",
        "What makes your study significant to your field or professional practice?",
        "How does your study connect to or extend the existing knowledge base?"
      ]
    },
    methodology: {
      title: "Methodology & Justification",
      items: [
        "Why was your selected methodology and design appropriate for answering your research question or questions?",
        "How did your participant or data-source selection support the purpose of the study?",
        "How did your data collection and analysis procedures work together to address your research question or questions?",
        "What did you do to support rigor, validity, reliability, or trustworthiness and to protect participants ethically?"
      ]
    },
    findings: {
      title: "Findings & Analysis",
      items: [
        "Which finding is most important, and what evidence from your analysis supports it?",
        "How did your analysis process lead from the raw data to your final findings?",
        "How do your major findings connect to your research question or questions and the literature?",
        "What limitation, unexpected result, or boundary of the study is important to consider when interpreting your findings?"
      ]
    },
    application: {
      title: "Practical Applications",
      items: [
        "Who is positioned to use your findings, and what could they do differently as a result?",
        "Which recommendation is most directly supported by your evidence, and why?",
        "What would realistic implementation of your recommendations require in an educational setting?",
        "How can your findings inform leadership, organizational improvement, teaching, learning, or institutional effectiveness?"
      ]
    },
    growth: {
      title: "Scholarly Growth & Future Directions",
      items: [
        "How has completing this study changed the way you think as a scholar-practitioner?",
        "What did you learn about conducting applied research that will influence your future professional practice?",
        "What unanswered question emerged from your study that deserves further investigation?",
        "How do you plan to continue contributing to scholarship and practice after completing this project?"
      ]
    }
  };

  const domainButtons = [...document.querySelectorAll('.domain-button')];
  const domainTitle = document.getElementById('domainTitle');
  const questionText = document.getElementById('questionText');
  const newQuestion = document.getElementById('newQuestion');
  const practiceMode = document.getElementById('practiceMode');
  const clearNotes = document.getElementById('clearNotes');
  const speakingPanel = document.getElementById('speakingPanel');
  const speakingQuestion = document.getElementById('speakingQuestion');
  const backToPlan = document.getElementById('backToPlan');
  const nextPractice = document.getElementById('nextPractice');
  const timerLength = document.getElementById('timerLength');
  const timerDisplay = document.getElementById('timerDisplay');
  const startTimer = document.getElementById('startTimer');
  const resetTimer = document.getElementById('resetTimer');
  const checkItems = [...document.querySelectorAll('.check-item')];
  const checkFeedback = document.getElementById('checkFeedback');
  const noteFields = ['answerNotes','justifyNotes','evidenceNotes','meaningNotes'].map(id => document.getElementById(id));

  let activeDomain = 'foundation';
  let activeQuestionIndex = 0;
  let timerId = null;
  let secondsRemaining = Number(timerLength.value);

  const storageKey = (domain, questionIndex, fieldId) => `ed840-defense-lab:${domain}:q${questionIndex}:${fieldId}`;

  function randomIndex(max, except = -1) {
    if (max <= 1) return 0;
    let idx = Math.floor(Math.random() * max);
    if (idx === except) idx = (idx + 1) % max;
    return idx;
  }

  function saveNotes() {
    noteFields.forEach(field => {
      try { localStorage.setItem(storageKey(activeDomain, activeQuestionIndex, field.id), field.value); } catch (_) {}
    });
  }

  function loadNotes() {
    noteFields.forEach(field => {
      try { field.value = localStorage.getItem(storageKey(activeDomain, activeQuestionIndex, field.id)) || ''; } catch (_) { field.value = ''; }
    });
  }

  function renderQuestion(newIndex = false) {
    const group = questions[activeDomain];
    if (newIndex) activeQuestionIndex = randomIndex(group.items.length, activeQuestionIndex);
    domainTitle.textContent = group.title;
    questionText.textContent = group.items[activeQuestionIndex];
    speakingQuestion.textContent = group.items[activeQuestionIndex];
  }

  function selectDomain(domain) {
    saveNotes();
    activeDomain = domain;
    activeQuestionIndex = 0;
    domainButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.domain === domain));
    renderQuestion(false);
    loadNotes();
    resetSelfCheck();
    stopTimer();
    speakingPanel.classList.add('hidden');
  }

  function formatTime(total) {
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
    startTimer.textContent = 'Start Timer';
    secondsRemaining = Number(timerLength.value);
    timerDisplay.textContent = formatTime(secondsRemaining);
  }

  function tick() {
    if (secondsRemaining <= 0) {
      if (timerId) clearInterval(timerId);
      timerId = null;
      startTimer.textContent = 'Start Timer';
      timerDisplay.textContent = '00:00';
      return;
    }
    secondsRemaining -= 1;
    timerDisplay.textContent = formatTime(secondsRemaining);
  }

  function resetSelfCheck() {
    checkItems.forEach(item => { item.checked = false; });
    checkFeedback.textContent = 'Complete the four checks after you practice.';
    checkFeedback.classList.remove('ready');
  }

  function updateSelfCheck() {
    const count = checkItems.filter(i => i.checked).length;
    if (count === 4) {
      checkFeedback.textContent = 'Strong practice response: you addressed all four parts of the framework.';
      checkFeedback.classList.add('ready');
    } else {
      checkFeedback.textContent = `${count} of 4 complete. Revisit any unchecked area before your next practice attempt.`;
      checkFeedback.classList.remove('ready');
    }
  }

  domainButtons.forEach(btn => btn.addEventListener('click', () => selectDomain(btn.dataset.domain)));

  newQuestion.addEventListener('click', () => {
    saveNotes();
    renderQuestion(true);
    loadNotes();
    resetSelfCheck();
  });

  noteFields.forEach(field => field.addEventListener('input', saveNotes));

  clearNotes.addEventListener('click', () => {
    noteFields.forEach(field => {
      field.value = '';
      try { localStorage.removeItem(storageKey(activeDomain, activeQuestionIndex, field.id)); } catch (_) {}
    });
    noteFields[0].focus();
  });

  practiceMode.addEventListener('click', () => {
    saveNotes();
    speakingQuestion.textContent = questionText.textContent;
    speakingPanel.classList.remove('hidden');
    resetSelfCheck();
    stopTimer();
    speakingPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  backToPlan.addEventListener('click', () => {
    speakingPanel.classList.add('hidden');
    document.getElementById('answerNotes').focus();
  });

  nextPractice.addEventListener('click', () => {
    saveNotes();
    renderQuestion(true);
    loadNotes();
    resetSelfCheck();
    stopTimer();
    speakingQuestion.textContent = questionText.textContent;
    speakingPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  timerLength.addEventListener('change', stopTimer);

  startTimer.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      startTimer.textContent = 'Resume Timer';
      return;
    }
    if (secondsRemaining <= 0 || secondsRemaining > Number(timerLength.value)) {
      secondsRemaining = Number(timerLength.value);
    }
    startTimer.textContent = 'Pause Timer';
    timerId = setInterval(tick, 1000);
  });

  resetTimer.addEventListener('click', stopTimer);
  checkItems.forEach(item => item.addEventListener('change', updateSelfCheck));

  renderQuestion(false);
  loadNotes();
  stopTimer();
})();
