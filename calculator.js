const prompt = require("prompt-sync")()

const operatorList = ["+", "-", "*", "/", "^", "(", ")"]
let QUIT = false

// We are pretty much done. But the problem is with the brackets. The expressions within them don't get properly calculated. Run a test and based on that fix the bug!

const addMulti = (expression, index) => {
    let firstPart = expression.slice(0, index)
    let lastPartIndex = expression.length - index
    let secondPart = expression.slice(-lastPartIndex)
    return firstPart + "*" + secondPart
}

const validateExpression = (expression) => {
    let validExpression = true
    let nOpenBracks = 0
    let nCloseBracks = 0

    let multiAdds = []

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i]
        let previousChar = expression[i - 1]
        let nextChar = expression[i + 1]
        if (operatorList.includes(char)) {
            if (char === "(") {
                nOpenBracks += 1
                if (!isNaN(parseFloat(previousChar))) {
                    multiAdds.push(i)
                } else if (operatorList.includes(previousChar)) {
                } else {
                    validExpression = false
                    break
                }
            } else if (char === ")") {
                nCloseBracks += 1
                if (operatorList.includes(nextChar) || nextChar === undefined) {
                } else {
                    validExpression = false
                    break
                }
            } else {
                if (
                    !isNaN(parseFloat(previousChar)) &&
                    !isNaN(parseFloat(nextChar))
                ) {
                } else if (
                    (previousChar === ")" && !isNaN(parseFloat(nextChar))) ||
                    (!isNaN(parseFloat(previousChar)) && nextChar === "(") ||
                    (previousChar === ")" && nextChar === "(")
                ) {
                } else {
                    validExpression = false
                    break
                }
            }
        } else if (char === "." || !isNaN(parseFloat(char))) {
        } else {
            validExpression = false
            break
        }
    }

    if (nOpenBracks === nCloseBracks) {
    } else {
        validExpression = false
    }

    // Adding multis to the expression
    let increase = 0
    if (validExpression) {
        for (let i = 0; i < multiAdds.length; i++) {
            add = multiAdds[i]
            expression = addMulti(expression, add + increase)
            increase += 1
        }
    }
    return [validExpression, expression]
}

const findNextOperation = (expression) => {
    const iterateAndFind = (target) => {
        for (let i = 0; i < expression.length; i++) {
            if (target.includes(expression[i])) {
                return i
            }
        }
    }

    if (expression.includes("^")) {
        return iterateAndFind("^")
    } else if (expression.includes("*") || expression.includes("/")) {
        return iterateAndFind("*/")
    } else {
        return iterateAndFind("+-")
    }
}

const removeBracks = (expression, start, end, answer) => {
    firstPart = expression.slice(0, start)
    secondPart = expression.slice(end + 1, expression.length)
    return firstPart + answer + secondPart
}

const extractBrackets = (expression) => {
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === "(") {
            let closeFound = false
            let closeIndex = 0
            while (!closeFound) {
                closeIndex -= 1
                if (expression[expression.length + closeIndex] === ")") {
                    closeFound = true
                }
            }
            let inBrackets = expression.slice(
                i + 1,
                expression.length + closeIndex
            )
            let answer = calculateWithinBrackets(inBrackets)
            return removeBracks(
                expression,
                i,
                expression.length + closeIndex,
                answer
            )
        }
    }
    return expression
}

const findEndsOfNumbers = (expression, opIndex) => {
    let beginning = null
    let end = null
    for (let b = opIndex - 1; b >= 0; b--) {
        beginning = b
        if (operatorList.includes(expression[b])) {
            beginning += 1
            break
        }
    }
    for (let e = opIndex + 1; e < expression.length; ++e) {
        end = e
        if (operatorList.includes(expression[e])) {
            end -= 1
            break
        }
    }
    return [beginning, end]
}

const doMath = (expression, opIndex) => {
    let [beginning, end] = findEndsOfNumbers(expression, opIndex)
    firstNum = parseFloat(expression.slice(beginning, opIndex))
    lastNum = parseFloat(expression.slice(opIndex + 1, end + 1))
    let ans = null
    if (expression[opIndex] === "^") {
        ans = firstNum ** lastNum
    } else if (expression[opIndex] === "/") {
        ans = firstNum / lastNum
    } else if (expression[opIndex] === "*") {
        ans = firstNum * lastNum
    } else if (expression[opIndex] === "+") {
        ans = firstNum + lastNum
    } else {
        ans = firstNum - lastNum
    }

    // Reassembling the expression
    if (end < expression.length) {
        let firstPart = expression.slice(0, beginning)
        let lastPart = expression.slice(end + 1)
        return firstPart + ans + lastPart
    } else {
        let firstPart = expression.slice(0, beginning)
        return firstPart + ans
    }
}

const checkOperatorExistence = (expression) => {
    let validOperators = ["+", "-", "*", "/", "^"]
    for (let i = 0; i < expression.length; i++) {
        if (validOperators.includes(expression[i])) {
            return true
        }
    }
    return false
}

const calculateWithinBrackets = (extractedExpression) => {
    if (extractedExpression.includes("(")) {
        extractedExpression = extractBrackets(extractedExpression)
    } else {
    }

    while (checkOperatorExistence(extractedExpression)) {
        let opIndex = findNextOperation(extractedExpression)
        extractedExpression = doMath(extractedExpression, opIndex)
    }

    return extractedExpression
}

while (!QUIT) {
    let input = prompt("Enter: ")
    if (input.toLocaleLowerCase()[0] === "q") {
        QUIT = true
    } else if (input.toLocaleLowerCase()[0] == "h") {
        console.log(
            "The Arithmetic Operators:\n    + Addition\n    - Subtraction\n    * Muliplication\n    / Division\n*Note: Only valid brackets are ()\n       This program can't still handle functions with negatives... =) Still Under Construction!"
        )
    } else {
        let expression = input.replaceAll(" ", "")
        let [verified, newExpression] = validateExpression(expression)
        if (!verified) {
            console.log("Syntax Error!")
        } else {
            console.log("Great Syntax!")
            let simplestForm = extractBrackets(newExpression)
            let ans = calculateWithinBrackets(simplestForm)
            console.log(ans)
        }
    }
}
