// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem("darkMode");

const darkModeToggle = document.querySelector(".dark-mode-toggle");

const enableDarkMode = () => {
  // 1. Add the class to the body
  document.body.classList.add("darkmode");
  // 2. Update darkMode in localStorage
  localStorage.setItem("darkMode", "enabled");
};

const disableDarkMode = () => {
  // 1. Remove the class from the body
  document.body.classList.remove("darkmode");
  // 2. Update darkMode in localStorage
  localStorage.setItem("darkMode", null);
};

// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === "enabled") {
  enableDarkMode();
}

// When someone clicks the button
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    // get their darkMode setting
    darkMode = localStorage.getItem("darkMode");

    // if it not current enabled, enable it
    if (darkMode !== "enabled") {
      enableDarkMode();
      // if it has been enabled, turn it off
    } else {
      disableDarkMode();
    }
  });
}

const logoutPopUp = document.querySelector(".logout-pop-up");
if (logoutPopUp) {
  setTimeout(() => {
    logoutPopUp.style.display = "none";
  }, 2000);
}

let btn = document.querySelectorAll(".mouse-cursor-gradient-tracking");
btn.forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    item.style.setProperty("--x", x + "px");
    item.style.setProperty("--y", y + "px");
  });
});

// function processForm(e) {
//   if (e.preventDefault) e.preventDefault();
//   const searchContainer = document.createElement("div");
//   searchContainer.innerHTML = "CLICK ME";
//   searchContainer.classList.add("searchContainer");
//   const searchContainerRoot = document.querySelector(".searchContainer__root");
//   searchContainerRoot.appendChild(searchContainer);
//   /* do what you want with the form */

//   // You must return false to prevent the default form behavior
//   return false;
// }

// var form = document.querySelector('.search');
// if(form){
//   if (form.attachEvent) {
//     form.attachEvent("submit", processForm);
//   } else {
//     form.addEventListener("submit", processForm);
//   }
// }

//get posts data from express server

const getPostData = async () => {
  let response = await fetch("/getData");
  let responseJson = await response.json();
  return responseJson;
};

const populateFilters = async () => {
  const data = await getPostData();
  displayResults(data);
  let tags = [];
  let keywords = [];
  let totalStars = [];
  let authors = [];
  const dataMining = data.map((post) => {
    tags.push(...post.tags);
    keywords.push(...post.keywords);
    totalStars.push(post.totalStars);
    authors.push(post.author.username);
  });

  tags = [...new Set(tags)];
  keywords = [...new Set(keywords)];
  totalStars = [...new Set(totalStars)];
  totalStars = totalStars.sort();

  authors = [...new Set(authors)];
  displayFilters(tags, "tags");
  displayFilters(keywords, "keywords");
  displayFilters(authors, "authors");
  displayFilters(totalStars, "stars", true);
  activeFilterBtns(data);
};

const displayFilters = (data, element, displayStars = false) => {
  const root = document.querySelector(`.${element}`);
  if (!root) {
    return;
  }
  const header = element.toUpperCase();
  root.innerHTML += `<h4>${header}</h4>`;

  for (item of data) {
    const element = document.createElement("div");
    if (displayStars) {
      let starCode = "&#9733";
      const starsPlusOne = item + 1;
      const starsamount = starCode.repeat(item);
      element.innerHTML += `<button stars=${item} class="tag-light filter-btns">${starsamount}</button>`;
      root.appendChild(element);
    } else {
      element.innerHTML += `<button class="tag-light filter-btns">${item}</button>`;
      root.appendChild(element);
    }
  }
};

const activeFilterBtns = (data) => {
  const filterBtns = document.querySelectorAll(".filter-btns");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("clicked");
      const selectedFilters = document.querySelectorAll(".clicked");
      showFilteredResults(selectedFilters, data);
    });
  });
};

const displayResults = (dataObj) => {
  const root = document.querySelector(`.searchContainer__root`);
  root.innerHTML = "";
  if (!dataObj.length) {
    return (root.innerHTML = "<h4>Your result yielded no results</h4>");
  }
  dataObj.forEach((post) => {
    const { _id: id, title, image, caption: text } = post;
    const author = post.author.username;
    const authorId = post.author._id;
    const element = document.createElement("div");
    element.classList.add("card");
    element.innerHTML += `
  <h2>
    <a href="/posts/${id}">${title}</a>
  </h2>
  <h3>
    <a href="/authors/${authorId}"
      >Written by ${author}</a
    >
  </h3>
  <a href="/posts/${id}">
  <img src="${image}" alt="" />
  </a>
  <p>
    <a href="/posts/${id}" class="truncate-text-multiline"
      >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque nostrum error sapiente impedit facere tenetur aut unde voluptate, assumenda nam, doloribus optio perspiciatis blanditiis. Impedit molestias iure asperiores deleniti commodi rem cumque architecto inventore enim beatae iusto pariatur, non praesentium aliquid veritatis voluptatem? Autem dicta soluta aut commodi nesciunt et.</a
    >
  </p>`;
    root.appendChild(element);
  });
};

const showFilteredResults = (filterButtons, data) => {
  //show all posts
  // displayResults(data);

  //Get all the values from the filter
  const filteredBtnsArray = [];
  filterButtons.forEach((button) => {
    let stars = Number(button.getAttribute("stars"));
    return stars
      ? filteredBtnsArray.push(stars)
      : filteredBtnsArray.push(button.innerHTML);
  });

  //for every category of filters, filter the data
  // for every post, if you can find the button in tags or keywords or author give it back
  const newData = data.filter((post) => {
    //check for every post if all of the filter buttons exist in the post.tags or post.keywords arrays
    //make a list of all the tags, keywords and authors
    const searchList = [
      ...post.tags,
      ...post.keywords,
      post.author.username,
      post.totalStars,
    ];

    //if all of the filters exist in that list, return the post
    const allfiltersApply = filteredBtnsArray.every((filter) => {
      return searchList.includes(filter);
    });
    return allfiltersApply;
  });

  displayResults(newData);
};

const init = async () => {
  await populateFilters();
};

init();

// variables
var input = document.querySelector(".search__input");
var people = ["john doe", "maria", "paul", "george", "jimmy"];
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

// // events
// input.onkeyup = function (e) {
//   input_val = this.value; // updates the variable on each ocurrence

//   if (input_val.length > 0) {
//     var people_to_show = [];

//     autocomplete_results = document.querySelector(".searchContainer__root");
//     autocomplete_results.innerHTML = "";
//     people_to_show = autocomplete(input_val);

//     for (i = 0; i < people_to_show.length; i++) {
//       autocomplete_results.innerHTML +=
//         '<li><a href="http://www.bbc.co.uk/">' +
//         people_to_show[i] +
//         "</a></li>";
//     }
//     autocomplete_results.style.display = "block";
//   } else {
//     people_to_show = [];
//     autocomplete_results.innerHTML = "";
//   }
// };

// const range = document.getElementById("range");

// // https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
// const scale = (num, in_min, in_max, out_min, out_max) => {
//   return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
// };

// if(range){
//   range.addEventListener("input", (e) => {
//     const value = +e.target.value;
//     const label = e.target.nextElementSibling;
//     const rangeWidth = getComputedStyle(e.target).getPropertyValue("width");
//     const labelWidth = getComputedStyle(label).getPropertyValue("width");
//     // remove px
//     const numWidth = +rangeWidth.substring(0, rangeWidth.length - 2);
//     const numLabelWidth = +labelWidth.substring(0, labelWidth.length - 2);
//     const max = +e.target.max;
//     const min = +e.target.min;
//     const left =
//       value * (numWidth / max) -
//       numLabelWidth / 2 +
//       scale(value, min, max, 10, -10);
//     label.style.left = `${left}px`;
//     label.innerHTML = value;
//   });
// }

var acc = document.querySelectorAll(".search-accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "grid") {
      panel.style.display = "none";
    } else {
      panel.style.display = "grid";
    }
  });
}
