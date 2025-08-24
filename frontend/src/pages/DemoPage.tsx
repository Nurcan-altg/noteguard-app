import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TextInputArea from '../components/Input/TextInputArea'
import ReferenceTopicInput from '../components/Input/ReferenceTopicInput'
import ResultsDashboard from '../components/Results/ResultsDashboard'
import ErrorMessage from '../components/UI/ErrorMessage'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import apiService, { AnalyzeResponse } from '../services/apiService'
import { componentStyles, generateTailwindClasses } from '../utils/designSystem'

const DemoPage: React.FC = () => {
  const [text, setText] = useState('')
  const [referenceTopic, setReferenceTopic] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Ref for results section to scroll to
  const resultsRef = useRef<HTMLDivElement>(null)
  
  // Demo için örnek metin
  const demoText = `Küresel ısınma, atmosferdeki sera gazı birikimiyle doğrudan ilişkilidir. Karbondioksit, metan ve ozon gibi gazlar ısıyı hapseder. Bununla birlikte, geçen hafta oynanan futbol maçında hakem kararları çok tartışıldı. Fosil yakıtların kullanımı artmaya devam ettikçe bu gazların seviyesi yükseliyor.`

  // Auto-scroll to results when analysis starts or completes
  useEffect(() => {
    if ((isAnalyzing || analysisResult) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }, [isAnalyzing, analysisResult])

  const handleDemoLoad = () => {
    setText(demoText)
    setReferenceTopic('Küresel ısınmanın nedenleri')
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await apiService.analyzeTextDemo({ text, reference_topic: referenceTopic })
      setAnalysisResult(result)
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => {
    setText('')
    setReferenceTopic('')
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative min-h-screen">
        {/* Header */}
        <header className={`bg-white/80 backdrop-blur-md ${generateTailwindClasses.shadow.sm} sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className={`${generateTailwindClasses.text['2xl']} ${generateTailwindClasses.font.bold} bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
                  NoteGuard Demo
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className={`${generateTailwindClasses.textSecondary} hover:${generateTailwindClasses.textPrimary} ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.md} ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} transition-colors duration-300`}
                >
                  Ana Sayfa
                </Link>
                <Link
                  to="/register"
                  className={`${componentStyles.button.primary} ${generateTailwindClasses.text.sm}`}
                >
                  Ücretsiz Başla
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Demo Info */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.full} bg-gradient-to-r from-emerald-100 to-teal-100 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} ${generateTailwindClasses.textSecondary} mb-8`}>
              <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-2"></span>
              Ücretsiz Demo Deneyimi
            </div>
            
                         <h2 className={`${generateTailwindClasses.text['4xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:text-5xl md:text-6xl leading-tight mb-6`}>
               NoteGuard'ı{' '}
               <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                 Deneyin
               </span>
             </h2>
            
            <p className={`max-w-3xl mx-auto ${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary} sm:${generateTailwindClasses.text.xl} leading-relaxed mb-8`}>
              AI destekli metin analizi özelliklerimizi ücretsiz olarak deneyin. 
              Örnek metin yükleyebilir veya kendi metninizi girebilirsiniz.
            </p>
          </div>

          {/* Demo Controls */}
          <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg} mb-8`}>
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <button
                onClick={handleDemoLoad}
                className={`${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Örnek Metin Yükle
              </button>
              <button
                onClick={handleClear}
                className={`${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.rounded.md} bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Temizle
              </button>
            </div>
            
            <div className="text-center">
              <p className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary} ${generateTailwindClasses.font.medium}`}>
                Demo için giriş yapmanız gerekmez. Tam özellikler için ücretsiz hesap oluşturun.
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <TextInputArea
                  value={text}
                  onChange={setText}
                  placeholder="Analiz etmek istediğiniz metni buraya yazın..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <ReferenceTopicInput
                    value={referenceTopic}
                    onChange={setReferenceTopic}
                    placeholder="İsteğe bağlı: Metninizin ana konusu (örn: Küresel ısınma)"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className={`${componentStyles.button.primary} w-full sm:w-auto ${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isAnalyzing ? (
                  <LoadingSpinner text="Analiz Ediliyor..." />
                ) : (
                  <>
                    Metni Analiz Et
                    <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Demo Features Preview */}
            <div className="space-y-6">
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Demo Özellikleri
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 ${generateTailwindClasses.rounded.full} bg-emerald-100 flex items-center justify-center mr-3`}>
                      <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                      Dilbilgisi Analizi
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-6 h-6 ${generateTailwindClasses.rounded.full} bg-orange-100 flex items-center justify-center mr-3`}>
                      <svg className="h-3 w-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                      Tekrar Tespiti
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-6 h-6 ${generateTailwindClasses.rounded.full} bg-purple-100 flex items-center justify-center mr-3`}>
                      <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className={`${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                      Anlamsal Analiz
                    </span>
                  </div>
                </div>
              </div>

              {/* Demo Info */}
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Demo Bilgisi
                  </h3>
                </div>
                <div className={`space-y-3 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                  <p>• Demo sürümü sınırlı özellikler sunar</p>
                  <p>• Giriş yapmadan kullanabilirsiniz</p>
                  <p>• Tam özellikler için ücretsiz hesap oluşturun</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <ErrorMessage message={error} onClose={() => setError(null)} />
            </div>
          )}

          {/* Results Section */}
          {(isAnalyzing || analysisResult) && (
            <section ref={resultsRef} className={`${generateTailwindClasses.py['3xl']} bg-white`}>
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {isAnalyzing ? (
                  <div className="text-center space-y-8 animate-fade-in">
                    <div className={`${componentStyles.card.base} ${generateTailwindClasses.p.xl} max-w-2xl mx-auto`}>
                      <LoadingSpinner text="Metniniz analiz ediliyor..." />
                      <p className={`mt-6 ${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.lg} leading-relaxed`}>
                        Lütfen bekleyin, metniniz dilbilgisi, tekrar ve anlamsal açıdan analiz ediliyor...
                      </p>
                      <div className={`mt-8 flex justify-center space-x-4 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                          Dilbilgisi Kontrolü
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                          Tekrar Analizi
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                          Anlamsal İnceleme
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:${generateTailwindClasses.text['4xl']} mb-4`}>
                        Analiz Tamamlandı
                      </h2>
                      <p className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary} max-w-2xl mx-auto`}>
                        Metninizin detaylı analizi aşağıda gösterilmektedir.
                      </p>
                    </div>
                    
                    <ResultsDashboard result={analysisResult!} text={text} />
                    
                    <div className="text-center">
                      <div className={`${componentStyles.card.base} ${generateTailwindClasses.p.lg} max-w-2xl mx-auto`}>
                        <div className="flex items-center justify-center mb-4">
                          <div className={`w-12 h-12 ${generateTailwindClasses.rounded.xl} bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-4`}>
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h3 className={`${generateTailwindClasses.text.xl} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                            Tam Özellikleri Deneyin
                          </h3>
                        </div>
                        <p className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary} mb-6 leading-relaxed`}>
                          Bu demo sınırlı özellikler sunar. Gelişmiş analiz, geçmiş kayıtları ve daha fazlası için ücretsiz hesap oluşturun.
                        </p>
                        <Link
                          to="/register"
                          className={`${componentStyles.button.primary} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
                        >
                          Ücretsiz Hesap Oluştur
                          <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Features Comparison */}
          <div className={`${generateTailwindClasses.py['3xl']} bg-gradient-to-br from-slate-50 to-indigo-50`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h3 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:${generateTailwindClasses.text['4xl']} mb-4`}>
                  Demo vs Tam Sürüm
                </h3>
                <p className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary} max-w-2xl mx-auto`}>
                  Demo ve tam sürüm arasındaki farkları keşfedin
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${generateTailwindClasses.rounded.xl} bg-gradient-to-r from-slate-400 to-slate-500 flex items-center justify-center mx-auto mb-4`}>
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className={`${generateTailwindClasses.text.xl} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                      Demo Sürüm
                    </h4>
                    <p className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>
                      Sınırlı özellikler
                    </p>
                  </div>
                  <ul className={`space-y-3 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Temel dilbilgisi kontrolü
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Tekrar tespiti
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Basit anlamsal analiz
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Sonuç kaydetme yok
                    </li>
                  </ul>
                </div>
                
                <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg} ring-2 ring-indigo-500`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${generateTailwindClasses.rounded.xl} bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4`}>
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className={`${generateTailwindClasses.text.xl} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} mb-2`}>
                      Tam Sürüm
                    </h4>
                    <p className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>
                      Tüm özellikler
                    </p>
                  </div>
                  <ul className={`space-y-3 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Gelişmiş dilbilgisi kontrolü
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      AI destekli öneriler
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Detaylı raporlar ve geçmiş
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Sınırsız analiz
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoPage
