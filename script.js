// ============================================================
// Cache DOM elements up front — cheaper than querying repeatedly
// ============================================================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".sidebar-nav a");
const sidebar  = document.querySelector(".sidebar");

// ============================================================
// IntersectionObserver for sidebar active link
//
// Watches each section as it enters the viewport.
// When a section crosses the 50% threshold, its corresponding
// nav link gets the .active class (blue highlight in sidebar).
// ============================================================
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Get the id of the section that just became visible
            const id = entry.target.getAttribute("id");

            // Remove active from all links, then set it on the matching one
            navLinks.forEach(l => l.classList.remove("active"));
            const active = document.querySelector(`.sidebar-nav a[href="#${id}"]`);
            if (active) active.classList.add("active");
        });
    },
    { threshold: 0.5 }    // section must be 50% visible to trigger
);

// Attach the observer to every section on the page
sections.forEach(s => observer.observe(s));

// ============================================================
// Smooth scroll for sidebar links
//
// Intercepts the default anchor jump and uses scrollIntoView
// with smooth behavior instead for a polished feel.
// ============================================================
navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

// ============================================================
// Page load — sidebar slide-in + typewriter effect
// ============================================================
document.addEventListener("DOMContentLoaded", () => {

    // Trigger the sidebar slide-in animation one frame after paint
    // (requestAnimationFrame ensures the transition actually runs)
    requestAnimationFrame(() => sidebar.classList.add("slide-in"));

    // ----------------------------------------------------------
    // Typewriter effect
    //
    // Cycles through an array of phrases, typing each character
    // one at a time, then deleting and moving to the next phrase.
    // Stops permanently on the last phrase (no more deletion).
    //
    // Timing:
    //   55ms per character while typing
    //   30ms per character while deleting (faster delete = snappier)
    //   1800ms pause before starting to delete
    //   400ms pause before typing the next phrase
    // ----------------------------------------------------------
    const phrases = [
        "I'm Zach — Aspiring Quantitative Trader.",
        "Published Researcher on SSRN.",
        "Cybersecurity Analyst & Math Student."
    ];

    const typeContent = document.getElementById("type-content");
    const cursor      = document.getElementById("cursor");

    let phraseIndex = 0;    // which phrase we're currently on
    let charIndex   = 0;    // how far into the phrase we are
    let deleting    = false;    // whether we're currently erasing

    function type() {
        const current = phrases[phraseIndex];

        if (!deleting) {
            // Add the next character
            typeContent.textContent = current.slice(0, charIndex + 1);
            charIndex++;

            if (charIndex === current.length) {
                // Finished typing this phrase
                if (phraseIndex === phrases.length - 1) {
                    // Last phrase — stop here and blink the cursor forever
                    cursor.classList.add("blink");
                    return;
                }
                // Wait before starting to delete
                setTimeout(() => { deleting = true; type(); }, 1800);
                return;
            }

            setTimeout(type, 55);    // type next character

        } else {
            // Remove the last character
            typeContent.textContent = current.slice(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                // Finished deleting — move to next phrase
                deleting = false;
                phraseIndex++;
                setTimeout(type, 400);    // brief pause before typing the next one
                return;
            }

            setTimeout(type, 30);    // delete next character (faster than typing)
        }
    }

    // Kick off the typewriter
    type();

});
