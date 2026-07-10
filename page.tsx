'use client';

import React, { useState, useEffect } from 'react';
import { useLang } from '@/context/LangContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  Dumbbell, Users, Landmark, Target, Heart, 
  Sparkles, Camera, Phone, Calendar, Search, 
  ShieldCheck, RefreshCw, Sun, Moon,
  MessageSquare, User, BarChart3, Plus, Settings,
  Calculator, CheckCircle2, AlertCircle, LogOut, KeyRound, Mail,
  TrendingUp, FileText, Check, X, ShieldAlert, Award, Droplets, BookOpen, Trash2,
  Bell, Clock, Smartphone, Zap, Eye
} from 'lucide-react';

type AuthMode = 'login' | 'signup';
type UserRole = 'super_admin' | 'coach' | 'client';

export default function Home() {
  const { t, lang, isRtl } = useLang();
  const { theme, toggleTheme } = useTheme();
  const appName = 'Trainify';

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [showAuthForm, setShowAuthForm] = useState<boolean>(false);
  const [pricingRole, setPricingRole] = useState<'coach' | 'client'>('coach');

  // Login Inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup Inputs (Admin completely excluded)
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('client');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupError, setSignupError] = useState('');

  // Platform State & Trainee Linkage inputs
  const [traineeEmailInput, setTraineeEmailInput] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');
  const [linkError, setLinkError] = useState('');
  const [trainees, setTrainees] = useState<any[]>([]);

  // Tab switchers for dashboards
  const [traineeTab, setTraineeTab] = useState<'plans' | 'goals' | 'progress' | 'scanner' | 'compliance'>('plans');
  const [coachTab, setCoachTab] = useState<'clients' | 'workouts' | 'nutrition' | 'reviews' | 'calculators' | 'revenue'>('clients');
  const [adminTab, setAdminTab] = useState<'system' | 'analytics' | 'payments'>('system');

  // AI Food Scanner States
  const [scannerImage, setScannerImage] = useState<string | null>(null);
  const [scannerFile, setScannerFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanMealType, setScanMealType] = useState<string>('Lunch');
  const [saveSuccess, setSaveSuccess] = useState<string>('');

  // Daily Meal History & Compliance Logs
  const [mealHistory, setMealHistory] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, any>>({});
  const [loadingSuggestions, setLoadingSuggestions] = useState<Record<string, boolean>>({});
  const [nutritionReportRange, setNutritionReportRange] = useState<string>('weekly');
  const [nutritionReport, setNutritionReport] = useState<any | null>(null);

  // Coach Review States
  const [coachReviews, setCoachReviews] = useState<any[]>([]);
  const [clientFilter, setClientFilter] = useState<string>('');
  const [complianceFilter, setComplianceFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [reviewComments, setReviewComments] = useState<Record<string, string>>({});

  // Super Admin Stats State
  const [adminStats, setAdminStats] = useState<any | null>(null);

  // AI Calculators States (Module 9 - Coach Dashboard)
  const [calcType, setCalcType] = useState<'bmi' | 'calorie' | 'macros' | 'water' | 'meal_gen' | 'plan_gen' | 'analyzer'>('bmi');
  const [weightInput, setWeightInput] = useState<number>(80);
  const [heightInput, setHeightInput] = useState<number>(180);
  const [ageInput, setAgeInput] = useState<number>(25);
  const [genderInput, setGenderInput] = useState<string>('male');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  
  // Custom Meal & Plan Generator parameters
  const [preferenceInput, setPreferenceInput] = useState<string>('High Protein, Low Carb');
  const [clientGoalInput, setClientGoalInput] = useState<string>('Fat Loss');
  const [analyzerFoodList, setAnalyzerFoodList] = useState<string>('150g chicken breast, 200g white rice, 100g broccoli');

  // Coach Payment & Trainee Screenshot settings
  const [instapayHandle, setInstapayHandle] = useState<string>('');
  const [vodafoneCashNumber, setVodafoneCashNumber] = useState<string>('');
  const [coachPendingReceipts, setCoachPendingReceipts] = useState<any[]>([]);
  const [clientPendingReceipt, setClientPendingReceipt] = useState<any | null>(null);
  const [loadingPendingReceipts, setLoadingPendingReceipts] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedPackageForPayment, setSelectedPackageForPayment] = useState<any | null>(null);
  const [paymentMethodSelect, setPaymentMethodSelect] = useState<'instapay' | 'vodafone_cash'>('instapay');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [submittingReceipt, setSubmittingReceipt] = useState<boolean>(false);
  const [savingPaymentSettings, setSavingPaymentSettings] = useState<boolean>(false);
  const [reviewingReceiptId, setReviewingReceiptId] = useState<string | null>(null);
  const [coachesList, setCoachesList] = useState<any[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string>('');

  // Chat & AI Assistant States
  const [isAiMode, setIsAiMode] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [aiChatMessages, setAiChatMessages] = useState<any[]>([]);
  const [chatSelectedImage, setChatSelectedImage] = useState<string | null>(null);

  const handleChatImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------------------------------------------------------
  // DYNAMIC PLAN ASSIGNMENT STATES (COACH SIDE)
  // -------------------------------------------------------------
  const [selectedTraineeId, setSelectedTraineeId] = useState<string>('');
  const [assignSuccess, setAssignSuccess] = useState<string>('');
  const [assignError, setAssignError] = useState<string>('');

  // Workout Builder
  const [workoutTitle, setWorkoutTitle] = useState<string>('Custom Workout Program');
  const [workoutDesc, setWorkoutDesc] = useState<string>('Assigned by your Coach');
  const [workoutDuration, setWorkoutDuration] = useState<number>(4);
  const [trainingSplit, setTrainingSplit] = useState<string>('Full Body');
  const [trainingType, setTrainingType] = useState<string>('Bodybuilding');
  const [daysCount, setDaysCount] = useState<number>(3);
  const [workoutDays, setWorkoutDays] = useState<any[]>([
    {
      day_number: 1,
      title: 'Day 1 - Push Workout',
      exercises: [
        { name: 'Flat Bench Press', sets: 4, reps: 10, rest_time_seconds: 90, weight: 60, notes: 'Focus on form' }
      ]
    },
    {
      day_number: 2,
      title: 'Day 2 - Pull Workout',
      exercises: [
        { name: 'Barbell Row', sets: 4, reps: 10, rest_time_seconds: 90, weight: 50, notes: 'Focus on squeeze' }
      ]
    },
    {
      day_number: 3,
      title: 'Day 3 - Legs Workout',
      exercises: [
        { name: 'Barbell Squat', sets: 4, reps: 10, rest_time_seconds: 120, weight: 80, notes: 'Focus on depth' }
      ]
    }
  ]);

  const handleDaysCountChange = (count: number) => {
    setDaysCount(count);
    setWorkoutDays(prev => {
      const copy = [...prev];
      if (copy.length < count) {
        for (let i = copy.length + 1; i <= count; i++) {
          copy.push({
            day_number: i,
            title: `Day ${i} - Training Session`,
            exercises: [
              { name: 'Exercise 1', sets: 4, reps: 10, rest_time_seconds: 60, weight: 20, notes: '' }
            ]
          });
        }
      } else if (copy.length > count) {
        copy.splice(count);
      }
      return copy;
    });
  };

  // Nutrition Builder
  const [nutritionTitle, setNutritionTitle] = useState<string>('Custom Nutrition Plan');
  const [nutritionStartDate, setNutritionStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [nutritionEndDate, setNutritionEndDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dietType, setDietType] = useState<string>('Balanced');
  const [nutritionMeals, setNutritionMeals] = useState<any[]>([
    { type: 'Breakfast', calories: 600, protein: 40, carbs: 60, fats: 15, instructions: '4 Egg whites, 100g oats' },
    { type: 'Lunch', calories: 800, protein: 50, carbs: 90, fats: 20, instructions: '200g chicken breast, 150g rice' },
    { type: 'Dinner', calories: 700, protein: 45, carbs: 80, fats: 15, instructions: '180g Salmon, sweet potato' },
    { type: 'Snack', calories: 400, protein: 25, carbs: 50, fats: 10, instructions: 'Whey protein shake, almonds' }
  ]);

  // Active workout / nutrition states for Trainee (Client) fetched from DB
  const [assignedWorkout, setAssignedWorkout] = useState<any | null>(null);
  const [assignedNutrition, setAssignedNutrition] = useState<any | null>(null);

  // Subscription countdown states
  const [activeSubscription, setActiveSubscription] = useState<any | null>(null);
  const [tenantSubscription, setTenantSubscription] = useState<any | null>(null);
  const [renewingTenant, setRenewingTenant] = useState<boolean>(false);
  const [subscribingClient, setSubscribingClient] = useState<boolean>(false);

  // Progress Tracker States
  const [weightLog, setWeightLog] = useState<any[]>([]);
  const [checkinHistory, setCheckinHistory] = useState<any[]>([]);
  const [weightInput2, setWeightInput2] = useState<string>('');
  const [checkinNotes, setCheckinNotes] = useState<string>('');
  const [checkinMood, setCheckinMood] = useState<number>(3);
  const [checkinSleep, setCheckinSleep] = useState<number>(7);
  const [checkinEnergy, setCheckinEnergy] = useState<number>(3);
  const [checkinWater, setCheckinWater] = useState<number>(2000);
  const [checkinSubmitting, setCheckinSubmitting] = useState<boolean>(false);
  const [checkinSuccess, setCheckinSuccess] = useState<string>('');

  // Today focus states
  const [todayDayIndex, setTodayDayIndex] = useState<number>(0);
  const [scannerComplianceResult, setScannerComplianceResult] = useState<any | null>(null);

  // Goals & Badges States
  const [clientGoals, setClientGoals] = useState<any[]>([]);
  const [clientBadges, setClientBadges] = useState<any[]>([]);
  const [coachClientsGoals, setCoachClientsGoals] = useState<any[]>([]);
  const [newGoalType, setNewGoalType] = useState<string>('weight');
  const [newGoalTitle, setNewGoalTitle] = useState<string>('');
  const [newGoalTarget, setNewGoalTarget] = useState<string>('');
  const [newGoalUnit, setNewGoalUnit] = useState<string>('kg');
  const [newGoalDeadline, setNewGoalDeadline] = useState<string>('');
  const [newGoalDesc, setNewGoalDesc] = useState<string>('');
  const [goalSubmitting, setGoalSubmitting] = useState<boolean>(false);
  const [goalSuccess, setGoalSuccess] = useState<string>('');

  // Coach Extensions States
  const [exerciseLibrary, setExerciseLibrary] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [templatesWorkout, setTemplatesWorkout] = useState<any[]>([]);
  const [templatesDiet, setTemplatesDiet] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any | null>(null);
  const [coachDashboardData, setCoachDashboardData] = useState<any | null>(null);
  const [subClientPlans, setSubClientPlans] = useState<Record<string, any>>({});
  
  // Subscription Form States
  const [subPackageName, setSubPackageName] = useState<string>('Silver Package');
  const [subPackageType, setSubPackageType] = useState<string>('gym');
  const [subTotalSessions, setSubTotalSessions] = useState<number>(12);
  const [subPrice, setSubPrice] = useState<number>(150);
  const [subStartDate, setSubStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [subEndDate, setSubEndDate] = useState<string>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [showSubModal, setShowSubModal] = useState<boolean>(false);
  const [selectedSubClientId, setSelectedSubClientId] = useState<string>('');

  // Save Template Form States
  const [templateNameInput, setTemplateNameInput] = useState<string>('');
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState<boolean>(false);
  const [saveTemplateType, setSaveTemplateType] = useState<'workout' | 'diet'>('workout');
  const [templateDescInput, setTemplateDescInput] = useState<string>('');
  const [showNotificationDropdown, setShowNotificationDropdown] = useState<boolean>(false);

  // API base URL pointing to the NestJS server
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';
  const tenantId = 'c0000000-0000-0000-0000-000000000001'; // Default system tenant

  // Load trainee history, coach reviews, and reports on login/tab switch
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      if (currentUser.user.role === 'client') {
        fetchMealHistory();
        fetchNutritionReport();
        fetchActiveClientPlans(currentUser.accessToken);
        fetchClientNotifications(currentUser.accessToken);
        fetchCheckinHistory(currentUser.accessToken);
        fetchClientGoals(currentUser.accessToken);
        fetchClientBadges(currentUser.accessToken);
        fetchClientPendingReceipt(currentUser.accessToken);
      } else if (currentUser.user.role === 'coach') {
        fetchCoachReviews();
        fetchCoachDashboardData(currentUser.accessToken);
        fetchCoachRevenueData(currentUser.accessToken);
        fetchTemplates(currentUser.accessToken);
        fetchExerciseLibrary(currentUser.accessToken);
        fetchClientNotifications(currentUser.accessToken);
        fetchTenantSubscriptionData(currentUser.accessToken);
        fetchCoachClientsGoals(currentUser.accessToken);
        fetchCoachPendingReceipts(currentUser.accessToken);
      } else if (currentUser.user.role === 'super_admin') {
        fetchAdminStats();
      }
    }
  }, [isLoggedIn, currentUser, traineeTab, coachTab, adminTab, nutritionReportRange]);

  // Load tenant branding, coaches, & payment settings on initial mount
  useEffect(() => {
    fetchTenantSettings();
    fetchCoachesList();
  }, []);

  // Auto pre-select client's coach when payment modal is opened
  useEffect(() => {
    if (showPaymentModal) {
      if (activeSubscription && activeSubscription.coach_id) {
        setSelectedCoachId(activeSubscription.coach_id);
      } else if (coachesList.length > 0) {
        setSelectedCoachId(coachesList[0].id);
      }
    }
  }, [showPaymentModal, activeSubscription, coachesList]);

  const fetchCheckinHistory = async (token?: string) => {
    const tok = token || currentUser?.accessToken;
    if (!tok) return;
    try {
      const res = await fetch(`${API_BASE}/checkins/history`, {
        headers: { 'Authorization': `Bearer ${tok}`, 'x-tenant-id': tenantId }
      });
      if (res.ok) {
        const data = await res.json();
        setCheckinHistory(data);
        // build weight log from checkin history
        setWeightLog(data.filter((c: any) => c.weight).map((c: any) => ({
          date: new Date(c.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          weight: parseFloat(c.weight)
        })).reverse());
      }
    } catch (e) { console.error('Error fetching checkins:', e); }
  };

  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput2 || !currentUser?.accessToken) return;
    setCheckinSubmitting(true);
    setCheckinSuccess('');
    try {
      const res = await fetch(`${API_BASE}/checkins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.accessToken}`,
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          weight: parseFloat(weightInput2),
          bodyMeasurements: { chest: 0, waist: 0, arms: 0, hips: 0, thighs: 0 },
          moodScore: checkinMood,
          sleepHours: checkinSleep,
          energyLevel: checkinEnergy,
          waterIntakeMl: checkinWater,
          dietComplianceScore: 3,
          workoutComplianceScore: 3,
          clientNotes: checkinNotes
        })
      });
      if (res.ok) {
        setCheckinSuccess('Check-in logged successfully!');
        setWeightInput2('');
        setCheckinNotes('');
        fetchCheckinHistory(currentUser.accessToken);
        fetchClientGoals(currentUser.accessToken);
        fetchClientBadges(currentUser.accessToken);
        setTimeout(() => setCheckinSuccess(''), 4000);
      }
    } catch (e) { console.error('Checkin error:', e); }
    finally { setCheckinSubmitting(false); }
  };

  const fetchClientGoals = async (token?: string) => {
    const tok = token || currentUser?.accessToken;
    if (!tok) return;
    try {
      const res = await fetch(`${API_BASE}/goals/my`, {
        headers: { 'Authorization': `Bearer ${tok}`, 'x-tenant-id': tenantId }
      });
      if (res.ok) setClientGoals(await res.json());
    } catch (e) { console.error('Goals fetch error:', e); }
  };

  const fetchClientBadges = async (token?: string) => {
    const tok = token || currentUser?.accessToken;
    if (!tok) return;
    try {
      const res = await fetch(`${API_BASE}/goals/my/badges`, {
        headers: { 'Authorization': `Bearer ${tok}`, 'x-tenant-id': tenantId }
      });
      if (res.ok) setClientBadges(await res.json());
    } catch (e) { console.error('Badges fetch error:', e); }
  };

  const fetchCoachClientsGoals = async (token?: string) => {
    const tok = token || currentUser?.accessToken;
    if (!tok) return;
    try {
      const res = await fetch(`${API_BASE}/goals/coach/clients`, {
        headers: { 'Authorization': `Bearer ${tok}`, 'x-tenant-id': tenantId }
      });
      if (res.ok) setCoachClientsGoals(await res.json());
    } catch (e) { console.error('Coach goals fetch error:', e); }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle || !newGoalTarget || !currentUser?.accessToken) return;
    setGoalSubmitting(true);
    setGoalSuccess('');
    try {
      const res = await fetch(`${API_BASE}/goals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.accessToken}`,
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          goal_type: newGoalType,
          title: newGoalTitle,
          description: newGoalDesc,
          target_value: parseFloat(newGoalTarget),
          unit: newGoalUnit,
          deadline: newGoalDeadline || undefined,
        })
      });
      if (res.ok) {
        setGoalSuccess('Goal created! 🎯');
        setNewGoalTitle(''); setNewGoalTarget(''); setNewGoalDesc(''); setNewGoalDeadline('');
        fetchClientGoals(currentUser.accessToken);
        setTimeout(() => setGoalSuccess(''), 3000);
      }
    } catch (e) { console.error('Create goal error:', e); }
    finally { setGoalSubmitting(false); }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!currentUser?.accessToken) return;
    await fetch(`${API_BASE}/goals/${goalId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentUser.accessToken}`, 'x-tenant-id': tenantId }
    });
    fetchClientGoals(currentUser.accessToken);
  };

  const fetchClientNotifications = async (token?: string) => {
    const activeToken = token || currentUser?.accessToken;
    if (!activeToken) return;
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  };

  const markNotificationRead = async (id: string) => {
    if (!currentUser?.accessToken) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/read/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.accessToken}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchExerciseLibrary = async (token?: string) => {
    const activeToken = token || currentUser?.accessToken;
    if (!activeToken) return;
    try {
      const res = await fetch(`${API_BASE}/workouts/exercises`, {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setExerciseLibrary(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTemplates = async (token?: string) => {
    const activeToken = token || currentUser?.accessToken;
    if (!activeToken) return;
    try {
      const wRes = await fetch(`${API_BASE}/templates/workout`, {
        headers: { 'Authorization': `Bearer ${activeToken}`, 'x-tenant-id': tenantId }
      });
      if (wRes.ok) {
        const data = await wRes.json();
        setTemplatesWorkout(data);
      }
      const dRes = await fetch(`${API_BASE}/templates/diet`, {
        headers: { 'Authorization': `Bearer ${activeToken}`, 'x-tenant-id': tenantId }
      });
      if (dRes.ok) {
        const data = await dRes.json();
        setTemplatesDiet(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCoachDashboardData = async (token?: string) => {
    const activeToken = token || currentUser?.accessToken;
    if (!activeToken) return;
    try {
      const res = await fetch(`${API_BASE}/subscriptions/coach/dashboard`, {
        headers: { 'Authorization': `Bearer ${activeToken}`, 'x-tenant-id': tenantId }
      });
      if (res.ok) {
        const data = await res.json();
        setCoachDashboardData(data);
        const plans: Record<string, any> = {};
        for (const sub of data.active_subscriptions) {
          plans[sub.client_id] = sub;
        }
        setSubClientPlans(plans);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCoachRevenueData = async (token?: string) => {
    const activeToken = token || currentUser?.accessToken;
    if (!activeToken) return;
    try {
      const res = await fetch(`${API_BASE}/subscriptions/coach/revenue`, {
        headers: { 'Authorization': `Bearer ${activeToken}`, 'x-tenant-id': tenantId }
      });
      if (res.ok) {
        const data = await res.json();
        setRevenueData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/subscriptions/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          clientId: selectedSubClientId,
          packageName: subPackageName,
          packageType: subPackageType,
          totalSessions: subTotalSessions,
          price: subPrice,
          startDate: subStartDate,
          endDate: subEndDate
        })
      });
      if (res.ok) {
        setShowSubModal(false);
        fetchCoachDashboardData();
        fetchCoachRevenueData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeductSession = async (clientId: string) => {
    try {
      const res = await fetch(`${API_BASE}/subscriptions/deduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({ clientId, notes: 'Completed a workout session.' })
      });
      if (res.ok) {
        fetchCoachDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveWorkoutTemplate = async (name: string, description: string) => {
    try {
      const res = await fetch(`${API_BASE}/templates/workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          name,
          description,
          trainingSplit,
          trainingType,
          daysCount: workoutDays.length,
          daysData: workoutDays
        })
      });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveDietTemplate = async (name: string, description: string) => {
    try {
      const res = await fetch(`${API_BASE}/templates/diet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          name,
          description,
          dietType,
          mealsData: nutritionMeals
        })
      });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActiveClientPlans = async (token: string) => {
    try {
      // 1. Fetch active workout program
      const workRes = await fetch(`${API_BASE}/workouts/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId
        }
      });
      if (workRes.ok) {
        const data = await workRes.json();
        setAssignedWorkout(data);
      }

      // 2. Fetch active nutrition plan
      const nutrRes = await fetch(`${API_BASE}/nutrition/plan/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId
        }
      });
      if (nutrRes.ok) {
        const data = await nutrRes.json();
        setAssignedNutrition(data);
      }
    } catch (e) {
      console.error('Error fetching trainee active plans:', e);
    }

    // 3. Fetch active subscription (countdown)
    try {
      const subRes = await fetch(`${API_BASE}/subscriptions/client/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId
        }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        setActiveSubscription(subData);
      } else {
        setActiveSubscription(null);
      }
    } catch (e) {
      console.error('Error fetching client subscription:', e);
    }
  };

  const fetchTenantSubscriptionData = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/subscriptions/tenant`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTenantSubscription(data);
      } else {
        setTenantSubscription(null);
      }
    } catch (e) {
      console.error('Error fetching tenant subscription:', e);
    }
  };

  const handleRenewTenantSub = async () => {
    if (!currentUser?.accessToken) return;
    setRenewingTenant(true);
    try {
      const res = await fetch(`${API_BASE}/subscriptions/tenant/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.accessToken}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        await fetchTenantSubscriptionData(currentUser.accessToken);
      }
    } catch (e) {
      console.error('Failed to renew tenant subscription:', e);
    } finally {
      setRenewingTenant(false);
    }
  };

  const handleUpgradeTenantSub = async (planName: string) => {
    if (!currentUser?.accessToken) return;
    setRenewingTenant(true);
    try {
      const res = await fetch(`${API_BASE}/subscriptions/tenant/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({ planName })
      });
      if (res.ok) {
        await fetchTenantSubscriptionData(currentUser.accessToken);
      }
    } catch (e) {
      console.error('Failed to upgrade tenant subscription:', e);
    } finally {
      setRenewingTenant(false);
    }
  };

  const handleClientSelfSubscribe = async (packageName: string, packageType: string, totalSessions: number, price: number) => {
    if (!currentUser?.accessToken) return;
    setSubscribingClient(true);
    try {
      const res = await fetch(`${API_BASE}/subscriptions/client/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          packageName,
          packageType,
          totalSessions,
          price
        })
      });
      if (res.ok) {
        await fetchActiveClientPlans(currentUser.accessToken);
      }
    } catch (e) {
      console.error('Failed to subscribe:', e);
    } finally {
      setSubscribingClient(false);
    }
  };

  const fetchTenantSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/tenants/resolve?host=system`);
      if (res.ok) {
        const data = await res.json();
        setInstapayHandle(data.instapay_handle || '');
        setVodafoneCashNumber(data.vodafone_cash_number || '');
      }
    } catch (e) {
      console.error('Error fetching tenant settings:', e);
    }
  };

  const fetchClientPendingReceipt = async (token?: string) => {
    const tok = token || currentUser?.accessToken;
    if (!tok) return;
    try {
      const res = await fetch(`${API_BASE}/subscriptions/client/pending-receipt`, {
        headers: { 'Authorization': `Bearer ${tok}`, 'x-tenant-id': tenantId }
      });
      if (res.ok) {
        const data = await res.json();
        setClientPendingReceipt(data);
      }
    } catch (e) {
      console.error('Error fetching pending receipt:', e);
    }
  };

  const fetchCoachPendingReceipts = async (token?: string) => {
    const tok = token || currentUser?.accessToken;
    if (!tok) return;
    setLoadingPendingReceipts(true);
    try {
      const res = await fetch(`${API_BASE}/subscriptions/coach/pending-receipts`, {
        headers: { 'Authorization': `Bearer ${tok}`, 'x-tenant-id': tenantId }
      });
      if (res.ok) {
        const data = await res.json();
        setCoachPendingReceipts(data);
      }
    } catch (e) {
      console.error('Error fetching pending receipts:', e);
    } finally {
      setLoadingPendingReceipts(false);
    }
  };

  const fetchCoachesList = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/coaches`, {
        headers: { 'x-tenant-id': tenantId }
      });
      if (res.ok) {
        const data = await res.json();
        setCoachesList(data);
        if (data.length > 0) {
          setSelectedCoachId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching coaches:', e);
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPaymentSettings(true);
    setAssignSuccess('');
    setAssignError('');
    try {
      const res = await fetch(`${API_BASE}/tenants/payment-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          instapayHandle,
          vodafoneCashNumber
        })
      });
      if (res.ok) {
        setAssignSuccess('Payment settings updated successfully!');
        fetchTenantSettings(); // Refresh
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update payment settings');
      }
    } catch (err: any) {
      setAssignError(err.message || 'An error occurred while saving.');
    } finally {
      setSavingPaymentSettings(false);
    }
  };

  const handleReceiptFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReceipt = async () => {
    if (!receiptImage || !selectedPackageForPayment) return;
    setSubmittingReceipt(true);
    setAssignSuccess('');
    setAssignError('');
    try {
      const res = await fetch(`${API_BASE}/subscriptions/client/submit-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          packageName: selectedPackageForPayment.title,
          packageType: selectedPackageForPayment.type,
          totalSessions: selectedPackageForPayment.sessions,
          price: Number(selectedPackageForPayment.price),
          paymentMethod: paymentMethodSelect,
          receiptImageUrl: receiptImage,
          coachId: selectedCoachId
        })
      });
      if (res.ok) {
        setAssignSuccess('Payment proof uploaded successfully! Awaiting coach review.');
        setShowPaymentModal(false);
        setReceiptImage(null);
        setSelectedPackageForPayment(null);
        fetchClientPendingReceipt(currentUser?.accessToken);
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to upload receipt');
      }
    } catch (err: any) {
      setAssignError(err.message || 'Error uploading payment receipt.');
    } finally {
      setSubmittingReceipt(false);
    }
  };

  const handleReviewReceipt = async (receiptId: string, status: 'approved' | 'rejected', notes?: string) => {
    setReviewingReceiptId(receiptId);
    setAssignSuccess('');
    setAssignError('');
    try {
      const res = await fetch(`${API_BASE}/subscriptions/coach/review-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          receiptId,
          status,
          notes
        })
      });
      if (res.ok) {
        setAssignSuccess(`Subscription request ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
        fetchCoachPendingReceipts(currentUser?.accessToken);
        fetchCoachDashboardData(currentUser?.accessToken); // Refresh trainee directory
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to review receipt');
      }
    } catch (err: any) {
      setAssignError(err.message || 'Error reviewing subscription request.');
    } finally {
      setReviewingReceiptId(null);
    }
  };

  const fetchMealHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/meal/history`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMealHistory(data);
      }
    } catch (e) {
      console.error('Error fetching meal logs:', e);
    }
  };

  const fetchNutritionReport = async () => {
    try {
      const res = await fetch(`${API_BASE}/nutrition/report?range=${nutritionReportRange}`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setNutritionReport(data);
      }
    } catch (e) {
      console.error('Error fetching nutrition report:', e);
    }
  };

  const fetchCoachReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/nutrition/coach/reviews`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCoachReviews(data);
      }
    } catch (e) {
      console.error('Error fetching coach reviews:', e);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/nutrition/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      }
    } catch (e) {
      console.error('Error fetching admin statistics:', e);
    }
  };

  // Load trainees list for Coach/Admin dashboards from DB
  const fetchTrainees = async (token: string, role: string, userId: string) => {
    try {
      if (role === 'super_admin') {
        setTrainees([
          { id: 't_1', name: 'Ahmed Mansour', email: 'ahmed@mail.com', weight: '84 kg', goal: 'Weight Loss', plan: '12-Week Cut', coachName: 'Coach Captain Marvel' },
          { id: 't_2', name: 'Sara Kamel', email: 'sara@mail.com', weight: '62 kg', goal: 'Muscle Gain', plan: 'Lean Bulk', coachName: 'Coach Captain Marvel' },
          { id: 't_3', name: 'Omar Rayan', email: 'omar@mail.com', weight: '95 kg', goal: 'Strength Building', plan: '5x5 Strength', coachName: 'Coach Thor Odinson' },
        ]);
      } else if (role === 'coach') {
        const res = await fetch(`${API_BASE}/subscriptions/coach/clients`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTrainees(data);
          if (data.length > 0) {
            setSelectedTraineeId(data[0].id);
          }
        }
      }
    } catch (e) {
      console.error('Error fetching trainees:', e);
    }
  };

  // Perform database login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Invalid credentials');
      }

      const data = await res.json();
      setCurrentUser(data);
      setIsLoggedIn(true);

      // Initialize chat based on role
      if (data.user.role === 'client') {
        const welcome = { sender: 'ai', text: `Welcome ${data.user.fullName}! I am your AI Coach Assistant. I know your assigned workout and nutrition plans. Ask me anything!`, time: 'Now' };
        setChatMessages([welcome]);
        setAiChatMessages([welcome]);
        fetchActiveClientPlans(data.accessToken);
      } else {
        setChatMessages([
          { sender: 'coach', text: `Welcome back Coach ${data.user.fullName}. You can chat with your linked trainees and assign plans here.`, time: 'Now' }
        ]);
      }

      fetchTrainees(data.accessToken, data.user.role, data.user.id);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Check your credentials.');
    }
  };

  // Perform database registration (Blocks Admin registrations)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          fullName: signupName,
          role: signupRole
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }

      setSignupSuccess('Account registered successfully! You can log in now.');
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setTimeout(() => {
        setAuthMode('login');
        setSignupSuccess('');
      }, 2000);
    } catch (err: any) {
      setSignupError(err.message || 'Registration failed. Try again.');
    }
  };

  // Coach links a Trainee (Client) by Email
  const handleLinkTrainee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError('');
    setLinkSuccess('');
    if (!traineeEmailInput.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/auth/link-trainee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({ traineeEmail: traineeEmailInput })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Could not link trainee');
      }

      const data = await res.json();
      setLinkSuccess(`Successfully added trainee: ${data.fullName}!`);
      setTraineeEmailInput('');
      
      fetchTrainees(currentUser.accessToken, currentUser.user.role, currentUser.user.id);
    } catch (err: any) {
      setLinkError(err.message || 'Failed to link trainee. Double-check email.');
    }
  };

  // -------------------------------------------------------------
  // AI FOOD SCANNER LOGIC (Module 1 & Module 3)
  // -------------------------------------------------------------
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerScan = async () => {
    if (!scannerImage) return;
    setIsScanning(true);
    setScanResult(null);
    setSaveSuccess('');

    try {
      const res = await fetch(`${API_BASE}/ai/scan-food`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({ imageUrl: scannerImage })
      });

      if (!res.ok) throw new Error('Failed to scan food image');
      const data = await res.json();

      // Normalize response: handle both real OpenAI format and simulation format
      let normalized = data;
      if (!data.detected_items || !Array.isArray(data.detected_items) || typeof data.detected_items[0] === 'string') {
        // Old format: convert to objects
        const items = Array.isArray(data.detected_items) ? data.detected_items : [];
        const perItem = items.length > 0 ? Math.round((data.total_calories || 450) / items.length) : 0;
        normalized = {
          detected_items: items.map((name: string) => ({
            food_name: name,
            estimated_weight: 120,
            serving_size: '1 serving',
            calories: perItem,
            protein: Math.round((data.macros?.protein_g || 40) / items.length),
            carbs: Math.round((data.macros?.carbs_g || 50) / items.length),
            fat: Math.round((data.macros?.fats_g || 8) / items.length),
          })),
          estimated_weight_g: data.serving_size_est ? parseInt(data.serving_size_est) || 350 : 350,
          average_confidence: 0.88,
          recommendation: data.recommendation || '',
        };
      }

      // Ensure total_calories and macros (protein, carbs, fat) exist at the top level
      const itemsList = normalized.detected_items || [];
      const calculatedCalories = itemsList.reduce((acc: number, item: any) => acc + (Number(item.calories) || 0), 0);
      const calculatedProtein = itemsList.reduce((acc: number, item: any) => acc + (Number(item.protein) || 0), 0);
      const calculatedCarbs = itemsList.reduce((acc: number, item: any) => acc + (Number(item.carbs) || 0), 0);
      const calculatedFat = itemsList.reduce((acc: number, item: any) => acc + (Number(item.fat) || 0), 0);

      normalized.total_calories = normalized.total_calories || calculatedCalories;
      normalized.macros = {
        calories: normalized.total_calories,
        protein: normalized.macros?.protein || normalized.macros?.protein_g || calculatedProtein,
        carbs: normalized.macros?.carbs || normalized.macros?.carbs_g || calculatedCarbs,
        fat: normalized.macros?.fat || normalized.macros?.fats_g || calculatedFat,
      };

      setScanResult(normalized);
    } catch (err) {
      console.error('Error scanning food:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!scanResult) return;
    try {
      const res = await fetch(`${API_BASE}/meal/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          mealType: scanMealType,
          mealImage: scannerImage || 'https://trainify.app/assets/default_meal.jpg',
          foodItems: scanResult.detected_items,
          macros: {
            calories: scanResult.total_calories,
            protein: scanResult.macros.protein,
            carbs: scanResult.macros.carbs,
            fat: scanResult.macros.fat
          }
        })
      });

      if (res.ok) {
        setSaveSuccess('Meal saved to Daily Nutrition Log successfully!');
        setScanResult(null);
        setScannerImage(null);
        setScannerFile(null);
        fetchMealHistory();
        fetchNutritionReport();
      }
    } catch (err) {
      console.error('Error saving meal:', err);
    }
  };

  // -------------------------------------------------------------
  // MEAL COMPLIANCE & SUGGESTIONS LOGIC (Module 5 & Module 6)
  // -------------------------------------------------------------
  const handleGetSuggestions = async (mealId: string) => {
    setLoadingSuggestions(prev => ({ ...prev, [mealId]: true }));
    try {
      const res = await fetch(`${API_BASE}/ai/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({ mealId })
      });

      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(prev => ({ ...prev, [mealId]: data }));
      }
    } catch (err) {
      console.error('Error loading AI tips:', err);
    } finally {
      setLoadingSuggestions(prev => ({ ...prev, [mealId]: false }));
    }
  };

  // -------------------------------------------------------------
  // COACH REVIEW SYSTEM LOGIC (Module 7)
  // -------------------------------------------------------------
  const handleSaveCoachReview = async (mealId: string, status: 'approved' | 'rejected') => {
    const comments = reviewComments[mealId] || '';
    try {
      const res = await fetch(`${API_BASE}/nutrition/coach/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({ mealId, status, comments })
      });

      if (res.ok) {
        fetchCoachReviews();
      }
    } catch (err) {
      console.error('Error saving coach review:', err);
    }
  };

  const filteredReviews = coachReviews.filter(rev => {
    const matchesClient = clientFilter ? rev.client_name.toLowerCase().includes(clientFilter.toLowerCase()) : true;
    const matchesCompliance = complianceFilter ? (
      complianceFilter === 'high' ? rev.compliance_score >= 80 :
      complianceFilter === 'mid' ? (rev.compliance_score >= 50 && rev.compliance_score < 80) :
      rev.compliance_score < 50
    ) : true;
    const matchesDate = dateFilter ? rev.scan_date.includes(dateFilter) : true;
    return matchesClient && matchesCompliance && matchesDate;
  });

  // -------------------------------------------------------------
  // DYNAMIC PLAN CREATION & ASSIGNMENT FLOWS (COACH SIDE)
  // -------------------------------------------------------------
  
  // Workout builders helpers
  const handleAddWorkoutDay = () => {
    setWorkoutDays(prev => [
      ...prev,
      {
        day_number: prev.length + 1,
        title: `Day ${prev.length + 1} - New Target Day`,
        exercises: [{ name: 'New Exercise', sets: 4, reps: 10, rest_time_seconds: 60, weight: 10, notes: '' }]
      }
    ]);
  };

  const handleRemoveWorkoutDay = (dayIdx: number) => {
    const updated = workoutDays.filter((_, idx) => idx !== dayIdx).map((day, idx) => ({
      ...day,
      day_number: idx + 1
    }));
    setWorkoutDays(updated);
  };

  const handleAddExerciseToDay = (dayIdx: number) => {
    setWorkoutDays(prev => {
      const copy = [...prev];
      copy[dayIdx].exercises.push({ name: 'New Exercise', sets: 4, reps: 10, rest_time_seconds: 60, weight: 10, notes: '' });
      return copy;
    });
  };

  const handleRemoveExerciseFromDay = (dayIdx: number, exIdx: number) => {
    setWorkoutDays(prev => {
      const copy = [...prev];
      copy[dayIdx].exercises = copy[dayIdx].exercises.filter((_: any, idx: number) => idx !== exIdx);
      return copy;
    });
  };

  const handleExerciseChange = (dayIdx: number, exIdx: number, field: string, value: any) => {
    setWorkoutDays(prev => {
      const copy = [...prev];
      copy[dayIdx].exercises[exIdx][field] = value;
      return copy;
    });
  };

  const handleDayTitleChange = (dayIdx: number, value: string) => {
    setWorkoutDays(prev => {
      const copy = [...prev];
      copy[dayIdx].title = value;
      return copy;
    });
  };

  const handleAssignWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError('');
    setAssignSuccess('');
    if (!selectedTraineeId) {
      setAssignError('Please link and select a trainee client first.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/workouts/program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          clientId: selectedTraineeId,
          title: workoutTitle,
          description: workoutDesc,
          durationWeeks: workoutDuration,
          days: workoutDays,
          trainingSplit: trainingSplit,
          trainingType: trainingType,
          daysCount: daysCount
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to assign program');
      }

      setAssignSuccess('Workout Program successfully assigned to client!');
    } catch (err: any) {
      setAssignError(err.message || 'An error occurred during program assignment.');
    }
  };

  // Nutrition builders helpers
  const handleMealChange = (mealIdx: number, field: string, value: any) => {
    setNutritionMeals(prev => {
      const copy = [...prev];
      copy[mealIdx][field] = value;
      return copy;
    });
  };

  const handleAssignNutrition = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError('');
    setAssignSuccess('');
    if (!selectedTraineeId) {
      setAssignError('Please link and select a trainee client first.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/nutrition/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.accessToken}`,
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({
          clientId: selectedTraineeId,
          title: nutritionTitle,
          startDate: nutritionStartDate,
          endDate: nutritionEndDate,
          meals: nutritionMeals,
          dietType: dietType
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to assign nutrition plan');
      }

      setAssignSuccess('Nutrition Plan successfully assigned to client!');
    } catch (err: any) {
      setAssignError(err.message || 'An error occurred during plan assignment.');
    }
  };

  // -------------------------------------------------------------
  // AI COACH TOOLS CALCULATORS LOGIC (Module 9)
  // -------------------------------------------------------------
  const runCalculator = () => {
    if (calcType === 'bmi') {
      const heightM = heightInput / 100;
      const bmi = weightInput / (heightM * heightM);
      let cat = 'Normal';
      if (bmi < 18.5) cat = 'Underweight';
      else if (bmi >= 25 && bmi < 30) cat = 'Overweight';
      else if (bmi >= 30) cat = 'Obese';
      setCalcResult(`BMI Score: ${bmi.toFixed(1)} (${cat})`);
    } else if (calcType === 'calorie') {
      const bmr = genderInput === 'male' 
        ? 10 * weightInput + 6.25 * heightInput - 5 * ageInput + 5
        : 10 * weightInput + 6.25 * heightInput - 5 * ageInput - 161;
      const mults: Record<string, number> = { sedentary: 1.2, moderate: 1.55, active: 1.725 };
      const tdee = bmr * (mults[activityLevel] || 1.2);
      setCalcResult(`TDEE: ${tdee.toFixed(0)} kcal/day (Maintenance Caloric Target)`);
    } else if (calcType === 'macros') {
      const prot = weightInput * 2;
      const fats = weightInput * 0.9;
      const cals = weightInput * 32;
      const carbs = (cals - (prot * 4 + fats * 9)) / 4;
      setCalcResult(`Protein: ${prot.toFixed(0)}g | Carbs: ${carbs.toFixed(0)}g | Fats: ${fats.toFixed(0)}g (Target Calorie Load: ${cals.toFixed(0)} kcal)`);
    } else if (calcType === 'water') {
      let baseMl = weightInput * 35;
      if (activityLevel === 'active') baseMl += 1000;
      else if (activityLevel === 'moderate') baseMl += 500;
      setCalcResult(`Daily Water Intake: ${(baseMl / 1000).toFixed(2)} Liters (${baseMl.toFixed(0)} ml)`);
    } else if (calcType === 'meal_gen') {
      const isCheat = preferenceInput.toLowerCase().includes('cheat') || preferenceInput.toLowerCase().includes('burger');
      const meal = isCheat 
        ? "AI Generated Cheat Meal Recommendation:\n• Bunless Beef Burger (200g) with baked sweet potato fries & sparkling water.\n• Target Macros: 510 kcal | 38g Protein | 42g Carbs | 18g Fat."
        : "AI Generated Meal Plan Option:\n• 180g Grilled Chicken Breast + 200g White Rice + 80g Green Salad.\n• Target Macros: 440 kcal | 49g Protein | 56g Carbs | 6g Fat.";
      setCalcResult(meal);
    } else if (calcType === 'plan_gen') {
      const plan = `AI Generated 7-Day Nutrition Plan Template:\n• Client Goal: ${clientGoalInput}\n• Daily Target: 2200 kcal | 160g Protein | 220g Carbs | 65g Fats\n• Meal 1: Oatmeal (80g) + 4 Egg Whites\n• Meal 2: Chicken Breast (150g) + White Rice (150g) + Greens\n• Meal 3: Whey Shake + 30g Almonds\n• Meal 4: Tilapia Fish (180g) + Baked Sweet Potato (150g) + Broccoli.`;
      setCalcResult(plan);
    } else if (calcType === 'analyzer') {
      const isFast = analyzerFoodList.toLowerCase().includes('burger') || analyzerFoodList.toLowerCase().includes('fries');
      const analysis = isFast
        ? "AI Text Analysis Results:\n• High risk of calorie surplus.\n• Total Calories: ~969 kcal\n• Macros: 31.4g Protein | 119.0g Carbs | 41.2g Fat.\n• Recommendation: Swap French Fries with baked potatoes to reduce fat content by 60%."
        : "AI Text Analysis Results:\n• Excellent healthy macro breakdown.\n• Total Calories: ~430 kcal\n• Macros: 51.5g Protein | 59.0g Carbs | 5.2g Fat.\n• Recommendation: Fully matches premium standard fitness diets.";
      setCalcResult(analysis);
    }
  };

  // -------------------------------------------------------------
  // AI COACH CHAT INTEGRATION LOGIC (Module 8)
  // -------------------------------------------------------------
  // REAL CHAT & AI COACH CHAT INTEGRATION LOGIC
  // -------------------------------------------------------------
  const fetchChatMessages = async () => {
    if (!currentUser?.accessToken) return;
    const role = currentUser.user.role;
    
    // For coach: must have selectedTraineeId
    if (role === 'coach' && !selectedTraineeId) {
      return;
    }

    try {
      const url = role === 'client' 
        ? `${API_BASE}/chat/messages` 
        : `${API_BASE}/chat/messages?recipientId=${selectedTraineeId}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${currentUser.accessToken}`,
          'x-tenant-id': tenantId
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Map backend messages to frontend format
        const formatted = data.map((msg: any) => {
          const isMe = msg.sender_id === currentUser.user.id;
          let sender = 'user';
          if (!isMe) {
            sender = role === 'client' ? 'coach' : 'client';
          }
          
          return {
            id: msg.id,
            sender,
            text: msg.message,
            imageUrl: msg.attachment_url,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        setChatMessages(formatted);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  // Poll real chat messages every 5 seconds
  useEffect(() => {
    if (!isLoggedIn || !currentUser) return;
    
    const role = currentUser.user.role;
    const shouldPoll = (role === 'coach' && selectedTraineeId) || (role === 'client' && !isAiMode);
    
    if (!shouldPoll) return;

    // Fetch immediately
    fetchChatMessages();

    // Setup polling every 5 seconds
    const interval = setInterval(() => {
      fetchChatMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoggedIn, currentUser, selectedTraineeId, isAiMode]);

  const handleToggleAiMode = (val: boolean) => {
    setIsAiMode(val);
    if (val) {
      setChatMessages(aiChatMessages);
    } else {
      setChatMessages([]);
      setTimeout(() => {
        fetchChatMessages();
      }, 50);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() && !chatSelectedImage) return;

    if (isAiMode && currentUser?.user?.role === 'client') {
      const userMsg = { 
        sender: 'user', 
        text: chatInput, 
        imageUrl: chatSelectedImage || undefined,
        time: 'Now' 
      };
      setAiChatMessages(prev => {
        const updated = [...prev, userMsg];
        setChatMessages(updated);
        return updated;
      });
      const prompt = chatInput.toLowerCase();
      setChatInput('');
      setChatSelectedImage(null);

      setTimeout(() => {
        let response = '';
        if (prompt.includes('replace chicken') || prompt.includes('fish')) {
          if (assignedNutrition) {
            response = `Your assigned meal plan contains coach-scheduled foods. 
            
Replacing with Grilled Fish:
• Try replacing 200g Grilled Chicken Breast with 180g Salmon.
• Salmon provides high-quality protein and essential Omega-3 fatty acids. Ensure you track the extra fats!`;
          } else {
            response = `No active meal plan is currently assigned to your account. Please ask your coach to define and assign a plan first, so I can analyze it for you!`;
          }
        } else if (prompt.includes('explain today') || prompt.includes('meal') || prompt.includes('explain')) {
          if (assignedNutrition) {
            response = `Today's assigned meal plan details:
• Title: ${assignedNutrition.title}
• Diet Type: ${assignedNutrition.diet_type || 'Balanced'}
• Meals included: ${assignedNutrition.meals.length} meals
• Macro targets:
  - Calories: ${assignedNutrition.calories || assignedNutrition.meals.reduce((acc: number, m: any) => acc + Number(m.calories), 0)} kcal
  - Protein: ${assignedNutrition.meals.reduce((acc: number, m: any) => acc + Number(m.protein), 0)}g
  - Carbs: ${assignedNutrition.meals.reduce((acc: number, m: any) => acc + Number(m.carbs), 0)}g
  - Fats: ${assignedNutrition.meals.reduce((acc: number, m: any) => acc + Number(m.fats), 0)}g`;
          } else {
            response = `You don't have an active meal plan assigned by your coach yet. Please ask your coach to assign a diet plan.`;
          }
        } else {
          response = `Hello! I am your AI Coach Assistant. You can ask me to "Explain today's meal" or "Can I replace chicken with fish?" and I will read your active coach-assigned plan to analyze macro alternatives.`;
        }
        setAiChatMessages(prev => {
          const updated = [...prev, { sender: 'ai', text: response, time: 'Now' }];
          setChatMessages(updated);
          return updated;
        });
      }, 1000);
    } else {
      try {
        const body: any = {
          message: chatInput
        };
        if (chatSelectedImage) {
          body.attachmentUrl = chatSelectedImage;
        }
        if (currentUser?.user?.role === 'coach') {
          if (!selectedTraineeId) {
            alert('Please select a trainee first.');
            return;
          }
          body.recipientId = selectedTraineeId;
        }

        // Optimistically update
        const tempMsg = {
          sender: 'user',
          text: chatInput,
          imageUrl: chatSelectedImage || undefined,
          time: 'Sending...'
        };
        setChatMessages(prev => [...prev, tempMsg]);
        setChatInput('');
        setChatSelectedImage(null);

        const res = await fetch(`${API_BASE}/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser?.accessToken}`,
            'x-tenant-id': tenantId
          },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to send message');
        }

        fetchChatMessages();
      } catch (err: any) {
        console.error('Error sending message:', err);
        alert(err.message || 'Error sending message');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setLoginEmail('');
    setLoginPassword('');
    setShowAuthForm(false);
  };

  return (
    <div className="min-h-screen font-sans text-zinc-100 transition-colors duration-300 relative overflow-x-hidden">
      {/* Blurred Gym Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
        <img 
          src="/bg.png" 
          alt="Trainify Gym Background" 
          className="w-full h-full object-cover filter blur-[4px] scale-105" 
        />
        <div 
          className="absolute inset-0 transition-colors duration-500" 
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(7, 7, 9, 0.75)' : 'rgba(241, 245, 249, 0.55)'
          }}
        />
      </div>
      
      {/* Page Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f11] border-b border-zinc-800/80 py-3.5 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-auto flex items-center">
            <img 
              src="/logo.png" 
              alt="Trainify Logo" 
              className="h-full w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,107,0,0.45)]" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {!isLoggedIn && !showAuthForm && (
            <button 
              onClick={() => { setShowAuthForm(true); setAuthMode('login'); }}
              className="px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider transition shadow-md shadow-orange-500/10"
            >
              Sign In
            </button>
          )}
          {!isLoggedIn && showAuthForm && (
            <button 
              onClick={() => setShowAuthForm(false)}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition"
            >
              Back to Home
            </button>
          )}
          {isLoggedIn && (
            <div className="relative">
              <button 
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)} 
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff6b00] text-black text-3xs font-black rounded-full flex items-center justify-center animate-pulse">
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </button>
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0f0f11] border border-zinc-800 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-scaleUp">
                  <div className="px-3 py-2 border-b border-zinc-850 flex justify-between items-center">
                    <span className="text-xs font-black text-white uppercase tracking-wider">Alert Center</span>
                    {notifications.filter(n => !n.is_read).length > 0 && (
                      <span className="text-3xs bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{notifications.filter(n => !n.is_read).length} New</span>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-zinc-850">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                          markNotificationRead(notif.id);
                        }}
                        className={`p-3 text-left cursor-pointer transition flex flex-col gap-1 hover:bg-zinc-900 ${!notif.is_read ? 'bg-orange-500/5' : ''}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-xs font-bold ${!notif.is_read ? 'text-[#ff6b00]' : 'text-zinc-300'}`}>{notif.title}</span>
                          <span className="text-3xs text-zinc-500 whitespace-nowrap">{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-3xs text-zinc-400 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-6 text-center text-xs text-zinc-650">No recent notifications.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {isLoggedIn && (
            <button 
              onClick={handleLogout} 
              className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* =================================================================== */}
      {/* LANDING PAGE / WELCOME PAGE (IF NOT LOGGED IN & NO AUTH SHOWN) */}
      {/* =================================================================== */}
      {!isLoggedIn && !showAuthForm && (
        <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-20 animate-fadeIn">
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto flex flex-col items-center">
            <div className="h-16 w-auto mb-3 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Trainify Logo" 
                className="h-full w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,107,0,0.55)]" 
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
              Empower Your Fitness Journey With <span className="text-[#ff6b00]">{appName}</span>
            </h1>
            <p className="text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Your journey to peak fitness starts here. Train smart, and achieve your goals with elite professional coaches.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => { setShowAuthForm(true); setAuthMode('signup'); }}
                className="px-8 py-3.5 rounded-2xl bg-[#ff6b00] text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:scale-105 hover:shadow-orange-500/30 transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Our Core Services & Features</h2>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">Discover the premium tools designed to scale results for both coaches and athletes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <Camera className="w-6 h-6 text-[#ff6b00]" />, title: 'AI Food Scanner', desc: 'Take a photo of your meal. Our AI estimates serving size, calories, and macros, and syncs them directly into your daily logs.' },
                { icon: <Dumbbell className="w-6 h-6 text-emerald-500" />, title: 'Workout Split Builder', desc: 'Create and assign fully dynamic, customizable workout programs with detailed sets, reps, splits, and exercise guidelines.' },
                { icon: <Target className="w-6 h-6 text-indigo-400" />, title: 'Milestones & Badges', desc: 'Set fitness milestones (weight loss, workout streak). Automatically unlock custom badges like "Goal Crusher" or "Consistency King".' },
                { icon: <MessageSquare className="w-6 h-6 text-pink-500" />, title: 'Coach Chat Workspace', desc: 'Direct, real-time messaging between trainees and coaches supporting direct text and image attachments of all formats.' },
                { icon: <Calendar className="w-6 h-6 text-amber-500" />, title: 'Session Tracking & Billing', desc: 'Manage trial periods and monthly subscription packages with exact session check-ins, automated alerts, and renewal logs.' },
                { icon: <Landmark className="w-6 h-6 text-sky-400" />, title: 'Secure Multi-Tenant SaaS', desc: 'Row-level security database architecture isolating coach databases, trainee records, and financial revenue charts.' },
              ].map((feat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 hover:border-zinc-700 transition duration-300 space-y-4 shadow-lg group neon-card">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 w-fit group-hover:scale-110 transition duration-300">
                    {feat.icon}
                  </div>
                  <h3 className="text-md font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial / Target Audience Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-zinc-900">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/5 to-transparent border border-zinc-800/80 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ff6b00]" />
                <span>For Coaches</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scale your digital coaching business. Maintain hundreds of trainee accounts, construct diet and workout templates, and track monthly recurring revenue (MRR) dynamically. Keep clients accountable through automated compliance analysis.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-zinc-800/80 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>For Trainees</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Stay consistent and achieve your peak shape. Scan food plates, log workout splits, check-in weekly with measurements and photos, and chat in real-time with your linked personal coach. Access your assigned plans anytime.
              </p>
            </div>
          </div>

          {/* Pricing Plans Section */}
          <div className="space-y-12 pt-12 border-t border-zinc-900 animate-fadeIn">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Flexible Pricing Plans</h2>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">Select the plan that fits your journey. Toggle between Coach platform subscription tiers and trainee coaching packages.</p>
              
              <div className="inline-flex bg-[#0f0f11] p-1 rounded-xl border border-zinc-800 gap-1 mt-4">
                <button
                  onClick={() => setPricingRole('coach')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition ${pricingRole === 'coach' ? 'bg-[#ff6b00] text-black shadow' : 'text-zinc-400 hover:text-white'}`}
                >
                  💼 Coach Plans
                </button>
                <button
                  onClick={() => setPricingRole('client')}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition ${pricingRole === 'client' ? 'bg-[#ff6b00] text-black shadow' : 'text-zinc-400 hover:text-white'}`}
                >
                  🏋️ Trainee Packages
                </button>
              </div>
            </div>

            {pricingRole === 'coach' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Starter Plan */}
                <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex flex-col justify-between space-y-6 neon-card">
                  <div className="space-y-4">
                    <span className="text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-bold">Starter</span>
                    <h3 className="text-3xl font-black text-white">$29<span className="text-xs font-normal text-zinc-500">/mo</span></h3>
                    <p className="text-xs text-zinc-400">Perfect for independent personal trainers just getting started.</p>
                    <ul className="space-y-2 text-xs text-zinc-500">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Up to 15 Active Trainees</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Workout Split Builder</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Standard Nutrition Planner</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Basic AI Food Scanner</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowAuthForm(true); setAuthMode('signup'); setSignupRole('coach'); }}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition text-xs font-black uppercase tracking-wider"
                  >
                    Start Free Trial
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="p-6 rounded-2xl bg-[#0f0f11] border-2 border-[#ff6b00] relative flex flex-col justify-between space-y-6 shadow-xl shadow-orange-500/5 neon-card">
                  <div className="absolute -top-3 right-4 bg-[#ff6b00] text-black text-3xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full">Most Popular</div>
                  <div className="space-y-4">
                    <span className="text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/10 text-[#ff6b00] font-bold">Pro Coach</span>
                    <h3 className="text-3xl font-black text-white">$79<span className="text-xs font-normal text-zinc-500">/mo</span></h3>
                    <p className="text-xs text-zinc-400">Engineered for scaling fitness clubs and elite online trainers.</p>
                    <ul className="space-y-2 text-xs text-zinc-500">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Up to 100 Active Trainees</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Workout splits + custom splits</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Unlimited AI Food Scanner</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Revenue Analytics Dashboard</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Custom Branding Colors</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowAuthForm(true); setAuthMode('signup'); setSignupRole('coach'); }}
                    className="w-full py-2.5 rounded-xl bg-[#ff6b00] text-black hover:opacity-90 transition text-xs font-black uppercase tracking-wider shadow-md shadow-orange-500/10"
                  >
                    Get Started Now
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex flex-col justify-between space-y-6 neon-card">
                  <div className="space-y-4">
                    <span className="text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-bold">Enterprise</span>
                    <h3 className="text-3xl font-black text-white">Custom</h3>
                    <p className="text-xs text-zinc-400">For fitness franchises, gyms, and sports organizations.</p>
                    <ul className="space-y-2 text-xs text-zinc-500">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Unlimited Trainees & Coaches</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Dedicated Custom Domain</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Custom Email Templates</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> 24/7 SLA & Account Manager</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowAuthForm(true); setAuthMode('signup'); setSignupRole('coach'); }}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition text-xs font-black uppercase tracking-wider"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Silver Package */}
                <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex flex-col justify-between space-y-6 neon-card">
                  <div className="space-y-4">
                    <span className="text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-bold">Silver Pack</span>
                    <h3 className="text-3xl font-black text-white">$49<span className="text-xs font-normal text-zinc-500">/mo</span></h3>
                    <p className="text-xs text-zinc-400">Ideal for clients who want structure but train independently.</p>
                    <ul className="space-y-2 text-xs text-zinc-500">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Personalized Workout Plan</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Standard Nutrition Targets</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> AI Food Scanner access</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Weekly Check-In Audits</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowAuthForm(true); setAuthMode('signup'); setSignupRole('client'); }}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition text-xs font-black uppercase tracking-wider"
                  >
                    Join Program
                  </button>
                </div>

                {/* Gold Package */}
                <div className="p-6 rounded-2xl bg-[#0f0f11] border-2 border-[#ff6b00] relative flex flex-col justify-between space-y-6 shadow-xl shadow-orange-500/5 neon-card">
                  <div className="absolute -top-3 right-4 bg-[#ff6b00] text-black text-3xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full">Most Popular</div>
                  <div className="space-y-4">
                    <span className="text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/10 text-[#ff6b00] font-bold">Gold Active</span>
                    <h3 className="text-3xl font-black text-white">$99<span className="text-xs font-normal text-zinc-500">/mo</span></h3>
                    <p className="text-xs text-zinc-400">Highly customized hybrid training with frequent reviews.</p>
                    <ul className="space-y-2 text-xs text-zinc-500">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> 12 Gym Training Sessions</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Fully Dynamic Training Splits</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Customized Macronutrient Goals</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Real-time Coach Chat access</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Custom Badges & Milestones</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowAuthForm(true); setAuthMode('signup'); setSignupRole('client'); }}
                    className="w-full py-2.5 rounded-xl bg-[#ff6b00] text-black hover:opacity-90 transition text-xs font-black uppercase tracking-wider shadow-md shadow-orange-500/10"
                  >
                    Subscribe Gold
                  </button>
                </div>

                {/* VIP Elite Package */}
                <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex flex-col justify-between space-y-6 neon-card">
                  <div className="space-y-4">
                    <span className="text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-bold">VIP Elite</span>
                    <h3 className="text-3xl font-black text-white">$199<span className="text-xs font-normal text-zinc-500">/mo</span></h3>
                    <p className="text-xs text-zinc-400">Premium 1-on-1 access and complete body optimization audits.</p>
                    <ul className="space-y-2 text-xs text-zinc-500">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Unlimited Session Deductions</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Daily Meal compliance audits</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> AI Form analysis V2 lookup</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#ff6b00]" /> Direct 24/7 Coach Priority line</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowAuthForm(true); setAuthMode('signup'); setSignupRole('client'); }}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition text-xs font-black uppercase tracking-wider"
                  >
                    Apply for VIP
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* =================================================================== */}
      {/* AUTHENTICATION SCREEN (LOGIN / SIGNUP) */}
      {/* =================================================================== */}
      {!isLoggedIn && showAuthForm && (
        <main className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-[#0f0f11] border border-zinc-800 shadow-2xl space-y-6 flex flex-col items-center">
          <div className="h-14 w-auto mb-3 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Trainify Logo" 
              className="h-full w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,107,0,0.5)]" 
            />
          </div>
          <div className="text-center space-y-2 w-full">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-xs text-zinc-500">
              {authMode === 'login' 
                ? 'Enter your credentials to access your coaching workspace.' 
                : 'Sign up as a Coach or Trainee. Admin roles are blocked.'}
            </p>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{loginError}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-2xs uppercase font-bold tracking-wide flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. coach_omar@mail.com"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-2xs uppercase font-bold tracking-wide flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> Password
                </label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-[#ff6b00] text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/10 hover:opacity-95 transition"
              >
                Sign In
              </button>
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setAuthMode('signup')}
                  className="text-xs text-zinc-400 hover:text-orange-500"
                >
                  Don't have an account? Sign Up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {signupError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{signupError}</span>
                </div>
              )}
              {signupSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{signupSuccess}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-2xs uppercase font-bold">Full Name</label>
                <input 
                  type="text" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Captain Carter"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-2xs uppercase font-bold">Email Address</label>
                <input 
                  type="email" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="e.g. carter@mail.com"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-2xs uppercase font-bold">Password</label>
                <input 
                  type="password" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-400 text-2xs uppercase font-bold">Account Role</label>
                <select 
                  value={signupRole} 
                  onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="client">Trainee (Client)</option>
                  <option value="coach">Fitness Coach</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-[#ff6b00] text-black font-black text-sm uppercase tracking-wider shadow-lg hover:opacity-95 transition"
              >
                Create Account
              </button>
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-zinc-400 hover:text-orange-500"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}
        </main>
      )}

      {/* =================================================================== */}
      {/* DASHBOARDS WRAPPER (LOGGED IN USER VIEWS) */}
      {/* =================================================================== */}
      {isLoggedIn && (
        <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
          
          {/* Welcome & Role Info banner */}
          <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-white">
                Welcome back, {currentUser?.user?.fullName}
              </h2>
              <span className="text-xs text-zinc-500 block mt-1">Logged in as {currentUser?.user?.role.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="text-xs text-zinc-400">
              <span className="font-bold text-orange-500">Tenant:</span> system.trainify.app
            </div>
          </div>

          {/* =================================================================== */}
          {/* 1. SUPER ADMIN WORKSPACE */}
          {/* =================================================================== */}
          {currentUser?.user?.role === 'super_admin' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Tab Switcher */}
              <div className="flex border-b border-zinc-800 gap-6">
                <button onClick={() => setAdminTab('system')} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition ${adminTab === 'system' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>System Core</button>
                <button onClick={() => setAdminTab('analytics')} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition ${adminTab === 'analytics' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Admin Analytics</button>
                <button onClick={() => { setAdminTab('payments'); fetchCoachPendingReceipts(currentUser?.accessToken); }} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition ${adminTab === 'payments' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Payments Review</button>
              </div>

              {adminTab === 'system' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Total Coaches</span>
                        <h3 className="text-3xl font-black mt-1 text-white">5,120</h3>
                      </div>
                      <div className="p-4 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        <Dumbbell className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Total Trainees</span>
                        <h3 className="text-3xl font-black mt-1 text-white">84,250</h3>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Active Subscriptions</span>
                        <h3 className="text-3xl font-black mt-1 text-white">78,410</h3>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">MRR Revenue</span>
                        <h3 className="text-3xl font-black mt-1 text-white">$248,390</h3>
                      </div>
                      <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        <Landmark className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                    <h4 className="font-black text-white text-md flex items-center gap-2 pb-2 border-b border-zinc-800">
                      <BarChart3 className="w-4 h-4 text-orange-500" />
                      <span>Platform-Wide Users Database</span>
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-zinc-400">
                        <thead>
                          <tr className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
                            <th className="py-2.5">Trainee Name</th>
                            <th className="py-2.5">Email</th>
                            <th className="py-2.5">Weight</th>
                            <th className="py-2.5">Goal</th>
                            <th className="py-2.5">Assigned Coach</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/40">
                          {trainees.map(t => (
                            <tr key={t.id}>
                              <td className="py-3.5 font-bold text-white">{t.name}</td>
                              <td className="py-3.5 text-xs">{t.email}</td>
                              <td className="py-3.5">{t.weight}</td>
                              <td className="py-3.5 text-zinc-300 font-semibold">{t.goal}</td>
                              <td className="py-3.5 text-orange-500 font-bold text-xs">{t.coachName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : adminTab === 'analytics' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                      <Camera className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <span className="text-xs text-zinc-400 block uppercase font-medium">Total Food Scans</span>
                      <h4 className="text-3xl font-black mt-1 text-white">{adminStats?.total_scans || 1240}</h4>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                      <Target className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <span className="text-xs text-zinc-400 block uppercase font-medium">Average Compliance Rate</span>
                      <h4 className="text-3xl font-black mt-1 text-white">{adminStats?.average_compliance || 84}%</h4>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                      <Heart className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <span className="text-xs text-zinc-400 block uppercase font-medium">Average Caloric Load</span>
                      <h4 className="text-3xl font-black mt-1 text-white">{adminStats?.average_calories || 1950} kcal</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                      <h4 className="font-bold text-white text-sm uppercase pb-2 border-b border-zinc-800">Most Common Foods Scanned</h4>
                      <div className="space-y-3">
                        {(adminStats?.most_common_foods || [
                          { name: 'Chicken Breast', count: 485 },
                          { name: 'White Rice', count: 320 },
                          { name: 'Eggs', count: 198 },
                          { name: 'Green Salad', count: 154 }
                        ]).map((food: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-zinc-300 font-medium">{food.name}</span>
                            <span className="px-2 py-0.5 bg-zinc-800 text-orange-500 font-bold rounded">{food.count} Scans</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                      <h4 className="font-bold text-white text-sm uppercase pb-2 border-b border-zinc-800">Most Active Scanners</h4>
                      <div className="space-y-3">
                        {(adminStats?.most_active_users || [
                          { full_name: 'Ahmed Mansour', scans: 36 },
                          { full_name: 'Sara Kamel', scans: 29 }
                        ]).map((user: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-zinc-300 font-medium">{user.full_name}</span>
                            <span className="text-orange-500 font-bold">{user.scans} Logged Meals</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : adminTab === 'payments' ? (
                <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                    <div>
                      <h3 className="text-lg font-black text-white">Pending Subscription Receipts</h3>
                      <span className="text-xs text-zinc-500 font-medium">Review uploaded screenshots and approve or reject subscriptions.</span>
                    </div>
                    <button 
                      onClick={() => fetchCoachPendingReceipts(currentUser?.accessToken)} 
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingPendingReceipts ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {assignSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                      {assignSuccess}
                    </div>
                  )}
                  {assignError && (
                    <div className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
                      {assignError}
                    </div>
                  )}

                  {coachPendingReceipts.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                      <CheckCircle2 className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
                      <p className="font-bold">All caught up!</p>
                      <p className="text-xs text-zinc-600">No pending subscription requests need verification.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {coachPendingReceipts.map((receipt) => (
                        <div key={receipt.id} className="p-5 rounded-xl bg-zinc-950 border border-zinc-850 flex flex-col justify-between space-y-4">
                          <div className="flex gap-4">
                            {/* Clickable Image Thumbnail */}
                            <div 
                              className="w-24 h-24 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0 relative group cursor-pointer" 
                              onClick={() => window.open(receipt.receipt_image_url, '_blank')}
                            >
                              <img src={receipt.receipt_image_url} alt="Receipt" className="w-full h-full object-cover group-hover:scale-105 transition" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <Eye className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            
                            <div className="space-y-1.5 text-xs flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-4xs font-black uppercase tracking-widest px-1.5 py-0.5 rounded font-extrabold ${receipt.client_role === 'coach' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                  {receipt.client_role === 'coach' ? 'Coach' : 'Trainee'}
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-500">{new Date(receipt.submitted_at).toLocaleDateString()}</span>
                              </div>
                              <h4 className="font-black text-white text-sm">{receipt.client_name}</h4>
                              <p className="text-zinc-400 font-semibold">{receipt.package_name} ({receipt.package_type})</p>
                              <p className="text-[#ff6b00] font-black">${receipt.price}</p>
                              <div className="text-zinc-500 text-3xs space-y-0.5">
                                <p className="flex items-center gap-1">
                                  Method: <span className="text-zinc-300 uppercase">{receipt.payment_method === 'vodafone_cash' ? 'Vodafone Cash' : 'InstaPay'}</span>
                                </p>
                                {receipt.coach_name && (
                                  <p>Coach: <span className="text-zinc-300">{receipt.coach_name} ({receipt.coach_email})</span></p>
                                )}
                                {receipt.tenant_name && (
                                  <p>Coach Tenant: <span className="text-zinc-300">{receipt.tenant_name}</span></p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 border-t border-zinc-800/40 pt-3">
                            <button
                              onClick={() => handleReviewReceipt(receipt.id, 'approved')}
                              disabled={reviewingReceiptId === receipt.id}
                              className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-black text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                              {reviewingReceiptId === receipt.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Approve'}
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Enter rejection reason (optional):');
                                handleReviewReceipt(receipt.id, 'rejected', reason || undefined);
                              }}
                              disabled={reviewingReceiptId === receipt.id}
                              className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-red-500 text-xs font-bold uppercase rounded-xl hover:bg-zinc-850 transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* =================================================================== */}
          {/* 2. COACH WORKSPACE */}
          {/* =================================================================== */}
          {currentUser?.user?.role === 'coach' && (
            <div className="space-y-8 animate-fadeIn">
              {clientPendingReceipt && clientPendingReceipt.status === 'pending' ? (
                <div className="p-8 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-6 text-center max-w-2xl mx-auto my-12 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
                  <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 text-[#ff6b00] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Platform Subscription Under Review</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    We have received your payment proof for the <strong className="text-white">{clientPendingReceipt.package_name}</strong> plan.
                    Our team is currently verifying the transfer. Access will be restored once approved by the Admin.
                  </p>

                  <div className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-xl max-w-md mx-auto text-left space-y-3">
                    <div className="flex justify-between text-xs border-b border-zinc-800/40 pb-2">
                      <span className="text-zinc-500">Selected Plan:</span>
                      <span className="text-white font-bold">{clientPendingReceipt.package_name}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-zinc-800/40 pb-2">
                      <span className="text-zinc-500">Amount:</span>
                      <span className="text-[#ff6b00] font-bold">${clientPendingReceipt.price}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-zinc-800/40 pb-2">
                      <span className="text-zinc-500">Method:</span>
                      <span className="text-orange-500 font-bold uppercase flex items-center gap-1">
                        {clientPendingReceipt.payment_method === 'vodafone_cash' ? (
                          <>
                            <Smartphone className="w-3.5 h-3.5" /> Vodafone Cash
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" /> InstaPay
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Submitted At:</span>
                      <span className="text-zinc-300 font-semibold">{new Date(clientPendingReceipt.submitted_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        fetchClientPendingReceipt(currentUser?.accessToken);
                        fetchTenantSubscriptionData(currentUser?.accessToken);
                      }}
                      className="px-6 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold hover:text-white transition flex items-center gap-2 mx-auto"
                    >
                      <RefreshCw className="w-4 h-4" /> Check Activation Status
                    </button>
                  </div>
                </div>
              ) : (!tenantSubscription || tenantSubscription.remaining_days <= 0) ? (
                <div className="p-8 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-6 text-center max-w-2xl mx-auto my-12 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
                  <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Platform Access Suspended</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Your platform subscription for <strong className="text-white">Trainify</strong> has expired or your trial period has ended. 
                    To restore access to your trainee directories, program builder, diet planners, and client tracking, please renew your subscription.
                  </p>
                  
                  {/* Status Box */}
                  <div className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-xl max-w-md mx-auto text-left space-y-2">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Status:</span>
                      <span className="text-red-400 font-bold uppercase">Expired / Unpaid</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Remaining Days:</span>
                      <span className="text-red-400 font-bold">0 Days</span>
                    </div>
                  </div>

                  {/* Pricing grid on gate */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800 text-left animate-fadeIn">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider text-center">Select platform plan to restore access</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: 'FREE', title: 'Starter Trial', price: '29', features: ['15 Clients Limit', 'Workout Builder', 'Diets Planner'] },
                        { name: 'STARTER', title: 'Pro Coach', price: '79', features: ['100 Clients Limit', 'Custom Splits', 'AI Tools'] },
                        { name: 'PRO', title: 'Business Elite', price: '149', features: ['Unlimited Clients', 'Custom Domain', 'Priority SLA'] }
                      ].map((p, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-zinc-905 border border-zinc-800 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition">
                          <div className="space-y-1">
                            <span className="text-4xs font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold">{p.title}</span>
                            <h4 className="text-lg font-black text-white mt-1">${p.price}<span className="text-4xs font-normal text-zinc-500">/mo</span></h4>
                            <ul className="space-y-1 text-4xs text-zinc-500 mt-2">
                              {p.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-0.5"><Check className="w-2.5 h-2.5 text-[#ff6b00]" /> {f}</li>
                              ))}
                            </ul>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPackageForPayment({
                                packageName: p.name,
                                packageType: 'platform',
                                totalSessions: 0,
                                price: Number(p.price)
                              });
                              setPaymentMethodSelect('instapay');
                              setReceiptImage(null);
                              setAssignError('');
                              setShowPaymentModal(true);
                            }}
                            className="w-full py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-black text-4xs font-black uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-1"
                          >
                            Subscribe
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* ── COACH DASHBOARD OVERVIEW STRIP ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex-shrink-0"><Users className="w-5 h-5" /></div>
                  <div>
                    <span className="text-2xs text-zinc-500 font-bold uppercase tracking-wider block">Active Trainees</span>
                    <span className="text-3xl font-black text-white">{trainees.length}</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex-shrink-0"><Landmark className="w-5 h-5" /></div>
                  <div>
                    <span className="text-2xs text-zinc-500 font-bold uppercase tracking-wider block">Monthly Revenue</span>
                    <span className="text-3xl font-black text-white">${revenueData?.monthly_revenue_estimate || 0}</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex-shrink-0"><Bell className="w-5 h-5" /></div>
                  <div>
                    <span className="text-2xs text-zinc-500 font-bold uppercase tracking-wider block">Expiry Alerts</span>
                    <span className="text-3xl font-black text-white">{coachDashboardData?.alerts?.length || 0}</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0"><FileText className="w-5 h-5" /></div>
                  <div>
                    <span className="text-2xs text-zinc-500 font-bold uppercase tracking-wider block">Pending Reviews</span>
                    <span className="text-3xl font-black text-white">{coachReviews.filter((r: any) => r.coach_review_status === 'pending').length}</span>
                  </div>
                </div>
              </div>

              {/* Expiry Alerts Banner */}
              {coachDashboardData?.alerts && coachDashboardData.alerts.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Subscription Alerts — {coachDashboardData.alerts.length} client(s) need attention</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {coachDashboardData.alerts.map((alert: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
                        <span className="text-xs font-bold text-white">{alert.clientName}</span>
                        <span className="text-3xs text-amber-400 font-bold">{alert.reason}</span>
                        <span className="text-3xs text-zinc-500">· Exp: {new Date(alert.endDate).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Switcher */}
              <div className="flex border-b border-zinc-800 gap-6 overflow-x-auto pb-px">
                <button onClick={() => { setCoachTab('clients'); setAssignSuccess(''); setAssignError(''); }} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${coachTab === 'clients' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Trainees Directory</button>
                <button onClick={() => { setCoachTab('workouts'); setAssignSuccess(''); setAssignError(''); }} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${coachTab === 'workouts' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Workout Builder</button>
                <button onClick={() => { setCoachTab('nutrition'); setAssignSuccess(''); setAssignError(''); }} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${coachTab === 'nutrition' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Diet Planner</button>
                <button onClick={() => { setCoachTab('reviews'); setAssignSuccess(''); setAssignError(''); }} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${coachTab === 'reviews' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Nutrition Reviews</button>
                <button onClick={() => { setCoachTab('calculators'); setAssignSuccess(''); setAssignError(''); }} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${coachTab === 'calculators' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Coach AI Tools</button>
                <button onClick={() => { setCoachTab('revenue'); setAssignSuccess(''); setAssignError(''); }} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${coachTab === 'revenue' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Revenue Analytics</button>
              </div>

              {/* Status notifications for Coach assignments */}
              {assignSuccess && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> <span>{assignSuccess}</span>
                </div>
              )}
              {assignError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> <span>{assignError}</span>
                </div>
              )}

              {/* Trainees list sub-tab */}
              {coachTab === 'clients' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                    <h4 className="font-black text-white text-md flex items-center gap-2 pb-2 border-b border-zinc-800">
                      <Plus className="w-4 h-4 text-orange-500" />
                      <span>Link Trainee to Account</span>
                    </h4>
                    <p className="text-xs text-zinc-500">Search and add a registered trainee by their email address to manage their plans.</p>
                    
                    <form onSubmit={handleLinkTrainee} className="space-y-4">
                      {linkError && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{linkError}</div>
                      )}
                      {linkSuccess && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">{linkSuccess}</div>
                      )}
                      <div className="space-y-1.5">
                        <label className="text-zinc-400 text-2xs uppercase font-bold">Trainee Email</label>
                        <input 
                          type="email" 
                          value={traineeEmailInput}
                          onChange={(e) => setTraineeEmailInput(e.target.value)}
                          placeholder="e.g. trainee_ali@mail.com"
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full py-2.5 rounded-lg bg-orange-500 text-black font-bold text-xs uppercase"
                      >
                        Add Trainee
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                    <h4 className="font-black text-white text-md flex items-center gap-2 pb-2 border-b border-zinc-800">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>My Assigned Trainees ({trainees.length})</span>
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-zinc-400">
                        <thead>
                          <tr className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
                            <th className="py-2.5">Name</th>
                            <th className="py-2.5">Email</th>
                            <th className="py-2.5">Active Package</th>
                            <th className="py-2.5">Days Left</th>
                            <th className="py-2.5">Fitness Goal</th>
                            <th className="py-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/40">
                          {trainees.map(t => {
                            const sub = subClientPlans[t.id];
                            const remainingDays = sub?.end_date
                              ? Math.max(0, Math.ceil((new Date(sub.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                              : null;
                            return (
                            <tr key={t.id}>
                              <td className="py-3.5 font-bold text-white">{t.name}</td>
                              <td className="py-3.5 text-xs">{t.email}</td>
                              <td className="py-3.5">
                                {(() => {
                                  const pendingReceipt = coachPendingReceipts.find(r => r.client_id === t.id);
                                  if (pendingReceipt) {
                                    return (
                                      <div className="text-2xs space-y-1">
                                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-3xs border border-amber-500/20 font-black uppercase tracking-wider animate-pulse inline-flex items-center gap-1">
                                          <Clock className="w-2.5 h-2.5" /> Pending Admin Approval
                                        </span>
                                        <div>
                                          <button 
                                            type="button" 
                                            onClick={() => window.open(pendingReceipt.receipt_image_url, '_blank')}
                                            className="text-3xs text-[#ff6b00] hover:text-orange-400 underline font-bold"
                                          >
                                            View Sent Receipt
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  }
                                  if (!sub) return <span className="text-zinc-600 text-2xs">No active plan</span>;
                                  const isGym = sub.package_type === 'gym' || sub.package_type === 'hybrid';
                                  return (
                                    <div className="text-2xs space-y-0.5">
                                      <div className="font-bold text-white">
                                        <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-500 rounded text-3xs border border-orange-500/20 font-black uppercase tracking-wider">{sub.package_name}</span>
                                      </div>
                                      {isGym && (
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-zinc-400 text-3xs font-bold">Sess: {sub.remaining_sessions}/{sub.total_sessions}</span>
                                          <button 
                                            onClick={() => handleDeductSession(t.id)} 
                                            className="px-1.5 py-0.2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black rounded text-3xs font-bold transition"
                                          >
                                            -1
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                              </td>
                              {/* ── Countdown Days Badge ── */}
                              <td className="py-3.5">
                                {remainingDays !== null ? (
                                  <div className="flex flex-col items-start gap-1">
                                    <span className={`text-sm font-black ${
                                      remainingDays <= 5 ? 'text-red-400' :
                                      remainingDays <= 10 ? 'text-amber-400' : 'text-emerald-400'
                                    }`}>{remainingDays}d</span>
                                    <div className="w-16 bg-zinc-800 rounded-full h-1.5">
                                      <div
                                        className="h-1.5 rounded-full transition-all"
                                        style={{
                                          width: `${Math.min(100, Math.round((remainingDays / 30) * 100))}%`,
                                          background: remainingDays <= 5 ? '#ef4444' : remainingDays <= 10 ? '#f59e0b' : '#22c55e'
                                        }}
                                      />
                                    </div>
                                    <span className="text-3xs text-zinc-600">Exp: {new Date(sub.end_date).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</span>
                                  </div>
                                ) : (
                                  <span className="text-zinc-600 text-2xs">—</span>
                                )}
                              </td>
                              <td className="py-3.5 text-zinc-300 font-semibold">{t.goal}</td>
                              <td className="py-3.5 text-right space-x-2">
                                <button 
                                  onClick={() => { setSelectedTraineeId(t.id); setCoachTab('workouts'); }}
                                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-orange-500 hover:text-black text-xs text-orange-500 font-bold border border-zinc-700/60 transition"
                                >
                                  Build Plan
                                </button>
                                <button 
                                  onClick={() => { setSelectedSubClientId(t.id); setShowSubModal(true); }}
                                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-orange-500 hover:text-black text-xs text-zinc-400 hover:text-white font-bold border border-zinc-800 transition"
                                >
                                  Manage Sub
                                </button>
                              </td>
                            </tr>
                          );
                          })}
                          {trainees.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-6 text-center text-xs text-zinc-600">No trainees linked to your account. Use the Link tool.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* ── Subscriptions Expiry Calendar-style list ── */}
                    {trainees.length > 0 && (
                      <div className="pt-4 border-t border-zinc-800">
                        <h5 className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          Upcoming Subscription Expirations
                        </h5>
                        <div className="space-y-2">
                          {trainees
                            .filter(t => subClientPlans[t.id]?.end_date)
                            .sort((a, b) => new Date(subClientPlans[a.id].end_date).getTime() - new Date(subClientPlans[b.id].end_date).getTime())
                            .slice(0, 5)
                            .map(t => {
                              const sub = subClientPlans[t.id];
                              const days = Math.max(0, Math.ceil((new Date(sub.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                              return (
                                <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                      days <= 5 ? 'bg-red-400' : days <= 10 ? 'bg-amber-400' : 'bg-emerald-400'
                                    }`} />
                                    <span className="text-xs font-bold text-white">{t.name}</span>
                                    <span className="text-3xs text-zinc-500">{sub.package_name}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-xs font-black ${
                                      days <= 5 ? 'text-red-400' : days <= 10 ? 'text-amber-400' : 'text-emerald-400'
                                    }`}>{days} days</span>
                                    <span className="text-3xs text-zinc-500 block">{new Date(sub.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                  </div>
                                </div>
                              );
                            })}
                          {trainees.filter(t => subClientPlans[t.id]?.end_date).length === 0 && (
                            <p className="text-xs text-zinc-600 text-center py-3">No active subscriptions to display.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trainees Goals & Milestones Progress */}
                <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                  <h4 className="font-black text-white text-md flex items-center gap-2 pb-2 border-b border-zinc-800">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span>Trainees Goals & Milestones Progress</span>
                    <span className="ml-auto text-xs text-zinc-400 font-normal">{coachClientsGoals.length} total goals</span>
                  </h4>
                  {coachClientsGoals.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-6">Your trainees haven't set any fitness goals yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {coachClientsGoals.map((goal: any) => {
                        const percent = goal.target_value > 0 ? Math.min(100, Math.round((Number(goal.current_value) / Number(goal.target_value)) * 100)) : 0;
                        return (
                          <div key={goal.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/40 space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-3xs text-[#ff6b00] font-black uppercase tracking-widest block">{goal.client_name}</span>
                                <strong className="text-xs text-white block mt-0.5">{goal.title}</strong>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-4xs font-bold uppercase tracking-wider ${
                                goal.status === 'achieved' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20 shadow-[0_0_10px_rgba(255,107,0,0.15)] animate-pulse' : 'bg-zinc-850 text-zinc-400 border border-zinc-800'
                              }`}>
                                {goal.status}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-4xs text-zinc-500 font-bold uppercase">
                                <span>Progress</span>
                                <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                              </div>
                              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-[#ff6b00] to-orange-400 transition-all" 
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-4xs text-zinc-500">
                              <span>Type: {goal.goal_type?.toUpperCase()}</span>
                              {goal.deadline && (
                                <span>Deadline: {new Date(goal.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

              {/* DYNAMIC WORKOUT BUILDER TAB */}
              {coachTab === 'workouts' && (
                <form onSubmit={handleAssignWorkout} className="space-y-6 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                    <div>
                      <h4 className="text-md font-black text-white">Workout Planner & Program Assigner</h4>
                      <p className="text-xs text-zinc-500">Configure program name, number of days, exercises, sets, reps, and weights.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-400 font-bold">Select Client:</span>
                      <select 
                        value={selectedTraineeId} 
                        onChange={(e) => setSelectedTraineeId(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded p-2 text-white outline-none cursor-pointer"
                      >
                        {trainees.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Apply Workout Template</label>
                      <select 
                        onChange={(e) => {
                          const t = templatesWorkout.find(tpl => tpl.id === e.target.value);
                          if (t) {
                            setWorkoutTitle(t.name);
                            setWorkoutDesc(t.description || 'Assigned via template');
                            setTrainingSplit(t.training_split || 'Full Body');
                            setTrainingType(t.training_type || 'Bodybuilding');
                            setDaysCount(t.days_count || t.days_data.length);
                            setWorkoutDays(t.days_data);
                          }
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-orange-500 font-bold outline-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>-- Select Workout Template --</option>
                        {templatesWorkout.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.training_split || 'Full Body'})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Program Title</label>
                      <input type="text" value={workoutTitle} onChange={(e) => setWorkoutTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white" required />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Description / Purpose</label>
                      <input type="text" value={workoutDesc} onChange={(e) => setWorkoutDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white" />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Duration (Weeks)</label>
                      <input type="number" value={workoutDuration} onChange={(e) => setWorkoutDuration(parseInt(e.target.value) || 4)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Workout System / Split</label>
                      <select 
                        value={trainingSplit} 
                        onChange={(e) => setTrainingSplit(e.target.value)} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white cursor-pointer outline-none focus:border-orange-500"
                      >
                        <option value="Full Body">Full Body</option>
                        <option value="Push Pull Legs (PPL)">Push Pull Legs (PPL)</option>
                        <option value="Bro Split">Bro Split</option>
                        <option value="Upper Lower">Upper Lower</option>
                        <option value="Arnold Split">Arnold Split</option>
                        <option value="Custom">Custom System</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Training Type</label>
                      <select 
                        value={trainingType} 
                        onChange={(e) => setTrainingType(e.target.value)} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white cursor-pointer outline-none focus:border-orange-500"
                      >
                        <option value="Bodybuilding">Bodybuilding</option>
                        <option value="Powerlifting">Powerlifting</option>
                        <option value="CrossFit">CrossFit</option>
                        <option value="Cardio">Cardio / Endurance</option>
                        <option value="Calisthenics">Calisthenics</option>
                        <option value="HIIT">HIIT / Functional</option>
                        <option value="Custom">Custom Type</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Weekly Frequency</label>
                      <select 
                        value={daysCount} 
                        onChange={(e) => handleDaysCountChange(parseInt(e.target.value))} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[#ff6b00] font-black cursor-pointer outline-none focus:border-orange-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                          <option key={num} value={num}>{num} Day{num > 1 ? 's' : ''} per Week</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Workout Days builder */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800/80">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-bold text-white uppercase tracking-wider">Exercises & Days Configuration</h5>
                      <button 
                        type="button" 
                        onClick={handleAddWorkoutDay}
                        className="px-3 py-1 bg-zinc-800 hover:bg-orange-500 hover:text-black font-bold text-xs text-orange-500 rounded border border-zinc-700/60 transition"
                      >
                        + Add Training Day
                      </button>
                    </div>

                    <div className="space-y-6">
                      {workoutDays.map((day, dayIdx) => (
                        <div key={dayIdx} className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-zinc-800/40">
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-[#ff6b00] text-sm">Day {day.day_number}</span>
                              <input 
                                type="text" 
                                value={day.title} 
                                onChange={(e) => handleDayTitleChange(dayIdx, e.target.value)}
                                className="bg-transparent text-white font-bold outline-none border-b border-zinc-800 focus:border-orange-500 text-sm py-0.5" 
                              />
                            </div>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveWorkoutDay(dayIdx)}
                              className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1 font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove Day
                            </button>
                          </div>

                          {/* Exercise lists inside the day */}
                          <div className="space-y-3">
                            {day.exercises.map((ex: any, exIdx: number) => (
                              <div key={exIdx} className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs items-end bg-zinc-900 p-3.5 rounded-xl border border-zinc-800/40">
                                <div className="space-y-1 md:col-span-2">
                                  <label className="text-zinc-500 text-3xs uppercase font-bold">Exercise Name</label>
                                  <input 
                                    type="text" 
                                    list="exercises-list"
                                    value={ex.name} 
                                    onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'name', e.target.value)} 
                                    className="w-full bg-zinc-950 border border-zinc-850 p-2 rounded text-white outline-none focus:border-orange-500" 
                                    required 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-zinc-500 text-3xs uppercase font-bold">Sets</label>
                                  <input type="number" value={ex.sets} onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'sets', parseInt(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-850 p-2 rounded text-white" required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-zinc-500 text-3xs uppercase font-bold">Reps</label>
                                  <input type="number" value={ex.reps} onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'reps', parseInt(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-850 p-2 rounded text-white" required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-zinc-500 text-3xs uppercase font-bold">Weight Target (kg)</label>
                                  <input type="number" value={ex.weight} onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'weight', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-850 p-2 rounded text-white" />
                                </div>
                                <div className="flex gap-2 items-center justify-end">
                                  <div className="space-y-1 flex-1">
                                    <label className="text-zinc-500 text-3xs uppercase font-bold">Rest (Sec)</label>
                                    <input type="number" value={ex.rest_time_seconds} onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'rest_time_seconds', parseInt(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-850 p-2 rounded text-white" />
                                  </div>
                                  <button 
                                    type="button" 
                                    onClick={() => handleRemoveExerciseFromDay(dayIdx, exIdx)}
                                    className="text-red-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 border border-transparent hover:border-red-500/10 mt-4"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button 
                              type="button" 
                              onClick={() => handleAddExerciseToDay(dayIdx)}
                              className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-dashed border-zinc-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" /> Add Exercise
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        setSaveTemplateType('workout');
                        setShowSaveTemplateModal(true);
                        setTemplateNameInput(workoutTitle);
                      }}
                      className="w-1/2 py-3 bg-zinc-800 hover:bg-zinc-750 text-orange-500 font-black uppercase text-xs tracking-wider rounded-xl border border-zinc-700/60 transition"
                    >
                      Save as Reusable Template
                    </button>
                    <button 
                      type="submit" 
                      className="w-1/2 py-3 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-wider rounded-xl shadow-lg transition"
                    >
                      Assign Workout Plan to Trainee
                    </button>
                  </div>
                </form>
              )}

              {/* DYNAMIC DIET PLANNER TAB */}
              {coachTab === 'nutrition' && (
                <form onSubmit={handleAssignNutrition} className="space-y-6 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                    <div>
                      <h4 className="text-md font-black text-white">Diet Planner & Meal Plan Assigner</h4>
                      <p className="text-xs text-zinc-500">Configure client caloric caps, macro targets, and instructions for each meal type.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-400 font-bold">Select Client:</span>
                      <select 
                        value={selectedTraineeId} 
                        onChange={(e) => setSelectedTraineeId(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded p-2 text-white cursor-pointer"
                      >
                        {trainees.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Apply Diet Template</label>
                      <select 
                        onChange={(e) => {
                          const t = templatesDiet.find(tpl => tpl.id === e.target.value);
                          if (t) {
                            setNutritionTitle(t.name);
                            setDietType(t.diet_type || 'Balanced');
                            setNutritionMeals(t.meals_data);
                          }
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-orange-500 font-bold outline-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>-- Select Diet Template --</option>
                        {templatesDiet.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.diet_type || 'Balanced'})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Meal Plan Title</label>
                      <input type="text" value={nutritionTitle} onChange={(e) => setNutritionTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none focus:border-orange-500" required />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Diet System / Type</label>
                      <select 
                        value={dietType} 
                        onChange={(e) => setDietType(e.target.value)} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white cursor-pointer outline-none focus:border-orange-500"
                      >
                        <option value="Balanced">Balanced Diet</option>
                        <option value="Ketogenic (Keto)">Ketogenic (Keto)</option>
                        <option value="Low Carb">Low Carb</option>
                        <option value="High Protein">High Protein</option>
                        <option value="Intermittent Fasting">Intermittent Fasting</option>
                        <option value="Carb Cycling">Carb Cycling</option>
                        <option value="Custom">Custom Diet System</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">Start Date</label>
                      <input type="date" value={nutritionStartDate} onChange={(e) => setNutritionStartDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none focus:border-orange-500" required />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="text-zinc-400 uppercase font-bold">End Date</label>
                      <input type="date" value={nutritionEndDate} onChange={(e) => setNutritionEndDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white outline-none focus:border-orange-500" required />
                    </div>
                  </div>

                  {/* Meals config */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800/80 text-xs">
                    <h5 className="text-sm font-bold text-white uppercase tracking-wider">Meal Schedule & Macro caps</h5>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {nutritionMeals.map((meal, idx) => (
                        <div key={idx} className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                          <strong className="text-sm text-[#ff6b00] uppercase tracking-wider block border-b border-zinc-800/40 pb-1.5">{meal.type}</strong>
                          
                          <div className="grid grid-cols-4 gap-2 text-2xs">
                            <div className="space-y-1">
                              <label className="text-zinc-500 font-medium">Calories (kcal)</label>
                              <input type="number" value={meal.calories} onChange={(e) => handleMealChange(idx, 'calories', parseInt(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-850 p-1.5 rounded text-white outline-none" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-zinc-500 font-medium">Protein (g)</label>
                              <input type="number" value={meal.protein} onChange={(e) => handleMealChange(idx, 'protein', parseInt(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-850 p-1.5 rounded text-white outline-none" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-zinc-500 font-medium">Carbs (g)</label>
                              <input type="number" value={meal.carbs} onChange={(e) => handleMealChange(idx, 'carbs', parseInt(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-850 p-1.5 rounded text-white outline-none" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-zinc-500 font-medium">Fats (g)</label>
                              <input type="number" value={meal.fats} onChange={(e) => handleMealChange(idx, 'fats', parseInt(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-850 p-1.5 rounded text-white outline-none" required />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-zinc-400 text-2xs uppercase font-bold">Assigned Foods / Instructions</label>
                            <textarea 
                              placeholder="e.g. 200g Grilled Chicken Breast, 150g Rice..." 
                              value={meal.instructions}
                              onChange={(e) => handleMealChange(idx, 'instructions', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-850 p-2.5 rounded-xl text-xs text-white h-16 resize-none focus:border-orange-500 outline-none"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        setSaveTemplateType('diet');
                        setShowSaveTemplateModal(true);
                        setTemplateNameInput(nutritionTitle);
                      }}
                      className="w-1/2 py-3 bg-zinc-800 hover:bg-zinc-750 text-orange-500 font-black uppercase text-xs tracking-wider rounded-xl border border-zinc-700/60 transition"
                    >
                      Save as Reusable Template
                    </button>
                    <button 
                      type="submit" 
                      className="w-1/2 py-3 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-wider rounded-xl shadow-lg transition"
                    >
                      Assign Nutrition Plan to Trainee
                    </button>
                  </div>
                </form>
              )}

              {coachTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-zinc-400 uppercase tracking-wider block mb-1 font-semibold">Filter by Client</label>
                      <input 
                        type="text" 
                        value={clientFilter} 
                        onChange={(e) => setClientFilter(e.target.value)} 
                        placeholder="Client Name..." 
                        className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase tracking-wider block mb-1 font-semibold">Compliance Score</label>
                      <select 
                        value={complianceFilter} 
                        onChange={(e) => setComplianceFilter(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-white cursor-pointer"
                      >
                        <option value="">All Scores</option>
                        <option value="high">High Match (&gt;= 80%)</option>
                        <option value="mid">Medium Match (50% - 79%)</option>
                        <option value="low">Low Match (&lt; 50%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-400 uppercase tracking-wider block mb-1 font-semibold">Filter by Date</label>
                      <input 
                        type="date" 
                        value={dateFilter} 
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredReviews.map((rev) => (
                      <div key={rev.id} className="p-6 bg-zinc-900 border border-zinc-800/80 rounded-2xl flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/4">
                          {rev.meal_image ? (
                            <img src={rev.meal_image} alt="Meal Upload" className="w-full h-44 object-cover rounded-xl border border-zinc-800" />
                          ) : (
                            <div className="w-full h-44 bg-zinc-800 flex items-center justify-center text-zinc-500 rounded-xl">No Image Provided</div>
                          )}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-md font-black text-white">{rev.client_name}</h4>
                              <span className="text-xs text-orange-500 font-bold uppercase">{rev.meal_type} Log • {rev.scan_date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded text-xs font-black border ${
                                rev.compliance_score >= 80 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                rev.compliance_score >= 50 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                'bg-red-500/10 text-red-500 border-red-500/20'
                              }`}>
                                {rev.compliance_score}% Match
                              </span>
                              <span className={`px-2 py-0.5 rounded text-3xs uppercase font-bold ${
                                rev.status === 'approved' ? 'bg-emerald-500 text-black' :
                                rev.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {rev.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 text-center p-3 bg-zinc-950 rounded-xl border border-zinc-900 text-2xs">
                            <div>
                              <span className="block text-zinc-500">Calories</span>
                              <strong className="text-white">{Math.round(rev.calories)} kcal</strong>
                            </div>
                            <div>
                              <span className="block text-zinc-500">Protein</span>
                              <strong className="text-emerald-500">{Math.round(rev.protein)}g</strong>
                            </div>
                            <div>
                              <span className="block text-zinc-500">Carbs</span>
                              <strong className="text-indigo-400">{Math.round(rev.carbs)}g</strong>
                            </div>
                            <div>
                              <span className="block text-zinc-500">Fats</span>
                              <strong className="text-orange-400">{Math.round(rev.fat)}g</strong>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-zinc-400 text-2xs uppercase font-bold">Coach Evaluation Feedback</label>
                            <textarea 
                              placeholder="Add feedback notes for client..." 
                              value={reviewComments[rev.meal_id] || rev.comments || ''} 
                              onChange={(e) => setReviewComments(prev => ({ ...prev, [rev.meal_id]: e.target.value }))}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 h-20 resize-none"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSaveCoachReview(rev.meal_id, 'approved')} 
                              className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-lg flex items-center gap-1 hover:opacity-90 transition"
                            >
                              <Check className="w-4 h-4" /> Approve Meal
                            </button>
                            <button 
                              onClick={() => handleSaveCoachReview(rev.meal_id, 'rejected')} 
                              className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-red-500/20 transition"
                            >
                              <X className="w-4 h-4" /> Reject Meal
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredReviews.length === 0 && (
                      <div className="p-8 text-center text-xs text-zinc-600 bg-zinc-900 rounded-xl">No logged client meals match current filters.</div>
                    )}
                  </div>
                </div>
              )}

              {coachTab === 'calculators' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                    <h3 className="text-md font-black text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                      <Calculator className="w-5 h-5 text-orange-500" />
                      <span>7 AI Coach Tools</span>
                    </h3>

                    {/* Toggles */}
                    <div className="grid grid-cols-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-2xs font-bold text-center gap-1">
                      <button onClick={() => { setCalcType('bmi'); setCalcResult(null); }} className={`py-1.5 rounded-lg ${calcType === 'bmi' ? 'bg-[#ff6b00] text-black' : 'text-zinc-400 hover:text-white'}`}>1. BMI</button>
                      <button onClick={() => { setCalcType('calorie'); setCalcResult(null); }} className={`py-1.5 rounded-lg ${calcType === 'calorie' ? 'bg-[#ff6b00] text-black' : 'text-zinc-400 hover:text-white'}`}>2. Calories</button>
                      <button onClick={() => { setCalcType('water'); setCalcResult(null); }} className={`py-1.5 rounded-lg ${calcType === 'water' ? 'bg-[#ff6b00] text-black' : 'text-zinc-400 hover:text-white'}`}>3. Water</button>
                      <button onClick={() => { setCalcType('macros'); setCalcResult(null); }} className={`py-1.5 rounded-lg ${calcType === 'macros' ? 'bg-[#ff6b00] text-black' : 'text-zinc-400 hover:text-white'}`}>4. Macros</button>
                      <button onClick={() => { setCalcType('meal_gen'); setCalcResult(null); }} className={`py-1.5 rounded-lg ${calcType === 'meal_gen' ? 'bg-[#ff6b00] text-black' : 'text-zinc-400 hover:text-white'}`}>5. Meal Gen</button>
                      <button onClick={() => { setCalcType('plan_gen'); setCalcResult(null); }} className={`py-1.5 rounded-lg ${calcType === 'plan_gen' ? 'bg-[#ff6b00] text-black' : 'text-zinc-400 hover:text-white'}`}>6. Plan Gen</button>
                      <button onClick={() => { setCalcType('analyzer'); setCalcResult(null); }} className={`py-1.5 rounded-lg col-span-2 ${calcType === 'analyzer' ? 'bg-[#ff6b00] text-black' : 'text-zinc-400 hover:text-white'}`}>7. AI Food Analyzer</button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3.5 text-xs">
                      {calcType !== 'meal_gen' && calcType !== 'plan_gen' && calcType !== 'analyzer' && (
                        <>
                          <div className="flex gap-3">
                            <div className="flex-1 space-y-1.5">
                              <label className="text-zinc-400 text-2xs uppercase font-medium">Weight (kg)</label>
                              <input type="number" value={weightInput} onChange={(e) => setWeightInput(parseFloat(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-orange-500" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <label className="text-zinc-400 text-2xs uppercase font-medium">Height (cm)</label>
                              <input type="number" value={heightInput} onChange={(e) => setHeightInput(parseFloat(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-orange-500" />
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-1 space-y-1.5">
                              <label className="text-zinc-400 text-2xs uppercase font-medium">Age</label>
                              <input type="number" value={ageInput} onChange={(e) => setAgeInput(parseInt(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-orange-500" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <label className="text-zinc-400 text-2xs uppercase font-medium">Gender</label>
                              <select value={genderInput} onChange={(e) => setGenderInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-orange-500">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-zinc-400 text-2xs uppercase font-medium">Activity Level</label>
                            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-orange-500">
                              <option value="sedentary">Sedentary</option>
                              <option value="moderate">Moderate Exercise</option>
                              <option value="active">High Active Athlete</option>
                            </select>
                          </div>
                        </>
                      )}

                      {calcType === 'meal_gen' && (
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-medium font-bold">Preferences (e.g. Vegan, Low Carb)</label>
                          <input type="text" value={preferenceInput} onChange={(e) => setPreferenceInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-orange-500" />
                        </div>
                      )}

                      {calcType === 'plan_gen' && (
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-medium font-bold">Trainee Fitness Goal</label>
                          <input type="text" value={clientGoalInput} onChange={(e) => setClientGoalInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-orange-500" />
                        </div>
                      )}

                      {calcType === 'analyzer' && (
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-medium font-bold">Foods Text List</label>
                          <textarea value={analyzerFoodList} onChange={(e) => setAnalyzerFoodList(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-orange-500 h-24" />
                        </div>
                      )}

                      <button 
                        onClick={runCalculator}
                        className="w-full py-2.5 rounded-xl bg-orange-500 text-black font-black text-xs tracking-wider uppercase shadow-md hover:opacity-90 transition"
                      >
                        Run AI Process
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                    <h4 className="font-bold text-white text-sm uppercase pb-2 border-b border-zinc-800">Process Output Result</h4>
                    {calcResult ? (
                      <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3 whitespace-pre-line text-sm text-zinc-300 font-mono">
                        {calcResult}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-zinc-600 bg-zinc-900/40 rounded-xl">Enter parameters and run the process to display AI outputs.</div>
                    )}
                  </div>
                </div>
              )}

              {coachTab === 'revenue' && (
                <div className="space-y-8 animate-fadeIn">
                  {/* ── Coach Platform Subscription Card ── */}
                  {tenantSubscription ? (
                    <div className="relative overflow-hidden rounded-2xl border p-5"
                      style={{
                        background: 'linear-gradient(135deg, #0f0f11 50%, #0d1a0d)',
                        borderColor: tenantSubscription.remaining_days <= 5 ? '#ef4444' :
                                     tenantSubscription.remaining_days <= 10 ? '#f59e0b' : '#22c55e'
                      }}>
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
                        style={{ background: tenantSubscription.remaining_days <= 5 ? '#ef4444' : '#22c55e' }} />
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span className="text-3xs font-black uppercase tracking-widest text-zinc-500">Platform Subscription</span>
                            <span className={`text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              tenantSubscription.remaining_days <= 5 ? 'bg-red-500/20 text-red-400' :
                              tenantSubscription.remaining_days <= 10 ? 'bg-amber-500/20 text-amber-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {tenantSubscription.status === 'trialing' ? '🎁 Trial' :
                               tenantSubscription.status === 'active' ? '✅ Active' : tenantSubscription.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-white">
                            {tenantSubscription.plan_name || tenantSubscription.plan_id || 'Trainify'}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {tenantSubscription.status === 'trialing' ? 'Free Trial' : 'Paid Plan'}
                            {tenantSubscription.current_period_end || tenantSubscription.trial_ends_at
                              ? ` · Expires ${new Date(tenantSubscription.current_period_end || tenantSubscription.trial_ends_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                              : ''}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-5xl font-black ${
                            tenantSubscription.remaining_days <= 5 ? 'text-red-400' :
                            tenantSubscription.remaining_days <= 10 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>{tenantSubscription.remaining_days}</span>
                          <span className="block text-3xs text-zinc-500 font-bold uppercase">Days Left</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-zinc-800 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(100, Math.round((tenantSubscription.remaining_days / 30) * 100))}%`,
                              background: tenantSubscription.remaining_days <= 5 ? '#ef4444' :
                                          tenantSubscription.remaining_days <= 10 ? '#f59e0b' : '#22c55e'
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-3xs text-zinc-600 mt-1.5">
                          <span>Platform Access Countdown</span>
                          <span>{tenantSubscription.remaining_days} days remaining</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-700 p-5 flex items-center gap-4">
                      <ShieldCheck className="w-8 h-8 text-zinc-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-zinc-500 font-bold">No Platform Subscription Found</p>
                        <p className="text-xs text-zinc-600 mt-0.5">Contact the admin to activate your coaching plan.</p>
                      </div>
                    </div>
                  )}

                  {/* Coach Platform Plans Grid */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800 animate-fadeIn">
                    <div>
                      <h3 className="text-md font-black text-white uppercase tracking-wider">Upgrade / Select Platform Plan</h3>
                      <span className="text-xs text-zinc-500">Upgrade or change your platform tier to scale your client list.</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { name: 'FREE', title: 'Starter Trial', price: '29', desc: 'Up to 15 trainees', features: ['15 Client Limit', 'Workout Builder', 'Standard Diets', 'Standard Vision Scan'] },
                        { name: 'STARTER', title: 'Pro Coach', price: '79', desc: 'Up to 100 trainees', features: ['100 Client Limit', 'Custom Splits', 'Full Nutrition Reports', 'Coach AI Tools', 'Revenue Analytics'] },
                        { name: 'PRO', title: 'Business Elite', price: '149', desc: 'Unlimited trainees', features: ['Unlimited Clients', 'Custom domain setup', 'White-labeled emails', '24/7 SLA Priority support'] }
                      ].map((p, idx) => {
                        const isCurrent = tenantSubscription?.billing_plan === p.name;
                        return (
                          <div key={idx} className={`p-5 rounded-2xl bg-[#0f0f11] border flex flex-col justify-between space-y-4 transition ${isCurrent ? 'border-[#ff6b00] ring-1 ring-[#ff6b00]/30 shadow-lg' : 'border-zinc-800 hover:border-zinc-700'}`}>
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className={`text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isCurrent ? 'bg-orange-500/10 text-[#ff6b00]' : 'bg-zinc-800 text-zinc-400'} font-bold`}>{p.title}</span>
                                {isCurrent && <span className="text-3xs font-black text-[#ff6b00] uppercase tracking-wider">Active</span>}
                              </div>
                              <h4 className="text-2xl font-black text-white">${p.price}<span className="text-xs font-normal text-zinc-500">/mo</span></h4>
                              <p className="text-3xs text-zinc-400">{p.desc}</p>
                              <ul className="space-y-1.5 text-3xs text-zinc-500">
                                {p.features.map((f, i) => (
                                  <li key={i} className="flex items-center gap-1"><Check className="w-3 h-3 text-[#ff6b00]" /> {f}</li>
                                ))}
                              </ul>
                            </div>
                            <button
                               onClick={() => {
                                 setSelectedPackageForPayment({
                                   packageName: p.name,
                                   packageType: 'platform',
                                   totalSessions: 0,
                                   price: Number(p.price)
                                 });
                                 setPaymentMethodSelect('instapay');
                                 setReceiptImage(null);
                                 setAssignError('');
                                 setShowPaymentModal(true);
                               }}
                               disabled={isCurrent || renewingTenant}
                               className={`w-full py-2 rounded-xl text-3xs font-black uppercase tracking-wider transition ${isCurrent ? 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-default' : 'bg-gradient-to-r from-orange-500 to-amber-600 text-black font-extrabold shadow hover:opacity-90'}`}
                             >
                               {isCurrent ? 'Active Plan' : `Upgrade to ${p.title}`}
                             </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center justify-between shadow-lg">
                      <div>
                        <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Monthly Revenue Est.</span>
                        <h3 className="text-3xl font-black mt-1 text-[#ff6b00]">
                          ${revenueData?.monthly_revenue_estimate || 0}
                        </h3>
                        <span className="text-3xs text-zinc-500 block mt-1">Based on active packages</span>
                      </div>
                      <div className="p-4 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        <Landmark className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center justify-between shadow-lg">
                      <div>
                        <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Active Packages</span>
                        <h3 className="text-3xl font-black mt-1 text-white">
                          {revenueData?.active_subscriptions_count || 0}
                        </h3>
                        <span className="text-3xs text-zinc-500 block mt-1">Currently active trainees</span>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center justify-between shadow-lg">
                      <div>
                        <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Total Clients</span>
                        <h3 className="text-3xl font-black mt-1 text-white">
                          {revenueData?.total_clients || 0}
                        </h3>
                        <span className="text-3xs text-zinc-500 block mt-1">Trainees ever linked</span>
                      </div>
                      <div className="p-4 rounded-xl bg-[#ff6b00]/10 text-orange-500 border border-[#ff6b00]/20">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center justify-between shadow-lg">
                      <div>
                        <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Best-Seller Package</span>
                        <h3 className="text-xl font-black mt-2 text-white truncate max-w-[160px]">
                          {revenueData?.best_selling_package || 'None'}
                        </h3>
                        <span className="text-3xs text-zinc-500 block mt-1">Highest frequency plan</span>
                      </div>
                      <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-550 border border-indigo-500/20">
                        <Award className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Revenue charts & distributions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Growth Chart / Bars */}
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-6 shadow-lg">
                      <h4 className="font-black text-white text-sm uppercase flex items-center gap-2 pb-2 border-b border-zinc-800/80">
                        <TrendingUp className="w-4 h-4 text-[#ff6b00]" />
                        <span>Monthly Growth Trend</span>
                      </h4>
                      
                      <div className="h-48 flex items-end justify-around gap-4 pt-6 border-b border-zinc-800 px-4">
                        {(revenueData?.trends || [
                          { month: 'April', revenue: 0 },
                          { month: 'May', revenue: 0 },
                          { month: 'June', revenue: 0 }
                        ]).map((t: any, idx: number) => {
                          const maxRev = Math.max(...(revenueData?.trends || [{revenue: 100}]).map((x: any) => x.revenue || 100), 100);
                          const barHeight = maxRev > 0 ? (t.revenue / maxRev) * 100 : 0;
                          return (
                            <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                              <span className="text-3xs font-black text-orange-500">${Math.round(t.revenue)}</span>
                              <div className="w-full bg-zinc-900 rounded-t-lg relative overflow-hidden h-28 flex items-end">
                                <div 
                                  className="w-full bg-[#ff6b00] rounded-t-md transition-all duration-500 shadow-[0_0_10px_rgba(255,107,0,0.3)]"
                                  style={{ height: `${barHeight || 10}%` }}
                                />
                              </div>
                              <span className="text-3xs text-zinc-400 font-bold uppercase tracking-wider">{t.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Packages Distribution */}
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4 shadow-lg">
                      <h4 className="font-black text-white text-sm uppercase flex items-center gap-2 pb-2 border-b border-zinc-800/80">
                        <BarChart3 className="w-4 h-4 text-[#ff6b00]" />
                        <span>Package Type Distribution</span>
                      </h4>
                      
                      <div className="space-y-4 py-2">
                        {revenueData?.package_distribution && revenueData.package_distribution.length > 0 ? (
                          revenueData.package_distribution.map((dist: any, idx: number) => {
                            const total = revenueData.active_subscriptions_count || 1;
                            const percent = (dist.count / total) * 100;
                            return (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-zinc-300">{dist.name}</span>
                                  <span className="text-[#ff6b00]">{dist.count} active ({percent.toFixed(0)}%)</span>
                                </div>
                                <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-850">
                                  <div 
                                    className="bg-gradient-to-r from-orange-600 to-[#ff6b00] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-xs text-zinc-600">No packages distribution data found.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
                </>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* 3. TRAINEE WORKSPACE */}
          {/* =================================================================== */}
          {currentUser?.user?.role === 'client' && (
            <div className="space-y-8 animate-fadeIn">
              {clientPendingReceipt && clientPendingReceipt.status === 'pending' ? (
                <div className="p-8 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-6 text-center max-w-2xl mx-auto my-12 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
                  <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 text-[#ff6b00] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Coaching Subscription Under Review</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    We have received your payment proof for the <strong className="text-white">{clientPendingReceipt.package_name}</strong> package.
                    Our team is currently verifying the transfer. Access will be fully restored once approved by the Admin.
                  </p>

                  <div className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-xl max-w-md mx-auto text-left space-y-3">
                    <div className="flex justify-between text-xs border-b border-zinc-800/40 pb-2">
                      <span className="text-zinc-500">Selected Plan:</span>
                      <span className="text-white font-bold">{clientPendingReceipt.package_name}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-zinc-800/40 pb-2">
                      <span className="text-zinc-500">Amount:</span>
                      <span className="text-[#ff6b00] font-bold">${clientPendingReceipt.price}</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-zinc-800/40 pb-2">
                      <span className="text-zinc-500">Method:</span>
                      <span className="text-orange-500 font-bold uppercase flex items-center gap-1">
                        {clientPendingReceipt.payment_method === 'vodafone_cash' ? (
                          <>
                            <Smartphone className="w-3.5 h-3.5" /> Vodafone Cash
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" /> InstaPay
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Submitted At:</span>
                      <span className="text-zinc-300 font-semibold">{new Date(clientPendingReceipt.submitted_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        fetchClientPendingReceipt(currentUser?.accessToken);
                        fetchActiveClientPlans(currentUser?.accessToken);
                      }}
                      className="px-6 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold hover:text-white transition flex items-center gap-2 mx-auto"
                    >
                      <RefreshCw className="w-4 h-4" /> Check Activation Status
                    </button>
                  </div>
                  
                  <p className="text-xs text-zinc-500 pt-2">
                    💡 You can still use the chat workspace below to message your coach directly.
                  </p>
                </div>
              ) : (!activeSubscription || activeSubscription.remaining_days <= 0) ? (
                <div className="p-8 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-6 text-center max-w-2xl mx-auto my-12 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
                  <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Subscription Suspended</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Your active training subscription has expired or has not been paid. 
                    Access to your custom workouts, nutrition plans, compliance logs, and AI scanning features is temporarily restricted.
                  </p>
                  
                  {/* Status Box */}
                  <div className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-xl max-w-md mx-auto text-left space-y-2">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Status:</span>
                      <span className="text-red-400 font-bold uppercase">Expired / Unpaid</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Action Required:</span>
                      <span className="text-white font-bold">Please subscribe to a plan to restore access.</span>
                    </div>
                  </div>

                  {/* Pricing grid on gate */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800 text-left animate-fadeIn">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider text-center">Or self-subscribe to a package to restore access</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: 'Silver Pack', price: '49', type: 'hybrid', sessions: 4, features: ['Workout splits', 'Nutrition targets', 'Weekly Check-in'] },
                        { title: 'Gold Active', price: '99', type: 'gym', sessions: 12, features: ['12 Gym Sessions', 'Dynamic splits', 'Coach Chat Priority'] },
                        { title: 'VIP Elite', price: '199', type: 'hybrid', sessions: 30, features: ['30 Gym Sessions', 'Daily compliance', 'AI Form Analysis'] }
                      ].map((p, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-zinc-905 border border-zinc-800 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition">
                          <div className="space-y-1">
                            <span className="text-4xs font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold">{p.title}</span>
                            <h4 className="text-lg font-black text-white mt-1">${p.price}<span className="text-4xs font-normal text-zinc-500">/mo</span></h4>
                            <ul className="space-y-1 text-4xs text-zinc-500 mt-2">
                              {p.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-0.5"><Check className="w-2.5 h-2.5 text-[#ff6b00]" /> {f}</li>
                              ))}
                            </ul>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPackageForPayment({
                                packageName: p.title,
                                packageType: p.type,
                                totalSessions: p.sessions,
                                price: Number(p.price)
                              });
                              setPaymentMethodSelect('instapay');
                              setReceiptImage(null);
                              setAssignError('');
                              setShowPaymentModal(true);
                            }}
                            className="w-full py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-black text-4xs font-black uppercase tracking-wider hover:opacity-90 transition flex items-center justify-center gap-1"
                          >
                            Subscribe
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 pt-2">
                    💡 You can still use the chat workspace below to message your coach directly.
                  </p>
                </div>
              ) : (
                <>

              {/* ================================================================ */}
              {/* TRAINEE OVERVIEW STRIP                                            */}
              {/* ================================================================ */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Daily Calories */}
                <div className="p-5 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex-shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xs text-zinc-500 font-bold uppercase tracking-wider block">Daily Target</span>
                    <span className="text-2xl font-black text-white">
                      {assignedNutrition?.meals?.reduce((a: number, m: any) => a + Number(m.calories || 0), 0) || '—'}
                    </span>
                    <span className="text-3xs text-zinc-600">kcal / day</span>
                  </div>
                </div>
                {/* Protein */}
                <div className="p-5 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex-shrink-0">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xs text-zinc-500 font-bold uppercase tracking-wider block">Daily Protein</span>
                    <span className="text-2xl font-black text-white">
                      {assignedNutrition?.meals?.reduce((a: number, m: any) => a + Number(m.protein || 0), 0) || '—'}
                    </span>
                    <span className="text-3xs text-zinc-600">grams / day</span>
                  </div>
                </div>
                {/* Current Weight */}
                <div className="p-5 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xs text-zinc-500 font-bold uppercase tracking-wider block">Last Weight</span>
                    <span className="text-2xl font-black text-white">
                      {weightLog.length > 0 ? `${weightLog[weightLog.length - 1].weight}` : '—'}
                    </span>
                    <span className="text-3xs text-zinc-600">kg</span>
                  </div>
                </div>
                {/* Subscription days */}
                <div className="p-5 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex items-center gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    (activeSubscription?.remaining_days ?? 99) <= 5 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    (activeSubscription?.remaining_days ?? 99) <= 10 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-orange-500/10 border-orange-500/20 text-orange-500'
                  } border`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xs text-zinc-500 font-bold uppercase tracking-wider block">Subscription</span>
                    <span className={`text-2xl font-black ${
                      (activeSubscription?.remaining_days ?? 99) <= 5 ? 'text-red-400' :
                      (activeSubscription?.remaining_days ?? 99) <= 10 ? 'text-amber-400' : 'text-[#ff6b00]'
                    }`}>
                      {activeSubscription ? activeSubscription.remaining_days : '—'}
                    </span>
                    <span className="text-3xs text-zinc-600">days left</span>
                  </div>
                </div>
              </div>

              {/* ── Today's Focus: Workout + Meals ── */}
              {(assignedWorkout || assignedNutrition) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Today's Workout Card */}
                  {assignedWorkout && assignedWorkout.days && assignedWorkout.days.length > 0 && (() => {
                    const dayOfWeek = new Date().getDay(); // 0=Sun
                    const idx = Math.min(todayDayIndex, assignedWorkout.days.length - 1);
                    const todayDay = assignedWorkout.days[idx];
                    return (
                      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0f0f11] p-5 space-y-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                              <Dumbbell className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                              <span className="text-3xs text-zinc-500 font-bold uppercase tracking-wider block">Today's Workout</span>
                              <h3 className="text-sm font-black text-white">{todayDay.title}</h3>
                            </div>
                          </div>
                          {/* Day selector */}
                          <div className="flex items-center gap-1">
                            <button onClick={() => setTodayDayIndex(Math.max(0, idx - 1))}
                              className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs flex items-center justify-center transition">‹</button>
                            <span className="text-3xs text-zinc-500 px-1">Day {idx + 1}/{assignedWorkout.days.length}</span>
                            <button onClick={() => setTodayDayIndex(Math.min(assignedWorkout.days.length - 1, idx + 1))}
                              className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs flex items-center justify-center transition">›</button>
                          </div>
                        </div>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {todayDay.exercises?.map((ex: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/60">
                              <div>
                                <span className="text-xs font-bold text-white block">{ex.name}</span>
                                <span className="text-3xs text-zinc-500">Rest: {ex.rest}</span>
                              </div>
                              <span className="text-xs font-black text-orange-500">{ex.sets}×{ex.reps}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-zinc-800 flex gap-3 text-3xs text-zinc-500">
                          <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{assignedWorkout.training_type || 'Bodybuilding'}</span>
                          <span className="flex items-center gap-1"><Target className="w-3 h-3" />{assignedWorkout.training_split || 'Full Body'}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{assignedWorkout.duration_weeks} Weeks</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Today's Meals Card */}
                  {assignedNutrition && assignedNutrition.meals && (
                    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0f0f11] p-5 space-y-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <Heart className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <span className="text-3xs text-zinc-500 font-bold uppercase tracking-wider block">Today's Meal Plan</span>
                          <h3 className="text-sm font-black text-white">{assignedNutrition.title}</h3>
                        </div>
                      </div>
                      {/* Macro Summary */}
                      <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                        {[
                          { label: 'Calories', val: `${assignedNutrition.meals.reduce((a: number, m: any) => a + Number(m.calories || 0), 0)}`, unit: 'kcal', color: 'text-orange-400' },
                          { label: 'Protein', val: `${assignedNutrition.meals.reduce((a: number, m: any) => a + Number(m.protein || 0), 0)}g`, unit: '', color: 'text-emerald-400' },
                          { label: 'Carbs', val: `${assignedNutrition.meals.reduce((a: number, m: any) => a + Number(m.carbs || 0), 0)}g`, unit: '', color: 'text-indigo-400' },
                          { label: 'Fats', val: `${assignedNutrition.meals.reduce((a: number, m: any) => a + Number(m.fats || 0), 0)}g`, unit: '', color: 'text-amber-400' },
                        ].map((m, i) => (
                          <div key={i}>
                            <span className="text-3xs text-zinc-500 block">{m.label}</span>
                            <span className={`text-xs font-black ${m.color}`}>{m.val}</span>
                          </div>
                        ))}
                      </div>
                      {/* Meals list */}
                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                        {assignedNutrition.meals.map((meal: any, i: number) => (
                          <div key={i} className="flex items-start justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/60">
                            <div className="flex-1">
                              <span className="text-3xs font-black text-orange-500 uppercase tracking-wider block">{meal.type}</span>
                              <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed line-clamp-2">{meal.description}</p>
                            </div>
                            <span className="text-3xs font-bold text-zinc-500 flex-shrink-0 ml-2">{meal.calories} kcal</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Unread notifications from coach ── */}
              {notifications.filter(n => !n.is_read).length > 0 && (
                <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">
                      {notifications.filter(n => !n.is_read).length} New Notification(s)
                    </span>
                  </div>
                  {notifications.filter(n => !n.is_read).slice(0, 3).map((n: any) => (
                    <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-white block">{n.title}</span>
                        <p className="text-3xs text-zinc-400">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab Switcher */}
              <div className="flex border-b border-zinc-800 gap-6 overflow-x-auto pb-px">
                <button onClick={() => setTraineeTab('plans')} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${traineeTab === 'plans' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>My Plans</button>
                <button onClick={() => setTraineeTab('goals')} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 relative ${traineeTab === 'goals' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                  Goals & Badges
                  {clientGoals.filter((g: any) => g.status === 'achieved').length > 0 && (
                    <span className="ml-1.5 text-3xs bg-orange-500 text-black font-black rounded-full px-1.5">{clientGoals.filter((g: any) => g.status === 'achieved').length}</span>
                  )}
                </button>
                <button onClick={() => setTraineeTab('progress')} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${traineeTab === 'progress' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Progress Tracker</button>
                <button onClick={() => setTraineeTab('scanner')} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${traineeTab === 'scanner' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>AI Food Scanner</button>
                <button onClick={() => setTraineeTab('compliance')} className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition flex-shrink-0 ${traineeTab === 'compliance' ? 'border-[#ff6b00] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Daily Meal Logs</button>
              </div>

              {/* ── Goals & Achievements Tab ── */}
              {traineeTab === 'goals' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Create Goal Form */}
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                      <h3 className="text-md font-black text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                        <Target className="w-5 h-5 text-orange-500" />
                        <span>Set a New Goal</span>
                      </h3>
                      {goalSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /><span>{goalSuccess}</span>
                        </div>
                      )}
                      <form onSubmit={handleCreateGoal} className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-bold">Goal Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { val: 'weight', label: '⚖️ Weight Goal', unit: 'kg' },
                              { val: 'protein', label: '🥩 Daily Protein', unit: 'g' },
                              { val: 'workout', label: '🏋️ Weekly Sessions', unit: 'sessions' },
                              { val: 'checkin', label: '📋 Check-ins', unit: 'check-ins' },
                            ].map(t => (
                              <button key={t.val} type="button"
                                onClick={() => { setNewGoalType(t.val); setNewGoalUnit(t.unit); }}
                                className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-left ${newGoalType === t.val ? 'bg-orange-500/15 border-orange-500 text-orange-400' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}>
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-bold">Goal Title</label>
                          <input type="text" value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)}
                            placeholder={newGoalType === 'weight' ? 'e.g. Reach 80kg target weight' : 'Describe your goal'}
                            required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1.5">
                            <label className="text-zinc-400 text-2xs uppercase font-bold">Target Value</label>
                            <input type="number" step="0.1" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)}
                              placeholder="e.g. 80" required
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-zinc-400 text-2xs uppercase font-bold">Unit</label>
                            <input type="text" value={newGoalUnit} onChange={e => setNewGoalUnit(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-bold">Deadline (optional)</label>
                          <input type="date" value={newGoalDeadline} onChange={e => setNewGoalDeadline(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
                        </div>
                        <button type="submit" disabled={goalSubmitting}
                          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-sm uppercase tracking-wider transition disabled:opacity-50">
                          {goalSubmitting ? 'Creating...' : '🎯 Create Goal'}
                        </button>
                      </form>
                    </div>

                    {/* Active Goals Progress */}
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                      <h3 className="text-md font-black text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span>My Goals Progress</span>
                        <span className="ml-auto text-xs text-zinc-500 font-normal">{clientGoals.filter((g: any) => g.status === 'active').length} active</span>
                      </h3>
                      {clientGoals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                          <Target className="w-10 h-10 text-zinc-700 mb-3" />
                          <p className="text-sm font-bold text-zinc-500">No goals yet</p>
                          <p className="text-xs text-zinc-600 mt-1">Set your first goal to start tracking</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                          {clientGoals.map((g: any) => {
                            const pct = g.target_value > 0
                              ? Math.min(100, Math.round((parseFloat(g.current_value) / parseFloat(g.target_value)) * 100))
                              : 0;
                            const isAchieved = g.status === 'achieved';
                            const daysLeft = g.deadline
                              ? Math.max(0, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000))
                              : null;
                            return (
                              <div key={g.id} className={`p-3.5 rounded-xl border space-y-2.5 ${isAchieved ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900'}`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-black text-white">{g.title}</span>
                                      {isAchieved && <span className="text-3xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-black">✅ Achieved!</span>}
                                    </div>
                                    <span className="text-3xs text-zinc-500 capitalize">{g.goal_type} goal</span>
                                    {daysLeft !== null && !isAchieved && (
                                      <span className={`text-3xs ml-2 ${daysLeft <= 3 ? 'text-red-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-zinc-500'}`}>
                                        ⏰ {daysLeft} days left
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className={`text-sm font-black ${isAchieved ? 'text-emerald-400' : 'text-[#ff6b00]'}`}>{pct}%</span>
                                    <span className="text-3xs text-zinc-500 block">{g.current_value}/{g.target_value} {g.unit}</span>
                                  </div>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2">
                                  <div className="h-2 rounded-full transition-all duration-700"
                                    style={{ width: `${pct}%`, background: isAchieved ? '#22c55e' : pct > 66 ? '#ff6b00' : pct > 33 ? '#f59e0b' : '#6366f1' }} />
                                </div>
                                {!isAchieved && (
                                  <button onClick={() => handleDeleteGoal(g.id)}
                                    className="text-3xs text-zinc-600 hover:text-red-400 transition">Remove goal</button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                    <h3 className="text-md font-black text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                      <span>🏆</span>
                      <span>Achievements & Badges</span>
                      <span className="ml-auto text-xs text-zinc-500 font-normal">{clientBadges.length} earned</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {[
                        { key: 'first_checkin', name: 'First Step', icon: '🚀', desc: 'Log your first check-in' },
                        { key: 'five_checkins', name: 'Consistency King', icon: '🔥', desc: '5 check-ins done' },
                        { key: 'ten_checkins', name: 'Dedicated Athlete', icon: '💪', desc: '10 check-ins done' },
                        { key: 'first_goal', name: 'Goal Crusher', icon: '🎯', desc: 'Achieve first goal' },
                        { key: 'weight_loss_5kg', name: 'Fat Burner', icon: '⚡', desc: 'Hit your weight goal' },
                        { key: 'weight_loss_10kg', name: 'Transformation', icon: '🏆', desc: 'Major transformation' },
                      ].map(badge => {
                        const earned = clientBadges.find((b: any) => b.badge_key === badge.key);
                        return (
                          <div key={badge.key} className={`p-3 rounded-xl border text-center space-y-1 transition ${earned ? 'border-orange-500/30 bg-orange-500/5 shadow-[0_0_15px_rgba(255,107,0,0.1)]' : 'border-zinc-800 bg-zinc-900 opacity-40 grayscale'}`}>
                            <span className="text-3xl block">{badge.icon}</span>
                            <span className="text-2xs font-black text-white block">{badge.name}</span>
                            <span className="text-3xs text-zinc-500 block">{badge.desc}</span>
                            {earned && <span className="text-3xs text-orange-400 font-bold block">{new Date(earned.earned_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {traineeTab === 'plans' && (
                <div className="space-y-6">
                {/* ── Subscription Countdown Banner ── */}
                {activeSubscription ? (
                  <div className="relative overflow-hidden rounded-2xl border p-5"
                    style={{
                      background: 'linear-gradient(135deg, #0f0f11 60%, #1a0d00)',
                      borderColor: activeSubscription.remaining_days <= 5 ? '#ef4444' :
                                   activeSubscription.remaining_days <= 10 ? '#f59e0b' : '#ff6b00'
                    }}>
                    {/* Glow accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl"
                      style={{ background: activeSubscription.remaining_days <= 5 ? '#ef4444' : '#ff6b00' }} />
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-3xs font-black uppercase tracking-widest text-zinc-500">Membership</span>
                          <span className={`text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            activeSubscription.remaining_days <= 5 ? 'bg-red-500/20 text-red-400' :
                            activeSubscription.remaining_days <= 10 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {activeSubscription.remaining_days <= 5 ? '⚠ Expiring Soon' :
                             activeSubscription.remaining_days <= 10 ? '⏳ Ending Soon' : '✅ Active'}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-white mb-0.5">{activeSubscription.package_name}</h3>
                        <p className="text-xs text-zinc-400">
                          {activeSubscription.package_type?.toUpperCase()} &bull; Ends {new Date(activeSubscription.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`text-4xl font-black ${
                          activeSubscription.remaining_days <= 5 ? 'text-red-400' :
                          activeSubscription.remaining_days <= 10 ? 'text-amber-400' : 'text-[#ff6b00]'
                        }`}>{activeSubscription.remaining_days}</span>
                        <span className="block text-3xs text-zinc-500 font-bold uppercase">Days Left</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-3xs text-zinc-500 mb-1.5">
                        <span>Start: {new Date(activeSubscription.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                        <span>30-Day Package</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(100, Math.round((activeSubscription.remaining_days / 30) * 100))}%`,
                            background: activeSubscription.remaining_days <= 5 ? '#ef4444' :
                                        activeSubscription.remaining_days <= 10 ? '#f59e0b' : '#ff6b00'
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-3xs text-zinc-600 mt-1">
                        <span>{30 - activeSubscription.remaining_days} days elapsed</span>
                        <span>{activeSubscription.remaining_days} days remaining</span>
                      </div>
                    </div>
                    {/* Sessions bar (if gym/hybrid) */}
                    {(activeSubscription.package_type === 'gym' || activeSubscription.package_type === 'hybrid') && (
                      <div className="mt-3 pt-3 border-t border-zinc-800">
                        <div className="flex justify-between text-3xs text-zinc-500 mb-1.5">
                          <span>Sessions Used</span>
                          <span>{activeSubscription.total_sessions - activeSubscription.remaining_sessions} / {activeSubscription.total_sessions}</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                            style={{ width: `${activeSubscription.total_sessions > 0 ? Math.round(((activeSubscription.total_sessions - activeSubscription.remaining_sessions) / activeSubscription.total_sessions) * 100) : 0}%` }}
                          />
                        </div>
                        <div className="text-right text-3xs text-zinc-500 mt-1">
                          {activeSubscription.remaining_sessions} sessions remaining
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-700 p-5 text-center">
                    <Award className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500 font-bold">No Active Subscription</p>
                    <p className="text-xs text-zinc-600 mt-1">Your coach hasn't assigned a package yet. Contact them to get started.</p>
                  </div>
                )}

                {/* Trainee Coaching Plans Grid */}
                <div className="space-y-4 pt-4 border-t border-zinc-800 animate-fadeIn">
                  <div>
                    <h3 className="text-md font-black text-white uppercase tracking-wider">Purchase / Renew Coaching Package</h3>
                    <span className="text-xs text-zinc-500">Subscribe directly to a plan to unlock or extend your coaching access.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Silver Pack', price: '49', type: 'hybrid', sessions: 4, desc: 'Ideal for independent trainees', features: ['Workout splits', 'Nutrition targets', 'Weekly Check-in', 'AI Scan Access'] },
                      { title: 'Gold Active', price: '99', type: 'gym', sessions: 12, desc: 'For gym/hybrid trainees', features: ['12 Gym Sessions', 'Dynamic splits', 'Macro tracking', 'Coach Chat priority'] },
                      { title: 'VIP Elite', price: '199', type: 'hybrid', sessions: 30, desc: 'Premium 1-on-1 coaching', features: ['30 Gym Sessions', 'Daily compliance reviews', 'AI Form analysis', '24/7 Priority chat line'] }
                    ].map((p, idx) => {
                      const isCurrent = activeSubscription?.package_name === p.title;
                      return (
                        <div key={idx} className={`p-5 rounded-2xl bg-[#0f0f11] border flex flex-col justify-between space-y-4 transition ${isCurrent ? 'border-[#ff6b00] ring-1 ring-[#ff6b00]/30 shadow-lg' : 'border-zinc-800 hover:border-zinc-700'}`}>
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className={`text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isCurrent ? 'bg-orange-500/10 text-[#ff6b00]' : 'bg-zinc-800 text-zinc-400'} font-bold`}>{p.title}</span>
                              {isCurrent && <span className="text-3xs font-black text-[#ff6b00] uppercase tracking-wider">Active</span>}
                            </div>
                            <h4 className="text-2xl font-black text-white">${p.price}<span className="text-xs font-normal text-zinc-500">/mo</span></h4>
                            <p className="text-3xs text-zinc-400">{p.desc}</p>
                            <ul className="space-y-1.5 text-3xs text-zinc-500">
                              {p.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-1"><Check className="w-3 h-3 text-[#ff6b00]" /> {f}</li>
                              ))}
                            </ul>
                          </div>
                          <button
                            onClick={() => handleClientSelfSubscribe(p.title, p.type, p.sessions, Number(p.price))}
                            disabled={isCurrent || subscribingClient}
                            className={`w-full py-2 rounded-xl text-3xs font-black uppercase tracking-wider transition ${isCurrent ? 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-default' : 'bg-gradient-to-r from-orange-500 to-amber-600 text-black font-extrabold shadow hover:opacity-90 flex items-center justify-center gap-1'}`}
                          >
                            {isCurrent ? 'Active Plan' : `Subscribe ${p.title}`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Workout Details (Assigned Program) */}
                  {assignedWorkout ? (
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                      <h3 className="text-md font-black text-white flex flex-col pb-2">
                        <span className="flex items-center gap-2 text-sm">
                          <Dumbbell className="w-5 h-5 text-orange-500" />
                          <span>{assignedWorkout.title}</span>
                        </span>
                        <span className="text-3xs text-zinc-500 block mt-1 uppercase font-bold">Duration: {assignedWorkout.duration_weeks} Weeks</span>
                      </h3>

                      {/* Workout System Details Header */}
                      <div className="grid grid-cols-3 gap-2 border-t border-b border-zinc-800/80 py-2.5 my-1 text-center">
                        <div>
                          <span className="block text-3xs text-zinc-500 uppercase font-bold">Split System</span>
                          <span className="text-xs text-white font-bold">{assignedWorkout.training_split || 'Full Body'}</span>
                        </div>
                        <div>
                          <span className="block text-3xs text-zinc-500 uppercase font-bold">Workout Type</span>
                          <span className="text-xs text-white font-bold">{assignedWorkout.training_type || 'Bodybuilding'}</span>
                        </div>
                        <div>
                          <span className="block text-3xs text-zinc-500 uppercase font-bold">Frequency</span>
                          <span className="text-xs text-orange-500 font-black">{assignedWorkout.days_count || assignedWorkout.days.length} Days/Wk</span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        {assignedWorkout.days.map((day: any, idx: number) => (
                          <div key={idx} className="space-y-2">
                            <span className="text-xs text-orange-500 font-bold block">{day.title}</span>
                            {day.exercises.map((ex: any, exIdx: number) => (
                              <div key={exIdx} className="p-4 bg-zinc-900 border border-zinc-800/40 rounded-xl flex justify-between items-center text-xs">
                                <div>
                                  <strong className="block text-sm text-white">{ex.name}</strong>
                                  <span className="text-zinc-500">Rest: {ex.rest}</span>
                                  {ex.notes && <span className="text-zinc-500 block italic">Notes: {ex.notes}</span>}
                                </div>
                                <div className="text-right">
                                  <strong className="text-orange-500 text-sm block">{ex.sets} Sets x {ex.reps} Reps</strong>
                                  <span className="text-zinc-400">{ex.weight}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex flex-col justify-center items-center py-16 text-center">
                      <div className="p-4 bg-zinc-900/60 rounded-full border border-zinc-800 mb-4">
                        <Dumbbell className="w-8 h-8 text-zinc-600" />
                      </div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Workout Assigned Yet</h3>
                      <p className="text-xs text-zinc-500 max-w-xs mt-1.5 leading-relaxed">Your coach hasn't assigned a customized training program to your account yet.</p>
                    </div>
                  )}

                  {/* Nutrition details (Assigned Plan) */}
                  {assignedNutrition ? (
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                        <h3 className="text-md font-black text-white flex items-center gap-2">
                          <Target className="w-5 h-5 text-orange-500" />
                          <span>{assignedNutrition.title}</span>
                        </h3>
                        <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-[#ff6b00] rounded text-3xs font-black uppercase tracking-wider">
                          {assignedNutrition.diet_type || 'Balanced'}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                        <div>
                          <span className="block text-3xs text-zinc-400">Calories</span>
                          <strong className="text-xs text-white">{assignedNutrition.meals.reduce((acc: number, m: any) => acc + Number(m.calories), 0)} kcal</strong>
                        </div>
                        <div>
                          <span className="block text-3xs text-zinc-400">Protein</span>
                          <strong className="text-xs text-emerald-500">{assignedNutrition.meals.reduce((acc: number, m: any) => acc + Number(m.protein), 0)}g</strong>
                        </div>
                        <div>
                          <span className="block text-3xs text-zinc-400">Carbs</span>
                          <strong className="text-xs text-indigo-400">{assignedNutrition.meals.reduce((acc: number, m: any) => acc + Number(m.carbs), 0)}g</strong>
                        </div>
                        <div>
                          <span className="block text-3xs text-zinc-400">Fats</span>
                          <strong className="text-xs text-orange-400">{assignedNutrition.meals.reduce((acc: number, m: any) => acc + Number(m.fats), 0)}g</strong>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {assignedNutrition.meals.map((meal: any, idx: number) => (
                          <div key={idx} className="p-3.5 bg-zinc-900 border border-zinc-800/40 rounded-xl text-xs">
                            <strong className="block text-xs text-orange-500 uppercase tracking-wider">{meal.type}</strong>
                            {meal.calories && (
                              <span className="text-3xs text-zinc-400 block mt-0.5">Macros: {meal.calories} kcal | {meal.protein}g P | {meal.carbs}g C | {meal.fats}g F</span>
                            )}
                            <p className="text-sm text-zinc-200 mt-1.5 whitespace-pre-line">{meal.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-[#0f0f11] border border-zinc-800 flex flex-col justify-center items-center py-16 text-center">
                      <div className="p-4 bg-zinc-900/60 rounded-full border border-zinc-800 mb-4">
                        <Target className="w-8 h-8 text-zinc-600" />
                      </div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Nutrition Plan Assigned</h3>
                      <p className="text-xs text-zinc-500 max-w-xs mt-1.5 leading-relaxed">Your coach hasn't assigned a customized nutrition or meal plan to your account yet.</p>
                    </div>
                  )}
                </div>
                </div>
              )}


              {/* ── Progress Tracker Tab ── */}
              {traineeTab === 'progress' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Weight Log Form */}
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                      <h3 className="text-md font-black text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        <span>Log Today's Check-In</span>
                      </h3>
                      {checkinSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /><span>{checkinSuccess}</span>
                        </div>
                      )}
                      <form onSubmit={handleCheckinSubmit} className="space-y-4">
                        {/* Weight */}
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-bold">Weight (kg)</label>
                          <input type="number" step="0.1" min="30" max="250"
                            value={weightInput2} onChange={e => setWeightInput2(e.target.value)}
                            placeholder="e.g. 83.5"
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        {/* Mood */}
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-bold">Mood Score (1–5)</label>
                          <div className="flex gap-2">
                            {[1,2,3,4,5].map(v => (
                              <button key={v} type="button" onClick={() => setCheckinMood(v)}
                                className={`flex-1 py-2 rounded-lg text-sm font-black border transition ${
                                  checkinMood === v ? 'bg-orange-500 border-orange-500 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-orange-500'
                                }`}>{v}</button>
                            ))}
                          </div>
                        </div>
                        {/* Sleep */}
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-bold">Sleep Hours: <span className="text-orange-500">{checkinSleep}h</span></label>
                          <input type="range" min="3" max="12" step="0.5"
                            value={checkinSleep} onChange={e => setCheckinSleep(parseFloat(e.target.value))}
                            className="w-full accent-orange-500"
                          />
                        </div>
                        {/* Energy */}
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-bold">Energy Level (1–5)</label>
                          <div className="flex gap-2">
                            {[1,2,3,4,5].map(v => (
                              <button key={v} type="button" onClick={() => setCheckinEnergy(v)}
                                className={`flex-1 py-2 rounded-lg text-sm font-black border transition ${
                                  checkinEnergy === v ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-emerald-500'
                                }`}>{v}</button>
                            ))}
                          </div>
                        </div>
                        {/* Water */}
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-bold">Water Intake: <span className="text-indigo-400">{(checkinWater/1000).toFixed(1)}L</span></label>
                          <input type="range" min="500" max="5000" step="250"
                            value={checkinWater} onChange={e => setCheckinWater(parseInt(e.target.value))}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                        {/* Notes */}
                        <div className="space-y-1.5">
                          <label className="text-zinc-400 text-2xs uppercase font-bold">Notes for Coach (optional)</label>
                          <textarea rows={2} value={checkinNotes} onChange={e => setCheckinNotes(e.target.value)}
                            placeholder="How did you feel today? Any issues?"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                          />
                        </div>
                        <button type="submit" disabled={checkinSubmitting}
                          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-sm uppercase tracking-wider transition disabled:opacity-50">
                          {checkinSubmitting ? 'Logging...' : '✓ Submit Check-In'}
                        </button>
                      </form>
                    </div>

                    {/* Weight Chart */}
                    <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                      <h3 className="text-md font-black text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                        <span>Weight Progress</span>
                        {weightLog.length >= 2 && (() => {
                          const first = weightLog[0].weight;
                          const last = weightLog[weightLog.length - 1].weight;
                          const diff = (last - first).toFixed(1);
                          const isLoss = last < first;
                          return (
                            <span className={`ml-auto text-xs font-black px-2 py-0.5 rounded-full ${
                              isLoss ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {isLoss ? '↓' : '↑'} {Math.abs(parseFloat(diff))} kg total
                            </span>
                          );
                        })()}
                      </h3>

                      {weightLog.length > 0 ? (
                        <div className="space-y-3">
                          {/* Mini bar chart */}
                          <div className="flex items-end gap-1.5 h-36 pt-2">
                            {weightLog.slice(-12).map((entry, i) => {
                              const minW = Math.min(...weightLog.slice(-12).map(e => e.weight));
                              const maxW = Math.max(...weightLog.slice(-12).map(e => e.weight));
                              const range = maxW - minW || 1;
                              const pct = ((entry.weight - minW) / range) * 70 + 30;
                              return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                  <span className="text-3xs text-zinc-600">{entry.weight}</span>
                                  <div className="w-full rounded-t-sm" style={{ height: `${pct}%`, background: 'linear-gradient(to top, #ff6b00, #ff9a00)' }} />
                                  <span className="text-3xs text-zinc-600 rotate-45 origin-left mt-1 whitespace-nowrap" style={{fontSize:'8px'}}>{entry.date}</span>
                                </div>
                              );
                            })}
                          </div>
                          {/* Stats row */}
                          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-800">
                            <div className="text-center">
                              <span className="text-3xs text-zinc-500 uppercase font-bold block">Start</span>
                              <span className="text-sm font-black text-white">{weightLog[0].weight} kg</span>
                            </div>
                            <div className="text-center">
                              <span className="text-3xs text-zinc-500 uppercase font-bold block">Current</span>
                              <span className="text-sm font-black text-[#ff6b00]">{weightLog[weightLog.length - 1].weight} kg</span>
                            </div>
                            <div className="text-center">
                              <span className="text-3xs text-zinc-500 uppercase font-bold block">Check-ins</span>
                              <span className="text-sm font-black text-white">{weightLog.length}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                          <TrendingUp className="w-10 h-10 text-zinc-700 mb-3" />
                          <p className="text-sm font-bold text-zinc-500">No check-ins yet</p>
                          <p className="text-xs text-zinc-600 mt-1">Log your first check-in to start tracking your progress</p>
                        </div>
                      )}

                      {/* Recent check-in history */}
                      {checkinHistory.length > 0 && (
                        <div className="pt-3 border-t border-zinc-800">
                          <h5 className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-3">Recent Check-ins</h5>
                          <div className="space-y-2 max-h-44 overflow-y-auto">
                            {checkinHistory.slice(0, 6).map((c: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                                <div>
                                  <span className="text-xs font-bold text-white block">{new Date(c.submitted_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                  {c.client_notes && <p className="text-3xs text-zinc-500 mt-0.5">{c.client_notes}</p>}
                                  {c.coach_feedback && (
                                    <p className="text-3xs text-indigo-400 mt-0.5">💬 Coach: {c.coach_feedback}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-black text-[#ff6b00]">{c.weight} kg</span>
                                  <div className="flex gap-1 mt-1 justify-end">
                                    <span className="text-3xs text-zinc-500">😴{c.sleep_hours}h</span>
                                    <span className="text-3xs text-zinc-500">⚡{c.energy_level}/5</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Food Scanner Screen */}

              {traineeTab === 'scanner' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                    <h3 className="text-md font-black text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                      <Camera className="w-5 h-5 text-orange-500" />
                      <span>Take Photo / Upload Image</span>
                    </h3>

                    {saveSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> <span>{saveSuccess}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-zinc-800 rounded-2xl h-56 flex flex-col items-center justify-center p-4 relative bg-[#09090b]">
                        {scannerImage ? (
                          <img src={scannerImage} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                        ) : (
                          <div className="text-center space-y-2">
                            <Camera className="w-10 h-10 text-zinc-500 mx-auto" />
                            <span className="text-xs text-zinc-500 block">Select meal photo to scan</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoSelect} 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>

                      {scannerImage && (
                        <div className="flex gap-2">
                          <button 
                            onClick={handleTriggerScan}
                            disabled={isScanning}
                            className="flex-1 py-3 bg-[#ff6b00] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
                          >
                            {isScanning ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Scanning Image...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" /> Run AI Food Scanner
                              </>
                            )}
                          </button>
                          <button 
                            onClick={() => { setScannerImage(null); setScanResult(null); }}
                            className="px-4 py-3 bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold rounded-xl"
                          >
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
                    <h3 className="text-md font-black text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
                      <BarChart3 className="w-5 h-5 text-orange-500" />
                      <span>Detected Foods & Portions</span>
                    </h3>

                    {scanResult ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <span className="text-zinc-500 block">Confidence Score</span>
                            <strong className="text-orange-500 font-bold text-md block mt-0.5">{(scanResult.average_confidence * 100).toFixed(0)}% Match</strong>
                          </div>
                          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <span className="text-zinc-500 block">Total Est. Weight</span>
                            <strong className="text-white font-bold text-md block mt-0.5">{scanResult.estimated_weight_g}g</strong>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          {scanResult.detected_items.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-zinc-900/60 border border-zinc-800/40 rounded-xl flex justify-between items-center text-xs">
                              <div>
                                <strong className="block text-white text-sm">{item.food_name}</strong>
                                <span className="text-zinc-500">Est. Weight: {item.estimated_weight}g (Serving size: {item.serving_size})</span>
                              </div>
                              <div className="text-right">
                                <strong className="text-orange-500 block">{item.calories} kcal</strong>
                                <span className="text-zinc-400">P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-zinc-800 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-400 font-bold">Select Meal Type:</span>
                            <select 
                              value={scanMealType} 
                              onChange={(e) => setScanMealType(e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-white cursor-pointer"
                            >
                              <option value="Breakfast">Breakfast</option>
                              <option value="Lunch">Lunch</option>
                              <option value="Dinner">Dinner</option>
                              <option value="Snack">Snack</option>
                            </select>
                          </div>

                          {/* ── Plan Compliance Check ── */}
                          {assignedNutrition?.meals && scanResult && (() => {
                            const targetMeal = assignedNutrition.meals.find((m: any) =>
                              m.type?.toLowerCase().includes(scanMealType.toLowerCase()) ||
                              scanMealType.toLowerCase().includes(m.type?.toLowerCase())
                            ) || assignedNutrition.meals[0];
                            const scannedCals = scanResult.detected_items.reduce((a: number, i: any) => a + Number(i.calories || 0), 0);
                            const scannedProt = scanResult.detected_items.reduce((a: number, i: any) => a + Number(i.protein || 0), 0);
                            const targetCals = Number(targetMeal?.calories || 0);
                            const targetProt = Number(targetMeal?.protein || 0);
                            const calDiff = scannedCals - targetCals;
                            const protDiff = scannedProt - targetProt;
                            const calPct = targetCals > 0 ? Math.round((scannedCals / targetCals) * 100) : 0;
                            const score = Math.max(0, 100 - Math.abs(calDiff) / 5 - Math.abs(protDiff) * 2);
                            const isGood = score >= 75;
                            const isOk = score >= 50;
                            return (
                              <div className={`p-4 rounded-xl border space-y-3 ${
                                isGood ? 'border-emerald-500/30 bg-emerald-500/5' :
                                isOk ? 'border-amber-500/30 bg-amber-500/5' :
                                'border-red-500/30 bg-red-500/5'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className={`w-4 h-4 ${isGood ? 'text-emerald-400' : isOk ? 'text-amber-400' : 'text-red-400'}`} />
                                    <span className={`text-xs font-black uppercase tracking-wider ${
                                      isGood ? 'text-emerald-400' : isOk ? 'text-amber-400' : 'text-red-400'
                                    }`}>Plan Compliance Check</span>
                                  </div>
                                  <span className={`text-lg font-black ${
                                    isGood ? 'text-emerald-400' : isOk ? 'text-amber-400' : 'text-red-400'
                                  }`}>{Math.round(score)}%</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2">
                                  <div className="h-2 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(100, Math.round(score))}%`,
                                      background: isGood ? '#22c55e' : isOk ? '#f59e0b' : '#ef4444' }} />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-3xs">
                                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <span className="text-zinc-500 block">Calories vs Plan ({targetMeal?.type})</span>
                                    <span className={`font-black text-xs ${ Math.abs(calDiff) < 100 ? 'text-emerald-400' : calDiff > 0 ? 'text-red-400' : 'text-amber-400' }`}>
                                      {scannedCals} / {targetCals} kcal
                                      {calDiff !== 0 && <span className="ml-1">({calDiff > 0 ? '+' : ''}{calDiff})</span>}
                                    </span>
                                  </div>
                                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <span className="text-zinc-500 block">Protein vs Plan</span>
                                    <span className={`font-black text-xs ${ Math.abs(protDiff) < 10 ? 'text-emerald-400' : protDiff < 0 ? 'text-amber-400' : 'text-red-400' }`}>
                                      {scannedProt.toFixed(1)} / {targetProt}g
                                      {protDiff !== 0 && <span className="ml-1">({protDiff > 0 ? '+' : ''}{protDiff.toFixed(1)})</span>}
                                    </span>
                                  </div>
                                </div>
                                <p className={`text-xs font-bold ${
                                  isGood ? 'text-emerald-300' : isOk ? 'text-amber-300' : 'text-red-300'
                                }`}>
                                  {isGood ? '✅ Great choice! This meal fits well within your nutrition plan.' :
                                   isOk ? '⚠️ Close match. Minor adjustments may improve compliance.' :
                                   '❌ This meal deviates significantly from your plan. Consider adjusting portions.'}
                                </p>
                              </div>
                            );
                          })()}

                          <button 
                            onClick={handleSaveMeal}
                            className="w-full py-2.5 bg-emerald-500 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-md"
                          >
                            Save Meal to Daily Nutrition Log
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-zinc-600 bg-zinc-900/40 rounded-xl h-full flex items-center justify-center">
                        Upload food image and run scan to calculate portion size and macro breakdowns.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Daily Nutrition Log & Compliance dashboard */}
              {traineeTab === 'compliance' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="p-6 bg-[#0f0f11] border border-zinc-800 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                      <h4 className="font-black text-white text-sm uppercase flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span>Nutrition Progress Report ({nutritionReportRange})</span>
                      </h4>
                      <select 
                        value={nutritionReportRange} 
                        onChange={(e) => setNutritionReportRange(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded text-xs text-white p-1 cursor-pointer outline-none"
                      >
                        <option value="daily">Daily Report</option>
                        <option value="weekly">Weekly Report</option>
                        <option value="monthly">Monthly Report</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="text-zinc-500 block">Average Calories</span>
                        <strong className="text-lg text-white font-black">{nutritionReport?.average_calories || 0} kcal</strong>
                      </div>
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="text-zinc-500 block">Average Protein</span>
                        <strong className="text-lg text-emerald-500 font-black">{nutritionReport?.average_protein || 0}g</strong>
                      </div>
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="text-zinc-500 block">Compliance Rate</span>
                        <strong className="text-lg text-orange-500 font-black">{nutritionReport?.compliance_percentage || 100}%</strong>
                      </div>
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="text-zinc-500 block">Meal Quality Score</span>
                        <strong className="text-lg text-indigo-400 font-black">{nutritionReport?.meal_quality_score || 'Premium'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider pb-2 border-b border-zinc-800">Logged Meals History (Today)</h3>
                    {mealHistory.map((meal) => (
                      <div key={meal.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800/60 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <strong className="text-white text-md block">{meal.meal_type}</strong>
                              <span className="text-zinc-500 text-xs">Logged at {meal.scan_date} • Compliance Rating: </span>
                              <span className={`text-xs font-bold ${
                                meal.compliance_score >= 80 ? 'text-emerald-500' :
                                meal.compliance_score >= 50 ? 'text-orange-500' : 'text-red-500'
                              }`}>{meal.compliance_score}% Match</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleGetSuggestions(meal.id)}
                            className="px-3.5 py-1.5 bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20 font-bold text-xs rounded-lg hover:bg-[#ff6b00]/20 transition flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {loadingSuggestions[meal.id] ? 'Loading AI Suggestions...' : 'Get AI Suggestions'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-zinc-500 block mb-1">Calories:</span>
                            <span className="text-white font-bold">{Math.round(meal.calories)} kcal</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block mb-1">Protein:</span>
                            <span className="text-emerald-500 font-bold">{Math.round(meal.protein)}g</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block mb-1">Carbs:</span>
                            <span className="text-indigo-400 font-bold">{Math.round(meal.carbs)}g</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block mb-1">Fats:</span>
                            <span className="text-orange-500 font-bold">{Math.round(meal.fat)}g</span>
                          </div>
                        </div>

                        <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-xs flex justify-between items-center">
                          <div>
                            <span className="text-zinc-500 font-medium">Coach Review: </span>
                            <strong className={`uppercase font-bold ${
                              meal.review_status === 'approved' ? 'text-emerald-500' :
                              meal.review_status === 'rejected' ? 'text-red-500' : 'text-zinc-400'
                            }`}>{meal.review_status || 'Pending Review'}</strong>
                          </div>
                          {meal.coach_comments && (
                            <span className="text-zinc-300 italic">"{meal.coach_comments}"</span>
                          )}
                        </div>

                        {aiSuggestions[meal.id] && (
                          <div className="p-4 bg-[#ff6b00]/5 border border-[#ff6b00]/10 rounded-xl text-xs space-y-3">
                            <h5 className="font-black text-[#ff6b00] uppercase flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>AI Suggestions & Recommendation Engine</span>
                            </h5>
                            
                            <div className="space-y-2 text-zinc-300">
                              <div>
                                <strong className="block text-white">Healthy Alternatives:</strong>
                                <ul className="list-disc pl-4 space-y-0.5 mt-0.5">
                                  {aiSuggestions[meal.id].healthy_alternatives.map((alt: string, i: number) => (
                                    <li key={i}>{alt}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <strong className="block text-white">Estimated Calorie Reduction:</strong>
                                <span className="text-[#ff6b00] font-bold block mt-0.5">{aiSuggestions[meal.id].estimated_calorie_reduction}</span>
                              </div>
                              <div>
                                <strong className="block text-white">Actionable Tips:</strong>
                                <ul className="list-disc pl-4 space-y-0.5 mt-0.5">
                                  {aiSuggestions[meal.id].better_food_choices.map((tip: string, i: number) => (
                                    <li key={i}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {mealHistory.length === 0 && (
                      <div className="p-8 text-center text-xs text-zinc-600 bg-zinc-900/40 rounded-xl">No meals scanned or logged today yet. Use the Scanner tab.</div>
                    )}
                  </div>
                </div>
              )}
                </>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* COMMON CHAT SYSTEM & CALCULATORS */}
          {/* =================================================================== */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-chat-sidebar>
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f0f11] border border-zinc-800 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Chat Workspace</h3>
                    <span className="text-3xs text-zinc-500 block">Encrypted real-time messaging</span>
                  </div>
                </div>

                {currentUser?.user?.role === 'client' && (
                  <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-bold">
                    <button 
                      onClick={() => handleToggleAiMode(true)} 
                      className={`px-3 py-1 rounded ${isAiMode ? 'bg-[#ff6b00] text-black' : 'text-zinc-400 hover:text-white'}`}
                    >
                      AI Coach
                    </button>
                    <button 
                      onClick={() => handleToggleAiMode(false)} 
                      className={`px-3 py-1 rounded ${!isAiMode ? 'bg-[#ff6b00] text-black' : 'text-zinc-400 hover:text-white'}`}
                    >
                      My Trainer
                    </button>
                  </div>
                )}

                {currentUser?.user?.role === 'coach' && (
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-xs font-medium">Chatting with:</span>
                    <select
                      value={selectedTraineeId}
                      onChange={(e) => {
                        setSelectedTraineeId(e.target.value);
                        setChatMessages([]);
                      }}
                      className="bg-zinc-900 border border-zinc-850 rounded-lg text-xs px-2.5 py-1 text-white font-bold focus:outline-none focus:border-[#ff6b00] cursor-pointer"
                    >
                      {trainees.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="h-64 overflow-y-auto space-y-4 p-2 bg-[#09090b] rounded-xl border border-zinc-900 flex flex-col justify-end">
                <div className="space-y-4 max-h-full overflow-y-auto">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                        msg.sender === 'user' ? 'bg-[#ff6b00] text-black font-semibold rounded-tr-none' : 
                        msg.sender === 'ai' ? 'bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-tl-none' :
                        'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                      }`}>
                        {msg.imageUrl && (
                          <img src={msg.imageUrl} alt="Chat Attachment" className="max-w-xs max-h-48 object-contain rounded-lg mb-2 border border-zinc-800/30" />
                        )}
                        {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}
                      </div>
                      <span className="text-4xs text-zinc-500 px-2.5 mt-1">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {chatSelectedImage && (
                <div className="relative inline-block mb-2 ml-2 animate-fadeIn">
                  <img src={chatSelectedImage} alt="Preview Attachment" className="w-16 h-16 object-cover rounded-lg border border-zinc-800" />
                  <button 
                    onClick={() => setChatSelectedImage(null)} 
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-3xs font-black hover:bg-red-650 transition"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex gap-2 items-center">
                <label className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition flex-shrink-0" title="Attach Image">
                  <Camera className="w-5 h-5" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleChatImageSelect} 
                    className="hidden" 
                  />
                </label>
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder={isAiMode && currentUser?.user?.role === 'client' ? 'Ask AI: "Explain today\'s meal" or "Can I replace chicken with fish?"...' : 'Write message...'}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                />
                <button 
                  onClick={sendChatMessage}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-black font-bold text-sm shadow-lg hover:opacity-90 transition"
                >
                  Send
                </button>
              </div>
            </div>

          </section>
        </main>
      )}

      <datalist id="exercises-list">
        {exerciseLibrary.map((item, keyIdx) => (
          <option key={keyIdx} value={item.name_en} />
        ))}
      </datalist>

      {/* Subscription Assignment Modal */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0f0f11] border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-scaleUp">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="text-md font-black text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#ff6b00]" />
                <span>Assign Subscription Package</span>
              </h3>
              <button 
                onClick={() => setShowSubModal(false)} 
                className="text-zinc-500 hover:text-zinc-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAssignSubscription} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold uppercase block">Package Name</label>
                <input 
                  type="text" 
                  value={subPackageName} 
                  onChange={(e) => setSubPackageName(e.target.value)} 
                  placeholder="e.g. Silver Package, VIP Program" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-[#ff6b00]"
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold uppercase block">Package Type</label>
                  <select 
                    value={subPackageType} 
                    onChange={(e) => setSubPackageType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none cursor-pointer focus:border-[#ff6b00]"
                  >
                    <option value="gym">Gym Plan</option>
                    <option value="online">Online Plan</option>
                    <option value="hybrid">Hybrid Plan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold uppercase block">Price ($)</label>
                  <input 
                    type="number" 
                    value={subPrice} 
                    onChange={(e) => setSubPrice(parseFloat(e.target.value) || 0)} 
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-[#ff6b00]"
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold uppercase block">Total Sessions</label>
                  <input 
                    type="number" 
                    value={subTotalSessions} 
                    disabled={subPackageType === 'online'}
                    onChange={(e) => setSubTotalSessions(parseInt(e.target.value) || 0)} 
                    placeholder={subPackageType === 'online' ? 'N/A' : 'e.g. 12'} 
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-[#ff6b00] disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold uppercase block">Start Date</label>
                  <input 
                    type="date" 
                    value={subStartDate} 
                    onChange={(e) => setSubStartDate(e.target.value)} 
                    className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-[#ff6b00]"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold uppercase block">Expiry End Date</label>
                <input 
                  type="date" 
                  value={subEndDate} 
                  onChange={(e) => setSubEndDate(e.target.value)} 
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-[#ff6b00]"
                  required 
                />
              </div>
              <div className="flex gap-3 pt-2 font-bold text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowSubModal(false)} 
                  className="w-1/2 py-2.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2.5 rounded bg-[#ff6b00] text-black font-black uppercase tracking-wider hover:opacity-90 transition"
                >
                  Assign Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0f0f11] border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-scaleUp">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="text-md font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff6b00]" />
                <span>Save {saveTemplateType === 'workout' ? 'Workout' : 'Diet'} Template</span>
              </h3>
              <button 
                onClick={() => setShowSaveTemplateModal(false)} 
                className="text-zinc-500 hover:text-zinc-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (saveTemplateType === 'workout') {
                  handleSaveWorkoutTemplate(templateNameInput, templateDescInput);
                } else {
                  handleSaveDietTemplate(templateNameInput, templateDescInput);
                }
                setShowSaveTemplateModal(false);
              }} 
              className="space-y-4 text-xs"
            >
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold uppercase block">Template Name</label>
                <input 
                  type="text" 
                  value={templateNameInput} 
                  onChange={(e) => setTemplateNameInput(e.target.value)} 
                  placeholder="e.g. Heavy Push Day split, Low-carb Keto plan" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-[#ff6b00]"
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold uppercase block">Description</label>
                <textarea 
                  value={templateDescInput} 
                  onChange={(e) => setTemplateDescInput(e.target.value)} 
                  placeholder="Describe the target split, food groups, or recommendations..." 
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-[#ff6b00] h-20 resize-none"
                  required 
                />
              </div>
              <div className="flex gap-3 pt-2 font-bold text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowSaveTemplateModal(false)} 
                  className="w-1/2 py-2.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2.5 rounded bg-[#ff6b00] text-black font-black uppercase tracking-wider hover:opacity-90 transition"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {showPaymentModal && selectedPackageForPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0f0f11] border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-scaleUp text-xs text-white">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#ff6b00]" />
                <span>Complete Payment</span>
              </h3>
              <button 
                onClick={() => setShowPaymentModal(false)} 
                className="text-zinc-500 hover:text-zinc-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                <p className="text-zinc-500 font-bold uppercase tracking-wide text-4xs">Package Selected</p>
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>{selectedPackageForPayment.packageName}</span>
                  <span className="text-[#ff6b00]">${selectedPackageForPayment.price}</span>
                </div>
              </div>

              {/* Coach Selection Dropdown */}
              <div className="space-y-2">
                <label className="text-zinc-400 font-bold uppercase block text-3xs">Select Your Coach</label>
                <select
                  value={selectedCoachId}
                  onChange={(e) => setSelectedCoachId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2.5 px-3 text-white text-xs font-bold focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] outline-none"
                >
                  {coachesList.length === 0 ? (
                    <option value="">No coaches available</option>
                  ) : (
                    coachesList.map((coach) => (
                      <option key={coach.id} value={coach.id}>
                        {coach.name} ({coach.email})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-2">
                <label className="text-zinc-400 font-bold uppercase block text-3xs">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Vodafone Cash Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethodSelect('vodafone_cash')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${paymentMethodSelect === 'vodafone_cash' ? 'border-red-500 bg-red-500/5 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'}`}
                  >
                    {/* Vodafone Cash Custom Icon */}
                    <div className="w-8 h-8 rounded-full bg-red-600/10 text-red-500 flex items-center justify-center border border-red-500/20">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-3xs">Vodafone Cash</span>
                  </button>

                  {/* InstaPay Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethodSelect('instapay')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${paymentMethodSelect === 'instapay' ? 'border-[#ff6b00] bg-[#ff6b00]/5 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'}`}
                  >
                    {/* InstaPay Lightning Icon */}
                    <div className="w-8 h-8 rounded-full bg-orange-600/10 text-[#ff6b00] flex items-center justify-center border border-orange-500/20">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-3xs">InstaPay</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Details Display */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 space-y-3 text-center">
                {paymentMethodSelect === 'vodafone_cash' ? (
                  <>
                    <p className="text-zinc-400 font-bold">Please transfer the package amount to the following number (Vodafone Cash):</p>
                    <div className="py-2.5 px-4 bg-zinc-900 rounded-lg border border-zinc-800 inline-block font-mono text-lg font-black text-red-500 tracking-wider">
                      01013305360
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-zinc-400 font-bold">Please transfer the package amount to the following number (InstaPay):</p>
                    <div className="py-2.5 px-4 bg-zinc-900 rounded-lg border border-zinc-800 inline-block font-mono text-lg font-black text-orange-500 tracking-wider">
                      01001920621
                    </div>
                  </>
                )}
                <p className="text-zinc-500 text-3xs leading-relaxed">
                  Once the transfer is successful, take a screenshot of the receipt and upload it in the field below to confirm your subscription.
                </p>
              </div>

              {/* Screenshot Upload Field */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold uppercase block text-3xs">Upload Receipt Screenshot</label>
                <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 transition rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer relative bg-zinc-950 min-h-[100px]">
                  {receiptImage ? (
                    <div className="w-full flex flex-col items-center gap-2">
                      <img src={receiptImage} alt="Receipt Preview" className="h-16 object-contain rounded border border-zinc-800" />
                      <button type="button" onClick={() => setReceiptImage(null)} className="text-3xs text-red-500 font-bold hover:underline">Remove Image</button>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-zinc-500" />
                      <span className="text-zinc-500 text-3xs">Click to browse receipt screenshot</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleReceiptFileSelect} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </>
                  )}
                </div>
              </div>

              {assignError && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-3xs font-semibold">
                  {assignError}
                </div>
              )}

              {/* Triggers */}
              <div className="flex gap-3 pt-2 font-bold text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowPaymentModal(false)} 
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSubmitReceipt}
                  disabled={!receiptImage || submittingReceipt}
                  className="w-1/2 py-2.5 rounded-xl bg-[#ff6b00] text-black font-black uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {submittingReceipt ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Submit Proof'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      <footer className="py-8 text-center text-xs text-zinc-600 bg-[#0b0b0d] border-t border-zinc-900">
        © 2026 {appName}. Built with dynamic Row-Level Security database architecture.
      </footer>
      </div>
    </div>
  );
}
