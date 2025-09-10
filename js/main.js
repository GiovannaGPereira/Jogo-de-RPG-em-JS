let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

let music = new Audio();
music.loop = true;

const icons = {
  gold: "imagens/moeda.png",
  hp: "imagens/health.png",
  xp: "imagens/xp.png"
};

function showFloatingTextOnHUD(text, color, targetId, iconType = null) {
  const target = document.getElementById(targetId);
  const rect = target.getBoundingClientRect(); // pega posição do elemento na tela

  const container = document.createElement("span");
  container.className = "floating-text";
  container.style.color = color;

  // Posiciona acima do elemento
  container.style.left = rect.left + window.scrollX + "px";
  container.style.top = rect.top + window.scrollY - 30 + "px"; // 30px acima do número

  if (iconType && icons[iconType]) {
    const icon = document.createElement("img");
    icon.src = icons[iconType];
    container.appendChild(icon);
  }

  const spanText = document.createElement("span");
  spanText.innerText = text;
  container.appendChild(spanText);

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 1000);
}

const musicas = {
  entrada: "musicas/entrada.mp3",
  cidade: "musicas/cidade.mp3",
  loja: "musicas/loja.mp3",
  caverna: "musicas/caverna.mp3",
  batalha: "musicas/batalha.mp3",
  dragao: "musicas/dragao.mp3",
  gameover: "musicas/gameover.mp3"
};

function tocarMusica(nome) {
  if (!musicas[nome]) return;
  if (music.src.includes(musicas[nome])) return;

  music.pause();
  music = new Audio(musicas[nome]);
  music.loop = true;
  music.muted = true; // começa mutado
  music.play().then(() => {
    music.muted = false; // desmuta depois de começar
  }).catch(() => {
    console.log("Autoplay bloqueado pelo navegador");
  });
}


const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

const sceneImages = {
  cidade: "imagens/cidade.jpg",
  store: "imagens/loja.jpg",
  cave: "imagens/caverna.jpg",
  dragon: "imagens/dragao.jpg",
  slime: "imagens/slime.jpg",
  fangedbeast: "imagens/fangedbeast.jpg",
};

const imgA = document.getElementById("scene-img-a");
const imgB = document.getElementById("scene-img-b");

let visibleImg = document.getElementById("scene-img-a");
let hiddenImg = document.getElementById("scene-img-b");

function changeImage(newSrc) {
  if (!newSrc || visibleImg.src.includes(newSrc)) return; // Evita trocar pela mesma imagem

  hiddenImg.src = newSrc;
  hiddenImg.onload = () => {
    hiddenImg.classList.add("active");
    visibleImg.classList.remove("active");
    [visibleImg, hiddenImg] = [hiddenImg, visibleImg];
  };
}
// ITENS DO INVENTÁRIO
const inventoryIcons = document.getElementById("inventoryIcons");

// Mapear nomes dos itens para imagens
const itemImages = {
  stick: "imagens/stick.png",
  dagger: "imagens/adaga.png",
  "claw hammer": "imagens/clawhammer.png",
  sword: "imagens/espada.png"
};

function updateInventoryIcons() {
  // limpa os ícones atuais
  inventoryIcons.innerHTML = ""; 
  
  // cria container flex para manter horizontal
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "row";
  container.style.gap = "5px";
  
  inventory.forEach(item => {
    if (itemImages[item]) {
      const img = document.createElement("img");
      img.src = itemImages[item];
      img.alt = item;
      img.style.width = "30px";
      img.style.height = "30px";
      container.appendChild(img);
    }
  });
  
  inventoryIcons.appendChild(container);
}

// Inicializa com a cidade direto
showInitialImage(sceneImages.cidade);

function goTown() {
  changeImage(sceneImages.cidade); 
  update(locations[0]);
  tocarMusica("cidade");
}

function goStore() {
  changeImage(sceneImages.store);
  update(locations[1]);
  tocarMusica("loja");
}

function goCave() {
  changeImage(sceneImages.cave);
  update(locations[2]);
  tocarMusica("caverna");
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    showFloatingTextOnHUD("-10", "red", "goldText", "gold");  // gastou 10
    showFloatingTextOnHUD("+10", "green", "healthText", "hp"); // ganhou 10 HP
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}


function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      showFloatingTextOnHUD("-30", "red", "goldText", "gold");  // gastou 30
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      
      // Adiciona somente UMA vez ao inventário
      inventory.push(newWeapon);
      
      text.innerText += " In your inventory you have: " + inventory.join(", ");
      updateInventoryIcons();
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    showFloatingTextOnHUD("+15", "gold", "goldText", "gold"); // ganhou 20

    // Remove SOMENTE o último item (a arma mais recente)
    let soldWeapon = inventory.pop();
    
    text.innerText = "You sold a " + soldWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory.join(", ");
    currentWeapon = Math.max(0, currentWeapon - 1); // Ajusta arma atual


    updateInventoryIcons();
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  changeImage(sceneImages.slime);
  fighting = 0;
  goFight();
}

function fightBeast() {
  changeImage(sceneImages.fangedbeast);
  fighting = 1;
  goFight();
}

function fightDragon() {
  changeImage(sceneImages.dragon);
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;

  if (fighting === 2) {
    tocarMusica("dragao");
  } else {
    tocarMusica("batalha");
  }
}
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";

  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    // garante que monsterHealth nunca fique negativo
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * (xp + 1));
    if (monsterHealth < 0) monsterHealth = 0;
  } else {
    text.innerText += " You miss.";
  }

  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}
function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}


function defeatMonster() {
  const goldEarned = Math.floor(monsters[fighting].level * 6.7);
  const xpEarned = monsters[fighting].level;

  gold += goldEarned;
  xp += xpEarned;
  goldText.innerText = gold;
  xpText.innerText = xp;

  // animações flutuantes no HUD
  showFloatingTextOnHUD("+" + goldEarned + "G", "gold", "goldText", "gold");
  showFloatingTextOnHUD("+" + xpEarned + "XP", "blue", "xpText", "xp");

  update(locations[4]);
}

function lose() {
  update(locations[5]);
  tocarMusica("gameover");
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
    showFloatingTextOnHUD("+20", "gold", "goldText", "gold"); // ganhou 20
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;

    if (health <= 0) {
      lose();
    }
  }
}

window.onload = () => {
  changeImage(sceneImages.cidade);
  music = new Audio(musicas.entrada);
  music.loop = true;
  music.volume = 0; // começa mutada
  music.play().then(() => {
    setTimeout(() => {
      music.volume = 1; // aumenta o volume depois de 200ms
    }, 200);
  }).catch(() => {
    console.log("O navegador bloqueou o autoplay. Tente interagir com a página.");
  });
};
