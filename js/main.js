/* ZERONE STUDIO — main.js
   Cinematic motion: curtain page-transitions, scroll reveals, hero entrance,
   parallax, magnetic cursor. Respects prefers-reduced-motion throughout. */

(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HAS_GSAP = typeof gsap !== "undefined";
  if (HAS_GSAP && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  document.documentElement.classList.add("js");

  /* ---------------------------------------------------------------------
     Curtain — cinematic entrance + link transitions between pages
  --------------------------------------------------------------------- */
  function initCurtain() {
    var curtain = document.getElementById("curtain");
    if (!curtain) return;

    function reveal() {
      if (REDUCED || !HAS_GSAP) {
        curtain.style.display = "none";
        document.dispatchEvent(new CustomEvent("curtain:lift"));
        return;
      }
      gsap.timeline({ defaults: { ease: "power4.inOut" } })
        .set(curtain, { display: "block", autoAlpha: 1 })
        .call(function () {
          document.dispatchEvent(new CustomEvent("curtain:lift"));
        })
        .to(curtain, {
          scaleY: 0,
          transformOrigin: "bottom",
          duration: 0.9,
          onComplete: function () {
            curtain.style.pointerEvents = "none";
          }
        });
    }
    // Wait for full page load (fonts/images) so the curtain lift reveals a
    // ready page rather than a half-loaded one — with a safety timeout.
    var revealed = false;
    function revealOnce() {
      if (revealed) return;
      revealed = true;
      reveal();
    }
    if (document.readyState === "complete") {
      revealOnce();
    } else {
      window.addEventListener("load", revealOnce);
      setTimeout(revealOnce, 2200);
    }

    // Intercept internal same-origin link clicks for a curtain-out transition
    document.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      var href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      var url;
      try { url = new URL(href, window.location.href); } catch (err) { return; }
      if (url.origin !== window.location.origin) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      if (REDUCED || !HAS_GSAP) {
        window.location.href = url.href;
        return;
      }
      curtain.style.pointerEvents = "auto";
      gsap.timeline({ defaults: { ease: "power4.inOut" } })
        .set(curtain, { transformOrigin: "top" })
        .to(curtain, { scaleY: 1, duration: 0.65 })
        .to({}, { duration: 0.12 })
        .call(function () { window.location.href = url.href; });
    });
  }

  /* ---------------------------------------------------------------------
     Header condense-on-scroll
  --------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var lastY = window.scrollY;
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle("is-condensed", y > 40);
      lastY = y;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Mobile menu
  --------------------------------------------------------------------- */
  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".main-nav__list");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.style.display = open ? "flex" : "";
      if (open) {
        nav.style.position = "fixed";
        nav.style.inset = "0";
        nav.style.background = "#0A0A09";
        nav.style.color = "#EEECE4";
        nav.style.flexDirection = "column";
        nav.style.alignItems = "center";
        nav.style.justifyContent = "center";
        nav.style.gap = "2rem";
        nav.style.zIndex = "600";
        nav.style.fontSize = "1.6rem";
      } else {
        nav.removeAttribute("style");
      }
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        nav.removeAttribute("style");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Hero entrance
     — the brand hero (.hero__frame) gets one quiet, unified fade: no
       stagger, no slide-mask theatrics. A single slow breath.
     — project heroes keep a slightly more cinematic staggered reveal,
       since those pages are showcasing the film work itself.
  --------------------------------------------------------------------- */
  function initHeroEntrance() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) return;
    if (REDUCED || !HAS_GSAP) return;

    var curtain = document.getElementById("curtain");
    var quietFrame = hero.querySelector(".hero__frame");

    function bind(playFn) {
      if (curtain) {
        document.addEventListener("curtain:lift", playFn, { once: true });
      } else {
        playFn();
      }
    }

    if (quietFrame) {
      // Quiet brand hero — single calm fade, slight rise, no drama.
      var scrollcue = hero.querySelector(".hero__scrollcue");
      gsap.set(quietFrame, { autoAlpha: 0, y: 14 });
      if (scrollcue) gsap.set(scrollcue, { autoAlpha: 0 });
      bind(function () {
        var tl = gsap.timeline({ delay: 0.3, defaults: { ease: "power1.out" } });
        tl.to(quietFrame, { autoAlpha: 1, y: 0, duration: 1.8 });
        if (scrollcue) tl.to(scrollcue, { autoAlpha: 1, duration: 1.2 }, "-=1.1");
      });
      return;
    }

    // Project hero — staggered, filmic reveal
    var lines = hero.querySelectorAll(".proj-hero__title");
    var eyebrow = hero.querySelector(".proj-hero__index");
    var foot = hero.querySelector(".proj-hero__cat");

    gsap.set(lines, { yPercent: 110 });
    if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
    if (foot) gsap.set(foot, { autoAlpha: 0, y: 16 });

    bind(function () {
      var tl = gsap.timeline({ delay: 0.25, defaults: { ease: "power4.out" } });
      if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.9 });
      tl.to(lines, { yPercent: 0, duration: 1.1, stagger: 0.12 }, "-=0.5");
      if (foot) tl.to(foot, { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.5");
    });

    var media = hero.querySelector(".proj-hero__media img, .proj-hero__media video");
    if (media) {
      gsap.to(media, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
      });
    }
  }

  /* ---------------------------------------------------------------------
     Scroll reveals — fade/rise + image scale-reveal
  --------------------------------------------------------------------- */
  function initScrollReveals() {
    if (REDUCED || !HAS_GSAP || typeof ScrollTrigger === "undefined") {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.style.opacity = 1; el.style.transform = "none";
      });
      return;
    }

    gsap.utils.toArray(".reveal").forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    gsap.utils.toArray(".reveal-img").forEach(function (el) {
      var media = el.querySelector("img, video");
      if (!media) return;
      gsap.to(media, {
        scale: 1,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Magnetic cursor
  --------------------------------------------------------------------- */
  function initCursor() {
    if (REDUCED || window.matchMedia("(pointer: coarse)").matches) return;
    var dot = document.createElement("div");
    var ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll("a, button, .work-piece, .service-row").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-hover"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-hover"); });
    });

    document.querySelectorAll("[data-dark-cursor]").forEach(function (zone) {
      zone.addEventListener("mouseenter", function () { ring.classList.add("is-dark"); });
      zone.addEventListener("mouseleave", function () { ring.classList.remove("is-dark"); });
    });
  }

  /* ---------------------------------------------------------------------
     Lazy video autoplay when in view (perf)
  --------------------------------------------------------------------- */
  function initLazyVideo() {
    var videos = document.querySelectorAll("video[data-lazy]");
    if (!videos.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (v.dataset.src && !v.src) v.src = v.dataset.src;
          v.play && v.play().catch(function () {});
        } else {
          v.pause && v.pause();
        }
      });
    }, { threshold: 0.25 });
    videos.forEach(function (v) { io.observe(v); });
  }

  /* ---------------------------------------------------------------------
     Boot
  --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initCurtain();
    initHeader();
    initMenu();
    initHeroEntrance();
    initScrollReveals();
    initCursor();
    initLazyVideo();
  });
})();
