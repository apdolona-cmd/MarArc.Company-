import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Star, Plus, Trash2, TrendingUp } from 'lucide-react';

export default function PerformanceReview() {
  const { employees, performanceReviews, addPerformanceReview, currentUser } = useStore();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    period: new Date().getFullYear().toString(),
    productivity: 3,
    quality: 3,
    teamwork: 3,
    communication: 3,
    punctuality: 3,
    comments: '',
    strengths: '',
    improvements: ''
  });

  const handleAddReview = () => {
    const overallScore = (
      formData.productivity +
      formData.quality +
      formData.teamwork +
      formData.communication +
      formData.punctuality
    ) / 5;

    addPerformanceReview({
      employeeId: formData.employeeId,
      employeeName: employees.find(e => e.id === formData.employeeId)?.name || '',
      reviewerName: currentUser?.name || '',
      reviewDate: new Date().toISOString().split('T')[0],
      period: formData.period,
      ratings: {
        productivity: formData.productivity,
        quality: formData.quality,
        teamwork: formData.teamwork,
        communication: formData.communication,
        punctuality: formData.punctuality
      },
      comments: formData.comments,
      strengths: formData.strengths,
      improvements: formData.improvements,
      overallScore: Math.round(overallScore * 20) / 20,
      status: 'نهائي'
    });

    setShowForm(false);
    setFormData({
      employeeId: '',
      period: new Date().getFullYear().toString(),
      productivity: 3,
      quality: 3,
      teamwork: 3,
      communication: 3,
      punctuality: 3,
      comments: '',
      strengths: '',
      improvements: ''
    });
  };

  const ratings = [
    { key: 'productivity', label: '🎯 الإنتاجية', value: formData.productivity },
    { key: 'quality', label: '✨ جودة العمل', value: formData.quality },
    { key: 'teamwork', label: '👥 العمل الجماعي', value: formData.teamwork },
    { key: 'communication', label: '💬 التواصل', value: formData.communication },
    { key: 'punctuality', label: '⏰ الالتزام الوقتي', value: formData.punctuality }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <TrendingUp size={28} /> تقييم الأداء
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2540] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus size={20} /> تقييم جديد
        </button>
      </div>

      {/* نموذج التقييم */}
      {showForm && (
        <div className="gov-card rounded-2xl p-6 bg-blue-50">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">إضافة تقييم أداء</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">اختر الموظف</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            <input
              type="number"
              min="2020"
              max="2030"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="border rounded-lg px-3 py-2"
              placeholder="السنة"
            />
          </div>

          {/* معايير التقييم */}
          <div className="mb-6">
            <h4 className="font-bold text-[#1e3a5f] mb-4">معايير التقييم (من 1 إلى 5)</h4>
            <div className="space-y-4">
              {ratings.map(rating => (
                <div key={rating.key} className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-sm">{rating.label}</label>
                    <span className="text-lg font-bold text-[#d4af37]">{rating.value}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rating.value}
                    onChange={(e) => setFormData({ ...formData, [rating.key]: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>ضعيف</span>
                    <span>متوسط</span>
                    <span>ممتاز</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الملاحظات */}
          <textarea
            placeholder="التعليقات العامة"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full mb-4"
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <textarea
              placeholder="نقاط القوة"
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              className="border rounded-lg px-3 py-2"
              rows={2}
            />
            <textarea
              placeholder="نقاط التطوير"
              value={formData.improvements}
              onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
              className="border rounded-lg px-3 py-2"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={handleAddReview} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              حفظ التقييم
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* قائمة التقييمات */}
      <div className="space-y-4">
        {performanceReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500 gov-card rounded-2xl">
            لا توجد تقييمات حالياً
          </div>
        ) : (
          performanceReviews.map(review => (
            <div key={review.id} className="gov-card rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e3a5f]">{review.employeeName}</h3>
                  <p className="text-sm text-gray-600">فترة: {review.period}</p>
                  <p className="text-xs text-gray-500">المراجع: {review.reviewerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">الدرجة الإجمالية</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className={`text-3xl font-bold ${getScoreColor(review.overallScore)}`}>
                      {review.overallScore}
                    </span>
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </div>

              {/* معايير التقييم */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 pb-4 border-b">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">الإنتاجية</p>
                  <p className="text-xl font-bold text-blue-600">{review.ratings.productivity}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">الجودة</p>
                  <p className="text-xl font-bold text-green-600">{review.ratings.quality}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">التعاون</p>
                  <p className="text-xl font-bold text-purple-600">{review.ratings.teamwork}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">التواصل</p>
                  <p className="text-xl font-bold text-orange-600">{review.ratings.communication}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">الالتزام</p>
                  <p className="text-xl font-bold text-red-600">{review.ratings.punctuality}</p>
                </div>
              </div>

              {review.comments && (
                <div className="mb-3">
                  <p className="text-sm font-bold text-gray-700">التعليقات:</p>
                  <p className="text-sm text-gray-600">{review.comments}</p>
                </div>
              )}

              {(review.strengths || review.improvements) && (
                <div className="grid grid-cols-2 gap-4">
                  {review.strengths && (
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs font-bold text-green-700 mb-1">نقاط القوة:</p>
                      <p className="text-xs text-green-600">{review.strengths}</p>
                    </div>
                  )}
                  {review.improvements && (
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="text-xs font-bold text-orange-700 mb-1">نقاط التطوير:</p>
                      <p className="text-xs text-orange-600">{review.improvements}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
