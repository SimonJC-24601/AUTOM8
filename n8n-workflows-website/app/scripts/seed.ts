
import { PrismaClient } from '@prisma/client';
import { WORKFLOW_CATEGORIES, TRIGGER_TYPES, COMPLEXITY_LEVELS } from '../lib/types';

const prisma = new PrismaClient();

// Integration categories mapping based on analysis document
const integrationCategories = [
  // AI Agent Development
  { integration: 'OpenAI', category: 'AI Agent Development' },
  { integration: 'Anthropic', category: 'AI Agent Development' },
  { integration: 'HuggingFace', category: 'AI Agent Development' },
  { integration: 'LangChain', category: 'AI Agent Development' },
  
  // Communication & Messaging
  { integration: 'Telegram', category: 'Communication & Messaging' },
  { integration: 'Discord', category: 'Communication & Messaging' },
  { integration: 'Slack', category: 'Communication & Messaging' },
  { integration: 'WhatsApp', category: 'Communication & Messaging' },
  { integration: 'Email', category: 'Communication & Messaging' },
  { integration: 'Gmail', category: 'Communication & Messaging' },
  
  // Data Processing & Analysis
  { integration: 'GoogleSheets', category: 'Data Processing & Analysis' },
  { integration: 'Excel', category: 'Data Processing & Analysis' },
  { integration: 'Airtable', category: 'Data Processing & Analysis' },
  { integration: 'PostgreSQL', category: 'Data Processing & Analysis' },
  { integration: 'MySQL', category: 'Data Processing & Analysis' },
  { integration: 'MongoDB', category: 'Data Processing & Analysis' },
  
  // Cloud Storage & File Management
  { integration: 'GoogleDrive', category: 'Cloud Storage & File Management' },
  { integration: 'Dropbox', category: 'Cloud Storage & File Management' },
  { integration: 'OneDrive', category: 'Cloud Storage & File Management' },
  { integration: 'Box', category: 'Cloud Storage & File Management' },
  
  // CRM & Sales
  { integration: 'Salesforce', category: 'CRM & Sales' },
  { integration: 'HubSpot', category: 'CRM & Sales' },
  { integration: 'Pipedrive', category: 'CRM & Sales' },
  { integration: 'Zoho', category: 'CRM & Sales' },
  
  // Social Media Management
  { integration: 'Twitter', category: 'Social Media Management' },
  { integration: 'Facebook', category: 'Social Media Management' },
  { integration: 'Instagram', category: 'Social Media Management' },
  { integration: 'LinkedIn', category: 'Social Media Management' },
  { integration: 'YouTube', category: 'Social Media Management' },
  
  // E-commerce & Retail
  { integration: 'Shopify', category: 'E-commerce & Retail' },
  { integration: 'WooCommerce', category: 'E-commerce & Retail' },
  { integration: 'Magento', category: 'E-commerce & Retail' },
  { integration: 'Stripe', category: 'E-commerce & Retail' },
  { integration: 'PayPal', category: 'E-commerce & Retail' },
  
  // Marketing & Advertising Automation
  { integration: 'Mailchimp', category: 'Marketing & Advertising Automation' },
  { integration: 'ConvertKit', category: 'Marketing & Advertising Automation' },
  { integration: 'ActiveCampaign', category: 'Marketing & Advertising Automation' },
  { integration: 'GoogleAds', category: 'Marketing & Advertising Automation' },
  { integration: 'FacebookAds', category: 'Marketing & Advertising Automation' },
  
  // Project Management
  { integration: 'Trello', category: 'Project Management' },
  { integration: 'Asana', category: 'Project Management' },
  { integration: 'Jira', category: 'Project Management' },
  { integration: 'Monday', category: 'Project Management' },
  { integration: 'Notion', category: 'Project Management' },
  
  // Technical Infrastructure & DevOps
  { integration: 'GitHub', category: 'Technical Infrastructure & DevOps' },
  { integration: 'GitLab', category: 'Technical Infrastructure & DevOps' },
  { integration: 'Docker', category: 'Technical Infrastructure & DevOps' },
  { integration: 'AWS', category: 'Technical Infrastructure & DevOps' },
  { integration: 'Azure', category: 'Technical Infrastructure & DevOps' },
  { integration: 'HTTP', category: 'Technical Infrastructure & DevOps' },
  { integration: 'Webhook', category: 'Technical Infrastructure & DevOps' },
  
  // Web Scraping & Data Extraction
  { integration: 'Scrapy', category: 'Web Scraping & Data Extraction' },
  { integration: 'Puppeteer', category: 'Web Scraping & Data Extraction' },
  { integration: 'Cheerio', category: 'Web Scraping & Data Extraction' },
  { integration: 'RSS', category: 'Web Scraping & Data Extraction' },
  
  // Financial & Accounting
  { integration: 'QuickBooks', category: 'Financial & Accounting' },
  { integration: 'Xero', category: 'Financial & Accounting' },
  { integration: 'FreshBooks', category: 'Financial & Accounting' },
  
  // Creative Content & Video Automation
  { integration: 'Canva', category: 'Creative Content & Video Automation' },
  { integration: 'Figma', category: 'Creative Content & Video Automation' },
  { integration: 'Unsplash', category: 'Creative Content & Video Automation' },
  { integration: 'DALL-E', category: 'Creative Content & Video Automation' },
  
  // Business Process Automation
  { integration: 'Zapier', category: 'Business Process Automation' },
  { integration: 'Microsoft', category: 'Business Process Automation' },
  { integration: 'Office365', category: 'Business Process Automation' },
  { integration: 'Calendar', category: 'Business Process Automation' },
  { integration: 'Schedule', category: 'Business Process Automation' },
];

// Generate sample workflows based on analysis patterns
function generateSampleWorkflows(count: number = 50) {
  const workflows = [];
  const purposes = [
    'Automation', 'Processing', 'Integration', 'Sync', 'Notification', 
    'Import', 'Export', 'Analysis', 'Reporting', 'Monitoring',
    'Backup', 'Migration', 'Pipeline', 'Alert', 'Dashboard',
    'Agent', 'Bot', 'Assistant', 'Scheduler', 'Converter'
  ];

  for (let i = 1; i <= count; i++) {
    const id = String(i).padStart(4, '0');
    const triggerType = getRandomTriggerType();
    const complexity = getRandomComplexity();
    const nodeCount = getNodeCountForComplexity(complexity);
    
    // Select 2-3 random integrations
    const selectedIntegrations = getRandomIntegrations(2 + Math.floor(Math.random() * 2));
    const purpose = purposes[Math.floor(Math.random() * purposes.length)];
    
    const filename = `${id}_${selectedIntegrations.join('_')}_${purpose}_${triggerType}.json`;
    const name = `${selectedIntegrations.join(' + ')} ${purpose} Workflow`;
    
    // Get category based on first integration
    const category = integrationCategories.find(ic => ic.integration === selectedIntegrations[0])?.category || 'Business Process Automation';
    
    const workflow = {
      filename,
      name,
      workflowId: generateId(),
      active: Math.random() < 0.105, // 10.5% active rate from analysis
      description: `Automated ${purpose.toLowerCase()} workflow connecting ${selectedIntegrations.join(', ')}`,
      triggerType,
      complexity,
      nodeCount,
      integrations: selectedIntegrations,
      tags: generateTags(selectedIntegrations, purpose),
      createdAt: generateRandomDate(),
      updatedAt: generateRandomDate(),
      fileHash: generateMD5Hash(),
      fileSize: Math.floor(Math.random() * 50000) + 5000,
      rawJson: generateSampleN8NWorkflow(selectedIntegrations, nodeCount, name)
    };
    
    workflows.push(workflow);
  }
  
  return workflows;
}

function getRandomTriggerType(): string {
  const weights = { 'Complex': 40.5, 'Webhook': 25.3, 'Manual': 23.2, 'Scheduled': 11.0 };
  const rand = Math.random() * 100;
  let cumulative = 0;
  
  for (const [trigger, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (rand <= cumulative) {
      return trigger === 'Complex' ? 'Triggered' : trigger;
    }
  }
  return 'Manual';
}

function getRandomComplexity(): string {
  const rand = Math.random();
  if (rand < 0.3) return 'low';
  if (rand < 0.7) return 'medium';
  return 'high';
}

function getNodeCountForComplexity(complexity: string): number {
  switch (complexity) {
    case 'low': return Math.floor(Math.random() * 3) + 2; // 2-5 nodes
    case 'medium': return Math.floor(Math.random() * 10) + 6; // 6-15 nodes
    case 'high': return Math.floor(Math.random() * 25) + 16; // 16-40 nodes
    default: return 5;
  }
}

function getRandomIntegrations(count: number): string[] {
  const shuffled = [...integrationCategories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(ic => ic.integration);
}

function generateTags(integrations: string[], purpose: string): string[] {
  const baseTags = ['automation', 'workflow'];
  const integrationTags = integrations.map(i => i.toLowerCase());
  const purposeTag = purpose.toLowerCase();
  return [...baseTags, ...integrationTags, purposeTag];
}

function generateRandomDate(): string {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function generateMD5Hash(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function generateSampleN8NWorkflow(integrations: string[], nodeCount: number, workflowName: string) {
  const nodes = [];
  const connections: Record<string, any> = {};
  
  // Create start node (trigger)
  const startNode = {
    id: generateId(),
    name: "Start",
    type: "n8n-nodes-base.manualTrigger",
    position: [250, 300],
    parameters: {},
    typeVersion: 1
  };
  nodes.push(startNode);
  
  // Create integration nodes
  let prevNodeName = "Start";
  for (let i = 1; i < nodeCount; i++) {
    const integration = integrations[i % integrations.length];
    const nodeId = generateId();
    const nodeName = `${integration} ${i}`;
    
    const node = {
      id: nodeId,
      name: nodeName,
      type: `n8n-nodes-base.${integration.toLowerCase()}`,
      position: [250 + (i * 200), 300],
      parameters: {},
      typeVersion: 1
    };
    nodes.push(node);
    
    // Create connection from previous node
    connections[prevNodeName] = {
      main: [[{
        node: nodeName,
        type: "main",
        index: 0
      }]]
    };
    
    prevNodeName = nodeName;
  }
  
  return {
    id: generateId(),
    name: workflowName,
    tags: [],
    nodes,
    connections,
    settings: {},
    staticData: {}
  };
}

async function main() {
  console.log('🌱 Starting seed process...');

  try {
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await prisma.workflow.deleteMany();
    await prisma.integration.deleteMany();
    await prisma.category.deleteMany();

    // Seed Categories
    console.log('📁 Seeding categories...');
    for (const categoryName of WORKFLOW_CATEGORIES) {
      await prisma.category.create({
        data: {
          name: categoryName,
          description: `Workflows related to ${categoryName.toLowerCase()}`
        }
      });
    }

    // Seed Integrations
    console.log('🔌 Seeding integrations...');
    for (const { integration, category } of integrationCategories) {
      await prisma.integration.create({
        data: {
          name: integration,
          category,
          description: `Integration with ${integration}`
        }
      });
    }

    // Seed Workflows
    console.log('⚡ Seeding workflows...');
    const sampleWorkflows = generateSampleWorkflows(100); // Generate 100 sample workflows
    
    for (const workflow of sampleWorkflows) {
      await prisma.workflow.create({
        data: workflow
      });
    }

    console.log('✅ Seed completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${WORKFLOW_CATEGORIES.length} categories`);
    console.log(`   - ${integrationCategories.length} integrations`);
    console.log(`   - ${sampleWorkflows.length} sample workflows`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
