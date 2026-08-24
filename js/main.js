/* =========================================================
   TechStratus — main.js
   Mobile nav, scroll-to-top, reveal-on-scroll, form handling
   ========================================================= */
(function () {
  "use strict";

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close the menu after tapping a link (mobile)
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Scroll-to-top button ---- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
  }

  /* ---- Reveal elements on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Contact form ----
     Submits to whatever endpoint is in the form's action attribute
     (Formspree by default) without leaving the page.

     While the action still contains the YOUR_FORM_ID placeholder, we
     show a "not connected yet" note and deliberately DO NOT clear the
     form, so nobody loses what they typed. Once a real form ID is
     pasted in, sending starts working with no other code changes. */
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");

  if (form && note) {
    var button = form.querySelector('button[type="submit"]');
    var buttonText = button ? button.textContent : "";

    function setNote(kind, text) {
      note.className = "form-note " + kind;
      note.textContent = text;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var endpoint = form.getAttribute("action") || "";

      // Not wired up yet: tell the visitor how to reach us, keep their text.
      if (endpoint.indexOf("YOUR_FORM_ID") !== -1 || endpoint === "#" || endpoint === "") {
        setNote("err", "This form isn't connected yet. Please call 406-284-5523 or email jacob@techstratus.com. Your message is still here so you can copy it.");
        return;
      }

      if (button) { button.disabled = true; button.textContent = "Sending..."; }
      setNote("", "");

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setNote("ok", "Thanks! Your message has been sent. We'll get back to you soon.");
          } else {
            return res.json().then(function (data) {
              var msg = data && data.errors
                ? data.errors.map(function (x) { return x.message; }).join(", ")
                : "Something went wrong sending your message.";
              throw new Error(msg);
            });
          }
        })
        .catch(function () {
          setNote("err", "Sorry, your message couldn't be sent. Please call 406-284-5523 or email jacob@techstratus.com.");
        })
        .then(function () {
          if (button) { button.disabled = false; button.textContent = buttonText; }
        });
    });
  }
})();
