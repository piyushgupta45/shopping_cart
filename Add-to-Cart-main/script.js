import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-3f040-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    inputValue=inputValue.trimStart()

    if(inputValue!==""){
        push(shoppingListInDB, inputValue)
        
        clearInputFieldEl()
    }else{
        clearInputFieldEl()
        alert("Input is empty")
    }
})

inputFieldEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addButtonEl.click();
    }
})

onValue(shoppingListInDB, function(snapshot) {

    if(snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())
        
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }
    }else{
        shoppingListEl.innerText = "Nothing here yet."
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("dblclick", function() {

        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        const userResponse = confirm(`Are you sure you want to delete ${itemValue} from the List?`)
        if(userResponse){
            remove(exactLocationOfItemInDB)
        }
    })
    
    shoppingListEl.append(newEl)
}