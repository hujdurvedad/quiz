const token = localStorage.getItem('token');
const authButtons = document.getElementById('authButtons');
const popup = document.getElementById('start-game-popup');
const popupContainer = document.getElementById('start-game-popup-container');

if (token) {
  const logoutButton = document.createElement('a');
  logoutButton.href = "#";
  logoutButton.innerHTML = `<button class="btn1">Odjavi se</button>`;

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    location.reload();
  });

  authButtons.appendChild(logoutButton);
} else {
  const buttonsHTML = `
      <a href="./login.html">
        <button class="btn1">Prijavi se</button>
      </a>
      <a href="./register.html">
        <button class="btn2">Registruj se</button>
      </a>
    `;

  authButtons.innerHTML = buttonsHTML;
}

function startQuiz() {
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.overflow = 'hidden';
  document.body.style.width = '100%';
  
  popup.classList.add("start-game-popup-active");
  popupContainer.classList.add("start-game-popup-container-active");
  page.style.pointerEvents = 'none';
  page.style.filter = 'blur(0.4rem)';
}

function cancelStart() {
  const scrollY = Math.abs(parseInt(document.body.style.top || '0'));
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.overflow = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);
  
  popup.classList.remove("start-game-popup-active");
  popupContainer.classList.remove("start-game-popup-container-active");
  page.style.pointerEvents = 'all';
  page.style.filter = 'blur(0)';
}