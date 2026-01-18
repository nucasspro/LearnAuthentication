/**
 * Multi-Factor Authentication (MFA) - Learning Content
 *
 * Story Theme: THE VERIFICATION GAUNTLET
 * Metaphor: Multiple security checkpoints in a high-security facility
 * Tone: Layered defense, redundancy, threat mitigation
 */


export const mfaAuthContent = {
  storyHook: {
    title: "BẢO MẬT 2 LỚP (MFA)",
    subtitle: "Chiếc Két Sắt Ngân Hàng",
    clearanceLevel: "Maximum Security",
    status: "ACTIVE",
    narrative: `Năm 2026. Mật khẩu không còn an toàn nữa. Hacker có thể đoán ra mật khẩu "123456" của bạn trong 0.001 giây.

Chào mừng bạn đến với **Cơ Chế Bảo Mật Đa Lớp (MFA)**.
Hãy tưởng tượng tài khoản của bạn là một **Két Sắt Ngân Hàng**.
Để mở két, bạn cần 2 thứ:
1. **Chìa khóa** (Mật khẩu - Thứ bạn biết).
2. **Mã số bí mật gửi về điện thoại** (OTP - Thứ bạn có).

Nếu trộm chỉ ăn cắp được chìa khóa? Hắn vẫn đứng khóc ngoài cửa vì không có điện thoại của bạn.
Nhiệm vụ của bạn: Xây dựng hàng phòng thủ "bất khả xâm phạm" này.`,
  },

  sections: [
    // ============================================
    // ESSENTIAL KNOWLEDGE (10 minutes)
    // ============================================
    {
      id: 'section-1',
      category: 'concepts' as const,
      title: '3 Nhân Tố Xác Thực: Kiềng 3 Chân',
      icon: 'Lock',
      estimatedTime: '3 min',
      content: `MFA (Multi-Factor Authentication) yêu cầu bằng chứng từ NHIỀU nhóm khác nhau. Giống như cái kiềng 3 chân, càng nhiều chân càng vững.

### 1. Knowledge (Thứ Bạn Biết) 🧠
- Password, PIN, Tên con vật đầu tiên, Tên người yêu cũ.
- **Điểm yếu**: Dễ quên, dễ đoán, dễ bị nhìn trộm.
-Ví dụ: \`Password123\`, \`1234\`.

### 2. Possession (Thứ Bạn Có) 📱
- Điện thoại (nhận SMS), Thẻ ATM, USB Security Key (YubiKey).
- **Điểm mạnh**: Hacker ở Nga không thể thò tay sang Việt Nam lấy điện thoại của bạn được.
- **Điểm yếu**: Có thể bị mất hoặc bị móc túi.

### 3. Inherence (Chính Là Bạn) 👆
- Vân tay, Khuôn mặt (FaceID), Mống mắt.
- **Điểm mạnh**: Không ai có vân tay giống hệt bạn. Không thể "quên" ở nhà.
- **Điểm yếu**: Bị ép buộc (khi ngủ, khi bị bắt cóc).

### 🛡️ Chiến Thuật Phối Hợp
MFA chuẩn là phải kết hợp **ít nhất 2 loại khác nhau**:
- ❌ Sai: Password + Câu hỏi bí mật (Cả 2 đều là "Thứ Bạn Biết").
- ✅ Đúng: Password (Biết) + OTP về điện thoại (Có).
- ✅ Xịn: Password (Biết) + FaceID (Là Bạn).

### 💡 Tại Sao Cần MFA?
Giả sử Hacker biết mật khẩu Facebook của bạn:
- Nếu không có MFA: Hắn đăng nhập -> Đổi pass -> **Mất nick**.
- Nếu có MFA: Hắn đăng nhập -> Facebook hỏi "Nhập mã 6 số từ đt" -> Hắn chịu thua -> **Nick an toàn**.`,

      keyPoints: [
        'MFA yêu cầu bằng chứng từ ít nhất 2 nhóm khác nhau',
        '3 nhân tố: Biết (Password), Có (Phone), Là (Biometric)',
        'Kết hợp 2 nhân tố cùng loại (Password + PIN) không gọi là MFA',
        'MFA chặn đứng 99.9% các vụ hack tài khoản do lộ password',
      ],

      visual: `
┌─────────────────────────────────────────────────┐
│           QUY TRÌNH BẢO MẬT 2 LỚP               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Bước 1: Thứ Bạn Biết (Knowledge)               │
│  ┌──────────────────┐                           │
│  │ Username/Password │                          │
│  └────────┬─────────┘                           │
│           │                                     │
│           ↓                                     │
│  Bước 2: Thứ Bạn Có (Possession)                │
│  ┌──────────────────┐                           │
│  │  Mã 6 Số (OTP)   │ (Từ App hoặc SMS)         │
│  │   (TOTP token)   │                           │
│  └────────┬─────────┘                           │
│           │                                     │
│           ↓                                     │
│  Bước 3: Chính Là Bạn (Inherence - Tuỳ chọn)    │
│  ┌──────────────────┐                           │
│  │  Quét Vân Tay    │ (TouchID / FaceID)        │
│  │  (WebAuthn)      │                           │
│  └────────┬─────────┘                           │
│           │                                     │
│           ↓                                     │
│  ✅ ĐĂNG NHẬP THÀNH CÔNG                        │
│                                                 │
└─────────────────────────────────────────────────┘`,
    },

    {
      id: 'section-2',
      category: 'concepts' as const,
      title: 'TOTP: Mã Số Biến Hình Sau 30 Giây',
      icon: 'Clock',
      estimatedTime: '3 min',
      content: `**TOTP** (Time-Based One-Time Password) chính là công nghệ sau lưng Google Authenticator hay Authy. Nó sinh ra mã 6 số thay đổi liên tục mỗi 30 giây.

### ⚙️ Cách Nó Hoạt Động (Ma Thuật?)
Không, là Toán học thuần túy.

1. **Lúc Cài Đặt (Quét mã QR)**:
   - Server và Điện thoại của bạn bí mật trao nhau một **Secret Key** (Chuỗi ký tự ngẫu nhiên).
   - "Chúng mình cùng giữ bí mật này nhé!".

2. **Lúc Đăng Nhập**:
   - Điện thoại nhìn đồng hồ: "Bây giờ là 10:00:30".
   - Điện thoại tính: \`HMAC(SecretKey + ThờiGian)\` = **123456**.
   - Server cũng nhìn đồng hồ: "Bây giờ là 10:00:30".
   - Server tính: \`HMAC(SecretKey + ThờiGian)\` = **123456**.
   - **Khớp nhau!** => Cho vào.

### 🆚 TOTP App vs SMS OTP
| Đặc điểm | SMS OTP (Tin nhắn) | TOTP App (Authenticator) |
|----------|-------------------|--------------------------|
| **Cần mạng?** | Có (Cần sóng di động) | **Không** (Chế độ máy bay vẫn chạy) |
| **Bảo mật** | Thấp (Dễ bị SIM Swap) | **Cao** (Key nằm trong máy) |
| **Tốc độ** | Chậm (Chờ tin nhắn về) | **Nhanh** (Mở app là có ngay) |
| **Chi phí** | Tốn tiền gửi tin | Miễn phí |

### ⚠️ Lưu ý quan trọng
Vì mã TOTP dựa trên **Thời Gian**, nên nếu đồng hồ điện thoại của bạn bị SAI giờ, mã sẽ SAI. Hãy bật "Automatic Date & Time" nhé!`,

      keyPoints: [
        'TOTP sinh mã dựa trên: Secret Key + Thời Gian Hiện Tại',
        'Không cần mạng Internet hay sóng điện thoại vẫn hoạt động',
        'An toàn hơn SMS rất nhiều',
        'Điện thoại phải chỉnh đúng giờ mới chạy được',
      ],

      codeExamples: {
        javascript: [{
          language: 'javascript' as const,
          label: 'JavaScript (Node.js)',
          code: `// Quy trình tạo mã TOTP như Google Authenticator
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// 1. Setup: Server tạo Secret và đưa QR cho user quét
async function setupMFA(userEmail) {
  const secret = speakeasy.generateSecret({
    name: \`MyApp (\${userEmail})\` // Tên hiển thị trong GG Auth
  });

  // Tạo mã QR để user quét bằng app
  const qrImage = await QRCode.toDataURL(secret.otpauth_url);

  return { secret: secret.base32, qrImage };
}

// 2. Verify: User nhập mã 6 số (token)
function verifyMFA(userToken, savedSecret) {
  // Server tính toán lại mã dựa trên secret đã lưu
  const verified = speakeasy.totp.verify({
    secret: savedSecret,
    encoding: 'base32',
    token: userToken,  // Mã user nhập (ví dụ: 123456)
    window: 2          // Cho phép sai lệch 60 giây (phòng khi user nhập chậm)
  });

  return verified; // true hoặc false
}`,
        }],
      },
    },

    {
      id: 'section-3',
      category: 'concepts' as const,
      title: 'Backup Codes: Chìa Khóa Cứu Sinh',
      icon: 'Shield',
      estimatedTime: '4 min',
      content: `Chuyện gì xảy ra nếu bạn làm **mất điện thoại**?
Bạn mất luôn app Authenticator. Bạn không thể lấy mã OTP. Bạn bị **NHỐT Ở NGOÀI** tài khoản của chính mình.

Đây là lúc cần đến **Backup Codes** (Mã dự phòng).

### 🗝️ Backup Code Là Gì?
- Là danh sách 10 mã số đặc biệt được cấp KHI BẠN VỪA CÀI MFA.
- Mỗi mã chỉ dùng được **1 lần duy nhất**.
- Nó có quyền lực ngang hàng với mã OTP.

### 🚨 Kịch Bản Cứu Hộ
1. Bạn mất điện thoại.
2. Bạn đăng nhập -> Web đòi OTP.
3. Bạn bấm "Try another way" (Thử cách khác) -> Chọn "Backup codes".
4. Bạn lấy tờ giấy đã in backup codes ra, nhập mã đầu tiên: \`XM82-99KS\`.
5. Đăng nhập thành công! -> Vào cài đặt -> Tắt MFA cũ -> Cài MFA cho điện thoại mới.

### 📝 Nguyên Tắc Vàng
1. **Tải về ngay**: Khi setup MFA, web luôn bảo bạn "Download backup codes". **ĐỪNG BỎ QUA!**
2. **Cất kỹ**: In ra giấy kẹp vào ví, hoặc lưu trong trình quản lý mật khẩu (1Password, Bitwarden).
3. **Đừng chụp ảnh**: Ảnh trong điện thoại mất thì cũng như không.`,

      keyPoints: [
        'Backup Codes là phao cứu sinh duy nhất khi mất điện thoại',
        'Mỗi mã chỉ dùng 1 lần',
        'Phải lưu trữ ở nơi AN TOÀN và KHÁC nơi lưu password',
        'Mất cả điện thoại lẫn Backup Codes = Vĩnh biệt tài khoản',
      ],
    },

    // ============================================
    // IMPORTANT KNOWLEDGE (15 minutes)
    // ============================================
    {
      id: 'section-4',
      category: 'security' as const,
      title: 'FIDO2: Tạm Biệt Mật Khẩu',
      icon: 'Zap',
      estimatedTime: '5 min',
      content: `**FIDO2 / WebAuthn** là công nghệ tương lai, cho phép bạn đăng nhập KHÔNG CẦN mật khẩu, mà dùng chính thiết bị của bạn (Vân tay, FaceID, USB YubiKey).

### 🏆 Tại Sao Nó "Bá Đạo"?
- **Chống Phishing Tuyệt Đối**: Hacker có làm ra trang web giả mạo giống hệt Facebook.com thì USB Key cũng KHÔNG BAO GIỜ hoạt động trên web giả đó. Nó chỉ trả lời khi đúng là Facebook thật.
- **Tiện Lợi**: Chỉ cần chạm ngón tay là xong. Không cần nhớ pass, không cần nhập code.

### 🛠️ Cách Hoạt Động
Nó dùng **Mật Mã Khóa Công Khai (Public Key Cryptography)** - công nghệ dùng trong Bitcoin.
1. **Lúc Đăng Ký**: Bạn tạo ra một cặp chìa khóa (Private Key & Public Key).
   - **Private Key**: Nằm chết dí trong trong chip bảo mật của máy bạn (không ai lấy được ra).
   - **Public Key**: Gửi cho Server cất giữ.

2. **Lúc Đăng Nhập**:
   - Server gửi một câu đố (Challenge).
   - Máy bạn dùng **Private Key** để giải đố và ký tên.
   - Server dùng **Public Key** để kiểm tra chữ ký.
   - Đúng chữ ký -> Vào.

### 🗝️ Các Loại "Chìa Khóa"
1. **Platform Authenticator (Có sẵn)**: TouchID (Mac), FaceID (iPhone), Windows Hello.
2. **Roaming Authenticator (Mang theo)**: YubiKey, Titan Key (Cắm cổng USB).

### 🔮 Lời Khuyên
Hãy bật tính năng này (thường gọi là **Passkey**) trên các tài khoản quan trọng (Google, Apple, GitHub). Nó an toàn hơn cả OTP.`,

      keyPoints: [
        'FIDO2/Passkey: Đăng nhập bằng vân tay/FaceID, không cần mật khẩu',
        'Private Key luôn nằm trong máy, không bao giờ gửi lên mạng',
        'Chống Phishing 100% (Key chỉ hoạt động đúng domain gốc)',
        'An toàn nhất hiện nay',
      ],
    },

    {
      id: 'section-5',
      category: 'best_practices' as const,
      title: 'Chiến Lược Triển Khai: Ép Hay Không Ép?',
      icon: 'GitBranch',
      estimatedTime: '5 min',
      content: `Khi làm app, bạn sẽ đối mặt câu hỏi khó: **"Có nên bắt buộc user bật MFA không?"**

### 1. Bắt Buộc (Mandatory) 👮
- **Áp dụng**: App Ngân hàng, Ví điện tử, App Admin nội bộ.
- **Cách làm**: "Bạn phải cài MFA mới được dùng tiếp".
- **Ưu**: An toàn tuyệt đối.
- **Nhược**: User lười sẽ bỏ app.

### 2. Khuyến Khích (Recommended) 🤝
- **Áp dụng**: Facebook, Google, Game.
- **Cách làm**: Hiện thông báo "Bật MFA để bảo vệ nick nhé" nhưng cho phép bấm "Để sau".
- **Ưu**: User vui vẻ, không bị ép.
- **Nhược**: Chỉ 10% user chịu bật, 90% còn lại dễ bị hack.

### 3. Thông Minh (Risk-Based) 🧠
- **Áp dụng**: Các hệ thống hiện đại.
- **Cách làm**: Bình thường không hỏi. Chỉ khi thấy **LẠ** (IP lạ, Máy mới) mới bắt nhập MFA.

### 💡 Lời Khuyên
Nếu app của bạn liên quan đến TIỀN -> **BẮT BUỘC**.
Nếu là Mạng xã hội/Giải trí -> **KHUYẾN KHÍCH** + Tặng quà (Ví dụ: Bật MFA được tặng skin game).`,

      keyPoints: [
        'Ép buộc MFA: An toàn cao nhưng user dễ bỏ',
        'Khuyến khích: Dễ chịu hơn nhưng ít người dùng',
        'Risk-Based: Cân bằng tốt nhất (Chỉ hỏi khi nghi ngờ)',
        'Nên tặng quà/ưu đãi để dụ user bật MFA',
      ],
    },

    {
      id: 'section-6',
      category: 'security' as const,
      title: 'Cứu Hộ Tài Khoản: Khi Mất Tất Cả',
      icon: 'AlertTriangle',
      estimatedTime: '5 min',
      content: `Kịch bản ác mộng: User mất điện thoại, mất luôn cả Backup Codes. Họ đang khóc ròng vì không vào được tài khoản. Bạn phải làm gì?

### 🚑 Các Phương Án Cứu Hộ

1. **Gửi Email Xác Nhận**:
   - "Bấm vào link này để tắt MFA".
   - ❌ **Rủi ro**: Nếu hacker hack được mail -> Hack được luôn tài khoản.

2. **Hỏi Câu Hỏi Bảo Mật**:
   - "Con vật đầu tiên tên gì?", "Mẹ bạn tên gì?".
   - ❌ **Rủi ro**: Hacker có thể đoán mò hoặc tìm trên Facebook.

3. **Xác Minh Danh Tính (KYC)** - An toàn nhất:
   - Yêu cầu user chụp ảnh CMND/CCCD gửi lên.
   - Yêu cầu quay video mặt.
   - Nhân viên CSKH kiểm tra thủ công rồi mới mở khóa.
   - ✅ **Ưu**: Hacker chịu thua.
   - ❌ **Nhược**: Tốn nhân sự, user phải chờ lâu.

### 📝 Code Ví Dụ (Quy trình chuẩn)`,

      keyPoints: [
        'Email là điểm yếu nhất trong quy trình khôi phục',
        'Nên kết hợp nhiều bước: Email + Câu hỏi bí mật',
        'Cách an toàn nhất: Xác minh danh tính thủ công (KYC)',
      ],
    },

    {
      id: 'section-7',
      category: 'advanced' as const,
      title: 'MFA Thông Minh (Adaptive Auth)',
      icon: 'Brain',
      estimatedTime: '7 min',
      content: `Đừng lúc nào cũng bắt user nhập mã OTP. Hãy học cách "nhìn mặt" user.

### 🕵️ Hệ Thống Chấm Điểm Rủi Ro (Risk Scoring)

Mỗi lần user đăng nhập, hãy chấm điểm:

| Yếu tố | Bình thường (0 điểm) | Đáng ngờ (50 điểm) | Báo động (100 điểm) |
|--------|----------------------|--------------------|---------------------|
| **Thiết bị** | Máy cũ đã lưu | Máy mới tinh | Máy từng bị report hack |
| **Vị trí** | Tại nhà (VN) | Khác thành phố | Khác quốc gia (Vừa ở VN, 5p sau ở Mỹ) |
| **Thời gian**| Giờ hành chính | 3 giờ sáng | Đăng nhập liên tục 100 lần/phút |

### 🤖 Ra Quyết Định
- **< 30 điểm**: Cho vào luôn (Không cần OTP).
- **30 - 70 điểm**: Nghi ngờ -> Bắt nhập OTP (Step-up Auth).
- **> 70 điểm**: Chặn luôn -> Bắt đổi mật khẩu.

### 💻 Ví dụ Logic Code
\`\`\`javascript
if (riskScore > 70) {
  blockAccount();
} else if (riskScore > 30) {
  requireMFA(); // Gửi OTP
} else {
  allowLogin(); // Vào thẳng
}
\`\`\``,

      keyPoints: [
        'Adaptive Auth giúp cân bằng giữa Bảo mật và Tiện lợi',
        'Dựa trên: Thiết bị, Vị trí, Thời gian, Hành vi',
        'Impossible Travel: Di chuyển nhanh hơn máy bay (Hà Nội -> London trong 1 phút)',
        'Giảm phiền toái cho user thật, tăng khó khăn cho hacker',
      ],
    },

    {
      id: 'section-8',
      category: 'security' as const,
      title: 'Các Chiêu Thức Hack MFA & Cách Đỡ',
      icon: 'Shield',
      estimatedTime: '7 min',
      content: `MFA không phải là "thẻ bài miễn tử". Hacker vẫn có cách lách qua nếu bạn sơ hở.

### 🎭 Chiêu 1: SIM Swapping (Cướp SIM)
- **Kịch bản**: Hacker gọi lên tổng đài Viettel/Mobi: "A lô, em bị mất điện thoại, làm lại SIM giúp em". Hắn đọc đúng số CMND (mua trên mạng) -> Tổng đài tin -> Cấp SIM mới cho hắn.
- **Hậu quả**: Hacker nhận được mọi tin nhắn SMS OTP của bạn.
- **Cách đỡ**: ĐỪNG DÙNG SMS OTP. Hãy dùng App Authenticator.

### 🎣 Chiêu 2: Real-time Phishing (Câu Cá Thời Gian Thực)
- **Kịch bản**: Hacker gửi link "Facebook-khuyenmai.com". Bạn đăng nhập.
- Web giả hỏi: "Nhập OTP". Bạn nhập "123456".
- Hacker (đang ngồi rình) lấy số "123456" đó nhập vào Facebook thật NGAY LẬP TỨC.
- **Hậu quả**: Bạn vừa tự tay đưa chìa khóa cho trộm.
- **Cách đỡ**: Dùng **FIDO2 / Security Key**. Khóa vật lý sẽ nhận ra "Ủa đây là web đểu" và từ chối hoạt động.

### 👻 Chiêu 3: Mã Độc (Malware)
- **Kịch bản**: Bạn cài app lậu (Crack). App này âm thầm chụp ảnh màn hình hoặc đọc trộm bộ nhớ (Clipboard).
- **Hậu quả**: Hacker thấy được mã OTP khi bạn copy-paste.
- **Cách đỡ**: Không cài app linh tinh, dùng Antivirus.

### 📡 Chiêu 4: Man-in-the-Middle (Nghe Lén)
- **Kịch bản**: Ra quán cafe, Wifi Free không pass. Hacker cũng đang ở đó, bắt mọi gói tin bạn gửi đi.
- **Cách đỡ**: App/Web bắt buộc dùng HTTPS.`,

      keyPoints: [
        'SMS OTP là loại yếu nhất (Dễ bị SIM Swap)',
        'Phishing có thể lừa lấy OTP của bạn trong tích tắc',
        'FIDO2 là khắc tinh cứng của Phishing',
        'Cẩn thận với Wifi công cộng và App lạ',
      ],
    },

    {
      id: 'section-9',
      category: 'best_practices' as const,
      title: 'Checklist Triển Khai Thực Tế',
      icon: 'CheckCircle2',
      estimatedTime: '6 min',
      content: `Trước khi đưa tính năng MFA lên Production, hãy tick đủ danh sách này:

### 1. Khi Setup (Lần đầu)
- [ ] **Rate Limit**: Không cho phép request gửi OTP quá 5 lần/phút (tránh spam SMS tốn tiền).
- [ ] **Xác thực Email**: Phải confirm email trước rồi mới cho bật MFA.
- [ ] **Bắt buộc Backup Codes**: Không cho user "Bỏ qua" bước lưu mã dự phòng.
- [ ] **Test ngay**: Bắt user nhập thử mã OTP vừa tạo xem có đúng không.

### 2. Khi Xác Thực (Login)
- [ ] **HTTPS**: Bắt buộc 100%.
- [ ] **Time Window**: Cho phép sai lệch ±1 phút (vì đồng hồ mỗi người mỗi khác).
- [ ] **Block**: Nhập sai 5 lần -> Khóa tạm thời 15 phút.

### 3. Lưu Trữ (Database)
- [ ] **Mã hóa Secret**: Đừng lưu "Secret Key" dạng plain text. Hãy mã hóa nó (AES-256).
- [ ] **Backup Codes**: Phải băm (Hash) giống như password.

### 4. Thông Báo
- [ ] Gửi mail báo: "Tài khoản của bạn vừa bật MFA".
- [ ] Gửi mail cảnh báo: "Có người lạ cố đăng nhập nick bạn".`,

      keyPoints: [
        'Luôn có Rate Limiting để chống Spam và Brute-force',
        'Secret Key và Backup Codes phải được bảo vệ như Password',
        'Cho phép sai số thời gian (Time Drift) để tránh lỗi vặt',
        'Thông báo cho user ngay khi có biến động',
      ],
    },
  ],

  securityScenarios: [
    {
      id: 'scenario-1',
      title: 'Dò Mã OTP (Brute-Force)',
      threatLevel: 'MEDIUM' as const,
      attack: 'Hacker có mật khẩu nhưng thiếu OTP. Hắn dùng tool tự động điền thử mã từ 000000 đến 999999.',
      exploitation: 'Nếu bạn không giới hạn số lần thử, hắn sẽ tìm ra mã đúng chỉ trong vài phút.',
      defense: 'Giới hạn tốc độ (Rate Limit): Cho phép nhập sai tối đa 5 lần. Sau đó khóa tài khoản 15 phút. Luôn cảnh báo qua email khi có nhiều lần đăng nhập thất bại.',
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Code Bị Lỗi (Không giới hạn)',
        code: `// ❌ LỖI: Cho phép thử sai thoải mái
app.post('/verify-totp', (req, res) => {
  const isValid = verifyToken(req.body.token);
  if (!isValid) return res.status(401).send('Sai mã');

  // Hacker có thể gọi API này 1 triệu lần
  res.send('Login thành công');
});`,
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Code An Toàn (Có Rate Limit)',
        code: `// ✅ AN TOÀN: Đếm số lần sai
app.post('/verify-totp', async (req, res) => {
  const attempts = await getFailedAttempts(req.user.id);

  if (attempts > 5) {
    return res.status(429).send('Nhập sai quá nhiều. Thử lại sau 15p.');
  }

  const isValid = verifyToken(req.body.token);

  if (!isValid) {
    await incrementFailedAttempts(req.user.id);
    return res.status(401).send('Sai mã');
  }

  await resetFailedAttempts(req.user.id);
  res.send('Login thành công');
});`,
      },
    },
    {
      id: 'scenario-2',
      title: 'Hồi Sinh Mã Cũ (Replay Attack)',
      threatLevel: 'HIGH' as const,
      attack: 'Hacker bắt được gói tin chứa Backup Code mà bạn vừa dùng. Hắn thử dùng lại code đó để đăng nhập.',
      exploitation: 'Nếu Server không đánh dấu code là "Đã dùng", hacker có thể dùng code đó vĩnh viễn.',
      defense: 'Xóa ngay Backup Code khỏi database (hoặc đánh dấu đã dùng) ngay sau khi xác thực thành công.',
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Code Bị Lỗi (Không hủy code)',
        code: `// ❌ LỖI: Code dùng xong vẫn để đó
app.post('/verify-backup', (req, res) => {
  if (user.backupCodes.includes(req.body.code)) {
    return res.send('OK'); // Code vẫn nằm trong DB -> Dùng lại được
  }
});`,
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Code An Toàn (Xóa code)',
        code: `// ✅ AN TOÀN: Dùng xong xóa luôn
app.post('/verify-backup', async (req, res) => {
  const codeIndex = user.backupCodes.indexOf(req.body.code);

  if (codeIndex > -1) {
    // Xóa code khỏi mảng
    user.backupCodes.splice(codeIndex, 1);
    await user.save();
    return res.send('OK');
  }
});`,
      },
    },
    {
      id: 'scenario-3',
      title: 'Hack Email Cướp Nick',
      threatLevel: 'HIGH' as const,
      attack: 'Hacker hack được email của bạn. Hắn vào web bấm "Quên mật khẩu" -> "Mất thiết bị MFA".',
      exploitation: 'Web gửi link reset MFA về email. Hacker bấm link -> Tắt MFA -> Đổi pass -> Chiếm tài khoản.',
      defense: 'Quy trình khôi phục phải đa lớp. Đừng chỉ tin vào mỗi Email. Hãy hỏi thêm câu hỏi bí mật, hoặc bắt chờ 48h để user thật kịp nhận ra.',
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Code Bị Lỗi (Tin tưởng Email tuyệt đối)',
        code: `// ❌ LỖI: Có email là có tất cả
app.post('/reset-mfa', (req, res) => {
  sendEmail(user.email, 'Link tắt MFA...');
  // Hacker bấm link này là xong phim
});`,
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Code An Toàn (Đa lớp)',
        code: `// ✅ AN TOÀN: Email chỉ là bước 1
app.post('/reset-mfa', (req, res) => {
  // Bước 1: Gửi mã về email
  // Bước 2: Bắt nhập thêm số CMND hoặc trả lời câu hỏi bí mật
  if (!verifySecurityQuestions(req.body.answers)) {
    return res.status(403).send('Trả lời sai câu hỏi bí mật');
  }

  // Bước 3: Treo yêu cầu trong 48h để chủ nick nhận được cảnh báo
  scheduleMfaReset(user.id, hours(48));
});`,
      },
    },
  ],

  challenges: [
    {
      id: 'challenge-1',
      title: 'Lắp Ráp Máy OTP',
      difficulty: 'Easy' as const,
      points: 100,
      description: 'Viết code tạo mã QR cho user quét, sau đó verify mã 6 số mà user nhập vào. Nhớ xử lý vụ lệch giờ nhé.',
    },
    {
      id: 'challenge-2',
      title: 'Hệ Thống Cảnh Báo Thông Minh',
      difficulty: 'Medium' as const,
      points: 200,
      description: 'Xây dựng bộ lọc đăng nhập: Nếu user đăng nhập từ thiết bị lạ hoặc vị trí lạ -> Bắt nhập OTP. Nếu quen -> Cho qua.',
    },
    {
      id: 'challenge-3',
      title: 'Quy Trình Cứu Hộ An Toàn',
      difficulty: 'Hard' as const,
      points: 300,
      description: 'Thiết kế quy trình lấy lại nick khi mất điện thoại sao cho Hacker dù hack được mail cũng không cướp được nick.',
    },
  ],

  achievements: {
    protocolInitiate: {
      title: 'Tân Binh Bảo Mật',
      description: 'Hoàn thành các bài học cơ bản về MFA',
      icon: 'Lock',
      color: 'text-green-400',
    },
    securityOperative: {
      title: 'Vệ Binh Số',
      description: 'Hiểu rõ về TOTP, FIDO2 và các nguy cơ tấn công',
      icon: 'Shield',
      color: 'text-blue-400',
    },
    eliteGuardian: {
      title: 'Chuyên Gia Phòng Thủ',
      description: 'Hoàn thành bài học và vượt qua 2 thử thách',
      icon: 'ShieldAlert',
      color: 'text-purple-400',
    },
    masterArchitect: {
      title: 'Kiến Trúc Sư Pháo Đài',
      description: 'Làm chủ hoàn toàn nghệ thuật bảo mật đa lớp',
      icon: 'Crown',
      color: 'text-yellow-400',
    },
  },

  crossReferences: {
    session: {
      title: 'Session Authentication',
      comparison: 'MFA được dùng kèm với Session. Sau khi đăng nhập Pass + OTP xong thì mới tạo Session.',
    },
    jwt: {
      title: 'JWT Authentication',
      comparison: 'Trong JWT, bạn có thể thêm claim "mfa_verified: true" để đánh dấu user này đã qua lớp bảo vệ thứ 2.',
    },
    oauth: {
      title: 'OAuth 2.0',
      comparison: 'Khi dùng Google để đăng nhập, Google sẽ lo vụ MFA. App của bạn chỉ cần nhận kết quả cuối cùng.',
    },
  },
};

// Export code examples for components
export const codeExamples = {
  totpGeneration: mfaAuthContent.sections[1].codeExamples,
};

export const securityScenarios = mfaAuthContent.securityScenarios;
export const challenges = mfaAuthContent.challenges;
