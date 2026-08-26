```javascript
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

const generateButton =
    document.getElementById("generateButton");

const buttonText =
    document.getElementById("buttonText");

const status =
    document.getElementById("status");

const statusText =
    document.getElementById("statusText");

const results =
    document.getElementById("results");

const questionContainer =
    document.getElementById("questionContainer");

const resultInfo =
    document.getElementById("resultInfo");


/* FILE UPLOAD */

fileInput.addEventListener("change", () => {

    fileList.innerHTML = "";

    const files = Array.from(fileInput.files);

    if (files.length === 0) {
        return;
    }

    files.forEach(file => {

        const item =
            document.createElement("div");

        item.className = "file-item";

        const size =
            (file.size / 1024 / 1024).toFixed(2);

        item.innerHTML = `
            <span>📄 ${file.name}</span>
            <span class="file-size">${size} MB</span>
        `;

        fileList.appendChild(item);

    });

});


/* GENERATE */

generateButton.addEventListener("click", async () => {

    const files = fileInput.files;

    const subject =
        document.getElementById("subject").value;

    const chapter =
        document.getElementById("chapter").value;

    const questionType =
        document.getElementById("questionType").value;

    const board =
        document.getElementById("board").value;

    const startYear =
        document.getElementById("startYear").value;

    const endYear =
        document.getElementById("endYear").value;


    /* BASIC VALIDATION */

    if (files.length === 0) {

        alert("Please upload at least one question paper.");

        return;
    }

    if (!subject) {

        alert("Please select a subject.");

        return;
    }

    if (!chapter) {

        alert("Please select a chapter.");

        return;
    }


    /* SHOW LOADING */

    generateButton.disabled = true;

    buttonText.textContent =
        "AI is analyzing...";

    status.classList.remove("hidden");

    results.classList.add("hidden");


    /* DEMO LOADING */

    statusText.textContent =
        "Reading your question papers...";

    await wait(1500);

    statusText.textContent =
        "Finding matching questions...";

    await wait(1500);

    statusText.textContent =
        "Checking questions...";

    await wait(1500);

    statusText.textContent =
        "Final verification...";

    await wait(1000);


    /*
        DEMO RESULT

        Later this section will be replaced
        by the real AI API response.
    */

    showDemoResults(
        subject,
        chapter,
        questionType,
        board,
        startYear,
        endYear
    );


    status.classList.add("hidden");

    generateButton.disabled = false;

    buttonText.textContent =
        "🔍 Find Questions";

});


/* DEMO QUESTIONS */

function showDemoResults(
    subject,
    chapter,
    questionType,
    board,
    startYear,
    endYear
) {

    results.classList.remove("hidden");

    resultInfo.textContent =
        "Demo result — AI backend will be connected next.";

    questionContainer.innerHTML = "";


    const questions = [

        {
            question:
                "নিচের কোনটি একটি আয়নিক যৌগ?",

            options: [
                "CH₄",
                "NaCl",
                "CO₂",
                "H₂"
            ]
        },

        {
            question:
                "NaCl-এ কোন ধরনের রাসায়নিক বন্ধন থাকে?",

            options: [
                "সমযোজী বন্ধন",
                "আয়নিক বন্ধন",
                "ধাতব বন্ধন",
                "হাইড্রোজেন বন্ধন"
            ]
        },

        {
            question:
                "নিচের কোনটি ইলেকট্রন গ্রহণ করতে পারে?",

            options: [
                "ধাতু",
                "অধাতু",
                "নিষ্ক্রিয় গ্যাস",
                "সবগুলো"
            ]
        }

    ];


    questions.forEach((item, index) => {

        const question =
            document.createElement("div");

        question.className = "question";

        question.innerHTML = `

            <div class="question-number">
                ${index + 1}. ${item.question}
            </div>

            <div class="option">
                A. ${item.options[0]}
            </div>

            <div class="option">
                B. ${item.options[1]}
            </div>

            <div class="option">
                C. ${item.options[2]}
            </div>

            <div class="option">
                D. ${item.options[3]}
            </div>

        `;

        questionContainer.appendChild(question);

    });

}


/* WAIT FUNCTION */

function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(resolve, milliseconds);

    });

}
```
