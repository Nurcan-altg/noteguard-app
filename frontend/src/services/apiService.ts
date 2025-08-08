import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export interface AnalyzeRequest {
  text: string
  reference_topic?: string
}

export interface GrammarError {
  message: string
  offset: number
  length: number
  suggestions: string[]
}

export interface RepetitionError {
  word: string
  count: number
  positions: number[]
}

export interface SemanticCoherence {
  score: number
  explanation: string
}

export interface AnalysisResult {
  grammar_score: number
  repetition_score: number
  semantic_score: number
  overall_score: number
  grammar_errors: GrammarError[]
  repetition_errors: RepetitionError[]
  semantic_coherence: SemanticCoherence
  suggestions: string[]
}

export interface AnalyzeResponse {
  success: boolean
  result: AnalysisResult
  processing_time: number
}

export const apiService = {
  // Analyze text
  async analyzeText(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    try {
      const response = await apiClient.post<AnalyzeResponse>('/api/v1/analyze', request)
      return response.data
    } catch (error) {
      console.error('Error analyzing text:', error)
      throw error
    }
  },

  // Analyze file
  async analyzeFile(file: File): Promise<AnalyzeResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiClient.post<AnalyzeResponse>('/api/v1/analyze/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error analyzing file:', error)
      throw error
    }
  },

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await apiClient.get<{ status: string }>('/api/v1/health')
      return response.data
    } catch (error) {
      console.error('Error checking health:', error)
      throw error
    }
  },
}

export default apiService 