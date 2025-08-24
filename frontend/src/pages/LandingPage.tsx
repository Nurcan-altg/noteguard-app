import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { componentStyles, generateTailwindClasses } from '../utils/designSystem'

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Dilbilgisi Kontrolü",
      description: "Yazım ve dilbilgisi hatalarını otomatik olarak tespit edin ve düzeltin.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "Tekrar Tespiti",
      description: "Metindeki gereksiz tekrarları bulun ve daha akıcı yazım için öneriler alın.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI Önerileri",
      description: "Yapay zeka destekli akıllı öneriler ile yazım kalitenizi artırın.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Detaylı Analiz",
      description: "Metninizin genel kalitesini puanlayın ve gelişim alanlarını keşfedin.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Güvenli",
      description: "Metinleriniz güvenle saklanır ve sadece size aittir.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Hızlı",
      description: "Saniyeler içinde detaylı analiz sonuçları alın.",
      color: "from-yellow-500 to-orange-600"
    }
  ]

  const testimonials = [
    {
      name: "Ayşe Yılmaz",
      role: "Öğrenci",
      content: "NoteGuard sayesinde ödevlerimdeki dilbilgisi hatalarını kolayca düzeltebiliyorum. Çok kullanışlı bir araç!",
      avatar: "AY"
    },
    {
      name: "Mehmet Kaya",
      role: "İçerik Yazarı",
      content: "Günlük yazılarımı analiz etmek için kullanıyorum. AI önerileri gerçekten kalitemi artırdı.",
      avatar: "MK"
    },
    {
      name: "Zeynep Demir",
      role: "Öğretmen",
      content: "Öğrencilerimin yazılarını değerlendirmek için mükemmel bir araç. Zaman tasarrufu sağlıyor.",
      avatar: "ZD"
    }
  ]

  const pricingPlans = [
    {
      name: "Ücretsiz",
      price: "0₺",
      period: "/ay",
      features: [
        "Aylık 10 analiz",
        "Temel dilbilgisi kontrolü",
        "Tekrar tespiti",
        "E-posta desteği"
      ],
      popular: false,
      cta: "Ücretsiz Başla",
      link: "/register"
    },
    {
      name: "Pro",
      price: "29₺",
      period: "/ay",
      features: [
        "Sınırsız analiz",
        "Gelişmiş AI önerileri",
        "Detaylı raporlar",
        "Öncelikli destek",
        "API erişimi"
      ],
      popular: true,
      cta: "Pro'ya Geç",
      link: "/register"
    },
    {
      name: "Kurumsal",
      price: "99₺",
      period: "/ay",
      features: [
        "Tüm Pro özellikleri",
        "Takım yönetimi",
        "Özel entegrasyonlar",
        "7/24 destek",
        "Özel eğitim"
      ],
      popular: false,
      cta: "İletişime Geç",
      link: "/contact"
    }
  ]

  const faqs = [
    {
      question: "NoteGuard nasıl çalışır?",
      answer: "NoteGuard, yapay zeka teknolojisi kullanarak metninizi analiz eder. Dilbilgisi hatalarını tespit eder, tekrarları bulur ve yazım kalitenizi artırmak için öneriler sunar."
    },
    {
      question: "Metinlerim güvende mi?",
      answer: "Evet, metinleriniz tamamen güvende. Tüm verileriniz şifrelenir ve sadece size aittir. Üçüncü taraflarla paylaşılmaz."
    },
    {
      question: "Hangi dosya formatlarını destekliyor?",
      answer: "TXT, DOC, DOCX, PDF ve RTF formatlarını destekliyoruz. Ayrıca metni doğrudan yapıştırabilirsiniz."
    },
    {
      question: "Ücretsiz planın sınırları neler?",
      answer: "Ücretsiz planda aylık 10 analiz yapabilirsiniz. Temel özelliklerin tümüne erişiminiz var."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className={`bg-white/80 backdrop-blur-md ${generateTailwindClasses.shadow.sm} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className={`${generateTailwindClasses.text['2xl']} ${generateTailwindClasses.font.bold} bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
                NoteGuard
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} transition-colors duration-300`}>
                Özellikler
              </a>
              <a href="#pricing" className={`${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} transition-colors duration-300`}>
                Fiyatlandırma
              </a>
              <a href="#faq" className={`${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} transition-colors duration-300`}>
                SSS
              </a>
              <Link
                to="/login"
                className={`${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.md} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} transition-colors duration-300`}
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className={`${componentStyles.button.primary} ${generateTailwindClasses.text.sm}`}
              >
                Ücretsiz Başla
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${generateTailwindClasses.p.sm} ${generateTailwindClasses.rounded.md} ${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} transition-colors duration-300`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className={`${generateTailwindClasses.px.md} ${generateTailwindClasses.pt.md} ${generateTailwindClasses.pb.md} space-y-1`}>
                <a href="#features" className={`block ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.md} ${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} transition-colors duration-300`}>
                  Özellikler
                </a>
                <a href="#pricing" className={`block ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.md} ${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} transition-colors duration-300`}>
                  Fiyatlandırma
                </a>
                <a href="#faq" className={`block ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.md} ${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} transition-colors duration-300`}>
                  SSS
                </a>
                <Link
                  to="/login"
                  className={`block ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.md} ${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} transition-colors duration-300`}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className={`block ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.md} ${componentStyles.button.primary} ${generateTailwindClasses.text.sm}`}
                >
                  Ücretsiz Başla
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className={`${generateTailwindClasses.py['3xl']} relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className={`inline-flex items-center ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.full} bg-gradient-to-r from-indigo-100 to-purple-100 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} ${generateTailwindClasses.textSecondary} mb-8`}>
              <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2"></span>
              AI Destekli Metin Analizi Platformu
            </div>
            
            <h1 className={`${generateTailwindClasses.text['4xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:${generateTailwindClasses.text['5xl']} md:${generateTailwindClasses.text['6xl']} leading-tight`}>
              Yazılarınızı{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Mükemmelleştirin
              </span>
            </h1>
            
            <p className={`mt-6 max-w-3xl mx-auto ${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary} sm:${generateTailwindClasses.text.xl} leading-relaxed`}>
              Yapay zeka destekli metin analizi ile dilbilgisi hatalarını tespit edin, 
              tekrarları bulun ve yazım kalitenizi artırın. Öğrenciler, yazarlar ve 
              içerik üreticileri için tasarlanmış profesyonel çözüm.
            </p>
            
            <div className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center`}>
              <Link
                to="/register"
                className={`${componentStyles.button.primary} ${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
              >
                Ücretsiz Hesap Oluştur
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                to="/demo"
                className={`${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.rounded.md} text-indigo-600 bg-white border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
              >
                <svg className="inline-block mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Demo İncele
              </Link>
            </div>

            {/* Social proof */}
            <div className={`mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 ${generateTailwindClasses.rounded.full} bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-white`}></div>
                  ))}
                </div>
                <span className="ml-3">10,000+ kullanıcı güveniyor</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2">4.9/5 puan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`${generateTailwindClasses.py['3xl']} bg-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:${generateTailwindClasses.text['4xl']}`}>
              Neden NoteGuard?
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${generateTailwindClasses.text.xl} ${generateTailwindClasses.textSecondary}`}>
              AI destekli metin analizi ile yazılarınızı mükemmelleştirin
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className={`${componentStyles.card.base} ${componentStyles.card.hover} text-center ${generateTailwindClasses.p.lg} group`}>
                <div className={`flex items-center justify-center h-16 w-16 ${generateTailwindClasses.rounded.xl} bg-gradient-to-r ${feature.color} text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className={`${generateTailwindClasses.text.xl} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-4`}>
                  {feature.title}
                </h3>
                <p className={`${generateTailwindClasses.text.base} ${generateTailwindClasses.textSecondary} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`${generateTailwindClasses.py['3xl']} bg-gradient-to-br from-slate-50 to-indigo-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:${generateTailwindClasses.text['4xl']}`}>
              Kullanıcılarımız Ne Diyor?
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${generateTailwindClasses.text.xl} ${generateTailwindClasses.textSecondary}`}>
              Gerçek kullanıcı deneyimleri
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${generateTailwindClasses.rounded.full} bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white ${generateTailwindClasses.font.semibold}`}>
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className={`${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                      {testimonial.name}
                    </h4>
                    <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className={`${generateTailwindClasses.text.base} ${generateTailwindClasses.textSecondary} leading-relaxed italic`}>
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`${generateTailwindClasses.py['3xl']} bg-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:${generateTailwindClasses.text['4xl']}`}>
              Sizin İçin En İyi Plan
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${generateTailwindClasses.text.xl} ${generateTailwindClasses.textSecondary}`}>
              İhtiyaçlarınıza uygun planı seçin
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-0">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative ${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg} ${plan.popular ? 'ring-2 ring-indigo-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`inline-flex ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.full} ${generateTailwindClasses.text.xs} ${generateTailwindClasses.font.semibold} bg-gradient-to-r from-indigo-500 to-purple-500 text-white`}>
                      En Popüler
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className={`${generateTailwindClasses.text.xl} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className={`${generateTailwindClasses.text['4xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary}`}>
                      {plan.price}
                    </span>
                    <span className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary}`}>
                      {plan.period}
                    </span>
                  </div>
                  
                  <ul className={`space-y-3 mb-8 text-left`}>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className={`${generateTailwindClasses.text.base} ${generateTailwindClasses.textSecondary}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to={plan.link}
                    className={`w-full ${plan.popular ? componentStyles.button.primary : componentStyles.button.secondary} ${generateTailwindClasses.text.base} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.py.lg}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`${generateTailwindClasses.py['3xl']} bg-gradient-to-br from-slate-50 to-indigo-50`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:${generateTailwindClasses.text['4xl']}`}>
              Sıkça Sorulan Sorular
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${generateTailwindClasses.text.xl} ${generateTailwindClasses.textSecondary}`}>
              Merak ettiğiniz soruların cevapları
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className={`${componentStyles.card.base} ${generateTailwindClasses.p.lg}`}>
                <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-3`}>
                  {faq.question}
                </h3>
                <p className={`${generateTailwindClasses.text.base} ${generateTailwindClasses.textSecondary} leading-relaxed`}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} text-white sm:${generateTailwindClasses.text['4xl']} mb-6`}>
            Yazım kalitenizi artırmaya hazır mısınız?
          </h2>
          <p className={`${generateTailwindClasses.text.xl} text-indigo-100 mb-8 leading-relaxed`}>
            Ücretsiz hesap oluşturun ve ilk analizinizi hemen yapın. 
            AI destekli metin analizi ile yazılarınızı mükemmelleştirin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className={`${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.rounded.md} text-indigo-600 bg-white hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
            >
              Ücretsiz Başla
            </Link>
            <Link
              to="/demo"
              className={`${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.rounded.md} text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-300`}
            >
              Demo İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className={`${generateTailwindClasses.text['2xl']} ${generateTailwindClasses.font.bold} bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4`}>
                NoteGuard
              </h3>
              <p className={`${generateTailwindClasses.text.base} text-slate-300 mb-6 max-w-md`}>
                AI destekli metin analizi platformu. Yazılarınızı mükemmelleştirin, 
                dilbilgisi hatalarını tespit edin ve yazım kalitenizi artırın.
              </p>
              <div className="flex space-x-4">
                <a href="#" className={`w-10 h-10 ${generateTailwindClasses.rounded.full} bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors duration-300`}>
                  <svg className="h-5 w-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className={`w-10 h-10 ${generateTailwindClasses.rounded.full} bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors duration-300`}>
                  <svg className="h-5 w-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className={`w-10 h-10 ${generateTailwindClasses.rounded.full} bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors duration-300`}>
                  <svg className="h-5 w-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} text-white mb-4`}>
                Ürün
              </h4>
              <ul className="space-y-2">
                <li><a href="#features" className={`${generateTailwindClasses.text.base} text-slate-300 hover:text-white transition-colors duration-300`}>Özellikler</a></li>
                <li><a href="#pricing" className={`${generateTailwindClasses.text.base} text-slate-300 hover:text-white transition-colors duration-300`}>Fiyatlandırma</a></li>
                <li><Link to="/demo" className={`${generateTailwindClasses.text.base} text-slate-300 hover:text-white transition-colors duration-300`}>Demo</Link></li>
                <li><Link to="/help" className={`${generateTailwindClasses.text.base} text-slate-300 hover:text-white transition-colors duration-300`}>Yardım</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} text-white mb-4`}>
                Şirket
              </h4>
              <ul className="space-y-2">
                <li><a href="/about" className={`${generateTailwindClasses.text.base} text-slate-300 hover:text-white transition-colors duration-300`}>Hakkımızda</a></li>
                <li><a href="/contact" className={`${generateTailwindClasses.text.base} text-slate-300 hover:text-white transition-colors duration-300`}>İletişim</a></li>
                <li><a href="/privacy" className={`${generateTailwindClasses.text.base} text-slate-300 hover:text-white transition-colors duration-300`}>Gizlilik</a></li>
                <li><a href="/terms" className={`${generateTailwindClasses.text.base} text-slate-300 hover:text-white transition-colors duration-300`}>Şartlar</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`mt-12 pt-8 border-t border-slate-700 text-center`}>
            <p className={`${generateTailwindClasses.text.base} text-slate-400`}>
              &copy; 2024 NoteGuard. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
