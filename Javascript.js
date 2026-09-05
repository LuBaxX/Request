const button = document.querySelector(".enter");
const content = document.querySelector(".content");
const title = document.querySelector("h1");
const noButton = document.querySelector(".no");
const yesButton = document.querySelector(".yes");
let noButtonArmed = false;
let noButtonMoving = false;
let contentOpened = false;

function moveNoButton() {
    if (!contentOpened || noButtonMoving) {
        return;
    }

    noButtonMoving = true;
    const padding = 8;
    const maxLeft = Math.max(padding, window.innerWidth - noButton.offsetWidth - padding);
    const maxTop = Math.max(padding, window.innerHeight - noButton.offsetHeight - padding);
    const targetLeft = padding + Math.random() * (maxLeft - padding);
    const targetTop = padding + Math.random() * (maxTop - padding);

    noButton.style.left = `${targetLeft}px`;
    noButton.style.top = `${targetTop}px`;

    setTimeout(() => {
        noButtonMoving = false;
    }, 500);
}

document.addEventListener("pointermove", (event) => {
    if (!contentOpened || event.pointerType === "touch") {
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
    if (contentOpened && event.pointerType === "touch") {
        event.preventDefault();
        moveNoButton();
    }
});

button.addEventListener("click", () => {
    noButtonArmed = false;
    contentOpened = true;

    button.style.visibility = "hidden";
    button.style.display = "none";
    title.style.visibility = "hidden";
    title.style.display = "none";

    noButton.style.position = "static";
    noButton.style.left = "auto";
    noButton.style.top = "auto";
    noButton.style.margin = "2rem 1rem";

    content.style.visibility = "visible";
    const noButtonBounds = noButton.getBoundingClientRect();
    const buttonGap = 24;
    noButton.style.position = "fixed";
    noButton.style.left = `${noButtonBounds.left + buttonGap}px`;
    noButton.style.top = `${noButtonBounds.top}px`;
    noButton.style.margin = "0";
    noButton.style.transition = "left 500ms ease-out, top 500ms ease-out";
});

yesButton.addEventListener("click", () => {
    yesButton.disabled = true;
    window.location.href = "thank-you.html";
});
