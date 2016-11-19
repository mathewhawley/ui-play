function Accordion(element) {
  // Store element references
  this.el = element;
  this.tabs = this.el.querySelectorAll('.js-accordion__tab');
  this.panels = this.el.querySelectorAll('.js-accordion__tabpanel');

  // Bind methods to instance
  this.handleAction = this.handleAction.bind(this);
  this.handleMouseAndTouch = this.handleMouseAndTouch.bind(this);
  this.handleKeydown = this.handleKeydown.bind(this);

  // Attach event listeners
  this.addEventListeners();
}

Object.defineProperty(Accordion, 'UP_ARROW', {
  get() {
    return 38;
  },
});

Object.defineProperty(Accordion, 'LEFT_ARROW', {
  get() {
    return 37;
  },
});

Object.defineProperty(Accordion, 'RIGHT_ARROW', {
  get() {
    return 39;
  },
});

Object.defineProperty(Accordion, 'DOWN_ARROW', {
  get() {
    return 40;
  },
});

Object.defineProperty(Accordion, 'SPACE', {
  get() {
    return 32;
  },
});

Object.defineProperty(Accordion, 'ENTER', {
  get() {
    return 13;
  },
});

Accordion.prototype.addEventListeners = function() {
  this.el.addEventListener('click', this.handleAction, false);
  this.el.addEventListener('keydown', this.handleAction, false);
  this.el.addEventListener('touchend', this.handleAction, false);
};

Accordion.prototype.handleAction = function(event) {
  switch (event.type) {
    case 'touchend':
    case 'click':
      this.handleMouseAndTouch(event);
      break;

    case 'keydown':
      this.handleKeydown(event);
      break;

    default:
      // do nothing
  }
};

Accordion.prototype.handleMouseAndTouch = function(event) {
  console.log(event);
};

Accordion.prototype.handleKeydown = function(event) {
  switch(event.keyCode) {
    case Accordion.SPACE:
    case Accordion.ENTER:
      console.log('open/close');
      break;

    case Accordion.DOWN_ARROW:
    case Accordion.RIGHT_ARROW:
      console.log('next');
      break;

    case Accordion.UP_ARROW:
    case Accordion.LEFT_ARROW:
      console.log('previous');
      break;

    default:
      // do nothing
  }
};

new Accordion(document.querySelector('.js-accordion'));
