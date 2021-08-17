// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode'); 

const darkModeToggle = document.querySelector('.dark-mode-toggle');

const enableDarkMode = () => {
  // 1. Add the class to the body
  document.body.classList.add('darkmode');
  // 2. Update darkMode in localStorage
  localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
  // 1. Remove the class from the body
  document.body.classList.remove('darkmode');
  // 2. Update darkMode in localStorage 
  localStorage.setItem('darkMode', null);
}
 
// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === 'enabled') {
  enableDarkMode();
}

// When someone clicks the button
if(darkModeToggle){
  darkModeToggle.addEventListener('click', () => {
    // get their darkMode setting
    darkMode = localStorage.getItem('darkMode'); 
    
    // if it not current enabled, enable it
    if (darkMode !== 'enabled') {
      enableDarkMode();
    // if it has been enabled, turn it off  
    } else {  
      disableDarkMode(); 
    }
  });
}


const logoutPopUp = document.querySelector(".logout-pop-up");
if(logoutPopUp){
  setTimeout(() => {
    logoutPopUp.style.display = "none";
  }, 2000)
}

let btn = document.querySelectorAll('.mouse-cursor-gradient-tracking');
btn.forEach((item)=> {
  item.addEventListener('mousemove', e => {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    item.style.setProperty('--x', x + 'px');
    item.style.setProperty('--y', y + 'px');
  });
})

function processForm(e) {
  if (e.preventDefault) e.preventDefault();
  const searchContainer = document.createElement("div");  
  searchContainer.innerHTML = "CLICK ME"; 
  searchContainer.classList.add("searchContainer"); 
  const searchContainerRoot = document.querySelector(".searchContainer__root");             
  searchContainerRoot.appendChild(searchContainer); 
  /* do what you want with the form */

  // You must return false to prevent the default form behavior
  return false;
}

var form = document.querySelector('.search');
if (form.attachEvent) {
  form.attachEvent("submit", processForm);
} else {
  form.addEventListener("submit", processForm);
}

//get posts data from express server

const getPostData = async () => {
  let response = await fetch('/getData')
  let responseJson = await response.json()
  console.log(responseJson);
}

getPostData();

// variables
var input = document.querySelector('.search__input');
var people = ['john doe', 'maria', 'paul', 'george', 'jimmy'];
var results;

// functions
function autocomplete(val) {
  var people_return = [];

  for (i = 0; i < people.length; i++) {
    if (val === people[i].slice(0, val.length)) {
      people_return.push(people[i]);
    }
  }

  return people_return;
}

// events
input.onkeyup = function(e) {
  input_val = this.value; // updates the variable on each ocurrence

  if (input_val.length > 0) {
    var people_to_show = [];

    autocomplete_results = document.querySelector(".searchContainer__root");
    autocomplete_results.innerHTML = '';
    people_to_show = autocomplete(input_val);
    
    for (i = 0; i < people_to_show.length; i++) {
      autocomplete_results.innerHTML += '<li><a href="http://www.bbc.co.uk/">' + people_to_show[i] + '</a></li>';

    }
    autocomplete_results.style.display = 'block';
  } else {
    people_to_show = [];
    autocomplete_results.innerHTML = '';
  }
}