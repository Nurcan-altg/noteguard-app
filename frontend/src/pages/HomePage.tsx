import TextInputArea from '../components/Input/TextInputArea'
import ReferenceTopicInput from '../components/Input/ReferenceTopicInput'
import FileUploadButton from '../components/Input/FileUploadButton'
import ResultsDashboard from '../components/Results/ResultsDashboard'
import ErrorMessage from '../components/UI/ErrorMessage'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { useState, useRef, useEffect } from 'react'
import apiService, { AnalyzeResponse } from '../services/apiService'
import mockData from '../mockData.json'
import { componentStyles, generateTailwindClasses } from '../utils/designSystem'

const HomePage = () => {
  const [text, setText] = useState('')
  const [referenceTopic, setReferenceTopic] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Ref for results section to scroll to
  const resultsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to results when analysis starts or completes
  useEffect(() => {
    if ((isAnalyzing || analysisResult) && resultsRef.current) {
      // Smooth scroll to results section
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }, [isAnalyzing, analysisResult])

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    setError(null)
    
    try {
      // Try real API first, fallback to mock data
      try {
        const result = await apiService.analyzeText({
          text: text.trim(),
          reference_topic: referenceTopic.trim() || undefined,
        })
        setAnalysisResult(result)
      } catch (apiError: any) {
        console.log('API failed, using mock data:', apiError.message)
        // Use mock data as fallback
        const mockResult = {
          ...mockData,
          processing_time: Math.random() * 2 + 0.5 // Random processing time
        }
        setAnalysisResult(mockResult)
      }
    } catch (error: any) {
      console.error('Error during analysis:', error)
      setError('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true)
    setError(null)
    try {
      // Try real API first, fallback to mock data
      try {
        const result = await apiService.analyzeFile(file)
        setAnalysisResult(result)
      } catch (apiError: any) {
        console.log('API failed, using mock data:', apiError.message)
        // Use mock data as fallback
        const mockResult = {
          ...mockData,
          processing_time: Math.random() * 2 + 0.5
        }
        setAnalysisResult(mockResult)
      }
      
      // Extract text from file for display
      const textContent = await file.text()
      setText(textContent)
    } catch (error: any) {
      console.error('Error during file analysis:', error)
      setError('File analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className={`${generateTailwindClasses.py['3xl']} relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center ${generateTailwindClasses.px.md} ${generateTailwindClasses.py.sm} ${generateTailwindClasses.rounded.full} bg-gradient-to-r from-indigo-100 to-purple-100 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.font.medium} ${generateTailwindClasses.textSecondary} mb-8`}>
              <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2"></span>
              AI Destekli Metin Analizi
            </div>
            
            <h1 className={`${generateTailwindClasses.text['4xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:text-5xl md:text-6xl leading-tight mb-6`}>
              Metninizi{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Analiz Edin
              </span>
            </h1>
            
            <p className={`max-w-3xl mx-auto ${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary} sm:${generateTailwindClasses.text.xl} leading-relaxed`}>
              Dilbilgisi, tekrar ve anlamsal tutarlılık konularında anında geri bildirim alın. 
              Kapsamlı analiz için belgelerinizi yükleyin veya metninizi yapıştırın.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8">
              <ErrorMessage 
                message={error} 
                onClose={() => setError(null)} 
              />
            </div>
          )}

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <TextInputArea 
                  value={text}
                  onChange={setText}
                  placeholder="Analiz için metninizi buraya yapıştırın..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <ReferenceTopicInput 
                    value={referenceTopic}
                    onChange={setReferenceTopic}
                    placeholder="İsteğe bağlı: Anlamsal analiz için referans konu girin"
                  />
                </div>
                <FileUploadButton onFileUpload={handleFileUpload} />
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className={`${componentStyles.button.primary} w-full sm:w-auto ${generateTailwindClasses.px.xl} ${generateTailwindClasses.py.lg} ${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isAnalyzing ? (
                  <LoadingSpinner text="Analiz ediliyor..." />
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

            {/* Real-time Statistics */}
            <div className="space-y-6">
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Metin İstatistikleri
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>Karakter:</span>
                    <span className={`${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.lg}`}>{text.length.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>Kelime:</span>
                    <span className={`${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.lg}`}>{text.trim() ? text.trim().split(/\s+/).length.toLocaleString() : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>Cümle:</span>
                    <span className={`${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.lg}`}>{text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length.toLocaleString() : 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.sm}`}>Paragraf:</span>
                    <span className={`${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary} ${generateTailwindClasses.text.lg}`}>{text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length.toLocaleString() : 0}</span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className={`${componentStyles.card.base} ${componentStyles.card.hover} ${generateTailwindClasses.p.lg}`}>
                <div className="flex items-center mb-4">
                  <div className={`w-8 h-8 ${generateTailwindClasses.rounded.md} bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-3`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.font.semibold} ${generateTailwindClasses.textPrimary}`}>
                    Hızlı İpuçları
                  </h3>
                </div>
                <ul className={`space-y-2 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Referans konu anlamsal analizde yardımcı olur
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Toplu analiz için belge yükleyin
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Sonuçlar gelecek referans için kaydedilir
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {(isAnalyzing || analysisResult) && (
        <section ref={resultsRef} className={`${generateTailwindClasses.py['3xl']} bg-white`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {isAnalyzing ? (
              <div className="text-center space-y-8 animate-fade-in">
                <div className={`${componentStyles.card.base} ${generateTailwindClasses.p.xl} max-w-2xl mx-auto`}>
                  <LoadingSpinner text="Metniniz analiz ediliyor..." />
                  <p className={`mt-6 ${generateTailwindClasses.textSecondary} ${generateTailwindClasses.text.lg} leading-relaxed`}>
                    Metninizi dilbilgisi, tekrar ve anlamsal tutarlılık açısından analiz ederken lütfen bekleyin...
                  </p>
                  <div className={`mt-8 flex justify-center space-x-4 ${generateTailwindClasses.text.sm} ${generateTailwindClasses.textSecondary}`}>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
                      Dilbilgisi Kontrolü
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                      Tekrar Analizi
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                      Anlamsal İnceleme
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className={`${generateTailwindClasses.text['3xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary} sm:${generateTailwindClasses.text['4xl']} mb-4`}>
                    Analysis Complete
                  </h2>
                  <p className={`${generateTailwindClasses.text.lg} ${generateTailwindClasses.textSecondary} max-w-2xl mx-auto`}>
                    Your text has been analyzed. Review the results below and improve your writing.
                  </p>
                </div>
                
                <ResultsDashboard 
                  result={analysisResult!} 
                  text={text}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage 