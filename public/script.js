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

// login func

async function Login() {
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

f5qfk;

async function Validate() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const logMessages = document.getElementById("log-messages");

  //

  if (!username || !password) {
    logMessages.innerHTML = "enter your username and password";
    return;
  }

  try {
    const response = await fetch("/Validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
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
