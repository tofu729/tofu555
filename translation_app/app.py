from flask import Flask, render_template, request, jsonify
import os
import requests

app = Flask(__name__)

# APIキーは環境変数で管理
API_KEY = os.getenv("TRANSLATE_API_KEY")
API_URL = "https://translation.googleapis.com/language/translate/v2"



@app.route('/')
def index():
    return render_template('index.html')


    

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get("text")
    source_lang = data.get("source_lang")
    target_lang = data.get("target_lang")

    if not text or not source_lang or not target_lang:
        return jsonify({"error": "すべてのフィールドを入力してください"}), 400

    # APIリクエストを構築
    params = {
        "q": text,
        "source": source_lang,
        "target": target_lang,
        "format": "text",
        "key": API_KEY
    }
    
    response = requests.post(API_URL, params=params)
    if response.status_code == 200:
        translated_text = response.json()["data"]["translations"][0]["translatedText"]
        return jsonify({"translated_text": translated_text})
    else:
        return jsonify({"error": "翻訳に失敗しました。再試行してください。"}), 500

if __name__ == '__main__':
    app.run(debug=True)
