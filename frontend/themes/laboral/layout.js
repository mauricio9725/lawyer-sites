/**
 * Laboral – Scroll reveal, sticky header, floating lawyer card, lawyer tooltip
 */
(function () {
  function initReveal() {
    var sections = document.querySelectorAll('.design-laboral .reveal-section');
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

  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    function update() {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function setHeroLawyerPresence() {
    var heroName = document.getElementById('hero-lawyer-name');
    var heroSpec = document.getElementById('hero-lawyer-spec');
    var profileTitle = document.getElementById('profile-title');
    var footerName = document.getElementById('footer-name');
    var tagline = document.querySelector('.design-laboral .tagline');
    var profileText = document.getElementById('profile-text');
    if (!heroName) return;
    var name = (profileTitle && profileTitle.textContent.trim()) || (footerName && footerName.textContent.trim()) || '';
    if (name === 'Sobre mí' && footerName) name = footerName.textContent.trim() || name;
    if (name && name !== 'Cargando...') {
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
    var tagline = document.querySelector('.design-laboral .tagline');
    if (!card || !img || !nameEl) return;
    var alt = (profileTitle && profileTitle.textContent.trim()) ? profileTitle.textContent.trim() : 'Abogado';
    if (profilePhoto && profilePhoto.src) {
      img.src = profilePhoto.src;
      img.alt = alt;
      copyProfilePhotoToHeader();
    } else {
      img.alt = alt;
    }
    nameEl.textContent = (profileTitle && profileTitle.textContent.trim()) || (document.getElementById('footer-name') && document.getElementById('footer-name').textContent.trim()) || 'Abogado';
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
      if (href && href !== '#') {
        cardWa.setAttribute('href', href);
        if (tooltipWa) tooltipWa.setAttribute('href', href);
      }
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
        entries.forEach(function (entry) {
          card.classList.toggle('visible', !entry.isIntersecting);
        });
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
    /* No mostrar tooltip al pasar sobre la tarjeta flotante (evitar duplicado con el icono WhatsApp de la tarjeta) */
    var triggers = document.querySelectorAll('.design-laboral #profile-photo, .design-laboral #profile-title, .design-laboral .profile-content, .design-laboral #header-lawyer-photo, .design-laboral #hero-lawyer-name, .design-laboral .hero-lawyer-presence');
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
      hideTimer = setTimeout(function () {
        tooltip.classList.remove('visible');
        tooltip.setAttribute('aria-hidden', 'true');
      }, 150);
    }
    function cancelHide() { clearTimeout(hideTimer); }
    triggers.forEach(function (el) {
      el.addEventListener('mouseenter', showTooltip);
      el.addEventListener('mouseleave', hideTooltip);
    });
    tooltip.addEventListener('mouseenter', cancelHide);
    tooltip.addEventListener('mouseleave', hideTooltip);
  }

  function runWhenContentReady(fn) {
    function tryRun() {
      var fnEl = document.getElementById('footer-name');
      var name = fnEl && fnEl.textContent.trim();
      if (name && name !== 'Cargando...') {
        fn();
        return true;
      }
      return false;
    }
    if (tryRun()) return;
    var attempts = 0;
    var t = setInterval(function () {
      if (tryRun() || attempts++ > 40) clearInterval(t);
    }, 250);
  }

  function watchProfilePhotoForHeader() {
    var profilePhoto = document.getElementById('profile-photo');
    var headerPhoto = document.getElementById('header-lawyer-photo');
    if (!profilePhoto || !headerPhoto) return;
    var mo = new MutationObserver(function () { copyProfilePhotoToHeader(); });
    mo.observe(profilePhoto, { attributes: true, attributeFilter: ['src'] });
    copyProfilePhotoToHeader();
  }

  function init() {
    initReveal();
    initHeaderScroll();
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
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
