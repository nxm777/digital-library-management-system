import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const LandingPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhyChoose, setShowWhyChoose] = useState(false);
  const whyChooseRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowWhyChoose(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (whyChooseRef.current) {
      observer.observe(whyChooseRef.current);
    }

    return () => {
      if (whyChooseRef.current) {
        observer.unobserve(whyChooseRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    const duration = 1000;
    const start = window.scrollY;
    const startTime = performance.now();

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, start * (1 - easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans relative overflow-hidden">

      <nav className="relative z-20 border-b border-white/10 backdrop-blur-sm bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xl font-bold text-white">Digital Library</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-white hover:text-purple-300 font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">

        <div className="text-center mb-24">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Your Personal
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
              Virtual Library
            </span>
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Track your reading progress, organize your collection, and share your reviews.
            <span className="text-purple-300 font-semibold"> The smartest way to manage your books.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">

          <div
            onMouseMove={handleMouseMove}
            className="group feature-card feature-card-blue bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Manage Reading Lists
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Create and organize custom reading lists for different genres, moods, or goals. Keep all your books perfectly organized in one place.
            </p>
          </div>

          <div
            onMouseMove={handleMouseMove}
            className="group feature-card feature-card-green bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 hover:border-green-400/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Track Reading Activity
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Monitor your reading progress with detailed statistics. See how many books you've read, track your reading streaks, and visualize your journey.
            </p>
          </div>

          <div
            onMouseMove={handleMouseMove}
            className="group feature-card feature-card-purple bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Reading Challenges
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Set personal reading goals and join community challenges. Stay motivated with milestones and achievements as you expand your literary horizons.
            </p>
          </div>

        </div>

        <div
          ref={whyChooseRef}
          className={`mb-24 transition-all duration-1000 ${
            showWhyChoose
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Our Digital Library?
            </h2>
            <p className="text-gray-400 text-lg">
              Discover what makes us the perfect companion for your reading journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

            <div className="bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm p-8 rounded-2xl border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Visualize Your Progress
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Digital tracking helps you see your streaks and discover patterns in your reading habits. Turn pages into data and motivation that actually works!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm p-8 rounded-2xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Boost Your Motivation
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Stay focused by organizing books into curated lists and setting achievable goals. With our reading challenges, finishing a book becomes fun and engaging.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-transparent backdrop-blur-sm p-8 rounded-2xl border border-pink-400/30 hover:border-pink-400/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Better Than Spreadsheets
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Enjoy beautiful covers and automatic tracking instead of dry cells. Our platform is designed specifically for book lovers, not for data entry.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-sm p-8 rounded-2xl border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Read Anywhere, Anytime
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Your library is 100% cloud-based. Start a session on your phone, check stats on your tablet, and manage lists on your computer. Your books are always with you.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-12 rounded-3xl border border-white/20 max-w-2xl mx-auto shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Your Reading Journey Today
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Turn your reading goals into reality and build a habit that lasts.
            </p>
            <Link
              to="/register"
              className="inline-block group relative animated-gradient-button"
            >
              <span className="relative z-10 inline-block bg-slate-900 text-white font-bold py-4 px-12 rounded-xl hover:bg-slate-800 transition-all duration-300">
                Start your journey
              </span>
            </Link>
          </div>
        </div>

        <footer className="mt-24 pt-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">
                Crafted with passion for readers
              </h3>
              <p className="text-gray-400 mb-6">
                  Built for book lovers ready to build better habits
              </p>

              <a
                href="https://github.com/nxm777"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <div className="text-left">
                  <p className="text-xs text-gray-400">Connect on GitHub</p>
                  <p className="text-white font-semibold">@nxm777</p>
                </div>
              </a>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center pt-8 pb-6 text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Digital Library. All rights reserved.</p>
            </div>

          </div>
        </footer>

      </div>

      <button
        onClick={scrollToTop}
        className={`fixed right-8 bottom-8 z-50 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-500 hover:scale-110 group ${
          showScrollTop
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-20 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .feature-card {
          --mouse-x: 50%;
          --mouse-y: 50%;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .feature-card:hover::before {
          opacity: 1;
        }
        .feature-card-blue::before {
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(59, 130, 246, 0.25),
            transparent 40%
          );
        }
        .feature-card-green::before {
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(34, 197, 94, 0.25),
            transparent 40%
          );
        }
        .feature-card-purple::before {
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(168, 85, 247, 0.25),
            transparent 40%
          );
        }
        .animated-gradient-button {
          position: relative;
          padding: 3px;
          border-radius: 0.75rem;
          background: linear-gradient(135deg,
            #a855f7, #ec4899, #3b82f6
          );
          transition: transform 0.3s ease;
        }
        .animated-gradient-button:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;