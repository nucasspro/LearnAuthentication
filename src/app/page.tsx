'use client';

import { Button } from '@/components/ui/button';
import {
  Activity,
  ArrowRight,
  Cpu,
  Database,
  Globe,
  Key,
  Shield,
  Terminal
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  // Removed unused state

  const learningPaths = [
    {
      id: 1,
      title: 'Session-Based Auth',
      description: 'Học về Session phía Server, HTTP-Only Cookies và bảo vệ chống CSRF.',
      icon: Database,
      color: 'text-cyan-400',
      borderColor: 'group-hover:border-cyan-500/50',
      difficulty: 'Cơ Bản',
      time: '30 phút',
      link: '/session',
      demoLink: '/session',
    },
    {
      id: 2,
      title: 'JWT Tokens',
      description: 'Làm chủ xác thực stateless với JSON Web Tokens và mô hình Refresh Token.',
      icon: Key,
      color: 'text-emerald-400',
      borderColor: 'group-hover:border-emerald-500/50',
      difficulty: 'Trung Bình',
      time: '45 phút',
      link: '/jwt/learn',
      demoLink: '/jwt/demo',
    },
    {
      id: 3,
      title: 'OAuth 2.0',
      description: 'Hiểu về ủy quyền bên thứ 3 (Google, Facebook) và các luồng bảo mật.',
      icon: Globe,
      color: 'text-purple-400',
      borderColor: 'group-hover:border-purple-500/50',
      difficulty: 'Nâng Cao',
      time: '60 phút',
      link: '/oauth/learn',
      demoLink: '/oauth/demo',
    },
    {
      id: 4,
      title: 'Multi-Factor Auth',
      description: 'Triển khai xác thực 2 lớp (2FA) với ứng dụng TOTP và mã dự phòng.',
      icon: Shield,
      color: 'text-rose-400',
      borderColor: 'group-hover:border-rose-500/50',
      difficulty: 'Nâng Cao',
      time: '45 phút',
      link: '/mfa/learn',
      demoLink: '/mfa/demo',
    },
  ];

  return (
    <main className="">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">

            {/* System Status Badge */}
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-white/10 rounded-none backdrop-blur-sm">
              <div className="w-2 h-2 bg-neon-500 rounded-full animate-pulse shadow-[0_0_10px_#4aff00]"></div>
              <span className="text-xs font-mono text-neon-400 tracking-widest uppercase">System Online</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 relative">
              <span className="relative z-10">AUTH</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-500 to-zinc-900 absolute top-0 left-0 -z-10 translate-y-2 opacity-50 blur-sm">AUTH</span>
              <span className="text-neon-500">.</span>
              <span className="font-mono text-xl md:text-3xl tracking-[1em] absolute -bottom-4 md:-bottom-8 left-1/2 -translate-x-1/2 w-full text-zinc-500 opacity-50 font-normal">PROTOCOL</span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-light mt-8">
              Làm chủ các giao thức xác thực hiện đại trong môi trường giả lập Cyberpunk.
              Review code, tìm lỗ hổng và bảo vệ hệ thống.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-neon-500 hover:bg-neon-400 text-black font-bold uppercase tracking-widest text-sm px-8 rounded-none">
                Bắt Đầu Ngay
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white font-bold uppercase tracking-widest text-sm px-8 rounded-none">
                <Terminal className="w-4 h-4 mr-2" />
                Xem Tài Liệu
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-500/20 to-transparent blur-sm"></div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wide text-white mb-2 flex items-center gap-3">
                <Cpu className="w-8 h-8 text-neon-500" />
                Modules Huấn Luyện
              </h2>
              <p className="text-zinc-500 font-mono text-sm">SELECT_PROTOCOL_TO_BEGIN</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="group relative bg-black border border-white/10 hover:border-white/30 transition-all duration-300 rounded-none overflow-hidden"
              >
                {/* Header Decoration */}
                <div className="absolute top-0 right-0 p-2 opacity-50">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white/20"></div>
                    <div className="w-1 h-1 bg-white/20"></div>
                    <div className="w-1 h-1 bg-white/20"></div>
                  </div>
                </div>

                <div className="p-6 h-full flex flex-col pt-10">
                  <div className={`mb-6 p-3 w-fit bg-zinc-900 border border-white/5 ${path.color}`}>
                    <path.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide group-hover:text-neon-400 transition-colors">
                    {path.title}
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
                    {path.description}
                  </p>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-zinc-500">
                      <span>{path.difficulty}</span>
                      <span>{path.time}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link href={path.link} className="w-full">
                        <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 rounded-none uppercase text-xs tracking-wider">
                          Học Lý Thuyết
                        </Button>
                      </Link>
                      <Link href={path.demoLink} className="w-full">
                        <Button className="w-full bg-neon-500/10 hover:bg-neon-500/20 text-neon-400 border border-neon-500/20 hover:border-neon-500/50 rounded-none uppercase text-xs tracking-wider">
                          Demo
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className={`absolute inset-0 border-2 border-transparent transition-colors duration-300 pointer-events-none ${path.borderColor}`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <h4 className="text-neon-400 font-black text-xl mb-4 tracking-widest uppercase flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Learn Auth
              </h4>
              <p className="text-zinc-500 max-w-sm leading-relaxed text-sm">
                Nền tảng mã nguồn mở giúp lập trình viên tiếp cận các chuẩn bảo mật quốc tế thông qua trải nghiệm tương tác trực quan.
              </p>
            </div>

            <div>
              <h5 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Tài Nguyên</h5>
              <ul className="space-y-2 text-sm text-zinc-500 font-mono">
                <li><a href="#" className="hover:text-neon-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Github Repo</a></li>
                <li><a href="#" className="hover:text-neon-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Documentation</a></li>
                <li><a href="#" className="hover:text-neon-400 transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Design System</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Tiêu Chuẩn</h5>
              <ul className="space-y-2 text-sm text-zinc-500 font-mono">
                <li><a href="#" className="hover:text-neon-400 transition-colors">RFC 7519 (JWT)</a></li>
                <li><a href="#" className="hover:text-neon-400 transition-colors">RFC 6749 (OAuth)</a></li>
                <li><a href="#" className="hover:text-neon-400 transition-colors">OWASP Top 10</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 font-mono uppercase tracking-widest">
            <p>© 2026 CYBERPUNK AUTHENTICATION. MIT LICENSE.</p>
            <p>SYSTEM_VERSION: 2.0.84</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
