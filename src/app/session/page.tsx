'use client';

import { AchievementTracker } from '@/components/learning/AchievementTracker';
import { ChallengeCard } from '@/components/learning/ChallengeCard';
import { CodeBlock } from '@/components/learning/CodeBlock';
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
import { challenges, codeExamples, securityScenarios, sessionAuthContent } from '@/lib/content/session-auth';
import { ProgressData, Section } from '@/lib/types';
import { AlertCircle, CheckCircle2, Clock, Cookie, Database, Key, Lock, RefreshCw, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SessionPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
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
    const saved = localStorage.getItem('session-auth-progress');
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
    localStorage.setItem('session-auth-progress', JSON.stringify(progress));
  }, [progress]);

  const sections: Section[] = [
    { id: 'section-1', title: sessionAuthContent.sections[0].title, icon: 'Key', category: 'concepts', estimatedTime: 3 },
    { id: 'section-2', title: sessionAuthContent.sections[1].title, icon: 'Zap', category: 'concepts', estimatedTime: 4 },
    { id: 'section-3', title: sessionAuthContent.sections[2].title, icon: 'Shield', category: 'security', estimatedTime: 3 },
    { id: 'section-4', title: sessionAuthContent.sections[3].title, icon: 'Database', category: 'system', estimatedTime: 5 },
    { id: 'section-5', title: 'Vòng Đời Session: Từ Khởi Tạo Đến Hủy', icon: 'RefreshCw', category: 'concepts', estimatedTime: 5 },
    { id: 'section-6', title: 'Session vs JWT: Chọn Giao Thức Nào?', icon: 'Users', category: 'concepts', estimatedTime: 5 },
    { id: 'section-7', title: 'Kịch Bản Tấn Công Thực Tế', icon: 'AlertCircle', category: 'security', estimatedTime: 8 },
    { id: 'section-8', title: 'Scaling: Mô Hình Enterprise', icon: 'Zap', category: 'advanced', estimatedTime: 6 },
    { id: 'section-9', title: 'Checklist Bảo Mật Của Guardian', icon: 'CheckCircle2', category: 'best_practices', estimatedTime: 6 },
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const sessionResponse = await fetch('/api/auth/session-check');
        const sessionInfo = await sessionResponse.json();

        if (sessionResponse.ok) {
          setSessionData({
            sessionId: sessionInfo.sessionId,
            username: data.user.username,
            expiresAt: sessionInfo.expiresAt,
            createdAt: sessionInfo.createdAt || new Date().toISOString(),
            status: 'Active',
          });
          setIsLoggedIn(true);
        } else {
          setError('Failed to get session info');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setSessionData(null);
      setError('');
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggedIn(false);
      setSessionData(null);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-300">
      <StoryHeader
        title={sessionAuthContent.storyHook.title}
        narrative={
          <>
            <span className="text-neon-400 font-bold">{sessionAuthContent.storyHook.subtitle}:</span> {sessionAuthContent.storyHook.narrative}
          </>
        }
        icon={Cookie}
        clearanceLevel={sessionAuthContent.storyHook.clearanceLevel}
        status={sessionAuthContent.storyHook.status}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Sticky Sidebar */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <ProgressSidebar
              sections={sections}
              progress={progress}
              onSectionClick={scrollToSection}
            />
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Section 1: Session Auth Là Gì? */}
            <SectionCard
              {...sections[0]}
              isCompleted={progress.completedSections.includes(sections[0].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg">
                Session-based authentication hoạt động như một <span className="text-zinc-100 font-semibold">thẻ thang máy</span> tại
                chung cư cao cấp. Khi bạn quẹt thẻ, hệ thống tòa nhà <span className="text-zinc-100">nhớ</span> bạn đang ở trong
                và cấp quyền truy cập vào các tầng được phép.
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full aspect-video mb-8 border border-white/10 rounded-none overflow-hidden group cursor-pointer">
                    <Image
                      src="/images/session/concept-card.png"
                      alt="Cyberpunk Access Card Concept"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <p className="text-sm font-mono text-neon-400 font-bold uppercase tracking-wider">Hình.01_Giao_Thức_Truy_Cập</p>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest bg-black/50 px-2 py-1 border border-white/10 backdrop-blur-sm">Nhấn để xem</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl bg-[#0a0a0a] border-white/10 p-0 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <Image
                      src="/images/session/concept-card.png"
                      alt="Cyberpunk Access Card Concept"
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="bg-zinc-900/30 border border-white/10 p-6 my-4 rounded-none">
                <h4 className="text-zinc-100 font-bold mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Cơ Chế Hoạt Động Kỹ Thuật Số
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-zinc-400 font-bold">1.</span>
                    Bạn chứng minh danh tính (username + password)
                  </li>
                  <li className="flex gap-3">
                    <span className="text-zinc-400 font-bold">2.</span>
                    Server tạo một <span className="text-orange-400 font-mono">Session ID</span> duy nhất
                  </li>
                  <li className="flex gap-3">
                    <span className="text-zinc-400 font-bold">3.</span>
                    Server lưu dữ liệu của bạn vào <span className="text-zinc-200">bộ nhớ/database</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-zinc-400 font-bold">4.</span>
                    Browser nhận Session ID qua <span className="text-zinc-200">HTTP cookie</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-zinc-400 font-bold">5.</span>
                    Mọi request sau đó tự động gửi kèm cookie - server nhận ra bạn
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/30 border border-white/10 rounded-none p-4">
                  <h5 className="text-zinc-100 font-bold mb-2">Stateful</h5>
                  <p className="text-sm text-zinc-400">
                    Server lưu trữ dữ liệu session. Cookie chỉ chứa ID tham chiếu.
                  </p>
                </div>
                <div className="bg-zinc-900/30 border border-white/10 rounded-none p-4">
                  <h5 className="text-zinc-100 font-bold mb-2">Server-Side</h5>
                  <p className="text-sm text-zinc-400">
                    Mọi logic xác thực nằm ở server, không phải trong cookie.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Section 2: Quy Trình Đăng Nhập */}
            <SectionCard
              {...sections[1]}
              isCompleted={progress.completedSections.includes(sections[1].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Quy trình xác thực là một <span className="text-zinc-100 font-bold">cái bắt tay 7 bước</span> giữa
                client và server, thiết lập kênh liên lạc bảo mật.
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full aspect-video mb-8 border border-white/10 rounded-none overflow-hidden group cursor-pointer">
                    <Image
                      src="/images/session/login-flow.png"
                      alt="Login Security Flow"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <p className="text-sm font-mono text-neon-400 font-bold uppercase tracking-wider">Hình.02_Bắt_Tay_Bảo_Mật</p>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest bg-black/50 px-2 py-1 border border-white/10 backdrop-blur-sm">Nhấn để xem</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl bg-[#0a0a0a] border-white/10 p-0 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <Image
                      src="/images/session/login-flow.png"
                      alt="Login Security Flow"
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-3">
                {[
                  { num: 1, label: 'Client → Server', desc: 'Gửi POST /login kèm credentials', code: '{ username, password }' },
                  { num: 2, label: 'Server kiểm tra', desc: 'So sánh bcrypt hash với database', code: 'bcrypt.compare(password, hash)' },
                  { num: 3, label: 'Tạo Session ID', desc: '256 bits entropy ngẫu nhiên', code: 'crypto.randomBytes(32)' },
                  { num: 4, label: 'Lưu vào Database', desc: 'Session object kèm thời hạn', code: '{ userId, expiresAt }' },
                  { num: 5, label: 'Set Cookie Header', desc: 'HttpOnly, Secure, SameSite flags', code: 'Set-Cookie: sessionId=...' },
                  { num: 6, label: 'Browser lưu trữ', desc: 'Cookie tự động gửi cho request sau', code: 'Cookie: sessionId=...' },
                  { num: 7, label: 'Validate mỗi request', desc: 'Tra cứu Session ID trong database', code: 'SELECT * FROM sessions WHERE id=?' },
                ].map(step => (
                  <div key={step.num} className="flex gap-4 p-3 rounded-none bg-zinc-900/30 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex-shrink-0 w-8 h-8 bg-zinc-800 text-zinc-300 rounded-none flex items-center justify-center font-bold">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="text-zinc-200 font-bold text-sm">{step.label}</div>
                      <div className="text-zinc-500 text-xs mt-0.5">{step.desc}</div>
                      <code className="text-xs text-orange-400 font-mono mt-1 block">{step.code}</code>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Section 3: Bảo Mật Cookie */}
            <SectionCard
              {...sections[2]}
              isCompleted={progress.completedSections.includes(sections[2].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Cookie security attributes là <span className="text-zinc-100 font-bold">tấm khiên đầu tiên</span> bảo vệ
                bạn trước các cuộc tấn công web phổ biến. Mỗi attribute chặn đứng một loại nguy cơ cụ thể.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-white/10 rounded-none overflow-hidden">
                  <thead className="bg-[#111] border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-zinc-300 font-bold uppercase tracking-wider text-xs">Thuộc Tính</th>
                      <th className="px-6 py-4 text-left text-zinc-300 font-bold uppercase tracking-wider text-xs">Cơ Chế Bảo Vệ</th>
                      <th className="px-6 py-4 text-left text-zinc-300 font-bold uppercase tracking-wider text-xs">Chặn Tấn Công</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0a0a0a]">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-zinc-300">HttpOnly</td>
                      <td className="px-6 py-4 text-zinc-400">JavaScript không thể đọc cookie</td>
                      <td className="px-6 py-4"><Badge variant="outline" className="border-red-900/50 text-red-400 bg-red-900/10">XSS Theft</Badge></td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-zinc-300">Secure</td>
                      <td className="px-6 py-4 text-zinc-400">Chỉ gửi qua kết nối HTTPS an toàn</td>
                      <td className="px-6 py-4"><Badge variant="outline" className="border-yellow-900/50 text-yellow-500 bg-yellow-900/10">MITM Sniffing</Badge></td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-zinc-300">SameSite=Strict</td>
                      <td className="px-6 py-4 text-zinc-400">Chặn gửi cookie từ trang thứ 3</td>
                      <td className="px-6 py-4"><Badge variant="outline" className="border-orange-900/50 text-orange-500 bg-orange-900/10">CSRF</Badge></td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-zinc-300">Max-Age</td>
                      <td className="px-6 py-4 text-zinc-400">Tự động hủy sau thời gian thực</td>
                      <td className="px-6 py-4"><Badge variant="outline" className="border-blue-900/50 text-blue-500 bg-blue-900/10">Session Hijacking</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <CodeBlock examples={codeExamples.settingCookie} title="secure-cookie.js" />
            </SectionCard>

            {/* Section 4: Lưu Session Ở Đâu? */}
            <SectionCard
              {...sections[3]}
              isCompleted={progress.completedSections.includes(sections[3].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Nơi bạn <span className="text-zinc-100 font-bold">lưu data session</span> quyết định hiệu năng,
                khả năng mở rộng (scale) và bảo mật của hệ thống.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/30 border border-white/10 rounded-none p-4">
                  <Database className="w-8 h-8 text-zinc-100 mb-3" />
                  <h4 className="text-zinc-100 font-black mb-2">In-Memory</h4>
                  <p className="text-xs text-zinc-500 mb-3">RAM của Node.js (default)</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-zinc-400">+ Truy cập siêu tốc</div>
                    <div className="text-zinc-400">+ Setup đơn giản</div>
                    <div className="text-zinc-500">- Mất hết khi restart</div>
                    <div className="text-zinc-500">- Chỉ chạy được 1 server</div>
                  </div>
                  <Badge variant="outline" className="mt-3 bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs rounded-none">
                    Phù hợp: Development
                  </Badge>
                </div>

                <div className="bg-zinc-900/30 border border-white/10 rounded-none p-4">
                  <Database className="w-8 h-8 text-zinc-100 mb-3" />
                  <h4 className="text-zinc-100 font-black mb-2">Database</h4>
                  <p className="text-xs text-zinc-500 mb-3">PostgreSQL, MySQL, MongoDB</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-zinc-400">+ Lưu trữ vĩnh viễn</div>
                    <div className="text-zinc-400">+ Load balancing OK</div>
                    <div className="text-zinc-500">~ Chậm hơn RAM</div>
                    <div className="text-zinc-500">~ Cần tối ưu query</div>
                  </div>
                  <Badge variant="outline" className="mt-3 bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs rounded-none">
                    Phù hợp: App Vừa & Nhỏ
                  </Badge>
                </div>

                <div className="bg-zinc-900/30 border border-white/10 rounded-none p-4">
                  <Zap className="w-8 h-8 text-zinc-100 mb-3" />
                  <h4 className="text-zinc-100 font-black mb-2">Redis</h4>
                  <p className="text-xs text-zinc-500 mb-3">In-memory data store có persistence</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-zinc-400">+ Tốc độ ánh sáng (sub-ms)</div>
                    <div className="text-zinc-400">+ Tự động hết hạn</div>
                    <div className="text-zinc-400">+ Scale ngang dễ dàng</div>
                    <div className="text-zinc-500">~ Cần server Redis riêng</div>
                  </div>
                  <Badge variant="outline" className="mt-3 bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs rounded-none">
                    Phù hợp: Production / Enterprise
                  </Badge>
                </div>
              </div>
            </SectionCard>

            {/* Section 5: Vòng Đời Session */}
            <SectionCard
              {...sections[4]}
              isCompleted={progress.completedSections.includes(sections[4].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Session có một <span className="text-zinc-100 font-bold">vòng đời hoàn chỉnh</span> từ
                lúc sinh ra đến khi bị hủy diệt. Hiểu rõ từng pha là chìa khóa để bảo mật.
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-zinc-700 bg-zinc-900/30 p-4 rounded-none">
                  <h4 className="text-zinc-100 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-zinc-800 text-white rounded-none flex items-center justify-center text-sm">1</span>
                    Khởi Tạo (Login)
                  </h4>
                  <p className="text-sm text-zinc-400 mb-2">Tạo session ID ngẫu nhiên, lưu thông tin user, gửi cookie về browser</p>
                  <CodeBlock examples={codeExamples.settingCookie.slice(0, 1)} showLineNumbers={false} />
                </div>

                <div className="border-l-4 border-zinc-500 bg-zinc-900/30 p-4 rounded-none">
                  <h4 className="text-zinc-200 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-zinc-600 text-white rounded-none flex items-center justify-center text-sm">2</span>
                    Xác Thực (Mỗi Request)
                  </h4>
                  <p className="text-sm text-zinc-400 mb-2">Tra cứu session tồn tại không, check hết hạn chưa, update thời gian hoạt động</p>
                  <CodeBlock examples={codeExamples.validatingSession.slice(0, 1)} showLineNumbers={false} />
                </div>

                <div className="border-l-4 border-zinc-700 bg-zinc-900/30 p-4 rounded-none">
                  <h4 className="text-zinc-100 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-zinc-800 text-white rounded-none flex items-center justify-center text-sm">3</span>
                    Tái Tạo (Sự Kiện Bảo Mật)
                  </h4>
                  <p className="text-sm text-zinc-400 mb-2">Đổi session ID mới sau khi đăng nhập hoặc đổi quyền (chống session fixation)</p>
                  <CodeBlock examples={codeExamples.sessionRegeneration} showLineNumbers={false} />
                </div>

                <div className="border-l-4 border-zinc-500 bg-zinc-900/30 p-4 rounded-none">
                  <h4 className="text-zinc-200 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-zinc-600 text-white rounded-none flex items-center justify-center text-sm">4</span>
                    Hủy Diệt (Logout)
                  </h4>
                  <p className="text-sm text-zinc-400 mb-2">Xóa khỏi database, xóa cookie client, vô hiệu hóa token</p>
                  <CodeBlock examples={codeExamples.logout} showLineNumbers={false} />
                </div>
              </div>
            </SectionCard>

            {/* Section 6: Session vs JWT */}
            <SectionCard
              {...sections[5]}
              isCompleted={progress.completedSections.includes(sections[5].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Chọn Session hay JWT giống như chọn giữa <span className="text-zinc-100 font-bold">thẻ từ thang máy</span> (Session)
                và <span className="text-zinc-100 font-bold">hộ chiếu</span> (JWT). Mỗi công nghệ có ưu nhược điểm riêng.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-white/10 rounded-none overflow-hidden">
                  <thead className="bg-surface-elevated border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-zinc-300 font-bold uppercase tracking-wider text-xs">Yếu Tố</th>
                      <th className="px-6 py-4 text-left text-zinc-300 font-bold uppercase tracking-wider text-xs">Session (Thẻ Từ)</th>
                      <th className="px-6 py-4 text-left text-zinc-300 font-bold uppercase tracking-wider text-xs">JWT (Hộ Chiếu)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-surface">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-zinc-400 uppercase text-xs tracking-wide">Trạng Thái</td>
                      <td className="px-6 py-4 text-zinc-100">Stateful (Server lưu data)</td>
                      <td className="px-6 py-4 text-zinc-200">Stateless (Token chứa data)</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-zinc-400 uppercase text-xs tracking-wide">Tải Server</td>
                      <td className="px-6 py-4 text-zinc-100">Tra cứu DB mỗi request</td>
                      <td className="px-6 py-4 text-zinc-200">Không cần DB (CPU verify chữ ký)</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-zinc-400 uppercase text-xs tracking-wide">Mở Rộng (Scale)</td>
                      <td className="px-6 py-4 text-zinc-100">Khó (Cần Redis cluster)</td>
                      <td className="px-6 py-4 text-zinc-200">Dễ (Scale ngang tự do)</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-zinc-400 uppercase text-xs tracking-wide">Thu Hồi (Revoke)</td>
                      <td className="px-6 py-4 text-zinc-100">Tức thì (Xóa khỏi DB)</td>
                      <td className="px-6 py-4 text-zinc-500">Khó (Token vẫn sống đến khi hết hạn)</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-zinc-400 uppercase text-xs tracking-wide">Mobile Apps</td>
                      <td className="px-6 py-4 text-zinc-500">Xử lý cookie phức tạp</td>
                      <td className="px-6 py-4 text-zinc-100">Dễ (Header Authorization)</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-zinc-400 uppercase text-xs tracking-wide">Bảo Mật</td>
                      <td className="px-6 py-4 text-zinc-100">Server kiểm soát tuyệt đối</td>
                      <td className="px-6 py-4 text-zinc-500">Rủi ro XSS lộ token</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/30 border border-white/10 rounded-none p-6">
                  <h4 className="text-zinc-100 font-black mb-3">Dùng Session Khi:</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-100 flex-shrink-0 mt-0.5" /> Web app truyền thống (SSR, Admin)</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-100 flex-shrink-0 mt-0.5" /> Cần logout tức thì (Ngân hàng, Y tế)</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-100 flex-shrink-0 mt-0.5" /> Bảo mật là ưu tiên số 1</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-100 flex-shrink-0 mt-0.5" /> Duy nhất 1 domain</li>
                  </ul>
                </div>

                <div className="bg-zinc-900/30 border border-white/10 rounded-none p-6">
                  <h4 className="text-zinc-100 font-black mb-3">Dùng JWT Khi:</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" /> Mobile App / SPA</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" /> Microservices architecture</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" /> Nhiều domain khác nhau</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" /> Scale &gt; Khả năng thu hồi (B2C social)</li>
                  </ul>
                </div>
              </div>
            </SectionCard>

            {/* Section 7: Security Scenarios */}
            <SectionCard
              {...sections[6]}
              isCompleted={progress.completedSections.includes(sections[6].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6">
                Học từ các <span className="text-zinc-100 font-bold">vụ rò rỉ dữ liệu</span> thực tế.
                Mỗi kịch bản sẽ chỉ ra cách tấn công, khai thác và phòng thủ.
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full aspect-video mb-8 border border-white/10 rounded-none overflow-hidden group cursor-pointer">
                    <Image
                      src="/images/session/security-hacker.png"
                      alt="Session Hijacking Scenario"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm font-mono text-red-500 font-bold uppercase tracking-wider">Cảnh_Báo: Phát_Hiện_Xâm_Nhập</p>
                      </div>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest bg-black/50 px-2 py-1 border border-white/10 backdrop-blur-sm">Nhấn để xem</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl bg-[#0a0a0a] border-white/10 p-0 overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <Image
                      src="/images/session/security-hacker.png"
                      alt="Session Hijacking Scenario"
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-6">
                {securityScenarios.map((scenario) => (
                  <SecurityScenario key={scenario.id} {...scenario} />
                ))}
              </div>
            </SectionCard>

            {/* Section 8: Scaling */}
            <SectionCard
              {...sections[7]}
              isCompleted={progress.completedSections.includes(sections[7].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6">
                Scale session authen lên <span className="text-zinc-100 font-bold">hàng triệu users</span> cần các
                mô hình và hạ tầng chuyên biệt để đảm bảo hiệu năng.
              </p>

              <div className="space-y-6">
                {/* Pattern 1 */}
                <div className="bg-zinc-900 border border-white/10 p-6 rounded-none relative overflow-hidden group hover:border-white/30 transition-all">
                  <div className="absolute top-0 right-0 bg-white/10 px-3 py-1 text-xs font-bold uppercase rounded-bl text-gray-300">
                    Easy Setup
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                    1. Sticky Sessions
                  </h4>
                  <p className="text-zinc-400 mb-4 h-12">
                    Load Balancer định tuyến user luôn vào <span className="text-zinc-100">cùng 1 server</span>.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-zinc-950/50 p-4 rounded-none">
                    <div>
                      <span className="text-zinc-300 font-bold block mb-1">Ưu điểm</span>
                      <ul className="space-y-1 text-zinc-500">
                        <li>+ Setup đơn giản</li>
                        <li>+ RAM truy cập nhanh</li>
                        <li>+ Không tốn phí DB</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-bold block mb-1">Nhược điểm</span>
                      <ul className="space-y-1 text-zinc-500">
                        <li>- Server lỗi = Mất session</li>
                        <li>- Load không đều</li>
                        <li>- Khó auto-scaling</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Pattern 2 */}
                <div className="bg-zinc-900 border border-white/10 p-6 rounded-none relative overflow-hidden group hover:border-white/30 transition-all shadow-none">
                  <div className="absolute top-0 right-0 bg-zinc-800 text-white px-3 py-1 text-xs font-bold uppercase rounded-bl">
                    Industry Standard
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    2. Centralized Redis
                  </h4>
                  <p className="text-zinc-400 mb-4 h-12">
                    Tất cả server dùng chung <span className="text-zinc-100">Redis Cluster</span> để lưu session.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-zinc-950/50 p-4 rounded-none">
                    <div>
                      <span className="text-zinc-300 font-bold block mb-1">Ưu điểm</span>
                      <ul className="space-y-1 text-zinc-400">
                        <li>+ Server nào xử lý cũng được</li>
                        <li>+ Session vẫn còn khi server lỗi</li>
                        <li>+ Tốc độ cực cao</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-bold block mb-1">Nhược điểm</span>
                      <ul className="space-y-1 text-zinc-400">
                        <li>~ Tốn chi phí Redis</li>
                        <li>~ Network latency (nhỏ)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Pattern 3 */}
                <div className="bg-zinc-900 border border-white/10 p-6 rounded-none relative overflow-hidden group hover:border-white/30 transition-all">
                  <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-300 px-3 py-1 text-xs font-bold uppercase rounded-bl border-l border-b border-white/10">
                    Maximum Scale
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                    3. JWT (Stateless)
                  </h4>
                  <p className="text-zinc-400 mb-4 h-12">
                    Không lưu session! Dùng <span className="text-zinc-100">JWT Token</span> tự chứa dữ liệu.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-zinc-950/50 p-4 rounded-none">
                    <div>
                      <span className="text-zinc-300 font-bold block mb-1">Ưu điểm</span>
                      <ul className="space-y-1 text-zinc-500">
                        <li>+ Scale vô cực</li>
                        <li>+ Không tốn RAM/Redis</li>
                        <li>+ Phù hợp Microservices</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-bold block mb-1">Nhược điểm</span>
                      <ul className="space-y-1 text-zinc-500">
                        <li>- Không thể logout ngay</li>
                        <li>- Token size lớn</li>
                        <li>- Cannot revoke dễ dàng</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Section 9: Best Practices */}
            <SectionCard
              {...sections[8]}
              isCompleted={progress.completedSections.includes(sections[8].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-6">
                Đừng chờ bị hack mới sửa. Hãy check lại code của bạn <span className="text-zinc-100 font-bold">ngay bây giờ</span> theo chuẩn công nghiệp.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Clock,
                    title: 'Short Session Timeouts',
                    desc: 'Idle: 15-30 min | Absolute: 8 hours max',
                    detail: 'Giảm thiểu rủi ro khi dùng máy tính công cộng',
                    color: 'neon',
                  },
                  {
                    icon: RefreshCw,
                    title: 'Regenerate Session ID',
                    desc: 'Tạo ID mới sau khi login',
                    detail: 'Chặn đứng tấn công Session Fixation',
                    color: 'cyan',
                  },
                  {
                    icon: Shield,
                    title: 'Full Security Flags',
                    desc: 'HttpOnly + Secure + SameSite=Strict',
                    detail: 'Bảo vệ toàn diện trước XSS, MITM và CSRF',
                    color: 'purple',
                  },
                  {
                    icon: Database,
                    title: 'Monitor Active Sessions',
                    desc: 'Hiển thị danh sách thiết bị đang đăng nhập',
                    detail: 'Cho phép user thu hồi quyền truy cập từ xa',
                    color: 'yellow',
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  // Map color names to tailwind classes explicitly if needed, or rely on safelist
                  // Using inline style or explicit class names for dynamic colors might be safer if not safelisted
                  // But assuming the previous code worked with these dynamic classes:
                  const borderClass = 'border-white/10';
                  const bgClass = 'bg-zinc-900/40';
                  const textClass = 'text-white';
                  const iconClass = 'text-white';

                  return (
                    <div key={index} className={`border-l-4 ${borderClass} ${bgClass} p-4 rounded-r-none`}>
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 ${iconClass} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <h4 className={`${textClass} font-black mb-1`}>{item.title}</h4>
                          <p className="text-sm text-zinc-400 mb-1">{item.desc}</p>
                          <p className="text-xs text-zinc-500">{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 bg-zinc-900 border border-white/10 rounded-none p-5">
                <h4 className="text-white font-black text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Production Checklist
                </h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-white rounded-none bg-zinc-900 border-zinc-700" defaultChecked />
                      Cookie flags: HttpOnly, Secure
                    </label>
                    <label className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-white rounded-none bg-zinc-900 border-zinc-700" defaultChecked />
                      Regenerate session ID sau login
                    </label>
                    <label className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-white rounded-none bg-zinc-900 border-zinc-700" defaultChecked />
                      Timeout (idle + absolute)
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-white rounded-none bg-zinc-900 border-zinc-700" />
                      Redis/centralized store
                    </label>
                    <label className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-white rounded-none bg-zinc-900 border-zinc-700" />
                      Logout all devices feature
                    </label>
                    <label className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-white rounded-none bg-zinc-900 border-zinc-700" />
                      Audit logging events
                    </label>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Live Demo Section */}
            <Card className="bg-zinc-900/50 border border-white/10 shadow-none rounded-none">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Shield className="w-7 h-7 text-white" />
                  Live Demo: Try Session Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <div className="space-y-5">
                    <div className="bg-zinc-900 border border-white/10 rounded-none p-4">
                      <p className="text-sm text-zinc-100 font-bold mb-2">
                        Demo Credentials:
                      </p>
                      <div className="space-y-1 text-sm text-zinc-400">
                        <p>Username: <code className="bg-black text-orange-400 px-2 py-0.5 rounded-none border border-zinc-700">admin</code> / Password: <code className="bg-black text-orange-400 px-2 py-0.5 rounded-none border border-zinc-700">admin123</code></p>
                        <p>Username: <code className="bg-black text-orange-400 px-2 py-0.5 rounded-none border border-zinc-700">user</code> / Password: <code className="bg-black text-orange-400 px-2 py-0.5 rounded-none border border-zinc-700">user123</code></p>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-5 h-5" />
                        <AlertDescription className="ml-2">{error}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-zinc-200 mb-2">
                        Username
                      </label>
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                        className="bg-black border-2 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-zinc-200 mb-2">
                        Password
                      </label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="admin123"
                        className="bg-black border-2 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-white"
                      />
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full bg-black hover:bg-zinc-900 text-white border border-white/10 font-bold uppercase tracking-widest py-6 rounded-none transition-all"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          INITIALIZING...
                        </>
                      ) : (
                        'CONSOLE LOGIN'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-zinc-900/50 border-2 border-green-500/50 rounded-none p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <h3 className="text-2xl font-bold text-white">Access Granted!</h3>
                      </div>
                      <p className="text-zinc-300 text-lg">
                        Logged in as <strong className="text-white">{username}</strong>
                      </p>
                    </div>

                    <Card className="bg-zinc-900/50 border-2 border-zinc-800 rounded-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Lock className="w-6 h-6 text-zinc-400" />
                          Session Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-zinc-400 font-medium text-sm">Session ID:</span>
                          <span className="text-orange-400 font-mono text-xs break-all max-w-[250px]">{sessionData?.sessionId}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Username:</span>
                          <span className="text-white font-semibold">{sessionData?.username}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-zinc-200 font-medium text-sm">Status:</span>
                          <Badge className="bg-green-900/20 text-green-400 border border-green-900/50 rounded-sm">
                            {sessionData?.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Created:</span>
                          <span className="text-white text-sm">
                            {new Date(sessionData?.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-200 font-medium text-sm">Expires:</span>
                          <span className="text-white text-sm">
                            {new Date(sessionData?.expiresAt).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-2 border-zinc-800 rounded-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Cookie className="w-6 h-6 text-zinc-400" />
                          Cookie Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-black rounded-none p-4 font-mono text-sm space-y-2 border-2 border-zinc-800">
                          <div className="text-zinc-300">
                            <span className="text-orange-400">Set-Cookie:</span> sessionId={sessionData?.sessionId?.substring(0, 20)}...
                          </div>
                          <div className="text-zinc-300 pl-4">
                            <span className="text-blue-400">HttpOnly;</span> <span className="text-zinc-500">{`// JS cannot access`}</span>
                          </div>
                          <div className="text-zinc-300 pl-4">
                            <span className="text-blue-400">Secure;</span> <span className="text-zinc-500">{`// HTTPS only`}</span>
                          </div>
                          <div className="text-zinc-300 pl-4">
                            <span className="text-blue-400">SameSite=Strict;</span> <span className="text-zinc-500">{`// CSRF protection`}</span>
                          </div>
                          <div className="text-zinc-300 pl-4">
                            <span className="text-blue-400">Max-Age=86400;</span> <span className="text-zinc-500">{`// 24 hours`}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={handleLogout}
                      variant="secondary"
                      className="w-full py-6 bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-zinc-700 rounded-none"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Challenges Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                <Zap className="w-8 h-8 text-white" />
                Interactive Challenges
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Test your session authentication knowledge with real-world scenarios.
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
      </div >
    </div >
  );
}
