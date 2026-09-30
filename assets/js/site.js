(() => {
  const languageToggle = document.querySelector('.language-toggle');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');
  const fa = window.cyberPulseFa || {};
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();

  if (!toggle || !nav) return;

  const setLanguage = (language) => {
    const isPersian = language === 'fa';
    document.documentElement.lang = isPersian ? 'fa' : 'en';
    document.documentElement.dir = isPersian ? 'rtl' : 'ltr';
    document.title = isPersian
      ? 'سایبرپالس هفتگی — شمارهٔ ۰۰۱'
      : 'CyberPulse Weekly — Issue 001';

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = isPersian
        ? 'شمارهٔ ۰۰۱ سایبرپالس هفتگی — نسخهٔ نهایی وب‌سایت با گزارش‌های مستند امنیت سایبری برای ۲۳ تا ۲۹ سپتامبر ۲۰۲۶.'
        : 'CyberPulse Weekly Issue 001 — the final website edition of sourced cybersecurity intelligence for September 23–29, 2026.';
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const original = originalText.get(node);
      const trimmed = original.trim().replace(/\s+/g, ' ');
      if (isPersian && fa[trimmed]) {
        const leading = original.match(/^\s*/)?.[0] || '';
        const trailing = original.match(/\s*$/)?.[0] || '';
        node.nodeValue = `${leading}${fa[trimmed]}${trailing}`;
      } else {
        node.nodeValue = original;
      }
    }

    const ariaLabels = document.querySelectorAll('[aria-label]');
    for (const element of ariaLabels) {
      if (!originalAttributes.has(element)) originalAttributes.set(element, element.getAttribute('aria-label'));
      const original = originalAttributes.get(element);
      const translated = original === 'Open navigation'
        ? (isPersian ? 'باز کردن پیمایش' : original)
        : original === 'Close navigation'
          ? (isPersian ? 'بستن پیمایش' : original)
          : original === 'CyberPulse Weekly home'
            ? (isPersian ? 'صفحهٔ اصلی سایبرپالس هفتگی' : original)
            : original === 'CyberPulse Weekly Issue 001 cover illustration'
              ? (isPersian ? 'طرح جلد شمارهٔ ۰۰۱ سایبرپالس هفتگی' : original)
          : original === 'Read the fbijobs.gov story'
            ? (isPersian ? 'مطالعهٔ گزارش ادعای fbijobs.gov' : original)
            : original === 'Read the third-party ICS guidance story'
              ? (isPersian ? 'مطالعهٔ راهنمای دسترسی پیمانکاران ICS' : original)
              : original === 'Read the Kiro IDE security story'
                ? (isPersian ? 'مطالعهٔ گزارش امنیتی Kiro IDE' : original)
                : original === 'Read the pgcollection security story'
                  ? (isPersian ? 'مطالعهٔ گزارش امنیتی pgcollection' : original)
                  : (isPersian && fa[original] ? fa[original] : original);
      element.setAttribute('aria-label', translated);
    }

    if (languageToggle) {
      languageToggle.textContent = isPersian ? 'English' : 'فارسی';
      languageToggle.setAttribute('aria-label', isPersian ? 'Switch to English' : 'Switch to Persian');
      languageToggle.setAttribute('lang', isPersian ? 'en' : 'fa');
    }

    const navLabel = toggle.querySelector('.sr-only');
    if (navLabel) navLabel.textContent = isPersian
      ? (toggle.getAttribute('aria-expanded') === 'true' ? 'بستن پیمایش' : 'باز کردن پیمایش')
      : (toggle.getAttribute('aria-expanded') === 'true' ? 'Close navigation' : 'Open navigation');
  };

  if (languageToggle) {
    let savedLanguage = 'en';
    try {
      savedLanguage = localStorage.getItem('cyberpulse-language') === 'fa' ? 'fa' : 'en';
    } catch (_) {}
    setLanguage(savedLanguage);
    languageToggle.addEventListener('click', () => {
      const nextLanguage = document.documentElement.lang === 'fa' ? 'en' : 'fa';
      try {
        localStorage.setItem('cyberpulse-language', nextLanguage);
      } catch (_) {}
      setLanguage(nextLanguage);
      closeMenu();
    });
  }

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    nav.style.display = '';
    const label = toggle.querySelector('.sr-only');
    if (label) label.textContent = document.documentElement.lang === 'fa' ? 'باز کردن پیمایش' : 'Open navigation';
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open', !expanded);
    nav.style.display = expanded ? 'none' : 'flex';
    const label = toggle.querySelector('.sr-only');
    if (label) label.textContent = document.documentElement.lang === 'fa'
      ? (expanded ? 'باز کردن پیمایش' : 'بستن پیمایش')
      : (expanded ? 'Open navigation' : 'Close navigation');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 701px)').matches) closeMenu();
  });
})();
