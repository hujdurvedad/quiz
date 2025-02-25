const registerBtn = document.querySelector(".register-btn");
registerBtn.addEventListener("click", registerUser);

const emailInput = document.getElementById("input1");
const passwordInput = document.getElementById("input2");
const firstNameInput = document.getElementById("input3");
const lNameInput = document.getElementById("input4");
const userInput = document.getElementById("input5");

async function registerUser() {
    try {
        const response = await fetch(
            "https://0c6e-77-239-14-36.ngrok-free.app/users",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "email": emailInput.value,
                    "password": passwordInput.value,
                    "firstName": firstNameInput.value,
                    "lastName": lNameInput.value,
                    "username": userInput.value,
                }),
            }
        );
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    } finally {
        console.log("Finally");
    }
}