from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from google import genai

app = Flask(__name__)
CORS(app)

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)


@app.route("/")
def home():
    return "Question AI Backend is running!"


@app.route("/generate", methods=["POST"])
def generate():

    try:

        # Get form data
        subject = request.form.get("subject", "")
        chapter = request.form.get("chapter", "")
        question_type = request.form.get("questionType", "")
        board = request.form.get("board", "")
        start_year = request.form.get("startYear", "")
        end_year = request.form.get("endYear", "")

        # Get uploaded files
        files = request.files.getlist("files")

        if not files:
            return jsonify({
                "error": "No question paper uploaded."
            }), 400


        prompt = f"""
You are Question AI, an AI assistant that analyzes
Bangladesh board examination question papers.

The user wants questions with these preferences:

Subject: {subject}
Chapter: {chapter}
Question Type: {question_type}
Board: {board}
Year Range: {start_year} to {end_year}

Analyze the uploaded question paper.

Find questions matching the user's selected
subject, chapter, question type, board and year.

Return the useful matching questions.

For each question include:

Question:
Chapter:
Topic:
Question Type:
Board:
Year:

If the exact chapter or information cannot be identified,
make the best reasonable classification.

Do not invent questions that are not present in the
uploaded paper.
"""


        # Read uploaded files
        contents = [prompt]

        for file in files:

            file_bytes = file.read()

            if not file_bytes:
                continue

            mime_type = file.mimetype or "application/octet-stream"

            uploaded_part = {
                "inline_data": {
                    "mime_type": mime_type,
                    "data": file_bytes
                }
            }

            contents.append(uploaded_part)


        if len(contents) == 1:
            return jsonify({
                "error": "Uploaded files could not be read."
            }), 400


        # Ask Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents
        )


        result = response.text


        return jsonify({
            "result": result
        })


    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    port = int(
        os.environ.get("PORT", 5000)
    )

    app.run(
        host="0.0.0.0",
        port=port
    )
