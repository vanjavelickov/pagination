let prevButton = document.getElementById('prev');
let nextButton = document.getElementById('next');
let numberFrom = document.getElementById('numberFrom');
let numberTo = document.getElementById('numberTo');

window.onload = openPage;

window.addEventListener('scroll', handler);

function handler() {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        let params = {
            page: parseInt(numberFrom.innerHTML) + 1,
            limit: numberTo.innerHTML
        }
        getUsers(params);
    }
}

// nextButton.addEventListener('click', () => {
//     let params = {
//         page: parseInt(numberFrom.innerHTML) + 1,
//         limit: numberTo.innerHTML,
//     };
//     getUsers(params);
// });


function openPage() {
    let params = {
        page: "1",
        limit: "10"
    };

    let url = new URL(window.location.href);
    updateNewValues(url, 'page', params);
    updateNewValues(url, 'limit', params);
    const maxPage = params.page;
    for (let index = 1; index <= maxPage; index++) {
        params.page = index;
        getUsers(params);
    }

}

function updateNewValues(url, name, params) {
    let newValue = url.searchParams.get(name);
    if (newValue && newValue > 0) {
        params[name] = newValue;
    }
}

function updateMyUrl(params, response) {
    var myURL = document.location.pathname;
    if (!response.hasMore) {
        window.removeEventListener('scroll', handler);
    }
    window.history.pushState(null, "Title", myURL + `?page=${params.page}&limit=${params.limit}`);

}

function getUsers(params) {
    fetch(`http://localhost:3001/api/users?page=${params.page}&limit=${params.limit}`)
        .then(response => {
            if (response.status !== 200) {
                users.innerHTML = 'No results'
                return;
            }
            response.json().then(response => {
                showUsers(response);
                updateMyUrl(params, response);
                updateButtons(params, response);
            });
        })
        .catch(err => {
            console.log('Error:', err);
        });
}

function showUsers(data) {
    let users = document.getElementById('users');
    // users.innerHTML = '';
    data.results.forEach(element => {
        let id = document.createElement('div');
        let name = document.createElement('div');
        let address = document.createElement('div');
        let company = document.createElement('div');
        let country = document.createElement('div');
        let email = document.createElement('div');
        users.appendChild(id);
        users.appendChild(name);
        users.appendChild(address);
        users.appendChild(company);
        users.appendChild(country);
        id.innerHTML = element.id;
        name.innerHTML = element.name;
        address.innerHTML = element.address;
        company.innerHTML = element.company;
        country.innerHTML = element.country;
        email.innerHTML = element.email;
    });
}



function updateButtons(params, data) {
    numberFrom.innerHTML = params.page;
    numberTo.innerHTML = params.limit;
    // prevButton.disabled = params.page == 1;
    nextButton.disabled = !data.hasMore;
}