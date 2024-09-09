
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

     fetchActivities();