const app = document.getElementById('app');

const workerStatus = document.createElement('h2');
if ('serviceWorker' in navigator) {
    workerStatus.innerText = "Service Worker working"
    window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register("/sw.js");
        if (registration.installing) {
            console.log("Service worker installing");
        } else if (registration.waiting) {
            console.log("Service worker installed");
        } else if (registration.active) {
            console.log("Service worker active");
        }
    })
} else {
    workerStatus.innerText = "Service Worker Not working"
}
app.appendChild(workerStatus)