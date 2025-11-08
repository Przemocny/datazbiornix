import { faker } from '@faker-js/faker'
import { prisma } from '../db/prisma'
import {
  randomEnum,
  randomDecimal,
  randomPastDate,
  randomFutureDate,
  maybe,
  DEPARTMENTS,
  PROJECT_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from './generators/faker-helpers'

export async function seedTimeTracking() {
  console.log('⏱️  Seeding Time Tracking domain...')

  // Employees (2,000)
  console.log('  Creating employees...')
  const employees = []
  for (let i = 0; i < 2000; i++) {
    employees.push({
      employeeId: `EMP-${faker.string.numeric(5)}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      department: randomEnum(DEPARTMENTS),
      role: faker.person.jobTitle(),
      hourlyRate: randomDecimal(25, 150),
      hireDate: randomPastDate(2190), // 6 years
      active: faker.datatype.boolean({ probability: 0.95 }),
    })
  }
  await prisma.employee.createMany({ data: employees, skipDuplicates: true })
  const allEmployees = await prisma.employee.findMany()

  // Projects (5,000)
  console.log('  Creating projects...')
  const projects = []
  for (let i = 0; i < 5000; i++) {
    const startDate = randomPastDate(730)
    const status = randomEnum(PROJECT_STATUSES)
    const endDate = status === 'completed' || status === 'cancelled' 
      ? new Date(startDate.getTime() + faker.number.int({ min: 86400000 * 30, max: 86400000 * 365 }))
      : maybe(randomFutureDate(365), 0.5)

    projects.push({
      projectCode: `PROJ-${faker.string.alphanumeric(6).toUpperCase()}`,
      name: faker.company.catchPhrase(),
      description: maybe(faker.lorem.paragraph(), 0.8),
      clientName: faker.company.name(),
      startDate,
      endDate,
      budgetHours: randomDecimal(100, 10000),
      status,
    })
  }
  await prisma.project.createMany({ data: projects, skipDuplicates: true })
  const allProjects = await prisma.project.findMany()

  // Tasks (100,000)
  console.log('  Creating tasks...')
  const batchSize = 1000
  for (let batch = 0; batch < 100; batch++) {
    const tasks = []
    for (let i = 0; i < batchSize; i++) {
      const project = faker.helpers.arrayElement(allProjects)
      tasks.push({
        projectId: project.id,
        taskKey: `${project.projectCode}-${faker.number.int({ min: 1, max: 9999 })}`,
        title: faker.hacker.phrase(),
        description: maybe(faker.lorem.paragraph(), 0.7),
        assignedToId: faker.helpers.arrayElement(allEmployees).id,
        priority: randomEnum(TASK_PRIORITIES),
        status: randomEnum(TASK_STATUSES),
        estimatedHours: randomDecimal(1, 80),
        createdAt: randomPastDate(365),
        dueDate: maybe(randomFutureDate(90), 0.7),
      })
    }
    await prisma.task.createMany({ data: tasks, skipDuplicates: true })
    console.log(`    Tasks: ${(batch + 1) * batchSize}/100000`)
  }

  const allTasks = await prisma.task.findMany()

  // Time Entries (500,000)
  console.log('  Creating time entries...')
  for (let batch = 0; batch < 500; batch++) {
    const timeEntries = []
    for (let i = 0; i < 1000; i++) {
      const task = faker.helpers.arrayElement(allTasks)
      timeEntries.push({
        employeeId: task.assignedToId,
        taskId: task.id,
        projectId: task.projectId,
        date: randomPastDate(365),
        hours: randomDecimal(0.5, 12),
        description: maybe(faker.lorem.sentence(), 0.6),
        billable: faker.datatype.boolean({ probability: 0.85 }),
      })
    }
    await prisma.timeEntry.createMany({ data: timeEntries })
    console.log(`    Time entries: ${(batch + 1) * 1000}/500000`)
  }

  console.log('✅ Time Tracking domain seeded')
}

