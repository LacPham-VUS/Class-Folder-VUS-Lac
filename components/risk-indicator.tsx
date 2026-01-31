import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react"
import type { RiskLevel } from "@/lib/types"

interface RiskIndicatorProps {
  level: RiskLevel
  factors?: string[]
  showLabel?: boolean
}

export function RiskIndicator({ level, factors = [], showLabel = true }: RiskIndicatorProps) {
  const config = {
    Green: {
      icon: CheckCircle,
      variant: "default" as const,
      label: "Thriving",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Học sinh đang phát triển tốt",
      criteria: ["Tỷ lệ đi học ≥ 90%", "Không có nhận xét tiêu cực", "Hoàn thành tốt các mục tiêu học tập"],
      iconStyle: "text-emerald-600",
    },
    Yellow: {
      icon: AlertTriangle,
      variant: "secondary" as const,
      label: "Needs Support",
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      description: "Cần hỗ trợ và theo dõi sát hơn",
      criteria: ["Tỷ lệ đi học 75-89%", "Có 1-2 kỹ năng cần cải thiện", "Cần động viên thêm"],
      iconStyle: "text-amber-600",
    },
    Red: {
      icon: AlertCircle,
      variant: "destructive" as const,
      label: "Urgent Care",
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
      description: "Cần can thiệp và hỗ trợ ngay lập tức",
      criteria: ["Tỷ lệ đi học < 75%", "Nhiều kỹ năng chưa đạt yêu cầu", "Có dấu hiệu cần can thiệp sư phạm đặc biệt"],
      iconStyle: "text-red-600",
    },
  }

  const { icon: Icon, label, color, badgeClass, description, criteria, iconStyle } = config[level]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {showLabel ? (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${badgeClass} font-medium text-xs`}
              >
                <Icon className={`h-3.5 w-3.5 ${iconStyle}`} />
                {label}
              </div>
            ) : (
              <Icon className={`h-4 w-4 ${color}`} />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 bg-card border shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <p className="font-semibold text-sm">{label}</p>
            </div>
            <p className="text-sm text-muted-foreground italic">{description}</p>

            <div className="pt-1">
              <p className="text-xs font-medium mb-1.5 text-foreground">Các chỉ số đánh giá:</p>
              <ul className="list-none pl-0 text-xs space-y-1 text-muted-foreground">
                {criteria.map((criterion, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {factors.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs font-medium mb-1.5 text-destructive">Lý do cụ thể:</p>
                <ul className="list-none pl-0 text-xs space-y-1">
                  {factors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-destructive mt-0.5">→</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
