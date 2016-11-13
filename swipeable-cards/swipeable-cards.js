class SwipeableCards {
  constructor() {
    this.cards =
      Array.from(document.querySelectorAll('.js-swipeable-cards .js-swipeable-card'));

    // Selected card
    this.target = null;
    // Layout information of a card
    this.targetBCR = null;

    // Initialise positions
    this.startX = 0;
    this.currentX = 0;

    // How far we need to 'drag' a card to dismiss,
    // as a percentage of the card width
    this.dismissTolerance = 0.35;
    this.shouldDismiss = false;

    // Initial 'interactivity' state
    this.active = false;

    // Bind methods to instance
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.repositionCards = this.repositionCards.bind(this);

    // Register event handlers
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('touchstart', this.onStart, false);
    document.addEventListener('touchmove', this.onMove, false);
    document.addEventListener('touchend', this.onEnd, false);
    // document.addEventListener('mousedown', this.onStart, false);
    // document.addEventListener('mousemove', this.onMove, false);
    // document.addEventListener('mouseup', this.onEnd, false);
  }

  onStart(event) {
    console.log('*********************')
    event.preventDefault();

    // Disable interaction while a card transition is in progress
    if (this.active) {
      console.log('start: active');
      return;
    }

    console.log('start: inactive');

    // Determine if we have clicked on a 'card'
    this.target = ancestorWithClass(event.target, 'js-swipeable-card');

    // If a card hasn't been selected, exit early
    if (!this.target) {
      console.log('start: no card');
      return;
    }
    console.log('start: card');

    // Set card 'state' to active
    this.active = true;

    // Store target layout information
    this.targetBCR = this.target.getBoundingClientRect();
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
      console.log('move: inactive');
      return;
    }

    console.log('move: active');

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
    // If the card 'state' is inactive, exit early
    if (!this.active) {
      console.log('end: inactive');
      return;
    }

    // Store values for determining final behaviour
    const cardWidth = this.targetBCR.width;
    const translateX = this.currentX - this.startX;
    let translateTarget = 0;

    const onTransitionEnd = () => {
      console.log('transitionend');
      // Remove transition event listener
      this.target.removeEventListener('transitionend', onTransitionEnd);
      // Remove CSS transition behaviour
      this.target.classList.remove('animate');
      // Demote from GPU layer
      this.target.style.willChange = 'initial';

      if (this.shouldDismiss) {
        console.log('dismiss confirm');
        // Remove card from DOM
        this.target.parentNode.removeChild(this.target);
        // Remove node from nodelist
        const targetIndex = this.cards.indexOf(this.target);
        this.cards.splice(targetIndex, 1);

        // Animate the rest of the cards into new position
        this.repositionCards(targetIndex);

        return;
      }

      this.active = false;
    };

    this.target.addEventListener('transitionend', onTransitionEnd);
    this.target.classList.add('animate');

    // If we have dragged far enough to dismiss, send card
    // to left or right and fade out
    if (Math.abs(translateX) > (cardWidth * this.dismissTolerance)) {
      translateTarget = translateX > 0 ? cardWidth : cardWidth * -1;
      this.target.style.opacity = 0;
      this.shouldDismiss = true;
    }
    // console.log('should dismiss:', this.shouldDismiss);
    console.log(translateTarget);
    // Set final position of card
    this.target.style.transform = `translateX(${translateTarget}px)`;

    console.log('end:', this.active);
  }

  repositionCards(startIndex) {
    const cardCount = this.cards.length;

    const onTransitionEnd = event => {
      event.target.removeEventListener('transitionend', onTransitionEnd);
      event.target.style.transition = 'none';
      event.target.style.transform = 'none';
      // Set state to inactive – allow new interactions
      this.active = false;
      this.shouldDismiss = false;
    };

    for (let i = startIndex; i < cardCount; i++) {
      const card = this.cards[i];
      console.log(card);
      card.style.transform = `translateY(${this.targetBCR.height + 16}px)`;
      card.addEventListener('transitionend', onTransitionEnd);
    }

    setTimeout(() => {
      for (let i = startIndex; i < cardCount; i++) {
        const card = this.cards[i];
        card.style.transition = `transform 300ms ease ${i * 50}ms`;
        card.style.transform = 'none';
      }
    }, 0);
  }
}

new SwipeableCards();
