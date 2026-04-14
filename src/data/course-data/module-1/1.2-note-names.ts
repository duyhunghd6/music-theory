/**
 * Module 1, Submodule 1.2: Tên nốt & Cao độ (Note Names & Pitch)
 *
 * Learning Journey:
 * 1. Passive: Animated A-G-A loop visualization
 * 2. Guided: Finding C (2-black-key group) and F (3-black-key group)
 * 3. Interactive: Guitar open strings with audio feedback
 * 4. Milestone: Play all C notes across Grand Staff
 *
 * Game Suite (3-Tier):
 * - ⭐ Octave Challenge: Identify octave numbers
 * - ⭐⭐ Find the Frequency: Play specific octave on Piano
 * - ⭐⭐⭐ High/Low Battle: Compare pitch heights
 */
import type { Submodule } from '../types'

export const SUBMODULE_1_2: Submodule = {
  id: '1.2',
  title: 'Tên nốt & Cao độ',
  description: 'Nhận biết 7 nốt nhạc (A-G) trên bàn phím và khuông nhạc, khái niệm Quãng tám',
  sections: ['theory', 'abcDemo', 'practice'],
  theoryContent: `
## 1. Bảng chữ cái Âm nhạc (The Musical Alphabet)

Âm nhạc chỉ sử dụng **7 chữ cái**: A, B, C, D, E, F, G. Sau G, vòng lặp quay lại A!

> 🔄 **Vòng tròn bất tận**: ...E → F → G → **A** → B → C → D → E → F → G → **A**...

{{abc:Vòng tròn 7 nốt nhạc|X:1
L:1/4
K:C clef=treble
A B c d | e f g a|]}}

{{quiz:Âm nhạc sử dụng bao nhiêu chữ cái để đặt tên cho nốt?|5 chữ cái;6 chữ cái;*7 chữ cái|Âm nhạc chỉ sử dụng 7 chữ cái: A, B, C, D, E, F, G - sau đó lặp lại!}}

---

## 2. Tìm nốt trên Bàn phím Piano

### Bí quyết tìm nốt C (Đô)

Nhìn vào bàn phím và tìm **nhóm 2 phím đen**. Nốt **C** là phím trắng **ngay bên trái** nhóm 2 phím đen này!

{{piano:Tìm nốt C trên Piano|C3,C4}}

{{guitar:Tất cả nốt C trên Guitar (12 frets)|C2,C3,C4,C5}}

{{flute:Nốt C trên Sáo|C4,C5}}

{{abc:Nốt C trên khuông nhạc|X:1
L:1/2
K:C clef=treble
C2 c2|]}}

> 💡 **Mẹo nhớ**: "2 phím đen = 2 chữ trong Đô" (C = Đô)

{{quiz:Nốt C nằm bên nào của nhóm 2 phím đen?|*Bên trái;Bên phải;Ở giữa|Nốt C là phím trắng ngay BÊN TRÁI nhóm 2 phím đen}}

### Bí quyết tìm nốt F (Fa)

Tương tự, tìm **nhóm 3 phím đen**. Nốt **F** là phím trắng **ngay bên trái** nhóm 3 phím đen!

{{piano:Tìm nốt F trên Piano|F3,F4}}

{{guitar:Tất cả nốt F trên Guitar (12 frets)|F2,F3,F4,F5}}

{{flute:Nốt F trên Sáo|F4,F5}}

{{abc:Nốt F trên khuông nhạc|X:1
L:1/2
K:C clef=treble
F2 f2|]}}

> 💡 **Mẹo nhớ**: "3 phím đen = 3 chữ trong Fa" (F = Fa... gần đúng! 😄)

{{quiz:Nốt F nằm bên nào của nhóm 3 phím đen?|*Bên trái;Bên phải;Ở giữa|Nốt F là phím trắng ngay BÊN TRÁI nhóm 3 phím đen}}

### Các nốt còn lại

Từ **C** đếm lên: C → **D** → **E** (đến nhóm 2 phím đen)
Từ **F** đếm lên: F → **G** → **A** → **B** (đến nhóm 3 phím đen tiếp theo)

{{piano:7 nốt nhạc trên Piano|C3,D3,E3,F3,G3,A3,B3,C4}}

{{guitar:Tất cả 7 nốt trên Guitar|C2,C3,C4,D2,D3,D4,E2,E3,E4,F2,F3,F4,G2,G3,G4,A2,A3,A4,B2,B3,B4}}

{{flute:Thang âm C trên Sáo|C4,D4,E4,F4,G4,A4,B4,C5}}

{{abc:7 nốt nhạc trên khuông nhạc|X:1
L:1/4
K:C clef=treble
C D E F | G A B c|]}}

---

## 3. Nốt trên Dây đàn Guitar

Guitar có **6 dây**, đếm từ dây nhỏ nhất (mỏng, ở dưới) đến dây to nhất (dày, ở trên):

{{guitar:6 Dây buông Guitar - Click để nghe!|E4,B3,G3,D3,A2,E2}}

- **Dây 1**: E (cao) - Dây mỏng nhất
- **Dây 2**: B
- **Dây 3**: G
- **Dây 4**: D
- **Dây 5**: A
- **Dây 6**: E (thấp) - Dây dày nhất

> 📝 **Câu nhớ tiếng Việt**: "**E**m **B**ỏ **G**ấu **Đ**i **Ă**n **E**is" (EBGDAE)

> 📝 **Câu nhớ tiếng Anh**: "**E**very **B**oy **G**ets **D**inner **A**t **E**ight"

{{quiz:6 dây Guitar buông là những nốt gì (từ mỏng đến dày)?|E-A-D-G-B-E;*E-B-G-D-A-E;A-B-C-D-E-F|Từ dây mỏng nhất đến dày nhất: E-B-G-D-A-E. Nhớ câu "Em Bỏ Gấu Đi Ăn Eis"!}}

---

## 4. Quãng tám (Octave) & Middle C

### Khái niệm Quãng tám

**Quãng tám (Octave)** là khoảng cách từ một nốt đến nốt cùng tên gần nhất. Ví dụ: C3 → C4 (8 nốt).

{{piano:Một quãng tám: C3 → C4|C3,C4}}

{{guitar:Một quãng tám: C3 → C4|C3,C4}}

> 🎵 Khi bạn nghe, nốt C4 nghe "sáng" hơn, nốt C3 nghe "trầm" hơn, nhưng **cùng "màu sắc" âm thanh**!

### Ký hiệu Khoa học (Scientific Pitch Notation)

Để phân biệt các nốt cùng tên ở các quãng tám khác nhau, ta dùng **số**:

- **C2** = Quãng tám thứ 2 - Rất trầm (chỉ có trên Guitar)
- **C3** = Quãng tám thứ 3 - Thấp hơn Middle C
- **C4** = Quãng tám thứ 4 - **Middle C** (Đô giữa đàn) 🎯
- **C5** = Quãng tám thứ 5 - Cao hơn Middle C

{{piano:Các nốt C trên Piano (C3 → C4 → C5)|C3,C4,C5}}

{{guitar:Các nốt C trên Guitar (C2 → C3 → C4 → C5)|C2,C3,C4,C5}}

> ⚠️ **Quy ước quan trọng**: 
> - **C4** = Middle C (Đô giữa - nốt "trung tâm" của bàn phím)
> - **A4** = 440 Hz (nốt La chuẩn để chỉnh dây đàn)

{{quiz:C4 còn được gọi là gì?|Nốt C cao;Nốt C trầm;*Middle C (Đô giữa đàn)|C4 = Middle C - là nốt "trung tâm" của bàn phím piano}}

### So sánh quãng tám trên các nhạc cụ

{{piano:Nốt E qua các quãng tám|E3,E4,E5}}

{{guitar:Nốt E qua các quãng tám (bao gồm cả E2)|E2,E3,E4}}

### Quy tắc số tăng

Số càng **lớn** = nốt càng **cao**:
- D3 **thấp hơn** D4
- G2 **thấp hơn** G5
- Tất cả nốt có số 3 đều thấp hơn nốt cùng tên có số 4

{{quiz:Nốt nào cao hơn: D3 hay D4?|D3;*D4;Giống nhau|Số càng LỚN = nốt càng CAO. D4 cao hơn D3 một quãng tám}}

---

## 🎮 Thử thách: Hành trình Cao độ

Bây giờ bạn đã sẵn sàng cho các thử thách:

1. **Octave Challenge** ⭐: Xem nốt trên khuông, đoán đúng chỉ số octave (C3, C4, hay C5?)
2. **Find the Frequency** ⭐⭐: Nghe lệnh "Chơi C3!" → Bấm đúng phím trên Piano
3. **High/Low Battle** ⭐⭐⭐: So sánh 2 nốt, nốt nào cao hơn?
  `,
  abcDemos: [
    {
      id: '1.2.1',
      title: 'Bảng chữ cái Âm nhạc',
      description:
        'Vòng tròn 7 nốt: A → B → C → D → E → F → G → A... Trên khuông nhạc, các nốt đi từ thấp lên cao theo bậc thang. Sau G, nốt A cao hơn xuất hiện - đây chính là sự lặp lại của quãng tám!',
      abc: `X:1
M:4/4
L:1/4
K:C
A B c d | e f g a|]`,
      interactive: true,
      playable: true,
    },
    {
      id: '1.2.2',
      title: 'Tìm nốt C trên Piano',
      description:
        'Trên khuông nhạc hiển thị 4 nốt C ở các quãng tám khác nhau (C3, C4, C5, C6). Nốt thấp nhất nằm dưới khuông cần dòng kẻ phụ, C4 (Middle C) nằm trên 1 dòng kẻ phụ dưới khuông treble, C5 nằm trong khuông, C6 nằm trên khuông. Piano có 88 phím nhưng chỉ 7 tên nốt - quãng tám giúp phân biệt các nốt cùng tên ở độ cao khác nhau!',
      abc: `X:1
M:4/4
L:1/2
K:C
C, C | c c'|]`,
      interactive: true,
      playable: true,
    },
    {
      id: '1.2.3',
      title: 'Tìm nốt F trên Piano',
      description:
        'Trên khuông nhạc hiển thị 4 nốt F ở các quãng tám khác nhau (F3, F4, F5, F6). F4 luôn nằm trên dòng kẻ thứ 1 của khuông treble - đây là "mỏ neo" quan trọng để định vị các nốt khác. Từ F3 → F4 → F5 → F6, mỗi bước nhảy là 1 octave và tần số âm thanh gấp đôi mỗi khi lên 1 quãng tám!',
      abc: `X:1
M:4/4
L:1/2
K:C
F, F | f f'|]`,
      interactive: true,
      playable: true,
    },
    {
      id: '1.2.4',
      title: 'Ký hiệu 6 dây Guitar trên khuông nhạc',
      description:
        '6 nốt đại diện cho 6 dây buông Guitar (E5-B3-G3-D3-A2-E2). Guitar acoustic phủ gần 4 quãng tám từ E2 đến E5-E6! Dây 1 (E5) cao nhất, dây 6 (E2) thấp nhất. Lưu ý: Guitar viết trên khóa Sol nhưng âm thực tế thấp hơn 1 quãng tám so với viết - đây là quy ước đặc biệt!',
      abc: `X:1
M:6/4
L:1/2
K:C
e B G | D, A,, E,,|]`,
      interactive: true,
      playable: true,
    },
    {
      id: '1.2.5',
      title: 'So sánh Quãng tám',
      description:
        '3 nốt C ở 3 quãng tám liên tiếp: C3 (trầm, cần nhiều dòng kẻ phụ), C4 = Middle C (nốt "trung tâm" của bàn phím!), C5 (trong khuông treble). Khi lên 1 quãng tám, tần số sóng âm nhân đôi: C4 = 261.63 Hz → C5 = 523.25 Hz. Dù khác cao độ, các nốt C vẫn mang "màu sắc" âm thanh giống nhau - gọi là octave equivalence!',
      abc: `X:1
M:3/4
L:1/2
K:C
C, C c|]`,
      interactive: true,
      playable: true,
    },
    {
      id: '1.2.6',
      title: 'Thang âm C đầy đủ',
      description:
        '8 nốt tạo thành thang âm C trưởng (C Major Scale) - thang âm cơ bản nhất, chỉ dùng phím trắng trên piano! Bắt đầu từ C4 (Middle C), qua D-E-F-G-A-B, kết thúc ở C5. Lưu ý: khoảng cách giữa các nốt không đều - có 5 cặp cách 1 cung (whole step) và 2 cặp cách nửa cung (half step: E-F và B-C)!',
      abc: `X:1
M:4/4
L:1/4
K:C
C D E F | G A B c|]`,
      interactive: true,
      playable: true,
    },
  ],
  exercises: [
    {
      type: 'note-id',
      notes: [
        'C3',
        'C4',
        'C5',
        'D3',
        'D4',
        'E3',
        'E4',
        'F3',
        'F4',
        'G3',
        'G4',
        'A3',
        'A4',
        'B3',
        'B4',
      ],
      questionCount: 10,
    },
  ],
  // Interleaved Progressive Pattern: Octave 3-4 → Octave 3-5 → Full Range
  // Each level: Recognition → Recall → Application (9 games total, 255 XP)
  games: [
    // ===== LEVEL 1: Octave 3-4 =====
    {
      type: 'octave-challenge',
      labelVi: '🎵 Thử Thách Quãng Tám: Mức 1',
      descriptionVi: 'Nhận diện C3-C4, D3-D4',
      config: {
        notes: ['C3', 'C4', 'D3', 'D4'],
        questionCount: 4,
        xpReward: 15,
      },
    },
    {
      type: 'find-frequency',
      labelVi: '🎹 Tìm Tần Số: Mức 1',
      descriptionVi: 'Chơi C3, C4 trên Piano',
      config: {
        notes: ['C3', 'C4', 'D3', 'D4'],
        questionCount: 4,
        xpReward: 20,
      },
    },
    {
      type: 'high-low-battle',
      labelVi: '⚖️ Cao Thấp Đối Kháng: Mức 1',
      descriptionVi: 'So sánh C3 vs C4',
      config: {
        notes: ['C3', 'C4', 'D3', 'D4'],
        questionCount: 4,
        xpReward: 25,
      },
    },

    // ===== LEVEL 2: Octave 3-5 =====
    {
      type: 'octave-challenge',
      labelVi: '🎵 Thử Thách Quãng Tám: Mức 2',
      descriptionVi: 'Mở rộng E, F, G qua 3 octave',
      config: {
        notes: ['E3', 'E4', 'E5', 'F3', 'F4', 'F5', 'G3', 'G4', 'G5'],
        questionCount: 5,
        xpReward: 20,
      },
    },
    {
      type: 'find-frequency',
      labelVi: '🎹 Tìm Tần Số: Mức 2',
      descriptionVi: 'Chơi E3, E4, E5 trên Piano',
      config: {
        notes: ['E3', 'E4', 'E5', 'F3', 'F4', 'F5', 'G3', 'G4', 'G5'],
        questionCount: 5,
        xpReward: 25,
      },
    },
    {
      type: 'high-low-battle',
      labelVi: '⚖️ Cao Thấp Đối Kháng: Mức 2',
      descriptionVi: 'So sánh 3 nốt qua các octave',
      config: {
        notes: ['E3', 'E4', 'E5', 'F3', 'F4', 'F5', 'G3', 'G4', 'G5'],
        questionCount: 5,
        xpReward: 30,
      },
    },

    // ===== LEVEL 3: Full Range (Max 3 Notes per question) =====
    {
      type: 'octave-challenge',
      labelVi: '🎵 Thử Thách Quãng Tám: Mức 3',
      descriptionVi: 'Tất cả nốt C2-C6',
      config: {
        notes: ['C2', 'C3', 'C4', 'C5', 'C6', 'D2', 'D3', 'D4', 'D5', 'E2', 'E3', 'E4', 'E5'],
        questionCount: 6,
        xpReward: 30,
      },
    },
    {
      type: 'find-frequency',
      labelVi: '🎹 Tìm Tần Số: Mức 3',
      descriptionVi: 'Tối đa 3 octave: C3-C4-C5',
      config: {
        notes: [
          'C3',
          'C4',
          'C5',
          'D3',
          'D4',
          'D5',
          'E3',
          'E4',
          'E5',
          'F3',
          'F4',
          'F5',
          'G3',
          'G4',
          'G5',
        ],
        questionCount: 6,
        xpReward: 40,
      },
    },
    {
      type: 'high-low-battle',
      labelVi: '⚖️ Cao Thấp Đối Kháng: Mức 3',
      descriptionVi: 'Sắp xếp 3 nốt khác octave',
      config: {
        notes: [
          'C3',
          'C4',
          'C5',
          'D3',
          'D4',
          'D5',
          'E3',
          'E4',
          'E5',
          'F3',
          'F4',
          'F5',
          'G3',
          'G4',
          'G5',
          'A3',
          'A4',
          'A5',
          'B3',
          'B4',
          'B5',
        ],
        questionCount: 6,
        xpReward: 50,
      },
    },
  ],
}
