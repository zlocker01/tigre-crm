'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeletePromotionButton } from './DeletePromotionButton';
import { EditPromotionButton } from './EditPromotionButton';
import { EditPromotionModal } from './EditPromotionModal';
import { TogglePromotionButton } from './TogglePromotionButton';
import type { Promotion } from '@/interfaces/promotions/Promotion';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface PromotionCardProps {
  promotion: Promotion;
  onPromotionUpdated?: () => void;
}

export function PromotionCard({
  promotion,
  onPromotionUpdated = () => {},
}: PromotionCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const calculateDiscount = () => {
    return Math.round(
      ((promotion.price - promotion.discount_price) / promotion.price) * 100,
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handlePromotionDeleted = (deletedPromotionId: number) => {
    toast({
      title: 'Promoción eliminada',
      description: 'La promoción ha sido eliminada correctamente.',
      variant: 'success',
    });
    router.refresh();
  };

  return (
    <Card
      className={`w-full overflow-hidden transition-all duration-300 hover:shadow-lg bg-gray-700 text-white ${
        promotion.active === false ? 'opacity-60' : ''
      }`}
    >
      <div className="relative">
        <img
          src={promotion.image || '/placeholder-promotion.jpg'}
          alt={promotion.title}
          className="w-full h-48 object-cover"
        />
        {promotion.discount_price < promotion.price && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            {calculateDiscount()}% OFF
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-white">
            {promotion.title}
          </CardTitle>
          <div className="flex space-x-2">
            <EditPromotionButton
              promotion={promotion}
              onPromotionUpdated={onPromotionUpdated}
            />
            <TogglePromotionButton
              promotionId={promotion.id}
              isActive={promotion.active !== false}
              onPromotionToggled={() => onPromotionUpdated()}
            />
            <DeletePromotionButton
              promotionId={promotion.id}
              onPromotionDeleted={handlePromotionDeleted}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">{promotion.description}</p>
        <div className="flex items-baseline">
          {promotion.discount_price < promotion.price ? (
            <>
              <span className="text-2xl font-bold text-amber-400">
                ${promotion.discount_price.toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-400 line-through">
                ${promotion.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-amber-400">
              ${promotion.price.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="text-sm text-gray-400">
          Válido hasta: {formatDate(promotion.valid_until)}
        </div>
      </CardFooter>
      <EditPromotionModal
        promotion={promotion}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onPromotionUpdated={() => {
          onPromotionUpdated();
          setIsEditModalOpen(false);
        }}
      />
    </Card>
  );
}
