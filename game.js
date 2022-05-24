let itemHammer = 0
let itemLuck = 0
let difficulty = 2
let chestHealth = Math.floor(difficulty*(difficulty/2)*10)
let chestOpened = false
let gold = 0

setInterval(() => {
    document.getElementById("health").innerHTML = Math.floor(chestHealth*10)/10
    if(chestHealth<=0)
    {
        document.getElementById("health").innerHTML = "0"
    }
    document.getElementById("gold").innerHTML = Math.floor(gold*10)/10 + " gold"
    let items = document.getElementsByClassName("item_container")
    for (let i = 0; i < items.length; i++) {
        if(items[i].id=="item_hammer")
        {
            items[i].children[0].children[1].innerHTML = "hammer (" + itemHammer + ")"
            items[i].children[1].children[1].innerHTML = "buy for $" + Math.floor((100 + (itemHammer*(itemHammer/1.2))*120)*10)/10
        }
        if(items[i].id=="item_luck")
        {
            items[i].children[0].children[1].innerHTML = "luck (" + itemLuck + ")"
            items[i].children[1].children[1].innerHTML = "buy for $" + Math.floor((250 + (itemLuck*(itemLuck*1.5))*300)*10)/10
            if(itemHammer>=2)
            {
                items[i].style.display = "inline"
            }else{
                items[i].style.display = "none"
            }
        }
    }
    if(itemHammer<3)
    {
        document.getElementById("objective").innerHTML = "objective: <br>" + "buy x3 hammer upgrades"
    }
    if(itemHammer<2)
    {
        document.getElementById("objective").innerHTML = "objective: <br>" + "buy x2 hammer upgrades"
    }
    difficulty = 2 + (itemHammer/3)
    document.getElementById("hps").innerHTML = (itemHammer*1) + " damage/s"
}, 50);

setInterval(() => {
    let oldHealth = chestHealth
    chestHealth-=(itemHammer*1)/10
    if(Math.abs(oldHealth-chestHealth)>0.01)
    {
        checkChest(false)
    }
}, 100);

let cooldown = false

function checkChest(isClicked)
{
    if(chestHealth>0)
    {
        if(isClicked==true)
        {
            var audio = new Audio('assets/hit.mp3');
            audio.play();
        }
    }
    if(chestHealth<=0)
    {
        if(chestOpened==false)
        {
            document.getElementById("chest").setAttribute("src","assets/chest-opened.png")
            var audio = new Audio('assets/chest.mp3');
            audio.play();
            let reward = difficulty*(difficulty/1.65)*8 + (Math.random()*difficulty*(difficulty/1.65)*4)
            reward = Math.floor(reward)
            gold += reward
            document.getElementById("reward").style.opacity = 1
            document.getElementById("reward").innerHTML = "+" + reward + " gold"
            if(Math.random()*100<(itemLuck*0.3))
            {
                document.getElementById("reward").innerHTML = "+" + reward*2 + " gold (x2 by luck)"
                gold += reward
            }
            setTimeout(() => {
                document.getElementById("reward").style.opacity = 0
            }, 750);
            chestOpened=true
        }else{
            document.getElementById("chest").setAttribute("src","assets/chest-closed.png")
            chestHealth = Math.floor(difficulty*(difficulty/2)*10)
            if(isClicked==true)
            {
                var audio = new Audio('assets/hit.mp3');
                audio.play();
            }
            chestOpened=false
        }
    }
}

document.getElementById("chest").onclick = function(){
    if(cooldown==false)
    {
        cooldown = true
        setTimeout(() => {
            cooldown=false
        }, 50);
        document.getElementById("chest").className = "chest-clicked"
        document.getElementById("chest").style.transform = `rotate(${-2.5 + Math.random()*5}deg)`
        setTimeout(() => {
            document.getElementById("chest").className = "chest-normal"
            document.getElementById("chest").style.transform = `rotate(0deg)`
        }, 50);
        chestHealth-=1
        checkChest(true)
    }
}

let dropdowns = document.getElementsByClassName("item_dropdown")
for (let i = 0; i < dropdowns.length; i++) {
    dropdowns[i].onclick = function(){
        let targetElement = dropdowns[i].parentElement.parentElement.children[1]
        if(targetElement.className == "item_body_open")
        {
            targetElement.className = "item_body_closed"
        }else{
            targetElement.className = "item_body_open"
        }
    }
}

let buybuttons = document.getElementsByClassName("item_buy")
for (let i = 0; i < buybuttons.length; i++) {
    buybuttons[i].onclick = function(){
        let targetElement = buybuttons[i].parentElement.parentElement
        if(targetElement.id == "item_hammer")
        {
            if(gold>=(100 + (itemHammer*(itemHammer/1.2))*120))
            {
                gold-=(100 + (itemHammer*(itemHammer/1.2))*120)
                itemHammer += 1
                var audio = new Audio('assets/buy.mp3');
                audio.play();
            }else{
                buybuttons[i].setAttribute("style","cursor: not-allowed;")
                setTimeout(() => {
                    buybuttons[i].setAttribute("style","cursor: pointer;")
                }, 500);
            }
        }
        if(targetElement.id == "item_luck")
        {
            if(gold>=(250 + (itemLuck*(itemLuck*1.5))*300))
            {
                gold-=(250 + (itemLuck*(itemLuck*1.5))*300)
                itemLuck += 1
                var audio = new Audio('assets/buy.mp3');
                audio.play();
            }else{
                buybuttons[i].setAttribute("style","cursor: not-allowed;")
                setTimeout(() => {
                    buybuttons[i].setAttribute("style","cursor: pointer;")
                }, 500);
            }
        }
    }
}

document.onkeydown = function(e){
    if(e.key=="p")
    {
        gold+=50
    }
}