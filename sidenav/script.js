class SideNav {
  constructor() {
    this.sideNavTrigger = document.querySelector('.js-header__menu-button');

    this.openSideNav = this.openSideNav.bind(this);

    this.addEventListeners();
  }

  addEventListeners() {
    this.sideNavTrigger.addEventListener('click', this.openSideNav);
  }

  openSideNav() {
    console.log('clicked');
  }
}

window.addEventListener('load', () => new SideNav());
