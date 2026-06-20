const form = document.querySelector("#contactForm");

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const message = document.querySelector("#message").value;

    if(name==="" || email==="" || message===""){

        alert("Please fill all fields");

        return;
    }

    alert("Message Sent Successfully!");

    form.reset();

});


// Dark Mode

const themeBtn = document.querySelector("#themeBtn");

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

    }
    else{

        localStorage.setItem("theme","light");

    }

});