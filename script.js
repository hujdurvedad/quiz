const token = localStorage.getItem('token');

const authButtons = document.getElementById('authButtons');

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