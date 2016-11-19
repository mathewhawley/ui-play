function sumArray(arr) {
  return arr.reduce((initial, value) => {
    return initial + value;
  }, 0);
}

function Accordion(element) {
  // Store element references
  this.el = element;
  this.tabs = this.el.querySelectorAll('.js-accordion__tab');
  this.panels = this.el.querySelectorAll('.js-accordion__tabpanel');

  // Make traversal easier by converting nodelist to array
  this.tabsArray = Array.from(this.tabs);
  this.panelsArray = Array.from(this.panels);

  this.togglePanel = this.togglePanel.bind(this);

  // Attach event listeners
  this.addEventListeners();
  // Initial set up
  this.calculateGeometries();
  this.setInitialLayout();
  this.el.setAttribute('active', true);
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
  this.el.addEventListener('click', this.togglePanel, false);
  this.el.addEventListener('keydown', this.handleTabKeydown, false);
};

Accordion.prototype.calculateGeometries = function() {
  if (!this.tabs.length) {
    return;
  }

  // Store array of height values
  this.tabHeights = this.tabsArray.map(tab => tab.offsetHeight);
  this.panelHeights = this.panelsArray.map(panel => panel.offsetHeight);
  // Calculate total heights for tabs and panels
  this.totalTabHeight = sumArray(this.tabHeights);
  this.totalPanelHeight = sumArray(this.panelHeights);
  // Height of accordion minus the total height of the tabs
  this.availableHeight = this.el.offsetHeight - this.totalTabHeight;
};

Accordion.prototype.setInitialLayout = function() {
  let translateY = 0;
  this.tabsArray.forEach((tab, index) => {
    if (tab.getAttribute('aria-expanded') !== 'true') {
      // Increment by height of preceeding tab
      translateY += this.tabHeights[index - 1];
      // Translate this tab and panel to new position
      tab.style.transform = `translateY(${translateY}px)`;
      this.panelsArray[index].style.transform =
        `translateY(${translateY + this.tabHeights[index]}px)`;
    } else {
      // Translate panel of initial tab
      this.panelsArray[index].style.transform =
        `translateY(${this.tabHeights[index]}px)`;
    }
  });
};

Accordion.prototype.togglePanel = function(event) {
  this.tabsArray.forEach((tab, index) => {
    if (event.target === tab) {
      tab.setAttribute('aria-expanded', true);
      tab.setAttribute('aria-selected', true);
      this.panelsArray[index].setAttribute('aria-hidden', false);
    } else {
      tab.setAttribute('aria-expanded', false);
      tab.setAttribute('aria-selected', false);
      this.panelsArray[index].setAttribute('aria-hidden', true);
    }
  });
};

Accordion.prototype.handleTabKeydown = function(event) {
  const { target } = event;

  switch(event.keyCode) {
    case Accordion.SPACE:
    case Accordion.ENTER:
      this.togglePanel(event);
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

Array
  .from(document.querySelectorAll('.js-accordion'))
  .forEach(element => new Accordion(element));
