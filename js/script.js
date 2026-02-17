document.getElementById("result").style.display = "block";

document.getElementById("result").innerHTML = `
<h2>${plan.city}</h2>

<p><strong>🚆 推奨ダイヤ</strong><br>
${access.route}</p>

<p>⏱ ${access.time}</p>
<p>💰 ${access.price}</p>
<p>💳 IC利用：${access.ic}</p>

<hr style="margin:15px 0; border:none; border-top:1px solid #eee;">

<p><strong>📍 モデルコース</strong><br>
${plan.model}</p>

<button class="cta-btn" onclick="window.open('${rakutenUrl}','_blank')">
今空いている宿を見る
</button>
`;
