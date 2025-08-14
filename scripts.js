// home page slide

/*document.getElementById("next").onclick= function(){
    let lists = document.querySelectorAll(".homepage-item");
    document.getElementById("slide").appendChild(lists[0]);
}

document.getElementById("prev").onclick= function(){
    let lists = document.querySelectorAll(".homepage-item");
    document.getElementById("slide").prepend(lists[lists.length - 1]);
}*/

/*function slideNext() {
    let lists = document.querySelectorAll(".homepage-item");
    document.getElementById("slide").appendChild(lists[0]);
}

// Automatisation avec un intervalle de 3 secondes (modifiable)
let interval = setInterval(slideNext, 5000);

// Optionnel : arrêter l'animation au survol et la reprendre au départ
document.getElementById("slide").addEventListener("mouseenter", () => clearInterval(interval));
document.getElementById("slide").addEventListener("mouseleave", () => interval = setInterval(slideNext, 5000));*/


const navLinks = document.querySelectorAll(".nav-item .nav-link");
const toggleMenu = document.querySelector("#menu-open-button");
const closeMenu = document.querySelector("#menu-close-button");

const navMenu = document.querySelector("#navmenu");




//const selectItems = document.querySelectorAll("ul li a")


toggleMenu.addEventListener("click",()=>{document.body.classList.toggle("toggle-menu");});
closeMenu.addEventListener("click",()=>toggleMenu.click());
navLinks.forEach(link=>{
    link.addEventListener("click", () =>toggleMenu.click() )
})


/*document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        console.log(targetId);
        const targetSection = document.querySelector(targetId);
        console.log(targetSection);

        /*targetSection.scrollIntoView({
            behavior: 'smooth'
        });*/

        
        /*document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to the clicked link
        this.classList.add('active');

        
        

    });
});*/

// Section budget
/*document.getElementById('downloadBtn').addEventListener('click', function() {
    const year = document.getElementById('year').value;
    const pdfUrl = `budgets/budget_${year}.pdf`;

    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `budget_${year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});*/


// Initialize Swiper

const swiper = new Swiper('.slader-wrapper', {
    loop: true,
    grabCursor: true,
    spaceBetween : 20,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable : true,
      dynamicBullets : true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // responsive pagination
    breakpoints: {
        0: {
            slidesPerView: 1
        }
        
        
    }
  

  });

  // news


// tableau village
document.querySelector('.toggle-btn').addEventListener('click', () => {
    const table = document.querySelector('.collapsible-table');
    table.classList.toggle('active');
});


 
// SMTP JS FORM

const form = document.querySelector('.contact-form');

function sendEmail(){
    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "communedaroulmouhty@gmail.com",
        Password : "CBE5537B2FDFD8FF8E9A746CC30A5F321FC9",
        To : 'communedaroulmouhty@gmail.com',
        From : "communedaroulmouhty@gmail.com",
        Subject : "object",
        Body : "Message"
    }).then(
      message => alert(message)
    );
    
    
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendEmail();
});

