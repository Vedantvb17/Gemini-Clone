'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Smartphone, Shield, ChevronDown, Check } from 'lucide-react'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/auth'
import { useCountries } from '@/hooks/useCountries'
import { phoneSchema, otpSchema, PhoneFormData, OtpFormData } from '@/lib/validations'
import { formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CountrySkeleton } from '@/components/ui/Skeleton'

export default function AuthForm() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [showCountryList, setShowCountryList] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState('')
  
  const { user, isLoading, sendOTP, login } = useAuthStore()
  const { countries, isLoading: countriesLoading, getCountryDialCode } = useCountries()

  // Phone form
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '',
      phone: ''
    }
  })

  // OTP form
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (user?.isAuthenticated) {
      router.push('/dashboard')
    }
  }, [user, router])


  useEffect(() => {
  if (countries.length > 0 && !selectedCountry) {
    const defaultCountry = 'null' // or 'US'

    if (defaultCountry) {
      const country = countries.find(c => c.cca2 === defaultCountry)
      if (country) {
        const dialCode = getCountryDialCode(country)
        setSelectedCountry(country.cca2)
        phoneForm.setValue('countryCode', dialCode)
      }
    }
  }
}, [countries, selectedCountry, getCountryDialCode, phoneForm])


  const handleCountrySelect = (country: any) => {
    const dialCode = getCountryDialCode(country)
    setSelectedCountry(country.cca2)
    phoneForm.setValue('countryCode', dialCode)
    setShowCountryList(false)
  }

  const handleSendOtp = async (data: PhoneFormData) => {
    try {
      setPhoneNumber(`${data.countryCode}${data.phone}`)
      const success = await sendOTP(data.phone, data.countryCode)
      
      if (success) {
        toast.success('OTP sent successfully!', {
          description: `Verification code sent to ${data.countryCode}${data.phone}`
        })
        setStep('otp')
      } else {
        toast.error('Failed to send OTP. Please try again.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const handleVerifyOtp = async (data: OtpFormData) => {
    try {
      const success = await login(phoneForm.getValues('phone'), phoneForm.getValues('countryCode'), data.otp)
      
      if (success) {
        toast.success('Login successful!', {
          description: 'Welcome to Gemini Clone'
        })
        router.push('/dashboard')
      } else {
        toast.error('Invalid OTP. Please check and try again.')
        otpForm.setError('otp', { message: 'Invalid OTP code' })
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
    }
  }

  const selectedCountryData = countries.find(c => c.cca2 === selectedCountry)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => step === 'otp' ? setStep('phone') : router.push('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {step === 'phone' ? 'Welcome Back' : 'Verify Code'}
            </h1>
          </div>

          {/* Auth Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {step === 'phone' ? (
                  <Smartphone className="w-8 h-8 text-white" />
                ) : (
                  <Shield className="w-8 h-8 text-white" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {step === 'phone' ? 'Enter your phone number' : 'Verify OTP'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {step === 'phone' 
                  ? 'We\'ll send you a verification code'
                  : `Code sent to ${phoneNumber}`
                }
              </p>
            </div>

            {step === 'phone' ? (
              <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
                {/* Country Code Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryList(!showCountryList)}
                      className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                    >
                      {selectedCountryData ? (
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{selectedCountryData.flag}</span>
                          <span className="text-gray-900 dark:text-gray-100">
                            {selectedCountryData.name.common}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-auto">
                            {getCountryDialCode(selectedCountryData)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Select Country</span>
                      )}
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Country Dropdown */}
                    {showCountryList && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {countriesLoading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <CountrySkeleton key={i} />
                          ))
                        ) : (
                          countries.map((country) => (
                            <button
                              key={country.cca2}
                              type="button"
                              onClick={() => handleCountrySelect(country)}
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-600 text-left"
                            >
                              <span className="text-lg">{country.flag}</span>
                              <span className="flex-1 text-gray-900 dark:text-gray-100">
                                {country.name.common}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {getCountryDialCode(country)}
                              </span>
                              {selectedCountry === country.cca2 && (
                                <Check className="w-4 h-4 text-blue-500" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {phoneForm.formState.errors.countryCode && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {phoneForm.formState.errors.countryCode.message}
                    </p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div>
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    {...phoneForm.register('phone')}
                    error={phoneForm.formState.errors.phone?.message}
                    className="text-md"
                  />
                </div>
                
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!phoneForm.formState.isValid}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                <div>
                  <Input
                    label="Verification Code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    {...otpForm.register('otp')}
                    error={otpForm.formState.errors.otp?.message}
                    helperText="Enter any 6-digit code for demo"
                    className="text-center text-2xl tracking-widest font-mono"
                  />
                </div>
                
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!otpForm.formState.isValid}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('phone')}
                  className="w-full"
                >
                  ← Back to phone number
                </Button>
              </form>
            )}
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Demo Instructions:</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Select any country and enter any phone number</li>
              <li>• Use any 6-digit code for OTP verification</li>
              <li>• Example: 123456, 000000, 999999</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
