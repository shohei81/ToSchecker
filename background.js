// background.js (Manifest V3の場合、Service Workerとして登録)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOS_TEXT') {
      const tosText = message.payload;
      
      // LLM APIに利用規約のテキストを送信して解析結果を取得
      analyzeTermsOfService(tosText)
        .then(apiResponse => {
          console.log("LLM APIからの応答:", apiResponse);
          // 必要に応じて、ここで結果をchrome.storage等に保存し、popup等で参照できるようにする
          sendResponse({ success: true, data: apiResponse });
        })
        .catch(error => {
          console.error("解析エラー:", error);
          sendResponse({ success: false, error: error.toString() });
        });
        
      // 非同期でのレスポンスを許可
      return true;
    }
  });
  
  /**
   * LLM API（例: OpenAI ChatCompletion API）を呼び出して利用規約を解析する関数
   * @param {string} text 利用規約のテキスト
   * @returns {Promise<object>} APIからの解析結果
   */
  async function analyzeTermsOfService(text) {
    // ※以下はOpenAI APIの例です。利用するLLMに合わせてエンドポイントやパラメータを変更してください。
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = 'YOUR_OPENAI_API_KEY'; // セキュリティに注意！（本番ではより安全な方法で管理すること）
  
    // LLMに渡すリクエストペイロードの組み立て
    const requestData = {
      model: "gpt-4", // または適切なモデル名
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
    const data = await response.json();
    return data;
  }
  