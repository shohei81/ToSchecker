// popup.js
const { useState, useEffect } = React;

function Popup() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ポップアップがマウントされたタイミングで解析結果を取得
  useEffect(() => {
    chrome.storage.local.get(['analysisResult'], (data) => {
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError);
      } else {
        setResult(data.analysisResult);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error.toString()}</div>;
  }

  if (!result) {
    return <div>解析結果がまだありません。ページをリロードするか、利用規約をもう一度解析してください。</div>;
  }

  // 例: OpenAI API のレスポンス形式に合わせた表示（choices[0].message.content）
  const content =
    result.choices && result.choices.length > 0
      ? result.choices[0].message.content
      : "解析結果のフォーマットが不正です。";

  return (
    <div style={{ padding: '10px', fontFamily: 'sans-serif' }}>
      <h2>解析結果</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
    </div>
  );
}

// ReactDOM を使ってコンポーネントを描画
ReactDOM.render(<Popup />, document.getElementById('root'));
