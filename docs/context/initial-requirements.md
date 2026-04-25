# **Báo cáo Nghiên cứu Kỹ thuật và Chiến lược Triển khai Nền tảng Giáo dục Âm nhạc Trực tuyến tại Việt Nam**

<!-- beads-id: doc-reqs -->

## **Tóm tắt Điều hành**

<!-- beads-id: doc-reqs-s1 -->

Trong bối cảnh chuyển đổi số mạnh mẽ của nền giáo dục Việt Nam, nhu cầu về các nền tảng học tập trực tuyến chất lượng cao, đặc biệt trong lĩnh vực nghệ thuật và âm nhạc, đang gia tăng nhanh chóng. Dự án xây dựng một website học nhạc lý tương tự Musicca.com, nhưng được tối ưu hóa cho người dùng Việt Nam với sự tích hợp sâu sắc các nhạc cụ phổ biến như Piano, Guitar và Sáo Trúc, đặt ra những thách thức kỹ thuật đa chiều. Báo cáo này cung cấp một phân tích toàn diện về kiến trúc hệ thống, giải pháp công nghệ và chiến lược triển khai nhằm đáp ứng các yêu cầu khắt khe về độ trễ âm thanh thấp, khả năng hiển thị đồ họa tương tác thời gian thực và sự tương thích với đặc thù sư phạm âm nhạc tại Việt Nam.

Trọng tâm của báo cáo nằm ở việc giải quyết bài toán đồng bộ hóa giữa âm thanh (Web Audio API) và hình ảnh (VexFlow/SVG) trên môi trường trình duyệt, đặc biệt là việc xử lý độ trễ trên các thiết bị di động tầm trung phổ biến tại Việt Nam. Bên cạnh đó, báo cáo đề xuất các giải pháp kỹ thuật cụ thể cho việc mô phỏng nhạc cụ Sáo Trúc – một yêu cầu độc đáo đòi hỏi sự tùy biến cao trong engine hiển thị và xử lý tín hiệu số (DSP) để nhận diện cao độ chính xác. Thông qua việc phân tích các thư viện mã nguồn mở hàng đầu như React, Tone.js, và VexFlow, cùng với các thuật toán nhận diện cao độ như YIN và Autocorrelation, báo cáo này định hình một lộ trình kỹ thuật vững chắc để xây dựng một sản phẩm giáo dục âm nhạc đẳng cấp quốc tế nhưng mang đậm bản sắc Việt Nam.

## ---

<!-- beads-id: doc-reqs-s2 -->

**1\. Phân tích Bối cảnh Thị trường và Yêu cầu Kỹ thuật Đặc thù**

### **1.1. Chân dung Người dùng và Môi trường Thiết bị tại Việt Nam**

<!-- beads-id: doc-reqs-s3 -->

Việc thiết kế một nền tảng giáo dục trực tuyến tại Việt Nam đòi hỏi sự thấu hiểu sâu sắc về hạ tầng thiết bị và thói quen sử dụng của người học. Khác với thị trường phương Tây nơi máy tính để bàn chiếm ưu thế trong giáo dục, Việt Nam là quốc gia "mobile-first" (ưu tiên di động). Dữ liệu thị trường cho thấy phần lớn học sinh, sinh viên tiếp cận nội dung số thông qua điện thoại thông minh chạy hệ điều hành Android tầm trung hoặc các thiết bị iOS đời cũ.

Điều này đặt ra một rào cản kỹ thuật lớn: **Ngân sách hiệu năng (Performance Budget)**. Ứng dụng phải hoạt động mượt mà trên các thiết bị có dung lượng RAM hạn chế (2-3GB) và vi xử lý không quá mạnh mẽ. Các tác vụ nặng như tổng hợp âm thanh thời gian thực (real-time audio synthesis) hay render đồ họa vector phức tạp cần được tối ưu hóa triệt để để tránh hiện tượng "giật lag" (jank) hoặc vỡ tiếng (audio crackling) do quá trình thu gom rác (Garbage Collection) của JavaScript gây ra.1

Ngoài ra, yếu tố **Độ trễ mạng (Network Latency)** cũng là một thách thức không nhỏ. Mặc dù mạng 4G/5G đang phủ sóng rộng rãi, sự ổn định của kết nối internet tại các vùng nông thôn vẫn là một biến số khó lường. Do đó, kiến trúc ứng dụng phải ưu tiên khả năng hoạt động ngoại tuyến (Offline-first) hoặc tải tài nguyên thông minh (Lazy loading) để đảm bảo trải nghiệm học tập không bị gián đoạn.

### **1.2. Đặc thù Sư phạm và Yêu cầu Địa phương hóa**

<!-- beads-id: doc-reqs-s4 -->

Một trong những thách thức lớn nhất khi xây dựng phần mềm giáo dục âm nhạc cho người Việt là sự song hành của hai hệ thống ký hiệu âm nhạc:

1. **Hệ thống Solfège (Do, Re, Mi...):** Được sử dụng chính thức trong hệ thống giáo dục phổ thông và các nhạc viện, chịu ảnh hưởng từ trường phái Pháp và Nga.
2. **Hệ thống Ký tự Latin (C, D, E...):** Được sử dụng rộng rãi trong cộng đồng chơi nhạc nhẹ, Guitar, và Jazz, chịu ảnh hưởng từ hệ thống Anh-Mỹ.

Hệ thống không thể chỉ đơn thuần hiển thị một trong hai, mà phải có khả năng chuyển đổi linh hoạt dựa trên ngữ cảnh bài học hoặc thói quen của người dùng. Ví dụ, khi dạy đọc bản nhạc (Sight-reading), hệ thống cần hiển thị "Nốt Đô", nhưng khi hiển thị hợp âm cho Guitar, nó phải hiển thị là "C trưởng" thay vì "Đô trưởng" để phù hợp với quy chuẩn quốc tế mà người chơi Guitar tại Việt Nam thường tiếp cận.2

**Yêu cầu kỹ thuật phát sinh:**

Cơ sở dữ liệu và lớp xử lý logic (Business Logic Layer) phải coi nốt nhạc là các đối tượng (Objects) chứa đa thông tin thay vì các chuỗi ký tự đơn thuần.

- Dữ liệu thô: MidiValue: 60
- Lớp hiển thị 1 (Solfège): "Đô"
- Lớp hiển thị 2 (Latin): "C"
- Lớp hiển thị 3 (Hợp âm): "C Major"
- Lớp hiển thị 4 (Sáo): "Thế bấm Đô 1" (với tất cả các ngón đóng)

### **1.3. Phân tích Tính năng Tương tự Musicca.com**

<!-- beads-id: doc-reqs-s5 -->

Musicca.com là tiêu chuẩn vàng cho các ứng dụng học nhạc lý trên web. Để đạt được chất lượng tương đương và vượt trội hơn với các tính năng cho Sáo Trúc, chúng ta cần phân rã các nhóm tính năng cốt lõi:

| Nhóm Tính năng                | Yêu cầu Kỹ thuật Cốt lõi                                         | Thách thức Đặc thù Việt Nam                               |
| :---------------------------- | :--------------------------------------------------------------- | :-------------------------------------------------------- |
| **Lý thuyết & Bài tập**       | Render bản nhạc động (VexFlow), Kiểm tra đáp án thời gian thực   | Hỗ trợ ngôn ngữ tiếng Việt chính xác về thuật ngữ âm nhạc |
| **Luyện nghe (Ear Training)** | Tổng hợp âm thanh độ trễ thấp, Bank tiếng nhạc cụ chất lượng cao | Cần mẫu âm thanh (Sample) của Sáo Trúc và nhạc cụ dân tộc |
| **Nhạc cụ ảo**                | Tương tác đa điểm (Multitouch), Phản hồi thị giác tức thì        | Sơ đồ ngón bấm Sáo (6 lỗ/10 lỗ) phức tạp hơn phím Piano   |
| **Nhận diện âm thanh**        | Xử lý tín hiệu số (DSP) qua Microphone                           | Lọc tạp âm môi trường ồn ào, nhận diện âm sắc Sáo         |

## ---

<!-- beads-id: doc-reqs-s6 -->

**2\. Kiến trúc Kỹ thuật Tổng thể**

Để xây dựng một nền tảng có khả năng mở rộng, bảo trì và hiệu năng cao, việc lựa chọn ngăn xếp công nghệ (Tech Stack) là quyết định chiến lược quan trọng nhất. Dựa trên yêu cầu về tính tương tác cao và xử lý âm thanh phức tạp, mô hình **Single Page Application (SPA)** là lựa chọn bắt buộc.

### **2.1. Lựa chọn Framework Frontend: Hệ sinh thái React**

<!-- beads-id: doc-reqs-s7 -->

Mặc dù Vue.js hay Angular đều là những framework mạnh mẽ, **React** được đề xuất cho dự án này vì hai lý do chính:

1. **Cơ chế Virtual DOM và Reconciliation:** Phù hợp để quản lý trạng thái phức tạp của các bài tập nhạc lý, nơi hàng chục thành phần (nốt nhạc, phím đàn, thanh tiến độ) cần cập nhật đồng thời.
2. **Hệ sinh thái thư viện phong phú:** Sự tồn tại của các thư viện cầu nối như react-vexflow hay các hook cho Web Audio giúp giảm thiểu thời gian phát triển boilerplate code.4

**Quản lý Trạng thái (State Management):** Với tần suất cập nhật trạng thái cực cao (ví dụ: con trỏ chạy trên bản nhạc theo nhịp 60FPS), Redux truyền thống có thể gây ra vấn đề về hiệu năng do việc re-render không cần thiết. **Zustand** được khuyến nghị sử dụng nhờ mô hình store tối giản, không cần wrapper Provider nặng nề và khả năng subscription trực tiếp vào từng phần nhỏ của state, giúp tối ưu hóa render cho các component động.6

### **2.2. Kiến trúc Engine Âm thanh (Audio Engine)**

<!-- beads-id: doc-reqs-s8 -->

Trực tiếp thao tác với AudioContext của Web Audio API cung cấp quyền kiểm soát tối đa nhưng lại quá phức tạp và dễ gặp lỗi (low-level). **Tone.js** là lớp trừu tượng (abstraction layer) tiêu chuẩn công nghiệp cho các ứng dụng âm nhạc trên web.7

**Chiến lược tải mẫu âm thanh (Sampling Strategy):**

Thay vì sử dụng các bộ tổng hợp âm thanh (Synthesizer) tạo ra sóng sin/vuông đơn điệu, ứng dụng cần sử dụng Tone.Sampler để phát lại các mẫu âm thanh thực của Piano, Guitar và Sáo. Điều này tạo cảm hứng học tập tốt hơn. Tuy nhiên, để tiết kiệm băng thông:

- Sử dụng định dạng nén **Opus** hoặc **MP3** thay vì WAV.
- Chỉ tải mẫu cho mỗi 3 bán cung (minor third) và sử dụng thuật toán thay đổi cao độ (pitch-shifting) của Web Audio API để điền vào các khoảng trống. Ví dụ: Tải mẫu nốt C4, nốt D\#4 được tạo ra bằng cách tăng tốc độ phát lại của C4.

### **2.3. Kiến trúc Engine Hiển thị (Notation Engine)**

<!-- beads-id: doc-reqs-s9 -->

**VexFlow** là thư viện duy nhất đáp ứng đủ các tiêu chuẩn hiển thị bản nhạc chuyên nghiệp trên nền tảng web.8

- **SVG vs Canvas:** Đối với ứng dụng giáo dục, **SVG** là lựa chọn tối ưu. SVG cho phép gắn các sự kiện DOM (click, hover) trực tiếp vào từng nốt nhạc (note head) hoặc thân nốt (stem), điều này cực kỳ quan trọng cho các bài tập tương tác (ví dụ: "Nhấp vào nốt sai để sửa"). Canvas chỉ là một bức ảnh raster, việc phát hiện tương tác sẽ đòi hỏi tính toán tọa độ X/Y phức tạp và kém chính xác hơn.

## ---

<!-- beads-id: doc-reqs-s10 -->

**3\. Thách thức và Giải pháp Kỹ thuật Chuyên sâu**

### **3.1. Bài toán Đồng bộ hóa Thời gian (Synchronization & Scheduling)**

<!-- beads-id: doc-reqs-s11 -->

Thách thức lớn nhất trong lập trình âm nhạc trên trình duyệt là sự bất đồng bộ của JavaScript. JavaScript chạy trên một luồng chính (Main Thread), nơi chia sẻ tài nguyên với các tác vụ render giao diện và xử lý sự kiện người dùng. Nếu luồng chính bị chặn (block) dù chỉ 50ms, âm thanh phát ra bởi setTimeout sẽ bị trễ, làm hỏng cảm giác nhịp điệu (rhythm).

**Giải pháp: Mẫu thiết kế Lookahead Scheduler** Chúng ta không thể kích hoạt âm thanh ngay tại thời điểm cần phát. Thay vào đó, hệ thống phải sử dụng mô hình "Lên lịch trước" (Lookahead Scheduling) 9:

1. **Audio Clock (Thời gian thực):** Sử dụng AudioContext.currentTime làm thước đo thời gian chuẩn tuyệt đối, chạy trên luồng xử lý âm thanh riêng biệt của trình duyệt.
2. **Scheduler Loop:** Sử dụng một vòng lặp (thường là requestAnimationFrame hoặc setInterval ngắn) để kiểm tra hàng đợi các nốt nhạc cần phát trong tương lai gần (ví dụ: 100ms tới).
3. **Scheduling:** Lên lịch phát âm thanh vào thời điểm chính xác trong tương lai bằng phương thức start(time).
4. **Hệ quả:** Ngay cả khi giao diện bị giật lag nhẹ, âm thanh vẫn được phát ra chính xác tuyệt đối theo nhịp đã định.

### **3.2. Xử lý Độ trễ Âm thanh trên Thiết bị Di động (Mobile Latency)**

<!-- beads-id: doc-reqs-s12 -->

Trên Android, độ trễ từ khi người dùng chạm vào màn hình đến khi âm thanh phát ra (Touch-to-Audio Latency) có thể lên tới 100-200ms do hạn chế phần cứng và driver. Trên iOS, Safari có chính sách chặn âm thanh tự động (Autoplay Policy).

**Giải pháp Kỹ thuật:**

- **Kỹ thuật "Unlock" AudioContext:** Trên iOS, AudioContext khởi tạo ở trạng thái suspended. Ứng dụng cần bắt sự kiện touchstart đầu tiên của người dùng để phát một buffer rỗng (silent buffer) có độ dài cực ngắn. Hành động này sẽ "đánh thức" luồng âm thanh và chuyển trạng thái sang running vĩnh viễn cho phiên làm việc đó.10
- **Sound Sprites:** Thay vì tải hàng trăm file âm thanh nhỏ (gây ra độ trễ do HTTP request và decoding), hãy gộp tất cả các nốt nhạc của một nhạc cụ vào một file âm thanh dài duy nhất. Khi phát, chỉ cần seek đến vị trí thời gian cụ thể (offset) và phát trong một khoảng thời gian (duration). Kỹ thuật này giảm thiểu overhead của việc giải mã âm thanh liên tục.12

### **3.3. Hiển thị Nhạc cụ Sáo Trúc: Một Thách thức Riêng biệt**

<!-- beads-id: doc-reqs-s13 -->

Khác với Piano (phím rời rạc) hay Guitar (ma trận dây/phím), Sáo Trúc hoạt động dựa trên tổ hợp đóng/mở lỗ bấm.

- **Vấn đề:** Không có thư viện chuẩn nào hỗ trợ hiển thị thế bấm sáo (fingering chart) động.
- **Giải pháp:** Xây dựng một **SVG Component Engine** tùy chỉnh.13
  - Sử dụng cấu trúc dữ liệu mảng bit (Bitmask) hoặc mảng Boolean để đại diện cho trạng thái các lỗ bấm. Ví dụ: \`\` tương ứng với 3 lỗ trên đóng, 3 lỗ dưới mở.
  - Hệ thống cần hỗ trợ cả hệ sáo 6 lỗ và 10 lỗ.
  - **Kỹ thuật "Nửa lỗ" (Half-holing):** Âm nhạc Việt Nam sử dụng nhiều nốt thăng/giáng yêu cầu bấm nửa lỗ. SVG component phải hỗ trợ thuộc tính fill-opacity hoặc clip-path để hiển thị một nửa lỗ bấm được tô màu, trực quan hóa kỹ thuật này cho người học.

## ---

<!-- beads-id: doc-reqs-s14 -->

**4\. Xây dựng Các Mô-đun Chức năng Chi tiết**

### **4.1. Mô-đun Đọc và Hiển thị Bản nhạc (VexFlow Integration)**

<!-- beads-id: doc-reqs-s15 -->

Mục tiêu là hiển thị một bản nhạc có khả năng tương tác, tô màu nốt nhạc khi người dùng chơi đúng/sai và con trỏ chạy theo nhịp.

**Quy trình Render:**

1. **Khởi tạo:** Xác định chiều rộng container để tính toán số lượng ô nhịp (measure) trên mỗi dòng. Đây là yếu tố quan trọng để đảm bảo tính Responsive trên mobile.
2. **Data Mapping:** Chuyển đổi dữ liệu bài học (JSON) thành đối tượng StaveNote của VexFlow.
3. **Draw Loop:** Sử dụng VF.Formatter để dàn trang tự động.

**Kỹ thuật Con trỏ (Cursor Animation):**

Để con trỏ di chuyển mượt mà (60fps) đồng bộ với âm thanh:

- Sử dụng Tone.Draw để đồng bộ hóa việc vẽ lại giao diện với sự kiện âm thanh. Tone.Draw.schedule(() \=\> updateCursor(), time) đảm bảo rằng callback cập nhật vị trí con trỏ sẽ được gọi vào đúng khung hình video tương ứng với thời điểm âm thanh phát ra.15
- Tuyệt đối không re-render toàn bộ bản nhạc VexFlow (rất nặng). Thay vào đó, sử dụng một thẻ div hoặc rect SVG tuyệt đối (absolute positioning) làm con trỏ và chỉ cập nhật thuộc tính transform: translateX(...) của nó.

### **4.2. Mô-đun Nhạc cụ Ảo (Virtual Instruments)**

<!-- beads-id: doc-reqs-s16 -->

#### **Piano Ảo**

<!-- beads-id: doc-reqs-s17 -->

- **Cấu trúc dữ liệu:** Sử dụng mảng đối tượng đại diện cho 88 phím. Mỗi phím chứa thông tin: MIDI note number, tần số, tên nốt (Đô/C), trạng thái (đang nhấn, thả).
- **Tương tác Đa điểm (Multitouch):** Sử dụng onTouchStart, onTouchMove, onTouchEnd thay vì onClick để cho phép người dùng lướt ngón tay trên phím đàn (glissando) hoặc nhấn hợp âm nhiều nốt cùng lúc trên màn hình cảm ứng.16

#### **Guitar Fretboard Ảo**

<!-- beads-id: doc-reqs-s18 -->

- **Hệ thống CAGED:** Để dạy nhạc lý Guitar hiệu quả, không chỉ hiển thị nốt đơn lẻ mà cần hiển thị các thế tay hợp âm (Chord Shapes). Thuật toán cần tính toán vị trí các nốt trên cần đàn dựa trên hệ thống CAGED, tự động đề xuất thế bấm tối ưu cho người mới bắt đầu.17
- **Responsive:** Trên mobile, cần đàn 22 phím là quá dài. Component phải có khả năng "zoom" hoặc cắt bớt (windowing), chỉ hiển thị khoảng phím liên quan (ví dụ: ngăn 1-5 cho hợp âm mở).

#### **Sáo Trúc Simulator**

<!-- beads-id: doc-reqs-s19 -->

- **Logic Âm học:** Sáo trúc thay đổi cao độ không chỉ bằng lỗ bấm mà còn bằng lực thổi (quãng 8 \- overblowing). Trên giao diện web, có thể sử dụng một thanh trượt (slider) hoặc phím Shift để mô phỏng lực thổi mạnh/nhẹ, qua đó chuyển đổi giữa các quãng 8 (ví dụ: Đô 1 lên Đô 2).
- **Chuyển giọng (Transposition):** Sáo trúc có nhiều tone (Sáo Đô C5, Sáo La A4, Sáo Sol G4). Hệ thống cần một lớp Transposer để khi người dùng chọn "Sáo La", nốt Đô trên bản nhạc vẫn hiển thị là Đô, nhưng âm thanh phát ra phải là nốt La (A4) \- tương ứng với thực tế vật lý của nhạc cụ.18

### **4.3. Công nghệ Nhận diện Cao độ (Microphone Pitch Detection)**

<!-- beads-id: doc-reqs-s20 -->

Tính năng này cho phép người dùng sử dụng nhạc cụ thật để tương tác với website, một bước tiến vượt bậc so với việc chỉ click chuột.

**Lựa chọn Thuật toán:**

- **FFT (Fast Fourier Transform):** Chỉ cung cấp phổ tần số, độ phân giải thấp ở tần số trầm (Guitar dây Bass).
- **Autocorrelation (YIN Algorithm):** Là tiêu chuẩn vàng cho nhận diện cao độ đơn âm (monophonic) như tiếng Sáo hoặc giọng hát. Nó so sánh tín hiệu với phiên bản trễ của chính nó để tìm chu kỳ cơ bản, cho độ chính xác cao hơn nhiều so với FFT thuần túy.19

**Triển khai với WebAssembly (Wasm):** Việc chạy thuật toán YIN bằng JavaScript thuần túy trên luồng chính sẽ gây treo giao diện. Giải pháp tối ưu là sử dụng mô-đun Wasm (được biên dịch từ C++ hoặc Rust) chạy trong **AudioWorklet**. AudioWorklet cho phép xử lý tín hiệu âm thanh trực tiếp trong luồng âm thanh thời gian thực (real-time audio thread) mà không bị ảnh hưởng bởi tải của giao diện người dùng, đảm bảo độ trễ thấp nhất có thể.21

## ---

<!-- beads-id: doc-reqs-s21 -->

**5\. Chiến lược Địa phương hóa và Sư phạm**

### **5.1. Xử lý Đa hệ thống Ký hiệu (Multi-notation System)**

<!-- beads-id: doc-reqs-s22 -->

Hệ thống cần xây dựng một lớp "Từ điển Nốt nhạc" (Note Dictionary Strategy Pattern).

- **Input:** MidiNode(60)
- **Processor:** Kiểm tra UserPreference (Người dùng chọn hệ Solfège hay ABC?) và LessonContext (Bài học cổ điển hay nhạc nhẹ?).
- **Output:** Trả về chuỗi hiển thị tương ứng.
  - _Case 1 (Sáo, Cổ điển):_ "Đô"
  - _Case 2 (Guitar, Đệm hát):_ "C"
  - _Case 3 (Nhạc lý nâng cao):_ "Tonic / Chủ âm"

### **5.2. Giáo trình cho Sáo Trúc**

<!-- beads-id: doc-reqs-s23 -->

Tích hợp các bài tập đặc thù cho kỹ thuật Sáo:

- **Luyện ngón (Finger drill):** Hiển thị chuỗi nốt chạy nhanh, yêu cầu người dùng bấm đúng trên mô hình ảo.
- **Kỹ thuật Rung/Vỗ:** Sử dụng ký hiệu VexFlow tùy chỉnh (Custom Glyphs) để hiển thị các ký hiệu rung hơi, vỗ ngón đặc trưng trong bản nhạc chèo/dân ca Việt Nam.

## ---

<!-- beads-id: doc-reqs-s24 -->

**6\. Tối ưu hóa Hạ tầng và Hiệu năng**

### **6.1. Chiến lược CDN tại Việt Nam**

<!-- beads-id: doc-reqs-s25 -->

Do đặc thù đường truyền cáp quang biển tại Việt Nam thường xuyên gặp sự cố, việc phụ thuộc vào CDN quốc tế (như AWS CloudFront gốc Mỹ) có thể gây chậm trễ. **Giải pháp:** Sử dụng chiến lược Multi-CDN hoặc ưu tiên các CDN có PoP (Point of Presence) mạnh tại Việt Nam như **Cloudflare Enterprise**, **VNCDN** hoặc **BizFly Cloud**. Điều này đảm bảo tài nguyên tĩnh (JS, CSS, Audio Samples) được tải với tốc độ nội địa (\<30ms).22

### **6.2. Ứng dụng PWA (Progressive Web App)**

<!-- beads-id: doc-reqs-s26 -->

Biến website thành ứng dụng cài đặt được trên điện thoại:

- **Service Workers:** Cấu hình Workbox để cache toàn bộ giao diện app shell và các bài học gần nhất.
- **Offline Fallback:** Khi mất mạng, người dùng vẫn có thể luyện tập các bài tập đã tải, hệ thống sẽ đồng bộ điểm số lên server khi có mạng trở lại. Điều này cực kỳ hữu ích cho đối tượng học sinh ở vùng sâu vùng xa.

### **6.3. Tối ưu hóa Database và API**

<!-- beads-id: doc-reqs-s27 -->

Để lưu trữ tiến độ học tập (giống Musicca):

- Sử dụng **PostgreSQL** cho dữ liệu quan hệ (Người dùng \- Khóa học \- Điểm số).
- Sử dụng **Redis** để cache các bảng xếp hạng (Leaderboard) hoặc dữ liệu bài học truy cập thường xuyên.
- Thiết kế API theo chuẩn **RESTful** hoặc **GraphQL**, cho phép tải từng phần nội dung bài học (Incremental Static Regeneration của Next.js) để tăng tốc độ tải trang ban đầu.

## ---

<!-- beads-id: doc-reqs-s28 -->

**Kết luận**

Việc xây dựng một nền tảng học nhạc lý trực tuyến cho người Việt, bao phủ các nhạc cụ Piano, Guitar và Sáo Trúc, là một bài toán kỹ thuật phức tạp nhưng đầy tiềm năng. Chìa khóa thành công nằm ở sự kết hợp tinh tế giữa các công nghệ web hiện đại (React, Web Audio API, WebAssembly) với sự thấu hiểu sâu sắc về văn hóa và thói quen học tập của người bản địa.

Bằng cách giải quyết triệt để các vấn đề về độ trễ âm thanh, tối ưu hóa hiển thị trên thiết bị di động cấu hình thấp, và đặc biệt là xây dựng một hệ thống hiển thị nhạc cụ linh hoạt hỗ trợ Sáo Trúc, dự án này không chỉ lấp đầy khoảng trống thị trường mà còn có thể định hình lại cách người Việt tiếp cận và học tập âm nhạc trong kỷ nguyên số. Các giải pháp được đề xuất trong báo cáo này cung cấp một lộ trình kỹ thuật vững chắc, khả thi và sẵn sàng cho việc triển khai thực tế ở quy mô lớn.

## **7. Nội dung Khóa học (Course Content)**

<!-- beads-id: doc-reqs-s29 -->

> 📚 **Xem chi tiết tại:** [COURSE_CONTENT.md](./COURSE_CONTENT.md)
>
> Tài liệu nội dung khóa học đã được tách ra thành file riêng, bao gồm 5 module với 30 bài học chi tiết, được viết bằng tiếng Việt.

---

## **Phụ lục: Bảng So sánh Công nghệ**

<!-- beads-id: doc-reqs-s30 -->

| Hạng mục            | Công nghệ Đề xuất | Lý do Lựa chọn                        | Thay thế Tiềm năng          |
| :------------------ | :---------------- | :------------------------------------ | :-------------------------- |
| **Frontend**        | React (Next.js)   | SEO tốt, hệ sinh thái VexFlow mạnh    | Vue.js (Nuxt)               |
| **Audio**           | Tone.js           | Scheduler chính xác, Sampler tích hợp | Howler.js (thiếu Scheduler) |
| **Notation**        | VexFlow (SVG)     | Tương tác DOM tốt, chuẩn công nghiệp  | OpenSheetMusicDisplay       |
| **State**           | Zustand           | Nhẹ, tối ưu cho 60fps                 | Redux Toolkit               |
| **Pitch Detection** | Wasm \+ YIN       | Hiệu năng cao, chính xác cho nhạc cụ  | ml5.js (nặng, dựa trên AI)  |
| **Database**        | PostgreSQL        | Ổn định, truy vấn phức tạp tốt        | MongoDB                     |

---

_(Hết báo cáo)_

#### **Works cited**

<!-- beads-id: doc-reqs-s31 -->

1. How to Achieve 60FPS Animations in React Native, accessed January 10, 2026, [https://www.callstack.com/blog/60fps-animations-in-react-native](https://www.callstack.com/blog/60fps-animations-in-react-native)
2. Gợi ý 11 bản nhạc piano cho người mới học đơn giản, dễ chơi \- Yamaha Music Vietnam, accessed January 10, 2026, [https://vn.yamaha.com/vi/musical-instruments/pianos/news/2023/goi-y-11-ban-nhac-piano-cho-nguoi-moi-hoc-don-gian-de-choi.html](https://vn.yamaha.com/vi/musical-instruments/pianos/news/2023/goi-y-11-ban-nhac-piano-cho-nguoi-moi-hoc-don-gian-de-choi.html)
3. 10 Hợp Âm Đàn Guitar Cơ Bản Và Đầy Đủ Nhất Cho Người Mới, accessed January 10, 2026, [https://hokaguitar.com/hop-am-dan-guitar/](https://hokaguitar.com/hop-am-dan-guitar/)
4. markacola/react-vexflow \- GitHub, accessed January 10, 2026, [https://github.com/markacola/react-vexflow](https://github.com/markacola/react-vexflow)
5. Piano Flash Cards React App \- Greg Jopa, accessed January 10, 2026, [https://www.gregjopa.com/2023/01/piano-flash-cards-react-app/](https://www.gregjopa.com/2023/01/piano-flash-cards-react-app/)
6. The ultimate guide to optimizing React Flow project performance \[EBOOK\] \- Synergy Codes, accessed January 10, 2026, [https://www.synergycodes.com/blog/guide-to-optimize-react-flow-project-performance](https://www.synergycodes.com/blog/guide-to-optimize-react-flow-project-performance)
7. Tone.js, accessed January 10, 2026, [https://tonejs.github.io/](https://tonejs.github.io/)
8. VexFlow \- HTML5 Music Engraving, accessed January 10, 2026, [https://www.vexflow.com/](https://www.vexflow.com/)
9. A tale of two clocks | Articles \- web.dev, accessed January 10, 2026, [https://web.dev/articles/audio-scheduling](https://web.dev/articles/audio-scheduling)
10. pavle-goloskokovic/web-audio-touch-unlock \- GitHub, accessed January 10, 2026, [https://github.com/pavle-goloskokovic/web-audio-touch-unlock](https://github.com/pavle-goloskokovic/web-audio-touch-unlock)
11. Unlocking Web Audio — the smarter way | by Pavle Goloskokovic | HackerNoon.com, accessed January 10, 2026, [https://medium.com/hackernoon/unlocking-web-audio-the-smarter-way-8858218c0e09](https://medium.com/hackernoon/unlocking-web-audio-the-smarter-way-8858218c0e09)
12. 5 Top Audio Processing Libraries for JavaScript | by Yasas Sri Wickramasinghe, accessed January 10, 2026, [https://blog.bitsrc.io/4-top-audio-processing-libraries-for-javascript-2e5fff0f071d](https://blog.bitsrc.io/4-top-audio-processing-libraries-for-javascript-2e5fff0f071d)
13. Fingering diagram builder, version 0.2 | Bret Pimentel, woodwinds, accessed January 10, 2026, [https://bretpimentel.com/fingering-diagram-builder-version-0-2/](https://bretpimentel.com/fingering-diagram-builder-version-0-2/)
14. Use SVG and Javascript to create Chart Generator Web App (no third party packages or libraries) \- Stack Overflow, accessed January 10, 2026, [https://stackoverflow.com/questions/70269127/use-svg-and-javascript-to-create-chart-generator-web-app-no-third-party-package](https://stackoverflow.com/questions/70269127/use-svg-and-javascript-to-create-chart-generator-web-app-no-third-party-package)
15. Analyser \- Tone.js, accessed January 10, 2026, [https://tonejs.github.io/examples/animationSync](https://tonejs.github.io/examples/animationSync)
16. uiwwsw/virtual-keyboard \- NPM, accessed January 10, 2026, [https://www.npmjs.com/package/@uiwwsw/virtual-keyboard](https://www.npmjs.com/package/@uiwwsw/virtual-keyboard)
17. Interactive guitar fretboard viewer for scales and pentatonics. Built with TypeScript and Next.js using static site generation. \- GitHub, accessed January 10, 2026, [https://github.com/radzionc/guitar](https://github.com/radzionc/guitar)
18. A virtual fingering chart for woodwind musical instruments. Made in MaxMSP. \- GitHub, accessed January 10, 2026, [https://github.com/instrumentbible/Woodwind-Fingerings](https://github.com/instrumentbible/Woodwind-Fingerings)
19. pitchfinder CDN by jsDelivr \- A CDN for npm and GitHub, accessed January 10, 2026, [https://www.jsdelivr.com/package/npm/pitchfinder](https://www.jsdelivr.com/package/npm/pitchfinder)
20. Detecting pitch with the Web Audio API and autocorrelation \- Caffeinspiration, accessed January 10, 2026, [https://alexanderell.is/posts/tuner/](https://alexanderell.is/posts/tuner/)
21. Web Audio: Hz and Cents \- javascript \- Stack Overflow, accessed January 10, 2026, [https://stackoverflow.com/questions/19603530/web-audio-hz-and-cents](https://stackoverflow.com/questions/19603530/web-audio-hz-and-cents)
22. Optimizing website with VNCDN: Accelerating the page load speed and enhancing user experience \- vnetwork, accessed January 10, 2026, [https://www.vnetwork.vn/en-US/news/optimizing-website-with-vncdn/](https://www.vnetwork.vn/en-US/news/optimizing-website-with-vncdn/)
