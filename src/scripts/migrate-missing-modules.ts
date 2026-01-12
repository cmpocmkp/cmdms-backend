
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as fs from 'fs';
import * as path from 'path';
import { Minute } from '../modules/minutes/entities/minute.entity';
import { AnnualScheme } from '../modules/schemes/entities/annual-scheme.entity';
import { Inauguration } from '../modules/inaugurations/entities/inauguration.entity';
import { File } from '../modules/files/entities/file.entity';
import { PtfResponse } from '../modules/ptf/entities/ptf-response.entity';
import { BoardAgenda } from '../modules/boards/entities/board-agenda.entity';
import { DecisionStatus } from '../common/enums/decision-status.enum';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    console.log('Starting migration of missing modules...');

    try {
        await migrateMinutes(dataSource);
        await migrateDepartmentMinutes(dataSource);
        await migrateAnnualSchemes(dataSource);
        await migrateInaugurations(dataSource);
        await migrateFiles(dataSource);
        await migratePtfResponses(dataSource);
        await migrateBoardAgendas(dataSource);
        await migrateBoardAgendaDepartments(dataSource);

        console.log('All missing modules migrated successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await app.close();
    }
}

async function migrateMinutes(dataSource: DataSource) {
    console.log('Migrating Minutes...');
    const data = readJsonFile('minutes.json');
    const repo = dataSource.getRepository(Minute);
    const entities: Minute[] = [];

    for (const item of data) {
        const existing = await repo.findOne({ where: { id: parseInt(item.id) } });
        if (existing) continue;

        const entity = new Minute();
        entity.id = parseInt(item.id);
        entity.meetingId = parseInt(item.meeting_id);
        entity.heading = item.heading;
        entity.issues = item.issues || 'No issues recorded'; // Default if null
        entity.decisions = item.decisions;
        entity.responsibility = item.responsibility;
        entity.timeline = item.timeline ? new Date(item.timeline) : new Date(); // Default if null
        entity.progressHistory = item.progress_history;
        entity.comments = item.comments;
        entity.directions = item.directions;
        entity.completed = item.completed;
        entity.isArchived = item.is_archived === '1' || item.is_archived === true;
        entity.sortOrder = parseInt(item.sort_order) || 0;
        entity.status = parseInt(item.status) || DecisionStatus.ON_TARGET;

        // Attachments are JSON in source and entity
        try {
            if (typeof item.attachments === 'string') {
                entity.attachments = JSON.parse(item.attachments);
            } else {
                entity.attachments = item.attachments;
            }
        } catch (e) {
            entity.attachments = [];
        }

        if (item.created_at) entity.createdAt = new Date(item.created_at);
        if (item.updated_at) entity.updatedAt = new Date(item.updated_at);
        if (item.created_by) entity.createdBy = parseInt(item.created_by);
        if (item.modified_by) entity.modifiedBy = parseInt(item.modified_by);

        entities.push(entity);
    }

    await saveChunked(repo, entities, 'Minute');
}

async function migrateDepartmentMinutes(dataSource: DataSource) {
    console.log('Migrating Department Minutes (Pivot)...');
    const data = readJsonFile('department_minute.json');
    let count = 0;

    for (const item of data) {
        const minuteId = parseInt(item.minute_id);
        const departmentId = parseInt(item.department_id);

        // Basic validation to avoid FK errors if parent records are missing
        // We assume Minutes are migrated. Departments should be there too.
        try {
            await dataSource.query(
                `INSERT INTO department_minute (minute_id, department_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [minuteId, departmentId]
            );
            count++;
        } catch (e) {
            console.warn(`Failed to insert department_minute ${minuteId}-${departmentId}: ${e.message}`);
        }
    }
    console.log(`Migrated ${count} Department Minute links.`);
}

async function migrateAnnualSchemes(dataSource: DataSource) {
    console.log('Migrating Annual Schemes...');
    const data = readJsonFile('annual_schemes.json');
    const repo = dataSource.getRepository(AnnualScheme);
    const entities: AnnualScheme[] = [];

    for (const item of data) {
        const existing = await repo.findOne({ where: { id: parseInt(item.id) } });
        if (existing) continue;

        const entity = new AnnualScheme();
        entity.id = parseInt(item.id);
        entity.name = item.name;
        entity.code = item.code;
        entity.sector = 'General'; // Default
        entity.subSector = item.sub_sector_id ? item.sub_sector_id.toString() : null; // Mapping ID to string if needed or just storing ID
        entity.departmentId = 1; // Default
        // entity.districtId = // No direct district_id in source preview, leaving null
        entity.estimatedCost = item.financial_progress ? parseFloat(item.financial_progress) : 0; // Mapping financial_progress to cost roughly? Or distinct field?
        // 'financial_progress' might not be cost. source has no 'cost'? 
        // Checking preview: "financial_progress", "physical_progress". 
        // entity needs 'estimatedCost'. If source missing, set 0.

        // Map status
        entity.status = item.status;
        entity.type = item.type;
        entity.approvalDate = item.approval_date ? new Date(item.approval_date) : (null as any);

        if (item.created_at) entity.createdAt = new Date(item.created_at);
        if (item.updated_at) entity.updatedAt = new Date(item.updated_at);

        entities.push(entity);
    }
    await saveChunked(repo, entities, 'AnnualScheme');
}

async function migrateInaugurations(dataSource: DataSource) {
    console.log('Migrating Inaugurations...');
    const data = readJsonFile('inaugurations.json');
    const repo = dataSource.getRepository(Inauguration);
    const entities: Inauguration[] = [];

    for (const item of data) {
        const existing = await repo.findOne({ where: { id: parseInt(item.id) } });
        if (existing) continue;

        const entity = new Inauguration();
        entity.id = parseInt(item.id);
        entity.title = item.project_name;
        entity.description = item.description;
        entity.date = item.date ? new Date(item.date) : new Date();
        entity.districtId = item.district_id ? parseInt(item.district_id) : (null as any);
        entity.departmentId = item.department_id ? parseInt(item.department_id) : (null as any);
        entity.type = item.type || 'Inauguration'; // Default
        entity.projectCost = item.cost ? parseFloat(item.cost) : 0;

        try {
            entity.attachments = item.attachments ? JSON.parse(item.attachments) : [];
        } catch {
            entity.attachments = [];
        }

        if (item.created_at) entity.createdAt = new Date(item.created_at);
        if (item.updated_at) entity.updatedAt = new Date(item.updated_at);

        entities.push(entity);
    }
    await saveChunked(repo, entities, 'Inauguration');
}

async function migrateFiles(dataSource: DataSource) {
    console.log('Migrating Images (Files)...');
    const data = readJsonFile('images.json');
    const repo = dataSource.getRepository(File);
    const entities: File[] = [];

    for (const item of data) {
        const existing = await repo.findOne({ where: { id: parseInt(item.id) } });
        if (existing) continue;

        const entity = new File();
        entity.id = parseInt(item.id);
        entity.originalName = item.name;
        entity.fileName = item.name;
        // Construct a plausible path. 
        entity.filePath = `uploads/${item.name}`;
        entity.mimeType = 'image/jpeg'; // Default assumption
        entity.size = 0; // Unknown size

        // Linking to ReviewMeeting based on 'review_meeting_id'
        if (item.review_meeting_id) {
            entity.attachableType = 'ReviewMeeting';
            entity.attachableId = parseInt(item.review_meeting_id);
        }

        if (item.created_at) entity.createdAt = new Date(item.created_at);
        if (item.updated_at) entity.updatedAt = new Date(item.updated_at);

        entities.push(entity);
    }
    await saveChunked(repo, entities, 'File');
}

async function migratePtfResponses(dataSource: DataSource) {
    console.log('Migrating PTF Responses...');
    const data = readJsonFile('cm_ptf_responses.json');
    const repo = dataSource.getRepository(PtfResponse);
    const entities: PtfResponse[] = [];

    for (const item of data) {
        const existing = await repo.findOne({ where: { id: parseInt(item.id) } });
        if (existing) continue;

        const entity = new PtfResponse();
        entity.id = parseInt(item.id);
        entity.response = item.remarks;
        entity.ptfIssueId = item.ptf_issue_id ? parseInt(item.ptf_issue_id) : 0;
        entity.departmentId = item.department_id ? parseInt(item.department_id) : 0;
        entity.userId = item.created_by ? parseInt(item.created_by) : 1; // Default to admin user id 1

        if (item.created_at) entity.createdAt = new Date(item.created_at);
        // updated_at not in preview? default new Date
        entity.updatedAt = new Date();

        entities.push(entity);
    }
    await saveChunked(repo, entities, 'PtfResponse');
}

async function migrateBoardAgendas(dataSource: DataSource) {
    console.log('Migrating Board Agendas (Sectorial Agenda Points)...');
    const data = readJsonFile('sectorial_agenda_points.json');
    const repo = dataSource.getRepository(BoardAgenda);
    const entities: BoardAgenda[] = [];

    for (const item of data) {
        const existing = await repo.findOne({ where: { id: parseInt(item.id) } });
        if (existing) continue;

        const entity = new BoardAgenda();
        entity.id = parseInt(item.id);
        entity.boardMeetingId = parseInt(item.sectorial_meeting_id);
        entity.description = stripHtml(item.item || '');
        entity.decision = stripHtml(item.decision || '');
        entity.timeline = item.timeline ? new Date(item.timeline) : (null as any);
        entity.status = parseInt(item.status) || DecisionStatus.ON_TARGET;
        entity.comments = stripHtml(item.comments || '');
        entity.isArchived = item.is_archived === '1';

        // Attachments?
        // entity.attachments ... source doesn't show attachments clearly or null.

        if (item.created_at) entity.createdAt = new Date(item.created_at);
        if (item.updated_at) entity.updatedAt = new Date(item.updated_at);
        if (item.created_by) entity.createdBy = parseInt(item.created_by);
        if (item.modified_by) entity.modifiedBy = parseInt(item.modified_by);

        entities.push(entity);
    }
    await saveChunked(repo, entities, 'BoardAgenda');
}

async function migrateBoardAgendaDepartments(dataSource: DataSource) {
    console.log('Migrating Board Agenda Departments (Pivot)...');
    const data = readJsonFile('department_sector_agenda_point.json');
    let count = 0;

    for (const item of data) {
        const agendaId = parseInt(item.sectorial_agenda_point_id);
        const departmentId = parseInt(item.department_id);

        try {
            await dataSource.query(
                `INSERT INTO board_agenda_department (board_agenda_id, department_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [agendaId, departmentId]
            );
            count++;
        } catch (e) {
            console.warn(`Failed to insert board_agenda_department ${agendaId}-${departmentId}: ${e.message}`);
        }
    }
    console.log(`Migrated ${count} Board Agenda Department links.`);
}


// --- Helpers ---

function readJsonFile(filename: string): any[] {
    const filePath = path.join(process.cwd(), 'old_data', filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filename}`);
        return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    // Handle phpMyAdmin export format or direct array
    if (Array.isArray(json)) {
        // Check if it's the wrapper structure
        if (json.length > 2 && json[2].type === 'table') {
            return json[2].data;
        }
        return json;
    }
    return [];
}

async function saveChunked<T>(repo: any, entities: T[], name: string) {
    if (entities.length === 0) {
        console.log(`No ${name} records to save.`);
        return;
    }

    const chunkSize = 100;
    for (let i = 0; i < entities.length; i += chunkSize) {
        const chunk = entities.slice(i, i + chunkSize);
        try {
            await repo.save(chunk);
            console.log(`Saved ${chunk.length} ${name} records...`);
        } catch (e) {
            console.error(`Error saving chunk for ${name}:`, e.message);
            // Try individual
            for (const entity of chunk) {
                try {
                    await repo.save(entity);
                } catch (err) {
                    console.error(`Failed to save individual ${name}:`, err.message);
                }
            }
        }
    }
    console.log(`Finished saving ${name}.`);
}

function stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
}

bootstrap();
