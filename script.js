
let menuBtn = document.querySelector('#menu-btn');
let navbar = document.querySelector('.header .flex .navbar');

menuBtn.onclick = () =>{
    menuBtn.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

var swiper = new Swiper(".course-slider", {
    spaceBetween: 20,
    grabCursor:true,
    loop:true,
    pagination:{
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        540: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

var swiper = new Swiper(".reviews-slider", {
    spaceBetween: 20,
    grabCursor: true,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        540: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});
document.addEventListener("DOMContentLoaded", () => {
    const userForm = document.getElementById("user-form");
    let isEditing = false;
    let editingId = null;
    userForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        let fullName = document.getElementById("fullName").value;
        let email = document.getElementById("email").value;
        let number = document.getElementById("number").value;
        let selectedCourse = document.querySelector('select[name="courses"]').value;
        let gender = document.querySelector('input[name="gender"]:checked').value;


        let userInfo = {
            id: editingId,
            FullName: fullName,
            Email: email,
            Number: number,
            Courses: selectedCourse,
            Gender: gender
        };

        let method = isEditing ? 'PUT' : 'POST';
        let response = await fetch('/userInfo', {
            method: method,
            headers: {
                'content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        });
        let text = await response.text();
        alert(text);

        // Reset isEditing flag and editingId variable
        isEditing = false;
        editingId = null;
    
    });
});


async function getData() {
    console.log('getData function called');
    // Fetch data from server
    let response = await fetch('/userInfo');
    let data = await response.json();
    console.log(data);

    // Create table
    let table = document.createElement("table");
    let headers = ["FullName", "Email", "Number", "Courses", "Gender", "Actions"];
    let headerRow = document.createElement("tr");
    headers.forEach(header => {
        let th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    // Add items from data to table
    data.forEach((item, index) => {
        let values = [item.FullName, item.Email, item.Number, item.Courses, item.Gender];
        let valueRow = document.createElement("tr");
        valueRow.setAttribute('id', `row-${index}`);
        values.forEach(value => {
            let td = document.createElement("td");
            td.textContent = value;
            valueRow.appendChild(td);
        });

        // Add edit button
        let actionsTd = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", (event) => {
            event.preventDefault();
            // Load data into form
            document.getElementById("fullName").value = item.FullName;
            document.getElementById("email").value = item.Email;
            document.getElementById("number").value = item.Number;
            document.querySelector('select[name="courses"]').value = item.Courses;
            document.querySelector(`input[name="gender"][value="${item.Gender}"]`).checked = true;
            // Show save-changes button
            document.getElementById("save-changes").style.display = 'block';

            // Set isEditing flag to true
            isEditing = true;
            editingId = item.id;
        });
        
        actionsTd.appendChild(editButton);

        valueRow.appendChild(actionsTd);

        table.appendChild(valueRow);
    });
    


    // Append table to page
    let dataTableElement = document.getElementById("data-table");
    if (dataTableElement){
        dataTableElement.innerHTML = '';
        dataTableElement.appendChild(table);

        let loadDataButton = document.getElementById("load-data");
        loadDataButton.style.display = 'none';
        document.getElementById("save-changes").style.display = 'block';
    } else {
        console.log('data-table element not found');
    }
}
document.getElementById("load-data").addEventListener("click", getData);

let userForm = document.getElementById("user-form");
userForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get form data
    let formData = new FormData(userForm);
    let data = {
        FullName: formData.get("name"),
        Email: formData.get("email"),
        Number: formData.get("number"),
        Courses: formData.get("courses"),
        Gender: formData.get("gender"),
    };

    // Send POST request to server with form data
    await fetch("/userInfo", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // Hide submit button
    let submitButton = document.getElementById("submit");
    submitButton.style.display = 'none';

    // Show load-data button
    let loadDataButton = document.getElementById("load-data");
    loadDataButton.style.display = 'block';
    getData();
});
let saveChangesButton = document.getElementById("save-changes");
saveChangesButton.addEventListener("click", async function () {
    console.log('Save Changes button clicked');
    // Get form data
    let fullName = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let number = document.getElementById("number").value;
    let selectedCourse = document.querySelector('select[name="courses"]').value;
    let gender = document.querySelector('input[name="gender"]:checked').value;

    let userInfo = {
        FullName: fullName,
        Email: email,
        Number: number,
        Courses: selectedCourse,
        Gender: gender
    };

    // Send PUT request to server with form data
    await fetch("/userInfo", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    });

    // Reload table data
    getData();
});
