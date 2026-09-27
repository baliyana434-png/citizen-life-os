'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { validateRealName } from '@/utils/antiFraudValidation';
import { FamilyMember } from '@/types';
import {
  X,
  UserPlus,
  User,
  Calendar,
  Briefcase,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  citizenPhone: string;
  citizenEmail?: string;
  onMemberAdded: (member: FamilyMember) => void;
}

export const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  isOpen,
  onClose,
  citizenPhone,
  citizenEmail,
  onMemberAdded,
}) => {
  const { language } = useTranslation();

  const [relation, setRelation] = useState<'father' | 'mother' | 'spouse' | 'son' | 'daughter' | 'brother' | 'sister' | 'grandparent' | 'other'>('father');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(50);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [lifePhase, setLifePhase] = useState<'college_student' | 'farmer' | 'job_seeker' | 'business_owner' | 'homemaker' | 'senior_citizen' | 'school_student' | 'employed'>('farmer');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Auto-adjust gender and occupation recommendation based on relation
  const handleRelationChange = (newRel: any) => {
    setRelation(newRel);
    if (newRel === 'father') {
      setGender('male');
      setLifePhase('farmer');
      if (!age || age < 35) setAge(52);
    } else if (newRel === 'mother') {
      setGender('female');
      setLifePhase('homemaker');
      if (!age || age < 35) setAge(48);
    } else if (newRel === 'son') {
      setGender('male');
      setLifePhase('college_student');
      if (!age || age > 30) setAge(19);
    } else if (newRel === 'daughter') {
      setGender('female');
      setLifePhase('college_student');
      if (!age || age > 30) setAge(18);
    } else if (newRel === 'spouse') {
      setLifePhase('homemaker');
      if (!age) setAge(25);
    } else if (newRel === 'grandparent') {
      setLifePhase('senior_citizen');
      if (!age || age < 60) setAge(72);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const nameCheck = validateRealName(name, language);
    if (!nameCheck.valid) {
      setErrorMessage(nameCheck.error || 'अमान्य नाम।');
      return;
    }

    const numAge = Number(age);
    if (!numAge || numAge < 1 || numAge > 115) {
      setErrorMessage(language === 'hi' ? 'कृपया 1 से 115 वर्ष के बीच वैध आयु दर्ज करें।' : 'Please enter a valid age between 1 and 115.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        citizenPhone,
        citizenEmail,
        relation,
        name: name.trim(),
        age: numAge,
        gender,
        lifePhase,
        isAadhaarVerified: false,
      };

      const res = await fetch('/api/citizens/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'सदस्य जोड़ने में त्रुटि।');
      }

      setSuccessMessage(
        language === 'hi'
          ? `✓ ${name} को आपके परिवार में सफलतापूर्वक जोड़ दिया गया!`
          : `✓ ${name} successfully added to family profile!`
      );

      const addedMember: FamilyMember = {
        id: data.member.id,
        relation: data.member.relation,
        name: data.member.name,
        age: data.member.age,
        gender: data.member.gender,
        lifePhase: data.member.lifePhase,
        isAadhaarVerified: data.member.isAadhaarVerified,
      };

      onMemberAdded(addedMember);

      setTimeout(() => {
        onClose();
        setName('');
        setSuccessMessage('');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 sm:p-6 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {language === 'hi' ? 'परिवार का नया सदस्य जोड़ें' : 'Add Real Family Member'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'hi'
                ? 'सदस्य की आयु व कार्य अनुसार सटीक सरकारी लाभ अनलॉक होंगे'
                : 'Unlocks tailored government benefits for your family member'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 mb-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Relation Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'नागरिक से रिश्ता (Relation) *' : 'Relationship with Citizen *'}
            </label>
            <select
              value={relation}
              onChange={(e) => handleRelationChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-semibold bg-white"
            >
              <option value="father">{language === 'hi' ? 'पिता (Father)' : 'Father'}</option>
              <option value="mother">{language === 'hi' ? 'माता (Mother)' : 'Mother'}</option>
              <option value="spouse">{language === 'hi' ? 'पति / पत्नी (Spouse)' : 'Spouse'}</option>
              <option value="son">{language === 'hi' ? 'पुत्र (Son)' : 'Son'}</option>
              <option value="daughter">{language === 'hi' ? 'पुत्री (Daughter)' : 'Daughter'}</option>
              <option value="brother">{language === 'hi' ? 'भाई (Brother)' : 'Brother'}</option>
              <option value="sister">{language === 'hi' ? 'बहन (Sister)' : 'Sister'}</option>
              <option value="grandparent">{language === 'hi' ? 'दादा / दादी (Grandparent)' : 'Grandparent'}</option>
              <option value="other">{language === 'hi' ? 'अन्य सम्बन्धी (Other)' : 'Other'}</option>
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'सदस्य का पूरा नाम (Full Name) *' : 'Member Full Name *'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Satish Baliyan"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Age */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'आयु (Age in Years) *' : 'Age *'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  required
                  min={1}
                  max={115}
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'लिंग (Gender) *' : 'Gender *'}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-medium bg-white"
              >
                <option value="male">{language === 'hi' ? 'पुरुष (Male)' : 'Male'}</option>
                <option value="female">{language === 'hi' ? 'महिला (Female)' : 'Female'}</option>
                <option value="other">{language === 'hi' ? 'अन्य (Other)' : 'Other'}</option>
              </select>
            </div>
          </div>

          {/* Life Phase / Occupation */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'व्यवसाय / श्रेणी (Occupation) *' : 'Occupation / Life Phase *'}
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={lifePhase}
                onChange={(e) => setLifePhase(e.target.value as any)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-medium bg-white"
              >
                <option value="farmer">किसान (Farmer / Krishi)</option>
                <option value="homemaker">गृहणी (Homemaker)</option>
                <option value="college_student">कॉलेज छात्र (College Student)</option>
                <option value="school_student">स्कूल छात्र (School Student)</option>
                <option value="job_seeker">प्रतियोगी / रोजगार खोज (Job Seeker)</option>
                <option value="business_owner">व्यापारी / स्व-रोजगार (Business)</option>
                <option value="senior_citizen">वरिष्ठ नागरिक (Senior Citizen)</option>
                <option value="employed">निजी / सरकारी कर्मचारी (Employed)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-emerald-700/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>{language === 'hi' ? 'सदस्य सुरक्षित करें' : 'Save Family Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
