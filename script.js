function goToPage(page) {
    if (page) {
        window.location.href = page;
    } else {
        console.error("Invalid page specified for navigation!");
    }
}

function goToLogin() {
    window.location.href = "login.html";
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

            if (!username || !email || !password || !confirmPassword) {
                alert("All fields are required!");
                return;
            }
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            localStorage.setItem("user", JSON.stringify({ username, email, password }));
            localStorage.setItem("isLoggedIn", true);
            alert("Registration successful!");
            goToPage("index.html");
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
            goToPage("index.html");
        });
    }

    const passwordForm = document.getElementById("password-verification-form");
    const accountDetails = document.getElementById("account-details");

    if (passwordForm) {
        passwordForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const inputPassword = document.getElementById("verification-password").value.trim();
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (!storedUser) {
                alert("No user data found. Please log in or register.");
                goToPage("login.html");
                return;
            }

            if (inputPassword === storedUser.password) {
                document.getElementById("account-username").textContent = storedUser.username || "N/A";
                document.getElementById("account-email").textContent = storedUser.email || "N/A";
                document.getElementById("account-password").textContent = storedUser.password || "N/A";

                accountDetails.style.display = "block";
                passwordForm.style.display = "none";
            } else {
                alert("Incorrect password. Please try again.");
            }
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
});



//save data as a string with encoded values 
function setContacts(contacts){
    localStorage.setItem("contacts", contacts.join("||"));
}

//retrieve records and split them back into an array 
function getContacts(){
    let storedContacts = localStorage.getItem("contacts");
    return storedContacts ? storedContacts.split("||"):[];
}

//save data as a string with encoded values 
function setContacts(contacts){
    localStorage.setItem("contacts", contacts.join("||"));
}

//retrieve records and split them back into an array 
function getContacts(){
    let storedContacts = localStorage.getItem("contacts");
    return storedContacts ? storedContacts.split("||"):[];
}

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

function submitRecipes(){

    
        let recipemsg = document.getElementById("recipemsg");
        //retrieve form inputs
        let recipeTitle = document.getElementById("recipeTitle").value;
        let userName = document.getElementById("userName").value;
        let ingredients = document.getElementById("ingredients").value;
        let instructions = document.getElementById("recipe").value;
        
        //validate inputs
        if (!recipeTitle || !userName || !ingredients || !instructions ||!uploadedImageBase64) {
            recipemsg.innerHTML = "Please fill in all fields and upload an image.";
            return;
        }
    
        
        //create a new recipe object 
        let newRecipe = {
            title:recipeTitle,
            username:userName,
            ingredients: ingredients,
            instructions : instructions,
            image: uploadedImageBase64, // use the uploaded base64 string 
        };
    
        //retrieve existing blogs or initialize an empty array 
        let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    
        //add the new blog to the blogs array
        recipes.push(newRecipe);
    
        // Save the updated array to localStorage
        localStorage.setItem("recipes", JSON.stringify(recipes));
    
        recipemsg.innerHTML ="Recipe submitted successfully!";
        document.getElementById("submitRecipesForm").reset();
        uploadedImageBase64 ="";
}
    function uploadImage(){
        let recipemsg = document.getElementById("recipemsg");
        let imageFile = document.getElementById("imageFile").files[0];
    
        if(!imageFile){
            recipemsg.innerHTML ="please select an image file to upload.";
            return;
        }
            //convert the image file to a base64 string 
            let reader = new FileReader();
            reader.onload = function (e) {
                uploadedImageBase64 = e.target.result;//store the bas64 string
                recipemsg.innerHTML ="Image uploaded successfully!";
    }
    reader.readAsDataURL(imageFile); // read the file
    }
    
    function displayRecipes(){
        let recipesContainer = document.getElementById("recipesContainer");
        let recipemsg = document.getElementById("recipemsg");
    
       if(!recipesContainer) return;
    
        let recipes = JSON.parse(localStorage.getItem("recipes"))||[];
    
        recipesContainer.innerHTML ="";
    
        console.log('[Recipes]', recipes);
    
        if (recipes.length ==0){
            recipesContainer.innerHTML = "No recipes posted. Submit your recipe!";
            return;
    
        }
        // Iterate through recipes and create elements
        recipes.forEach((recipe, index) => {
            // Create the recipe card container
            let recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
    
            // Create the content container
            let contentDiv = document.createElement("div");
            contentDiv.style.flex = "1";
    
            // Add title
            let recipeTitle = document.createElement("h3");
            recipeTitle.textContent = `Recipe ${index + 1}: ${recipe.title}`;
            contentDiv.appendChild(recipeTitle);

            // Add title
            let usernName = document.createElement("h4");
            userName.textContent = `Recipe ${index + 2}: ${recipe.username}`;
            contentDiv.appendChild(userName);
    
            // Add description
            let ingredients = document.createElement("p");
            ingredients.textContent = recipe.ingredients;
            contentDiv.appendChild(ingredients);
    
            // Create the image container
            let imageDiv = document.createElement("div");
            imageDiv.style.flex = "0 0 200px";
    
            // Add image
            let recipeImage = document.createElement("img");
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.title;
            imageDiv.appendChild(recipeImage);
    
            // Append content and image to the blog card
            blogCard.appendChild(contentDiv);
            blogCard.appendChild(imageDiv);
    
            // Append the blog card to the container
            recipesContainer.appendChild(recipeCard);
        });
    }

let uploadedImageBase64="";
function submitRecipes(){

    
        let recipemsg = document.getElementById("recipemsg");
        //retrieve form inputs
        let recipeTitle = document.getElementById("recipeTitle").value;
        let userName = document.getElementById("userName").value;
        let ingredients = document.getElementById("ingredients").value;
        let instructions = document.getElementById("recipe").value;
        
        //validate inputs
        if (!recipeTitle || !userName || !ingredients || !instructions ||!uploadedImageBase64) {
            recipemsg.innerHTML = "Please fill in all fields and upload an image.";
            return;
        }
    
        
        //create a new recipe object 
        let newRecipe = {
            title:recipeTitle,
            username:userName,
            ingredients: ingredients,
            instructions : instructions,
            image: uploadedImageBase64, // use the uploaded base64 string 
        };
    
        //retrieve existing blogs or initialize an empty array 
        let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    
        //add the new blog to the blogs array
        recipes.push(newRecipe);
    
        // Save the updated array to localStorage
        localStorage.setItem("recipes", JSON.stringify(recipes));
    
        recipemsg.innerHTML ="Recipe submitted successfully!";
        document.getElementById("submitRecipesForm").reset();
        uploadedImageBase64 ="";
}
    function uploadImage(){
        let recipemsg = document.getElementById("recipemsg");
        let imageFile = document.getElementById("imageFile").files[0];
    
        if(!imageFile){
            recipemsg.innerHTML ="please select an image file to upload.";
            return;
        }
            //convert the image file to a base64 string 
            let reader = new FileReader();
            reader.onload = function (e) {
                uploadedImageBase64 = e.target.result;//store the bas64 string
                recipemsg.innerHTML ="Image uploaded successfully!";
    }
    reader.readAsDataURL(imageFile); // read the file
    }
    
    function displayRecipes(){
        let recipesContainer = document.getElementById("recipesContainer");
        let recipemsg = document.getElementById("recipemsg");
    
       if(!recipesContainer) return;
    
        let recipes = JSON.parse(localStorage.getItem("recipes"))||[];
    
        recipesContainer.innerHTML ="";
    
        console.log('[Recipes]', recipes);
    
        if (recipes.length ==0){
            recipesContainer.innerHTML = "No recipes posted. Submit your recipe!";
            return;
    
        }
        // Iterate through recipes and create elements
        recipes.forEach((recipe, index) => {
            // Create the recipe card container
            let recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
    
            // Create the content container
            let contentDiv = document.createElement("div");
            contentDiv.style.flex = "1";
    
            // Add title
            let recipeTitle = document.createElement("h3");
            recipeTitle.textContent = `Recipe ${index + 1}: ${recipe.title}`;
            contentDiv.appendChild(recipeTitle);

            // Add title
            let usernName = document.createElement("h4");
            userName.textContent = `Recipe ${index + 2}: ${recipe.username}`;
            contentDiv.appendChild(userName);
    
            // Add description
            let ingredients = document.createElement("p");
            ingredients.textContent = recipe.ingredients;
            contentDiv.appendChild(ingredients);
    
            // Create the image container
            let imageDiv = document.createElement("div");
            imageDiv.style.flex = "0 0 200px";
    
            // Add image
            let recipeImage = document.createElement("img");
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.title;
            imageDiv.appendChild(recipeImage);
    
            // Append content and image to the blog card
            blogCard.appendChild(contentDiv);
            blogCard.appendChild(imageDiv);
    
            // Append the blog card to the container
            recipesContainer.appendChild(recipeCard);
        });
    }

//checks for recipe.html
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();
    //run recipes function if on page
    if (currentPage === "recipes.html") {
        recipes()
    }

    //get all checkboxes and allow only one or none to be selected
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', () => {
        if(checkbox.checked) {
            checkboxes.forEach(otherBoxes => {
                if(otherBoxes != checkbox) {
                    otherBoxes.checked = false;
                    recipes();
                }
            })
        } else {
            checkboxes.forEach(otherBoxes => {
                otherBoxes.checked = false;
                recipes();
            })
        }
    }))
})

//Recipes function
function recipes() {
    //get box thats checked
    const checkbox = document.querySelector('input[type=checkbox]:checked')

    //if NO boxes are checked that set ALL to flex
    if(!checkbox) {
        document.querySelectorAll('.recipe-card').forEach(recipeCard => {
            recipeCard.style.display = 'flex';
        })
    //if ONE set ALL boxes to none
    } else {
        document.querySelectorAll('.recipe-card').forEach(recipeCard => {
            recipeCard.style.display = 'none';
        })
    }

    //whatever box is checked set corrisponding data attribute to flex
    if(checkbox == document.getElementById('breakfast')) {
        document.querySelectorAll('[meal-type="breakfast"]').forEach(meal => {
            meal.style.display = 'flex';
        });
    } else if(checkbox == document.getElementById('lunch')) {
        document.querySelectorAll('[meal-type="lunch"]').forEach(meal => {
            meal.style.display = 'flex';
        });
    }  else if(checkbox == document.getElementById('dinner')) {
        document.querySelectorAll('[meal-type="dinner"]').forEach(meal => {
            meal.style.display = 'flex';
        });
    }  else if(checkbox == document.getElementById('dessert')) {
        document.querySelectorAll('[meal-type="dessert"]').forEach(meal => {
            meal.style.display = 'flex';
        })
    } else if(checkbox == document.getElementById('snacks')) {
        document.querySelectorAll('[meal-type="snacks"]').forEach(meal => {
            meal.style.display = 'flex';
        });
    }
}
