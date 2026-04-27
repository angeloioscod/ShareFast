// src/utils/shareIntent.ts
import * as Linking from 'expo-linking';

type ShareData = {
  tipo: string | null;
  conteudo: string | null;
} | null;

export const capturarShareIntent = async (): Promise<ShareData> => {
  try {
    const url = await Linking.getInitialURL();

    if (!url) return null;

    if (url.includes('sharefast://share')) {
      const parsed = Linking.parse(url);
      return {
        tipo: (parsed.queryParams?.type as string) ?? null,
        conteudo: (parsed.queryParams?.content as string) ?? null,
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao capturar share intent:', error);
    return null;
  }
};