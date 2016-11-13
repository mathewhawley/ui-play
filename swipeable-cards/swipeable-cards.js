class SwipeableCards {
  constructor() {
    // Store references to elements
    this.swipeableCardsEl =
      document.querySelectorAll('.js-swipeable-cards .js-swipeable-card');

    // Bind methods to instance
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.update = this.update.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);

    // Store coordinates
    this.startX = 0;
    this.currentX = 0;

    // Determine if a card is being dragged
    this.dragging = false;
    // How far you need to drag before a card is dismissed
    // (percentage of card width)
    this.dragTolerance = 0.35;

    // Current card
    this.target = null;
    this.targetBCR = null;

    // Register event listeners
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
    // Get card element if it exists in selected DOM branch
    const cardEl = ancestorWithClass(event.target, 'js-swipeable-card');

    // If selected element is not a 'card', exit early
    // otherwise store a reference to the card element
    if (!cardEl) {
      return;
    } else {
      this.target = cardEl;
    }

    // Get size/position values of card
    this.targetBCR = this.target.getBoundingClientRect();
    // Promote target to layer on GPU
    this.target.style.willChange = 'transform';
    // Store a reference to start location
    this.startX = event.pageX || event.touches[0].pageX;
    // Update current position
    this.currentX = this.startX;
    // We are dragging
    this.dragging = true;

    // Schedule future updates via browser
    window.requestAnimationFrame(this.update);
  }

  onMove(event) {
    // If we don't have a target element, early exit
    if (!this.target) {
      return;
    }
    // Update current position reference
    this.currentX = event.pageX || (event.touches ? event.touches[0].pageX : 0);
    event.preventDefault();
  }

  onEnd(event) {
    // If we don't have a target element, early exit
    if (!this.target) {
      return;
    }

    // No longer dragging the card
    this.dragging = false;
    // Add event listener for future transitions
    this.target.addEventListener('transitionend', this.onTransitionEnd);
    // Add class to allow CSS controlled transition
    this.target.classList.add('animate');

    let translateTarget = 0;
    const translateX = this.currentX - this.startX;

    if (Math.abs(translateX) > this.targetBCR.width * this.dragTolerance) {
      translateTarget = translateX > 0
        ? this.targetBCR.width
        : this.targetBCR.width * -1;

      // Fade out
      this.target.classList.add('fade-out');
    }

    // Move card in to place
    this.target.style.transform = `translateX(${translateTarget}px)`;
    // Remove from GPU
    this.target.style.willChange = 'initial';
    event.preventDefault();
  }

  onTransitionEnd() {
    // Remove transition properties
    this.target.classList.remove('animate');
    // Remove event listener
    this.target.removeEventListener('transitionend', this.onTransitionEnd);
    // Reset target reference
    this.target = null;
  }

  update() {
    // Continue animation loop
    const requestId = window.requestAnimationFrame(this.update);
    // If the card isn't being dragged, stop animation loop
    if (!this.dragging) {
      window.cancelAnimationFrame(requestId);
      return;
    }
    // Calculate new position of element
    const translateX = (this.currentX - this.startX) / 2;
    // Apply updates to the DOM
    this.target.style.transform = `translateX(${translateX}px)`;
  }
}

new SwipeableCards();
