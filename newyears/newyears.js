//function to calculate difference between now and upcoming new years. returns array containing the amount of days, hours minutes and seconds
const dateDifference = () => {
    const currentDate = new Date()

    const nextYearDate = new Date(`${currentDate.getFullYear() + 1}-01-01T00:00:00`)

    let seconds = Math.floor((nextYearDate - (currentDate)) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    return [days, hours, minutes, seconds]
}
//defining elements for flipping animation and initializing the current diffence upon page entry
const secondsFlip = document.querySelector('.seconds .flipCont')
const secondsInput = document.querySelector('.seconds .flipFront span')
const secondsInputTwo = document.querySelector('.seconds .bottom span')
const secondsBack = document.querySelector('.seconds .nextNum')
const secondsBackTwo = document.querySelector('.seconds .flipBack span')

const minutesFlip = document.querySelector('.minutes .flipCont')
const minutesInput = document.querySelector('.minutes .flipFront span')
const minutesInputTwo = document.querySelector('.minutes .bottom span')
const minutesBack = document.querySelector('.minutes .nextNum')
const minutesBackTwo = document.querySelector('.minutes .flipBack span')

const hoursFlip = document.querySelector('.hours .flipCont')
const hoursInput = document.querySelector('.hours .flipFront span')
const hoursInputTwo = document.querySelector('.hours .bottom span')
const hoursBack = document.querySelector('.hours .nextNum')
const hoursBackTwo = document.querySelector('.hours .flipBack span')

const daysFlip = document.querySelector('.days .flipCont')
const daysInput = document.querySelector('.days .flipFront span')
const daysInputTwo = document.querySelector('.days .bottom span')
const daysBack = document.querySelector('.days .nextNum')
const daysBackTwo = document.querySelector('.days .flipBack span')

secondsInput.innerHTML = dateDifference()[3]
secondsInputTwo.innerHTML = dateDifference()[3]

minutesInput.innerHTML = dateDifference()[2]
minutesInputTwo.innerHTML = dateDifference()[2]

hoursInput.innerHTML = dateDifference()[1]
hoursInputTwo.innerHTML = dateDifference()[1]

daysInput.innerHTML = dateDifference()[0]
daysInputTwo.innerHTML = dateDifference()[0]

//set the new year title to the next year
document.querySelector('.title span').innerHTML = `${new Date().getFullYear() + 1}`

//interval set for every second to calculate the date difference and execute animation of the countdown
setInterval(() => {
    const count = dateDifference()


    secondsBack.setAttribute('data-number', count[3])
    secondsBackTwo.innerHTML = `${count[3]}`

    secondsFlip.classList.add('flipped')


    if(count[2] !== parseInt(minutesInput.innerHTML, 10)){
        minutesBack.setAttribute('data-number', count[2])
        minutesBackTwo.innerHTML = `${count[2]}`
    
        minutesFlip.classList.add('flipped')
    }

    if(count[1] !== parseInt(hoursInput.innerHTML, 10)){
        hoursBack.setAttribute('data-number', count[1])
        hoursBackTwo.innerHTML = `${count[1]}`
    
        hoursFlip.classList.add('flipped')
    }

    if(count[0] !== parseInt(daysInput.innerHTML, 10)){
        daysBack.setAttribute('data-number', count[0])
        daysBackTwo.innerHTML = `${count[0]}`
    
        daysFlip.classList.add('flipped')
    }

    //timeout to reset placement of animations
    setTimeout(() => {
        secondsFlip.classList.remove('flipped')
        secondsInput.innerHTML = `${count[3]}`
        secondsInputTwo.innerHTML = `${count[3]}`

        minutesFlip.classList.remove('flipped')
        minutesInput.innerHTML = `${count[2]}`
        minutesInputTwo.innerHTML = `${count[2]}`

        hoursFlip.classList.remove('flipped')
        hoursInput.innerHTML = `${count[1]}`
        hoursInputTwo.innerHTML = `${count[1]}`

        daysFlip.classList.remove('flipped')
        daysInput.innerHTML = `${count[0]}`
        daysInputTwo.innerHTML = `${count[0]}`
    }, 900);


}, 1000);