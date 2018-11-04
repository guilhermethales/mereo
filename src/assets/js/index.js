(function() {

  const App = {
    trigerMenu: $('.menu-burguer'),
    sidebar: $('.sidebar'),
    iconBack: $('.icon-back'),
    backdrop: $('.main-backdrop')
  };

  App.init = function() {
    this.bindUiEvents();
    this.runInitialMethods();
  };

  App.isDesktop = function () {
    return $(window).width() > 992;
  };

  App.showBackdrop = function () {
    this.backdrop.addClass('active');
  };

  App.hideBackdrop = function () {
    this.backdrop.removeClass('active');
  };

  App.showSidebar = function () {
    this.sidebar.addClass('active');
    !this.isDesktop() ? this.showBackdrop() : '';
  };

  App.hideSidebar = function () {
    this.sidebar.removeClass('active');
    !this.isDesktop() ? this.hideBackdrop() : '';
  };

  App.bindUiEvents = function() {
    this.trigerMenu.click(() => {
      if(this.sidebar.hasClass('active')) {
        return this.hideSidebar();
      }
      return this.showSidebar();
    });

    this.iconBack.click(() => {
      this.hideSidebar();
    });
  };

  App.init();
})();
