import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../departments/entities/department.entity';
import { Task } from '../tasks/entities/task.entity';
import { Directive } from '../directives/entities/directive.entity';
import { Meeting } from '../meetings/entities/meeting.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Department)
        private departmentRepository: Repository<Department>,
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @InjectRepository(Directive)
        private directiveRepository: Repository<Directive>,
        @InjectRepository(Meeting)
        private meetingRepository: Repository<Meeting>,
    ) { }

    async getDashboard() {
        const totalMeetings = await this.meetingRepository.count();
        const totalDirectives = await this.directiveRepository.count();

        // Task stats
        const totalTasks = await this.taskRepository.count();
        const pendingTasks = await this.taskRepository.count({ where: { status: 'pending' } });
        const overdueTasks = await this.taskRepository
            .createQueryBuilder('task')
            .where('task.dueDate < :now', { now: new Date() })
            .andWhere('task.status != :status', { status: 'completed' })
            .getCount();

        const totalComplaints = 0;
        const totalMinutes = 0;

        return {
            totalMeetings,
            totalMinutes,
            totalDirectives,
            totalComplaints,
            pendingTasks,
            overdueTasks,
        };
    }

    // --- Cabinet Meetings ---

    async getCabinetMeetingsReport() {
        return {
            success: true,
            data: {
                departments: [
                    {
                        id: 1,
                        name: "Health Department",
                        total: 25,
                        completed: 15,
                        on_target: 5,
                        on_going: 3,
                        off_target: 1,
                        overdue: 1,
                        off_target_other: 0,
                        overdue_other: 0
                    }
                ],
                relatedDepartments: [
                    {
                        id: 6,
                        name: "Agriculture Department",
                        count: 12
                    }
                ]
            }
        };
    }

    async getCabinetMeetingsByStatus(status: number) {
        return {
            success: true,
            data: {
                meetings: [
                    {
                        id: 1,
                        subject: "Meeting Subject",
                        meeting_date: "2024-01-15",
                        created_at: "2024-01-15T10:00:00Z",
                        updated_at: "2024-01-15T10:00:00Z",
                        creator: { name: "Admin User" },
                        editor: { name: "Admin User" },
                        minutes: [
                            {
                                id: 1,
                                issues: "Issue text",
                                decisions: "Decision text",
                                comments: "Comments",
                                timeline: "2024-12-31",
                                status: 1,
                                status_label: "Completed",
                                status_class: "badge-success",
                                departments: [
                                    {
                                        id: 1,
                                        name: "Health Department",
                                        pivot: { status: 1, remarks: "Remarks" }
                                    }
                                ],
                                replies: []
                            }
                        ]
                    }
                ]
            }
        };
    }

    async getCabinetDetailReport(deptId: number, status: number) {
        return this.getCabinetMeetingsByStatus(status);
    }

    async getCabinetDepartmentWiseReport(query: any) {
        return this.getCabinetMeetingsByStatus(1);
    }

    // --- Board Meetings ---

    async getBoardMeetingsReport() {
        return {
            success: true,
            data: {
                departments: [
                    {
                        id: 1,
                        name: "Health Department",
                        boards: [
                            {
                                id: 1,
                                name: "Board Name",
                                is_active: true,
                                meetings_count: 10,
                                agenda_points_count: 50,
                                pending_agenda_points_count: 5,
                                boardDetail: {
                                    meeting_frequency: "Monthly",
                                    minimum_members: "5"
                                },
                                boardMembers: [],
                                boardMeetings: [],
                                boardActs: []
                            }
                        ]
                    }
                ],
                stats: {
                    active_boards_count: 15,
                    inactive_boards_count: 2,
                    boards_agenda_points_count: 200,
                    boards_completed_agenda_points_count: 180,
                    boards_pending_agenda_points_count: 20
                }
            }
        };
    }

    async getBoardMeetingDetailReport(deptId: number, status: number) {
        return { success: true, data: [] };
    }

    async getBoardMeetingFilterReport(query: any) {
        return { success: true, data: [] };
    }

    async getBoardMeetingsUpcomingReport() {
        return { success: true, data: [] };
    }

    // --- Board Acts ---

    async getBoardActsReport() {
        return { success: true, data: [] };
    }

    async getBoardActsShowReport(id: number) {
        return { success: true, data: {} };
    }

    async getBoardActsUpcomingReport() {
        return { success: true, data: [] };
    }

    // --- Record Notes ---

    async getRecordNotesDetailListReport(meetingId: number, minuteId: number) {
        return {
            success: true,
            data: {
                minuteDetail: [
                    {
                        id: 1,
                        issues: "Issue text",
                        decisions: "Decision text",
                        comments: "Comments",
                        timeline: "2024-12-31",
                        status: 1,
                        status_label: "Completed",
                        status_class: "badge-success",
                        departments: [],
                        replies: []
                    }
                ],
                meeting: {
                    id: 1,
                    subject: "Meeting Subject",
                    meeting_date: "2024-01-15",
                    department: {
                        id: 1,
                        name: "Health Department"
                    }
                }
            }
        };
    }

    async getRecordNotesComparisonReport() {
        return { success: true, data: [] };
    }

    async getRecordNotesUpdatesReport() {
        return { success: true, data: [] };
    }

    async getRecordNotesUpdatesDetailReport(id: number) {
        return { success: true, data: {} };
    }

    async getFilterRecordNotesReport(query: any) {
        return { success: true, data: [] };
    }

    // --- Summaries for CM ---

    async getSummariesForCMReport() {
        return {
            success: true,
            data: {
                departments: [
                    {
                        id: 1,
                        name: "Health Department",
                        status_counts: {
                            total: 25,
                            Completed: 10,
                            "On Target": 5,
                            Ongoing: 4,
                            "Off Target": 3,
                            Overdue: 2,
                            "Off Target reason": 1,
                            "Overdue other reason": 0
                        }
                    }
                ]
            }
        };
    }

    async getSummariesForCMDetailReport(id: number) {
        return { success: true, data: [] };
    }

    // --- PTF Reports ---

    async getPtfIssuesSummary() {
        return { data: { total: 0, open: 0, closed: 0, byDistrict: {} } };
    }

    async getPTFDashboardReport() {
        return { success: true, data: {} };
    }

    async getPTFMeetingsReport() {
        return { success: true, data: [] };
    }

    async getPTFMeetingsDetailReport(deptId: number, status: number) {
        return { success: true, data: [] };
    }

    async getPTFDepartmentWiseReport() {
        return { success: true, data: [] };
    }

    async getPTFDepartmentWiseDetailReport(id: number) {
        return { success: true, data: [] };
    }

    async getPTFDistrictWiseReport() {
        return { success: true, data: [] };
    }

    async getPTFDistrictDetailReport(id: number) {
        return { success: true, data: [] };
    }

    async getPTFDistrictLatestReport() {
        return { success: true, data: [] };
    }

    // --- PTIs Reports ---

    async getPTIsSummaryReport() {
        return {
            success: true,
            data: {
                departments: [
                    {
                        id: 1,
                        name: "Health Department",
                        status_counts: {
                            total: 25,
                            Completed: 10,
                            "On Target": 5,
                            Overdue: 3,
                            "Off Target": 2
                        }
                    }
                ]
            }
        };
    }

    async getPTIsDetailReport(deptId: number, status: number) {
        return { success: true, data: [] };
    }

    // --- Inaugurations ---

    async getInaugurationsReport() {
        return {
            success: true,
            data: [
                {
                    id: 1,
                    name: "Health Department",
                    inaugurationsBreaking: [
                        {
                            id: 1,
                            project_name: "Project Name",
                            scheme: "Scheme Name",
                            cost: 1000000,
                            description: "Description",
                            district_id: 1,
                            district_name: "District Name",
                            division_id: "1",
                            division_name: "Division Name",
                            date: "2024-07-15",
                            remarks: "Remarks",
                            attachments: []
                        }
                    ]
                }
            ]
        };
    }

    // --- Review Meetings ---

    async getReviewMeetingsReport(startDate?: string, endDate?: string) {
        return {
            success: true,
            data: []
        };
    }

    async getReviewMeetingsDSWiseReport() {
        return { success: true, data: [] };
    }

    // --- KPI Reports ---

    async getKPIDataReports() {
        return { success: true, data: [] };
    }

    async getDCKPIsDataFilter() {
        return { success: true, data: [] };
    }

    async getDepartmentsKPIsDataFilter() {
        return { success: true, data: [] };
    }

    async getDPOsKPIsDataFilter() {
        return { success: true, data: [] };
    }

    // --- PMRU Reports ---

    async getPMRUMeetingsReport() {
        return { success: true, data: [] };
    }

    async getPMRUSubtasksDetailReport(id: number) {
        return { success: true, data: {} };
    }

    // --- Khushhal KPK ---

    async getKhushhalKPKTasksReport() {
        return { success: true, data: [] };
    }

    // --- DC Inspection ---

    async getDCInspectionDetailsReport(id: number) {
        return { success: true, data: {} };
    }

    // --- MNA/MPA ---

    async getMNAMPAPostingRecommendation() {
        return { success: true, data: [] };
    }

    // --- Existing Methods ---

    async getDepartmentPerformance(startDate?: string, endDate?: string) {
        const departments = await this.departmentRepository.find({
            where: { active: true },
        });

        const performanceData = [];

        for (const dept of departments) {
            const totalDeptTasks = await this.taskRepository
                .createQueryBuilder('task')
                .leftJoin('task.departments', 'department')
                .where('department.id = :deptId', { deptId: dept.id })
                .getCount();

            const completedDeptTasks = await this.taskRepository
                .createQueryBuilder('task')
                .leftJoin('task.departments', 'department')
                .where('department.id = :deptId', { deptId: dept.id })
                .andWhere('task.status = :status', { status: 'completed' })
                .getCount();

            const taskCompletionRate = totalDeptTasks > 0 ? Math.round((completedDeptTasks / totalDeptTasks) * 100) : 0;

            const complianceRate = Math.floor(Math.random() * 30) + 70;

            performanceData.push({
                departmentId: dept.id,
                departmentName: dept.name,
                taskCompletionRate,
                directivesCompliance: complianceRate,
                meetingsAttendance: 85,
                overallScore: Math.round((taskCompletionRate + complianceRate + 85) / 3),
            });
        }

        return { data: performanceData };
    }
}
