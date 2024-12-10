document.getElementById('translateBtn').addEventListener('click', async () => {
    const text = document.getElementById('textInput').value;
    const sourceLang = document.getElementById('sourceLang').value;
    const targetLang = document.getElementById('targetLang').value;

    const resultElement = document.getElementById('result');
    resultElement.textContent = '翻訳中...'; // 状態表示

    try {
        // APIリクエストを送信
        const response = await fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, sourceLang, targetLang }),
        });

        if (!response.ok) {
            // レスポンスエラー処理
            const errorData = await response.json();
            if (errorData.message) {
                throw new Error(`サーバーエラー: ${errorData.message}`);
            } else {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
            }
        }

        // 成功した場合、データを取得して表示
        const data = await response.json();
        resultElement.textContent = data.translation;

    } catch (error) {
        // エラーの詳細を表示
        if (error.name === 'TypeError') {
            // ネットワークエラーや接続失敗の場合
            resultElement.textContent = 'エラー: ネットワークに接続できません。';
        } else {
            // その他のエラー
            resultElement.textContent = `エラー: ${error.message}`;
        }
    }
});
