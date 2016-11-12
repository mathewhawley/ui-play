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

    this.isDragging = false;

    // Current card
    this.target = null;

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
      console.log('not card');
      return;
    } else {
      this.target = cardEl;
    }
    console.log('card');
    // Promote target to layer on GPU
    this.target.style.willChange = 'transform';
    // Store a reference to start location
    this.startX = event.pageX || event.touches[0].pageX;
    // Update current position
    this.currentX = this.startX;

    this.isDragging = true;

    // Schedule future updates via browser
    window.requestAnimationFrame(this.update);
  }

  onMove(event) {
    event.preventDefault();
    // If we don't have a target element, early exit
    if (!this.target) {
      return;
    }

    // Update current position reference
    this.currentX = event.pageX || (event.touches ? event.touches[0].pageX : 0);
  }

  onEnd(event) {
    event.preventDefault();
    // If we don't have a target element, early exit
    if (!this.target) {
      return;
    }

    // No longer dragging the card
    this.isDragging = false;

    // Initiate transition – either back to start or off screen
    this.target.addEventListener('transitionend', this.onTransitionEnd);
    this.target.classList.add('animate');
    this.target.style.transform = 'translateX(0)';
  }

  onTransitionEnd() {
    // Remove dynamically added styles
    this.target.style.willChange = '';
    this.target.style.transform = '';
    // Remove transition properties
    this.target.classList.remove('animate');
    // Remove event listener
    this.target.removeEventListener('transitionend', this.onTransitionEnd);
    // Reset target reference
    this.target = null;
  }

  update() {
    console.log('animating');
    // Continue animation loop
    const requestId = window.requestAnimationFrame(this.update);
    // If the card isn't being dragged, stop animation loop
    if (!this.isDragging) {
      window.cancelAnimationFrame(requestId);
      return;
    }
    // Calculate new position of element
    const translateX = this.currentX - this.startX;
    // Apply updates to the DOM
    this.target.style.transform = `translateX(${translateX}px)`;
  }
}

new SwipeableCards();
