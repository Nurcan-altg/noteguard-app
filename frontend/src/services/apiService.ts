import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8009'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
    
    // If we get a 401 Unauthorized, clear the token and redirect to login
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, clearing from localStorage')
      localStorage.removeItem('token')
      // Redirect to login page
      window.location.href = '/login'
    }
    
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
  // Analyze text (requires authentication)
  async analyzeText(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    try {
      const response = await apiClient.post<AnalyzeResponse>('/api/v1/analyze', request)
      return response.data
    } catch (error) {
      console.error('Error analyzing text:', error)
      throw error
    }
  },

  // Analyze text for demo (no authentication required)
  async analyzeTextDemo(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    try {
      const response = await apiClient.post<AnalyzeResponse>('/api/v1/analyze/demo', request)
      return response.data
    } catch (error) {
      console.error('Error analyzing text in demo:', error)
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

  // Email verification
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/api/v1/auth/resend-verification', {
        email
      })
      return response.data
    } catch (error) {
      console.error('Error resending verification email:', error)
      throw error
    }
  },

  // Verify email with token
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/api/v1/auth/verify-email', {
        token
      })
      return response.data
    } catch (error) {
      console.error('Error verifying email:', error)
      throw error
    }
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/api/v1/auth/forgot-password', {
        email
      })
      return response.data
    } catch (error) {
      console.error('Error requesting password reset:', error)
      throw error
    }
  },

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/api/v1/auth/reset-password', {
        token,
        new_password: newPassword
      })
      return response.data
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  },

  // Get current user info
  async getCurrentUser(token: string): Promise<any> {
    try {
      const response = await apiClient.get('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error getting current user:', error)
      throw error
    }
  },

  // Update user profile
  async updateProfile(userData: { first_name: string; last_name: string; email: string }): Promise<any> {
    try {
      const response = await apiClient.put('/api/v1/auth/profile', userData)
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  // Get analysis history
  async getAnalysisHistory(limit: number = 50, offset: number = 0, orderBy: string = 'created_at', orderDesc: boolean = true): Promise<any> {
    try {
      const response = await apiClient.get('/api/v1/analyses', {
        params: {
          limit,
          offset,
          order_by: orderBy,
          order_desc: orderDesc
        }
      })
      return response.data
    } catch (error) {
      console.error('Error getting analysis history:', error)
      throw error
    }
  },

  // Get analysis by ID
  async getAnalysisById(analysisId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/v1/analyses/${analysisId}`)
      return response.data
    } catch (error) {
      console.error('Error getting analysis by ID:', error)
      throw error
    }
  },

  // Delete analysis by ID
  async deleteAnalysis(analysisId: string): Promise<any> {
    try {
      const response = await apiClient.delete(`/api/v1/analyses/${analysisId}`)
      return response.data
    } catch (error: any) {
      console.error('Error deleting analysis:', error)
      throw error
    }
  }
}

export default apiService 