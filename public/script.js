const cardsData = [
  {
    photo: "danse.png",
    title: "Dance",
    description: "Express yourself with elegance and rhythm!",
  },
  {
    photo: "boxe.png",
    title: "Boxing",
    description: "Unleash your energy and gain strength!",
  },
  {
    photo: "cardio.png",
    title: "Cardio",
    description: "Boost your endurance and burn calories!",
  },
  {
    photo: "yoga.png",
    title: "Yoga",
    description: "Find balance and inner serenity!",
  },
  {
    photo: "musc.jpg",
    title: "Bodybuilding",
    description: "Strengthen your muscles and build power!",
  },
  {
    photo: "natation.png",
    title: "Swimming",
    description: "Enjoy full-body exercise with refreshing strokes!",
  },
];

const container = document.getElementById("card-container");

cardsData.forEach((card) => {
  const cardElement = document.createElement("div");
  cardElement.className = "lacarte";
  cardElement.innerHTML = `
   <div class="maincontainer" >
            <div class="thecard">
                   <div class="thefront" style="background-image: url('${card.photo}');">
                    </div>
                       <div class="theback">
                           <h2 class="nomsport">${card.title}</h2>
                           <p class="parasport">${card.description}</p>
                       </div>
                   
           </div>
        </div>

    `;
  container.appendChild(cardElement);
});


// sign up func

async function SignUp() {
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const telephone = document.getElementById("telephone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;
  const logMessages = document.getElementById("log-messages");

  // Validate passwords
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

    const result = await response.text();
    logMessages.innerHTML = result;

    if (response.ok) {
      // Show success alert
      alert("Inscription réussie!");

      // Redirect to login page
      window.location.href = "login.html";
    }
  } catch (error) {
    logMessages.innerHTML = "Erreur: " + error.message;
  }
}





// register func

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
















// login func

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

  //

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
    logMessages.innerHTML = result;

    if (response.ok) {
      document.getElementById("login-email").value = "";
      document.getElementById("login-password").value = "";
      window.location.href = "Accueil.html";
    }
  } catch (error) {
    logMessages.innerHTML = "erreur  " + error.message;
  }
}

async function fetchActivities() {
  try {
    const response = await fetch("/Activities");
    if (!response.ok) {
      throw new Error("Network res was not ok");
    }
    const Activities = await response.json();
    displayActivities(Activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
}

function displayActivities(Activities) {
  const container = document.getElementById("activity-container");
  container.innerHTML = Activities.map(
    (Activities) => `
                <div class="activity-card">
                    <img src="${activity.image_url}" alt="${activity.name}">
                    <h2>${activity.name}</h2>
                    <p>${activity.description}</p>
                </div>

            `
  ).join("");
}
container.appendChild(div);

fetchActivities();
displayActivities(activity - container);
