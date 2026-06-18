import { Router } from 'express';
import healthCheck from './health-check.js';
import integratedAiRouter from './integrated-ai.js';
import stripeRouter from './stripe.js';
import paymentsRouter from './payments.js';
import artisanRegistrationRouter from './artisan-registration.js';
import googleSheetsRouter from './google-sheets.js';
import notificationsRouter from './notifications.js';
import whatsappRouter from './whatsapp.js';
import analyticsRouter from './analytics.js';
import adminAuthRouter from './admin-auth.js';
import artisansRouter from './artisans.js';
import adminDashboardRouter from './admin-dashboard.js';
import projectRequestsRouter from './project-requests.js';
import demandesRouter from './demandes.js';
import paiementsRouter from './paiements.js';
import avisRouter from './avis.js';
import clientsRouter from './clients.js';
import adminRouter from './admin.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/integrated-ai', integratedAiRouter);
    router.use('/stripe', stripeRouter);
    router.use('/payments', paymentsRouter);
    router.use('/artisan-registration', artisanRegistrationRouter);
    router.use('/sheets', googleSheetsRouter);
    router.use('/notifications', notificationsRouter);
    router.use('/whatsapp', whatsappRouter);
    router.use('/analytics', analyticsRouter);
    router.use('/admin-auth', adminAuthRouter);
    router.use('/artisans', artisansRouter);
    router.use('/admin', adminDashboardRouter);
    router.use('/project-requests', projectRequestsRouter);
    router.use('/demandes', demandesRouter);
    router.use('/paiements', paiementsRouter);
    router.use('/avis', avisRouter);
    router.use('/clients', clientsRouter);
    router.use('/admin', adminRouter);

    return router;
};
