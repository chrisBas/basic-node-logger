import { BasicLogger } from './dist/index.js'

const log = new BasicLogger({ logLevel: 'TRACE', name: '[basic-node-logger]' })
log.trace('trace')
log.debug('debug')
log.info('info')
log.warn('warn')
log.error('error')
log.fatal('fatal error')