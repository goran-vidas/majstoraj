/**
 * Pomaže u učitavanju HTML fragmenata bez body/html tagova.
 */
async function injectComponent(id, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Greška pri učitavanju: ${url}`);
        const html = await response.text();
        document.getElementById(id).innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Putanje su prilagođene tvojoj strukturi
    injectComponent('header', '/assets/includes/header.html');
    injectComponent('footer', '/assets/includes/footer.html');
});