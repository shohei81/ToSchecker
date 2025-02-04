// background.js (Manifest V3 の Service Worker として実装)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOS_TEXT') {
      console.log("📩 受信した利用規約テキスト:", message.payload);
  
      analyzeTermsOfService(message.payload)
        .then(apiResponse => {
          console.log("📨 LLM API のレスポンス:", apiResponse);
  
          if (!apiResponse || Object.keys(apiResponse).length === 0) {
            console.error("❌ APIのレスポンスが空です！");
          }
  
          // `chrome.storage.local.set()` のデバッグ
          console.log("📝 `chrome.storage.local.set()` にデータを保存する:", apiResponse);
          chrome.storage.local.set({ analysisResult: apiResponse }, () => {
            console.log("✅ 解析結果を保存しました:", apiResponse);
  
            // 保存直後にデータを確認
            chrome.storage.local.get(["analysisResult"], data => {
              console.log("🧐 `chrome.storage.local.get()` 確認:", data);
            });
          });
  
          sendResponse({ success: true, data: apiResponse });
        })
        .catch(error => {
          console.error("⚠️ APIリクエストエラー:", error);
          sendResponse({ success: false, error: error.toString() });
        });
        
      // 非同期処理のため true を返す
      return true;
    }
  });
  
  /**
   * LLM API（例: OpenAI ChatCompletion API）を呼び出して利用規約を解析する関数
   */
  async function analyzeTermsOfService(text) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = ''; // 🔥 ここに正しいAPIキーをセットする
  
    const requestData = {
      model: "gpt-4o-mini",
      messages: [
        { "role": "system", "content": "あなたは利用規約の解析の専門家です。" },
        { "role": "user", "content": text }
      ],
      max_tokens: 500,
      temperature: 0.7,
    };
  
    console.log("🚀 LLM API に送信するデータ:", requestData);
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        console.error("⚠️ API エラー:", response.status, response.statusText);
        const errorData = await response.json();
        console.error("🛑 詳細なエラーレスポンス:", errorData);
      throw new Error(`LLM API エラー: ${response.statusText}`);
      throw new Error(`LLM API エラー: ${response.statusText}`);
        throw new Error(`LLM API エラー: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("📨 LLM APIのレスポンス:", data);
      return data;
    } catch (error) {
      console.error("🔥 APIリクエスト失敗:", error);
      return null; // 🔥 ここで `null` を返すと `chrome.storage.local.set()` が動作しない
    }
  }  
  