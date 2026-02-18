import { createClient } from '@/utils/supabase/server';
import { getUserId } from '@/data/getUserIdServer';

interface CreateGalleryItemInput {
  title?: string;
  description?: string;
  image?: string;
  category?: string;
  landing_page_id?: string;
}

export async function createGalleryItem(
  item: CreateGalleryItemInput,
): Promise<string | undefined> {
  try {
    const supabase = await createClient();
    const userId = await getUserId();

    if (!userId) {
      return undefined;
    }

    const { data, error } = await supabase
      .from('gallery_items')
      .insert([
        {
          title: item.title ?? null,
          description: item.description ?? null,
          image: item.image ?? null,
          category: item.category ?? 'Clases',
          landing_page_id: item.landing_page_id ?? null,
          user_id: userId,
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating gallery item:', error);
      return undefined;
    }

    return data.id;
  } catch (error) {
    console.error('Unexpected error:', error);
    return undefined;
  }
}
