import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function Popup() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    chrome.storage.local.get(["analysisResult"], (data) => {
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

  return (
    <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
      <h2>解析結果</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{result?.choices?.[0]?.message?.content || "データなし"}</pre>
    </div>
  );
}

ReactDOM.render(<Popup />, document.getElementById("root"));
