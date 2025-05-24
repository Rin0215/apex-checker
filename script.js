document.getElementById("scoreForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // 入力値の取得
  const rankScore = parseInt(document.getElementById("rank").value);
  const top5 = parseInt(document.getElementById("top5").value);
  const wins = parseInt(document.getElementById("wins").value);
  const games = parseInt(document.getElementById("games").value);
  const kd = parseFloat(document.getElementById("kd").value);
  const avgDamage = parseFloat(document.getElementById("avgDamage").value);

  // 入力バリデーション
  if (games <= 0) {
    alert("合計ゲーム数は1以上で入力してください");
    return;
  }
  if (top5 < 0 || wins < 0 || kd < 0 || avgDamage < 0) {
    alert("すべての値は0以上の数値で入力してください");
    return;
  }
  if (wins > top5) {
    alert("勝利数はトップ5回数以下でなければなりません");
    return;
  }
  if (top5 > games) {
    alert("トップ5回数は合計ゲーム数以下でなければなりません");
    return;
  }

  // 各項目のスコア計算
  const top5Rate = (top5 / games) * 100 * 0.3;  // 30%の重み
  const winRate = (wins / games) * 100 * 0.4;  // 40%の重み
  const kdScore = Math.log2(kd + 1) * 35;      // K/Dは対数スケールで
  const damageScore = Math.sqrt(avgDamage) * 3; // ダメージは平方根スケールで

  // ゲーム数によるペナルティ
  let penalty = 0;
  if (games < 20) penalty = 30;
  else if (games < 50) penalty = 15;

  // 総合スコア計算
  const totalScore = rankScore + top5Rate + winRate + kdScore + damageScore - penalty;
  const roundedScore = Math.round(totalScore);

  // ランク評価
  let grade = '';
  let gradeClass = '';
  if (roundedScore >= 400) { grade = 'SSS+++'; gradeClass = 'sss-plus'; }
  else if (roundedScore >= 380) { grade = 'SSS++'; gradeClass = 'sss-plus'; }
  else if (roundedScore >= 360) { grade = 'SSS+'; gradeClass = 'sss-plus'; }
  else if (roundedScore >= 340) { grade = 'SSS'; gradeClass = 'sss'; }
  else if (roundedScore >= 320) { grade = 'SS+'; gradeClass = 'ss'; }
  else if (roundedScore >= 300) { grade = 'SS'; gradeClass = 'ss'; }
  else if (roundedScore >= 280) { grade = 'S+'; gradeClass = 's'; }
  else if (roundedScore >= 260) { grade = 'S'; gradeClass = 's'; }
  else if (roundedScore >= 240) { grade = 'A+'; gradeClass = 'a'; }
  else if (roundedScore >= 220) { grade = 'A'; gradeClass = 'a'; }
  else if (roundedScore >= 200) { grade = 'B'; gradeClass = 'b'; }
  else if (roundedScore >= 170) { grade = 'C'; gradeClass = 'c'; }
  else if (roundedScore >= 140) { grade = 'D'; gradeClass = 'd'; }
  else if (roundedScore >= 100) { grade = 'E'; gradeClass = 'e'; }
  else { grade = 'F'; gradeClass = 'f'; }

  // スコアとランクを保存する
  const scores = JSON.parse(localStorage.getItem('scores')) || []; // 今までの履歴を取得（なければ空配列）
  scores.push({ score: roundedScore, grade: grade });              // 新しい結果を追加
  localStorage.setItem('scores', JSON.stringify(scores));          // 保存する


  // 結果表示HTML（共有部分のみ抜粋）の部分を以下のように修正
  const resultHTML = `
    <div class="${gradeClass}">
      あなたのスコア: <strong>${roundedScore}</strong><br>
      評価ランク: <strong>${grade}</strong>
    </div>
    <div style="margin-top:10px;font-size:14px;">
      [内訳] ランク:${rankScore} | トップ5:${Math.round(top5Rate)} | 勝率:${Math.round(winRate)}<br>
      K/D:${Math.round(kdScore)} | ダメージ:${Math.round(damageScore)} | ペナルティ:-${penalty}
    </div>
    <div class="share-section">
      <span class="share-label">共有</span>
      <div class="share-buttons">
        <a href="https://twitter.com/share?url=${encodeURIComponent(window.location.href)}&text=私のApexスコアは${roundedScore}点（${grade}ランク）でした！&hashtags=ApexChecker" 
          class="share-icon share-x" target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png" alt="X">
          <span class="tooltip-text">Xにシェア</span>
        </a>
        <a href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=私のApexスコアは${roundedScore}点（${grade}ランク）でした！" 
          class="share-icon share-line" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/line.svg" alt="LINE">
          <span class="tooltip-text">LINEにシェア</span>
        </a>
        <div class="share-icon share-copy" onclick="copyToClipboard()">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/clipboard.svg" alt="Copy">
          <span class="tooltip-text">クリップボードにコピー</span>
        </div>
      </div>
    </div>
  `;
  document.getElementById("result").innerHTML = resultHTML;

  showAggregate(); // 保存されたスコアを集計して表示する


  // クリップボードコピー関数
  function copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    // ツールチップ表示
    const tooltip = document.querySelector('.tooltiptext');
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
    
    setTimeout(() => {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    }, 2000);
  }

  function showAggregate() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    if (scores.length === 0) return;

    const avg = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);

    const gradeCounts = {};
    for (const s of scores) {
      gradeCounts[s.grade] = (gradeCounts[s.grade] || 0) + 1;
    }

    let gradeSummary = Object.entries(gradeCounts)
      .map(([g, c]) => `${g}: ${c}回`)
      .join(', ');

    const summaryHTML = `
      <div style="margin-top: 20px; font-size: 14px;">
        <strong>これまでの平均スコア:</strong> ${avg}<br>
        <strong>ランク分布:</strong> ${gradeSummary}
      </div>
    `;
    document.getElementById("result").innerHTML += summaryHTML;
  }

});