// Cache elements
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".sidebar a");
const sidebar = document.querySelector(".sidebar");

// IntersectionObserver for sidebar active link
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => link.classList.remove("active"));
                const activeLink = document.querySelector(`.sidebar a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add("active");
                sidebar.classList.add("active");
            }
        });
    },
    { threshold: 0.6 }
);

sections.forEach(section => observer.observe(section));

// Smooth scroll for sidebar links
navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

// Page load animations & typewriter
document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() => { sidebar.classList.add("slide-in"); });

    const text = "I’m Zach — Aspiring Data Analyst";
    const typeContent = document.getElementById("type-content");
    const cursor = document.getElementById("cursor");
    let index = 0;

    function type() {
        if (index < text.length) {
            typeContent.innerHTML += text[index];
            index++;
            setTimeout(type, 150);
        } else {
            cursor.classList.add("blink");
        }
    }

    type();
});
