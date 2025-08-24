import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { componentStyles, generateTailwindClasses } from '../utils/designSystem'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [recentAnalyses, setRecentAnalyses] = useState([
    {
      id: 1,
      title: 'Makale Analizi',
      date: '2024-03-15',
      score: 85,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Rapor İncelemesi',
      date: '2024-03-14',
      score: 92,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Ödev Kontrolü',
      date: '2024-03-13',
      score: 78,
      status: 'completed'
    }
  ])

  const [stats, setStats] = useState({
    totalAnalyses: 127,
    thisMonth: 23,
    averageScore: 87,
    improvement: 12
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className={`${generateTailwindClasses.text['4xl']} ${generateTailwindClasses.font.bold} bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2`}>
                  Hoş geldiniz, {user?.first_name || 'Kullanıcı'}!
                </h1>
                <p className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary}`}>
                  Metin analizi performansınızı takip edin ve gelişim alanlarınızı keşfedin
                </p>
              </div>
                             <div className="mt-6 sm:mt-0">
                 <Link
                   to="/"
                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                 >
                   <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                   </svg>
                   Yeni Analiz
                 </Link>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
              <div className="flex items-center">
                <div className={`w-12 h-12 ${generateTailwindClasses.rounded.xl} bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-4`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary} ${generateTailwindClasses.font.medium}`}>
                    Toplam Analiz
                  </p>
                  <p className={`${generateTailwindClasses.text['2xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary}`}>
                    {stats.totalAnalyses}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
              <div className="flex items-center">
                <div className={`w-12 h-12 ${generateTailwindClasses.rounded.xl} bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-4`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary} ${generateTailwindClasses.font.medium}`}>
                    Bu Ay
                  </p>
                  <p className={`${generateTailwindClasses.text['2xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary}`}>
                    {stats.thisMonth}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
              <div className="flex items-center">
                <div className={`w-12 h-12 ${generateTailwindClasses.rounded.xl} bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-4`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary} ${generateTailwindClasses.font.medium}`}>
                    Ortalama Puan
                  </p>
                  <p className={`${generateTailwindClasses.text['2xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary}`}>
                    {stats.averageScore}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
              <div className="flex items-center">
                <div className={`w-12 h-12 ${generateTailwindClasses.rounded.xl} bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary} ${generateTailwindClasses.font.medium}`}>
                    Gelişim
                  </p>
                  <p className={`${generateTailwindClasses.text['2xl']} ${generateTailwindClasses.font.bold} text-emerald-600`}>
                    +{stats.improvement}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Analyses */}
            <div className="lg:col-span-2">
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`${generateTailwindClasses.text.xl} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Son Analizler
                  </h2>
                  <Link
                    to="/history"
                    className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} text-indigo-600 hover:text-indigo-500 transition-colors duration-300`}
                  >
                    Tümünü Görüntüle
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className={`${generateTailwindClasses.p.md} ${generateTailwindClasses.rounded.md} border border-slate-200 hover:border-slate-300 transition-colors duration-300`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 ${generateTailwindClasses.rounded.full} bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center`}>
                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className={`${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                              {analysis.title}
                            </h3>
                            <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                              {new Date(analysis.date).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 ${generateTailwindClasses.rounded.full} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${
                            analysis.score >= 90 ? 'bg-emerald-100 text-emerald-800' :
                            analysis.score >= 80 ? 'bg-blue-100 text-blue-800' :
                            analysis.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {analysis.score}/100
                          </div>
                          <button className={`${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors duration-300`}>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Tips */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Hızlı İşlemler
                  </h3>
                </div>
                <div className="space-y-3">
                  <Link
                    to="/"
                    className={`w-full flex items-center ${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Yeni Analiz Başlat
                  </Link>
                  <Link
                    to="/history"
                    className={`w-full flex items-center ${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold}`}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Analiz Geçmişi
                  </Link>
                  <Link
                    to="/profile"
                    className={`w-full flex items-center ${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold}`}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profil Ayarları
                  </Link>
                </div>
              </div>

              {/* Writing Tips */}
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Yazım İpuçları
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className={`${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} bg-emerald-50 border border-emerald-200`}>
                    <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                      <span className={`${generateTailwindClasses.font.semibold} text-emerald-800`}>İpucu:</span> Cümlelerinizi kısa ve öz tutun. Uzun cümleler okunabilirliği azaltır.
                    </p>
                  </div>
                  <div className={`${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} bg-blue-50 border border-blue-200`}>
                    <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                      <span className={`${generateTailwindClasses.font.semibold} text-blue-800`}>İpucu:</span> Aktif ses kullanın. Pasif ses yapısından kaçının.
                    </p>
                  </div>
                  <div className={`${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} bg-purple-50 border border-purple-200`}>
                    <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                      <span className={`${generateTailwindClasses.font.semibold} text-purple-800`}>İpucu:</span> Tekrarlayan kelimeleri farklı eşanlamlılarla değiştirin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Aylık Hedef
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                      Analiz Tamamlama
                    </span>
                    <span className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                      {stats.thisMonth}/30
                    </span>
                  </div>
                  <div className={`w-full bg-slate-200 ${generateTailwindClasses.rounded.full} h-2`}>
                    <div 
                      className={`bg-gradient-to-r from-indigo-500 to-purple-500 h-2 ${generateTailwindClasses.rounded.full} transition-all duration-300`}
                      style={{ width: `${Math.min((stats.thisMonth / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className={`${generateTailwindClasses.text.xs} ${generateTailwindClasses.textSecondary}`}>
                    Bu ay hedefinizin %{Math.round((stats.thisMonth / 30) * 100)}'ini tamamladınız
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
