document.getElementById("mainTitle").innerText = "Point and Click adventure game";
// Game State
let gameState = {
    "inventory": [],
    "coinPickedUp": false
}

// load data from save file
/*
fetch('data/save.json').then((response) => {
    if (response.status == 404) {
        alert('file not found!');
    } else {
        return response.json();
    }
}).then((resJson) => {
    gameState = resJson;
    runGame();
}).catch((error) => {
    console.error(error)
})
*/

function runGame() {
    //Game window reference
    const gameWindow = document.getElementById("gameWindow");
    const inventoryList = document.getElementById("inventoryList");
    const sec = 1000;

    //Main Character
    const mainCharacter = document.getElementById("hero");
    const offsetCharacter = 16;

    //speech bubbles
    const heroSpeech = document.getElementById("heroSpeech");
    const counsterSpeech = document.getElementById("counterSpeech");
    //audio for dialog
    const heroAudio = document.getElementById("heroAudio");
    const counterAudio = document.getElementById("counterAudio");

    //avatar
    const counterAvatar = document.getElementById("counterAvatar");

    //Objects
    const tree1 = document.getElementById("squareTree");

    let doorUnlocked = false;

    gameWindow.onclick = function (e) {
        var rect = gameWindow.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        document.getElementById("inventoryBox").style.opacity = 1;
        //TODO: calc offset based on character size
        //TODO: making dialog functionality

        if (counterSpeech.style.opacity == 0 && heroSpeech.style.opacity == 0) {
            if (e.target.id !== "heroImage") {
                mainCharacter.style.left = x - offsetCharacter + "px";
                mainCharacter.style.top = y - offsetCharacter + "px";
            }
            switch (e.target.id) {
                case "inventoryBox":
                    document.getElementById("inventoryBox").style.opacity = 0.5;
                    break;
                case "warpKey":
                    console.log("pick up warpKey")
                    document.getElementById("warpKey").remove();
                    changeInventory('warpKey', "add");
                    break;
                case "shell":
                    if (gameState.coinPickedUp == false) {
                        changeInventory("coin", "add");
                        gameState.coinPickedUp = true;
                    } else {
                        console.log("There are no more coins under the shell!");
                    }
                    break;
                case "portal":
                    if (doorUnlocked) {
                        //change world 'none' is disable 'block' is enable
                        // Fade out world 1
                        //world1.style.transition = 'opacity 1s ease-in-out';
                        //world1.style.opacity = '0';
                        document.getElementById("world1").style.display = "none";
                        document.getElementById("world2").style.display = "inline";

                        // After the fade out animation completes, hide world 1 and fade in world 2
                        setTimeout(function () {
                            world1.style.display = 'none';
                            world1.style.transition = ''; // Reset transition property
                            world2.style.display = 'block';
                            world2.style.opacity = '1'; // Fade in world 2
                        }, 1000);
                    }
                    else if (checkItem("warpKey")) {
                        showMessage(heroSpeech, "I opened the door. Yeah!", heroAudio);
                        changeInventory("warpKey", "remove");
                        doorUnlocked = true;
                        //console.log("I opened the door. Yeah!");
                    } else if (checkItem("coin")) {
                        changeInventory("coin", "remove");
                        showMessage(heroSpeech, "Oh no I lost the coin and it didn't open the door.. Feel kinda stupid..", heroAudio);
                        //console.log("Oh no I lost the coin and it didn't open the door.. Feel kinda stupid..");
                    } else {
                        showMessage(heroSpeech, "What the actual fuckywucky is this platform, i think its a portal. Let me find the key!", heroAudio);
                        //console.log("Fuck this door is locked and I don't have a key. boohoo :(");
                    }
                    break;
                case "misterCrabs":
                    document.getElementById("misterCrabs").style.transform = 'scale(3)';
                    showMessage(heroSpeech, "What an ugly Crab, Can you just go away?", heroAudio);
                    setTimeout(function () { counterAvatar.style.opacity = 1; }, 4 * sec);
                    setTimeout(showMessage, 4.1 * sec, counsterSpeech, "You know i can hear u right..", counterAudio);
                    setTimeout(showMessage, 8.1 * sec, heroSpeech, "How the fuck do you talk to me, and how do you understand what i say?", heroAudio);
                    setTimeout(showMessage, 12.1 * sec, counsterSpeech, "Just shut up.. If you want to get out of here just look at the island for the coin and try it on the portal, if that didnt work, look at the chest in the middle, i dont give a f.", counterAudio);
                    setTimeout(function () { counterAvatar.style.opacity = 0; }, 16 * sec);
                    //console.log("hey you.. wanna know where the key is? It's by the graves.");
                    break;
                default:
                    break;

                case "statue":
                    document.getElementById("statue").style.transform = 'scale(1.2)';
                    showMessage(heroSpeech, "Wow, what a beautifull statue, i wonder how old it is...", heroAudio);
                    setTimeout(function () { counterAvatar2.style.opacity = 1; }, 4 * sec);
                    setTimeout(showMessage, 4.1 * sec, counterSpeech2, "FINALLY!!, i have a visitor!. I am waiting almost 800 years to tell someone my secret, and now its the day!!!", counterAudio2);
                    setTimeout(showMessage, 8.1 * sec, heroSpeech, "Wow, first a talking crab and now a talking statue, what is this place?", heroAudio);
                    setTimeout(showMessage, 12.1 * sec, counterSpeech2, "You are in the hidden world of Propopus, the world which is full of magic. you need to look for a note, in that note stands everything you need to know. Good luck!", counterAudio2);
                    setTimeout(function () { counterAvatar2.style.opacity = 0; }, 16 * sec);
                    break;

                case "notes":
                    console.log("pick up the notes")
                    document.getElementById("notes").remove();
                    changeInventory('notes', "add");
                    if (gameState.notesPickedUp == false) {
                        changeInventory("notes", "add");
                        gameState.notesPickedUp = true;
                    } else {
                        console.log("There are no more Notes in the bushes!");
                    }
                    break;
            }
        }


    }
    /**
     * Add or remove item in inventory
     * @param {string} itemName 
     * @param {string} action 
     */
    function changeInventory(itemName, action) {
        if (itemName == null || action == null) {
            console.error("Wrong parameters given to changeInventory()");
            return;
        }


        switch (action) {
            case 'add':
                gameState.inventory.push(itemName);
                break;
            case 'remove':
                gameState.inventory = gameState.inventory.filter(function (newInventory) {
                    return newInventory !== itemName;
                });
                document.getElementById("inv-" + itemName).remove();
                break;

        }
        updateInventory(gameState.inventory, inventoryList);
    }

    /**
     * This returns string value if it exist within the array
     * @param {string} itemName 
     * @returns 
     */
    function checkItem(itemName) {
        return gameState.inventory.includes(itemName);
    }

    function updateInventory(inventory, inventoryList) {
        inventoryList.innerHTML = '';
        inventory.forEach(function (item) {
            const inventoryItem = document.createElement("li");
            inventoryItem.id = 'inv-' + item;
            inventoryItem.innerText = item;
            inventoryList.appendChild(inventoryItem);
        })
    }

    /**
     * It will show dialog and trigger sound.
     * @param {getElementById} targetBubble 
     * @param {string} message
     * @param {getElementById} targetSound 
     */
    function showMessage(targetBubble, message, targetSound) {
        targetSound.currentTime = 0;
        targetSound.play();
        targetBubble.innerText = message;
        targetBubble.style.opacity = 1;
        setTimeout(hideMessage, 4 * sec, targetBubble, targetSound);
    }

    /**
     * Hides message and pauze the audio
     * @param {getElementById} targetBubble 
     * @param {getElementById} targetSound 
     */
    function hideMessage(targetBubble, targetSound) {
        targetSound.pause();
        targetBubble.innerText = "...";
        targetBubble.style.opacity = 0;
    }


}

runGame();
