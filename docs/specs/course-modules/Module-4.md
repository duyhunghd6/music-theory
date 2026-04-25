# 📚 Module 4: Hòa âm - Nền tảng (Harmony - The Core)

<!-- beads-id: prd-cm4 -->

> Tài liệu này mô tả chi tiết nội dung các bài học về hòa âm cơ bản, áp dụng mô hình **UX Journey Pattern** đã được chứng minh hiệu quả từ Module 1.

---

## 4.1 Hợp âm ba nốt (Triads)

<!-- beads-id: prd-cm4-s1 -->

> 📋 **Chưa triển khai**: Sẽ được implement tại `src/data/course-data/module-4/4.1-triads.ts`

**UX Journey Pattern (4 bước):**

1. **Passive**: Animation "xếp chồng người tuyết" - 3 nốt chồng lên nhau
2. **Guided**: Chord Builder - chọn Root, auto-show 3rd và 5th
3. **Interactive**: Xây dựng C, G, F, Am trên Piano và Guitar
4. **Milestone**: Chơi được 4 hợp âm cơ bản liên tiếp (C-G-Am-F)

**Mục tiêu học tập (Learning Objectives):**

- Hiểu cấu trúc Triad: Root + 3rd + 5th
- Xây dựng hợp âm từ bất kỳ nốt nào
- Chơi được các hợp âm cơ bản trên Piano và Guitar

**Cấu trúc nội dung (`theoryContent`):**

#### Section 1: Khái niệm Chord (Hợp âm)

<!-- beads-id: prd-cm4-s2 -->

| Nội dung giảng dạy                       | Cách triển khai                  |
| :--------------------------------------- | :------------------------------- |
| Hợp âm = 3 nốt trở lên vang lên cùng lúc | Audio: 1 nốt đơn vs 3 nốt hợp âm |
| Triad = hợp âm cơ bản nhất (3 nốt)       | Visual: "người tuyết" 3 tầng     |
| Cảm giác "đầy đặn" của hòa âm            | So sánh giai điệu đơn vs có đệm  |

#### Section 2: Root, 3rd, 5th

<!-- beads-id: prd-cm4-s3 -->

| Thành phần         | Vai trò                   | Visual             |
| :----------------- | :------------------------ | :----------------- |
| **Root** (Nốt gốc) | Tên hợp âm, nằm dưới cùng | Highlight màu đỏ   |
| **3rd** (Quãng 3)  | Quyết định Major/Minor    | Highlight màu xanh |
| **5th** (Quãng 5)  | Tạo độ ổn định            | Highlight màu vàng |

#### Section 3: Xây dựng C Major Triad

<!-- beads-id: prd-cm4-s4 -->

| Nội dung giảng dạy         | Cách triển khai (Multi-instrument) |
| :------------------------- | :--------------------------------- | ------------------------- |
| Root = C, 3rd = E, 5th = G | `{{piano:C Major Chord             | C4,E4,G4}}`               |
| Chồng 2 quãng 3 lên nhau   | Animation xây từng nốt             |
| `{{guitar:C Major          | C3,E3,G3,C4,E4}}`                  | Guitar open chord diagram |

#### Section 4: G Major, F Major, A minor

<!-- beads-id: prd-cm4-s5 -->

| Hợp âm      | Nốt                      | Demo         |
| :---------- | :----------------------- | :----------- | ------------------------- | ------ |
| **G Major** | G - B - D                | `{{piano:... | G3,B3,D4}}`+`{{guitar:... | ...}}` |
| **F Major** | F - A - C                | `{{piano:... | F3,A3,C4}}`+`{{guitar:... | ...}}` |
| **A minor** | A - C - E (quãng 3 thứ!) | `{{piano:... | A3,C4,E4}}`               |

**ABC Demos (Interactive Examples):**

| ID    | Title                   | Mô tả nội dung              |
| :---- | :---------------------- | :-------------------------- |
| 4.1.1 | Triad Stacking          | Animation xếp 3 nốt         |
| 4.1.2 | C-G-Am-F Loop           | 4 chords progression        |
| 4.1.3 | Piano vs Guitar Voicing | Cùng hợp âm, khác cách đánh |

**Game Journey (Interleaved Progressive Pattern):**

Thiết kế game theo pattern "Master-Before-Advance":

```
LEVEL 1 (C Major & G Major Triads)
  ├─ 🎵 Chord Note ID       → 10 XP  (Hợp âm C gồm C-E-G)
  ├─ 🛠️ Chord Builder       → 15 XP  (Chọn Root → điền 3rd, 5th)
  └─ 🎹 Chord Play          → 20 XP  (Chơi C, G trên Piano)

LEVEL 2 (+ F Major & A minor)
  ├─ 🎵 Chord Note ID       → 15 XP  (Am có quãng 3 thứ!)
  ├─ 🛠️ Chord Builder       → 20 XP  (Xây Major vs minor)
  └─ 🎹 Chord Play          → 25 XP  (4 chords cơ bản)

LEVEL 3 (Guitar Chords + Dm, Em)
  ├─ 🎵 Chord Note ID       → 20 XP  (Nhận diện nhanh)
  ├─ 🎸 Chord Builder       → 30 XP  (Chọn thế bấm Guitar)
  └─ 🎹 Chord Play          → 40 XP  (C-G-Am-F loop) ⭐

Tổng: 9 games | 195 XP
```

**Game Types:**

| Type            | Mô tả                               | Skill Level   |
| --------------- | ----------------------------------- | ------------- |
| `chord-note-id` | Hợp âm C gồm những nốt nào? (C-E-G) | Recognition   |
| `chord-builder` | Chọn Root → điền 3rd và 5th đúng    | Active Recall |
| `chord-play`    | Chơi đúng chord trên Piano/Guitar   | Application   |

---

## 4.2 Tính chất hợp âm (Chord Qualities)

<!-- beads-id: prd-cm4-s6 -->

> 📋 **Chưa triển khai**: Sẽ được implement tại `src/data/course-data/module-4/4.2-chord-qualities.ts`

**UX Journey Pattern (4 bước):**

1. **Passive**: Animation so sánh C Major (vui 😄) vs C minor (buồn 😢)
2. **Guided**: "Emotion Matcher" - nghe hợp âm, chọn emoji phù hợp
3. **Interactive**: Toggle giữa 4 tính chất: Major, minor, dim, aug
4. **Milestone**: Phân biệt đúng 4 loại hợp âm bằng tai trong 80% cases

**Mục tiêu học tập (Learning Objectives):**

- Phân biệt 4 tính chất: Major, Minor, Diminished, Augmented
- Hiểu công thức interval cho mỗi loại
- Liên kết tính chất với cảm xúc (emotion mapping)

**Cấu trúc nội dung (`theoryContent`):**

#### Section 1: Major vs Minor

<!-- beads-id: prd-cm4-s7 -->

| Tính chất | Công thức                    | Cảm xúc      | Ký hiệu     |
| :-------- | :--------------------------- | :----------- | :---------- |
| **Major** | M3 + m3 (dưới lớn, trên nhỏ) | Vui, sáng 😄 | C, CM, Cmaj |
| **Minor** | m3 + M3 (dưới nhỏ, trên lớn) | Buồn, sâu 😢 | Cm, Cmin, c |

#### Section 2: Diminished & Augmented

<!-- beads-id: prd-cm4-s8 -->

| Tính chất      | Công thức               | Cảm xúc                | Ký hiệu  |
| :------------- | :---------------------- | :--------------------- | :------- |
| **Diminished** | m3 + m3 (2 quãng 3 nhỏ) | Căng thẳng, đáng sợ 😱 | Cdim, C° |
| **Augmented**  | M3 + M3 (2 quãng 3 lớn) | Mơ hồ, lơ lửng ☁️      | Caug, C+ |

#### Section 3: Audio Comparison

<!-- beads-id: prd-cm4-s9 -->

| Nội dung giảng dạy           | Cách triển khai        |
| :--------------------------- | :--------------------- |
| 4 buttons: C, Cm, Cdim, Caug | Click để nghe so sánh  |
| Emotion mapping với emoji    | Visual feedback        |
| Cùng Root, khác tính chất    | Highlight 3rd thay đổi |

**ABC Demos (Interactive Examples):**

| ID    | Title              | Mô tả nội dung       |
| :---- | :----------------- | :------------------- |
| 4.2.1 | Major vs Minor     | Side-by-side C vs Cm |
| 4.2.2 | Diminished "Scary" | Horror movie chord   |
| 4.2.3 | Augmented "Dreamy" | Floating, unresolved |
| 4.2.4 | Quality Toggle     | Switch between all 4 |

**Game Journey (Interleaved Progressive Pattern):**

Thiết kế game theo pattern "Master-Before-Advance":

```
LEVEL 1 (Major vs Minor)
  ├─ 🎵 Chord Quality ID    → 10 XP  (Nhìn nốt → Major hay minor?)
  ├─ 👂 Major or Minor Ear  → 15 XP  (Nghe: Vui 😄 hay Buồn 😢?)
  └─ 🎹 Emotion Match       → 20 XP  (Chơi chord theo emoji)

LEVEL 2 (+ Diminished)
  ├─ 🎵 Chord Quality ID    → 15 XP  (Thêm dim: đáng sợ 😱)
  ├─ 👂 3-Quality Ear       → 20 XP  (Major/minor/dim)
  └─ 🎹 Emotion Match       → 25 XP  (3 loại cảm xúc)

LEVEL 3 (+ Augmented)
  ├─ 🎵 Chord Quality ID    → 20 XP  (Cả 4: M/m/dim/aug)
  ├─ 👂 Full Quality Ear    → 30 XP  ("Dreamy" ☁️ = aug)
  └─ 🎹 Emotion Match       → 40 XP  (4 emoji = 4 quality) ⭐

Tổng: 9 games | 195 XP
```

**Game Types:**

| Type               | Mô tả                                  | Skill Level   |
| ------------------ | -------------------------------------- | ------------- |
| `chord-quality-id` | Nhìn nốt → Major, minor, dim, hay aug? | Recognition   |
| `major-minor-ear`  | Nghe → đoán tính chất                  | Active Recall |
| `emotion-match`    | Chơi chord phù hợp với emoji cảm xúc   | Application   |

---

## 4.3 Hợp âm trong giọng (Diatonic Chords)

<!-- beads-id: prd-cm4-s10 -->

> 📋 **Chưa triển khai**: Sẽ được implement tại `src/data/course-data/module-4/4.3-diatonic-chords.ts`

**UX Journey Pattern (4 bước):**

1. **Passive**: Animation "xây nhà tầng" - chồng quãng 3 lên từng bậc của scale
2. **Guided**: Xây dựng 7 hợp âm trong giọng C step-by-step
3. **Interactive**: Chord Finder - chọn giọng, xem tất cả diatonic chords
4. **Milestone**: Xác định đúng tất cả 7 hợp âm trong giọng G và F

**Mục tiêu học tập (Learning Objectives):**

- Xây dựng 7 hợp âm từ 7 bậc của âm giai
- Nhớ quy luật: I-ii-iii-IV-V-vi-vii° (M-m-m-M-M-m-dim)
- Nhận biết "3 anh cả" I, IV, V (Primary chords)

**Cấu trúc nội dung (`theoryContent`):**

#### Section 1: Xây dựng Diatonic Chords

<!-- beads-id: prd-cm4-s11 -->

| Nội dung giảng dạy                       | Cách triển khai           |
| :--------------------------------------- | :------------------------ |
| Lấy C Major Scale làm nền: C-D-E-F-G-A-B | 7 nốt hiển thị            |
| Chồng quãng 3 lên TỪNG nốt               | Animation "mọc" thêm nốt  |
| Chỉ dùng nốt TRONG âm giai               | ⚠️ "Stay within the key!" |

#### Section 2: 7 hợp âm trong giọng C

<!-- beads-id: prd-cm4-s12 -->

| Bậc  | Nốt   | Hợp âm   | Tính chất  | Giải thích               |
| :--- | :---- | :------- | :--------- | :----------------------- |
| I    | C-E-G | **C**    | Major      | Root chord               |
| ii   | D-F-A | **Dm**   | minor      | F tự nhiên (không có F#) |
| iii  | E-G-B | **Em**   | minor      | G tự nhiên               |
| IV   | F-A-C | **F**    | Major      | Subdominant              |
| V    | G-B-D | **G**    | Major      | Dominant                 |
| vi   | A-C-E | **Am**   | minor      | Relative minor           |
| vii° | B-D-F | **Bdim** | diminished | Tritone inside!          |

#### Section 3: Quy luật I-ii-iii-IV-V-vi-vii°

<!-- beads-id: prd-cm4-s13 -->

| Nội dung giảng dạy                    | Cách triển khai           |
| :------------------------------------ | :------------------------ |
| Mọi giọng Trưởng: **M-m-m-M-M-m-dim** | Bảng công thức            |
| Chữ hoa = Major, chữ thường = minor   | I vs ii                   |
| "3 anh cả" I, IV, V                   | Highlight 3 trụ cột chính |

**ABC Demos (Interactive Examples):**

| ID    | Title                    | Mô tả nội dung         |
| :---- | :----------------------- | :--------------------- |
| 4.3.1 | Building Diatonic Chords | Animation step-by-step |
| 4.3.2 | I-IV-V Primary Chords    | 3 hợp âm chính         |
| 4.3.3 | vii° Diminished          | The "spicy" chord      |
| 4.3.4 | Key of G Diatonic        | G-Am-Bm-C-D-Em-F#dim   |

**Game Journey (Interleaved Progressive Pattern):**

Thiết kế game theo pattern "Master-Before-Advance":

```
LEVEL 1 (I, IV, V - Primary Chords)
  ├─ 🎵 Diatonic Chord ID   → 10 XP  (Bậc I, IV, V của C)
  ├─ 📝 Quality Pattern    → 15 XP  (Điền M cho I, IV, V)
  └─ 🛠️ Diatonic Builder   → 20 XP  (Xây C, F, G trong giọng C)

LEVEL 2 (+ ii, iii, vi - Minor Chords)
  ├─ 🎵 Diatonic Chord ID   → 15 XP  (Dm, Em, Am trong C)
  ├─ 📝 Quality Pattern    → 20 XP  (Điền m cho ii, iii, vi)
  └─ 🛠️ Diatonic Builder   → 25 XP  (Hoàn thành 6/7 chords)

LEVEL 3 (+ vii° - Full Set)
  ├─ 🎵 Diatonic Chord ID   → 20 XP  (Tất cả 7 bậc trong G, F)
  ├─ 📝 Quality Pattern    → 30 XP  (M-m-m-M-M-m-dim)
  └─ 🛠️ Diatonic Builder   → 40 XP  (Bất kỳ giọng) ⭐

Tổng: 9 games | 195 XP
```

**Game Types:**

| Type                | Mô tả                                   | Skill Level   |
| ------------------- | --------------------------------------- | ------------- |
| `diatonic-chord-id` | Bậc vi của C là gì? (Am)                | Recognition   |
| `quality-pattern`   | Điền M/m/dim cho I-ii-iii-IV-V-vi-vii°  | Active Recall |
| `diatonic-builder`  | Điền các hợp âm còn thiếu trong giọng F | Application   |

---

## 4.4 Ký hiệu số La Mã (Roman Numeral Analysis)

<!-- beads-id: prd-cm4-s14 -->

> 📋 **Chưa triển khai**: Sẽ được implement tại `src/data/course-data/module-4/4.4-roman-numerals.ts`

**UX Journey Pattern (4 bước):**

1. **Passive**: Animation chuyển đổi C-G-Am-F → I-V-vi-IV (numbers không đổi khi đổi key)
2. **Guided**: Nashville Number System explanation
3. **Interactive**: Transposer tool - đổi key, giữ nguyên numbers
4. **Milestone**: Chơi I-V-vi-IV trong 3 giọng khác nhau (C, G, D)

**Mục tiêu học tập (Learning Objectives):**

- Hiểu tại sao dùng số La Mã (transpose dễ dàng)
- Đọc và viết Roman Numeral analysis
- Áp dụng Nashville Number System

**Cấu trúc nội dung (`theoryContent`):**

#### Section 1: Tại sao dùng số?

<!-- beads-id: prd-cm4-s15 -->

| Nội dung giảng dạy            | Cách triển khai                              |
| :---------------------------- | :------------------------------------------- |
| Số La Mã áp dụng cho MỌI tone | Animation Key change: C→G, numbers không đổi |
| Nashville Number System       | Sheet nhạc chỉ ghi số                        |
| Transpose dễ dàng             | Slider thay đổi Key                          |

#### Section 2: Quy tắc viết

<!-- beads-id: prd-cm4-s16 -->

| Ký hiệu                      | Ý nghĩa     | Ví dụ                   |
| :--------------------------- | :---------- | :---------------------- |
| **Chữ hoa** (I, IV, V)       | Major chord | I = C Major trong key C |
| **Chữ thường** (ii, iii, vi) | minor chord | vi = Am trong key C     |
| **° (vii°)**                 | diminished  | vii° = Bdim trong key C |

#### Section 3: I-V-vi-IV - "The Axis"

<!-- beads-id: prd-cm4-s17 -->

| Nội dung giảng dạy           | Cách triển khai                 |
| :--------------------------- | :------------------------------ | ----------- |
| Trong C: C → G → Am → F      | `{{piano:...                    | ...}}` loop |
| Trong G: G → D → Em → C      | Same progression, different key |
| Nghe giống hệt về "tình cảm" | Audio Compare button            |

**ABC Demos (Interactive Examples):**

| ID    | Title                | Mô tả nội dung                  |
| :---- | :------------------- | :------------------------------ |
| 4.4.1 | Roman Numeral Chart  | I-ii-iii-IV-V-vi-vii° reference |
| 4.4.2 | I-V-vi-IV in C, G, D | Same progression, 3 keys        |
| 4.4.3 | Transposer Tool      | Interactive key change          |

**Game Journey (Interleaved Progressive Pattern):**

Thiết kế game theo pattern "Master-Before-Advance":

```
LEVEL 1 (Key of C)
  ├─ 🎵 Roman Convert       → 10 XP  (Am trong C = vi)
  ├─ ⚡ Transpose Quiz      → 15 XP  (I-V-vi-IV trong C = ?)
  └─ 🎹 Roman Prog Play    → 20 XP  (Chơi C-G-Am-F)

LEVEL 2 (+ Key of G)
  ├─ 🎵 Roman Convert       → 15 XP  (Em trong G = vi)
  ├─ ⚡ Transpose Quiz      → 20 XP  (I-V-vi-IV trong G = ?)
  └─ 🎹 Roman Prog Play    → 25 XP  (Chơi G-D-Em-C)

LEVEL 3 (Any Key: D, A, F...)
  ├─ 🎵 Roman Convert       → 20 XP  (Bất kỳ giọng)
  ├─ ⚡ Transpose Quiz      → 30 XP  (Nashville Number System)
  └─ 🎹 Roman Prog Play    → 40 XP  (Chơi tiến trình trong D) ⭐

Tổng: 9 games | 195 XP
```

**Game Types:**

| Type                     | Mô tả                               | Skill Level   |
| ------------------------ | ----------------------------------- | ------------- |
| `roman-convert`          | Am trong key C = ? (vi)             | Recognition   |
| `transpose-quiz`         | I-V-vi-IV trong G là gì? (G-D-Em-C) | Active Recall |
| `roman-progression-play` | Chơi tiến trình I-IV-V trong key D  | Application   |

---

## 4.5 Vòng quãng 5 (The Circle of Fifths)

<!-- beads-id: prd-cm4-s18 -->

> 📋 **Chưa triển khai**: Sẽ được implement tại `src/data/course-data/module-4/4.5-circle-of-fifths.ts`

**UX Journey Pattern (4 bước):**

1. **Passive**: Animation vòng tròn xoay với C ở 12 giờ
2. **Guided**: Click vào giọng → hiện hóa biểu và relative minor
3. **Interactive**: Navigation game - di chuyển theo chiều kim đồng hồ/ngược chiều
4. **Milestone**: Xác định đúng vị trí và số dấu hóa cho 12 giọng

**Mục tiêu học tập (Learning Objectives):**

- Hiểu cấu trúc Circle of Fifths
- Sử dụng để xác định hóa biểu
- Nhận biết quan hệ giữa các giọng "hàng xóm"

**Cấu trúc nội dung (`theoryContent`):**

#### Section 1: Cấu trúc vòng tròn

<!-- beads-id: prd-cm4-s19 -->

| Nội dung giảng dạy                    | Cách triển khai             |
| :------------------------------------ | :-------------------------- |
| Giống mặt đồng hồ: **C ở 12 giờ**     | Interactive Circle          |
| Mỗi bước phải = Quãng 5 đúng (C→G→D)  | Animation chiều kim đồng hồ |
| Mỗi bước trái = Quãng 4 đúng (C→F→Bb) | Animation ngược chiều       |

#### Section 2: Chiều kim đồng hồ = Thêm

<!-- beads-id: prd-cm4-s20 -->

| Giọng     | Số # | Dấu thăng mới |
| :-------- | :--- | :------------ |
| C → **G** | 1#   | F#            |
| G → **D** | 2#   | C#            |
| D → **A** | 3#   | G#            |
| A → **E** | 4#   | D#            |

#### Section 3: Ngược chiều = Thêm ♭

<!-- beads-id: prd-cm4-s21 -->

| Giọng       | Số ♭ | Dấu giáng mới |
| :---------- | :--- | :------------ |
| C → **F**   | 1♭   | B♭            |
| F → **B♭**  | 2♭   | E♭            |
| B♭ → **E♭** | 3♭   | A♭            |
| E♭ → **A♭** | 4♭   | D♭            |

#### Section 4: Vòng trong = Relative Minor

<!-- beads-id: prd-cm4-s22 -->

| Nội dung giảng dạy                | Cách triển khai    |
| :-------------------------------- | :----------------- |
| A minor ở 12 giờ (dưới C Major)   | Inner circle       |
| Cùng hóa biểu với Major tương ứng | Link Major ↔ minor |

**ABC Demos (Interactive Examples):**

| ID    | Title                   | Mô tả nội dung               |
| :---- | :---------------------- | :--------------------------- |
| 4.5.1 | Circle Navigation       | Click để xoay, hiện key info |
| 4.5.2 | Sharp Keys (right side) | G, D, A, E, B, F#            |
| 4.5.3 | Flat Keys (left side)   | F, Bb, Eb, Ab, Db, Gb        |
| 4.5.4 | Relative Pairs          | Major + minor cùng vị trí    |

**Game Journey (Interleaved Progressive Pattern):**

Thiết kế game theo pattern "Master-Before-Advance":

```
LEVEL 1 (Sharp Keys: G, D, A)
  ├─ 🎵 Circle Key ID       → 10 XP  (G = 1#, D = 2#...)
  ├─ 🧭 Circle Navigation  → 15 XP  (C → G → D = chiều kim)
  └─ 🔗 Neighbor Keys       → 20 XP  (C hàng xóm với G, F)

LEVEL 2 (+ Flat Keys: F, B♭, E♭)
  ├─ 🎵 Circle Key ID       → 15 XP  (F = 1♭, B♭ = 2♭...)
  ├─ 🧭 Circle Navigation  → 20 XP  (C → F → B♭ = ngược chiều)
  └─ 🔗 Neighbor Keys       → 25 XP  (Modulation gần và xa)

LEVEL 3 (Full Circle + Relative Minor)
  ├─ 🎵 Circle Key ID       → 20 XP  (Tất cả 12 giọng + minor)
  ├─ 🧭 Circle Navigation  → 30 XP  (Đi từ A đến E♭)
  └─ 🔗 Neighbor Keys       → 40 XP  (Related keys quiz) ⭐

Tổng: 9 games | 195 XP
```

**Game Types:**

| Type                | Mô tả                                | Skill Level   |
| ------------------- | ------------------------------------ | ------------- |
| `circle-key-id`     | A Major ở đâu? Có mấy #? (3 giờ, 3#) | Recognition   |
| `circle-navigation` | Điền tên giọng còn thiếu trên vòng   | Active Recall |
| `neighbor-keys`     | Giọng nào "hàng xóm" với E Major?    | Application   |

---

## 4.6 Đảo hợp âm (Chord Inversions)

<!-- beads-id: prd-cm4-s23 -->

> 📋 **Chưa triển khai**: Sẽ được implement tại `src/data/course-data/module-4/4.6-inversions.ts`

**UX Journey Pattern (4 bước):**

1. **Passive**: Animation C chord "xoay vòng" qua 3 vị trí (Root, 1st, 2nd)
2. **Guided**: Piano demo voice leading: C → F/C (giữ C làm bass)
3. **Interactive**: Inversion Switcher - click để đổi giữa các thế
4. **Milestone**: Chơi được I-IV-V với smooth voice leading

**Mục tiêu học tập (Learning Objectives):**

- Hiểu 3 vị trí: Root Position, 1st Inversion, 2nd Inversion
- Đọc được ký hiệu slash chord (C/E, C/G)
- Áp dụng voice leading để chuyển hợp âm mượt mà

**Cấu trúc nội dung (`theoryContent`):**

#### Section 1: Root Position

<!-- beads-id: prd-cm4-s24 -->

| Nội dung giảng dạy              | Cách triển khai                          |
| :------------------------------ | :--------------------------------------- |
| Root nằm dưới cùng (Bass)       | `{{abc:C E G}}` "Người tuyết đứng thẳng" |
| Cấu trúc: 3rd + 3rd (xếp chồng) | Visual building blocks                   |

#### Section 2: First Inversion

<!-- beads-id: prd-cm4-s25 -->

| Nội dung giảng dạy                       | Cách triển khai        |
| :--------------------------------------- | :--------------------- |
| Root chuyển lên octave, **3rd nằm bass** | `{{abc:E G c}}`        |
| Ký hiệu: **C/E** (C over E)              | Visual: nốt C lên trên |
| Âm hưởng: Nhẹ hơn, chưa ổn định          | Audio demo             |

#### Section 3: Second Inversion

<!-- beads-id: prd-cm4-s26 -->

| Nội dung giảng dạy                            | Cách triển khai        |
| :-------------------------------------------- | :--------------------- |
| 3rd chuyển tiếp, **5th nằm bass**             | `{{abc:G c e}}`        |
| Ký hiệu: **C/G** (C over G)                   | Visual: nốt E lên trên |
| Âm hưởng: Chơi vơi, thường dùng cadential 6/4 | Audio demo             |

#### Section 4: Voice Leading

<!-- beads-id: prd-cm4-s27 -->

| Nội dung giảng dạy                     | Cách triển khai            |
| :------------------------------------- | :------------------------- |
| Di chuyển các nốt **ít nhất có thể**   | Animation line nối nốt gần |
| C → F/C mượt hơn C → F (root position) | Side-by-side comparison    |
| "Đường đi ngắn nhất"                   | Visual path highlight      |

**ABC Demos (Interactive Examples):**

| ID    | Title                  | Mô tả nội dung                     |
| :---- | :--------------------- | :--------------------------------- |
| 4.6.1 | 3 Positions of C Chord | Root → 1st → 2nd inversion         |
| 4.6.2 | Slash Chord Notation   | C/E, C/G, F/A...                   |
| 4.6.3 | Voice Leading Demo     | C → F → G → C with smooth movement |

**Game Journey (Interleaved Progressive Pattern):**

Thiết kế game theo pattern "Master-Before-Advance":

```
LEVEL 1 (Root Position & 1st Inversion)
  ├─ 🎵 Inversion ID        → 10 XP  (Nhìn nốt → Root hay 1st?)
  ├─ 🎹 Inversion Play      → 15 XP  (Chơi C và C/E)
  └─ 📍 Voice Leading Path → 20 XP  (C → F với common tone)

LEVEL 2 (+ 2nd Inversion)
  ├─ 🎵 Inversion ID        → 15 XP  (Cả 3 thế: Root/1st/2nd)
  ├─ 🎹 Inversion Play      → 20 XP  (Chơi C/G, F/C, G/D)
  └─ 📍 Voice Leading Path → 25 XP  (Smooth progression 3 chords)

LEVEL 3 (Full Voice Leading)
  ├─ 🎵 Inversion ID        → 20 XP  (Nhận diện nhanh)
  ├─ 🎹 Inversion Play      → 30 XP  (Slash chords: G/B, Am/C)
  └─ 📍 Voice Leading Path → 40 XP  (I-IV-V-I mượt mà) ⭐

Tổng: 9 games | 195 XP
```

**Game Types:**

| Type                 | Mô tả                                     | Skill Level   |
| -------------------- | ----------------------------------------- | ------------- |
| `inversion-id`       | Nhìn nốt → Root, 1st, hay 2nd inversion?  | Recognition   |
| `inversion-play`     | Chơi C/G trên Piano                       | Active Recall |
| `voice-leading-path` | Chọn inversions để tạo smooth progression | Application   |

---

## 4.7 Hợp âm 7 (Seventh Chords)

<!-- beads-id: prd-cm4-s28 -->

> 📋 **Chưa triển khai**: Sẽ được implement tại `src/data/course-data/module-4/4.7-seventh-chords.ts`

**UX Journey Pattern (4 bước):**

1. **Passive**: Animation so sánh triad (3 nốt) vs seventh (4 nốt)
2. **Guided**: 3 loại chính: Maj7 (mơ màng), min7 (buồn nhẹ), Dom7 (căng thẳng)
3. **Interactive**: ii-V-I progression builder trong Jazz
4. **Milestone**: Chơi được Dm7 → G7 → Cmaj7 trên Piano/Guitar

**Mục tiêu học tập (Learning Objectives):**

- Phân biệt 3 loại 7th chord phổ biến
- Hiểu vai trò của Dom7 trong cadence (V7 → I)
- Nhận biết ii-V-I, tiến trình quan trọng nhất trong Jazz

**Cấu trúc nội dung (`theoryContent`):**

#### Section 1: Major 7 (Maj7)

<!-- beads-id: prd-cm4-s29 -->

| Nội dung giảng dạy             | Cách triển khai       |
| :----------------------------- | :-------------------- |
| Triad trưởng + Quãng 7 trưởng  | `{{abc:C E G B}}`     |
| Âm hưởng: Mơ màng, Jazz, Lo-fi | Audio demo Lo-fi beat |
| Ký hiệu: Cmaj7, CM7, C△7       | Text overlays         |

#### Section 2: Minor 7 (min7)

<!-- beads-id: prd-cm4-s30 -->

| Nội dung giảng dạy            | Cách triển khai     |
| :---------------------------- | :------------------ |
| Triad thứ + Quãng 7 thứ       | `{{abc:C _E G _B}}` |
| Âm hưởng: Soul, R&B, buồn nhẹ | Audio demo R&B      |
| Ký hiệu: Cm7, C-7             | Text overlays       |

#### Section 3: Dominant 7 (Dom7)

<!-- beads-id: prd-cm4-s31 -->

| Nội dung giảng dạy                            | Cách triển khai       |
| :-------------------------------------------- | :-------------------- |
| Triad trưởng + Quãng 7 thứ (!)                | `{{abc:C E G _B}}`    |
| Quan trọng nhất: **V7 → I** (muốn giải quyết) | G7 → C demo           |
| Âm hưởng: Blues, Funk                         | Audio demo blues lick |

#### Section 4: ii-V-I trong Jazz

<!-- beads-id: prd-cm4-s32 -->

| Nội dung giảng dạy                             | Cách triển khai                 |
| :--------------------------------------------- | :------------------------------ |
| **Dm7 → G7 → Cmaj7** = "Cỗ máy thời gian Jazz" | Loop progression                |
| Circle of Fifths movement: D→G→C               | Highlight trên vòng quãng 5     |
| Voice leading: Nốt giữ, nốt chuyển             | Animation smooth voice movement |

**ABC Demos (Interactive Examples):**

| ID    | Title                | Mô tả nội dung                  |
| :---- | :------------------- | :------------------------------ |
| 4.7.1 | Maj7 vs min7 vs Dom7 | Side-by-side-by-side comparison |
| 4.7.2 | V7 → I Resolution    | G7 → C tension & release        |
| 4.7.3 | ii-V-I Loop          | The Jazz progression            |
| 4.7.4 | 7th Chords on Guitar | G7, C7, E7 open chords          |

**Game Journey (Interleaved Progressive Pattern):**

Thiết kế game theo pattern "Master-Before-Advance":

```
LEVEL 1 (Maj7 & min7)
  ├─ 🎵 7th Type ID         → 10 XP  (Maj7 vs min7)
  ├─ 🛠️ Build the 7th      → 15 XP  (Cho triad → thêm 7th)
  └─ 🎹 7th Chord Play      → 20 XP  (Chơi Cmaj7, Am7)

LEVEL 2 (+ Dominant 7 - V7)
  ├─ 🎵 7th Type ID         → 15 XP  (Dom7: Major + m7!)
  ├─ 🛠️ Build the 7th      → 20 XP  (Xây G7 → C)
  └─ 🎹 7th Chord Play      → 25 XP  (V7 → I resolution)

LEVEL 3 (ii-V-I in Jazz)
  ├─ 🎵 7th Type ID         → 20 XP  (Cả 3 loại + context)
  ├─ 🛠️ Build the 7th      → 30 XP  (Dm7 → G7 → Cmaj7)
  └─ 🎹 ii-V-I Play        → 40 XP  (Jazz progression) ⭐

Tổng: 9 games | 195 XP
```

**Game Types:**

| Type            | Mô tả                               | Skill Level   |
| --------------- | ----------------------------------- | ------------- |
| `7th-type-id`   | Nghe → Maj7, min7, hay Dom7?        | Recognition   |
| `build-the-7th` | Cho triad → thêm đúng nốt 7         | Active Recall |
| `ii-v-i-play`   | Chơi progression trong key được cho | Application   |

---
