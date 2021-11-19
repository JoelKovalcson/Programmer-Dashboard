const url = `https://api.trending-github.com/github/repositories`
const changeFilter = document.getElementById("changePopular")
const populateModal = document.getElementById('populateModal');
const filterForm = document.getElementById('changeFilter');
const closeFilter = document.getElementById('closeFilter');
var trending = document.getElementById("popular");

export function getTrending(popularEl,time = "monthly") {
    let finalUrl = url + "?period=" + time 
    fetch(finalUrl)
        .then(response => response.json())
        .then(data => {
            popularEl.innerHTML = ""
            data.forEach(element => {
                let div = document.createElement("div")
                let h3 = document.createElement("h3")
                let a = document.createElement("a")
                div.setAttribute("class", "panel-child")
                h3.textContent = element.name
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

function openFilter() {
    populateModal.style.display = "block"
}

function close() {
    populateModal.style.display = "none"
}

function outsideClick(event){
    if(event.target == populateModal){
        close();
    }
}

function getUserInput(event) {
    let radioArray = document.querySelectorAll(".period")
    let time
    radioArray.forEach(radio => {
        if(radio.checked) {
            time = radio.getAttribute("id")
        }
    })
    getTrending(trending,time)
    event.preventDefault()
    close()
}