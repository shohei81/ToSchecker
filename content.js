// content.js
(() => {
    const maxTextLength = 5000;

    // ページ内のテキストを取得する関数
    const extractText = () => {
        let textContent = '';

        // 試しに <article>, <section>, <p> から取得
        const elements = document.querySelectorAll('article, section, p');
        
        elements.forEach(el => {
            textContent += el.innerText + '\n';
        });

        // 文字数制限
        if (textContent.length > maxTextLength) {
            textContent = textContent.substring(0, maxTextLength) + '...';
        }

        return textContent;
    };

    // テキストを background script に送信
    const sendTextToBackground = (text) => {
        chrome.runtime.sendMessage({
            type: 'TOS_TEXT',
            payload: text
        });
    };

    // メイン処理
    const tosText = extractText();
    if (tosText) {
        sendTextToBackground(tosText);
    }

    // ログの確認
    const extractedText = extractText();
    console.log("取得したテキスト:", extractedText);

})();
