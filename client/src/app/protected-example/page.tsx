"use client";

import StudentAuthGuard from "../../components/StudentAuthGuard";
import { checkStudentAuth } from "../../lib/utils";

const ProtectedExamplePage = () => {
  const { student } = checkStudentAuth();

  return (
    <StudentAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">
            Хамгаалагдсан хуудас
          </h1>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-2">
                Таны мэдээлэл:
              </h2>
              {student && (
                <div className="text-gray-300 space-y-1">
                  <p>
                    <strong>Нэр:</strong> {student.firstName} {student.lastName}
                  </p>
                  <p>
                    <strong>И-мэйл:</strong> {student.email}
                  </p>
                  <p>
                    <strong>ID:</strong> {student.studentId}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-center">
                ✅ Энэ хуудас зөвхөн нэвтэрсэн сурагчдад харагдана
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-300 text-sm">
                Хэрэв та studentToken-гүй бол энэ хуудас руу орж болохгүй
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudentAuthGuard>
  );
};

export default ProtectedExamplePage;
