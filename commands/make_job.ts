/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { BaseCommand, args } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/index.js'

export default class MakeJob extends BaseCommand {
  static commandName = 'make:job'
  static description = 'Make a new dispatch-able job'

  @args.string({ description: 'Name of the job class' })
  name!: string

  static settings = {
    loadApp: true,
    stayAlive: false,
  }

  #stubPath = 'command/main.stub'

  async run() {
    await this.makeUsingStub(
      this.#stubPath,
      {
        entity: this.app.generators.createEntity(this.name),
      },
      stubsRoot
    )
  }
}
