async function SignUp() {
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const telephone = document.getElementById("telephone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;
  const logMessages = document.getElementById("log-messages");

  
  if (password !== confirmPassword) {
    logMessages.innerHTML = "Les mots de passe ne correspondent pas.";
    return;
  }

  if (password.length < 8) {
    logMessages.innerHTML =
      "Le mot de passe doit contenir au moins 8 caractères.";
    return;
  }

  try {
    const response = await fetch("/SignUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, telephone, email, password }),
    });

   // const result = await response.text();
  //  logMessages.innerHTML = result;

    if (response.ok) {
     
      alert("Inscription réussie!");

 
      window.location.href = "login.html";
    }
  } catch (error) {
    logMessages.innerHTML = "Erreur: " + error.message;
  }
}



async function register() {
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const telephone = document.getElementById("telephone").value;
  const email = document.getElementById("email").value;
  const mdp = document.getElementById("mdp").value;
  const logMessages = document.getElementById("log-messages");

  if (!nom || !prenom || !telephone || !email || !mdp) {
    logMessages.innerHTML = "Veuillez remplir tous les champs.";
    return;
  }

  try {
    const response = await fetch("/Register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, telephone, email, mdp }),
    });

    const result = await response.text();
    logMessages.innerHTML = result;

    if (response.ok) {
      // Optionally clear form fields
      document.getElementById("nom").value = "";
      document.getElementById("prenom").value = "";
      document.getElementById("telephone").value = "";
      document.getElementById("email").value = "";
      document.getElementById("mdp").value = "";
    }
  } catch (error) {
    logMessages.innerHTML = "Erreur: " + error.message;
  }
}



async function Login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const logMessages = document.getElementById("log-messages");

  //

  if (!email || !password) {
    logMessages.innerHTML = "enter your email and password";
    return;
  }

  try {
    const response = await fetch("/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), //convertir json en string
    });
    const result = await response.text();
    logMessages.innerHTML = result;

    if (response.ok) {
      document.getElementById("login-email").value = "";
      document.getElementById("login-password").value = "";
    }
  } catch (error) {
    logMessages.innerHTML = "erreur  " + error.message;
  }
}

async function Validate() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const logMessages = document.getElementById("log-messages");
  if (!email || !password) {
    logMessages.innerHTML = "enter your email and password";
    return;
  }

  try {
    const response = await fetch("/Validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.text();

    if (response.ok) {
      alert("conexion réussie");
      document.getElementById("login-email").value = "";
      document.getElementById("login-password").value = "";
      setTimeout(() => {
        window.location.href = "Accueil.html";
      }, 500);
    }
  } catch (error) {
    logMessages.innerHTML = "erreur  " + error.message;
  }
}


 function handleLogout() {
   console.log("Logout link clicked");

   fetch("/logout", {
     method: "POST",
     credentials: "include",
   })
     .then((response) => {
       if (response.ok) {
         console.log("Logout successful");
         alert("You have been logged out successfully.");
         window.location.href = "/Homepage";
       } else {
         return response.text().then((text) => {
           console.error("Logout failed:", text);
           alert(text);
         });
       }
     })
     .catch((error) => {
       console.error("Error during logout:", error);
       alert("An error occurred while logging out.");
     });
 }
