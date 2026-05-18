import type { JointFlag as JointFlagType } from '@/types'

const FLAG_CONFIG: Record<JointFlagType, { label: string; className: string }> = {
  wrist: { label: 'Wrist', className: 'flag-wrist' },
  knee: { label: 'Knee', className: 'flag-knee' },
  hip: { label: 'Hip', className: 'flag-hip' },
  'plantar-fasciitis': { label: 'Foot', className: 'flag-foot' },
}

interface Props {
  flag: JointFlagType
}

export default function JointFlag({ flag }: Props) {
  const config = FLAG_CONFIG[flag]
  return <span className={`joint-flag ${config.className}`}>{config.label}</span>
}
