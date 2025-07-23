import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { environment } from './config/environment';

// Database
import { AppDataSource } from '../infrastructure/database/typeorm.config';

// Repositories
import { DrugsRepository, DrugsRepository } from '../infrastructure/repositories/drugs.repository';
import { IAttendantRepository, AttendantRepository } from '../infrastructure/repositories/attendant.repository';
import { IPharmacyRepository, PharmacyRepository } from '../infrastructure/repositories/pharmacy.repository';
import { IAttendanceRepository, AttendanceRepository } from '../infrastructure/repositories/attendance.repository';

// Controllers
import { DrugsController, DrugsControllerImpl } from '../application/controllers/drugs.controller';
import { AttendantController, AttendantControllerImpl } from '../application/controllers/attendant.controller';
import { PharmacyController, PharmacyControllerImpl } from '../application/controllers/pharmacy.controller';
import { AttendanceController, AttendanceControllerImpl } from '../application/controllers/attendance.controller';

// Services
import { DrugImageProcessorService, DrugImageProcessorServiceImpl } from '../domain/services/drug-image-processor.service';
import { TextProcessorService, TextProcessorServiceImpl } from '../domain/services/text-processor.service';
import { OCRService } from '../domain/services/ocr';
import { OpenAIService } from '../domain/services/openai.service';

export const container = new Container();

// Configurações básicas
container.bind(TYPES.Environment).toConstantValue(environment);
container.bind(TYPES.DataSource).toConstantValue(AppDataSource);

// Repositories
container.bind<DrugsRepository>(TYPES.DrugsRepository).to(DrugsRepository);
container.bind<IAttendantRepository>(TYPES.AttendantRepository).to(AttendantRepository);
container.bind<IPharmacyRepository>(TYPES.PharmacyRepository).to(PharmacyRepository);
container.bind<IAttendanceRepository>(TYPES.AttendanceRepository).to(AttendanceRepository);

// Controllers
container.bind<DrugsController>(TYPES.DrugsController).to(DrugsControllerImpl);
container.bind<AttendantController>(TYPES.AttendantController).to(AttendantControllerImpl);
container.bind<PharmacyController>(TYPES.PharmacyController).to(PharmacyControllerImpl);
container.bind<AttendanceController>(TYPES.AttendanceController).to(AttendanceControllerImpl);

// Services
container.bind<DrugImageProcessorService>(TYPES.DrugImageProcessorService).to(DrugImageProcessorServiceImpl);
container.bind<TextProcessorService>(TYPES.TextProcessorService).to(TextProcessorServiceImpl);
container.bind<OCRService>(TYPES.OCRService).to(OCRService);
container.bind<OpenAIService>(TYPES.OpenAIService).to(OpenAIService);

export { container as Container }; 