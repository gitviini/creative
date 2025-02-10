const TOAST_CONFIG = {
    duration: 2500,
    gravity: "top",
    position: "right",
    newWindow: true,
    offset: {
        x: "1rem",
        y: "calc(-15px + .75rem)",
    },
    close:true,
    stopOnFocus: true,
    style: {
        padding: "0 0 0 1rem",
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--success)",
        borderRadius: "0.25rem",
        boxShadow: "0 0 .5rem #0001",
        color: "var(--foreground)",
        transform: "",
    },
}

function toastMessage(toast={mode:"warning",message:""}){
    try {
        TOAST_CONFIG.text = toast.message
        TOAST_CONFIG.style.background = `var(--${toast.mode})`
        Toastify(TOAST_CONFIG).showToast();
    }
    catch (err) {
        console.log("Toast:. Falha ao instanciar toast")
    }
}