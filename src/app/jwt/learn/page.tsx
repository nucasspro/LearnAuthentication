/**
 * JWT (JSON Web Token) Learning Page
 * Comprehensive guide to stateless authentication
 * Reference: SPECIFICATION Section 4.2, RFC 7519
 */

'use client';

import { AchievementTracker } from '@/components/learning/AchievementTracker';
import { ChallengeCard } from '@/components/learning/ChallengeCard';
import { ProgressSidebar } from '@/components/learning/ProgressSidebar';
import { SectionCard } from '@/components/learning/SectionCard';
import { SecurityScenario } from '@/components/learning/SecurityScenario';
import { StoryHeader } from '@/components/learning/StoryHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { jwtAuthContent } from '@/lib/content/jwt-auth';
import { ProgressData, Section } from '@/lib/types';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Database, FileText, Key, Lock, RefreshCw, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function JWTLearnPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<ProgressData>({
    completedSections: [],
    percentage: 0,
    level: 'Protocol Initiate',
    achievements: [],
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jwt-auth-progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('jwt-auth-progress', JSON.stringify(progress));
  }, [progress]);

  const sections: Section[] = [
    { id: 'section-1', title: 'The Digital Passport: What is JWT?', icon: 'FileText', category: 'concepts', estimatedTime: 3 },
    { id: 'section-2', title: 'Token Anatomy: The Three-Part Structure', icon: 'Package', category: 'concepts', estimatedTime: 4 },
    { id: 'section-3', title: 'The Authentication Flow', icon: 'Workflow', category: 'concepts', estimatedTime: 3 },
    { id: 'section-4', title: 'Refresh Token Pattern: Staying Logged In', icon: 'RotateCw', category: 'system', estimatedTime: 5 },
    { id: 'section-5', title: 'Signing Algorithms: HS256 vs RS256', icon: 'Lock', category: 'security', estimatedTime: 5 },
    { id: 'section-6', title: 'JWT vs Session: The Ultimate Showdown', icon: 'Swords', category: 'concepts', estimatedTime: 5 },
    { id: 'section-7', title: 'Security Vulnerabilities & Attacks', icon: 'ShieldAlert', category: 'security', estimatedTime: 8 },
    { id: 'section-8', title: 'Claims Management & Best Practices', icon: 'FileText', category: 'best_practices', estimatedTime: 6 },
    { id: 'section-9', title: 'Production Deployment Checklist', icon: 'Rocket', category: 'best_practices', estimatedTime: 6 },
  ];

  const handleSectionComplete = (sectionId: string) => {
    setProgress(prev => {
      const isCompleted = prev.completedSections.includes(sectionId);
      const newCompleted = isCompleted
        ? prev.completedSections.filter(id => id !== sectionId)
        : [...prev.completedSections, sectionId];

      const percentage = Math.floor((newCompleted.length / sections.length) * 100);

      let level: ProgressData['level'] = 'Protocol Initiate';
      if (percentage >= 91) level = 'Master Architect';
      else if (percentage >= 61) level = 'Elite Guardian';
      else if (percentage >= 31) level = 'Security Operative';

      return {
        ...prev,
        completedSections: newCompleted,
        percentage,
        level,
      };
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/jwt-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Decode JWT to show structure (Base64 decode - not secure validation!)
        const [header, payload, signature] = data.token.split('.');
        const decodedHeader = JSON.parse(atob(header));
        const decodedPayload = JSON.parse(atob(payload));

        setTokenData({
          token: data.token,
          header: decodedHeader,
          payload: decodedPayload,
          signature: signature,
          username: decodedPayload.sub || username,
          expiresAt: decodedPayload.exp ? new Date(decodedPayload.exp * 1000).toISOString() : null,
          issuedAt: decodedPayload.iat ? new Date(decodedPayload.iat * 1000).toISOString() : new Date().toISOString(),
          status: 'Active',
        });
        setIsLoggedIn(true);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTokenData(null);
    setError('');
  };

  // Get content sections
  const securityScenarios = jwtAuthContent.securityScenarios;
  const challenges = jwtAuthContent.challenges;

  return (
    <div className="min-h-screen bg-transparent text-zinc-400 font-sans selection:bg-zinc-800 selection:text-white">
      <StoryHeader
        title={jwtAuthContent.storyHook.title}
        narrative={
          <>
            <span className="text-neon-400 font-bold">{jwtAuthContent.storyHook.subtitle}:</span> {jwtAuthContent.storyHook.narrative}
          </>
        }
        icon={FileText}
        clearanceLevel={jwtAuthContent.storyHook.clearanceLevel}
        status={jwtAuthContent.storyHook.status}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Sticky Sidebar */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <ProgressSidebar
              sections={sections.map((s, i) => ({ ...s, title: jwtAuthContent.sections[i]?.title || s.title, category: jwtAuthContent.sections[i]?.category || s.category }))}
              progress={progress}
              onSectionClick={scrollToSection}
            />
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Section 1: What is JWT */}
            <SectionCard
              {...sections[0]}
              title={jwtAuthContent.sections[0].title}
              category={jwtAuthContent.sections[0].category}
              isCompleted={progress.completedSections.includes(sections[0].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg text-zinc-300">
                JSON Web Token (JWT) giống như một <span className="text-white font-bold">Hộ Chiếu Điện Tử</span>.
                Khác với session (sổ hộ khẩu để ở phường), JWT được user <span className="text-white">tự mang theo</span> -
                mọi thông tin định danh đều nằm gọn trong token.
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full aspect-video mb-8 border border-white/10 rounded-none overflow-hidden group cursor-pointer">
                    <Image
                      src="/images/jwt/concept-passport.png"
                      alt="Anime Style Digital Passport"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <p className="text-sm font-mono text-neon-400 font-bold uppercase tracking-wider">Hình.01_Hộ_Chiếu_Điện_Tử</p>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest bg-black/50 px-2 py-1 border border-white/10 backdrop-blur-sm">Nhấn để xem</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl bg-[#0a0a0a] border-white/10 p-0 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <Image
                      src="/images/jwt/concept-passport.png"
                      alt="Anime Style Digital Passport"
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="bg-zinc-900/50 border border-zinc-800 p-6 my-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                  <Key className="w-4 h-4" />
                  Cơ Chế Hộ Chiếu Số
                </h4>
                <ul className="space-y-3 text-zinc-400 text-sm">
                  <li className="flex gap-3">
                    <span className="text-white font-bold font-mono">01.</span>
                    Server ký đóng dấu token bằng secret key (hoặc private key)
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white font-bold font-mono">02.</span>
                    Token chứa <span className="text-zinc-200 font-mono">data user + ngày hết hạn</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white font-bold font-mono">03.</span>
                    Client lưu token (memory, localStorage, hoặc httpOnly cookie)
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white font-bold font-mono">04.</span>
                    Client gửi token trong <span className="text-white">Authorization header</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white font-bold font-mono">05.</span>
                    Server kiểm tra chữ ký - không cần tra cứu database
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
                <div className="bg-black p-6">
                  <h5 className="text-white font-bold mb-2 uppercase tracking-wider text-xs">Stateless</h5>
                  <p className="text-sm text-zinc-500">
                    Token chứa mọi dữ liệu. Server chỉ cần verify chữ ký.
                  </p>
                </div>
                <div className="bg-black p-6">
                  <h5 className="text-white font-bold mb-2 uppercase tracking-wider text-xs">Portable (Linh Hoạt)</h5>
                  <p className="text-sm text-zinc-500">
                    Bất kỳ server nào có secret key đều có thể validate token.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Section 2: Token Anatomy */}
            <SectionCard
              {...sections[1]}
              title={jwtAuthContent.sections[1].title}
              category={jwtAuthContent.sections[1].category}
              isCompleted={progress.completedSections.includes(sections[1].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6 text-zinc-300">
                Giống như cuốn hộ chiếu, JWT có đúng <span className="text-white font-bold">3 phần</span> ngăn cách bởi dấu chấm (.).
                Mỗi phần đảm nhiệm một vai trò sống còn trong vũ điệu xác thực.
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full aspect-video mb-8 border border-white/10 rounded-none overflow-hidden group cursor-pointer">
                    <Image
                      src="/images/jwt/structure.png"
                      alt="Anime Style JWT Structure"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <p className="text-sm font-mono text-neon-400 font-bold uppercase tracking-wider">Hình.02_Cấu_Trúc_Token_Chibi</p>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest bg-black/50 px-2 py-1 border border-white/10 backdrop-blur-sm">Nhấn để xem</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl bg-[#0a0a0a] border-white/10 p-0 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <Image
                      src="/images/jwt/structure.png"
                      alt="Anime Style JWT Structure"
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-px bg-zinc-800 border border-zinc-800">
                {[
                  { num: 1, label: 'Header', desc: 'Algorithm and token type', code: '{ "alg": "HS256", "typ": "JWT" }', color: 'bg-zinc-900' },
                  { num: 2, label: 'Payload', desc: 'User data, claims, expiration', code: '{ "sub": "12345", "exp": 1735603200 }', color: 'bg-zinc-900' },
                  { num: 3, label: 'Signature', desc: 'HMAC(header.payload, secret)', code: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', color: 'bg-zinc-900' },
                ].map(step => (
                  <div key={step.num} className="flex gap-6 p-6 bg-black hover:bg-zinc-900/50 transition-colors group">
                    <div className="flex-shrink-0 w-8 h-8 border border-zinc-700 text-zinc-500 group-hover:text-white group-hover:border-white rounded-none flex items-center justify-center font-bold font-mono transition-colors">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm uppercase tracking-wider mb-1">{step.label}</div>
                      <div className="text-zinc-500 text-xs mb-3">{step.desc}</div>
                      <code className="text-xs text-zinc-300 font-mono block break-all bg-zinc-900/50 p-2 border border-zinc-800">{step.code}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-zinc-900/30 border-l-2 border-l-red-500 border-y border-r border-zinc-800 p-6">
                <h5 className="text-red-500 font-bold mb-2 flex items-center gap-2 uppercase tracking-wider text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Lưu Ý Bảo Mật Chết Người
                </h5>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Base64 là <span className="text-white font-bold">mã hóa (encoding), KHÔNG phải encryption</span>. Bất kỳ ai
                  cũng có thể giải mã và đọc payload. Chữ ký (Signature) chỉ ngăn <span className="text-white">chỉnh sửa</span>, không ngăn đọc.
                  Tuyệt đối KHÔNG để password hay thông tin mật trong JWT payload!
                </p>
              </div>
            </SectionCard>

            {/* Section 3: Authentication Flow */}
            <SectionCard
              {...sections[2]}
              title={jwtAuthContent.sections[2].title}
              category={jwtAuthContent.sections[2].category}
              isCompleted={progress.completedSections.includes(sections[2].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6 text-zinc-300">
                Quy trình xác thực JWT khác hoàn toàn với Session. Thay vì tạo ra "sổ lưu trú" ở server,
                server cấp một <span className="text-white font-bold">giấy thông hành có chữ ký</span> (token) và client tự giữ lấy.
              </p>

              <div className="space-y-px bg-zinc-800 border border-zinc-800">
                {[
                  { num: 1, label: 'Client → Server', desc: 'User gửi thông tin đăng nhập', code: '{ username, password }' },
                  { num: 2, label: 'Server Kiểm Tra', desc: 'So sánh hash password với database', code: 'bcrypt.compare(password, hash)' },
                  { num: 3, label: 'Tạo JWT', desc: 'Tạo token chứa thông tin user', code: 'jwt.sign({ sub: userId }, secret)' },
                  { num: 4, label: 'Ký Tên (Sign)', desc: 'Tạo chữ ký HMAC với secret key', code: 'HMACSHA256(header.payload, secret)' },
                  { num: 5, label: 'Server → Client', desc: 'Trả về JWT trong response', code: '{ token: "eyJhbGci..." }' },
                  { num: 6, label: 'Client Lưu Trữ', desc: 'Lưu vào Memory, LocalStorage hoặc Cookie', code: 'Authorization: Bearer <token>' },
                  { num: 7, label: 'Client Gửi Token', desc: 'Gửi kèm token trong Header mỗi request', code: 'Authorization: Bearer eyJhbGci...' },
                  { num: 8, label: 'Server Xác Thực', desc: 'Kiểm tra chữ ký & hạn dùng', code: 'jwt.verify(token, secret)' },
                ].map(step => (
                  <div key={step.num} className="flex gap-4 p-4 bg-black hover:bg-zinc-900/50 transition-colors border-l-2 border-l-transparent hover:border-l-white">
                    <div className="flex-shrink-0 w-6 h-6 bg-zinc-900 text-zinc-400 border border-zinc-700 flex items-center justify-center text-xs font-bold font-mono">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm uppercase tracking-wide mb-1">{step.label}</div>
                      <div className="text-zinc-500 text-xs mb-2">{step.desc}</div>
                      <code className="text-[10px] text-zinc-400 font-mono block bg-zinc-950 p-1.5 border border-zinc-900">{step.code}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-zinc-900/30 border border-zinc-800 p-6">
                <h5 className="text-zinc-300 font-bold mb-2 uppercase tracking-wider text-sm">Điểm Mấu Chốt</h5>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Chú ý rằng <span className="text-white font-bold">không có bước tra cứu database</span> ở bước 6-8.
                  Server chỉ cần tính toán chữ ký để xác thực. Đây chính là lý do JWT được gọi là "stateless" (không trạng thái).
                </p>
              </div>
            </SectionCard>

            {/* Section 4: Refresh Token Pattern */}
            <SectionCard
              {...sections[3]}
              title={jwtAuthContent.sections[3].title}
              category={jwtAuthContent.sections[3].category}
              isCompleted={progress.completedSections.includes(sections[3].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6 text-zinc-300">
                Access token ngắn hạn (15 phút) an toàn nhưng phiền toái. <span className="text-white font-bold">Refresh token</span> giải quyết
                việc này: token dài hạn (7 ngày) dùng để xin cấp lại access token mới mà không cần đăng nhập lại.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rotate-45 translate-x-12 -translate-y-12 blur-2xl group-hover:bg-white/10 transition-colors"></div>
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <Clock className="w-5 h-5 text-white" />
                    <h4 className="text-white font-bold uppercase tracking-wider text-sm">Access Token</h4>
                  </div>
                  <div className="space-y-3 text-xs relative z-10 border-t border-zinc-800 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase tracking-wide">Thời Hạn</span>
                      <span className="text-white font-bold font-mono">15 PHÚT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase tracking-wide">Mục Đích</span>
                      <span className="text-zinc-300 text-right">Gọi API</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase tracking-wide">Lưu Trữ</span>
                      <span className="text-zinc-300 text-right">Memory (RAM)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-700/20 rotate-45 translate-x-12 -translate-y-12 blur-2xl group-hover:bg-zinc-700/30 transition-colors"></div>
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <RefreshCw className="w-5 h-5 text-zinc-400" />
                    <h4 className="text-zinc-300 font-bold uppercase tracking-wider text-sm">Refresh Token</h4>
                  </div>
                  <div className="space-y-3 text-xs relative z-10 border-t border-zinc-800 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase tracking-wide">Thời Hạn</span>
                      <span className="text-zinc-300 font-bold font-mono">7 NGÀY</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase tracking-wide">Mục Đích</span>
                      <span className="text-zinc-400 text-right">Cấp Mới Access Token</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase tracking-wide">Lưu Trữ</span>
                      <span className="text-zinc-400 text-right">httpOnly Cookie</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black border border-white/10 p-6">
                <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Giao Thức Tuần Tự</h5>
                <ol className="space-y-2 text-sm text-zinc-400 list-decimal list-inside font-mono">
                  <li>Đăng nhập → Nhận cả access token + refresh token</li>
                  <li>Dùng access token để gọi API</li>
                  <li>Access token hết hạn sau 15 phút</li>
                  <li>Gửi refresh token đến endpoint <code className="text-zinc-300">/refresh</code></li>
                  <li>Nhận access token mới (và có thể cả refresh token mới)</li>
                  <li>Tiếp tục dùng access token mới</li>
                </ol>
              </div>
            </SectionCard>

            {/* Section 5: Signing Algorithms */}
            <SectionCard
              {...sections[4]}
              title={jwtAuthContent.sections[4].title}
              category={jwtAuthContent.sections[4].category}
              isCompleted={progress.completedSections.includes(sections[4].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6 text-zinc-300">
                JWT hỗ trợ nhiều thuật toán ký. Hai loại phổ biến nhất là <span className="text-white font-bold">HS256</span> (đối xứng)
                và <span className="text-white font-bold">RS256</span> (bất đối xứng).
              </p>

              <div className="grid md:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
                <div className="bg-black p-6 hover:bg-zinc-900/30 transition-colors">
                  <h4 className="text-white font-bold uppercase tracking-wide text-sm mb-4 border-b border-zinc-800 pb-2">HS256 (Symmetric)</h4>
                  <p className="text-zinc-400 mb-4 text-xs leading-relaxed">
                    Dùng chung một secret key cho cả <span className="text-white">ký (sign) VÀ kiểm tra (verify)</span>
                  </p>
                  <div className="space-y-2 text-[10px] uppercase font-bold tracking-wider">
                    <div className="text-emerald-500">+ Đơn giản, nhanh</div>
                    <div className="text-emerald-500">+ Ứng dụng đơn lẻ</div>
                    <div className="text-red-500">- Rủi ro lộ Secret Key</div>
                  </div>
                  <Badge className="mt-4 bg-zinc-900 text-zinc-300 border border-zinc-700 text-[10px] uppercase rounded-none tracking-widest">
                    Phù hợp: Monoliths
                  </Badge>
                </div>

                <div className="bg-black p-6 hover:bg-zinc-900/30 transition-colors">
                  <h4 className="text-white font-bold uppercase tracking-wide text-sm mb-4 border-b border-zinc-800 pb-2">RS256 (Asymmetric)</h4>
                  <p className="text-zinc-400 mb-4 text-xs leading-relaxed">
                    Private key để ký, <span className="text-white">Public key để kiểm tra</span>
                  </p>
                  <div className="space-y-2 text-[10px] uppercase font-bold tracking-wider">
                    <div className="text-emerald-500">+ Bảo mật Key tốt hơn</div>
                    <div className="text-emerald-500">+ Ai cũng verify được</div>
                    <div className="text-zinc-500">~ Phức tạp hơn</div>
                  </div>
                  <Badge className="mt-4 bg-zinc-900 text-zinc-300 border border-zinc-700 text-[10px] uppercase rounded-none tracking-widest">
                    Phù hợp: Microservices
                  </Badge>
                </div>
              </div>
            </SectionCard>

            {/* Section 6: JWT vs Session */}
            <SectionCard
              {...sections[5]}
              title={jwtAuthContent.sections[5].title}
              category={jwtAuthContent.sections[5].category}
              isCompleted={progress.completedSections.includes(sections[5].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6 text-zinc-300">
                Chọn JWT hay Session là chủ đề tranh luận muôn thuở. Hiểu rõ <span className="text-white font-bold">sự đánh đổi (trade-offs)</span> là chìa khóa để chọn đúng công cụ.
              </p>

              <div className="overflow-x-auto border border-zinc-800 mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-900 border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-zinc-500 font-bold uppercase tracking-wider text-xs">Factor</th>
                      <th className="px-4 py-3 text-left text-white font-bold uppercase tracking-wider text-xs">JWT</th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-bold uppercase tracking-wider text-xs">Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    <tr className="hover:bg-zinc-900/30 bg-black">
                      <td className="px-4 py-3 font-bold text-zinc-400">Trạng Thái</td>
                      <td className="px-4 py-3 text-white">Stateless (Token chứa data)</td>
                      <td className="px-4 py-3 text-zinc-500">Stateful (Server lưu data)</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/30 bg-black">
                      <td className="px-4 py-3 font-bold text-zinc-400">Scale Ngang</td>
                      <td className="px-4 py-3 text-emerald-500">Dễ (Không cần DB chung)</td>
                      <td className="px-4 py-3 text-zinc-500">Khó (Cần Redis/DB chung)</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/30 bg-black">
                      <td className="px-4 py-3 font-bold text-zinc-400">Thu Hồi (Revoke)</td>
                      <td className="px-4 py-3 text-red-500">Khó (Cần blacklist)</td>
                      <td className="px-4 py-3 text-emerald-500">Tức thì (Xóa khỏi DB)</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/30 bg-black">
                      <td className="px-4 py-3 font-bold text-zinc-400">Mobile Apps</td>
                      <td className="px-4 py-3 text-emerald-500">Dễ (Header Authorization)</td>
                      <td className="px-4 py-3 text-zinc-500">Khó (Cookie management)</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/30 bg-black">
                      <td className="px-4 py-3 font-bold text-zinc-400">Bảo Mật</td>
                      <td className="px-4 py-3 text-zinc-500">Token ở client (nguy cơ XSS)</td>
                      <td className="px-4 py-3 text-emerald-500">Server kiểm soát hoàn toàn</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-white/10 p-4 bg-zinc-950/50">
                  <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Dùng JWT Khi:</h4>
                  <ul className="space-y-2 text-xs text-zinc-400">
                    <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-white flex-shrink-0 mt-0.5" /> Mobile App / SPA (React, Vue)</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-white flex-shrink-0 mt-0.5" /> Kiến trúc Microservices</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-white flex-shrink-0 mt-0.5" /> Cross-domain authentication</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-white flex-shrink-0 mt-0.5" /> Cần scale hệ thống lớn</li>
                  </ul>
                </div>

                <div className="border border-zinc-800 p-4 bg-black">
                  <h4 className="text-zinc-500 font-bold mb-3 uppercase tracking-wider text-xs">Dùng Session Khi:</h4>
                  <ul className="space-y-2 text-xs text-zinc-500">
                    <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-zinc-600 flex-shrink-0 mt-0.5" /> Web truyền thống (SSR, MVC)</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-zinc-600 flex-shrink-0 mt-0.5" /> Cần chức năng "Logout từ xa"</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-zinc-600 flex-shrink-0 mt-0.5" /> Bảo mật là ưu tiên số 1</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-3 h-3 text-zinc-600 flex-shrink-0 mt-0.5" /> Ứng dụng nội bộ đơn giản</li>
                  </ul>
                </div>
              </div>
            </SectionCard>

            {/* Section 7: Security Scenarios */}
            <SectionCard
              {...sections[6]}
              title={jwtAuthContent.sections[6].title}
              category={jwtAuthContent.sections[6].category}
              isCompleted={progress.completedSections.includes(sections[6].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6 text-zinc-300">
                JWT rất mạnh mẽ nhưng không phải "đạn bạc". Rất nhiều <span className="text-white font-bold">lỗ hổng nghiêm trọng</span> đã
                xảy ra trong thực tế. Hiểu rõ cách tấn công là cách tốt nhất để phòng thủ.
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full aspect-video mb-8 border border-white/10 rounded-none overflow-hidden group cursor-pointer">
                    <Image
                      src="/images/jwt/security.png"
                      alt="Anime Style Security Check"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm font-mono text-red-500 font-bold uppercase tracking-wider">Warning: Fake_Token_Detected</p>
                      </div>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest bg-black/50 px-2 py-1 border border-white/10 backdrop-blur-sm">Nhấn để xem</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl bg-[#0a0a0a] border-white/10 p-0 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <Image
                      src="/images/jwt/security.png"
                      alt="Anime Style Security Check"
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-4">
                {securityScenarios.map(scenario => (
                  <SecurityScenario key={scenario.id} {...scenario} />
                ))}
              </div>
            </SectionCard>

            {/* Section 8: Claims Management */}
            <SectionCard
              {...sections[7]}
              title={jwtAuthContent.sections[7].title}
              category={jwtAuthContent.sections[7].category}
              isCompleted={progress.completedSections.includes(sections[7].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6 text-zinc-300">
                JWT claims là dữ liệu trong payload. Chọn những gì để đưa vào - và những gì <span className="text-white font-bold">CẦN TRÁNH</span> -
                là rất quan trọng cho cả bảo mật và hiệu năng.
              </p>

              <div className="grid md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 mb-6">
                <div className="p-6 bg-black hover:bg-zinc-900/30 transition-colors">
                  <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Chuẩn (Standard Claims)</h4>
                  <div className="space-y-4 text-xs">
                    <div className="border-l-2 border-zinc-700 pl-3">
                      <code className="text-white font-mono font-bold block mb-1">iss</code>
                      <p className="text-zinc-500">Issuer (Nơi phát hành)</p>
                    </div>
                    <div className="border-l-2 border-zinc-700 pl-3">
                      <code className="text-white font-mono font-bold block mb-1">sub</code>
                      <p className="text-zinc-500">Subject (User ID)</p>
                    </div>
                    <div className="border-l-2 border-zinc-700 pl-3">
                      <code className="text-white font-mono font-bold block mb-1">exp</code>
                      <p className="text-zinc-500">Hạn sử dụng</p>
                    </div>
                    <div className="border-l-2 border-zinc-700 pl-3">
                      <code className="text-white font-mono font-bold block mb-1">iat</code>
                      <p className="text-zinc-500">Thời điểm phát hành</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-black hover:bg-zinc-900/30 transition-colors">
                  <h4 className="text-emerald-500 font-bold mb-4 text-xs uppercase tracking-wider">Tùy Biến (Custom Claims)</h4>
                  <div className="space-y-4 text-xs">
                    <div className="border-l-2 border-emerald-900 pl-3">
                      <code className="text-emerald-400 font-mono font-bold block mb-1">email</code>
                      <p className="text-zinc-500">Email người dùng</p>
                    </div>
                    <div className="border-l-2 border-emerald-900 pl-3">
                      <code className="text-emerald-400 font-mono font-bold block mb-1">role</code>
                      <p className="text-zinc-500">Vai trò (Admin/User)</p>
                    </div>
                    <div className="border-l-2 border-emerald-900 pl-3">
                      <code className="text-emerald-400 font-mono font-bold block mb-1">permissions</code>
                      <p className="text-zinc-500">Danh sách quyền</p>
                    </div>
                    <div className="border-l-2 border-emerald-900 pl-3">
                      <code className="text-emerald-400 font-mono font-bold block mb-1">tenant_id</code>
                      <p className="text-zinc-500">ID tổ chức (SaaS)</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-black hover:bg-zinc-900/30 transition-colors">
                  <h4 className="text-red-500 font-bold mb-4 text-xs uppercase tracking-wider">CẤM (NEVER Include)</h4>
                  <div className="space-y-4 text-xs">
                    <div className="border-l-2 border-red-900 pl-3">
                      <span className="text-red-500 font-bold block mb-1">╳</span>
                      <p className="text-zinc-500">Mật khẩu hoặc băm (hash)</p>
                    </div>
                    <div className="border-l-2 border-red-900 pl-3">
                      <span className="text-red-500 font-bold block mb-1">╳</span>
                      <p className="text-zinc-500">SSN, CCCD, dữ liệu nhạy cảm</p>
                    </div>
                    <div className="border-l-2 border-red-900 pl-3">
                      <span className="text-red-500 font-bold block mb-1">╳</span>
                      <p className="text-zinc-500">Thông tin thẻ tín dụng</p>
                    </div>
                    <div className="border-l-2 border-red-900 pl-3">
                      <span className="text-red-500 font-bold block mb-1">╳</span>
                      <p className="text-zinc-500">Dữ liệu quá lớn (&gt;8KB)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-white font-bold mb-1 uppercase tracking-wider text-xs">
                    Kích Thước Rất Quan Trọng
                  </h5>
                  <p className="text-sm text-zinc-400">
                    Mỗi request đều phải gửi kèm JWT. Token nặng 50KB sẽ giết chết hiệu năng. Hãy giữ nó dưới <span className="text-white font-bold">1-2KB</span>.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Section 9: Best Practices */}
            <SectionCard
              {...sections[8]}
              title={jwtAuthContent.sections[8].title}
              category={jwtAuthContent.sections[8].category}
              isCompleted={progress.completedSections.includes(sections[8].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6 text-zinc-300">
                Khi deploy JWT lên production? Checklist này bao gồm các quy tắc <span className="text-white font-bold">bảo mật cốt lõi</span> và
                vận hành phân biệt giữa "làm chơi" và hệ thống Enterprise.
              </p>

              <div className="space-y-px bg-zinc-800 border border-zinc-800 mb-6">
                {[
                  {
                    icon: Key,
                    title: 'Quản Lý Secret Key',
                    desc: 'Tối thiểu 32 bytes ngẫu nhiên, lưu trong biến môi trường',
                    detail: 'Use crypto.randomBytes(64).toString(\'hex\')',
                  },
                  {
                    icon: Clock,
                    title: 'Token Hết Hạn Ngắn',
                    desc: 'Access: 15 phút | Refresh: 7 ngày',
                    detail: 'Giảm thiểu rủi ro khi token bị đánh cắp',
                  },
                  {
                    icon: Shield,
                    title: 'Validate Chặt Chẽ',
                    desc: 'Kiểm tra chữ ký, exp, iss, aud',
                    detail: 'Luôn từ chối token có "alg: none"',
                  },
                  {
                    icon: Database,
                    title: 'Lưu Trữ An Toàn',
                    desc: 'Access ở memory, Refresh ở httpOnly cookie',
                    detail: 'Tuyệt đối không dùng localStorage cho web - dễ bị XSS',
                  },
                  {
                    icon: Lock,
                    title: 'Bắt Buộc HTTPS',
                    desc: 'Không bao giờ gửi token qua HTTP',
                    detail: 'Set cờ Secure và SameSite cho cookies',
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex gap-4 p-6 bg-black hover:bg-zinc-900/50 transition-colors border-l-2 border-l-transparent hover:border-l-white group">
                      <Icon className="w-5 h-5 text-zinc-500 group-hover:text-white flex-shrink-0 mt-0.5 transition-colors" />
                      <div className="flex-1">
                        <h4 className="text-white font-bold uppercase tracking-wide text-sm mb-1">{item.title}</h4>
                        <p className="text-sm text-zinc-400 mb-1">{item.desc}</p>
                        <p className="text-xs text-zinc-600 font-mono">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Checklist Production
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                      <div className="w-4 h-4 border border-zinc-600 group-hover:border-white bg-black flex items-center justify-center transition-colors">
                        <div className="w-2 h-2 bg-white opacity-100"></div>
                      </div>
                      Strong secret (min 32 chars)
                    </label>
                    <label className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                      <div className="w-4 h-4 border border-zinc-600 group-hover:border-white bg-black flex items-center justify-center transition-colors">
                        <div className="w-2 h-2 bg-white opacity-100"></div>
                      </div>
                      Short expiration (15 min access)
                    </label>
                    <label className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                      <div className="w-4 h-4 border border-zinc-600 group-hover:border-white bg-black flex items-center justify-center transition-colors">
                        <div className="w-2 h-2 bg-white opacity-100"></div>
                      </div>
                      Algorithm enforcement (reject &quot;none&quot;)
                    </label>
                    <label className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                      <div className="w-4 h-4 border border-zinc-600 group-hover:border-white bg-black flex items-center justify-center transition-colors"></div>
                      Refresh token rotation
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                      <div className="w-4 h-4 border border-zinc-600 group-hover:border-white bg-black flex items-center justify-center transition-colors"></div>
                      Token monitoring/logging
                    </label>
                    <label className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                      <div className="w-4 h-4 border border-zinc-600 group-hover:border-white bg-black flex items-center justify-center transition-colors"></div>
                      HTTPS enforcement
                    </label>
                    <label className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                      <div className="w-4 h-4 border border-zinc-600 group-hover:border-white bg-black flex items-center justify-center transition-colors"></div>
                      Security penetration testing
                    </label>
                    <label className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                      <div className="w-4 h-4 border border-zinc-600 group-hover:border-white bg-black flex items-center justify-center transition-colors"></div>
                      Key rotation strategy
                    </label>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Live Demo Section */}
            <Card className="bg-black border border-white/10 shadow-none rounded-none">
              <CardHeader className="border-b border-white/10 pb-6">
                <CardTitle className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
                  <Shield className="w-5 h-5 text-white" />
                  Live Demo: Giao Thức JWT
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!isLoggedIn ? (
                  <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-4">
                      <p className="text-xs text-white font-bold uppercase tracking-wider mb-3">
                        Required Credentials
                      </p>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                          <span className="text-zinc-500">ADMIN ACCESS</span>
                          <span className="text-zinc-300">user: <span className="text-white">admin</span> / pass: <span className="text-white">admin123</span></span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-zinc-500">STANDARD USER</span>
                          <span className="text-zinc-300">user: <span className="text-white">user</span> / pass: <span className="text-white">user123</span></span>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive" className="rounded-none border-red-500 bg-red-950/10 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription className="ml-2 font-mono text-xs uppercase">{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                          Username
                        </label>
                        <Input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="ENTER USERNAME"
                          className="bg-black border-zinc-800 text-white placeholder:text-zinc-700 rounded-none focus:border-white focus:ring-0 uppercase font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                          Password
                        </label>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                          placeholder="ENTER PASSWORD"
                          className="bg-black border-zinc-800 text-white placeholder:text-zinc-700 rounded-none focus:border-white focus:ring-0 font-mono"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-6 rounded-none uppercase tracking-widest text-sm"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Khởi Tạo Session
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white text-black flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Authentication Successful</h3>
                        <p className="text-zinc-400 text-sm font-mono">
                          Session established for user: <strong className="text-white">{username}</strong>
                        </p>
                      </div>
                    </div>

                    <Card className="bg-black border border-zinc-800 shadow-none rounded-none">
                      <CardHeader className="border-b border-zinc-800 py-3 px-4">
                        <CardTitle className="flex items-center gap-2 text-white text-sm uppercase tracking-wider">
                          <FileText className="w-4 h-4 text-zinc-500" />
                          Cấu Trúc Token (Đã Decode)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-4">
                        <div className="space-y-1">
                          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Raw Token</div>
                          <div className="bg-zinc-950 border border-zinc-900 p-3">
                            <div className="font-mono text-[10px] text-zinc-400 break-all leading-relaxed">{tokenData?.token}</div>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="bg-zinc-950 border-l-2 border-l-white border-y border-r border-zinc-900 p-3">
                            <div className="text-[10px] text-white font-bold uppercase mb-2">Header</div>
                            <pre className="font-mono text-[10px] text-zinc-400">{JSON.stringify(tokenData?.header, null, 2)}</pre>
                          </div>

                          <div className="bg-zinc-950 border-l-2 border-l-zinc-500 border-y border-r border-zinc-900 p-3">
                            <div className="text-[10px] text-white font-bold uppercase mb-2">Payload (Claims)</div>
                            <pre className="font-mono text-[10px] text-zinc-400">{JSON.stringify(tokenData?.payload, null, 2)}</pre>
                          </div>

                          <div className="bg-zinc-950 border-l-2 border-l-zinc-700 border-y border-r border-zinc-900 p-3">
                            <div className="text-[10px] text-white font-bold uppercase mb-2">Signature</div>
                            <div className="font-mono text-[10px] text-zinc-400 break-all">{tokenData?.signature}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black border border-zinc-800 shadow-none rounded-none">
                      <CardHeader className="border-b border-zinc-800 py-3 px-4">
                        <CardTitle className="flex items-center gap-2 text-white text-sm uppercase tracking-wider">
                          <Lock className="w-4 h-4 text-zinc-500" />
                          Session Metadata
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-0 text-sm">
                        <div className="flex justify-between items-center py-3 border-b border-zinc-900">
                          <span className="text-zinc-500 uppercase text-xs font-bold tracking-wider">Identity</span>
                          <span className="text-white font-mono">{tokenData?.username}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-zinc-900">
                          <span className="text-zinc-500 uppercase text-xs font-bold tracking-wider">Status</span>
                          <Badge className="bg-white text-black border-none rounded-none uppercase font-bold tracking-widest text-[10px]">
                            {tokenData?.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-zinc-900">
                          <span className="text-zinc-500 uppercase text-xs font-bold tracking-wider">Issued At</span>
                          <span className="text-zinc-300 font-mono text-xs">
                            {tokenData?.issuedAt && new Date(tokenData.issuedAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-zinc-500 uppercase text-xs font-bold tracking-wider">Expires</span>
                          <span className="text-zinc-300 font-mono text-xs">
                            {tokenData?.expiresAt && new Date(tokenData.expiresAt).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full py-6 bg-transparent hover:bg-white hover:text-black text-white border border-white/20 rounded-none uppercase tracking-widest font-bold transition-all"
                    >
                      Terminate Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Challenges Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                <Zap className="w-6 h-6 text-white" />
                Interactive Challenges
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Test your JWT authentication knowledge with real-world scenarios.
                Complete challenges to earn XP and level up your security skills.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {challenges.map(challenge => (
                  <ChallengeCard key={challenge.id} {...challenge} />
                ))}
              </div>
            </div>

            {/* Achievement Tracker */}
            <AchievementTracker progress={progress} />
          </main>
        </div>
      </div>
    </div>
  );
}
