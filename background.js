// background.js (Manifest V3 の Service Worker として実装)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOS_TEXT') {
      const tosText = message.payload;
      
      analyzeTermsOfService(tosText)
        .then(apiResponse => {
          console.log("LLM APIからの応答:", apiResponse);
          // 解析結果を chrome.storage に保存
          chrome.storage.local.set({ analysisResult: apiResponse }, () => {
            console.log("解析結果を保存しました。");
          });
          // sendResponse でも結果を返す
          sendResponse({ success: true, data: apiResponse });
        })
        .catch(error => {
          console.error("解析エラー:", error);
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
    const apiKey = 'YOUR_OPENAI_API_KEY'; // ※本番ではセキュアな方法で管理すること
  
    const requestData = {
      model: "gpt-4", // または利用するモデル名
      messages: [
        { "role": "system", "content": "あなたは利用規約の解析の専門家です。利用規約の文章から消費者に不利な条項を見つけ、簡潔に説明してください。" },
        { "role": "user", "content": text }
      ],
      max_tokens: 500,
      temperature: 0.7,
    };
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestData)
    });
  
    if (!response.ok) {
      throw new Error(`LLM API エラー: ${response.statusText}`);
    }
    return await response.json();
  }
  