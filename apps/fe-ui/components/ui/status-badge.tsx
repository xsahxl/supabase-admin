import { Badge } from '@/components/ui/badge';
import { CompanyStatus, COMPANY_STATUS_LABELS, COMPANY_STATUS_COLORS } from '@/lib/types/company';

interface StatusBadgeProps {
  status: CompanyStatus;
  className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className={`${COMPANY_STATUS_COLORS[status]} ${className}`}
    >
      {COMPANY_STATUS_LABELS[status]}
    </Badge>
  );
};

export default StatusBadge; 