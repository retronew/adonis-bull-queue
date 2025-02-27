import app from '@adonisjs/core/services/app'
import { QueueManager } from '../src/queue.js'

let queue: QueueManager

await app.booted(async () => {
  queue = await app.container.make('bull_queue')
})

export { queue as default }
