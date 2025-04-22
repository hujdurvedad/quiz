const loginBtn = document.querySelector(".login-btn");
loginBtn.addEventListener("click", loginUser);

const emailInput = document.getElementById("input1");
const passwordInput = document.getElementById("input2");

async function loginUser() {
  try {
    const response = await fetch(
      "https://quiz-be-zeta.vercel.app/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": input1.value,
          "password": input2.value,
        }),
      }
    );
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    }
    else if (data.message) {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Finally");
  }
}