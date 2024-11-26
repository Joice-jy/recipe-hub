function goToPage(page){
    if(page){
        window.location.href=page;
    }else{
        console.errpr("Invalid page specified for navigation!");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("isLoggedIn")) {
        const currentPage = window.location.pathname.split("/").pop();
        if (currentPage !== "login.html" && currentPage !== "register.html") {
            goToPage("login.html");
        }
    }
    
    
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

        
            localStorage.setItem("user", JSON.stringify({ username, email, password }));
            localStorage.setItem("isLoggedIn", true);
            alert("Registration successful!");
            goToPage("home.html");
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = document.getElementById("login-username").value.trim();
            const password = document.getElementById("login-password").value;

            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (!storedUser || storedUser.username !== username || storedUser.password !== password) {
                alert("Invalid username or password!");
                return;
            }
            localStorage.setItem("isLoggedIn", true);
            alert("Login successful!");
            goToPage("home.html");
        });
    }
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", function () {
            localStorage.removeItem("isLoggedIn");
            alert("You have been logged out.");
            goToPage("login.html");
        });
    }

    const accountPage = document.querySelector(".account");
    if (accountPage) {
        console.log("Account page detected.");

        const storedUser = JSON.parse(localStorage.getItem("user"));
        console.log("Stored user data:", storedUser);

        if (!storedUser) {
            alert("No user data found. Please log in or register");
            goToPage("login.html");
            return;
        }

        document.getElementById("account-username").textContent = storedUser.username || "N/A";
        document.getElementById("account-email").textContent = storedUser.email || "N/A";
        document.getElementById("account-password").textContent = storedUser.password || "N/A";
    } else {
        console.error("Account page not detected.");
    }    
});

function submitContact(){
    {

        let name = document.getElementById("name").value;
        let subject = document.getElementById("subject").value;
        let message = document.getElementById("message").value;
        let contactmsg = document.getElementById("contactmsg");
    
        // Validate form inputs
        if (!name || !subject || !message) {
            contactmsg.innerHTML = "Please fill in all fields.";
            return;
        }
    
        //retrieve current data and add new message
        let contacts = getContacts();
        contacts.push(`${name}::${subject}::${message}`);//save the new contact as a delimited string
    
        //save updated array back to localStorage
        setContacts(contacts);
    
        contactmsg.innerHTML ="Message sent successfully!";
        document.getElementById("contactForm").reset();
    
    }
}
function displayInbox(){

    let inboxContainer = document.getElementById("inboxContainer");

    //retrieve messages from localStorage
    let contacts = getContacts();

    inboxContainer.innerHTML = "";
    
    if (contacts.length == 0) {
        inboxContainer.innerHTML = "<p>No messages found.</p>";
        return;
    }

    // Display messages in groups of three (name, subject, message)
    contacts.forEach((contact, index) => {
        let [name, subject, message] = contact.split("::"); // Split each record into fields


        // Create message card
        let messageCard = document.createElement("div");
        messageCard.classList.add("message-card");

        // Add name
        let nameElement = document.createElement("p");
        nameElement.innerHTML = `<strong>Name:</strong> ${name}`;
        messageCard.appendChild(nameElement);

        // Add subject
        let subjectElement = document.createElement("p");
        subjectElement.innerHTML = `<strong>Subject:</strong> ${subject}`;
        messageCard.appendChild(subjectElement);

         // Add message
         let messageElement = document.createElement("p");
         messageElement.textContent = message;
         messageCard.appendChild(messageElement);
 
         let deleteButton = document.createElement("button");
         deleteButton.textContent = "Delete";
         deleteButton.onclick = function(){
             deleteMessage(index);
         }
 
         messageCard.appendChild(deleteButton);
 
         // Append the card to the container
         inboxContainer.appendChild(messageCard);
     });
} 
    
function deleteMessage(index){

    let contacts = getContacts();//retrieve the contacts array
    contacts.splice(index, 1); // Remove the message at the given index
    setContacts(contacts); // Save the updated array back to localStorage
    displayInbox(); // Refresh the inbox display
}
 window.onload = function(){
    displayInbox();
}
