import React from 'react';
import { IoClose } from 'react-icons/io5';

interface MissionCompleteModalProps {
  onClose: () => void;
}

const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          <IoClose size={24} />
        </button>
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-4 left-8 w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
          <div className="absolute top-12 right-12 w-1 h-4 bg-blue-400 transform rotate-45"></div>
          <div className="absolute top-8 left-16 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-16 right-8 w-1 h-3 bg-green-400 transform -rotate-12"></div>
          <div className="absolute top-6 left-24 w-2 h-1 bg-purple-400 transform rotate-90"></div>
          <div className="absolute top-14 right-20 w-1 h-1 bg-pink-400 rounded-full"></div>
          <div className="absolute top-10 left-32 w-1 h-3 bg-orange-400 transform rotate-45"></div>
          <div className="absolute top-20 right-16 w-2 h-1 bg-teal-400"></div>
          <div className="absolute top-4 right-24 w-1 h-2 bg-indigo-400 transform -rotate-45"></div>
          <div className="absolute top-18 left-20 w-2 h-2 bg-rose-400 rounded-full"></div>
        </div>
        <div className="text-center pt-4">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <img src="/character.png" className="w-full h-full object-cover"></img>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            축하합니다!
          </h2>
          <p className="text-gray-600">
            모든 스티커를 획득!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionCompleteModal;