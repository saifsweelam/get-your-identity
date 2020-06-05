// This script uses AJAX requests to get data from 4 APIs and display it to the user
// JokeAPI (https://sv443.net/jokeapi/v2/)
// Genderize API (https://genderize.io/)
// Agify API (https://agify.io/)
// Random User API (https://randomuser.me/)

const formHTML = `
<form class="mt-5 pt-5">
    <input type="text" name="name" id="name" placeholder="Enter Your First Name"
        class="w-50 d-block m-auto p-2">
    <input type="submit" value="Guess" class="d-block ml-auto mr-auto btn btn-white btn-light mt-4 w-50">
</form>
`

const funnyFacts = [
    'Has a lot of friends from the opposite sex',
    'As lazy as a lobster',
    'Eats all the time',
    'Loves to hug people',
    'Good at sports',
    'Never spoke to someone from the opposite sex',
    'Doesn\'t stop laughing',
    'Has a lot of money',
    'Spends a lot of money',
    'Unlucky',
    'Never leaves home'
]


function getForm() {
    document.querySelector('#content').innerHTML = formHTML;
    document.forms.item(0).addEventListener('submit', formCallback)
}

function generateJoke() {
    $.ajax({
        url: 'https://sv443.net/jokeapi/v2/joke/Any?format=txt',
        success: function (joke) {
            const jokeSection = document.querySelector('#joke');
            jokeSection.querySelector('p').textContent = joke;
            jokeSection.style.display = 'block';
            animateCSS(jokeSection, 'backInLeft')
        }
    })
}

function animateCSS(node, animation, prefix = 'animate__') {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd() {
            node.classList.remove(`${prefix}animated`, animationName);
            node.removeEventListener('animationend', handleAnimationEnd);

            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd);
    });
}


function formCallback(e) {
    e.preventDefault();
    const name = document.querySelector('#name').value.split(' ')[0];


    const getGender = new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.genderize.io/?name=${name}`,
            success: resolve
        })
    });
    const getAge = new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.agify.io/?name=${name}`,
            success: resolve
        })
    })


    Promise.all([getGender, getAge]).then(([{ gender }, { name, age }]) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://randomuser.me/api/?gender=${gender}`,
                success: (user) => {
                    let image = user.results[0].picture.large;
                    let country = user.results[0].location.country;
                    resolve({ name: name, age: age, gender: gender, image: image, country: country })
                }
            })
        })
    }).then(result => {
        let fact = funnyFacts[Math.floor(Math.random() * funnyFacts.length)];
        document.querySelector('#content').innerHTML = `
        <div class="d-flex text-center align-items-center">
            <div class="h4 w-50">
                <h3 class="mb-3">Magic Done</h3>
                <div class="h4 p-4"><span style="font-weight: bold;">Name: </span>${result.name}</div>
                <div class="h4 p-4"><span style="font-weight: bold;">Gender: </span>${result.gender}</div>
                <div class="h4 p-4"><span style="font-weight: bold;">Age: </span>${result.age}</div>
                <div class="h4 p-4"><span style="font-weight: bold;">Country: </span>${result.country}</div>
            </div>
            <div class="w-50">
                <img src="${result.image}" alt="A randomly requested image." id="person-img">
            </div>
        </div>
        <div class="h4 p-4 text-center"><span style="font-weight: bold;">Fact: </span>${fact}</div>
        <button class="d-block ml-auto mr-auto btn btn-white btn-light mt-4 w-50" onclick="getForm();">Try Again</button>
        `
    })
}



getForm();
generateJoke();
setInterval(() => { generateJoke(); }, 50000);