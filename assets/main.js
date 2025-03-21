const validShops = ["amazon", "walmart", "lidl"];
const shopBox = validShops.includes(shopLink) ? shopLink : "default";

const prodImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/dev/${prodLink}/main_product.png`;
const prizeBoxUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/dev/${prodLink}/prize_box.png`;
const logo = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/dev/${shopLink}/logo.png`;
const boxModal = validShops.includes(shopLink) ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/dev/${shopLink}/box_modal.png` : "assets/box_modal.png";
const boxCoverUrl = validShops.includes(shopLink) ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/dev/${shopLink}/box_cover.png` : "assets/header_box.png";
const boxBodyUrl = validShops.includes(shopLink) ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/dev/${shopLink}/box_body.png` : "assets/body_box.png";

document.addEventListener("DOMContentLoaded", async function () {
  //Картинки

  document.getElementById("mainProd").src = prodImageUrl;
  document.getElementById("logo").src = logo;
  document.getElementById("lastProd").src = prizeBoxUrl;
  document.getElementById("fullProd").src = prizeBoxUrl;
  document.getElementById("box_modal").src = boxModal;
  // Кінець картинок

  const browserLang = navigator.language.split("-")[0];
  const supportedLangs = [
    "en",
    "ru",
    "fr",
    "es",
    "it",
    "uk",
    "fi",
    "nl",
    "pl",
    "sl",
    "sk",
    "de",
    "sr",
    "cs",
    "da",
    "lb",
    "tr",
    "no",
    "hu",
    "el",
    "sv",
    "lt",
    "lv",
    "ro",
    "hy",
    "bg",
    "az",
    "mk",
    "ar",
    "he",
  ];
  const savedLang = localStorage.getItem("lang");

  let lang =
    savedLang || (supportedLangs.includes(browserLang) ? browserLang : "en");
  localStorage.setItem("lang", lang);

  try {
    const response = await fetch("https://res.cloudinary.com/dnrody7ol/raw/upload/v1740748037/json/translations.json"); // замінити на CDN
    const translations = await response.json();

    if (!translations[lang]) {
      console.warn(
        `Language ${lang} not found in translations.json, defaulting to English`
      );
      lang = "en";
    }

    const texts = translations[lang];

    const commentInput = document.getElementById("commentBody");
    if (commentInput) {
      commentInput.placeholder = texts.placeholder;
    }

    if (texts) {
      for (const [id, text] of Object.entries(texts)) {
        let element = document.getElementById(id);
        if (element) {
          element.innerHTML = text
            .replace(/\${prod}/g, prod)
            .replace(/\${shop}/g, shop)
            .replace(/\${price}/g, price)
            .replace(/\${shopLink}/g, shopLink);
        }
      }

      let questions = texts.questions.map((q) =>
        q
          .replace(/\${prod}/g, prod)
          .replace(/\${shop}/g, shop)
          .replace(/\${country}/g, country)
      );

      let currentQuestionIndex = 0;
      const questionText = document.getElementById("questionText");
      const questionNumber = document.getElementById("questionsNmb");
      const mainSection = document.getElementById("main-section");
      const commentsSection = document.getElementById("commentsSection");
      const footer = document.getElementById("footer");
      const boxSection = document.getElementById("box-section");
      const verify = document.getElementById('verification')
      const loadingImage = document.querySelector("#verification img");
      const boxCont = document.getElementById('boxCont')
      const btnCont = document.getElementById('btnCont')

      questionText.textContent = questions[0];
      questionNumber.textContent = texts.questionsNmb.replace("1", "1");

      document.querySelectorAll(".answerBtn").forEach((button) => {
        button.addEventListener("click", function () {
          currentQuestionIndex++;
          if (currentQuestionIndex < questions.length) {
            questionNumber.textContent = `${texts.questionsNmb.replace(
              "1",
              currentQuestionIndex + 1
            )}`;
            questionText.textContent = questions[currentQuestionIndex];
            questionText.style.transition = "opacity 0.3s ease";
            questionText.style.opacity = "0";
            questionNumber.style.transition = "opacity 0.3s ease";
            questionNumber.style.opacity = "0";
            btnCont.style.transition = "opacity 0.3s ease";
            btnCont.style.opacity = "0";

            setTimeout(() => {
              questionText.textContent = questions[currentQuestionIndex];
              questionText.style.transform = "rotate(-10deg)";
              questionText.style.opacity = "0";
              questionNumber.style.transform = "rotate(-10deg)";
              questionNumber.style.opacity = "0";
              btnCont.style.transform = "rotate(0deg)";
              btnCont.style.opacity = "0";
          
              setTimeout(() => {
                questionText.style.transition = "transform 0.5s, opacity 0.5s";
                questionText.style.transform = "rotate(0deg)";
                questionText.style.opacity = "1";
                questionNumber.style.transition = "transform 0.5s, opacity 0.5s";
                questionNumber.style.transform = "rotate(0deg)";
                questionNumber.style.opacity = "1";
                btnCont.style.transition = "transform 0.5s, opacity 0.5s";
                btnCont.style.transform = "rotate(0deg)";
                btnCont.style.opacity = "1";
              }, 50);
          
            }, 250);
          } else {
            mainSection.style.display = "none";
            commentsSection.style.display = "none";
            footer.style.display = "none";
            boxSection.style.display = "block";
            loadingImage.style.animation = "spin 1s linear infinite";

            const listItems = document.querySelectorAll("ul .result");

            listItems.forEach((item, index) => {
              item.style.opacity = "0";
              item.style.transition = "opacity 0.5s";

              setTimeout(() => {
                item.style.opacity = "1";
              }, index * 1500);
            });
            
            setTimeout(() => {
               verify.style.display = "none";
               boxCont.style.display = 'block';
            }, 6000)
           
          }
        });
      });
    }
  } catch (error) {
    console.error("Error loading translations:", error);
  }

  loadComments(lang);
});

async function loadComments(lang) {
  try {
    const response = await fetch("https://res.cloudinary.com/dnrody7ol/raw/upload/v1740748167/json/comment_text.json"); // замінити на CDN
    const translations = await response.json();

    if (!translations[lang]) {
      console.warn(
        `Language ${lang} not found in translation, defaulting to English`
      );
      lang = "en";
    }

    const texts = translations[lang];

    if (!texts || !texts.comments) {
      console.error(`Missing comments for language ${lang}`);
      return;
    }

    const commentsContainer = document.getElementById("commentsContainer");
    commentsContainer.innerHTML = "";

    document.getElementById("commentsHeader").textContent =
      texts.commentsHeader;

    window.commentTranslations = {
      like: texts.like,
      commentLang: texts.commentLang,
    };

    texts.comments.forEach((comment) => {
      const formattedComment = {
        ...comment,
        text: comment.text.replace(/\${shop}/g, shop),
        image: comment.image
          ? comment.image
              .replace(/\${cloudName}/g, cloudName)
              .replace(/\${prodLink}/g, prodLink)
          : null,
        avatar: comment.avatar
          ? comment.avatar
              .replace(/\${cloudName}/g, cloudName)
              .replace(/\${shopLink}/g, shopLink)
          : null,
        replies: comment.replies
          ? comment.replies.map((reply) => ({
              ...reply,
              text: reply.text.replace(/\${shop}/g, shop),
              username: reply.username.replace(/\${shop}/g, shop),
              image: reply.image
                ? reply.image
                    .replace(/\${cloudName}/g, cloudName)
                    .replace(/\${prodLink}/g, prodLink)
                : null,
              avatar: reply.avatar
                ? reply.avatar
                    .replace(/\${cloudName}/g, cloudName)
                    .replace(/\${shopLink}/g, shopLink)
                : null,
            }))
          : [],
      };

      const commentElement = createCommentHTML(formattedComment);
      commentsContainer.appendChild(commentElement);
    });
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}

function createCommentHTML(comment) {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment-block");
  commentDiv.innerHTML = `
      <div class="comments_item">
          <div class="comment_images">
              <img src="${comment.avatar}" alt="${
    comment.username
  }" class="comment-avatar">
          </div>
          <div class="comment_text_wrapp">
              <div class="person_name"><p>${comment.username}</p></div>
              <div class="comments_text"><p>${comment.text}</p></div>
              ${
                comment.image
                  ? `<img src="${comment.image}" alt="comment image" class="comment-image">`
                  : ""
              }
          </div>
          <div class="emoji_evaluation">
              <img src="assets/like.png" alt="like icon" class="like-icon">
              <p class="like-count">${comment.likes}</p>
          </div>
      </div>
      <div class="evaluation_unit">
          <p>${comment.time}</p>
          <button class="like-button">${
            window.commentTranslations.like
          }</button>
          <p>${window.commentTranslations.commentLang}</p>
      </div>
      <div class="first_response"></div>
  `;

  const likeButton = commentDiv.querySelector(".like-button");
  const likeCount = commentDiv.querySelector(".like-count");
  let isLiked = false;

  likeButton.addEventListener("click", function () {
    let currentLikes = parseInt(likeCount.textContent, 10);
    if (isLiked) {
      likeCount.textContent = currentLikes - 1;
      likeButton.classList.remove("liked");
    } else {
      likeCount.textContent = currentLikes + 1;
      likeButton.classList.add("liked");
    }
    isLiked = !isLiked;
  });

  const repliesContainer = commentDiv.querySelector(".first_response");
  if (comment.replies) {
    comment.replies.forEach((reply) => {
      repliesContainer.appendChild(createCommentHTML(reply));
    });
  }

  return commentDiv;
}

function addCommentToPage(comment, saveToStorage) {
  const commentsContainer = document.getElementById("commentsContainer");
  const commentElement = createCommentHTML(comment);
  commentsContainer.prepend(commentElement);

  if (saveToStorage) {
    saveCommentToLocalStorage(comment);
  }
}

function saveCommentToLocalStorage(comment) {
  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  comments.unshift(comment);
  localStorage.setItem("comments", JSON.stringify(comments));
}

document
  .getElementById("commentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const commentText = document.getElementById("commentBody").value.trim();
    if (commentText === "") return;

    const newComment = {
      username: "New User",
      avatar: "assets/photo_plug.png",
      text: commentText,
      likes: 0,
      time: "Just now",
      replies: [],
    };

    addCommentToPage(newComment, true);
    document.getElementById("commentBody").value = "";
  });

//FAQ
//Open FAQ
$(".faq_icon_open").on("click", function () {
  $("#faq_cont").fadeIn(300);
  $(".faq_icon_open").fadeOut();
});
//Close FAQ
$(".close_faq_icon").on("click", function () {
  $("#faq_cont").fadeOut(300);
  $(".faq_icon_open").fadeIn();
});
//поведение faq
$(".faq_question").on("click", function () {
  var clickedHeader = $(this);
  var clickedText = clickedHeader.next(".faq_answer");

  // Закрыть все остальные блоки, кроме текущего
  $(".faq_question").not(clickedHeader).removeClass("active focus_accordion");
  $(".faq_answer").not(clickedText).slideUp();

  // Переключить состояние текущего блока
  clickedHeader.toggleClass("active").toggleClass("focus_accordion");
  clickedText.slideToggle();
});

// Privacy Policy

$(".close_modal").on("click", function () {
  $("#visib-modal-first").fadeOut(600);
});
$(".close_second").on("click", function () {
  $("#visib-modal-second").fadeOut(600);
});
$("#openPolicy").on("click", function () {
  $(".pp-wrap").fadeIn(300);
});
$("#close-policy").on("click", function () {
  $(".pp-wrap").fadeOut(300);
});

async function applyShopStyles() {
  try {
    const response = await fetch("https://res.cloudinary.com/dnrody7ol/raw/upload/v1740748048/json/styles.json");
    const stylesData = await response.json();

    const shopKey = shop.toLowerCase().replace(/\s+/g, "");

    const stylesToApply = stylesData[shopKey] || stylesData["default"];

    Object.entries(stylesToApply).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  } catch (error) {
    console.error("Помилка завантаження стилів:", error);
  }
}

document.addEventListener("DOMContentLoaded", applyShopStyles);


// Коробки

document.addEventListener("DOMContentLoaded", function () {
  const giftBoxContainer = document.getElementById("gift-box-container");
  const boxCount = 12;
  let emptyBoxClicked = false; 
  let modalShown = false;
  let attemptsLeft = 3;

  const boxTemplate = `
      <div class="element-box">
          <div class="box-cover"><img src="${boxCoverUrl}" alt="head box"></div>
          <div class="shadow-box"><img src="assets/shadow_box.png" alt="shadow"></div>
          <div class="prize"><img src="${prizeBoxUrl}" alt="prize box"></div>
          <div class="box-body"><img src="${boxBodyUrl}" alt="body box"></div>
      </div>
  `;

  for (let i = 0; i < boxCount; i++) {
      giftBoxContainer.innerHTML += boxTemplate;
  }

  document.querySelectorAll(".element-box").forEach(box => {
      box.addEventListener("click", function () {
          let cover = this.querySelector(".box-cover");
          let prize = this.querySelector(".prize");

          if (attemptsLeft > 0) {
              if (!emptyBoxClicked && !cover.classList.contains("open-box")) {
                  cover.classList.add("open-box");
                  emptyBoxClicked = true;
                  attemptsLeft--;

                  setTimeout(() => {
                      document.getElementById("visib-modal-second").style.display = "block";
                      modalShown = true;
                  }, 1800);
              } else if (emptyBoxClicked && modalShown) {
                  if (!cover.classList.contains("open-box")) {
                      cover.classList.add("open-box");
                      prize.classList.add("open-prize");

                      setTimeout(() => {
                        document.getElementById("fullscreen_prize_visib").style.display = "block";
                    
                        const fullProd = document.getElementById("fullProd");
                        let duration = 200; // 2.5 секунди
                        let start
                    
                        function rotate(timestamp) {
                            if (!start) start = timestamp;
                            let progress = timestamp - start;
                            let rotation = Math.min((progress / duration) * 1440, 1440);  
                    
                            fullProd.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
                    
                            if (progress < duration) {
                                requestAnimationFrame(rotate);
                            }
                        }

                        requestAnimationFrame(rotate);

                          setTimeout(() => {
                              document.getElementById("fullscreen_prize_visib").style.display = "none";
                              document.getElementById("visib-modal-third").style.display = "block";
                              document.getElementById("fullProd").classList.remove("active");
                          }, 3000);
                      }, 2300);

                      document.querySelectorAll(".element-box").forEach(box => box.removeEventListener("click", arguments.callee));
                  }
              }
          }
      });
  });

  document.querySelectorAll(".close_modal").forEach(button => {
      button.addEventListener("click", function () {
          document.getElementById("visib-modal-first").style.display = "none";
          document.getElementById("visib-modal-second").style.display = "none";
          document.getElementById("visib-modal-third").style.display = "none";
      });
  });
});
