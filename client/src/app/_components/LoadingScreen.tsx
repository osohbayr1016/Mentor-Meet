// components/LoadingScreen.tsx

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p>Уншиж байна...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
