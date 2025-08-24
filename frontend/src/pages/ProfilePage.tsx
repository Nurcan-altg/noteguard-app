import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { componentStyles, generateTailwindClasses } from '../utils/designSystem'

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const success = await updateProfile(formData)
      
      if (success) {
        setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi!' })
        setIsEditing(false)
      } else {
        setMessage({ type: 'error', text: 'Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || ''
    })
    setIsEditing(false)
    setMessage(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`${generateTailwindClasses.text['4xl']} ${generateTailwindClasses.font.bold} bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4`}>
              NoteGuard
            </h1>
            <h2 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} mb-4`}>
              Profil Ayarları
            </h2>
            <p className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary} max-w-2xl mx-auto`}>
              Hesap bilgilerinizi yönetin ve güvenlik ayarlarınızı güncelleyin
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-8 ${generateTailwindClasses.rounded.md} ${generateTailwindClasses.p.md} ${message.type === 'success' ? `${componentStyles.status.badge.success}` : `${componentStyles.status.badge.error}`} flex items-center justify-center`}>
              <svg className={`h-5 w-5 mr-3 flex-shrink-0 ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                {message.type === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`${generateTailwindClasses.text.xl} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Profil Bilgileri
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`${componentStyles.button.primary} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold}`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Düzenle
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first_name" className={`block ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                        Ad
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="first_name"
                          name="first_name"
                          type="text"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`${componentStyles.input.base} ${generateTailwindClasses.text.sm} pl-10 ${!isEditing ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="last_name" className={`block ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                        Soyad
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="last_name"
                          name="last_name"
                          type="text"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`${componentStyles.input.base} ${generateTailwindClasses.text.sm} pl-10 ${!isEditing ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={`block ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                      E-posta Adresi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`${componentStyles.input.base} ${generateTailwindClasses.text.sm} pl-10 ${!isEditing ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 flex justify-center items-center ${componentStyles.button.primary} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Kaydediliyor...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Kaydet
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className={`flex-1 flex justify-center items-center ${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.rounded.md} text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        İptal
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Account Settings & Statistics */}
            <div className="space-y-6">
              {/* Account Settings */}
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Hesap Ayarları
                  </h3>
                </div>
                <div className="space-y-3">
                  <button className={`w-full text-left ${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} hover:bg-slate-50 transition-colors duration-300 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                    <div className="flex items-center justify-between">
                      <span>Şifre Değiştir</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  <button className={`w-full text-left ${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} hover:bg-slate-50 transition-colors duration-300 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                    <div className="flex items-center justify-between">
                      <span>E-posta Doğrulama</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  <button className={`w-full text-left ${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} hover:bg-slate-50 transition-colors duration-300 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                    <div className="flex items-center justify-between">
                      <span>Bildirim Ayarları</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Account Statistics */}
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Hesap İstatistikleri
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>Toplam Analiz:</span>
                    <span className={`${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.lg}`}>127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>Bu Ay:</span>
                    <span className={`${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.lg}`}>23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>Kayıt Tarihi:</span>
                    <span className={`${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.sm}`}>15 Mart 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>Üyelik:</span>
                    <span className={`${generateTailwindClasses.font.semibold} text-emerald-600 ${generateTailwindClasses.text.sm}`}>Pro</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Hızlı İşlemler
                  </h3>
                </div>
                <div className="space-y-3">
                  <button className={`w-full ${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} shadow-lg hover:shadow-xl transform hover:-translate-y-1`}>
                    Yeni Analiz Başlat
                  </button>
                  <button className={`w-full ${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold}`}>
                    Analiz Geçmişi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
