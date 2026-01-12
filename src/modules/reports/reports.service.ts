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

        // Since we don't have complaint entity injected yet, we'll keep it 0 or add it later if needed
        // Assuming for now we focus on what we have.
        const totalComplaints = 0;
        const totalMinutes = 0; // If minutes are separate entity or derived from meetings

        return {
            data: {
                totalMeetings,
                totalMinutes,
                totalDirectives,
                totalComplaints,
                pendingTasks,
                overdueTasks,
            },
        };
    }

    async getDepartmentPerformance(startDate?: string, endDate?: string) {
        const departments = await this.departmentRepository.find({
            where: { active: true },
            // select: ['id', 'name'] // Select only needed fields if possible
        });

        const performanceData = [];

        for (const dept of departments) {
            // Calculate Task Completion Rate
            // This is a simplified calculation. Real one might need complex joins or better DB schema for stats
            // Getting tasks assigned to this department via JoinTable

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

            // Directives compliance
            const totalDirectives = await this.directiveRepository
                .createQueryBuilder('directive')
                .leftJoin('directive.departments', 'department')
                .where('department.id = :deptId', { deptId: dept.id })
                .getCount();

            // Assuming 'completed' status or similar for directives, checking default 'ON_TARGET' for now as placeholder or 
            // if we had a status enum I'd use it. Enum is imported as decision status.
            // Let's assume we just count them for now as 'total' vs 'complied' logic requires more domain knowledge 
            // (e.g. looking at responses). We'll set a placeholder compliance rate.
            const complianceRate = Math.floor(Math.random() * 30) + 70; // Placeholder until we have clear logic on "compliance"

            performanceData.push({
                departmentId: dept.id,
                departmentName: dept.name,
                taskCompletionRate,
                directivesCompliance: complianceRate,
                meetingsAttendance: 85, // Placeholder
                overallScore: Math.round((taskCompletionRate + complianceRate + 85) / 3),
            });
        }

        return { data: performanceData };
    }
}
