'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Bir Hata Oluştu</h2>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
} 