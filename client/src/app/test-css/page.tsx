export default function TestCSS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">CSS Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test custom classes */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Custom Classes Test</h2>
            <div className="w-6/10 h-32 bg-blue-200 border-1 border-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-blue-700">w-6/10 (60% width)</span>
            </div>
          </div>

          {/* Test standard Tailwind */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Standard Tailwind Test
            </h2>
            <div className="w-full h-32 bg-green-200 border border-green-500 rounded-lg flex items-center justify-center">
              <span className="text-green-700">Standard classes</span>
            </div>
          </div>

          {/* Test modal-like structure */}
          <div className="col-span-full">
            <div className="bg-black/20 backdrop-blur-md rounded-[20px] border-1 border-gray-400/50 p-8">
              <h3 className="text-white text-2xl font-semibold mb-4">
                Modal-like Test
              </h3>
              <p className="text-white/80">
                This tests the modal styling used throughout your app.
              </p>
              <button className="mt-4 bg-white text-black px-6 py-3 rounded-[40px] hover:bg-gray-100 transition-colors">
                Test Button
              </button>
            </div>
          </div>

          {/* Test font */}
          <div className="col-span-full bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Font Test</h3>
            <p className="font-gip text-lg">
              This text should use the GIP font family.
            </p>
            <p className="text-base">This text uses the default font.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-white text-black px-6 py-3 rounded-[40px] hover:bg-gray-100 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
