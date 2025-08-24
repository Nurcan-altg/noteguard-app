import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/apiService'
import ErrorMessage from '../components/UI/ErrorMessage'
import { componentStyles, generateTailwindClasses } from '../utils/designSystem'

interface Analysis {
  id: string
  text_excerpt: string
  full_text: string
  overall_score: number
  grammar_score: number
  repetition_score: number
  semantic_score: number
  created_at: string
  source_type: 'text' | 'file'
  reference_topic?: string
}

const HistoryPage: React.FC = () => {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date')
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAnalysisId, setDeletingAnalysisId] = useState<string | null>(null)


  useEffect(() => {
    fetchAnalyses()
  }, [currentPage, searchTerm, sortBy])

  const fetchAnalyses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const limit = 20
      const offset = (currentPage - 1) * limit
      const orderBy = sortBy === 'date' ? 'created_at' : 'overall_score'
      
      const response = await apiService.getAnalysisHistory(limit, offset, orderBy, true)
      
      // Transform API response to match our interface
      const transformedAnalyses: Analysis[] = response.analyses.map((analysis: any) => ({
        id: analysis.id,
        text_excerpt: analysis.text_excerpt || analysis.full_text?.substring(0, 100) + '...',
        full_text: analysis.full_text,
        overall_score: analysis.overall_score,
        grammar_score: analysis.grammar_score,
        repetition_score: analysis.repetition_score,
        semantic_score: analysis.semantic_score,
        created_at: analysis.created_at,
        source_type: analysis.source_type,
        reference_topic: analysis.reference_topic
      }))
      
      setAnalyses(transformedAnalyses)
      setTotalPages(Math.ceil(response.total / limit))
    } catch (error) {
      console.error('Failed to fetch analyses:', error)
      setError('Analiz geçmişi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredAnalyses = analyses.filter(analysis =>
    analysis.text_excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analysis.reference_topic?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedAnalyses = [...filteredAnalyses].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else {
      return b.overall_score - a.overall_score
    }
  })

  const handleViewDetails = (analysis: Analysis) => {
    setSelectedAnalysis(analysis)
  }



  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!confirm('Bu analizi silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      setDeletingAnalysisId(analysisId)
      await apiService.deleteAnalysis(analysisId)
      
      // Only remove from local state if deletion was successful
      setAnalyses(analyses.filter(a => a.id !== analysisId))
      setShowDeleteModal(false)
      setDeletingAnalysisId(null)
      
      // Show success message
      setError('Analiz başarıyla silindi.')
      setTimeout(() => setError(null), 3000)
    } catch (error: any) {
      console.error('Failed to delete analysis:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Analiz silinirken bir hata oluştu. Lütfen tekrar deneyin.'
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Analiz bulunamadı. Bu analiz zaten silinmiş olabilir veya size ait olmayabilir. Sayfa yenileniyor...'
          // Refresh the page to get updated data
          setTimeout(() => {
            fetchAnalyses()
          }, 1500)
        } else if (error.response.status === 403) {
          errorMessage = 'Bu analizi silme yetkiniz yok.'
        } else if (error.response.status === 500) {
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.'
        }
      }
      
      // Log the error details for debugging
      console.log('Delete error details:', {
        analysisId,
        error: error.response?.data,
        status: error.response?.status
      })
      
      setError(errorMessage)
      setDeletingAnalysisId(null)
      
      // Don't remove from local state if deletion failed
      // This way the user can see the analysis is still there
    }
  }

  const closeDetailsModal = () => {
    setSelectedAnalysis(null)
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen ${generateTailwindClasses.bgSecondary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className={`mt-4 ${generateTailwindClasses.textSecondary}`}>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${generateTailwindClasses.bgSecondary}`}>
      {/* Header */}
      <header className={`bg-white ${generateTailwindClasses.shadow.md}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className={`${generateTailwindClasses.text['2xl']} ${generateTailwindClasses.font.bold} ${generateTailwindClasses.textPrimary}`}>Analiz Geçmişi</h1>
              <p className={generateTailwindClasses.textSecondary}>Tüm analizlerinizi görüntüleyin</p>
            </div>
            <Link
              to="/analyze"
              className={componentStyles.button.primary}
            >
              Yeni Analiz
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Ara
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Metin veya konu ara..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                  Sırala
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="date">Tarihe Göre</option>
                  <option value="score">Puana Göre</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSortBy('date')
                    setCurrentPage(1)
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analyses List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {sortedAnalyses.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Analiz bulunamadı</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Arama kriterlerinize uygun analiz bulunamadı.' : 'Henüz analiz yapmamışsınız.'}
                </p>
                                                   <div className="mt-6">
                    <Link
                      to="/analyze"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      İlk Analizinizi Yapın
                    </Link>
                  </div>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {analysis.source_type === 'text' ? 'Metin' : 'Dosya'}
                          </span>
                          {analysis.reference_topic && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {analysis.reference_topic}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {analysis.text_excerpt}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-500">Genel Puan</span>
                            <div className={`text-lg font-semibold ${getScoreColor(analysis.overall_score)}`}>
                              {analysis.overall_score}/100
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Dilbilgisi</span>
                            <div className={`text-lg font-semibold ${getScoreColor(analysis.grammar_score)}`}>
                              {analysis.grammar_score}/100
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Tekrar</span>
                            <div className={`text-lg font-semibold ${getScoreColor(analysis.repetition_score)}`}>
                              {analysis.repetition_score}/100
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Anlamsal</span>
                            <div className={`text-lg font-semibold ${getScoreColor(analysis.semantic_score)}`}>
                              {analysis.semantic_score}/100
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 01-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(analysis.created_at)}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(analysis)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          Detayları Gör
                        </button>
                        <button 
                          onClick={() => handleDeleteAnalysis(analysis.id)}
                          disabled={deletingAnalysisId === analysis.id}
                          className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingAnalysisId === analysis.id ? 'Siliniyor...' : 'Sil'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <ErrorMessage message={error} />
        </div>
      )}



      {/* Analysis Details Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Analiz Detayları</h3>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Metin</h4>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {selectedAnalysis.full_text}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Konu</h4>
                  <p className="text-sm text-gray-600">
                    {selectedAnalysis.reference_topic || 'Belirtilmemiş'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Puanlar</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Genel Puan:</span>
                        <span className={`font-medium ${getScoreColor(selectedAnalysis.overall_score)}`}>
                          {selectedAnalysis.overall_score}/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dilbilgisi:</span>
                        <span className={`font-medium ${getScoreColor(selectedAnalysis.grammar_score)}`}>
                          {selectedAnalysis.grammar_score}/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tekrar:</span>
                        <span className={`font-medium ${getScoreColor(selectedAnalysis.repetition_score)}`}>
                          {selectedAnalysis.repetition_score}/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Anlamsal:</span>
                        <span className={`font-medium ${getScoreColor(selectedAnalysis.semantic_score)}`}>
                          {selectedAnalysis.semantic_score}/100
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bilgiler</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Kaynak:</span>
                        <span className="capitalize">{selectedAnalysis.source_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tarih:</span>
                        <span>{formatDate(selectedAnalysis.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
