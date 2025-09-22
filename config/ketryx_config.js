(function (global) {
    const commonFields = [
        { id: 'id', label: 'Document ID', type: 'text', template: '{docId}', categories: ['core', 'identifier'], alwaysAvailable: true },
        { id: 'title', label: 'Title', type: 'text', template: '{title}', categories: ['core', 'identifier'] },
        { id: 'status', label: 'Status', type: 'select', template: '{status}', categories: ['metadata'] },
        { id: 'assignee', label: 'Assignee', type: 'user', template: '{assignee}', categories: ['metadata'] },
        { id: 'introducedInVersion', label: 'Introduced in Version', type: 'text', template: '{introducedInVersion}', categories: ['metadata', 'versioning'] },
        { id: 'obsoleteInVersion', label: 'Obsolete in Version', type: 'text', template: '{obsoleteInVersion}', categories: ['metadata', 'versioning'] },
        { id: 'createdAt', label: 'Created At', type: 'datetime', template: '{createdAt}', categories: ['metadata', 'dates'] },
        { id: 'updatedAt', label: 'Updated At', type: 'datetime', template: '{updatedAt}', categories: ['metadata', 'dates'] }
    ];

    const relationTemplate = (name) => `{#relations|where:'name=="${name}"'}• {other.title} ({other.docId}){/}`;

    const itemTypes = [
        {
            id: 'requirements',
            label: 'Requirements',
            description: 'Functional, regulatory, and business requirements tracked in Ketryx.',
            kql: { typeCodes: ['RQ'] },
            defaultFields: ['id', 'title', 'description', 'type', 'status'],
            supportsCustomFields: true,
            hierarchy: { relation: 'has child', direction: 'outbound' },
            relations: {
                parents: { name: 'has parent', direction: 'outbound', targetType: 'requirements' },
                children: { name: 'has child', direction: 'outbound', targetType: 'requirements' },
                riskControls: { name: 'risk-controls', direction: 'outbound', targetType: 'risks' },
                fulfilledBy: { name: 'fulfilled-by', direction: 'inbound', targetType: 'specifications' },
                tracedBy: { name: 'tested-by', direction: 'inbound', targetType: 'tests' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'type', 'context', 'priority', 'regions'],
                metadata: ['status', 'assignee', 'introducedInVersion', 'obsoleteInVersion', 'createdAt', 'updatedAt'],
                relationships: ['parents', 'children', 'riskControl', 'fulfilledBy', 'tracedBy'],
                analysis: ['rationale', 'introducedRisks']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'type', label: 'Requirement Type', type: 'select', template: '{fieldContent.Requirement_type}', categories: ['core'] },
                { id: 'context', label: 'Context', type: 'select', template: '{fieldContent.Context}', categories: ['core'] },
                { id: 'priority', label: 'Priority', type: 'select', template: '{fieldContent.Priority}', categories: ['core'] },
                { id: 'regions', label: 'Regions', type: 'multiselect', template: '{fieldContent.Regions}', categories: ['core'] },
                { id: 'rationale', label: 'Rationale', type: 'richText', template: '{~~ fieldContent.Rationale}', categories: ['analysis'] },
                { id: 'introducedRisks', label: 'Introduced Risks', type: 'relation', relation: { name: 'introduces-risk', direction: 'outbound', targetType: 'risks' }, template: relationTemplate('introduces-risk'), categories: ['analysis', 'relationships'] },
                { id: 'parents', label: 'Parent Requirements', type: 'relation', relation: { name: 'has parent', direction: 'outbound', targetType: 'requirements' }, template: relationTemplate('has parent'), categories: ['relationships'] },
                { id: 'children', label: 'Child Requirements', type: 'relation', relation: { name: 'has child', direction: 'outbound', targetType: 'requirements' }, template: relationTemplate('has child'), categories: ['relationships'] },
                { id: 'riskControl', label: 'Risk Control For', type: 'relation', relation: { name: 'risk-controls', direction: 'outbound', targetType: 'risks' }, template: relationTemplate('risk-controls'), categories: ['relationships'] },
                { id: 'fulfilledBy', label: 'Fulfilled By', type: 'relation', relation: { name: 'fulfilled-by', direction: 'inbound', targetType: 'specifications' }, template: relationTemplate('fulfilled-by'), categories: ['relationships'] },
                { id: 'tracedBy', label: 'Traced By (Tests)', type: 'relation', relation: { name: 'tested-by', direction: 'inbound', targetType: 'tests' }, template: relationTemplate('tested-by'), categories: ['relationships'] }
            ]
        },
        {
            id: 'tests',
            label: 'Test Cases',
            description: 'Verification and validation test cases with procedures and expected results.',
            kql: { typeCodes: ['TC'] },
            defaultFields: ['id', 'title', 'testType', 'steps', 'expectedBehavior', 'testedItems'],
            supportsCustomFields: true,
            relations: {
                tests: { name: 'tests', direction: 'outbound', targetType: 'requirements' },
                tracedFrom: { name: 'tested-by', direction: 'outbound', targetType: 'requirements' },
                relatedRisks: { name: 'mitigated-by', direction: 'outbound', targetType: 'risks' },
                executions: { name: 'has-execution', direction: 'outbound', targetType: 'testExecutions' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'steps', 'expectedBehavior', 'testType'],
                metadata: ['status', 'assignee', 'introducedInVersion', 'createdAt', 'updatedAt'],
                relationships: ['testedItems', 'relatedRisks', 'executions'],
                analysis: ['rationale']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'steps', label: 'Test Steps', type: 'richText', template: '{~~ fieldContent.Steps}', categories: ['core'] },
                { id: 'expectedBehavior', label: 'Expected Behavior', type: 'richText', template: '{~~ fieldContent.Expected_behavior}', categories: ['core'] },
                { id: 'testType', label: 'Test Type', type: 'select', template: '{fieldContent.Test_type}', categories: ['core'] },
                { id: 'testEnvironments', label: 'Test Environments', type: 'text', template: '{fieldContent.Test_environments}', categories: ['core'] },
                { id: 'testedItems', label: 'Tested Items', type: 'relation', relation: { name: 'tests', direction: 'outbound', targetType: 'requirements' }, template: relationTemplate('tests'), categories: ['relationships'] },
                { id: 'relatedRisks', label: 'Mitigates Risks', type: 'relation', relation: { name: 'mitigated-by', direction: 'outbound', targetType: 'risks' }, template: relationTemplate('mitigated-by'), categories: ['relationships'] },
                { id: 'executions', label: 'Test Executions', type: 'relation', relation: { name: 'has-execution', direction: 'outbound', targetType: 'testExecutions' }, template: relationTemplate('has-execution'), categories: ['relationships'] },
                { id: 'executionResults', label: 'Test Execution Results', type: 'relation', relation: { name: 'has-execution', direction: 'outbound', targetType: 'testExecutions' }, template: relationTemplate('has-execution'), categories: ['relationships'] },
                { id: 'rationale', label: 'Test Rationale', type: 'richText', template: '{~~ fieldContent.Rationale}', categories: ['analysis'] }
            ]
        },
        {
            id: 'testExecutions',
            label: 'Test Executions',
            description: 'Individual executions of test cases capturing results and anomalies.',
            kql: { typeCodes: ['TE'] },
            defaultFields: ['id', 'title', 'testBeingExecuted', 'testResult', 'observedBehavior'],
            supportsCustomFields: true,
            relations: {
                executes: { name: 'executes', direction: 'outbound', targetType: 'tests' },
                foundAnomalies: { name: 'found-anomalies', direction: 'outbound', targetType: 'anomalies' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'testResult', 'observedBehavior', 'testEnvironments'],
                metadata: ['status', 'assignee', 'introducedInVersion', 'createdAt', 'updatedAt'],
                relationships: ['testBeingExecuted', 'foundAnomalies']
            },
            fields: [
                { id: 'description', label: 'Execution Summary', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'testBeingExecuted', label: 'Test Case', type: 'relation', relation: { name: 'executes', direction: 'outbound', targetType: 'tests' }, template: relationTemplate('executes'), categories: ['relationships'] },
                { id: 'testResult', label: 'Test Result', type: 'select', template: '{fieldContent.Test_result}', categories: ['core'] },
                { id: 'observedBehavior', label: 'Observed Behavior', type: 'richText', template: '{~~ fieldContent.Observed_behavior}', categories: ['core'] },
                { id: 'testEnvironments', label: 'Test Environments', type: 'text', template: '{fieldContent.Test_environments}', categories: ['core'] },
                { id: 'foundAnomalies', label: 'Found Anomalies', type: 'relation', relation: { name: 'found-anomalies', direction: 'outbound', targetType: 'anomalies' }, template: relationTemplate('found-anomalies'), categories: ['relationships'] },
                { id: 'executedBy', label: 'Executed By', type: 'user', template: '{executedBy.name}', categories: ['metadata'] },
                { id: 'executionDate', label: 'Execution Date', type: 'date', template: '{createdAt | datetime:"yyyy-MM-dd"}', categories: ['metadata'] }
            ]
        },
        {
            id: 'risks',
            label: 'Risks',
            description: 'Risk analysis items including severity, probability, mitigations, and status.',
            kql: { typeCodes: ['RISK'] },
            defaultFields: ['id', 'title', 'severity', 'probability', 'riskLevel', 'mitigation'],
            supportsCustomFields: true,
            relations: {
                riskControls: { name: 'risk-controlled-by', direction: 'outbound', targetType: 'specifications' },
                mitigatedBy: { name: 'mitigated-by', direction: 'inbound', targetType: 'tests' },
                relatedRequirements: { name: 'induces-risk', direction: 'inbound', targetType: 'requirements' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'severity', 'probability', 'riskLevel', 'mitigation'],
                metadata: ['status', 'assignee', 'introducedInVersion', 'createdAt', 'updatedAt'],
                relationships: ['riskControls', 'relatedRequirements', 'mitigatedBy'],
                analysis: ['rationale', 'residualRisk']
            },
            fields: [
                { id: 'description', label: 'Risk Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'severity', label: 'Severity', type: 'select', template: '{fieldContent.Severity}', categories: ['core'] },
                { id: 'probability', label: 'Probability', type: 'select', template: '{fieldContent.Probability}', categories: ['core'] },
                { id: 'riskLevel', label: 'Risk Level', type: 'select', template: '{fieldContent.Risk_level}', categories: ['core'] },
                { id: 'mitigation', label: 'Mitigation', type: 'richText', template: '{~~ fieldContent.Mitigation}', categories: ['core'] },
                { id: 'riskControls', label: 'Controlled By', type: 'relation', relation: { name: 'risk-controlled-by', direction: 'outbound', targetType: 'specifications' }, template: relationTemplate('risk-controlled-by'), categories: ['relationships'] },
                { id: 'relatedRequirements', label: 'Introduced By Requirements', type: 'relation', relation: { name: 'induces-risk', direction: 'inbound', targetType: 'requirements' }, template: relationTemplate('induces-risk'), categories: ['relationships'] },
                { id: 'mitigatedBy', label: 'Mitigated By Tests', type: 'relation', relation: { name: 'mitigated-by', direction: 'inbound', targetType: 'tests' }, template: relationTemplate('mitigated-by'), categories: ['relationships'] },
                { id: 'rationale', label: 'Risk Rationale', type: 'richText', template: '{~~ fieldContent.Rationale}', categories: ['analysis'] },
                { id: 'residualRisk', label: 'Residual Risk', type: 'select', template: '{fieldContent.Residual_risk}', categories: ['analysis'] }
            ]
        },
        {
            id: 'changes',
            label: 'Change Requests',
            description: 'Change requests and impact analysis used across controlled projects.',
            kql: { typeCodes: ['CR'] },
            defaultFields: ['id', 'title', 'description', 'type', 'status', 'impactOfChange'],
            supportsCustomFields: true,
            relations: {
                introducedRisks: { name: 'introduces-risk', direction: 'outbound', targetType: 'risks' },
                affectedItems: { name: 'affects', direction: 'outbound', targetType: 'all' },
                newItems: { name: 'creates', direction: 'outbound', targetType: 'all' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'type', 'impactOfChange', 'reasonForChange', 'impactScope', 'impactCriticality'],
                metadata: ['status', 'assignee', 'introducedInVersion', 'createdAt'],
                relationships: ['introducedRisks', 'affectedItems', 'newItems']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'impactOfChange', label: 'Impact of Change', type: 'richText', template: '{~~ fieldContent.Impact_of_change}', categories: ['core'] },
                { id: 'reasonForChange', label: 'Reason for Change', type: 'richText', template: '{~~ fieldContent.Reason_for_change}', categories: ['core'] },
                { id: 'type', label: 'Change Type', type: 'select', template: '{fieldContent.Change_type}', categories: ['core'] },
                { id: 'impactScope', label: 'Impact Scope', type: 'select', template: '{fieldContent.Impact_scope}', categories: ['core'] },
                { id: 'impactCriticality', label: 'Impact Criticality', type: 'select', template: '{fieldContent.Impact_criticality}', categories: ['core'] },
                { id: 'introducedRisks', label: 'Introduced Risks', type: 'relation', relation: { name: 'introduces-risk', direction: 'outbound', targetType: 'risks' }, template: relationTemplate('introduces-risk'), categories: ['relationships'] },
                { id: 'affectedItems', label: 'Affected Items', type: 'relation', relation: { name: 'affects', direction: 'outbound', targetType: 'all' }, template: relationTemplate('affects'), categories: ['relationships'] },
                { id: 'newItems', label: 'New Items', type: 'relation', relation: { name: 'new-items', direction: 'outbound', targetType: 'all' }, template: relationTemplate('new-items'), categories: ['relationships'] }
            ]
        },
        {
            id: 'anomalies',
            label: 'Anomalies',
            description: 'Anomaly records including problem type, impact scope, and resolution links.',
            kql: { typeCodes: ['AN'] },
            defaultFields: ['id', 'title', 'description', 'problemReportType', 'impactScope', 'impactCriticality'],
            supportsCustomFields: true,
            relations: {
                affectedItems: { name: 'affects', direction: 'outbound', targetType: 'all' },
                relatedIssues: { name: 'related-to', direction: 'bidirectional', targetType: 'all' },
                resolvedBy: { name: 'resolved-by', direction: 'outbound', targetType: 'tasks' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'environment', 'problemReportType', 'impactScope', 'impactCriticality', 'impactOnSystem'],
                metadata: ['status', 'assignee', 'introducedInVersion', 'createdAt'],
                relationships: ['affectedItems', 'relatedIssues', 'resolvedBy']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'environment', label: 'Environment', type: 'text', template: '{fieldContent.Environment}', categories: ['core'] },
                { id: 'problemReportType', label: 'Problem Report Type', type: 'select', template: '{fieldContent.Problem_report_type}', categories: ['core'] },
                { id: 'impactScope', label: 'Impact Scope', type: 'select', template: '{fieldContent.Impact_scope}', categories: ['core'] },
                { id: 'impactCriticality', label: 'Impact Criticality', type: 'select', template: '{fieldContent.Impact_criticality}', categories: ['core'] },
                { id: 'impactOnSystem', label: 'Impact on System', type: 'richText', template: '{~~ fieldContent.Impact_on_system}', categories: ['core'] },
                { id: 'rootCauseAnalysis', label: 'Root Cause Analysis', type: 'richText', template: '{~~ fieldContent.Root_cause_analysis}', categories: ['core'] },
                { id: 'rationaleForDeferring', label: 'Rationale for Deferring', type: 'richText', template: '{~~ fieldContent.Rationale_for_deferring_resolution}', categories: ['core'] },
                { id: 'affectedItems', label: 'Affected Items', type: 'relation', relation: { name: 'affects', direction: 'outbound', targetType: 'all' }, template: relationTemplate('affects'), categories: ['relationships'] },
                { id: 'relatedIssues', label: 'Related Issues', type: 'relation', relation: { name: 'related-to', direction: 'bidirectional', targetType: 'all' }, template: relationTemplate('related-to'), categories: ['relationships'] },
                { id: 'resolvedBy', label: 'Resolved By', type: 'relation', relation: { name: 'resolved-by', direction: 'outbound', targetType: 'tasks' }, template: relationTemplate('resolved-by'), categories: ['relationships'] }
            ]
        },
        {
            id: 'specifications',
            label: 'Software Item Specifications',
            description: 'Software component specifications with fulfillment and usage relations.',
            kql: { typeCodes: ['SIS'] },
            defaultFields: ['id', 'title', 'description', 'fulfills', 'status'],
            supportsCustomFields: true,
            hierarchy: { relation: 'has child', direction: 'outbound' },
            relations: {
                parentItems: { name: 'has parent', direction: 'outbound', targetType: 'specifications' },
                fulfills: { name: 'fulfills', direction: 'outbound', targetType: 'requirements' },
                introducedRisks: { name: 'introduces-risk', direction: 'outbound', targetType: 'risks' },
                usedItems: { name: 'uses', direction: 'outbound', targetType: 'specifications' },
                usedServices: { name: 'uses-service', direction: 'outbound', targetType: 'services' },
                usedDependencies: { name: 'uses-dependency', direction: 'outbound', targetType: 'dependencies' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'type', 'context', 'safetyRiskClass', 'securityRiskClass'],
                metadata: ['status', 'assignee', 'introducedInVersion', 'createdAt'],
                relationships: ['parents', 'fulfills', 'introducedRisks', 'usedItems', 'usedServices', 'usedDependencies'],
                analysis: ['inputs', 'outputs', 'rationale']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'context', label: 'Context', type: 'select', template: '{fieldContent.Context}', categories: ['core'] },
                { id: 'type', label: 'Software Item Type', type: 'select', template: '{fieldContent.Software_item_type}', categories: ['core'] },
                { id: 'safetyRiskClass', label: 'Safety Risk Class', type: 'select', template: '{fieldContent.Safety_risk_class}', categories: ['core'] },
                { id: 'securityRiskClass', label: 'Security Risk Class', type: 'select', template: '{fieldContent.Security_risk_class}', categories: ['core'] },
                { id: 'inputs', label: 'Inputs', type: 'richText', template: '{~~ fieldContent.Inputs}', categories: ['analysis'] },
                { id: 'outputs', label: 'Outputs', type: 'richText', template: '{~~ fieldContent.Outputs}', categories: ['analysis'] },
                { id: 'rationale', label: 'Rationale', type: 'richText', template: '{~~ fieldContent.Rationale}', categories: ['analysis'] },
                { id: 'parents', label: 'Parent Software Items', type: 'relation', relation: { name: 'has parent', direction: 'outbound', targetType: 'specifications' }, template: relationTemplate('has parent'), categories: ['relationships'] },
                { id: 'fulfills', label: 'Fulfilled Requirements', type: 'relation', relation: { name: 'fulfills', direction: 'outbound', targetType: 'requirements' }, template: relationTemplate('fulfills'), categories: ['relationships'] },
                { id: 'introducedRisks', label: 'Introduced Risks', type: 'relation', relation: { name: 'introduces-risk', direction: 'outbound', targetType: 'risks' }, template: relationTemplate('introduces-risk'), categories: ['relationships'] },
                { id: 'usedItems', label: 'Used Items', type: 'relation', relation: { name: 'uses', direction: 'outbound', targetType: 'specifications' }, template: relationTemplate('uses'), categories: ['relationships'] },
                { id: 'usedServices', label: 'Used Services', type: 'relation', relation: { name: 'uses-service', direction: 'outbound', targetType: 'services' }, template: relationTemplate('uses-service'), categories: ['relationships'] },
                { id: 'usedDependencies', label: 'Used Dependencies', type: 'relation', relation: { name: 'uses-dependency', direction: 'outbound', targetType: 'dependencies' }, template: relationTemplate('uses-dependency'), categories: ['relationships'] }
            ]
        },
        {
            id: 'hardwareSpecs',
            label: 'Hardware Item Specifications',
            description: 'Hardware component specifications with interfaces and relationships.',
            kql: { typeCodes: ['HIS'] },
            defaultFields: ['id', 'title', 'description', 'context', 'interfaces', 'fulfilledRequirements'],
            supportsCustomFields: true,
            relations: {
                parentItems: { name: 'has parent', direction: 'outbound', targetType: 'hardwareSpecs' },
                fulfilledRequirements: { name: 'fulfills', direction: 'outbound', targetType: 'requirements' },
                usedItems: { name: 'uses', direction: 'outbound', targetType: 'specifications' },
                usedServices: { name: 'uses-service', direction: 'outbound', targetType: 'services' },
                introducedRisks: { name: 'introduces-risk', direction: 'outbound', targetType: 'risks' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'context', 'interfaces'],
                metadata: ['status', 'assignee', 'introducedInVersion', 'createdAt'],
                relationships: ['parentHardwareItems', 'fulfilledRequirements', 'usedItems', 'usedServices', 'introducedRisks'],
                analysis: ['rationale']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'context', label: 'Context', type: 'select', template: '{fieldContent.Context}', categories: ['core'] },
                { id: 'interfaces', label: 'Interfaces', type: 'richText', template: '{~~ fieldContent.Interfaces}', categories: ['core'] },
                { id: 'rationale', label: 'Rationale', type: 'richText', template: '{~~ fieldContent.Rationale}', categories: ['analysis'] },
                { id: 'parentHardwareItems', label: 'Parent Hardware Items', type: 'relation', relation: { name: 'has parent', direction: 'outbound', targetType: 'hardwareSpecs' }, template: relationTemplate('has parent'), categories: ['relationships'] },
                { id: 'fulfilledRequirements', label: 'Fulfilled Requirements', type: 'relation', relation: { name: 'fulfills', direction: 'outbound', targetType: 'requirements' }, template: relationTemplate('fulfills'), categories: ['relationships'] },
                { id: 'usedItems', label: 'Used Software Items', type: 'relation', relation: { name: 'uses', direction: 'outbound', targetType: 'specifications' }, template: relationTemplate('uses'), categories: ['relationships'] },
                { id: 'usedServices', label: 'Used Services', type: 'relation', relation: { name: 'uses-service', direction: 'outbound', targetType: 'services' }, template: relationTemplate('uses-service'), categories: ['relationships'] },
                { id: 'introducedRisks', label: 'Introduced Risks', type: 'relation', relation: { name: 'introduces-risk', direction: 'outbound', targetType: 'risks' }, template: relationTemplate('introduces-risk'), categories: ['relationships'] }
            ]
        },
        {
            id: 'capas',
            label: 'CAPAs',
            description: 'Corrective and Preventive Actions with root cause and linked items.',
            kql: { typeCodes: ['CAPA'] },
            defaultFields: ['id', 'title', 'description', 'type', 'status', 'rootCause', 'correctiveActions'],
            supportsCustomFields: true,
            relations: {
                affectedItems: { name: 'affects', direction: 'outbound', targetType: 'all' },
                newItems: { name: 'creates', direction: 'outbound', targetType: 'all' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'type', 'reporterType', 'rootCause', 'correctiveActions', 'preventiveActions'],
                metadata: ['status', 'assignee', 'introducedInVersion'],
                relationships: ['affectedItems', 'newItems']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'type', label: 'CAPA Type', type: 'select', template: '{fieldContent.Type}', categories: ['core'] },
                { id: 'reporterType', label: 'Reporter Type', type: 'select', template: '{fieldContent.Reporter_type}', categories: ['core'] },
                { id: 'rootCause', label: 'Root Cause Analysis', type: 'richText', template: '{~~ fieldContent.Root_cause_analysis}', categories: ['core'] },
                { id: 'correctiveActions', label: 'Corrective Actions', type: 'richText', template: '{~~ fieldContent.Corrective_actions}', categories: ['core'] },
                { id: 'preventiveActions', label: 'Preventive Actions', type: 'richText', template: '{~~ fieldContent.Preventive_actions}', categories: ['core'] },
                { id: 'affectedItems', label: 'Affected Items', type: 'relation', relation: { name: 'affects', direction: 'outbound', targetType: 'all' }, template: relationTemplate('affects'), categories: ['relationships'] },
                { id: 'newItems', label: 'New Items', type: 'relation', relation: { name: 'creates', direction: 'outbound', targetType: 'all' }, template: relationTemplate('creates'), categories: ['relationships'] }
            ]
        },
        {
            id: 'complaints',
            label: 'Complaints',
            description: 'Customer complaints and regulatory reportability tracking.',
            kql: { typeCodes: ['WI-07'] },
            defaultFields: ['id', 'title', 'complaintType', 'description', 'dateReceived', 'investigationRequired'],
            supportsCustomFields: true,
            relations: {
                affectedItems: { name: 'affects', direction: 'outbound', targetType: 'all' },
                foundAnomalies: { name: 'found-anomalies', direction: 'outbound', targetType: 'anomalies' },
                resolvedBy: { name: 'resolved-by', direction: 'outbound', targetType: 'tasks' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'complaintType', 'originalCustomerComplaint', 'deviceName', 'dateReceived', 'investigationRequired', 'investigation', 'replyToComplainant'],
                metadata: ['status', 'assignee', 'introducedInVersion'],
                relationships: ['affectedItems', 'foundAnomalies', 'resolvedBy'],
                audit: ['dateInvestigationCompleted', 'complainantContact']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'complaintType', label: 'Complaint Type', type: 'select', template: '{fieldContent.Complaint_type}', categories: ['core'] },
                { id: 'originalCustomerComplaint', label: 'Original Customer Complaint', type: 'richText', template: '{~~ fieldContent.Original_customer_complaint}', categories: ['core'] },
                { id: 'deviceName', label: 'Name of Medical Device', type: 'text', template: '{fieldContent.Name_of_medical_device}', categories: ['core'] },
                { id: 'dateReceived', label: 'Date Received', type: 'date', template: '{fieldContent.Date_received}', categories: ['core'] },
                { id: 'complainantContact', label: 'Complainant Contact Information', type: 'text', template: '{fieldContent.Complainant_contact_information}', categories: ['audit'] },
                { id: 'investigationRequired', label: 'Investigation Required', type: 'select', template: '{fieldContent.Investigation_required}', categories: ['core'] },
                { id: 'dateInvestigationCompleted', label: 'Date Investigation Completed', type: 'date', template: '{fieldContent.Date_investigation_completed}', categories: ['audit'] },
                { id: 'investigation', label: 'Investigation', type: 'richText', template: '{~~ fieldContent.Investigation}', categories: ['core'] },
                { id: 'replyToComplainant', label: 'Reply to Complainant', type: 'richText', template: '{~~ fieldContent.Reply_to_complainant}', categories: ['core'] },
                { id: 'affectedItems', label: 'Affected Items', type: 'relation', relation: { name: 'affects', direction: 'outbound', targetType: 'all' }, template: relationTemplate('affects'), categories: ['relationships'] },
                { id: 'foundAnomalies', label: 'Found Anomalies', type: 'relation', relation: { name: 'found-anomalies', direction: 'outbound', targetType: 'anomalies' }, template: relationTemplate('found-anomalies'), categories: ['relationships'] },
                { id: 'resolvedBy', label: 'Resolved By', type: 'relation', relation: { name: 'resolved-by', direction: 'outbound', targetType: 'tasks' }, template: relationTemplate('resolved-by'), categories: ['relationships'] }
            ]
        },
        {
            id: 'configurationItems',
            label: 'Configuration Items',
            description: 'Configuration items tracked for software and hardware asset management.',
            kql: { typeCodes: ['CI'] },
            defaultFields: ['id', 'title', 'description', 'manufacturer', 'configurationItemVersion'],
            supportsCustomFields: true,
            fieldCategories: {
                core: ['id', 'title', 'description', 'manufacturer', 'configurationItemVersion'],
                metadata: ['status', 'assignee', 'introducedInVersion']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'manufacturer', label: 'Manufacturer', type: 'text', template: '{fieldContent.Manufacturer}', categories: ['core'] },
                { id: 'configurationItemVersion', label: 'Configuration Item Version', type: 'text', template: '{fieldContent.Configuration_item_version}', categories: ['core'] }
            ]
        },
        {
            id: 'tasks',
            label: 'Tasks',
            description: 'Tasks and implementation activities linked to project items.',
            kql: { typeCodes: ['TASK'] },
            defaultFields: ['id', 'title', 'description', 'implementedItems', 'relatedItems'],
            supportsCustomFields: true,
            relations: {
                implementedItems: { name: 'implements', direction: 'outbound', targetType: 'all' },
                relatedItems: { name: 'related-to', direction: 'bidirectional', targetType: 'all' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description'],
                metadata: ['status', 'assignee', 'introducedInVersion', 'createdAt'],
                relationships: ['implementedItems', 'relatedItems']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'implementedItems', label: 'Implemented Items', type: 'relation', relation: { name: 'implements', direction: 'outbound', targetType: 'all' }, template: relationTemplate('implements'), categories: ['relationships'] },
                { id: 'relatedItems', label: 'Related Items', type: 'relation', relation: { name: 'related-to', direction: 'bidirectional', targetType: 'all' }, template: relationTemplate('related-to'), categories: ['relationships'] }
            ]
        },
        {
            id: 'dependencies',
            label: 'Dependencies',
            description: 'External dependencies and supplier components with lifecycle metadata.',
            kql: { typeCodes: ['DEP'] },
            defaultFields: ['id', 'title', 'description', 'homepage', 'license', 'versionAcceptance', 'riskLevel'],
            supportsCustomFields: true,
            relations: {
                dependencyLinksTo: { name: 'dependency-links-to', direction: 'outbound', targetType: 'requirements' },
                introducedRisks: { name: 'introduces-risk', direction: 'outbound', targetType: 'risks' },
                testedBy: { name: 'tested-by', direction: 'outbound', targetType: 'tests' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'homepage', 'issuesUrl', 'repositoryUrl', 'license', 'manufacturer'],
                impact: ['securityImpact', 'securityImpactJustification', 'reliabilityImpact', 'reliabilityImpactJustification'],
                lifecycle: ['versionAcceptance', 'riskLevel', 'supportLevel', 'supportLevelDescription', 'endOfLife', 'endOfLifeDescription'],
                metadata: ['status', 'assignee', 'introducedInVersion'],
                relationships: ['dependencyLinksTo', 'introducedRisks', 'testedBy']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'homepage', label: 'Homepage', type: 'text', template: '{fieldContent.Homepage}', categories: ['core'] },
                { id: 'issuesUrl', label: 'Issues URL', type: 'text', template: '{fieldContent.Issues_URL}', categories: ['core'] },
                { id: 'repositoryUrl', label: 'Repository URL', type: 'text', template: '{fieldContent.Repository_URL}', categories: ['core'] },
                { id: 'license', label: 'License', type: 'text', template: '{fieldContent.License}', categories: ['core'] },
                { id: 'manufacturer', label: 'Manufacturer', type: 'text', template: '{fieldContent.Manufacturer}', categories: ['core'] },
                { id: 'securityImpact', label: 'Security Impact', type: 'text', template: '{fieldContent.Security_Impact}', categories: ['impact'] },
                { id: 'securityImpactJustification', label: 'Security Impact Justification', type: 'richText', template: '{~~ fieldContent.Security_impact_justification}', categories: ['impact'] },
                { id: 'reliabilityImpact', label: 'Reliability Impact', type: 'text', template: '{fieldContent.Reliability_impact}', categories: ['impact'] },
                { id: 'reliabilityImpactJustification', label: 'Reliability Impact Justification', type: 'richText', template: '{~~ fieldContent.Reliability_impact_justification}', categories: ['impact'] },
                { id: 'additionalNotes', label: 'Additional Notes', type: 'richText', template: '{~~ fieldContent.Additional_notes}', categories: ['impact'] },
                { id: 'versionAcceptance', label: 'Version(s) to Accept', type: 'select', template: '{fieldContent.Version_s_to_accept}', categories: ['lifecycle'] },
                { id: 'riskLevel', label: 'Risk Level', type: 'select', template: '{fieldContent.Risk_level}', categories: ['lifecycle'] },
                { id: 'supportLevel', label: 'Level of Support', type: 'select', template: '{fieldContent.Level_of_support}', categories: ['lifecycle'] },
                { id: 'supportLevelDescription', label: 'Level of Support Description', type: 'richText', template: '{~~ fieldContent.Level_of_support_description}', categories: ['lifecycle'] },
                { id: 'endOfLife', label: 'End of Life', type: 'date', template: '{fieldContent.End_of_life}', categories: ['lifecycle'] },
                { id: 'endOfLifeDescription', label: 'End of Life Description', type: 'richText', template: '{~~ fieldContent.End_of_life_description}', categories: ['lifecycle'] },
                { id: 'dependencyLinksTo', label: 'Dependency Links To', type: 'relation', relation: { name: 'dependency-links-to', direction: 'outbound', targetType: 'requirements' }, template: relationTemplate('dependency-links-to'), categories: ['relationships'] },
                { id: 'introducedRisks', label: 'Introduced Risks', type: 'relation', relation: { name: 'introduces-risk', direction: 'outbound', targetType: 'risks' }, template: relationTemplate('introduces-risk'), categories: ['relationships'] },
                { id: 'testedBy', label: 'Tested By', type: 'relation', relation: { name: 'tested-by', direction: 'outbound', targetType: 'tests' }, template: relationTemplate('tested-by'), categories: ['relationships'] }
            ]
        },
        {
            id: 'vulnerabilities',
            label: 'Vulnerabilities',
            description: 'Security vulnerability tracking with remediation links.',
            kql: { typeCodes: ['VULN'] },
            defaultFields: ['id', 'title', 'description', 'severity', 'remediation'],
            supportsCustomFields: true,
            relations: {
                relatedDependencies: { name: 'dependency-links-to', direction: 'outbound', targetType: 'dependencies' },
                mitigatedBy: { name: 'mitigated-by', direction: 'outbound', targetType: 'tasks' }
            },
            fieldCategories: {
                core: ['id', 'title', 'description', 'severity', 'remediation', 'reference'],
                metadata: ['status', 'assignee', 'introducedInVersion'],
                relationships: ['relatedDependencies', 'mitigatedBy']
            },
            fields: [
                { id: 'description', label: 'Description', type: 'richText', template: '{~~ fieldContent.Description}', categories: ['core'] },
                { id: 'severity', label: 'Severity', type: 'select', template: '{fieldContent.Severity}', categories: ['core'] },
                { id: 'remediation', label: 'Remediation', type: 'richText', template: '{~~ fieldContent.Remediation}', categories: ['core'] },
                { id: 'reference', label: 'Reference', type: 'text', template: '{fieldContent.Reference}', categories: ['core'] },
                { id: 'relatedDependencies', label: 'Related Dependencies', type: 'relation', relation: { name: 'dependency-links-to', direction: 'outbound', targetType: 'dependencies' }, template: relationTemplate('dependency-links-to'), categories: ['relationships'] },
                { id: 'mitigatedBy', label: 'Mitigated By', type: 'relation', relation: { name: 'mitigated-by', direction: 'outbound', targetType: 'tasks' }, template: relationTemplate('mitigated-by'), categories: ['relationships'] }
            ]
        }
    ];

    function mergeCommonFields(typeDefinition) {
        const fieldMap = {};
        commonFields.forEach(field => { fieldMap[field.id] = { ...field }; });
        typeDefinition.fields.forEach(field => { fieldMap[field.id] = field; });
        const mergedFields = Object.values(fieldMap);
        return { ...typeDefinition, fields: mergedFields };
    }

    const enrichedItemTypes = itemTypes.map(mergeCommonFields);

    const filterTypes = {
        basic: [
            { id: 'status', label: 'Status', input: 'multiselect', optionsKey: 'statuses', kqlTemplate: 'status:(${values})' },
            { id: 'type', label: 'Type', input: 'multiselect', optionsKey: 'itemTypes', kqlTemplate: 'type:(${values})' },
            { id: 'priority', label: 'Priority', input: 'multiselect', optionsKey: 'requirementPriorities', kqlTemplate: '"Priority":(${values})' },
            { id: 'version', label: 'Version', input: 'multiVersion', optionsKey: 'versions', kqlTemplate: 'introducedInVersion:(${values})' },
            { id: 'dateRange', label: 'Date Range', input: 'dateRange', kqlTemplate: 'createdAt>="${start}" AND createdAt<="${end}"' }
        ],
        advanced: [
            { id: 'relations_to', label: 'Relation To', input: 'relation', direction: 'to' },
            { id: 'relations_from', label: 'Relation From', input: 'relation', direction: 'from' },
            { id: 'diff', label: 'Version Diff', input: 'select', options: [
                { value: 'new', label: 'New in Version' },
                { value: 'removed', label: 'Removed in Version' }
            ], kqlTemplate: 'diff:${value}' }
        ]
    };

    const optionCatalog = {
        statuses: [
            { value: 'Draft', label: 'Draft' },
            { value: 'In Review', label: 'In Review' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Released', label: 'Released' },
            { value: 'Obsolete', label: 'Obsolete' }
        ],
        requirementPriorities: [
            { value: 'Critical', label: 'Critical' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' }
        ],
        versions: [
            { value: '1.0.0', label: '1.0.0' },
            { value: '1.1.0', label: '1.1.0' },
            { value: '2.0.0', label: '2.0.0' }
        ],
        itemTypes: enrichedItemTypes.map(type => ({ value: type.id, label: type.label }))
    };

    const presets = {
        documents: [
            {
                id: 'srs',
                label: 'Software Requirements Specification',
                description: 'Generates SRS with hierarchical requirements, traceability, and summaries.',
                sections: [
                    {
                        id: 'srs_requirements',
                        title: 'Requirements Overview',
                        itemType: 'requirements',
                        hierarchy: true,
                        defaultFormat: 'hierarchy',
                        fields: ['id', 'title', 'description', 'requirementType', 'priority', 'parentRequirements', 'riskControlFor', 'fulfilledBy']
                    },
                    {
                        id: 'srs_traces',
                        title: 'Traceability Matrix',
                        template: '{$TRACE RequirementsToTests}',
                        description: 'Cross reference between requirements and tests.'
                    }
                ]
            },
            {
                id: 'risk_report',
                label: 'Risk Management Report',
                description: 'Risk file with mitigation, residual risk, and linked controls.',
                sections: [
                    {
                        id: 'risk_summary',
                        title: 'Risk Summary',
                        itemType: 'risks',
                        defaultFormat: 'table',
                        fields: ['id', 'title', 'severity', 'probability', 'riskLevel', 'mitigation', 'riskControls']
                    },
                    {
                        id: 'risk_trace',
                        title: 'Requirement Trace Matrix',
                        template: '{$TRACE RequirementsToRisks}'
                    }
                ]
            }
        ]
    };

    global.KetryxTemplateConfig = {
        version: '0.1.0',
        generatedAt: new Date().toISOString(),
        itemTypes: enrichedItemTypes,
        filterTypes,
        optionCatalog,
        presets
    };
})(window);
