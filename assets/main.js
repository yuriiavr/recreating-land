document.addEventListener("DOMContentLoaded", async function () {
  const browserLang = navigator.language.split("-")[0];
  const supportedLangs = ["en", "ru", "fr", "es", "it", "uk", "fi", "nl", "pl", "sl", "sk", "de", "sr", "cs", "da", "lb", "tr", "no", "hu", "el", "sv", "lt", "lv", "ro", "hy", "bg", "az", "mk", "ar", "he"];
  const savedLang = localStorage.getItem("lang");

  let lang = savedLang || (supportedLangs.includes(browserLang) ? browserLang : "en");
  localStorage.setItem("lang", lang);

  try {
    const response = await fetch("assets/translations.json"); // замінити на CDN
    const translations = await response.json();

    if (!translations[lang]) {
      console.warn(`Language ${lang} not found in translations.json, defaulting to English`);
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
            .replace(/\${shopLink}/g, shopLink)
        }
      }

      let questions = texts.questions.map((q) =>
        q.replace(/\${prod}/g, prod).replace(/\${shop}/g, shop).replace(/\${country}/g, country)
      );

      let currentQuestionIndex = 0;
      const questionText = document.getElementById("questionText");
      const questionNumber = document.getElementById("questionsNmb");
      const mainSection = document.getElementById("main-section");

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
          } else {
            mainSection.style.display = "none";
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
    const response = await fetch("https://eae44083.comment-text-for-land.pages.dev/comment_text.json"); // замінити на CDN
    const translations = await response.json();

    if (!translations[lang]) {
      console.warn(`Language ${lang} not found in translation, defaulting to English`);
      lang = "en";
    }

    const texts = translations[lang];

    if (!texts || !texts.comments) {
      console.error(`Missing comments for language ${lang}`);
      return;
    }

    const commentsContainer = document.getElementById("commentsContainer");
    commentsContainer.innerHTML = "";

    document.getElementById("commentsHeader").textContent = texts.commentsHeader;

    window.commentTranslations = {
      like: texts.like,
      commentLang: texts.commentLang
    };

    texts.comments.forEach(comment => {
      const formattedComment = {
        ...comment,
        text: comment.text
          .replace(/\${shop}/g, shop),
        replies: comment.replies
          ? comment.replies.map(reply => ({
              ...reply,
              text: reply.text
                .replace(/\${shop}/g, shop),
              username: reply.username.replace(/\${shop}/g, shop)
            }))
          : []
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
              <img src="${comment.avatar}" alt="${comment.username}" class="comment-avatar">
          </div>
          <div class="comment_text_wrapp">
              <div class="person_name"><p>${comment.username}</p></div>
              <div class="comments_text"><p>${comment.text}</p></div>
              ${comment.image ? `<img src="${comment.image}" alt="comment image" class="comment-image">` : ""}
          </div>
          <div class="emoji_evaluation">
              <img src="assets/like.png" alt="like icon" class="like-icon">
              <p class="like-count">${comment.likes}</p>
          </div>
      </div>
      <div class="evaluation_unit">
          <p>${comment.time}</p>
          <button class="like-button">${window.commentTranslations.like}</button>
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
      comment.replies.forEach(reply => {
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

document.getElementById("commentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const commentText = document.getElementById("commentBody").value.trim();
  if (commentText === "") return;

  const newComment = {
      username: "New User",
      avatar: "assets/photo_plug.png",
      text: commentText,
      likes: 0,
      time: "Just now",
      replies: []
  };

  addCommentToPage(newComment, true);
  document.getElementById("commentBody").value = ""; 
});

//FAQ
//Open FAQ
$('.faq_icon_open').on('click', function(){
  $('#faq_cont').fadeIn(300);
  $('.faq_icon_open').fadeOut();
})
//Close FAQ
$('.close_faq_icon').on('click', function(){
  $('#faq_cont').fadeOut(300);
  $('.faq_icon_open').fadeIn();
})
//поведение faq
$('.faq_question').on('click', function(){
  var clickedHeader = $(this);
  var clickedText = clickedHeader.next('.faq_answer');

  // Закрыть все остальные блоки, кроме текущего
  $('.faq_question').not(clickedHeader).removeClass('active focus_accordion');
  $('.faq_answer').not(clickedText).slideUp();

  // Переключить состояние текущего блока
  clickedHeader.toggleClass('active').toggleClass('focus_accordion');
  clickedText.slideToggle();
});

// Privacy Policy

$('.close_modal').on('click', function(){
  $('#visib_modal_first').fadeOut(600);
});
$('.close_second').on('click', function(){
  $('#visib_modal_second').fadeOut(600);
});
$('#openPolicy').on('click', function(){
  $('.pp-wrap').fadeIn(300);
})
$('#close-policy').on('click', function(){
  $('.pp-wrap').fadeOut(300);
})