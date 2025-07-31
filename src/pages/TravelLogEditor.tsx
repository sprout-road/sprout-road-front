import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelLogForm from '../components/TravelLogForm';

export interface TravelLogContent {
  type: 'text' | 'image';
  order: number;
  content: {
    text?: string;
    url?: string;
    caption?: string;
  };
}

export interface TravelLogFormData {
  title: string;
  sigunguCode: string;
  traveledAt: string;
  contents: TravelLogContent[];
}

const TravelLogEditor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: TravelLogFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/travel-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('여행 로그 저장에 실패했습니다.');
      }

      // 성공 시 홈으로 이동 또는 적절한 페이지로 리다이렉트
      navigate('/');
    } catch (error) {
      console.error('Error submitting travel log:', error);
      alert('여행 로그 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                여행 로그 작성
              </h1>
              <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <TravelLogForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
  );
};

export default TravelLogEditor;