import React from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Та энэхүү уулзалтыг цуцлахаа итгэлтэй байна уу?
        </h3>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Болих
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Тийм, цуцал
          </button>
        </div>
      </div>
    </div>,
    document.body // 👉 portal ашиглаж body руу гаргаж зурж байна
  );
};
