async function loadComponent(id, file) {
    const element = document.getElementById(id);
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');

    const headerHTML = await fetch('/assets/includes/header.html').then(r => r.text());
    const footerHTML = await fetch('/assets/includes/footer.html').then(r => r.text());

    header.innerHTML = headerHTML;
    footer.innerHTML = footerHTML;
});