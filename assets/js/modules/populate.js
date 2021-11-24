const url = `https://gh-trending-api.herokuapp.com/repositories`
const changeFilter = document.getElementById("changePopular")
const populateModal = document.getElementById('populateModal');
const filterForm = document.getElementById('changeFilter');
const closeFilter = document.getElementById('closeFilter');
var trending = document.getElementById("popular");

// Main function to get trending API
export function getTrending(popularEl,time = "monthly",language = "") {
    let finalUrl = url + language + "?since=" + time
    console.log(finalUrl) 
    fetch(finalUrl)
        .then(response => response.json())
        .then(data => {
            popularEl.innerHTML = ""
            data.forEach(element => {
                let div = document.createElement("div")
                let h3 = document.createElement("h3")
                let a = document.createElement("a")
                div.setAttribute("class", "panel-child")
                h3.textContent = element.repositoryName
                a.textContent = "Visit this Repo"
                a.setAttribute("href", element.url)
                popularEl.appendChild(div)
                div.append(h3, a)

            });
        })
        .catch(ex => console.log("error")) 
}

changeFilter.addEventListener("click", openFilter)
closeFilter.addEventListener("click", close)
window.addEventListener('click', outsideClick)
filterForm.addEventListener("submit", getUserInput)

// Open change filter modal
function openFilter() {
    populateModal.style.display = "block"
}

// Close modal when X is clicked
function close() {
    populateModal.style.display = "none"
}

// Close modal when you click outside the modal
function outsideClick(event){
    if(event.target == populateModal){
        close();
    }
}

// Get user input from modal and pass it through the API call
function getUserInput(event) {
    let radioArray = document.querySelectorAll(".period")
    let time
    radioArray.forEach(radio => {
        if(radio.checked) {
            time = radio.getAttribute("id")
        }
    })
    let language = "/" + document.getElementById("language").value
    getTrending(trending,time,language)
    event.preventDefault()
    close()
}
