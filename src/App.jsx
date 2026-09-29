import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Screen1StudentIntake } from './components/Screen1StudentIntake';
import { Screen2OfficerConsole } from './components/Screen2OfficerConsole';
import { Screen3StudentTracker } from './components/Screen3StudentTracker';
import { OpenGovDataExplorer } from './components/OpenGovDataExplorer';
import { SEEDED_CASES } from './data/seededCases';
import rulesConfig from './rules/rules-v1.4.2.json';
import { evaluateApplication } from './rules/engine';

export function App() {
  const [currentScreen, setCurrentScreen] = useState('screen2'); // Officer console is the hero screen
  const [activeCaseKey, setActiveCaseKey] = useState('CASE_A');
  const [casesList, setCasesList] = useState(SEEDED_CASES);
  const [lang, setLang] = useState('en');
  const [showGovDataExplorer, setShowGovDataExplorer] = useState(false);

  // Seeded activity entries are illustrative and exist only in this session.
  const [auditLog, setAuditLog] = useState([
    {
      timestamp: '2026-09-29T10:14:02Z',
      officerId: 'DWO-JH-RNC-04 (District Welfare Officer)',
      applicantId: 'APP-JH-2026-00398',
      actionType: 'OFFICER_APPROVED',
      ruleVersion: 'v1.4.2',
      summary: 'Seeded sample activity entry for demonstration; no registry check or NSP submission is represented.'
    },
    {
      timestamp: '2026-09-29T11:42:35Z',
      officerId: 'DWO-JH-RNC-04 (District Welfare Officer)',
      applicantId: 'APP-JH-2026-00401',
      actionType: 'DEFICIENCY_PACKET_SENT',
      ruleVersion: 'v1.4.2',
      summary: 'Seeded sample activity entry for demonstration; no deficiency message was sent.'
    }
  ]);

  // Current active case data
  const activeCase = casesList[activeCaseKey] || casesList['CASE_A'];

  // Current intake form data
  const [intakeFormData, setIntakeFormData] = useState({
    studentName: activeCase.formData.studentName,
    parentName: activeCase.formData.parentName,
    income: activeCase.formData.income,
    state: activeCase.formData.state,
    district: activeCase.formData.district,
    bankAccount: activeCase.formData.bankAccount,
    ifsc: activeCase.formData.ifsc,
    scheme: 'Post-Matric Scholarship for ST Students'
  });

  // Evaluate rule trace live whenever activeCase changes
  const ruleEvaluation = useMemo(() => {
    return evaluateApplication(activeCase, rulesConfig);
  }, [activeCase]);

  // Handle case selection
  const handleSelectCase = (key) => {
    setActiveCaseKey(key);
    const selected = casesList[key];
    if (selected) {
      setIntakeFormData({
        studentName: selected.formData.studentName,
        parentName: selected.formData.parentName,
        income: selected.formData.income,
        state: selected.formData.state,
        district: selected.formData.district,
        bankAccount: selected.formData.bankAccount,
        ifsc: selected.formData.ifsc,
        scheme: 'Post-Matric Scholarship for ST Students'
      });
    }
  };

  // Quick load button handler in Screen 1
  const handleLoadCaseInIntake = (key) => {
    handleSelectCase(key);
  };

  // Submit new application from Screen 1
  const handleSubmitApplication = () => {
    const newCaseId = `APP-DEMO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase = {
      id: newCaseId,
      caseLabel: `Sample intake: ${intakeFormData.studentName || 'Student'} (prototype submission)`,
      lane: 'STANDARD_LANE',
      studentName: intakeFormData.studentName || 'Anonymous Student',
      category: 'Scheduled Tribe (ST)',
      state: intakeFormData.state || 'Jharkhand',
      district: intakeFormData.district || 'Ranchi',
      institute: 'Ranchi University Campus',
      course: 'B.Tech Computer Science',
      scheme: 'Post-Matric Scholarship for ST Students',
      parentName: intakeFormData.parentName || 'Guardian Name',
      dob: '2005-07-15',
      gender: 'Other',
      maskedAadhaar: 'XXXX-XXXX-9912',
      bankDetails: {
        accountNumber: intakeFormData.bankAccount || 'XXXX-XXXX-9912',
        ifsc: intakeFormData.ifsc || 'SBIN0001234',
        bankName: 'State Bank of India',
        npciSeeded: true,
        dbtActive: true,
        seedingDate: '2025-06-12'
      },
      formData: {
        ...intakeFormData
      },
      extractedData: {
        certStudentName: intakeFormData.studentName || 'Anonymous Student',
        certParentName: intakeFormData.parentName || 'Guardian Name',
        casteCommunity: 'Santhal',
        casteCertNo: `JH/ST/2026/${Math.floor(100000 + Math.random() * 900000)}`,
        casteCertIssueDate: '2026-01-10',
        casteIssuingAuthority: 'Circle Officer, Ranchi',
        income: intakeFormData.income || 180000,
        incomeCertNo: `JH/INC/2026/${Math.floor(100000 + Math.random() * 900000)}`,
        incomeCertIssueDate: '2026-03-14',
        incomeIssuingAuthority: 'Circle Officer, Ranchi',
        qrCodeVerified: true
      },
      fraudMetadata: {
        sharedBankCount: 1,
        sharedPhoneCount: 1,
        ipClusterCount: 1,
        isSyndicateFlagged: false,
        riskScore: 0.05
      },
      currentDesk: {
        deskName: 'District Nodal Officer (DNO)',
        officerTitle: 'District Welfare Officer, Ranchi',
        assignedDate: '2026-09-29',
        slaDaysAllowed: 7,
        daysElapsed: 0,
        dueDate: '2026-10-06',
        statusText: 'Demo file prepared in this browser · officer review preview'
      },
      documents: {
        casteCertUrl: "/certificates/caste_cert_ramesh_soren.png",
        incomeCertUrl: "/certificates/income_cert_ramesh_soren.png",
        casteCertNo: `JH/ST/2026/${Math.floor(100000 + Math.random() * 900000)}`,
        incomeCertNo: `JH/INC/2026/${Math.floor(100000 + Math.random() * 900000)}`,
        casteTitle: "Jharkhand Scheduled Tribe Certificate",
        incomeTitle: "Annual Income Assessment Certificate",
        jharSewaRef: `JH-EDIST-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        digitalSignatory: "Sub-Divisional Officer, Ranchi Sadar",
        signDate: "2026-01-10T11:20:00Z"
      },
      simulatedBoundingBoxes: {
        caste: [
          { id: 'c1', label: 'Student Name', text: intakeFormData.studentName || 'Student', x: 28, y: 38, w: 25, h: 4, conf: 0.99 },
          { id: 'c2', label: 'Parent Name', text: intakeFormData.parentName || 'Guardian', x: 58, y: 38, w: 24, h: 4, conf: 0.98 },
          { id: 'c3', label: 'Community', text: 'Santhal (ST)', x: 28, y: 50, w: 22, h: 4.5, conf: 0.99 },
          { id: 'c4', label: 'Certificate No', text: 'JH/ST/2026/LIVE', x: 28, y: 22, w: 28, h: 3.5, conf: 0.97 },
          { id: 'c5', label: 'Authority', text: 'Sub-Divisional Officer', x: 55, y: 82, w: 38, h: 5, conf: 0.96 }
        ],
        income: [
          { id: 'i1', label: 'Annual Income', text: `₹ ${Number(intakeFormData.income || 180000).toLocaleString('en-IN')}/-`, x: 42, y: 52, w: 24, h: 4.5, conf: 0.99 },
          { id: 'i2', label: 'Applicant Name', text: intakeFormData.studentName || 'Student', x: 28, y: 36, w: 25, h: 4, conf: 0.98 },
          { id: 'i3', label: 'Issue Date', text: '14-03-2026', x: 70, y: 22, w: 18, h: 3.5, conf: 0.98 },
          { id: 'i4', label: 'Authority', text: 'Circle Officer', x: 55, y: 80, w: 36, h: 5.5, conf: 0.95 }
        ]
      }
    };

    setCasesList(prev => ({
      ...prev,
      [newCaseId]: newCase
    }));
    setActiveCaseKey(newCaseId);
    setCurrentScreen('screen2'); // Direct route to Officer console
  };

  // Record an officer audit action
  const handleRecordAuditAction = ({ actionType, applicantId, applicantName, ruleVersion, summary, lane }) => {
    const newEntry = {
      timestamp: new Date().toISOString(),
      officerId: 'DWO-JH-RNC-04 (District Welfare Officer)',
      applicantId,
      actionType,
      ruleVersion,
      summary: `[${applicantName}] ${summary}`
    };

    setAuditLog(prev => [newEntry, ...prev]);
  };

  return (
    <div className="udaan-app min-h-screen flex flex-col">
      <a className="skip-link" href="#main-content">Skip to current workspace</a>
      <Header
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        lang={lang}
        onToggleLang={() => setLang(prev => (prev === 'en' ? 'hi' : 'en'))}
        onOpenGovData={() => setShowGovDataExplorer(true)}
      />

      {/* Real Open Government Data (OGD) Explorer Modal */}
      <OpenGovDataExplorer
        isOpen={showGovDataExplorer}
        onClose={() => setShowGovDataExplorer(false)}
      />

      <main id="main-content" className="workspace-main flex-1 pb-12" tabIndex="-1">
        {currentScreen === 'screen1' && (
          <Screen1StudentIntake
            formData={intakeFormData}
            setFormData={setIntakeFormData}
            onLoadCase={handleLoadCaseInIntake}
            onSubmitApplication={handleSubmitApplication}
            lang={lang}
            activeCase={activeCase}
          />
        )}

        {currentScreen === 'screen2' && (
          <Screen2OfficerConsole
            activeCase={activeCase}
            casesList={casesList}
            onSelectCase={handleSelectCase}
            ruleEvaluation={ruleEvaluation}
            auditLog={auditLog}
            onRecordAuditAction={handleRecordAuditAction}
            lang={lang}
          />
        )}

        {currentScreen === 'screen3' && (
          <Screen3StudentTracker
            activeCase={activeCase}
            lang={lang}
          />
        )}
      </main>

      {/* Government Footer */}
      <footer className="register-footer">
        <div><strong>Udaan (उड़ान)</strong> · MoTA problem statement SIH26239</div>
        <div>Decision support for NSP · synthetic prototype data · officer retains decision authority</div>
      </footer>
    </div>
  );
}
export default App;
