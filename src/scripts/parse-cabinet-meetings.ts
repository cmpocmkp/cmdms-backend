import * as fs from 'fs';
import * as path from 'path';

interface AgendaItem {
    meetingNumber: string;
    meetingDate: string;
    agendaType: string;
    agendaNumber: string;
    title: string;
    decision: string;
    progressSoFar: string;
    departments: string;
    deptStatus: string;
    cmOfficeStatus: string;
    timeline: string;
    status: string;
}

const agendaItems: AgendaItem[] = [
    // 44th Meeting - 29.12.2025
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '01',
        title: 'REQUEST FOR SUPPLEMENTARY GRANT OF RS. 3825.176 MILLION FOR ADP 2025-26 SCHEME NO. 140150 TITLED "KP SAFE CITIES PROJECT"',
        decision: '-',
        progressSoFar: '-',
        departments: 'Home & Tribal Affairs',
        deptStatus: 'Completed',
        cmOfficeStatus: 'On Target',
        timeline: '07/01/2026 - Remaining 0 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '02',
        title: 'REPORT OF THE CABINET\'S COMMITTEE CONSTITUTED VIDE ESTABLISHMENT DEPARTMENT NOTIFICATION NO. SOC(E7AD)9-26/2025 DATED 05-03-2025',
        decision: '-',
        progressSoFar: '-',
        departments: 'Home & Tribal Affairs',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '23/01/2026 - Remaining 16 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '03',
        title: 'DISTRIBUTION POLICY OF RESERVED SEATS IN MEDICAL/DENTAL COLLEGES FOR ERSTWHILE FATA CANDIDATES',
        decision: '-',
        progressSoFar: '-',
        departments: 'Home & Tribal Affairs',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '09/01/2026 - Remaining 2 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '04',
        title: 'REQUEST FOR COLLABORATION AND FINANCIAL SUPPORT OF RS. 25 MILLION FOR "THE PAKISTAN POPULATION SUMMIT 2025"',
        decision: 'Ex-post facto sanction granted.',
        progressSoFar: '-',
        departments: 'Finance',
        deptStatus: '',
        cmOfficeStatus: 'Completed',
        timeline: '06/01/2026',
        status: 'Completed'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '05',
        title: 'ESTABLISHMENT OF KHYBER PAKHTUNKHWA NATIONAL FINANCE COMMISSION (NFC) CELL AT SIDB PLAZA',
        decision: '-',
        progressSoFar: '-',
        departments: 'Finance',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '16/01/2026 - Remaining 9 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '06',
        title: 'FORMATION OF KHYBER PAKHTUNKHWA TAKAFUL COMPANY',
        decision: '-',
        progressSoFar: '-',
        departments: 'Finance',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '16/01/2026 - Remaining 9 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '07',
        title: 'RECONSTITUTION OF KHYBER PAKHTUNKHWA TRADE TESTING BOARD (KP-TTB)',
        decision: '-',
        progressSoFar: '-',
        departments: 'Industries',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '14/01/2026 - Remaining 7 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '08',
        title: 'PROVISION OF FUNDS FOR OFFSITE INFRASTRUCTURE AND SECURITY ENABLERS FOR RASHAKAI SEZ',
        decision: '-',
        progressSoFar: 'Case taken up with FD on 02.01.2025',
        departments: 'Finance, Industries',
        deptStatus: 'Completed (Industries)',
        cmOfficeStatus: 'On Target',
        timeline: '16/01/2026 - Remaining 9 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '09',
        title: 'GRANT-IN-AID AMOUNTING TO RS. 168.10 MILLION TO KP EDUCATION FOUNDATION',
        decision: '-',
        progressSoFar: '-',
        departments: 'Higher Education',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '06/01/2026 - Remaining 0 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '10',
        title: 'REPLACEMENT OF 25 CONDEMNED VEHICLES FOR DISTRICT & SESSIONS JUDGES',
        decision: '-',
        progressSoFar: 'Case taken up with FD on 02.01.2025',
        departments: 'Law, Finance',
        deptStatus: 'Completed (Law)',
        cmOfficeStatus: 'On Target',
        timeline: '20/01/2026 - Remaining 13 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '11',
        title: 'RELAXATION OF BAN ON PURCHASE OF VEHICLE (JUSTICE (R) FAZAL SUBHAN)',
        decision: '-',
        progressSoFar: 'Case taken up with FD on 02.01.2026',
        departments: 'Law, Finance',
        deptStatus: 'Completed (Law)',
        cmOfficeStatus: 'On Target',
        timeline: '20/01/2026 - Remaining 13 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '12',
        title: 'BUDGET ESTIMATES FOR 2025-26 OF KP HOUSING AUTHORITY',
        decision: 'Budget approved.',
        progressSoFar: '-',
        departments: 'Housing',
        deptStatus: 'Completed',
        cmOfficeStatus: 'Completed',
        timeline: '06/01/2026',
        status: 'Completed'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '13',
        title: 'RELAXATION OF BAN ON PURCHASE OF VEHICLE FOR GRAVITY FLOW WATER SUPPLY SCHEME',
        decision: '-',
        progressSoFar: '-',
        departments: 'PHE',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '16/01/2026 - Remaining 9 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '14',
        title: 'NATIONAL ULEMA & MASHAIKH COUNCIL BILL 2025',
        decision: '-',
        progressSoFar: '-',
        departments: 'Auqaf',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '06/01/2026 - Remaining 0 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '15',
        title: 'SPECIAL COMPENSATION SHUHADA PACKAGE FOR MAULANA FAZAL REHMAN',
        decision: '-',
        progressSoFar: '-',
        departments: 'Auqaf',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '06/01/2026 - Remaining 0 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '16',
        title: 'REQUEST FOR CHANGE OF NOMENCLATURE OF ADP SCHEME CONSTRUCTION OF ROAD FROM KUZA BANDAI',
        decision: '-',
        progressSoFar: '-',
        departments: 'C & W',
        deptStatus: 'Completed',
        cmOfficeStatus: 'On Target',
        timeline: '15/01/2026 - Remaining 8 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '17',
        title: 'CHANGE OF NOMENCLATURE IN RESPECT OF ADP 2025-26 SCHEME',
        decision: '-',
        progressSoFar: '-',
        departments: 'E & SE',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '06/01/2026 - Remaining 0 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '18',
        title: 'CHANGE IN NOMENCLATURE OF ADP SCHEME ESTABLISHMENT OF GIRLS CADET COLLEGE D.I.KHAN',
        decision: '-',
        progressSoFar: '-',
        departments: 'E & SE',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '23/01/2026 - Remaining 16 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '19',
        title: 'EDUCATION INTERNSHIP PROGRAM (EIP) UNDER GOOD GOVERNANCE ROADMAP',
        decision: '-',
        progressSoFar: '-',
        departments: 'E & SE',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '30/01/2026 - Remaining 23 days',
        status: 'On Target'
    },
    {
        meetingNumber: '44',
        meetingDate: '29.12.2025',
        agendaType: 'AGENDA ITEM',
        agendaNumber: '20',
        title: 'RE-ENGAGEMENT OF SCHOOL LEADERS ON CONTRACT BASIS',
        decision: '-',
        progressSoFar: '-',
        departments: 'E & SE',
        deptStatus: '',
        cmOfficeStatus: 'On Target',
        timeline: '09/01/2026 - Remaining 2 days',
        status: 'On Target'
    }
];

// Generate CSV
function generateCSV() {
    const headers = [
        'Meeting Number',
        'Meeting Date',
        'Agenda Type',
        'Agenda Number',
        'Title',
        'Decision',
        'Progress So Far',
        'Departments',
        'Dept Status',
        'CM Office Status',
        'Timeline',
        'Status'
    ];

    const csvRows = [headers.join(',')];

    agendaItems.forEach(item => {
        const row = [
            item.meetingNumber,
            item.meetingDate,
            item.agendaType,
            item.agendaNumber,
            `"${item.title.replace(/"/g, '""')}"`,
            `"${item.decision.replace(/"/g, '""')}"`,
            `"${item.progressSoFar.replace(/"/g, '""')}"`,
            `"${item.departments.replace(/"/g, '""')}"`,
            `"${item.deptStatus.replace(/"/g, '""')}"`,
            `"${item.cmOfficeStatus.replace(/"/g, '""')}"`,
            `"${item.timeline.replace(/"/g, '""')}"`,
            item.status
        ];
        csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const outputPath = path.join(__dirname, '../../cabinet_meetings.csv');

    fs.writeFileSync(outputPath, csvContent, 'utf-8');
    console.log(`CSV file generated: ${outputPath}`);
    console.log(`Total agenda items: ${agendaItems.length}`);
}

generateCSV();
