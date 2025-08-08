"use client";

import Image from "next/image";
import { FC } from "react";
import { ProfileViewProps, EditFormType } from "@/app/types/mentor";

const ProfileView: FC<ProfileViewProps> = ({
  mentorProfile,
  editForm,
  isEditing,
  setEditForm,
  setIsEditing,
  onSave,
  onCancel,
  onImageUpload,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="text-white text-center py-8">
        <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p>Профайл уншиж байна...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">{error}</div>;
  }

  if (!mentorProfile) {
    return (
      <div className="text-white text-center py-8">
        Профайл мэдээлэл олдсонгүй
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white text-lg font-semibold">Миний профайл</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Засах
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Хадгалах
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Цуцлах
            </button>
          </div>
        )}
      </div>

      {/* Profile info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Image and Basic Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-600">
                {(isEditing ? editForm.image : mentorProfile.image) ? (
                  <Image
                    src={isEditing ? editForm.image : mentorProfile.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                    {mentorProfile.firstName?.[0] || "N"}
                    {mentorProfile.lastName?.[0] || "A"}
                  </div>
                )}
              </div>

              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm((prev: EditFormType) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="Нэр"
                    className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                  />
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm((prev: EditFormType) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Овог"
                    className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                  />
                  <input
                    type="text"
                    value={editForm.nickName}
                    onChange={(e) =>
                      setEditForm((prev: EditFormType) => ({
                        ...prev,
                        nickName: e.target.value,
                      }))
                    }
                    placeholder="Nickname"
                    className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                  />
                </div>
              ) : (
                <div>
                  <h4 className="text-white text-xl font-semibold">
                    {mentorProfile.firstName || "Нэргүй"}{" "}
                    {mentorProfile.lastName || ""}
                  </h4>
                  <p className="text-gray-300">
                    {mentorProfile.nickName || "Nickname оруулаагүй"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-gray-300 text-sm">И-мэйл:</label>
              <p className="text-white">{mentorProfile.email}</p>
            </div>

            <div>
              <label className="text-gray-300 text-sm">Мэргэжил:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.profession}
                  onChange={(e) =>
                    setEditForm((prev: EditFormType) => ({
                      ...prev,
                      profession: e.target.value,
                    }))
                  }
                  className="mt-1 w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                />
              ) : (
                <p className="text-white">
                  {mentorProfile.profession || "Оруулаагүй"}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-300 text-sm">Цагийн үнэлгээ:</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editForm.hourlyPrice}
                  onChange={(e) =>
                    setEditForm((prev: EditFormType) => ({
                      ...prev,
                      hourlyPrice: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1 w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white"
                />
              ) : (
                <p className="text-white">
                  ₮{mentorProfile.category?.price?.toLocaleString() || "0"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Bio, Experience, Education */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h5 className="text-white font-semibold mb-3">Товч танилцуулга</h5>
          {isEditing ? (
            <textarea
              value={editForm.bio}
              onChange={(e) =>
                setEditForm((prev: EditFormType) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300 resize-none"
              placeholder="Өөрийнхөө тухай товч танилцуулга бичнэ үү..."
            />
          ) : (
            <p className="text-gray-300">
              {mentorProfile.bio || "Танилцуулга оруулаагүй"}
            </p>
          )}

          <div className="mt-6 space-y-3">
            <div>
              <label className="text-gray-300 text-sm">Туршлага:</label>
              <p className="text-white">
                {mentorProfile.experience?.careerDuration ||
                  "Туршлага оруулаагүй"}
              </p>
            </div>
            <div>
              <label className="text-gray-300 text-sm">Боловсрол:</label>
              <p className="text-white">
                {mentorProfile.education?.schoolName || "Сургуулийн нэргүй"} –{" "}
                {mentorProfile.education?.major || "Мэргэжилгүй"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
