import type { ToolExecutionOptions } from 'ai';
import type { z } from 'zod';

import type { Mastra } from '../mastra';
import type { ToolAction, ToolExecutionContext } from './types';
import { validateToolInput } from './validation';

export class Tool<
  TSchemaIn extends z.ZodSchema | undefined = undefined,
  TSchemaOut extends z.ZodSchema | undefined = undefined,
  TContext extends ToolExecutionContext<TSchemaIn> = ToolExecutionContext<TSchemaIn>,
> implements ToolAction<TSchemaIn, TSchemaOut, TContext>
{
  id: string;
  description: string;
  inputSchema?: TSchemaIn;
  outputSchema?: TSchemaOut;
  execute?: ToolAction<TSchemaIn, TSchemaOut, TContext>['execute'];
  mastra?: Mastra;

  constructor(opts: ToolAction<TSchemaIn, TSchemaOut, TContext>) {
    this.id = opts.id;
    this.description = opts.description;
    this.inputSchema = opts.inputSchema;
    this.outputSchema = opts.outputSchema;
    this.mastra = opts.mastra;

    // 如果存在则包装execute函数并添加验证
    if (opts.execute) {
      const originalExecute = opts.execute;
      this.execute = async (context: TContext, options?: ToolExecutionOptions) => {
        // 如果存在schema则验证输入
        const { data, error } = validateToolInput(this.inputSchema, context, this.id);
        if (error) {
          return error as any;
        }

        return originalExecute(data as TContext, options);
      };
    }
  }
}

export function createTool<
  TSchemaIn extends z.ZodSchema | undefined = undefined,
  TSchemaOut extends z.ZodSchema | undefined = undefined,
  TContext extends ToolExecutionContext<TSchemaIn> = ToolExecutionContext<TSchemaIn>,
  TExecute extends ToolAction<TSchemaIn, TSchemaOut, TContext>['execute'] = ToolAction<
    TSchemaIn,
    TSchemaOut,
    TContext
  >['execute'],
>(
  opts: ToolAction<TSchemaIn, TSchemaOut, TContext> & {
    execute?: TExecute;
  },
): [TSchemaIn, TSchemaOut, TExecute] extends [z.ZodSchema, z.ZodSchema, Function]
  ? Tool<TSchemaIn, TSchemaOut, TContext> & {
      inputSchema: TSchemaIn;
      outputSchema: TSchemaOut;
      execute: (context: TContext) => Promise<any>;
    }
  : Tool<TSchemaIn, TSchemaOut, TContext> {
  return new Tool(opts) as any;
}
