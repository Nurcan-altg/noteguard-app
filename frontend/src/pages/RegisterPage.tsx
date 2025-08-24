import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { componentStyles, generateTailwindClasses } from '../utils/designSystem'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    setError('')
    setSuccess('')

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      setIsLoading(false)
      return
    }

    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.name.split(' ')[0] || formData.name,
        last_name: formData.name.split(' ').slice(1).join(' ') || ''
      })
      
      if (success) {
        setSuccess('Hesabınız başarıyla oluşturuldu! E-posta adresinizi kontrol edin.')
        // Optionally redirect to login page after a delay
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setError('Kayıt işlemi başarısız. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      setError('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className={`${generateTailwindClasses.text['4xl']} ${generateTailwindClasses.font.bold} bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8`}>
              NoteGuard
            </h1>
            <h2 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} mb-4`}>
              Ücretsiz hesap oluşturun
            </h2>
            <p className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary} mb-8`}>
              Zaten hesabınız var mı?{' '}
              <Link
                to="/login"
                className={`${generateTailwindClasses.font.semibold} text-indigo-600 hover:text-indigo-500 transition-colors duration-300 underline`}
              >
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.xl} shadow-xl`}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className={`${componentStyles.status.badge.error} ${generateTailwindClasses.p.md} ${generateTailwindClasses.rounded.md} flex items-center`}>
                  <svg className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className={`${componentStyles.status.badge.success} ${generateTailwindClasses.p.md} ${generateTailwindClasses.rounded.md} flex items-center`}>
                  <svg className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              )}

              <div>
                <label htmlFor="name" className={`block ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                  Ad Soyad
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${componentStyles.input.base} ${generateTailwindClasses.text.sm} pl-10`}
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={`block ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                  E-posta adresi
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
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${componentStyles.input.base} ${generateTailwindClasses.text.sm} pl-10`}
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${componentStyles.input.base} ${generateTailwindClasses.text.sm} pl-10`}
                    placeholder="En az 6 karakter"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${componentStyles.input.base} ${generateTailwindClasses.text.sm} pl-10`}
                    placeholder="Şifrenizi tekrar girin"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${generateTailwindClasses.borderPrimary} ${generateTailwindClasses.rounded.sm}`}
                />
                <label htmlFor="terms" className={`ml-2 block ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textPrimary}`}>
                  <span className="text-slate-600">
                    <Link
                      to="/terms"
                      className={`${generateTailwindClasses.font.semibold} text-indigo-600 hover:text-indigo-500 transition-colors duration-300 underline`}
                    >
                      Kullanım şartlarını
                    </Link>
                    {' '}ve{' '}
                    <Link
                      to="/privacy"
                      className={`${generateTailwindClasses.font.semibold} text-indigo-600 hover:text-indigo-500 transition-colors duration-300 underline`}
                    >
                      gizlilik politikasını
                    </Link>
                    {' '}kabul ediyorum
                  </span>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center ${componentStyles.button.primary} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Hesap oluşturuluyor...
                    </>
                  ) : (
                    <>
                      Hesap Oluştur
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className={`mt-8`}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${generateTailwindClasses.borderPrimary}`} />
                </div>
                <div className={`relative flex justify-center ${generateTailwindClasses.text.sm}`}>
                  <span className={`px-4 bg-white ${generateTailwindClasses.textSecondary} ${generateTailwindClasses.font.medium}`}>Veya</span>
                </div>
              </div>

              <div className={`mt-6`}>
                <button
                  type="button"
                  className={`w-full inline-flex justify-center items-center ${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.rounded.md} text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google ile kayıt ol
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
