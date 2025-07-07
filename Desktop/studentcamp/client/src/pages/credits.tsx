const Credits = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-slate-50 py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-100/40 to-cyan-100/40 blur-3xl floating-animation"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-100/30 to-blue-100/30 blur-3xl floating-animation"
          style={{ animationDelay: "-3s" }}
        ></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0 h-full w-full">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-blue-900" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center fade-in-up">
          {/* Main content card */}
          <div className="glass-effect rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl shadow-blue-500/10 border border-white/20">
            {/* Profile section */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary shadow-lg shadow-blue-500/25 overflow-hidden">
                <img 
                  src="/lol.png" 
                  alt="Sejiwa Nafas Bumi" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to the original design if image fails to load
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                  <span className="text-3xl font-bold text-white">H</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                <span className="gradient-text">Sejiwa</span>
              </h1>

              <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full mb-8"></div>
            </div>

            {/* Description */}
            <div className="max-w-3xl mx-auto">
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 font-medium">
                Hi! I'm <span className="text-blue-600 font-semibold">Sejiwa Nafas Bumi</span>, a student of SMPN 9 Bekasi, 37th Generation, A Member of the 9th Division of Student Council.
              </p>

              <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8">
                <span className="font-semibold text-blue-600">EasyToolbox</span> was born for the 9th Division of The Student Council of SMPN 9 Bekasi
              </p>

              {/* Mission statement */}
              <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-2xl p-6 sm:p-8 border border-blue-100/50">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">My Mission</h3>
                <p className="text-slate-600 leading-relaxed">
                  apalah ini 
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="mt-12 flex justify-center space-x-4">
              <div className="w-2 h-2 rounded-full bg-blue-400 floating-animation"></div>
              <div
                className="w-2 h-2 rounded-full bg-cyan-400 floating-animation"
                style={{ animationDelay: "-1s" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-indigo-400 floating-animation"
                style={{ animationDelay: "-2s" }}
              ></div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 font-medium">Built with ❤️ for the community</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Credits
