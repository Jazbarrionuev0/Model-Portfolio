const ElegantLoader = async () => {
  const staticOpacities = [0.9, 0.3, 0.3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="mb-4 text-2xl font-light text-gray-800">
          <span className="font-medium">C</span>
          <span className="font-light">atalina</span>
          <span className="ml-1 font-medium">B</span>
          <span className="font-light">arrionuevo</span>
        </div>
        <div className="flex space-x-3">
          {staticOpacities.map((opacity, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-800 server-dot"
              style={{
                opacity,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .server-dot {
          animation: server-gentle-bounce 1.5s ease-in-out infinite alternate,
                     server-opacity-change 1.8s ease-in-out infinite;
        }
        
        .server-dot:nth-child(1) {
          animation-delay: 0s, 0s;
        }
        
        .server-dot:nth-child(2) {
          animation-delay: 0.2s, 0.6s;
        }
        
        .server-dot:nth-child(3) {
          animation-delay: 0.4s, 1.2s;
        }
        
        @keyframes server-gentle-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        
        @keyframes server-opacity-change {
          0%, 100% {
            opacity: 0.3;
          }
          33.33% {
            opacity: 0.9;
          }
          66.66% {
            opacity: 0.3;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default ElegantLoader;
