class SideNav {
  constructor() {
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

    // attach event listeners to elements
    this.addEventListeners();
  }

  addEventListeners() {
    this.sideNavOpenEl.addEventListener('click', this.openSideNav);
    this.sideNavCloseEl.addEventListener('click', this.closeSideNav);
    this.sideNavEl.addEventListener('click', this.closeSideNav);
    this.sideNavPanelEl.addEventListener('click', this.blockClicks);
  }

  openSideNav() {
    const { active, animate } = this.states;
    this.sideNavEl.classList.add(active);
    this.sideNavPanelEl.classList.add(animate);
    this.sideNavPanelEl.addEventListener('transitionend', this.onTransitionEnd);
  }

  closeSideNav() {
    const { active, animate } = this.states;
    this.sideNavEl.classList.remove(active);
    this.sideNavPanelEl.classList.add(animate);
    this.sideNavPanelEl.addEventListener('transitionend', this.onTransitionEnd);
  }

  onTransitionEnd() {
    this.sideNavPanelEl.classList.remove(this.states.animate);
    this.sideNavPanelEl.removeEventListener('transitionend', this.onTransitionEnd);
  }

  blockClicks(event) {
    event.stopPropagation();
  }
}

new SideNav();
