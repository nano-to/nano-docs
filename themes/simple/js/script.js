window.createQuickLinks = function() {

    var nav = document.getElementById("nav")
    var items = document.querySelectorAll("h2")

    if (items.length <= 2) return

    items.forEach((el) => {
        if (el.id && !el.innerText.includes('Sponsor')) nav.innerHTML += `<li><a class="in-this-page" href="#${el.id}">${el.innerText.replace('❯', '').trim()}</a></li>`
    })

    nav.style.display = 'block'
    // document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll("#nav a");

    function onScroll() {
        const scrollPosition = window.scrollY;

        navLinks.forEach(link => {
            const sectionId = link.getAttribute("href").substring(1);
            const section = document.getElementById(sectionId);
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Add a buffer zone of 100 pixels above and below each section
            const buffer = 100;

            if (
                scrollPosition >= sectionTop - buffer &&
                scrollPosition < sectionTop + sectionHeight + buffer
            ) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    window.addEventListener("scroll", onScroll);
    // });
}

window.toggleDarkMode = function() {
    if (document.documentElement.classList.contains('dark')) {
        localStorage.removeItem('dark-mode')
        document.documentElement.classList.remove("dark")
    } else {
        localStorage.setItem('dark-mode', true)
        document.documentElement.className += ' dark'
    }
}

createQuickLinks()

window.hljs.highlightAll();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
})

document.querySelectorAll('h2').forEach(title => {
    title.addEventListener('click', function (e) {
        e.preventDefault();
        navigator.clipboard.writeText(`${window.location.href.split('#')[0]}#${title.id}`).then(function() {
        }, function() {
            document.execCommand("copy");
            history.pushState(null, null, '#' + title.id);
        })
    });
})