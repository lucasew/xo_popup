document.addEventListener('load', () => console.log("carregou"))

let allowHide = false
let allowHideTimeout = setTimeout(() => {
    allowHide = true
}, 1000)
async function temporarilyAllow() {
    console.log("allow hide")
    clearTimeout(allowHideTimeout)
    allowHide = false
    allowHideTimeout = setTimeout(() => {
        console.log("disallow")
        allowHide = true
    }, 1000)
}

function createChecker(wp, hp) {
    let prevWidth = window.outerWidth
    let prevHeight = window.outerHeight
    let qtitems = document.elementsFromPoint(prevWidth * wp, prevHeight * hp).length
    return function() {
        const height = window.outerHeight
        const width = window.outerWidth
        const x = width * wp
        const y = height * hp
        console.log(`check point: ${x} ${y}`)
        const elements = document.elementsFromPoint(x, y)
        if (height !== prevHeight || width !== prevWidth) {
            console.log("resize")
            qtitems = elements.length
            prevWidth = width
            prevHeight = height
        }
        if (allowHide) {
            console.log("hide allowed")
            if (qtitems < elements.length) {
                console.log(`hiding ${elements.length - qtitems} items...`)
                let hiddenItems = 0
                for (let i = 0; i < (elements.length - qtitems); i++) {
                    console.log(elements[i].style["z-index"])
                    if (elements[i].style["z-index"] > 0 || elements[i].style.position === "absolute") {
                        elements[i].style.display = "none"
                        hiddenItems++
                    }
                }
                console.log(`hidden items: ${hiddenItems}`)
            }
        } else {
            console.log("not allowed")
        }
        qtitems = elements.length
    }
}

const checkers = [
    createChecker(.5, .5),
    createChecker(.5, 1)
]

function recheck() {
    console.log("check triggered")
    checkers.forEach(c => c())
}


// document.addEventListener('load', () => {
    console.log("popupkiller load")
    document.addEventListener('click', temporarilyAllow)
    document.addEventListener('drag', temporarilyAllow)
    document.addEventListener('drop', temporarilyAllow)
    document.addEventListener('dragover', temporarilyAllow)
    document.addEventListener('dragstart', temporarilyAllow)
    document.addEventListener('auxclick', temporarilyAllow)
    document.addEventListener('click', temporarilyAllow)
    document.addEventListener('contextmenu', temporarilyAllow)
    document.addEventListener('dblclick', temporarilyAllow)
    document.addEventListener('mousedown', temporarilyAllow)
    document.addEventListener('keypress', temporarilyAllow)
    const observer = new MutationObserver(recheck)
    observer.observe(document, {
        childList: true,
        subtree: true,
    })
// })
