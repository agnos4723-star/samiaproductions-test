document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    alert('Merci pour votre message. Samia Productions vous répondra très vite.');
    form.reset();
  });
}