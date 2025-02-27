import { QueueManager } from '../queue.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    bull_queue: QueueManager
  }
}
