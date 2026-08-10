import { useState, useCallback } from 'react'

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiFunc(...args)
        setData(result)
        setLoading(false)
        return { data: result, error: null }
      } catch (err) {
        const errorMessage = err?.message || 'An unexpected request error occurred.'
        setError(errorMessage)
        setLoading(false)
        return { data: null, error: errorMessage }
      }
    },
    [apiFunc]
  )

  return { data, loading, error, execute, setData, setError }
}

export default useApi
