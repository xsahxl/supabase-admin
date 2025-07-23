import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/ui/status-badge';
import { Company } from '@/lib/types/company';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {company.logo_url && (
              <Image
                src={company.logo_url}
                alt={`${company.name} logo`}
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {company.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                创建于 {formatDate(company.created_at)}
              </CardDescription>
            </div>
          </div>
          <StatusBadge status={company.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {company.description && (
          <p className="text-sm text-gray-700 line-clamp-2">
            {company.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {company.address && (
            <Badge variant="secondary" className="text-xs">
              📍 {company.address}
            </Badge>
          )}
          {company.website && (
            <Badge variant="outline" className="text-xs">
              🌐 官网
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="text-xs text-gray-500">
            状态更新: {formatDate(company.status_updated_at)}
          </div>
          <Link
            href={`/companies/${company.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            查看详情 →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard; 