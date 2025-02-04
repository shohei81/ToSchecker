import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./popup.css";

function Popup() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    chrome.storage.local.get(["analysisResult"], data => {
      console.log("🧐 ポップアップで取得した解析結果:", data);

      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError);
      } else {
        setResult(data.analysisResult);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error">エラー: {error.toString()}</div>;
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h2>🔍 解析結果</h2>
        <button className="close-btn" onClick={() => window.close()}>✖</button>
      </div>
      <div className="popup-content">
        <pre>{result?.choices?.[0]?.message?.content || "データなし"}</pre>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Popup />);
