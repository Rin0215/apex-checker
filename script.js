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

  // 結果表示
  document.getElementById("result").innerHTML = `
    <div class="${gradeClass}">
      あなたのスコア: <strong>${roundedScore}</strong><br>
      評価ランク: <strong>${grade}</strong>
    </div>
    <div style="margin-top:10px;font-size:14px;">
      [内訳] ランク:${rankScore} | トップ5:${Math.round(top5Rate)} | 勝率:${Math.round(winRate)}<br>
      K/D:${Math.round(kdScore)} | ダメージ:${Math.round(damageScore)} | ペナルティ:-${penalty}
    </div>
  `;
});