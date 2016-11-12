class SwipeableCards {
  constructor() {
    // Store references to elements
    this.swipeableCardsEl =
      document.querySelectorAll('.js-swipeable-cards .js-swipeable-card');

    // Bind methods to instance
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.ancestorWithClass = this.ancestorWithClass.bind(this);
    this.update = this.update.bind(this);

    // Store coordinates
    this.startX = 0;
    this.currentX = 0;

    // Current card
    this.target = null;

    // Register event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    Array.from(this.swipeableCardsEl).forEach((el) => {
      document.addEventListener('touchstart', this.onStart, false);
      document.addEventListener('touchmove', this.onMove, false);
      document.addEventListener('touchend', this.onEnd, false);
      document.addEventListener('mousedown', this.onStart, false);
      document.addEventListener('mousemove', this.onMove, false);
      document.addEventListener('mouseup', this.onEnd, false);
    });
  }

  onStart(event) {
    event.preventDefault();

    // Get card element if it exists in selected DOM branch
    const cardEl = this.ancestorWithClass(event.target, 'js-swipeable-card');

    // If selected element is not a 'card', exit early
    // otherwise store a reference to the card element
    if (!cardEl) {
      return;
    } else {
      this.target = cardEl;
    }

    // Promote target to layer on GPU
    this.target.style.willChange = 'transform';
    // Store a reference to start location
    this.startX = event.pageX || event.touches[0].pageX;
    // Update current position
    this.currentX = this.startX;

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
    this.currentX = event.pageX || event.touches[0].pageX;
  }

  onEnd(event) {
    event.preventDefault();
    // If we don't have a target element, early exit
    if (!this.target) {
      return;
    }
    // Remove GPU layer
    this.target.style.willChange = '';
    // Reset target reference
    this.target = null;
  }

  ancestorWithClass(element, ancestorClass) {
    // If the current element has the specified class, return the element
    if (element.className && element.className.split(' ').includes(ancestorClass)) {
      return element;
    }
    // Check ancestor nodes until no more
    return element.parentNode && this.ancestorWithClass(element.parentNode, ancestorClass);
  }

  update() {
    // Continue animation loop
    const requestId = window.requestAnimationFrame(this.update);
    // If we no longer have a target, stop animation, early exit
    if (!this.target) {
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
