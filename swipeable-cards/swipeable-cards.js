class SwipeableCards {
  constructor() {
    this.cards =
      Array.from(document.querySelectorAll('.js-swipeable-cards .js-swipeable-card'));

    // Selected card
    this.target = null;
    // Layout information of a card
    this.targetWidth = 0;
    this.targetHeight = 0;

    // Initialise positions
    this.startX = 0;
    this.currentX = 0;

    // How far we need to 'drag' a card to dismiss,
    // as a percentage of the card width
    this.dismissTolerance = 0.35;
    this.shouldDismiss = false;

    // Initial 'interactivity' state
    this.active = false;
    this.moved = false;

    // Bind methods to instance
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.repositionCards = this.repositionCards.bind(this);
    this.resetTarget = this.resetTarget.bind(this);
    this.cardDismissTransitionEnd = this.cardDismissTransitionEnd.bind(this);
    this.cardSlideUpTransitionEnd = this.cardSlideUpTransitionEnd.bind(this);

    // Register event handlers
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('touchstart', this.onStart, false);
    document.addEventListener('touchmove', this.onMove, false);
    document.addEventListener('touchend', this.onEnd, false);
    document.addEventListener('mousedown', this.onStart, false);
    document.addEventListener('mousemove', this.onMove, false);
    document.addEventListener('mouseup', this.onEnd, false);
  }

  onStart(event) {
    event.preventDefault();

    // Disable interaction while a card transition is in progress
    if (this.active) {
      return;
    }

    // Determine if we have clicked on a 'card'
    this.target = ancestorWithClass(event.target, 'js-swipeable-card');

    // If a card hasn't been selected, exit early
    if (!this.target) {
      return;
    }

    // Set card 'state' to active
    this.active = true;
    // Store target layout information
    this.targetWidth = this.target.offsetWidth;
    this.targetHeight = this.target.offsetHeight;
    // Promote to GPU layer
    this.target.style.willChange = 'transform';
    // Set start position
    this.startX = event.pageX || event.touches[0].pageX;
    // Initialise 'current' position
    this.currentX = this.startX;
  }

  onMove(event) {
    event.preventDefault();

    // If the card 'state' is inactive, exit early
    if (!this.active) {
      return;
    }

    // Recognize that the card has been moved by the user
    this.moved = true;
    // Update current position value
    this.currentX = event.pageX || event.touches[0].pageX;
    // Calculate how far we have moved from the start position
    const translateX = (this.currentX - this.startX) / 2;

    // Schedule transforms via the browser
    window.requestAnimationFrame(() => {
      this.target.style.transform = `translateX(${translateX}px)`;
    });
  }

  onEnd(event) {
    event.preventDefault();

    // If the card 'state' is inactive, exit early
    if (!this.active) {
      return;
    }

    // If a card has only been 'clicked' or 'tapped', reset and exit
    if (!this.moved) {
      this.resetTarget();
      return;
    }

    // Store values for determining final behaviour
    const translateX = this.currentX - this.startX;
    let translateTarget = 0;

    // Get ready for transition
    this.target.addEventListener('transitionend', this.cardDismissTransitionEnd);
    this.target.classList.add('animate');

    // If we have dragged far enough to dismiss, send card
    // to left or right and fade out
    if (Math.abs(translateX) > (this.targetWidth * this.dismissTolerance)) {
      translateTarget = translateX > 0 ? this.targetWidth : this.targetWidth * -1;
      this.target.style.opacity = 0;
      this.shouldDismiss = true;
    }

    // Set final position of card
    this.target.style.transform = `translateX(${translateTarget}px)`;
  }

  repositionCards(startIndex) {
    const cardCount = this.cards.length;

    // If the card is the last one, reset and exit
    if (cardCount === startIndex) {
      this.resetTarget();
      return;
    }

    for (let i = startIndex; i < cardCount; i++) {
      const card = this.cards[i];
      card.addEventListener('transitionend', this.cardSlideUpTransitionEnd);
      card.style.transform = `translateY(${this.targetHeight + 16}px)`;
    }

    setTimeout(() => {
      for (let i = startIndex; i < cardCount; i++) {
        const card = this.cards[i];
        card.style.transition = `transform 200ms ease ${i * 50}ms`;
        card.style.transform = 'none';
      }
    }, 0);
  }

  cardDismissTransitionEnd() {
    // Remove transition event listener
    this.target.removeEventListener('transitionend', this.cardDismissTransitionEnd);
    // Remove CSS transition behaviour
    this.target.classList.remove('animate');

    if (this.shouldDismiss) {
      // Remove card from DOM
      this.target.parentNode.removeChild(this.target);
      // Remove node from nodelist
      const targetIndex = this.cards.indexOf(this.target);
      this.cards.splice(targetIndex, 1);
      // Animate the rest of the cards into new position
      this.repositionCards(targetIndex);
      return;
    }

    // Reset
    this.resetTarget();
  }

  cardSlideUpTransitionEnd(event) {
    // Remove event listener
    event.target.removeEventListener('transitionend', this.cardSlideUpTransitionEnd);
    // Remove transform/transition styles
    event.target.style.transform = '';
    event.target.style.transition = '';
    // Reset
    this.resetTarget();
  }

  resetTarget() {
    this.active = false;
    this.shouldDismiss = false;
    this.moved = false;
    this.target.style.willChange = '';
  }
}

new SwipeableCards();
