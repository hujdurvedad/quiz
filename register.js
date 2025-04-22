const registerBtn = document.querySelector(".register-btn");
registerBtn.addEventListener("click", registerUser);

const emailInput = document.getElementById("input1");
const passwordInput = document.getElementById("input2");
const userInput = document.getElementById("input5");

async function registerUser() {
    try {
        const response = await fetch(
            "https://quiz-be-zeta.vercel.app/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "email": emailInput.value,
                    "password": passwordInput.value,
                    "username": userInput.value,
                }),
            }
        );
        const data = await response.json();
        if(data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        }
        else if(data.message) {
            alert(data.message);
        }
    } catch (error) {
        console.log(error);
    } finally {
        console.log("Finally");
    }
}