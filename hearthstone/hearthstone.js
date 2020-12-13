document.querySelectorAll(".inputSection input").forEach(input => {
    if (input.type === 'range') {
        input.addEventListener('change', (e) => {
            document.querySelector(`.${e.target.id}`).innerHTML = e.target.value === '10' ? '10+' : e.target.value
        })
    }
})

let cards = {}

let limit = 10

let search = null

let rarity = null

let cost = null

let attack = null

let health = null

const renderCards = (limit, search, rarity, cost, attack, health) => {
    requestedCards = []
    for (const set in cards) {
        if (set === 'Hero Skins') {
            continue
        }
    }
}


fetch('/carddata').then(response => {
    console.log(response)
}).catch(err => {
    console.error(err);
});

