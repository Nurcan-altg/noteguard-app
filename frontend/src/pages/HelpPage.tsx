import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const HelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('getting-started')

  const faqs = [
    {
      question: "NoteGuard nasıl çalışır?",
      answer: "NoteGuard, metinlerinizi analiz ederek dilbilgisi hatalarını, tekrarları ve anlamsal bütünlük sorunlarını tespit eder. Gelişmiş AI teknolojisi kullanarak detaylı raporlar ve iyileştirme önerileri sunar."
    },
    {
      question: "Hangi dosya formatları destekleniyor?",
      answer: "Şu anda .txt ve .docx dosya formatları desteklenmektedir. Daha fazla format desteği yakında eklenecektir."
    },
    {
      question: "Analiz sonuçları ne kadar güvenilir?",
      answer: "NoteGuard, en son NLP teknolojilerini kullanarak yüksek doğruluk oranında analiz yapar. Ancak sonuçları her zaman kontrol etmenizi öneririz."
    },
    {
      question: "Ücretsiz hesap ile kaç analiz yapabilirim?",
      answer: "Ücretsiz hesap ile aylık 10 analiz yapabilirsiniz. Premium hesaba geçerek sınırsız analiz yapabilirsiniz."
    },
    {
      question: "Analizlerim güvende mi?",
      answer: "Evet, tüm analizleriniz güvenli sunucularda saklanır ve şifrelenir. Verileriniz üçüncü taraflarla paylaşılmaz."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yardım & Destek</h1>
              <p className="text-gray-600">Sorularınızın cevaplarını bulun</p>
            </div>
            <Link
              to="/analyze"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Analiz Yap
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('getting-started')}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'getting-started'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Başlangıç Rehberi
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'faq'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Sık Sorulan Sorular
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'features'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Özellikler
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'contact'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                İletişim
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'getting-started' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Başlangıç Rehberi</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">1. Hesap Oluşturun</h3>
                      <p className="text-gray-600 mb-4">
                        NoteGuard'ı kullanmaya başlamak için önce ücretsiz bir hesap oluşturun. 
                        Kayıt formunu doldurarak hemen başlayabilirsiniz.
                      </p>
                      <Link
                        to="/register"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Hesap Oluştur
                      </Link>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">2. Metin Analizi Yapın</h3>
                      <p className="text-gray-600 mb-4">
                        Dashboard'dan "Yeni Analiz" butonuna tıklayarak metin analizi yapmaya başlayın. 
                        Metninizi yazın veya dosya yükleyin.
                      </p>
                      <Link
                        to="/analyze"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Analiz Yap
                      </Link>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">3. Sonuçları İnceleyin</h3>
                      <p className="text-gray-600">
                        Analiz tamamlandıktan sonra detaylı raporu inceleyin. Dilbilgisi hataları, 
                        tekrarlar ve anlamsal bütünlük skorlarını görün. İyileştirme önerilerini takip edin.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">4. Geçmişi Takip Edin</h3>
                      <p className="text-gray-600">
                        Tüm analizlerinizi "Geçmiş" sayfasından görüntüleyebilir, karşılaştırabilir 
                        ve gelişiminizi takip edebilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Sık Sorulan Sorular</h2>
                  
                  <div className="space-y-6">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Özellikler</h2>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">Dilbilgisi Kontrolü</h3>
                      </div>
                      <p className="text-gray-600">
                        Gelişmiş NLP teknolojisi ile dilbilgisi hatalarını tespit edin ve düzeltin.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">Tekrar Tespiti</h3>
                      </div>
                      <p className="text-gray-600">
                        Metninizdeki gereksiz tekrarları bulun ve yazımınızı iyileştirin.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">Anlamsal Analiz</h3>
                      </div>
                      <p className="text-gray-600">
                        Metninizin anlamsal bütünlüğünü değerlendirin ve tutarlılığını artırın.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">AI Önerileri</h3>
                      </div>
                      <p className="text-gray-600">
                        Yapay zeka destekli iyileştirme önerileri ile yazımınızı geliştirin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">İletişim</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Destek Ekibimizle İletişime Geçin</h3>
                      <p className="text-gray-600 mb-4">
                        Sorularınız, önerileriniz veya teknik destek ihtiyacınız için bizimle iletişime geçebilirsiniz.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">E-posta</h4>
                        <p className="text-gray-600">support@noteguard.com</p>
                        <p className="text-sm text-gray-500">24 saat içinde yanıt alırsınız</p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Canlı Destek</h4>
                        <p className="text-gray-600">Pazartesi - Cuma, 09:00 - 18:00</p>
                        <p className="text-sm text-gray-500">Anında yardım için</p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Geri Bildirim Formu</h4>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Ad Soyad
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            E-posta
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Mesajınız
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                        >
                          Gönder
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
