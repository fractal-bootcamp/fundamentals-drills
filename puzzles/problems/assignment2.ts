type Output = {

  inventory: inventory,
  receipts: Array<Receipt>

}

type Receipt = {
  dispensed?: string | undefined;
  changeCoins: { [denom: number]: number };
  changeTotal: number;
  spent: number;
  errors: string[];
}

type inventory = {
  [sku: string]: {
    price: number,
    stock: number
  }
}


type input = {
  inventory: inventory,
  sessions: Array<Session>
}

type Session = action[]

type action = ["insert", number] | ["select", string] | ["cancel"] | ["noop"]

export function processVendingSessions(input: input): Output {

  if (input.inventory === null || input.sessions === null) {
    return {
      inventory: {},
      receipts: []
    }
  }

  if (input.sessions[0].length === 0) {
    return {
      inventory: input.inventory,
      receipts: [{
        dispensed: undefined,
        changeCoins: {},
        changeTotal: 0,
        spent: 0,
        errors: []
      }]
    }
  }

  //normalize inventory with negative values 
  for (const item in input.inventory) {

    console.log(item, 'ey')

    let { price, stock } = input.inventory[item]
    price = Math.trunc(price)
    stock = Math.trunc(stock)

    //Normalize negative 
    if (price < 0) {
      price = 0
    }
    if (stock < 0) {
      stock = 0
    }

    input.inventory[item].price = price
    input.inventory[item].stock = stock
  }

  console.log("Trucnated inventory ", input.inventory)
  //Initializing some variables 
  // let inventory: inventory = input.inventory
  let sessions: Array<Session> = input.sessions
  let sessionCount: number = sessions.length

  let modifiedInventory: inventory = structuredClone(input.inventory)
  let finalReceipt: Array<Receipt> = []

  //For each session
  for (let i = 0; i < sessionCount; i++) {

    let currentSession = sessions[i]
    let actionsPerSession = currentSession.length
    let credit = 0

    let modifiedReceipt: Receipt = {
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: []
    }

    let coinBreakdown: { [denom: number]: number } = {}

    let session = true


    for (let j = 0; j < actionsPerSession; j++) {//handle individual action 

      if (!session) { break }

      let currentAction: action = currentSession[j]



      if (currentAction[0])

        /*
        Insert operation: update credit in machine if coin is valid. 
        */
        if (currentAction[0] === "insert") {

          let coin: number = currentAction[1]

          //Coin denom is invalid  
          let acceptedDenoms = new Set([1, 5, 10, 25, 50, 100])
          if (!acceptedDenoms.has(coin)) {
            modifiedReceipt = addErrorToReceipt(modifiedReceipt, `unsupported coin: ${coin}`)
            continue
          }

          //Valid coin - increase credit and track it in breakdown 
          credit += coin
          coinBreakdown[coin] ? coinBreakdown[coin] += 1 : coinBreakdown[coin] = 1
        }


        /*
        Select operation: dispense if there's enough credit, 
        */
        else if (currentAction[0] === "select") {

          // makeSelection(currentAction, machineState, modifiedReceipt)
          let selected_SKU: string = currentAction[1]
          let validSKU = false

          //Check inventory for matching SKU: invalid sku, insufficient credit, 
          for (const sku in modifiedInventory) {

            if (sku == selected_SKU) { //Found matching SKU 
              validSKU = true

              let { price, stock } = modifiedInventory[sku]

              //out of stock
              if (stock == 0) {
                modifiedReceipt = addErrorToReceipt(modifiedReceipt, `out of stock: ${sku}`)
                break
              }

              //insufficient credit 
              if (price > credit) {
                modifiedReceipt = addErrorToReceipt(modifiedReceipt, `insufficient credit: have ${credit}, need ${price}`)
                break
              }

              //change 
              let changeTotal = 0
              if (credit > price) {
                changeTotal = credit - price
                coinBreakdown = getCoinBreakdown(changeTotal)
              } else {
                coinBreakdown = {}
              }

              //dispense it 
              let dispensedReceipt = {
                dispensed: sku,
                changeCoins: coinBreakdown,
                changeTotal: changeTotal,
                spent: price,
                errors: modifiedReceipt.errors
              }
              modifiedReceipt = dispensedReceipt
              modifiedInventory[sku].stock -= 1
              session = false
            }

          }

          if (!validSKU) {
            modifiedReceipt = addErrorToReceipt(modifiedReceipt, `invalid sku: ${selected_SKU}`)
          }
        }

        else if (currentAction[0] === "cancel") {
          modifiedReceipt.changeCoins = coinBreakdown
          modifiedReceipt.changeTotal = credit
          break //end sesssion
        }

        else if (currentAction[0] === "noop") {
          continue
        }

        else {
          modifiedReceipt = addErrorToReceipt(modifiedReceipt, `unknown action: ${currentAction[0]}`)
        }

    }

    finalReceipt.push(modifiedReceipt)


  }

  return {
    inventory: modifiedInventory,
    receipts: finalReceipt
  }

}

function addErrorToReceipt(currentReceipt: Receipt, message: string): Receipt {

  let newErrors = currentReceipt.errors.concat(message)
  console.log("Adding", message, "to errors")

  return { ...currentReceipt, errors: newErrors }

}

function getCoinBreakdown(change: number): { [denom: number]: number } {

  let acceptedDenoms = [1, 5, 10, 25, 50, 100]
  let output: { [denom: number]: number } = {}

  while (change > 0) {

    let minimumDifference = change
    let selected_denom = -1

    //Go through the acceptedDenoms and find the smallest positive minimumDifferenc. Break if it is negative 
    for (let i = 0; i < acceptedDenoms.length; i++) {

      let difference = change - acceptedDenoms[i]
      if (difference < 0) { break }

      if (difference < minimumDifference) {
        selected_denom = acceptedDenoms[i]

      }

    }

    //Then add the denom that produced s.p.mD to the output. 
    output[selected_denom] ?
      output[selected_denom] += 1 :
      output[selected_denom] = 1

    //Loop repeats with updated change. 
    change -= selected_denom
  }

  return output

}


const input = {
  inventory: {
    R: { price: -50, stock: -1 },
    S: { price: 100.5, stock: 2.7 }
  },
  sessions: [
    [["insert", 100], ["select", "S"]]
  ]
};

let output = processVendingSessions(input)
console.log('#### output ###')
console.log(output)

