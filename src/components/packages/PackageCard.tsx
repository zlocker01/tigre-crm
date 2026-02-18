'use client';

import { useState } from 'react';
import { Edit, Check, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeletePackageButton } from './DeletePackageButton';
import { EditPackageModal } from '@/components/packages/EditPackageModal';
import type { Package } from '@/interfaces/packages/Package';
import { useRouter } from 'next/navigation';

interface PackageCardProps {
  pkg: Package;
  onPackageUpdated?: () => void;
}

export function PackageCard({
  pkg,
  onPackageUpdated = () => {},
}: PackageCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const handlePackageDeleted = (deletedPackageId: number) => {
    router.refresh();
  };

  const normalizeList = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value
        .map((v) => String(v).trim())
        .filter((v) => v.length > 0);
    }
    if (typeof value === 'string') {
      const raw = value.trim();
      try {
        if (
          (raw.startsWith('"') && raw.endsWith('"')) ||
          (raw.startsWith('[') && raw.endsWith(']'))
        ) {
          const parsed = JSON.parse(raw);
          if (typeof parsed === 'string') {
            return [parsed];
          }
          if (Array.isArray(parsed)) {
            return parsed
              .map((v) => String(v).trim())
              .filter((v) => v.length > 0);
          }
        }
      } catch {}
      return raw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return [];
  };

  const benefits = normalizeList(pkg.benefits);
  const restrictions = normalizeList(pkg.restrictions);

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-shadow hover:shadow-lg flex flex-col h-full border-t-4 border-t-primaryColor">
      {pkg.image && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-primaryColor">
            {pkg.name}
          </CardTitle>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold">
            {new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 0,
            }).format(pkg.price)}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              MXN / mes
            </span>
          </span>
        </div>
        <p className="text-sm font-medium text-muted-foreground mt-1">
          {pkg.subtitle}
        </p>
      </CardHeader>

      <CardContent className="flex-grow pt-4">
        <div className="space-y-4">
          {benefits.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Beneficios:
              </p>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {restrictions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-amber-600/80">
                Restricciones:
              </p>
              <ul className="space-y-2">
                {restrictions.map((restriction, index) => (
                  <li
                    key={index}
                    className="text-sm flex items-start gap-2 text-muted-foreground"
                  >
                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <span>{restriction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 mt-auto">
        <Button
          onClick={() => setIsEditModalOpen(true)}
          variant="outline"
          className="flex-1 mr-2"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <DeletePackageButton
          packageId={pkg.id}
          onPackageDeleted={handlePackageDeleted}
        />
      </CardFooter>

      <EditPackageModal
        pkg={pkg}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onPackageUpdated={() => {
          onPackageUpdated();
          setIsEditModalOpen(false);
          router.refresh();
        }}
      />
    </Card>
  );
}
