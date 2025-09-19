import { useEffect, useState } from 'react'
import { Country } from '@/types'
import { useAuthStore } from '@/stores/auth'

export function useCountries() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { countries, setCountries } = useAuthStore()

  const fetchCountries = async () => {
    if (countries.length > 0) return // Already loaded

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2')
      
      if (!response.ok) {
        throw new Error('Failed to fetch countries')
      }

      const data: Country[] = await response.json()
      
      // Filter countries that have valid phone codes
      const validCountries = data.filter(country => 
        country.idd?.root && 
        country.idd?.suffixes?.length > 0
      ).sort((a, b) => a.name.common.localeCompare(b.name.common))

      setCountries(validCountries)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load countries')
      console.error('Error fetching countries:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  const getCountryDialCode = (country: Country): string => {
    const root = country.idd.root || ''
    const suffix = country.idd.suffixes?.[0] || ''
    return `${root}${suffix}`
  }

  return {
    countries,
    isLoading,
    error,
    refetch: fetchCountries,
    getCountryDialCode
  }
}
