function initCustomSelect(selectElement) {
    const customSelect = selectElement.nextElementSibling;
    const selectedDiv = customSelect.querySelector('.select-selected');
    const itemsDiv = customSelect.querySelector('.select-items');

    selectedDiv.innerHTML = selectElement.options[selectElement.selectedIndex].text;
    
    // Open/close logic
    selectedDiv.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAllSelect(this);
        itemsDiv.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
    });

    // Option selection logic
    itemsDiv.querySelectorAll('div').forEach(item => {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.innerHTML;
            
            // Update hidden select
            selectElement.value = value;
            
            // Update custom selected div
            selectedDiv.innerHTML = text;
            
            // Close dropdown and trigger change event for role logic
            itemsDiv.classList.add('select-hide');
            selectedDiv.classList.remove('select-arrow-active');
            
            // Manually trigger the onchange function (needed for role/stream logic)
            selectElement.onchange(); 
        });
    });
}

function closeAllSelect(elmnt) {
    document.querySelectorAll('.select-items').forEach(item => {
        if (item !== elmnt.nextElementSibling) {
            item.classList.add('select-hide');
        }
    });
    document.querySelectorAll('.select-selected').forEach(selected => {
        if (selected !== elmnt) {
            selected.classList.remove('select-arrow-active');
        }
    });
}

document.addEventListener('click', closeAllSelect);




function showRoleSpecificFields() {
    const role = document.getElementById('role').value;
    const teacherFields = document.querySelector('.teacher-fields');
    const studentFields = document.querySelector('.student-fields');
    const scienceFields = document.querySelector('.science-fields');

    teacherFields.style.display = 'none';
    studentFields.style.display = 'none';
    scienceFields.style.display = 'none';

    document.getElementById('teacher-code').removeAttribute('required');
    document.getElementById('grade').removeAttribute('required');
    document.getElementById('stream').removeAttribute('required');
    document.getElementById('science-option').removeAttribute('required');

    if (role === 'teacher') {
        teacherFields.style.display = 'block';
        document.getElementById('teacher-code').setAttribute('required', 'required');
    } else if (role === 'student') {
        studentFields.style.display = 'block';
        document.getElementById('grade').setAttribute('required', 'required');
        document.getElementById('stream').setAttribute('required', 'required');
        showScienceOption();
    }
}

function showScienceOption() {
    const stream = document.getElementById('stream').value;
    const scienceFields = document.querySelector('.science-fields');

    if (stream === 'science') {
        scienceFields.style.display = 'block';
        document.getElementById('science-option').setAttribute('required', 'required');
    } else {
        scienceFields.style.display = 'none';
        document.getElementById('science-option').removeAttribute('required');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Initialize all custom select components
    document.querySelectorAll('.hidden-select').forEach(initCustomSelect);
});


document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById('role').value;
    let payload = { name, email, password, role };

    if (role === 'teacher') {
        const teacherCode = document.getElementById('teacher-code').value.trim();
        payload.teacherCode = teacherCode;
    } else if (role === 'student') {
        const grade = document.getElementById('grade').value;
        const stream = document.getElementById('stream').value;
        
        payload.grade = grade;
        payload.stream = stream;

        if (stream === 'science') {
            const scienceOption = document.getElementById('science-option').value;
            payload.scienceOption = scienceOption;
        }
    }
    
    if (role === '') {
        alert("Please select your role.");
        return;
    }
    
    try {
        const res = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Signup failed");
            return;
        }

        alert("Account created successfully! You can now log in.");
        window.location.href = "login.html";

    } catch (error) {
        console.error(error);
        alert("Server error.");
    }
});