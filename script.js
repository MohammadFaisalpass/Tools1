document.addEventListener('DOMContentLoaded', function () {

  // ---------- Page router (swaps which <section data-page> is shown) ----------
  var pages = document.querySelectorAll('.page');
  var navLinks = document.querySelectorAll('[data-nav]');
  var tabLinks = document.querySelectorAll('.editor-tabs a');

  function showPage(name) {
    pages.forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-page') === name);
    });
    tabLinks.forEach(function (a) {
      if (a.getAttribute('data-nav') === name) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
    window.scrollTo(0, 0);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = link.getAttribute('data-nav');
      showPage(target);
      history.replaceState(null, '', '#' + target);
      // close mobile menu after choosing a tab
      var tabs = document.querySelector('.editor-tabs');
      if (tabs) tabs.classList.remove('is-open');
    });
  });

  // Load whichever page the URL hash points to (supports deep links / back button)
  var initial = (location.hash || '#index').replace('#', '');
  var valid = ['index', 'courses', 'pricing', 'contact'];
  showPage(valid.indexOf(initial) !== -1 ? initial : 'index');

  window.addEventListener('popstate', function () {
    var current = (location.hash || '#index').replace('#', '');
    showPage(valid.indexOf(current) !== -1 ? current : 'index');
  });

  // ---------- Mobile nav toggle ----------
  var toggle = document.querySelector('.nav-toggle');
  var tabsNav = document.querySelector('.editor-tabs');
  if (toggle && tabsNav) {
    toggle.addEventListener('click', function () {
      var isOpen = tabsNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ---------- Course filter (courses page) ----------
  var filterButtons = document.querySelectorAll('.filter-btn');
  var courseCards = document.querySelectorAll('[data-page="courses"] .course-card');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      var category = btn.getAttribute('data-filter');
      courseCards.forEach(function (card) {
        var matches = category === 'all' || card.getAttribute('data-category') === category;
        card.hidden = !matches;
      });
    });
  });

  // ---------- Contact form ----------
  var form = document.querySelector('.contact-form');
  var status = document.querySelector('.form-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#fullName').value.trim();
      status.textContent = name
        ? 'Thanks, ' + name + ' — an advisor will reply within one working day.'
        : 'Thanks — an advisor will reply within one working day.';
      status.classList.add('is-visible', 'success');
    });
    var clearBtn = form.querySelector('.js-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        form.reset();
        status.classList.remove('is-visible', 'success');
      });
    }
  }
});
