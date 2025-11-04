const grid = document.getElementById("grid");
const inputs = document.querySelectorAll(".input-row input");
const checkBtn = document.getElementById("checkBtn");
const resultText = document.getElementById("resultText");

// 정답 생성 (1~5 한 번씩 포함, 순서만 랜덤)
function generateSecret() {
  const nums = [1, 2, 3, 4, 5];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

const secret = generateSecret();
console.log("정답:", secret.join("")); // 디버그용 (나중에 지워도 됨)

let currentRow = 0;
const maxRows = 6;

// 그리드 초기화
for (let i = 0; i < maxRows * 5; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  grid.appendChild(cell);
}

// 입력칸 자동 이동
inputs.forEach((input, idx) => {
  input.addEventListener("input", () => {
    if (input.value.length === 1 && idx < inputs.length - 1) {
      inputs[idx + 1].focus();
    }
  });
});

// 입력 검증
function validateInput(values) {
  if (values.length !== 5) return "5자리 숫자를 모두 입력해주세요.";
  const set = new Set(values);
  if (set.size !== 5) return "숫자는 중복되면 안 됩니다.";
  for (const n of values) {
    if (n < 1 || n > 5 || isNaN(n)) return "각 숫자는 1~5 사이여야 합니다.";
  }
  return null;
}

// 비교 (자리 무관)
function evaluate(secret, guess) {
  let count = 0;
  for (const n of guess) {
    if (secret.includes(n)) count++;
  }
  return count;
}

// 확인 버튼 클릭 시
checkBtn.addEventListener("click", () => {
  if (currentRow >= maxRows) return;

  const values = Array.from(inputs).map((i) => Number(i.value.trim()));
  const err = validateInput(values);
  if (err) {
    resultText.textContent = "다시 입력하세요 " + err;
    return;
  }

  // 입력한 숫자 표시
  const startIdx = currentRow * 5;
  values.forEach((v, i) => {
    grid.children[startIdx + i].textContent = v;
  });

  const matched = evaluate(secret, values);

  if (matched === 5) {
    resultText.textContent = ` 정답입니다 ${currentRow + 1}번 만에 맞췄어요`;
    checkBtn.disabled = true;
    return;
  } else {
    resultText.textContent = `🔹 ${matched}개 숫자가 정답에 포함되어 있습니다.`;
  }

  currentRow++;

  if (currentRow === maxRows) {
    resultText.textContent = ` 실패 정답은 ${secret.join("")}입니다.`;
    checkBtn.disabled = true;
    return;
  }

  // 다음 시도를 위해 입력 초기화
  inputs.forEach((i) => (i.value = ""));
  inputs[0].focus();
});
