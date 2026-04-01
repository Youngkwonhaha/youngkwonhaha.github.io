(function () {
  'use strict';

  var DATA_PATH = 'data/academy.json';

  // ===== Data Fetching =====
  async function loadData() {
    try {
      var res = await fetch(DATA_PATH);
      if (!res.ok) throw new Error('Failed to load data');
      return await res.json();
    } catch (err) {
      console.error('데이터를 불러올 수 없습니다:', err);
      return null;
    }
  }

  // ===== Render Functions =====

  function renderHero(data) {
    document.getElementById('heroBadge').textContent = data.region;
    document.getElementById('heroTitle').textContent = data.name;
    document.getElementById('heroTagline').textContent = data.tagline;
    document.getElementById('heroSubtitle').textContent = data.subtitle;
  }

  function renderGrades(grades) {
    var container = document.getElementById('gradesList');
    container.innerHTML = grades
      .map(function (g) {
        var pointsHtml = g.points
          .map(function (p) { return '<li>' + p + '</li>'; })
          .join('');
        return (
          '<div class="grade-card fade-in">' +
            '<div class="grade-header">' +
              '<span class="grade-icon">' + g.icon + '</span>' +
              '<span class="grade-label">' + g.label + '</span>' +
            '</div>' +
            '<ul class="grade-points">' + pointsHtml + '</ul>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderFeatures(features) {
    var container = document.getElementById('featuresList');
    container.innerHTML = features
      .map(function (f) {
        return (
          '<div class="feature-card fade-in">' +
            '<div class="feature-check">✓</div>' +
            '<div class="feature-content">' +
              '<h3 class="feature-title">' + f.title + '</h3>' +
              '<p class="feature-desc">' + f.desc + '</p>' +
            '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderPhilosophy(philosophy) {
    document.getElementById('philosophyTitle').textContent = philosophy.title;
    document.getElementById('philosophyIntro').textContent = philosophy.intro;
    document.getElementById('philosophyClosing').textContent = philosophy.closing;

    var container = document.getElementById('philosophyList');
    container.innerHTML = philosophy.points
      .map(function (point) {
        return '<li>' + point + '</li>';
      })
      .join('');
  }

  function renderFaq(faq) {
    var container = document.getElementById('faqList');
    container.innerHTML = faq
      .map(function (item, i) {
        return (
          '<div class="faq-item fade-in">' +
            '<button class="faq-question" data-index="' + i + '">' +
              'Q. ' + item.q +
            '</button>' +
            '<div class="faq-answer">' +
              '<div class="faq-answer-inner">' + item.a + '</div>' +
            '</div>' +
          '</div>'
        );
      })
      .join('');

    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-question');
      if (!btn) return;
      var item = btn.parentElement;
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      container.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  }

  function renderLocation(location) {
    document.getElementById('locationArea').textContent = location.area;
    document.getElementById('locationDetail').textContent = location.detail;
    document.getElementById('locationNote').textContent = location.note;
  }

  function renderHours(hours) {
    document.getElementById('hoursWeekday').textContent = hours.weekday;
    document.getElementById('hoursSaturday').textContent = hours.saturday;
    document.getElementById('hoursSunday').textContent = hours.sunday;
  }

  function renderFutureServices(services) {
    var container = document.getElementById('futureList');
    container.innerHTML = services
      .map(function (s) {
        return (
          '<div class="future-card fade-in">' +
            '<div class="future-icon">' + s.icon + '</div>' +
            '<div>' +
              '<p class="future-title">' + s.title + '</p>' +
              '<p class="future-desc">' + s.desc + '</p>' +
            '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderContact(contact) {
    var phoneBtn = document.getElementById('btnPhone');
    var kakaoBtn = document.getElementById('btnKakao');

    if (contact.phone) {
      phoneBtn.href = 'tel:' + contact.phone;
    }
    if (contact.kakao) {
      kakaoBtn.href = contact.kakao;
      kakaoBtn.target = '_blank';
      kakaoBtn.rel = 'noopener noreferrer';
    }
  }

  function renderFooter(data) {
    document.getElementById('footerName').textContent = data.name;
    document.getElementById('footerRegion').textContent = data.region;
  }

  // ===== Scroll Animation =====
  function initScrollAnimation() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ===== Floating CTA =====
  function initFloatingCta() {
    var floatingBtn = document.getElementById('floatingCta');
    var heroSection = document.getElementById('hero');
    var contactSection = document.getElementById('contact');

    window.addEventListener('scroll', function () {
      var heroBottom = heroSection.getBoundingClientRect().bottom;
      var contactTop = contactSection.getBoundingClientRect().top;
      var windowHeight = window.innerHeight;

      if (heroBottom < 0 && contactTop > windowHeight) {
        floatingBtn.classList.add('show');
      } else {
        floatingBtn.classList.remove('show');
      }
    });
  }

  // ===== Initialize =====
  async function init() {
    var data = await loadData();
    if (!data) return;

    renderHero(data);
    renderGrades(data.grades);
    renderFeatures(data.features);
    renderPhilosophy(data.philosophy);
    renderFaq(data.faq);
    renderLocation(data.location);
    renderHours(data.hours);
    renderFutureServices(data.futureServices);
    renderContact(data.contact);
    renderFooter(data);

    requestAnimationFrame(initScrollAnimation);
    initFloatingCta();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
