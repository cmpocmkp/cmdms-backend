import { Controller, Get, Query, UseGuards, ParseIntPipe, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  // Dashboard Analytics
  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard summary statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics and KPIs' })
  async getDashboard() {
    return this.reportsService.getDashboard();
  }

  // Meeting Reports
  @Get('meetings/summary')
  @ApiOperation({ summary: 'Get meetings summary report' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'meetingType', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Meetings summary with statistics' })
  async getMeetingsSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('meetingType') meetingType?: string
  ) {
    return { data: { totalMeetings: 0, byType: {}, byMonth: {} } };
  }

  @Get('minutes/status-summary')
  @ApiOperation({ summary: 'Get minutes status summary' })
  @ApiQuery({ name: 'departmentId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Minutes grouped by status' })
  async getMinutesStatusSummary(@Query('departmentId', ParseIntPipe) departmentId?: number) {
    return { data: { ongoing: 0, completed: 0, delayed: 0, cancelled: 0 } };
  }

  // Cabinet Meetings Reports
  @Get('cabinet-meetings')
  @ApiOperation({ summary: 'Get cabinet meetings report' })
  async getCabinetMeetingsReport() {
    return this.reportsService.getCabinetMeetingsReport();
  }

  @Get('cabinet-meetings/by-status')
  @ApiOperation({ summary: 'Get cabinet meetings by status' })
  async getCabinetMeetingsByStatus(@Query('status') status: number) {
    return this.reportsService.getCabinetMeetingsByStatus(status);
  }

  @Get('cabinet-meetings/detail/:deptid/:stat')
  @ApiOperation({ summary: 'Get cabinet detail report' })
  async getCabinetDetailReport(@Param('deptid') deptId: number, @Param('stat') status: number) {
    return this.reportsService.getCabinetDetailReport(deptId, status);
  }

  @Get('cabinet-meetings/department-wise')
  @ApiOperation({ summary: 'Get cabinet department-wise report' })
  async getCabinetDepartmentWiseReport(@Query() query: any) {
    return this.reportsService.getCabinetDepartmentWiseReport(query);
  }

  // Board Meetings Reports
  @Get('board-meetings')
  @ApiOperation({ summary: 'Get board meetings report' })
  async getBoardMeetingsReport() {
    return this.reportsService.getBoardMeetingsReport();
  }

  @Get('board-meetings/detail/:deptid/:stat')
  @ApiOperation({ summary: 'Get board meeting detail report' })
  async getBoardMeetingDetailReport(@Param('deptid') deptId: number, @Param('stat') status: number) {
    return this.reportsService.getBoardMeetingDetailReport(deptId, status);
  }

  @Get('board-meetings/filter')
  @ApiOperation({ summary: 'Get board meeting filter report' })
  async getBoardMeetingFilterReport(@Query() query: any) {
    return this.reportsService.getBoardMeetingFilterReport(query);
  }

  @Get('board-meetings/upcoming')
  @ApiOperation({ summary: 'Get upcoming board meetings report' })
  async getBoardMeetingsUpcomingReport() {
    return this.reportsService.getBoardMeetingsUpcomingReport();
  }

  // Board Acts Reports
  @Get('board-acts')
  @ApiOperation({ summary: 'Get board acts report' })
  async getBoardActsReport() {
    return this.reportsService.getBoardActsReport();
  }

  @Get('board-acts/:id')
  @ApiOperation({ summary: 'Get board act details' })
  async getBoardActsShowReport(@Param('id') id: number) {
    return this.reportsService.getBoardActsShowReport(id);
  }

  @Get('board-acts/upcoming/list') // Modified route to avoid conflict with :id
  @ApiOperation({ summary: 'Get upcoming board acts report' })
  async getBoardActsUpcomingReport() {
    return this.reportsService.getBoardActsUpcomingReport();
  }

  // Record Notes (Minutes) Reports
  @Get('record-notes/detail-list/:meeting/:minute')
  @ApiOperation({ summary: 'Get record notes detail list report' })
  async getRecordNotesDetailListReport(@Param('meeting') meetingId: number, @Param('minute') minuteId: number) {
    return this.reportsService.getRecordNotesDetailListReport(meetingId, minuteId);
  }

  @Get('record-notes/comparison')
  @ApiOperation({ summary: 'Get record notes comparison report' })
  async getRecordNotesComparisonReport() {
    return this.reportsService.getRecordNotesComparisonReport();
  }

  @Get('record-notes/updates')
  @ApiOperation({ summary: 'Get record notes updates report' })
  async getRecordNotesUpdatesReport() {
    return this.reportsService.getRecordNotesUpdatesReport();
  }

  @Get('record-notes/updates/detail/:id')
  @ApiOperation({ summary: 'Get record notes updates detail report' })
  async getRecordNotesUpdatesDetailReport(@Param('id') id: number) {
    return this.reportsService.getRecordNotesUpdatesDetailReport(id);
  }

  @Get('record-notes/filter')
  @ApiOperation({ summary: 'Get filter record notes report' })
  async getFilterRecordNotesReport(@Query() query: any) {
    return this.reportsService.getFilterRecordNotesReport(query);
  }

  // Summaries for CM
  @Get('summaries/cm/summary')
  @ApiOperation({ summary: 'Get summaries for CM summary report' })
  async getSummariesForCMReport() {
    return this.reportsService.getSummariesForCMReport();
  }

  @Get('summaries/cm/detail/:id')
  @ApiOperation({ summary: 'Get summaries for CM detail report' })
  async getSummariesForCMDetailReport(@Param('id') id: number) {
    return this.reportsService.getSummariesForCMDetailReport(id);
  }

  // Department Performance
  @Get('departments/performance')
  @ApiOperation({ summary: 'Get department performance metrics' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Department-wise performance metrics' })
  async getDepartmentPerformance(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.reportsService.getDepartmentPerformance(startDate, endDate);
  }

  // Compliance Reports
  @Get('compliance/directives')
  @ApiOperation({ summary: 'Get directives compliance report' })
  @ApiQuery({ name: 'departmentId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Directives compliance status by department' })
  async getDirectivesCompliance(@Query('departmentId', ParseIntPipe) departmentId?: number) {
    return { data: { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 } };
  }

  @Get('compliance/timelines')
  @ApiOperation({ summary: 'Get timeline compliance report' })
  @ApiResponse({ status: 200, description: 'Timeline compliance across all decision items' })
  async getTimelineCompliance() {
    return { data: { onTime: 0, delayed: 0, extended: 0 } };
  }

  // Task Reports
  @Get('tasks/overview')
  @ApiOperation({ summary: 'Get tasks overview' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'departmentId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Tasks overview with status breakdown' })
  async getTasksOverview(
    @Query('userId', ParseIntPipe) userId?: number,
    @Query('departmentId', ParseIntPipe) departmentId?: number
  ) {
    return { data: { total: 0, pending: 0, inProgress: 0, completed: 0 } };
  }

  // Complaint Reports
  @Get('complaints/stats')
  @ApiOperation({ summary: 'Get complaints statistics' })
  @ApiQuery({ name: 'districtId', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Complaints statistics and resolution rates' })
  async getComplaintsStats(
    @Query('districtId', ParseIntPipe) districtId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return { data: { total: 0, resolved: 0, pending: 0, resolutionRate: 0 } };
  }

  // KPI Reports
  @Get('kpi/summary')
  @ApiOperation({ summary: 'Get KPI summary report' })
  @ApiQuery({ name: 'departmentId', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'KPI performance summary' })
  async getKpiSummary(
    @Query('departmentId', ParseIntPipe) departmentId?: number,
    @Query('year', ParseIntPipe) year?: number
  ) {
    return { data: [] };
  }

  // Scheme Reports
  @Get('schemes/financial-summary')
  @ApiOperation({ summary: 'Get development schemes financial summary' })
  @ApiQuery({ name: 'departmentId', required: false, type: Number })
  @ApiQuery({ name: 'financialYear', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Financial summary of development schemes' })
  async getSchemesFinancialSummary(
    @Query('departmentId', ParseIntPipe) departmentId?: number,
    @Query('financialYear') financialYear?: string
  ) {
    return { data: { totalBudget: 0, totalExpenditure: 0, utilization: 0 } };
  }

  @Get('schemes/progress')
  @ApiOperation({ summary: 'Get schemes progress report' })
  @ApiQuery({ name: 'status', required: false, enum: ['Pending', 'Approved', 'Ongoing', 'Completed'] })
  @ApiResponse({ status: 200, description: 'Schemes progress tracking' })
  async getSchemesProgress(@Query('status') status?: string) {
    return { data: [] };
  }

  // PTF Reports
  @Get('ptf/dashboard')
  @ApiOperation({ summary: 'Get PTF dashboard report' })
  async getPTFDashboardReport() {
    return this.reportsService.getPTFDashboardReport();
  }

  @Get('ptf/meetings')
  @ApiOperation({ summary: 'Get PTF meetings report' })
  async getPTFMeetingsReport() {
    return this.reportsService.getPTFMeetingsReport();
  }

  @Get('ptf/meetings/detail/:deptid/:stat')
  @ApiOperation({ summary: 'Get PTF meetings detail report' })
  async getPTFMeetingsDetailReport(@Param('deptid') deptId: number, @Param('stat') status: number) {
    return this.reportsService.getPTFMeetingsDetailReport(deptId, status);
  }

  @Get('ptf/department-wise')
  @ApiOperation({ summary: 'Get PTF department-wise report' })
  async getPTFDepartmentWiseReport() {
    return this.reportsService.getPTFDepartmentWiseReport();
  }

  @Get('ptf/department-wise/detail/:id')
  @ApiOperation({ summary: 'Get PTF department-wise detail report' })
  async getPTFDepartmentWiseDetailReport(@Param('id') id: number) {
    return this.reportsService.getPTFDepartmentWiseDetailReport(id);
  }

  @Get('ptf/district-wise')
  @ApiOperation({ summary: 'Get PTF district-wise report' })
  async getPTFDistrictWiseReport() {
    return this.reportsService.getPTFDistrictWiseReport();
  }

  @Get('ptf/district/detail/:id')
  @ApiOperation({ summary: 'Get PTF district detail report' })
  async getPTFDistrictDetailReport(@Param('id') id: number) {
    return this.reportsService.getPTFDistrictDetailReport(id);
  }

  @Get('ptf/district/latest')
  @ApiOperation({ summary: 'Get PTF district latest report' })
  async getPTFDistrictLatestReport() {
    return this.reportsService.getPTFDistrictLatestReport();
  }

  @Get('ptf/issues-summary')
  @ApiOperation({ summary: 'Get PTF issues summary' })
  @ApiResponse({ status: 200, description: 'PTF issues statistics and trends' })
  async getPtfIssuesSummary() {
    return { data: { total: 0, open: 0, closed: 0, byDistrict: {} } };
  }

  // PTIs Reports
  @Get('ptis/summary')
  @ApiOperation({ summary: 'Get PTIs summary report' })
  async getPTIsSummaryReport() {
    return this.reportsService.getPTIsSummaryReport();
  }

  @Get('ptis/detail')
  @ApiOperation({ summary: 'Get PTIs detail report' })
  async getPTIsDetailReport(@Query('department_id') deptId: number, @Query('status') status: number) {
    return this.reportsService.getPTIsDetailReport(deptId, status);
  }

  // Inaugurations Reports
  @Get('inaugurations')
  @ApiOperation({ summary: 'Get inaugurations report' })
  async getInaugurationsReport() {
    return this.reportsService.getInaugurationsReport();
  }

  // Review Meetings Reports
  @Get('review-meetings')
  @ApiOperation({ summary: 'Get review meetings report' })
  async getReviewMeetingsReport(@Query('start_date') startDate: string, @Query('end_date') endDate: string) {
    return this.reportsService.getReviewMeetingsReport(startDate, endDate);
  }

  @Get('review-meetings/ds-wise')
  @ApiOperation({ summary: 'Get review meetings DS-wise report' })
  async getReviewMeetingsDSWiseReport() {
    return this.reportsService.getReviewMeetingsDSWiseReport();
  }

  // KPI Reports
  @Get('kpi/data')
  @ApiOperation({ summary: 'Get KPI data reports' })
  async getKPIDataReports() {
    return this.reportsService.getKPIDataReports();
  }

  @Get('kpi/dc/filter')
  @ApiOperation({ summary: 'Get DC KPIs data filter' })
  async getDCKPIsDataFilter() {
    return this.reportsService.getDCKPIsDataFilter();
  }

  @Get('kpi/departments/filter')
  @ApiOperation({ summary: 'Get departments KPIs data filter' })
  async getDepartmentsKPIsDataFilter() {
    return this.reportsService.getDepartmentsKPIsDataFilter();
  }

  @Get('kpi/dpos/filter')
  @ApiOperation({ summary: 'Get DPOs KPIs data filter' })
  async getDPOsKPIsDataFilter() {
    return this.reportsService.getDPOsKPIsDataFilter();
  }

  // PMRU Reports
  @Get('pmru/meetings')
  @ApiOperation({ summary: 'Get PMRU meetings report' })
  async getPMRUMeetingsReport() {
    return this.reportsService.getPMRUMeetingsReport();
  }

  @Get('pmru/subtasks/detail/:id')
  @ApiOperation({ summary: 'Get PMRU subtasks detail report' })
  async getPMRUSubtasksDetailReport(@Param('id') id: number) {
    return this.reportsService.getPMRUSubtasksDetailReport(id);
  }

  // Khushhal KPK Reports
  @Get('khushhal-kpk/tasks')
  @ApiOperation({ summary: 'Get Khushhal KPK tasks report' })
  async getKhushhalKPKTasksReport() {
    return this.reportsService.getKhushhalKPKTasksReport();
  }

  // DC Inspection Reports
  @Get('dc-inspection/details/:id')
  @ApiOperation({ summary: 'Get DC inspection details report' })
  async getDCInspectionDetailsReport(@Param('id') id: number) {
    return this.reportsService.getDCInspectionDetailsReport(id);
  }

  // MNA/MPA Reports
  @Get('mna-mpa/posting-recommendation')
  @ApiOperation({ summary: 'Get MNA/MPA posting recommendation' })
  async getMNAMPAPostingRecommendation() {
    return this.reportsService.getMNAMPAPostingRecommendation();
  }

  // Export Reports
  @Get('export/meetings')
  @ApiOperation({ summary: 'Export meetings report' })
  @ApiQuery({ name: 'format', enum: ['pdf', 'excel', 'csv'], required: false })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Exported report file' })
  async exportMeetings(
    @Query('format') format?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return { message: 'Export feature - to be implemented', format: format || 'excel' };
  }

  @Get('export/minutes')
  @ApiOperation({ summary: 'Export minutes report' })
  @ApiQuery({ name: 'format', enum: ['pdf', 'excel', 'csv'], required: false })
  @ApiQuery({ name: 'departmentId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Exported report file' })
  async exportMinutes(
    @Query('format') format?: string,
    @Query('departmentId', ParseIntPipe) departmentId?: number
  ) {
    return { message: 'Export feature - to be implemented', format: format || 'excel' };
  }

  // Trends & Analytics
  @Get('analytics/trends')
  @ApiOperation({ summary: 'Get decision tracking trends' })
  @ApiQuery({ name: 'period', enum: ['weekly', 'monthly', 'quarterly', 'yearly'], required: false })
  @ApiResponse({ status: 200, description: 'Trends analysis for decisions and tasks' })
  async getTrends(@Query('period') period?: string) {
    return { data: { labels: [], datasets: [] } };
  }

  @Get('analytics/heatmap')
  @ApiOperation({ summary: 'Get activity heatmap data' })
  @ApiQuery({ name: 'year', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Activity heatmap for visualization' })
  async getHeatmap(@Query('year', ParseIntPipe) year?: number) {
    return { data: {} };
  }
}

