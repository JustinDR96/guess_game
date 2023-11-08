import "./style.scss";
import gameIndex from "./assets/gameIndex.json";

// Utilisez gameIndex dans votre code
console.log(gameIndex);

// Sélectionnez l'image et le canvas
const image = document.getElementById("image");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let currentImageIndex;
let gameData;
let score = parseInt(localStorage.getItem("score")) || 0;
const scorePlayer = document.getElementById("score");
// Définissez l'attribut willReadFrequently sur true
ctx.willReadFrequently = true;

// Largeur et hauteur des pixels
let pixelSize = 40; // Vous pouvez ajuster cette valeur selon votre préférence

function pixelateImage(image, canvas, pixelSize) {
  // Redimensionnez le canvas pour correspondre aux dimensions de l'image
  canvas.width = image.width;
  canvas.height = image.height;

  // Dessinez l'image sur le canvas pour pixeliser
  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Pixelisez l'image en remplaçant chaque carré par une couleur moyenne
  for (let y = 0; y < canvas.height; y += pixelSize) {
    for (let x = 0; x < canvas.width; x += pixelSize) {
      const imageData = ctx.getImageData(x, y, pixelSize, pixelSize);
      const data = imageData.data;
      let totalRed = 0,
        totalGreen = 0,
        totalBlue = 0;

      // Calculez la couleur moyenne
      for (let i = 0; i < data.length; i += 4) {
        totalRed += data[i];
        totalGreen += data[i + 1];
        totalBlue += data[i + 2];
      }

      const numPixels = pixelSize * pixelSize;
      const avgRed = Math.round(totalRed / numPixels);
      const avgGreen = Math.round(totalGreen / numPixels);
      const avgBlue = Math.round(totalBlue / numPixels);

      // Appliquez la couleur moyenne à chaque carré
      for (let i = 0; i < data.length; i += 4) {
        data[i] = avgRed;
        data[i + 1] = avgGreen;
        data[i + 2] = avgBlue;
      }

      // Réaffichez le carré pixelisé
      ctx.putImageData(imageData, x, y);
    }
  }
}

function getRandomIndex(data) {
  if (Array.isArray(data) && data.length > 0) {
    // Générez un nombre aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
    return Math.floor(Math.random() * data.length);
  } else {
    console.error("Le tableau de données est vide ou n'est pas un tableau.");
    return null;
  }
}

function loadRandomImage() {
  const randomIndex = getRandomIndex(gameData);
  if (randomIndex !== null) {
    const randomImage = gameData[randomIndex];
    const randomImageSrc = randomImage.src;

    // Mettez à jour la source de l'image
    image.src = randomImageSrc;
    pixelSize = 40;
    // Effacez le contenu du canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redessinez l'image sur le canvas avec la nouvelle source
    image.onload = function () {
      pixelateImage(image, canvas, pixelSize);
    };

    currentImageIndex = randomIndex;
  }
}

// Exemple d'utilisation
fetch("./assets/gameIndex.json")
  .then((response) => response.json())
  .then((jsonData) => {
    gameData = jsonData;
    loadRandomImage();
  })
  .catch((error) => {
    console.error("Erreur de chargement du fichier JSON : " + error);
  });

let attempts = 0; // Compteur de tentatives
const maxAttempts = 4; // Nombre maximum de tentatives avant de changer l'image

function checkAnswer() {
  const userAnswer = document.getElementById("answer");
  const currentImage = gameData[currentImageIndex];
  const correctName = currentImage.name.toUpperCase();
  userAnswer.style.border = "";
  if (userAnswer.value.toUpperCase() === correctName) {
    console.log("Réponse correcte !");

    const messageBox = document.getElementById("messageBox");
    messageBox.style.display = "block";
    setTimeout(function () {
      messageBox.style.display = "none"; // Masquez la boîte de dialogu
      attempts = 0; // Réinitialisez le compteur de tentatives
      userAnswer.value = "";
    }, 1000);
    // Mettez à jour le score en ajoutant la valeur de pixelSize
    const newScore = score + pixelSize;
    updateScore(newScore);

    // Chargez une nouvelle image
    loadRandomImage();
    attempts = 0; // Réinitialise le compteur de tentatives
    userAnswer.value = "";
  } else {
    console.log("Réponse incorrecte. Essayez encore.");
    attempts++;
    userAnswer.style.border = "2px solid red";

    if (attempts >= maxAttempts) {
      // Si l'utilisateur a épuisé ses 4 tentatives, chargez une nouvelle image
      loadRandomImage();
      attempts = 0; // Réinitialise le compteur de tentatives
      userAnswer.style.border = "";
    } else {
      pixelSize -= 10;
      pixelateImage(image, canvas, pixelSize);
    }
  }
}

function updateScore(newScore) {
  // Mettez à jour le score
  score = newScore;
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = `Score : ${score}`;

  // Sauvegardez le score dans le localStorage
  localStorage.setItem("score", score);
}
// Sélectionnez le bouton de réinitialisation
const resetButton = document.getElementById("reset-btn");

// Gestionnaire d'événements pour le clic sur le bouton de réinitialisation
resetButton.addEventListener("click", () => {
  resetScore();
});

function resetScore() {
  // Réinitialisez le score à zéro
  updateScore(0);
}

const submitButton = document.getElementById("submit-btn");
submitButton.addEventListener("click", checkAnswer);

loadRandomImage();
updateScore(score);
