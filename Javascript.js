const button = document.querySelector(".enter");
const content = document.querySelector(".content");
const title = document.querySelector("h1");
const noButton = document.querySelector(".no");
const yesButton = document.querySelector(".yes");
let noButtonArmed = false;
let noButtonMoving = false;

function moveNoButton() {
    if (noButtonMoving) {
        return;
    }

    noButtonMoving = true;
    const padding = 8;
    const maxLeft = Math.max(padding, window.innerWidth - noButton.offsetWidth - padding);
    const maxTop = Math.max(padding, window.innerHeight - noButton.offsetHeight - padding);

    noButton.style.position = "fixed";
    noButton.style.left = `${padding + Math.random() * (maxLeft - padding)}px`;
    noButton.style.top = `${padding + Math.random() * (maxTop - padding)}px`;

    setTimeout(() => {
        noButtonMoving = false;
    }, 280);
}

document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
        return;
    }

    const bounds = noButton.getBoundingClientRect();
    const isPointerOverButton = event.clientX >= bounds.left
        && event.clientX <= bounds.right
        && event.clientY >= bounds.top
        && event.clientY <= bounds.bottom;

    if (!noButtonArmed) {
        if (!isPointerOverButton) {
            noButtonArmed = true;
        }
        return;
    }

    const distance = Math.hypot(
        event.clientX - (bounds.left + bounds.width / 2),
        event.clientY - (bounds.top + bounds.height / 2)
    );

    if (distance < 100) {
        moveNoButton();
    }
});

noButton.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
        event.preventDefault();
        moveNoButton();
    }
});

button.addEventListener("click", () => {
    noButtonArmed = false;
    content.style.visibility = "visible";

    const noButtonBounds = noButton.getBoundingClientRect();
    noButton.style.position = "fixed";
    noButton.style.left = `${noButtonBounds.left}px`;
    noButton.style.top = `${noButtonBounds.top}px`;
    noButton.style.margin = "0";

    button.style.visibility = "hidden";
    button.style.display = "none";
    title.style.visibility = "hidden";
    title.style.display = "none";
});

yesButton.addEventListener("click", () => {
    yesButton.disabled = true;
    window.location.href = "thank-you.html";
});
