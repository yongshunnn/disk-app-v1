'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { 
  Briefcase, 
  Building2, 
  ShoppingBag, 
  Users2, 
  Megaphone, 
  LineChart, 
  HeartPulse, 
  GraduationCap,
  Calculator,
  Search,
  Code,
  BarChart3,
  Target,
  Users,
  Heart,
  Brain,
  Sparkles,
  HandshakeIcon,
  DollarSign,
  Zap,
  Settings,
  Book,
  Calendar,
  Coins,
  ClipboardList,
  Building,
  Scale,
  Truck,
  Mail,
  Share2,
  Linkedin,
  UserRound
} from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

type Question = {
  text: string
  imageUrl: string
  options: { 
    text: string
    type: 'D' | 'I' | 'S' | 'C'
    icon?: LucideIcon
    description?: string
  }[]
}

type JobDetail = {
  title: string
  match: number
  salaryRange: string
  icon: LucideIcon
  requiredTraits: {
    D: number
    I: number
    S: number
    C: number
  }
  description: string
  skills: string[]
  culturalValues: string[]
  workEnvironment: string
  responsibilities: string[]
}

type JobDetailExpanded = JobDetail & {
  isExpanded?: boolean;
  description: string;
  responsibilities: string[];
  skills: string[];
  culturalValues: string[];
};

type AIGeneratedSummary = {
  loading: boolean;
  error: string | null;
  content: string | null;
}

const questions: Question[] = [
  {
    text: "When faced with a challenge, I typically:",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
    options: [
      { 
        text: "Take immediate action to solve it", 
        type: "D",
        icon: Zap,
        description: "Direct & quick response"
      },
      { 
        text: "Discuss it with others to find solutions", 
        type: "I",
        icon: Users2,
        description: "Collaborative approach"
      },
      { 
        text: "Take time to analyze the situation carefully", 
        type: "C",
        icon: Search,
        description: "Detailed analysis"
      },
      { 
        text: "Work steadily and cooperatively with others", 
        type: "S",
        icon: HandshakeIcon,
        description: "Team-oriented solution"
      },
    ],
  },
  {
    text: "In group settings, I usually:",
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop",
    options: [
      { 
        text: "Lead the conversation", 
        type: "D",
        icon: Target,
        description: "Guide & direct discussions"
      },
      { 
        text: "Share stories and engage others", 
        type: "I",
        icon: Sparkles,
        description: "Energize & inspire the group"
      },
      { 
        text: "Listen and maintain harmony", 
        type: "S",
        icon: Heart,
        description: "Support group dynamics"
      },
      { 
        text: "Observe and take notes", 
        type: "C",
        icon: Search,
        description: "Gather & analyze information"
      },
    ],
  },
  {
    text: "When working on projects, I prefer to:",
    imageUrl: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&h=400&fit=crop",
    options: [
      { 
        text: "Focus on the big picture and results", 
        type: "D",
        icon: LineChart,
        description: "Drive outcomes & achievements"
      },
      { 
        text: "Brainstorm creative ideas with others", 
        type: "I",
        icon: Users2,
        description: "Generate innovative solutions"
      },
      { 
        text: "Follow established processes", 
        type: "C",
        icon: Code,
        description: "Ensure systematic approach"
      },
      { 
        text: "Support the team and maintain stability", 
        type: "S",
        icon: HandshakeIcon,
        description: "Foster team collaboration"
      },
    ],
  },
  {
    text: "Under pressure, I tend to:",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
    options: [
      { 
        text: "Take control and act decisively", 
        type: "D",
        icon: Zap,
        description: "Quick & confident decisions"
      },
      { 
        text: "Stay optimistic and talk things through", 
        type: "I",
        icon: Sparkles,
        description: "Maintain positive energy"
      },
      { 
        text: "Remain patient and supportive", 
        type: "S",
        icon: Heart,
        description: "Provide steady support"
      },
      { 
        text: "Focus on accuracy and details", 
        type: "C",
        icon: Search,
        description: "Ensure precise solutions"
      },
    ],
  },
  {
    text: "When making decisions, I tend to:",
    imageUrl: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=400&fit=crop",
    options: [
      { 
        text: "Act quickly and trust my instincts", 
        type: "D",
        icon: Zap,
        description: "Swift & intuitive choices"
      },
      { 
        text: "Consider how it affects others", 
        type: "I",
        icon: Users2,
        description: "People-focused approach"
      },
      { 
        text: "Take time to ensure stability", 
        type: "S",
        icon: HandshakeIcon,
        description: "Maintain balanced outcomes"
      },
      { 
        text: "Analyze all available data", 
        type: "C",
        icon: BarChart3,
        description: "Data-driven decisions"
      },
    ],
  },
]

const iconMap: Record<string, LucideIcon> = {
  "Users2": Users2,
  "Code": Code,
  "Megaphone": Megaphone,
  "Settings": Settings,
  "Design": Brain,
  "Chart": BarChart3,
  "Coins": Coins,
  "Heartbeat": HeartPulse,
  "Clipboard": ClipboardList,
  "Shop": ShoppingBag,
  "Book": Book,
  "Calendar": Calendar
}

const transformJobData = (jsonData: any[]): JobDetail[] => {
  return jsonData.map(job => ({
    ...job,
    icon: iconMap[job.icon] || Users2 // fallback to Users2 if icon not found
  }))
}

// Import the JSON data
import jobsData from '../data/jobs.json'

// Use the JSON data with proper type checking
const jobDatabase: JobDetail[] = transformJobData(jobsData)

const calculateJobMatch = (profile: Record<string, number>, jobRequirements: Record<string, number>) => {
  // Primary trait match (35%)
  const primaryTraitWeight = 0.35
  const primaryTrait = Object.entries(profile).reduce((a, b) => a[1] > b[1] ? a : b)[0]
  const primaryTraitMatch = Math.min(100, (profile[primaryTrait] / jobRequirements[primaryTrait]) * 100)

  // Secondary traits match (25%)
  const secondaryTraitWeight = 0.25
  const secondaryTraitsMatch = Object.entries(profile)
    .filter(([trait]) => trait !== primaryTrait)
    .reduce((acc, [trait, value]) => {
      const requirementMatch = Math.min(100, (value / jobRequirements[trait]) * 100)
      return acc + requirementMatch
    }, 0) / 3

  // Cultural fit (20%)
  const culturalFitWeight = 0.20
  const culturalFitScore = calculateCulturalFit(profile, jobRequirements)

  // Skill balance (20%)
  const balanceWeight = 0.20
  const skillBalance = 100 - (Math.max(...Object.values(profile)) - Math.min(...Object.values(profile))) / 2

  return Math.round(
    primaryTraitMatch * primaryTraitWeight +
    secondaryTraitsMatch * secondaryTraitWeight +
    culturalFitScore * culturalFitWeight +
    skillBalance * balanceWeight
  )
}

const calculateCulturalFit = (profile: Record<string, number>, jobRequirements: Record<string, number>) => {
  const culturalFactors = {
    teamwork: (profile.S * 0.4 + profile.I * 0.6) / 100,
    leadership: (profile.D * 0.7 + profile.I * 0.3) / 100,
    attention_to_detail: (profile.C * 0.8 + profile.S * 0.2) / 100,
    innovation: (profile.I * 0.5 + profile.D * 0.5) / 100,
    stability: (profile.S * 0.6 + profile.C * 0.4) / 100
  }

  // Match cultural factors to job requirements
  const culturalFitScore = Object.entries(culturalFactors)
    .reduce((score, [factor, value]) => {
      const requirement = jobRequirements[factor as keyof typeof jobRequirements] || 50
      return score + Math.abs(value * 100 - requirement)
    }, 0) / Object.keys(culturalFactors).length

  return Math.max(0, 100 - culturalFitScore)
}

const getJobMatches = (profile: Record<string, number>) => {
  // Calculate matches for all jobs
  const matchedJobs = jobDatabase.map(job => ({
    ...job,
    match: calculateJobMatch(profile, job.requiredTraits)
  }))

  // Sort by match percentage and take top matches
  return matchedJobs
    .sort((a, b) => b.match - a.match)
    .slice(0, 4)
}

// Add this function to get an interesting match
const getInterestingMatch = (profile: Record<string, number>, topMatches: JobDetail[]) => {
  // Get all jobs except those in top matches
  const otherJobs = jobDatabase.filter(
    job => !topMatches.find(match => match.title === job.title)
  )

  // Find a job with balanced trait requirements that match secondary traits
  const interestingJob = otherJobs
    .map(job => ({
      ...job,
      // Calculate match with emphasis on secondary traits
      interestingScore: calculateInterestingMatch(profile, job.requiredTraits)
    }))
    .sort((a, b) => b.interestingScore - a.interestingScore)[0]

  return interestingJob
}

const calculateInterestingMatch = (profile: Record<string, number>, requirements: Record<string, number>) => {
  // Custom scoring for interesting matches
  const secondaryTraits = Object.entries(profile)
    .sort((a, b) => b[1] - a[1])
    .slice(1, 3)
    .map(([trait]) => trait)

  return (
    secondaryTraits.reduce((score, trait) => {
      return score + Math.min(100, (profile[trait] / requirements[trait]) * 100)
    }, 0) / 2
  )
}

export function DiscJobMatcher() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState<string | undefined>(undefined)
  const [discProfile, setDiscProfile] = useState<Record<string, number>>({ D: 0, I: 0, S: 0, C: 0 })
  const [showResults, setShowResults] = useState(false)
  const [startAssessment, setStartAssessment] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});
  const [aiSummary, setAiSummary] = useState<AIGeneratedSummary>({
    loading: false,
    error: null,
    content: null
  });

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer(undefined)
    } else {
      calculateResults(newAnswers)
    }
  }

  const calculateResults = (finalAnswers: string[]) => {
    const profile = { D: 0, I: 0, S: 0, C: 0 }
    finalAnswers.forEach(answer => {
      profile[answer as keyof typeof profile] += 20
    })
    setDiscProfile(profile)
    setShowResults(true)
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setCurrentAnswer(undefined)
    setDiscProfile({ D: 0, I: 0, S: 0, C: 0 })
    setShowResults(false)
    setStartAssessment(false)
  }

  const getDominantType = () => {
    return Object.entries(discProfile).reduce((a, b) => a[1] > b[1] ? a : b)[0]
  }

  const getRecommendedJobs = () => {
    return getJobMatches(discProfile)
  }

  const handleShareResults = async () => {
    const resultsText = `Hey! I just discovered my DISC personality profile and potential career matches!

DISC Profile Results:
D: ${discProfile.D}%
I: ${discProfile.I}%
S: ${discProfile.S}%
C: ${discProfile.C}%

My Primary Type: ${getDominantType() === 'D' ? 'Dominance' :
              getDominantType() === 'I' ? 'Influence' :
              getDominantType() === 'S' ? 'Steadiness' :
              'Conscientiousness'} (${Math.max(...Object.values(discProfile))}%)

Here are my recommended career paths:
${getRecommendedJobs()
  .map(job => `• ${job.title}\n  ${job.salaryRange}`)
  .join('\n')}

Want to find your ideal career path? Take the DISC assessment at:
https://disc-job-matcher.vercel.app

This free personality assessment helps you understand your work style and discover careers that match your strengths!`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My DISC Profile Results',
          text: resultsText
        })
      } else {
        // Fallback to email
        window.location.href = `mailto:?subject=Check out my DISC Profile Results!&body=${encodeURIComponent(resultsText)}`
      }
    } catch (error) {
      console.error('Error sharing results:', error)
    }
  }

  const generateAISummary = async () => {
    setAiSummary(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: discProfile,
          dominantType: getDominantType()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAiSummary({
        loading: false,
        error: null,
        content: data.content
      });
    } catch (error) {
      setAiSummary({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to generate AI summary",
        content: null
      });
    }
  };

  useEffect(() => {
    if (showResults) {
      generateAISummary();
    }
  }, [showResults]);

  if (!startAssessment) {
    return (
      <div className="container mx-auto px-4 py-2 max-w-3xl">
        <h1 className="text-4xl font-bold mb-3 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-outfit tracking-tight">
          Discover Your DISC Personality
        </h1>
        
        <div className="grid gap-3">
          <Card className="text-center px-3 py-2">
            <CardHeader className="pb-1 pt-1">
              <CardTitle className="text-xl">What is DISC?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">
                DISC is a powerful personality assessment tool that helps you understand your behavioral style
                and how you interact with others. It measures four key dimensions of personality:
              </p>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <Card className="px-3 py-2 hover:shadow-lg transition-all bg-red-50/70 hover:scale-105">
              <CardHeader className="p-0 space-y-0 text-center">
                <div className="flex justify-center mb-2">
                  <Target className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-lg text-red-600">Dominance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm pt-1 text-red-900 text-center">
                Direct, results-focused leaders who drive action & achieve goals.
              </CardContent>
            </Card>

            <Card className="px-3 py-2 hover:shadow-lg transition-all bg-yellow-50/70 hover:scale-105">
              <CardHeader className="p-0 space-y-0 text-center">
                <div className="flex justify-center mb-2">
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-lg text-yellow-600">Influence</CardTitle>
              </CardHeader>
              <CardContent className="text-sm pt-1 text-yellow-900 text-center">
                Outgoing & enthusiastic people who motivate & inspire teams.
              </CardContent>
            </Card>

            <Card className="px-3 py-2 hover:shadow-lg transition-all bg-green-50/70 hover:scale-105">
              <CardHeader className="p-0 space-y-0 text-center">
                <div className="flex justify-center mb-2">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg text-green-600">Steadiness</CardTitle>
              </CardHeader>
              <CardContent className="text-sm pt-1 text-green-900 text-center">
                Reliable & patient team players who create harmony & stability.
              </CardContent>
            </Card>

            <Card className="px-3 py-2 hover:shadow-lg transition-all bg-blue-50/70 hover:scale-105">
              <CardHeader className="p-0 space-y-0 text-center">
                <div className="flex justify-center mb-2">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-blue-600">Conscientiousness</CardTitle>
              </CardHeader>
              <CardContent className="text-sm pt-1 text-blue-900 text-center">
                Precise & analytical minds who ensure quality & accuracy.
              </CardContent>
            </Card>
          </div>

          <Card className="px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader className="p-0">
              <CardTitle className="text-xl">Why Take This Assessment?</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Discover your natural behavioral style
                </li>
                <li className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  Find career paths that match your personality
                </li>
                <li className="flex items-center gap-2">
                  <HandshakeIcon className="w-4 h-4 text-purple-600" />
                  Understand how to work better with others
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  Get salary insights for recommended roles
                </li>
              </ul>
            </CardContent>
          </Card>

          <Button 
            onClick={() => setStartAssessment(true)}
            className="w-full max-w-md mx-auto py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-1"
          >
            Start Your DISC Assessment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center font-outfit bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        DISC Job Matcher
      </h1>
      
      {!showResults ? (
        <Card className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          
          <CardHeader className="pb-2">
            <div className="mb-2 rounded-lg overflow-hidden relative aspect-[3/1]">
              <img 
                src={questions[currentQuestion].imageUrl} 
                alt="Question illustration"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <CardTitle className="text-2xl font-outfit">Question {currentQuestion + 1} of 5</CardTitle>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round((currentQuestion / questions.length) * 100)}% Complete
              </span>
            </div>
            <CardDescription className="text-lg text-foreground">
              {questions[currentQuestion].text}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-4">
            <RadioGroup 
              value={currentAnswer} 
              onValueChange={handleAnswer}
              defaultValue={undefined}
              key={currentQuestion}
              className="space-y-2"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-3 rounded-lg border p-3 transition-all cursor-pointer
                    ${currentAnswer === option.type 
                      ? 'border-purple-500 bg-purple-50 shadow-sm'
                      : 'border-muted hover:border-purple-200 hover:bg-purple-50/30'}`}
                  onClick={() => handleAnswer(option.type)}
                >
                  {option.icon && (
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                      ${currentAnswer === option.type 
                        ? 'bg-purple-200'
                        : 'bg-purple-50'}`}
                    >
                      <option.icon className={`w-5 h-5 
                        ${currentAnswer === option.type 
                          ? 'text-purple-700'
                          : 'text-purple-500'}`} 
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className={`text-base font-medium ${currentAnswer === option.type ? 'text-purple-700' : ''}`}>
                      {option.text}
                    </p>
                    {option.description && (
                      <p className={`text-sm ${currentAnswer === option.type ? 'text-purple-600/80' : 'text-muted-foreground'}`}>
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>

          <CardFooter className="pt-2">
            <div className="w-full space-y-2">
              <Progress 
                value={(currentQuestion / questions.length) * 100} 
                className="h-2 w-full bg-muted"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1}</span>
                <span>5 Questions Total</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your DISC Profile Results</CardTitle>
            <CardDescription>Based on your answers, here's your personality breakdown and job recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">DISC Profile Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-red-600 font-medium">D: {discProfile.D}%</span>
                    <div className="flex-grow bg-gray-100 rounded-full h-4">
                      <div 
                        className="bg-red-500/80 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${discProfile.D}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-yellow-600 font-medium">I: {discProfile.I}%</span>
                    <div className="flex-grow bg-gray-100 rounded-full h-4">
                      <div 
                        className="bg-yellow-500/80 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${discProfile.I}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-green-600 font-medium">S: {discProfile.S}%</span>
                    <div className="flex-grow bg-gray-100 rounded-full h-4">
                      <div 
                        className="bg-green-500/80 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${discProfile.S}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-blue-600 font-medium">C: {discProfile.C}%</span>
                    <div className="flex-grow bg-gray-100 rounded-full h-4">
                      <div 
                        className="bg-blue-500/80 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${discProfile.C}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Top Job Matches</h3>
                <div className="grid gap-3">
                  {getRecommendedJobs().map((job, index) => {
                    const Icon = job.icon;
                    const isExpanded = expandedJobs[job.title] || false;
                    
                    return (
                      <div key={index} className="space-y-3">
                        <div 
                          onClick={() => setExpandedJobs(prev => ({
                            ...prev, 
                            [job.title]: !prev[job.title]
                          }))}
                          className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-to-r from-background to-muted/20 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="p-2 rounded-full bg-purple-100">
                            <Icon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-lg">{job.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  Salary Range: {job.salaryRange}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-2xl font-bold text-purple-600">
                                  {job.match}%
                                </span>
                                <span className="text-xs text-purple-600 font-medium">
                                  match
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Job Details */}
                        {isExpanded && (
                          <div className="rounded-lg border bg-white p-4 space-y-4 animate-in slide-in-from-top duration-200">
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900">About this role</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {job.description}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900">Key Responsibilities</h4>
                              <ul className="grid gap-2 text-sm text-gray-600">
                                {job.responsibilities.map((responsibility, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <div className="mt-1.5 w-1 h-1 rounded-full bg-purple-600 flex-shrink-0" />
                                    {responsibility}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900">Required Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900">Cultural Values</h4>
                              <div className="flex flex-wrap gap-2">
                                {job.culturalValues.map((value, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2.5 py-1 bg-pink-50 text-pink-700 rounded-full text-sm"
                                  >
                                    {value}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2">
                              <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white border-0 h-11"
                                onClick={() => {
                                  window.open(
                                    `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}`,
                                    '_blank'
                                  );
                                }}
                              >
                                <Linkedin className="w-5 h-5" />
                                Find {job.title} Jobs on LinkedIn
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Another Career Path to Consider</h3>
                {(() => {
                  const interestingJob = getInterestingMatch(discProfile, getRecommendedJobs())
                  const Icon = interestingJob.icon
                  return (
                    <div className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md transition-all">
                      <div className="p-2 rounded-full bg-purple-200">
                        <Icon className="w-6 h-6 text-purple-700" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-lg">{interestingJob.title}</p>
                            <p className="text-sm text-purple-700">
                              This role could be an interesting fit based on your secondary traits!
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Salary Range: {interestingJob.salaryRange}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Personality Insights Cards */}
              <div className="space-y-6">
                {/* Primary Type Card */}
                <div className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold mb-4">Personality Category</h2>
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-4 flex-1">
                      <div>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-2">
                          Primary Type
                        </span>
                        <h3 className="text-2xl font-bold">
                          {getDominantType() === 'D' ? 'Dominance' :
                           getDominantType() === 'I' ? 'Influence' :
                           getDominantType() === 'S' ? 'Steadiness' :
                           'Conscientiousness'} ({Math.max(...Object.values(discProfile))}%)
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 text-base leading-relaxed">
                        {getDominantType() === 'D' ? 
                          'You are a natural leader who takes charge and drives results. Your direct approach and decisiveness help you overcome challenges quickly.' :
                         getDominantType() === 'I' ? 
                          'You excel at motivating others and building relationships. Your enthusiastic nature and strong communication skills make you a great team catalyst.' :
                         getDominantType() === 'S' ? 
                          'You are a dependable team player who values harmony and stability. Your patient and supportive nature helps create a positive work environment.' :
                          'You have a methodical approach and attention to detail. Your analytical mindset and precision help ensure high-quality outcomes.'}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {getDominantType() === 'D' && (
                          <>
                            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                              Results-Driven
                            </span>
                            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                              Decisive
                            </span>
                            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                              Direct
                            </span>
                          </>
                        )}
                        {getDominantType() === 'I' && (
                          <>
                            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                              Enthusiastic
                            </span>
                            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                              Inspiring
                            </span>
                            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                              Social
                            </span>
                          </>
                        )}
                        {getDominantType() === 'S' && (
                          <>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                              Cooperative
                            </span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                              Patient
                            </span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                              Reliable
                            </span>
                          </>
                        )}
                        {getDominantType() === 'C' && (
                          <>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                              Analytical
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                              Precise
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                              Systematic
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getDominantType() === 'D' && <Target className="w-10 h-10 text-red-600" />}
                      {getDominantType() === 'I' && <Users2 className="w-10 h-10 text-yellow-600" />}
                      {getDominantType() === 'S' && <Heart className="w-10 h-10 text-green-600" />}
                      {getDominantType() === 'C' && <Brain className="w-10 h-10 text-blue-600" />}
                    </div>
                  </div>
                </div>

                {/* Secondary Traits Section */}
                {(() => {
                  const secondaryTraits = Object.entries(discProfile)
                    .filter(([type, value]) => value > 0 && type !== getDominantType())
                    .sort((a, b) => b[1] - a[1]);

                  if (secondaryTraits.length === 0) return null;

                  return (
                    <div className={`grid ${secondaryTraits.length > 1 ? 'grid-cols-2 gap-6' : 'grid-cols-1'}`}>
                      {secondaryTraits.map(([type, value], index) => (
                        <div key={index} className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                          <h2 className="text-xl font-bold mb-4">Personality Category</h2>
                          
                          <div className="space-y-4">
                            <div>
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-2">
                                Secondary Trait
                              </span>
                              <h3 className="text-2xl font-bold">
                                {type === 'D' ? 'Dominance' :
                                 type === 'I' ? 'Influence' :
                                 type === 'S' ? 'Steadiness' :
                                 'Conscientiousness'} ({value}%)
                              </h3>
                            </div>

                            <p className="text-gray-600 text-base leading-relaxed">
                              {type === 'D' && 'Direct and results-oriented in approach. Your decisive nature helps drive projects forward.'}
                              {type === 'I' && 'You excel at motivating others and building relationships. Your communication skills enhance team dynamics.'}
                              {type === 'S' && 'Patient and reliable in approach to work. Your supportive nature helps maintain team harmony.'}
                              {type === 'C' && 'You have a methodical approach and attention to detail. Your precision ensures quality outcomes.'}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {type === 'D' && (
                                <>
                                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                                    Decisive
                                  </span>
                                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                                    Direct
                                  </span>
                                </>
                              )}
                              {type === 'I' && (
                                <>
                                  <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                                    Inspiring
                                  </span>
                                  <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                                    Social
                                  </span>
                                </>
                              )}
                              {type === 'S' && (
                                <>
                                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                                    Patient
                                  </span>
                                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                                    Reliable
                                  </span>
                                </>
                              )}
                              {type === 'C' && (
                                <>
                                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                    Analytical
                                  </span>
                                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                    Precise
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Work Environment Card */}
              <div className="bg-white rounded-xl shadow-sm border p-4 mt-3">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Ideal Work Environment</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-purple-600" />
                    <p className="text-sm text-gray-600">
                      Collaborative settings that value teamwork
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-purple-600" />
                    <p className="text-sm text-gray-600">
                      Stable and harmonious work culture
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-purple-600" />
                    <p className="text-sm text-gray-600">
                      Balance of social interaction and focused work
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-purple-600" />
                    <p className="text-sm text-gray-600">
                      Clear processes with room for innovation
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border p-4 mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Your DISC Profile Summary</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  With a primary {getDominantType() === 'D' ? 'Dominance' :
                    getDominantType() === 'I' ? 'Influence' :
                    getDominantType() === 'S' ? 'Steadiness' :
                    'Conscientiousness'} style ({Math.max(...Object.values(discProfile))}%) 
                  {getDominantType() === 'D' ? 
                    ', you are naturally equipped for leadership roles that require quick decision-making and results-oriented action.' :
                  getDominantType() === 'I' ? 
                    ', you thrive in roles that allow you to inspire and engage with others, making you well-suited for people-oriented positions.' :
                  getDominantType() === 'S' ? 
                    ', you excel in supportive roles that value consistency and teamwork, making you an invaluable team player.' :
                    ', you are well-suited for roles requiring attention to detail and analytical thinking, ensuring high-quality outcomes.'}
                  Your profile suggests you would perform best in environments that 
                  {getDominantType() === 'D' ? ' allow you to take charge and drive results.' :
                  getDominantType() === 'I' ? ' enable you to interact and communicate freely.' :
                  getDominantType() === 'S' ? ' provide stability and foster collaboration.' :
                  ' value precision and systematic approaches.'}
                </p>
              </div>

              {showResults && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border p-6 mt-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src="/angry-mum.jpg"
                      alt="Angry Asian mum"
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 flex-shrink-0"
                      style={{
                        objectPosition: "center 30%"
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-base mb-3">What Your Mum Will Say About You</h4>
                      
                      {aiSummary.loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                        </div>
                      ) : aiSummary.error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                          Error: {aiSummary.error}
                        </div>
                      ) : aiSummary.content ? (
                        <p className="text-gray-700 leading-relaxed text-base">
                          {aiSummary.content}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <div className="border-t mt-8">
            <div className="py-6 space-y-6">
              {/* Share Buttons */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Share Your Results</h3>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => window.location.href = `mailto:?subject=My DISC Profile Results&body=${encodeURIComponent(`Check out my DISC profile results!`)}`}
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Results
                  </Button>
                  <Button 
                    onClick={handleShareResults}
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Results
                  </Button>
                </div>
              </div>

              {/* Retake Button */}
              <Button 
                onClick={resetAssessment} 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Retake Assessment
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}