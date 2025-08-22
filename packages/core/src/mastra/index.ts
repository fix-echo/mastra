import type { Agent } from '../agent';
import { getAllAITracing, setupAITracing, shutdownAITracingRegistry } from '../ai-tracing';
import type { AITracingConfig } from '../ai-tracing';
import type { BundlerConfig } from '../bundler/types';
import type { MastraDeployer } from '../deployer';
import { MastraError, ErrorDomain, ErrorCategory } from '../error';
import { AvailableHooks, registerHook } from '../hooks';
import { LogLevel, noopLogger, ConsoleLogger } from '../logger';
import type { IMastraLogger } from '../logger';
import type { MCPServerBase } from '../mcp';
import type { MastraMemory } from '../memory/memory';
import type { AgentNetwork } from '../network';
import type { NewAgentNetwork } from '../network/vNext';
import type { Middleware, ServerConfig } from '../server/types';
import type { MastraStorage } from '../storage';
import { augmentWithInit } from '../storage/storageWithInit';
import { InstrumentClass, Telemetry } from '../telemetry';
import type { OtelConfig } from '../telemetry';
import type { MastraTTS } from '../tts';
import type { MastraIdGenerator } from '../types';
import type { MastraVector } from '../vector';
import type { Workflow } from '../workflows';
import type { LegacyWorkflow } from '../workflows/legacy';
import { createOnScorerHook } from './hooks';

export interface Config<
  TAgents extends Record<string, Agent<any>> = Record<string, Agent<any>>,
  TLegacyWorkflows extends Record<string, LegacyWorkflow> = Record<string, LegacyWorkflow>,
  TWorkflows extends Record<string, Workflow> = Record<string, Workflow>,
  TVectors extends Record<string, MastraVector> = Record<string, MastraVector>,
  TTTS extends Record<string, MastraTTS> = Record<string, MastraTTS>,
  TLogger extends IMastraLogger = IMastraLogger,
  TNetworks extends Record<string, AgentNetwork> = Record<string, AgentNetwork>,
  TVNextNetworks extends Record<string, NewAgentNetwork> = Record<string, NewAgentNetwork>,
  TMCPServers extends Record<string, MCPServerBase> = Record<string, MCPServerBase>,
> {
  agents?: TAgents;
  networks?: TNetworks;
  vnext_networks?: TVNextNetworks;
  storage?: MastraStorage;
  vectors?: TVectors;
  logger?: TLogger | false;
  legacy_workflows?: TLegacyWorkflows;
  workflows?: TWorkflows;
  tts?: TTTS;
  telemetry?: OtelConfig;
  observability?: AITracingConfig;
  idGenerator?: MastraIdGenerator;
  deployer?: MastraDeployer;
  server?: ServerConfig;
  mcpServers?: TMCPServers;
  bundler?: BundlerConfig;

  /**
   * 要应用到API路由的服务器中间件函数
   * 每个中间件可以指定路径模式（默认值为'/api/*'）
   * @已弃用 请使用server.middleware代替
   */
  serverMiddleware?: Array<{
    handler: (c: any, next: () => Promise<void>) => Promise<Response | void>;
    path?: string;
  }>;

  // @已弃用 请直接将memory添加到Agent中 instead
  memory?: never;
}

@InstrumentClass({
  prefix: 'mastra',
  excludeMethods: ['getLogger', 'getTelemetry'],
})
export class Mastra<
  TAgents extends Record<string, Agent<any>> = Record<string, Agent<any>>,
  TLegacyWorkflows extends Record<string, LegacyWorkflow> = Record<string, LegacyWorkflow>,
  TWorkflows extends Record<string, Workflow> = Record<string, Workflow>,
  TVectors extends Record<string, MastraVector> = Record<string, MastraVector>,
  TTTS extends Record<string, MastraTTS> = Record<string, MastraTTS>,
  TLogger extends IMastraLogger = IMastraLogger,
  TNetworks extends Record<string, AgentNetwork> = Record<string, AgentNetwork>,
  TVNextNetworks extends Record<string, NewAgentNetwork> = Record<string, NewAgentNetwork>,
  TMCPServers extends Record<string, MCPServerBase> = Record<string, MCPServerBase>,
> {
  #vectors?: TVectors;
  #agents: TAgents;
  #logger: TLogger;
  #legacy_workflows: TLegacyWorkflows;
  #workflows: TWorkflows;
  #tts?: TTTS;
  #deployer?: MastraDeployer;
  #serverMiddleware: Array<{
    handler: (c: any, next: () => Promise<void>) => Promise<Response | void>;
    path: string;
  }> = [];
  #telemetry?: Telemetry;
  #storage?: MastraStorage;
  #memory?: MastraMemory;
  #networks?: TNetworks;
  #vnext_networks?: TVNextNetworks;
  #server?: ServerConfig;
  #mcpServers?: TMCPServers;
  #bundler?: BundlerConfig;
  #idGenerator?: MastraIdGenerator;

  /**
   * @已弃用 请使用getTelemetry()代替
   */
  get telemetry() {
    return this.#telemetry;
  }

  /**
   * @已弃用 请使用getStorage()代替
   */
  get storage() {
    return this.#storage;
  }

  /**
   * @已弃用 请使用getMemory()代替
   */
  get memory() {
    return this.#memory;
  }

  public getIdGenerator() {
    return this.#idGenerator;
  }

  /**
   * 使用配置的生成器生成唯一标识符，或默认使用crypto.randomUUID()
   * @returns 唯一字符串ID
   */
  public generateId(): string {
    if (this.#idGenerator) {
      const id = this.#idGenerator();
      if (!id) {
        const error = new MastraError({
          id: 'MASTRA_ID_GENERATOR_RETURNED_EMPTY_STRING',
          domain: ErrorDomain.MASTRA,
          category: ErrorCategory.USER,
          text: 'ID生成器返回了空字符串，这是不允许的',
        });
        this.#logger?.trackException(error);
        throw error;
      }
      return id;
    }
    return crypto.randomUUID();
  }

  public setIdGenerator(idGenerator: MastraIdGenerator) {
    this.#idGenerator = idGenerator;
  }

  constructor(
    config?: Config<
      TAgents,
      TLegacyWorkflows,
      TWorkflows,
      TVectors,
      TTTS,
      TLogger,
      TNetworks,
      TVNextNetworks,
      TMCPServers
    >,
  ) {
    // 存储带有默认路径的服务器中间件
    if (config?.serverMiddleware) {
      this.#serverMiddleware = config.serverMiddleware.map(m => ({
        handler: m.handler,
        path: m.path || '/api/*',
      }));
    }

    /*
      日志记录器
    */

    let logger: TLogger;
    if (config?.logger === false) {
      logger = noopLogger as unknown as TLogger;
    } else {
      if (config?.logger) {
        logger = config.logger;
      } else {
        const levelOnEnv =
          process.env.NODE_ENV === 'production' && process.env.MASTRA_DEV !== 'true' ? LogLevel.WARN : LogLevel.INFO;
        logger = new ConsoleLogger({ name: 'Mastra', level: levelOnEnv }) as unknown as TLogger;
      }
    }
    this.#logger = logger;

    this.#idGenerator = config?.idGenerator;

    let storage = config?.storage;

    if (storage) {
      storage = augmentWithInit(storage);
    }

    /*
    遥测(Telemetry)
    */

    this.#telemetry = Telemetry.init(config?.telemetry);

    // 如果启用了遥测但未设置instrumentation全局变量，发出警告
    if (
      config?.telemetry?.enabled !== false &&
      typeof globalThis !== 'undefined' &&
      (globalThis as any).___MASTRA_TELEMETRY___ !== true
    ) {
      this.#logger?.warn(
        `已启用Mastra遥测，但未加载所需的instrumentation文件。` +
          `如果你在mastra服务器环境之外使用Mastra，请参阅：https://mastra.ai/en/docs/observability/tracing#tracing-outside-mastra-server-environment`,
        `如果你正在使用自定义instrumentation文件或想要禁用此警告，请在instrumentation文件中将globalThis.___MASTRA_TELEMETRY___变量设置为true。`,
      );
    }

    /*
    AI跟踪
    */

    if (config?.observability) {
      setupAITracing(config.observability);
    }

    /*
      存储(Storage)
    */
    if (this.#telemetry && storage) {
      this.#storage = this.#telemetry.traceClass(storage, {
        excludeMethods: ['__setTelemetry', '__getTelemetry', 'batchTraceInsert', 'getTraces', 'getEvalsByAgentName'],
      });
      this.#storage.__setTelemetry(this.#telemetry);
    } else {
      this.#storage = storage;
    }

    /*
    向量(Vectors)
    */
    if (config?.vectors) {
      let vectors: Record<string, MastraVector> = {};
      Object.entries(config.vectors).forEach(([key, vector]) => {
        if (this.#telemetry) {
          vectors[key] = this.#telemetry.traceClass(vector, {
            excludeMethods: ['__setTelemetry', '__getTelemetry'],
          });
          vectors[key].__setTelemetry(this.#telemetry);
        } else {
          vectors[key] = vector;
        }
      });

      this.#vectors = vectors as TVectors;
    }

    if (config?.networks) {
      this.#networks = config.networks;
    }

    if (config?.vnext_networks) {
      this.#vnext_networks = config.vnext_networks;
    }

    if (config?.mcpServers) {
      this.#mcpServers = config.mcpServers;

      // Set logger/telemetry/Mastra instance/id for MCP servers
      Object.entries(this.#mcpServers).forEach(([key, server]) => {
        server.setId(key);
        if (this.#telemetry) {
          server.__setTelemetry(this.#telemetry);
        }

        server.__registerMastra(this);
        server.__setLogger(this.getLogger());
      });
    }

    if (config && `memory` in config) {
      const error = new MastraError({
        id: 'MASTRA_CONSTRUCTOR_INVALID_MEMORY_CONFIG',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: `
  内存(Memory)应添加到Agent，而不是Mastra。

而不是：
  new Mastra({ memory: new Memory() })

应该：
  new Agent({ memory: new Memory() })
`,
      });
      this.#logger?.trackException(error);
      throw error;
    }

    if (config?.tts) {
      this.#tts = config.tts;
      Object.entries(this.#tts).forEach(([key, ttsCl]) => {
        if (this.#tts?.[key]) {
          if (this.#telemetry) {
            // @ts-ignore
            this.#tts[key] = this.#telemetry.traceClass(ttsCl, {
              excludeMethods: ['__setTelemetry', '__getTelemetry'],
            });
            this.#tts[key].__setTelemetry(this.#telemetry);
          }
        }
      });
    }

    /*
    代理(Agents)
    */
    const agents: Record<string, Agent> = {};
    if (config?.agents) {
      Object.entries(config.agents).forEach(([key, agent]) => {
        if (agents[key]) {
          const error = new MastraError({
            id: 'MASTRA_AGENT_REGISTRATION_DUPLICATE_ID',
            domain: ErrorDomain.MASTRA,
            category: ErrorCategory.USER,
            text: `已存在名为ID:${key}的代理`,
            details: {
              agentId: key,
            },
          });
          this.#logger?.trackException(error);
          throw error;
        }
        agent.__registerMastra(this);

        agent.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: this.#telemetry,
          storage: this.storage,
          memory: this.memory,
          agents: agents,
          tts: this.#tts,
          vectors: this.#vectors,
        });

        agents[key] = agent;
      });
    }

    this.#agents = agents as TAgents;

    /*
    网络(Networks)
    */
    this.#networks = {} as TNetworks;
    this.#vnext_networks = {} as TVNextNetworks;

    if (config?.networks) {
      Object.entries(config.networks).forEach(([key, network]) => {
        network.__registerMastra(this);
        // @ts-ignore
        this.#networks[key] = network;
      });
    }

    if (config?.vnext_networks) {
      Object.entries(config.vnext_networks).forEach(([key, network]) => {
        network.__registerMastra(this);
        // @ts-ignore
        this.#vnext_networks[key] = network;
      });
    }

    /*
    传统工作流(Legacy Workflows)
    */
    this.#legacy_workflows = {} as TLegacyWorkflows;

    if (config?.legacy_workflows) {
      Object.entries(config.legacy_workflows).forEach(([key, workflow]) => {
        workflow.__registerMastra(this);
        workflow.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: this.#telemetry,
          storage: this.storage,
          memory: this.memory,
          agents: agents,
          tts: this.#tts,
          vectors: this.#vectors,
        });
        // @ts-ignore
        this.#legacy_workflows[key] = workflow;

        const workflowSteps = Object.values(workflow.steps).filter(step => !!step.workflowId && !!step.workflow);
        if (workflowSteps.length > 0) {
          workflowSteps.forEach(step => {
            // @ts-ignore
            this.#legacy_workflows[step.workflowId] = step.workflow;
          });
        }
      });
    }

    this.#workflows = {} as TWorkflows;
    if (config?.workflows) {
      Object.entries(config.workflows).forEach(([key, workflow]) => {
        workflow.__registerMastra(this);
        workflow.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: this.#telemetry,
          storage: this.storage,
          memory: this.memory,
          agents: agents,
          tts: this.#tts,
          vectors: this.#vectors,
        });
        // @ts-ignore
        this.#workflows[key] = workflow;
      });
    }

    if (config?.server) {
      this.#server = config.server;
    }

    registerHook(AvailableHooks.ON_SCORER_RUN, createOnScorerHook(this));

    this.setLogger({ logger });
  }

  public getAgent<TAgentName extends keyof TAgents>(name: TAgentName): TAgents[TAgentName] {
    const agent = this.#agents?.[name];
    if (!agent) {
      const error = new MastraError({
        id: 'MASTRA_GET_AGENT_BY_NAME_NOT_FOUND',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: `Agent with name ${String(name)} not found`,
        details: {
          status: 404,
          agentName: String(name),
          agents: Object.keys(this.#agents ?? {}).join(', '),
        },
      });
      this.#logger?.trackException(error);
      throw error;
    }
    return this.#agents[name];
  }

  public getAgentById(id: string): Agent {
    let agent = Object.values(this.#agents).find(a => a.id === id);

    if (!agent) {
      try {
        agent = this.getAgent(id as any);
      } catch {
        // do nothing
      }
    }

    if (!agent) {
      const error = new MastraError({
        id: 'MASTRA_GET_AGENT_BY_AGENT_ID_NOT_FOUND',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: `Agent with id ${String(id)} not found`,
        details: {
          status: 404,
          agentId: String(id),
          agents: Object.keys(this.#agents ?? {}).join(', '),
        },
      });
      this.#logger?.trackException(error);
      throw error;
    }

    return agent;
  }

  public getAgents() {
    return this.#agents;
  }

  public getVector<TVectorName extends keyof TVectors>(name: TVectorName): TVectors[TVectorName] {
    const vector = this.#vectors?.[name];
    if (!vector) {
      const error = new MastraError({
        id: 'MASTRA_GET_VECTOR_BY_NAME_NOT_FOUND',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: `Vector with name ${String(name)} not found`,
        details: {
          status: 404,
          vectorName: String(name),
          vectors: Object.keys(this.#vectors ?? {}).join(', '),
        },
      });
      this.#logger?.trackException(error);
      throw error;
    }
    return vector;
  }

  public getVectors() {
    return this.#vectors;
  }

  public getDeployer() {
    return this.#deployer;
  }

  public legacy_getWorkflow<TWorkflowId extends keyof TLegacyWorkflows>(
    id: TWorkflowId,
    { serialized }: { serialized?: boolean } = {},
  ): TLegacyWorkflows[TWorkflowId] {
    const workflow = this.#legacy_workflows?.[id];
    if (!workflow) {
      const error = new MastraError({
        id: 'MASTRA_GET_LEGACY_WORKFLOW_BY_ID_NOT_FOUND',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: `Workflow with ID ${String(id)} not found`,
        details: {
          status: 404,
          workflowId: String(id),
          workflows: Object.keys(this.#legacy_workflows ?? {}).join(', '),
        },
      });
      this.#logger?.trackException(error);
      throw error;
    }

    if (serialized) {
      return { name: workflow.name } as TLegacyWorkflows[TWorkflowId];
    }

    return workflow;
  }

  public getWorkflow<TWorkflowId extends keyof TWorkflows>(
    id: TWorkflowId,
    { serialized }: { serialized?: boolean } = {},
  ): TWorkflows[TWorkflowId] {
    const workflow = this.#workflows?.[id];
    if (!workflow) {
      const error = new MastraError({
        id: 'MASTRA_GET_WORKFLOW_BY_ID_NOT_FOUND',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: `Workflow with ID ${String(id)} not found`,
        details: {
          status: 404,
          workflowId: String(id),
          workflows: Object.keys(this.#workflows ?? {}).join(', '),
        },
      });
      this.#logger?.trackException(error);
      throw error;
    }

    if (serialized) {
      return { name: workflow.name } as TWorkflows[TWorkflowId];
    }

    return workflow;
  }

  public getWorkflowById(id: string): Workflow {
    let workflow = Object.values(this.#workflows).find(a => a.id === id);

    if (!workflow) {
      try {
        workflow = this.getWorkflow(id as any);
      } catch {
        // do nothing
      }
    }

    if (!workflow) {
      const error = new MastraError({
        id: 'MASTRA_GET_WORKFLOW_BY_ID_NOT_FOUND',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: `Workflow with id ${String(id)} not found`,
        details: {
          status: 404,
          workflowId: String(id),
          workflows: Object.keys(this.#workflows ?? {}).join(', '),
        },
      });
      this.#logger?.trackException(error);
      throw error;
    }

    return workflow;
  }

  public legacy_getWorkflows(props: { serialized?: boolean } = {}): Record<string, LegacyWorkflow> {
    if (props.serialized) {
      return Object.entries(this.#legacy_workflows).reduce((acc, [k, v]) => {
        return {
          ...acc,
          [k]: { name: v.name },
        };
      }, {});
    }
    return this.#legacy_workflows;
  }

  public getWorkflows(props: { serialized?: boolean } = {}): Record<string, Workflow> {
    if (props.serialized) {
      return Object.entries(this.#workflows).reduce((acc, [k, v]) => {
        return {
          ...acc,
          [k]: { name: v.name },
        };
      }, {});
    }
    return this.#workflows;
  }

  public setStorage(storage: MastraStorage) {
    this.#storage = augmentWithInit(storage);
  }

  public setLogger({ logger }: { logger: TLogger }) {
    this.#logger = logger;

    if (this.#agents) {
      Object.keys(this.#agents).forEach(key => {
        this.#agents?.[key]?.__setLogger(this.#logger);
      });
    }

    if (this.#memory) {
      this.#memory.__setLogger(this.#logger);
    }

    if (this.#deployer) {
      this.#deployer.__setLogger(this.#logger);
    }

    if (this.#tts) {
      Object.keys(this.#tts).forEach(key => {
        this.#tts?.[key]?.__setLogger(this.#logger);
      });
    }

    if (this.#storage) {
      this.#storage.__setLogger(this.#logger);
    }

    if (this.#vectors) {
      Object.keys(this.#vectors).forEach(key => {
        this.#vectors?.[key]?.__setLogger(this.#logger);
      });
    }

    if (this.#mcpServers) {
      Object.keys(this.#mcpServers).forEach(key => {
        this.#mcpServers?.[key]?.__setLogger(this.#logger);
      });
    }

    // Set logger for AI tracing instances
    const allTracingInstances = getAllAITracing();
    allTracingInstances.forEach(instance => {
      instance.__setLogger(this.#logger);
    });
  }

  public setTelemetry(telemetry: OtelConfig) {
    this.#telemetry = Telemetry.init(telemetry);

    if (this.#agents) {
      Object.keys(this.#agents).forEach(key => {
        if (this.#telemetry) {
          this.#agents?.[key]?.__setTelemetry(this.#telemetry);
        }
      });
    }

    if (this.#memory) {
      this.#memory = this.#telemetry.traceClass(this.#memory, {
        excludeMethods: ['__setTelemetry', '__getTelemetry'],
      });
      this.#memory.__setTelemetry(this.#telemetry);
    }

    if (this.#deployer) {
      this.#deployer = this.#telemetry.traceClass(this.#deployer, {
        excludeMethods: ['__setTelemetry', '__getTelemetry'],
      });
      this.#deployer.__setTelemetry(this.#telemetry);
    }

    if (this.#tts) {
      let tts = {} as Record<string, MastraTTS>;
      Object.entries(this.#tts).forEach(([key, ttsCl]) => {
        if (this.#telemetry) {
          tts[key] = this.#telemetry.traceClass(ttsCl, {
            excludeMethods: ['__setTelemetry', '__getTelemetry'],
          });
          tts[key].__setTelemetry(this.#telemetry);
        }
      });
      this.#tts = tts as TTTS;
    }

    if (this.#storage) {
      this.#storage = this.#telemetry.traceClass(this.#storage, {
        excludeMethods: ['__setTelemetry', '__getTelemetry'],
      });
      this.#storage.__setTelemetry(this.#telemetry);
    }

    if (this.#vectors) {
      let vectors = {} as Record<string, MastraVector>;
      Object.entries(this.#vectors).forEach(([key, vector]) => {
        if (this.#telemetry) {
          vectors[key] = this.#telemetry.traceClass(vector, {
            excludeMethods: ['__setTelemetry', '__getTelemetry'],
          });
          vectors[key].__setTelemetry(this.#telemetry);
        }
      });
      this.#vectors = vectors as TVectors;
    }
  }

  public getTTS() {
    return this.#tts;
  }

  public getLogger() {
    return this.#logger;
  }

  public getTelemetry() {
    return this.#telemetry;
  }

  public getMemory() {
    return this.#memory;
  }

  public getStorage() {
    return this.#storage;
  }

  public getServerMiddleware() {
    return this.#serverMiddleware;
  }

  public setServerMiddleware(serverMiddleware: Middleware | Middleware[]) {
    if (typeof serverMiddleware === 'function') {
      this.#serverMiddleware = [
        {
          handler: serverMiddleware,
          path: '/api/*',
        },
      ];
      return;
    }

    if (!Array.isArray(serverMiddleware)) {
      const error = new MastraError({
        id: 'MASTRA_SET_SERVER_MIDDLEWARE_INVALID_TYPE',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: `Invalid middleware: expected a function or array, received ${typeof serverMiddleware}`,
      });
      this.#logger?.trackException(error);
      throw error;
    }

    this.#serverMiddleware = serverMiddleware.map(m => {
      if (typeof m === 'function') {
        return {
          handler: m,
          path: '/api/*',
        };
      }
      return {
        handler: m.handler,
        path: m.path || '/api/*',
      };
    });
  }

  public getNetworks() {
    return Object.values(this.#networks || {});
  }

  public vnext_getNetworks() {
    return Object.values(this.#vnext_networks || {});
  }

  public getServer() {
    return this.#server;
  }

  public getBundlerConfig() {
    return this.#bundler;
  }

  /**
   * 根据ID获取特定网络
   * @param networkId - 要检索的网络ID
   * @returns 指定ID的网络，如果未找到则返回undefined
   */
  public getNetwork(networkId: string): AgentNetwork | undefined {
    const networks = this.getNetworks();
    return networks.find(network => {
      const routingAgent = network.getRoutingAgent();
      return network.formatAgentId(routingAgent.name) === networkId;
    });
  }

  public vnext_getNetwork(networkId: string): NewAgentNetwork | undefined {
    const networks = this.vnext_getNetworks();
    return networks.find(network => network.id === networkId);
  }

  public async getLogsByRunId({
    runId,
    transportId,
    fromDate,
    toDate,
    logLevel,
    filters,
    page,
    perPage,
  }: {
    runId: string;
    transportId: string;
    fromDate?: Date;
    toDate?: Date;
    logLevel?: LogLevel;
    filters?: Record<string, any>;
    page?: number;
    perPage?: number;
  }) {
    if (!transportId) {
      const error = new MastraError({
        id: 'MASTRA_GET_LOGS_BY_RUN_ID_MISSING_TRANSPORT',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: 'Transport ID is required',
        details: {
          runId,
          transportId,
        },
      });
      this.#logger?.trackException(error);
      throw error;
    }

    if (!this.#logger?.getLogsByRunId) {
      const error = new MastraError({
        id: 'MASTRA_GET_LOGS_BY_RUN_ID_LOGGER_NOT_CONFIGURED',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.SYSTEM,
        text: 'Logger is not configured or does not support getLogsByRunId operation',
        details: {
          runId,
          transportId,
        },
      });
      this.#logger?.trackException(error);
      throw error;
    }

    return await this.#logger.getLogsByRunId({
      runId,
      transportId,
      fromDate,
      toDate,
      logLevel,
      filters,
      page,
      perPage,
    });
  }

  public async getLogs(
    transportId: string,
    params?: {
      fromDate?: Date;
      toDate?: Date;
      logLevel?: LogLevel;
      filters?: Record<string, any>;
      page?: number;
      perPage?: number;
    },
  ) {
    if (!transportId) {
      const error = new MastraError({
        id: 'MASTRA_GET_LOGS_MISSING_TRANSPORT',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.USER,
        text: 'Transport ID is required',
        details: {
          transportId,
        },
      });
      this.#logger?.trackException(error);
      throw error;
    }

    if (!this.#logger) {
      const error = new MastraError({
        id: 'MASTRA_GET_LOGS_LOGGER_NOT_CONFIGURED',
        domain: ErrorDomain.MASTRA,
        category: ErrorCategory.SYSTEM,
        text: 'Logger is not set',
        details: {
          transportId,
        },
      });
      throw error;
    }

    return await this.#logger.getLogs(transportId, params);
  }

  /**
   * 获取所有已注册的MCP服务器实例。
   * @returns MCP服务器ID到MCPServerBase实例的映射记录，如果没有注册则返回undefined。
   */
  public getMCPServers(): Record<string, MCPServerBase> | undefined {
    return this.#mcpServers;
  }

  /**
   * 获取特定MCP服务器实例。
   * 如果提供了版本，它会尝试查找具有该确切逻辑ID和版本的服务器。
   * 如果未提供版本，它会返回具有指定逻辑ID并具有最近发布日期的服务器。
   * 逻辑ID应与MCPServer实例的`id`属性匹配（通常通过MCPServerConfig.id设置）。
   * @param serverId - 要检索的MCP服务器的逻辑ID。
   * @param version - 要检索的MCP服务器的可选特定版本。
   * @returns MCP服务器实例，如果未找到或特定版本未找到则返回undefined。
   */
  public getMCPServer(serverId: string, version?: string): MCPServerBase | undefined {
    if (!this.#mcpServers) {
      return undefined;
    }

    const allRegisteredServers = Object.values(this.#mcpServers || {});

    const matchingLogicalIdServers = allRegisteredServers.filter(server => server.id === serverId);

    if (matchingLogicalIdServers.length === 0) {
      this.#logger?.debug(`No MCP servers found with logical ID: ${serverId}`);
      return undefined;
    }

    if (version) {
      const specificVersionServer = matchingLogicalIdServers.find(server => server.version === version);
      if (!specificVersionServer) {
        this.#logger?.debug(`MCP server with logical ID '${serverId}' found, but not version '${version}'.`);
      }
      return specificVersionServer;
    } else {
      // No version specified, find the one with the most recent releaseDate
      if (matchingLogicalIdServers.length === 1) {
        return matchingLogicalIdServers[0];
      }

      matchingLogicalIdServers.sort((a, b) => {
        // Ensure releaseDate exists and is a string before creating a Date object
        const dateAVal = a.releaseDate && typeof a.releaseDate === 'string' ? new Date(a.releaseDate).getTime() : NaN;
        const dateBVal = b.releaseDate && typeof b.releaseDate === 'string' ? new Date(b.releaseDate).getTime() : NaN;

        if (isNaN(dateAVal) && isNaN(dateBVal)) return 0;
        if (isNaN(dateAVal)) return 1; // Treat invalid/missing dates as older
        if (isNaN(dateBVal)) return -1; // Treat invalid/missing dates as older

        return dateBVal - dateAVal; // Sorts in descending order of time (latest first)
      });

      // After sorting, the first element should be the latest if its date is valid
      if (matchingLogicalIdServers.length > 0) {
        const latestServer = matchingLogicalIdServers[0];
        if (
          latestServer &&
          latestServer.releaseDate &&
          typeof latestServer.releaseDate === 'string' &&
          !isNaN(new Date(latestServer.releaseDate).getTime())
        ) {
          return latestServer;
        }
      }
      this.#logger?.warn(
        `Could not determine the latest server for logical ID '${serverId}' due to invalid or missing release dates, or no servers left after filtering.`,
      );
      return undefined;
    }
  }

  /**
   * 关闭Mastra并清理所有资源
   */
  async shutdown(): Promise<void> {
    // Shutdown AI tracing registry and all instances
    await shutdownAITracingRegistry();

    this.#logger?.info('Mastra shutdown completed');
  }
}
