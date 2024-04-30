const mode = 0;

const host_local = "http://localhost:8080";
const host_remote = "https://test3-latest-dvq2.onrender.com";

function getHost() {
    return (mode == 0) ? host_local : host_remote;
}

function isLoggedIn() {
    if(localStorage.getItem("token")) {
        return true;
    } else {
        return false;
    }
}

function getTheToken() {
    return localStorage.getItem("token");
} 

function saveTheToken(token) {
     localStorage.setItem("token", token);
     updateTheNavigationBar();
} 

function removeTheToken() {
    localStorage.removeItem("token");
    updateTheNavigationBar();
} 

let configuration = {
    isLoggedIn: () => isLoggedIn(), 
    host: () => getHost(), 
    token: () => getTheToken()    
};

updateTheNavigationBar();
updateCartItemCount();

async function updateCartItemCount() {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    document.getElementById("cartItemCount").textContent = basket.length;
}

async function updateTheNavigationBar() {
    const navigation = document.getElementsByClassName("topnav")[0];
    let loginTag = navigation.children[navigation.children.length - 1];
    if(configuration.isLoggedIn()) {
        loginTag.innerHTML = 
        `<li class="right"><a  href="#" onclick="logout()">Logout</a></li>`;
    } else {
        loginTag.innerHTML = `<li class="right"><a  href="login.html">Login</a></li>`;
    }
}



async function signup() {
    let email = document.getElementById("signup-email").value;
    let username = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-password").value;
    let customer = {email:email, username: username, password: password}
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
      };
      try {
        let response = await fetch(getHost() + "/signup", request);
        if(response.status == 200) {  
            alert("The registration was successful!")
            location.href = "login.html";

        } else {
            console.log(`response status:${response.status}`);            
            alert("Something went wrong!");
        }
      }
      catch(error) {
        console.log(error);        
        alert("Something went wrong!");
      }    
}

async function login() {    
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let customer = {username: username, password: password}
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
      };
      try {
        let response = await fetch(getHost() + "/login", request);
        if(response.status == 200) {  
            alert("The login was successful!");
            const token = await response.text();
            saveTheToken(token);            
            location.href = "index.html";
        } else {
            console.log(`response status:${response.status}`);   
            removeTheToken();         
            alert("Something went wrong!");
        }
      }
      catch(error) {
        console.log(error); 
        removeTheToken();       
        alert("Something went wrong!");
      }    
}

async function logout() {   
    removeTheToken();  
}

function addToBasket(flowerId) {
    // Find the flower by ID
    let flower = flowers.find(flower => flower.id === flowerId);
    if (!flower) {
        alert("Flower not found!");
        return;
    }

    // Add flower to basket
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    basket.push(flower);
    localStorage.setItem("basket", JSON.stringify(basket));

    // Redirect to Add to Basket page
    window.location.href = "add_to_basket.html";
}

function emptyBasket() {
    localStorage.removeItem("basket");
}
