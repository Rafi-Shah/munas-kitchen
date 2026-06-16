// ── Scroll header ──────────────────────────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile nav ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ── Smooth scroll helper ────────────────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Set min date to today ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
});

// ── Reservation form ────────────────────────────────────────
async function submitReservation() {
  const btn     = document.getElementById('submit-btn');
  const errEl   = document.getElementById('form-error');
  const name    = document.getElementById('res-name').value.trim();
  const email   = document.getElementById('res-email').value.trim();
  const phone   = document.getElementById('res-phone').value.trim();
  const guests  = document.getElementById('res-guests').value;
  const date    = document.getElementById('res-date').value;
  const time    = document.getElementById('res-time').value;
  const notes   = document.getElementById('res-notes').value.trim();

  errEl.textContent = '';

  if (!name || !email || !date) {
    errEl.textContent = 'Please fill in your name, email, and date.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent = 'Please enter a valid email address.';
    return;
  }

  btn.textContent = 'Submitting…';
  btn.disabled = true;

  try {
    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, guests, date, time, notes })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      document.getElementById('reserve-form-container').classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
    } else {
      errEl.textContent = data.error || 'Something went wrong. Please try again.';
      btn.textContent = 'Confirm Reservation';
      btn.disabled = false;
    }
  } catch (err) {
    errEl.textContent = 'Network error. Please check your connection.';
    btn.textContent = 'Confirm Reservation';
    btn.disabled = false;
  }
}

// ── Intersection Observer: fade-in on scroll ────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.12 });

document.querySelectorAll('.menu-section, .about, .testimonials, .reserve-section').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});

// Add in-view style once
const style = document.createElement('style');
style.textContent = '.in-view { opacity: 1 !important; transform: none !important; }';
document.head.appendChild(style);
