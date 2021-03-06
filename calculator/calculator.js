let result = 0
let currentEq = ''
let resultText = document.querySelector('.calculatorCont .finalResult')
let currentEqText = document.querySelector('.calculatorCont .currentEq')

//calulate function that rounds to the nearest 100000 th
const calculate = () => {
    return  Math.round(100000*eval(currentEq))/100000
}

//adds event listeners to all calculator buttons and forms calculations based on what the button is
document.querySelectorAll('.calculator .buttons span').forEach(button => {
        button.addEventListener('click', () => {
            if(button.innerHTML === '='){
                result = calculate()
                resultText.innerHTML = result
            }else if(button.innerHTML === 'C'){
                result = 0
                currentEq = ''
                resultText.innerHTML = '0'
                currentEqText.innerHTML = '0'
            }else{
                if(button.innerHTML === '+' || button.innerHTML === '-' || button.innerHTML === '*' || button.innerHTML === '/'){
                    if(currentEq.includes('+') || currentEq.includes('-') || currentEq.includes('*') || currentEq.includes('/')){
                        result = calculate()
                        resultText.innerHTML = result
                        currentEq = `${calculate()} ${button.innerHTML} `
                        currentEqText.innerHTML = currentEq
                        return
                    }
                    currentEq += ` ${button.innerHTML} `
                    currentEqText.innerHTML = currentEq
                }else{
                    currentEq += `${button.innerHTML}`
                    currentEqText.innerHTML = currentEq
                }
            }
        })
})

