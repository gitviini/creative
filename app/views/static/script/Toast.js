const TOAST_CONFIG = {
    text: "This is a toast",
    duration: 2000,
    gravity: "top",
    position: "right",
    style: {
        background: "var(--success)",
        border: "1px solid #444",
        color: "black"
    },
    onClick: function () { } // Callback after click
}

function toastMessage(mode="warning",text=""){
    try {
        TOAST_CONFIG.text = text
        TOAST_CONFIG.style.background = `var(--${mode})`
        Toastify(TOAST_CONFIG).showToast();
    }
    catch (err) {
        console.log("Toast:. Falha ao instanciar toast")
    }
}