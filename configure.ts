import { stubsRoot } from './stubs/index.js'
import type Configure from '@adonisjs/core/commands/configure'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  // Publish config file
  await codemods.makeUsingStub(stubsRoot, 'config/queue.stub', {})

  // Add environment variables
  await codemods.defineEnvVariables({
    QUEUE_REDIS_HOST: '127.0.0.1',
    QUEUE_REDIS_PORT: '6379',
    QUEUE_REDIS_PASSWORD: '',
    QUEUE_ATTEMPTS: '3',
    QUEUE_REMOVE_ON_COMPLETE: '300',
    QUEUE_REMOVE_ON_FAIL: '300',
  })

  await codemods.defineEnvValidations({
    variables: {
      QUEUE_REDIS_HOST: `Env.schema.string({ format: 'host' })`,
      QUEUE_REDIS_PORT: 'Env.schema.number()',
      QUEUE_REDIS_PASSWORD: 'Env.schema.string.optional()',
      QUEUE_ATTEMPTS: 'Env.schema.number.optional()',
      QUEUE_REMOVE_ON_COMPLETE: 'Env.schema.number.optional()',
      QUEUE_REMOVE_ON_FAIL: 'Env.schema.number.optional()',
    },
    leadingComment: 'Variables for configuring the queue package',
  })

  // Add provider to rc file
  await codemods.updateRcFile((rcFile) => {
    rcFile
      .addProvider('@retronew/adonis-bull-queue/queue_provider')
      .addCommand('@retronew/adonis-bull-queue/commands')
  })
}
