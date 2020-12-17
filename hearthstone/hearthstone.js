
let cards = {}
let displayCards = []
let rarity = null
let currentCards = 0
const removeDOMCards = () => {
    document.querySelectorAll('.cardScroll img').forEach(img => {
        img.remove()
    })
}
const clearSearch = () => {
    removeDOMCards()
    document.querySelector('#search').value = ''
    document.querySelector('select[name="cost"]').value = 'null'
    document.querySelector('select[name="attack"]').value = 'null'
    document.querySelector('select[name="health"]').value = 'null'
    rarity = null
    document.querySelector('.cardSide button').style.display = 'none'
    document.querySelectorAll('.inputSection input[type="radio"]').forEach(input => {
        input.checked = false
    })
}
document.querySelectorAll(".inputSection input, .inputSection select").forEach(input => {
    if (input.type === 'radio') {
        input.addEventListener('click', (e) => {
            removeDOMCards()
            document.querySelector('.cardSide button').style.display = 'none'
            if (e.target.value === rarity) {
                input.checked = false
                rarity = null
            } else {
                rarity = e.target.value
            }
        })
    }
    input.addEventListener('change', (e) => {
        removeDOMCards()
        document.querySelector('.cardSide button').style.display = 'none'
    })
})
const renderCards = (loadMore) => {
    const cardScroll = document.querySelector('.cardScroll')
    document.querySelector('.cardSide button').style.display = 'block'
    const filterCards = () => {
        if (!loadMore) {
            currentCards = 0
            removeDOMCards()
        }
        let tempCurrentCards = currentCards
        let searchQueries = {
            search: !document.querySelector('#search').value ? null : document.querySelector('#search').value,
            cost: document.querySelector('select[name="cost"]').value,
            attack: document.querySelector('select[name="attack"]').value,
            health: document.querySelector('select[name="health"]').value,
            rarity: rarity
        }
        for (const query in searchQueries) {
            if (searchQueries[query] === null || searchQueries[query] === 'null') {
                delete searchQueries[query]
            } else if (query === 'cost' || query === 'attack' || query === 'health') {
                searchQueries[query] = parseInt(searchQueries[query], 10)
            }
        }
        let filteredCards = []
        let limit = 0
        for (const set in cards) {
            if (limit === 4) {
                break
            }
            if (set === 'Hero Skins' || cards[set].length === 0) {
                continue
            }
            for (let i = 0; i < cards[set].length; i++) {
                if (limit === 4) { break }
                if (cards[set][i].type !== 'Hero') {
                    queryPass = 0
                    for (query in searchQueries) {
                        if (query === 'search') {
                            if (cards[set][i].name?.toUpperCase().includes(searchQueries[query].toUpperCase()) ||
                                cards[set][i].text?.toUpperCase().includes(searchQueries[query].toUpperCase()) ||
                                cards[set][i].race?.toUpperCase().includes(searchQueries[query].toUpperCase()) ||
                                cards[set][i].type?.toUpperCase().includes(searchQueries[query].toUpperCase())) {
                                queryPass++
                            }
                        } else if (searchQueries[query] === 10) {
                            if (cards[set][i][query] >= 10) {
                                queryPass++
                            }


                        } else if (searchQueries[query] === cards[set][i][query]) {
                            queryPass++
                        }
                    }
                    if (queryPass === Object.keys(searchQueries).length) {
                        if (tempCurrentCards > 0) {
                            tempCurrentCards--
                            continue
                        }
                        filteredCards.push(cards[set][i])
                        limit++
                    }
                }
            }
        }
        return filteredCards
    }
    currentCards += 4
    filterCards().forEach(card => {
        let img = document.createElement('img')
        img.setAttribute('src', card.img)
        cardScroll.append(img)
    })
    displayCards.splice()
}
fetch('http://localhost:5555/carddata').then(response => {
    response.json().then(body => {
        cards = body
        console.log(cards)
        document.querySelector('.loadingModal').style.display = 'none'
        renderCards(false)
    })
}).catch(err => {
    console.error(err);
});

