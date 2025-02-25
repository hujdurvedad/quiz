const btn = document.getElementById("btn");
btn.addEventListener("click", getUsers);

async function getUsers() {
    const token = localStorage.getItem("token");
    console.log(token);
    try {
        const response = await fetch(
            "https://0c6e-77-239-14-36.ngrok-free.app/users",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    } finally {
        console.log("finally");
    }
}