class SideNav {
  constructor() {
    // Store element references
    this.sideNavOpenEl = document.querySelector('.js-sidenav-open');
    this.sideNavCloseEl = document.querySelector('.js-sidenav-close');
    this.sideNavEl = document.querySelector('.js-sidenav');
    this.sideNavPanelEl = document.querySelector('.js-sidenav-panel');

    // Bind methods to instance
    this.openSideNav = this.openSideNav.bind(this);
    this.closeSideNav = this.closeSideNav.bind(this);
    this.blockClicks = this.blockClicks.bind(this);

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
    this.sideNavEl.classList.add('sidenav--active');
  }

  closeSideNav() {
    this.sideNavEl.classList.remove('sidenav--active');
  }

  blockClicks(event) {
    event.stopPropagation();
  }
}

new SideNav();
