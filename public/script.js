
// login func

async function Login(){
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const logMessages = document.getElementById("log-messages");

  

  //

  if (!username || !password) {
    logMessages.innerHTML = "enter your username and password";
    return;
  }

  try {
    const response = await fetch("/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }), //convertir json en string
    });
    const result = await response.text();
    logMessages.innerHTML = result;

    if (response.ok) {
      document.getElementById("login-username").value = "";
      document.getElementById("login-password").value = "";
    }
  } catch (error) {
    logMessages.innerHTML = "erreur  " + error.message;
  }
}