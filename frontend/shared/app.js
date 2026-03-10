/**
 * Lawyer Sites - Frontend (UX mejorado)
 * Espera: window.SITE_KEY, window.API_BASE (opcional)
 */
(function () {
  const SITE_KEY = window.SITE_KEY || 'general';
  const API_BASE = (window.API_BASE || '').replace(/\/$/, '');

  var icons = {
    experience: '★',
    confidential: '🔒',
    personalized: '👤',
    fast: '⚡',
    briefcase: '💼',
    money: '💰',
    clock: '🕐',
    shield: '🛡️',
    document: '📄'
  };

  var config = null;
  var currentWhatsAppMsg = '';
  var testimonialIndex = 0;
  var testimonialSlides = [];
  var testimonialTimer = null;

  function getWhatsAppUrl() {
    if (!config || !config.whatsapp_number) return '#';
    var num = String(config.whatsapp_number).replace(/\D/g, '');
    if (!num.startsWith('52') && !num.startsWith('57') && num.length <= 10) num = '57' + num;
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(currentWhatsAppMsg);
  }

  function setWhatsAppMsg(msg) {
    currentWhatsAppMsg = msg || (config && config.help_buttons && config.help_buttons[0] ? config.help_buttons[0].whatsapp_msg : 'Hola.');
  }

  function loadConfig() {
    return fetch(API_BASE + '/api/config/' + SITE_KEY)
      .then(function (r) { if (!r.ok) throw new Error('Config no encontrada'); return r.json(); })
      .then(function (data) { config = data; setWhatsAppMsg((data.help_buttons && data.help_buttons[0]) ? data.help_buttons[0].whatsapp_msg : 'Hola.'); return data; });
  }

  function applyColors() {
    if (!config || !config.colors) return;
    var c = config.colors;
    document.documentElement.style.setProperty('--primary', c.primary || '#1a365d');
    document.documentElement.style.setProperty('--primaryLight', c.primaryLight || '#2c5282');
    document.documentElement.style.setProperty('--accent', c.accent || '#ed8936');
    document.documentElement.style.setProperty('--text', c.text || '#2d3748');
    document.documentElement.style.setProperty('--bg', c.background || '#f7fafc');
  }

  function applyHeader() {
    if (!config) return;
    var name = config.name || '';
    var tagline = config.tagline || '';
    var h = document.querySelector('.site-header');
    if (h) {
      var n = h.querySelector('.name'); if (n) n.textContent = name;
      var t = h.querySelector('.tagline'); if (t) t.textContent = tagline;
    }
    var headerWa = document.getElementById('header-wa-link');
    if (headerWa) { headerWa.href = getWhatsAppUrl(); headerWa.setAttribute('target', '_blank'); headerWa.setAttribute('rel', 'noopener'); }
    var sidebar = document.querySelector('.sidebar-brand');
    if (sidebar) {
      var sn = sidebar.querySelector('.name'); if (sn) sn.textContent = name;
      var st = sidebar.querySelector('.tagline'); if (st) st.textContent = tagline;
    }
  }

  function applyHero() {
    var hero = document.getElementById('hero');
    if (!hero || !config) return;
    var img = (config.images && config.images.hero) || config.hero_image;
    if (img) hero.style.backgroundImage = 'url(' + img + ')';
    var h1 = hero.querySelector('h1'); if (h1 && config.hero && config.hero.title) h1.textContent = config.hero.title;
    var sub = hero.querySelector('.subtitle'); if (sub && config.hero && config.hero.subtitle) sub.textContent = config.hero.subtitle;
    var cta = document.getElementById('hero-cta'); if (cta) { cta.textContent = (config.hero && config.hero.cta_text) || 'Consultar mi caso'; cta.href = '#contact-form'; }
    var wa = document.getElementById('hero-wa'); if (wa) { wa.textContent = (config.hero && config.hero.whatsapp_text) || 'Escribir por WhatsApp'; wa.href = getWhatsAppUrl(); wa.setAttribute('target', '_blank'); wa.setAttribute('rel', 'noopener'); }
  }

  function buildTrust() {
    var wrap = document.getElementById('trust-wrap');
    var section = document.querySelector('.trust');
    if (!config.trust_indicators || !config.trust_indicators.length) {
      if (section) section.style.display = 'none';
      return;
    }
    if (section) section.style.display = '';
    if (!wrap) return;
    wrap.innerHTML = config.trust_indicators.map(function (item) {
      var icon = icons[item.icon] || '✓';
      return '<div class="trust-item"><span class="trust-icon">' + icon + '</span><p class="trust-text">' + escapeHtml(item.text) + '</p></div>';
    }).join('');
  }

  function buildProblemAwareness() {
    var section = document.getElementById('problem-section');
    var titleEl = document.getElementById('problem-title');
    var subEl = document.getElementById('problem-subtitle');
    var grid = document.getElementById('problem-grid');
    var data = config.problem_awareness;
    if (!data || !data.items || !data.items.length) {
      if (section) section.style.display = 'none';
      return;
    }
    if (section) section.style.display = '';
    if (titleEl && data.title) titleEl.textContent = data.title;
    if (subEl && data.subtitle) subEl.textContent = data.subtitle;
    if (!grid) return;
    grid.innerHTML = data.items.map(function (item) {
      var msg = escapeAttr(item.whatsapp_msg || item.label);
      return '<button type="button" class="problem-card" data-msg="' + msg + '"><p class="problem-text">' + escapeHtml(item.label) + '</p></button>';
    }).join('');
    grid.querySelectorAll('.problem-card').forEach(function (card) {
      card.addEventListener('click', function () {
        setWhatsAppMsg(card.getAttribute('data-msg'));
        updateAllWhatsAppLinks();
      });
    });
    var sectionImage = document.getElementById('problem-section-image');
    if (sectionImage && data.image) sectionImage.style.backgroundImage = 'url(' + data.image + ')';
  }

  function buildWhyTrustMe() {
    var section = document.getElementById('why-trust-section');
    var titleEl = document.getElementById('why-trust-title');
    var subEl = document.getElementById('why-trust-subtitle');
    var grid = document.getElementById('why-grid');
    var items = config.why_trust_me;
    if (!items || !items.length) {
      if (section) section.style.display = 'none';
      return;
    }
    if (section) section.style.display = '';
    if (titleEl && config.why_trust_title) titleEl.textContent = config.why_trust_title;
    if (subEl && config.why_trust_subtitle) subEl.textContent = config.why_trust_subtitle;
    if (!grid) return;
    grid.innerHTML = items.map(function (item) {
      var title = item.title || item.text || '';
      var desc = item.description || item.desc || '';
      return '<div class="why-card"><p class="why-title">' + escapeHtml(title) + '</p><p class="why-desc">' + escapeHtml(desc) + '</p></div>';
    }).join('');
  }

  function buildEducation() {
    var section = document.getElementById('education-section');
    var titleEl = document.getElementById('education-title');
    var subEl = document.getElementById('education-subtitle');
    var list = document.getElementById('education-list');
    var data = config.education;
    if (!data || !data.items || !data.items.length) {
      if (section) section.style.display = 'none';
      return;
    }
    if (section) section.style.display = '';
    if (titleEl && data.title) titleEl.textContent = data.title;
    if (subEl && data.subtitle) subEl.textContent = data.subtitle;
    if (!list) return;
    list.innerHTML = data.items.map(function (item) {
      var text = typeof item === 'string' ? item : (item.text || item.title || '');
      return '<li>' + escapeHtml(text) + '</li>';
    }).join('');
  }

  function setupTimelineScroll() {
    var items = document.querySelectorAll('.timeline-item');
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
    items.forEach(function (el) { observer.observe(el); });
  }

  function buildHelpCards() {
    var container = document.getElementById('help-cards');
    if (!container || !config.help_buttons || !config.help_buttons.length) return;
    setWhatsAppMsg(config.help_buttons[0].whatsapp_msg);
    container.innerHTML = config.help_buttons.map(function (btn, i) {
      var icon = icons[btn.icon] || '•';
      var active = i === 0 ? ' active' : '';
      return '<button type="button" class="help-card' + active + '" data-msg="' + escapeAttr(btn.whatsapp_msg) + '" data-id="' + escapeAttr(btn.id || '') + '"><span class="help-card-icon">' + icon + '</span><span class="help-card-label">' + escapeHtml(btn.label) + '</span></button>';
    }).join('');
    container.querySelectorAll('.help-card').forEach(function (card, i) {
      card.addEventListener('click', function () {
        container.querySelectorAll('.help-card').forEach(function (c) { c.classList.remove('active'); });
        card.classList.add('active');
        setWhatsAppMsg(card.getAttribute('data-msg'));
        updateAllWhatsAppLinks();
        var area = document.getElementById('content-area'); if (area) area.innerHTML = '<p>Puedes escribirme por WhatsApp con el botón verde o usar el formulario más abajo.</p>';
        updateAllWhatsAppLinks();
      });
    });
  }

  function buildServices() {
    var titleEl = document.getElementById('services-title');
    var grid = document.getElementById('services-grid');
    if (!config.services || !config.services.length) { var sec = document.getElementById('services-section'); if (sec) sec.style.display = 'none'; return; }
    if (titleEl) titleEl.textContent = 'Áreas de trabajo';
    if (grid) {
      grid.innerHTML = config.services.map(function (s) {
        var icon = icons[s.icon] || '•';
        var imgStyle = (s.image) ? ' style="background-image:url(' + escapeAttr(s.image) + ')"' : '';
        var imgBlock = (s.image) ? '<div class="service-card-image"' + imgStyle + '></div>' : '';
        return '<div class="service-card">' + imgBlock + '<span class="service-icon">' + icon + '</span><h3>' + escapeHtml(s.title) + '</h3><p>' + escapeHtml(s.description) + '</p><a href="#contact-form" class="service-link">Consultar →</a></div>';
      }).join('');
    }
  }

  function buildTimeline() {
    var titleEl = document.getElementById('timeline-title');
    var list = document.getElementById('timeline-list');
    if (!list || !config) return;
    if (titleEl && config.timeline_title) titleEl.textContent = config.timeline_title;
    var steps = config.timeline_steps;
    if (!steps || !steps.length) return;
    var isObject = typeof steps[0] === 'object' && steps[0].title !== undefined;
    list.innerHTML = steps.map(function (step, i) {
      var title = isObject ? step.title : 'Paso ' + (i + 1);
      var desc = isObject ? (step.desc || step.description || '') : step;
      return '<li class="timeline-item"><span class="timeline-marker">' + (i + 1) + '</span><span class="timeline-title">' + escapeHtml(title) + '</span><p class="timeline-desc">' + escapeHtml(desc) + '</p></li>';
    }).join('');
  }

  function buildCases() {
    var titleEl = document.getElementById('cases-title');
    var grid = document.getElementById('cases-grid');
    if (!grid || !config.cases || !config.cases.length) return;
    if (titleEl && config.cases_title) titleEl.textContent = config.cases_title;
    grid.innerHTML = config.cases.map(function (item) {
      return '<div class="case-card"><p class="case-text">' + escapeHtml(item) + '</p></div>';
    }).join('');
  }

  function applyProfile() {
    var titleEl = document.getElementById('profile-title');
    var textEl = document.getElementById('profile-text');
    var photoEl = document.getElementById('profile-photo');
    if (titleEl && config.profile_title) titleEl.textContent = config.profile_title;
    if (textEl && config.profile_text) textEl.textContent = config.profile_text;
    var imgSrc = (config.images && config.images.profile) || config.profile_image;
    if (photoEl) {
      if (imgSrc) { photoEl.src = imgSrc; photoEl.alt = config.name || 'Abogada'; photoEl.style.display = ''; }
      else photoEl.style.display = 'none';
    }
  }

  function buildTestimonials() {
    var slider = document.getElementById('testimonials-slider');
    var nav = document.getElementById('testimonials-nav');
    var section = document.getElementById('testimonials-section');
    if (!config.testimonials || !config.testimonials.length) { if (section) section.style.display = 'none'; return; }
    testimonialSlides = config.testimonials;
    if (!slider) return;
    slider.innerHTML = testimonialSlides.map(function (t, i) {
      return '<div class="testimonial-slide' + (i === 0 ? ' active' : '') + '" data-index="' + i + '"><span class="testimonial-quote" aria-hidden="true">"</span><p class="testimonial-text">' + escapeHtml(t.text) + '</p><p class="testimonial-author">' + escapeHtml(t.name) + '</p><p class="testimonial-city">' + escapeHtml(t.city || '') + '</p></div>';
    }).join('');
    if (nav && testimonialSlides.length > 1) {
      nav.innerHTML = testimonialSlides.map(function (_, i) {
        return '<button type="button" aria-label="Testimonio ' + (i + 1) + '"' + (i === 0 ? ' class="active"' : '') + ' data-index="' + i + '"></button>';
      }).join('');
      nav.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () { showTestimonial(parseInt(btn.getAttribute('data-index'), 10)); });
      });
      testimonialTimer = setInterval(function () { showTestimonial((testimonialIndex + 1) % testimonialSlides.length); }, 5000);
    }
  }

  function showTestimonial(index) {
    testimonialIndex = index;
    var slides = document.querySelectorAll('.testimonial-slide');
    var buttons = document.querySelectorAll('.testimonials-nav button');
    slides.forEach(function (s, i) { s.classList.toggle('active', i === index); });
    if (buttons.length) buttons.forEach(function (b, i) { b.classList.toggle('active', i === index); });
  }

  function applyCta() {
    var titleEl = document.getElementById('cta-title');
    var subEl = document.getElementById('cta-subtitle');
    var waEl = document.getElementById('cta-wa');
    if (titleEl && config.cta_title) titleEl.textContent = config.cta_title;
    if (subEl && config.cta_subtitle) subEl.textContent = config.cta_subtitle;
    if (waEl) { waEl.href = getWhatsAppUrl(); waEl.setAttribute('target', '_blank'); waEl.setAttribute('rel', 'noopener'); }
  }

  function applyContactForm() {
    var form = document.getElementById('contact-form');
    if (!form || !config) return;
    var titleEl = document.getElementById('contact-title'); if (titleEl && config.contact_title) titleEl.textContent = config.contact_title;
    var introEl = document.getElementById('contact-intro'); if (introEl && config.contact_intro) introEl.textContent = config.contact_intro;
    var select = form.querySelector('#case-type'); if (select && config.help_buttons && config.help_buttons.length) {
      select.innerHTML = '<option value="">Selecciona...</option>' + config.help_buttons.map(function (b) { return '<option value="' + escapeAttr(b.id || '') + '">' + escapeHtml(b.label) + '</option>'; }).join('');
    }
  }

  function applyFooter() {
    var nameEl = document.getElementById('footer-name');
    var cityEl = document.getElementById('footer-city');
    var phoneEl = document.getElementById('footer-phone');
    var waEl = document.getElementById('footer-wa');
    if (nameEl && config.name) nameEl.textContent = config.name;
    if (cityEl && config.city) cityEl.textContent = config.city;
    if (phoneEl && config.phone) { phoneEl.textContent = config.phone; phoneEl.href = 'tel:' + config.phone.replace(/\s/g, ''); }
    if (waEl) { waEl.href = getWhatsAppUrl(); waEl.setAttribute('target', '_blank'); waEl.setAttribute('rel', 'noopener'); }
  }

  function updateAllWhatsAppLinks() {
    var url = getWhatsAppUrl();
    var selectors = '.whatsapp-float, #hero-wa, #cta-wa, #footer-wa, #sidebar-wa, #sticky-cta-wa, #cta-mid-wa, #header-wa-link';
    document.querySelectorAll(selectors).forEach(function (a) { if (a && a.href !== undefined) a.href = url; });
  }

  function applyWhatsAppFloat() {
    var url = getWhatsAppUrl();
    document.querySelectorAll('.whatsapp-float, #sidebar-wa, #sticky-cta-wa, #cta-mid-wa, #header-wa-link').forEach(function (a) {
      if (a) { a.href = url; a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
    });
  }

  function escapeHtml(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  function submitContactForm(e) {
    e.preventDefault();
    var form = e.target;
    var msgEl = form.querySelector('.msg') || document.getElementById('form-msg');
    if (!msgEl) { msgEl = document.createElement('div'); msgEl.className = 'msg'; form.appendChild(msgEl); }
    var payload = {
      site_key: SITE_KEY,
      lawyer_type: config ? config.lawyer_type : null,
      name: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      phone: (form.querySelector('[name="phone"]') && form.querySelector('[name="phone"]').value) ? form.querySelector('[name="phone"]').value.trim() : null,
      case_type: form.querySelector('[name="case_type"]') && form.querySelector('[name="case_type"]').value ? form.querySelector('[name="case_type"]').value : null,
      message: form.querySelector('[name="message"]') && form.querySelector('[name="message"]').value ? form.querySelector('[name="message"]').value.trim() : null
    };
    if (!payload.name || !payload.email) { msgEl.textContent = 'Nombre y correo son obligatorios.'; msgEl.className = 'msg error'; return; }
    msgEl.textContent = 'Enviando...'; msgEl.className = 'msg';
    fetch(API_BASE + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function () { msgEl.textContent = 'Mensaje enviado. Te responderemos pronto.'; msgEl.className = 'msg success'; form.reset(); })
      .catch(function () { msgEl.textContent = 'No se pudo enviar. Intenta por WhatsApp.'; msgEl.className = 'msg error'; });
  }

  function addFormId() {
    var form = document.getElementById('contact-form'); if (form && !form.id) form.id = 'contact-form';
    var anchor = document.getElementById('contact-form'); if (!anchor && form) form.id = 'contact-form';
  }

  function init() {
    addFormId();
    loadConfig().then(function () {
      applyColors();
      applyHeader();
      applyHero();
      buildTrust();
      buildHelpCards();
      buildProblemAwareness();
      buildWhyTrustMe();
      buildServices();
      buildTimeline();
      setTimeout(setupTimelineScroll, 100);
      buildEducation();
      buildCases();
      applyProfile();
      buildTestimonials();
      applyCta();
      applyContactForm();
      applyFooter();
      applyWhatsAppFloat();
    }).catch(function () { applyColors(); });

    var form = document.getElementById('contact-form');
    if (form) form.addEventListener('submit', submitContactForm);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
