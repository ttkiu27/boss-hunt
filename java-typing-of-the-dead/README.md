# JAVA TYPING OF THE DEAD｜死亡之屋・Java 打字版

純 HTML／CSS／JS 單頁遊戲：打對 Java 關鍵字或短句就「開槍」消滅僵尸，練盲打同記語法。

## 點開

### 方法 A（推薦）
```bash
cd /workspace/java-typing-of-the-dead
python3 -m http.server 8765
```
瀏覽器開：http://127.0.0.1:8765/

### 方法 B
直接用瀏覽器開啟 `index.html`（雙擊或拖入視窗）。  
（`words.js` 同目錄即可；唔使 build。）

## 操作

| 鍵 | 作用 |
|----|------|
| 字母／符號／空白 | 輸入當前字串 |
| `Backspace` | 刪錯字 |
| `Esc` | 暫停／繼續 |
| `Enter` | 主選單或 Game Over 後開始 |

打錯字唔會寫入緩衝（嚴格模式），連擊歸零。打齊一條字串＝擊殺加分。

## 玩法

1. 選詞庫：**關鍵字**／**短句／API**／**全部混合**
2. 選難度：輕鬆（5 命）／普通（3 命）／地獄（2 命）
3. 僵尸由遠逼近；頭下顯示要打嘅字
4. 打對完整字串 → 消滅、加分、連擊
5. 僵尸走到面前 → 扣 1 命；命盡 Game Over
6. 擊殺越多波次越高：出怪更快、移速加快

## 檔案

```
java-typing-of-the-dead/
├── index.html   # 主遊戲
├── words.js     # 詞庫（由 totd-java-learning-dict.txt 產生）
└── README.md
```

詞庫約 440 條，無 `{` `}` 字元，適合打字射擊。

## 備註

- 以 PC 鍵盤為主；手機可開但唔係目標平台
- 唔使外網圖；畫面用 CSS + emoji
- 本地詞庫，可自行改 `words.js` 加字
