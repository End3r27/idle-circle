import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

interface AuthFormProps {
  onSuccess: () => void
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = isLogin 
      ? await signIn(email, password)
      : await signUp(email, password, displayName)

    if (result.success) {
      onSuccess()
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="glass-effect rounded-2xl shadow-2xl p-8 card-hover">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-glow flex items-center justify-center">
              <span className="text-2xl">⚔️</span>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Idle Circle
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Welcome back to your adventure' : 'Begin your idle journey'}
            </p>
          </div>
        
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slide-in">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-300"
                  placeholder="Choose your display name"
                  required
                />
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full button-primary text-white py-3 px-6 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-300"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}