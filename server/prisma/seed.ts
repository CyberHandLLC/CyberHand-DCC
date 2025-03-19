import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Hash password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Main seed function that populates the database with initial data
 */
async function main() {
  console.log('Start seeding the database...');
  
  try {
    // Clean the database first (for development)
    console.log('Cleaning existing data...');
    await cleanDatabase();
    
    // Create service categories
    console.log('Creating service categories...');
    const cyberSecurityCategory = await prisma.category.create({
      data: {
        name: 'Cyber Security',
        description: 'Comprehensive cybersecurity services for businesses of all sizes',
      },
    });
    
    const itCategory = await prisma.category.create({
      data: {
        name: 'IT Management',
        description: 'Professional IT management and support services',
      },
    });
    
    const cloudCategory = await prisma.category.create({
      data: {
        name: 'Cloud Services',
        description: 'Cloud migration, management, and optimization services',
      },
    });
    
    // Create services
    console.log('Creating services...');
    const securityAuditService = await prisma.service.create({
      data: {
        name: 'Security Audit',
        description: 'Comprehensive security audit and risk assessment',
        categoryId: cyberSecurityCategory.id,
        hasAI: true,
        features: ['Vulnerability scanning', 'Penetration testing', 'Risk assessment', 'Compliance check'],
      },
    });
    
    const managedITService = await prisma.service.create({
      data: {
        name: 'Managed IT Services',
        description: '24/7 IT management and support',
        categoryId: itCategory.id,
        hasAI: false,
        features: ['Help desk support', 'Network monitoring', 'System maintenance', 'IT strategy'],
      },
    });
    
    const cloudMigrationService = await prisma.service.create({
      data: {
        name: 'Cloud Migration',
        description: 'Seamless migration to cloud infrastructure',
        categoryId: cloudCategory.id,
        hasAI: true,
        features: ['Assessment', 'Planning', 'Migration', 'Optimization'],
      },
    });
    
    // Create service tiers for each service
    console.log('Creating service tiers...');
    await Promise.all([
      // Security Audit Tiers
      prisma.serviceTier.create({
        data: {
          name: 'Basic',
          serviceId: securityAuditService.id,
          price: 1999.99,
          features: ['Vulnerability scanning', 'Basic risk assessment'],
          description: 'Basic security audit for small businesses',
        },
      }),
      prisma.serviceTier.create({
        data: {
          name: 'Professional',
          serviceId: securityAuditService.id,
          price: 4999.99,
          features: ['Vulnerability scanning', 'Penetration testing', 'Risk assessment', 'Basic compliance check'],
          description: 'Professional security audit for medium businesses',
        },
      }),
      prisma.serviceTier.create({
        data: {
          name: 'Enterprise',
          serviceId: securityAuditService.id,
          price: 9999.99,
          features: ['Vulnerability scanning', 'Advanced penetration testing', 'Comprehensive risk assessment', 'Full compliance check', '24/7 monitoring'],
          description: 'Enterprise-grade security audit for large organizations',
        },
      }),
      
      // Managed IT Tiers
      prisma.serviceTier.create({
        data: {
          name: 'Essential',
          serviceId: managedITService.id,
          price: 999.99,
          features: ['Help desk support (business hours)', 'Basic network monitoring'],
          description: 'Essential IT support for small businesses',
        },
      }),
      prisma.serviceTier.create({
        data: {
          name: 'Business',
          serviceId: managedITService.id,
          price: 2499.99,
          features: ['Help desk support (extended hours)', 'Advanced network monitoring', 'System maintenance'],
          description: 'Business IT support for medium organizations',
        },
      }),
      prisma.serviceTier.create({
        data: {
          name: 'Premium',
          serviceId: managedITService.id,
          price: 4999.99,
          features: ['24/7 help desk support', 'Comprehensive monitoring', 'Proactive maintenance', 'Strategic IT planning'],
          description: 'Premium IT support for enterprises',
        },
      }),
      
      // Cloud Migration Tiers
      prisma.serviceTier.create({
        data: {
          name: 'Starter',
          serviceId: cloudMigrationService.id,
          price: 3999.99,
          features: ['Basic assessment', 'Migration planning', 'Standard migration'],
          description: 'Cloud migration for small workloads',
        },
      }),
      prisma.serviceTier.create({
        data: {
          name: 'Advanced',
          serviceId: cloudMigrationService.id,
          price: 7999.99,
          features: ['Comprehensive assessment', 'Detailed planning', 'Managed migration', 'Basic optimization'],
          description: 'Cloud migration for medium workloads',
        },
      }),
      prisma.serviceTier.create({
        data: {
          name: 'Complete',
          serviceId: cloudMigrationService.id,
          price: 14999.99,
          features: ['Enterprise assessment', 'Strategic planning', 'Full-service migration', 'Ongoing optimization'],
          description: 'End-to-end cloud migration for large enterprises',
        },
      }),
    ]);
    
    // Create client company
    console.log('Creating client company...');
    const techCorp = await prisma.client.create({
      data: {
        companyName: 'TechCorp Solutions',
        industry: 'Technology',
        websiteUrl: 'https://techcorp-example.com',
        serviceStartDate: new Date('2025-01-01'),
        notes: 'Major technology firm requiring comprehensive security services',
      },
    });
    
    // Create client contacts
    console.log('Creating client contacts...');
    await prisma.contact.create({
      data: {
        clientId: techCorp.id,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techcorp-example.com',
        phone: '555-123-4567',
        role: 'CTO',
        isPrimary: true,
      },
    });
    
    await prisma.contact.create({
      data: {
        clientId: techCorp.id,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techcorp-example.com',
        phone: '555-987-6543',
        role: 'IT Director',
        isPrimary: false,
      },
    });
    
    // Create client services (subscriptions)
    console.log('Creating client services...');
    const securityTiers = await prisma.serviceTier.findMany({
      where: {
        serviceId: securityAuditService.id,
      },
    });
    
    await prisma.clientService.create({
      data: {
        clientId: techCorp.id,
        serviceId: securityAuditService.id,
        tierId: securityTiers.find(tier => tier.name === 'Enterprise')?.id || securityTiers[0].id,
        startDate: new Date('2025-01-15'),
        status: 'ACTIVE',
        notes: 'Annual security audit with quarterly reviews',
      },
    });
    
    // Create users with different roles
    console.log('Creating users...');
    
    // Admin user
    const adminPasswordHash = await hashPassword('Admin123!');
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@cyberhand.com',
        passwordHash: adminPasswordHash,
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '555-111-0000',
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });
    
    // Staff user
    const staffPasswordHash = await hashPassword('Staff123!');
    const staffUser = await prisma.user.create({
      data: {
        email: 'staff@cyberhand.com',
        passwordHash: staffPasswordHash,
        firstName: 'Staff',
        lastName: 'Member',
        phoneNumber: '555-222-0000',
        role: 'STAFF',
        status: 'ACTIVE',
        emailVerified: true,
        staffProfile: {
          create: {
            department: 'Security',
            title: 'Security Analyst',
            hireDate: new Date('2024-01-01'),
          }
        }
      },
    });
    
    // Client user
    const clientPasswordHash = await hashPassword('Client123!');
    const clientUser = await prisma.user.create({
      data: {
        email: 'client@techcorp-example.com',
        passwordHash: clientPasswordHash,
        firstName: 'Client',
        lastName: 'User',
        phoneNumber: '555-333-0000',
        role: 'CLIENT',
        status: 'ACTIVE',
        emailVerified: true,
        clientId: techCorp.id,
      },
    });
    
    // Create some audit logs for demonstration
    console.log('Creating audit logs...');
    await Promise.all([
      prisma.auditLog.create({
        data: {
          userId: adminUser.id,
          action: 'LOGIN',
          resource: 'USER',
          details: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: staffUser.id,
          action: 'CREATE',
          resource: 'CLIENT',
          details: { clientId: techCorp.id, action: 'Created new client' },
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: clientUser.id,
          action: 'LOGIN',
          resource: 'USER',
          details: { ip: '10.0.0.1', userAgent: 'Chrome/90.0' },
        },
      }),
    ]);
    
    console.log('Database seeding completed successfully.');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

/**
 * Clean the database by deleting all records
 * This is for development purposes only
 */
async function cleanDatabase() {
  // Delete in order to respect foreign key constraints
  await prisma.auditLog.deleteMany({});
  await prisma.clientService.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.serviceTier.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.token.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.staff.deleteMany({});
  await prisma.stateTransfer.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.client.deleteMany({});
}

// Run the seed function
main()
  .catch((e) => {
    console.error('Error in seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect();
  });
