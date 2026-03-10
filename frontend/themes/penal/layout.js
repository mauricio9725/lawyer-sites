/**
 * Design 3 (penal) – Sidebar nav + scroll reveal
 * Smooth scroll, section highlight, reveal-on-scroll for .reveal-section.
 */
(function () {
  function initReveal() {
    var sections = document.querySelectorAll('.design-penal .reveal-section');
    if (!sections.length) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
    );
    sections.forEach(function (el) { observer.observe(el); });
  }

  function initSidebarNav() {
    var sidebar = document.querySelector('.design-penal .sidebar-nav');
    if (!sidebar) return;

    var links = sidebar.querySelectorAll('.sidebar-link');
    var sections = [];

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.indexOf('#') === 0) {
        var id = href.slice(1);
        var section = document.getElementById(id);
        if (section) {
          sections.push({ link: link, section: section, id: id });
          link.addEventListener('click', function (e) {
            e.preventDefault();
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      }
    });

    if (!sections.length) return;

    function updateActive() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var viewportMid = scrollY + window.innerHeight * 0.35;
      var current = null;

      for (var i = sections.length - 1; i >= 0; i--) {
        var top = sections[i].section.offsetTop;
        var height = sections[i].section.offsetHeight;
        if (viewportMid >= top && viewportMid <= top + height) {
          current = sections[i].link;
          break;
        }
        if (viewportMid >= top) {
          current = sections[i].link;
          break;
        }
      }

      if (!current && sections.length) current = sections[0].link;

      links.forEach(function (l) { l.classList.remove('active'); });
      if (current) current.classList.add('active');
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            entry.target.dataset.visible = entry.isIntersecting ? '1' : '0';
          });
          updateActive();
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      sections.forEach(function (s) { observer.observe(s.section); });
    }

    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateActive);
    }, { passive: true });
    updateActive();
  }

  function setHeroLawyerPresence() {
    var heroName = document.getElementById('hero-lawyer-name');
    var heroSpec = document.getElementById('hero-lawyer-spec');
    var profileTitle = document.getElementById('profile-title');
    var footerName = document.getElementById('footer-name');
    var tagline = document.querySelector('.design-penal .sidebar-brand .tagline');
    var profileText = document.getElementById('profile-text');
    if (!heroName) return;
    var name = (profileTitle && profileTitle.textContent.trim()) || (footerName && footerName.textContent.trim()) || '';
    if (name && name !== 'Sobre mí') {
      heroName.textContent = name;
      heroName.removeAttribute('aria-hidden');
    }
    if (heroSpec) {
      var spec = (tagline && tagline.textContent.trim()) || (profileText && profileText.textContent.trim().slice(0, 60)) || '';
      if (spec && spec !== 'Cargando...') {
        heroSpec.textContent = spec.length > 60 ? spec.slice(0, 57) + '...' : spec;
        heroSpec.removeAttribute('aria-hidden');
      }
    }
  }

  function copyProfilePhotoToHeader() {
    var profilePhoto = document.getElementById('profile-photo');
    var headerPhoto = document.getElementById('header-lawyer-photo');
    var profileTitle = document.getElementById('profile-title');
    if (!profilePhoto || !headerPhoto || !profilePhoto.src || profilePhoto.src === '') return;
    var alt = (profileTitle && profileTitle.textContent.trim()) ? profileTitle.textContent.trim() : 'Abogado';
    headerPhoto.src = profilePhoto.src;
    headerPhoto.alt = alt;
    headerPhoto.style.display = '';
  }

  function fillFloatingCard() {
    var card = document.getElementById('floating-lawyer-card');
    var img = card && card.querySelector('.floating-lawyer-card__photo');
    var nameEl = card && card.querySelector('.floating-lawyer-card__name');
    var specEl = card && card.querySelector('.floating-lawyer-card__spec');
    var profilePhoto = document.getElementById('profile-photo');
    var profileTitle = document.getElementById('profile-title');
    var profileText = document.getElementById('profile-text');
    var tagline = document.querySelector('.design-penal .sidebar-brand .tagline');
    if (!card || !img || !nameEl) return;
    if (profilePhoto && profilePhoto.src) {
      img.src = profilePhoto.src;
      copyProfilePhotoToHeader();
    }
    img.alt = (profileTitle && profileTitle.textContent.trim()) ? profileTitle.textContent.trim() : 'Abogado';
    nameEl.textContent = (profileTitle && profileTitle.textContent.trim()) || (document.getElementById('footer-name') && document.getElementById('footer-name').textContent.trim()) || 'Abogado';
    if (nameEl.textContent === 'Sobre mí') nameEl.textContent = (document.getElementById('footer-name') && document.getElementById('footer-name').textContent.trim()) || 'Abogado';
    var spec = (tagline && tagline.textContent.trim()) || (profileText && profileText.textContent.trim().slice(0, 80));
    if (spec) specEl.textContent = spec.length > 80 ? spec.slice(0, 77) + '...' : spec;
    card.setAttribute('aria-hidden', 'false');
  }

  function syncFloatingWa() {
    var waFloat = document.querySelector('.whatsapp-float');
    var cardWa = document.getElementById('floating-card-wa');
    var tooltipWa = document.querySelector('.lawyer-tooltip__wa');
    if (!waFloat || !cardWa) return;
    function sync() {
      var href = waFloat.getAttribute('href');
      if (href && href !== '#') { cardWa.setAttribute('href', href); if (tooltipWa) tooltipWa.setAttribute('href', href); }
    }
    sync();
    var mo = new MutationObserver(sync);
    mo.observe(waFloat, { attributes: true, attributeFilter: ['href'] });
  }

  function initFloatingCardVisibility() {
    var hero = document.getElementById('hero');
    var card = document.getElementById('floating-lawyer-card');
    if (!hero || !card) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) { card.classList.toggle('visible', !entry.isIntersecting); });
      },
      { threshold: 0, rootMargin: '0px 0px -50% 0px' }
    );
    io.observe(hero);
  }

  function initLawyerTooltip() {
    var tooltip = document.getElementById('lawyer-tooltip');
    if (!tooltip) return;
    var tooltipPhoto = tooltip.querySelector('.lawyer-tooltip__photo');
    var tooltipText = tooltip.querySelector('.lawyer-tooltip__text');
    var tooltipWa = tooltip.querySelector('.lawyer-tooltip__wa');
    var profilePhoto = document.getElementById('profile-photo');
    var profileText = document.getElementById('profile-text');
    var waFloat = document.querySelector('.whatsapp-float');
    var triggers = document.querySelectorAll('.design-penal #profile-photo, .design-penal #profile-title, .design-penal .profile-content, .design-penal #header-lawyer-photo, .design-penal #hero-lawyer-name, .design-penal .hero-lawyer-presence');
    var hideTimer;
    function showTooltip(e) {
      clearTimeout(hideTimer);
      if (profilePhoto && profilePhoto.src) tooltipPhoto.src = profilePhoto.src;
      tooltipPhoto.alt = 'Abogado';
      tooltipText.textContent = (profileText && profileText.textContent.trim().slice(0, 120)) || 'Consulta legal profesional.';
      if (profileText && profileText.textContent.length > 120) tooltipText.textContent += '...';
      if (waFloat && waFloat.getAttribute('href')) tooltipWa.setAttribute('href', waFloat.getAttribute('href'));
      var gap = 12;
      var tw = 256;
      var th = 200;
      var x = Math.min(e.clientX + gap, window.innerWidth - tw - gap);
      var y = Math.min(e.clientY + gap, window.innerHeight - th - gap);
      x = Math.max(gap, x);
      y = Math.max(gap, y);
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
      tooltip.classList.add('visible');
      tooltip.setAttribute('aria-hidden', 'false');
    }
    function hideTooltip() {
      hideTimer = setTimeout(function () { tooltip.classList.remove('visible'); tooltip.setAttribute('aria-hidden', 'true'); }, 150);
    }
    triggers.forEach(function (el) {
      el.addEventListener('mouseenter', showTooltip);
      el.addEventListener('mouseleave', hideTooltip);
    });
    tooltip.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    tooltip.addEventListener('mouseleave', hideTooltip);
  }

  function watchProfilePhotoForHeader() {
    var profilePhoto = document.getElementById('profile-photo');
    var headerPhoto = document.getElementById('header-lawyer-photo');
    if (!profilePhoto || !headerPhoto) return;
    var mo = new MutationObserver(function () { copyProfilePhotoToHeader(); });
    mo.observe(profilePhoto, { attributes: true, attributeFilter: ['src'] });
    copyProfilePhotoToHeader();
  }

  function runWhenContentReady(fn) {
    function tryRun() {
      var name = (document.getElementById('profile-title') && document.getElementById('profile-title').textContent.trim()) ||
                 (document.getElementById('footer-name') && document.getElementById('footer-name').textContent.trim());
      if (name && name !== 'Cargando...' && name !== 'Sobre mí') { fn(); return true; }
      return false;
    }
    if (tryRun()) return;
    var attempts = 0;
    var t = setInterval(function () { if (tryRun() || attempts++ > 40) clearInterval(t); }, 250);
  }

  function run() {
    initReveal();
    initSidebarNav();
    watchProfilePhotoForHeader();
    runWhenContentReady(function () {
      setHeroLawyerPresence();
      fillFloatingCard();
      setTimeout(fillFloatingCard, 600);
    });
    syncFloatingWa();
    initFloatingCardVisibility();
    initLawyerTooltip();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
