import React, { useState, useEffect } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import SearchBar from './ui/SearchBar'
import FilterDropdown from './ui/FilterDropdown'
import api from '../api/client'
import { states, courses, entranceExams, formatCurrency } from '../data/collegeData'

export default function CollegeDirectory() {
  const [colleges, setColleges] = useState([])
  const [filteredColleges, setFilteredColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')

  useEffect(() => {
    loadColleges()
  }, [])

  useEffect(() => {
    filterColleges()
  }, [colleges, searchTerm, selectedState, selectedCourse])

  const loadColleges = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/colleges')
      setColleges(data.colleges || [])
    } catch (error) {
      console.error('Failed to load colleges:', error)
      setColleges([])
      // You could show a toast notification here
    } finally {
      setLoading(false)
    }
  }

  const filterColleges = () => {
    let filtered = colleges

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by state
    if (selectedState) {
      filtered = filtered.filter(college => college.state === selectedState)
    }

    // Filter by course
    if (selectedCourse) {
      filtered = filtered.filter(college =>
        college.courses.some(course => course.includes(selectedCourse))
      )
    }

    setFilteredColleges(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedState('')
    setSelectedCourse('')
  }

  const getExamBadgeColor = (exam) => {
    return entranceExams[exam]?.color || 'default'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading colleges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Government Colleges Directory
          </h1>
          <p className="text-xl text-gray-600">
            Explore top government colleges, their fees, and entrance requirements
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <SearchBar
                placeholder="Search colleges by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm('')}
              />
            </div>
            <FilterDropdown
              label="State"
              options={states}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              placeholder="All States"
            />
            <FilterDropdown
              label="Course"
              options={courses}
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              placeholder="All Courses"
            />
          </div>
          
          {(searchTerm || selectedState || selectedCourse) && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''} found
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </Card>

        {/* Colleges Grid */}
        {filteredColleges.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or clear the filters.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <Card key={college._id} hover className="h-full">
                <div className="flex flex-col h-full">
                  {/* College Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {college.name}
                      </h3>
                      <Badge variant="primary" size="sm">
                        {college.type || 'Government'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {college.city}, {college.state}
                    </p>
                  </div>

                  {/* Fees Information */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Annual Fees</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(college.fees?.annual || 0)}
                      </span>
                    </div>
                    {college.fees?.breakdown && (
                      <div className="mt-2 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Tuition: {formatCurrency(college.fees.breakdown.tuition)}</span>
                          <span>Hostel: {formatCurrency(college.fees.breakdown.hostel)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Courses */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Courses:</p>
                    <div className="flex flex-wrap gap-1">
                      {college.courses?.slice(0, 3).map((course, index) => (
                        <Badge key={index} variant="default" size="sm">
                          {course}
                        </Badge>
                      ))}
                      {college.courses?.length > 3 && (
                        <Badge variant="default" size="sm">
                          +{college.courses.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Entrance Exams */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Entrance Exams:</p>
                    <div className="flex flex-wrap gap-1">
                      {college.entranceExams?.slice(0, 3).map((exam, index) => (
                        <Badge 
                          key={index} 
                          variant={getExamBadgeColor(exam)} 
                          size="sm"
                          title={entranceExams[exam]?.description}
                        >
                          {exam}
                        </Badge>
                      ))}
                      {college.entranceExams?.length > 3 && (
                        <Badge variant="default" size="sm">
                          +{college.entranceExams.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Cutoff Information */}
                  {college.cutoff && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">Cutoff:</p>
                      <p className="text-sm text-yellow-700">{college.cutoff}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(college.website, '_blank')}
                    >
                      View Website
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        // Navigate to detailed view or show more info
                        console.log('View details for:', college.name)
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {filteredColleges.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {filteredColleges.length} of {colleges.length} government colleges
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

