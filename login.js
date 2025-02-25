const loginBtn = document.querySelector(".login-btn");
loginBtn.addEventListener("click", loginUser);

const emailInput = document.getElementById("input1");
const passwordInput = document.getElementById("input2");

async function loginUser() {
    try {
      const response = await fetch(
        "https://0c6e-77-239-14-36.ngrok-free.app/login",
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
      localStorage.setItem("token", data.user.token)
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Finally");
    }
  }