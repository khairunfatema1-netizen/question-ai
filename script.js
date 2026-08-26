const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

const generateButton = document.getElementById("generateButton");
const buttonText = document.getElementById("buttonText");

const status = document.getElementById("status");
const statusText = document.getElementById("statusText");

const results = document.getElementById("results");
const questionContainer = document.getElementById("questionContainer");
const resultInfo = document.getElementById("resultInfo");


/* ==============================
   BACKEND URL
   ============================== */

const BACKEND_URL = "PASTE-YOUR-BACKEND-RENDER-URL-HERE";


/* ==============================
   FILE LIST
   ============================== */

fileInput.addEventListener("change", () => {

    fileList.innerHTML = "";

    const files = Array.from(fileInput.files);

    if (files.length === 0) {
        return;
    }

    files.forEach(file => {

        const item = document.createElement("div");

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


/* ==============================
   GENERATE QUESTIONS
   ============================== */

generateButton.addEventListener("click", async () => {

    const files = Array.from(fileInput.files);

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


    /* VALIDATION */

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


    /* LOADING */

    generateButton.disabled = true;

    buttonText.textContent = "AI is analyzing...";

    status.classList.remove("hidden");

    results.classList.add("hidden");

    statusText.textContent =
        "Reading your question paper...";


    try {

        /*
        FormData allows us to send the
        actual uploaded files to Flask.
        */

        const formData = new FormData();

        files.forEach(file => {
            formData.append("files", file);
        });

        formData.append("subject", subject);
        formData.append("chapter", chapter);
        formData.append("questionType", questionType);
        formData.append("board", board);
        formData.append("startYear", startYear);
        formData.append("endYear", endYear);


        statusText.textContent =
            "AI is reading the questions...";


        const response = await fetch(
            `${BACKEND_URL}/generate`,
            {
                method: "POST",
                body: formData
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText || `Server error: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (data.error) {
            throw new Error(data.error);
        }


        statusText.textContent =
            "Preparing exam paper layout...";


        /* SHOW RESULT */

        results.classList.remove("hidden");

        resultInfo.textContent =
            "AI-generated question paper";


        questionContainer.innerHTML = "";


        /*
        Backend should return HTML
        formatted like an actual exam paper.
        */

        if (data.html) {

            questionContainer.innerHTML =
                data.html;

        } else if (data.result) {

            questionContainer.innerHTML =
                `
                <div class="question">
                    ${formatText(data.result)}
                </div>
                `;

        } else {

            throw new Error(
                "No question paper was returned by the AI."
            );

        }


    } catch (error) {

        console.error(error);

        alert(
            "AI connection failed.\n\n" +
            error.message
        );

    }


    /* RESET */

    status.classList.add("hidden");

    generateButton.disabled = false;

    buttonText.textContent =
        "🔍 Find Questions";

});


/* ==============================
   FORMAT TEXT
   ============================== */

function formatText(text) {

    if (!text) {
        return "No result received.";
    }

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

}
