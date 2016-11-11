class SideNav {
  constructor() {
    // State classes
    this.states = {
      active: 'active',
      animate: 'animate',
    };

    // Store element references
    this.sideNavOpenEl = document.querySelector('.js-sidenav-open');
    this.sideNavCloseEl = document.querySelector('.js-sidenav-close');
    this.sideNavEl = document.querySelector('.js-sidenav');
    this.sideNavPanelEl = document.querySelector('.js-sidenav-panel');

    // Bind methods to instance
    this.openSideNav = this.openSideNav.bind(this);
    this.closeSideNav = this.closeSideNav.bind(this);
    this.blockClicks = this.blockClicks.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    // Touch event position references
    this.startX = 0;
    this.currentX = 0;

    // Attach event listeners to elements
    this.addEventListeners();
  }

  addEventListeners() {
    // Mouse events
    this.sideNavOpenEl.addEventListener('click', this.openSideNav, false);
    this.sideNavCloseEl.addEventListener('click', this.closeSideNav, false);
    this.sideNavEl.addEventListener('click', this.closeSideNav, false);
    this.sideNavPanelEl.addEventListener('click', this.blockClicks, false);

    // Touch events
    document.addEventListener('touchstart', this.onTouchStart, false);
    document.addEventListener('touchmove', this.onTouchMove, false);
    document.addEventListener('touchend', this.onTouchEnd, false);
  }

  openSideNav() {
    const { active, animate } = this.states;
    this.sideNavPanelEl.addEventListener('transitionend', this.onTransitionEnd);
    this.sideNavPanelEl.classList.add(animate);
    this.sideNavEl.classList.add(active);
  }

  closeSideNav() {
    const { active, animate } = this.states;
    this.sideNavPanelEl.addEventListener('transitionend', this.onTransitionEnd);
    this.sideNavPanelEl.classList.add(animate);
    this.sideNavEl.classList.remove(active);
  }

  onTransitionEnd() {
    this.sideNavPanelEl.classList.remove(this.states.animate);
    this.sideNavPanelEl.removeEventListener('transitionend', this.onTransitionEnd);
  }

  onTouchStart() {
    if (!this.sideNavEl.classList.contains(this.states.active)) {
      return;
    }
    this.startX = event.touches[0].pageX;
    this.currentX = this.startX;
  }

  onTouchMove(event) {
    event.preventDefault();
    if (!this.sideNavEl.classList.contains(this.states.active)) {
      return;
    }
    window.requestAnimationFrame(() => {
      this.currentX = event.touches[0].pageX;
      const translateX = Math.min(0, this.currentX - this.startX);
      this.sideNavPanelEl.style.transform = `translateX(${translateX}px)`;
    });
  }

  onTouchEnd() {
    if (!this.sideNavEl.classList.contains(this.states.active)) {
      return;
    }
    this.sideNavPanelEl.style.transform = '';
    const translateX = Math.min(0, this.currentX - this.startX);
    if (translateX < -30) {
      this.closeSideNav();
    } else {
      this.openSideNav();
    }
  }

  blockClicks(event) {
    event.stopPropagation();
  }
}

new SideNav();
