import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiService } from '../services/apiService'

const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setMessage({ type: 'error', text: 'Geçersiz doğrulama linki' })
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      setIsLoading(true)
      await apiService.verifyEmail(verificationToken)
      setIsVerified(true)
      setMessage({ type: 'success', text: 'E-posta adresiniz başarıyla doğrulandı!' })
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'E-posta doğrulama işlemi başarısız oldu. Lütfen tekrar deneyin.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">E-posta doğrulanıyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {isVerified ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isVerified ? 'E-posta Doğrulandı!' : 'Doğrulama Hatası'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            {isVerified 
              ? 'NoteGuard hesabınız artık aktif. Metin analizi yapmaya başlayabilirsiniz!'
              : 'E-posta doğrulama işlemi başarısız oldu.'
            }
          </p>
        </div>

        {message && (
          <div className={`rounded-md p-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {isVerified ? (
            <div className="space-y-4">
              <button
                onClick={handleGoToDashboard}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Dashboard'a Git
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Veya{' '}
                  <button
                    onClick={handleGoToLogin}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    giriş yapın
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleGoToLogin}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Giriş Yap
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Sorun yaşıyorsanız{' '}
                  <a
                    href="/help"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    yardım sayfasını
                  </a>
                  {' '}ziyaret edin
                </p>
              </div>
            </div>
          )}
        </div>

        {isVerified && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Hoş geldiniz!
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Artık NoteGuard'ın tüm özelliklerini kullanabilirsiniz:
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Metin analizi yapın</li>
                    <li>Dilbilgisi hatalarını tespit edin</li>
                    <li>AI destekli öneriler alın</li>
                    <li>Analiz geçmişinizi görüntüleyin</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailVerificationPage
