let form = document.getElementById('booking-form');
let popup = document.getElementById('popup');
let email = document.getElementById('email-input');
let district = document.getElementById('district-input');
let age = document.getElementById('age-input');

function togglePopup() {
    if (popup.style.display == 'block')
        popup.style.display = 'none';
    else
        popup.style.display = 'block';
    form.reset();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {
        'mail': email.value,
        'age': age.value,
        'code': district.value
    }
    axios.post('/submit', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            togglePopup();
        });
});